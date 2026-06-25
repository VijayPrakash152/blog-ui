import { Daum } from '@/api/blog/blog.interface';
import HomeComponent from './components/HomeComponent';
import {remark} from 'remark';
import html from 'remark-html';

const preprocessMarkdown = async (markdown: string) => {
  const processed = await remark().use(html).process(markdown);
  return processed.toString();
};

export const dynamic = "force-dynamic";

const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";
  return new URL(path, apiUrl).toString();
};

const fetchJson = async (url: string | null) => {
  if (!url) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  return response.json();
};

const Home = async () => {
  try {
    const posts = await fetchJson(
      getApiUrl(
        '/api/blogs?pagination[page]=1&pagination[pageSize]=6&populate[thumbnail][fields][0]=url&populate[category]=true'
      )
    );

    const processedPosts = await Promise.all(
      posts?.data?.map(async (blog: Daum) => ({
        ...blog,
        contentHtml: await preprocessMarkdown(blog.content.substring(0, 100) + " ... "),
      })) || []
    );

    return <HomeComponent data={processedPosts} />;
  } catch (error) {
    return (
      <div className="min-h-screen bg-[#05070B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1220] p-10 text-center shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Blog</p>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Unable to load posts at the moment.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Please try again later or verify that the API backend is available.
          </p>
        </div>
      </div>
    );
  }
};

export default Home;
