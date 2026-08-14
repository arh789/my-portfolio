"use client";

import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";

cytoscape.use(fcose);

export default function ArtGraph() {
    const containerRef = useRef(null);
    const cyRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function initialiseGraph() {
            const response = await fetch("/graph.json");
            const data = await response.json();

            if (!isMounted || !containerRef.current) return;

            const elements = [
                ...(data.graph?.nodes ?? []).map((node) => ({
                    data: {
                        id: node.id,
                        label: node.label,
                        centrality: node.centrality ?? 0,
                        route: `/art/${node.id}`,
                        type: "article",
                    },
                })),
                ...(data.graph?.projectNodes ?? []).map((node) => ({
                    data: {
                        id: node.id,
                        label: node.label,
                        centrality: 12,
                        route: node.route,
                        type: "project",
                    },
                })),
                ...(data.graph?.edges ?? []).map((edge, index) => ({
                    data: {
                        id: `tag-edge-${index}`,
                        source: edge.source,
                        target: edge.target,
                        weight: edge.weight ?? 1,
                        type: "shared-tag",
                    },
                })),
                ...(data.graph?.projectEdges ?? []).map((edge, index) => ({
                    data: {
                        id: `project-edge-${index}`,
                        source: edge.source,
                        target: edge.target,
                        weight: 1,
                        type: edge.type,
                    },
                })),
            ];

            cyRef.current = cytoscape({
                container: containerRef.current,
                elements,
                layout: {
                    name: "fcose",
                    quality: "default",
                    randomize: true,
                    animate: false,
                    fit: true,
                    padding: 48,
                    nodeRepulsion: 760000,
                    idealEdgeLength: 175,
                    edgeElasticity: 0.25,
                    gravity: 0.16,
                },
                style: [
                    {
                        selector: "node",
                        style: {
                            label: "data(label)",
                            width: "mapData(centrality, 0, 12, 20, 52)",
                            height: "mapData(centrality, 0, 12, 20, 52)",
                            "background-color": "#8b1e1e",
                            color: "#f0c04f",
                            "font-size": "11px",
                            "text-wrap": "wrap",
                            "text-max-width": "110px",
                            "text-valign": "center",
                            "text-halign": "center",
                            "text-outline-color": "rgba(0,0,0,0.86)",
                            "text-outline-width": 2,
                            "overlay-opacity": 0,
                            "border-width": 1,
                            "border-color": "rgba(240,192,79,0.36)",
                        },
                    },
                    {
                        selector: 'node[type = "project"]',
                        style: {
                            shape: "round-rectangle",
                            width: 190,
                            height: 64,
                            "background-color": "#f3c64f",
                            color: "#1c1400",
                            "font-weight": 700,
                            "font-size": "11px",
                            "text-wrap": "wrap",
                            "text-max-width": "165px",
                            "text-outline-width": 0,
                            "border-width": 2,
                            "border-color": "#fff0a8",
                        },
                    },
                    {
                        selector: 'edge[type = "shared-tag"]',
                        style: {
                            width: "mapData(weight, 1, 4, 0.75, 2.5)",
                            "line-color": "rgba(190,190,190,0.26)",
                            "curve-style": "bezier",
                            opacity: 0.28,
                        },
                    },
                    {
                        selector: 'edge[type = "belongs-to-project"]',
                        style: {
                            width: 1.6,
                            "line-color": "#f0c04f",
                            "line-style": "dashed",
                            "curve-style": "bezier",
                            opacity: 0.58,
                        },
                    },
                    {
                        selector: 'edge[type = "precedes"]',
                        style: {
                            width: 2.2,
                            "line-color": "#f0c04f",
                            "target-arrow-color": "#f0c04f",
                            "target-arrow-shape": "triangle",
                            "arrow-scale": 0.8,
                            "curve-style": "bezier",
                            opacity: 0.82,
                        },
                    },
                    {
                        selector:
                            'edge[type = "alternate-media"], edge[type = "supports-methodology"]',
                        style: {
                            width: 1.8,
                            "line-color": "#d46a6a",
                            "line-style": "dotted",
                            "curve-style": "bezier",
                            opacity: 0.68,
                        },
                    },
                    {
                        selector: "node:hover",
                        style: {
                            "background-color": "#b32626",
                        },
                    },
                    {
                        selector: 'node[type = "project"]:hover',
                        style: {
                            "background-color": "#ffe27a",
                        },
                    },
                ],
                userZoomingEnabled: true,
                userPanningEnabled: true,
                boxSelectionEnabled: false,
                wheelSensitivity: 1,
            });

            containerRef.current.style.cursor = "grab";

            cyRef.current.on("mouseover", "node", () => {
                if (containerRef.current) {
                    containerRef.current.style.cursor = "pointer";
                }
            });

            cyRef.current.on("mouseout", "node", () => {
                if (containerRef.current) {
                    containerRef.current.style.cursor = "grab";
                }
            });

            cyRef.current.on("tap", "node", (event) => {
                window.location.href = event.target.data("route");
            });
        }

        initialiseGraph();

        return () => {
            isMounted = false;

            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }
        };
    }, []);

    return (
        <section className="art-graph">
            <div className="art-graph__header">
                <h2>Article Network</h2>
                <p className="art-graph__hint">
                    Drag to move • Scroll or pinch to zoom • Click a node to open
                </p>
                <p className="art-graph__legend">
                    <span>Red circles: articles</span>
                    <span>Gold rectangles: guided projects</span>
                    <span>Gold arrows: reading order</span>
                </p>

                <button
                    type="button"
                    className="art-graph__reset"
                    onClick={() => {
                        if (cyRef.current) {
                            cyRef.current.fit();
                            cyRef.current.center();
                        }
                    }}
                >
                    Reset view
                </button>
            </div>

            <div ref={containerRef} className="art-graph__canvas" />
        </section>
    );
}
