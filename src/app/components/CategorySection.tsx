"use client";
import { motion } from "framer-motion";
import { Tag as TagIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

interface CategorySectionProps {
  categories: string[];
}

const CategorySection = ({ categories }: CategorySectionProps) => {
  return (
    <section className="bg-[#090B0F] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Categories"
          title="Explore topics by category."
          description="Find the ideas that matter most—architecture, product strategy, engineering culture, and practical tutorials."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          {categories.map((category, index) => (
            <motion.div
              key={`${category}-${index}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-[#7C61FF] hover:text-white"
            >
              <TagIcon className="h-4 w-4 text-[#7C61FF]" />
              {category}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
