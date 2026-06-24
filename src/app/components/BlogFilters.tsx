"use client";
import { useMemo } from "react";
import { Search, Funnel, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BlogFiltersProps {
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title", label: "Title" },
];

export const BlogFilters = ({
  categories,
  searchQuery,
  selectedCategory,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: BlogFiltersProps) => {
  const pillCategories = useMemo(() => ["All", ...categories], [categories]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-sm shadow-black/20">
      <div className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search articles, topics, or keywords"
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            <Funnel className="h-4 w-4 text-[#7C61FF]" />
            Sort by
          </span>
          <div className="relative flex-1">
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value)}
              className="w-full appearance-none rounded-full border border-white/10 bg-slate-900/90 px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-[#7C61FF] focus:ring-2 focus:ring-[#7C61FF]/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {pillCategories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <Button
              key={category}
              variant={isActive ? "default" : "secondary"}
              size="sm"
              onClick={() => onCategoryChange(category)}
            >
              {category}
            </Button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
        <Badge variant="outline">{categories.length} categories</Badge>
        <Badge variant="outline">{searchQuery ? `Searching ${searchQuery}` : "Search all articles"}</Badge>
      </div>
    </div>
  );
};
