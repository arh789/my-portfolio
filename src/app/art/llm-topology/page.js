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
    ["observation", "The observation"],
    ["measurement", "From states to evidence"],
    ["trajectory", "Twenty experiments"],
    ["human", "Human direction"],
    ["discovery", "The unexpected discovery"],
    ["evidence", "Code and research archive"],
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
        source: pipeline + "/r020_pythia_generation_topology.py#L835-L843",
        sourceLabel: "R020 runner, lines 835–843",
        output: "Vocabulary-score regions for every decision and state",
    },
    {
        step: "03 / Network",
        category: "Derived",
        title: "Construct neighbourhoods and detect communities",
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
        source: pipeline + "/topology_core.py#L179-L191",
        sourceLabel: "Topology core, lines 179–191",
        output: "512 state/sector networks; 6,944 recorded communities",
    },
    {
        step: "04 / Reconstruct",
        category: "Interpreted",
        title: "Require measured edges before proposing a relation",
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
        title: "Make internal representations measurable",
        problem: "Can we capture state changes and turn millions of token relationships into valid, inspectable evidence?",
        result: "The pipeline progressed from hidden-state capture through vocabulary selection to positive/negative networks, communities, recoverable execution and validated exports.",
        documents: [
            ["Research methods", research + "/METHODOLOGY.md"],
            ["Pipeline code", pipeline + "/topology_core.py"],
        ],
    },
    {
        number: "02",
        run: "R009–R010",
        title: "Stop treating a token list as a semantic map",
        problem: "What do the communities organise, and how do those relationships change through transformer depth?",
        result: "Semantic parents, operations and constraints became objects of interpretation. An internally complete measurement was not yet the same as a useful semantic reconstruction.",
        documents: [
            ["Run history", research + "/RUN_OPTIMISATION_TRAJECTORY.md"],
            ["Original findings", ma],
        ],
    },
    {
        number: "03",
        run: "R011–R015",
        title: "Ask what survives changes in the question",
        problem: "Does the apparent structure persist if concepts are reordered, the context changes or nearby concepts replace the seeds?",
        result: "R013 tested all six concept orders. R014 reconstructed four overlapping probes. R015 shifted to adjacent concepts. Higher-order semantic families recurred despite changes to the local token and community structure.",
        documents: [
            ["R013 plan", pipeline + "/R013_PLAN.md"],
            ["R014–R015 comparison", runs + "/R015_qwen-adjacent-neighbourhood-expansion/R014_R015_COMPARISON.md"],
        ],
    },
    {
        number: "04",
        run: "R016–R019",
        title: "Separate reproducible structure from runtime noise",
        problem: "Could a larger model be measured locally, and were the order-conditioned differences reproducible?",
        result: "R016 established 32B local feasibility. R018 measured the same three concepts across order permutations. R019 repeated the tested prompts three times each, finding exact repeatability in that local setup while between-order differences remained.",
        documents: [
            ["R018 measurements", r018 + "/R018_MEASUREMENT_REPORT.md"],
            ["R019 control", r019 + "/R019_RESULT.json"],
        ],
    },
    {
        number: "05",
        run: "R020",
        title: "Compare what is recoverable with what is expressed",
        problem: "Can useful candidate semantic relationships be recovered when the model's generated response fails?",
        result: "The model gave a circular answer, yet audited relationships among settlements, routes and crossings recurred across generation. The map is not one fixed graph and does not amount to a complete causal explanation.",
        documents: [
            ["R020 interpretation", analysis + "/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md"],
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
            <h3>{item.title}</h3>
            <p>{item.explanation}</p>
            <pre className={styles.codeWindow}><code>{item.code}</code></pre>
            <div className={styles.codeFooter}>
                <div><span>Recorded result</span><strong>{item.output}</strong></div>
                <External href={item.source}>{item.sourceLabel}</External>
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
                    <p className={styles.heroDescription}>Twenty language-model experiments began with an attempt to infer learned semantic structure from transformer states. They also exposed a research method: an agent proposes relationships; a human recognises which are promising or invalid; the next reconstruction changes what the human can understand.</p>
                    <div className={styles.heroActions}>
                        <a href="#observation" className={styles.primaryAction}>See the experiment <span aria-hidden="true">↓</span></a>
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
                    <section className={styles.section} id="observation">
                        <SectionTitle number="01" eyebrow="The observed problem" title="The answer failed. The relationships did not disappear.">
                            <p>A language model can produce an answer that uses the right words but fails to express a useful relationship between them. R020 makes that problem visible because its exact prompt, generation and intermediate measurements are preserved.</p>
                        </SectionTitle>
                        <div className={styles.inputOutput}>
                            <div className={styles.ioCard}>
                                <div className={styles.ioHead}><span>R020 / Exact experimental prompt</span><strong>INPUT</strong></div>
                                <pre>{'Question: Why would a city build a bridge across a river?\nAnswer:'}</pre>
                                <p>Pythia 70M · greedy continuation · maximum 32 new tokens</p>
                            </div>
                            <div className={styles.ioCard + " " + styles.ioFailure}>
                                <div className={styles.ioHead}><span>R020 / Recorded generated response</span><strong>OUTPUT</strong></div>
                                <pre>{'The city is a bridge that connects the river with the river.\n\nA:\n\nThe city is a bridge that connects the river with the river.'}</pre>
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
                            <p>Recoverable semantic relationships can contain information absent from the model's generated response. Related higher-order structures recur across generation even when the constituent tokens, communities and connections change.</p>
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
                        <SectionTitle number="02" eyebrow="How evidence was constructed" title="From transformer states to an inspectable semantic map">
                            <p>The reconstructed relationships were not simply read out of the model&apos;s final answer. They came from a sequence of measurements, transformations and human-supervised interpretations. Knowing where measurement ends and interpretation begins is essential to understanding the result.</p>
                        </SectionTitle>
                        <div className={styles.provenanceFlow}>
                            {[
                                ["MODEL STATES", "Recorded from the tested transformer", "Measured"],
                                ["VOCABULARY SCORES", "Layerwise comparisons in a fixed embedding basis", "Derived"],
                                ["TOKEN NETWORKS", "Neighbours, connections and detected communities", "Derived"],
                                ["SEMANTIC RELATIONS", "Proposed names and higher-order relationships", "Interpreted"],
                                ["HUMAN DECISIONS", "Select, challenge, test and direct another investigation", "Research record"],
                            ].map(([title, summary, level], i) => (
                                <div className={styles.flowItem} key={title}><span className={styles.flowIndex}>{String(i + 1).padStart(2, "0")}</span><div><strong>{title}</strong><p>{summary}</p></div><span className={styles.flowLevel}>{level}</span></div>
                            ))}
                        </div>
                        <p className={styles.bodyCopy}>The novelty is not that cosine similarity or community detection was invented here. It is the controlled chain from intermediate model states to reproducible communities, then to semantic hypotheses that can be challenged without losing the original evidence. The code excerpts below come from the actual project implementation.</p>
                        <div className={styles.codeList}>
                            {sourceOperations.map(item => <CodeStage key={item.step} item={item}/>)}
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
                        <SectionTitle number="03" eyebrow="The controlled investigation" title="What twenty runs changed">
                            <p>These results were not obtained by asking once for an attractive graph. Each group of experiments exposed a new obstacle: obtaining reliable measurements, finding useful meaning, testing recurrence, excluding confounds and comparing representation with expression.</p>
                        </SectionTitle>
                        <div className={styles.epochList}>
                            {epochs.map(epoch => (
                                <article className={styles.epoch} key={epoch.run}>
                                    <div className={styles.epochLabel}><span>{epoch.number}</span><strong>{epoch.run}</strong></div>
                                    <div className={styles.epochBody}>
                                        <h3>{epoch.title}</h3>
                                        <p className={styles.epochQuestion}>{epoch.problem}</p>
                                        <p>{epoch.result}</p>
                                        <div className={styles.inlineEvidence}>{epoch.documents.map(([label,href])=><External href={href} key={label}>{label}</External>)}</div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className={styles.controlPanel}>
                            <p className={styles.overline}>The R019 control</p>
                            <h3>Different order was not merely random variation</h3>
                            <p>For the tested OLMo 3 32B setup, three sequential repeats of each prompt ordering produced exact measured matches. Changing the order still changed intermediate representations and networks. This control makes the order-conditioned difference more informative, within the particular tested model and runtime.</p>
                            <EvidenceRow items={[
                                ["R019 result.json", r019 + "/R019_RESULT.json"],
                                ["Statewise comparisons", r019 + "/divergence_by_state.csv"],
                                ["R018 permutation measurements", r018 + "/permutation_invariance.csv"],
                            ]}/>
                        </div>
                    </section>

                    <section className={styles.section} id="human">
                        <SectionTitle number="04" eyebrow="The documented research dialogue" title="The human changed what the agent investigated">
                            <p>The experiment archive records what the models did. The meta-analysis records something different: how the researcher recognised productive possibilities, rejected inadequate interpretations and directed the agent towards a better reconstruction.</p>
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
                                    <p>The recorded question redirected the agent towards unresolved structure rather than accepting the first elegant synthesis. The selection is documented; the value of what was subsequently inferred must still be judged against evidence.</p>
                                    <div className={styles.caseChain}><span>Inspect a candidate map</span><span>Select a promising question</span><span>Reconstruct under the new inquiry</span></div>
                                    <External href={ma + "#ma-0099--next-inquiry-sda-3-interrogatives-applied-to-the-independently-reconstructed-r014r015-semantic-map"}>MA-0099: the recorded prompt and reconstruction</External>
                                </div>
                            </article>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker}><span>03</span><strong>Correcting an unnecessary test</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>Recognising when qualification erases a result</h3>
                                    <p>After R020, the agent qualified the recovery of semantic associations because it had not demonstrated continuous integration into one coherent hypothesis. The human challenged the added requirement: continuous integration is a separate question, not a precondition for recognising recovered relations.</p>
                                    <div className={styles.caseChain}><span>Relevant associations recovered</span><span>Stronger requirement imposed</span><span>Original finding restored</span></div>
                                    <External href={ma + "#ma-0127--methodological-correction-r020-conclusion-and-needless-integration-hedging"}>MA-0127: the interpretive correction</External>
                                </div>
                            </article>
                            <article className={styles.caseStudy}>
                                <div className={styles.caseMarker + " " + styles.casePositive}><span>04</span><strong>Recognising a missing capability</strong></div>
                                <div className={styles.caseMain}>
                                    <h3>From detecting error to recognising resonance</h3>
                                    <p>The first article diagram described the human only as recognising what was unsupported, missing or invalid. The researcher inserted the additional capability: “Recognises what resonates”. That small edit changed the model of learning: the human can direct an inquiry towards potential significance before knowing why it matters.</p>
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
                        <SectionTitle number="05" eyebrow="The happy accident" title="The agent's reconstruction became a way for the human to learn">
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
                        <p className={styles.bodyCopy}>This describes an emerging methodology inferred from the recorded collaboration, not a controlled experiment demonstrating that resonance reliably predicts truth or that the agent&apos;s pretrained weights changed. The benefit lies in preserving human direction while making alternative structures available for inspection.</p>
                        <div className={styles.finalPrinciple}>
                            <p className={styles.overline}>Highest-order principle</p>
                            <p>Human knowledge expands through human-directed, constrained agent reconstruction.</p>
                        </div>
                        <p className={styles.relatedRead}>Related methods: <Link href="/art/hidden-representations-without-hidden-layers">behavioural inference when internal states are inaccessible</Link>, <Link href="/art/sda-3-analysing-embedding-space-structure-in-large-language-models">SDA-3</Link>, and <Link href="/art/structural-extraction-protocol">structural extraction under constraint</Link>.</p>
                    </section>

                    <section className={styles.section} id="evidence">
                        <SectionTitle number="06" eyebrow="Primary sources and reproducibility" title="Follow the research from question to measurement to interpretation">
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
