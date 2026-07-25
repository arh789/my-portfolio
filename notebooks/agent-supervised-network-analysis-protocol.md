# Generalised agent-supervised network analysis protocol

This note abstracts the Semantic SEO Python thread into a reusable method for future analyses. The goal is to build a discovery representation without forcing the expected answer, then use structured human interrogation to extract meaning from it.

## 1. Information to extract

### A. What the network is made of

```text
nodes
edges
source documents
evidence units
extraction rules
filters
thresholds
```

Purpose: establish what the graph actually represents.

### B. What holds the network together

```text
bridge nodes
high-betweenness pages/concepts
cross-community terms
shared evidence phrases
connector domains/pages
```

Purpose: identify structural hinges.

### C. What communities form

```text
number of communities
community sizes
top terms per community
representative pages
outlier/noise groups
```

Purpose: see whether topic regions exist before naming them.

### D. What each community might mean

```text
candidate topic
supporting terms
supporting pages
ambiguous terms
possible artefacts
```

Purpose: convert structure into provisional meaning.

### E. What is missing or weak

```text
missing bridges
isolated regions
under-connected topics
weak evidence edges
single-source concepts
over-compressed areas
```

Purpose: identify gaps and possible interventions.

### F. What the algorithms missed

```text
over-smoothing
over-fragmentation
false clusters
collapsed distinctions
unlabelled bridges
method-specific blind spots
```

Purpose: compare machine outputs against supervised interpretation.

### G. What the agent may be adding incorrectly

```text
coherence smoothing
prior-thesis fitting
invented hierarchy
overconfident labels
narrative drift
process description instead of findings
```

Purpose: detect agent failure.

### H. What action follows

```text
content opportunities
internal-link opportunities
concepts to clarify
pages to create/update
claims safe to publish
claims needing more evidence
```

Purpose: turn analysis into strategy.

## 2. Rules for the agent when building the network

### Construction rules

```text
1. Build from source evidence, not from expected topics.
2. Do not use a prior taxonomy unless explicitly marked as a comparison layer.
3. Preserve provenance for every node and edge.
4. Let communities form before labels are assigned.
5. Assign labels after structure, not before.
6. Treat labels as provisional.
7. Separate discovery graphs from confirmation graphs.
8. Keep raw, noisy diagnostic graphs separate from filtered analytical graphs.
9. Record all thresholds, filters, and extraction choices.
10. Save graph files and evidence ledgers for later review.
```

### Interpretation rules

```text
1. Answer from graph evidence first.
2. Do not produce a broad narrative unless asked.
3. Separate findings from process description.
4. Separate structure from meaning.
5. Separate algorithm output from agent interpretation.
6. Flag where interpretation may be smoothing.
7. State when a topic is only a keyword cluster.
8. Do not treat centrality as strategic importance without evidence.
9. Do not treat similarity as relationship validity.
10. Do not treat a content gap as real until extraction/model artefacts are considered.
```

### Supervision rules

```text
1. Make review surfaces labelled and compact.
2. Avoid giant unprioritised tables.
3. Show bridge nodes, communities, and evidence before recommendations.
4. Provide concise answers by default.
5. Expand only when asked.
6. Preserve rejected interpretations as part of the record.
7. Record human challenges and resulting revisions.
```

## 3. Generalised questions for the human supervisor to ask

### Stage 1 - Representation check

Information needed: what the graph represents.

Questions:

```text
What data did you build the graph from?
What counts as a node?
What counts as an edge?
What evidence supports each edge?
What filters or thresholds did you apply?
Did you use any prior taxonomy or expected topic labels?
Is this a discovery graph or a confirmation graph?
```

### Stage 2 - Structural hinges

Information needed: what holds the network together.

Questions:

```text
What nodes hold the network together?
Which nodes have the highest betweenness?
Which terms or pages connect the most communities?
Which edges connect otherwise separate regions?
What happens if the top bridge nodes are removed?
Are the bridge nodes substantive or generic?
```

### Stage 3 - Community discovery

Information needed: what regions form before interpretation.

Questions:

```text
How many communities form?
What are the largest communities?
What are the smallest or isolated communities?
Which communities are connected to each other?
Which communities are mostly disconnected?
Which nodes sit between communities?
```

### Stage 4 - Community meaning

Information needed: what the communities might be about.

Questions:

```text
For each community, list the top terms and representative source pages.
For each community, what topic is suggested by the evidence?
Which communities are only keyword clusters, not topics?
Which terms look like artefacts?
Which labels are strongest, weakest, or uncertain?
What evidence would change the label?
```

### Stage 5 - Missing structure

Information needed: what gaps or weak links exist.

Questions:

```text
What expected connections are absent?
Which important concepts are under-connected?
Which communities should be connected but are not?
Which pages or terms could serve as bridges?
Are the gaps real, or could they be caused by extraction/model choice?
What evidence supports each proposed gap?
```

### Stage 6 - Method comparison

Information needed: what algorithms reveal or miss.

Questions:

```text
What did each method find?
What did each method miss?
Where do the methods agree?
Where do they disagree?
Which method over-compressed the network?
Which method over-fragmented the network?
Which method produced the best discovery artifact?
Which method produced the best review surface?
```

### Stage 7 - Agent failure check

Information needed: whether the agent is adding false coherence.

Questions:

```text
Are you interpreting the data or smoothing it?
What are you assuming that the graph did not prove?
What would the graph say if you ignored our prior discussion?
Which part of your answer is evidence, and which part is interpretation?
Could this be a confirmation graph rather than a discovery graph?
What would make your interpretation wrong?
```

### Stage 8 - Action extraction

Information needed: what to do next.

Questions:

```text
What content opportunities follow from the network?
What internal-link opportunities follow?
Which topics need their own page?
Which topics should be sections inside an existing page?
Which claims are safe to publish now?
Which claims require more evidence?
What should be measured after publication?
```

## 4. Minimal reusable interrogation script

```text
1. What does this graph represent?
2. What nodes hold it together?
3. How many communities form?
4. What does each community contain?
5. Which communities are real topics, and which are only keyword clusters?
6. What bridges are missing?
7. What did the algorithms miss?
8. What are you assuming that the data did not prove?
9. What would change your interpretation?
10. What action follows?
```

This sequence is the reusable method. It forces the agent to move from structure to meaning to action without jumping straight into narrative.
