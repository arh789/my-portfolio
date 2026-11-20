const base = "/llm-topology-r020/";

export const decisionLabel = (decision) => "D" + String(decision).padStart(2, "0");
export const stateLabel = (state) => "S" + String(state).padStart(2, "0");
export const networkKey = (decision, state, sector) =>
    [decisionLabel(decision), stateLabel(state), sector === "positive_head" ? "p" : "n"].join("-");

export function traceToken(text) {
    return text.trim() || text.replaceAll("\n", "␤").replaceAll("\t", "⇥").replaceAll(" ", "␠") || "∅";
}

export function communityLabel(node, count = 3) {
    const words = node.representatives.slice(0, count).map(([, token]) => token.replace(/^␠+/, "") || token);
    return words.join(" · ") || "C" + node.id;
}

async function fetchAsset(file, signal) {
    const response = await fetch(base + file, { signal });
    if (!response.ok) throw Error("Could not load " + file + " (HTTP " + response.status + ").");
    return response;
}

export async function readJson(file, signal) {
    return (await fetchAsset(file, signal)).json();
}

export function validateIndex(index) {
    if (index.status !== "successful" || index.formatVersion !== 1 ||
        index.counts?.networks !== 512 || index.decisions?.length !== 32 ||
        index.states?.length !== 8 || index.k !== 10 ||
        index.semantic?.concepts !== 14 || index.semantic?.questionRelatedRelationships !== 28) {
        throw Error("The R020 data export requires a successful build.");
    }
    return index;
}

export function decodeTokenNetwork(buffer, key) {
    const view = new DataView(buffer);
    const headerSize = 10;
    const positive = buffer.byteLength >= headerSize && view.getUint8(6) === 0;
    if (buffer.byteLength < headerSize || view.getUint32(0) !== 0x52303230 ||
        view.getUint8(6) > 1 || networkKey(view.getUint8(4), view.getUint8(5),
            positive ? "positive_head" : "negative_tail") !== key) {
        throw Error("The token file does not match the selected network.");
    }
    const k = view.getUint8(7);
    const size = view.getUint16(8, true);
    const stride = 10 + k * 6;
    if (k !== 10 || buffer.byteLength !== headerSize + size * stride) {
        throw Error("The token file has the wrong record size.");
    }
    const tokens = new Map();
    const byCommunity = new Map();
    for (let i = 0; i < size; i++) {
        const start = headerSize + i * stride;
        const id = view.getUint16(start, true);
        const community = view.getUint16(start + 2, true);
        const rank = view.getUint16(start + 4, true);
        const cosine = view.getFloat32(start + 6, true);
        const neighbours = [];
        for (let edge = 0; edge < k; edge++) {
            const offset = start + 10 + edge * 6;
            neighbours.push({ id: view.getUint16(offset, true), cosine: view.getFloat32(offset + 2, true) });
        }
        const token = { id, community, rank, cosine, neighbours };
        if (tokens.has(id)) throw Error("A token ID appears twice in the selected network.");
        tokens.set(id, token);
        if (!byCommunity.has(community)) byCommunity.set(community, []);
        byCommunity.get(community).push(token);
    }
    for (const token of tokens.values()) {
        if (token.neighbours.some((edge) => !tokens.has(edge.id))) {
            throw Error("A recorded neighbour is missing from the token network.");
        }
    }
    return { tokens, byCommunity };
}

export async function readTokens(file, signal) {
    const [vocabulary, response] = await Promise.all([readJson("tokens.json", signal), fetchAsset(file, signal)]);
    if (typeof DecompressionStream === "undefined" || !response.body) {
        throw Error("This browser cannot decompress the R020 token files.");
    }
    const bytes = await new Response(response.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    return { ...decodeTokenNetwork(bytes, file.replace(".bin.gz", "")), vocabulary };
}

export function communityIndex(graph) {
    const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    const edgesByNode = new Map(graph.nodes.map((node) => [node.id, []]));
    for (const edge of graph.edges) {
        edgesByNode.get(edge.a).push({ ...edge, neighbour: edge.b });
        edgesByNode.get(edge.b).push({ ...edge, neighbour: edge.a });
    }
    for (const edges of edgesByNode.values()) {
        edges.sort((a, b) => b.affinity - a.affinity || a.neighbour - b.neighbour);
    }
    return { nodes, edgesByNode };
}
