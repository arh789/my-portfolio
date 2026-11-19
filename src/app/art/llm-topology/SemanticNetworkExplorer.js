"use client";

import { useState } from "react";
import styles from "./page.module.css";

// Every edge is a recorded cross-community token-neighbour count in ONE
// decision/state/sector network. C identifiers are local to that network.
// Source: R020_VERIFIED_CONSOLIDATED_SEMANTIC_MAP.md.
const networks = [
    {
        id: "city",
        tab: "City",
        source: "D03 / S00 / positive cosine",
        title: "A city and its surroundings",
        note: "The initial embedding neighbourhood for 'city' separates settlements, built places, geography, routes and inhabitants.",
        nodes: [
            { id: "C3", label: "Settlements", words: "city, cities, villages, towns", x: 540, y: 175 },
            { id: "C1", label: "Built places", words: "hotels, buildings, shops, rooms", x: 295, y: 340 },
            { id: "C4", label: "Land / water", words: "ocean, lake, landscape", x: 795, y: 360 },
            { id: "C5", label: "Routes", words: "highway, railway, streets", x: 210, y: 555 },
            { id: "C9", label: "Inhabitants", words: "residents, citizens, settlers, people", x: 865, y: 560 },
        ],
        edges: [
            ["C3", "C1", 174],
            ["C3", "C4", 163],
            ["C3", "C5", 93],
            ["C3", "C9", 77],
            ["C1", "C4", 197],
            ["C1", "C5", 174],
        ],
        defaultNode: "C3",
    },
    {
        id: "bridge",
        tab: "Bridge",
        source: "D06 / S00 / positive cosine",
        title: "A bridge, and the less obvious branches",
        note: "The bridge neighbourhood extends beyond crossing a river: journeys connect with roads and boats, while disruption connects with rebuilding.",
        nodes: [
            { id: "C0", label: "Bridge", words: "bridge, traverse, junctions, crossing", x: 535, y: 315 },
            { id: "C3", label: "Journeys", words: "travel, voyage, trips, journey", x: 235, y: 175 },
            { id: "C4", label: "Disruption", words: "floods, catastrophe, disruption", x: 845, y: 175 },
            { id: "C1", label: "Components", words: "wires, rope, pipes, connectors", x: 860, y: 375 },
            { id: "C9", label: "Road / rail", words: "highway, road, railway", x: 165, y: 415 },
            { id: "C11", label: "Rebuilding", words: "reconstruction, renovation, restoration", x: 500, y: 70 },
            { id: "C2", label: "Boats", words: "boats and vessel vocabulary", x: 310, y: 570 },
            { id: "C5", label: "River / land", words: "river, landscape and terrain", x: 585, y: 550 },
            { id: "C7", label: "Buildings", words: "buildings and constructed places", x: 855, y: 560 },
            { id: "C8", label: "Courtyards", words: "courtyards and enclosed places", x: 1050, y: 645 },
        ],
        edges: [
            ["C0", "C3", 120],
            ["C0", "C4", 125],
            ["C0", "C1", 123],
            ["C3", "C9", 74],
            ["C4", "C11", 67],
            ["C3", "C11", 55],
            ["C2", "C5", 102],
            ["C2", "C9", 85],
            ["C5", "C7", 110],
            ["C7", "C8", 90],
        ],
        defaultNode: "C0",
    },
    {
        id: "river",
        tab: "River",
        source: "D10 / S00 / positive cosine",
        title: "A river leads into a different neighbourhood",
        note: "Water, inhabited places, journeys and disruption all connect with the river community in this separately recorded input embedding.",
        nodes: [
            { id: "C1", label: "River", words: "river, lake, ocean, valleys", x: 560, y: 225 },
            { id: "C0", label: "Water", words: "groundwater, drainage", x: 245, y: 460 },
            { id: "C3", label: "Places", words: "city, town, countryside", x: 870, y: 310 },
            { id: "C6", label: "Journeys", words: "trek, travel, crossing", x: 440, y: 570 },
            { id: "C9", label: "Disruption", words: "flood, storms, catastrophe", x: 860, y: 575 },
        ],
        edges: [
            ["C1", "C0", 136],
            ["C1", "C3", 165],
            ["C1", "C6", 76],
            ["C1", "C9", 84],
        ],
        defaultNode: "C1",
    },
    {
        id: "late",
        tab: "Later state",
        source: "D32 / S05 / positive cosine",
        title: "An unexplained mathematical connection",
        note: "Later in generation, a place-and-connection structure has a measured link to mathematical vocabulary. Its relevance remains an open question.",
        nodes: [
            { id: "C0", label: "Cities / buildings", words: "buildings, cities, towns, streets", x: 285, y: 265 },
            { id: "C4", label: "Places", words: "courtyard, terrace, café, ridge", x: 620, y: 170 },
            { id: "C7", label: "Connections", words: "links, relations, associations", x: 620, y: 440 },
            { id: "C12", label: "Mathematics", words: "Poisson, Riemannian, cohomology, manifold", x: 965, y: 565 },
        ],
        edges: [
            ["C0", "C4", 494],
            ["C0", "C7", 299],
            ["C4", "C7", 164],
            ["C7", "C12", 74],
        ],
        defaultNode: "C7",
    },
];

const sourceRoot =
    "https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/analysis/";

export default function SemanticNetworkExplorer() {
    const [networkIndex, setNetworkIndex] = useState(1);
    const [focusId, setFocusId] = useState("C0");
    const current = networks[networkIndex];
    const byId = Object.fromEntries(current.nodes.map((node) => [node.id, node]));
    const focus = byId[focusId] || byId[current.defaultNode];
    const related = current.edges.filter(([a, b]) => a === focus.id || b === focus.id);
    const neighbours = new Set(related.flatMap(([a, b]) => [a, b]));

    function chooseNetwork(index) {
        setNetworkIndex(index);
        setFocusId(networks[index].defaultNode);
    }

    return (
        <section className={styles.explorer} aria-label="Explore recorded R020 semantic networks">
            <div className={styles.explorerTop}>
                <div>
                    <p className={styles.kicker}>Measured communities and connections</p>
                    <h3>Explore the surrounding possibility space</h3>
                    <p>Switch the observed word or state. Select any node to inspect its vocabulary and measured connections. The less obvious branches are deliberately retained.</p>
                </div>
                <a
                    href={sourceRoot + "R020_RELATIONAL_SEMANTIC_MAPS.html"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.explorerFullLink}
                >
                    Open all 512 source networks ↗
                </a>
            </div>

            <div className={styles.networkTabs} role="tablist" aria-label="Recorded network snapshot">
                {networks.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={networkIndex === index}
                        aria-controls="r020-network-panel"
                        className={networkIndex === index ? styles.networkTabActive : styles.networkTab}
                        onClick={() => chooseNetwork(index)}
                    >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {item.tab}
                    </button>
                ))}
            </div>

            <div className={styles.graphHead} id="r020-network-panel" role="tabpanel">
                <div>
                    <h4>{current.title}</h4>
                    <p>{current.note}</p>
                </div>
                <span className={styles.graphProvenance}>{current.source}</span>
            </div>

            <div className={styles.networkFrame}>
                <div className={styles.networkOverflow}>
                    <svg className={styles.networkDiagram} viewBox="0 0 1160 725" role="img" aria-label={current.title + ": inspect selectable community nodes and measured connecting edges"}>
                        <defs>
                            <pattern id="semantic-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                                <path d="M 38 0 L 0 0 0 38" fill="none" stroke="#33463b" strokeWidth="0.6" opacity="0.35" />
                            </pattern>
                        </defs>
                        <rect width="1160" height="725" fill="#080d0b" />
                        <rect width="1160" height="725" fill="url(#semantic-grid)" />
                        {current.edges.map(([a, b, count]) => {
                            const left = byId[a];
                            const right = byId[b];
                            const highlighted = focus.id === a || focus.id === b;
                            const middleX = (left.x + right.x) / 2;
                            const middleY = (left.y + right.y) / 2;
                            return (
                                <g key={a + "-" + b} className={highlighted ? styles.edgeHighlighted : styles.edgeQuiet}>
                                    <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} strokeWidth={Math.max(2, Math.min(5.2, count / 48))} />
                                    <g transform={"translate(" + middleX + "," + middleY + ")"}>
                                        <rect x="-24" y="-12" width="48" height="24" rx="4" />
                                        <text textAnchor="middle" dy="4">{count}</text>
                                    </g>
                                    <title>{left.label + " ↔ " + right.label + ": " + count + " measured cross-community token-neighbour edges"}</title>
                                </g>
                            );
                        })}
                        {current.nodes.map((node) => {
                            const chosen = focus.id === node.id;
                            const connected = neighbours.has(node.id);
                            return (
                                <g
                                    key={node.id}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={"Inspect " + node.label + " community " + node.id}
                                    onClick={() => setFocusId(node.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            setFocusId(node.id);
                                        }
                                    }}
                                    className={chosen ? styles.nodeSelected : connected ? styles.nodeLinked : styles.nodeOther}
                                >
                                    <rect x={node.x - 95} y={node.y - 37} width="190" height="74" rx="7" />
                                    <text className={styles.nodeId} x={node.x - 80} y={node.y - 17}>{node.id}</text>
                                    <text className={styles.nodeName} x={node.x} y={node.y + 10} textAnchor="middle">{node.label}</text>
                                    <title>{node.label + ": " + node.words}</title>
                                </g>
                            );
                        })}
                    </svg>
                </div>
                <div className={styles.networkUnderlay}>
                    <span>Numbers on links = recorded cross-community token-neighbour edges</span>
                    <span>Node IDs are local to the selected snapshot</span>
                </div>
            </div>

            <div className={styles.networkDetails} aria-live="polite">
                <div className={styles.networkSelected}>
                    <span className={styles.detailEyebrow}>Selected community / {focus.id}</span>
                    <h5>{focus.label}</h5>
                    <p>{focus.words}</p>
                </div>
                <div className={styles.networkConnections}>
                    <span className={styles.detailEyebrow}>Its recorded connections</span>
                    {related.length ? (
                        <ul>
                            {related
                                .sort((a, b) => b[2] - a[2])
                                .map(([a, b, count]) => {
                                    const neighbour = byId[a === focus.id ? b : a];
                                    return <li key={a + b}><strong>{count}</strong><span>{neighbour.label} <small>({neighbour.id})</small></span></li>;
                                })}
                        </ul>
                    ) : (
                        <p>No displayed connection from this node in the selected edge subset.</p>
                    )}
                </div>
            </div>
            <p className={styles.networkCaption}>
                These are four <strong>separate</strong> recorded network snapshots, not a composite graph. S00 shows an input-token embedding neighbourhood; S05 shows a contextual transformer state. Descriptive community labels are interpretations of recorded token exemplars. <a href={sourceRoot + "R020_VERIFIED_CONSOLIDATED_SEMANTIC_MAP.md"} target="_blank" rel="noopener noreferrer">See original community IDs and source links ↗</a>
            </p>
        </section>
    );
}
