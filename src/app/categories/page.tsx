"use client";

import React, { useEffect, useState } from "react";
import BlogListingPage from "../components/BlogListingPage";
import { Daum } from "@/api/blog/blog.interface";
import { remark } from "remark";
import html from "remark-html";

const compiler = remark().use(html);

const preprocessMarkdown = async (markdown: string) => {
  if (!markdown) return "";
  try {
    const processed = await compiler.process(markdown);
    return processed.toString();
  } catch (e) {
    return markdown;
  }
};

const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "https://vijayprakash.co.in";
  return new URL(path, apiUrl).toString();
};

export default function CategoriesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadCategoriesData = async () => {
      try {
        setError(false);
        const targetUrl = getApiUrl(
          '/api/blogs?pagination[page]=1&pagination[pageSize]=50&populate[thumbnail][fields][0]=url&populate[category]=true'
        );

        const res = await fetch(targetUrl);
        if (!res.ok) throw new Error("API response error");
        
        const blogsData = await res.json();
        const rawData = blogsData?.data || [];

        const processedPosts = await Promise.all(
          rawData.map(async (blog: Daum) => {
            const excerpt = blog?.content ? blog.content.substring(0, 140) + ' ... ' : '';
            const contentHtml = await preprocessMarkdown(excerpt);
            return { ...blog, contentHtml };
          })
        );

        const uniqueCategories = Array.from(
          new Set(
            processedPosts
              .map((post) => post?.category?.name || 'Uncategorized')
              .filter(Boolean)
          )
        );

        setPosts(processedPosts);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Client fetch error: ", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadCategoriesData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-[#7C61FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Loading Categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#05070B] px-6 py-20 text-white sm:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-[#0B1220] p-10 text-center shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7C61FF]">Categories</p>
          <h1 className="mt-6 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            We’re having trouble loading category data.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Please check your network connection or try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return <BlogListingPage posts={posts} categories={categories} />;
}