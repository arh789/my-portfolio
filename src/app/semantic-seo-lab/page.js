import { loadNotebook } from "./notebookRenderer.js";
import styles from "./semanticSeoLab.module.css";

const PART_C_HEADINGS = [
    {
        level: 1,
        text: "Part C - Observed Search Outcome",
        slug: "part-c-observed-search-outcome",
    },
    {
        level: 2,
        text: "Site trajectory",
        slug: "site-trajectory",
    },
    {
        level: 2,
        text: "Six-page impression trajectory",
        slug: "six-page-impression-trajectory",
    },
    {
        level: 2,
        text: "Query-specific page ranking",
        slug: "query-specific-page-ranking",
    },
    {
        level: 2,
        text: "What the evidence supports",
        slug: "what-the-evidence-supports",
    },
];

const ANALYTICS_FIGURES = [
    {
        id: "site-trajectory",
        title: "Site trajectory",
        src: "/semantic-seo-lab/analytics/site-visibility-trajectory.png",
        alt: "Line chart showing the site's trailing seven-day average impressions and fitted trend.",
        description:
            "The observed line is the trailing seven-day average of total daily impressions. The quadratic fit describes the direction of the observed smoothed series only; it is not extrapolated beyond the available data.",
    },
    {
        id: "six-page-impression-trajectory",
        title: "Six-page impression trajectory",
        src: "/semantic-seo-lab/analytics/six-page-impression-trajectory.png",
        alt: "Line chart comparing trailing seven-day impressions for six pages, including the Semantic SEO Lab page.",
        description:
            "This view uses date + page data and therefore does not depend on visible-query totals. Every line is a trailing seven-day average; missing page-day combinations are treated as zero impressions.",
    },
    {
        id: "query-specific-page-ranking",
        title: "Query-specific page ranking",
        src: "/semantic-seo-lab/analytics/query-specific-page-ranking.png",
        alt: "Multi-panel chart showing fixed-query impressions and weighted page position for Semantic SEO pages.",
        description:
            "Each row follows one fixed query across /code, /semantic-seo-lab, and the two earlier Semantic SEO pages. The left panel shows trailing seven-day impression totals; the right panel shows trailing seven-day impression-weighted position for exactly the same query-page pair.",
    },
];

export const metadata = {
    title: "Semantic SEO With Python | Agent-Run Research Notebook",
    description:
        "A code-grounded, graph-mediated Semantic SEO research notebook using Python, transformer embeddings, NetworkX and human-supervised Codex interpretation to test whether SEO representations are usable.",
    keywords: [
        "semantic seo python",
        "Python SEO automation",
        "NLP for SEO",
        "spaCy SEO",
        "BERT semantic SEO",
        "RoBERTa semantic similarity SEO",
        "keyword clustering Python",
        "NetworkX SEO",
        "content gap analysis Python",
        "internal linking SEO Python",
        "agent supervised SEO research",
    ],
    alternates: {
        canonical: "/semantic-seo-lab",
    },
};

function NotebookSidebar({ headings }) {
    return (
        <aside className={styles.sidebar} aria-label="Notebook outline">
            <div className={styles.sidebarInner}>
                <p className={styles.sidebarEyebrow}>Notebook outline</p>
                <nav className={styles.sidebarNav}>
                    {headings.map((heading) => (
                        <a
                            className={styles.sidebarLink}
                            data-level={heading.level}
                            href={`#${heading.slug}`}
                            key={heading.slug}
                        >
                            {heading.text}
                        </a>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

function Output({ output, index }) {
    if (output.type === "image") {
        return (
            <figure className={styles.figure}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt={`Notebook figure ${index + 1}`}
                    loading="lazy"
                    src={output.src}
                />
            </figure>
        );
    }

    if (output.type === "html") {
        return (
            <details className={styles.outputDetails} open>
                <summary>{output.label}</summary>
                <div
                    className={styles.htmlOutput}
                    dangerouslySetInnerHTML={{ __html: output.html }}
                />
            </details>
        );
    }

    const longOutput = output.text.length > 1200;

    return (
        <details className={styles.outputDetails} open={!longOutput}>
            <summary>{output.label}</summary>
            <pre
                className={
                    output.type === "stream"
                        ? styles.consoleOutput
                        : styles.plainOutput
                }
            >
                {output.text}
            </pre>
        </details>
    );
}

function NotebookCell({ cell, index }) {
    if (cell.type === "markdown") {
        return (
            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                data-cell-index={index}
                id={cell.headings[0]?.slug ? undefined : cell.id}
            >
                <div dangerouslySetInnerHTML={{ __html: cell.html }} />
            </section>
        );
    }

    return (
        <section
            className={`${styles.cell} ${styles.codeCell}`}
            data-cell-index={index}
            id={cell.id}
        >
            <div className={styles.cellHeader}>
                <span>Python code</span>
                {cell.executionCount ? (
                    <span>executed #{cell.executionCount}</span>
                ) : null}
            </div>
            <pre className={styles.codeBlock}>
                <code>{cell.source}</code>
            </pre>
            {cell.outputs.length ? (
                <div className={styles.outputs}>
                    {cell.outputs.map((output, outputIndex) => (
                        <Output
                            index={outputIndex}
                            key={`${cell.id}-output-${outputIndex}`}
                            output={output}
                        />
                    ))}
                </div>
            ) : null}
        </section>
    );
}

function PartCAnalyticsSnapshot() {
    return (
        <>
            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-c-observed-search-outcome"
            >
                <h1>Part C - Observed Search Outcome</h1>
                <p>
                    This snapshot measures the site&apos;s earliest available Google
                    Search Console visibility, covering 31 March to 18 August
                    2026. Because the export begins with the site&apos;s first
                    recorded search data, the baseline reflects a new site
                    finding its search footing rather than a mature domain with
                    years of accumulated history. The <code>/semantic-seo-lab</code>{" "}
                    page became publication-ready on 28 July, giving the
                    analysis a clear before-and-after point.
                </p>
                <p>
                    Before <code>/semantic-seo-lab</code>, Google Search Console
                    already showed recurring associations between the site and
                    three related semantic-SEO queries. Visibility was
                    distributed across several pages, impressions remained
                    limited, and rankings were generally too deep to produce
                    traffic.
                </p>
                <p>
                    After the lab appeared, impressions for the same query
                    cluster increased sharply, exposure shifted from{" "}
                    <code>semantic seo python</code> to the specific{" "}
                    <code>how to use...</code> query before returning back to the
                    broader <code>semantic seo python</code>, and the lab page
                    became the preferred landing page with meaningful visibility
                    around page two. Total site impressions increased,
                    indicating that the lab expanded visibility rather than
                    merely redistributed it.
                </p>
                <p>
                    The following graphs examine the site-level growth, the
                    transfer of page impressions, and the query-specific ranking
                    changes behind that conclusion.
                </p>
            </section>

            {ANALYTICS_FIGURES.map((figure) => (
                <section
                    className={`${styles.cell} ${styles.markdownCell}`}
                    id={figure.id}
                    key={figure.id}
                >
                    <h2>{figure.title}</h2>
                    <p>{figure.description}</p>
                    <figure className={styles.figure}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img alt={figure.alt} loading="lazy" src={figure.src} />
                    </figure>
                </section>
            ))}

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="what-the-evidence-supports"
            >
                <h2>What The Evidence Supports</h2>
                <ul>
                    <li>
                        <strong>Reliable association with three terms:</strong>{" "}
                        Google already understood the site's semantic relevance.
                        The problem was not discovery or topic recognition.
                    </li>
                    <li>
                        <strong>
                            Consolidation around <code>semantic seo python</code>:
                        </strong>{" "}
                        Google was already converging on a central query theme,
                        but had not found a strong landing page.
                    </li>
                    <li>
                        <strong>Low impression baseline:</strong> The existing
                        pages produced recurring but limited visibility.
                    </li>
                    <li>
                        <strong>Rankings around 70-90:</strong> The site was
                        relevant enough to enter results but lacked a
                        sufficiently strong query-page match to become
                        competitive.
                    </li>
                    <li>
                        <strong>Post-lab impression increase:</strong> The lab
                        did more than inherit existing impressions; it expanded
                        exposure for the same query cluster.
                    </li>
                    <li>
                        <strong>Cycling through terms:</strong>{" "}
                        &quot;Cycling&quot; here means Google reallocating exposure
                        between candidate query formulations, not necessarily a
                        recurring periodic cycle. The handoff from{" "}
                        <code>how to use...</code> toward{" "}
                        <code>semantic seo python</code> supports this
                        interpretation.
                    </li>
                    <li>
                        <strong>Page-two consolidation:</strong>{" "}
                        Impression-weighted lab performance became dominated by{" "}
                        <code>semantic seo python</code> around position 15, with{" "}
                        <code>python for semantic seo</code>{" "}around position 11.
                        The lab&apos;s aggregate meaningful exposure therefore
                        consolidated around page two, even though{" "}
                        <code>how to use...</code> later weakened toward position
                        27 as impressions for the other associated search terms
                        increased.
                    </li>
                    <li>
                        <strong>Preferred landing page:</strong> Google resolved
                        the previous page ambiguity in favour of the
                        purpose-built lab page.
                    </li>
                    <li>
                        <strong>Increased site growth:</strong> Because total
                        site impressions increased rather than merely moving
                        between pages, the intervention was incrementally
                        productive rather than purely cannibalistic.
                    </li>
                </ul>
                <p>
                    The reference to Google reallocating or cycling exposure
                    describes the observed Search Console pattern. It is an
                    interpretation of ranking behaviour, not direct evidence of
                    Google&apos;s internal testing process.
                </p>
            </section>
        </>
    );
}

export default async function SemanticSeoLabPage() {
    const notebook = await loadNotebook();
    const headings = [...notebook.headings, ...PART_C_HEADINGS];

    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <NotebookSidebar headings={headings} />
                <article className={styles.notebook}>
                    {notebook.cells.map((cell, index) => (
                        <NotebookCell cell={cell} index={index} key={cell.id} />
                    ))}
                    <PartCAnalyticsSnapshot />
                </article>
            </div>
        </main>
    );
}