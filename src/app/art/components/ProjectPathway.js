import Link from "next/link";
import { formatProjectMedium } from "../lib/projectData.js";

function PathwayCard({ article, project }) {
    const chapterIndex = project.chapters.findIndex(
        (chapter) => chapter.slug === article.slug
    );
    const isChapter = chapterIndex >= 0;
    const previous = isChapter ? project.chapters[chapterIndex - 1] : null;
    const next = isChapter ? project.chapters[chapterIndex + 1] : null;
    const mediaResources = project.resources.filter((resource) =>
        ["tiktok-series", "youtube-index"].includes(resource.medium)
    );

    return (
        <aside className="project-pathway">
            <div className="project-pathway__heading">
                <div>
                    <p className="project-pathway__eyebrow">{project.eyebrow}</p>
                    <h2>
                        <Link href={`/art/project/${project.slug}`}>
                            {project.title}
                        </Link>
                    </h2>
                </div>

                {isChapter ? (
                    <p className="project-pathway__position">
                        Part {chapterIndex + 1} of {project.chapters.length}
                    </p>
                ) : (
                    <p className="project-pathway__position">
                        {formatProjectMedium(article.medium)}
                    </p>
                )}
            </div>

            <div className="project-pathway__links">
                {previous ? (
                    <Link href={`/art/${previous.slug}`}>
                        <span>Previous</span>
                        {previous.title}
                    </Link>
                ) : (
                    <span className="project-pathway__empty">Beginning of pathway</span>
                )}

                <Link
                    className="project-pathway__hub-link"
                    href={`/art/project/${project.slug}`}
                >
                    View full pathway
                </Link>

                {next ? (
                    <Link className="project-pathway__next" href={`/art/${next.slug}`}>
                        <span>Next</span>
                        {next.title}
                    </Link>
                ) : (
                    <span className="project-pathway__empty project-pathway__next">
                        End of pathway
                    </span>
                )}
            </div>

            {mediaResources.length ? (
                <p className="project-pathway__media">
                    Media collections:{" "}
                    {mediaResources.map((resource, index) => (
                        <span key={resource.slug}>
                            {index > 0 ? " · " : ""}
                            <Link href={`/art/${resource.slug}`}>
                                {formatProjectMedium(resource.medium)}
                            </Link>
                        </span>
                    ))}
                </p>
            ) : null}
        </aside>
    );
}

export default function ProjectPathway({ memberships }) {
    if (!memberships.length) return null;

    return (
        <section className="project-pathways" aria-label="Project pathways">
            {memberships.map(({ project, item }) => (
                <PathwayCard
                    article={item}
                    key={project.slug}
                    project={project}
                />
            ))}
        </section>
    );
}
