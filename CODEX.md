# Codex Instructions

- This is a Next.js App Router portfolio/art/research site.
- Prefer the smallest working patch.
- Do not perform broad rewrites unless explicitly asked.
- Preserve routes, slugs, filenames, visual design, and article structure unless the task requires a change.
- Use British English in user-facing prose.
- Do not introduce new frameworks, packages, or tooling without approval.
- Markdown article content lives under `src/app/art/posts`.
- After changing article markdown, check whether `public/graph.json` must be regenerated with `npm run build` or `node scripts/buildBlogGraph.js`.
- `public/sitemap.xml` is manually maintained, so route/slug changes may require sitemap edits.
- Be careful with raw HTML in markdown, because markdown is rendered with `sanitize: false` / `dangerouslySetInnerHTML`.
- After edits, summarise changed files, commands run, and verification results.
