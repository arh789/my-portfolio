import fs from "node:fs/promises";
import path from "node:path";

import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

const NOTEBOOK_PATH = path.join(
    process.cwd(),
    "src",
    "app",
    "semantic-seo-lab",
    "semantic-seo-classical-method-baseline.executed.ipynb",
);

function sourceToText(source) {
    if (Array.isArray(source)) {
        return source.join("");
    }

    return source ?? "";
}

function outputDataToText(value) {
    if (Array.isArray(value)) {
        return value.join("");
    }

    return value ?? "";
}

function stripInlineMarkdown(text) {
    return text
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*_~]/g, "")
        .replace(/<[^>]+>/g, "")
        .trim();
}

function uppercaseFirstLetter(text) {
    return text.replace(/[A-Za-z]/, (letter) => letter.toUpperCase());
}

function displayHeadingText(text) {
    const stripped = stripInlineMarkdown(text)
        .replace(/^Part B supervision note:\s*/i, "")
        .replace(/^13\.\s+Output manifest$/i, "Output manifest")
        .trim();

    return uppercaseFirstLetter(stripped);
}

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function slugBase(text) {
    const slug = displayHeadingText(text)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "section";
}

function createSlugger() {
    const seen = new Map();

    return function slugify(text) {
        const base = slugBase(text);
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);

        return count === 0 ? base : `${base}-${count + 1}`;
    };
}

function shouldSkipCell(cell) {
    const source = sourceToText(cell.source);

    return (
        /^##\s+13\.\s+Output manifest\s*$/im.test(source) ||
        source.includes("# Purpose: Write an output manifest")
    );
}

function getHeadings(markdown, slugify) {
    const headings = [];
    let inFence = false;

    for (const line of markdown.split("\n")) {
        if (line.trim().startsWith("```")) {
            inFence = !inFence;
            continue;
        }

        if (inFence) {
            continue;
        }

        const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
        if (!match) {
            continue;
        }

        const level = match[1].length;
        const rawText = match[2].trim();
        const text = displayHeadingText(rawText);
        headings.push({
            level,
            text,
            slug: slugify(rawText),
        });
    }

    return headings;
}

function injectHeadingIds(markdown, headings) {
    let inFence = false;
    let headingIndex = 0;

    return markdown
        .split("\n")
        .map((line) => {
            if (line.trim().startsWith("```")) {
                inFence = !inFence;
                return line;
            }

            if (inFence) {
                return line;
            }

            const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
            if (!match) {
                return line;
            }

            const heading = headings[headingIndex];
            headingIndex += 1;

            if (!heading) {
                return line;
            }

            return `<h${heading.level} id="${heading.slug}">${escapeHtml(
                heading.text,
            )}</h${heading.level}>`;
        })
        .join("\n");
}

function markSpecialLabels(html) {
    return html.replace(
        /<p><strong>(Human supervision question|Codex response|Keyword research question|Method question):<\/strong>(.*?)<\/p>/g,
        (_, label, rest) => {
            if (label === "Codex response") {
                return `<p class="supervisionLabel supervisionLabel--codex"><strong>${label}:</strong>${rest}</p>`;
            }

            if (label === "Human supervision question") {
                return `<p class="supervisionLabel supervisionLabel--human"><strong>${label}:</strong>${rest}</p>`;
            }

            const kind = label === "Method question" ? "method" : "keyword";
            return `<p class="questionLabel questionLabel--${kind}"><strong>${label}:</strong>${rest}</p>`;
        },
    );
}

async function renderMarkdown(markdown, headings) {
    const withHeadingIds = injectHeadingIds(markdown, headings);
    const result = await remark()
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .process(withHeadingIds);

    return markSpecialLabels(result.toString());
}

function figurePath(cellIndex, outputIndex) {
    const cell = String(cellIndex).padStart(3, "0");
    const output = String(outputIndex).padStart(2, "0");

    return `/semantic-seo-lab/figures/cell-${cell}-output-${output}.png`;
}

function normaliseOutput(output, cellIndex, outputIndex) {
    if (output.output_type === "stream") {
        return {
            type: "stream",
            label: output.name === "stderr" ? "stderr" : "stdout",
            text: outputDataToText(output.text),
        };
    }

    const data = output.data ?? {};

    if (data["image/png"]) {
        return {
            type: "image",
            label: "figure",
            src: figurePath(cellIndex, outputIndex),
        };
    }

    if (data["text/html"]) {
        return {
            type: "html",
            label: "html output",
            html: outputDataToText(data["text/html"]),
        };
    }

    if (data["text/plain"]) {
        return {
            type: "plain",
            label: "text output",
            text: outputDataToText(data["text/plain"]),
        };
    }

    return {
        type: "plain",
        label: output.output_type ?? "output",
        text: JSON.stringify(output, null, 2),
    };
}

export async function loadNotebook() {
    const notebook = JSON.parse(await fs.readFile(NOTEBOOK_PATH, "utf8"));
    const slugify = createSlugger();
    const headings = [];
    const cells = [];

    for (const [cellIndex, cell] of notebook.cells.entries()) {
        if (shouldSkipCell(cell)) {
            continue;
        }

        if (cell.cell_type === "markdown") {
            const markdown = sourceToText(cell.source);
            const cellHeadings = getHeadings(markdown, slugify);
            headings.push(...cellHeadings);
            cells.push({
                id: `cell-${cellIndex}`,
                type: "markdown",
                html: await renderMarkdown(markdown, cellHeadings),
                headings: cellHeadings,
            });
            continue;
        }

        if (cell.cell_type === "code") {
            cells.push({
                id: `cell-${cellIndex}`,
                type: "code",
                executionCount: cell.execution_count,
                source: sourceToText(cell.source).trimEnd(),
                outputs: (cell.outputs ?? []).map((output, outputIndex) =>
                    normaliseOutput(output, cellIndex, outputIndex),
                ),
            });
        }
    }

    return {
        metadata: notebook.metadata ?? {},
        cells,
        headings,
    };
}