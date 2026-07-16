"use client";

import { useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import PhysicsWorld from "./physics/PhysicsWorld";
import type { TechCategory } from "./tech-stack-data";

interface TechStackSectionProps {
  categories: TechCategory[];
}

const TechStackSection = ({ categories }: TechStackSectionProps) => {
  const reducedMotion = useReducedMotion();

  if (!categories.length) {
    return null;
  }

  if (reducedMotion) {
    return (
      <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
        <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Tech Stack</p>
        <p className="mt-2 text-xs text-slate-400">Grouped view shown because reduced motion is enabled.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((group) => (
            <div key={group.category} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[#7C61FF]">{group.category}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((tech) => (
                  <span key={`${group.category}-${tech}`} className="rounded-md border border-white/10 bg-[#0B1220] px-2 py-1 text-[11px] text-slate-200">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return <PhysicsWorld categories={categories} />;
};

export default TechStackSection;
