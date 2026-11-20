"""Build the article's graph data from the frozen R020 measurement."""

import argparse
import csv
import gzip
import hashlib
import json
import math
import struct
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from itertools import groupby
from pathlib import Path


RUN = "R020_pythia-70m-representation-output-contrast"
SECTORS = {"positive_head": "p", "negative_tail": "n"}
MEASUREMENT_FILES = (
    "run_config.json", "measurement_results.json", "generation_trace.csv",
    "network_index.csv", "community_nodes.csv", "community_edges.csv",
    "community_transition_evidence.csv", "nodes.csv.gz", "edges.csv.gz",
)
OUTPUT = Path(__file__).resolve().parents[1] / "public" / "llm-topology-r020"
HEADER = struct.Struct("<4sBBBBH")
TOKEN = struct.Struct("<HHHf")
NEIGHBOUR = struct.Struct("<Hf")


def require(condition, message):
    if not condition:
        raise ValueError(message)


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def json_bytes(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode()


def write_asset(path, payload):
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_bytes(payload)
    temporary.replace(path)
    return {"bytes": len(payload), "sha256": hashlib.sha256(payload).hexdigest()}


def file_digest(path, algorithm="sha256", prefix=b""):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, lambda: hashlib.new(algorithm, prefix)).hexdigest()


def csv_rows(path):
    with path.open(encoding="utf-8", newline="") as stream:
        reader = csv.DictReader(stream)
        start_line = 2
        for row in reader:
            yield start_line, row
            start_line = reader.line_num + 1


def key_for(decision, state, side):
    return f"D{decision:02d}-S{state:02d}-{SECTORS[side]}"


def network_key(row):
    return key_for(int(row["decision_index"]) + 1, int(row["state_index"]), row["side"])


def verify_measurement(run):
    manifest = read_json(run / "manifest.json")
    require(manifest["run_id"] == RUN and manifest["measurement_status"] == "measurement_successful",
            "Expected the frozen, successful R020 measurement")
    index_path = run / "artifact_index.json"
    require(file_digest(index_path) == manifest["artifact_index"]["sha256"], "Artefact index hash mismatch")
    artefacts = read_json(index_path)["artifacts"]
    hashes = {}
    for name in MEASUREMENT_FILES:
        actual = file_digest(run / name)
        require(actual == artefacts[name]["sha256"], f"Source hash mismatch: {name}")
        hashes[name] = actual
    return hashes


def load_communities(run):
    graphs = {}
    for line, row in csv_rows(run / "network_index.csv"):
        key = network_key(row)
        require(key not in graphs, f"Repeated measured network: {key}")
        graphs[key] = {
            "key": key, "state": int(row["state_index"]), "sector": row["side"],
            "stateLabel": row["state_label"], "decision": int(row["decision_index"]) + 1,
            "population": int(row["population_size"]),
            "directedEdges": int(row["directed_edge_count"]),
            "undirectedEdges": int(row["undirected_edge_count"]),
            "communityCount": int(row["community_count"]), "sourceLine": line,
            "nodes": {}, "edges": [], "matches": {},
        }

    for line, row in csv_rows(run / "community_nodes.csv"):
        graph = graphs[network_key(row)]
        cid = int(row["community_id"])
        require(cid not in graph["nodes"], f"{graph['key']}: repeated C{cid}")
        graph["nodes"][cid] = {
            "id": cid, "size": int(row["community_size"]), "sourceLine": line,
            "meanTargetCosine": float(row["mean_target_cosine"]),
            "internalEdges": int(row["internal_edge_count"]),
            "boundaryEdges": int(row["boundary_edge_count"]),
            "representativeIds": list(map(int, row["representative_token_ids"].split())),
            "extremeIds": list(map(int, row["most_extreme_token_ids"].split())),
            "weightedDegree": 0.0,
        }
    for line, row in csv_rows(run / "community_edges.csv"):
        graph = graphs[network_key(row)]
        a, b = int(row["community_a"]), int(row["community_b"])
        count = int(row["token_edge_count"])
        affinity = count / math.sqrt(graph["nodes"][a]["size"] * graph["nodes"][b]["size"])
        graph["nodes"][a]["weightedDegree"] += affinity
        graph["nodes"][b]["weightedDegree"] += affinity
        graph["edges"].append({
            "a": a, "b": b, "count": count, "affinity": affinity,
            "meanCosine": float(row["mean_cosine_similarity"]),
            "maxCosine": float(row["maximum_cosine_similarity"]), "sourceLine": line,
        })
    return graphs


def load_modules(run, graphs):
    ledger = read_json(run / "analysis/R020_VERIFIED_DELIVERY_MANIFEST.json")
    expected = {entry["path"]: entry["git_blob_sha"] for entry in ledger["pinned_artifacts"]}
    hashes = {}
    seen = set()
    for lower in range(1, 33, 8):
        name = f"R020_RELATIONAL_MAP_D{lower:02d}-{lower + 7:02d}.json"
        path = run / "analysis" / name
        blob = file_digest(path, "sha1", f"blob {path.stat().st_size}\0".encode())
        require(blob == expected[name], f"Structural module source hash mismatch: {name}")
        hashes[f"analysis/{name}"] = file_digest(path)
        for recorded in read_json(path)["graphs"]:
            key = network_key(recorded)
            graph = graphs[key]
            partition = {}
            require(key not in seen and recorded["state_label"] == graph["stateLabel"]
                    and recorded["intercommunity_edges_count"] == len(graph["edges"]),
                    f"{key}: structural module source coverage differs")
            for module in recorded["modules"]:
                for cid in module["community_ids"]:
                    require(cid not in partition, f"{key}: repeated community in the module partition")
                    partition[cid] = module["module_id"]
            require(partition.keys() == graph["nodes"].keys(), f"{key}: incomplete module partition")
            for cid, module_id in partition.items():
                graph["nodes"][cid]["module"] = module_id
            seen.add(key)
    require(seen == graphs.keys(), "Missing structural modules for a measured network")
    return ledger["source_measurement_commit"], hashes


def raw_networks(stream, columns):
    reader = csv.reader(stream)
    expected = ["prompt_id", "decision_index", "generated_token_index", "state_index", "state_label", "side"]
    require(next(reader) == expected + columns.split(), "Unexpected raw graph CSV columns")
    return groupby(reader, key=lambda row: (row[1], row[3], row[5]))


def pack_tokens(graph, node_rows, edge_rows, k, vocabulary):
    key = graph["key"]
    stride = TOKEN.size + k * NEIGHBOUR.size
    payload = bytearray(HEADER.size + graph["population"] * stride)
    HEADER.pack_into(payload, 0, b"R020", graph["decision"], graph["state"],
                     int(graph["sector"] == "negative_tail"), k, graph["population"])
    positions = {}
    communities = {}
    members = {cid: set() for cid in graph["nodes"]}
    ranks = set()
    for index, row in enumerate(node_rows):
        token, cid, rank = int(row[6]), int(row[13]), int(row[12])
        require(token not in positions and cid in members and rank not in ranks
                and int(row[14]) == graph["nodes"][cid]["size"], f"{key}: invalid token membership")
        ranks.add(rank)
        offset = HEADER.size + index * stride
        score = float(row[11])
        require(math.isfinite(score), f"{key}: invalid target cosine for token {token}")
        TOKEN.pack_into(payload, offset, token, cid, rank, score)
        positions[token] = offset + TOKEN.size
        communities[token] = cid
        members[cid].add(token)
        require(vocabulary.setdefault(token, row[9]) == row[9], f"Token {token}: display value changed")
    require(ranks == set(range(1, graph["population"] + 1)), f"{key}: invalid population or ranks")
    for cid, node in graph["nodes"].items():
        representative = node.pop("representativeIds")
        extreme = node.pop("extremeIds")
        require(len(members[cid]) == node["size"] and set(representative + extreme) <= members[cid],
                f"{key}: wrong membership or exemplars for C{cid}")
        node["representatives"] = [[tid, vocabulary[tid]] for tid in representative]
        node["extremes"] = [[tid, vocabulary[tid]] for tid in extreme]

    undirected = {}
    rank_masks = dict.fromkeys(communities, 0)
    targets = defaultdict(set)
    edge_count = 0
    for row in edge_rows:
        source, target, rank = int(row[6]), int(row[7]), int(row[8])
        score = float(row[9])
        if (source == target or source not in positions or target not in positions
                or not 1 <= rank <= k or target in targets[source] or not math.isfinite(score)):
            raise ValueError(f"{key}: invalid directed edge {source} to {target}, rank {rank}")
        mask = 1 << (rank - 1)
        require(not rank_masks[source] & mask, "Repeated neighbour rank")
        rank_masks[source] |= mask
        targets[source].add(target)
        NEIGHBOUR.pack_into(payload, positions[source] + (rank - 1) * NEIGHBOUR.size, target, score)
        pair = (source, target) if source < target else (target, source)
        undirected[pair] = max(score, undirected.get(pair, -math.inf))
        edge_count += 1
    require(edge_count == graph["directedEdges"] and set(rank_masks.values()) == {(1 << k) - 1}
            and len(undirected) == graph["undirectedEdges"], f"{key}: token edge count mismatch")

    internal = Counter()
    boundary = Counter()
    cross = defaultdict(list)
    for (a, b), score in undirected.items():
        ca, cb = communities[a], communities[b]
        if ca == cb:
            internal[ca] += 1
        else:
            boundary[ca] += 1
            boundary[cb] += 1
            cross[tuple(sorted((ca, cb)))].append(score)
    require(set(cross) == {(e["a"], e["b"]) for e in graph["edges"]}
            and len(cross) == len(graph["edges"]), f"{key}: intercommunity pairs differ from source")
    for node in graph["nodes"].values():
        cid = node["id"]
        require(internal[cid] == node["internalEdges"] and boundary[cid] == node["boundaryEdges"],
                f"{key}: internal or boundary count mismatch for C{cid}")
    for edge in graph["edges"]:
        scores = cross[edge["a"], edge["b"]]
        require(len(scores) == edge["count"]
                and math.isclose(sum(scores) / len(scores), edge["meanCosine"], abs_tol=1e-7)
                and math.isclose(max(scores), edge["maxCosine"], abs_tol=1e-7),
                f"{key}: C{edge['a']}–C{edge['b']} disagrees with raw token edges")
    return payload, members


def export_tokens(run, graphs, k, files):
    vocabulary = {}
    memberships = {}
    with gzip.open(run / "nodes.csv.gz", "rt", encoding="utf-8", newline="") as nodes, \
            gzip.open(run / "edges.csv.gz", "rt", encoding="utf-8", newline="") as edges:
        node_groups = raw_networks(nodes, "token_id raw_token decoded_token display_token token_class "
                                   "cosine_score rank_from_extreme community_id community_size undirected_degree")
        edge_groups = raw_networks(edges, "source_token_id target_token_id neighbor_rank cosine_similarity reciprocal")
        for index, ((node_key, node_rows), (edge_key, edge_rows)) in enumerate(zip(node_groups, edge_groups, strict=True), 1):
            require(node_key == edge_key, "Raw node and edge networks are out of sync")
            decision, state, side = node_key
            key = key_for(int(decision) + 1, int(state), side)
            require(key not in memberships, f"{key}: repeated raw network")
            payload, memberships[key] = pack_tokens(graphs[key], node_rows, edge_rows, k, vocabulary)
            filename = f"{key}.bin.gz"
            files[filename] = write_asset(OUTPUT / filename, gzip.compress(payload, compresslevel=5, mtime=0))
            if index % 64 == 0:
                print(f"Reconciled {index}/{len(graphs)} token networks", flush=True)
    require(memberships.keys() == graphs.keys(), "Raw token network coverage is incomplete")
    files["tokens.json"] = write_asset(OUTPUT / "tokens.json", json_bytes(vocabulary))
    return memberships


def load_correspondences(run, graphs, memberships):
    count = 0
    for line, row in csv_rows(run / "community_transition_evidence.csv"):
        ds, dt = int(row["source_decision_index"]) + 1, int(row["target_decision_index"]) + 1
        ss, st = int(row["source_state_index"]), int(row["target_state_index"])
        layer = row["comparison_type"] == "adjacent_transformer_state"
        require((layer and ds == dt and st == ss + 1) or (
            row["comparison_type"] == "adjacent_generation_decision" and dt == ds + 1 and ss == st
        ), f"Unexpected transition at source line {line}")
        side = row["side"]
        source, target = key_for(ds, ss, side), key_for(dt, st, side)
        source_id = int(row["source_community_id"])
        source_members = memberships[source][source_id]
        target_id = int(float(row["best_target_community_id"])) if row["best_target_community_id"] else None
        shared = int(row["shared_token_count"])
        jaccard = float(row["community_jaccard"]) if row["community_jaccard"] else None
        require(len(source_members) == int(row["source_community_size"]), f"Source size mismatch on line {line}")
        if target_id is not None:
            target_members = memberships[target][target_id]
            overlap = len(source_members & target_members)
            union = len(source_members) + len(target_members) - overlap
            require(shared == overlap and len(target_members) == int(float(row["best_target_community_size"]))
                    and math.isclose(jaccard, shared / union)
                    and math.isclose(float(row["source_retained_fraction"]), shared / len(source_members)),
                    f"Token overlap does not reconcile at transition line {line}")
        else:
            require(shared == 0 and jaccard is None, f"Unexpected empty transition on line {line}")
        matches = graphs[source]["matches"].setdefault(source_id, [])
        require(not any(match["key"] == target for match in matches), f"Duplicate transition on line {line}")
        matches.append({
            "key": target, "decision": dt, "state": st, "kind": "state" if layer else "decision",
            "targetId": target_id, "shared": shared, "jaccard": jaccard, "sourceLine": line,
        })
        count += 1
    for graph in graphs.values():
        expected = int(graph["decision"] < 32) + int(graph["state"] < 7)
        require(all(len(graph["matches"].get(cid, [])) == expected for cid in graph["nodes"]),
                f"{graph['key']}: incomplete transition evidence")
    return count


def build(run, manifest):
    sources = verify_measurement(run)
    config = read_json(run / "run_config.json")
    measured = read_json(run / "measurement_results.json")
    k = config["topology"]["k_neighbors"]
    require(k == 10 and config["topology"]["sectors"] == list(SECTORS), "Unexpected neighbourhood definition")
    graphs = load_communities(run)
    require(set(graphs) == {key_for(d, s, side) for d in range(1, 33) for s in range(8) for side in SECTORS}
            and len(graphs) == measured["network_count"], "Missing or extra decision/state/sector networks")
    totals = {
        "networks": len(graphs),
        "communities": sum(len(g["nodes"]) for g in graphs.values()),
        "communityEdges": sum(len(g["edges"]) for g in graphs.values()),
        "tokenMemberships": sum(g["population"] for g in graphs.values()),
        "directedTokenEdges": sum(g["directedEdges"] for g in graphs.values()),
    }
    require(all(len(g["nodes"]) == g["communityCount"] for g in graphs.values())
            and totals["communities"] == measured["state_local_community_count"]
            and totals["communityEdges"] == 42_291
            and totals["tokenMemberships"] == measured["selected_membership_rows"]
            and totals["directedTokenEdges"] == measured["directed_edge_rows"], "R020 coverage mismatch")
    source_commit, module_hashes = load_modules(run, graphs)
    print(f"Indexed {totals['networks']} networks and {totals['communityEdges']:,} community connections", flush=True)
    files = {}
    memberships = export_tokens(run, graphs, k, files)
    totals["overlapRecords"] = load_correspondences(run, graphs, memberships)
    decisions = [{
        "id": int(row["generated_token_index"]),
        "input": row["decision_decoded_token"], "prediction": row["selected_decoded_token"],
        "sourceLine": line,
    } for line, row in csv_rows(run / "generation_trace.csv")]
    require([d["id"] for d in decisions] == list(range(1, 33)), "Generation trace has missing decisions")
    for decision in decisions:
        number = decision["id"]
        cells = {key: graph for key, graph in graphs.items() if graph["decision"] == number}
        for graph in cells.values():
            graph["nodes"] = list(graph["nodes"].values())
        name = f"D{number:02d}.json"
        files[name] = write_asset(OUTPUT / name, json_bytes(cells))
    manifest.update({
        "sourceCommit": source_commit, "sourceSha256": sources | module_hashes,
        "decisions": decisions, "counts": totals,
        "states": [graphs[key_for(1, s, "positive_head")]["stateLabel"] for s in range(8)],
        "k": k, "assets": files,
        "validation": {
            "sourceHashes": "passed", "networkCoverage": "passed", "tokenMembership": "passed",
            "intercommunityEdgeReconciliation": "passed", "transitionTokenOverlap": "passed",
        },
    })


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("r020_run_directory", type=Path)
    args = parser.parse_args()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    index = OUTPUT / "index.json"
    manifest = {"formatVersion": 1, "run": RUN, "status": "running",
                "startedAt": datetime.now(timezone.utc).isoformat()}
    write_asset(index, json_bytes(manifest))
    try:
        build(args.r020_run_directory, manifest)
    except Exception as error:
        manifest.update(status="failed", error=str(error), completedAt=datetime.now(timezone.utc).isoformat())
        write_asset(index, json_bytes(manifest))
        print(f"R020 graph export failed: {error}", file=sys.stderr)
        return 1
    manifest.update(status="successful", completedAt=datetime.now(timezone.utc).isoformat())
    write_asset(index, json_bytes(manifest))
    print(json.dumps(manifest["counts"], indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
