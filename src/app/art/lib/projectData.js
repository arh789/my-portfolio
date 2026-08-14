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
    {
        slug: "ai-visibility-is-not-value",
        title: "AI Visibility Is Not Value",
        eyebrow: "Guided analysis",
        description:
            "A nine-part analysis, with a series overview, separating AI visibility from selection, citation, value transfer and durable audience value.",
        introduction:
            "Begin with the series argument, then follow the distinction between being available to an AI system, being selected, being cited and retaining any resulting value.",
    },
    {
        slug: "sda3-structural-extraction",
        title: "SDA-3 and LLM Structural Extraction",
        eyebrow: "Guided methodology",
        description:
            "A method-led pathway for extracting and testing structural information from language-model outputs without claiming access to hidden model states.",
        introduction:
            "The sequence moves from the misuse problem to the SDA-3 protocol, a practical structural-extraction method and the limits of analysing representations through observable outputs.",
    },
    {
        slug: "semantic-seo-graph-positioning",
        title: "Semantic SEO as Graph Positioning",
        eyebrow: "Guided strategy",
        description:
            "A connected argument that reframes Semantic SEO as structural legibility and graph positioning rather than isolated content optimisation.",
        introduction:
            "Follow the argument from pre-optimisation structure through search-system behaviour, graph positioning, creative visibility and the resulting content operating system.",
    },
    {
        slug: "seer-clown-research",
        title: "From Aesthetic Research to the Seer-Clown",
        eyebrow: "Guided research process",
        description:
            "An evidence-led pathway from audience and medium research through source data, clustering, interpretation and the Seer-Clown archetype.",
        introduction:
            "This sequence exposes both the research outputs and the intermediate representations used to turn audience evidence into an artistic identity system.",
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
        overview: "Series overview",
    };

    return labels[medium] ?? "Article";
}

export function buildProjectIndex(articles) {
    return PROJECT_DEFINITIONS.map((definition) => {
        const items = articles
            .map((article) => {
                const membership = article.projects.find(
                    (project) => project.slug === definition.slug
                );

                if (!membership) return null;

                return {
                    ...publicArticle(article),
                    projectOrder: membership.order,
                    projectRole: membership.role,
                };
            })
            .filter(Boolean);

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

export function findArticleProjectMemberships(projects, articleSlug) {
    return projects.flatMap((project) => {
        const item = [...project.chapters, ...project.resources].find(
            (candidate) => candidate.slug === articleSlug
        );

        return item ? [{ project, item }] : [];
    });
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
            } else if (
                item.medium === "methodology" ||
                ["methodology", "summary"].includes(item.projectRole)
            ) {
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
