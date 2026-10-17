import Link from "next/link";
import ProjectPathway from "../components/ProjectPathway.js";
import { readArticles } from "../lib/readArticles.js";
import {
    buildProjectIndex,
    findArticleProjectMemberships,
} from "../lib/projectData.js";
import "../art.css";
import DanJohnDashboard from "./DanJohnDashboard";
import styles from "./page.module.css";

export const metadata = {
    title: "Dan John YouTube Playlist Semantic Network Analysis",
    description:
        "What 382 Dan John strength-coaching transcripts reveal about the recurring decisions behind his programmes, with source-linked evidence, interactive network analysis and reproducible code.",
    authors: [{ name: "Andrew Hale" }],
    keywords: [
        "Dan John strength coach",
        "Dan John YouTube playlist",
        "semantic network analysis",
        "YouTube transcript analysis",
        "strength training analysis",
        "Python network analysis",
        "Easy Strength",
        "kettlebell training",
    ],
    alternates: {
        canonical: "/art/dan-john-youtube-playlist-semantic-network-analysis",
    },
    openGraph: {
        title: "Dan John YouTube Playlist Semantic Network Analysis",
        description:
            "The recurring programme-design decisions made visible across 382 Dan John videos.",
        type: "article",
        publishedTime: "2026-10-13",
        modifiedTime: "2026-10-17",
        authors: ["Andrew Hale"],
        url: "/art/dan-john-youtube-playlist-semantic-network-analysis",
    },
};

const stats = [
    ["382", "analysed videos"],
    ["18,254", "extracted labels after basic normalisation"],
    ["115", "analysis-group objects"],
    ["7,342", "objects through second order"],
    ["5", "representative videos"],
];

const sectionIds = Object.freeze({
    question: "question",
    findings: "findings",
    interpretation: "interpretation",
    watch: "watch",
    explore: "explore",
    code: "code",
    method: "method",
    artefacts: "artefacts",
    limitations: "limitations",
});

const contents = [
    ["Question", sectionIds.question],
    ["Core discovery", sectionIds.findings],
    ["Training structures", sectionIds.interpretation],
    ["Five videos", sectionIds.watch],
    ["Explore evidence", sectionIds.explore],
    ["Code", sectionIds.code],
    ["Method", sectionIds.method],
    ["Artefacts", sectionIds.artefacts],
    ["Limits", sectionIds.limitations],
];

const studyRecord = [
    ["Extraction record", "V1.1 source-linked object–relation JSON records produced directly from downloaded transcripts with Codex 5.6 Sol at extra-high reasoning"],
    ["Responsibilities", "Codex extracted candidate objects and relations; Python aggregated frequencies and pairs; human analysis defined the question, thresholds, interpretation and return to sources"],
];

const methodFlow = `Large unstructured corpus
    ↓
Acquire and preserve sources
    ↓
Extract objects and relations
    ↓
Count recurring objects
    ↓
Identify persistent object pairs
    ↓
Construct relational neighbourhoods
    ↓
Recognise larger structures
    ↓
Return to individual sources for interpretation`;

const analysisProgression = `Playlist
    ↓
Transcripts
    ↓
Per-video objects and relations
    ↓
Corpus-wide object frequencies
    ↓
Repeated object pairs
    ↓
Relation network
    ↓
Exercise and program structures
    ↓
Implicit program-design methodology
    ↓
Minimum representative video set`;

const researchEras = [
    {
        name: "Collection era",
        description: "The project treated each video as a document to preserve and interpret. This established provenance and produced the raw object–relation records, while rich per-video analysis repeatedly exceeded what the corpus-level question required.",
    },
    {
        name: "Structural-analysis era",
        description: "The unit of analysis changed from the individual transcript to the complete usable corpus. Frequency established recurrence, object pairs exposed persistent associations, and graph distance supplied first- and second-order context.",
    },
    {
        name: "Interpretive-synthesis era",
        description: "The work moved from repeated objects to what their relations implied: exercise systems, a programme-generating grammar, and a minimum set of source videos covering the selected framework.",
    },
];

const networkTopics = [
    ["Kettlebell practice and Rite of Passage", "kettlebell swing, clean and press, kettlebell snatch, Pavel Tsatsouline, Rite of Passage"],
    ["Easy Strength and general strength development", "Easy Strength, strength, pull-up, overhead press, repetitions in reserve"],
    ["Loaded carries and trunk/hip strength", "loaded carry, suitcase carry, waiter walk, bear-hug carry, hip thrust, Stuart McGill"],
    ["Swing challenges and work capacity", "10,000 Swing Challenge, 500 daily swings, loaded carries, grip strength, work capacity"],
    ["Fat loss and recovery", "Easy Strength for Fat Loss, walking, fat loss, protein, sleep, recovery, body composition"],
    ["Original Strength and mobility resets", "Original Strength, Tim Anderson, neck nod, six-point rock, mobility, Humane Burpee"],
    ["Southwood program", "power clean, military press, front squat, bench press, Southwood program"],
    ["Repetition schemes and transformation programs", "three sets of eight, three sets of five, one-minute rest, transformation program"],
    ["Armor Building Complex", "double-kettlebell clean, front squat and press, Armor Building Complex"],
    ["Mass Made Simple", "high-repetition squat, barbell complex, muscle mass, Mass Made Simple"],
    ["Basic nutrition", "health, nutrition, vegetable"],
];

const networkHubs = [
    ["armor building complex", "78"],
    ["kettlebell swing", "44"],
    ["easy strength", "40"],
    ["southwood program", "34"],
    ["rite of passage", "32"],
];

const networkBridges = [
    "kettlebell swing",
    "easy strength",
    "armor building complex",
    "humane burpee",
    "goblet squat",
    "overhead squat",
    "armor building formula",
    "easy strength for fat loss",
];

const optimisationPoints = [
    "Strength and power that transfer to real activities.",
    "Repeatable training that can be sustained over time.",
    "Adequate—not maximal—training volume.",
    "Progress without undermining recovery.",
    "Simple exercise selection and program structure.",
    "Broad physical competence: strength, mobility, work capacity and body composition.",
    "Adjusting the program to the trainee’s immediate goal.",
];

const exerciseStats = [
    ["124", "relation instances"],
    ["58", "distinct exercise pairs"],
    ["38", "exercises with a direct exercise relation"],
    ["19", "exercises retained at pair frequency ≥3"],
];

const exerciseGroups = [
    {
        name: "Squat, swing and Humane Burpee group",
        relationType: "Squat: progression and substitution · Swing: regression, preparation and substitution · Humane Burpee: composition",
        description: "The dominant group contains three overlapping structures. The Humane Burpee connects the squat and swing systems by combining the goblet squat, kettlebell swing and push-up.",
        diagram: `Squat progression
back squat ─9─ front squat
front squat ─5─ overhead squat
goblet squat ─6─ overhead squat

Swing progression
glute bridge ─3─ hip thrust ─6─ kettlebell swing
                              ├─6─ Bulgarian goat-bag swing
                              └─4─ kettlebell snatch

Humane Burpee combination
                  push-up
                    │ 8
goblet squat ─6─ humane burpee ─6─ kettlebell swing`,
    },
    {
        name: "Pressing progression",
        relationType: "Load progression and variation",
        description: "The push press follows, progressively replaces or permits greater loading than the strict press.",
        diagram: "strict press ─4─ push press",
    },
    {
        name: "Clean variations",
        relationType: "Substitution and suitability",
        description: "The clean and press and clean and jerk are discussed as alternatives with different suitability and purposes.",
        diagram: "clean and press ─3─ clean and jerk",
    },
    {
        name: "Get-up progression",
        relationType: "Assessment and unloaded variation",
        description: "The naked get-up is consistently treated as an unloaded or assessment version of the Turkish get-up.",
        diagram: "naked get-up ─3─ Turkish get-up",
    },
    {
        name: "Carry and trunk relationship",
        relationType: "Functional equivalence",
        description: "The suitcase carry is repeatedly described as functioning like a moving plank.",
        diagram: "moving plank ─3─ suitcase carry",
    },
];

const frequencyTwoRelations = [
    ["Bench press ↔ military press", "Comparison: historical displacement and relative strength levels, not a programme combination."],
    ["Swimming ↔ walking", "Interchangeable or alternating conditioning and recovery activities."],
    ["Farmer walk ↔ moving plank", "Functional analogy: the farmer walk is also characterised as a moving plank."],
    ["Power clean → front squat", "Exercise sequencing: the power clean precedes the front squat."],
    ["Clean and jerk → front squat", "Exercise sequencing: the front squat follows the clean and jerk."],
    ["Glute bridge → kettlebell swing", "Explicit regression, reinforcing the swing-teaching sequence."],
];

const relationCategories = [
    "Progression / regression",
    "Substitution",
    "Program composition",
    "Exercise sequencing",
    "Functional equivalence",
    "Comparison",
];

const singularPluralPairs = [
    ["loaded carry / loaded carries", "7.1%"],
    ["Olympic lift / Olympic lifts", "5.4%"],
    ["hill sprint / hill sprints", "0%"],
    ["vegetable / vegetables", "3.4%"],
];

const reverseStages = [
    ["Exercise relation groups", "The practical structure: squat, hinge/swing, press, get-up and carry/trunk work"],
    ["Exercise list", "The available variations for filling those movement roles"],
    ["Implicit methodology", "Why those exercises are organised this way"],
    ["Recurring programs and communities", "Examples of the framework applied to different goals"],
    ["Frequency and relation analysis", "Evidence that the structure recurs across the corpus"],
    ["Extraction experiments", "How that evidence was obtained and its limitations"],
];

const programmeArchitecture = `Physical training
├── Squat
│   └── choose an appropriate variation or progression
├── Hinge and ballistic work
│   └── regress through bridge, hip thrust or goat-bag swing
│       before progressing toward swings and snatches
├── Press
│   └── move between strict and push-press variations
├── Get-up
│   └── assess unloaded before adding load
├── Loaded carry and trunk work
└── Simple combinations
    └── example: Humane Burpee
        ├── goblet squat
        ├── kettlebell swing
        └── push-up`;

const programSteps = [
    "Choose the objective",
    "Select fundamental movement categories",
    "Choose suitable variations",
    "Apply progressions, regressions or substitutions",
    "Combine and dose them simply",
    "Preserve recovery and repeatability",
];

const videos = [
    {
        id: "Ma57khCANFw",
        title:
            "Kettlebell Swings, WTH Effect, Easy Strength, Armor Building, 65+ Training & More | DJU Podcast #217",
        role: "Best single overview",
        description:
            "Covers Easy Strength, recovery, kettlebell and Olympic-lift integration, Armor Building Complex, Humane Burpees, get-ups, snatches and carries. It also provides an alternating programme and argues for selecting the most important tools rather than using everything.",
    },
    {
        id: "8A6ldL37nEE",
        title:
            "Armor Building Complex, Kettlebell Weights, Easy Strength & Balancing Training | DJU Podcast #248",
        role: "Progression and programme balance",
        description:
            "Explains progression as more than adding load, including the route from glute bridge through hip thrust and rack deadlift to swings and Olympic lifts. It also covers pressing progressions, clean-and-press variations and front squats.",
    },
    {
        id: "XUJvXpKQQKA",
        title:
            "Steve Maxwell, Worst Exercises, Squats, Bodyweight Training, Kettlebells & More | DJU Podcast 197",
        role: "The squat-teaching sequence",
        description:
            "Provides the clearest explicit progression from goblet squat to overhead squat, front squat and back squat, including the reason for teaching them in that order.",
    },
    {
        id: "FCGYlYgZTfI",
        title:
            "The Dan John Podcast - Ep 35 | Single Leg Training, Deadlift Height, My Favorite Exercise",
        role: "Loaded carries and trunk training",
        description:
            "Supplies the loaded-carry rationale: loaded carries operate as moving planks, and the suitcase carry functions as a single-arm farmer walk.",
    },
    {
        id: "wvsT6OvDIMA",
        title:
            "Turkish Get-Ups, Easy Strength, Mass Made Simple, Mobility, Fat Loss & More | DJU Podcast #234",
        role: "Get-ups and goal-specific application",
        description:
            "Shows how the get-up can be decomposed, assessed and performed unloaded, while connecting Easy Strength, Mass Made Simple, mobility and fat-loss work.",
    },
];

const coverageRows = [
    ["1", "4 of 22", "2 of 7"],
    ["2", "7 of 22", "4 of 7"],
    ["3", "10 of 22", "5 of 7"],
    ["4", "12 of 22", "6 of 7"],
    ["5", "13 of 22", "7 of 7"],
];

const epochs = [
    {
        number: "01",
        name: "Corpus acquisition",
        question: "What videos exist, and can their transcripts be obtained?",
        detail:
            "The playlist was inspected, a dedicated project directory was created, transcripts were downloaded, and collection failures were checked.",
    },
    {
        number: "02",
        name: "Record definition",
        question: "What should be stored for each video?",
        detail:
            "The proposed record included URL, official title, alternative title, summary, transcript, semantic map, objects and relations. Repeated discussion exposed where premature database and ontology design was overreaching.",
    },
    {
        number: "03",
        name: "Rich-analysis experiment",
        question: "Can each video immediately be interpreted in depth?",
        detail:
            "Initial records attempted titles, summaries, semantic maps, objects and relations. The summaries were sometimes useful, but the process was slow and produced more interpretation than the developing analysis required.",
    },
    {
        number: "04",
        name: "Model comparison",
        question: "Could API models perform equivalent extraction faster?",
        detail:
            "GPT-4.1 and GPT-4.1 mini were tested against the original Codex 5.6 Sol work, run with extra-high reasoning. GPT-4.1 mini was rejected as unsuitable. GPT-4.1 produced useful relations but required pruning.",
    },
    {
        number: "05",
        name: "Minimal collection specification",
        question: "What is the smallest useful extraction task?",
        detail:
            "The task was reduced to official title, objects and relations. Attempts to make the API analyse, prune or construct higher-order relations were identified as unnecessary scope inflation.",
    },
    {
        number: "06",
        name: "Corpus-scale direct extraction",
        question: "Can the entire corpus be processed consistently?",
        detail:
            "Codex extracted objects and relations directly, in batches, from the complete transcript set. Stalling and continuity were recurring operational failures. One irrelevant Asmongold transcript was identified and removed. A rapid error check followed completion.",
    },
    {
        number: "07",
        name: "Object-frequency analysis",
        question: "Which extracted objects warrant attention first?",
        detail:
            "The corpus contained 18,254 normalized object labels. The recurring-object curve produced an elbow after rank 115, corresponding to frequency 15 or greater. These 115 became the analysis group.",
    },
    {
        number: "08",
        name: "Relational expansion and visualisation",
        question: "What surrounds the analysis group?",
        detail:
            "The 115 objects connected to 3,168 first-order objects and 4,059 additional second-order objects, producing a 7,342-object network. The notebook gained frequency plots, cutoff calculation, interactive network navigation, node scaling, edge-opacity changes and a frequency slider.",
    },
    {
        number: "09",
        name: "Repeated-pair and community analysis",
        question: "Which connections persist across the corpus?",
        detail:
            "Object-pair frequency became the main simplification mechanism. At pair frequency ≥3, the network revealed programs, exercise systems, hubs and bridges. Southwood, Easy Strength, Armor Building Complex, Rite of Passage and swing-related structures became visible.",
    },
    {
        number: "10",
        name: "Program-grammar synthesis",
        question: "What does the network imply about Dan John’s underlying method?",
        detail:
            "Exercise relations exposed squat, swing, press, clean, get-up and carry systems. Reading the findings backwards revealed a program-generating framework optimising useful improvement, simplicity, repeatability and recovery. The corpus was then compressed into a five-video viewing set covering the complete framework.",
    },
];

const loadCode = `from pathlib import Path
import json
import pandas as pd

frequency_data = (
    pd.read_csv(Path("object_frequencies.csv"))
    .sort_values("rank")
    .reset_index(drop=True)
)
records_dir = Path("v1_1_objects_relations/records")
record_paths = list(records_dir.glob("*.json"))

print(f"Objects: {len(frequency_data):,}")
print(f"Video records: {len(record_paths):,}")`;

const cutoffCode = `recurring_objects = frequency_data.loc[
    frequency_data["frequency"] > 1
].copy()

normalized_rank = (
    (recurring_objects["rank"] - recurring_objects["rank"].min())
    / (recurring_objects["rank"].max() - recurring_objects["rank"].min())
)
normalized_frequency = (
    (recurring_objects["frequency"] - recurring_objects["frequency"].min())
    / (recurring_objects["frequency"].max() - recurring_objects["frequency"].min())
)

distance_from_endpoint_line = (1 - normalized_rank) - normalized_frequency
knee_index = distance_from_endpoint_line.idxmax()
cutoff_frequency = int(frequency_data.loc[knee_index, "frequency"])
cutoff_rank = int(frequency_data.loc[
    frequency_data["frequency"] >= cutoff_frequency, "rank"
].max())`;

const relationsCode = `from collections import Counter, defaultdict

analysis_group = set(
    frequency_data.head(cutoff_rank)["object"].str.strip().str.lower()
)
adjacency = defaultdict(set)
pair_frequency = Counter()

for record_path in records_dir.glob("*.json"):
    record = json.loads(record_path.read_text(encoding="utf-8-sig"))
    labels = {
        item["id"]: item["label"].strip().lower()
        for item in record.get("objects", [])
    }
    for relation in record.get("relations", []):
        subject = labels.get(relation.get("subject"))
        object_ = labels.get(relation.get("object"))
        if subject and object_ and subject != object_:
            pair_frequency[tuple(sorted((subject, object_)))] += 1
            adjacency[subject].add(object_)
            adjacency[object_].add(subject)

first_order = set().union(*(adjacency[item] for item in analysis_group)) - analysis_group
second_order = (
    set().union(*(adjacency[item] for item in first_order))
    - analysis_group - first_order
)`;

const componentsCode = `def connected_groups(pair_counts, minimum_frequency):
    graph = defaultdict(set)
    for (left, right), count in pair_counts.items():
        if count >= minimum_frequency:
            graph[left].add(right)
            graph[right].add(left)

    groups, visited = [], set()
    for start in sorted(graph):
        if start in visited:
            continue
        stack, component = [start], set()
        visited.add(start)
        while stack:
            node = stack.pop()
            component.add(node)
            for neighbour in graph[node] - visited:
                visited.add(neighbour)
                stack.append(neighbour)
        groups.append(sorted(component))

    return sorted(groups, key=lambda group: (-len(group), group))

retained_pairs = {
    pair: count for pair, count in pair_frequency.items()
    if count >= 3
}`;

const explorerCode = `const filteredEdges = data.edges.filter(
    (edge) =>
        edge.frequency >= minPairFrequency &&
        scopeNodes.has(edge.source) &&
        scopeNodes.has(edge.target)
);

const visible = new Set([selectedId, ...direct, ...second]);

cytoscape({
    container: networkRef.current,
    elements,
    minZoom: 0.04,
    maxZoom: 5,
    style: networkStyles,
    layout: selectedId
        ? { name: "concentric", animate: false }
        : { name: "preset", fit: true, padding: 38 },
});`;

const codeStages = [
    {
        label: "01 / Prepare",
        title: "Load ranked objects and source-linked records",
        language: "Python",
        code: loadCode,
        output: "18,254 object labels · 382 video records",
    },
    {
        label: "02 / Cutoff",
        title: "Calculate the recurring-object elbow",
        language: "Python",
        code: cutoffCode,
        output: "Cutoff after rank 115 · minimum total frequency 15",
    },
    {
        label: "03 / Network",
        title: "Count pairs and expand relational neighbourhoods",
        language: "Python",
        code: relationsCode,
        output: "115 analysis · 3,168 first order · 4,059 second order",
    },
    {
        label: "04 / Structure",
        title: "Retain recurring pairs and find connected groups",
        language: "Python",
        code: componentsCode,
        output: "137 pairs at frequency ≥3 · 23 connected components",
    },
    {
        label: "05 / Explore",
        title: "Filter and render the browser network",
        language: "JavaScript",
        code: explorerCode,
        output: "Searchable, thresholded, first- and second-order neighbourhoods",
    },
];

const limitations = [
    "Transcript inaccuracies can affect the extracted evidence.",
    "Two playlist entries lacked usable transcripts and received no analysis.",
    "Object aliases and composite labels remain incompletely resolved.",
    "Singular and plural forms remain separate because their relational neighbourhoods differed.",
    "Relation wording and direction vary between records.",
    "Changing the pair-frequency threshold changes the visible network.",
    "The model comparison was not like-for-like: the original rich-analysis records used Codex 5.6 Sol with extra-high reasoning, while the later tests used GPT-4.1 and GPT-4.1 mini.",
    "Frequency measures recurrence, not whether a claim is correct or universally applicable.",
];

function SectionHeading({ eyebrow, title, children }) {
    return (
        <header className={styles.sectionHeading}>
            <p>{eyebrow}</p>
            <h2>{title}</h2>
            {children ? <div className={styles.sectionIntro}>{children}</div> : null}
        </header>
    );
}

function VideoEmbed({ video, featured = false, index }) {
    return (
        <article className={`${styles.videoCard} ${featured ? styles.featuredVideo : ""}`}>
            <div className={styles.videoFrame}>
                <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                />
            </div>
            <div className={styles.videoBody}>
                <p className={styles.videoRole}>{String(index + 1).padStart(2, "0")} · {video.role}</p>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                <Link href={`https://www.youtube.com/watch?v=${video.id}`} rel="noopener noreferrer" target="_blank">
                    Open on YouTube <span aria-hidden="true">↗</span>
                </Link>
            </div>
        </article>
    );
}

function CodeStage({ stage }) {
    return (
        <article className={styles.codeStage}>
            <header>
                <div>
                    <p>{stage.label}</p>
                    <h3>{stage.title}</h3>
                </div>
                <span>{stage.language}</span>
            </header>
            <pre><code>{stage.code}</code></pre>
            <footer><span>Result</span><strong>{stage.output}</strong></footer>
        </article>
    );
}

const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Dan John YouTube Playlist Semantic Network Analysis",
    description:
        "A reproducible semantic network analysis of 382 Dan John strength-coaching videos.",
    author: { "@type": "Person", name: "Andrew Hale" },
    datePublished: "2026-10-13",
    dateModified: "2026-10-17",
    url: "https://decrepitfilth.art/art/dan-john-youtube-playlist-semantic-network-analysis",
    mainEntityOfPage:
        "https://decrepitfilth.art/art/dan-john-youtube-playlist-semantic-network-analysis",
    isPartOf: {
        "@type": "CollectionPage",
        name: "Finding Hidden Structure in Large Content Corpora",
        url: "https://decrepitfilth.art/art/project/finding-hidden-structure-in-large-content-corpora",
    },
    about: [
        { "@type": "Thing", name: "Dan John" },
        { "@type": "Thing", name: "Semantic network analysis" },
        { "@type": "Thing", name: "Strength training" },
    ],
};

const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Art",
            item: "https://decrepitfilth.art/art",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Finding Hidden Structure in Large Content Corpora",
            item: "https://decrepitfilth.art/art/project/finding-hidden-structure-in-large-content-corpora",
        },
        {
            "@type": "ListItem",
            position: 3,
            name: "Dan John YouTube Playlist Semantic Network Analysis",
            item: "https://decrepitfilth.art/art/dan-john-youtube-playlist-semantic-network-analysis",
        },
    ],
};

export default async function DanJohnSemanticNetworkPage() {
    const articles = await readArticles();
    const article = articles.find(
        (item) => item.slug === "dan-john-youtube-playlist-semantic-network-analysis"
    );

    if (!article) {
        throw new Error("Dan John case-study metadata is missing");
    }

    const memberships = findArticleProjectMemberships(
        buildProjectIndex(articles),
        article.slug
    );

    return (
        <main className={styles.page}>
            <script
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([structuredData, breadcrumbData]).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
                type="application/ld+json"
            />

            <nav className={styles.articleNav} aria-label="Article navigation">
                <Link href="/art">Back to the archive graph</Link>
            </nav>

            <header className={styles.hero} id={sectionIds.question}>
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>Corpus study · semantic network analysis · <time dateTime="2026-10-13">13 October 2026</time></p>
                    <h1>I watched 382 Dan John Strength Coach YouTube videos so that you don&apos;t have to.</h1>
                    <p className={styles.standfirst}>
                        Then I carried out a Semantic Network Analysis on all the videos so that nobody else had to either. Then I identified the five videos you definitely should watch.
                    </p>

                    <div className={styles.heroFinding}>
                        <span>What emerged</span>
                        <p>Buried inside 382 videos is something sturdier than a pile of tips: a recurring set of decisions for turning movements into programmes.</p>
                    </div>

                    <div className={styles.researchBrief}>
                        <div>
                            <span>Research question</span>
                            <p>What does the complete usable corpus reveal about how Dan John communicates and structures strength training?</p>
                        </div>
                        <div>
                            <span>Purpose</span>
                            <p>
                                To demonstrate a general method for{" "}
                                <Link href="/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content">
                                    discovering meaningful structure
                                </Link>{" "}
                                in a large, unstructured corpus.
                            </p>
                        </div>
                    </div>

                    <dl className={styles.stats}>
                        {stats.map(([value, label]) => (
                            <div key={label}>
                                <dt>{value}</dt>
                                <dd>{label}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </header>

            <div className={styles.pathwayWrap}>
                <ProjectPathway memberships={memberships} />
            </div>

            <div className={styles.shell}>
                <aside className={styles.sidebar} aria-label="Case-study contents">
                    <div className={styles.sidebarInner}>
                        <p>Case-study contents</p>
                        <nav>
                            {contents.map(([label, id]) => (
                                <a href={`#${id}`} key={id}>{label}</a>
                            ))}
                        </nav>
                        <div className={styles.sidebarMeta}>
                            <span>Corpus</span>
                            <strong>382 videos</strong>
                            <span>Cutoff</span>
                            <strong>Rank 115</strong>
                            <span>Pair threshold</span>
                            <strong>≥ 3</strong>
                        </div>
                    </div>
                </aside>

                <article className={styles.content}>
                    <section className={styles.section} id={sectionIds.findings}>
                        <SectionHeading
                            eyebrow="01 / Core discovery"
                            title="Across 382 videos, the same programme-design grammar keeps reappearing"
                        >
                            <p>
                                The corpus reveals something more general than one universal prescription: a stable system for generating different programmes according to the objective, trainee and circumstances.
                            </p>
                        </SectionHeading>

                        <blockquote className={styles.primaryFinding}>
                            <span>The implicit grammar</span>
                            <p>Choose the objective. Select the movements. Fit the variations to the trainee. Progress, regress or substitute. Combine and dose simply. Protect recovery and repeatability.</p>
                        </blockquote>

                        <div className={styles.grammarCard}>
                            <header>
                                <p className={styles.panelEyebrow}>The programme implicit across the corpus</p>
                                <h3>Six decisions repeatedly organise the teaching</h3>
                                <p>This is an inference from recurring objects and relations—not a programme Dan John states in this exact form.</p>
                            </header>
                            <ol>
                                {programSteps.map((step, index) => (
                                    <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
                                ))}
                            </ol>
                        </div>

                        <div className={styles.answerGrid}>
                            <article>
                                <span>Named programmes</span>
                                <h3>Different expressions of one logic</h3>
                                <p>Easy Strength, Southwood, Rite of Passage, Armor Building Complex and Mass Made Simple select from overlapping movement families and vary their volume, density and progression by goal.</p>
                            </article>
                            <article>
                                <span>Communication</span>
                                <h3>Exercises are taught relationally</h3>
                                <p>Movements become understandable through what precedes them, replaces them, combines with them, follows them or performs the same function.</p>
                            </article>
                            <article>
                                <span>Compression</span>
                                <h3>Five videos cover every selected structure</h3>
                                <p>The smallest defensible viewing set covers all seven structures used as the coverage target, turning a 382-video corpus into a compact route through the inferred system.</p>
                            </article>
                        </div>

                        <div className={styles.optimisationPanel}>
                            <div className={styles.optimisationLead}>
                                <p className={styles.panelEyebrow}>What the system appears to optimise</p>
                                <h3>Useful physical improvement with the least unnecessary complexity and fatigue</h3>
                                <p>The objective is not to maximise one lift at any cost. It is to get meaningfully better without needing a recovery plan from the recovery plan.</p>
                            </div>
                            <ul>
                                {optimisationPoints.map((point) => <li key={point}>{point}</li>)}
                            </ul>
                        </div>

                        <blockquote className={styles.principleQuote}>
                            <span>Inferred optimisation principle</span>
                            <p>Maximise useful, sustainable results per unit of time, effort, complexity and recovery cost.</p>
                        </blockquote>

                        <div className={styles.subsectionHeading}>
                            <p className={styles.panelEyebrow}>Why this interpretation is visible</p>
                            <h3>Turn down the noise and recognisable subjects appear</h3>
                            <p>The frequency-≥3 network is not random noise wearing a lab coat. It breaks into named programmes, exercise systems and recurring training concerns.</p>
                        </div>

                        <dl className={styles.evidenceStats}>
                            <div><dt>147</dt><dd>connected objects</dd></div>
                            <div><dt>137</dt><dd>retained edges</dd></div>
                            <div><dt>23</dt><dd>connected components</dd></div>
                            <div><dt>99</dt><dd>objects in the main component</dd></div>
                        </dl>

                        <div className={styles.tableFrame}>
                            <table className={styles.evidenceTable}>
                                <thead><tr><th>Inferred topic</th><th>Representative objects</th></tr></thead>
                                <tbody>
                                    {networkTopics.map(([topic, objects]) => (
                                        <tr key={topic}><th scope="row">{topic}</th><td>{objects}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.networkLists}>
                            <article>
                                <p className={styles.panelEyebrow}>Strongest structural hubs · connection score</p>
                                <h3>Some ideas do more of the heavy lifting</h3>
                                <dl>
                                    {networkHubs.map(([name, frequency]) => (
                                        <div key={name}><dt>{name}</dt><dd>{frequency}</dd></div>
                                    ))}
                                </dl>
                            </article>
                            <article>
                                <p className={styles.panelEyebrow}>Cross-topic bridges</p>
                                <h3>What connects otherwise distinct subjects</h3>
                                <ul>
                                    {networkBridges.map((name) => <li key={name}>{name}</li>)}
                                </ul>
                            </article>
                        </div>

                        <p className={styles.thresholdNote}>
                            The ≥3 threshold gives the cleanest view of the strongest recurring programmes and systems. Dropping to ≥2 is messier but better for seeing how those subjects bleed into one another. The topic names are interpretations of the shapes in the network, not labels smuggled into the original data.
                        </p>
                    </section>

                    <section className={styles.section} id={sectionIds.interpretation}>
                        <SectionHeading
                            eyebrow="02 / Training structures"
                            title="The relations show how exercises become programmes"
                        >
                            <p>
                                Frequency identifies what Dan John repeatedly discusses. Exercise pairs identify what repeatedly travels together. Relation wording reveals whether that connection is a progression, regression, substitute, sequence, combination or functional analogy.
                            </p>
                        </SectionHeading>

                        <dl className={styles.evidenceStats}>
                            {exerciseStats.map(([value, label]) => (
                                <div key={label}><dt>{value}</dt><dd>{label}</dd></div>
                            ))}
                        </dl>

                        <div className={styles.coreSystemsFinding}>
                            <div className={styles.coreSystemsHeader}>
                                <div>
                                    <p className={styles.panelEyebrow}>Five groups at pair frequency ≥3</p>
                                    <h3>Repeated exercise pairs form recognisable training systems</h3>
                                    <p>The largest group contains a squat progression, a swing-teaching progression and a complete workout composition. Four smaller groups preserve pressing, clean, get-up and carry relationships.</p>
                                </div>
                            </div>

                            <div className={styles.exerciseGroups}>
                                {exerciseGroups.map((group, index) => (
                                    <article className={index === 0 ? styles.exerciseGroupFeatured : ""} key={group.name}>
                                        <div>
                                            <span>{String(index + 1).padStart(2, "0")}</span>
                                            <h3>{group.name}</h3>
                                            <strong className={styles.exerciseRelationType}>{group.relationType}</strong>
                                            <p>{group.description}</p>
                                        </div>
                                        <pre>{group.diagram}</pre>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className={styles.frequencyTwoBlock}>
                            <div>
                                <p className={styles.panelEyebrow}>What returns at frequency ≥2</p>
                                <h3>Weaker pairs extend rather than overturn the structure</h3>
                            </div>
                            <ul>
                                {frequencyTwoRelations.map(([pair, meaning]) => (
                                    <li key={pair}><strong>{pair}</strong><span>{meaning}</span></li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.relationCategories} aria-label="Recurring relation categories">
                            {relationCategories.map((category) => <span key={category}>{category}</span>)}
                        </div>

                        <p className={styles.thresholdNote}>
                            Some relation directions are inconsistent—particularly between glute bridge and hip thrust, and between strict press and push press. The evidence supports the relationship type more confidently than one universal direction.
                        </p>

                        <div className={styles.linguisticFinding}>
                            <div>
                                <p className={styles.panelEyebrow}>A linguistic signal in the relations</p>
                                <h3>Singular and plural terms do different work</h3>
                                <p>In four tested noun pairs, the singular and plural forms occupy strikingly different relational neighbourhoods. Singular terms tend to name or classify a thing; plurals more often carry programming context such as doses, blocks, methods or accumulated effects.</p>
                            </div>
                            <dl>
                                {singularPluralPairs.map(([pair, overlap]) => (
                                    <div key={pair}><dt>{pair}</dt><dd>{overlap} neighbour overlap</dd></div>
                                ))}
                            </dl>
                            <p>This is a small test, but it provides a reason not to collapse the forms automatically as aliases.</p>
                        </div>

                        <div className={styles.reverseReading}>
                            <div className={styles.subsectionHeading}>
                                <p className={styles.panelEyebrow}>Reverse reading of the methodology</p>
                                <h3>Reading the research backwards exposed its real result</h3>
                                <p>Viewed chronologically, the work is a record of extraction and analysis. Viewed from its findings backwards, it becomes an argument for an implicit programme-generating framework.</p>
                            </div>

                            <div className={styles.tableFrame}>
                                <table className={styles.evidenceTable}>
                                    <thead><tr><th>Reverse-reading stage</th><th>What it contributes</th></tr></thead>
                                    <tbody>
                                        {reverseStages.map(([stage, contribution]) => (
                                            <tr key={stage}><th scope="row">{stage}</th><td>{contribution}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.architecturePanel}>
                                <div>
                                    <p className={styles.panelEyebrow}>Implied programme architecture</p>
                                    <h3>The movement roles remain stable while their contents change</h3>
                                    <p>The named programmes look less like unrelated prescriptions and more like different implementations of this shared architecture.</p>
                                </div>
                                <pre>{programmeArchitecture}</pre>
                            </div>

                            <blockquote className={styles.principleQuote}>
                                <span>Strongest supported conclusion</span>
                                <p>Dan John repeatedly applies a recurring programme-design grammar to produce different programmes for different circumstances.</p>
                            </blockquote>
                        </div>
                    </section>

                    <section className={styles.section} id={sectionIds.watch}>
                        <SectionHeading
                            eyebrow="03 / Minimum sufficient viewing"
                            title="The five videos you definitely should watch"
                        >
                            <p>
                                Five is the smallest set that covers all seven recurring exercise structures identified in the selected exercise set. It covers 13 of 22 repeated exercise pairs; it is not a claim that five videos represent every subject in the corpus.
                            </p>
                        </SectionHeading>

                        <VideoEmbed featured index={0} video={videos[0]} />
                        <div className={styles.videoGrid}>
                            {videos.slice(1).map((video, index) => (
                                <VideoEmbed index={index + 1} key={video.id} video={video} />
                            ))}
                        </div>

                        <div className={styles.coverageBlock}>
                            <div>
                                <p className={styles.panelEyebrow}>Coverage trade-off</p>
                                <h3>Why stop at five?</h3>
                                <p>The first three provide the efficient short version. Videos four and five add the otherwise missing loaded-carry and get-up systems.</p>
                            </div>
                            <div className={styles.coverageRows}>
                                <div className={styles.coverageHead}><span>Videos</span><span>Repeated pairs</span><span>Systems</span></div>
                                {coverageRows.map(([count, pairs, systems]) => (
                                    <div className={count === "5" ? styles.coverageWinner : ""} key={count}>
                                        <strong>{count}</strong><span>{pairs}</span><span>{systems}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.answerGrid}>
                            <article>
                                <span>One video</span>
                                <h3>#217 is the best overview</h3>
                                <p>It crosses more of the identified framework than any other single source.</p>
                            </article>
                            <article>
                                <span>Three videos</span>
                                <h3>#217, #248 and #197 give the essential framework</h3>
                                <p>Together they explain most of the programme architecture and much of its rationale.</p>
                            </article>
                            <article>
                                <span>Five videos</span>
                                <h3>The smallest seven-system set</h3>
                                <p>Loaded carries and get-ups complete all seven systems. Covering all 22 repeated pairs would require 13 videos for substantially less return.</p>
                            </article>
                        </div>
                    </section>

                    <section className={styles.section} id={sectionIds.explore}>
                        <SectionHeading
                            eyebrow="04 / Interactive evidence"
                            title="Test the interpretation against the source-linked relation network"
                        >
                            <p>
                                Search the ranked frequency table, select an object and carry that selection into the relation network. Adjust object scope, direct or second-order depth, and the minimum pair frequency from one to four. The explorer preserves disconnected components rather than implying that every subject belongs to one graph region.
                            </p>
                        </SectionHeading>

                        <div className={styles.layerLegend}>
                            <div><span>Extracted</span><strong>Objects, relations and sources</strong></div>
                            <div><span>Computed</span><strong>Frequency, pairs and graph distance</strong></div>
                            <div><span>Interpreted</span><strong>Structures and programme grammar</strong></div>
                        </div>

                        <DanJohnDashboard />
                    </section>

                    <section className={styles.section} id={sectionIds.code}>
                        <SectionHeading
                            eyebrow="05 / Code and reproducibility"
                            title="The operations that generated and exposed the results"
                        >
                            <p>
                                Each stage keeps the operation, executable code and observed output together. The snippets come from the working Jupyter notebook and the browser explorer used on this page.{" "}
                                The <Link href="/art/python-nlp-semantic-seo">Python for NLP and Semantic SEO reference</Link> provides the broader implementation context for these operations.
                            </p>
                        </SectionHeading>

                        <div className={styles.codeStack}>
                            {codeStages.map((stage) => <CodeStage key={stage.label} stage={stage} />)}
                        </div>
                    </section>

                    <section className={styles.section} id={sectionIds.method}>
                        <SectionHeading
                            eyebrow="06 / Methodological record"
                            title="How the unit of analysis changed across ten epochs"
                        >
                            <p>
                                The discovery appears first on this page. This chronological record preserves the experiments, failures and corrections that made it possible—and shows how the project moved from maximum extraction towards minimum sufficient explanation.{" "}
                                It extends the site&apos;s <Link href="/art/research-pipeline">research pipeline</Link> into a bounded transcript corpus.
                            </p>
                        </SectionHeading>

                        <dl className={styles.studyRecord}>
                            {studyRecord.map(([label, value]) => (
                                <div key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>

                        <p>
                            The separation of automated extraction, computation and human interpretation follows the{" "}
                            <Link href="/semantic-seo-lab">human-supervised research approach documented in the Semantic SEO Lab</Link>.
                        </p>

                        <div className={styles.flowPanel}>
                            <div>
                                <p className={styles.panelEyebrow}>General method</p>
                                <h3>Discover structure, then return to the sources</h3>
                                <p>This is the transferable operation demonstrated by the Dan John corpus.</p>
                            </div>
                            <pre>{methodFlow}</pre>
                        </div>

                        <div className={styles.methodProgression}>
                            <div>
                                <p className={styles.panelEyebrow}>The project’s deeper progression</p>
                                <h3>The unit of analysis expanded before the answer contracted</h3>
                                <p>Individual records became a network; the network then made it possible to return to a small number of particularly informative sources.</p>
                            </div>
                            <pre>{analysisProgression}</pre>
                        </div>

                        <p>
                            The <Link href="/art/tiktok-video-analysis-with-python">CreepyTok analysis</Link> provides a parallel case: it prepares a TikTok corpus for supervised interpretation, while this study continues through corpus-wide relational analysis and return to individual sources.
                        </p>

                        <div className={styles.epochs}>
                            {epochs.map((epoch) => (
                                <article key={epoch.number}>
                                    <span>{epoch.number}</span>
                                    <div>
                                        <p>{epoch.name}</p>
                                        <h3>{epoch.question}</h3>
                                        <p>{epoch.detail}</p>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <div className={styles.subsectionHeading}>
                            <p className={styles.panelEyebrow}>Three broader eras</p>
                            <h3>The project changed character twice</h3>
                        </div>

                        <div className={styles.eraGrid}>
                            {researchEras.map((era, index) => (
                                <article key={era.name}>
                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                    <h3>{era.name}</h3>
                                    <p>{era.description}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section} id={sectionIds.artefacts}>
                        <SectionHeading
                            eyebrow="07 / Research artefacts"
                            title="Inspect the notebook, corpus metadata and derived data"
                        >
                            <p>The page is an interface to the analysis, not a replacement for its working materials.</p>
                            <p>To reproduce the notebook, install the listed Python packages, keep the frequency CSV beside it, and extract the records archive so its <code>v1_1_objects_relations</code> directory is beside the notebook.</p>
                        </SectionHeading>

                        <div className={styles.artifactGrid}>
                            <a download href="/downloads/dan-john-playlist-analysis.ipynb">
                                <span>Jupyter Notebook</span>
                                <strong>Download the complete working notebook</strong>
                                <small>.ipynb · calculations, plots and exploratory dashboard</small>
                            </a>
                            <a download href="/downloads/dan-john-analysis-requirements.txt">
                                <span>Notebook setup</span>
                                <strong>Download the Python requirements</strong>
                                <small>.txt · Jupyter, NumPy, pandas, Plotly and ipywidgets</small>
                            </a>
                            <a download href="/downloads/dan-john-transcript-collector.zip">
                                <span>Source acquisition</span>
                                <strong>Download the complete transcript collector</strong>
                                <small>.zip · collector, extraction module, requirements and setup</small>
                            </a>
                            <a download href="/downloads/dan-john-object-relation-records.zip">
                                <span>Extraction records</span>
                                <strong>Download all 382 source-linked object–relation records</strong>
                                <small>.zip · the per-video JSON input used by the notebook</small>
                            </a>
                            <a download href="/downloads/dan-john-analysed-video-metadata.csv">
                                <span>Corpus metadata</span>
                                <strong>Download the analysed-video index</strong>
                                <small>.csv · playlist position, official title, video ID and source URL for all 382 analysed videos</small>
                            </a>
                            <a download href="/data/dan-john-object-frequencies.csv">
                                <span>Frequency data</span>
                                <strong>Download all 18,254 ranked object labels</strong>
                                <small>.csv · object, frequency and rank</small>
                            </a>
                            <a download href="/data/dan-john-network.json">
                                <span>Network data</span>
                                <strong>Download the browser explorer dataset</strong>
                                <small>.json · nodes, pairs, relations and source videos</small>
                            </a>
                        </div>
                    </section>

                    <section className={styles.section} id={sectionIds.limitations}>
                        <SectionHeading
                            eyebrow="08 / Limits"
                            title="What the analysis does not establish"
                        >
                            <p>Recurrence directs attention. It does not convert extracted language into truth or remove the need to inspect sources.</p>
                        </SectionHeading>

                        <ul className={styles.limitList}>
                            {limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                        </ul>

                        <div className={styles.returnPanel}>
                            <p className={styles.panelEyebrow}>Return to the question</p>
                            <h2>The corpus makes visible the recurring decisions from which many Dan John programmes can be built.</h2>
                            <p>
                                It does not reduce the work to one prescription. It shows how objectives, movement roles, suitable variations, progressions, substitutions, dosage and recovery repeatedly combine—and identifies five videos covering every exercise structure used as the final coverage target.
                            </p>
                            <div>
                                <a href={`#${sectionIds.explore}`}>Explore the evidence</a>
                                <a href={`#${sectionIds.watch}`}>Watch the five videos</a>
                                <a href={`#${sectionIds.question}`}>Back to the question</a>
                            </div>
                        </div>
                    </section>
                </article>
            </div>
        </main>
    );
}
