---
title: "TikTok Trend Analysis With Python: A Story About CreepyTok"
description: "How a Python pipeline turns TikTok search results, metadata, captions and transcripts into a reusable ChatGPT handoff for analysing trends and generating new video concepts."
showOutline: true
date: "2026-09-04"
tags:
  - tiktok
  - short-form-video
  - video-index-system
  - semantic-research-pipeline
  - research-methods
  - search-results-to-strategy
  - search-and-discovery-systems
  - creative-search-system
---
This is a story about CreepyTok.

More precisely, it is a story about what happens when a loose TikTok trend space is treated as something that can be collected, structured and handed to ChatGPT for repeatable analysis.

Most creators do not begin from nothing. They begin from a trend, a sound, a hook, an editing pattern, a search result, a repeated format or a cluster of videos that seem to belong together. Then they ask the practical question:

```text
How do I make my own version of this?
```

This project starts there.

It is an agent-run workflow that uses Python to turn a weak creative direction into a structured JSON handoff: TikTok-native search terms, search-visible videos, public metadata, engagement snapshots, downloaded reference files and timestamped speech transcripts. That handoff is the object given to ChatGPT for comparison, clustering, semantic analysis and creative strategy.

The aim is not to explain TikTok as a whole. It is to make trend research faster, more inspectable and more useful for production.

> **Repository:** [github.com/arh789/tiktok-video-research-pipeline](https://github.com/arh789/tiktok-video-research-pipeline)  
> **Proof of concept:** 100 unique videos collected from a `creepy tok` search space  
> **Final product:** an agent-run pipeline that produces ChatGPT-ready JSON handoffs for trend analysis and video concept generation

```text
weak creative intent
    -> TikTok-native search language
        -> bounded video corpus
            -> metadata + captions + transcripts
                -> Codex-prepared JSON handoff
                    -> ChatGPT analysis
                        -> semantic operations
                            -> video concepts
```

## The Creator Problem

TikTok trends are usually used through recognition.

Someone sees a repeated format and understands, quickly, what can be copied:

```text
use this sound
repeat this caption structure
copy this editing rhythm
adapt this meme
perform this hook
join this hashtag
```

That is often enough when the creator already understands the space. It is weaker when the trend is unfamiliar, when the surface is noisy, or when the goal is to produce quickly without merely copying the most obvious example.

The starting problem is:

```text
I need to make videos in a trend space
I do not yet understand well enough to produce in.
```

That is different from asking "what is trending?". The useful question is:

```text
What structure makes this trend usable for new work?
```

This is where the pipeline sits. It does not replace analysis. It creates the structured handoff that makes analysis repeatable.

## Trends As Structures

A trend is not only a visible surface.

```text
surface trend:
    sound
    hashtag
    effect
    meme
    editing template
    repeated phrase

underlying trend structure:
    hook
    premise
    viewer task
    narrative operation
    evidence pattern
    repeatable constraint
```

Most creators copy the surface because the surface is easy to recognise. This pipeline is designed to reconstruct the underlying structure.

That matters because a creator does not need a clone. They need a new version that still belongs to the same recognisable space.

For the broader logic of treating platform results as selected surfaces rather than neutral maps, see [How Search and Recommendation Systems Actually Work](/art/how-search-and-recommendation-systems-actually-work).

## What The Pipeline Is For

The pipeline is a collection, reduction and handoff system.

It starts with:

```text
a weak seed term
```

It produces:

```text
a ChatGPT-ready JSON handoff
```

That handoff enables:

```text
comparison, clustering, semantic analysis and concept generation
```

The distinction matters. The JSON file is critical because it is the interface between the Python pipeline and ChatGPT analysis. It is the structured object ChatGPT is asked to analyse.

The pipeline should make it possible to answer:

```text
What should be made next?
Which trend structures are available?
Which elements are surface carriers?
Which elements are transferable rules?
Which examples should be avoided or treated as weak signals?
What needs direct video inspection before production?
```

## Why Python Matters

Python is the reproducibility layer.

Without code, trend research tends to become a mixture of scrolling, screenshots, memory and taste. Those are useful, but they are slow to carry out and difficult to reproduce. A Python workflow records the path from the first seed term to the final comparison set.

Python makes it possible to preserve:

- which search terms were used
- which suggestions came from which parent terms
- which videos appeared under which searches
- which video IDs were duplicates across searches
- where each video ranked at collection time
- which engagement values were captured
- which files downloaded and validated successfully
- which transcripts were usable, absent or unreliable

## Why This Is Agent-Run

The pipeline is not just a Python script followed by manual interpretation.

It is an agent-run workflow. Codex matters because this task has many small failure points:

- browser automation can break
- TikTok responses can change
- downloads can fail
- metadata fields can be missing
- transcripts can contain ASR artefacts
- duplicate videos can appear across related searches
- output files need to be checked before they are handed to ChatGPT

Codex's role is to operate and maintain the research pipeline:

```text
Codex
    -> inspect the repository
    -> run or modify notebooks and scripts
    -> debug collection and transcription failures
    -> validate output files
    -> summarise schema and missingness
    -> prepare the JSON handoff
    -> package top/bottom video samples
    -> record limitations before analysis begins
```

ChatGPT's role is different:

```text
ChatGPT
    -> receive the JSON handoff
    -> compare groups
    -> cluster semantic content
    -> identify enriched structures
    -> inspect selected videos when needed
    -> infer reusable creative rules
```

The human role is different again:

```text
human researcher
    -> choose the seed direction
    -> decide which discovered terms are relevant
    -> ask the contrastive questions
    -> challenge overreach
    -> decide what becomes production strategy
```

The point is not that an agent magically understands the trend. The point is that Codex can run the collection, checking and packaging work so that ChatGPT receives a coherent object to analyse. You then decide what makes the most sense to carry out. 

## Active Repository Components

| File | Role |
|---|---|
| `tiktok_search_term_discovery.ipynb` | Expands a weak seed term through two nested levels of TikTok suggestions. |
| `tiktok_chatgpt_handoff.ipynb` | Selects terms, requests videos, ranks comparison groups and writes the handoff. |
| `tiktok_video_search.py` | Handles browser collection, metadata extraction, video acquisition and local transcription. |
| `methodology.md` | Defines the contrastive semantic performance-analysis method. |
| `thread_analysis_process.md` | Records how the analytical process developed. |
| `examples/creepy_tok_100_manifest.csv` | Public manifest from the 100-video proof of concept. |

The repository includes code, documentation and a public example manifest. It deliberately excludes downloaded videos, credentials, browser profiles, complete transcripts and private raw outputs.

## The Research Flow

```text
weak seed term
    |
    v
two-level TikTok search-term discovery
    |
    v
human selection of relevant TikTok-native terms
    |
    v
bounded search-result collection
    |
    +--> canonical URLs and public metadata
    +--> locally downloaded reference videos
    +--> local Faster-Whisper transcripts
    |
    v
deduplicated corpus and engagement snapshot
    |
    +--> top group by captured views
    +--> bottom group by captured views
    `--> one structured handoff JSON
    |
    v
trend and semantic-operation analysis
    |
    +--> topic and format map
    +--> hook and premise map
    +--> strict difference analysis
    +--> relaxed enrichment analysis
    +--> direct video audit where needed
    |
    v
production strategy
    |
    +--> generative rules
    +--> production constraints
    +--> video concepts
    `--> next test collection
```

This is an extension of the broader [research pipeline](/art/research-pipeline): collect an external visibility surface, reduce it into structured records, then pass those records into analysis.

## Stage 1: TikTok-Native Search Language

A weak seed term is only the researcher's first guess.

```text
creepy tok
```

That phrase is useful because it opens the door. It does not prove that it is the language TikTok users, creators or search systems use around the subject.

The first notebook expands the seed through TikTok's web autocomplete. One request expands the seed. Each retained first-layer term receives one further request. The output preserves both a compact layer view and the full branch structure.

The branch structure matters because a flat keyword list hides lineage.

```json
{
  "search_term": "creepy tok",
  "expansion_layers": 2,
  "layers": {
    "1": ["first-layer term"],
    "2": ["globally unique second-layer term"]
  },
  "branches": [
    {
      "first_order_term": "first-layer term",
      "second_layer": [
        {
          "term": "second-layer term",
          "parent": "first-layer term",
          "query_path": "creepy tok > first-layer term > second-layer term"
        }
      ]
    }
  ]
}
```

If the same suggestion appears under several parents, that repetition may itself be meaningful. It can suggest that the term sits near the centre of the visible trend space.

The endpoint is undocumented and can change. The browser remains visible so login or verification challenges can be completed manually; the workflow does not depend on automated password submission.

Human review stays deliberately simple:

- `analyse_videos`
- `exclude`
- `uncertain`

This is where the intended trend space is defined before videos are collected.

## Stage 2: Video Collection

Selected terms are passed to `tiktok_video_search.py`.

The collector uses the established browser session, gathers surfaced video results, resolves canonical URLs, deduplicates by video ID and enriches each record with available public metadata.

```powershell
python tiktok_video_search.py "creepy tok" `
  --related-query "creepy tiktoks" `
  --related-query "creepy tok storytime" `
  --related-query "creepypasta tok" `
  --related-query "creepy tok skit" `
  --limit 100 `
  --output outputs/creepy_tok_100_metadata.csv `
  --analyze-videos `
  --analysis-output outputs/creepy_tok_100_transcript.jsonl `
  --video-dir data/videos `
  --local-vision-limit 0
```

The collector records:

- search term, rank and repeated appearances across queries
- canonical TikTok URL and video ID
- creator, caption, hashtags and publication time
- views, likes, comments, shares and saves at collection time
- available music title and author metadata
- local filename, checksum, byte size, duration, dimensions, frame rate and codecs

`--local-vision-limit 0` is intentional in the active workflow. Bulk local vision interpretation is expensive, and it can blur the line between collection evidence and later interpretation. The pipeline prepares evidence first. Direct video analysis happens later, on selected samples.

This is close to the earlier move from [search-result structure into strategy](/art/semantic-seo-in-python-from-search-results-to-original-content-strategy), except the medium is now short-form video rather than web pages.

## Stage 3: Media Validation And Public Metadata

Downloaded videos are archival research references and direct-analysis inputs. They are not the public output of the project.

The public-facing evidence is the manifest and the handoff structure: stable video IDs, URLs, search appearances, engagement snapshots, duration and technical validation. This lets the analysis refer to concrete records without redistributing third-party media.

The collector is designed to retain enough information to ask later questions:

```text
Was this video visible under one search term or several?
Was it a top result or a deep result?
Was the high-view video old enough to have accumulated views over time?
Was the transcript usable?
Was the media file valid?
```

These questions matter because engagement metrics are snapshots. They can define comparison groups, but they cannot explain performance by themselves.

## Stage 4: Faster-Whisper Transcription

The workflow uses Faster-Whisper locally. Speech is stored as both complete transcript text and timestamped segments.

This makes the videos partially available to text-based analysis. That is valuable because many TikTok formats are language-led:

- storytime
- testimony
- analysis clips
- direct-address hooks
- warnings
- lists
- narrated evidence

The pipeline distinguishes usable speech from missing or unreliable recognition.

```python
GENERIC_ASR_PHRASES = {
    "thank you",
    "thank you for watching",
    "thanks for watching",
}
```

The handoff notebook normalises transcript status:

```python
def cleaned_transcription(record: dict) -> dict:
    source = record.get("transcription") or {}
    status = str(source.get("transcription_status") or "unavailable")
    quality = str(source.get("quality_status") or "unreviewed")
    raw_text = " ".join(str(source.get("transcript") or "").split())

    usable = (
        status == "ok"
        and quality != "suspected_hallucination"
        and bool(raw_text)
    )

    if status == "no_audio":
        effective_status = "no_audio_stream"
    elif quality == "suspected_hallucination":
        effective_status = "suspected_asr_hallucination"
    elif status == "ok" and not raw_text:
        effective_status = "no_speech_detected"
    elif usable:
        effective_status = "usable_transcript"
    else:
        effective_status = status

    return {
        "status": effective_status,
        "usable_for_language_analysis": usable,
        "transcript": raw_text if usable else "",
        "discarded_asr_text": raw_text if raw_text and not usable else "",
    }
```

This prevents generic recognition artefacts such as `Thank you.` from being treated as evidence of a video's spoken premise.

A transcript is not a description of the complete soundtrack. It does not reliably capture music identity, transient sound effects, silence, vocal affect or audiovisual synchronisation. For that reason, transcript analysis remains one evidence layer rather than the whole analysis. For the related NLP side of this work, see [Python for NLP and Semantic SEO](/art/python-nlp-semantic-seo).

## Stage 5: Top And Bottom Comparison Groups

The handoff notebook joins metadata and transcripts, merges repeated search appearances and writes one structured JSON file. It then ranks videos by captured view count and prepares comparison folders.

```python
ranked_by_views = sorted(
    [
        video for video in videos
        if video["engagement_at_collection"]["views"] is not None
    ],
    key=lambda video: (
        video["engagement_at_collection"]["views"],
        video["video_id"],
    ),
)

if len(ranked_by_views) < TOP_BOTTOM_N:
    raise RuntimeError(
        f"Only {len(ranked_by_views)} videos have view counts; "
        f"{TOP_BOTTOM_N} are required."
    )

bottom_videos = ranked_by_views[:TOP_BOTTOM_N]
top_videos = list(reversed(ranked_by_views[-TOP_BOTTOM_N:]))
```

The output is designed for handoff:

```text
outputs/chatgpt_handoffs/<run_label>_handoff.json

data/videos/<run_label>_top_10_by_views/
    selected MP4 files

data/videos/<run_label>_bottom_10_by_views/
    selected MP4 files
```

Ten is a practical batch size, not a statistical law. The complete corpus remains available in the JSON. The top and bottom folders make direct inspection manageable.

The groups are not quality judgements. They are contrast sets.

## Proof Of Concept: 100 CreepyTok Videos

The reference run reached 100 unique videos using five contributing searches. The direct seed page exposed only 24 distinct videos, so related-query expansion was needed.

| Output | Result |
|---|---:|
| Search, metadata and detail enrichment | approximately 5 min 37 sec |
| Download | 100 of 100 videos in approximately 7 min 57 sec |
| Downloaded media | approximately 612 MB |
| Media duration | approximately 120.8 min |
| Local Faster-Whisper transcription | approximately 3 min 35 sec |
| Usable transcripts | 57 videos |
| No speech detected | 23 videos |
| No audio stream | 19 videos |
| Suspected ASR hallucination | 1 video |

This result matters because it shows that a trend-adjacent corpus can be prepared quickly enough to support creative turnaround.

It does not prove which features caused high views.

The public manifest, `examples/creepy_tok_100_manifest.csv`, preserves URLs, search appearances, engagement snapshots and technical duration. It excludes captions, transcripts and downloaded third-party media.

## From JSON Handoff To Conclusion

Once the corpus exists, the analysis changes shape.

The JSON handoff gives ChatGPT the shared object: the records, the fields, the view counts, the transcripts, the search lineage and the comparison labels. The conclusion is then produced through a sequence of questions, not through a single prompt asking what performed well.

The weak question is:

```text
What are the high-view videos about?
```

That question is not useless, but it usually stops too early. Topic is only one layer of a trend.

The stronger question is:

```text
What do the high-view videos make the viewer do?
```

The actual ChatGPT analysis moved through this sequence:

| Order | Question / Move | What It Tested | What It Changed |
|---:|---|---|---|
| 1 | Cluster engagement data | Whether the view distribution had a meaningful upper tail | Established the top group as an analytical target rather than a hand-picked set |
| 2 | What columns are available? | What the JSON actually contains | Separated engagement, search, creator, caption, transcript, hook, visual and provenance fields |
| 3 | Which columns reveal actual content? | Which fields can support semantic analysis | Identified caption, transcript, hook, visual premise, spoken premise, on-screen text and distinctive features as content-bearing |
| 4 | What is in the target group that is not in the others? | Strict uniqueness | Showed that absolute uniqueness was too narrow |
| 5 | What changes if "is not" is loosened? | Enrichment rather than uniqueness | Exposed concentration: ordinary scene, anomaly, reclassification and unresolved implication |
| 6 | What nodes hold the semantic space? | Whether the top group had recurring semantic attractors | Produced nodes such as evidence, mimicry, domestic intrusion, false normality and rewatchable anomaly |
| 7 | Which instances are most central? | Whether the nodes were tied to concrete evidence | Mapped abstract nodes back to phrases, premises, hooks and video examples |
| 8 | What structure forms when all instances are clustered? | Whether instance-level clustering supported the node map | Refined the hand-built nodes into clearer groupings and bridges |
| 9 | Does a temporal sequence emerge? | Whether the pattern was sequential rather than merely categorical | Identified a progression from normal setup to anomaly to reclassification |
| 10 | What generative rules can be inferred? | Whether repeated structures could guide production | Converted description into reusable video-making rules |
| 11 | What do the actual videos add? | What JSON could not show reliably | Added pacing, shot grammar, visual restraint, delayed legibility and withheld reveal |
| 12 | What are the invariants? | Which claims held strictly across the series | Separated true invariants from dominant tendencies and earlier overreach |
| 13 | What clearly separates top from bottom? | Whether the pattern had contrastive force | Clarified that lower-view examples more often declared creepiness while top examples made it emerge |
| 14 | Semantically cluster all 100 videos | Whether the finding was topic-based | Showed that top videos were not concentrated in one subject cluster |
| 15 | Did clustering relate to top or bottom performance? | Whether semantic clusters explained view count | Confirmed that cluster membership alone was insufficient; the stronger signal was cross-cluster operation |

In compressed form:

```text
engagement outliers
    -> content-bearing field audit
        -> strict target/comparison contrast
            -> relaxed enrichment contrast
                -> semantic node extraction
                    -> instance-level testing
                        -> temporal sequence detection
                            -> generative rule induction
                                -> direct-video audit
                                    -> whole-corpus validation
```

This is the shift from surface trend to usable trend structure.

## The Conclusion Reached

The ChatGPT analysis did reach a conclusion.

It was not:

```text
CreepyTok videos are about one specific topic.
```

It was:

```text
In this CreepyTok corpus, the strongest reusable signal was a cross-topic viewer operation:

ordinary scene
    -> directed attention
        -> anomalous detail
            -> reclassification
                -> unresolved implication
```

More plainly, the stronger videos did not simply show creepy material. They made the viewer realise that an ordinary-looking scene had to be reinterpreted because of one wrong detail.

That conclusion survived three checks:

1. It appeared when the analysis moved from strict uniqueness to enrichment.
2. It remained visible when smaller content instances were clustered, not only whole videos.
3. It was not explained by topic clustering alone, because the top videos were spread across multiple subject clusters.

Direct video inspection did not create the conclusion. It sharpened it by adding execution-level information that the JSON could not show reliably: delayed legibility, visual restraint, pacing, shot grammar and withheld reveal.

Surface imitation would say:

```text
make a creepy video
```

The production rule that came out of the analysis was:

```text
make the viewer inspect an ordinary scene
until the scene reclassifies itself
```

That is the kind of conclusion the pipeline is designed to make reachable.


## What The CreepyTok Analysis Found

The highest-view videos were not united by one subject. They did not all belong to the same semantic cluster, use the same format, or depend on the same monster, story type or hashtag.

The shared structure was functional:

```text
human-centred scene + immediate frame + anomaly + partial evidence -> reclassification
```

The strongest pattern was not "make something creepy". It was:

```text
make the viewer reclassify what they are looking at
```

Everest bodies, HANI, the human-skin bag, the mimic, the skinwalker footage and the woman with the apple are different topics. What links them is that each turns a legible object into evidence of something else.

### Finding 1: Topic Did Not Explain The Top Group

The top 10 videos were spread across six semantic clusters. The bottom 10 were spread across five. That means cluster membership alone did not separate high and low performance.

The important distinction was not:

```text
this topic performs
```

It was:

```text
this operation appears across multiple topics
```

### Finding 2: The Top Group Favoured Reclassification

The top videos repeatedly made something change status:

| First status | Reclassified status |
|---|---|
| corpse | route marker |
| school bag | human-skin object |
| AI | biological entity |
| roommate voice | mimic evidence |
| ordinary woman | possible non-human presence |
| apple scene | implied threat |

The repeated payoff was not simply fear. It was a change in what the viewer thought they were seeing.

### Finding 3: The Bottom Group Declared Horror More Often

The bottom videos more often began from the label:

```text
horror / creepy / scary -> scary fragment
```

The top videos more often created an interpretive task:

```text
ordinary or ambiguous scene -> wrong detail -> new meaning
```

That is the useful contrast.

### Finding 4: The Video Files Refined The JSON Finding

The JSON identified the semantic pattern. Direct video inspection clarified the execution.

The important correction was that the anomaly was not always hidden until late. In many top videos, the anomaly appeared early. What was delayed was its meaning.

So the stronger formula became:

```text
immediate frame -> sustained object -> guided inspection -> delayed reinterpretation
```

### Finding 5: The Production Rule

The practical finding is:

```text
make something reclassifiable
```

Not:

```text
make a creepy video
```

A usable CreepyTok concept should therefore:

1. start with a socially readable scene
2. give the viewer one wrong detail
3. frame attention immediately
4. make text and image depend on each other
5. reclassify the object, person or scene
6. leave enough unresolved for replay, comments or argument

## What The Pattern Looks Like

In the `creepy tok` proof of concept, the high-view videos were not concentrated in one topic cluster.

The pattern cut across topics:

```text
ordinary or easily recognised scene
    -> attention directed towards a fragment of evidence
        -> anomalous detail becomes legible
            -> the scene must be reinterpreted
                -> the threat remains incompletely resolved
```

That is not simply a topic. It is a transferable operation.

## What The Pipeline Produces

The final product of the repository is the usable pipeline.

The key output of each run is the ChatGPT-ready JSON handoff. That handoff is the working interface between collection and analysis.

```text
trend surface
    -> Codex-run Python pipeline
        -> JSON handoff
            -> ChatGPT analysis
                -> production strategy
                    -> production concepts
```

A useful JSON handoff contains the material ChatGPT needs to analyse:

1. **Run Context**  
   Seed term, selected search terms, run label, collection time and analysis boundary.

2. **Search Lineage**  
   Discovered suggestions, retained branches, rejected branches and parent-child term paths.

3. **Video Records**  
   Video IDs, URLs, creators, publication time, search appearances and local filenames.

4. **Engagement Snapshot**  
   Views, likes, comments, shares and saves captured at collection time.

5. **Content-Bearing Fields**  
   Captions, hashtags, transcript text, timestamped transcript segments and available music metadata.

6. **Transcript Status**  
   Usable speech, no speech, no audio stream, suspected ASR artefact or unavailable transcription.

7. **Technical Validation**  
   Duration, dimensions, frame rate, codec, file size and checksum.

8. **Comparison Labels**  
   Top group, bottom group and wider comparison group membership.

9. **Limitations And Missingness**  
   Missing fields, weak transcript coverage, unavailable media, ambiguous records and known collection limits.

The content map, trend mechanics, semantic operations, generative rules, production concepts and validation plan are downstream outputs. ChatGPT derives them from the handoff; they are not assumed by the pipeline.

## Why This Differs From Ordinary Trend Use

Ordinary trend use often starts with recognition:

```text
I have seen this format before.
I can make my own version.
```

This pipeline starts with reconstruction:

```text
What search-visible structure produces this format space?
Which elements are surface carriers?
Which elements are transferable rules?
Which elements are weak, generic or incidental?
```

That difference matters when speed and unfamiliarity are both present. If a creator already lives inside a trend, they may not need this pipeline. If they are entering a new niche, pitching unfamiliar subject matter, or trying to understand a format quickly, they need more than scrolling.

They need a way to turn visible platform behaviour into a production map.

## Boundaries

This workflow supports creative research, not statistical trend measurement.

It does not claim to:

- measure TikTok as a whole
- explain the recommendation system
- infer causality from view counts
- replace direct visual analysis
- redistribute downloaded third-party videos

It does support:

- repeatable collection from a defined search surface
- public metadata capture
- local transcript extraction
- duplicate-aware corpus construction
- top and bottom comparison sampling
- structured handoff to ChatGPT, human or multimodal analysis
- faster creative strategy in unfamiliar trend spaces

The distinction is the point. The pipeline creates the structured object that lets ChatGPT analyse a corpus rather than a vague set of examples.

## Run The Pipeline

The complete notebooks, collector and methodology are available in the public repository:

**[github.com/arh789/tiktok-video-research-pipeline](https://github.com/arh789/tiktok-video-research-pipeline)**

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
jupyter lab
```

Basic run order:

1. Open `tiktok_search_term_discovery.ipynb`.
2. Set the seed term.
3. Review the nested search-term output.
4. Mark useful branches as `analyse_videos`, `exclude` or `uncertain`.
5. Open `tiktok_chatgpt_handoff.ipynb`.
6. Set `SELECTED_SEARCH_TERMS`, `VIDEOS_PER_TERM`, `TOP_BOTTOM_N` and `RUN_LABEL`.
7. Run the notebook to collect, transcribe, rank and package the corpus.
8. Give the handoff JSON and selected video samples to ChatGPT for analysis.

Example configuration:

```python
SELECTED_SEARCH_TERMS = ["creepy tok"]
VIDEOS_PER_TERM = 20
TOP_BOTTOM_N = 10
RUN_COLLECTION = True
RUN_LABEL = "creepy_tok_test"
```

## Responsible Use

- Use the collector only where authorised and in line with applicable rules and law.
- Keep credentials, cookies and browser profiles outside Git.
- Do not redistribute downloaded third-party videos without permission.
- Treat engagement as time-dependent metadata, not a causal explanation.
- Expect browser automation to require maintenance when TikTok changes its interface.

This project is independent and is not affiliated with or endorsed by TikTok.

## Connection To The Wider Research System

This project extends the site's broader research system into short-form video.

It is adjacent to the [Semantic SEO Lab](/semantic-seo-lab), where code, graph analysis, transformer embeddings and supervised interpretation are used to test whether a representation is meaningful enough to guide content strategy.

The medium changes from search-result pages to TikTok videos, but the structural move remains recognisable: collect an external visibility surface, reduce it into structured records, then pass those records into supervised analysis.

## Conclusion

The pipeline exists because trends are not only things to copy. They are structures that can be decomposed.

Most creators use trends by recognising a surface format and making their own version. This workflow makes that process more explicit. It starts with a weak creative intent, discovers the platform language around it, collects a bounded corpus, builds comparison groups and produces a JSON handoff that ChatGPT can analyse.

The practical end point is still a better next video: one built from an understood trend structure rather than a copied surface.

In this CreepyTok run, the conclusion was that the useful structure was not a single topic. It was a viewer operation: make the viewer inspect an ordinary scene until the scene reclassifies itself.

The reusable product is the agent-run pipeline that can keep producing the JSON handoff needed to reach that kind of conclusion again.

