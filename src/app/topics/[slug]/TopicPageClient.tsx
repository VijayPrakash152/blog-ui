'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArticleCard } from '@/app/components/ArticleCard';
import { motion } from 'framer-motion';
import type { Blog, Subcategory } from '@/types';
import { resolveStrapiMediaUrl } from '@/lib/strapi';

const tabs = ['Posts', 'Cheatsheets', 'Projects', 'Resources'] as const;

type TopicPagePost = Blog & { contentHtml: string };

interface TopicPageClientProps {
  subcategory: Subcategory;
  posts: TopicPagePost[];
}

const TopicPageClient = ({ subcategory, posts }: TopicPageClientProps) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Posts');

  return (
    <section className="bg-[#05070B] px-6 py-16 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7C61FF]">
                Topic
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                {subcategory.name}
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                {subcategory.description || 'Explore posts and resources related to this topic.'}
              </p>

              {subcategory.categories?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {subcategory.categories.map((category) => (
                    <Link key={category.slug} href={`/categories/${category.slug}`}>
                      <Badge variant="outline" className="cursor-pointer">
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80">
              {subcategory.image?.url ? (
                <Image
                  src={resolveStrapiMediaUrl(subcategory.image.url) || '/'}
                  alt={subcategory.image.alternativeText || subcategory.name}
                  width={1200}
                  height={675}
                  unoptimized
                  className="h-48 w-full max-w-md object-cover"
                />
              ) : (
                <div className="flex h-48 w-full max-w-md items-center justify-center bg-gradient-to-br from-[#7C61FF] to-slate-700 text-5xl font-semibold text-white">
                  {subcategory.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'border-[#7C61FF] bg-[#7C61FF]/15 text-[#7C61FF]'
                  : 'border-white/10 bg-slate-950/80 text-slate-300 hover:border-[#7C61FF]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Posts' ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {posts.length > 0 ? (
              posts.map((post) => <ArticleCard key={post.id} post={post} />)
            ) : (
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-12 text-center text-slate-400 lg:col-span-2">
                No posts are tagged with this topic yet.
              </div>
            )}
          </div>
        ) : (
          <Card className="p-10 text-center text-slate-400">
            <h2 className="text-2xl font-semibold text-white">{activeTab}</h2>
            <p className="mt-3 text-sm leading-7">Coming soon.</p>
          </Card>
        )}
      </div>
    </section>
  );
};

export default TopicPageClient;
