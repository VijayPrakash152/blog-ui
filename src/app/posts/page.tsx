import { fetchBlogPosts } from "@/lib/blog-data";
import BlogListingPage from "@/app/components/BlogListingPage";
import type { Blog } from "@/types";

export const metadata = {
  title: "Posts | Vijay Prakash",
  description: "Technical articles, engineering notes, and product thinking from Vijay Prakash.",
};

const PostsPage = async () => {
  try {
    const posts = await fetchBlogPosts({ pageSize: 20 });
    const normalizedPosts: Array<Blog & { contentHtml: string }> = posts.map((post) => ({
      ...post,
      category: post.category
        ? {
            ...post.category,
            id: post.category.id ?? 0,
            slug: post.category.slug ?? post.slug,
          }
        : undefined,
    }));
    const categories = Array.from(new Set(normalizedPosts.map((post) => post.category?.name || "Uncategorized")));

    return <BlogListingPage posts={normalizedPosts} categories={categories} initialPage={1} />;
  } catch {
    return (
      <div className="min-h-screen bg-[#05070B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1220] p-10 text-center shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Blog</p>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            The posts feed is temporarily unavailable.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Please try again later while the backend catches up.
          </p>
        </div>
      </div>
    );
  }
};

export default PostsPage;
