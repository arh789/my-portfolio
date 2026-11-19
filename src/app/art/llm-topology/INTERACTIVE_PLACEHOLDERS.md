# LLM Topology first-draft page — implementation hand-off

## Scope and governing sources

**Status:** visual draft / hand-off, not a finished publication or a live evidence explorer.

- Page: `src/app/art/llm-topology/page.js`
- Styles: `src/app/art/llm-topology/page.module.css`
- Preview route: `/art/llm-topology`
- Canonical research repository: `arh789/llm_topology`
- Governing article argument: [ARTICLE_OUTLINE_OFFICIAL.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_OUTLINE_OFFICIAL.md)
- Article claim evidence: [ARTICLE_EVIDENCE_INDEX.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_EVIDENCE_INDEX.md)
- Status and interpretive precedence: [REPORT_STATUS.md](https://github.com/arh789/llm_topology/blob/main/REPORT_STATUS.md)
- Existing page-design precedents: `src/app/art/dan-john-youtube-playlist-semantic-network-analysis/` (discovery-first layout) and `src/app/semantic-seo-lab/` (inspectable experimental evidence).

**Do not substitute an interactive tool for the official article's governing argument.** The key purpose is to demonstrate how a human learns about an unknown possibility space by constraining an agent's reconstruction. The experiments and interactive evidence serve that argument.

First-pass constraints: no metadata, no archive indexing, no new dependencies, no publishing to main, no changes to the other portfolio pages. All three interactive elements deliberately show labelled placeholders; no live data is loaded or falsely claimed.

## Identifying the interactive slots

All elements are grouped by the stable `data-interactive-placeholder` attribute. Preserve these IDs during implementation; replace each box with a working, independently verifiable component.

| Slot ID | Visual placement | Intended output |
|---|---|---|
| `topology-explorer` | Section 05, immediately after R020 summary | Evidence-backed semantic network and inspectable community/edge provenance |
| `generation-state-comparator` | Section 05, after topology explorer | Selectable generation-decision × transformer-state × cosine-sector comparison |
| `correction-ledger` | Section 06, after the static correction examples | Source-linked navigation through human objections and revised agent interpretations |

### 1. topology-explorer

**User question:** What relationships can we actually recover from the measured data, and which original communities and tokens support them?

**Inputs:**
- semantic-family selection (e.g. settlements, movement/routes, crossings, built places, inhabitants);
- transformer state S00–S07 and cosine sector;
- optional decision D01–D32;
- selected node or measured community–community edge.

**Outputs:**
- measured community graph filtered to the selected scope;
- original community IDs, token exemplars, measured token-edge count, computed affinity;
- a clear separation between measured edges, semantic labels inferred after measurement and unresolved community material;
- direct source reference to the specific R020 record.

**Data sources (canonical research repo):**
- `single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/community_nodes.csv`
- `single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/community_edges.csv`
- `single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/analysis/R020_RELATIONAL_MAP_D01-08.json` through `D25-32.json`
- `.../analysis/R020_FUNCTIONAL_HYPOTHESIS_D01-08.json` through `D25-32.json`
- `.../analysis/R020_V3_INDEPENDENT_RELATION_EVIDENCE_AUDIT.md`

**Acceptance criteria:** Every displayed edge and numerical affinity traces to measured evidence. Unrecognised communities are not silently discarded; semantic family labels are marked as interpreted. The chart remains understandable when JS or large data is unavailable (fallback: the existing static Section 05 associations list).

### 2. generation-state-comparator

**User question:** When a generated token changes, where does the candidate semantic relationship reappear or change across transformer states?

**Inputs:** Generation decision D01–D32, transformer state S00–S07, positive/negative cosine sector, optionally compare two decisions.

**Outputs:** Source-labelled state-by-state view, reconstructed relations (if any), reproducibility status and a compact explanation of what changed. The interface must not infer absence from a failure to pass the analysis screen.

**Data sources:**
- `.../generation_trace.csv`
- `.../network_index.csv`
- `.../analysis/R020_CROSS_GENERATION_HYPOTHESIS_TRAJECTORY.json`
- `.../analysis/R020_FUNCTIONAL_HYPOTHESIS_D01-08.json` through `D25-32.json`
- `.../analysis/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md`

**Acceptance criteria:** Preserve the distinction between S00 input embeddings, S01–S06 contextual block outputs and S07 normalisation; never confuse cosine-sector negative selection with semantic suppression. Avoid reading S06–S07 projections as proof that late representations contain no task-relevant information. The model uses untied input/output embeddings.

**Current visual preview warning:** The displayed D06/S01 selection and bar lengths are decorative placeholders, **not measurements**. Replace all of them from verified source data before removing the placeholder notice.

### 3. correction-ledger

**User question:** Which human correction invalidated an agent interpretation, and what reconstruction followed?

**Inputs:** MA entry ID, run ID or correction category; optionally select earlier vs revised interpretation.

**Outputs:** Verbatim source snippets with author, date, MA reference, problem detected, subsequent reanalysis and whether the conclusion is measured, interpreted or proposed. Make links to both entries visible.

**Data sources:**
- `META_ANALYSIS.md`, particularly MA-0083, MA-0120, MA-0125, MA-0126 and MA-0127;
- final run reports and conclusions, especially R020;
- `ARTICLE_OUTLINE_OFFICIAL.md` to retain the intended meaning of the human–agent learning process.

**Acceptance criteria:** Show the original wrong interpretation alongside its correction, not merely the final improved answer. Never overwrite previous source statements; preserve their chronology. Do not turn the observed analogue between model integration failure and agent research-method failure into a proved shared causal mechanism.

## Next development tasks

1. Run the portfolio build and inspect the draft page at desktop and mobile widths; check heading wrapping, sidebar, evidence tables and placeholder panels. This first draft has **not yet been visually browser-tested**.
2. Have the human review the layout and hierarchy **before implementing the interactive features**. The headline and section wording are first-draft editorial choices.
3. Transform the required research CSV/JSON into small, versioned, browser-usable data files with a repeatable generator. Do not fetch the complete research archive into the page at runtime.
4. Build and test the three interactive components independently, with a useful static fallback and citations to source evidence.
5. Only after content and interaction approval, address metadata, canonical paths, project indexing, graph/discovery generation and publication workflow. These were excluded from the first-draft request.

## Design and evidence rules

- The page's primary source is the official article outline; Dan John and Semantic SEO Lab supply layout patterns only.
- Keep discovery before bulk evidence and the experiment chronology.
- Use the shared portfolio design system: DIN-family headings, dark background, yellow accents and high-contrast readable evidence areas.
- Place measured data adjacent to its interpretation and source link.
- Do not create decorative controls that appear to work but have no behaviour. Use clear placeholders until real actions are wired.
- Use British English. Distinguish a scientific result from a later interpretive question without imposing unrelated success conditions.
