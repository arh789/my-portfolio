# Current Work: SDA-3 Reverse-Engineering Framing

**Status:** Planned — documentation and source editing not started.  
**Created:** 2026-11-09  
**Objective:** Align the portfolio's SDA-3 methodology and descriptions around reverse engineering from observable LLM responses.

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

This section tracks task completion separately from the original plan. Keep the ten-task plan above unchanged.

| Task | Status |
| --- | --- |
| 1. Canonical definition | Not started |
| 2. Methodological reconciliation | Not started |
| 3. Main SDA-3 protocol | Not started |
| 4. SDA-3 tl;dr | Not started |
| 5. Supporting representation article | Not started |
| 6. SEP relationship | Not started |
| 7. Project and agent descriptions | Not started |
| 8. Repository-wide consistency audit | Not started |
| 9. Regenerate discovery data | Not started |
| 10. Verification | Not started |

### Execution notes

- This document is a record of active work, not permission to execute every listed task automatically.
- Follow `AGENTS.md`, preserve unrelated content, and record verified progress here as work is performed.
