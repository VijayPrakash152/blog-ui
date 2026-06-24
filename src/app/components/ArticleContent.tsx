"use client";
import { useEffect, useMemo } from "react";
import { TocItem } from "./ArticleTOC";

interface ArticleContentProps {
  html: string;
  onHeadingsChange: (items: TocItem[]) => void;
}

const normalizeId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const ArticleContent = ({ html, onHeadingsChange }: ArticleContentProps) => {
  const parsedHtml = useMemo(() => {
    const headings: TocItem[] = [];

    let transformed = html.replace(/<(h[23])>(.*?)<\/\1>/gi, (_, tag, content) => {
      const text = content.replace(/<[^>]+>/g, "").trim();
      const id = normalizeId(text);
      headings.push({
        id,
        title: text,
        level: tag.toLowerCase() === "h2" ? 2 : 3,
      });
      return `<${tag} id="${id}">${content}</${tag}>`;
    });

    transformed = transformed.replace(
      /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
      (_, attrs, codeContent) => {
        return `
          <div class="article-code-wrapper">
            <button type="button" data-copy-code class="copy-code-button">Copy</button>
            <pre><code${attrs}>${codeContent}</code></pre>
          </div>
        `;
      }
    );

    onHeadingsChange(headings);
    return transformed;
  }, [html, onHeadingsChange]);

  useEffect(() => {
    const contentRoot = document.getElementById("article-content-root");
    if (!contentRoot) return;

    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const button = target.closest("button[data-copy-code]") as HTMLButtonElement | null;
      if (!button) return;

      const codeBlock = button.nextElementSibling as HTMLElement | null;
      if (!codeBlock) return;

      const code = codeBlock.innerText;
      await navigator.clipboard.writeText(code);
      button.textContent = "Copied";
      button.classList.add("copy-code-success");
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.classList.remove("copy-code-success");
      }, 1600);
    };

    contentRoot.addEventListener("click", handleClick);
    return () => contentRoot.removeEventListener("click", handleClick);
  }, [parsedHtml]);

  return (
    <div
      id="article-content-root"
      className="article-body"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};

export default ArticleContent;
