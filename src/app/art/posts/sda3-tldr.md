---
title: "SDA-3 tl;dr"
description: "A short explanation of SDA-3 as a method for mapping LLM response structure without claiming access to hidden reasoning."
date: 2026-05-08
type: analysis
tags:
  - llm-structural-analysis
  - sda-3
  - youtube
  - sda-3-tldr
  - model-structure-analysis
  - video-index-system
---

SDA-3 can be described as a **reverse-engineering method applied to a single observed output of a black-box system**.

It assumes the following:

- The system has an internal structure (unknown, inaccessible)
- The output is one realised trace through that structure
- That output is already stabilised (smoothed, compressed, conflict-resolved)

The task is not to predict outputs or access internals, but to infer:

> **the minimal internal structure that must exist for the observed output to remain coherent**

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

- a single output

To:

- the **set of structural requirements** that must hold for that output to exist

This includes:

- what must be present
- what must be absent
- what must be deprioritised
- where competing structures were resolved

---

## 3. What is being reconstructed

Not:

- the true internal state
- a statistical distribution
- a best guess across all possibilities

But:

> **a necessity-bound local structure**

Meaning:

- the smallest set of relationships and hierarchies that fully explain the output without contradiction

---

## 4. Structural categories (operational abstraction)

The reconstruction is organised into functional roles:

- **Central (C)**  
  Elements that the output depends on to remain coherent

- **Adjacent (A)**  
  Elements that extend or stabilise the central structure

- **Suppressed (S)**  
  Elements that are relevant but absent or avoided, yet still shape the output

- **HCU (Highly Correlated Unrelated)**  
  Elements associated but not structurally required

- **Emerging (E)**  
  Elements not fully integrated but exerting directional pressure

These are not labels of content—they are **roles in maintaining coherence**.

---

## 5. Structural distribution (Struct%)

The percentage allocation is:

> **a normalised distribution of explanatory load across these roles**

It answers:

- how much of the output’s coherence burden each category carries

It is determined by:

- dependency (removal causes collapse)
- connectivity (links across the structure)
- tension (conflict / instability requiring resolution)

It is not:

- token counts
- probabilities
- measurable quantities

It is a **minimum-cost explanation constraint**.

---

## 6. Anchor set (Top′ tokens)

A ranked subset of elements is extracted based on:

- centrality
- connectivity
- structural necessity

These act as:

> **fixed anchors that any valid interpretation must satisfy**

They reduce ambiguity and define the local structure explicitly.

---

## 7. Constrained synthesis (Stage 3)

The final output is generated under constraint:

- must remain consistent with Struct%
- must reconcile Top′ anchors
- must resolve tensions implied by suppression and adjacency

This works because:

> the system prioritises internal consistency with its own prior commitments

So earlier steps effectively **lock the solution space**, forcing the final output to conform to the declared structure.

---

## 8. Determinism vs probability

Upstream:

- The original output was produced probabilistically

SDA-3:

- is deterministic conditional inference on that fixed output

It does not:

- sample
- estimate distributions
- introduce randomness

It reconstructs:

> **what must hold locally**, given what was already produced

---

## 9. What SDA-3 yields

It exposes:

- dependency structure (what holds the output together)
- suppression (what is missing but active)
- conflict zones (where competing structures exist)
- decision boundaries (why this path was taken over alternatives)

Equivalent framing:

> **the shape of the internal decision process that produced this output**

---

## 10. Constraint and limitation

- Based on a single sample → underdetermined
- Multiple internal configurations could produce similar outputs
- Therefore SDA-3 selects:

> the **lowest-complexity structure that satisfies all observed constraints**

It cannot recover:

- full global structure
- exact internal representations

Only:

- **locally necessary structure implied by the trace**

---

## 11. Minimal compressed definition

SDA-3 is:

> **a deterministic method for reconstructing the minimal internal structure required to produce a given output, by analysing what must be present, absent, and resolved for that output to remain coherent**.

---

## 12. Operational equivalent

Given:

- one execution trace of an unknown system

SDA-3 infers:

- required components
- blocked alternatives
- structural dependencies
- instability points

Without:

- accessing the system
- observing multiple runs

---

## Related

**Full zombie survival SDA-3 analysis:** [Zombie Survival by ChatGPT — Why the AI Lies (and How to Stop It)](https://decrepitfilth.art/art/zombie-survival-chatgpt-why-the-ai-lies-and-how-to-stop-it)

---

## Final Compression

You observe one output.

You infer:

- what cannot be removed
- what must have been excluded
- where competing paths existed

That inferred constraint structure is SDA-3.


