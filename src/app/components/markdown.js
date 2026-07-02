import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import remarkYouTubeEmbed from "./remarkYouTubeEmbed.js";

export async function parseMarkdown(markdown) {
    const result = await remark()
        .use(remarkGfm)
        .use(remarkYouTubeEmbed)
        .use(html, { sanitize: false })
        .process(markdown);

    return result.toString();
}
