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

EXERCISES = {
    "back squat",
    "bear-hug carry",
    "bench press",
    "bodyweight bench press",
    "bodyweight clean and press",
    "bulgarian goat-bag swing",
    "clean and jerk",
    "clean and press",
    "dead hang",
    "deadlift",
    "double-bodyweight deadlift",
    "double-kettlebell clean",
    "double-kettlebell front squat",
    "double-kettlebell press",
    "farmer walk",
    "front squat",
    "glute bridge",
    "goblet squat",
    "half-kneeling press",
    "high-repetition back squat",
    "high-repetition press",
    "high-repetition squat",
    "hip thrust",
    "humane burpee",
    "kettlebell clean and press",
    "kettlebell snatch",
    "kettlebell swing",
    "military press",
    "moving plank",
    "naked get-up",
    "neck nod",
    "overhead press",
    "overhead squat",
    "post-workout walk",
    "power clean",
    "pull-up",
    "push press",
    "push-up",
    "sandbag carry",
    "six-point rock",
    "strict press",
    "suitcase carry",
    "swimming",
    "t-y-i drill",
    "turkish get-up",
    "waiter walk",
    "walking",
    "whip snatch",
}


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
        x, y = positions[node]
        nodes.append(
            {
                "id": node,
                "rank": rank_by_object.get(node),
                "frequency": frequency_by_object.get(node, 0),
                "group": group,
                "exercise": node in EXERCISES,
                "x": round(x * 100, 4),
                "y": round(y * 100, 4),
            }
        )

    network_node_ids = {str(node["id"]) for node in nodes}
    edges = [
        {"source": left, "target": right, "frequency": count}
        for (left, right), count in sorted(
            pair_frequency.items(), key=lambda item: (-item[1], item[0])
        )
        if left in network_node_ids and right in network_node_ids
    ]
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
        },
        "frequencies": frequency_rows,
        "nodes": nodes,
        "edges": edges,
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
