import fs from 'fs'
import path from 'path'

export const metadata = {
    title: 'SEO Python Codebase | Recursive Semantic Clustering Output',
    description: 'Live demonstration of an AI-driven SEO keyword clustering pipeline using semantic embeddings, unsupervised learning, and suppression-aware content architecture.',
    keywords: [
        'semantic keyword clustering',
        'SEO python codebase',
        'programmatic content strategy',
        'automated keyword research',
        'AI SEO pipeline',
        'unsupervised topic discovery',
        'suppressed demand detection',
        'semantic embedding SEO',
        'machine learning for SEO',
        'structured keyword mapping'
    ]
};

export default function CodePage() {
    const srOnlyStyle = {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0
    };

    return (
        <div>
            <h1 style={srOnlyStyle}>
                SEO Python Codebase — Recursive Semantic Clustering Output
            </h1>

            <iframe
                src="/code/seo_keywords.html"
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="Code Page"
            />
        </div>
    );
}
