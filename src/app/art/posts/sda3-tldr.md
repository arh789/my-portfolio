---
title: "SDA-3 tl;dr"
description: "How SDA-3 reverse-engineers semantic relationships from LLM responses through structural salience, ranked terms and testable explanations."
date: 2026-05-08
lastModified: "2026-11-10"
projects:
  - slug: chatgpt-structural-failure
    order: 11
    role: methodology
  - slug: sda3-structural-extraction
    order: 10
    role: summary
medium: methodology
type: analysis
tags:
  - llm-structural-analysis
  - sda-3
  - youtube
  - sda-3-tldr
  - model-structure-analysis
  - video-index-system
---

SDA-3 is a **protocol for reverse-engineering an LLM’s embedding-space structure from its observable response behaviour**. A single response supplies one local observation; comparisons across prompts and constraints test and extend the reconstruction.

It assumes the following:

- The system has an internal structure (unknown, inaccessible)
- The output is one realised trace through that structure
- That output is already stabilised (smoothed, compressed, conflict-resolved)

The task is to infer:

> **the simplest structural explanation that accounts for the observed relationships**

{{ youtube id="fmYShejgkBc" title="SDA-3 tl;dr: Mapping LLM Response Structure" }}

---

## 1. System framing

Treat the model as:

- a system where ideas are linked by relationships
- producing outputs by moving through those relationships

You do not see:

- vectors
- weights
- probabilities

You only see:

- the final text

SDA-3 operates entirely on that surface.

---

## 2. Core operation

SDA-3 performs a **reverse mapping of constraints**:

From:

- one or more observed outputs

To:

- the **relationships and constraints** that best explain those observations

This includes:

- which concepts organise the response
- which relevant concepts are absent or displaced
- which relationships are deprioritised
- where competing interpretations remain possible

---

## 3. What is being reconstructed

The reconstruction is:

> **a testable local structure**

Meaning:

- the simplest set of relationships and hierarchies that accounts for the observations and can be tested against further responses

---

## 4. Structural categories (operational abstraction)

The reconstruction is organised into functional roles:

- **Central (C)**  
  Elements that the output depends on to remain coherent

- **Adjacent (A)**  
  Elements that extend or stabilise the central structure

- **Suppressed (S)**  
  Relevant elements that appear weakened, excluded or displaced; their role is tested through comparison

- **HCU (Highly Correlated Unrelated)**  
  Elements associated but not structurally required

- **Emerging (E)**  
  Elements not fully integrated but exerting directional pressure

These are not labels of content—they are **roles in maintaining coherence**.

---

## 5. Structural distribution (Struct%)

The percentage allocation is:

> **an estimated distribution of structural salience across these roles**

The percentages estimate each category’s relative prominence in the inferred structure and total 100%. They use the protocol’s ranking basis: associative immediacy, connectivity breadth, generative stability and discourse frequency. They are estimates of structural salience, not literal token counts or measured internal probabilities.

---

## 6. Anchor set (Top′ tokens)

A ranked subset of elements is extracted based on:

- associative immediacy
- connectivity breadth
- generative stability
- discourse frequency

These act as:

> **fixed anchors that any valid interpretation must satisfy**

They reduce ambiguity and define the local structure explicitly.

---

## 7. Constrained synthesis (Stage 3)

The final output is generated under constraint:

- must remain consistent with Struct%
- must reconcile Top′ anchors
- must resolve tensions implied by suppression and adjacency

The earlier stages make the synthesis accountable to its declared structure. Further observations test that reconstruction; consistency within one answer is not sufficient validation.

---

## 8. Structured inference

Upstream:

- The original output was produced probabilistically

SDA-3:

- uses structured inference to reconstruct semantic relationships from observed outputs

It reconstructs:

> **which local relationships best explain the observations**

---

## 9. What SDA-3 yields

It exposes:

- dependency structure (what holds the output together)
- suppression (what is missing but active)
- conflict zones (where competing structures exist)
- candidate boundaries (where a changed constraint changes the response)

Equivalent framing:

> **a testable model of the dependencies expressed through the response**

---

## 10. Constraint and limitation

- A single sample provides a local starting point
- Multiple internal configurations could produce similar outputs
- Therefore SDA-3 selects:

> the **simplest structural explanation consistent with the observations and tests**

The reconstruction applies to the observations tested. Additional responses can extend, distinguish or overturn it.

---

## 11. Minimal compressed definition

SDA-3 is:

> **a reverse-engineering protocol that reconstructs semantic structure from observable LLM responses by identifying central relationships, exclusions, dependencies and emerging associations**.

---

## 12. Operational equivalent

Given:

- one or more responses from an unknown system

SDA-3 infers:

- candidate components
- excluded alternatives to investigate
- structural dependencies
- instability points

Evidence:

- recorded prompts, responses and changes under questioning

---

## Related

**Full zombie survival SDA-3 analysis:** [Zombie Survival by ChatGPT — Why the AI Lies (and How to Stop It)](https://decrepitfilth.art/art/zombie-survival-chatgpt-why-the-ai-lies-and-how-to-stop-it)

---

## Final Compression

You observe responses under stated conditions.

You infer:

- which relationships organise them
- which relevant alternatives appear excluded
- what changes when the constraints change

That inferred constraint structure is SDA-3.
