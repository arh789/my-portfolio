import fs from 'fs';
import path from 'path';

/**
 * Metadata (aligned with actual page content)
 */
export const metadata = {
  title: 'SEO Python Codebase | Recursive Semantic Clustering Output',
  description:
    'Python implementation of an AI-driven SEO keyword clustering pipeline using semantic embeddings, KeyBERT extraction, Apriori association mining, and graph-based analysis.',
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

/**
 * /code page
 * Server-rendered HTML from cleaned notebook export
 */
export default function CodePage() {
  let html = '';

  try {
    // Updated filename (as requested)
    const htmlPath = path.join(
      process.cwd(),
      'public',
      'code',
      'seo_keywords.html'
    );

    html = fs.readFileSync(htmlPath, 'utf8');
  } catch (error) {
    console.error('Failed to load code HTML:', error);

    html = `
    < main style = "padding:2rem; font-family: monospace;" >
        <h1>Code page unavailable</h1>
        <p>There was an error loading the code content.</p>
      </main >
    `;
  }

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '2rem',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

