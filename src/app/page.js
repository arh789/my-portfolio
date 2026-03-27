import Image from 'next/image';
import Link from 'next/link';
import './styles.css';
import AudioPlayer from './components/AudioPlayer';

export const metadata = {
    title: 'Recursive AI SEO Portfolio | Symbolic Content Architecture',
    description:
        'Portfolio showcasing recursive semantic SEO automation using grotesque experimental art. Explores suppression-based content logic, symbolic compression, and adversarial indexing in a markdown-driven system.',
    keywords: [
        'AI SEO automation',
        'semantic content system',
        'recursive markdown framework',
        'structured metadata generation',
        'symbolic compression in SEO',
        'strategic suppression detection',
        'adversarial indexing',
        'non-linear content logic',
        'programmatic SEO for artists',
        'grotesque art SEO testbed',
        'avant-garde content architecture',
        'avant-garde SEO strategy',
        'avant-garde search architecture',
        'avant-garde digital narratives'
    ]
};

const banners = [
    {
        href: '/about',
        src: '/images/home_menu_images/about1.png',
        alt: 'About page'
    },
    {
        href: '/workflow-structure-breakdown',
        src: '/images/home_menu_images/workflow_breakdown1.png',
        alt: 'Workflow structure breakdown'
    },
    {
        href: '/code',
        src: '/images/home_menu_images/somatic_seo_code1.png',
        alt: 'Somatic SEO code'
    },
    {
        href: '/datamining-llm',
        src: '/images/home_menu_images/datamining_a_llm1.png',
        alt: 'Datamining a large language model'
    },
    {
        href: '/content-strategy',
        src: '/images/home_menu_images/content_strategy1.png',
        alt: 'Content strategy'
    },
    {
        href: '/art',
        src: '/images/home_menu_images/blog1.png',
        alt: 'Art blog and gallery'
    },
    {
        href: '/contact',
        src: '/images/home_menu_images/contact1.png',
        alt: 'Contact form'
    }
];

function BannerItem({ href, src, alt }) {
    return (
        <Link href={href} className="banner">
            <Image
                src={src}
                alt={alt}
                width={1200}
                height={400}
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
        <div>
            {/* Audio (client component) */}
            <AudioPlayer />

            <section>
                <h1 className="sr-only">
                    Symbolic Compression SEO — Emergent Structural Mapping and Suppression Audits
                </h1>

                <Image
                    src="/images/hero-image.png"
                    alt="Symbolic compression SEO hero: Emergent Structural Mapping and suppression audits"
                    width={1920}
                    height={1080}
                    priority
                    layout="responsive"
                />
            </section>

            <BannersContainer />
        </div>
    );
}