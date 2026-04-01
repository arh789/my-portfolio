export const dynamic = 'force-static';

import { parseMarkdown } from '../components/markdown';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import styles from './aboutPage.module.css';

export const metadata = {
    title: 'About | Recursive AI SEO Framework and Symbolic Content Architecture',
    description: 'An adversarially-structured overview of the system behind this site—fusing grotesque art, recursive SEO automation, symbolic compression, and markdown-driven content logic.',
    keywords: [
        'recursive AI SEO',
        'symbolic content systems',
        'automated SEO research',
        'adversarial system mapping',
        'semantic clustering',
        'grotesque art framework',
        'procedural content architecture',
        'LLM-based metadata generation',
        'suppression-aware SEO',
        'content-driven site automation'
    ]
};

export default async function About() {
    const headersFilePath = path.join(
        process.cwd(),
        'src',
        'app',
        'about',
        'about-content-headers.md'
    );

    const paragraphsFilePath = path.join(
        process.cwd(),
        'src',
        'app',
        'about',
        'about-content-paragraphs.md'
    );

    const headersMarkdown = fs.readFileSync(headersFilePath, 'utf-8');
    const paragraphsMarkdown = fs.readFileSync(paragraphsFilePath, 'utf-8');

    const headersContent = await parseMarkdown(headersMarkdown);
    const paragraphsContent = await parseMarkdown(paragraphsMarkdown);

    return (
        <main>
            <h1 className={styles.srOnly}>
                About — Recursive AI SEO Framework & Symbolic Content Architecture
            </h1>

            <div className={styles['content-wrapper']}>

                <div
                    className={styles['header-section']}
                    dangerouslySetInnerHTML={{ __html: headersContent }}
                />

                <div className={styles['portrait-image-container']}>
                    <Image
                        src="/images/joker-portrait.webp"
                        alt="About Portrait"
                        width={600}
                        height={800}
                        priority
                        fetchPriority="high"
                        sizes="(max-width: 768px) 80vw, 400px"
                        className={styles['portrait-image']}
                    />
                </div>

                <div
                    className={styles['paragraph-section']}
                    dangerouslySetInnerHTML={{ __html: paragraphsContent }}
                />

            </div>
        </main>
    );
}