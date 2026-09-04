import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parseMarkdown } from "../../components/markdown.js";
const POSTS_DIR = path.join(process.cwd(), "src/app/art/posts");

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/\.md$/, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function normaliseTags(tags = []) {
    return [...new Set(tags.map((tag) => slugify(tag)).filter(Boolean))];
}

function normaliseProjectOrder(value) {
    const order = Number(value);
    return Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER;
}

function normaliseProjects(data) {
    const configured = Array.isArray(data.projects) ? data.projects : [];
    const legacy = data.project
        ? [
              {
                  slug: data.project,
                  order: data.projectOrder,
                  role: data.projectRole,
              },
          ]
        : [];
    const memberships = new Map();

    for (const entry of [...configured, ...legacy]) {
        const rawSlug = typeof entry === "string" ? entry : entry?.slug;
        const slug = rawSlug ? slugify(String(rawSlug)) : "";

        if (!slug || memberships.has(slug)) continue;

        memberships.set(slug, {
            slug,
            order: normaliseProjectOrder(
                typeof entry === "string" ? undefined : entry.order
            ),
            role:
                typeof entry === "string" || !entry.role
                    ? "resource"
                    : slugify(String(entry.role)),
        });
    }

    return [...memberships.values()];
}

function stripHeadingMarkdown(value) {
    return value
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
        .replace(/[`*_~]/g, "")
        .trim();
}

function extractArticleHeadings(markdown) {
    const headings = [];
    const usedSlugs = new Map();
    let inCodeFence = false;

    for (const line of markdown.split(/\r?\n/)) {
        if (/^\s*(```|~~~)/.test(line)) {
            inCodeFence = !inCodeFence;
            continue;
        }

        if (inCodeFence) continue;

        const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);

        if (!match) continue;

        const text = stripHeadingMarkdown(match[2]);
        const baseId = slugify(text);
        const priorUses = usedSlugs.get(baseId) ?? 0;
        const id = priorUses ? `${baseId}-${priorUses + 1}` : baseId;

        usedSlugs.set(baseId, priorUses + 1);

        headings.push({
            id,
            level: match[1].length - 1,
            text,
        });
    }

    return headings;
}

function addHeadingIds(htmlContent, headings) {
    let headingIndex = 0;

    return htmlContent.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, text) => {
        const heading = headings[headingIndex];
        headingIndex += 1;

        if (!heading) return match;

        return `<h${level} id="${heading.id}">${text}</h${level}>`;
    });
}

export async function readArticles() {
    const filenames = fs
        .readdirSync(POSTS_DIR)
        .filter((file) => file.endsWith(".md"));

    const articles = await Promise.all(
        filenames.map(async (filename) => {
            const fullPath = path.join(POSTS_DIR, filename);
            const raw = fs.readFileSync(fullPath, "utf8");

            const { data, content: rawContent } = matter(raw);

            const slug = data.slug ? slugify(data.slug) : slugify(filename);

            const headings = extractArticleHeadings(rawContent);
            const parsedContent = addHeadingIds(
                await parseMarkdown(rawContent),
                headings
            );

            return {
                slug,
                title: data.title ?? slug,
                description: data.description ?? "",
                date: data.date
                    ? new Date(data.date).toISOString().slice(0, 10)
                    : "",
                tags: normaliseTags(data.tags),
                type: data.type ? slugify(String(data.type)) : "article",
                projects: normaliseProjects(data),
                medium: data.medium ? slugify(String(data.medium)) : "article",
                outline: data.showOutline ? headings : [],
                content: parsedContent,
            };
        })
    );

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}
