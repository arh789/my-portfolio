#!/usr/bin/env python3
"""Build the compact JSON dataset used by the Dan John portfolio dashboard."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import random
from collections import Counter, defaultdict
from pathlib import Path


ANALYSIS_GROUP_SIZE = 115
COMMUNITY_MIN_PAIR_FREQUENCY = 2
MAX_DISPLAY_COMMUNITIES = 12


def normalise(value: object) -> str:
    return " ".join(str(value or "").strip().lower().split())


def stable_seed(value: str) -> int:
    return int(hashlib.sha256(value.encode("utf-8")).hexdigest()[:16], 16)


def read_frequencies(path: Path) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            rows.append(
                {
                    "rank": int(row["rank"]),
                    "object": normalise(row["object"]),
                    "frequency": int(row["frequency"]),
                }
            )
    rows.sort(key=lambda item: int(item["rank"]))
    return rows


def greedy_modularity_communities(
    weighted_edges: list[tuple[str, str, float]],
) -> list[set[str]]:
    """Return deterministic weighted communities without a runtime dependency."""
    nodes = sorted({node for edge in weighted_edges for node in edge[:2]})
    if not nodes:
        return []

    community_for = {node: index for index, node in enumerate(nodes)}
    members = {index: {node} for index, node in enumerate(nodes)}
    weighted_degree: dict[str, float] = defaultdict(float)
    between: dict[tuple[int, int], float] = defaultdict(float)

    for left, right, weight in weighted_edges:
        weighted_degree[left] += weight
        weighted_degree[right] += weight
        pair = tuple(sorted((community_for[left], community_for[right])))
        between[pair] += weight

    degree_total = {
        community_for[node]: weighted_degree[node]
        for node in nodes
    }
    total_weight = sum(weight for _, _, weight in weighted_edges)
    if total_weight <= 0:
        return [{node} for node in nodes]

    while True:
        best_pair: tuple[int, int] | None = None
        best_gain = 1e-12
        denominator = 2 * total_weight * total_weight

        for pair, between_weight in sorted(between.items()):
            left, right = pair
            gain = (
                between_weight / total_weight
                - (degree_total[left] * degree_total[right]) / denominator
            )
            if gain > best_gain + 1e-12:
                best_gain = gain
                best_pair = pair

        if best_pair is None:
            break

        keep, drop = best_pair
        members[keep].update(members.pop(drop))
        degree_total[keep] += degree_total.pop(drop)

        merged_between: dict[tuple[int, int], float] = defaultdict(float)
        for (left, right), weight in between.items():
            left = keep if left == drop else left
            right = keep if right == drop else right
            if left == right:
                continue
            merged_between[tuple(sorted((left, right)))] += weight
        between = merged_between

    return list(members.values())


def build_communities(
    network_node_ids: set[str],
    pair_frequency: Counter[tuple[str, str]],
    pair_videos: dict[tuple[str, str], set[str]],
    frequency_by_object: dict[str, int],
) -> tuple[
    list[dict[str, object]],
    dict[str, int],
    dict[tuple[str, str], tuple[float, float]],
    set[str],
]:
    edge_metrics: dict[tuple[str, str], tuple[float, float]] = {}
    community_edges: list[tuple[str, str, float]] = []

    for pair, count in pair_frequency.items():
        left, right = pair
        if left not in network_node_ids or right not in network_node_ids:
            continue
        video_count = len(pair_videos[pair])
        denominator = math.sqrt(
            max(1, frequency_by_object.get(left, 1))
            * max(1, frequency_by_object.get(right, 1))
        )
        association = video_count / denominator
        signal = association * math.log2(count + 1)
        edge_metrics[pair] = (association, signal)
        if count >= COMMUNITY_MIN_PAIR_FREQUENCY:
            community_edges.append((left, right, signal))

    detected = greedy_modularity_communities(community_edges)
    internal_weight: dict[int, float] = defaultdict(float)
    detected_for_node = {
        node: index
        for index, community in enumerate(detected)
        for node in community
    }
    for left, right, signal in community_edges:
        left_community = detected_for_node[left]
        if left_community == detected_for_node[right]:
            internal_weight[left_community] += signal

    ranked = sorted(
        enumerate(detected),
        key=lambda item: (
            -len(item[1]),
            -internal_weight[item[0]],
            min(item[1]),
        ),
    )
    retained = [item for item in ranked if len(item[1]) >= 3][
        :MAX_DISPLAY_COMMUNITIES
    ]
    community_by_node: dict[str, int] = {}
    community_rows: list[dict[str, object]] = []

    for display_id, (_, community) in enumerate(retained, start=1):
        for node in community:
            community_by_node[node] = display_id

        degree: dict[str, float] = defaultdict(float)
        edge_count = 0
        relation_frequency = 0
        for pair, count in pair_frequency.items():
            left, right = pair
            if left not in community or right not in community:
                continue
            edge_count += 1
            relation_frequency += count
            signal = edge_metrics[pair][1]
            degree[left] += signal
            degree[right] += signal

        top_objects = sorted(
            community,
            key=lambda node: (
                -degree[node],
                -frequency_by_object.get(node, 0),
                node,
            ),
        )[:6]
        community_rows.append(
            {
                "id": display_id,
                "label": " · ".join(top_objects[:3]),
                "size": len(community),
                "edgeCount": edge_count,
                "relationFrequency": relation_frequency,
                "topObjects": top_objects,
            }
        )

    bridge_score: dict[str, float] = defaultdict(float)
    bridge_targets: dict[str, set[int]] = defaultdict(set)
    for left, right, signal in community_edges:
        left_community = community_by_node.get(left, 0)
        right_community = community_by_node.get(right, 0)
        if not left_community or not right_community or left_community == right_community:
            continue
        bridge_score[left] += signal
        bridge_score[right] += signal
        bridge_targets[left].add(right_community)
        bridge_targets[right].add(left_community)

    bridge_nodes = {
        node
        for node, _ in sorted(
            bridge_score.items(),
            key=lambda item: (-len(bridge_targets[item[0]]), -item[1], item[0]),
        )[:24]
    }
    return community_rows, community_by_node, edge_metrics, bridge_nodes


def graph_positions(
    analysis_group: set[str],
    first_order: set[str],
    second_order: set[str],
    adjacency: dict[str, set[str]],
    frequencies: dict[str, int],
) -> dict[str, tuple[float, float]]:
    analysis_nodes = sorted(
        analysis_group, key=lambda node: (-frequencies.get(node, 0), node)
    )
    angles = {
        node: 2 * math.pi * index / len(analysis_nodes)
        for index, node in enumerate(analysis_nodes)
    }
    positions = {
        node: (2 * math.cos(angles[node]), 2 * math.sin(angles[node]))
        for node in analysis_nodes
    }

    first_anchor = {
        node: max(
            adjacency[node] & analysis_group,
            key=lambda neighbour: (frequencies.get(neighbour, 0), neighbour),
        )
        for node in first_order
    }

    second_anchor: dict[str, str] = {}
    for node in second_order:
        parents = adjacency[node] & first_order
        if not parents:
            continue
        parent = max(
            parents,
            key=lambda neighbour: (frequencies.get(neighbour, 0), neighbour),
        )
        second_anchor[node] = first_anchor[parent]

    sector_width = 2 * math.pi / len(analysis_nodes)
    for nodes, anchors, inner_radius, outer_radius in (
        (sorted(first_order), first_anchor, 3.5, 7.0),
        (sorted(second_anchor), second_anchor, 7.5, 13.0),
    ):
        for node in nodes:
            rng = random.Random(stable_seed(node))
            angle = angles[anchors[node]] + rng.uniform(-0.45, 0.45) * sector_width
            radius = rng.uniform(inner_radius, outer_radius)
            positions[node] = (radius * math.cos(angle), radius * math.sin(angle))

    return positions


def build(dataset_root: Path) -> dict[str, object]:
    frequency_rows = read_frequencies(dataset_root / "object_frequencies.csv")
    frequency_by_object = {
        str(row["object"]): int(row["frequency"]) for row in frequency_rows
    }
    rank_by_object = {str(row["object"]): int(row["rank"]) for row in frequency_rows}
    analysis_group = {
        str(row["object"]) for row in frequency_rows[:ANALYSIS_GROUP_SIZE]
    }

    pair_frequency: Counter[tuple[str, str]] = Counter()
    pair_videos: dict[tuple[str, str], set[str]] = defaultdict(set)
    triple_frequency: Counter[tuple[str, str, str]] = Counter()
    triple_videos: dict[tuple[str, str, str], set[str]] = defaultdict(set)
    adjacency: dict[str, set[str]] = defaultdict(set)
    videos: dict[str, dict[str, str]] = {}

    records_dir = dataset_root / "v1_1_objects_relations" / "records"
    for record_path in sorted(records_dir.glob("*.json")):
        record = json.loads(record_path.read_text(encoding="utf-8-sig"))
        video_id = str(record.get("video_id") or record_path.stem)
        videos[video_id] = {
            "id": video_id,
            "title": str(record.get("official_title") or "Untitled video"),
            "url": str(
                record.get("url")
                or f"https://www.youtube.com/watch?v={video_id}"
            ),
        }
        labels = {
            str(item.get("id")): normalise(item.get("label"))
            for item in record.get("objects", [])
            if normalise(item.get("label"))
        }
        for relation in record.get("relations", []):
            subject = labels.get(str(relation.get("subject")))
            object_ = labels.get(str(relation.get("object")))
            if not subject or not object_ or subject == object_:
                continue
            relation_text = " ".join(
                str(relation.get("relation") or "unspecified").strip().split()
            )
            pair = tuple(sorted((subject, object_)))
            triple = (subject, relation_text, object_)
            pair_frequency[pair] += 1
            pair_videos[pair].add(video_id)
            triple_frequency[triple] += 1
            triple_videos[triple].add(video_id)
            adjacency[subject].add(object_)
            adjacency[object_].add(subject)

    first_order = set().union(*(adjacency[node] for node in analysis_group))
    first_order -= analysis_group
    second_order = set().union(*(adjacency[node] for node in first_order))
    second_order -= analysis_group | first_order
    network_nodes = analysis_group | first_order | second_order

    positions = graph_positions(
        analysis_group, first_order, second_order, adjacency, frequency_by_object
    )

    positioned_node_ids = set(positions)
    communities, community_by_node, edge_metrics, bridge_nodes = build_communities(
        positioned_node_ids,
        pair_frequency,
        pair_videos,
        frequency_by_object,
    )
    community_label_by_id = {
        int(community["id"]): str(community["label"])
        for community in communities
    }

    nodes = []
    for node in sorted(network_nodes):
        if node not in positions:
            continue
        if node in analysis_group:
            group = "Analysis group"
        elif node in first_order:
            group = "First order"
        else:
            group = "Second order"
        community = community_by_node.get(node, 0)
        x, y = positions[node]
        nodes.append(
            {
                "id": node,
                "rank": rank_by_object.get(node),
                "frequency": frequency_by_object.get(node, 0),
                "group": group,
                "community": community,
                "communityLabel": community_label_by_id.get(
                    community, "Peripheral pattern"
                ),
                "bridge": node in bridge_nodes,
                "x": round(x * 100, 4),
                "y": round(y * 100, 4),
            }
        )

    network_node_ids = {str(node["id"]) for node in nodes}
    edges = []
    for (left, right), count in sorted(
        pair_frequency.items(), key=lambda item: (-item[1], item[0])
    ):
        if left not in network_node_ids or right not in network_node_ids:
            continue
        association, signal = edge_metrics[(left, right)]
        left_community = community_by_node.get(left, 0)
        right_community = community_by_node.get(right, 0)
        edges.append(
            {
                "source": left,
                "target": right,
                "frequency": count,
                "videoCount": len(pair_videos[(left, right)]),
                "association": round(association, 6),
                "signal": round(signal, 6),
                "bridge": bool(
                    left_community
                    and right_community
                    and left_community != right_community
                ),
            }
        )
    network_pairs = {
        tuple(sorted((str(edge["source"]), str(edge["target"])))) for edge in edges
    }

    relations = []
    for triple, count in sorted(
        triple_frequency.items(), key=lambda item: (-item[1], item[0])
    ):
        subject, relation, object_ = triple
        if tuple(sorted((subject, object_))) not in network_pairs:
            continue
        supporting_videos = sorted(triple_videos[triple])
        relations.append(
            {
                "subject": subject,
                "relation": relation,
                "object": object_,
                "frequency": count,
                "supportingVideos": supporting_videos,
            }
        )

    return {
        "meta": {
            "videos": len(videos),
            "objectOccurrences": sum(
                int(row["frequency"]) for row in frequency_rows
            ),
            "uniqueObjects": len(frequency_rows),
            "analysisGroup": len(analysis_group),
            "analysisCutoffRank": ANALYSIS_GROUP_SIZE,
            "analysisCutoffFrequency": int(
                frequency_rows[ANALYSIS_GROUP_SIZE - 1]["frequency"]
            ),
            "firstOrder": len(first_order),
            "secondOrder": len(second_order),
            "networkObjects": len(network_node_ids),
            "networkPairs": len(edges),
            "relationStatements": len(relations),
            "communityMinPairFrequency": COMMUNITY_MIN_PAIR_FREQUENCY,
            "displayCommunities": len(communities),
            "communityObjects": sum(
                int(community["size"]) for community in communities
            ),
        },
        "frequencies": frequency_rows,
        "nodes": nodes,
        "edges": edges,
        "communities": communities,
        "relations": relations,
        "videos": list(videos.values()),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-root", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    payload = build(args.dataset_root.resolve())
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )
    print(json.dumps(payload["meta"], indent=2))
    print(f"Wrote {args.output} ({args.output.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
