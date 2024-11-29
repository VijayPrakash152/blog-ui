"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Daum } from "@/api/blog/blog.interface";

const HomeComponent = ({ data }: any) => {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white pt-16 pb-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-semibold tracking-tight mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-6">
            A place to explore my thoughts, experiences, and insights on
            technology, life, and everything in between.
          </p>
          {/* Anchor link to latest posts section */}
          <a href="#latest-posts">
            <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full shadow-lg transform transition-all hover:scale-105">
              Read Latest Posts
            </button>
          </a>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 bg-white" id="latest-posts">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {data ? (
              data?.map((blog: any) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform transition-all hover:scale-105"
                >
                  <img
                    src={
                      `${blog?.thumbnail?.url}`
                    } // Add logic to display a real image if available
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-4">{blog.title}</h3>
                    {/* Display Category */}
                    <button className="text-indigo-500 border-2 border-indigo-600 py-1 mb-2 px-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300">
                      {blog.category?.name || "Uncategorized"}
                    </button>
                    <p className="text-gray-600 mb-4">
                      {blog.content.substring(0, 100)}...{" "}
                      {/* Shortened content */}
                    </p>
                    <Link href={`/posts/${blog.slug}`}>
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        Read More &rarr;
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeComponent;
