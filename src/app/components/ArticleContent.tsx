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
  const { parsedHtml, headings } = useMemo(() => {
    const headings: TocItem[] = [];

    const transformed = html.replace(/<(h[23])>(.*?)<\/\1>/gi, (_, tag, content) => {
      const text = content.replace(/<[^>]+>/g, "").trim();
      const id = normalizeId(text);
      headings.push({
        id,
        title: text,
        level: tag.toLowerCase() === "h2" ? 2 : 3,
      });
      return `<${tag} id="${id}">${content}</${tag}>`;
    });

    return {
      parsedHtml: transformed,
      headings,
    };
  }, [html]);

  useEffect(() => {
    onHeadingsChange(headings);
  }, [headings, onHeadingsChange]);

  return (
    <div
      id="article-content-root"
      className="article-body mx-auto max-w-3xl"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};

export default ArticleContent;
