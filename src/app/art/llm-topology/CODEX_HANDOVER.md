# Codex handover — rebuilt evidence-led LLM Topology article

**Status:** second structural first draft. The article was rebuilt on the existing draft branch following the owner's explicit decision that its earlier eight-section architecture was insufficient. Codex's next task is verification and targeted corrections, not restoring the previous architecture.

## Objective

Check that the rebuilt first-draft article **demonstrates the experimental research and human–agent learning process with inspectable evidence**, then verify that it builds and reads well at desktop and mobile widths.

**Repository:** `arh789/my-portfolio`  
**Canonical local checkout:** `/root/my-portfolio` (WSL, check local changes first)  
**Branch:** `draft/llm-topology-visual-v1-20261119`  
**Draft PR:** https://github.com/arh789/my-portfolio/pull/1  
**Route:** `/art/llm-topology`  
**Page:** `src/app/art/llm-topology/page.js`  
**Styles:** `src/app/art/llm-topology/page.module.css`  
**Design:** Existing dark DIN-family portfolio research style; 18px+ default desktop body text; no new dependencies.

## Governing authority and distinct evidence types

1. **Article objective:** [ARTICLE_OUTLINE_OFFICIAL.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_OUTLINE_OFFICIAL.md). The human can recognise resonance and invalidity without knowing the answer, directing agent exploration, reconstruction and new learning. The initial experiment aimed to infer learned semantic organisation from transformer states; that objective did not change.
2. **Claim provenance:** [ARTICLE_EVIDENCE_INDEX.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_EVIDENCE_INDEX.md), C1–C10; [REPORT_STATUS.md](https://github.com/arh789/llm_topology/blob/main/REPORT_STATUS.md) for interpretive precedence.
3. **Scientific method:** [METHODOLOGY.md](https://github.com/arh789/llm_topology/blob/main/METHODOLOGY.md), [REPRODUCIBILITY.md](https://github.com/arh789/llm_topology/blob/main/REPRODUCIBILITY.md), [DATA_DICTIONARY.md](https://github.com/arh789/llm_topology/blob/main/DATA_DICTIONARY.md).
4. **Experimental measurement and code:** R020 runner, source configurations, prompt records, measured graph outputs and audits in `arh789/llm_topology`.
5. **Human direction and learning:** [META_ANALYSIS.md](https://github.com/arh789/llm_topology/blob/main/META_ANALYSIS.md), notably MA-0083, MA-0099, MA-0119, MA-0120, MA-0127 and MA-0128.

The research repository is **private**. Never assert public access merely because a GitHub link is present. Frozen public evidence-package and permalink work remain a later publication stage.

## Current article architecture (replaces the former eight-section layout)

| Section ID | Contents |
|---|---|
| `observation` | The exact R020 prompt and complete output, static semantic network of recurring candidate relations, numerical summary and links to underlying source |
| `measurement` | Distinct roles of tested model, measurement code, analysing agent and human; measured → derived → interpreted chain; four real code excerpts with exact source-line links |
| `trajectory` | R001–R020 grouped into five research phases with source links; R019 deterministic repeatability control |
| `human` | Documented cases of positive selection, negative correction, objective drift and unsupported evidential tests; links into the meta-analysis |
| `discovery` | The MA-0083 → MA-0120 “happy accident”, cognitive division of labour and the official methodology |
| `evidence` | Original GitHub repository, evidence index, code, compact measured exports, controls, audits, access boundaries and relevant portfolio connections |

Navigation must link to these six actual IDs. Preserve evidence distinctions and the main cognitive-division-of-labour claim.

### R020 figure provenance

The static network summarises **interpreted semantic families and recurring measured cross-community connections**, NOT one graph observed at a single generation decision.

Counts used: settlement–movement 11/32, movement–crossings 8/32, built places–movement 7/32, built places–inhabitants 7/32, inhabitants–settlements 6/32, commerce–movement 3/32. The mobile fallback lists those and settlement–crossings 5/32, all sourced in the [generation-wide report](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/analysis/R020_GENERATION_WIDE_SEMANTIC_HYPOTHESIS_REPORT.md). Explicitly label counts as qualifying contextual decisions, not causal strengths or probabilities.

The model's `prompt_records.json` records an initial blank space before its first generated word. It is shown in the page.

### Code excerpts

The four snippets are extracted from these real sources and must remain traceable:

- [R020 BlockRecorder](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/r020_pythia_generation_topology.py#L69-L74) (measured capture).
- [R020 projection](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/r020_pythia_generation_topology.py#L840-L847) (derived vocabulary scores).
- [Topology core community detection](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/topology_core.py#L185-L191) (derived networks and partitioning).
- [R020 candidate relation screen](https://github.com/arh789/llm_topology/blob/main/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast/analysis/R020_SEMANTIC_CONTINUITY_REPRODUCER.js#L64-L67) (post-measurement screening; semantics remain interpreted).

Do not imply these excerpts are all the code required to reproduce the full experiment. The complete implementation, dependencies, configurations and validation records are linked elsewhere on the page.

### Superseded placeholders

The earlier three interactive placeholders (`topology-explorer`, `generation-state-comparator`, `correction-ledger`) were **deliberately removed from the reader-facing article**. A static map and direct evidence links are better for the first-draft scientific argument. Their historical implementation contract survives separately in `INTERACTIVE_PLACEHOLDERS.md` for possible later use; **do not restore them without a new request**.

## Next bounded Codex operations

1. Inspect `git status`, update the draft branch safely and read `AGENTS.md` and this handover. Preserve other local work.
2. Validate link destinations and check source-code excerpts against the cited line ranges. Check exact model prompt/output, static network recurrence figures and audit numbers.
3. Run `npx eslint src/app/art/llm-topology/page.js` and `npm run build` using WSL Node/npm; diagnose and fix errors rather than making unrelated changes. The build runs the discovery generator; do not commit unrelated regenerated outputs or `next-env.d.ts`.
4. Inspect the draft route at desktop (~1440px), tablet (~1024px and 768px) and mobile (~390px). Check font legibility, mobile graph fallback, card layout, source code horizontal scrolling, broken lines, nav anchors, accessibility and links.
5. Apply small, evidenced corrections. Do not turn an interpretive result into measured fact or invent a visually smoother network.
6. Run `git diff --check` and relevant validation again. Commit only changes to the existing draft branch and report tested widths and outstanding issues. **Leave the PR as a draft.**

## Success, failure and scope boundaries

**Success:** A reader unfamiliar with the experiment can see the exact tested prompt, poor model response and inferred static map, understand how the measuring pipeline generated supporting evidence, follow R013–R019 controls, and inspect actual records of human selection/correction and the happy accident. All key links point to the relevant source. The page builds and reads at desktop and mobile sizes.

**Failure:** The original response is omitted; the static map is presented as a single real network; technical code or research links become decoration instead of reproducible evidence; the model under test is confused with the analysing agent; private research links are implied to be publicly accessible; or the human-learning process is flattened into an unsupported success story.

**Scope drift:** Restoring interactive graph development, adding metadata, changing the project science or historical run files, performing new experiments, making the repository public without explicit approval, or modifying unrelated portfolio pages.

The next milestone is **visual and scientific QA of this rebuilt first draft**, not publication or interactive tooling.
