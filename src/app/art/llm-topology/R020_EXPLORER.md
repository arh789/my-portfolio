# R020 measured network explorer

Open **The discovery** in the article at /art/llm-topology#r020-explorer. The default is D06, the decision in which the last input token is "bridge" and Pythia predicts "that". The explorer starts at its positive input embedding and ranks the first community by weighted degree. Four strongest neighbours enter the initial view. Select a community to reveal all its recorded neighbours, or open the full network at once. Community IDs refer to the selected decision, state and sector.

Zooming out simplifies the community labels. Narrow screens also start with compact labels. Zooming in past the community view opens token evidence for the selected node. The token view exposes all members through a searchable picker and each token's ten recorded outgoing neighbours. The supporting-token control on a community connection starts with tokens whose outgoing edges contribute to that connection.

Edge width uses token-edge count divided by the geometric mean of the two community sizes. Node size uses the sum of incident affinities. Structural module colours come from the verified R020 relational partitions. Relative betweenness is calculated on the complete community graph with distances of 1 / affinity and scaled to the maximum within that network. Cross-state and cross-decision matches come from the separate token-overlap export, with shared counts and Jaccard scores.

## Rebuild in WSL

From the website checkout, with the complete local R020 run available:

~~~sh
python3 scripts/buildR020Explorer.py "/mnt/d/Sync/Python Projects/llm_topology/single_prompt_topology/runs/R020_pythia-70m-representation-output-contrast"
npm run build
npm run start -- --hostname 127.0.0.1 --port 3156
~~~

The exporter checks the original measurement hashes and the four structural-partition pins. It verifies community membership, reproduces all intercommunity counts and cosine summaries from the original token edges, and checks the overlap records against the token sets. The output index records source hashes, generated asset hashes and validation status. The raw token archives, which are local to the research checkout, are required for export.

The package under public/llm-topology-r020 contains 32 decision summaries, 512 compressed token graphs, a vocabulary file and the export index. The browser fetches the selected decision summary and fetches the token graph on demand. The package contains private research material. Keep it in the local draft workflow until release of the evidence has been authorised.

## Review checkpoints

- D06/S00 positive starts with 5 of 14 communities and 10 of 91 connections. Expanding the initial community reveals all 91.
- The peripheral C1–C13 connection has 18 undirected token edges. Its supporting-token view exposes the contributing token IDs and the recorded directed neighbour lists.
- The disruption–reconstruction link C4–C11 has 67 edges at D06/S00 positive. The connections–mathematics link C7–C12 has 74 at D32/S05 positive. These are optional article examples.
- The initial community C1 has seven tokens in common with its recorded D06/S01 match C5. The match opens that network as a separate view.
- Full coverage is 512 distinct networks, 6,944 community instances, 42,291 community connections, 1,419,650 token memberships and 14,196,500 directed token-neighbour records.
