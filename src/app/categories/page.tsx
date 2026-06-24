import BlogListingPage from "../components/BlogListingPage";
import { Daum } from "@/api/blog/blog.interface";
import { remark } from "remark";
import html from "remark-html";

const preprocessMarkdown = async (markdown: string) => {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
};

const Categories = async () => {
  const [blogsResponse, categoriesResponse] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blogs?pagination[page]=1&pagination[pageSize]=50&populate[thumbnail][fields][0]=url&populate[category]=true`,
      { next: { revalidate: 86400 } }
    ),
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/categories?populate[image][fields][0]=url`,
      { next: { revalidate: 86400 } }
    ),
  ]);

  const blogsData = await blogsResponse.json();
  const categoriesData = await categoriesResponse.json();

  const posts: Array<Daum & { contentHtml: string }> = await Promise.all(
    blogsData?.data.map(async (blog: Daum) => ({
      ...blog,
      contentHtml: await preprocessMarkdown(blog.content.substring(0, 140) + " ... "),
    }))
  );

  const categories = categoriesData.data.map((category: { name: string }) => category.name);

  return <BlogListingPage posts={posts} categories={categories} />;
};

export default Categories;
