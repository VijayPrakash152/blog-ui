"use client";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-r from-[#151A24] via-[#11151C] to-[#0B0D11] px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-slate-950/80 p-10 shadow-glow">
        <SectionHeader
          label="Stay notified"
          title="Get every new insight straight to your inbox."
          description="Premium engineering thinking, refined product notes, and newsletter-only reflections from the blog."
          className="mb-10"
        />

        <form className="flex flex-col gap-4 sm:flex-row sm:items-center" onSubmit={handleSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("idle");
              }}
              placeholder="you@example.com"
              className="pl-12"
            />
          </div>
          <Button type="submit" className="rounded-full px-6 py-4 text-sm font-semibold">
            Subscribe
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {status === "success" && (
          <p className="mt-6 text-sm text-green-400">Thanks! You’re on the list.</p>
        )}
        {status === "error" && (
          <p className="mt-6 text-sm text-rose-400">Please enter a valid email address.</p>
        )}
      </div>
    </motion.section>
  );
};

export default NewsletterCTA;
