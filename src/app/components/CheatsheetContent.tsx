'use client';

interface CheatsheetContentProps {
  html: string;
}

export const CheatsheetContent = ({ html }: CheatsheetContentProps) => {
  return (
    <div
      className="cheatsheet-content max-w-none space-y-2 text-slate-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
