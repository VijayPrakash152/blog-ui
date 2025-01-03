// app/posts/[slug]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation'; // To handle 404s if the blog is not found
import { remark } from 'remark';
import html from 'remark-html';
import BlogPostComponent from '@/app/components/Blog';
import { Metadata } from 'next';

interface Params{
  slug: string;
}

// Server Component that fetches data on the server side
const BlogPost = async ({ params }: { params: Promise<Params> }) => {
  const { slug } =  await params;

  // Fetch the blog data from the API
  const blog = await fetchSingleBlog(slug);
  // If the blog is not found, show a 404 page
  if (!blog) {
    notFound(); // This triggers the Next.js 404 page
  }

  return (
    <BlogPostComponent blog={blog} />
  );
};

// Fetch the blog based on slug
const fetchSingleBlog = async (slug: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs?filters[slug][$eq]=${slug}&populate[thumbnail][fields][0]=url&populate[category]=true&populate[metadata][populate][keywords]=true&populate[metadata][populate][image][fields][0]=url`,{"cache": "no-store"});

  if (!res.ok) {
    throw new Error('Failed to fetch blog data');
  }

  const data = await res.json();
  const blog =  data.data[0]; // Assuming API returns a single blog

  const processedContent = await remark().use(html).process(blog.content);
  blog.content = processedContent.toString();
  return blog;
};

export async function generateMetadata({ params }: { params: Promise<Params>  }): Promise<Metadata> {
  const { slug } =  await params;
  const blog = await fetchSingleBlog(slug);

  if (!blog) {
    return {
      title: "Blog not found",
      description: "The requested blog could not be found.",
    };
  }

  return {
    title: blog.metadata?.title || blog.title,
    description: blog.metadata?.description,
    keywords: blog.metadata?.keywords?.map((k: { keyword: string }) => k.keyword).join(", "),
    openGraph: {
      title: blog.metadata?.title || blog.title,
      description: blog.metadata?.description,
      images: blog.metadata?.image?.url ? [{ url: blog.metadata.image.url }] : undefined,
      url: `/blog/${blog.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.metadata?.title || blog.title,
      description: blog.metadata?.description,
      images: blog.metadata?.image?.url,
    },
  };
}
export default BlogPost;
