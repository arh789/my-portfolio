import Link from "next/link";
import SemanticNetworkExplorer from "./SemanticNetworkExplorer";
import styles from "./page.module.css";

const repository = "https://github.com/arh789/llm_topology";
const research = repository + "/blob/main";
const runs = research + "/single_prompt_topology/runs";
const r020 = runs + "/R020_pythia-70m-representation-output-contrast";
const r020Analysis = r020 + "/analysis";
const r015 = runs + "/R015_qwen-adjacent-neighbourhood-expansion";
const r018 = runs + "/R018_olmo3-choke-point-barrier-spear-permutation-topology";
const r019 = runs + "/R019_olmo3-order-repeatability-control";

export const metadata = {
    title: "How can you search for what you do not know exists? | LLM Topology",
    description:
        "A small language model gives a poor answer to a simple question. Its intermediate states reveal a wider network of semantic associations, and new directions to investigate.",
    alternates: { canonical: "/art/llm-topology" },
    openGraph: {
        title: "How can you search for what you do not know exists?",
        description:
            "Explore the semantic relationships a language model's generated answer leaves out.",
        type: "article",
    },
};

const stages = [
    {
        index: "01",
        name: "Capture",
        explanation: "Record the numerical representation at each transformer state while the model generates its next tokens. This gives us something to inspect besides the final sentence.",
        source: research + "/single_prompt_topology/r020_pythia_generation_topology.py",
    },
    {
        index: "02",
        name: "Compare",
        explanation: "Compare each recorded state against a shared token-embedding vocabulary. Words with similar numerical positions provide candidate neighbourhoods for investigation.",
        source: research + "/single_prompt_topology/r020_pythia_generation_topology.py",
    },
    {
        index: "03",
        name: "Connect",
        explanation: "Build networks from those neighbourhoods, then identify groups of related tokens and the measured connections between them.",
        source: research + "/single_prompt_topology/topology_core.py",
    },
    {
        index: "04",
        name: "Reconstruct",
        explanation: "Examine the measured communities and their edges before assigning descriptive labels. Keep unexpected and unresolved associations visible rather than forcing one tidy story.",
        source: r020Analysis + "/R020_RELATIONAL_SEMANTIC_RECONSTRUCTION_V2.md",
    },
];

const checks = [
    {
        question: "Can intermediate-state communities be reconstructed?",
        finding: "R009–R010 developed state-local semantic classification and parent-level reconstruction.",
        link: runs + "/R010_lithium-layerwise-latent-generative-structure/phase_d/R010_PHASE_D_CONFLICT_RESOLUTION_REPORT.md",
        tag: "R009–R010",
    },
    {
        question: "Does the map depend on the words in the prompt?",
        finding: "R014–R015 changed all four seed concepts and independently reconstructed corresponding higher-order families. The relationships also changed in meaningful ways.",
        link: r015 + "/R014_R015_COMPARISON.md",
        tag: "R014–R015",
    },
    {
        question: "Does word order affect the networks?",
        finding: "R018 recorded substantial middle-layer differences between permutations, followed by greater similarity in later states.",
        link: r018 + "/R018_SEMANTIC_RECONSTRUCTION.md",
        tag: "R018",
    },
    {
        question: "Could those differences just be random execution noise?",
        finding: "In R019, three repeats per tested order matched exactly across the captured states. Different orders still diverged.",
        link: r019 + "/R019_MEASUREMENT_REPORT.md",
        tag: "R019",
    },
    {
        question: "Can we trace the R020 maps back to actual measurements?",
        finding: "The source audit matched all 359 cited relationship examples to recorded community edges, without a mismatch.",
        link: r020Analysis + "/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md",
        tag: "R020",
    },
];

function SourceLink({ href, children }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>
            {children}<span aria-hidden="true"> ↗</span>
        </a>
    );
}

function SectionHead({ n, eyebrow, title, children }) {
    return (
        <header className={styles.sectionHead}>
            <div className={styles.sectionIndicator}><span>{n}</span>{eyebrow}</div>
            <h2>{title}</h2>
            {children && <p className={styles.sectionIntro}>{children}</p>}
        </header>
    );
}

export default function LlmTopologyArticle() {
    return (
        <main className={styles.page}>
            <article className={styles.article}>
                <div className={styles.breadcrumb}>
                    <Link href="/art">Research archive</Link>
                    <span aria-hidden="true">/</span>
                    <span>LLM Topology</span>
                </div>

                <header className={styles.introduction}>
                    <p className={styles.kicker}>01 / The problem · LLM topology</p>
                    <h1>How can you search for what you do not know exists?</h1>
                    <p>Ask a language model a simple question, and sometimes it gives you a stupid answer. But that answer is only the visible result of a much richer process. As the model generates its response, its intermediate states contain associations between ideas that may never appear in the words it produces.</p>
                    <p className={styles.openQuestion}>What if we could reconstruct those associations as a network, and use that network to discover things we didn&apos;t know to look for?</p>
                    <p>To explore this, we asked Pythia 70M, a very small open-weights language model, why a city would build a bridge across a river. It failed to give a meaningful answer. Yet when we examined its intermediate states, we uncovered a much broader network of concepts and relationships, including possibilities the model never managed to express in its response.</p>
                </header>

                <section className={styles.section} id="experiment">
                    <SectionHead n="02" eyebrow="The experiment" title="A simple question. A stupid answer.">
                        The experiment asked a small language model one ordinary question. The prompt and its continuation were saved exactly.
                    </SectionHead>
                    <div className={styles.experimentPair}>
                        <div className={styles.experimentInput}>
                            <div className={styles.experimentLabel}><span>Experimental input</span><strong>Pythia 70M</strong></div>
                            <pre>{"Question: Why would a city build a bridge across a river?\nAnswer:"}</pre>
                        </div>
                        <div className={styles.experimentOutput}>
                            <div className={styles.experimentLabel}><span>Generated response</span><strong>32 tokens</strong></div>
                            <pre>{"The city is a bridge that connects the river with the river.\n\nA:\n\nThe city is a bridge that connects the river with the river."}</pre>
                        </div>
                    </div>
                    <p className={styles.transition}>The answer goes nowhere. But we also recorded the model&apos;s changing internal representations as it generated those 32 tokens. From them, we constructed networks showing which associated concepts appeared together, and how the connections changed.</p>
                    <p className={styles.smallSource}><SourceLink href={r020 + "/prompt_records.json"}>Exact input, generated text and token record</SourceLink></p>
                </section>

                <section className={styles.section + " " + styles.discoverySection} id="network">
                    <SectionHead n="03" eyebrow="The discovery" title="What was happening inside the model?">
                        The generated response leaves almost everything out. The recorded networks provide somewhere else to look.
                    </SectionHead>
                    <SemanticNetworkExplorer />
                </section>

                <section className={styles.section} id="adjacent">
                    <SectionHead n="04" eyebrow="Follow the unexpected branches" title="What else does the network reveal?">
                        Some associations are familiar. Others make the next question less obvious — and potentially more interesting.
                    </SectionHead>
                    <div className={styles.findings}>
                        <div>
                            <span>01 / Disruption</span>
                            <h3>Why do rebuilding and catastrophe appear near bridges?</h3>
                            <p>In the bridge neighbourhood, journeys connect to the bridge with <strong>120</strong> measured edges. Disruption connects with <strong>125</strong>; its community also links to reconstruction with <strong>67</strong>. That opens questions about repairs, flooding and infrastructure recovery — none of which the answer mentions.</p>
                        </div>
                        <div>
                            <span>02 / Human activity</span>
                            <h3>What else connects settlements and movement?</h3>
                            <p>The wider reconstruction contains inhabitants, roads, boats, built places and business-related vocabulary. These associations suggest investigating what infrastructure enables for people and communities, rather than treating a bridge solely as an object spanning water.</p>
                        </div>
                        <div>
                            <span>03 / Unresolved</span>
                            <h3>What is the mathematical branch doing there?</h3>
                            <p>At a later intermediate state, a connections community links to mathematical vocabulary including Poisson, Riemannian and manifold. The recorded link has <strong>74</strong> token-neighbour edges. Its significance is not established. That is a reason to inspect it, not to remove it from the map.</p>
                        </div>
                    </div>
                    <p className={styles.sectionAfter}>The discovery is not a secret finished answer concealed in the model. It is the ability to see candidate relationships beyond the answer and choose which ones deserve investigation.</p>
                </section>

                <section className={styles.section} id="method">
                    <SectionHead n="05" eyebrow="How we did it" title="Turning numerical states into something we can explore">
                        The network is not an image the model produced for us. It was reconstructed through a measurement and analysis pipeline.
                    </SectionHead>
                    <div className={styles.methodSteps}>
                        {stages.map((stage) => (
                            <div className={styles.methodStep} key={stage.index}>
                                <span>{stage.index}</span>
                                <div>
                                    <h3>{stage.name}</h3>
                                    <p>{stage.explanation}</p>
                                    <SourceLink href={stage.source}>Inspect this operation</SourceLink>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.codeNote}>
                        <div>
                            <p className={styles.kicker}>A real operation from the R020 semantic analyser</p>
                            <p>For a candidate relationship to enter the selected semantic summary, it had to be backed by a recorded community connection and meet declared thresholds. This is one of those checks:</p>
                        </div>
                        <pre><code>{"const affinity = e.token_edge_count / Math.sqrt(ca.size * cb.size);\nif (affinity < 0.30 || e.token_edge_count < 30) continue;"}</code></pre>
                        <SourceLink href={r020Analysis + "/R020_SEMANTIC_CONTINUITY_REPRODUCER.js"}>See the complete R020 analyser</SourceLink>
                    </div>
                </section>

                <section className={styles.section} id="evidence">
                    <SectionHead n="06" eyebrow="Evidence and controls" title="Does the reconstructed structure stand up to scrutiny?">
                        The bridge example shows why inspection might be useful. Earlier experiments tested how much of the reconstruction survives when the input, context and execution conditions change.
                    </SectionHead>
                    <div className={styles.evidenceRows}>
                        {checks.map((item) => (
                            <div className={styles.evidenceRow} key={item.tag}>
                                <span className={styles.evidenceTag}>{item.tag}</span>
                                <div>
                                    <h3>{item.question}</h3>
                                    <p>{item.finding}</p>
                                    <SourceLink href={item.link}>Read the evidence</SourceLink>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className={styles.evidenceBoundary}>The token communities and edges are measured or calculated from the captured model states. The higher-order family names and their possible meaning are interpretations. The experiments test those interpretations; they do not turn every interesting connection into an established explanation.</p>
                </section>

                <section className={styles.section} id="human">
                    <SectionHead n="07" eyebrow="The human–agent discovery process" title="The map changes what we can ask next">
                        The research also exposed a different way for a human to work with an analysing agent.
                    </SectionHead>
                    <p>In the R014–R015 experiments, four original concepts were replaced with neighbouring ones. Six higher-order semantic families were reconstructed again, including process/change and information structures that were not supplied as seed concepts. The human then asked the agent to investigate the map from different structural directions:</p>
                    <blockquote className={styles.humanQuestion}>Based on that map, what tokens are central and what are adjacent? What logically emerges from this network? What logically should be there but isn&apos;t? When this network is treated purely as a vector, without trying to force coherence, what else highly correlates with it?</blockquote>
                    <p>The resulting investigation treated process/change as a potentially important organising family in the changed network. Instead of receiving an answer and stopping, the human used an unfamiliar structure to formulate another question, with the agent reconstructing the evidence in response.</p>
                    <p>That is the division of labour the project made visible: the analysis exposes possibilities; the human recognises what might matter and directs further investigation; the evidence decides which interpretations survive.</p>
                    <div className={styles.humanSources}>
                        <SourceLink href={research + "/META_ANALYSIS.md"}>Human–agent meta-analysis</SourceLink>
                        <SourceLink href={r015 + "/R014_R015_COMPARISON.md"}>R014–R015 reconstruction comparison</SourceLink>
                    </div>
                </section>

                <footer className={styles.articleEnd}>
                    <p className={styles.kicker}>Back to the opening question</p>
                    <h2>You cannot search directly for a relationship you do not know exists. You can explore a map that makes it visible.</h2>
                    <p>The value of the intermediate-state analysis is not that it supplies every answer. It is that it opens up directions of enquiry the final generated response never presented.</p>
                    <div className={styles.footerLinks}>
                        <SourceLink href={r020Analysis + "/R020_VERIFIED_CONSOLIDATED_SEMANTIC_MAP.md"}>R020 verified semantic map</SourceLink>
                        <SourceLink href={research + "/ARTICLE_EVIDENCE_INDEX.md"}>Claim–evidence index</SourceLink>
                        <SourceLink href={research + "/REPRODUCIBILITY.md"}>Reproducibility</SourceLink>
                        <SourceLink href={repository}>Research repository</SourceLink>
                    </div>
                    <p className={styles.publicationNote}>The research repository is currently private. Public source access and immutable publication references remain separate publication tasks.</p>
                    <Link className={styles.backLink} href="/art">← Return to the research archive</Link>
                </footer>
            </article>
        </main>
    );
}
