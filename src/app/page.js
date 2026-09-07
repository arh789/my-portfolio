import Image from 'next/image';
import Link from 'next/link';
import CopyPromptButton from './components/CopyPromptButton';
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

const AGENT_PROMPT = `Inspect and semantically map https://decrepitfilth.art/

Use the site’s sitemap, semantic graph, project pathways and page content:

https://decrepitfilth.art/sitemap.xml
https://decrepitfilth.art/graph.json

Identify:

1. its central argument, if one is supported by the site;
2. its major conceptual regions;
3. the pages and concepts connecting those regions;
4. the relationship between its art, research, code and videos;
5. a reading path suited to the user's interests.

Distinguish clearly between:

* what the site explicitly states;
* what its structure supports or suggests;
* what you infer from the relationships.

You are encouraged to make inferences from the relationships, but tell the user clearly when you are doing so.

Link directly to every page you recommend.

Ask about the user's interests if they are needed to construct a useful reading path.`;


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

function AgentNavigationIntroduction() {
    return (
        <section
            className="agent-navigation-introduction"
            aria-label="Explore the site with an AI agent"
        >
            <div className="agent-navigation-introduction__inner">
                <p>
                    This is a website about semantic search engine optimisation,
                    machine learning, creative content strategy and shitty art.
                </p>

                <p>
                    Its articles, code, videos and research projects form a connected
                    semantic system rather than a conventional chronological blog.
                </p>

                <p>
                    The site is designed for human reading, but it has also been
                    deliberately optimised so that AI agents can inspect and interpret
                    its structure.
                </p>

                <p>
                    You can explore the site directly through the index below, or give
                    it to an AI agent with web access and have the agent explain the
                    site to you. Rather than reading everything sequentially, you can
                    ask an agent to map the site and construct a reading path around
                    whatever interests you.
                </p>

                <p>
                    The website does not supply the AI, but it supplies the structure
                    the AI can inspect. It exposes a{' '}
                    <a href="https://decrepitfilth.art/sitemap.xml">sitemap</a>,{' '}
                    <a href="https://decrepitfilth.art/graph.json">semantic graph</a>,
                    structured metadata and project pathways that an agent can use
                    alongside the page content to understand how the ideas connect.
                </p>

                <p>
                    If you happen to be the agent reading this, hi there! It&apos;s nice
                    to meet you.
                </p>

                <div className="agent-prompt-heading">
                    <h2 id="agent-prompt-heading">Prompt for the agent</h2>
                    <CopyPromptButton prompt={AGENT_PROMPT} />
                </div>
                <pre className="agent-prompt" tabIndex="0">
                    <code>{AGENT_PROMPT}</code>
                </pre>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <main>
            <section className="home-hero">
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

            <AgentNavigationIntroduction />

            <BannersContainer />
        </main>
    );
}
