import fs from "node:fs";
import path from "node:path";

import { readArticles } from "../src/app/art/lib/readArticles.js";
import {
  buildTagIndex,
  buildArticleGraph,
  buildTagCentrality,
} from "../src/app/art/lib/buildGraphData.js";
import {
  buildProjectGraph,
  buildProjectIndex,
} from "../src/app/art/lib/projectData.js";

const articles = await readArticles();

const tagIndex = buildTagIndex(articles);
const articleGraph = buildArticleGraph(articles);
const projects = buildProjectIndex(articles);
const projectGraph = buildProjectGraph(projects);
const graph = {
  ...articleGraph,
  projectNodes: projectGraph.nodes,
  projectEdges: projectGraph.edges,
};
const tagCentrality = buildTagCentrality(tagIndex);

const output = {
  generatedAt: new Date().toISOString(),
  articles: articles.map(({ content, ...article }) => article),
  tagIndex,
  tagCentrality,
  projects,
  graph,
};

const outputPath = path.join(process.cwd(), "public", "graph.json");

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf8");

console.log(`graph.json written to ${outputPath}`);
