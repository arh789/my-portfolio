---
title: "Python for NLP and Semantic SEO: A Practical Reference"
description: "A plain-language companion to the SEO Python codebase, explaining how the workflow uses search-result collection, NLP text processing, keyphrase extraction, embeddings, network analysis, and association rule mining for semantic SEO research."
date: "2026-05-31"
tags:
  - seo
  - data-analysis
  - methodology
  - semantic-structure
  - algorithmic-discovery
  - python
  - nlp
---

# Python for NLP and Semantic SEO: A Practical Reference

> **Source:** [decrepitfilth.art/code](https://decrepitfilth.art/code)  
> **Author:** Andrew Hale  
> **Type:** Jupyter notebook export (rendered as static HTML)  
> **Focus:** Programmatic keyword research, NLP text processing, graph-based topic clustering, and association rule mining for semantic SEO

---

## Overview

This codebase implements a full pipeline for **semantic SEO research using Python**. Starting from a list of seed keywords, it fetches real search results via the Google Custom Search API, scrapes and summarises the top-ranking pages, extracts keywords and keyphrases using transformer models, then applies network analysis and Apriori association mining to surface topic clusters and co-occurring terms.

The pipeline was used to generate an original content strategy for a visual art site — but the techniques apply to any domain where you need to understand what content Google rewards and why.

The pipeline has six logical stages:

1. **Keyword seeding and search result collection**
2. **Web scraping with robots.txt compliance**
3. **Text summarisation (T5 transformer)**
4. **Keyword and keyphrase extraction (KeyBERT + KeyPhraseTransformer)**
5. **Word frequency and network analysis**
6. **Apriori association rule mining**

---

## Dependencies

Install all required packages before running. Key libraries and their roles:

| Library | Role |
|---|---|
| `requests`, `beautifulsoup4`, `lxml` | Web scraping and HTML parsing |
| `nltk` | Tokenisation, POS tagging, stopwords |
| `transformers` | T5 / BART / mT5 / RoBERTa models |
| `sentence-transformers` | Sentence embeddings (MPNet, MiniLM) |
| `keybert` | Semantic keyword extraction |
| `sklearn` | TF-IDF, cosine similarity, vectorisation |
| `mlxtend` | Apriori frequent itemsets and association rules |
| `networkx`, `python-louvain` | Graph construction and community detection |
| `pandas`, `numpy` | Data manipulation |
| `matplotlib` | Visualisation |
| `func_timeout` | Preventing runaway loops |
| `apyori` | Alternative Apriori implementation |
| `ipywidgets` | Interactive column selector (Jupyter) |

```python
# Core imports (abbreviated)
import requests, time, re, gc, string
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
from collections import Counter

import pandas as pd
import numpy as np
from bs4 import BeautifulSoup

import nltk
from nltk.corpus import stopwords, words
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import pos_tag

import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration, AutoTokenizer, MT5ForConditionalGeneration
from sentence_transformers import SentenceTransformer
from keybert import KeyBERT

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from mlxtend.frequent_patterns import apriori, association_rules
import networkx as nx
import community as community_louvain
import matplotlib.pyplot as plt
```

---

## Stage 1 — Keyword Seeding and Search Result Collection

### How it works

A list of seed keywords is defined manually. For each keyword, the **Google Custom Search JSON API** is queried to retrieve the top URLs that Google ranks for that term. Results are stored in a CSV for later scraping.

You will need a Google API key (`API_KEY`) and a Custom Search Engine ID (`SEARCH_ENGINE_ID`).

```python
def get_search_results(keyword, num_results=10):
    search_results = []
    for start_index in range(1, num_results + 1, 10):
        params = {
            'key': API_KEY,
            'cx': SEARCH_ENGINE_ID,
            'q': keyword,
            'start': start_index,
            'num': min(num_results - len(search_results), 10)
        }
        response = requests.get('https://www.googleapis.com/customsearch/v1', params=params)
        data = response.json()
        if 'items' in data:
            for item in data['items']:
                search_results.append(item['link'])
        else:
            break
    return search_results
```

The `start` parameter handles Google's pagination (results are returned in batches of 10). The function breaks early if there are no more results.

### Seed keywords (example domain: dark visual art)

```python
keywords = [
    "Corrupted Folklore Horror Art",
    "Ritualistic Horror and Occult Aesthetics",
    "Dark Occult Surrealism with Gothic Overtones",
    "Pop Surrealism Meets Cosmic Horror",
    "Glitched Nightmare Art and Digital Corruption",
    # ... etc.
]
```

Replace these with keywords relevant to your own domain. Aim for a mix of broad and long-tail terms.

### Collecting and saving results

```python
data = []
for keyword in keywords:
    urls = get_search_results(keyword, num_results=50)
    for url in urls:
        data.append({"Keyword": keyword, "URL": url})

keyword_urls_df = pd.DataFrame(data)
keyword_urls_df.drop_duplicates(inplace=True)
keyword_urls_df.to_csv('keyword_urls.csv', index=False)
```

Deduplication is important — the same URL can rank for multiple keywords.

---

## Stage 2 — Web Scraping with robots.txt Compliance

### Why robots.txt matters

Responsible scraping checks each domain's `robots.txt` before fetching content. The `is_scraping_allowed()` function handles this automatically.

```python
def is_scraping_allowed(url, user_agent='YourCustomUserAgent/1.0', timeout=10):
    parsed_url = urlparse(url)
    robots_url = f"{parsed_url.scheme}://{parsed_url.netloc}/robots.txt"
    rp = RobotFileParser()
    try:
        response = requests.get(robots_url, headers={'User-Agent': user_agent}, timeout=timeout)
        if response.status_code == 200:
            rp.parse(response.text.splitlines())
            return rp.can_fetch(user_agent, url)
        return True  # No robots.txt found — assume allowed
    except Exception:
        return True  # On error — assume allowed
```

### Fetching and parsing page content

For each allowed URL, the scraper fetches the page, enforces a 1 MB content cap to avoid memory issues, then extracts five fields using BeautifulSoup:

- `title` — the `<title>` tag
- `meta_description` — the `<meta name="description">` content
- `content` — all visible text
- `h_tags_text` — text from all heading tags (`h1`–`h6`)
- `image_alt_text` — `alt` attributes from all images

```python
def fetch_url_content(url):
    headers = {'User-Agent': 'YourCustomUserAgent/1.0'}
    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()

    content = response.text
    max_content_size = 1 * 1024 * 1024  # 1 MB cap
    if len(content) > max_content_size:
        return None

    soup = BeautifulSoup(content[:max_content_size], 'lxml')

    return {
        'title': soup.title.string.strip() if soup.title else "",
        'meta_description': (soup.find('meta', {'name': 'description'}) or {}).get('content', '').strip(),
        'content': soup.get_text(separator=' ', strip=True),
        'h_tags_text': [h.get_text(strip=True) for h in soup.find_all(['h1','h2','h3','h4','h5','h6'])],
        'image_alt_text': [img.get('alt', '').strip() for img in soup.find_all('img')]
    }
```

### Filtering non-HTML URLs

After scraping, URLs pointing to PDFs, images, or other file types are filtered out — they don't contain useful textual SEO signals.

```python
excluded_extensions = ['.pdf', '.jpg', '.png', '.docx', '.zip']

def is_proper_webpage(url):
    parsed_url = urlparse(url)
    return not any(parsed_url.path.lower().endswith(ext) for ext in excluded_extensions)

extracted_content_df = extracted_content_df[
    extracted_content_df['url'].apply(is_proper_webpage)
].reset_index(drop=True)
```

---

## Stage 3 — Text Summarisation (T5)

### Why summarise?

Full page content can be hundreds of thousands of tokens — too large for keyword extraction models. Summarisation distils each page to its topically relevant essence before NLP processing.

### Abstractive summarisation with T5-3B

The pipeline uses **T5-3B** (3 billion parameter Text-to-Text Transfer Transformer) for abstractive summarisation. This model generates new sentences rather than extracting existing ones.

```python
TRAINING_DATA = '3b'
tokenizer = T5Tokenizer.from_pretrained(f't5-{TRAINING_DATA}', model_max_length=512, legacy=False)
model = T5ForConditionalGeneration.from_pretrained(f't5-{TRAINING_DATA}')
```

```python
def generate_summary_t5_single_article(article):
    if not article:
        return None
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    inputs = tokenizer.encode(
        "summarize: " + article,
        return_tensors="pt",
        max_length=1024,
        truncation=True
    ).to(device)

    summary_ids = model.generate(
        inputs,
        num_beams=5,
        min_length=0,
        max_length=500,
        length_penalty=1,
        early_stopping=False,
        temperature=1
    )
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

extracted_content_df['summary'] = extracted_content_df.content.apply(generate_summary_t5_single_article)
```

**GPU note:** The pipeline detects CUDA automatically. T5-3B is large — a GPU with at least 16 GB VRAM is recommended for batch processing. Models are deleted from memory with `del model` and `gc.collect()` between stages to avoid OOM errors.

### Extractive summarisation (MiniLM)

A second summariser uses `paraphrase-MiniLM-L6-v2` to extract the most representative *existing* sentences from each page. This is lighter and complementary — it preserves the original vocabulary, which is useful for keyword extraction.

```python
class ExtractiveSummarizer:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-MiniLM-L6-v2', device='cuda')

    def summarize(self, text, n_sentences=50):
        sentences = nltk.tokenize.sent_tokenize(text)
        if not sentences:
            return ""
        sentence_embeddings = self.model.encode(sentences, batch_size=512)
        document_embedding = np.mean(sentence_embeddings, axis=0)
        similarities = cosine_similarity([document_embedding], sentence_embeddings).flatten()
        ranked_indices = similarities.argsort()[::-1]
        return " ".join([sentences[i] for i in ranked_indices[:n_sentences]])
```

The method ranks sentences by their **cosine similarity to the document mean embedding** — sentences most representative of the overall document come first.

---

## Stage 4 — Keyword and Keyphrase Extraction

### KeyBERT (semantic keyword extraction)

**KeyBERT** uses sentence embeddings to find keywords and keyphrases that are semantically close to the document as a whole. It is not frequency-based — it understands meaning.

```python
model = SentenceTransformer('all-MPNet-base-v2', device='cuda')
kw_model = KeyBERT(model=model)

def extract_unique_keywords(text):
    keywords = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1, 15),  # Single words up to 15-word phrases
        stop_words='english',
        top_n=25,
        use_maxsum=False,
        nr_candidates=200
    )
    # Deduplicate individual tokens while preserving relevance order
    df = pd.DataFrame(keywords, columns=['keywords', 'cosine_similarity'])
    df.sort_values(by='cosine_similarity', ascending=False, inplace=True)
    all_words = ' '.join(df['keywords'].apply(lambda x: " ".join(x.split())).tolist()).split()
    seen, unique = set(), []
    for word in all_words:
        if word not in seen:
            seen.add(word)
            unique.append(word)
    return ' '.join(unique)

extracted_content_df['keywords_keybert'] = extracted_content_df.content.apply(extract_unique_keywords)
```

`all-MPNet-base-v2` is a high-quality embedding model; `nr_candidates=200` generates a large candidate pool before selecting the top 25 by semantic relevance.

### KeyPhraseTransformer (T5-based)

A fine-tuned T5 model (`snrspeaks/KeyPhraseTransformer`) is used to extract keyphrases using a generative approach. It processes text in paragraph chunks to stay within the model's token limit.

```python
class KeyPhraseTransformer:
    def __init__(self, model_type="t5", model_name="snrspeaks/KeyPhraseTransformer"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = T5ForConditionalGeneration.from_pretrained(model_name).to(self.device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

    def get_key_phrases(self, text, text_block_size=64):
        paras = self.split_into_paragraphs(text, max_tokens_per_para=text_block_size, tokenizer=self.tokenizer)
        results = [self.predict(self.model, self.tokenizer, para, self.device) for para in paras]
        return ' '.join(self.filter_outputs(self.process_outputs(results), text))
```

The `filter_outputs` method cross-references extracted phrases against both the source document and NLTK's English word list, rejecting hallucinated or garbled output.

### POS-based noun extraction

To further clean keyword fields, a POS tagger filters each text field to retain only **nouns** — the word class most semantically meaningful for SEO topic modelling.

```python
def extract_pos(text):
    tokens = word_tokenize(text.lower())
    tagged = pos_tag(tokens, tagset='universal')
    desired_tags = {'NOUN'}
    filtered = [word for word, tag in tagged if tag in desired_tags and word not in {'s', "'s", ",", ""}]
    cleaned = [re.sub(r'[^\w\s]', '', word) for word in filtered if word.strip()]
    return ' '.join(cleaned)
```

A companion function removes forms of "to be" (is, are, was, were, etc.) which are sometimes mis-tagged as nouns:

```python
def remove_to_be(input_string):
    to_be_forms = {"am", "is", "are", "was", "were", "be", "being", "been"}
    return ' '.join(word for word in input_string.split() if word.lower() not in to_be_forms)
```

These cleaned fields are applied across summaries, meta descriptions, heading tags, image alt text, and full content.

---

## Stage 5 — Word Frequency and Network Analysis

### Word frequency visualisation

A general-purpose function plots the most frequent words from any column in the DataFrame:

```python
def plot_most_common_words(df, column, n=20):
    all_text = ' '.join(df[column].dropna().astype(str).tolist())
    words = re.findall(r'\b[a-zA-Z]{2,}\b', all_text.lower())
    word_counts = Counter(words)
    most_common = word_counts.most_common(n)

    plt.figure(figsize=(25, 8))
    plt.bar(range(len(most_common)), [c for _, c in most_common], color='crimson')
    plt.xticks(range(len(most_common)), [w for w, _ in most_common], rotation=60, ha='right')
    plt.ylabel('Frequency')
    plt.title('Most Common Words')
    plt.show()
```

Run this on cleaned keyword columns to see the dominant vocabulary in your topic space at a glance.

### Network graph of co-occurring terms

The most analytically powerful stage is the **word co-occurrence network**. Each document is treated as a set of nodes (words). Edges are added between every pair of words that appear together in the same document. The resulting graph reveals which terms cluster together across the corpus.

```python
def create_network_plot(text_series, threshold_value, xval, yval):
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(text_series)
    feature_names = vectorizer.get_feature_names_out()
    nodes_list = [
        list(set([feature_names[i] for i in X.getrow(doc_idx).indices]))
        for doc_idx in range(X.shape[0])
    ]

    G = nx.Graph()
    for nodes in nodes_list:
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                G.add_edge(nodes[i], nodes[j])

    # Prune low-centrality nodes
    degree_centrality = nx.degree_centrality(G)
    threshold = np.percentile(list(degree_centrality.values()), threshold_value)
    G.remove_nodes_from([n for n in G.nodes() if degree_centrality[n] < threshold])

    # Detect communities using the Louvain algorithm
    partition = community_louvain.best_partition(G, resolution=1)
    colors = [partition[node] for node in G.nodes()]
    node_sizes = [degree_centrality[node] * 50000 for node in G.nodes()]

    nx.draw_networkx(G, node_size=node_sizes, node_color=colors, edge_color='#d3d3d3',
                     font_size=10, cmap='rainbow')
    plt.show()
```

**Louvain community detection** (`community_louvain.best_partition`) groups the graph into topically coherent clusters — these correspond to semantic subtopics within your keyword space. Each cluster is returned as a DataFrame column with its most frequent terms, annotated with degree centrality scores.

The `threshold_value` parameter (0–100) controls graph pruning: `0` retains all nodes, `90` retains only the top 10% most-connected terms.

---

## Stage 6 — Apriori Association Rule Mining

### What Apriori reveals

Where the network graph shows which terms co-occur, **Apriori** quantifies the strength and direction of those associations. For a given seed keyword, it finds all other terms that consistently appear with it — and measures how much more likely that co-occurrence is than chance.

Three metrics are reported:

| Metric | What it means |
|---|---|
| **Support** | How often the pair appears across all documents |
| **Confidence** | Given the antecedent, how often does the consequent appear? |
| **Lift** | How much more likely is the pair than if terms were independent? Lift > 1 = meaningful association |

### Implementation

The function automatically finds the lowest viable support value within a 10-second window, then generates rules filtered to include the target keyword:

```python
def apriori_analysis(df, column, keyword, min_confidence, min_lift):

    # Subset to rows containing the keyword
    df_filtered = df[df[column].str.contains(keyword, na=False)]

    # One-hot encode the word presence per document
    transactions = df_filtered[column].str.split()
    unique_keywords = set(item for sublist in transactions for item in sublist)
    one_hot_df = pd.DataFrame([
        {word: (word in transaction) for word in unique_keywords}
        for transaction in transactions
    ])

    # Auto-detect minimum support
    # [support-finding loop omitted for brevity — see full source]

    frequent_itemsets = apriori(one_hot_df, min_support=SUPPORT, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)

    # Filter to rules involving the target keyword
    filtered_rules = rules[
        (rules['lift'] >= min_lift) &
        (rules['antecedents'].apply(lambda x: keyword in x) |
         rules['consequents'].apply(lambda x: keyword in x))
    ]

    filtered_rules['associated_words'] = filtered_rules.apply(
        lambda row: ', '.join(sorted(set(row['antecedents']) | set(row['consequents']))), axis=1
    )
    return filtered_rules[['associated_words', 'support', 'confidence', 'lift']]
```

### Example usage

```python
column = 'keywords_keybert'   # or any cleaned keyword column
keyword = 'pop'               # seed term to investigate
min_confidence = 0.1
min_lift = 1.0

results = apriori_analysis(extracted_content_df, column, keyword, min_confidence, min_lift)
results = results.sort_values(by=['lift', 'support'], ascending=False)
results.drop_duplicates(subset=['associated_words'], keep='first', inplace=True)
```

### Filtering by multiple keywords

To find documents where two or more specific terms co-occur:

```python
def subset_by_keywords(df, keywords):
    keywords_set = set(keywords)
    return df[df['associated_words'].map(lambda x: keywords_set <= set(x.split(', ')))]

# Find all rules containing both 'fear' and 'macabre'
filtered_results = subset_by_keywords(results, ['fear', 'macabre'])
```

---

## Data Flow Summary

```
Seed keywords
    → Google Custom Search API       [Stage 1]
    → keyword_urls.csv

keyword_urls.csv
    → robots.txt check               [Stage 2]
    → HTML scraping (title, meta,
      content, headings, alt text)
    → extracted_content_df_initial.csv

extracted_content_df_initial.csv
    → T5-3B abstractive summary      [Stage 3]
    → MiniLM extractive summary

Summaries + full content
    → KeyBERT (MPNet)                [Stage 4]
    → KeyPhraseTransformer (T5)
    → POS noun filtering
    → extracted_content_df.csv

extracted_content_df.csv
    → Word frequency plots           [Stage 5]
    → Co-occurrence network graph
    → Louvain community clusters

Clusters
    → Apriori association mining     [Stage 6]
    → Keyword co-occurrence rules
      (support, confidence, lift)
```

---

## Practical Notes

**Memory management:** Large transformer models (T5-3B, MPNet) consume significant GPU memory. The pipeline deletes each model immediately after use:

```python
del model
gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()
```

Run each modelling stage sequentially, not in parallel, to avoid OOM errors.

**Column selection (Jupyter):** The notebook includes an `ipywidgets` dropdown to select which processed column feeds into the network and Apriori stages. This lets you compare, for example, KeyBERT keywords vs. POS-filtered content vs. heading-tag nouns without changing the analysis code.

**Checkpointing:** The pipeline saves to CSV at multiple points (`keyword_urls.csv`, `extracted_content_df_initial.csv`, `extracted_content_df.csv`). Each stage can be re-run from a checkpoint if a later step fails, avoiding costly re-scraping or re-summarisation.

**robots.txt defaults:** If `robots.txt` is unreachable, the scraper assumes scraping is permitted. You may wish to tighten this behaviour for production use.

---

## Further Reading

- [KeyBERT documentation](https://maartengr.github.io/KeyBERT/)
- [Sentence Transformers (SBERT)](https://www.sbert.net/)
- [Hugging Face: snrspeaks/KeyPhraseTransformer](https://huggingface.co/snrspeaks/KeyPhraseTransformer)
- [mlxtend Apriori reference](http://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/)
- [NetworkX documentation](https://networkx.org/documentation/stable/)
- [python-louvain (community detection)](https://python-louvain.readthedocs.io/)
- [Google Custom Search JSON API](https://developers.google.com/custom-search/v1/overview)
- [Full source code](https://decrepitfilth.art/code) — Andrew Hale

---
