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
        text: "Part C.1 - Initial consolidation",
        slug: "part-c-1-initial-consolidation",
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
        text: "Analytics evidence summary",
        slug: "analytics-evidence-summary",
    },
    {
        level: 2,
        text: "What the evidence supports",
        slug: "what-the-evidence-supports",
    },
    {
        level: 2,
        text: "Part C.2 - Later query-page differentiation",
        slug: "part-c-2-later-query-page-differentiation",
    },
    {
        level: 2,
        text: "Site trajectory (updated)",
        slug: "part-c-2-site-trajectory",
    },
    {
        level: 2,
        text: "Six-page impression trajectory (updated)",
        slug: "part-c-2-six-page-impression-trajectory",
    },
    {
        level: 2,
        text: "Query-specific page ranking (updated)",
        slug: "part-c-2-query-specific-page-ranking",
    },
    {
        level: 3,
        text: "Updated evidence",
        slug: "updated-evidence",
    },
    {
        level: 3,
        text: "What changed",
        slug: "what-changed",
    },
];

const ANALYTICS_EVIDENCE_SUMMARY = [
    {
        field: "Data window",
        value: "31 March-18 August 2026",
    },
    {
        field: "Lab publication-ready date",
        value: "28 July 2026",
    },
    {
        field: "Source",
        value: "Google Search Console export",
    },
    {
        field: "Query cluster",
        value:
            "semantic seo python; python for semantic seo; how to use python for nlp and semantic seo",
    },
    {
        field: "Primary observed page",
        value: "/semantic-seo-lab",
    },
    {
        field: "Metrics used",
        value: "impressions; average position; query; page",
    },
    {
        field: "Main observed outcome",
        value: "visibility expanded and consolidated around the lab page",
    },
    {
        field: "Limitation",
        value:
            "observational Search Console evidence, not direct proof of Google's internal ranking process",
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

const PART_C2_FIGURES = [
    {
        id: "part-c-2-site-trajectory",
        title: "Site trajectory",
        src: "/semantic-seo-lab/analytics/part-c2-site-visibility-trajectory.png",
        alt: "Updated line chart showing the site's trailing seven-day average impressions and fitted trend through 1 September 2026.",
        description:
            "The same C.1 site-trajectory calculation, rerun with Search Console data through 1 September 2026.",
    },
    {
        id: "part-c-2-six-page-impression-trajectory",
        title: "Six-page impression trajectory",
        src: "/semantic-seo-lab/analytics/part-c2-six-page-impression-trajectory.png",
        alt: "Updated line chart comparing trailing seven-day impressions for the same six pages through 1 September 2026.",
        description:
            "The same C.1 six-page trailing seven-day calculation, rerun with page data through 1 September 2026.",
    },
    {
        id: "part-c-2-query-specific-page-ranking",
        title: "Query-specific page ranking",
        src: "/semantic-seo-lab/analytics/part-c2-query-specific-page-ranking.png",
        alt: "Updated multi-panel chart showing fixed-query impressions and weighted page position through 1 September 2026.",
        description:
            "The same C.1 fixed-query impressions and impression-weighted position calculation, rerun through 1 September 2026.",
    },
];

const PART_C2_PHASE_ROWS = [
    {
        metric: "Site impressions",
        initial: "190",
        later: "365",
        change: "+92%",
    },
    {
        metric: "/art/python-nlp-semantic-seo impressions",
        initial: "4",
        later: "161",
        change: "+157",
    },
    {
        metric: "/semantic-seo-lab impressions",
        initial: "131",
        later: "180",
        change: "+49",
    },
    {
        metric: "Site clicks",
        initial: "0",
        later: "0",
        change: "No change",
    },
];

const PART_C2_QUERY_ROWS = [
    {
        query: "how to use python for nlp and semantic seo",
        reference: "124 impressions; position 17.8",
        lab: "12 impressions; position 48.1",
    },
    {
        query: "semantic seo python",
        reference: "4 impressions; position 79.0",
        lab: "98 impressions; position 20.5",
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
                <h2 id="part-c-1-initial-consolidation">
                    Part C.1 - Initial consolidation
                </h2>
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
                    <code>how to use python for nlp and semantic seo</code> query
                    before returning back to the broader{" "}
                    <code>semantic seo python</code>, and the lab page
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
                id="analytics-evidence-summary"
            >
                <h2>Analytics Evidence Summary</h2>
                <p>
                    This table makes the chart evidence explicit for readers and
                    crawlers. It summarises the date window, source, query
                    cluster, metrics and interpretive limit of the Part C
                    analysis.
                </p>
                <table className={styles.evidenceTable}>
                    <tbody>
                        {ANALYTICS_EVIDENCE_SUMMARY.map((row) => (
                            <tr key={row.field}>
                                <th scope="row">{row.field}</th>
                                <td>{row.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

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
                        <code>how to use python for nlp and semantic seo</code>{" "}
                        toward <code>semantic seo python</code> supports this
                        interpretation.
                    </li>
                    <li>
                        <strong>Page-two consolidation:</strong>{" "}
                        Impression-weighted lab performance became dominated by{" "}
                        <code>semantic seo python</code> around position 15, with{" "}
                        <code>python for semantic seo</code>{" "}around position 11.
                        The lab&apos;s aggregate meaningful exposure therefore
                        consolidated around page two, even though{" "}
                        <code>how to use python for nlp and semantic seo</code>{" "}
                        later weakened toward position 27 as impressions for the
                        other associated search terms
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

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-c-2-later-query-page-differentiation"
            >
                <h2>Part C.2 - Later query-page differentiation</h2>
                <p>
                    This follow-up preserves the initial result above, then tests
                    what changed during the equal 14-day window from 19 August to
                    1 September 2026. The later evidence does not simply repeat
                    the first snapshot: it shows the earlier consolidation
                    developing into two distinct query-page relationships.
                </p>
            </section>

            {PART_C2_FIGURES.map((figure) => (
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
                id="updated-evidence"
            >
                <h2>Updated Evidence</h2>
                <p>
                    Complete site and page totals compare equal 14-day windows.
                    The query table then isolates the visible query rows that
                    explain how the two pages differentiated.
                </p>
                <table
                    className={`${styles.evidenceTable} ${styles.comparisonTable}`}
                >
                    <thead>
                        <tr>
                            <th scope="col">Metric</th>
                            <th scope="col">5-18 August</th>
                            <th scope="col">19 August-1 September</th>
                            <th scope="col">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PART_C2_PHASE_ROWS.map((row) => (
                            <tr key={row.metric}>
                                <th scope="row">{row.metric}</th>
                                <td>{row.initial}</td>
                                <td>{row.later}</td>
                                <td>{row.change}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <table
                    className={`${styles.evidenceTable} ${styles.comparisonTable}`}
                >
                    <thead>
                        <tr>
                            <th scope="col">Visible query</th>
                            <th scope="col">Practical reference</th>
                            <th scope="col">Research lab</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PART_C2_QUERY_ROWS.map((row) => (
                            <tr key={row.query}>
                                <th scope="row">
                                    <code>{row.query}</code>
                                </th>
                                <td>{row.reference}</td>
                                <td>{row.lab}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>
                    Query positions are impression-weighted averages. Query-level
                    rows exclude anonymised queries, while the site and page totals
                    above do not.
                </p>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="what-changed"
            >
                <h2>What Changed</h2>
                <ul>
                    <li>
                        <strong>Site visibility continued to expand:</strong> total
                        impressions increased by 92% between the equal 14-day
                        windows.
                    </li>
                    <li>
                        <strong>The practical reference re-emerged:</strong>{" "}
                        <code>/art/python-nlp-semantic-seo</code> rose from 4 to
                        161 complete page impressions while the lab also increased.
                    </li>
                    <li>
                        <strong>Query intent separated the pages:</strong> the
                        practical reference became the stronger result for{" "}
                        <code>how to use python for nlp and semantic seo</code>,
                        while the lab remained stronger for{" "}
                        <code>semantic seo python</code>.
                    </li>
                    <li>
                        <strong>The preferred-page claim became narrower:</strong>{" "}
                        the lab was not the preferred destination for every query
                        in the cluster. Google Search Console instead showed a
                        query-dependent division between practical and conceptual
                        intent.
                    </li>
                    <li>
                        <strong>Visibility is not engagement validation:</strong>{" "}
                        neither window produced a click, so the evidence supports
                        retrieval and ranking conclusions, not claims about user
                        response or value.
                    </li>
                </ul>
                <p>
                    <strong>Methodological conclusion:</strong>{" "}
                    The research process was directionally successful. It identified
                    a coherent semantic-SEO query cluster and supported a content
                    structure that Google could distinguish by intent: the lab became
                    the stronger conceptual destination for{" "}
                    <code>semantic seo python</code>, while the practical reference
                    became stronger for the procedural{" "}
                    <code>how to use python for nlp and semantic seo</code> query.
                    Because both pages and total site impressions increased, the
                    outcome is better described as incremental visibility with
                    query-page specialisation than cannibalisation. This validates
                    the methodology for improving semantic association and search
                    architecture, but not yet for engagement or user value: no clicks
                    were recorded, and the observational data cannot establish
                    causality or reveal Google&apos;s internal ranking process.
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
