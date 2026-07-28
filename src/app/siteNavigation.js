export const SITE_NAVIGATION = [
    {
        href: "/about",
        label: "About",
        src: "/images/home_menu_images/01_about.png",
        alt: "About page",
        height: 172,
    },
    {
        href: "/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content",
        label: "Discovering Hidden Structure",
        src: "/images/home_menu_images/02_discovering_hidden_structure.png",
        alt: "How AI, Network Analysis and LLMs Reveal Hidden Structure in Content",
        height: 172,
    },
    {
        href: "/workflow-structure-breakdown",
        label: "Workflow Breakdown",
        src: "/images/home_menu_images/03_workflow_breakdown.png",
        alt: "Workflow structure breakdown",
        height: 171,
    },
    {
        href: "/code",
        label: "Semantic SEO Code",
        src: "/images/home_menu_images/04_semantic_seo_code.png",
        alt: "Semantic SEO code",
        height: 172,
    },
    {
        href: "/semantic-seo-lab",
        label: "Semantic SEO Lab",
        src: "/images/home_menu_images/05_semantic_seo_lab.png",
        alt: "Semantic SEO Lab",
        height: 172,
    },
    {
        href: "/datamining-llm",
        label: "Datamining a LLM",
        src: "/images/home_menu_images/06_datamining_a_llm.png",
        alt: "Datamining a large language model",
        height: 172,
    },
    {
        href: "/content-strategy",
        label: "Content Strategy",
        src: "/images/home_menu_images/07_content_strategy.png",
        alt: "Content strategy",
        height: 171,
    },
    {
        href: "/art",
        label: "Archive Graph",
        src: "/images/home_menu_images/08_archive_graph.png",
        alt: "Archive graph",
        height: 172,
    },
    {
        href: "/contact",
        label: "Contact",
        src: "/images/home_menu_images/09_contact.png",
        alt: "Contact form",
        height: 172,
    },
];

export const SIDE_NAVIGATION = [
    { href: "/", label: "Home" },
    ...SITE_NAVIGATION.map(({ href, label }) => ({ href, label })),
];
