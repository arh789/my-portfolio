"use client";

import { useMemo, useState } from "react";
import R020GraphCanvas from "./R020GraphCanvas";
import { decisionLabel, stateLabel, traceToken } from "./r020ExplorerData";
import styles from "./SemanticNetworkExplorer.module.css";

const runPath = "/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/";
const repository = "https://github.com/arh789/llm_topology/blob/main";
const preferredStart = "connection_crossing";
const groupColours = {
    connection: "#f1d768",
    movement: "#63c5a5",
    place: "#83a9e3",
    people: "#cf94c7",
    environment: "#78bd87",
    constraint: "#e38f6d",
    response: "#d7ad68",
    activity: "#9e9bdd",
    adjacent: "#87968e",
};
const scopeKinds = {
    question: new Set(["question_related"]),
    adjacent: new Set(["question_related", "adjacent_cross_domain"]),
    all: new Set(["question_related", "adjacent_cross_domain", "anti_aligned_candidate"]),
};
const kindNames = {
    question_related: "prompt-related candidate",
    adjacent_cross_domain: "adjacent cross-domain candidate",
    anti_aligned_candidate: "anti-aligned candidate",
};
const count = (value) => value.toLocaleString("en-GB");
const unit = (value, singular) => `${value} ${singular}${value === 1 ? "" : "s"}`;

function sourceHref(file) {
    return repository + runPath + file;
}

function evidenceMatches(item, scope, phase, decision) {
    return scopeKinds[scope].has(item.kind) && (phase === "all" || item.phase === phase)
        && (decision === 0 || item.decision === decision);
}

function buildView(data, scope, phase, decision) {
    const sourceConcepts = new Map(data.concepts.map((concept) => [concept.id, concept]));
    const relationships = data.relationships.map((relationship) => {
        const evidence = relationship.evidence.filter((item) => evidenceMatches(item, scope, phase, decision));
        if (!evidence.length) return null;
        return {
            ...relationship,
            evidence,
            evidenceCount: evidence.length,
            tokenEdges: evidence.reduce((total, item) => total + item.tokenEdges, 0),
            meanAffinity: evidence.reduce((total, item) => total + item.affinity, 0) / evidence.length,
            decisions: [...new Set(evidence.map((item) => item.decision))].sort((a, b) => a - b),
            states: [...new Set(evidence.map((item) => item.state))].sort((a, b) => a - b),
            kinds: [...new Set(evidence.map((item) => item.kind))],
        };
    }).filter(Boolean);
    const active = new Set(relationships.flatMap(({ source, target }) => [source, target]));
    const degree = new Map([...active].map((id) => [id, 0]));
    for (const edge of relationships) {
        const weight = Math.log1p(edge.tokenEdges) + edge.evidenceCount;
        degree.set(edge.source, degree.get(edge.source) + weight);
        degree.set(edge.target, degree.get(edge.target) + weight);
    }
    const concepts = [...active].map((id) => ({ ...sourceConcepts.get(id), degree: degree.get(id) }))
        .sort((a, b) => b.degree - a.degree || a.label.localeCompare(b.label));
    const byRole = new Map(concepts.map((concept, index) => [concept.id, { ...concept, index }]));
    const edgesByRole = new Map(concepts.map(({ id }) => [id, []]));
    for (const edge of relationships) {
        edgesByRole.get(edge.source).push(edge);
        edgesByRole.get(edge.target).push(edge);
    }
    for (const edges of edgesByRole.values()) {
        edges.sort((a, b) => b.evidenceCount - a.evidenceCount || b.tokenEdges - a.tokenEdges);
    }
    return { concepts, relationships, byRole, edgesByRole };
}

function semanticElements(view) {
    const nodes = view.concepts.map((concept, index) => {
        const angle = 2 * Math.PI * index / view.concepts.length;
        const displayLabel = concept.label.replace(" and ", "\nand ");
        return {
            data: {
                id: String(index),
                label: displayLabel,
                shortLabel: displayLabel,
                compactLabel: displayLabel,
                diameter: 38 + Math.min(30, 4.5 * Math.sqrt(concept.degree)),
                colour: groupColours[concept.group] ?? groupColours.adjacent,
            },
            classes: "semantic",
            position: { x: 180 * Math.cos(angle), y: 180 * Math.sin(angle) },
        };
    });
    const edges = view.relationships.map((edge) => ({
        data: {
            id: edge.id,
            source: String(view.byRole.get(edge.source).index),
            target: String(view.byRole.get(edge.target).index),
            affinity: Math.log1p(edge.evidenceCount),
            width: 1.1 + Math.min(6, Math.sqrt(edge.evidenceCount) * .75),
        },
        classes: edge.kinds.includes("anti_aligned_candidate") ? "boundary" : "",
    }));
    return nodes.concat(edges);
}

function evidenceTitle(item) {
    return decisionLabel(item.decision) + " · " + stateLabel(item.state) + " · "
        + (item.sector === "positive_head" ? "positive" : "negative")
        + " · C" + item.communityA + "–C" + item.communityB;
}

function defaultSelection(view) {
    if (!view.concepts.length) {
        return { role: preferredStart, visibleRoles: new Set(), selectedEdge: "" };
    }
    const role = view.byRole.has(preferredStart) ? preferredStart : view.concepts[0].id;
    return {
        role,
        visibleRoles: new Set(view.concepts.map(({ id }) => id)),
        selectedEdge: view.edgesByRole.get(role)[0]?.id ?? "",
    };
}

export default function R020SemanticExplorer({ data, index }) {
    const [scope, setScope] = useState("question");
    const [phase, setPhase] = useState("all");
    const [decision, setDecision] = useState(0);
    const view = useMemo(() => buildView(data, scope, phase, decision), [data, scope, phase, decision]);
    const [focusRole, setFocusRole] = useState(() => defaultSelection(view).role);
    const [visibleRoles, setVisibleRoles] = useState(() => defaultSelection(view).visibleRoles);
    const [selectedEdge, setSelectedEdge] = useState(() => defaultSelection(view).selectedEdge);
    const [fit, setFit] = useState(0);
    const elements = useMemo(() => semanticElements(view), [view]);

    function resetSelection(nextView) {
        const next = defaultSelection(nextView);
        setFocusRole(next.role);
        setVisibleRoles(next.visibleRoles);
        setSelectedEdge(next.selectedEdge);
        setFit((value) => value + 1);
    }

    const controls = <>
        <div className={styles.semanticIntro}>
            <p><strong>Derived view.</strong> Each node consolidates classified communities. Each line retains
                direct measured community links and exposes their evidence below.</p>
            <span>{view.concepts.length} concepts · {view.relationships.length} relationships</span>
        </div>
        <div className={styles.semanticFilters}>
            <label>Map scope
                <select value={scope} onChange={(event) => {
                    const nextScope = event.target.value;
                    setScope(nextScope);
                    resetSelection(buildView(data, nextScope, phase, decision));
                }}>
                    <option value="question">Prompt-related candidates</option>
                    <option value="adjacent">Add adjacent cross-domain candidates</option>
                    <option value="all">Add anti-aligned candidates</option>
                </select>
            </label>
            <label>Transformer phase
                <select value={phase} onChange={(event) => {
                    const nextPhase = event.target.value;
                    setPhase(nextPhase);
                    resetSelection(buildView(data, scope, nextPhase, decision));
                }}>
                    <option value="contextual">Contextual states S01–S05</option>
                    <option value="input">Input embedding S00</option>
                    <option value="output_proximal">Output-proximal S06–S07</option>
                    <option value="all">All recorded states</option>
                </select>
            </label>
            <label>Generation decision
                <select value={decision} onChange={(event) => {
                    const nextDecision = Number(event.target.value);
                    setDecision(nextDecision);
                    resetSelection(buildView(data, scope, phase, nextDecision));
                }}>
                    <option value={0}>All 32 decisions</option>
                    {index.decisions.map(({ id, input, prediction }) => <option key={id} value={id}>
                        {decisionLabel(id)} · {traceToken(input)} predicts {traceToken(prediction)}
                    </option>)}
                </select>
            </label>
        </div>
    </>;

    if (!view.concepts.length) {
        return <>
            {controls}
            <p className={styles.status}>No classified semantic relationships match these filters. Adjust a filter to continue.</p>
        </>;
    }

    const focus = view.byRole.get(focusRole) ?? view.byRole.get(view.concepts[0].id);
    const concept = focus;
    const connections = view.edgesByRole.get(concept.id);
    const relationship = view.relationships.find((edge) => edge.id === selectedEdge) ?? connections[0];
    const visible = new Set([...visibleRoles].map((id) => view.byRole.get(id)?.index).filter(Number.isInteger));

    function chooseConcept(role, includeNeighbours = false) {
        const edges = view.edgesByRole.get(role) ?? [];
        setFocusRole(role);
        setSelectedEdge(edges[0]?.id ?? "");
        setVisibleRoles((current) => {
            const next = new Set([...current, role]);
            if (includeNeighbours) {
                edges.forEach((edge) => next.add(edge.source === role ? edge.target : edge.source));
            }
            return next;
        });
    }

    function reset() {
        resetSelection(view);
    }

    return (
        <>
            {controls}
            <R020GraphCanvas elements={elements} visible={visible} mode="semantic" focus={concept.index}
                fitRequest={fit} onSelect={(id) => chooseConcept(view.concepts[id].id)}
                actions={<>
                    <button type="button" onClick={reset}>Reset view</button>
                    <button type="button" onClick={() => chooseConcept(concept.id, true)}>Expand neighbours</button>
                    <button type="button" onClick={() => {
                        setVisibleRoles(new Set(view.concepts.map(({ id }) => id)));
                        setFit((value) => value + 1);
                    }}>Show full map</button>
                    <button type="button" onClick={() => setFit((value) => value + 1)}>Fit view</button>
                </>}
            />
            <div className={styles.legend} aria-live="polite">
                <span><strong>{visible.size} of {view.concepts.length}</strong> concepts visible</span>
                <span>Solid links aggregate aligned evidence. Dashed links include anti-aligned candidates.</span>
            </div>
            <div className={styles.details}>
                <div className={styles.detail}>
                    <label>Inspect a concept
                        <select value={concept.id} onChange={(event) => chooseConcept(event.target.value, true)}>
                            {view.concepts.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </select>
                    </label>
                    <h4>{concept.label}</h4>
                    <p>{concept.description}</p>
                    <p className={styles.tokenCaption}>Representative evidence terms</p>
                    <div className={styles.tokens}>
                        {concept.representativeTokens.map((token) => <code key={token}>{token}</code>)}
                    </div>
                </div>
                <div className={styles.detail}>
                    <h4>Related concepts</h4>
                    <ul className={styles.connections}>
                        {connections.map((edge) => {
                            const neighbour = edge.source === concept.id ? edge.target : edge.source;
                            const neighbourConcept = view.byRole.get(neighbour);
                            return <li key={edge.id}>
                                <button type="button" onClick={() => {
                                    setSelectedEdge(edge.id);
                                    setVisibleRoles((current) => new Set([...current, edge.source, edge.target]));
                                }}>
                                    <span>{neighbourConcept.label}
                                        <small>{unit(edge.evidenceCount, "measured link")} across {unit(edge.decisions.length, "decision")}</small>
                                    </span>
                                    <strong>{count(edge.tokenEdges)}</strong>
                                </button>
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
            {relationship && <section className={styles.semanticEvidence} aria-labelledby="semantic-evidence-title">
                <div>
                    <h4 id="semantic-evidence-title">
                        {view.byRole.get(relationship.source).label} ↔ {view.byRole.get(relationship.target).label}
                    </h4>
                    <p>{unit(relationship.evidenceCount, "directly measured community link")} · {count(relationship.tokenEdges)}
                        {" "}cross-community token edges · mean affinity {relationship.meanAffinity.toFixed(3)}</p>
                    <p className={styles.provenance}>Interpretation classes: {relationship.kinds.map((kind) =>
                        kindNames[kind]).join(", ")}.</p>
                </div>
                <ol className={styles.semanticEvidenceList}>
                    {[...relationship.evidence].sort((a, b) => b.tokenEdges - a.tokenEdges).map((item, evidenceIndex) => (
                        <li key={evidenceTitle(item) + "/" + evidenceIndex}>
                            <strong>{evidenceTitle(item)}</strong>
                            <span>{count(item.tokenEdges)} token edges · affinity {item.affinity.toFixed(3)}</span>
                            <span><code>{item.tokensA.join(" · ")}</code> ↔ <code>{item.tokensB.join(" · ")}</code></span>
                            <a href={sourceHref(item.sourceFile)} target="_blank" rel="noreferrer">Source record</a>
                        </li>
                    ))}
                </ol>
            </section>}
        </>
    );
}
