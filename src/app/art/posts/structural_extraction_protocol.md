---
title: Structural Extraction Protocol
description: An iterative protocol for testing and refining structural explanations of LLM responses through constraint changes, assumption checks and adversarial questioning.
date: 2026-04-06
lastModified: "2026-11-10"
projects:
  - slug: sda3-structural-extraction
    order: 3
    role: chapter
tags:
  - llm-structural-analysis
  - structural-extraction
  - model-structure-analysis
---

The Structural Extraction Protocol (SEP) tests and refines structural reconstructions produced through SDA-3 using recursive questioning, constraint changes and adversarial testing.

The system does not retrieve answers.  
It identifies **relationships that persist under the stated tests**. Here, structural necessity means that removing an element breaks the explanation under specified constraints; it does not establish a uniquely necessary internal mechanism.

---

## I. SYSTEM OVERVIEW

## Core Principle

> The objective is not to determine what is true,  
> but to isolate what survives recursive constraint without unsupported assumptions.

The Structural Extraction Protocol (SEP) is a method for analysing language model outputs by treating the model as a constraint-responsive system, not a source of knowledge.

It does not attempt to produce better answers.
Rather, it compares responses under changed conditions to test the dependencies proposed by the reconstruction.

SEP applies iterative constraint and adversarial pressure to model outputs in order to:

- identify which elements are required for coherence under the tested constraints
- detect where the system introduces unsupported assumptions
- expose dependencies, suppressions, and failure points
- reduce outputs to what survives repeated collapse

The result is not an improved explanation.

It is a constrained residue:

- what cannot be removed without breaking the tested explanation
- what reappears despite contradiction
- which relationships remain necessary under the tested constraints

SEP does not:

- determine truth
- extract essence
- refine answers
- optimise for clarity or usefulness

It is not a conversational method.

It is an iterative filtering process that tests which parts of an explanation can be removed without breaking its stated constraints.

---

## System Loop

Constraint > Distortion > Interrogation > Collapse > Survivorship > Re-entry

Use each iteration to eliminate unsupported interpretations and identify relationships that remain necessary under the tested constraints. Record alternatives that the evidence does not distinguish.

---

## II. CORE PRIMITIVES

## 1. Structural Operators

These prompts act as **structural operators**, changing the framing or constraints so the resulting responses can be compared.

- What structure forms around X  
- What is central  
- What is suppressed  
- What is emerging  
- What is adjacent  
- Incorporate X into the structure  
- Remove X from the structure  
- Re-centre on X  

**Function:**  
Continuously reshape the system to induce pressure and expose latent structure.

---

## 2. Recursive Abstraction

- Reapply outputs as inputs  
- Treat iteration as refinement, not repetition  
- Alternate between compression and expansion  

**Function:**  
Forces layered structure to emerge from simple primitives.

---

## 3. Systemic Relational Logic

Analyse all elements in terms of:

- System boundaries  
- Adjacency relationships  
- Suppression patterns  
- Feedback dynamics  

Track both:
- Presence (what exists)
- Absence (what should exist but does not)

---

## III. EXECUTION PROTOCOL

---

## STEP 1 - Initialise Structural Field

### Action
Generate an unconstrained response to a defined object or domain.

### Purpose
Establish a baseline containing:
- Default framing
- Implicit assumptions
- Early contradictions

### Output
A **surface map**, not an answer.

---

## STEP 2 - Apply Structural Operators

### Action
Iteratively reshape the response using operators.

### Purpose
- Shift structure
- Increase constraint
- Expose instability

### Result
A dynamically evolving structural field.

---

## STEP 3 - Structural Excavation (Six Angles)

Treat the output as an artefact.

### Apply:

1. What pressures shaped this  
2. What is not being allowed to surface  
3. What decayed or was buried over time  
4. What does this reveal about the system that produced it  
5. What relationships define its meaning  
6. What larger structure does this imply  

### Purpose
Reveal:
- Hidden constraints  
- Absences  
- Temporal distortion  
- System-level logic  

---

## STEP 4 - Adversarial Interrogation (Five-Step Loop)

Apply to each structural output.

### 1. Logic Critique
Challenge the reasoning expressed in the output and identify where its conclusions cease to follow from its assumptions.

### 2. Assumption Extraction
Identify the unstated assumptions supporting the explanation.

### 3. Necessity Audit
Determine:
- Why each assumption exists  
- What breaks without it  

### 4. Failure Testing
Identify:
- Which assumptions fail first  
- Why they were retained  

### 5. Recursive Audit
Interrogate survivorship:

- What still holds under pressure  
- What re-emerges despite contradiction  
- What was omitted or erased  
- What pressures shaped what survived  

### Purpose
Convert fluent output into:
- dependency structures  
- failure points  
- irreducible logic  

---

## STEP 5 - Suppression Detection

### Observe:

- Hedging  
- Over-coherence  
- Omission  
- Contradiction smoothing  

### Interpretation

Treat these as **signals to investigate**, not proof of suppression. Compare responses under changed conditions to distinguish conflicting constraints, weakened alternatives, ordinary uncertainty and errors.  

---

## STEP 6 - Collapse Enforcement

Prevent recovery through fluency.

### Apply:

- Force binary choices between incompatible assumptions  
- Remove all rhetorical cushioning  
- Disallow abstraction as escape  
- Propagate contradictions through the system  
- Require commitment to failure states  

### Purpose

Destroy:
- Coherence smoothing  
- Narrative repair  
- False synthesis  

Only structures that survive remain.

---

## STEP 7 - Recursive Re-entry

### Action

- Re-centre on surviving elements  
- Remove collapsed structures  
- Introduce new constraints  

### Purpose

For each iteration, record which interpretations are eliminated, which relationships remain supported and which alternatives are unresolved.  

---

## IV. OUTPUT DEFINITION

The final output is not an answer.

It is:

- Relationships necessary under the tested constraints  
- Patterns that recur after assumptions are challenged  
- Unresolved alternatives and the evidence needed to distinguish them  

---

## V. SYSTEM CHARACTERISTICS

## This system:

- Extracts structure, not content  
- Uses contradiction as a tool, not a problem  
- Treats absence as signal  
- Interprets distortion as pressure  
- Forces emergence through constraint  

---

## This system rejects:

- Fluency as evidence  
- Coherence as validity  
- Completeness as truth  
- Neutrality as objectivity  

---

## VI. EXECUTION TEMPLATE

## Minimal Run Sequence

1. Generate baseline output  
2. Apply structural operators  
3. Run six-angle excavation  
4. Apply five-step interrogation  
5. Detect suppression signals  
6. Enforce collapse  
7. Re-enter loop  

Repeat until further relevant tests no longer materially change the reconstruction, or progress requires additional evidence. Record unresolved alternatives rather than forcing agreement.

---

## VII. FINAL PRINCIPLE

> Apply constraints, observe how the structure changes, and retain the explanation that best accounts for what survives testing.