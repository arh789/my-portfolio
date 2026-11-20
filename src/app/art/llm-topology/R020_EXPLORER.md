# R020 semantic network explorer

Open **The discovery** in the article at /art/llm-topology#r020-explorer. The default is a derived semantic map reconstructed from the R020 functional-hypothesis records. Nodes consolidate semantic concepts across measured communities. Edges aggregate only recorded cross-community links carrying the two displayed classifications. The default scope uses prompt-related candidates from contextual states S01–S05, with filters for input, output-proximal, adjacent cross-domain and anti-aligned evidence.

Punctuation, formatting and unresolved tokenizer communities do not enter the derived map. Select a concept to inspect its evidence terms and measured relationships. Selecting a relationship exposes each supporting decision, state, cosine sector, community pair, token-edge count, affinity and semantic-source record.

The original measured-network explorer remains under **Inspect the underlying measured community networks**. Its default is D06, the decision in which the last input token is "bridge" and Pythia predicts "that". Community IDs remain local to the selected decision, state and sector.

Zooming out simplifies the community labels. Narrow screens also start with compact labels. Zooming in past the community view opens token evidence for the selected node. The token view exposes all members through a searchable picker and each token's ten recorded outgoing neighbours. The supporting-token control on a community connection starts with tokens whose outgoing edges contribute to that connection.

Edge width uses token-edge count divided by the geometric mean of the two community sizes. Node size uses the sum of incident affinities. Structural module colours come from the verified R020 relational partitions. Relative betweenness is calculated on the complete community graph with distances of 1 / affinity and scaled to the maximum within that network. Cross-state and cross-decision matches come from the separate token-overlap export, with shared counts and Jaccard scores.

## Rebuild in WSL

From the website checkout, with the complete local R020 run available:

~~~sh
python3 scripts/buildR020Explorer.py "/mnt/d/Sync/Python Projects/llm_topology/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3156
~~~

The exporter checks the original measurement hashes, the four structural-partition pins and the four semantic-hypothesis checkpoint hashes. It verifies every semantic evidence record against the corresponding measured community edge. It also verifies community membership, reproduces all intercommunity counts and cosine summaries from the original token edges, and checks the overlap records against the token sets. The output index records source hashes, generated asset hashes and validation status. The raw token archives, which are local to the research checkout, are required for export.

The package under public/llm-topology-r020 contains the derived semantic map, 32 decision summaries, 512 compressed token graphs, a vocabulary file and the export index. The browser loads the compact semantic map first, then fetches raw decision and token evidence only when requested.

## Review checkpoints

- The semantic default contains prompt-related candidate concepts only and contains no punctuation or formatting nodes.
- Every displayed semantic relationship has at least one directly measured community edge and an inspectable evidence record.
- The default contextual view starts at **Connections and crossings**, with four strongest neighbouring concepts available before full-map expansion.
- D06/S00 positive starts with 5 of 14 communities and 10 of 91 connections. Expanding the initial community reveals all 91.
- The peripheral C1–C13 connection has 18 undirected token edges. Its supporting-token view exposes the contributing token IDs and the recorded directed neighbour lists.
- The disruption–reconstruction link C4–C11 has 67 edges at D06/S00 positive. The connections–mathematics link C7–C12 has 74 at D32/S05 positive. These are optional article examples.
- The initial community C1 has seven tokens in common with its recorded D06/S01 match C5. The match opens that network as a separate view.
- Full coverage is 512 distinct networks, 6,944 community instances, 42,291 community connections, 1,419,650 token memberships and 14,196,500 directed token-neighbour records.
