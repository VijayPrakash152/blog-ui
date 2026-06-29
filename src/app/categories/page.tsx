import BlogListingPage from "../components/BlogListingPage";
import { Daum } from "@/api/blog/blog.interface";
import { remark } from "remark";
import html from "remark-html";

// Create a single reusable compiler instance
const compiler = remark().use(html);

const preprocessMarkdown = async (markdown: string) => {
  if (!markdown) return "";

  try {
    const processed = await compiler.process(markdown);
    return processed.toString();
  } catch {
    return markdown;
  }
};

const getApiUrl = (path: string) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";

  return new URL(path, apiUrl).toString();
};

const fetchJson = async (url: string) => {
  const res = await fetch(url, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  return res.json();
};

const Categories = async () => {
  try {
    const blogsData = await fetchJson(
      getApiUrl(
        "/api/blogs?pagination[page]=1&pagination[pageSize]=50&populate[thumbnail][fields][0]=url&populate[category]=true"
      )
    );

    const rawData = blogsData?.data ?? [];

    const posts = await Promise.all(
      rawData.map(async (blog: Daum) => {
        const excerpt = blog.content
          ? `${blog.content.substring(0, 140)} ...`
          : "";

        return {
          ...blog,
          contentHtml: await preprocessMarkdown(excerpt),
        };
      })
    );

    const categories = Array.from(
      new Set(
        posts
          .map((post) => post.category?.name ?? "Uncategorized")
          .filter(Boolean)
      )
    );

    return <BlogListingPage posts={posts} categories={categories} />;
  } catch (error) {
    console.error("Failed to load categories page:", error);

    return (
      <BlogListingPage
        posts={[]}
        categories={["Uncategorized"]}
      />
    );
  }
};

export default Categories;