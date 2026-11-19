# Codex handover — rebuilt evidence-led LLM Topology article

**Status:** third editorial pass, necessity-driven first draft. The article's causal structure has been rebuilt from the actual run chronology. Codex's next task is source, build and visual verification—not reinserting decorative interactive placeholders.

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

## Current article architecture — why each operation was necessary

The article was revised again on the existing draft branch because the first rebuild explained what was done and how, but not sufficiently **why the preceding evidence made the next operation necessary**. The current article has **seven sections**. Preserve the problem → necessary response → recorded evidence → unresolved limitation connections rather than reducing the article back to a decorative procedure diagram.

| Section ID | Governing question and content |
|---|---|
| `question` | **Why inspect a transformer at all?** The original hypothesis in MA-0119: infer learned higher-order structure from layerwise changes, not reconstruct original training documents; limitations of final-output-only inspection |
| `observation` | **Why R020?** A deliberately small Pythia 70M model exposes the distinction between generated expression and recovered associations. Exact prompt and output, static recurrent map, numerical evidence and audit links. R020 is a later demonstration, not the starting experiment |
| `measurement` | **Why each pipeline operation?** State capture, vocabulary projection, neighbourhood networks and semantic reconstruction are each presented as a response to what preceding evidence could not establish, with original code excerpts and remaining limitations |
| `trajectory` | **Why twenty experiments?** Five phases R001–R020 show what was insufficient, which new operations followed, the actual findings, remaining uncertainty and where documented human direction changed the next inquiry. R002 strict cutoff, R006–R007 failed validations and R011 instrumentation failure are explicitly preserved; R019 excludes tested runtime variability |
| `human` | **Why was human direction needed?** The agent could produce coherent but unjustified abstractions; the human selected promising lines of inquiry (MA-0099) and challenged wrong questions and added success conditions (MA-0119, MA-0127, MA-0128) |
| `discovery` | **Why did the human learn?** MA-0083 → MA-0120 demonstrates the change from treating human learning as incidental to recognising knowledge acquisition through directing agent exploration, with both positive and negative recognition |
| `evidence` | **What allows inspection and reproduction?** Direct primary-data, code, audit and method links. Explain repository-private and large-raw-data limits; never claim full public replication |

Navigation must link to these seven actual IDs. The experimental objective did not change when the human–agent learning insight emerged.

### Source fidelity checkpoints

- [RUN_OPTIMISATION_TRAJECTORY.md](https://github.com/arh789/llm_topology/blob/main/RUN_OPTIMISATION_TRAJECTORY.md) governs the necessity and order of the 20 runs. It records failures and explicitly distinguishes the information optimised by each experiment from the model's training objective.
- [ARTICLE_EVIDENCE_INDEX.md](https://github.com/arh789/llm_topology/blob/main/ARTICLE_EVIDENCE_INDEX.md), C1–C10, governs factual and epistemic support for each claim. The current [REPORT_STATUS.md](https://github.com/arh789/llm_topology/blob/main/REPORT_STATUS.md) prevails over outdated historical comments.
- R008 validated 66 networks; R009 examined 792 community instances; R010 reconstructed candidate parents. The page now links to their actual run artefacts, not only retrospective summaries.
- R013 changed concept order; R014 changed surrounding context; R015 replaced the concept window with neighbouring terms. Recovered families can recur without one invariant graph.
- R017 was a one-order map; R018 tested six permutations in the larger model; R019 repeated identical inputs in the tested local environment. Do not present the R019 result as universal determinism.
- R020 follows both generation time and transformer depth; its semantic family labels are post-hoc interpretations grounded by measured edges. MA-0127 explicitly rejects continuous integration as an unrequested additional success criterion.
- MA-0099 contains the human prompt that triggered a further map interrogation. Its response described process/change as most connected in R015 (versus spatial/measurement in R014) in the **interpreted principal parent networks**, not a directly measured token cosine ranking.


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

**Success:** A reader unfamiliar with the experiment can identify why the original transformer-state hypothesis required measurement, see the exact R020 prompt, poor model response and inferred static map, understand why each pipeline stage was necessary and what it could not establish, follow the R001–R020 necessity chain, and inspect actual records of human selection/correction and the happy accident. All key links point to the relevant source. The page builds and reads at desktop and mobile sizes.

**Failure:** The original response is omitted; the static map is presented as a single real network; technical code or research links become decoration instead of reproducible evidence; the model under test is confused with the analysing agent; private research links are implied to be publicly accessible; or the human-learning process is flattened into an unsupported success story.

**Scope drift:** Restoring interactive graph development, adding metadata, changing the project science or historical run files, performing new experiments, making the repository public without explicit approval, or modifying unrelated portfolio pages.

The next milestone is **visual and scientific QA of this rebuilt first draft**, not publication or interactive tooling.
