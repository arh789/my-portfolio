"use client";

import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import styles from "./SemanticNetworkExplorer.module.css";

const graphStyle = [
    {
        selector: "node",
        style: {
            width: "data(diameter)", height: "data(diameter)",
            "background-color": "data(colour)", "border-width": 2, "border-color": "#101b14",
            label: "data(label)", color: "#f3f7f1", "font-size": 15, "font-family": "system-ui",
            "text-valign": "bottom", "text-margin-y": 7, "text-outline-width": 3,
            "text-outline-color": "#0a100d", "text-wrap": "ellipsis", "text-max-width": 130,
            "min-zoomed-font-size": 10,
        },
    },
    { selector: "node.landscape", style: { label: "data(shortLabel)" } },
    { selector: "node.landscape.focused", style: { label: "data(compactLabel)" } },
    { selector: "node.bridge", style: { "border-width": 4, "border-color": "#d3e4d8" } },
    { selector: "node.focused", style: {
        "border-width": 5, "border-color": "#f4e46d", "font-weight": "bold", "z-index": 3,
        "text-max-width": 165,
    } },
    { selector: "edge", style: {
        width: "data(width)", "line-color": "#6e9483", opacity: 0.5, "curve-style": "straight",
    } },
    { selector: "edge.directed", style: {
        "curve-style": "bezier", "target-arrow-shape": "triangle", "target-arrow-color": "#6e9483",
    } },
    { selector: "edge.boundary", style: { "line-style": "dashed" } },
    { selector: "edge.highlighted", style: {
        "line-color": "#f4e46d", "target-arrow-color": "#f4e46d", opacity: 0.9,
    } },
    { selector: ".concealed", style: { display: "none" } },
];

const zoomStep = 1.35;
const tokenThreshold = 2.1;

export default function R020GraphCanvas({
    elements, mode, visible, focus, hidden = false, fitRequest = 0, onSelect, onDeepZoom, onBridges, actions,
}) {
    const container = useRef(null);
    const renderer = useRef(null);
    const fitView = useRef(null);
    const callbacks = useRef(null);
    const baseZoom = useRef(1);
    const lastFit = useRef(fitRequest);
    const depthTriggered = useRef(false);
    const [scale, setScale] = useState(1);
    const [rendererError, setRendererError] = useState("");

    useEffect(() => {
        callbacks.current = { onSelect, onDeepZoom, onBridges, hidden };
        if (!hidden) depthTriggered.current = false;
    }, [onSelect, onDeepZoom, onBridges, hidden]);

    useEffect(() => {
        const target = container.current;
        let cy;
        try {
            cy = cytoscape({
                container: target, elements, style: graphStyle, layout: { name: "preset", fit: false },
                autoungrabify: true, boxSelectionEnabled: false, minZoom: 0.15, maxZoom: 5,
            });
        } catch {
            // The community and token pickers remain usable if the canvas cannot initialise.
            const frame = requestAnimationFrame(() => setRendererError("Graph canvas unavailable. Use the pickers and connection lists to explore."));
            return () => cancelAnimationFrame(frame);
        }
        renderer.current = cy;
        if (mode === "community") {
            if (cy.edges().length) {
                cy.layout({
                    name: "cose", animate: false, randomize: false, fit: false, numIter: 700,
                    nodeDimensionsIncludeLabels: true, componentSpacing: 90,
                    idealEdgeLength: (edge) => 80 + 60 / (1 + edge.data("affinity")),
                }).run();
            }
            const centrality = cy.elements().betweennessCentrality({ weight: (edge) => 1 / edge.data("affinity") });
            const scores = new Map(cy.nodes().map((node) => [Number(node.id()), centrality.betweennessNormalized(node)]));
            cy.nodes().forEach((node) => node.toggleClass("bridge", scores.get(Number(node.id())) >= 0.75));
            callbacks.current?.onBridges?.(scores);
        }
        cy.fit(cy.elements(), 52);
        baseZoom.current = cy.zoom();

        function updateZoom() {
            const zoom = cy.zoom();
            const ratio = zoom / baseZoom.current;
            const narrow = target.clientWidth < 500;
            setScale(ratio);
            cy.nodes().style({
                "font-size": Math.max(15, 12 / zoom),
                "text-max-width": narrow ? 88 / zoom : 130,
            });
            if (mode !== "community") return;
            cy.nodes().toggleClass("landscape", ratio < 0.85 || (narrow && ratio < 1.25));
            if (ratio >= tokenThreshold && !callbacks.current?.hidden && !depthTriggered.current) {
                depthTriggered.current = true;
                const viewport = { x: target.clientWidth / 2, y: target.clientHeight / 2 };
                cy.zoom({ level: baseZoom.current * 1.8, renderedPosition: viewport });
                callbacks.current?.onDeepZoom?.();
            }
        }

        function fitVisible() {
            cy.off("zoom", updateZoom);
            cy.fit(cy.elements(":visible"), 52);
            baseZoom.current = cy.zoom();
            cy.on("zoom", updateZoom);
            updateZoom();
        }
        fitView.current = fitVisible;

        cy.on("tap", "node", (event) => callbacks.current?.onSelect?.(Number(event.target.id())));
        cy.on("zoom", updateZoom);
        updateZoom();
        let lastWidth = target.clientWidth;
        const resize = new ResizeObserver(() => {
            if (target.clientWidth === lastWidth || !target.clientWidth) return;
            lastWidth = target.clientWidth;
            cy.resize();
            fitVisible();
        });
        resize.observe(target);
        return () => {
            resize.disconnect();
            renderer.current = null;
            fitView.current = null;
            cy.destroy();
        };
    }, [elements, mode]);

    useEffect(() => {
        const cy = renderer.current;
        if (!cy) return;
        cy.batch(() => {
            cy.nodes().forEach((node) => {
                const id = Number(node.id());
                node.toggleClass("concealed", visible !== undefined && !visible.has(id));
                node.toggleClass("focused", id === focus);
            });
            cy.edges().forEach((edge) => {
                const a = Number(edge.source().id());
                const b = Number(edge.target().id());
                edge.toggleClass("concealed", visible !== undefined && !(visible.has(a) && visible.has(b)));
                edge.toggleClass("highlighted", a === focus || b === focus);
            });
        });
    }, [elements, visible, focus]);

    useEffect(() => {
        if (lastFit.current === fitRequest) return;
        lastFit.current = fitRequest;
        fitView.current?.();
    }, [fitRequest]);

    function zoom(factor) {
        const cy = renderer.current;
        if (!cy) return;
        cy.zoom({
            level: cy.zoom() * factor,
            renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
        });
    }

    function keyboard(event) {
        const cy = renderer.current;
        if (!cy) return;
        const offsets = { ArrowLeft: [35, 0], ArrowRight: [-35, 0], ArrowUp: [0, 35], ArrowDown: [0, -35] };
        if (offsets[event.key]) {
            event.preventDefault();
            const [x, y] = offsets[event.key];
            cy.panBy({ x, y });
        } else if (event.key === "+" || event.key === "-") {
            event.preventDefault();
            zoom(event.key === "+" ? zoomStep : 1 / zoomStep);
        }
    }

    return (
        <div className={hidden ? styles.stashedCanvas : undefined} aria-hidden={hidden || undefined}>
            <div className={styles.toolbar} aria-label="Graph controls">
                <button type="button" onClick={() => zoom(1 / zoomStep)} disabled={!!rendererError}>Zoom out</button>
                <button type="button" onClick={() => zoom(zoomStep)} disabled={!!rendererError}>Zoom in</button>
                {actions}
                <span className={styles.scale}>
                    {mode === "token" ? "Token view" : scale < 0.85 ? "Landscape view" : "Community view"}
                    {" · "}{Math.round(scale * 100)}%
                </span>
            </div>
            <div className={styles.canvasFrame}>
                <div
                    ref={container} className={styles.canvas} tabIndex={hidden ? -1 : 0} role="region"
                    aria-label={mode === "community" ? "Community graph" : "Token-neighbour graph"}
                    onKeyDown={keyboard}
                />
                {rendererError && <p className={styles.canvasMessage} role="status">{rendererError}</p>}
            </div>
        </div>
    );
}
