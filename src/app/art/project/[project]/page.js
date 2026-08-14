import Link from "next/link";
import { notFound } from "next/navigation";
import { readArticles } from "../../lib/readArticles.js";
import {
    buildProjectIndex,
    findProject,
    formatProjectMedium,
} from "../../lib/projectData.js";
import "../../art.css";

const SITE_URL = "https://decrepitfilth.art";

function safeJsonLd(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

async function loadProject(slug) {
    const articles = await readArticles();
    return findProject(buildProjectIndex(articles), slug);
}

export async function generateStaticParams() {
    const articles = await readArticles();

    return buildProjectIndex(articles).map((project) => ({
        project: project.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { project: slug } = await params;
    const project = await loadProject(slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: `${project.title} | Guided Investigation`,
        description: project.description,
        alternates: {
            canonical: `/art/project/${project.slug}`,
        },
    };
}

export default async function ProjectPage({ params }) {
    const { project: slug } = await params;
    const project = await loadProject(slug);

    if (!project) notFound();

    const projectUrl = `${SITE_URL}/art/project/${project.slug}`;
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: project.title,
        description: project.description,
        url: projectUrl,
        hasPart: project.chapters.map((chapter) => ({
            "@type": "Article",
            name: chapter.title,
            url: `${SITE_URL}/art/${chapter.slug}`,
            position: chapter.projectOrder,
        })),
        mainEntity: {
            "@type": "ItemList",
            itemListElement: project.chapters.map((chapter, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: chapter.title,
                url: `${SITE_URL}/art/${chapter.slug}`,
            })),
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Art",
                item: `${SITE_URL}/art`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: project.title,
                item: projectUrl,
            },
        ],
    };

    return (
        <main className="art-project-page">
            <script
                dangerouslySetInnerHTML={{
                    __html: safeJsonLd([collectionSchema, breadcrumbSchema]),
                }}
                type="application/ld+json"
            />

            <nav className="art-project-page__nav">
                <Link href="/art">Back to the archive graph</Link>
            </nav>

            <header className="art-project-page__header">
                <p className="art-project-page__eyebrow">{project.eyebrow}</p>
                <h1 className="art-project-page__title">{project.title}</h1>
                <p className="art-project-page__description">{project.description}</p>
                <p className="art-project-page__introduction">{project.introduction}</p>
                <div className="art-project-page__meta">
                    <span>{project.chapters.length} stages</span>
                    <span>{project.resources.length} supporting resources</span>
                </div>
            </header>

            <section className="art-project-page__section">
                <div className="art-page__section-heading">
                    <h2>Follow the investigation</h2>
                    <p>
                        This order records the argument, rather than merely grouping
                        pages that share vocabulary.
                    </p>
                </div>

                <ol className="art-project-sequence">
                    {project.chapters.map((chapter, index) => (
                        <li className="art-project-sequence__item" key={chapter.slug}>
                            <span className="art-project-sequence__number">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div>
                                <p className="art-project-sequence__medium">
                                    {formatProjectMedium(chapter.medium)}
                                </p>
                                <h3>
                                    <Link href={`/art/${chapter.slug}`}>
                                        {chapter.title}
                                    </Link>
                                </h3>
                                {chapter.description ? <p>{chapter.description}</p> : null}
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {project.resources.length ? (
                <section className="art-project-page__section">
                    <div className="art-page__section-heading">
                        <h2>Methods and media collections</h2>
                        <p>
                            Inspect the underlying method or watch the investigation in
                            another format.
                        </p>
                    </div>

                    <div className="art-project-resources">
                        {project.resources.map((resource) => (
                            <article className="art-project-resource" key={resource.slug}>
                                <p>{formatProjectMedium(resource.medium)}</p>
                                <h3>
                                    <Link href={`/art/${resource.slug}`}>
                                        {resource.title}
                                    </Link>
                                </h3>
                                {resource.description ? <p>{resource.description}</p> : null}
                            </article>
                        ))}
                    </div>
                </section>
            ) : null}
        </main>
    );
}
