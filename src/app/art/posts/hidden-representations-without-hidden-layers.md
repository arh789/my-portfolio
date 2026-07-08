---
title: "Hidden Representations Without Hidden Layers"
description: "What can be inferred about a language model’s semantic structure when its hidden states, weights, and intermediate representations are inaccessible?"
date: 2026-07-03
type: analysis
tags:
  - llm-structural-analysis
  - hidden-representations
  - model-structure-analysis
---

The paper [*Layer by Layer: Uncovering Hidden Representations in Language Models*](https://arxiv.org/abs/2502.02013) examines a problem that is easy to overlook when using large language models: the final layer is not necessarily where the most useful representation lives.

Its central finding is not that a model's hidden layers explain every individual answer. Rather, it shows that intermediate layers can contain stronger features than final-layer representations across a range of embedding tasks. This challenges the default assumption that the final output is the most useful or complete expression of what the model has learned.

The paper does not demonstrate that hidden states can be reconstructed from completed text. It motivates the narrower question explored here: what structural constraints can be inferred from observable behaviour alone?

That creates a practical problem.

Most people using commercial language models cannot inspect intermediate layers, activation vectors, attention maps, or hidden states. They only see prompts and completed responses.

So a different question becomes relevant:

> What can be inferred from a language model when its internal representations remain inaccessible?

## The black-box problem

A completed response is already a compressed object.

It has passed through a process that selects one path through many possible continuations, resolves incompatible associations, suppresses alternatives, and presents the result as coherent prose.

The output is useful, but it is not transparent.

Some concepts surface immediately. Others appear only after a particular line of questioning. Some remain absent despite being necessary to explain the answer's logic. Others repeatedly appear because they are statistically familiar, even when they are not structurally useful.

These patterns are not direct evidence of hidden states.

They are traces.

The task is therefore not to claim access to an LLM's internal geometry. It is to infer the minimum local structure required for an observed output to remain coherent.

## From hidden representations to behavioural traces

Mechanistic interpretability studies models from the inside.

It asks questions such as:

- Which layer retains a useful representation?
- How is information transformed across the network?
- Which internal features or circuits contribute to a task?

A behavioural approach starts from the opposite constraint.

It asks:

- What must be present for this response to hold together?
- What has been excluded, weakened, or deferred?
- Which concepts stabilise the answer?
- Which associations are nearby but not actually necessary?
- What becomes visible only when the original answer is put under pressure?

Both approaches are concerned with latent structure.

The difference is evidential access.

One works with representations inside the model. The other works with the observable trace left by a completed output.

## SDA-3: Structured Dimensional Analysis

[SDA-3](/art/sda-3-analysing-embedding-space-structure-in-large-language-models) is a framework for this second problem.

It does not inspect weights, recover hidden states, or verify the contents of an embedding space. Instead, it treats an output as a constrained trace and reconstructs the smallest local set of relationships required for that output to remain internally coherent.

The method separates an output into five functional roles:

- **Central** — elements the response depends on;
- **Suppressed** — relevant elements that are absent, avoided, or weakened;
- **Adjacent** — neighbouring elements that extend or stabilise the main structure;
- **Highly Correlated but Unrelated** — familiar associations that appear near the topic without being structurally required; and
- **Emerging** — elements exerting directional pressure without being fully integrated.

The “3” in SDA-3 refers to its three-part format:

1. A structural distribution across these roles.
2. A ranked anchor set.
3. A final synthesis constrained by the structure identified above.

The ranked terms are not measured activations or literal token weights. They are behavioural anchors: semantic units that a valid reconstruction must account for.

The following video provides a brief operational summary of SDA-3 and the structural roles it uses.

{{ youtube id="fmYShejgkBc" title="SDA-3 tl;dr: Mapping LLM Response Structure" }}

For a shorter written account of the method's limits and operating assumptions, see [SDA-3 tl;dr](/art/sda3-tldr).

## What SDA-3 can and cannot claim

SDA-3 is deliberately narrower than model interpretability research.

It cannot recover:

- Exact activations.
- Global embedding-space topology.
- Attention weights.
- Internal probabilities.
- The uniquely true hidden state that produced an answer.

Multiple internal configurations can produce similar text.

What SDA-3 produces is a **necessity-bound local reconstruction**: the lowest-complexity structure that explains why this output took this form, what it depends upon, and which alternatives appear to have been blocked or displaced.

This matters because a fluent answer can conceal unresolved contradictions.

A response may sound complete while depending on unstated assumptions. It may preserve familiar genre patterns because they are statistically easy to continue. It may omit a constraint because introducing it would destabilise the answer's coherence.

The point is not to treat the reconstruction as ground truth.

The point is to make the response's hidden dependencies available for inspection.

## From mapping to pressure-testing

Once a provisional structure has been mapped, the next question is whether it survives pressure.

The [Structural Extraction Protocol](/art/structural-extraction-protocol) extends this process through recursive constraint and adversarial questioning. Instead of accepting the first plausible answer, it identifies the assumptions supporting that answer, tests which fail first, removes weak branches, and observes what still holds.

The useful signal is often not the initial output.

It is what reappears after coherence has been forced to pay the cost of its assumptions.

The [zombie-survival case study](/art/zombie-survival-chatgpt-why-the-ai-lies-and-how-to-stop-it) demonstrates this in a deliberately high-noise setting. The initial answer contains familiar survival-fiction associations. Repeated constraint testing separates temporary conveniences, genre drift, and unsupported branches from the smaller configuration that remains viable under scarcity, mobility, and physical limits.

The surface subject is zombies.

The actual subject is how a language model reorganises when an answer can no longer rely on its original assumptions.

## Why this matters for the portfolio

This website uses SDA-3 not as a substitute for mechanistic interpretability, but as a practical method for working with AI systems that cannot be inspected directly.

The same constraint appears elsewhere in the portfolio.

Search systems, ranked content, audience language, and AI-generated descriptions all produce observable outputs while concealing the conditions that selected them. The [research pipeline](/art/research-pipeline) applies a related sequence of sampling, filtering, reconstruction, and stress-testing to identify which semantic structures remain stable enough to support a creative or strategic decision.

The connection is not that all black-box systems are identical.

It is that a completed output is rarely self-explanatory.

Whether the object is an LLM response or a search-result landscape, the visible surface can be treated as evidence of a deeper selection process. The practical task is to identify what that surface depends on before treating it as a conclusion.

## Conclusion

*Layer by Layer* shows that useful representations can exist away from a model's final layer.

SDA-3 begins from the practical consequence of that fact: most users will never see those layers.

That does not make hidden structure irrelevant. It changes the available method.

Instead of claiming access to the model's internals, SDA-3 reconstructs the local constraints implied by its outputs: what holds an answer together, what it excludes, what it confuses with relevance, and what returns when weaker structures collapse.

The aim is not to open the black box completely.

It is to make it less opaque.

## Reference

Oscar Skean et al. (2025), [*Layer by Layer: Uncovering Hidden Representations in Language Models*](https://arxiv.org/abs/2502.02013).
