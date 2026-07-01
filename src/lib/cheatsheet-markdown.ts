import { remark } from 'remark';
import remarkHtml from 'remark-html';
import rehypeHighlight from 'rehype-highlight';
import rehypePrismPlus from 'rehype-prism-plus';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';

export async function cheatsheetMarkdownToHtml(markdown: string): Promise<string> {
  if (!markdown) {
    return '';
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypePrismPlus)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
