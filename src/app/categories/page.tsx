import BlogListingPage from "../components/BlogListingPage";
import { Daum } from "@/api/blog/blog.interface";
import { remark } from "remark";
import html from "remark-html";

// Create a single reusable compiler instance to save overhead
const compiler = remark().use(html);

const preprocessMarkdown = async (markdown: string) => {
  if (!markdown) return "";
  try {
    const processed = await compiler.process(markdown);
    return processed.toString();
  } catch (e) {
    return markdown; // Fallback to raw text if compilation hiccups
  }
};

const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";
  return new URL(path, apiUrl).toString();
};

export const dynamic = "force-dynamic";

const fetchJson = async (url: string) => {
  // Use no-store explicitly for force-dynamic to maintain correct RSC streaming
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return res.json();
};

const Categories = async () => {
  try {
    const blogsData = await fetchJson(
      getApiUrl(
        '/api/blogs?pagination[page]=1&pagination[pageSize]=50&populate[thumbnail][fields][0]=url&populate[category]=true'
      )
    );

    const rawData = blogsData?.data || [];

    // Map through posts safely
    const posts = await Promise.all(
      rawData.map(async (blog: Daum) => {
        const excerpt = blog?.content ? blog.content.substring(0, 140) + ' ... ' : '';
        const contentHtml = await preprocessMarkdown(excerpt);
        
        return {
          ...blog,
          contentHtml,
        };
      })
    );

    // Extract unique categories safely, filtering out any undefined/null anomalies
    const categories = Array.from(
      new Set(
        posts
          .map((post) => post?.category?.name || 'Uncategorized')
          .filter(Boolean)
      )
    );

    return <BlogListingPage posts={posts} categories={categories} />;
  } catch (error) {
    console.error("RSC Navigation Fetch Error:", error);
    
    // Pass empty fallbacks into your actual page component instead of structural code blocks.
    // This keeps the RSC structure consistent, preventing the page from going blank.
    return <BlogListingPage posts={[]} categories={['Uncategorized']} />;
  }
};

export default Categories;