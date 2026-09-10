import fs from "node:fs";
import path from "node:path";

import { readArticles } from "../src/app/art/lib/readArticles.js";
import {
  buildArticleGraph,
  buildTagCentrality,
  buildTagIndex,
} from "../src/app/art/lib/buildGraphData.js";
import {
  buildProjectGraph,
  buildProjectIndex,
} from "../src/app/art/lib/projectData.js";
import {
  SITE_BASE_URL,
  STATIC_SITE_PAGES,
} from "../src/app/siteManifest.js";
import {
  AGENT_PAGE_CONTENT,
  AGENT_PRIORITY_OVERRIDES,
  AGENT_RELATIONS,
  AGENT_SEMANTIC_HUB_CONTENT,
  CLAIM_STATUS,
} from "./agentPageContent.js";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const generatedAt = new Date().toISOString();

function absoluteUrl(route) {
  return new URL(route, SITE_BASE_URL).toString();
}

function latestDate(values) {
  return (
    values
      .filter(Boolean)
      .sort((left, right) => right.localeCompare(left))[0] ?? null
  );
}

function assertUnique(values, label) {
  const duplicates = values.filter(
    (value, index) => values.indexOf(value) !== index
  );

  if (duplicates.length) {
    throw new Error(
      "Duplicate " + label + ": " + [...new Set(duplicates)].join(", ")
    );
  }
}

function validateSourceData() {
  assertUnique(
    STATIC_SITE_PAGES.map((page) => page.id),
    "static page ids"
  );
  assertUnique(
    STATIC_SITE_PAGES.map((page) => page.path),
    "static page paths"
  );

  const pageIds = new Set(STATIC_SITE_PAGES.map((page) => page.id));
  const semanticIds = new Set(Object.keys(AGENT_PAGE_CONTENT));
  const missingContent = [...pageIds].filter((id) => !semanticIds.has(id));
  const orphanedContent = [...semanticIds].filter((id) => !pageIds.has(id));

  if (missingContent.length || orphanedContent.length) {
    throw new Error(
      [
        missingContent.length
          ? "Pages without agent content: " + missingContent.join(", ")
          : "",
        orphanedContent.length
          ? "Agent content without pages: " + orphanedContent.join(", ")
          : "",
      ]
        .filter(Boolean)
        .join(". ")
    );
  }

  const homeLinkedIds = STATIC_SITE_PAGES.filter(
    (page) => page.navigation
  ).map((page) => page.id);
  const homeLinkedWithoutContent = homeLinkedIds.filter(
    (id) => !semanticIds.has(id)
  );

  if (homeLinkedWithoutContent.length) {
    throw new Error(
      "Homepage links without compressed content: " +
        homeLinkedWithoutContent.join(", ")
    );
  }

  for (const relation of AGENT_RELATIONS) {
    for (const endpoint of [relation.from, relation.to]) {
      if (!endpoint.startsWith("/") && !pageIds.has(endpoint)) {
        throw new Error('Unknown agent-map relation endpoint "' + endpoint + '"');
      }
    }
  }
}

function renderSitemap(entries) {
  const rows = entries
    .map((entry) => {
      const fields = ["    <loc>" + escapeXml(entry.url) + "</loc>"];

      if (entry.lastModified) {
        fields.push("    <lastmod>" + entry.lastModified + "</lastmod>");
      }

      if (entry.priority !== undefined) {
        fields.push(
          "    <priority>" + entry.priority.toFixed(1) + "</priority>"
        );
      }

      return "  <url>\n" + fields.join("\n") + "\n  </url>";
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    rows,
    "</urlset>",
    "",
  ].join("\n");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function writeJson(filename, value) {
  const outputPath = path.join(PUBLIC_DIR, filename);
  fs.writeFileSync(outputPath, JSON.stringify(value, null, 2), "utf8");
  console.log(filename + " written to " + outputPath);
}

validateSourceData();

const articles = await readArticles();
const tagIndex = buildTagIndex(articles);
const articleGraph = buildArticleGraph(articles);
const projects = buildProjectIndex(articles);
const projectGraph = buildProjectGraph(projects);
const tagCentrality = buildTagCentrality(tagIndex);
const articleDates = new Map(
  articles.map((article) => [
    article.slug,
    article.lastModified || article.date || null,
  ])
);
const archiveLastModified = latestDate([...articleDates.values()]);

const graph = {
  generatedAt,
  articles: articles.map(
    ({ content, outline, lastModified, ...article }) => article
  ),
  tagIndex,
  tagCentrality,
  projects,
  graph: {
    ...articleGraph,
    projectNodes: projectGraph.nodes,
    projectEdges: projectGraph.edges,
  },
};

const staticPages = STATIC_SITE_PAGES.map((page) => {
  const { navigation, priority, lastModified, ...publicPage } = page;
  const resolvedLastModified =
    page.id === "art" ? archiveLastModified : lastModified;

  return {
    ...publicPage,
    url: absoluteUrl(page.path),
    indexing: {
      canonical: absoluteUrl(page.path),
      includeInSitemap: true,
      priority,
      lastModified: resolvedLastModified,
    },
    ...AGENT_PAGE_CONTENT[page.id],
  };
});

const staticUrlEntries = staticPages.map((page) => ({
  path: page.path,
  url: page.url,
  kind: page.kind,
  source: "/agent-map.json#pages/" + page.id,
  lastModified: page.indexing.lastModified,
  priority: page.indexing.priority,
}));

const articleUrlEntries = articles.map((article) => {
  const articlePath = "/art/" + article.slug;

  return {
    path: articlePath,
    url: absoluteUrl(articlePath),
    kind: "article",
    source: "/graph.json#articles/" + article.slug,
    lastModified: article.lastModified || article.date || null,
  };
});

const projectUrlEntries = projects.map((project) => {
  const projectPath = "/art/project/" + project.slug;
  const memberDates = [...project.chapters, ...project.resources].map(
    (article) => articleDates.get(article.slug)
  );

  return {
    path: projectPath,
    url: absoluteUrl(projectPath),
    kind: "project",
    source: "/graph.json#projects/" + project.slug,
    lastModified: latestDate(memberDates),
  };
});

const urlIndex = [
  ...staticUrlEntries,
  ...articleUrlEntries,
  ...projectUrlEntries,
];

const staticPagePaths = new Map(
  staticPages.map((page) => [page.id, page.path])
);

function buildAgentPriority(pagePath, structural, defaults) {
  const override = AGENT_PRIORITY_OVERRIDES[pagePath] ?? {};

  return {
    structural,
    context: override.context ?? defaults.context,
    traversal: override.traversal ?? defaults.traversal,
    evidence: override.evidence ?? defaults.evidence,
    roles: override.roles ?? defaults.roles,
  };
}

const siteGraphNodes = [
  ...staticPages.map((page) => {
    const agentPriority = buildAgentPriority(page.path, "core", {
      context: "medium",
      traversal: "medium",
      evidence: "medium",
      roles: ["core-page"],
    });

    return {
      id: page.path,
      pageId: page.id,
      path: page.path,
      url: page.url,
      kind: page.kind,
      title: page.title,
      summary: page.summary,
      agentPriority,
      source: "/agent-map.json#pages/" + page.id,
    };
  }),
  ...articles.map((article) => {
    const articlePath = "/art/" + article.slug;
    const agentPriority = buildAgentPriority(articlePath, "supporting", {
      context: "standard",
      traversal: article.projects.length ? "high" : "medium",
      evidence: "medium",
      roles: ["published-article"],
    });

    return {
      id: articlePath,
      path: articlePath,
      url: absoluteUrl(articlePath),
      kind: "article",
      title: article.title,
      summary: article.description,
      published: article.date,
      tags: article.tags,
      contentType: article.type,
      medium: article.medium,
      projects: article.projects,
      agentPriority,
      source: "/graph.json#articles/" + article.slug,
    };
  }),
  ...projects.map((project) => {
    const projectPath = "/art/project/" + project.slug;
    const agentPriority = buildAgentPriority(projectPath, "supporting", {
      context: "medium",
      traversal: "critical",
      evidence: "medium",
      roles: ["ordered-investigation", "guided-reading-path"],
    });

    return {
      id: projectPath,
      path: projectPath,
      url: absoluteUrl(projectPath),
      kind: "project",
      title: project.title,
      summary: project.description,
      introduction: project.introduction,
      articleCounts: {
        chapters: project.chapters.length,
        resources: project.resources.length,
      },
      agentPriority,
      source: "/graph.json#projects/" + project.slug,
    };
  }),
];

const articleBySlug = new Map(
  articles.map((article) => [article.slug, article])
);

const semanticHubs = Object.entries(AGENT_SEMANTIC_HUB_CONTENT).map(
  ([slug, compressedContent]) => {
    const article = articleBySlug.get(slug);

    if (!article) {
      throw new Error('Semantic hub article not found: "' + slug + '"');
    }

    const hubPath = "/art/" + slug;

    return {
      id: hubPath,
      path: hubPath,
      url: absoluteUrl(hubPath),
      title: article.title,
      summary: article.description,
      agentPriority: buildAgentPriority(hubPath, "supporting", {
        context: "high",
        traversal: "high",
        evidence: "medium",
        roles: ["semantic-hub"],
      }),
      ...compressedContent,
      source: "/graph.json#articles/" + slug,
    };
  }
);

const projectHubs = projects.map((project) => {
  const projectPath = "/art/project/" + project.slug;

  return {
    id: projectPath,
    path: projectPath,
    url: absoluteUrl(projectPath),
    title: project.title,
    summary: project.description,
    introduction: project.introduction,
    agentPriority: buildAgentPriority(projectPath, "supporting", {
      context: "medium",
      traversal: "critical",
      evidence: "medium",
      roles: ["ordered-investigation", "guided-reading-path"],
    }),
    sequence: project.chapters.map((article) => ({
      order: article.projectOrder,
      path: "/art/" + article.slug,
      title: article.title,
      role: article.projectRole,
    })),
    supportingResources: project.resources.map((article) => ({
      order: article.projectOrder,
      path: "/art/" + article.slug,
      title: article.title,
      role: article.projectRole,
    })),
    source: "/graph.json#projects/" + project.slug,
  };
});

const curatedPageEdges = AGENT_RELATIONS.map((relation) => ({
  source: staticPagePaths.get(relation.from) ?? relation.from,
  target: staticPagePaths.get(relation.to) ?? relation.to,
  type: relation.type,
})).filter(
  (edge) => edge.source !== "/graph.json" && edge.target !== "/graph.json"
);

const archiveEdges = [
  ...articles.map((article) => ({
    source: "/art",
    target: "/art/" + article.slug,
    type: "contains-article",
  })),
  ...projects.map((project) => ({
    source: "/art",
    target: "/art/project/" + project.slug,
    type: "contains-project",
  })),
];

const projectEdges = projectGraph.edges.map((edge) => ({
  source: edge.source.startsWith("project:")
    ? "/art/project/" + edge.source.slice("project:".length)
    : "/art/" + edge.source,
  target: edge.target.startsWith("project:")
    ? "/art/project/" + edge.target.slice("project:".length)
    : "/art/" + edge.target,
  type: edge.type,
  ...(edge.project ? { project: edge.project } : {}),
}));

const siteGraph = {
  purpose:
    "Complete page-level map. Every indexed page is a node; semanticHubs and projectHubs provide progressive resolution without giving every page equal detail.",
  agentPriorityDimensions: {
    structural:
      "Whether a page defines the site's formal architecture (core) or develops it (supporting).",
    context:
      "How much of the site's conceptual structure the page compresses.",
    traversal:
      "How useful the page is for routing an agent through related arguments.",
    evidence:
      "How strongly the page grounds claims in implementation, recorded observations or procedural detail.",
    roles: "The page's specific functions in the site's semantic system.",
  },
  nodes: siteGraphNodes,
  edges: [...curatedPageEdges, ...archiveEdges, ...projectEdges],
};

assertUnique(
  articles.map((article) => article.slug),
  "article slugs"
);
assertUnique(
  projects.map((project) => project.slug),
  "project slugs"
);
assertUnique(
  urlIndex.map((entry) => entry.path),
  "generated URL paths"
);
assertUnique(
  siteGraph.nodes.map((node) => node.id),
  "site graph node ids"
);

const indexedPaths = new Set(urlIndex.map((entry) => entry.path));
const siteGraphNodeIds = new Set(siteGraph.nodes.map((node) => node.id));
const missingSiteGraphNodes = [...indexedPaths].filter(
  (entryPath) => !siteGraphNodeIds.has(entryPath)
);
const nonIndexedSiteGraphNodes = [...siteGraphNodeIds].filter(
  (nodeId) => !indexedPaths.has(nodeId)
);
const unknownAgentPriorityPaths = Object.keys(AGENT_PRIORITY_OVERRIDES).filter(
  (entryPath) => !indexedPaths.has(entryPath)
);
const unknownSiteGraphEndpoints = siteGraph.edges.flatMap((edge) =>
  [edge.source, edge.target].filter(
    (endpoint) => !siteGraphNodeIds.has(endpoint)
  )
);

if (
  missingSiteGraphNodes.length ||
  nonIndexedSiteGraphNodes.length ||
  unknownAgentPriorityPaths.length ||
  unknownSiteGraphEndpoints.length
) {
  throw new Error(
    [
      missingSiteGraphNodes.length
        ? "Indexed paths without site graph nodes: " +
          missingSiteGraphNodes.join(", ")
        : "",
      nonIndexedSiteGraphNodes.length
        ? "Site graph nodes without indexed paths: " +
          nonIndexedSiteGraphNodes.join(", ")
        : "",
      unknownAgentPriorityPaths.length
        ? "Agent-priority paths without indexed pages: " +
          unknownAgentPriorityPaths.join(", ")
        : "",
      unknownSiteGraphEndpoints.length
        ? "Unknown site graph edge endpoints: " +
          [...new Set(unknownSiteGraphEndpoints)].join(", ")
        : "",
    ]
      .filter(Boolean)
      .join(". ")
  );
}

const agentMap = {
  schemaVersion: 4,
  generatedAt,
  site: {
    name: "Decrepit Filth",
    url: SITE_BASE_URL,
    scope:
      "Grotesque art, Semantic SEO, AI visibility, structural analysis, code and content strategy.",
  },
  agentInstructions: {
    default:
      "Start with pages, semanticHubs, projectHubs and siteGraph to understand the whole site cheaply. Agent priority separates structural, contextual, traversal and evidence value.",
    articleDiscovery:
      "Resolve from semanticHubs or projectHubs into siteGraph, then use graph.json for detailed article metadata, tags and shared-tag relationships. Fetch HTML only when full-resolution content is required.",
    fetchSourceWhen: [
      "verbatim wording or quotations are required",
      "implementation details or code are required",
      "an individual article's full argument is required",
      "a claim must be independently evaluated",
    ],
  },
  resources: {
    sitemap: "/sitemap.xml",
    articleGraph: "/graph.json",
    pageMap: "/agent-map.json",
    siteGraph: "/agent-map.json#siteGraph",
  },
  claimStatus: CLAIM_STATUS,
  counts: {
    corePages: staticPages.length,
    articles: articles.length,
    projects: projects.length,
    indexedUrls: urlIndex.length,
    siteGraphNodes: siteGraph.nodes.length,
    siteGraphEdges: siteGraph.edges.length,
    semanticHubs: semanticHubs.length,
    projectHubs: projectHubs.length,
  },
  pages: staticPages,
  semanticHubs,
  projectHubs,
  relations: curatedPageEdges,
  siteGraph,
  urlIndex,
};

writeJson("graph.json", graph);
writeJson("agent-map.json", agentMap);

const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
fs.writeFileSync(sitemapPath, renderSitemap(urlIndex), "utf8");
console.log("sitemap.xml written to " + sitemapPath);
console.log(
  "Generated " +
    staticPages.length +
    " core pages, " +
    articles.length +
    " articles, " +
    projects.length +
    " projects and " +
    urlIndex.length +
    " sitemap URLs."
);
