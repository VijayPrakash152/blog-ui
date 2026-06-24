"use client";
import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 shadow-sm shadow-black/20 transition will-change-transform",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-lg shadow-black/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverable = true, as: Comp = motion.div, ...props }, ref) => {
    const Component = Comp as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(cardVariants({ variant }), className, hoverable ? "hover:-translate-y-1 hover:border-[#7C61FF] hover:bg-slate-900/95" : "")}
        whileHover={hoverable ? { y: -2 } : undefined}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
