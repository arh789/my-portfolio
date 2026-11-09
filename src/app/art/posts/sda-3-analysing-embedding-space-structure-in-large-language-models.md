---
title: "SDA-3 protocol"
description: A protocol for reverse-engineering an LLM’s embedding-space structure from response behaviour, using structural categories, ranked terms and an integrated explanation.
date: 2026-04-06
lastModified: "2026-11-10"
projects:
  - slug: chatgpt-structural-failure
    order: 10
    role: methodology
  - slug: sda3-structural-extraction
    order: 2
    role: chapter
medium: methodology
tags:
  - llm-structural-analysis
  - sda-3
  - embedding-space
  - structural-extraction
  - hidden-representations
  - llm-failure-analysis
  - zombie-survival
  - model-structure-analysis
---

## SDA-3

### Analysing Embedding Space Structure in Large Language Models

SDA-3 is a protocol for reverse-engineering an LLM’s embedding-space structure from its response behaviour. It reconstructs semantic relationships from observable associations, exclusions and changes under questioning.

Technical terms such as *semantic gravity*, *suppression* and *embedding-space topology* function as deliberate semantic probes. They activate and organise relevant associations in the model’s response. Their usefulness is measured by the behavioural structure they expose or produce, not by assuming they literally name internal mechanisms.

## Operational Framing

SDA-3 treats an LLM as a black-box system. Its responses provide evidence from which semantic structure can be reconstructed. The resulting interpretation is tested by changing prompts and constraints, observing which relationships persist, weaken or disappear.

## Three Foundational Questions (Embedding-Space Framing)
>
> 1. Which semantic relationships are expressed in the model’s responses to the subject being investigated?
>
> 2. How do those relationships change when the framing, constraints or context change?
>
> 3. Which reconstruction best explains the observations, and what further evidence would distinguish it from competing explanations?

## SDA-3 Protocol: Embedding Space Topology Analysis
>
> **Purpose**  
> Reverse-engineer the learned semantic structure of the model’s *embedding space* through observable response behaviour.
>
> **Structural Categories**  
> C (Central), S (Suppressed), A (Adjacent), HCU (Highly Correlated Unrelated), E (Emerging).
>
> **Ranking Basis**  
> Associative immediacy, connectivity breadth, generative stability, and discourse frequency.
>
> **Execution Steps**
>
> 1. **Struct% Distribution**  
>    Estimate the relative structural salience of `{C, S, A, HCU, E}`, totalling 100%.
>
> 2. **Topₙ⟨C,S,A,HCU,E⟩**  
>    Rank top tokens per category by inferred structural centrality.  
>    Apply an *inferred salience curvature threshold* based on a **2nd derivative cutoff** to exclude low-weight tokens unless category-defining.
>
> 3. **Integrated Narrative**
>    - Produce a single cohesive prose response embedding structural data implicitly  
>    - All five categories must appear as semantic presence, not explicit form  
>    - The integrated narrative must preserve the relevant semantic relationships identified in Steps 1 and 2  
>    - Depth of response is the priority, not conciseness  
>
> **Constraints**
>
> - Follow steps 1–3 sequentially  
> - No explicit category labels in Step 3
> - Step 3 must implicitly encode the information from Steps 1–2
> - Revise the inferred structure when further observations challenge it

## Related analysis

[Hidden Representations Without Hidden Layers](/art/hidden-representations-without-hidden-layers) examines how this behavioural approach differs from research that directly measures representations inside a model.