import Image from 'next/image';
import Link from 'next/link';
import './styles.css';
import { SITE_NAVIGATION } from './siteNavigation';

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
            {SITE_NAVIGATION.map((item) => (
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
                    Symbolic Compression SEO - Emergent Structural Mapping and Suppression Audits
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
