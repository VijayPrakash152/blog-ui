"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Daum } from "@/api/blog/blog.interface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import makePlaceholderDataUrl from '@/utils/lqip';

interface ArticleCardProps {
  post: Daum & { contentHtml: string };
}

export const ArticleCard = ({ post }: ArticleCardProps) => {
  const imageBlur = post.thumbnail ? ((post.thumbnail as any).blurDataURL ?? makePlaceholderDataUrl()) : undefined;
  return (
    <Card as={motion.article} layout hoverable className="group p-6">
      <div className="-mx-6 mb-6 overflow-hidden rounded-[1.25rem]">
        {post.thumbnail?.url ? (
          <Image
            src={post.thumbnail.url}
            alt={`${post.title} cover`}
            width={1200}
            height={675}
            placeholder="blur"
            blurDataURL={imageBlur}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-center text-sm text-slate-200">
            <span className="px-4 text-center">No cover image</span>
          </div>
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between gap-4">
          <Badge variant="outline">{post.category?.name || "Uncategorized"}</Badge>
          <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-white transition group-hover:text-[#7C61FF]">
          {post.title}
        </h3>
        <p className="max-h-[4.5rem] overflow-hidden text-sm leading-7 text-slate-300">
          {post.contentHtml.replace(/<[^>]+>/g, "")}
        </p>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#7C61FF]">
          <Link href={`/posts/${post.slug}`}>Read article</Link>
          <ArrowRight className="h-4 w-4" />
        </div>
      </motion.div>
    </Card>
  );
};
