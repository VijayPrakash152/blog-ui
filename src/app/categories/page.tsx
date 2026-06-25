import BlogListingPage from "../components/BlogListingPage";
import { Daum } from "@/api/blog/blog.interface";
import { remark } from "remark";
import html from "remark-html";

const preprocessMarkdown = async (markdown: string) => {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
};

const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  return new URL(path, apiUrl).toString();
};

export const dynamic = "force-dynamic";

const fetchJson = async (url: string) => {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
};

const Categories = async () => {
  try {
    const [blogsData, categoriesData] = await Promise.all([
      fetchJson(
        getApiUrl(
          '/api/blogs?pagination[page]=1&pagination[pageSize]=50&populate[thumbnail][fields][0]=url&populate[category]=true'
        )
      ),
      fetchJson(getApiUrl('/api/categories?populate[image][fields][0]=url')),
    ]);

    const posts: Array<Daum & { contentHtml: string }> = await Promise.all(
      blogsData?.data?.map(async (blog: Daum) => ({
        ...blog,
        contentHtml: await preprocessMarkdown(blog.content.substring(0, 140) + ' ... '),
      })) || []
    );

    const categories = categoriesData?.data?.map((category: { name: string }) => category.name) || [];

    return <BlogListingPage posts={posts} categories={categories} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-[#05070B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1220] p-10 text-center shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Categories</p>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            We’re having trouble loading category data.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Refresh the page or try again later. If this continues, the API service may be unavailable.
          </p>
        </div>
      </div>
    );
  }
};

export default Categories;
