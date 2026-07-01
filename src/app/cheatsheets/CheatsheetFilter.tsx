'use client';

import { useMemo, useState } from 'react';
import type { Cheatsheet, Subcategory } from '@/types';
import { CheatsheetCard } from '@/app/components/CheatsheetCard';

interface CheatsheetFilterProps {
  subcategories: Subcategory[];
  cheatsheets: Cheatsheet[];
}

export const CheatsheetFilter = ({ subcategories, cheatsheets }: CheatsheetFilterProps) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');

  const filteredCheatsheets = useMemo(() => {
    if (activeSubcategory === 'all') {
      return cheatsheets;
    }

    return cheatsheets.filter((cheatsheet) =>
      cheatsheet.subcategories?.some((subcategory) => subcategory.slug === activeSubcategory)
    );
  }, [activeSubcategory, cheatsheets]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveSubcategory('all')}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            activeSubcategory === 'all'
              ? 'border-[#7C61FF] bg-[#7C61FF]/15 text-[#7C61FF]'
              : 'border-white/10 bg-slate-950/80 text-slate-300 hover:border-[#7C61FF]/50'
          }`}
        >
          All
        </button>
        {subcategories.map((subcategory) => (
          <button
            key={subcategory.slug}
            type="button"
            onClick={() => setActiveSubcategory(subcategory.slug)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeSubcategory === subcategory.slug
                ? 'border-[#7C61FF] bg-[#7C61FF]/15 text-[#7C61FF]'
                : 'border-white/10 bg-slate-950/80 text-slate-300 hover:border-[#7C61FF]/50'
            }`}
          >
            {subcategory.name}
          </button>
        ))}
      </div>

      {filteredCheatsheets.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCheatsheets.map((cheatsheet) => (
            <CheatsheetCard key={cheatsheet.id} cheatsheet={cheatsheet} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400">
          No cheatsheets are available for this filter yet.
        </div>
      )}
    </div>
  );
};
