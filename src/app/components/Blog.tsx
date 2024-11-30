"use client";
import React from "react";
import { notFound } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import { Daum } from "@/api/blog/blog.interface";

interface BlogPostComponentProps {
  blog: Daum;
}

const BlogPostComponent = ({ blog }: BlogPostComponentProps) => {
  if (!blog) {
    notFound(); // Trigger 404 page
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Meta Tags */}
      <Head>
        <title>{blog.metadata?.title || blog.title}</title>
        <meta name="description" content={blog.metadata?.description} />
        <meta name="keywords" content={blog.metadata?.keywords.map((k) => k.keyword).join(", ")} />
        <meta property="og:title" content={blog.metadata?.title || blog.title} />
        <meta property="og:description" content={blog.metadata?.description} />
        <meta property="og:image" content={blog.metadata?.image?.url} />
        <meta property="og:url" content={`/blog/${blog.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metadata?.title || blog.title} />
        <meta name="twitter:description" content={blog.metadata?.description} />
        <meta name="twitter:image" content={blog.metadata?.image?.url} />
      </Head>

      {/* Blog Post */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Blog Thumbnail */}
            <div className="relative h-80">
              <img
                src={`${blog?.thumbnail?.url}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <h1 className="absolute bottom-4 left-4 text-4xl text-white font-bold">
                {blog.title}
              </h1>
            </div>

            {/* Blog Content */}
            <div className="p-6">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-600 py-1 px-3 rounded-full text-sm font-medium">
                  {blog.category?.name || "Uncategorized"}
                </span>
              </div>

              {/* Blog Body */}
              <div
                className="blog-content text-lg text-gray-700 leading-relaxed space-y-6 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Back Buttons */}
              <div className="mt-8 space-y-4">
                <div className="flex flex-col space-y-4 w-full">
                  <Link href="/">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg">
                      ⬅ Back to Posts
                    </button>
                  </Link>
                  <button
                    onClick={scrollToTop}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-teal-600 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
                  >
                    ⬆️ Back to Top
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Hyvor Talk Comments Section */}
            <div className="px-6 pb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                💬 Comments
              </h2>
              <hyvor-talk-comments website-id="12217" page-id={`/blog/${blog?.slug}`} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostComponent;