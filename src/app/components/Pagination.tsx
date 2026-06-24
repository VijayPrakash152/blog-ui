"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => {
  const pageNumbers = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-slate-950/80 p-4 text-sm text-slate-300 shadow-sm shadow-black/20"
    >
      <Button
        variant="secondary"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? "default" : "secondary"}
          size="sm"
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      <Button
        variant="secondary"
        size="sm"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </motion.div>
  );
};
