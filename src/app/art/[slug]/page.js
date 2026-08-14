import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectPathway from "../components/ProjectPathway.js";
import { readArticles } from "../lib/readArticles.js";
import {
    buildProjectIndex,
    findArticleProjectMemberships,
} from "../lib/projectData.js";
import "../art.css";

const SITE_URL = "https://decrepitfilth.art";

function safeJsonLd(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function readArticleBySlug(slug) {
    const articles = await readArticles();
    return articles.find((article) => article.slug === slug) ?? null;
}

export async function generateStaticParams() {
    const articles = await readArticles();

    return articles.map((article) => ({
        slug: article.slug,
    }));
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
        alternates: {
            canonical: `/art/${slug}`,
        },
    };
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;
    const articles = await readArticles();
    const article = articles.find((item) => item.slug === slug);

    if (!article) notFound();

    const projects = buildProjectIndex(articles);
    const memberships = findArticleProjectMemberships(projects, article.slug);
    const primaryProject = memberships[0]?.project ?? null;
    const articleUrl = `${SITE_URL}/art/${article.slug}`;
    const projectUrl = primaryProject
        ? `${SITE_URL}/art/project/${primaryProject.slug}`
        : null;

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date || undefined,
        url: articleUrl,
        mainEntityOfPage: articleUrl,
        isPartOf: memberships.length
            ? memberships.map(({ project }) => ({
                  "@type": "CollectionPage",
                  name: project.title,
                  url: `${SITE_URL}/art/project/${project.slug}`,
              }))
            : undefined,
    };

    const breadcrumbItems = [
        {
            "@type": "ListItem",
            position: 1,
            name: "Art",
            item: `${SITE_URL}/art`,
        },
    ];

    if (primaryProject) {
        breadcrumbItems.push({
            "@type": "ListItem",
            position: 2,
            name: primaryProject.title,
            item: projectUrl,
        });
    }

    breadcrumbItems.push({
        "@type": "ListItem",
        position: breadcrumbItems.length + 1,
        name: article.title,
        item: articleUrl,
    });

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
    };

    return (
        <main className="art-article">
            <script
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd([articleSchema, breadcrumbSchema]),
                }}
                type="application/ld+json"
            />

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

                    <ProjectPathway memberships={memberships} />

                    <div
                        className="art-article__content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>
            </div>
        </main>
    );
}
