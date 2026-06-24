"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "soft";
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em]";
    const variantClasses =
      variant === "soft"
        ? "bg-white/5 text-slate-100"
        : variant === "outline"
        ? "border border-white/10 bg-transparent text-slate-200"
        : "bg-[#7C61FF] text-white";

    return (
      <span ref={ref} className={cn(base, variantClasses, className)} {...props} />
    );
  }
);

Tag.displayName = "Tag";
