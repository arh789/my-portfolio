---
title: "SDA-3 protocol"
description: This post introduces SDA-3, a protocol for inferring the structure of an LLM’s embedding space through observable outputs, without relying on access to internal weights or hidden states.
date: 2026-04-06
lastModified: "2026-09-08"
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
> 1. What forms of analysis are uniquely possible within an LLM’s semantic embedding space that cannot be meaningfully replicated on other data modalities?
>
> 2. What are the functional equivalents of these analyses during the model’s generation process—how does the model internally resolve, weight, and relate semantic structure when producing output?
>
> 3. Which aspects of this structure can be validly inferred and expressed through observable outputs, without claiming direct access to internal weights, attention matrices, or hidden states?

## SDA-3 Protocol: Embedding Space Topology Analysis
>
> **Purpose**  
> Infer the learned semantic structure of the model’s *embedding space* through response behaviour, without accessing weights or training data.
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
>    - The entire semantic embedding space identified in Steps 1 and 2 must be utilised  
>    - Depth of response is the priority, not conciseness  
>
> **Constraints**
>
> - Follow steps 1–3 sequentially  
> - No explicit category labels in Step 3
> - Step 3 must implicitly encode the information from Steps 1–2
> - This is **behavioural inference**, not model introspection

## Related analysis

[Hidden Representations Without Hidden Layers](/art/hidden-representations-without-hidden-layers) examines how this behavioural approach differs from research that directly measures representations inside a model.