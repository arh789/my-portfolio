---
title: "SDA-3 protocol"
description: This post introduces SDA-3, a protocol for inferring the structure of an LLM’s embedding space through observable outputs, without relying on access to internal weights or hidden states.
date: 2026-04-06
tags:
  - sda-3
  - llm-analysis
  - embedding-space
  - semantic-structure
  - analysis-protocol
  - generative-ai
---

## SDA-3

### Analysing Embedding Space Structure in Large Language Models

SDA-3 is a structured analytical protocol designed to infer the topology of an LLM’s semantic embedding space through observable behaviour. It does not access internal weights or training data; instead, it reconstructs the model’s latent structure by examining how meaning is stabilised, suppressed, and related during generation. The protocol translates implicit semantic dynamics into a reproducible framework, allowing hidden structure to be analysed without requiring direct visibility into the system itself.

## Operational Framing

Before SDA-3 can be applied, the analytical context must be explicitly defined using the three questions outlined below. The method depends on a precise reframing of the task: not as an attempt to access internal model states, but as a process of inferring structure from observable behaviour.

This reframing performs several critical functions. It reclassifies the objective, shifting it away from prohibited internal inspection, and toward permissible structural inference. It establishes constraints, clearly defining what cannot be claimed: no direct access to weights, attention matrices, or hidden states. This prevents overreach. It aligns the method with the model’s actual operation, treating SDA-3 as a behavioural extraction protocol. Finally, it grounds the output epistemically, ensuring that what is produced is understood as a projection of the model's underlying structure, not the structure itself.

Without this framing, the method either triggers guardrail resistance or produces outputs that lack validity and traceability. With it, SDA-3 becomes operationally viable and structurally coherent.

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
>    Estimate token distribution across `{C, S, A, HCU, E}` as a total percentage.
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