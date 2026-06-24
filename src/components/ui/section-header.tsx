"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader = ({ label, title, description, className }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("space-y-4", className)}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">
        {label}
      </p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-6 text-slate-400">{description}</p> : null}
    </motion.div>
  );
};
