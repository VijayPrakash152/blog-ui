"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Hero from "./Hero";
import FeaturedPosts from "./FeaturedPosts";
import CategorySection from "./CategorySection";
import NewsletterCTA from "./NewsletterCTA";
import { Daum } from "@/api/blog/blog.interface";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";

interface HomeComponentProps {
  data: Array<Daum & { contentHtml: string }>;
}

const HomeComponent = ({ data }: HomeComponentProps) => {
  const featuredPosts = data.slice(0, 3);
  const latestPosts = data.slice(3);
  const categories = Array.from(
    new Set(data.map((post) => post.category?.name || "Uncategorized"))
  );

  return (
    <div className="bg-[#05070B] text-white">
      <Hero postCount={data.length} categoryCount={categories.length} />
      <FeaturedPosts posts={featuredPosts} />
      <CategorySection categories={categories} />

      <section className="bg-[#0A0F18] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            label="Latest articles"
            title="Recent writing, updated for modern systems teams."
            description="The freshest posts from the blog, focused on architecture, systems, and product engineering."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Card
                as={motion.article}
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="p-6"
                hoverable
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">
                  {post.category?.name || "Uncategorized"}
                </div>
                <h3 className="text-2xl font-semibold text-white transition group-hover:text-[#7C61FF]">
                  {post.title}
                </h3>
                <p className="mt-4 min-h-[4.5rem] text-sm leading-7 text-slate-300">
                  {post.contentHtml.replace(/<[^>]+>/g, "")}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#7C61FF] transition hover:text-white"
                  >
                    Read article
                  </Link>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </div>
  );
};

export default HomeComponent;
