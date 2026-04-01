import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import "./art.css";
import ArtGraph from "./components/ArtGraph";

export const metadata = {
    title: "Art",
    description:
        "A concept hub for the blog, organised by tags and generated from the article graph.",
};

async function readGraphData() {
    const graphPath = path.join(process.cwd(), "public", "graph.json");
    const raw = await fs.readFile(graphPath, "utf8");
    return JSON.parse(raw);
}

function buildCentralityMap(graph) {
    return Object.fromEntries(
        (graph?.nodes ?? []).map((node) => [node.id, node.centrality ?? 0])
    );
}

function sortArticlesByCentrality(articles, centralityMap) {
    return [...articles].sort((a, b) => {
        const aCentrality = centralityMap[a.slug] ?? 0;
        const bCentrality = centralityMap[b.slug] ?? 0;

        if (bCentrality !== aCentrality) {
            return bCentrality - aCentrality;
        }

        return a.title.localeCompare(b.title);
    });
}

export default async function ArtPage() {
    const data = await readGraphData();

    const {
        tagIndex = {},
        tagCentrality = [],
        graph = { nodes: [], edges: [] },
        articles = [],
    } = data;

    const centralityMap = buildCentralityMap(graph);
    const totalArticles = articles.length;
    const totalTags = tagCentrality.length;

    return (
        <main className="art-page">
            <img
                src="/images/blog-hero-image.jpg"
                alt=""
                className="art-page__hero-image"
            />

            <header className="art-page__header">
                <p className="art-page__eyebrow">Concept Hub</p>
                <h1 className="art-page__title">Art</h1>
                <p className="art-page__intro">
                    This section is organised as a tag-based concept network. The dropdowns
                    below are the primary navigation system. Each tag expands to show the
                    related articles, ordered by their position in the current article graph.
                </p>

                <div className="art-page__meta">
                    <span>{totalArticles} articles</span>
                    <span>{totalTags} tags</span>
                </div>
            </header>

            <section className="art-page__graph-wrap">
                <ArtGraph />
            </section>

            <section className="art-page__section">
                <div className="art-page__section-heading">
                    <h2>Browse by Tag</h2>
                    <p>Tags are sorted by article count.</p>
                </div>

                <div className="art-tag-list">
                    {tagCentrality.map(({ tag, count }) => {
                        const articlesForTag = sortArticlesByCentrality(
                            tagIndex[tag] ?? [],
                            centralityMap
                        );

                        return (
                            <details className="art-tag-group" key={tag}>
                                <summary className="art-tag-group__summary">
                                    <span className="art-tag-group__name">{tag}</span>
                                    <span className="art-tag-group__count">{count}</span>
                                </summary>

                                <div className="art-tag-group__content">
                                    <div className="art-tag-group__top-link">
                                        <Link href={`/art/tag/${tag}`}>View tag page</Link>
                                    </div>

                                    <div className="art-article-list">
                                        {articlesForTag.map((article) => (
                                            <article className="art-article-card" key={article.slug}>
                                                <h3 className="art-article-card__title">
                                                    <Link href={`/art/${article.slug}`}>
                                                        {article.title}
                                                    </Link>
                                                </h3>

                                                <div className="art-article-card__tags">
                                                    {article.tags.map((articleTag) => (
                                                        <Link
                                                            key={`${article.slug}-${articleTag}`}
                                                            href={`/art/tag/${articleTag}`}
                                                            className="art-article-card__tag"
                                                        >
                                                            {articleTag}
                                                        </Link>
                                                    ))}
                                                </div>

                                                {article.description ? (
                                                    <p className="art-article-card__description">
                                                        {article.description}
                                                    </p>
                                                ) : null}
                                            </article>
                                        ))}
                                    </div>
                                </div>
                            </details>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}