const PROJECT_DEFINITIONS = [
    {
        slug: "chatgpt-structural-failure",
        title: "How to Stop ChatGPT From Lying",
        eyebrow: "Guided investigation",
        description:
            "A staged investigation using a zombie-survival stress test to expose coherence smoothing, hidden assumptions and structurally weak answers in ChatGPT.",
        introduction:
            "Follow the investigation from ChatGPT's initial survival answer through adversarial questioning, structural convergence, historical testing, a bioweapons failure and the final supervised method.",
    },
];

function publicArticle(article) {
    const { content, ...metadata } = article;
    return metadata;
}

export function formatProjectMedium(medium) {
    const labels = {
        "article-video": "Article + YouTube",
        methodology: "Methodology",
        "tiktok-series": "TikTok series",
        "youtube-index": "YouTube index",
    };

    return labels[medium] ?? "Article";
}

export function buildProjectIndex(articles) {
    return PROJECT_DEFINITIONS.map((definition) => {
        const items = articles
            .filter((article) => article.project === definition.slug)
            .map(publicArticle);

        const chapters = items
            .filter((article) => article.projectRole === "chapter")
            .sort((a, b) => a.projectOrder - b.projectOrder);

        const resources = items
            .filter((article) => article.projectRole !== "chapter")
            .sort((a, b) => {
                if (a.projectOrder !== b.projectOrder) {
                    return a.projectOrder - b.projectOrder;
                }

                return a.title.localeCompare(b.title);
            });

        return {
            ...definition,
            chapters,
            resources,
        };
    }).filter((project) => project.chapters.length || project.resources.length);
}

export function findProject(projects, slug) {
    return projects.find((project) => project.slug === slug) ?? null;
}

export function buildProjectGraph(projects) {
    const nodes = projects.map((project) => ({
        id: `project:${project.slug}`,
        label: project.title,
        route: `/art/project/${project.slug}`,
        type: "project",
    }));

    const edges = [];

    for (const project of projects) {
        const projectId = `project:${project.slug}`;
        const items = [...project.chapters, ...project.resources];

        for (const item of items) {
            let relationshipType = "belongs-to-project";

            if (["tiktok-series", "youtube-index"].includes(item.medium)) {
                relationshipType = "alternate-media";
            } else if (item.projectRole === "methodology") {
                relationshipType = "supports-methodology";
            }

            edges.push({
                source: item.slug,
                target: projectId,
                type: relationshipType,
                project: project.slug,
            });
        }

        for (let index = 0; index < project.chapters.length - 1; index += 1) {
            edges.push({
                source: project.chapters[index].slug,
                target: project.chapters[index + 1].slug,
                type: "precedes",
                project: project.slug,
            });
        }
    }

    return { nodes, edges };
}

export { PROJECT_DEFINITIONS };
