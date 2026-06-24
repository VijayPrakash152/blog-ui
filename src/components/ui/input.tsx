"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-full border border-white/10 bg-slate-950/90 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#7C61FF] focus:ring-2 focus:ring-[#7C61FF]/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
