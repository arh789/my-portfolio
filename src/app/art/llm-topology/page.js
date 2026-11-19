import Link from "next/link";
import styles from "./page.module.css";

// First visual draft: intentionally no page-specific metadata, live graph, or simulated interaction.
const researchBase = "https://github.com/arh789/llm_topology/blob/main";
const r020Base = researchBase + "/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast";
const navigation = [
    ["problem", "The discovery problem"],
    ["instruments", "Two instruments"],
    ["learning-loop", "The learning mechanism"],
    ["research", "Twenty experiments"],
    ["r020", "Recoverable associations"],
    ["corrections", "The correction trail"],
    ["insight", "The unexpected discovery"],
    ["archive", "Evidence and continuation"],
];
const phases = [
    {
        range: "R001–R008",
        title: "Capture and make measurable",
        description: "Capture internal states, project vocabulary neighbourhoods, form networks and make the evidence reproducible.",
    },
    {
        range: "R009–R010",
        title: "Reconstruct meaning",
        description: "Move from token lists to communities, semantic parents and candidate relationships.",
    },
    {
        range: "R011–R015",
        title: "Test what persists",
        description: "Change order, context and the local semantic region to separate recurrence from the particular input.",
    },
    {
        range: "R016–R019",
        title: "Test scale and reliability",
        description: "Instrument a larger model, move to a different concept region and control identical-repeat variability.",
    },
    {
        range: "R020",
        title: "Compare structure with expression",
        description: "Follow an entire poor generated answer and recover semantic relationships that the visible response did not communicate.",
    },
];
const associations = [
    ["Movement / routes", "Settlements", "11 / 32"],
    ["Crossings / connections", "Movement / routes", "8 / 32"],
    ["Built places", "Movement / routes", "7 / 32"],
    ["Built places", "Inhabitants", "7 / 32"],
    ["Inhabitants", "Settlements", "6 / 32"],
];
const correctionRecords = [
    {
        error: "The objective of the project had changed.",
        correction: "The agent's interpretation of that objective had changed.",
        consequence: "The investigation returned to the original objective rather than replacing it.",
    },
    {
        error: "The communities could be compressed into a neat, complete graph.",
        correction: "Relevant relationships and unresolved evidence had been lost.",
        consequence: "The analysis preserved more of the network before imposing a higher-order interpretation.",
    },
    {
        error: "R020 needed continuous semantic integration to count as a successful result.",
        correction: "That requirement introduced a separate research question.",
        consequence: "Recoverable associations were recognised as a finding in their own right.",
    },
];
const artefacts = [
    {
        category: "Article authority",
        title: "Official article outline",
        summary: "The governing question and human–agent learning mechanism.",
        href: researchBase + "/ARTICLE_OUTLINE_OFFICIAL.md",
    },
    {
        category: "Claim-by-claim evidence",
        title: "Article evidence index",
        summary: "Measured, derived, interpreted and proposed claims linked to run artefacts.",
        href: researchBase + "/ARTICLE_EVIDENCE_INDEX.md",
    },
    {
        category: "Experiment history",
        title: "Run optimisation trajectory",
        summary: "Why R001–R020 were conducted and which problem each addressed.",
        href: researchBase + "/RUN_OPTIMISATION_TRAJECTORY.md",
    },
    {
        category: "Reconstructed associations",
        title: "R020 generation-wide report",
        summary: "The recurrent semantic field, per-decision evidence and contextual state results.",
        href: r020Base + "/analysis/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md",
    },
    {
        category: "Evidence integrity",
        title: "R020 independent audit",
        summary: "Verification of cited community-edge records, exemplar tokens and affinities.",
        href: r020Base + "/analysis/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md",
    },
    {
        category: "Correction history",
        title: "Project meta-analysis",
        summary: "Chronological analysis, failed interpretations, human corrections and methodological insights.",
        href: researchBase + "/META_ANALYSIS.md",
    },
];
function SectionHeading({ id, number, eyebrow, title, children }) {
    return (
        <header className={styles.sectionHeading}>
            <div className={styles.sectionIndex} aria-hidden="true">{number}</div>
            <div>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h2 id={id}>{title}</h2>
                {children && <div className={styles.sectionLead}>{children}</div>}
            </div>
        </header>
    );
}
function Outbound({ href, children }) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}
function InteractivePlaceholder({ slot, heading, purpose, controls, expected, source, children }) {
    return (
        <div className={styles.interactivePlaceholder} data-interactive-placeholder={slot}>
            <div className={styles.placeholderTop}>
                <span className={styles.placeholderMarker}>Interactive component placeholder</span>
                <code>{slot}</code>
            </div>
            <h3>{heading}</h3>
            <p>{purpose}</p>
            {children}
            <div className={styles.placeholderSpecification}>
                <div>
                    <strong>Future controls</strong>
                    <p>{controls}</p>
                </div>
                <div>
                    <strong>Expected behaviour</strong>
                    <p>{expected}</p>
                </div>
                <div>
                    <strong>Evidence source</strong>
                    <p>{source}</p>
                </div>
            </div>
            <p className={styles.placeholderFootnote}>Visual scaffolding only. No working data controls or simulated results. Implementation brief: <code>INTERACTIVE_PLACEHOLDERS.md</code>.</p>
        </div>
    );
}

export default function LlmTopologyDraftPage() {
    return (
        <main className={styles.page}>
            <div className={styles.pageTop}>
                <Link href="/art">← Research archive</Link>
                <span>LLM Topology · First visual draft</span>
            </div>

            <header className={styles.hero}>
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>Experimental research / Human–agent discovery</p>
                    <h1>Discovering what you do not know to ask.</h1>
                    <p className={styles.standfirst}>How can a human discover knowledge when they do not understand the possibility space and cannot specify the correct answer?</p>
                    <p className={styles.heroDetail}>Twenty experiments exploring semantic structure inside language models led to a second discovery: correcting an agent's inadequate representations can expose relationships the human could not have requested in advance.</p>
                    <a className={styles.heroJump} href="#problem">Follow the investigation <span aria-hidden="true">↓</span></a>
                </div>
                <div className={styles.heroDiagram} aria-label="Overview of the human and agent learning loop">
                    <p className={styles.panelLabel}>The mechanism</p>
                    <div className={styles.diagramStage}><span>HUMAN</span><strong>Defines the objective without knowing the answer</strong></div>
                    <div className={styles.diagramArrow} aria-hidden="true">↓</div>
                    <div className={styles.diagramStage}><span>AGENT</span><strong>Generates possible relationships and explanations</strong></div>
                    <div className={styles.diagramArrow} aria-hidden="true">↓</div>
                    <div className={styles.diagramStage}><span>HUMAN</span><strong>Recognises what is unsupported, missing or invalid</strong></div>
                    <div className={styles.diagramArrow} aria-hidden="true">↓</div>
                    <div className={styles.diagramStage + " " + styles.diagramResult}><span>DISCOVERY</span><strong>Agent reconstructs; new knowledge becomes available</strong></div>
                    <div className={styles.diagramLoop}>New knowledge → new constraints → repeat</div>
                </div>
            </header>

            <div className={styles.shell}>
                <aside className={styles.sidebar} aria-label="Article contents">
                    <div className={styles.sidebarInner}>
                        <p className={styles.sidebarTitle}>Contents</p>
                        <nav>{navigation.map(([id, label], index) => (
                            <a key={id} href={"#" + id}><span>{String(index + 1).padStart(2, "0")}</span>{label}</a>
                        ))}</nav>
                        <p className={styles.sidebarNote}>First draft · Sections and interactive evidence slots are open to revision.</p>
                    </div>
                </aside>

                <article className={styles.article}>
                    <section className={styles.section} id="problem">
                        <SectionHeading number="01" eyebrow="The problem" title="A question you cannot yet ask">
                            <p>A language model can provide an answer to a question. But an unfamiliar field presents a harder problem: the human may not know which relationships to ask about, what would count as an adequate explanation or where the initial representation is incomplete.</p>
                        </SectionHeading>
                        <div className={styles.contrastGrid}>
                            <div className={styles.contrastCard}>
                                <p className={styles.panelLabel}>Conventional interaction</p>
                                <p>Ask a question → receive a plausible answer → accept the model's selection of what matters.</p>
                                <strong>Unseen alternatives remain unseen.</strong>
                            </div>
                            <div className={styles.contrastCard + " " + styles.contrastActive}>
                                <p className={styles.panelLabel}>Constrained reconstruction</p>
                                <p>Ask → inspect the structure → reject inadequate abstractions → reconstruct under new constraints.</p>
                                <strong>The search space becomes more visible.</strong>
                            </div>
                        </div>
                        <p className={styles.bodyCopy}>The earlier <Link href="/art/the-zombie-survival-strategy-chatgpt-could-not-see">zombie-survival investigation</Link> provided a concrete example: ChatGPT could name relevant components yet failed to assemble their useful relationship. The topology project asks what additional relationships can be recovered when representations themselves become the object of study.</p>
                    </section>

                    <section className={styles.section} id="instruments">
                        <SectionHeading number="02" eyebrow="Two complementary instruments" title="Expose the structure behind the answer">
                            <p>The project developed two different ways to enlarge what can be investigated. Neither instrument replaces the human's judgement about which relationships matter.</p>
                        </SectionHeading>
                        <div className={styles.instrumentGrid}>
                            <div className={styles.instrument}>
                                <p className={styles.panelLabel}>Direct experimental measurement</p>
                                <h3>LLM topology</h3>
                                <p>Capture transformer states, project vocabulary neighbourhoods, construct community networks, infer higher-order relations and test their recurrence under controlled changes.</p>
                                <div className={styles.miniFlow}>States <span>→</span> Networks <span>→</span> Relations</div>
                                <Link href="/art/hidden-representations-without-hidden-layers">What changes when internal representations are accessible →</Link>
                            </div>
                            <div className={styles.instrument}>
                                <p className={styles.panelLabel}>Behavioural structural interrogation</p>
                                <h3>SDA-3 and structural extraction</h3>
                                <p>Interrogate the model's responses for dominant, adjacent, unresolved and missing structures. Apply constraints to test whether the resulting explanation survives questioning.</p>
                                <div className={styles.miniFlow}>Response <span>→</span> Challenge <span>→</span> Reconstruction</div>
                                <Link href="/art/sda-3-analysing-embedding-space-structure-in-large-language-models">Read the original SDA-3 method →</Link>
                            </div>
                        </div>
                        <p className={styles.bodyCopy}>The first instrument measures model-derived structure. The second generates behavioural hypotheses and questions. They complement one another, but a behavioural reconstruction is not a measurement of hidden states.</p>
                    </section>

                    <section className={styles.section} id="learning-loop">
                        <SectionHeading number="03" eyebrow="The mechanism" title="The human does not need to know the answer to recognise a mistake">
                            <p>This asymmetry is the centre of the official article outline. Generating a valid representation and recognising an invalid one are different tasks.</p>
                        </SectionHeading>
                        <div className={styles.loopGrid}>
                            {[
                                ["01", "Agent generates", "Candidate relationships and an organising hypothesis"],
                                ["02", "Human constrains", "Finds a contradiction, omission or invalid transformation"],
                                ["03", "Agent reconstructs", "Preserves evidence while considering alternatives"],
                                ["04", "Human learns", "Examines a possibility that was not visible at the start"],
                            ].map(([number, title, body]) => (
                                <div className={styles.loopStep} key={number}>
                                    <span>{number}</span><h3>{title}</h3><p>{body}</p>
                                </div>
                            ))}
                        </div>
                        <p className={styles.keyStatement}>The human supplies independent constraints without specifying the destination. The agent generates new representations that can be tested against those constraints.</p>
                    </section>

                    <section className={styles.section} id="research">
                        <SectionHeading number="04" eyebrow="Experimental trajectory" title="Twenty runs, five changes in the question">
                            <p>The run history should be readable as a sequence of newly exposed constraints, not as twenty equally important procedural chapters.</p>
                        </SectionHeading>
                        <div className={styles.timeline}>
                            {phases.map((phase, index) => (
                                <div className={styles.epoch} key={phase.range}>
                                    <span className={styles.epochNumber}>0{index + 1}</span>
                                    <div className={styles.epochContent}>
                                        <p className={styles.panelLabel}>{phase.range}</p>
                                        <h3>{phase.title}</h3>
                                        <p>{phase.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className={styles.sourceNote}>The full run-by-run breakdown remains in <Outbound href={researchBase + "/RUN_OPTIMISATION_TRAJECTORY.md"}>Run Optimisation Trajectory</Outbound>. This page retains the decisions needed to understand the discovery.</p>
                    </section>

                    <section className={styles.section} id="r020">
                        <SectionHeading number="05" eyebrow="A decisive experimental example" title="Information available beyond the generated answer">
                            <p>R020 examined a very small model answering why a city would build a bridge across a river. The generated continuation was circular. Its internal neighbourhoods nevertheless contained recurring associations among people, settlements, movement and crossings.</p>
                        </SectionHeading>
                        <div className={styles.stats}>
                            <div><strong>32</strong><span>Generated-token decisions</span></div>
                            <div><strong>512</strong><span>State/sector networks</span></div>
                            <div><strong>6,944</strong><span>Detected communities</span></div>
                            <div><strong>21/32</strong><span>Decisions with qualifying contextual candidate relations</span></div>
                        </div>
                        <div className={styles.readout}>
                            <div>
                                <p className={styles.panelLabel}>Generation-wide reconstruction</p>
                                <h3>The recurrent semantic field</h3>
                                <p>The strongest relationships link settlements to routes and routes to crossings. Other recurring associations involve inhabited places and the built environment.</p>
                            </div>
                            <div className={styles.connectionList}>
                                {associations.map(([a, b, count]) => (
                                    <div className={styles.connectionRow} key={a + b}>
                                        <span>{a} <em>↔</em> {b}</span><strong>{count}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className={styles.evidenceCaption}>Recurrence counts show the number of generation decisions containing qualifying positive-sector community relationships in contextual states S01–S05. They are not probabilities or causal strengths. Eleven decisions were unresolved at the analysis threshold; this does not establish absent structure. <Outbound href={r020Base + "/analysis/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md"}>Read the audited evidence</Outbound>.</p>

                        <InteractivePlaceholder
                            slot="topology-explorer"
                            heading="Explore the reconstructed semantic network"
                            purpose="Future interactive view of measured community connections and their interpreted semantic roles. The sample below only indicates the intended data hierarchy."
                            controls="Choose semantic family; filter transformer state and cosine sector; inspect evidence for selected connections."
                            expected="Render measured nodes and edges, show the original community IDs and token-edge counts, and preserve unresolved communities without drawing invented edges."
                            source="R020 community_edges.csv and per-decision relational/hypothesis JSON files."
                        >
                            <div className={styles.networkSketch} aria-label="Static schematic showing proposed explorer groups">
                                <div className={styles.networkNode}>Settlements</div>
                                <div className={styles.networkConnector}>measured candidate relations</div>
                                <div className={styles.networkNode + " " + styles.networkNodeEmphasis}>Movement / routes</div>
                                <div className={styles.networkConnector}>measured candidate relations</div>
                                <div className={styles.networkNode}>Crossings</div>
                            </div>
                            <p className={styles.placeholderCaption}>Schematic only — not an independently rendered network from source data.</p>
                        </InteractivePlaceholder>

                        <InteractivePlaceholder
                            slot="generation-state-comparator"
                            heading="Follow a relation through generation and transformer depth"
                            purpose="Future evidence view for one generated-token decision at a time, showing where candidate relationships recur, change or remain unresolved."
                            controls="Decision D01–D32; transformer state S00–S07; positive/negative sector; optionally compare two decisions."
                            expected="Load the corresponding saved network and reconstruction records, update the trace and show source citations for each claimed relationship. Mark any missing screen match as unresolved."
                            source="R020 generation trace, state/sector networks, cross-generation hypothesis trajectory and v3 checkpoint files."
                        >
                            <div className={styles.comparatorSketch}>
                                <div className={styles.mockToolbar}>
                                    <span>Decision: D06</span><span>State: S01</span><span>Sector: Positive</span>
                                </div>
                                <div className={styles.mockTracks}>
                                    <div><span>Input embeddings</span><b style={{ width: "32%" }} /></div>
                                    <div><span>Contextual states</span><b style={{ width: "76%" }} /></div>
                                    <div><span>Final normalisation</span><b style={{ width: "18%" }} /></div>
                                </div>
                            </div>
                            <p className={styles.placeholderCaption}>Decorative preview values only. The illustrated selections and bars are not measured results.</p>
                        </InteractivePlaceholder>
                    </section>

                    <section className={styles.section} id="corrections">
                        <SectionHeading number="06" eyebrow="Meta-analysis" title="The failed interpretations were part of the evidence">
                            <p>The experiment's numerical history is only one part of the research record. The human repeatedly identified where the agent had imposed a misleading interpretation or lost important information through premature compression.</p>
                        </SectionHeading>
                        <div className={styles.corrections}>
                            {correctionRecords.map((item, index) => (
                                <div className={styles.correction} key={item.error}>
                                    <span className={styles.correctionNumber}>{String(index + 1).padStart(2, "0")}</span>
                                    <div><p className={styles.panelLabel}>Initial abstraction</p><p>{item.error}</p></div>
                                    <div><p className={styles.panelLabel}>Human correction</p><p>{item.correction}</p></div>
                                    <div><p className={styles.panelLabel}>What changed</p><p>{item.consequence}</p></div>
                                </div>
                            ))}
                        </div>
                        <InteractivePlaceholder
                            slot="correction-ledger"
                            heading="Trace a correction back to the research record"
                            purpose="Future navigable record of candidate abstractions, human objections, revised hypotheses and their consequences."
                            controls="Select meta-analysis entry or run; filter by correction type; open preceding and revised interpretations."
                            expected="Display verbatim cited excerpts with entry IDs and links; do not retroactively overwrite the earlier interpretation."
                            source="META_ANALYSIS.md (notably MA-0083, MA-0120, MA-0125–MA-0127) and relevant run conclusions."
                        >
                            <div className={styles.ledgerPreview}>
                                <span>Proposed interpretation</span><span aria-hidden="true">→</span><span>Human correction</span><span aria-hidden="true">→</span><span>Reconstructed interpretation</span>
                            </div>
                        </InteractivePlaceholder>
                        <p className={styles.bodyCopy}>This revisits the earlier <Link href="/art/zombie-survival-chatgpt-why-the-ai-lies-and-how-to-stop-it">human-supervised zombie-survival case</Link>, but with an accumulated record of measured networks, experimental controls and specific changes to the researcher's interpretation.</p>
                    </section>

                    <section className={styles.section} id="insight">
                        <SectionHeading number="07" eyebrow="The unexpected discovery" title="The agent's exploration became an instrument for human learning">
                            <p>The original research sought to infer learned semantic structure. The interpretive process exposed a second, complementary result: human judgement can guide exploration of a possibility space the human does not yet understand.</p>
                        </SectionHeading>
                        <blockquote className={styles.largeQuote}>
                            The human can recognise a violation without already possessing the correct solution.
                        </blockquote>
                        <div className={styles.labourGrid}>
                            <div><p className={styles.panelLabel}>Human responsibility</p><h3>Objective and judgement</h3><p>Define the purpose. Identify conflicts, missing relations and invalid transformations. Decide what information is useful.</p></div>
                            <div><p className={styles.panelLabel}>Agent responsibility</p><h3>Exploration and reconstruction</h3><p>Generate possible relationships. Reconstruct alternatives under constraints. Make previously unseen structure available for inspection.</p></div>
                            <div><p className={styles.panelLabel}>Shared external memory</p><h3>Evidence and continuity</h3><p>Preserve experiments, failed abstractions, corrections and revised semantic maps so later work can test them.</p></div>
                        </div>
                        <p className={styles.bodyCopy}>The same division of labour appears in a different form in the site's <Link href="/art/building-an-agent-native-after-effects-workflow">agent-native creative-production workflow</Link>: human intention remains authoritative while an agent operates on inspectable representations.</p>
                    </section>

                    <section className={styles.section} id="archive">
                        <SectionHeading number="08" eyebrow="Evidence and continuation" title="The article is an entry point, not the entire research archive">
                            <p>Readers can follow the central finding here, or examine the evidence, protocols, run reports and correction history that make the research reconstructable.</p>
                        </SectionHeading>
                        <div className={styles.artefactGrid}>
                            {artefacts.map((item) => (
                                <Outbound key={item.href} href={item.href}>
                                    <span className={styles.panelLabel}>{item.category}</span>
                                    <strong>{item.title}</strong>
                                    <span>{item.summary}</span>
                                </Outbound>
                            ))}
                        </div>
                        <div className={styles.related}>
                            <p className={styles.panelLabel}>Connected portfolio research</p>
                            <Link href="/art/from-seo-keywords-to-the-haunted-machine">The Haunted Machine — reconstructing relations from network communities →</Link>
                            <Link href="/art/structural-extraction-protocol">Structural Extraction Protocol — testing relationships through constraint →</Link>
                            <Link href="/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content">Discovering Hidden Structure — the wider research framework →</Link>
                        </div>
                    </section>

                    <footer className={styles.conclusion}>
                        <p className={styles.eyebrow}>Return to the opening question</p>
                        <h2>A human can investigate an unknown possibility space without first knowing the answer.</h2>
                        <p>The agent proposes representations. The human identifies where they fail. The record preserves what was learnt. New understanding becomes available through the next reconstruction.</p>
                        <a href="#problem">Return to the question ↑</a>
                    </footer>
                </article>
            </div>
        </main>
    );
}
