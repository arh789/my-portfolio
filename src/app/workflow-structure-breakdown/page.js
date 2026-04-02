import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import styles from './contentPage.module.css';

export const dynamic = 'force-static';

export const metadata = {
    title: 'Workflow Structure Breakdown | Semantic SEO Research Pipeline',
    description:
        'A 7-stage execution pipeline for SEO research combining real-time SERP scraping, LLM summarisation, keyword extraction, clustering, and association rule mining. Designed to replace guesswork with structurally aligned, semantically rich keyword data.',
    keywords: [
        'semantic SEO workflow',
        'SEO research pipeline',
        'LLM keyword extraction',
        'SERP scraping',
        'semantic clustering',
        'association rule mining',
        'structural SEO method',
        'contextual keyword analysis',
        'interactive SEO research',
        'programmatic SEO structure'
    ]
};

const getContentHtml = cache(async () => {
    const filePath = path.join(
        process.cwd(),
        'src',
        'app',
        'workflow-structure-breakdown',
        'workflow_structured_breakdown.md'
    );

    const fileContent = fs.readFileSync(filePath, 'utf8');

    const processedContent = await remark()
        .use(gfm)
        .use(html)
        .process(fileContent);

    return processedContent.toString();
});

export default async function Page() {
    const contentHtml = await getContentHtml();

    return (
        <main className={styles['content-wrapper']}>
            <article
                className={styles['paragraph-section']}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </main>
    );
}