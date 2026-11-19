# Codex handover — LLM Topology article, first visual draft

**Date:** 19 November 2026 (Australia/Sydney)  
**Status:** ready for Codex to take over implementation and verification. The first page and responsive CSS exist, but local build and browser QA have **not** yet been performed.

## Latest revision — dual recognition (MA-0128–MA-0130)

The official research outline **has changed since the initial handover was written**. The governing statement is no longer confined to detecting violations. The human recognises **what resonates or appears potentially significant**, *and* what is unsupported, missing or invalid. Positive recognition selects further investigation; negative recognition challenges inaccurate representations. Neither supplies proof or a final answer in advance.

Authoritative current sources:
- [Updated official outline](https://github.com/arh789/llm_topology/blob/main/ARTICLE_OUTLINE_OFFICIAL.md), especially sections 4–10 and the dual-branch "deepest compression";
- [Evidence index C10](https://github.com/arh789/llm_topology/blob/main/ARTICLE_EVIDENCE_INDEX.md#c10--human-direction-combines-selecting-promising-possibilities-and-correcting-inadequate-interpretations), using [MA-0099](https://github.com/arh789/llm_topology/blob/main/META_ANALYSIS.md#ma-0099--next-inquiry-sda-3-interrogatives-applied-to-the-independently-reconstructed-r014r015-semantic-map) as a recorded case of selecting further inquiry;
- MA-0128, MA-0129 and MA-0130 in the same meta-analysis file;
- [Revised first-draft article](page.js), now showing both recognition paths in section 03 and the documented choice in section 06.

**New immediate Codex task:** Verify the updated branch, inspect the rendered page at desktop and mobile widths, and fix any defects caused by the longer copy or two new recognition cards. Ensure the updated introduction, two-path mechanism, MA-0099 link and correction-ledger description are all legible. Do not invent a new experiment or treat resonance as scientifically validated. Do not rebuild the original page or implement live interactivity. Keep the revised body typography and existing main heading sizes.

The earlier guidance below remains applicable except where this note expressly updates it.

## 1. Objective

Make the existing **first-draft visual construction** of the LLM Topology article build successfully and render clearly on desktop and mobile. Evaluate and repair its layout, navigation, legibility, hierarchy and representative evidence panels. Preserve the visible, unmistakable placeholders for future interactive elements.

**This is not a request to finish or publish the article.** Do not spend this pass on final wording, metadata, SEO, article taxonomy, full interactive datasets or animation polish.

**Governing argument:** A human can learn about an unfamiliar possibility space by recognising promising or invalid agent-generated relationships, directing further exploration and constrained reconstruction without knowing the answer beforehand. The research experiments supply evidence for the article; they do not replace that human–agent learning argument.

## 2. Repositories, branch, route and source files

| Item | Location |
|---|---|
| **Repository to edit** | [arh789/my-portfolio](https://github.com/arh789/my-portfolio) |
| **Working directory (WSL)** | \`/root/my-portfolio\` |
| **Work branch** | \`draft/llm-topology-visual-v1-20261119\` |
| **Draft pull request** | [PR #1](https://github.com/arh789/my-portfolio/pull/1), draft, base \`main\` |
| **Page under review** | \`src/app/art/llm-topology/page.js\` |
| **Page CSS** | \`src/app/art/llm-topology/page.module.css\` |
| **Interactive task contracts** | \`src/app/art/llm-topology/INTERACTIVE_PLACEHOLDERS.md\` |
| **Preview route** | \`http://localhost:3000/art/llm-topology\` (when dev server is running) |
| **Repository agent rules** | \`AGENTS.md\` at portfolio root |
| **Research repository (read-only for this task)** | [arh789/llm_topology](https://github.com/arh789/llm_topology) |

The page and CSS were created directly on the draft branch through the GitHub connector. Do **not** assume they already exist in the local \`main\` checkout. Fetch and switch branches after inspecting local changes. Do not overwrite or discard work in progress.

The existing PR intentionally changes no production route, metadata, archive registration or other article.

## 3. Required reading, in order

**Portfolio rules and implementation:**

1. \`AGENTS.md\` (operating and verification rules).
2. \`src/app/art/llm-topology/page.js\` and \`page.module.css\` (the actual work).
3. \`src/app/art/llm-topology/INTERACTIVE_PLACEHOLDERS.md\` (contracts for the three future tools).
4. \`src/app/art/dan-john-youtube-playlist-semantic-network-analysis/page.js\` and \`page.module.css\` (discovery-first hierarchy, hero, sidebar, evidence panels, mobile behaviour).
5. \`src/app/semantic-seo-lab/page.js\` and \`semanticSeoLab.module.css\` (structured evidence, notebook-like panels, tables, figures and responsive navigation).
6. \`src/app/styles.css\` (shared colour and font variables) and \`src/app/layout.js\` (site wrapper).

**Scientific and editorial authorities (different repository):**

1. [ARTICLE_OUTLINE_OFFICIAL.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_OUTLINE_OFFICIAL.md): **highest authority for the argument and section dependencies**.
2. [ARTICLE_EVIDENCE_INDEX.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_EVIDENCE_INDEX.md): evidence links and what claims are established, interpreted or proposed.
3. [REPORT_STATUS.md](https://github.com/arh789/llm_topology/blob/main/REPORT_STATUS.md): precedence and qualifications across runs.
4. [RUN_OPTIMISATION_TRAJECTORY.md](https://github.com/arh789/llm_topology/blob/main/RUN_OPTIMISATION_TRAJECTORY.md): why R001–R020 occurred.
5. [R020 final conclusion](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/R020_FINAL_CONCLUSION.md) and [R020 evidence audit](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/analysis/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md).
6. [META_ANALYSIS.md](https://github.com/arh789/llm_topology/blob/main/META_ANALYSIS.md), especially MA-0083, MA-0120, MA-0125, MA-0126 and MA-0127. Historical records stay intact.

**Hierarchy rule:** Official outline governs *what the page means*. Dan John governs the broad *visual/reading hierarchy*. Semantic SEO Lab governs *experimental-evidence display*. The evidence index governs *what can be asserted*. None is interchangeable with the others.

## 4. Current page contents

The draft currently has:

- A large problem-led hero and a visual summary of the human–agent learning loop.
- Eight article sections: discovery problem; complementary instruments; learning loop; R001–R020 grouped experimental trajectory; R020 semantic reconstruction; correction examples; human–agent learning conclusion; evidence archive.
- A sticky sidebar that becomes horizontally navigable at narrower screen widths.
- R020 quantitative summaries and recurrence counts, with source links.
- Three intentionally **non-functional, visibly labelled** interactive placeholders.
- Links to relevant portfolio articles and primary research records.

This content is a **first editorial pass**; do not optimise it into a final manuscript without review.

## 5. Interactive slots: keep as placeholders in this pass

Each placeholder has a stable \`data-interactive-placeholder\` ID. Preserve IDs and accompanying explanations:

1. **\`topology-explorer\`** — eventual evidence-backed semantic network. Intended controls: semantic family, generation decision, transformer state, cosine sector. Display measured community/edge provenance and interpreted labels separately.
2. **\`generation-state-comparator\`** — eventual comparison of D01–D32, S00–S07 and positive/negative sectors, using the recorded state networks and hypothesis trajectories. The current illustrated toolbar and bars are explicitly *not measurements*.
3. **\`correction-ledger\`** — eventual browsable provenance of original agent interpretation, human correction and revised analysis, linked to MA entries and source reports.

The detailed implementation requirements, source filenames and acceptance tests already exist in \`INTERACTIVE_PLACEHOLDERS.md\`. Do not replace the placeholders with fake working selectors. Do not load the complete research archive into the browser. **Working interactivity is a separate implementation stage after visual review.**

## 6. First Codex execution sequence

1. **Inspect worktree, checkout and changes.** Confirm \`/root/my-portfolio\`, run \`git status --short\`, inspect current branch, fetch origin and switch to the draft branch **without discarding any uncommitted changes**.
2. **Read the required sources** above and inspect the draft route/component. Preserve its official-argument hierarchy.
3. **Run focused lint and build.** Use the project's installed Node/npm in WSL. Run \`npx eslint src/app/art/llm-topology/page.js\`; run \`npm run build\` (this invokes \`buildDiscovery\` first). Record any errors, fix the smallest responsible part and re-run. \`npm ci\` only if dependencies need installing.
4. **Render the page locally.** Start \`npm run dev\` and inspect \`/art/llm-topology\` in a browser at approximately 1440px, 1024px, 768px and 390px viewport widths. Obtain screenshots if supported.
5. **Visual/functional first-draft QA.** Check site wrapper compatibility, large hero, section order, legible evidence, heading wrapping, contrast, anchor navigation, narrow-screen overflow, keyboard focus, external/internal links and mobile placeholder layout.
6. **Apply small corrective patches.** Fix only defects preventing a useful first-draft review; make the eight main sections and all three placeholders legible and stable. Prefer scoped CSS and local changes to the current draft.
7. **Verify and report.** Run \`git diff --check\`, inspect intended source diff, rerun lint/build if changed, and report tested viewports, screenshot or build status, changed files, unresolved issues and next phase. Commit only intended files to the draft branch and update draft PR #1; **do not merge**.

**Build warning:** \`npm run build\` regenerates site-discovery artefacts in \`public/\` and may rewrite \`next-env.d.ts\`. Inspect the diff; do not stage generated or unrelated changes unless specifically requested. Preserve other users' work.

## 7. Acceptance conditions

**Success:** The draft page renders and builds; layout and hierarchy are coherent at desktop and mobile widths; section anchors work; the evidence panels are readable; all three interactive placeholders are visible, correctly identified, and linkable to their agent contracts. Codex provides a concise validation report and leaves PR #1 as a draft.

**Unsuccessful:** Page fails to build; important sections disappear behind overflow; evidence counts become misleading; the sidebar breaks on mobile; controls appear functional but do nothing; another article or the main site is inadvertently altered.

**Scope drift:** Introducing a new framework, rewriting the official argument, building a live graph before review, adding metadata/indexing, creating a new production route outside the existing draft, deleting historical research, or treating an unresolved extension of a hypothesis as a reason to diminish an established result.

## 8. Information that is *not* missing

Codex does **not** need the user to provide another article brief, new metadata, a visual style guide, a list of research source links or a specification for the interactive elements. These are all recoverable from the files above. It also does not need permission to change the underlying science: the task is to **implement and verify the first draft**, not reinterpret the research.

The only explicit follow-up decision belongs **after** Codex has presented the rendered page: approve or revise the visual hierarchy before working on full interactivity and publication.
