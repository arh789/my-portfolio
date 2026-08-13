import { visit } from "unist-util-visit";

const SHORTCODE_PATTERN = /^\{\{\s*(youtube|tiktok)\s+(.+?)\s*\}\}$/;
const ATTRIBUTE_PATTERN = /([a-zA-Z][\w-]*)="([^"]*)"/g;
const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;
const TIKTOK_VIDEO_ID_PATTERN = /^\d{16,25}$/;
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

function createYouTubeEmbedHtml({ id, title, orientation }) {
    const safeTitle = escapeAttribute(title);

    return [
        `<div class="youtube-embed youtube-embed--${orientation}">`,
        `  <iframe class="youtube-embed__frame" src="https://www.youtube-nocookie.com/embed/${id}" title="${safeTitle}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        "</div>",
    ].join("\n");
}

function createTikTokEmbedHtml({ id, title }) {
    const safeTitle = escapeAttribute(title);

    return [
        '<div class="tiktok-embed-frame">',
        `  <iframe class="tiktok-embed-frame__iframe" src="https://www.tiktok.com/embed/v2/${id}" title="${safeTitle}" loading="lazy" allow="encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
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

            const embedType = shortcodeMatch[1];
            const attributes = parseAttributes(shortcodeMatch[2]);
            const id = attributes.id;
            const title = attributes.title;

            if (!title) {
                throw new Error(`Missing title for ${embedType} video: ${id ?? "missing"}`);
            }

            if (embedType === "youtube") {
                const orientation = attributes.orientation ?? "landscape";

                if (!YOUTUBE_VIDEO_ID_PATTERN.test(id ?? "")) {
                    throw new Error(`Invalid YouTube video ID: ${id ?? "missing"}`);
                }

                if (!ORIENTATIONS.has(orientation)) {
                    throw new Error(`Invalid YouTube orientation for ${id}: ${orientation}`);
                }

                parent.children[index] = {
                    type: "html",
                    value: createYouTubeEmbedHtml({ id, title, orientation }),
                };

                return;
            }

            if (!TIKTOK_VIDEO_ID_PATTERN.test(id ?? "")) {
                throw new Error(`Invalid TikTok video ID: ${id ?? "missing"}`);
            }

            parent.children[index] = {
                type: "html",
                value: createTikTokEmbedHtml({ id, title }),
            };
        });
    };
}