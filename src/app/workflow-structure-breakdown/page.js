// src/app/workflow-structure-breakdown/page.js

import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import styles from './contentPage.module.css';

export const metadata = {
    title: 'Workflow Structure Breakdown | Semantic SEO Research Pipeline',
    description: 'A 7-stage execution pipeline for SEO research combining real-time SERP scraping, LLM summarisation, keyword extraction, clustering, and association rule mining. Designed to replace guesswork with structurally aligned, semantically rich keyword data.',
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


export default async function MarkdownPage() {
    const dirPath = path.join(process.cwd(), 'src', 'app', 'workflow-structure-breakdown');
    const files = fs.readdirSync(dirPath);
    const mdFile = files.find(file => file.endsWith('.md'));

    if (!mdFile) {
        return <div className={styles['paragraph-section']}>No Markdown file found.</div>;
    }

    const filePath = path.join(dirPath, mdFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const processedContent = await remark()
        .use(gfm)
        .use(html)
        .process(fileContent);

    const contentHtml = processedContent.toString();

    return (
        <div className={styles['content-wrapper']}>
            <div
                className={styles['paragraph-section']}
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
        </div>
    );
}
