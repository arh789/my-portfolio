import Image from 'next/image';
import Link from 'next/link';
import './styles.css';

export const metadata = {
    title: 'Decrepit Filth | Grotesque Art, Semantic Structure, and AI Visibility',
    description:
        'A grotesque art archive and semantic testbed for building hard-to-flatten structure across search, LLMs, content strategy, AI visibility, and platform representation.',
    keywords: [
        'grotesque art archive',
        'AI visibility',
        'semantic SEO',
        'LLM representation',
        'content strategy',
        'semantic structure',
        'search visibility',
        'article graph',
        'AI-mediated representation',
        'hard-to-exhaust archive'
    ],
    alternates: {
        canonical: '/',
        types: {
            'application/json': [
                {
                    url: '/graph.json'
                }
            ]
        }
    }
};

const banners = [
    {
        href: '/about',
        src: '/images/home_menu_images/01_about.png',
        alt: 'About page',
        height: 193
    },
    {
        href: '/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content',
        src: '/images/home_menu_images/02_discovering_hidden_structure.png',
        alt: 'How AI, Network Analysis and LLMs Reveal Hidden Structure in Content',
        height: 194
    },
    {
        href: '/workflow-structure-breakdown',
        src: '/images/home_menu_images/03_workflow_breakdown.png',
        alt: 'Workflow structure breakdown',
        height: 193
    },
    {
        href: '/code',
        src: '/images/home_menu_images/04_semantic_seo_code.png',
        alt: 'Semantic SEO code',
        height: 193
    },
    {
        href: '/datamining-llm',
        src: '/images/home_menu_images/05_datamining_a_llm.png',
        alt: 'Datamining a large language model',
        height: 193
    },
    {
        href: '/content-strategy',
        src: '/images/home_menu_images/06_content_strategy.png',
        alt: 'Content strategy',
        height: 194
    },
    {
        href: '/art',
        src: '/images/home_menu_images/07_blog.png',
        alt: 'Art blog and gallery',
        height: 193
    },
    {
        href: '/contact',
        src: '/images/home_menu_images/08_contact.png',
        alt: 'Contact form',
        height: 193
    }
];

function BannerItem({ href, src, alt, height }) {
    return (
        <Link href={href} className="banner">
            <Image
                src={src}
                alt={alt}
                width={1106}
                height={height}
                sizes="(max-width: 768px) 75vw, (max-width: 1172px) 40vw, 469px"
                style={{ width: "100%", height: "auto" }}
            />
        </Link>
    );
}

function BannersContainer() {
    return (
        <section className="banners-container">
            {banners.map((item) => (
                <BannerItem key={item.href} {...item} />
            ))}
        </section>
    );
}

export default function Home() {
    return (
        <main>
            <section>
                <h1 className="sr-only">
                    Symbolic Compression SEO — Emergent Structural Mapping and Suppression Audits
                </h1>

                {/* Optimized Hero Image Implementation */}
                <Image
                    src="/images/hero-image.webp"
                    alt="A research portfolio using machine learning and dark surreal art to test semantic SEO, content strategy and structural analysis."
                    width={1400}
                    height={788}
                    priority // Ensures Next.js preloads the image immediately
                    fetchPriority="high" // High-priority instruction for modern browsers
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                />
            </section>

            <BannersContainer />
        </main>
    );
}
