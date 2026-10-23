"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

const TIER_COLOURS = {
    "Analysis group": "#f5e36d",
    "First order": "#5fb8ae",
    "Second order": "#59636d",
};

let fcoseRegistered = false;

function normalise(value) {
    return value.trim().toLowerCase();
}

function matchQuality(label, query) {
    if (!query) return 4;
    if (label === query) return 0;
    if (label.startsWith(query)) return 1;
    if (label.split(/[\s-]+/).some((part) => part.startsWith(query))) return 2;
    return 3;
}

function pairKey(left, right) {
    return left < right ? `${left}\u241f${right}` : `${right}\u241f${left}`;
}

function edgeSignal(edge) {
    return edge.signal || edge.association || 0;
}

function FrequencyChart({ frequencies, onSelect }) {
    const canvasRef = useRef(null);
    const [limit, setLimit] = useState(2533);
    const [useLogScale, setUseLogScale] = useState(true);
    const [hovered, setHovered] = useState(null);
    const visibleRows = useMemo(
        () => frequencies.slice(0, Math.min(limit, frequencies.length)),
        [frequencies, limit],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !visibleRows.length) return undefined;

        const draw = () => {
            const bounds = canvas.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;
            const width = Math.max(320, bounds.width);
            const height = Math.max(260, bounds.height);
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            const context = canvas.getContext("2d");
            context.scale(ratio, ratio);

            const padding = { top: 24, right: 20, bottom: 44, left: 54 };
            const plotWidth = width - padding.left - padding.right;
            const plotHeight = height - padding.top - padding.bottom;
            const maxFrequency = visibleRows[0].frequency;
            const maxY = useLogScale ? Math.log1p(maxFrequency) : maxFrequency;
            const lastRank = visibleRows[visibleRows.length - 1].rank;

            const xFor = (rank) =>
                padding.left + ((rank - 1) / Math.max(1, lastRank - 1)) * plotWidth;
            const yFor = (frequency) => {
                const value = useLogScale ? Math.log1p(frequency) : frequency;
                return padding.top + plotHeight - (value / maxY) * plotHeight;
            };

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#080a0c";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "rgba(255,255,255,0.1)";
            context.lineWidth = 1;
            for (let grid = 0; grid <= 4; grid += 1) {
                const y = padding.top + (plotHeight * grid) / 4;
                context.beginPath();
                context.moveTo(padding.left, y);
                context.lineTo(width - padding.right, y);
                context.stroke();
            }

            context.beginPath();
            visibleRows.forEach((row, index) => {
                const x = xFor(row.rank);
                const y = yFor(row.frequency);
                if (index === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            });
            context.lineTo(xFor(lastRank), padding.top + plotHeight);
            context.lineTo(xFor(1), padding.top + plotHeight);
            context.closePath();
            const fill = context.createLinearGradient(0, padding.top, 0, height);
            fill.addColorStop(0, "rgba(245,227,109,0.48)");
            fill.addColorStop(1, "rgba(245,227,109,0.02)");
            context.fillStyle = fill;
            context.fill();

            context.beginPath();
            visibleRows.forEach((row, index) => {
                const x = xFor(row.rank);
                const y = yFor(row.frequency);
                if (index === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            });
            context.strokeStyle = "#f5e36d";
            context.lineWidth = 1.6;
            context.stroke();

            if (lastRank >= 115) {
                const cutoffX = xFor(115);
                context.save();
                context.setLineDash([5, 5]);
                context.strokeStyle = "#ff5a70";
                context.beginPath();
                context.moveTo(cutoffX, padding.top);
                context.lineTo(cutoffX, padding.top + plotHeight);
                context.stroke();
                context.restore();
                context.fillStyle = "#ff8393";
                context.font = "12px Arial";
                context.fillText("rank 115 / frequency 15", cutoffX + 7, padding.top + 14);
            }

            context.fillStyle = "rgba(255,255,255,0.65)";
            context.font = "12px Arial";
            context.textAlign = "left";
            context.fillText("1", padding.left, height - 18);
            context.textAlign = "right";
            context.fillText(lastRank.toLocaleString(), width - padding.right, height - 18);
            context.save();
            context.translate(15, padding.top + plotHeight / 2);
            context.rotate(-Math.PI / 2);
            context.textAlign = "center";
            context.fillText(useLogScale ? "Frequency (log scale)" : "Frequency", 0, 0);
            context.restore();

            if (hovered && hovered.rank <= lastRank) {
                const x = xFor(hovered.rank);
                const y = yFor(hovered.frequency);
                context.beginPath();
                context.arc(x, y, 5, 0, Math.PI * 2);
                context.fillStyle = "#ff5a70";
                context.fill();
            }
        };

        draw();
        const observer = new ResizeObserver(draw);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [hovered, useLogScale, visibleRows]);

    const findRowAtPointer = (event) => {
        const canvas = canvasRef.current;
        if (!canvas || !visibleRows.length) return null;
        const bounds = canvas.getBoundingClientRect();
        const paddingLeft = 54;
        const paddingRight = 20;
        const position = Math.max(
            0,
            Math.min(1, (event.clientX - bounds.left - paddingLeft) / (bounds.width - paddingLeft - paddingRight)),
        );
        const index = Math.round(position * (visibleRows.length - 1));
        return visibleRows[index];
    };

    return (
        <div className={styles.frequencyChart}>
            <div className={styles.chartToolbar}>
                <div className={styles.segmented} aria-label="Object rank range">
                    {[
                        [115, "Analysis group"],
                        [2533, "Recurring"],
                        [18254, "All objects"],
                    ].map(([value, label]) => (
                        <button
                            className={limit === value ? styles.activeControl : ""}
                            key={value}
                            onClick={() => setLimit(value)}
                            type="button"
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <label className={styles.checkControl}>
                    <input
                        checked={useLogScale}
                        onChange={(event) => setUseLogScale(event.target.checked)}
                        type="checkbox"
                    />
                    Log scale
                </label>
            </div>
            <canvas
                aria-label={`Object frequency by rank for the first ${visibleRows.length.toLocaleString()} objects`}
                className={styles.chartCanvas}
                onClick={(event) => {
                    const row = findRowAtPointer(event);
                    if (row) onSelect(row.object);
                }}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(event) => setHovered(findRowAtPointer(event))}
                ref={canvasRef}
                role="img"
            />
            <div className={styles.chartReadout} aria-live="polite">
                {hovered ? (
                    <>
                        <strong>#{hovered.rank.toLocaleString()} {hovered.object}</strong>
                        <span>{hovered.frequency.toLocaleString()} appearances</span>
                    </>
                ) : (
                    <>
                        <strong>Move across the curve</strong>
                        <span>Click an object to locate it in the table and network.</span>
                    </>
                )}
            </div>
        </div>
    );
}

function RelationTable({ rows, videoById }) {
    if (!rows.length) {
        return <p className={styles.emptyState}>No directed relation statements remain under the active filters.</p>;
    }

    const subjectCounts = new Map();
    rows.forEach((row) => {
        subjectCounts.set(row.subject, (subjectCounts.get(row.subject) || 0) + 1);
    });

    return (
        <div className={styles.tableScroller}>
            <table className={styles.relationTable}>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Relation wording</th>
                        <th>Object</th>
                        <th>Pair frequency</th>
                        <th>Association</th>
                        <th>Wording frequency</th>
                        <th>Supporting videos</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const firstForSubject = index === 0 || rows[index - 1].subject !== row.subject;
                        return (
                            <tr key={`${row.subject}-${row.relation}-${row.object}-${index}`}>
                                {firstForSubject ? (
                                    <th rowSpan={subjectCounts.get(row.subject)} scope="rowgroup">
                                        {row.subject}
                                    </th>
                                ) : null}
                                <td>{row.relation}</td>
                                <td>{row.object}</td>
                                <td>{row.pairFrequency}</td>
                                <td>{row.association.toFixed(3)}</td>
                                <td>{row.frequency}</td>
                                <td>
                                    <details className={styles.videoDetails}>
                                        <summary>{row.supportingVideos.length}</summary>
                                        <ul>
                                            {row.supportingVideos.map((videoId) => {
                                                const video = videoById.get(videoId);
                                                return (
                                                    <li key={videoId}>
                                                        <a
                                                            href={video?.url || `https://www.youtube.com/watch?v=${videoId}`}
                                                            rel="noreferrer"
                                                            target="_blank"
                                                        >
                                                            {video?.title || videoId}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </details>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function CommunityOverview({ communities, activeCommunity, onSelect }) {
    return (
        <div className={styles.communityOverview}>
            <div className={styles.communityOverviewHeading}>
                <div>
                    <p className={styles.panelEyebrow}>Detected communities</p>
                    <h4>Repeated relationships form these object bundles</h4>
                </div>
                <p>Labels list the three most structurally representative objects; they are descriptions, not predefined categories.</p>
            </div>
            <div className={styles.communityGrid}>
                {communities.map((community) => (
                    <button
                        aria-pressed={activeCommunity === String(community.id)}
                        className={activeCommunity === String(community.id) ? styles.activeCommunity : ""}
                        key={community.id}
                        onClick={() => onSelect(
                            activeCommunity === String(community.id) ? "all" : String(community.id),
                        )}
                        type="button"
                    >
                        <span>
                            <strong>{community.label}</strong>
                            <small>{community.size} objects · {community.edgeCount} internal pairs</small>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function DanJohnDashboard({ view = "both" }) {
    const dashboardRef = useRef(null);
    const networkRef = useRef(null);
    const cyRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [frequencyQuery, setFrequencyQuery] = useState("");
    const [networkQuery, setNetworkQuery] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [minPairFrequency, setMinPairFrequency] = useState(2);
    const [depth, setDepth] = useState(1);
    const [scope, setScope] = useState("communities");
    const [communityFilter, setCommunityFilter] = useState("all");
    const [edgeView, setEdgeView] = useState("signal");
    const [hoveredNode, setHoveredNode] = useState(null);

    useEffect(() => {
        const activateFromHash = () => {
            if (window.location.hash === "#explore" || window.location.hash === "#relation-network") {
                setShouldLoad(true);
            }
        };

        activateFromHash();
        window.addEventListener("hashchange", activateFromHash);

        const container = dashboardRef.current;
        if (!container || shouldLoad || !("IntersectionObserver" in window)) {
            return () => window.removeEventListener("hashchange", activateFromHash);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "600px 0px" },
        );
        observer.observe(container);

        return () => {
            observer.disconnect();
            window.removeEventListener("hashchange", activateFromHash);
        };
    }, [shouldLoad]);

    useEffect(() => {
        if (!shouldLoad) return undefined;

        const controller = new AbortController();
        fetch("/data/dan-john-network.json", { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
                return response.json();
            })
            .then(setData)
            .catch((fetchError) => {
                if (fetchError.name !== "AbortError") setError(fetchError.message);
            });
        return () => controller.abort();
    }, [shouldLoad]);

    const nodeById = useMemo(
        () => new Map((data?.nodes || []).map((node) => [node.id, node])),
        [data],
    );
    const videoById = useMemo(
        () => new Map((data?.videos || []).map((video) => [video.id, video])),
        [data],
    );
    const edgeById = useMemo(
        () => new Map((data?.edges || []).map((edge) => [pairKey(edge.source, edge.target), edge])),
        [data],
    );
    const scopeNodes = useMemo(() => {
        if (!data) return new Set();
        return new Set(
            data.nodes
                .filter((node) => {
                    if (scope === "communities") return node.community > 0;
                    if (scope === "analysis") return node.group === "Analysis group";
                    if (scope === "analysis-first") return node.group !== "Second order";
                    return true;
                })
                .filter((node) => (
                    communityFilter === "all" || node.community === Number(communityFilter)
                ))
                .map((node) => node.id),
        );
    }, [communityFilter, data, scope]);

    const thresholdEdges = useMemo(() => {
        if (!data) return [];
        return data.edges.filter(
            (edge) =>
                edge.frequency >= minPairFrequency &&
                scopeNodes.has(edge.source) &&
                scopeNodes.has(edge.target),
        );
    }, [data, minPairFrequency, scopeNodes]);

    const displayEdges = useMemo(() => {
        if (edgeView === "all" || selectedId) return thresholdEdges;

        const incident = new Map();
        thresholdEdges.forEach((edge) => {
            if (!incident.has(edge.source)) incident.set(edge.source, []);
            if (!incident.has(edge.target)) incident.set(edge.target, []);
            incident.get(edge.source).push(edge);
            incident.get(edge.target).push(edge);
        });

        const retained = new Set();
        incident.forEach((edges) => {
            edges
                .sort((left, right) =>
                    edgeSignal(right) - edgeSignal(left) ||
                    right.frequency - left.frequency ||
                    pairKey(left.source, left.target).localeCompare(pairKey(right.source, right.target)),
                )
                .slice(0, 4)
                .forEach((edge) => retained.add(pairKey(edge.source, edge.target)));
        });

        return thresholdEdges.filter((edge) => (
            retained.has(pairKey(edge.source, edge.target)) || edge.bridge
        ));
    }, [edgeView, selectedId, thresholdEdges]);

    const graphModel = useMemo(() => {
        if (!data) {
            return {
                nodes: [], edges: [], direct: new Set(), second: new Set(), allDirectCount: 0,
                availableEdgeCount: 0, edgeFrequency: new Map(),
            };
        }

        const adjacency = new Map();
        const edgeFrequency = new Map();
        thresholdEdges.forEach((edge) => {
            if (!adjacency.has(edge.source)) adjacency.set(edge.source, new Set());
            if (!adjacency.has(edge.target)) adjacency.set(edge.target, new Set());
            adjacency.get(edge.source).add(edge.target);
            adjacency.get(edge.target).add(edge.source);
            edgeFrequency.set(pairKey(edge.source, edge.target), edge);
        });

        if (selectedId && scopeNodes.has(selectedId)) {
            const allDirect = [...(adjacency.get(selectedId) || [])].sort((left, right) => {
                const frequencyDifference =
                    edgeSignal(edgeFrequency.get(pairKey(selectedId, right)) || {}) -
                    edgeSignal(edgeFrequency.get(pairKey(selectedId, left)) || {});
                if (frequencyDifference) return frequencyDifference;
                return (nodeById.get(right)?.frequency || 0) - (nodeById.get(left)?.frequency || 0);
            });
            const direct = new Set(allDirect.slice(0, 120));
            const second = new Set();
            if (depth === 2) {
                for (const directNode of direct) {
                    for (const neighbour of adjacency.get(directNode) || []) {
                        if (neighbour !== selectedId && !direct.has(neighbour)) second.add(neighbour);
                        if (second.size >= Math.max(0, 249 - direct.size)) break;
                    }
                    if (second.size >= Math.max(0, 249 - direct.size)) break;
                }
            }
            const visible = new Set([selectedId, ...direct, ...second]);
            return {
                nodes: [...visible].map((id) => nodeById.get(id)).filter(Boolean),
                edges: thresholdEdges.filter(
                    (edge) => visible.has(edge.source) && visible.has(edge.target),
                ),
                direct,
                second,
                allDirectCount: allDirect.length,
                availableEdgeCount: thresholdEdges.length,
                edgeFrequency,
            };
        }

        const visible = new Set();
        displayEdges.forEach((edge) => {
            visible.add(edge.source);
            visible.add(edge.target);
        });
        if (scope !== "communities") {
            data.nodes.forEach((node) => {
                if (node.group === "Analysis group" && scopeNodes.has(node.id)) visible.add(node.id);
            });
        }
        return {
            nodes: [...visible].map((id) => nodeById.get(id)).filter(Boolean),
            edges: displayEdges,
            direct: new Set(),
            second: new Set(),
            allDirectCount: 0,
            availableEdgeCount: thresholdEdges.length,
            edgeFrequency,
        };
    }, [data, depth, displayEdges, nodeById, scope, scopeNodes, selectedId, thresholdEdges]);

    useEffect(() => {
        if (!networkRef.current || !data || !graphModel.nodes.length) return undefined;
        let cancelled = false;
        const networkElement = networkRef.current;
        const containGraphWheel = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        Promise.all([import("cytoscape"), import("cytoscape-fcose")]).then(([
            { default: cytoscape },
            { default: fcose },
        ]) => {
            if (cancelled) return;
            if (!fcoseRegistered) {
                cytoscape.use(fcose);
                fcoseRegistered = true;
            }
            if (cyRef.current) cyRef.current.destroy();

            const maximumFrequency = data.frequencies[0].frequency;
            const sizeFor = (frequency) =>
                9 + (Math.log1p(Math.max(1, frequency)) / Math.log1p(maximumFrequency)) * 33;
            const localView = Boolean(selectedId);
            const maximumSignal = Math.max(
                0.001,
                ...graphModel.edges.map((edge) => edgeSignal(edge)),
            );
            const elements = [
                ...graphModel.nodes.map((node) => {
                    let visualRole = "base";
                    let distance = 1;
                    if (node.id === selectedId) {
                        visualRole = "selected";
                        distance = 3;
                    } else if (graphModel.direct.has(node.id)) {
                        visualRole = "direct";
                        distance = 2;
                    } else if (graphModel.second.has(node.id)) {
                        visualRole = "second";
                        distance = 1;
                    }
                    return {
                        data: {
                            id: node.id,
                            label: node.id,
                            displayLabel: node.id,
                            colour: TIER_COLOURS[node.group] || TIER_COLOURS["Second order"],
                            frequency: node.frequency,
                            rank: node.rank || "—",
                            group: node.group,
                            community: node.community,
                            communityLabel: node.communityLabel,
                            bridge: node.bridge ? 1 : 0,
                            size: sizeFor(node.frequency),
                            visualRole,
                            distance,
                        },
                        position: { x: node.x, y: node.y },
                    };
                }),
                ...graphModel.edges.map((edge) => ({
                    data: {
                        id: pairKey(edge.source, edge.target),
                        source: edge.source,
                        target: edge.target,
                        frequency: edge.frequency,
                        videoCount: edge.videoCount,
                        association: edge.association,
                        signal: edge.signal,
                        width: 0.45 + Math.sqrt(edgeSignal(edge) / maximumSignal) * 4.2,
                        bridge: edge.bridge ? 1 : 0,
                        direct: selectedId && (edge.source === selectedId || edge.target === selectedId) ? 1 : 0,
                    },
                })),
            ];

            const cy = cytoscape({
                container: networkElement,
                elements,
                minZoom: 0.08,
                maxZoom: 3,
                pixelRatio: 1,
                style: [
                    {
                        selector: "node",
                        style: {
                            width: "data(size)",
                            height: "data(size)",
                            "background-color": "data(colour)",
                            "background-opacity": 0.9,
                            "border-color": "#e1ded3",
                            "border-width": 1.2,
                            label: "data(displayLabel)",
                            color: "#f8f4df",
                            "font-size": 9,
                            "text-outline-color": "#050607",
                            "text-outline-width": 2,
                            "text-outline-opacity": 0.96,
                            "text-valign": "top",
                            "text-margin-y": -6,
                            "text-wrap": "wrap",
                            "text-max-width": 104,
                        },
                    },
                    {
                        selector: 'node[group = "Analysis group"]',
                        style: {
                            "background-opacity": 1,
                            "font-size": 11,
                            "font-weight": 700,
                            "z-index": 5,
                        },
                    },
                    {
                        selector: "node[bridge = 1]",
                        style: {
                            "border-color": "#f8f4df",
                            "border-style": "double",
                            "border-width": 4,
                        },
                    },
                    {
                        selector: 'node[visualRole = "selected"]',
                        style: {
                            "background-opacity": 1,
                            "border-width": 5,
                            "border-color": "#ff405f",
                            "border-style": "solid",
                            "z-index": 20,
                        },
                    },
                    {
                        selector: 'node[visualRole = "direct"]',
                        style: {
                            "background-opacity": 0.96,
                            "border-width": 3,
                            "border-color": "#f5a623",
                            "border-style": "solid",
                            "z-index": 12,
                        },
                    },
                    {
                        selector: 'node[visualRole = "second"]',
                        style: {
                            "background-opacity": 0.76,
                            "border-color": "#39c6c8",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            width: "data(width)",
                            "line-color": "#b8c2cc",
                            opacity: localView ? 0.2 : 0.26,
                            "curve-style": "straight",
                        },
                    },
                    {
                        selector: "edge[bridge = 1]",
                        style: {
                            "line-color": "#f5e36d",
                            "line-style": "dashed",
                            opacity: 0.48,
                        },
                    },
                    {
                        selector: "edge[direct = 1]",
                        style: {
                            "line-color": "#f5a623",
                            opacity: 0.62,
                            width: "data(width)",
                            "z-index": 10,
                        },
                    },
                    {
                        selector: "edge.selectedEdge",
                        style: {
                            "line-color": "#ff405f",
                            "line-style": "solid",
                            opacity: 1,
                            width: 6,
                            "z-index": 20,
                        },
                    },
                ],
                layout: localView
                    ? {
                        name: "concentric",
                        concentric: (node) => node.data("distance"),
                        levelWidth: () => 1,
                        minNodeSpacing: 28,
                        nodeDimensionsIncludeLabels: true,
                        animate: false,
                    }
                    : graphModel.nodes.length <= 650
                        ? {
                            name: "fcose",
                            quality: "default",
                            randomize: true,
                            animate: false,
                            fit: true,
                            padding: 42,
                            nodeRepulsion: 5200,
                            nodeSeparation: 100,
                            nodeDimensionsIncludeLabels: true,
                            idealEdgeLength: 100,
                            edgeElasticity: 0.18,
                            nestingFactor: 0.1,
                            tilingPaddingVertical: 24,
                            tilingPaddingHorizontal: 24,
                            numIter: 2500,
                        }
                        : { name: "preset", fit: true, padding: 38 },
            });
            cyRef.current = cy;
            networkElement.addEventListener("wheel", containGraphWheel, { passive: false });
            cy.on("tap", "node", (event) => {
                const id = event.target.id();
                setSelectedId(id);
                setSelectedEdgeId(null);
                setNetworkQuery(id);
            });
            cy.on("tap", "edge", (event) => {
                cy.edges().removeClass("selectedEdge");
                event.target.addClass("selectedEdge");
                setSelectedEdgeId(event.target.id());
            });
            cy.on("mouseover", "node", (event) => {
                const node = event.target;
                setHoveredNode({
                    id: node.id(),
                    group: node.data("group"),
                    communityLabel: node.data("communityLabel"),
                    frequency: node.data("frequency"),
                    rank: node.data("rank"),
                });
            });
            cy.on("mouseout", "node", () => setHoveredNode(null));
            cy.fit(undefined, 38);
        });

        return () => {
            cancelled = true;
            networkElement.removeEventListener("wheel", containGraphWheel);
            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }
        };
    }, [data, graphModel, selectedId]);

    const suggestions = useMemo(() => {
        if (!data) return [];
        const query = normalise(networkQuery);
        return data.nodes
            .filter((node) => scopeNodes.has(node.id) && (!query || node.id.includes(query)))
            .sort((left, right) => {
                const quality = matchQuality(left.id, query) - matchQuality(right.id, query);
                if (quality) return quality;
                return right.frequency - left.frequency || left.id.localeCompare(right.id);
            })
            .slice(0, 12);
    }, [data, networkQuery, scopeNodes]);

    const frequencyMatches = useMemo(() => {
        if (!data) return [];
        const query = normalise(frequencyQuery);
        const rows = data.frequencies
            .filter((row) => query ? row.object.includes(query) : row.rank <= 115)
            .sort((left, right) => {
                if (!query) return left.rank - right.rank;
                const quality = matchQuality(left.object, query) - matchQuality(right.object, query);
                return quality || right.frequency - left.frequency || left.object.localeCompare(right.object);
            });
        return query ? rows.slice(0, 115) : rows;
    }, [data, frequencyQuery]);

    const selectedEdge = selectedEdgeId ? edgeById.get(selectedEdgeId) : null;

    const relationRows = useMemo(() => {
        if (!data || (!selectedId && !selectedEdge)) return [];
        const direct = graphModel.direct;
        const edgeFrequency = graphModel.edgeFrequency || new Map();
        const rows = data.relations
            .filter((row) => {
                if (selectedEdge) {
                    return pairKey(row.subject, row.object) === selectedEdgeId;
                }
                if (row.subject === selectedId && direct.has(row.object)) return true;
                return row.object === selectedId && direct.has(row.subject);
            })
            .map((row) => {
                const edge = edgeFrequency.get(pairKey(row.subject, row.object))
                    || edgeById.get(pairKey(row.subject, row.object));
                return {
                    ...row,
                    pairFrequency: edge?.frequency || 0,
                    association: edge?.association || 0,
                };
            });
        const subjectTotals = new Map();
        rows.forEach((row) => {
            subjectTotals.set(row.subject, (subjectTotals.get(row.subject) || 0) + row.frequency);
        });
        return rows.sort((left, right) =>
            (subjectTotals.get(right.subject) - subjectTotals.get(left.subject)) ||
            left.subject.localeCompare(right.subject) ||
            right.frequency - left.frequency ||
            left.relation.localeCompare(right.relation) ||
            left.object.localeCompare(right.object),
        );
    }, [data, edgeById, graphModel, selectedEdge, selectedEdgeId, selectedId]);

    const selectObject = (id) => {
        if (!scopeNodes.has(id)) {
            setScope("network");
            setCommunityFilter("all");
        }
        setSelectedId(id);
        setSelectedEdgeId(null);
        setNetworkQuery(id);
        document.getElementById("relation-network")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!shouldLoad) {
        return (
            <div className={styles.dashboardDeferred} ref={dashboardRef}>
                <p className={styles.panelEyebrow}>Interactive evidence</p>
                <h3>Load the full frequency table and relation network when you need them</h3>
                <p>The large browser dataset is deferred until this section approaches the viewport. You can also load it now.</p>
                <button onClick={() => setShouldLoad(true)} type="button">Load interactive evidence</button>
            </div>
        );
    }

    if (error) {
        return <div className={styles.dashboardError} role="alert">The dashboard data could not be loaded: {error}</div>;
    }

    if (!data) {
        return <div aria-busy="true" aria-live="polite" className={styles.dashboardLoading}>Loading 18,254 objects and 11,018 object pairs…</div>;
    }

    const selectedNode = selectedId ? nodeById.get(selectedId) : null;
    const omittedDirect = selectedNode ? Math.max(0, graphModel.allDirectCount - graphModel.direct.size) : 0;
    const connectedObjectCount = new Set(
        graphModel.edges.flatMap((edge) => [edge.source, edge.target]),
    ).size;

    const showFrequency = view !== "network";
    const showNetwork = view !== "frequency";

    return (
        <div className={styles.dashboard}>
            {showFrequency ? <section className={styles.dashboardPanel}>
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.panelEyebrow}>Object frequency</p>
                        <h3>What keeps appearing?</h3>
                    </div>
                    <p>{data.meta.objectOccurrences.toLocaleString()} occurrences across {data.meta.uniqueObjects.toLocaleString()} labels</p>
                </div>

                <FrequencyChart
                    frequencies={data.frequencies}
                    onSelect={(object) => {
                        setFrequencyQuery(object);
                        if (nodeById.has(object)) {
                            selectObject(object);
                        }
                    }}
                />

                <div className={styles.frequencyFinder}>
                    <label>
                        Find an object in the frequency table
                        <input
                            onChange={(event) => setFrequencyQuery(event.target.value)}
                            placeholder="Try: loaded carry, Easy Strength, squat…"
                            type="search"
                            value={frequencyQuery}
                        />
                    </label>
                    <p aria-live="polite">
                        {frequencyMatches.length} {frequencyQuery.trim() ? "matching" : "analysis-group"} rows shown.
                        {frequencyQuery.trim() ? " Search results are capped at 115." : " All objects through the rank-115 cutoff are included."}
                        {" "}Singular and plural labels remain separate.
                    </p>
                </div>

                <div className={`${styles.tableScroller} ${styles.frequencyTableWrap}`}>
                    <table className={styles.frequencyTable}>
                        <thead>
                            <tr><th>Rank</th><th>Object</th><th>Total frequency</th><th>Network position</th>{showNetwork ? <th /> : null}</tr>
                        </thead>
                        <tbody>
                            {frequencyMatches.map((row) => {
                                const node = nodeById.get(row.object);
                                return (
                                    <tr key={row.object}>
                                        <td>{row.rank.toLocaleString()}</td>
                                        <th scope="row">{row.object}</th>
                                        <td>{row.frequency.toLocaleString()}</td>
                                        <td>{node?.group || "Outside second order"}</td>
                                        {showNetwork ? <td>
                                            {node ? (
                                                <button onClick={() => selectObject(row.object)} type="button">Map</button>
                                            ) : <span>—</span>}
                                        </td> : null}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section> : null}

            {showNetwork ? <section aria-labelledby="relation-network-heading" className={styles.dashboardPanel} id="relation-network">
                <div className={styles.panelHeader}>
                    <div>
                        <p className={styles.panelEyebrow}>Relation network</p>
                        <h3 id="relation-network-heading">What connects to what?</h3>
                    </div>
                    <p aria-atomic="true" aria-live="polite">
                        {connectedObjectCount.toLocaleString()} connected objects · {graphModel.edges.length.toLocaleString()} displayed of {graphModel.availableEdgeCount.toLocaleString()} eligible pairs
                    </p>
                </div>

                <div className={styles.networkControls}>
                    <div className={styles.searchControl}>
                        <label htmlFor="network-object-search">Find object</label>
                        <input
                            id="network-object-search"
                            onChange={(event) => setNetworkQuery(event.target.value)}
                            placeholder="Type any part of an object name"
                            type="search"
                            value={networkQuery}
                        />
                        <div className={styles.suggestions}>
                            {suggestions.map((node) => (
                                <button
                                    className={node.id === selectedId ? styles.selectedSuggestion : ""}
                                    key={node.id}
                                    onClick={() => selectObject(node.id)}
                                    type="button"
                                >
                                    <strong>{node.id}</strong>
                                    <span>#{node.rank?.toLocaleString() || "—"} · frequency {node.frequency.toLocaleString()} · {node.communityLabel}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterControls}>
                        <label>
                            Object scope
                            <select
                                onChange={(event) => {
                                    setScope(event.target.value);
                                    setCommunityFilter("all");
                                    setSelectedId(null);
                                    setSelectedEdgeId(null);
                                }}
                                value={scope}
                            >
                                <option value="communities">Detected communities</option>
                                <option value="network">All objects through second order</option>
                                <option value="analysis">Analysis group only</option>
                                <option value="analysis-first">Analysis + first order</option>
                            </select>
                        </label>
                        <label>
                            Community
                            <select
                                onChange={(event) => {
                                    setCommunityFilter(event.target.value);
                                    setSelectedId(null);
                                    setSelectedEdgeId(null);
                                }}
                                value={communityFilter}
                            >
                                <option value="all">All detected communities</option>
                                {data.communities.map((community) => (
                                    <option key={community.id} value={community.id}>{community.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Edge view
                            <select
                                onChange={(event) => {
                                    setEdgeView(event.target.value);
                                    setSelectedEdgeId(null);
                                }}
                                value={edgeView}
                            >
                                <option value="signal">Strongest per object + bridges</option>
                                <option value="all">All eligible repeated pairs</option>
                            </select>
                        </label>
                        <label>
                            Minimum pair frequency: <strong>{minPairFrequency}</strong>
                            <input
                                max="4"
                                min="1"
                                onChange={(event) => {
                                    setMinPairFrequency(Number(event.target.value));
                                    setSelectedEdgeId(null);
                                }}
                                step="1"
                                type="range"
                                value={minPairFrequency}
                            />
                        </label>
                        <fieldset>
                            <legend>Selected-object depth</legend>
                            <div className={styles.segmented}>
                                {[1, 2].map((value) => (
                                    <button
                                        className={depth === value ? styles.activeControl : ""}
                                        key={value}
                                        onClick={() => setDepth(value)}
                                        type="button"
                                    >
                                        {value === 1 ? "Direct" : "Second order"}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                        <button
                            className={styles.resetButton}
                            onClick={() => {
                                setSelectedId(null);
                                setSelectedEdgeId(null);
                                setNetworkQuery("");
                            }}
                            type="button"
                        >
                            Reset selection
                        </button>
                    </div>
                </div>

                <div className={styles.networkSummary} aria-live="polite">
                    {selectedEdge ? (
                        <p>
                            <strong>{selectedEdge.source} ↔ {selectedEdge.target}</strong> — {selectedEdge.frequency} extracted relations across {selectedEdge.videoCount} supporting videos; normalised association {selectedEdge.association.toFixed(3)}.
                        </p>
                    ) : selectedNode ? (
                        <p>
                            <strong>{selectedNode.id}</strong> — rank {selectedNode.rank?.toLocaleString() || "—"}, frequency {selectedNode.frequency.toLocaleString()}, {graphModel.allDirectCount.toLocaleString()} direct objects under the active filters.
                            {omittedDirect ? ` The display keeps the strongest 120 and omits ${omittedDirect}.` : ""}
                        </p>
                    ) : (
                        <p>Every visible object is labelled. Node fill shows analysis tier; community structure is conveyed by position, cards and filtering. Edge width uses normalised association; dashed edges connect communities.</p>
                    )}
                    <p
                        className={styles.hoverReadout}
                        title={hoveredNode
                            ? `${hoveredNode.id} · ${hoveredNode.communityLabel} · ${hoveredNode.group} · frequency ${hoveredNode.frequency}`
                            : undefined}
                    >
                        {hoveredNode ? (
                            <><strong>{hoveredNode.id}</strong> · {hoveredNode.communityLabel} · {hoveredNode.group} · frequency {hoveredNode.frequency}</>
                        ) : "Hover a node to inspect its signal."}
                    </p>
                </div>

                <CommunityOverview
                    activeCommunity={communityFilter}
                    communities={data.communities}
                    onSelect={(value) => {
                        setCommunityFilter(value);
                        setScope("communities");
                        setSelectedId(null);
                        setSelectedEdgeId(null);
                    }}
                />

                <div className={styles.networkLegend}>
                    <span><i className={styles.analysisKey} />Analysis group</span>
                    <span><i className={styles.firstOrderKey} />First order</span>
                    <span><i className={styles.secondOrderKey} />Second order</span>
                    <span><i className={styles.bridgeKey} />Double border: bridge object</span>
                    <span><i className={styles.selectedKey} />Selected node or edge</span>
                    <span><i className={styles.directKey} />Direct neighbourhood</span>
                </div>

                <p className={styles.networkInstructions} id="relation-network-description">
                    Click a node to isolate its neighbourhood, or click an edge to inspect the exact directed statements and supporting videos. Community labels are inferred from graph structure and remain interpretations rather than extracted facts.
                </p>
                <div
                    aria-describedby="relation-network-description"
                    aria-label="Interactive object-relation network"
                    className={styles.networkCanvas}
                    ref={networkRef}
                    role="img"
                />

                <div className={styles.relationOutput}>
                    <div className={styles.relationOutputHeading}>
                        <h4>{selectedEdge ? "Directed evidence for the selected pair" : "Directed relations for the selected object"}</h4>
                        <p>Subject → relation wording → object. Pair frequency remains undirected; the extracted statement does not.</p>
                    </div>
                    {selectedNode || selectedEdge ? (
                        <RelationTable rows={relationRows} videoById={videoById} />
                    ) : (
                        <p className={styles.emptyState}>Select an object or edge to display its complete relation wording.</p>
                    )}
                </div>
            </section> : null}
        </div>
    );
}
