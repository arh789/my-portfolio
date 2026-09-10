export const dynamic = 'force-static';

import { parseMarkdown } from '../components/markdown';
import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { IM_Fell_English_SC } from 'next/font/google';
import styles from './aboutPage.module.css';

const fell = IM_Fell_English_SC({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
});

export const metadata = {
    title: 'About Decrepit Filth | Art, Semantic SEO and AI Research',
    description: 'Decrepit Filth is an experimental art and research site using Semantic SEO, Python, network analysis and human-supervised AI to make difficult-to-classify creative work structurally legible.',
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
        <main className={`${fell.className} ${styles['about-page']}`}>
            <div className={styles['content-wrapper']}>

                <div
                    className={styles['header-section']}
                    dangerouslySetInnerHTML={{ __html: headersContent }}
                />

                <div className={styles['portrait-image-container']}>
                    <Image
                        src="/images/joker-portrait.webp"
                        alt="About Portrait"
                        width={400}
                        height={533}
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
