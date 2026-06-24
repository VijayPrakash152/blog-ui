"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock = ({ code, language = "" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-[1.75rem] border border-white/10 bg-[#111827] p-4 shadow-sm shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-slate-400">
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
          {language || "code"}
        </span>
        <Button variant="secondary" size="sm" type="button" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
};
