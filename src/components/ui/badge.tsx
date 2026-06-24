"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]",
          variant === "outline"
            ? "border border-white/10 bg-transparent text-slate-200"
            : "bg-white/5 text-slate-200",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
