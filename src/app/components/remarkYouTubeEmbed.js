import { visit } from "unist-util-visit";

const SHORTCODE_PATTERN = /^\{\{\s*youtube\s+(.+?)\s*\}\}$/;
const ATTRIBUTE_PATTERN = /([a-zA-Z][\w-]*)="([^"]*)"/g;
const VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const ORIENTATIONS = new Set(["landscape", "portrait"]);

function escapeAttribute(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function parseAttributes(source) {
    const attributes = {};

    for (const match of source.matchAll(ATTRIBUTE_PATTERN)) {
        attributes[match[1]] = match[2];
    }

    return attributes;
}

function createEmbedHtml({ id, title, orientation }) {
    const safeTitle = escapeAttribute(title);

    return [
        `<div class="youtube-embed youtube-embed--${orientation}">`,
        `  <iframe class="youtube-embed__frame" src="https://www.youtube-nocookie.com/embed/${id}" title="${safeTitle}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        "</div>",
    ].join("\n");
}

export default function remarkYouTubeEmbed() {
    return (tree) => {
        visit(tree, "paragraph", (node, index, parent) => {
            if (!parent || typeof index !== "number" || node.children.length !== 1) {
                return;
            }

            const child = node.children[0];
            if (child.type !== "text") return;

            const shortcodeMatch = child.value.trim().match(SHORTCODE_PATTERN);
            if (!shortcodeMatch) return;

            const attributes = parseAttributes(shortcodeMatch[1]);
            const id = attributes.id;
            const title = attributes.title;
            const orientation = attributes.orientation ?? "landscape";

            if (!VIDEO_ID_PATTERN.test(id ?? "")) {
                throw new Error(`Invalid YouTube video ID: ${id ?? "missing"}`);
            }

            if (!title) {
                throw new Error(`Missing title for YouTube video: ${id}`);
            }

            if (!ORIENTATIONS.has(orientation)) {
                throw new Error(`Invalid YouTube orientation for ${id}: ${orientation}`);
            }

            parent.children[index] = {
                type: "html",
                value: createEmbedHtml({ id, title, orientation }),
            };
        });
    };
}
