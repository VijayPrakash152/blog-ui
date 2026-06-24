"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Daum } from "@/api/blog/blog.interface";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

interface FeaturedPostsProps {
  posts: Array<Daum & { contentHtml: string }>;
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  return (
    <section className="bg-slate-950/90 px-6 py-16 sm:px-10 lg:px-16" id="featured-posts">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          label="Featured"
          title="High-impact posts for modern engineering teams."
          description="Spotlighted writing from the latest series, with clear takeaways and polished technical storytelling."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Card key={post.id} className="p-6" hoverable>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">
                  <Sparkles className="h-3.5 w-3.5 text-[#7C61FF]" />
                  {post.category?.name || "Uncategorized"}
                </div>
                <h3 className="text-2xl font-semibold text-white transition group-hover:text-[#7C61FF]">
                  {post.title}
                </h3>
                <p className="min-h-[4.5rem] text-sm leading-7 text-slate-300">
                  {post.contentHtml.replace(/<[^>]+>/g, "")}
                </p>
                <div className="flex items-center justify-between gap-4">
                  <Link href={`/posts/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C61FF] transition hover:text-white">
                    Read story
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
