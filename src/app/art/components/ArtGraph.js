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
                    },
                })),
                ...(data.graph?.edges ?? []).map((edge, index) => ({
                    data: {
                        id: `edge-${index}`,
                        source: edge.source,
                        target: edge.target,
                        weight: edge.weight ?? 1,
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
                    padding: 24,
                    nodeRepulsion: 450000,
                    idealEdgeLength: 120,
                    edgeElasticity: 0.35,
                    gravity: 0.25,
                },
                style: [
                    {
                        selector: "node",
                        style: {
                            label: "data(label)",
                            width: "mapData(centrality, 0, 12, 28, 80)",
                            height: "mapData(centrality, 0, 12, 28, 80)",
                            "background-color": "#8b1e1e",
                            color: "#f3f3f3",
                            "font-size": "13px",
                            "text-wrap": "wrap",
                            "text-max-width": "130px",
                            "text-valign": "center",
                            "text-halign": "center",
                            "overlay-opacity": 0,
                            "border-width": 1,
                            "border-color": "rgba(255,255,255,0.18)",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            width: "mapData(weight, 1, 4, 1, 4)",
                            "line-color": "rgba(255,255,255,0.22)",
                            "curve-style": "bezier",
                            opacity: 0.65,
                        },
                    },
                    {
                        selector: "node:hover",
                        style: {
                            "background-color": "#b32626",
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
                const slug = event.target.data("id");
                window.location.href = `/art/${slug}`;
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