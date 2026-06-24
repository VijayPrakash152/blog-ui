"use client";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface ArticleTOCProps {
  headings: TocItem[];
  activeId: string;
}

export const ArticleTOC = ({ headings, activeId }: ArticleTOCProps) => {
  return (
    <nav aria-label="Table of contents" className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#7C61FF]">
        On this page
      </p>
      <div className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block rounded-2xl px-4 py-3 text-sm transition hover:bg-white/5",
              heading.level === 3 && "ml-4",
              heading.id === activeId
                ? "bg-white/10 text-white"
                : "text-slate-400"
            )}
          >
            {heading.title}
          </a>
        ))}
      </div>
    </nav>
  );
};
