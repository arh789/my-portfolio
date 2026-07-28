import { loadNotebook } from "./notebookRenderer.js";
import styles from "./semanticSeoLab.module.css";

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

export default async function SemanticSeoLabPage() {
    const notebook = await loadNotebook();

    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <NotebookSidebar headings={notebook.headings} />
                <article className={styles.notebook}>
                    {notebook.cells.map((cell, index) => (
                        <NotebookCell cell={cell} index={index} key={cell.id} />
                    ))}
                </article>
            </div>
        </main>
    );
}
