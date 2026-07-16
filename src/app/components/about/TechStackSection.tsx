"use client";

import { Card } from "@/components/ui/card";
import type { TechCategory } from "./tech-stack-data";

interface TechStackSectionProps {
  categories: TechCategory[];
}

const TechStackSection = ({ categories }: TechStackSectionProps) => {
  if (!categories.length) {
    return null;
  }

  return (
    <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-0" hoverable={false}>
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0E1628] px-5 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Tech Stack</p>
          <p className="mt-1 text-xs text-slate-400">Extension-style catalog of the technologies used in this workspace.</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
          {categories.length} categories
        </div>
      </div>

      <div className="max-h-[32rem] overflow-auto p-4">
        <div className="space-y-3">
          {categories.map((group, index) => (
            <article
              key={group.category}
              className="rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.06] to-white/[0.02] p-4 transition hover:border-[#7C61FF]/45"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#7C61FF]/20 text-xs font-semibold text-[#BAC7D6]">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-white">{group.category}</h3>
                    <p className="text-xs text-slate-400">{group.items.length} extensions installed</p>
                  </div>
                </div>
                <button type="button" className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                  Enabled
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((tech) => (
                  <span key={`${group.category}-${tech}`} className="rounded-md border border-white/10 bg-[#070B14] px-2 py-1 text-[11px] text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TechStackSection;
