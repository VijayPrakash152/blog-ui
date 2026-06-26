"use client";
import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const NewsletterCTA = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    if (!email.trim() || !isValidEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData || responseData.success === false) {
        const apiMessage =
          responseData && typeof responseData === "object" && responseData !== null
            ? (responseData as { message?: string }).message
            : null;

        setStatus("error");
        setMessage(apiMessage || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("🎉 Thanks for subscribing! Please check your inbox to confirm your subscription.");
      setEmail("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus("error");
      setMessage(errorMessage || "Something went wrong. Please try again.");
    }
  };

  const isLoading = status === "loading";

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
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage("");
                }
              }}
              placeholder="you@example.com"
              className="pl-12"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-full px-6 py-4 text-sm font-semibold"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {message ? (
          <p
            className={`mt-6 text-sm ${status === "success" ? "text-green-400" : "text-rose-400"}`}
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}
      </div>
    </motion.section>
  );
};

export default NewsletterCTA;
