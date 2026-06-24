"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  postCount: number;
  categoryCount: number;
}

const Hero = ({ postCount, categoryCount }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-[#090B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div
        className="absolute inset-0 opacity-20 bg-gradient-to-br from-[#6E5FFF] via-transparent to-[#00D1FF] blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <Sparkles className="h-4 w-4 text-[#7C61FF]" />
            Premium engineering insights for modern product builders
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build better software thinking with sharp, modern writing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A hand-curated software engineering blog with deeper technical essays, practical workflows, and modern product thinking.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#featured-posts"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Explore featured stories
              <ArrowRight className="ml-3 h-4 w-4" />
            </a>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {postCount} articles · {categoryCount} categories
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
