"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Daum } from "@/api/blog/blog.interface";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  post: Daum & { contentHtml: string };
}

export const ArticleCard = ({ post }: ArticleCardProps) => {
  return (
    <Card as={motion.article} layout hoverable className="p-6">
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
