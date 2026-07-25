import Link from "next/link";
import styles from "./semanticSeoLab.module.css";

export const metadata = {
    title: "Semantic SEO Lab | Human-Supervised Python Research",
    description:
        "A local construction scaffold for a human-supervised, agent-operated Semantic SEO experiment implemented as one cumulative Python notebook.",
    alternates: {
        canonical: "/semantic-seo-lab",
    },
    robots: {
        index: false,
        follow: false,
    },
};

const workflow = [
    "Collect a timestamped search-result snapshot",
    "Retrieve permitted web pages with Requests",
    "Extract inspectable evidence with BeautifulSoup",
    "Reproduce the established Python Semantic SEO baseline",
    "Test the representation for instability and failure",
    "Propose, review, and measure an agent-assisted alternative",
];

export default function SemanticSeoLabPage() {
    return (
        <main className={styles.page}>
            <article className={styles.container}>
                <header className={styles.header}>
                    <p className={styles.eyebrow}>Construction scaffold - Stage 4</p>
                    <h1>Semantic SEO Lab</h1>
                    <p className={styles.lede}>
                        A human-supervised experiment in which Codex constructs,
                        executes, explains, and revises one cumulative Python
                        workflow for Semantic SEO.
                    </p>
                </header>

                <section className={styles.panel}>
                    <h2>Current state</h2>
                    <p>
                        The experiment contract and acquisition code are being
                        prepared locally. No new search-result request, page
                        scrape, publication, or search intervention has yet been
                        performed from this lab.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Planned analytical sequence</h2>
                    <ol className={styles.workflow}>
                        {workflow.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ol>
                </section>

                <section className={styles.section}>
                    <h2>Page role</h2>
                    <p>
                        This page will record the living experiment. The existing{" "}
                        <Link href="/art/semantic-seo-in-python-from-search-results-to-original-content-strategy">
                            Semantic SEO in Python article
                        </Link>{" "}
                        remains the broad conceptual introduction.
                    </p>
                </section>
            </article>
        </main>
    );
}
