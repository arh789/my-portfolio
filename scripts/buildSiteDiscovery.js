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
  AGENT_RELATIONS,
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

const agentMap = {
  schemaVersion: 2,
  generatedAt,
  site: {
    name: "Decrepit Filth",
    url: SITE_BASE_URL,
    scope:
      "Grotesque art, Semantic SEO, AI visibility, structural analysis, code and content strategy.",
  },
  agentInstructions: {
    default:
      "Use this file for site orientation, compressed core-page content and URL discovery before fetching HTML.",
    articleDiscovery:
      "Use graph.json for article metadata, tags, projects and graph relationships.",
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
  },
  claimStatus: CLAIM_STATUS,
  counts: {
    corePages: staticPages.length,
    articles: articles.length,
    projects: projects.length,
    indexedUrls: urlIndex.length,
  },
  pages: staticPages,
  relations: AGENT_RELATIONS,
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
