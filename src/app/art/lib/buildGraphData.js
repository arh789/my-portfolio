export function buildTagIndex(articles) {
  const tagIndex = {};

  for (const article of articles) {
    for (const tag of article.tags) {
      if (!tagIndex[tag]) tagIndex[tag] = [];

      tagIndex[tag].push({
        slug: article.slug,
        title: article.title,
        description: article.description,
        date: article.date,
        tags: article.tags,
      });
    }
  }

  return tagIndex;
}

export function buildArticleGraph(articles) {
  const nodes = articles.map((article) => ({
    id: article.slug,
    label: article.title,
    type: "article",
    tags: article.tags,
  }));

  const edges = [];
  const centrality = Object.fromEntries(articles.map((a) => [a.slug, 0]));

  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const a = articles[i];
      const b = articles[j];

      const sharedTags = a.tags.filter((tag) => b.tags.includes(tag));
      const weight = sharedTags.length;

      if (weight > 0) {
        edges.push({
          source: a.slug,
          target: b.slug,
          weight,
          tags: sharedTags,
        });

        centrality[a.slug] += weight;
        centrality[b.slug] += weight;
      }
    }
  }

  return {
    nodes: nodes.map((node) => ({
      ...node,
      centrality: centrality[node.id] ?? 0,
    })),
    edges,
  };
}

export function buildTagCentrality(tagIndex) {
  return Object.entries(tagIndex)
    .map(([tag, articles]) => ({
      tag,
      count: articles.length,
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}