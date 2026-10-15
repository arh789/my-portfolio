import { loadNotebook } from "./notebookRenderer.js";
import styles from "./semanticSeoLab.module.css";

const PART_C_HEADINGS = [
    {
        level: 2,
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

const PART_D_HEADINGS = [
    {
        level: 2,
        text: "Part D - Structural Intervention and Page-One Consolidation",
        slug: "part-d-structural-intervention-and-page-one-consolidation",
    },
    {
        level: 2,
        text: "Part D.1 - Intervention chronology",
        slug: "part-d-1-intervention-chronology",
    },
    {
        level: 2,
        text: "Site visibility before and after structural changes",
        slug: "part-d-site-visibility",
    },
    {
        level: 2,
        text: "Part D.2 - Exposure and ranking response",
        slug: "part-d-2-exposure-and-ranking-response",
    },
    {
        level: 2,
        text: "Part D.3 - Page-One query differentiation",
        slug: "part-d-3-page-one-query-differentiation",
    },
    {
        level: 2,
        text: "Part D.4 - Evidence boundaries",
        slug: "part-d-4-evidence-boundaries",
    },
    {
        level: 2,
        text: "Part D.5 - Methodological conclusion",
        slug: "part-d-5-methodological-conclusion",
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

const PART_D_TIMELINE_ROWS = [
    {
        date: "25 July 2026",
        change: "Initial Semantic SEO Lab and supporting notebook committed",
        role: "Research implementation",
    },
    {
        date: "28 July 2026",
        change: "Lab made publication-ready and connected to site navigation and discovery",
        role: "Publication point",
    },
    {
        date: "21 August 2026",
        change: "Part C added",
        role: "First recorded search-outcome analysis",
    },
    {
        date: "4 September 2026",
        change: "Part C.2 added",
        role: "Query-page differentiation documented",
    },
    {
        date: "7 September 2026",
        change: "Agent-navigation prompt added to the homepage",
        role: "Beginning of structural rollout",
    },
    {
        date: "8-9 September 2026",
        change: "Agent prompt and discovery instructions refined",
        role: "Transition period",
    },
    {
        date: "10-11 September 2026",
        change: "Sitemap, page graph and agent map unified; complete site representation and HTML fallback added",
        role: "Main structural intervention",
    },
];

const PART_D_PHASE_ROWS = [
    {
        period: "22 days before Lab publication",
        impressions: "208",
        position: "23.24",
        pageOneImpressions: "12",
    },
    {
        period: "22 days after 28 July",
        impressions: "307",
        position: "18.28",
        pageOneImpressions: "0",
    },
    {
        period: "14 days before Part C",
        impressions: "188",
        position: "21.48",
        pageOneImpressions: "0",
    },
    {
        period: "14 days after Part C",
        impressions: "384",
        position: "25.03",
        pageOneImpressions: "1",
    },
    {
        period: "14 days before agent-navigation rollout",
        impressions: "411",
        position: "21.71",
        pageOneImpressions: "1",
    },
    {
        period: "12-25 September",
        impressions: "208",
        position: "14.58",
        pageOneImpressions: "21",
    },
    {
        period: "26 September-9 October",
        impressions: "332",
        position: "13.10",
        pageOneImpressions: "39",
    },
];

const PART_D_QUERY_ROWS = [
    {
        page: "/semantic-seo-lab",
        query: "semantic seo python",
        evidence: "22 impressions across two Page 1 days; weighted position 9.8",
    },
    {
        page: "/art/python-nlp-semantic-seo",
        query: "how to use python for nlp and semantic seo",
        evidence: "17 impressions across five Page 1 days; weighted position 9.5",
    },
    {
        page: "/code",
        query: "keyword clustering python",
        evidence: "9 impressions across four Page 1 days; weighted position 8.7",
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
                <h2>Part C - Observed Search Outcome</h2>
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
                        Google already understood the site&apos;s semantic relevance.
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

function PartDStructuralIntervention() {
    return (
        <>
            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-structural-intervention-and-page-one-consolidation"
            >
                <h2>
                    Part D - Structural Intervention and Page-One Consolidation
                </h2>
                <p>
                    Part C established that publication of the Semantic SEO Lab
                    was followed by increased visibility and a clearer separation
                    between conceptual and procedural search intent. Part D asks
                    a narrower question:
                </p>
                <blockquote>
                    Did the later search-architecture and agent-navigation changes
                    coincide with the site progressing from broad search exposure
                    to repeatable Page 1 query-page relationships?
                </blockquote>
                <p>
                    This is an observational comparison, not a controlled
                    experiment. Several changes occurred close together, the site
                    was already developing before the structural rollout, and
                    Google Search Console does not expose Google&apos;s internal
                    retrieval or ranking processes.
                </p>
                <p>
                    The analysis therefore distinguishes changes recorded in the
                    repository, changes observed in Search Console, interpretations
                    supported by their timing, and causal claims that the available
                    evidence cannot establish.
                </p>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-1-intervention-chronology"
            >
                <h2>Part D.1 - Intervention chronology</h2>
                <p>The repository history provides the following sequence.</p>
                <table
                    className={`${styles.evidenceTable} ${styles.comparisonTable}`}
                >
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Site change</th>
                            <th scope="col">Analytical role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PART_D_TIMELINE_ROWS.map((row) => (
                            <tr key={row.date}>
                                <th scope="row">{row.date}</th>
                                <td>{row.change}</td>
                                <td>{row.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>
                    The 7-11 September period is treated as a transition window
                    rather than being assigned to either side of the comparison.
                    Later styling changes made on 14 October fall outside the
                    Search Console data window used here and are excluded.
                </p>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-site-visibility"
            >
                <h2>Site visibility before and after structural changes</h2>
                <p>
                    The upper panel uses complete site-level daily impressions,
                    including impressions whose queries were anonymised. The lower
                    panel calculates trailing seven-day position weighted by the
                    impressions observed on each day. Lower position values
                    represent stronger rankings.
                </p>
                <figure className={styles.figure}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt="Two-panel line chart showing trailing seven-day site impressions and impression-weighted position, with the Lab publication, Part C updates and September structural rollout marked."
                        loading="lazy"
                        src="/semantic-seo-lab/analytics/part-d-structural-intervention.png"
                    />
                </figure>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-2-exposure-and-ranking-response"
            >
                <h2>Part D.2 - Exposure and ranking response</h2>
                <p>
                    Site impressions and position use complete Search Console
                    totals. Visible Page 1 impressions count disclosed query-page
                    rows with an average position of 10 or better; anonymised
                    queries cannot be assigned to this measure.
                </p>
                <table
                    className={`${styles.evidenceTable} ${styles.comparisonTable}`}
                >
                    <thead>
                        <tr>
                            <th scope="col">Comparison window</th>
                            <th scope="col">Impressions</th>
                            <th scope="col">Weighted position</th>
                            <th scope="col">Visible Page 1 impressions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PART_D_PHASE_ROWS.map((row) => (
                            <tr key={row.period}>
                                <th scope="row">{row.period}</th>
                                <td>{row.impressions}</td>
                                <td>{row.position}</td>
                                <td>{row.pageOneImpressions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>
                    The pre-publication Page 1 total shows that intermittent Page 1
                    visibility existed before the Lab. It should not be attributed
                    to the later structural work. After publication, impressions
                    increased and average position improved, but the additional
                    exposure initially remained concentrated around Page 2.
                </p>
                <p>
                    After Part C was added, impressions increased again while
                    average position became weaker. This is consistent with wider
                    query exposure, but it does not by itself establish improved
                    retrieval quality.
                </p>
                <p>
                    The clearest later change occurred after the September
                    transition. Overall impressions initially contracted, but
                    average position improved substantially and visible Page 1
                    impressions increased. The following period combined renewed
                    impression growth with a further improvement in average
                    position.
                </p>
                <p>
                    The observed sequence was broader exposure, temporary
                    contraction, stronger ranking, then renewed growth. This is
                    consistent with visibility becoming more selective before
                    expanding again, although Search Console cannot establish the
                    process responsible for that pattern.
                </p>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-3-page-one-query-differentiation"
            >
                <h2>Part D.3 - Page-One query differentiation</h2>
                <p>
                    The later Page 1 transition did not produce one universally
                    preferred landing page. It produced several distinct
                    query-page relationships.
                </p>
                <table
                    className={`${styles.evidenceTable} ${styles.comparisonTable}`}
                >
                    <thead>
                        <tr>
                            <th scope="col">Landing page</th>
                            <th scope="col">Query relationship</th>
                            <th scope="col">Page 1 evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PART_D_QUERY_ROWS.map((row) => (
                            <tr key={`${row.page}-${row.query}`}>
                                <th scope="row">
                                    <a href={row.page}>
                                        <code>{row.page}</code>
                                    </a>
                                </th>
                                <td>
                                    <code>{row.query}</code>
                                </td>
                                <td>{row.evidence}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p>
                    The first relevant Lab Page 1 appearance occurred on 3
                    September, before the homepage agent prompt and unified
                    discovery rollout. The September structural work therefore
                    did not initiate the entire ranking transition.
                </p>
                <p>
                    After the rollout, Page 1 visibility became broader and more
                    repeatable. On 18 September, the Lab received 11 impressions
                    for <code>semantic seo python</code> at an average position of
                    9.9. Later observations extended the pattern across the
                    practical article and the code page.
                </p>
                <p>
                    The resulting division is functionally coherent: the Lab is
                    the conceptual and methodological destination, the practical
                    article is the procedural explanation, and the code page is
                    the implementation destination. This extends the two-page
                    differentiation identified in Part C.2 into a three-part
                    search structure.
                </p>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-4-evidence-boundaries"
            >
                <h2>Part D.4 - Evidence boundaries</h2>
                <ul>
                    <li>
                        <strong>Observed:</strong> Relevant Page 1 visibility began
                        before the agent-navigation rollout, then became more
                        frequent and distributed across several appropriate
                        landing pages after it.
                    </li>
                    <li>
                        <strong>Supported interpretation:</strong> The structural
                        changes may have reinforced an already developing
                        transition from broad semantic recognition to more specific
                        query-page matching.
                    </li>
                    <li>
                        <strong>Not established:</strong> The evidence does not show
                        that Google fetched or used <code>agent-map.json</code>, its
                        HTML projection or the page graph. It also cannot establish
                        that those files caused the ranking changes.
                    </li>
                    <li>
                        <strong>Not yet validated:</strong> Clicks remained at zero.
                        The results support conclusions about impressions,
                        retrieval and ranking, but not about engagement,
                        satisfaction or commercial value.
                    </li>
                </ul>
            </section>

            <section
                className={`${styles.cell} ${styles.markdownCell}`}
                id="part-d-5-methodological-conclusion"
            >
                <h2>Part D.5 - Methodological conclusion</h2>
                <p>
                    Part D changes the conclusion from simple visibility growth to
                    structural differentiation. Search Console increasingly
                    associated conceptual intent with the research Lab, procedural
                    intent with the practical article, and implementation intent
                    with the code page.
                </p>
                <p>
                    The most defensible conclusion is that the September structural
                    intervention coincided with, and may have reinforced, a
                    transition that had already begun. The evidence supports
                    improved query-page specialisation and broader Page 1
                    representation. It does not prove direct causation or
                    demonstrate that Google used the agent-readable discovery
                    files themselves.
                </p>
                <p>
                    The research loop is now: SERP observation, computational
                    representation, supervised interpretation, publication, search
                    observation, structural revision, then renewed observation.
                    The Lab is therefore not only an implementation of Semantic SEO
                    methods. It is also a longitudinal record of how research,
                    publication, internal structure and observed search behaviour
                    interact.
                </p>
            </section>
        </>
    );
}

export default async function SemanticSeoLabPage() {
    const notebook = await loadNotebook();
    const headings = [
        ...notebook.headings,
        ...PART_C_HEADINGS,
        ...PART_D_HEADINGS,
    ];

    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <NotebookSidebar headings={headings} />
                <article className={styles.notebook}>
                    {notebook.cells.map((cell, index) => (
                        <NotebookCell cell={cell} index={index} key={cell.id} />
                    ))}
                    <PartCAnalyticsSnapshot />
                    <PartDStructuralIntervention />
                </article>
            </div>
        </main>
    );
}
