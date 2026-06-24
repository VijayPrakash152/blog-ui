"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Daum } from "@/api/blog/blog.interface";
import { BlogFilters } from "./BlogFilters";
import { ArticleCard } from "./ArticleCard";
import { Pagination } from "./Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogListingPageProps {
  posts: Array<Daum & { contentHtml: string }>;
  categories: string[];
  initialPage?: number;
}

const PAGE_SIZE = 6;

const BlogListingPage = ({ posts, categories, initialPage = 1 }: BlogListingPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    const filtered = posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category?.name === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }
      const aDate = new Date(a.publishedAt).getTime();
      const bDate = new Date(b.publishedAt).getTime();
      return sort === "newest" ? bDate - aDate : aDate - bDate;
    });

    return sorted;
  }, [posts, searchQuery, selectedCategory, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPosts = filteredPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return;
    setIsLoading(true);
    setPage(newPage);
    setTimeout(() => setIsLoading(false), 250);
  };

  return (
    <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">Blog</p>
            <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
              Explore the latest engineering articles.
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Filter by category, search for topics, and sort articles for a faster reading experience.
          </p>
        </div>

        <BlogFilters
          categories={categories}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          sort={sort}
          onSearchChange={setSearchQuery}
          onCategoryChange={handleCategoryChange}
          onSortChange={(value) => {
            setSort(value);
            setPage(1);
          }}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {isLoading ? (
            Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <Skeleton key={index} className="h-64" />
            ))
          ) : currentPosts.length > 0 ? (
            currentPosts.map((post) => <ArticleCard key={post.id} post={post} />)
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400"
            >
              No articles match your search or filters.
            </motion.div>
          )}
        </div>

        <div className="mt-12">
          <Pagination page={page} pageCount={pageCount} onPageChange={handlePageChange} />
        </div>
      </div>
    </section>
  );
};

export default BlogListingPage;
