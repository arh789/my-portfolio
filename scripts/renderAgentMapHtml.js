function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function humanizeKey(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function renderScalar(value) {
  if (value === null || value === undefined) {
    return '<span class="empty-value">Not specified</span>';
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  const text = String(value);
  const escapedText = escapeHtml(text);

  if (text.startsWith("/") || /^https?:\/\//.test(text)) {
    return '<a href="' + escapeHtml(text) + '">' + escapedText + "</a>";
  }
  return escapedText;
}

function renderStructuredValue(value) {
  if (Array.isArray(value)) {
    if (!value.length) {
      return '<span class="empty-value">None</span>';
    }
    return (
      '<ol class="structured-list">' +
      value.map((item) => "<li>" + renderStructuredValue(item) + "</li>").join("") +
      "</ol>"
    );
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) {
      return '<span class="empty-value">None</span>';
    }
    return (
      '<dl class="structured-data">' +
      entries
        .map(
          ([key, item]) =>
            "<dt>" +
            escapeHtml(humanizeKey(key)) +
            "</dt><dd>" +
            renderStructuredValue(item) +
            "</dd>"
        )
        .join("") +
      "</dl>"
    );
  }

  return renderScalar(value);
}

function withoutKeys(record, keys) {
  return Object.fromEntries(
    Object.entries(record).filter(([key]) => !keys.includes(key))
  );
}

function renderRecordCollection(records, { idKey, className }) {
  return records
    .map((record, index) => {
      const id = record[idKey];
      const title = record.title ?? id;
      const url = record.url ?? record.path;
      const heading = url
        ? '<a href="' + escapeHtml(url) + '">' + escapeHtml(title) + "</a>"
        : escapeHtml(title);

      return (
        '<article class="' +
        className +
        '" data-record-index="' +
        index +
        '" data-record-id="' +
        escapeHtml(id) +
        '"><h3>' +
        heading +
        "</h3>" +
        renderStructuredValue(withoutKeys(record, [idKey, "title", "url"])) +
        "</article>"
      );
    })
    .join("");
}

function renderGraphEdges(edges, nodeById, className) {
  return (
    '<ol class="edge-list">' +
    edges
      .map((edge, index) => {
        const source = nodeById.get(edge.source);
        const target = nodeById.get(edge.target);
        const sourceLabel = source?.title ?? edge.source;
        const targetLabel = target?.title ?? edge.target;
        const sourceLink = source?.url
          ? '<a href="' +
            escapeHtml(source.url) +
            '">' +
            escapeHtml(sourceLabel) +
            "</a>"
          : escapeHtml(sourceLabel);
        const targetLink = target?.url
          ? '<a href="' +
            escapeHtml(target.url) +
            '">' +
            escapeHtml(targetLabel) +
            "</a>"
          : escapeHtml(targetLabel);
        const edgeMetadata = withoutKeys(edge, ["source", "target", "type"]);

        return (
          '<li class="' +
          className +
          '" data-edge-index="' +
          index +
          '" data-source="' +
          escapeHtml(edge.source) +
          '" data-target="' +
          escapeHtml(edge.target) +
          '" data-type="' +
          escapeHtml(edge.type) +
          '">' +
          sourceLink +
          ' <span class="relationship">' +
          escapeHtml(edge.type) +
          "</span> " +
          targetLink +
          (Object.keys(edgeMetadata).length
            ? renderStructuredValue(edgeMetadata)
            : "") +
          "</li>"
        );
      })
      .join("") +
    "</ol>"
  );
}

export function renderAgentMapHtml(agentMap) {
  const nodeById = new Map(
    agentMap.siteGraph.nodes.map((node) => [node.id, node])
  );
  const resourceDescriptions = {
    sitemap: "Canonical XML inventory of indexed content pages.",
    articleGraph: "Canonical JSON article and project graph.",
    articleGraphHtml: "HTML article and project graph view.",
    pageMap: "Authoritative structured representation of this agent map.",
    pageMapHtml: "This semantically equivalent HTML compatibility projection.",
    siteGraph: "Direct pointer to the complete page-level graph in agent-map.json.",
  };
  const resources = Object.entries(agentMap.resources)
    .map(
      ([name, resource]) =>
        "<li><strong>" +
        escapeHtml(humanizeKey(name)) +
        ':</strong> <a href="' +
        escapeHtml(resource) +
        '">' +
        escapeHtml(resource) +
        "</a> — " +
        escapeHtml(resourceDescriptions[name] ?? "Related discovery resource.") +
        "</li>"
    )
    .join("");
  const urlEntries = agentMap.urlIndex
    .map(
      (entry, index) =>
        '<li class="url-entry" data-url-index="' +
        index +
        '" data-path="' +
        escapeHtml(entry.path) +
        '"><h3><a href="' +
        escapeHtml(entry.url) +
        '">' +
        escapeHtml(entry.path) +
        "</a></h3>" +
        renderStructuredValue(withoutKeys(entry, ["path", "url"])) +
        "</li>"
    )
    .join("");

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>Decrepit Filth Agent Map — HTML Projection</title>",
    '<meta name="description" content="Complete HTML compatibility projection of the generated Decrepit Filth agent map.">',
    '<link rel="alternate" type="application/json" href="/agent-map.json" title="Authoritative agent map JSON">',
    "<style>",
    ":root{color-scheme:light dark;font-family:system-ui,sans-serif;line-height:1.5}",
    "body{max-width:92rem;margin:0 auto;padding:1.5rem}",
    "nav ul{display:flex;flex-wrap:wrap;gap:.5rem 1rem;padding-left:1rem}",
    "section{border-top:1px solid #7775;margin-top:2rem;padding-top:1rem}",
    "article,.url-entry,.edge-list>li{border:1px solid #7775;margin:1rem 0;padding:1rem}",
    "h2,h3{overflow-wrap:anywhere}a{color:inherit;text-decoration-thickness:.08em}",
    "dl{display:grid;grid-template-columns:minmax(10rem,18rem) minmax(0,1fr);gap:.35rem 1rem;margin:.75rem 0}",
    "dt{font-weight:700}dd{margin:0;min-width:0;overflow-wrap:anywhere}",
    ".structured-data .structured-data{grid-template-columns:minmax(8rem,14rem) minmax(0,1fr)}",
    ".structured-list{margin:.35rem 0;padding-left:1.5rem}",
    ".relationship{font-family:ui-monospace,monospace;font-weight:700}",
    ".empty-value{opacity:.7}",
    "@media(max-width:700px){dl,.structured-data .structured-data{display:block}dt{margin-top:.6rem}}",
    "</style>",
    "</head>",
    "<body><main>",
    "<header>",
    "<p>HTML compatibility projection</p>",
    "<h1>" + escapeHtml(agentMap.site.name) + " Agent Map</h1>",
    "<p>" + escapeHtml(agentMap.site.scope) + "</p>",
    '<p>This document and <a href="/agent-map.json">agent-map.json</a> are emitted from the same source data during one build. The JSON representation is authoritative; this page exposes the same site-level map as ordinary HTML for browsing tools that cannot retrieve raw JSON.</p>',
    renderStructuredValue({
      schemaVersion: agentMap.schemaVersion,
      generatedAt: agentMap.generatedAt,
      siteUrl: agentMap.site.url,
    }),
    "</header>",
    '<nav aria-label="Agent map sections"><h2>Contents</h2><ul>',
    '<li><a href="#resources">Resources</a></li>',
    '<li><a href="#instructions">Agent instructions</a></li>',
    '<li><a href="#interpretation">Interpretation policy</a></li>',
    '<li><a href="#core-pages">Core pages</a></li>',
    '<li><a href="#semantic-hubs">Semantic hubs</a></li>',
    '<li><a href="#project-hubs">Project hubs</a></li>',
    '<li><a href="#site-graph-nodes">Site graph nodes</a></li>',
    '<li><a href="#site-graph-edges">Site graph edges</a></li>',
    '<li><a href="#url-index">URL index</a></li>',
    "</ul></nav>",
    '<section id="resources"><h2>Resources</h2><ul>' + resources + "</ul></section>",
    '<section id="instructions"><h2>Agent instructions</h2>' +
      renderStructuredValue(agentMap.agentInstructions) +
      "</section>",
    '<section id="interpretation"><h2>Interpretation policy</h2>' +
      renderStructuredValue(agentMap.interpretationPolicy) +
      "</section>",
    '<section id="source-locators"><h2>Source locator schema</h2>' +
      renderStructuredValue(agentMap.sourceLocatorSchema) +
      "</section>",
    '<section id="claim-status"><h2>Claim status</h2>' +
      renderStructuredValue(agentMap.claimStatus) +
      "</section>",
    '<section id="counts"><h2>Counts</h2>' +
      renderStructuredValue(agentMap.counts) +
      "</section>",
    '<section id="core-pages"><h2>Core pages</h2><p>These pages define the formal architecture or primary navigation of the site.</p>' +
      renderRecordCollection(agentMap.pages, {
        idKey: "id",
        className: "core-page",
      }) +
      "</section>",
    '<section id="semantic-hubs"><h2>Semantic hubs</h2><p>' +
      escapeHtml(agentMap.semanticHubSelectionRule) +
      "</p>" +
      renderRecordCollection(agentMap.semanticHubs, {
        idKey: "id",
        className: "semantic-hub",
      }) +
      "</section>",
    '<section id="project-hubs"><h2>Project hubs</h2><p>Ordered investigations and guided reading paths through supporting material.</p>' +
      renderRecordCollection(agentMap.projectHubs, {
        idKey: "id",
        className: "project-hub",
      }) +
      "</section>",
    '<section id="relations"><h2>Curated relations</h2>' +
      renderGraphEdges(agentMap.relations, nodeById, "curated-relation") +
      "</section>",
    '<section id="site-graph"><h2>Complete site graph</h2><p>' +
      escapeHtml(agentMap.siteGraph.purpose) +
      "</p><h3>Architecture roles</h3>" +
      renderStructuredValue(agentMap.siteGraph.architectureRoles) +
      "<h3>Agent priority dimensions</h3>" +
      renderStructuredValue(agentMap.siteGraph.agentPriorityDimensions) +
      '<section id="site-graph-nodes"><h3>Site graph nodes</h3>' +
      renderRecordCollection(agentMap.siteGraph.nodes, {
        idKey: "id",
        className: "site-node",
      }) +
      "</section>" +
      '<section id="site-graph-edges"><h3>Site graph edges</h3>' +
      renderGraphEdges(agentMap.siteGraph.edges, nodeById, "site-edge") +
      "</section></section>",
    '<section id="url-index"><h2>Complete URL index</h2><ol>' +
      urlEntries +
      "</ol></section>",
    '<footer><p>Generated at <time datetime="' +
      escapeHtml(agentMap.generatedAt) +
      '">' +
      escapeHtml(agentMap.generatedAt) +
      '</time>. <a href="/agent-map.json">Use the authoritative JSON representation when available.</a></p></footer>',
    "</main></body>",
    "</html>",
    "",
  ].join("\n");
}

export function validateAgentMapHtml(html, agentMap) {
  const expectedCounts = {
    'class="core-page"': agentMap.pages.length,
    'class="semantic-hub"': agentMap.semanticHubs.length,
    'class="project-hub"': agentMap.projectHubs.length,
    'class="site-node"': agentMap.siteGraph.nodes.length,
    'class="site-edge"': agentMap.siteGraph.edges.length,
    'class="url-entry"': agentMap.urlIndex.length,
  };

  for (const [marker, expected] of Object.entries(expectedCounts)) {
    const actual = html.split(marker).length - 1;

    if (actual !== expected) {
      throw new Error(
        "agent-map.html contains " +
          actual +
          " instances of " +
          marker +
          "; expected " +
          expected
      );
    }
  }

  for (const node of agentMap.siteGraph.nodes) {
    const marker = 'data-record-id="' + escapeHtml(node.id) + '"';
    if (!html.includes(marker)) {
      throw new Error("agent-map.html is missing site graph node " + node.id);
    }
  }
}