# Current Work: SDA-3 Reverse-Engineering Framing

**Status:** Source consistency, metadata, generated outputs and local verification completed; production verification pending. Desktop WSL synchronisation requires local execution.  
**Created:** 2026-11-09  
**Objective:** Align the portfolio's SDA-3 methodology and descriptions around reverse engineering from observable LLM responses.

## Active scope amendment — 10 November 2026

The original ten-task plan below is retained verbatim as a historical record. The user subsequently approved a minimal wording pass, then requested completion of the omitted work after a Codex assessment. The active scope is now: retain the deployed minimal edits; resolve residual contradictory definitions with targeted replacements; align relevant descriptions; update modification dates; regenerate and commit all discovery outputs; preserve reproducible verification evidence; and distinguish repository, production and desktop state.

Page titles, URLs, slugs, tags, project membership, videos, visual design, application logic and dependency files remain unchanged. Title renaming and wholesale article rewrites from the original plan are superseded. The YouTube index receives only the removal of an unestablished SDA-3 name expansion and its modification-date update. Historical case-study narratives and valid single-response examples are preserved.

## Original ten-task plan (verbatim)

1. **Establish one canonical definition across the site.**  
   Use:
   > **SDA-3 is a protocol for reverse-engineering an LLM’s embedding-space structure from its response behaviour.**

   Follow this with the five structural categories and three-stage output format. Establish the inferential framing once rather than repeatedly explaining that internal access is unavailable.

2. **Reconcile the conflicting methodological definitions.**  
   Treat a single response as one unit of analysis, not the limit of the investigation. Distinguish **SDA-3’s structural mapping** from **SEP’s iterative testing and refinement**. Define Struct% consistently as estimated structural salience, rather than alternating between token distribution and explanatory load. Replace unsupported claims of deterministic or uniquely necessary internal reconstruction with the strongest structural explanation supported by the observations. These discrepancies currently appear across the protocol and tl;dr. fileciteturn8file0L2-L2 fileciteturn9file0L2-L2

3. **Rewrite the main SDA-3 protocol page.**  
   File: `src/app/art/posts/sda-3-analysing-embedding-space-structure-in-large-language-models.md`  
   Update the title, description, opening and operational framing. Replace the discussion of prohibited inspection, permissible inference and guardrail resistance with the reverse-engineering objective, observable evidence and reconstruction process. Preserve the categories, ranking basis and three-part execution sequence. fileciteturn8file0L2-L2

4. **Revise the tl;dr for consistency and compression.**  
   File: `src/app/art/posts/sda3-tldr.md`  
   Retain its existing reverse-engineering introduction, align the metadata with it, implement the methodological corrections above and remove repetitive “not this, not that” passages. Make it a genuinely shorter explanation of the same protocol—not a competing definition. fileciteturn9file0L2-L2

5. **Revise the supporting representation article.**  
   File: `src/app/art/posts/hidden-representations-without-hidden-layers.md`  
   Organise it around behavioural reverse engineering. Explain the distinction from direct representation measurement once, then concentrate on evidence, competing reconstructions and testing. Preserve the research-paper discussion without implying that the paper validates SDA-3. fileciteturn10file0L2-L2

6. **Clarify the Structural Extraction Protocol’s relationship to SDA-3.**  
   File: `src/app/art/posts/structural_extraction_protocol.md`  
   Explain how iterative questioning, constraint changes and adversarial tests examine and refine the structural map. Review claims that surviving these tests necessarily reveals the model’s actual internal mechanism; distinguish the testing procedure from what its results establish. fileciteturn12file0L2-L2

7. **Align project introductions and machine-readable descriptions.**  
   Update the relevant SDA-3 entry in `src/app/art/lib/projectData.js` and the relevant summaries in `scripts/agentPageContent.js`. Ensure titles, descriptions and agent-facing explanations present the same objective and method as the articles. Retain substantive evidential limits where they affect interpretation, rather than using them as the primary description. fileciteturn11file0L2-L2 fileciteturn21file0L2-L2

8. **Run a repository-wide consistency audit.**  
   Search for SDA-3 naming variants, embedding-space descriptions, internal-access disclaimers and reverse-engineering references. Check the `/datamining-llm` material, `siteManifest.js`, related articles and cross-links. Edit conflicting definitions or descriptions—not every incidental mention.

9. **Regenerate the derived site data.**  
   Update modification dates for changed content and run the existing discovery-generation process so the agent maps, article graph and sitemap reflect the revised sources. Do not manually patch generated copies independently.

10. **Verify the complete change set.**  
    Run the available build and lint checks; inspect the rendered pages and generated descriptions; check internal links and the final diff. Preserve existing routes, slugs, filenames, project membership, videos and unrelated content. Report the changed files and verification results.

**The scope is a coordinated methodology and description edit—not a site-wide rewrite or a redesign of SDA-3.**

---

## Progress tracking

These statuses refer to the amended scope above, not automatic execution of the original wording. The original plan remains unchanged.

| Task | Status |
| --- | --- |
| 1. Canonical definition | Complete: methodological definitions aligned around behavioural reverse engineering. |
| 2. Methodological reconciliation | Complete: single observations distinguished from scope; necessity bounded to tested constraints; Struct% aligned. |
| 3. Main SDA-3 protocol | Complete within amended scope: targeted framing and metadata edits; title and sequence retained. |
| 4. SDA-3 tl;dr | Complete within amended scope: conflicting definitions corrected without replacing the article. |
| 5. Supporting representation article | Complete within amended scope: definition and metadata aligned; paper and references preserved. |
| 6. SEP relationship | Complete: mapping/testing distinction, evidence bounds and stopping condition clarified. |
| 7. Project and agent descriptions | Complete: relevant descriptions aligned without changing project membership. |
| 8. Repository-wide consistency audit | Complete: tracked source and notebook cells searched; incidental references and historical examples reviewed and retained. |
| 9. Regenerate discovery data | Complete: all four outputs generated together; counts, URLs, relationships and membership verified; outputs included in the candidate commit. |
| 10. Verification | Local build, lint, source-preservation and discovery checks passed. Production comparison pending publication. |

### Evidence and environment boundary

See [the verification record](docs/verification/sda3-2026-11-10/README.md), exact replacement manifest, source checks and command logs in the same directory. Temporary execution helpers and the verification workflow are not part of the production patch.

The connected tools operate on GitHub and a separate verification environment, not the user's desktop WSL session. `/root/my-portfolio` has not been synchronised or independently inspected here. Do not describe desktop synchronisation as complete until Codex runs the guarded procedure below locally and records the resulting SHA.

### Canonical WSL handover

Run inside the user's WSL environment, not in a disposable cloud checkout:

```bash
cd /root/my-portfolio || exit 1
git status --short
# Stop if any tracked or untracked user work is present; reconcile it first.
test -z "$(git status --porcelain)" || exit 1
test "$(git branch --show-current)" = main || exit 1
git fetch origin main || exit 1
git merge --ff-only origin/main || exit 1
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" || exit 1
git status --short
git rev-parse HEAD
```

Do not reset, discard, stash automatically, rebase or force-push. A dirty or diverged checkout must be reconciled before continuing. Record successful local synchronisation in a separate status entry; leave the original plan untouched.
