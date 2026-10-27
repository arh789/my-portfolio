import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { parseMarkdown } from '../components/markdown';
import ProjectPathway from '../art/components/ProjectPathway.js';
import { readArticles } from '../art/lib/readArticles.js';
import { buildProjectIndex, findArticleProjectMemberships } from '../art/lib/projectData.js';
import '../art/art.css';
import styles from './contentPage.module.css';

export const dynamic = 'force-static';

export const metadata = {
    title: 'How AI, Network Analysis and LLMs Reveal Hidden Structure in Content | DecrepitFilth.art',
    description:
        'A framework for understanding how deep learning, network analysis, LLMs, and human judgement locate hidden structure by recovering what representations conceal.',
    alternates: {
        canonical: '/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content',
    },
    keywords: [
        'hidden structure',
        'representation loss',
        'deep learning',
        'deep learning blind spots',
        'large language models',
        'LLMs',
        'network analysis',
        'semantic structure',
        'pattern recognition',
        'graph positioning',
        'semantic SEO',
        'AI research methodology',
        'structural discovery'
    ]
};

const getContentHtml = cache(async () => {
    const filePath = path.join(
        process.cwd(),
        'src',
        'app',
        'how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content',
        'how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content.md'
    );

    const fileContent = fs.readFileSync(filePath, 'utf8');

    return await parseMarkdown(fileContent);
});

export default async function Page() {
    const contentHtml = await getContentHtml();
    const articles = await readArticles();
    const memberships = findArticleProjectMemberships(
        buildProjectIndex(articles),
        'how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content'
    );

    return (
        <main className={styles['content-wrapper']}>
            <ProjectPathway memberships={memberships} />
            <article
                className={styles['paragraph-section']}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </main>
    );
}
