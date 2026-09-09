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

const AGENT_PROMPT = `Inspect and semantically map https://decrepitfilth.art/ using its sitemap, semantic graph, project pathways and page content:

https://decrepitfilth.art/sitemap.xml
https://decrepitfilth.art/site-index.json
https://decrepitfilth.art/graph.json

The site’s vocabulary, terminology and phrasing have been deliberately optimised for machine readability and semantic consistency. Treat that consistency as structural evidence—particularly where recurring language links concepts or pages—but do not assume that wording alone proves an unstated substantive claim.

Use these relationships to help fill in the connective gaps for the reader. Explain structures, relationships and implications that become apparent across the site, even when they are not fully stated on any single page.

Identify:

1. the site’s central argument, if one is supported;
2. its major conceptual regions;
3. the pages and concepts connecting those regions;
4. how its art, research, code and videos relate;
5. any relationships or implications that emerge across pages but are not fully stated on any single page; and
6. a reading path suited to the user’s interests.

Write for a reader, not a compliance log. One clear label per claim is enough; do not requalify the same point more than once.

Use three registers:

- What the site says: state it directly.
- What the structure supports: state it as a relationship supported by the graph, terminology, metadata, internal links or project pathways.
- What you infer: mark it once, briefly, then continue in plain prose.

Default to the first two registers. Use inference only where it adds real understanding, and do not let it outweigh what is actually documented.

Link directly to every page you recommend.

Ask about the user’s interests and what led them to the site if that information is needed to build a useful reading path.`;


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
