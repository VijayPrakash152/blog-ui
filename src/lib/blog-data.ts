import type { Daum } from '@/api/blog/blog.interface';
import { markdownToHtml } from '@/lib/cheatsheet-markdown';

export const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://api.vijayprakash.co.in';
  return new URL(path, apiUrl).toString();
};

export const fetchBlogPosts = async ({ pageSize = 6 }: { pageSize?: number } = {}) => {
  const response = await fetch(
    getApiUrl(
      `/api/blogs?pagination[page]=1&pagination[pageSize]=${pageSize}&populate[thumbnail][fields][0]=url&populate[category]=true`
    ),
    { cache: 'force-cache' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await response.json();

  const processedPosts = await Promise.all(
    (posts?.data ?? []).map(async (blog: Daum) => ({
      ...blog,
      contentHtml: await markdownToHtml(blog.content.substring(0, 160) + ' ... '),
    }))
  );

  return processedPosts as Array<Daum & { contentHtml: string }>;
};
