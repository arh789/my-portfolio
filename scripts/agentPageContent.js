export const CLAIM_STATUS = {
  "site-thesis": "The site's declared conceptual position.",
  "author-argument": "An interpretation argued by the author.",
  implementation: "A capability represented in the published code.",
  observation: "A result reported from recorded data.",
  "editorial-strategy": "A recommended creative or publishing direction.",
  navigation: "A description of site structure rather than a substantive claim.",
};

export const AGENT_PAGE_CONTENT = {
  home: {
    questionsAnswered: [
      "What subjects and formats does the site connect?",
      "Where should a human or agent begin?",
      "Which machine-readable discovery files are available?",
    ],
    content: {
      purpose:
        "Orient readers and agents, expose the site's main conceptual regions, and provide a prompt for constructing interest-specific reading paths.",
      regions: [
        "site thesis",
        "hidden-structure framework",
        "research workflow",
        "code implementation",
        "Semantic SEO evidence",
        "LLM output analysis",
        "creative strategy",
        "article archive",
      ],
    },
    limitations: [
      "The homepage is an entry point; substantive claims belong to the linked pages and articles.",
    ],
    agentUse: {
      role: "Start here only when human-facing orientation is needed.",
      sourceFetchUsuallyRequired: false,
    },
  },
  about: {
    questionsAnswered: [
      "What is Decrepit Filth?",
      "Who is the site for?",
      "How do its art, research, code and strategy connect?",
    ],
    content: {
      claims: [
        {
          status: "site-thesis",
          text: "The site is not primarily a portfolio, blog or SEO resource; it is a system designed to describe and reinforce its own semantic structure.",
        },
        {
          status: "author-argument",
          text: "Grotesque surreal art is a useful stress test because it is visually dense, semantically unstable and difficult for platforms to classify.",
        },
        {
          status: "site-thesis",
          text: "The long-term objective is not visibility alone but an archive whose internal structure resists external flattening.",
        },
      ],
      systemLoop: [
        "ambiguous grotesque art",
        "structural research",
        "content strategy",
        "archive construction",
        "machine-readable representation",
        "visibility pressure",
        "platform capture",
        "stronger archive",
      ],
      audience: [
        "independent creators",
        "niche publishers",
        "research-led operators",
        "artists whose work is difficult to classify",
      ],
    },
    limitations: [
      "This is the site's orientation and thesis page, not independent empirical validation.",
    ],
    agentUse: {
      role: "Read first for site-wide intent and vocabulary.",
      sourceFetchUsuallyRequired: false,
    },
  },
  "hidden-structure": {
    questionsAnswered: [
      "What structure gets lost when reality is converted into data?",
      "Why are deep learning, network analysis and LLMs complementary?",
      "Why is human interpretation still required?",
    ],
    content: {
      framework: [
        {
          system: "deep-learning",
          function: "detect statistical regularity",
          question: "What patterns exist?",
          blindSpot: "absence and significance",
        },
        {
          system: "network-analysis",
          function: "detect relational and missing structure",
          question: "What structure is present or absent?",
          blindSpot: "meaning",
        },
        {
          system: "llm",
          function: "interpret and express semantic structure",
          question: "How can the structure be explained?",
          blindSpot: "value selection and reliable truth assessment",
        },
        {
          system: "human",
          function: "judge importance and consequences",
          question: "Which structure matters?",
          blindSpot: "scale and consistency",
        },
      ],
      claims: [
        {
          status: "author-argument",
          text: "Many systems act on representations of reality rather than reality itself.",
        },
        {
          status: "author-argument",
          text: "Deep learning, graph analysis, LLM interpretation and human judgment are compensatory rather than interchangeable.",
        },
      ],
    },
    limitations: [
      "The framework is conceptual and does not establish that every hidden relationship is meaningful.",
      "LLM explanations remain interpretations of observed representations rather than access to model internals.",
    ],
    agentUse: {
      role: "Conceptual explanation connecting the site's research methods.",
      sourceFetchUsuallyRequired: false,
    },
  },
  "workflow-structure-breakdown": {
    questionsAnswered: [
      "How is the research pipeline structured?",
      "What happens at each processing stage?",
      "How does it differ from seed-keyword research?",
    ],
    content: {
      pipeline: [
        "query-driven data acquisition",
        "content harvesting and structural extraction",
        "summarisation and noise reduction",
        "keyword and keyphrase extraction",
        "visualisation and relational analysis",
        "Apriori association-rule discovery",
        "interactive analysis and manual override",
      ],
      claims: [
        {
          status: "author-argument",
          text: "Beginning with collected evidence can reduce the input bias introduced by manually selected seed keywords.",
        },
        {
          status: "author-argument",
          text: "Relational analysis can reveal contextual associations that flat keyword lists obscure.",
        },
      ],
      outputs: [
        "cleaned source corpus",
        "semantic terms and phrases",
        "concept networks",
        "association rules",
        "human-reviewed strategic findings",
      ],
    },
    limitations: [
      "The workflow does not independently provide search volume, advertising cost or commercial competition data.",
      "It is best used as a research layer alongside conventional search tools.",
    ],
    agentUse: {
      role: "Authoritative sequence of the site's research methodology.",
      sourceFetchUsuallyRequired: false,
    },
  },
  code: {
    questionsAnswered: [
      "How is the research workflow implemented?",
      "Which Python methods and libraries are involved?",
      "How are documents converted into semantic structures?",
    ],
    content: {
      artifact: {
        format: "static Jupyter notebook HTML",
        interactiveExecution: false,
      },
      methods: [
        "Google Custom Search collection",
        "robots handling",
        "HTML and text extraction",
        "transformer-based language processing",
        "KeyBERT keyword extraction",
        "word-frequency analysis",
        "semantic clustering",
        "NetworkX graph analysis",
        "Apriori association discovery",
      ],
      claims: [
        {
          status: "implementation",
          text: "The notebook contains the implementation layer used by the site's research and content-strategy workflow.",
        },
      ],
    },
    limitations: [
      "The published page is a static export rather than a hosted execution environment.",
      "Reproduction may require external APIs, Python dependencies and source data.",
      "Fetch the source page when exact functions or code are required.",
    ],
    agentUse: {
      role: "Implementation reference.",
      sourceFetchUsuallyRequired: true,
    },
  },
  "semantic-seo-lab": {
    questionsAnswered: [
      "Can semantic SEO representations be made operational?",
      "What do classical NLP and graph methods reveal?",
      "How should agent interpretations be supervised?",
      "What search changes were observed after publication?",
    ],
    content: {
      researchParts: [
        {
          name: "classical-methods",
          methods: [
            "TF-IDF",
            "c-TF-IDF",
            "NetworkX",
            "Louvain communities",
            "BERT",
            "RoBERTa",
            "KMeans",
            "HDBSCAN and BERTopic-style clustering",
          ],
        },
        {
          name: "agent-supervised-interpretation",
          methods: [
            "graph interrogation",
            "evidence/inference separation",
            "human correction trail",
          ],
        },
        {
          name: "search-observation",
          source: "Google Search Console",
          periodEnd: "2026-09-01",
        },
      ],
      observations: [
        {
          status: "observation",
          metric: "site-impressions",
          before: 190,
          after: 365,
          changePercent: 92,
        },
        {
          status: "observation",
          page: "/art/python-nlp-semantic-seo",
          impressionsBefore: 4,
          impressionsAfter: 161,
        },
        {
          status: "observation",
          page: "/semantic-seo-lab",
          impressionsBefore: 131,
          impressionsAfter: 180,
        },
        {
          status: "observation",
          metric: "site-clicks",
          before: 0,
          after: 0,
        },
      ],
      interpretation:
        "The recorded change is consistent with incremental visibility and query-page specialisation: the lab became the stronger conceptual destination while the practical article remained better aligned with procedural queries.",
    },
    limitations: [
      "The observations are not a controlled experiment and do not establish causality.",
      "Search Console data cannot reveal Google's internal ranking process.",
      "No clicks were recorded, so the evidence supports visibility rather than engagement or user value.",
    ],
    agentUse: {
      role: "Primary evidence page for the site's Semantic SEO research.",
      sourceFetchUsuallyRequired: false,
    },
  },
  "datamining-llm": {
    questionsAnswered: [
      "What can repeated LLM outputs reveal?",
      "How can outputs be converted into symbolic structures?",
      "How are omissions, contradictions and collapses interrogated?",
    ],
    content: {
      sections: [
        "introduction",
        "Emergent Structural Mapping doctrine",
        "methodology pipeline",
        "symbolic engine schema",
        "implementation example",
        "SEM execution system",
        "full thread archive reference",
        "conclusion and next steps",
      ],
      pipeline: [
        "prompt initiation",
        "surface-output capture",
        "semantic-network construction",
        "emergent structural mapping",
        "collapse interrogation",
        "recursive audit",
        "recursive recompression",
        "strategic output",
      ],
      claims: [
        {
          status: "author-argument",
          text: "Repeated LLM outputs can be treated as artifacts whose persistent relations, omissions and distortions can be mapped.",
        },
        {
          status: "author-argument",
          text: "Contradiction and recursive questioning can expose structural weaknesses hidden by fluent surface responses.",
        },
      ],
      corePrinciple:
        "Treat outputs as artifacts under pressure: identify what survives, compress it and build with it.",
    },
    limitations: [
      "The method analyses recorded outputs, not hidden model weights, activations or direct internal reasoning.",
      "Results depend on prompts, sampling conditions and the selected output archive.",
      "Persistent output patterns should not automatically be treated as empirical truth.",
    ],
    agentUse: {
      role: "LLM-analysis doctrine and symbolic extraction terminology.",
      sourceFetchUsuallyRequired: false,
    },
  },
  "content-strategy": {
    questionsAnswered: [
      "What niche should the artistic project occupy?",
      "Which themes recur in the research?",
      "What is the Seer-Clown?",
      "How should the work be produced?",
    ],
    content: {
      evidenceBasis: [
        "clustered Instagram material",
        "Python Semantic SEO processing",
        "keyword and association analysis",
        "human strategic interpretation",
      ],
      positioning:
        "Blasphemous pop-surrealist horror with theatrical grotesque aesthetics.",
      archetype: {
        name: "Seer-Clown",
        roles: [
          "prophet",
          "fool",
          "tragic jester",
          "rejected oracle",
          "truth-teller mistaken for an idiot",
        ],
      },
      themes: [
        "decay and ruined grandeur",
        "masks and unstable identity",
        "sacred glyphs and corrupted ritual",
        "clowns, dolls and puppetry",
        "digital decay and glitch",
        "cosmic collapse",
        "uncanny theatre",
      ],
      production: [
        "airbrush and practical painting",
        "stop motion",
        "mixed media",
        "After Effects compositing",
        "Houdini effects",
        "glitch and datamosh processes",
        "short looping video",
      ],
      claims: [
        {
          status: "editorial-strategy",
          text: "The strongest differentiated niche combines grotesque theatrical imagery, decaying sacred symbolism and the Seer-Clown archetype.",
        },
      ],
    },
    limitations: [
      "The strategy is a human interpretation of the research corpus, not proof of universal audience preference.",
      "Creative positioning should evolve when new work or evidence contradicts the current clusters.",
    ],
    agentUse: {
      role: "Authoritative creative and editorial direction for the project.",
      sourceFetchUsuallyRequired: false,
    },
  },
  art: {
    questionsAnswered: [
      "What has been published?",
      "Which articles share concepts?",
      "Which guided pathways connect related investigations?",
    ],
    content: {
      generatedFrom: "/graph.json",
      navigationModes: [
        "interactive concept graph",
        "guided project pathways",
        "tag index",
        "article links",
      ],
      claims: [
        {
          status: "navigation",
          text: "Graph connections indicate shared assigned tags between articles.",
        },
      ],
    },
    limitations: [
      "A graph edge represents shared taxonomy, not causality, agreement or independently measured semantic similarity.",
      "Article-level content remains in graph.json and the source Markdown files.",
    ],
    agentUse: {
      role: "Use graph.json for article discovery; use this record to understand the archive hub.",
      sourceFetchUsuallyRequired: false,
    },
  },
  contact: {
    questionsAnswered: [
      "How can Andrew Hale be contacted about the site or related work?",
    ],
    content: {
      purpose: "contact",
      acceptedFields: ["email", "message"],
      delivery: "Formspree",
      topics: [
        "grotesque art",
        "Semantic SEO",
        "AI research",
        "project enquiries",
      ],
    },
    limitations: [
      "Utility page with no substantive research claims.",
      "An agent must not submit the form without explicit user authorisation.",
    ],
    agentUse: {
      role: "Contact endpoint only.",
      sourceFetchUsuallyRequired: false,
    },
  },
};

export const AGENT_PRIORITY_OVERRIDES = {
  "/": {
    context: "medium",
    traversal: "critical",
    evidence: "low",
    roles: ["entry-point", "site-navigation"],
  },
  "/about": {
    context: "critical",
    traversal: "critical",
    evidence: "medium",
    roles: ["site-orientation", "site-thesis"],
  },
  "/how-ai-network-analysis-and-llms-reveal-hidden-structure-in-content": {
    context: "critical",
    traversal: "high",
    evidence: "medium",
    roles: ["conceptual-kernel", "cross-region-ontology"],
  },
  "/workflow-structure-breakdown": {
    context: "high",
    traversal: "high",
    evidence: "high",
    roles: ["methodology", "process-map"],
  },
  "/code": {
    context: "medium",
    traversal: "medium",
    evidence: "critical",
    roles: ["implementation", "code-reference"],
  },
  "/semantic-seo-lab": {
    context: "critical",
    traversal: "high",
    evidence: "critical",
    roles: ["research-evidence", "human-supervised-analysis"],
  },
  "/datamining-llm": {
    context: "high",
    traversal: "high",
    evidence: "medium",
    roles: ["llm-analysis-doctrine", "methodology"],
  },
  "/content-strategy": {
    context: "high",
    traversal: "high",
    evidence: "medium",
    roles: ["research-to-art-bridge", "editorial-strategy"],
  },
  "/art": {
    context: "low",
    traversal: "critical",
    evidence: "low",
    roles: ["archive-hub", "graph-navigation"],
  },
  "/contact": {
    context: "low",
    traversal: "low",
    evidence: "none",
    roles: ["utility"],
  },
  "/art/from-seo-keywords-to-the-haunted-machine": {
    context: "critical",
    traversal: "critical",
    evidence: "high",
    roles: ["worked-site-synthesis", "cross-region-bridge"],
  },
  "/art/ai-visibility-is-not-value": {
    context: "critical",
    traversal: "critical",
    evidence: "medium",
    roles: ["series-overview", "lossy-intentional-compression"],
  },
  "/art/how-search-and-recommendation-systems-actually-work": {
    context: "high",
    traversal: "high",
    evidence: "medium",
    roles: ["selection-model", "cross-system-bridge"],
  },
  "/art/semantic-seo-is-graph-positioning": {
    context: "high",
    traversal: "high",
    evidence: "medium",
    roles: ["organising-proposition", "semantic-seo-bridge"],
  },
  "/art/who-benefits-most-from-this-system": {
    context: "high",
    traversal: "high",
    evidence: "low",
    roles: [
      "audience-definition",
      "suitability-map",
      "independent-operator-bridge",
    ],
  },
  "/art/the-citable-hard-to-exhaust-archive": {
    context: "high",
    traversal: "high",
    evidence: "medium",
    roles: ["archive-rationale", "platform-capture-response"],
  },
  "/art/representation-governance": {
    context: "high",
    traversal: "medium",
    evidence: "medium",
    roles: ["series-conclusion", "governance-model"],
  },
  "/art/structural-extraction-protocol": {
    context: "high",
    traversal: "high",
    evidence: "high",
    roles: ["executable-method", "llm-analysis-bridge"],
  },
  "/art/research-pipeline": {
    context: "high",
    traversal: "high",
    evidence: "high",
    roles: ["cross-project-methodology", "pipeline-compression"],
  },
};

export const AGENT_SEMANTIC_HUB_CONTENT = {
  "from-seo-keywords-to-the-haunted-machine": {
    purpose:
      "Worked instance of the whole site, joining technical research to creative identity.",
    progression: [
      "search problem",
      "data collection",
      "semantic graph",
      "structural interrogation",
      "hidden structure",
      "suppression and adjacency",
      "content strategy",
      "Haunted Machine",
      "artistic identity",
    ],
  },
  "ai-visibility-is-not-value": {
    purpose:
      "Intentional compression and routing layer for the nine-part AI visibility argument.",
    progression: [
      "optimisation",
      "eligibility",
      "selection",
      "representation and citation",
      "measurement",
      "value transfer",
      "retention and platform capture",
      "archive",
      "representation governance",
    ],
  },
  "how-search-and-recommendation-systems-actually-work": {
    purpose:
      "Common selection and representation model spanning search, recommendation and AI retrieval.",
  },
  "semantic-seo-is-graph-positioning": {
    purpose:
      "Organising proposition that page value is partly positional and originality can change relationships in the graph.",
  },
  "who-benefits-most-from-this-system": {
    purpose:
      "Defines who gains most from the system and routes independent creators, niche publishers, search strategists, research-led operators and experimental artists towards the most relevant methods and examples.",
  },
  "the-citable-hard-to-exhaust-archive": {
    purpose:
      "Explains the site's architectural response to platform capture through citability, depth and returnability.",
  },
  "representation-governance": {
    purpose:
      "Highest-order AI visibility conclusion connecting selection, omission, representation, attribution, reward and returnability.",
  },
  "structural-extraction-protocol": {
    purpose:
      "Turns structural analysis into an executable method based on recursive constraint, adversarial interrogation and collapse enforcement.",
  },
};

export const AGENT_RELATIONS = [
  { from: "home", type: "orients-to", to: "about" },
  { from: "home", type: "orients-to", to: "hidden-structure" },
  { from: "home", type: "routes-to", to: "art" },
  { from: "about", type: "demonstrated-by", to: "semantic-seo-lab" },
  { from: "about", type: "expressed-through", to: "art" },
  {
    from: "hidden-structure",
    type: "operationalised-by",
    to: "workflow-structure-breakdown",
  },
  { from: "hidden-structure", type: "implemented-by", to: "code" },
  { from: "hidden-structure", type: "extended-by", to: "datamining-llm" },
  {
    from: "workflow-structure-breakdown",
    type: "implemented-by",
    to: "code",
  },
  {
    from: "workflow-structure-breakdown",
    type: "tested-by",
    to: "semantic-seo-lab",
  },
  {
    from: "workflow-structure-breakdown",
    type: "produces-input-for",
    to: "content-strategy",
  },
  { from: "code", type: "supports", to: "content-strategy" },
  { from: "content-strategy", type: "organises", to: "art" },
  {
    from: "about",
    type: "developed-by",
    to: "/art/the-citable-hard-to-exhaust-archive",
  },
  {
    from: "about",
    type: "defines-audience-through",
    to: "/art/who-benefits-most-from-this-system",
  },
  {
    from: "about",
    type: "extended-by",
    to: "/art/representation-governance",
  },
  {
    from: "about",
    type: "demonstrated-by",
    to: "/art/from-seo-keywords-to-the-haunted-machine",
  },
  {
    from: "hidden-structure",
    type: "applied-to",
    to: "/art/how-search-and-recommendation-systems-actually-work",
  },
  {
    from: "hidden-structure",
    type: "operationalised-by",
    to: "/art/structural-extraction-protocol",
  },
  {
    from: "workflow-structure-breakdown",
    type: "compressed-by",
    to: "/art/research-pipeline",
  },
  {
    from: "semantic-seo-lab",
    type: "tests",
    to: "/art/semantic-seo-is-graph-positioning",
  },
  {
    from: "semantic-seo-lab",
    type: "evidence-for",
    to: "/art/semantic-seo-in-python-from-search-results-to-original-content-strategy",
  },
  {
    from: "content-strategy",
    type: "produced-through",
    to: "/art/from-seo-keywords-to-the-haunted-machine",
  },
  {
    from: "/art/ai-visibility-is-not-value",
    type: "depends-on",
    to: "/art/how-search-and-recommendation-systems-actually-work",
  },
  {
    from: "/art/ai-visibility-is-not-value",
    type: "resolves-towards",
    to: "/art/the-citable-hard-to-exhaust-archive",
  },
  {
    from: "/art/ai-visibility-is-not-value",
    type: "culminates-in",
    to: "/art/representation-governance",
  },
  { from: "art", type: "detailed-by", to: "/graph.json" },
];
