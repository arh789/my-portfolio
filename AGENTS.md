# Workspace Agent Instructions

These rules apply to work in `/root/my-portfolio`.

## Project conventions

- This is a Next.js App Router portfolio, art and research site.
- Prefer the smallest working patch. Do not perform broad rewrites unless explicitly asked.
- Preserve routes, slugs, filenames, visual design and article structure unless the task requires a change.
- Use British English in user-facing prose.
- Do not introduce new frameworks, packages or tooling without approval.
- Markdown article content lives under `src/app/art/posts`.
- Be careful with raw HTML in Markdown because Markdown is rendered with `sanitize: false` / `dangerouslySetInnerHTML`.
- After edits, summarise changed files, commands run and verification results.

## Environment and commands

- Treat `/root/my-portfolio` as the canonical repository path. Prefer commands executed inside WSL over operations against the Windows UNC path.
- Keep each command in one shell environment. Avoid embedding PowerShell inside Bash, Bash inside PowerShell, or either shell inside JavaScript template literals when a direct command will work.
- Keep commands small and independently verifiable. Do not combine unrelated inspection, editing and validation operations into one command.
- Use the native WSL Node.js and npm runtime. Confirm that project scripts are not resolving to Windows executables when permissions behave unexpectedly.

## Editing files

- Use `apply_patch` for source edits.
- The patch helper may fail against this UNC-backed workspace with `windows sandbox: helper_unknown_error`. If that happens, use only small, guarded exact replacements that fail unless the expected text occurs exactly once.
- When a fallback replacement inserts records or sections, add newline separators explicitly. Inspect the resulting source diff immediately before running generators or builds.
- Preserve unrelated user changes and inspect `git status` before and after edits.

## Importing Windows files

- Import files from Windows through WSL where possible. Windows copy operations can expose download-security streams as literal files with names ending in `:Zone.Identifier` or `:mshield`.
- Immediately inspect `git status` after importing a file. Remove only confirmed metadata sidecars; never remove similarly named content without inspection.
- Preserve UTF-8 encoding and check imported Markdown for mojibake before publication.

## Generated discovery files

- Generate `public/graph.json`, `public/agent-map.json`, `public/agent-map.html` and `public/sitemap.xml` through the shared discovery build. Do not edit these outputs manually.
- When article metadata, projects, semantic hubs, relationships or indexed pages change, regenerate every discovery output so they retain one generation state.
- Verify article counts, URL counts, graph nodes, graph edges, project membership and sitemap inclusion after regeneration.

## Verification and Git

- Run `git diff --check` and inspect the relevant source diff before staging.
- Run the production build for changes affecting routes, rendering, metadata or generated discovery files.
- A production build may rewrite `next-env.d.ts`. Leave that file unchanged unless the task explicitly concerns its configuration.
- Stage only the intended source and generated files, then run `git diff --cached --check` before committing.
