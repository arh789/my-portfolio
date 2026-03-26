import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import "../art.css";

const POSTS_DIR = path.join(process.cwd(), "src/app/art/posts");

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\.md$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normaliseTags(tags = []) {
    return [...new Set(tags.map((tag) => slugify(tag)).filter(Boolean))];
}

function normaliseDate(value) {
    if (!value) return "";
    return new Date(value).toISOString().slice(0, 10);
}

async function readArticleBySlug(slug) {
    const filenames = await fs.readdir(POSTS_DIR);
    const markdownFiles = filenames.filter((file) => file.endsWith(".md"));

    for (const filename of markdownFiles) {
        const fullPath = path.join(POSTS_DIR, filename);
        const raw = await fs.readFile(fullPath, "utf8");
        const { data, content } = matter(raw);

        const derivedSlug = data.slug ? slugify(data.slug) : slugify(filename);

        if (derivedSlug !== slug) continue;

        const processed = await remark()
            .use(remarkGfm)
            .use(remarkHtml)
            .process(content);

        return {
            slug: derivedSlug,
            title: data.title ?? derivedSlug,
            description: data.description ?? "",
            date: normaliseDate(data.date),
            tags: normaliseTags(data.tags),
            contentHtml: processed.toString(),
        };
    }

    return null;
}

export async function generateStaticParams() {
    const filenames = await fs.readdir(POSTS_DIR);
    const markdownFiles = filenames.filter((file) => file.endsWith(".md"));

    const params = [];

    for (const filename of markdownFiles) {
        const fullPath = path.join(POSTS_DIR, filename);
        const raw = await fs.readFile(fullPath, "utf8");
        const { data } = matter(raw);

        params.push({
            slug: data.slug ? slugify(data.slug) : slugify(filename),
        });
    }

    return params;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await readArticleBySlug(slug);

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    return {
        title: article.title,
        description: article.description || `Read ${article.title}.`,
    };
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const article = await readArticleBySlug(slug);

    if (!article) {
        return (
            <main className="art-article">
                <div className="art-article__container">
                    <p>Article not found.</p>
                    <p>
                        <Link href="/art">Back to Art</Link>
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="art-article">
            <div className="art-article__container">
                <nav className="art-article-page__nav">
                    <Link href="/art">Back to Art</Link>
                </nav>

                <article className="art-article__content-wrap">
                    <header className="art-article__header">
                        <h1 className="art-article__title">{article.title}</h1>

                        {article.date ? (
                            <p className="art-article__date">
                                <time dateTime={article.date}>{article.date}</time>
                            </p>
                        ) : null}

                        {article.description ? (
                            <p className="art-article__description">{article.description}</p>
                        ) : null}

                        {article.tags.length > 0 ? (
                            <div className="art-article__tags">
                                {article.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/art/tag/${tag}`}
                                        className="art-article__tag"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </header>

                    <div
                        className="art-article__content"
                        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                    />
                </article>
            </div>
        </main>
    );
}