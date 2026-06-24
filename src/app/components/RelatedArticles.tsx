import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Daum } from "@/api/blog/blog.interface";

interface RelatedArticlesProps {
  posts: Daum[];
}

const RelatedArticles = ({ posts }: RelatedArticlesProps) => {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#0F172A] p-6 shadow-sm shadow-black/20">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Related articles</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">More reading from this topic</h2>
        </div>
        <ArrowRight className="h-5 w-5 text-[#7C61FF]" />
      </div>
      <div className="mt-6 space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/posts/${post.slug}`} className="block rounded-3xl border border-white/10 bg-slate-950/90 p-4 transition hover:border-[#7C61FF] hover:bg-slate-900/90">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{post.title}</p>
                <p className="mt-2 text-sm text-slate-400">{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
              </div>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">Read</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
