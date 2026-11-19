import Link from "next/link";
import styles from "./page.module.css";

// Editorial first draft. Research links point to the private working repository.
// Replace mutable main links with frozen public release references before publication.
const root = "https://github.com/arh789/llm_topology";
const research = root + "/blob/main";
const runs = research + "/single_prompt_topology/runs";
const r018 = runs + "/R018_olmo3-choke-point-barrier-spear-permutation-topology";
const r019 = runs + "/R019_olmo3-order-repeatability-control";
const r020 = runs + "/R020_pythia-70m-representation-output-contrast";
const analysis = r020 + "/analysis";
const pipeline = research + "/single_prompt_topology";
const ma = research + "/META_ANALYSIS.md";

const navigation = [
    ["question", "Why investigate?"],
    ["observation", "The R020 contrast"],
    ["measurement", "Why this pipeline?"],
    ["trajectory", "Experimental necessities"],
    ["human", "Human direction"],
    ["discovery", "The unexpected discovery"],
    ["evidence", "Reproducibility"],
];

const recurringEdges = [
    ["Settlements", "Movement / routes", "11 / 32"],
    ["Movement / routes", "Crossings / connections", "8 / 32"],
    ["Built places", "Movement / routes", "7 / 32"],
    ["Built places", "Inhabitants", "7 / 32"],
    ["Inhabitants", "Settlements", "6 / 32"],
    ["Settlements", "Crossings / connections", "5 / 32"],
];

const sourceOperations = [
    {
        step: "01 / Capture",
        category: "Measured",
        title: "Record the model's intermediate states",
        need: "Why capture states at all? The final response alone cannot reveal which relationships were available during processing or how the representation changed.",
        limit: "It creates a record at each generation decision, but an array of thousands of numerical coordinates is not yet a semantic map.",
        explanation: "The Python runner attaches forward hooks to the model's transformer blocks. During greedy generation it captures the states involved in choosing each of the 32 next tokens. The tested model is Pythia 70M; the agent interpreting its outputs is a separate system.",
        code: [
            "class BlockRecorder:",
            "    def __init__(self, model: Any) -> None:",
            "        self.outputs: list[torch.Tensor | None] = [None] * len(model.gpt_neox.layers)",
            "        self.handles = []",
            "        for index, layer in enumerate(model.gpt_neox.layers):",
            "            self.handles.append(layer.register_forward_hook(self._hook(index)))",
        ].join("\n"),
        source: pipeline + "/r020_pythia_generation_topology.py#L69-L74",
        sourceLabel: "R020 runner, lines 69–74",
        output: "32 generated-token decisions × eight recorded states",
    },
    {
        step: "02 / Project",
        category: "Derived",
        title: "Compare each state with the model's vocabulary",
        need: "Why project into vocabulary space? Transformer state coordinates are not human-readable semantic labels; a fixed embedding basis gives the states a shared set of token comparisons.",
        limit: "Similarity scores reveal candidate words but not their relational organisation. A negative cosine is geometric anti-alignment, not proof of suppression.",
        explanation: "Intermediate states are projected into a fixed input-embedding vocabulary basis. Cosine alignment makes related token neighbourhoods inspectable; opposite score sectors are geometric selections, not automatically meaningful positive or negative sentiments.",
        code: [
            "normalized_embeddings = F.normalize(embeddings, p=2, dim=1)",
            "normalized_primary = F.normalize(",
            "    primary[\"decision_states\"].to(normalized_embeddings.device), p=2, dim=2",
            ")",
            "with torch.inference_mode():",
            "    primary_scores = torch.einsum(",
            "        \"dsh,vh->dsv\", normalized_primary, normalized_embeddings",
            "    ).cpu().contiguous()",
        ].join("\n"),
        source: pipeline + "/r020_pythia_generation_topology.py#L840-L847",
        sourceLabel: "R020 runner, lines 840–847",
        output: "Vocabulary-score regions for every decision and state",
    },
    {
        step: "03 / Network",
        category: "Derived",
        title: "Construct neighbourhoods and detect communities",
        need: "Why build graphs? Ranking associated words cannot show which words cluster together, which groups connect, or how their organisation changes.",
        limit: "The algorithm gives measured partitions, not automatically meaningful concepts. The mapping still needs semantic interpretation.",
        explanation: "Selected tokens become graph nodes. The shared topology code builds neighbourhoods and partitions their connections into communities, retaining the original token and edge evidence before any semantic label is assigned.",
        code: [
            "seed = settings.random_seed + state_index * 2 + side_index",
            "communities = nx.community.louvain_communities(",
            "    graph,",
            "    weight=None,",
            "    resolution=settings.louvain_resolution,",
            "    seed=seed,",
            ")",
        ].join("\n"),
        source: pipeline + "/topology_core.py#L185-L191",
        sourceLabel: "Topology core, lines 185–191",
        output: "512 state/sector networks; 6,944 recorded communities",
    },
    {
        step: "04 / Reconstruct",
        category: "Interpreted",
        title: "Require measured edges before proposing a relation",
        need: "Why require actual links? An analysing agent can invent a plausible coherent story from suggestive tokens unless its proposed relationships are constrained by recorded edges.",
        limit: "The categories use post-hoc lexical anchors; unmatched communities remain unresolved. Human evaluation and perturbation tests are still necessary.",
        explanation: "The separate R020 analysis uses provisional semantic anchor families to screen pairs of different communities. A candidate link needs a measured intercommunity edge and must meet declared thresholds. Naming the relationship remains an interpretive act, not a direct read-out of a hidden concept.",
        code: [
            "const ca=cm.get(e.community_a),cb=cm.get(e.community_b);",
            "if(!ca||!cb)throw Error(\"Orphan community edge at \"+key);",
            "const affinity=e.token_edge_count/Math.sqrt(ca.size*cb.size);",
            "if(affinity<0.30||e.token_edge_count<30)continue;",
        ].join("\n"),
        source: analysis + "/R020_SEMANTIC_CONTINUITY_REPRODUCER.js#L64-L67",
        sourceLabel: "Semantic screen, lines 64–67",
        output: "Audited candidate relations; unresolved communities preserved",
    },
];

const epochs = [
    {
        number: "01",
        run: "R001–R008",
        title: "From an inaccessible answer to measurable structure",
        problem: "The generated answer does not show how internal representations change. Capturing numerical states alone also leaves them hard to interpret.",
        operation: "R001 captured transformer states. R002–R004 tested vocabulary boundaries; R002's strict consensus accepted none. R005 added relational graphs. R006 failed during processing; R007 built networks but failed final CSV validation; R008 corrected the record-counting error and completed validated exports.",
        finding: "The project could now inspect recorded states and the resulting 66 validated networks, without assuming that a community already had a semantic meaning.",
        remaining: "What did the 792 measured community instances actually represent?",
        documents: [
            ["R008 validated findings", runs + "/R008_lithium-chatgpt-readable-split-networks-validated-retry__20261112T200904Z_pythia-6.9b_52ff8f97c2/findings.md"],
            ["R008 manifest", runs + "/R008_lithium-chatgpt-readable-split-networks-validated-retry__20261112T200904Z_pythia-6.9b_52ff8f97c2/manifest.json"],
            ["Network implementation", pipeline + "/topology_core.py"],
        ],
    },
    {
        number: "02",
        run: "R009–R010",
        title: "From network measurement to semantic reconstruction",
        problem: "A community is a measured grouping, not automatically a topic. A list of communities cannot explain how meanings combine, compete or change through depth.",
        operation: "R009 examined and differentiated community types. R010 reconstructed candidate semantic parents and their relations, retaining conflict and reorganisation rather than discarding difficult evidence.",
        finding: "The investigation could now propose higher-order organisation rather than report tokens and clusters alone. Semantic naming remained post-measurement interpretation.",
        remaining: "Would those parent structures survive changes to the original prompt and observation window?",
        documents: [
            ["R009 community validation", runs + "/R009_lithium-community-semantic-classification/R009_COMPLETENESS_VERIFICATION.md"],
            ["R010 community–parent map", runs + "/R010_lithium-layerwise-latent-generative-structure/R010_LAYERWISE_COMMUNITY_PARENT_MAP.md"],
            ["Methods and interpretive limits", research + "/METHODOLOGY.md"],
        ],
    },
    {
        number: "03",
        run: "R011–R015",
        title: "From one plausible map to a test of recurrence",
        problem: "A convincing map from one prompt could simply be an artefact of the supplied words or their order. One observation cannot establish what persists.",
        operation: "R011 attempted larger-model instrumentation but failed at runtime. R012 used Qwen 7B to complete a whole-prompt paired comparison. R013 tested six permutations; R014 varied the third-concept context with overlapping probes; R015 replaced every seed with an adjacent concept without changing the measurement method.",
        finding: "R015 independently recovered counterparts of six R014 semantic parent families, while their connections changed. This supports local continuity of families, not one invariant parent-relation graph.",
        remaining: "Would a more distant semantic region and substantially larger model produce compatible evidence, and how much of the observed variation was measurement noise?",
        intervention: "The researcher then chose to interrogate the R014–R015 map for central, adjacent, emerging, missing and unexpectedly correlated structure, instead of accepting its first synthesis.",
        interventionSource: ma + "#ma-0099--next-inquiry-sda-3-interrogatives-applied-to-the-independently-reconstructed-r014r015-semantic-map",
        documents: [
            ["R011 runtime readiness", runs + "/R011_whole-prompt-semantic-perturbation-feasibility/R011_RUNTIME_READINESS.md"],
            ["R013 controlled plan", pipeline + "/R013_PLAN.md"],
            ["R014–R015 comparison", runs + "/R015_qwen-adjacent-neighbourhood-expansion/R014_R015_COMPARISON.md"],
        ],
    },
    {
        number: "04",
        run: "R016–R019",
        title: "From coherent interpretation to controlled reliability",
        problem: "A one-order reconstruction may look more stable than it is. Even a real difference between orderings would be ambiguous if identical repeats also diverged.",
        operation: "R016 established local feasibility for the open 32B model. R017 mapped one distant-region ordering and generated a specific tactical candidate. R018 measured all six orders of those concepts. R019 repeated each tested ordering three times to establish the within-condition noise floor.",
        finding: "R018 recovered recurring semantic families but strongly order-conditioned relations. R019 measured exact repeatability in that local setup, excluding the tested runtime variability as the explanation for its order effects.",
        remaining: "These experiments did not generate response tokens. What could be recovered from a model's representations when its generated answer failed?",
        documents: [
            ["R017 one-order reconstruction", runs + "/R017_olmo3-choke-point-barrier-spear-semantic-map/R017_SEMANTIC_RECONSTRUCTION.md"],
            ["R018 permutation comparisons", r018 + "/permutation_invariance.csv"],
            ["R019 repeatability control", r019 + "/R019_RESULT.json"],
        ],
    },
    {
        number: "05",
        run: "R020",
        title: "From recoverable structure to what a model expresses",
        problem: "A map of internal associations does not tell us whether the model can organise and express them usefully in an answer. Earlier no-generation controls did not test that contrast.",
        operation: "R020 deliberately used a much smaller Pythia 70M model and followed all 32 token-generation decisions through eight states each. It compared the circular generated answer with relations reconstructed from measured community networks.",
        finding: "Settlement–movement and movement–crossing candidates recur across generation even though the response never explains their function. The reconstruction and independent audit establish the candidate relations within the stated thresholds.",
        remaining: "Their recurrence does not prove one continuous causal explanation. Whether the recovered information is useful remains a human judgement; continuous integration is a separate research question, not a requirement for recognising the finding.",
        intervention: "The human challenged the agent's attempt to require continuous semantic integration before the R020 result could count.",
        interventionSource: ma + "#ma-0127--methodological-correction-r020-conclusion-and-needless-integration-hedging",
        documents: [
            ["R020 measured data", r020 + "/generation_trace.csv"],
            ["Generation-wide reconstruction", analysis + "/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md"],
            ["Independent audit", analysis + "/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md"],
        ],
    },
];

const researchLinks = [
    {
        group: "Start here",
        items: [
            ["Research repository", root, "Canonical project source, currently private"],
            ["Official article outline", research + "/ARTICLE_OUTLINE_OFFICIAL.md", "Governing question and human-learning structure"],
            ["Claim–evidence index", research + "/ARTICLE_EVIDENCE_INDEX.md", "C1–C10 mapped to evidence and interpretive status"],
            ["Report-status register", research + "/REPORT_STATUS.md", "Current results, historical reports and supersession"],
        ],
    },
    {
        group: "Method and implementation",
        items: [
            ["Measurement engine", pipeline + "/topology_engine.py", "State capture, projection, persistence and validation"],
            ["R020 measurement runner", pipeline + "/r020_pythia_generation_topology.py", "The actual generation-wide capture procedure"],
            ["Topology calculations", pipeline + "/topology_core.py", "Cut-offs, graphs and community detection"],
            ["R020 semantic analyser", analysis + "/R020_SEMANTIC_CONTINUITY_REPRODUCER.js", "Declared post-measurement screening and hypotheses"],
            ["Reproducibility guide", research + "/REPRODUCIBILITY.md", "Environment, rerun commands and data limits; focuses on R018–R019"],
            ["Data dictionary", research + "/DATA_DICTIONARY.md", "Definitions of measured, derived and interpreted fields"],
        ],
    },
    {
        group: "Experimental record",
        items: [
            ["R020 exact input/output", r020 + "/prompt_records.json", "Prompt, generation and token IDs"],
            ["R020 generation trace", r020 + "/generation_trace.csv", "All 32 next-token decisions"],
            ["R020 community edges", r020 + "/community_edges.csv", "Recorded numerical community connections"],
            ["R020 verified semantic map", analysis + "/R020_VERIFIED_CONSOLIDATED_SEMANTIC_MAP.md", "Interpreted map with community-level examples"],
            ["R020 independent audit", analysis + "/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md", "Checks of edge records, tokens and affinities"],
            ["R019 repeatability result", r019 + "/R019_RESULT.json", "Within-prompt control and between-order difference"],
            ["Human–agent meta-analysis", ma, "Chronology of discoveries, failed interpretations and corrections"],
        ],
    },
];

function External({ href, children, className = "" }) {
    return <a className={className || styles.textLink} href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}
function SectionTitle({ number, eyebrow, title, children }) {
    return (
        <header className={styles.sectionHead}>
            <span className={styles.sectionNumber} aria-hidden="true">{number}</span>
            <div>
                <p className={styles.overline}>{eyebrow}</p>
                <h2>{title}</h2>
                {children && <div className={styles.sectionLead}>{children}</div>}
            </div>
        </header>
    );
}
function EvidenceRow({ items }) {
    return (
        <div className={styles.evidenceRow}>
            <span className={styles.evidenceRowLabel}>Trace the evidence</span>
            <div>{items.map(([label, href]) => <External key={label} href={href}>{label}</External>)}</div>
        </div>
    );
}
function StaticSemanticMap() {
    return (
        <figure className={styles.semanticFigure}>
            <div className={styles.figureHeading}>
                <div><p className={styles.overline}>Interpreted from measured networks</p><h3>R020 — the recurring semantic field</h3></div>
                <span className={styles.figureTag}>Static evidence map</span>
            </div>
            <svg className={styles.networkSvg} viewBox="0 0 820 545" role="img" aria-labelledby="r020-map-title r020-map-description">
                <title id="r020-map-title">Recurring R020 semantic relations across generated-token decisions</title>
                <desc id="r020-map-description">Interpretive node layout: inhabitants and settlements, built places, movement routes, commerce, and crossings. Confirmed candidate recurrent relations include settlements to movement at eleven decisions, movement to crossings at eight, built places to movement at seven, built places to inhabitants at seven, and inhabitants to settlements at six.</desc>
                <g className={styles.graphEdges}>
                    <line x1="260" y1="67" x2="560" y2="67"/>
                    <line x1="150" y1="105" x2="150" y2="255"/>
                    <line x1="588" y1="105" x2="477" y2="255"/>
                    <line x1="260" y1="292" x2="300" y2="292"/>
                    <line x1="520" y1="292" x2="560" y2="292"/>
                    <line x1="410" y1="330" x2="410" y2="440"/>
                </g>
                <g className={styles.graphCountTags}>
                    <g transform="translate(410 67)"><rect x="-19" y="-15" width="38" height="30" rx="8"/><text y="6">6</text></g>
                    <g transform="translate(150 180)"><rect x="-19" y="-15" width="38" height="30" rx="8"/><text y="6">7</text></g>
                    <g transform="translate(525 168)"><rect x="-24" y="-15" width="48" height="30" rx="8"/><text y="6">11</text></g>
                    <g transform="translate(280 292)"><rect x="-19" y="-15" width="38" height="30" rx="8"/><text y="6">7</text></g>
                    <g transform="translate(540 292)"><rect x="-19" y="-15" width="38" height="30" rx="8"/><text y="6">3</text></g>
                    <g transform="translate(410 386)"><rect x="-19" y="-15" width="38" height="30" rx="8"/><text y="6">8</text></g>
                </g>
                <g className={styles.graphNodes}>
                    <g transform="translate(40 30)"><rect width="220" height="75" rx="5"/><text x="110" y="32">INHABITANTS</text><text className={styles.graphSubLabel} x="110" y="55">people, residents</text></g>
                    <g transform="translate(560 30)"><rect width="220" height="75" rx="5"/><text x="110" y="32">SETTLEMENTS</text><text className={styles.graphSubLabel} x="110" y="55">cities, towns</text></g>
                    <g transform="translate(40 255)"><rect width="220" height="75" rx="5"/><text x="110" y="32">BUILT PLACES</text><text className={styles.graphSubLabel} x="110" y="55">buildings, streets</text></g>
                    <g className={styles.graphCoreNode} transform="translate(300 255)"><rect width="220" height="75" rx="5"/><text x="110" y="32">MOVEMENT</text><text className={styles.graphSubLabel} x="110" y="55">travel, routes</text></g>
                    <g transform="translate(560 255)"><rect width="220" height="75" rx="5"/><text x="110" y="32">COMMERCE</text><text className={styles.graphSubLabel} x="110" y="55">markets, businesses</text></g>
                    <g className={styles.graphCoreNode} transform="translate(300 440)"><rect width="220" height="75" rx="5"/><text x="110" y="32">CROSSINGS</text><text className={styles.graphSubLabel} x="110" y="55">bridges, connections</text></g>
                </g>
                <text className={styles.graphFooter} x="410" y="537">Numbers = decisions containing qualifying candidate relations (out of 32)</text>
            </svg>
            <div className={styles.mobileRelations} aria-label="Measured relation recurrence summary">
                {recurringEdges.map(([a, b, n]) => (
                    <div key={a + b}><span>{a} <span aria-hidden="true">↔</span> {b}</span><strong>{n}</strong></div>
                ))}
            </div>
            <figcaption>
                Conceptual summary of recurring <strong>interpreted</strong> relations supported by measured cross-community token edges in contextual states S01–S05. These edges were recovered at different generation decisions; they are <strong>not</strong> one simultaneously observed graph. Counts are recurrence, not probabilities or causal strengths. The full reconstruction also records water, terrain, disruption, rebuilding and unresolved communities.
                {" "}<External href={analysis + "/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md"}>Inspect the source map</External>
            </figcaption>
        </figure>
    );
}
function CodeStage({ item }) {
    return (
        <article className={styles.codeStage}>
            <header>
                <span className={styles.codeStep}>{item.step}</span>
                <span className={styles.codeCategory}>{item.category}</span>
            </header>
            <div className={styles.operationNeed}>
                <span>Problem that made this necessary</span>
                <h3>{item.need}</h3>
            </div>
            <div className={styles.operationAction}>
                <span>What the pipeline did</span>
                <p><strong>{item.title}.</strong> {item.explanation}</p>
            </div>
            <pre className={styles.codeWindow}><code>{item.code}</code></pre>
            <div className={styles.codeFooter}>
                <div><span>Evidence this operation produced</span><strong>{item.output}</strong></div>
                <External href={item.source}>{item.sourceLabel}</External>
            </div>
            <div className={styles.operationRemaining}>
                <span>What this still could not establish</span>
                <p>{item.limit}</p>
            </div>
        </article>
    );
}

export default function LlmTopologyArticleDraft() {
    return (
        <main className={styles.page}>
            <div className={styles.topBar}>
                <Link href="/art">← Research archive</Link>
                <span>LLM TOPOLOGY / PRIMARY EXPERIMENTAL RESEARCH / FIRST DRAFT</span>
            </div>

            <header className={styles.hero}>
                <div className={styles.heroText}>
                    <p className={styles.overline}>The unknown possibility space / Human–agent learning</p>
                    <h1>Discovering what you do not know to ask.</h1>
                    <p className={styles.standfirst}>How can a human discover knowledge when they cannot enumerate the possibilities or specify the correct answer?</p>
                    <p className={styles.heroDescription}>The starting hypothesis was whether transformer-state changes expose learned semantic organisation that the final answer cannot show. Each experimental limitation made a new measurement or comparison necessary. In directing those investigations, the human also developed a method of learning through agent reconstruction.</p>
                    <div className={styles.heroActions}>
                        <a href="#question" className={styles.primaryAction}>Start with the question <span aria-hidden="true">↓</span></a>
                        <External href={root}>Research repository</External>
                    </div>
                </div>
                <div className={styles.heroPanel}>
                    <p className={styles.overline}>Three different roles</p>
                    <div className={styles.roleBox}><span>01 / TEST SUBJECT</span><strong>The measured model</strong><p>Its intermediate numerical states and generated response are observed.</p></div>
                    <div className={styles.roleArrow} aria-hidden="true">↓</div>
                    <div className={styles.roleBox}><span>02 / INSTRUMENT & AGENT</span><strong>The pipeline and analysing LLM</strong><p>Python captures and processes evidence; the analysing agent proposes semantic reconstructions.</p></div>
                    <div className={styles.roleArrow} aria-hidden="true">↕</div>
                    <div className={styles.roleBox + " " + styles.roleEmphasis}><span>03 / DIRECTION</span><strong>The human researcher</strong><p>Recognises what resonates or fails, chooses what to investigate and judges usefulness.</p></div>
                    <p className={styles.heroPanelFoot}>The model under investigation is not the agent interpreting the data.</p>
                </div>
            </header>

            <div className={styles.shell}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarInner}>
                        <p className={styles.overline}>Article contents</p>
                        <nav aria-label="Article contents">
                            {navigation.map(([id, title], i) => <a href={"#" + id} key={id}><span>{String(i + 1).padStart(2, "0")}</span>{title}</a>)}
                        </nav>
                        <div className={styles.sidebarEvidence}>
                            <strong>Research status</strong>
                            <p>This is an original, measured research project. Its working repository is currently private; public source access and frozen archival references remain publication tasks.</p>
                            <External href={research + "/ARTICLE_EVIDENCE_INDEX.md"}>Claim–evidence index</External>
                        </div>
                    </div>
                </aside>

                <article className={styles.article}>
                            <section className={styles.section} id="question">
                        <SectionTitle number="01" eyebrow="The original research question" title="Why look inside a model instead of asking for another answer?">
                            <p>The starting hypothesis was specific: could changes in a language model&apos;s internal states across transformer layers reveal higher-order semantic structures and relationships learned during training? The study was not an attempt to recover individual training documents or read the model&apos;s private thoughts.</p>
                        </SectionTitle>
                        <div className={styles.originContrast}>
                            <div>
                                <p className={styles.overline}>What the final answer gives us</p>
                                <h3>One selected expression</h3>
                                <p>A response contains words chosen for the next-token sequence. It does not expose all alternative associations, competing interpretations or intermediary relationships available to the model.</p>
                            </div>
                            <div>
                                <p className={styles.overline}>What the experiment needed</p>
                                <h3>Evidence of the representation</h3>
                                <p>Record the internal state, compare its vocabulary neighbourhoods, reconstruct relations and change the conditions to see which structures recur. The procedure makes candidate learned associations inspectable rather than relying on the answer alone.</p>
                            </div>
                        </div>
                        <div className={styles.questionSequence}>
                            <p><strong>Initial uncertainty</strong> — Does the model represent higher-order semantic relationships that its response does not communicate?</p>
                            <p><strong>Necessary observation</strong> — Capture intermediate representations before naming their possible meaning.</p>
                            <p><strong>Test of adequacy</strong> — Check that the reconstruction survives relevant controls, while keeping measurement distinct from interpretation.</p>
                        </div>
                        <p className={styles.bodyCopy}>That need for measurement explains why the project began with transformer-state capture. The following R020 example is a later demonstration of what the method can reveal, not the experiment that originally defined the methodology. The differences between its failed answer and reconstructed associations are the reason that particular test matters.</p>
                        <EvidenceRow items={[
                            ["Original objective, MA-0119", ma + "#ma-0119--chatgpt-original-topology-hypothesis-versus-emergent-humanagent-learning-methodology"],
                            ["Official article argument", research + "/ARTICLE_OUTLINE_OFFICIAL.md"],
                            ["Methods", research + "/METHODOLOGY.md"],
                        ]}/>
                    </section>

                    <section className={styles.section} id="observation">
                        <SectionTitle number="02" eyebrow="A later experimental contrast / R020" title="What the model represented but failed to explain">
                            <p>R020 was designed after earlier experiments had made state capture, network reconstruction and reliability testable. It deliberately used a small model whose poor generation would expose a new question: can the recorded representations yield relationships that the answer fails to express?</p>
                        </SectionTitle>
                        <div className={styles.inputOutput}>
                            <div className={styles.ioCard}>
                                <div className={styles.ioHead}><span>R020 / Exact experimental prompt</span><strong>INPUT</strong></div>
                                <pre>{'Question: Why would a city build a bridge across a river?\nAnswer:'}</pre>
                                <p>Pythia 70M · greedy continuation · maximum 32 new tokens</p>
                            </div>
                            <div className={styles.ioCard + " " + styles.ioFailure}>
                                <div className={styles.ioHead}><span>R020 / Recorded generated response</span><strong>OUTPUT</strong></div>
                                <pre>{' The city is a bridge that connects the river with the river.\n\nA:\n\nThe city is a bridge that connects the river with the river.'}</pre>
                                <p>The answer repeats a false equivalence; it never explains why a bridge would be built.</p>
                            </div>
                        </div>
                        <p className={styles.bodyCopy}>The experiment then examined the model's recorded internal states. Vocabulary communities associated with <strong>settlements, people, movement, routes and crossings</strong> contained measured connections that the generated text did not explain. The semantic family names are assigned during reconstruction; the underlying edges come from saved numerical measurements.</p>
                        <StaticSemanticMap />
                        <div className={styles.metrics}>
                            <div><strong>32</strong><span>Generated-token decisions</span></div>
                            <div><strong>512</strong><span>State/sector networks</span></div>
                            <div><strong>6,944</strong><span>Recorded communities</span></div>
                            <div><strong>21/32</strong><span>Decisions with a screened contextual candidate relation</span></div>
                        </div>
                        <div className={styles.finding}>
                            <p className={styles.overline}>What R020 establishes</p>
                            <p>Recoverable semantic relationships can contain information absent from the model&apos;s generated response. Related higher-order structures recur across generation even when the constituent tokens, communities and connections change.</p>
                            <span>It does not establish one continuously maintained causal explanation; that is a different question.</span>
                        </div>
                        <EvidenceRow items={[
                            ["Exact prompt and answer", r020 + "/prompt_records.json"],
                            ["Generated-token trace", r020 + "/generation_trace.csv"],
                            ["Community edges", r020 + "/community_edges.csv"],
                            ["Independent evidence audit", analysis + "/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md"],
                        ]}/>
                    </section>

                    <section className={styles.section} id="measurement">
                        <SectionTitle number="03" eyebrow="Necessary measurement operations" title="Each new observation exposed the next problem">
                            <p>The reconstructed relationships were not simply read out of the model&apos;s final answer. They came from a sequence of measurements, transformations and human-supervised interpretations. Knowing where measurement ends and interpretation begins is essential to understanding the result.</p>
                        </SectionTitle>
                        <div className={styles.instrumentCards}>
                            <div>
                                <p className={styles.overline}>Instrument 01 / LLM topology</p>
                                <h3>Measure the accessible model states</h3>
                                <p>With an open-weight model, the research captures internal representations and constructs numerical networks. Semantic parents and their relationships are then inferred from those measured communities, rather than supplied as pre-existing model variables.</p>
                                <External href={research + "/METHODOLOGY.md"}>Direct-measurement methodology</External>
                            </div>
                            <div>
                                <p className={styles.overline}>Instrument 02 / SDA-3 and structural extraction</p>
                                <h3>Interrogate what the model expresses or omits</h3>
                                <p>With a model that cannot be inspected internally, the researcher instead probes its responses: what is central, adjacent, missing, emerging or unexpectedly associated? This yields behavioural hypotheses to challenge—not measured hidden states.</p>
                                <Link href="/art/hidden-representations-without-hidden-layers">Behavioural inference when internal states are inaccessible →</Link>
                            </div>
                        </div>
                        <p className={styles.instrumentBoundary}>These are complementary but different instruments. In particular, the positive and negative cosine sectors used in LLM Topology are geometric measurements, not the same categories as SDA-3&apos;s central or suppressed roles.</p>
                        <p className={styles.bodyCopy}>The pipeline did not begin with a fully understood map. Each operation addressed evidence the preceding operation could not provide. The code below is taken from the R020 implementation of the method, while the experiment history explains when and why these operations were developed.</p>
                        <div className={styles.codeList}>
                            {sourceOperations.map(item => <CodeStage key={item.step} item={item}/>)}
                        </div>
                        <div className={styles.provenanceFlow}>
                            {[
                                ["MODEL STATES", "Captured numerical model states", "Measured"],
                                ["VOCABULARY SCORES", "Computed alignment against a fixed basis", "Derived"],
                                ["TOKEN NETWORKS", "Calculated neighbours and communities", "Derived"],
                                ["SEMANTIC RELATIONS", "Inferred families, parents and candidate connections", "Interpreted"],
                                ["HUMAN DECISIONS", "Selected questions, objections and usefulness judgements", "Recorded"],
                            ].map(([title, summary, level], i) => (
                                <div className={styles.flowItem} key={title}><span className={styles.flowIndex}>{String(i + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{summary}</p></div><span className={styles.flowLevel}>{level}</span></div>
                            ))}
                        </div>
                        <div className={styles.notePanel}>
                            <p className={styles.overline}>Why this separation matters</p>
                            <p>A connected group of tokens is a <strong>measured community</strong>. Calling it a settlement, movement or crossing family is an <strong>interpretation</strong>. Saying that a model used those concepts to plan a bridge would be a further claim requiring additional evidence. The analysis preserves this distinction.</p>
                        </div>
                        <EvidenceRow items={[
                            ["Measurement method", research + "/METHODOLOGY.md"],
                            ["R020 runner", pipeline + "/r020_pythia_generation_topology.py"],
                            ["R020 reconstruction", analysis + "/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md"],
                            ["R020 validation", r020 + "/R020_COMPLETENESS_VERIFICATION.md"],
                        ]}/>
                    </section>

                    <section className={styles.section} id="trajectory">
                        <SectionTitle number="04" eyebrow="Research as successive constraints" title="Why each experimental phase became necessary">
                            <p>The runs were not twenty repeats of one procedure. Each began with an uncertainty the previous evidence could not settle, and some initially failed. The record below preserves the problem, response, observed result and remaining limitation, rather than making the work appear inevitable.</p>
                        </SectionTitle>
                        <div className={styles.epochList}>
                            {epochs.map(epoch => (
                                <article className={styles.epoch} key={epoch.run}>
                                    <div className={styles.epochLabel}><span>{epoch.number}</span><strong>{epoch.run}</strong></div>
                                    <div className={styles.epochBody}>
                                        <h3>{epoch.title}</h3>
                                        <div className={styles.epochReason}>
                                            <span>What was insufficient?</span>
                                            <p>{epoch.problem}</p>
                                        </div>
                                        <div className={styles.epochResponse}>
                                            <span>Why the next experiments took this form</span>
                                            <p>{epoch.operation}</p>
                                        </div>
                                        <div className={styles.epochOutcome}>
                                            <span>What was established</span>
                                            <p>{epoch.finding}</p>
                                        </div>
                                        {epoch.intervention && <div className={styles.epochIntervention}>
                                            <span>Human direction recorded in the meta-analysis</span>
                                            <p>{epoch.intervention}</p>
                                            <External href={epoch.interventionSource}>Inspect the recorded intervention</External>
                                        </div>}
                                        <div className={styles.epochOpen}>
                                            <span>Unresolved — why the next stage was needed</span>
                                            <p>{epoch.remaining}</p>
                                        </div>
                                        <div className={styles.inlineEvidence}>{epoch.documents.map(([label,href])=><External href={href} key={label}>{label}</External>)}</div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className={styles.controlPanel}>
                            <p className={styles.overline}>The R019 control</p>
                            <h3>Different order was not merely random variation</h3>
                            <p>R018 identified different intermediate representations for different orders of the same concepts. But this could not establish an order effect unless identical inputs were stable under the measurement procedure. R019 therefore repeated each tested ordering three times and compared its within-order measurements with between-order differences. Repeats matched exactly in that tested local setup; order-dependent changes remained. This excludes the measured local repeat variability as their explanation, without claiming that the result generalises across all hardware or models.</p>
                            <EvidenceRow items={[
                                ["R019 result.json", r019 + "/R019_RESULT.json"],
                                ["Statewise comparisons", r019 + "/divergence_by_state.csv"],
                                ["R018 permutation measurements", r018 + "/permutation_invariance.csv"],
                            ]}/>
                        </div>
                    </section>

                    <section className={styles.section} id="human">
                        <SectionTitle number="05" eyebrow="The documented research dialogue" title="Why agent reconstruction needed human direction">
                            <p>Reliable measurements did not guarantee useful explanations. The analysing agent could over-compress communities, change the question, or demand evidence unrelated to the original hypothesis. Conversely, a reconstructed map could suggest a promising inquiry that the human could recognise without already knowing its answer. These interventions were necessary to decide what should be explored or corrected next.</p>
                        </SectionTitle>
                        <div className={styles.caseList}>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker}><span>01</span><strong>Negative recognition</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>Correcting the wrong research objective</h3>
                                    <p>The agent repeatedly reinterpreted the project as though its scientific objective had changed. The human distinguished a changed understanding of the objective from a changed objective. The investigation returned to inferring learned semantic topology rather than inventing a different goal.</p>
                                    <div className={styles.caseChain}><span>Wrong abstraction</span><span>Human objection</span><span>Reconstruction of the objective</span></div>
                                    <External href={ma + "#ma-0119--chatgpt-original-topology-hypothesis-versus-emergent-humanagent-learning-methodology"}>MA-0119: original hypothesis and emerging methodology</External>
                                </div>
                            </article>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker + " " + styles.casePositive}><span>02</span><strong>Positive recognition</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>Choosing the next question from an unfamiliar map</h3>
                                    <p>After R014–R015 reconstructed compatible semantic families, the human did not stop at the agent&apos;s summary. The researcher selected another inquiry: which structures were central or adjacent, what emerged, what appeared missing, and what correlated before coherence was imposed?</p>
                                    <blockquote>“When this network is treated purely as a vector, without trying to force coherence, what else highly correlates with it?”</blockquote>
                                    <p>The agent&apos;s response compared the reconstructed parent networks and identified a change in the most connected family: spatial/measurement in R014, but process/change in R015. Process/change had not been a supplied seed concept. This gave the researcher an additional organising possibility to examine, not a newly measured cosine ranking or proof of one underlying application.</p>
                                    <div className={styles.caseChain}><span>Inspect a candidate map</span><span>Select a promising question</span><span>Reconstruct under the new inquiry</span></div>
                                    <External href={ma + "#ma-0099--next-inquiry-sda-3-interrogatives-applied-to-the-independently-reconstructed-r014r015-semantic-map"}>MA-0099: the recorded prompt and reconstruction</External>
                                </div>
                            </article>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker}><span>03</span><strong>Correcting an unnecessary test</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>Recognising when qualification erases a result</h3>
                                    <p>After R020, the agent qualified the recovery of semantic associations because it had not demonstrated continuous integration into one coherent hypothesis. That added an unrequested success condition capable of obscuring the observed result. The human challenged it: whether a complete relationship remains integrated is a separate question, not a precondition for recognising recovered relations.</p>
                                    <div className={styles.caseChain}><span>Relevant associations recovered</span><span>Stronger requirement imposed</span><span>Original finding restored</span></div>
                                    <External href={ma + "#ma-0127--methodological-correction-r020-conclusion-and-needless-integration-hedging"}>MA-0127: the interpretive correction</External>
                                </div>
                            </article>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker + " " + styles.casePositive}><span>04</span><strong>Recognising a missing capability</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>From detecting error to recognising resonance</h3>
                                    <p>The first article diagram described the human only as recognising what was unsupported, missing or invalid. That was insufficient to explain why the human had pursued certain promising relationships rather than merely eliminating errors. The researcher inserted “Recognises what resonates”, extending the account to directional selection before the significance is fully understood.</p>
                                    <div className={styles.caseChain}><span>Negative-only account</span><span>Human identifies omission</span><span>Dual-path exploration and correction</span></div>
                                    <External href={ma + "#ma-0128--core-insight-positive-recognition-and-resonance-in-the-humanagent-learning-mechanism"}>MA-0128: the original edit and revised explanation</External>
                                </div>
                            </article>
                        </div>
                        <div className={styles.twoPaths}>
                            <div><p className={styles.overline}>Resonance / positive recognition</p><h3>Explore what might matter</h3><p>Select a relationship worth investigating, expose more of its connections and test whether the evidence supports it. Resonance is a reason to explore, not proof.</p></div>
                            <div><p className={styles.overline}>Invalidity / negative recognition</p><h3>Challenge what fails</h3><p>Identify objective drift, contradictions, missing evidence or unjustified coherence. Constrain the next interpretation without supplying a final answer.</p></div>
                        </div>
                    </section>

                    <section className={styles.section} id="discovery">
                        <SectionTitle number="06" eyebrow="The happy accident" title="Why directing the agent changed what the human could learn">
                            <p>The original aim was to infer the semantic organisation learned by language models. A second insight emerged while supervising the reconstruction: the human could acquire unfamiliar knowledge by teaching the agent how to investigate it.</p>
                        </SectionTitle>
                        <div className={styles.turningPoint}>
                            <div>
                                <p className={styles.overline}>MA-0083 / Initial framing</p>
                                <h3>The human teaches the agent</h3>
                                <p>The researcher described building the joint investigation as a way to help the agent form a better working model of the problem. Human learning was initially called a “happy accident”. The shared research files preserved the successive interpretations and corrections.</p>
                                <External href={ma + "#ma-0083--critical-combined-entry-human-selection-pressure-and-the-joint-learning-system"}>Read MA-0083</External>
                            </div>
                            <span className={styles.turningArrow} aria-hidden="true">→</span>
                            <div className={styles.turningResult}>
                                <p className={styles.overline}>MA-0120 / Emerging insight</p>
                                <h3>The human learns through the agent</h3>
                                <blockquote>The human acquired knowledge about an unfamiliar possibility space by teaching the agent to explore it.</blockquote>
                                <External href={ma + "#ma-0120--critical-insight-human-learning-through-agent-exploration"}>Read MA-0120</External>
                            </div>
                        </div>
                        <div className={styles.labourGrid}>
                            <div><p className={styles.overline}>Human</p><strong>Objective and judgement</strong><p>Defines the problem, recognises potential significance, rejects inadequate abstractions and chooses what deserves more investigation.</p></div>
                            <div><p className={styles.overline}>Agent</p><strong>Generation and reconstruction</strong><p>Expands possibilities, compares evidence, constructs and revises semantic explanations, and makes them inspectable.</p></div>
                            <div><p className={styles.overline}>Shared research memory</p><strong>Continuity and accountability</strong><p>Stores experiments, chosen questions, rejected interpretations, corrective constraints and results so the next cycle does not start from nothing.</p></div>
                        </div>
                        <p className={styles.bodyCopy}>Why did human learning follow from this process? The agent could generate candidate explanations and transformations that the researcher could not have specified in advance. The researcher could nevertheless recognise promising directions or inadequate interpretations, require a new reconstruction and then inspect the resulting evidence. Persistently recording those decisions made unfamiliar relations available for the next question. This is a documented interpretation of the collaboration, not a controlled experiment showing that resonance predicts truth or that the agent&apos;s pretrained weights changed.</p>
                        <div className={styles.finalPrinciple}>
                            <p className={styles.overline}>Highest-order principle</p>
                            <p>Human knowledge expands through human-directed, constrained agent reconstruction.</p>
                        </div>
                        <p className={styles.relatedRead}>Related methods: <Link href="/art/hidden-representations-without-hidden-layers">behavioural inference when internal states are inaccessible</Link>, <Link href="/art/sda-3-analysing-embedding-space-structure-in-large-language-models">SDA-3</Link>, and <Link href="/art/structural-extraction-protocol">structural extraction under constraint</Link>.</p>
                    </section>

                    <section className={styles.section} id="evidence">
                        <SectionTitle number="07" eyebrow="Primary sources and reproducibility" title="Follow the research from question to measurement to interpretation">
                            <p>Primary research is established by controlled observations, inspectable procedures, preserved negative results and an auditable connection between measurements and conclusions—not by the presence of a GitHub link alone.</p>
                        </SectionTitle>
                        <div className={styles.accessNote}>
                            <strong>Access and publication boundary</strong>
                            <p>The canonical repository is currently <strong>private</strong>. These source links are usable by authorised readers, but not yet an independently accessible public evidence package. A final release needs frozen commit links, an accessible evidence set, and disclosure of raw tensors that remain outside Git. This first draft does not claim that public replication is already possible.</p>
                        </div>
                        <div className={styles.sourceGroups}>
                            {researchLinks.map(group=>(
                                <div key={group.group} className={styles.sourceGroup}>
                                    <h3>{group.group}</h3>
                                    <div>
                                        {group.items.map(([name,href,desc])=>(
                                            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={styles.sourceCard}>
                                                <strong>{name}<span aria-hidden="true"> ↗</span></strong>
                                                <span>{desc}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.reproductionBoundary}>
                            <p className={styles.overline}>What reproduction means here</p>
                            <p>The code, compact graph exports, run configurations and audits support inspection and selected checks. Full reruns of some experiments require pinned models, particular hardware and uncommitted large tensors. Semantic labels and higher-order parents are interpretive reconstructions, not directly measured model variables.</p>
                            <External href={research + "/REPRODUCIBILITY.md"}>Read the reproduction procedure and boundaries</External>
                        </div>
                        <div className={styles.relatedArticles}>
                            <p className={styles.overline}>Related portfolio case studies</p>
                            <Link href="/art/the-zombie-survival-strategy-chatgpt-could-not-see">The zombie-survival strategy ChatGPT could not see →</Link>
                            <Link href="/art/from-seo-keywords-to-the-haunted-machine">From SEO keywords to the Haunted Machine →</Link>
                            <Link href="/art/building-an-agent-native-after-effects-workflow">Building an agent-native creative workflow →</Link>
                        </div>
                    </section>

                    <footer className={styles.conclusion}>
                        <p className={styles.overline}>Return to the central question</p>
                        <h2>What can a human learn without knowing what to ask?</h2>
                        <p>An analysing agent can generate and reconstruct possibilities that a human could not specify in advance. The human can recognise what resonates and what fails, direct another investigation and examine the evidence. The method makes the unknown possibility space progressively more accessible without mistaking a persuasive answer for proof.</p>
                        <a href="#observation">Return to the experiment ↑</a>
                    </footer>
                </article>
            </div>
        </main>
    );
}
