"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import R020GraphCanvas from "./R020GraphCanvas";
import R020SemanticExplorer from "./R020SemanticExplorer";
import {
    communityIndex, communityLabel, decisionLabel, networkKey, readJson, readTokens,
    stateLabel, traceToken, validateIndex,
} from "./r020ExplorerData";
import styles from "./SemanticNetworkExplorer.module.css";

const start = { decision: 6, state: 0, sector: "positive_head" };
const guides = [
    { ...start, community: 4, label: "Follow the disruption branch" },
    { decision: 32, state: 5, sector: "positive_head", community: 12, label: "Inspect the mathematics branch" },
];
const colours = ["#61bd9e", "#9c9adb", "#e19a67", "#6bafdd", "#c4c77a", "#d39bae", "#8ed0c7"];
const count = (value) => value.toLocaleString("en-GB");
const decimal = (value) => value.toFixed(4);
const sectorName = (sector) => sector === "positive_head" ? "Positive head" : "Negative tail";
const runPath = "/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/";
const repository = "https://github.com/arh789/llm_topology/blob/";

async function readIndex(file, signal) {
    return validateIndex(await readJson(file, signal));
}

function useAsset(file, load = readJson) {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        load(file, controller.signal).then(
            (value) => { if (!controller.signal.aborted) setResult({ file, attempt, value }); },
            (error) => { if (!controller.signal.aborted) setResult({ file, attempt, error: error.message }); },
        );
        return () => controller.abort();
    }, [file, load, attempt]);

    return {
        ...(result?.file === file && result.attempt === attempt ? result : {}),
        retry: () => setAttempt((current) => current + 1),
    };
}

function AssetStatus({ asset, label }) {
    return asset.error ? (
        <div className={styles.status} role="alert">
            <p>{asset.error}</p>
            <button type="button" onClick={asset.retry}>Retry</button>
        </div>
    ) : <p className={styles.status} role="status">{label}</p>;
}

function SourceLink({ commit, file, line, children }) {
    return (
        <a href={repository + commit + runPath + file + (line ? "#L" + line : "")}
            target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

function stateName(index, recorded) {
    const caption = recorded === "input_embedding" ? "Input embedding"
        : recorded.replace(/^block_(\d+)_output$/, "Block $1 output")
            .replace(/^final_norm_after_block_(\d+)$/, "Final normalisation after block $1");
    return stateLabel(index) + " · " + caption;
}

function networkElements(graph) {
    // The layout sees the complete graph. Exploration only changes visibility.
    const ordered = [...graph.nodes].sort((a, b) => a.module - b.module || a.id - b.id);
    const nodes = ordered.map((node, index) => {
        const angle = 2 * Math.PI * index / ordered.length;
        return {
            data: {
                id: String(node.id), label: "C" + node.id + "  " + communityLabel(node, 2),
                shortLabel: "C" + node.id, compactLabel: "C" + node.id + " " + communityLabel(node, 1),
                diameter: 24 + 7 * Math.sqrt(node.weightedDegree),
                colour: colours[node.module % colours.length],
            },
            position: { x: 168 * Math.cos(angle), y: 168 * Math.sin(angle) },
        };
    });
    return nodes.concat(graph.edges.map((edge) => ({
        data: {
            id: "C" + edge.a + "-C" + edge.b, source: String(edge.a), target: String(edge.b),
            affinity: edge.affinity, width: 0.8 + Math.min(5, edge.affinity * 2.8),
        },
    })));
}

function tokenElements(data, token) {
    const items = [token, ...token.neighbours.map((edge) => data.tokens.get(edge.id))];
    return items.map((item, index) => {
        const angle = 2 * Math.PI * (index - 1) / token.neighbours.length - Math.PI / 2;
        const radius = index ? 125 : 0;
        return {
            data: {
                id: String(item.id), label: data.vocabulary[item.id], diameter: index ? 28 : 45,
                colour: item.community === token.community ? colours[0] : colours[1],
            },
            position: { x: radius * Math.cos(angle), y: radius * Math.sin(angle) },
        };
    }).concat(token.neighbours.map((edge) => ({
        data: {
            id: "T" + token.id + "-T" + edge.id, source: String(token.id), target: String(edge.id),
            width: 1 + Math.max(0, edge.cosine) * 4,
        },
        classes: "directed" + (data.tokens.get(edge.id).community === token.community ? "" : " boundary"),
    })));
}

function supportingTokens(data, [a, b]) {
    const pointsAcross = (token, target) => token.neighbours.some(({ id }) => data.tokens.get(id).community === target);
    return [...data.byCommunity.get(a).filter((token) => pointsAcross(token, b)),
        ...data.byCommunity.get(b).filter((token) => pointsAcross(token, a))];
}

function TokenView({ data, graph, request, onExit, commit }) {
    const [pair, setPair] = useState(request.pair);
    const support = useMemo(() => pair ? supportingTokens(data, pair) : null, [data, pair]);
    const [selected, setSelected] = useState(() => request.tokenId ?? support[0].id);
    const [query, setQuery] = useState("");
    const [fit, setFit] = useState(0);
    const token = data.tokens.get(selected);
    const elements = useMemo(() => tokenElements(data, token), [data, token]);
    const members = support ?? data.byCommunity.get(token.community);
    const term = query.trim().toLocaleLowerCase();
    const matches = members.filter(({ id }) => !term || String(id) === term ||
        data.vocabulary[id].toLocaleLowerCase().includes(term)).sort((a, b) => a.rank - b.rank);
    const currentMatch = matches.some(({ id }) => id === selected);

    function select(id) {
        setSelected(id);
        setQuery("");
        if (support && !support.some((token) => token.id === id)) setPair(null);
    }

    return (
        <>
            <R020GraphCanvas elements={elements} mode="token" focus={selected} onSelect={select} fitRequest={fit}
                actions={<>
                    <button type="button" onClick={() => setFit((value) => value + 1)}>Fit view</button>
                    <button type="button" onClick={onExit}>Back to communities</button>
                </>}
            />
            <div className={styles.legend}>
                <span>Arrows follow the selected token&apos;s recorded neighbour ranks.</span>
                <span>Dashed edges cross a community boundary.</span>
            </div>
            <div className={styles.details}>
                <div className={styles.detail}>
                    <h4><code>{data.vocabulary[token.id]}</code> <span>· C{token.community}</span></h4>
                    <p>Token ID {token.id} · Target cosine {decimal(token.cosine)} · Sector rank {token.rank}</p>
                    <div className={styles.memberPicker}>
                        {pair && <p>Supporting token sources for C{pair[0]} and C{pair[1]}. <button type="button"
                            onClick={() => { setPair(null); setQuery(""); }}>Show community members</button></p>}
                        <label>Filter {count(members.length)} {pair ? "supporting tokens" : "community members"}
                            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
                                placeholder="Token text or ID" />
                        </label>
                        <label>Inspect a token
                            <select value={currentMatch ? selected : ""}
                                disabled={!matches.length} onChange={(event) => select(Number(event.target.value))}>
                                {!currentMatch &&
                                    <option value="" disabled>{matches.length ? "Choose a matching token" : "No matches"}</option>}
                                {matches.map(({ id }) => <option key={id} value={id}>{data.vocabulary[id]} · ID {id}</option>)}
                            </select>
                        </label>
                    </div>
                    <p className={styles.provenance}>
                        {graph.key} · Records <code>nodes.csv.gz</code> and <code>edges.csv.gz</code>.
                        {" "}<SourceLink commit={commit} file="artifact_index.json">Raw file provenance</SourceLink>
                    </p>
                </div>
                <div className={styles.detail}>
                    <h4>Recorded nearest neighbours</h4>
                    <ol className={styles.connections}>
                        {token.neighbours.map((edge, index) => (
                            <li key={edge.id}>
                                <button type="button" onClick={() => select(edge.id)}>
                                    <span>
                                        <code>{data.vocabulary[edge.id]}</code>
                                        <small>Rank {index + 1} · C{data.tokens.get(edge.id).community} · ID {edge.id}</small>
                                    </span>
                                    <strong title="Token-to-token cosine">{decimal(edge.cosine)}</strong>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </>
    );
}

function TokenLoader({ graph, request, commit, onExit }) {
    const asset = useAsset(graph.key + ".bin.gz", readTokens);
    if (!asset.value) {
        return (
            <>
                <div className={styles.toolbar}><button type="button" onClick={onExit}>Back to communities</button></div>
                <AssetStatus asset={asset} label="Loading recorded token neighbours…" />
            </>
        );
    }
    return <TokenView data={asset.value} graph={graph} request={request} commit={commit} onExit={onExit} />;
}

function CommunityView({ graph, requestedId, commit, navigate }) {
    const index = useMemo(() => communityIndex(graph), [graph]);
    const elements = useMemo(() => networkElements(graph), [graph]);
    const central = [...graph.nodes].sort((a, b) => b.weightedDegree - a.weightedDegree || a.id - b.id)[0].id;
    const initialId = index.nodes.has(requestedId) ? requestedId : central;
    const seed = () => new Set([initialId, ...index.edgesByNode.get(initialId)
        .slice(0, initialId === requestedId ? undefined : 4).map((edge) => edge.neighbour)]);
    const [focusId, setFocusId] = useState(initialId);
    const [visible, setVisible] = useState(seed);
    const [fit, setFit] = useState(0);
    const [tokenRequest, setTokenRequest] = useState(null);
    const [bridges, setBridges] = useState(null);
    const graphStart = useRef(null);
    const selected = index.nodes.get(focusId);
    const connections = index.edgesByNode.get(focusId);
    const visibleEdges = graph.edges.filter((edge) => visible.has(edge.a) && visible.has(edge.b)).length;
    const next = graph.matches[focusId] ?? [];

    function expand(id) {
        setFocusId(id);
        setVisible((current) => new Set([id, ...current, ...index.edgesByNode.get(id).map((edge) => edge.neighbour)]));
    }

    function reset() {
        setFocusId(initialId);
        setVisible(seed());
        setFit((value) => value + 1);
    }

    function openTokens(request) {
        setTokenRequest(request);
        graphStart.current?.focus();
    }

    return (
        <div className={styles.graphStart} ref={graphStart} tabIndex={-1} role="group" aria-label="R020 graph">
            <R020GraphCanvas elements={elements} visible={visible} mode="community" focus={focusId}
                hidden={tokenRequest !== null} fitRequest={fit} onSelect={expand} onBridges={setBridges}
                onDeepZoom={() => openTokens({ tokenId: selected.representatives[0][0] })}
                actions={<>
                    <button type="button" onClick={reset}>Reset view</button>
                    <button type="button" onClick={() => expand(focusId)}>Expand neighbours</button>
                    <button type="button" onClick={() => {
                        setVisible(new Set(index.nodes.keys()));
                        setFit((value) => value + 1);
                    }}>Show full network</button>
                    <button type="button" className={styles.primary}
                        onClick={() => openTokens({ tokenId: selected.representatives[0][0] })}>Inspect tokens</button>
                </>}
            />
            {tokenRequest === null ? (
                <>
                    <div className={styles.legend} aria-live="polite">
                        <span><strong>{visible.size} of {graph.nodes.length}</strong> communities ·{" "}
                            <strong>{visibleEdges} of {graph.edges.length}</strong> connections visible</span>
                        <span>Link width reflects normalised affinity. Node size reflects weighted degree.
                            Colours mark structural modules.</span>
                    </div>
                    <div className={styles.details}>
                        <div className={styles.detail}>
                            <label>Inspect any community
                                <select value={focusId} onChange={(event) => expand(Number(event.target.value))}>
                                    {graph.nodes.map((node) => <option key={node.id} value={node.id}>
                                        C{node.id} · {communityLabel(node)} ({count(node.size)} tokens)
                                    </option>)}
                                </select>
                            </label>
                            <h4>C{selected.id} <span>· {count(selected.size)} tokens</span></h4>
                            <div className={styles.stats}>
                                <span>Mean target cosine {decimal(selected.meanTargetCosine)}</span>
                                <span>Weighted degree {decimal(selected.weightedDegree)}</span>
                                {bridges && <span>Relative betweenness {decimal(bridges.get(selected.id))}</span>}
                            </div>
                            <p className={styles.tokenCaption}>Representative tokens</p>
                            <div className={styles.tokens}>
                                {selected.representatives.map(([id, token]) =>
                                    <button type="button" key={id} onClick={() => openTokens({ tokenId: id })}
                                        aria-label={"Inspect token " + token + ", ID " + id}>
                                        <code>{token}</code>
                                    </button>)}
                            </div>
                            <p className={styles.tokenCaption}>Most extreme target cosine</p>
                            <div className={styles.tokens}>
                                {selected.extremes.map(([id, token]) => <code key={id}>{token}</code>)}
                            </div>
                            <p className={styles.provenance}>
                                <SourceLink commit={commit} file="community_nodes.csv" line={selected.sourceLine}>
                                    Original community record
                                </SourceLink>
                            </p>
                        </div>
                        <div className={styles.detail}>
                            <h4>Measured connections for C{focusId}</h4>
                            {connections.length ? (
                                <ul className={styles.connections}>
                                    {connections.map((edge) => (
                                        <li key={edge.neighbour} className={styles.communityConnection}>
                                            <button type="button" onClick={() => expand(edge.neighbour)}>
                                                <span>C{edge.neighbour} · {communityLabel(index.nodes.get(edge.neighbour))}
                                                    <small>Affinity {decimal(edge.affinity)} · Mean cosine {decimal(edge.meanCosine)}</small>
                                                </span>
                                                <strong title="Undirected token edges">{count(edge.count)}</strong>
                                            </button>
                                            <div className={styles.connectionEvidence}>
                                                <button type="button" onClick={() => openTokens({ pair: [edge.a, edge.b] })}
                                                    aria-label={"Inspect supporting tokens for C" + focusId + " and C" + edge.neighbour}>
                                                    Supporting tokens
                                                </button>
                                                <SourceLink commit={commit} file="community_edges.csv" line={edge.sourceLine}>Record</SourceLink>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>This community has no recorded links to other communities in this network.</p>}
                        </div>
                    </div>
                    <div className={styles.matches}>
                        <h4>Across states and decisions</h4>
                        <p>Derived matches use shared token IDs between adjacent networks.</p>
                        {next.length ? <ul>
                            {next.map((match) => (
                                <li key={match.key}>
                                    <span>{match.kind === "state" ? "Next transformer state" : "Next generation decision"}</span>
                                    {match.targetId === null ? <span>No shared tokens with a target community</span> : (
                                        <>
                                            <button type="button" onClick={() => navigate({
                                                decision: match.decision, state: match.state,
                                                sector: graph.sector, community: match.targetId,
                                            })}>
                                                Open {decisionLabel(match.decision)} {stateLabel(match.state)} C{match.targetId}
                                            </button>
                                            <span>{count(match.shared)} shared tokens · Jaccard {decimal(match.jaccard)}</span>
                                        </>
                                    )}
                                    <SourceLink commit={commit} file="community_transition_evidence.csv" line={match.sourceLine}>Evidence</SourceLink>
                                </li>
                            ))}
                        </ul> : <p>This is the final recorded state and generation decision.</p>}
                    </div>
                </>
            ) : <TokenLoader graph={graph} request={tokenRequest} commit={commit} onExit={() => {
                setTokenRequest(null);
                graphStart.current?.focus();
            }} />}
        </div>
    );
}

function Explorer({ index }) {
    const [selection, setSelection] = useState(start);
    const [revision, setRevision] = useState(0);
    const networkBar = useRef(null);
    const decision = index.decisions[selection.decision - 1];
    const asset = useAsset(decisionLabel(selection.decision) + ".json");
    const key = networkKey(selection.decision, selection.state, selection.sector);
    const graph = asset.value?.[key];

    function navigate(next, reveal = true) {
        setSelection(next);
        setRevision((value) => value + 1);
        if (reveal) networkBar.current?.focus();
    }

    function choose(field, value) {
        navigate({ ...selection, [field]: value, community: undefined }, false);
    }

    return (
        <>
            <div className={styles.filters}>
                <label>Generation decision
                    <select value={selection.decision} onChange={(event) => choose("decision", Number(event.target.value))}>
                        {index.decisions.map(({ id, input, prediction }) => <option key={id} value={id}>
                            {decisionLabel(id)} · {traceToken(input)} predicts {traceToken(prediction)}
                        </option>)}
                    </select>
                </label>
                <label>Transformer state
                    <select value={selection.state} onChange={(event) => choose("state", Number(event.target.value))}>
                        {index.states.map((state, i) => <option key={state} value={i}>{stateName(i, state)}</option>)}
                    </select>
                </label>
                <label>Cosine sector
                    <select value={selection.sector} onChange={(event) => choose("sector", event.target.value)}>
                        <option value="positive_head">Positive head</option>
                        <option value="negative_tail">Negative tail</option>
                    </select>
                </label>
            </div>
            <div ref={networkBar} tabIndex={-1} className={styles.networkBar}>
                <p><b>{decisionLabel(decision.id)} · {stateLabel(selection.state)} · {sectorName(selection.sector)}</b>
                    {" "}<span>Last input token <code>{traceToken(decision.input)}</code> · Next token <code>{traceToken(decision.prediction)}</code></span>
                </p>
                {graph && <SourceLink commit={index.sourceCommit} file="network_index.csv" line={graph.sourceLine}>Network record</SourceLink>}
            </div>
            {graph ? <CommunityView key={key + "/" + revision} graph={graph} commit={index.sourceCommit}
                requestedId={selection.community} navigate={navigate} />
                : <AssetStatus asset={asset.value ? { ...asset, error: "This network is missing from the data export." } : asset}
                    label="Loading the measured network…" />}
            <div className={styles.footer}>
                <div className={styles.guide}>
                    <span>From the article</span>
                    {guides.map((guide) => <button key={guide.label} type="button" onClick={() => navigate(guide)}>
                        {guide.label}
                    </button>)}
                </div>
                <p>R020 recorded {count(index.counts.networks)} networks across {index.decisions.length} decisions,{" "}
                    {index.states.length} states and two cosine sectors. Each network has its own community IDs.
                    Affinity divides the number of links between two communities by the geometric mean of their sizes.
                    {" "}<SourceLink commit={index.sourceCommit} file="measurement_results.json">Measurement record</SourceLink>
                    {" "} (repository access required).</p>
            </div>
        </>
    );
}

export default function SemanticNetworkExplorer() {
    const index = useAsset("index.json", readIndex);
    const semantic = useAsset("semantic.json");
    const [showRaw, setShowRaw] = useState(false);
    const ready = index.value && semantic.value;
    const pending = !index.value || index.error ? index : semantic;
    return (
        <section className={styles.explorer} id="r020-explorer" aria-labelledby="r020-explorer-title">
            <header className={styles.header}>
                <h3 id="r020-explorer-title">Explore the reconstructed semantic map</h3>
                <p>Start with interpreted concepts, follow their measured relationships, then inspect the underlying evidence.</p>
            </header>
            {ready ? <>
                <R020SemanticExplorer data={semantic.value} index={index.value} />
                <details className={styles.rawDisclosure} onToggle={(event) => setShowRaw(event.currentTarget.open)}>
                    <summary>Inspect the underlying measured community networks</summary>
                    <div className={styles.rawIntroduction}>
                        <p>This evidence view retains every selected token community, including unresolved,
                            formatting and punctuation structures. It supports audit rather than semantic discovery.</p>
                    </div>
                    {showRaw && <Explorer index={index.value} />}
                </details>
            </> : <AssetStatus asset={pending} label="Loading R020 semantic data…" />}
        </section>
    );
}
