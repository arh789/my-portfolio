export const SITE_BASE_URL = "https://decrepitfilth.art";

export const STATIC_SITE_PAGES = [
    {
        id: "home",
        path: "/",
        kind: "entry-point",
        title: "Decrepit Filth",
        summary:
            "Entry point to a grotesque art archive and semantic testbed connecting AI research, Semantic SEO, code, content strategy and machine-readable site structure.",
        lastModified: "2026-09-10",
        priority: 1,
    },
    {
        id: "about",
        path: "/about",
        kind: "orientation",
        title: "What is Decrepit Filth?",
        summary:
            "Defines Decrepit Filth as a self-describing semantic system in which grotesque art, AI research, Semantic SEO, content strategy and archiving operate as one structural experiment.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "About",
            src: "/images/home_menu_images/01_about.png",
            alt: "About page",
            height: 172,
        },
    },
    {
        id: "hidden-structure",
        path: "/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content",
        kind: "conceptual-framework",
        title: "How AI, Network Analysis and LLMs Reveal Hidden Structure in Content",
        summary:
            "Explains how statistical, relational, semantic and human interpretation can be combined to recover structure hidden by compressed representations.",
        lastModified: null,
        priority: 0.8,
        navigation: {
            label: "Discovering Hidden Structure",
            src: "/images/home_menu_images/02_discovering_hidden_structure.png",
            alt: "How AI, Network Analysis and LLMs Reveal Hidden Structure in Content",
            height: 172,
        },
    },
    {
        id: "workflow-structure-breakdown",
        path: "/workflow-structure-breakdown",
        kind: "methodology",
        title: "Workflow Structure Breakdown",
        summary:
            "Documents a bottom-up workflow moving from search-result collection through semantic reduction, graph analysis and human-supervised interpretation.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Workflow Structure Breakdown",
            src: "/images/home_menu_images/03_workflow_breakdown.png",
            alt: "Workflow structure breakdown",
            height: 171,
        },
    },
    {
        id: "code",
        path: "/code",
        kind: "code-notebook",
        title: "SEO Python Codebase",
        summary:
            "Static notebook export implementing the site's recursive SEO, NLP, keyword extraction, clustering, association and graph-analysis workflow.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Semantic SEO Code",
            src: "/images/home_menu_images/04_semantic_seo_code.png",
            alt: "Semantic SEO code",
            height: 172,
        },
    },
    {
        id: "semantic-seo-lab",
        path: "/semantic-seo-lab",
        kind: "research-notebook",
        title: "Semantic SEO With Python: An Agent-Run, Human-Supervised Research Notebook",
        summary:
            "Tests whether Python-generated SEO representations remain usable when classical NLP, graph analysis, agent interpretation and human correction are combined.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Semantic SEO Lab",
            src: "/images/home_menu_images/05_semantic_seo_lab.png",
            alt: "Semantic SEO Lab",
            height: 172,
        },
    },
    {
        id: "datamining-llm",
        path: "/datamining-llm",
        kind: "methodological-doctrine",
        title: "Data-Mining an LLM: Emergent Structural Mapping",
        summary:
            "Presents a method for converting recorded LLM outputs into inspectable semantic systems and studying what survives, weakens, disappears or becomes distorted under prompting pressure.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Datamining an LLM",
            src: "/images/home_menu_images/06_datamining_a_llm.png",
            alt: "Data-mining a large language model",
            height: 172,
        },
    },
    {
        id: "content-strategy",
        path: "/content-strategy",
        kind: "editorial-strategy",
        title: "Content Strategy: Grotesque Art and the Seer-Clown",
        summary:
            "Translates clustered research into a creative niche, symbolic vocabulary and hybrid practical-digital production strategy centred on the Seer-Clown archetype.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Content Strategy",
            src: "/images/home_menu_images/07_content_strategy.png",
            alt: "Content strategy",
            height: 171,
        },
    },
    {
        id: "art",
        path: "/art",
        kind: "archive-hub",
        title: "Art and Research Concept Hub",
        summary:
            "Navigation hub representing the article archive as a concept network built from shared tags, guided project pathways and individual article records.",
        lastModified: null,
        priority: 0.8,
        navigation: {
            label: "Archive Graph",
            src: "/images/home_menu_images/08_archive_graph.png",
            alt: "Archive graph",
            height: 172,
        },
    },
    {
        id: "contact",
        path: "/contact",
        kind: "utility",
        title: "Contact Andrew Hale",
        summary:
            "Contact form for enquiries about Decrepit Filth, grotesque art, Semantic SEO, AI research and related projects.",
        lastModified: "2026-09-10",
        priority: 0.8,
        navigation: {
            label: "Contact",
            src: "/images/home_menu_images/09_contact.png",
            alt: "Contact form",
            height: 172,
        },
    },
];

export const SITE_NAVIGATION = STATIC_SITE_PAGES.filter(
    (page) => page.navigation
).map(({ path: href, navigation }) => ({ href, ...navigation }));

export const SIDE_NAVIGATION = [
    { href: "/", label: "Home" },
    ...SITE_NAVIGATION.map(({ href, label }) => ({ href, label })),
];
