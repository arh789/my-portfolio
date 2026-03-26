import { remark } from 'remark'; // Correct import for the named export
import html from 'remark-html';  // Import the HTML processor for markdown

export async function parseMarkdown(markdown) {
    const processor = remark().use(html);  // Use the html plugin on the processor
    const result = await processor.process(markdown);  // Process the markdown to HTML
    return result.toString();  // Convert the markdown to HTML string
}
