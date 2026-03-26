import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

async function readGraphData() {
    const graphPath = path.join(process.cwd(), "public", "graph.json");
    const raw = await fs.readFile(graphPath, "utf8");
    return JSON.parse(raw);
}

export async function generateStaticParams() {
    const data = await readGraphData();
    const tagCentrality = data.tagCentrality ?? [];

    return tagCentrality.map(({ tag }) => ({
        tag,
    }));
}

export async function generateMetadata({ params }) {
    const { tag } = await params;

    return {
        title: `${tag} | Art`,
        description: `Articles filed under ${tag}.`,
    };
}

export default async function TagPage({ params }) {
    const { tag } = await params;
    const data = await readGraphData();

    const tagIndex = data.tagIndex ?? {};
    const graphNodes = data.graph?.nodes ?? [];
    const articles = tagIndex[tag] ?? [];

    const centralityMap = Object.fromEntries(
        graphNodes.map((node) => [node.id, node.centrality ?? 0])
    );

    const sortedArticles = [...articles].sort((a, b) => {
        const aCentrality = centralityMap[a.slug] ?? 0;
        const bCentrality = centralityMap[b.slug] ?? 0;

        if (bCentrality !== aCentrality) {
            return bCentrality - aCentrality;
        }

        return a.title.localeCompare(b.title);
    });

    return (
        <main className="art-tag-page">
            <nav className="art-tag-page__nav">
                <Link href="/art">Back to Art</Link>
            </nav>

            <header className="art-tag-page__header">
                <p className="art-tag-page__eyebrow">Tag</p>
                <h1 className="art-tag-page__title">{tag}</h1>
                <p className="art-tag-page__meta">
                    {sortedArticles.length} article{sortedArticles.length === 1 ? "" : "s"}
                </p>
            </header>

            <section className="art-tag-page__content">
                {sortedArticles.length === 0 ? (
                    <p>No articles found for this tag.</p>
                ) : (
                    sortedArticles.map((article) => (
                        <article className="art-tag-page__card" key={article.slug}>
                            <h2 className="art-tag-page__card-title">
                                <Link href={`/art/${article.slug}`}>{article.title}</Link>
                            </h2>

                            <div className="art-tag-page__tags">
                                {article.tags.map((articleTag) => (
                                    <Link
                                        key={`${article.slug}-${articleTag}`}
                                        href={`/art/tag/${articleTag}`}
                                        className="art-tag-page__tag"
                                    >
                                        {articleTag}
                                    </Link>
                                ))}
                            </div>

                            {article.description ? (
                                <p className="art-tag-page__description">{article.description}</p>
                            ) : null}
                        </article>
                    ))
                )}
            </section>
        </main>
    );
}