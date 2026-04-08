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

            const parsedContent = await parseMarkdown(rawContent);

            return {
                slug,
                title: data.title ?? slug,
                description: data.description ?? "",
                date: data.date
                    ? new Date(data.date).toISOString().slice(0, 10)
                    : "",
                tags: normaliseTags(data.tags),
                content: parsedContent,
            };
        })
    );

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}