"use client";
import { useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ChevronLeft, Clock, Tag as TagIcon } from "lucide-react";
import { ArticleTOC, TocItem } from "./ArticleTOC";
import ArticleContent from "./ArticleContent";
import ReadingProgress from "./ReadingProgress";
import AuthorCard from "./AuthorCard";
import RelatedArticles from "./RelatedArticles";
import { ShareButtons } from "./ShareButtons";
import { Daum, Thumbnail } from "@/api/blog/blog.interface";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import makePlaceholderDataUrl from '@/utils/lqip';

interface BlogPostComponentProps {
  blog: Daum;
  relatedPosts?: Daum[];
}

const BlogPostComponent = ({ blog, relatedPosts }: BlogPostComponentProps) => {
  if (!blog) {
    notFound();
  }

  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const related = relatedPosts ?? [];

  useEffect(() => {
    const handleScroll = () => {
      const content = document.getElementById("article-content-root");
      if (!content) return;

      const articleTop = content.getBoundingClientRect().top + window.scrollY;
      const articleHeight = content.offsetHeight;
      const position = window.scrollY - articleTop + window.innerHeight * 0.15;
      const progressValue = (position / (articleHeight - window.innerHeight * 0.15)) * 100;
      setProgress(Math.min(100, Math.max(0, progressValue)));

      const currentHeading = headings.reduce<string>((current, heading) => {
        const element = document.getElementById(heading.id);
        if (!element) return current;
        if (window.scrollY + 140 >= element.offsetTop) {
          return heading.id;
        }
        return current;
      }, headings[0]?.id ?? "");

      setActiveId(currentHeading);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  const summary = useMemo(() => {
    const raw = blog.metadata?.description || blog.content.replace(/<[^>]+>/g, "");
    return raw.slice(0, 180).trim();
  }, [blog.metadata?.description, blog.content]);
  
  const thumbnail = blog.thumbnail as Thumbnail & { blurDataURL?: string };
  const heroBlur = thumbnail ? thumbnail.blurDataURL ?? makePlaceholderDataUrl() : undefined;

  return (
    <article className="relative bg-[#05070B] text-white w-full overflow-x-hidden">
      <ReadingProgress progress={progress} />

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#090B10]">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,97,255,0.18),transparent_38%)] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-10 lg:px-20 lg:py-20">
          <div className="flex flex-col gap-6 sm:gap-10">
            {/* Image Container with responsive aspect ratio/height */}
            <div className="-mx-4 overflow-hidden rounded-xl sm:-mx-10 md:-mx-16 sm:rounded-[1.75rem]">
              {blog.thumbnail?.url ? (
                <Image
                  src={blog.thumbnail.url}
                  alt={`${blog.title} cover`}
                  width={1600}
                  height={900}
                  placeholder="blur"
                  blurDataURL={heroBlur}
                  className="w-full h-[240px] sm:h-[420px] md:h-[520px] object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-[240px] sm:h-[420px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center text-sm sm:text-lg text-slate-200">
                  <span className="px-4 text-center">No cover image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6 px-1 sm:px-0">
              <Link href="/posts" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
                <ChevronLeft className="h-4 w-4" />
                Back to posts
              </Link>

              <div className="max-w-4xl space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-200 w-fit">
                  <TagIcon className="h-3.5 w-3.5 text-[#7C61FF]" />
                  {blog.category?.name || "Uncategorized"}
                </div>
                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {blog.title}
                </h1>
                <p className="max-w-3xl text-sm sm:text-lg leading-relaxed sm:leading-8 text-slate-300">{summary}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    8 min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-10 lg:px-20 sm:py-16">
        <div className="grid gap-8 xl:grid-cols-[1.8fr_0.9fr] xl:items-start">
          
          <div className="space-y-8 sm:space-y-12 min-w-0">
            {/* Main Article Content Card */}
            <Card className="rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#0B1220] p-5 sm:p-10 shadow-lg shadow-black/20">
              <div className="mx-auto max-w-3xl">
                <ArticleContent html={blog.content} onHeadingsChange={setHeadings} />
              </div>
            </Card>

            {/* Share and Author Section Grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_0.45fr] items-start">
              <Card className="w-full rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#0B1220] p-5 sm:p-8 shadow-lg shadow-black/20">
                <SectionHeader
                  label="Share"
                  title="Share this article"
                  description="Help others discover this article with a quick share."
                  className="mb-6"
                />
                <ShareButtons title={blog.title} />
              </Card>
              <div className="w-full">
                <AuthorCard />
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <RelatedArticles posts={related} />
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[2rem] border border-white/10 bg-[#0B1220] p-6 shadow-lg shadow-black/20">
                <ArticleTOC headings={headings} activeId={activeId} />
              </Card>
              <Card className="rounded-[2rem] border border-white/10 bg-[#0B1220] p-6 shadow-lg shadow-black/20">
                <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Reading note</p>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  This article is optimized for deep technical reading, with a sticky table of contents and enhanced code examples.
                </p>
              </Card>
            </div>
          </aside>

        </div>
      </section>
    </article>
  );
};

export default BlogPostComponent;