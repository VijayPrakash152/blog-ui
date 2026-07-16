"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const NewsletterModal = () => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"prompt" | "form">("prompt");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const resetState = () => {
    setOpen(false);
    setStage("prompt");
    setStatus("idle");
    setMessage("");
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData || responseData.success === false) {
        const apiMessage = responseData && typeof responseData === "object" && responseData !== null
          ? (responseData as { message?: string }).message
          : null;

        setStatus("error");
        setMessage(apiMessage || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("Thanks for subscribing. Please check your inbox to confirm your subscription.");
      setEmail("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus("error");
      setMessage(errorMessage || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="newsletter-cta-ring w-full rounded-full p-[1px] sm:w-auto">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="h-12 w-full rounded-full border border-white/10 bg-[#0B1220] px-6 text-white hover:bg-[#111827] sm:w-auto"
          onClick={() => {
            setOpen(true);
            setStage(isMobile ? "prompt" : "form");
          }}
        >
          Newsletter
        </Button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0"
            onClick={resetState}
          >
            <motion.div
              initial={isMobile ? { opacity: 0, y: 80 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isMobile ? { opacity: 0, y: 80 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
              drag={isMobile ? "y" : false}
              dragConstraints={isMobile ? { top: 0, bottom: 0 } : undefined}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (!isMobile) return;

                if (stage === "prompt" && info.offset.y < -60) {
                  setStage("form");
                  return;
                }

                if (info.offset.y > 90) {
                  resetState();
                }
              }}
              className="w-full max-w-xl rounded-t-[2rem] border border-white/10 bg-[#0B1220] p-5 shadow-glow sm:rounded-[2rem] sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />

              {isMobile && stage === "prompt" ? (
                <div className="space-y-5 pb-2 text-center sm:text-left">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">Newsletter</p>
                    <h2 className="text-2xl font-semibold text-white">Slide up to open newsletter</h2>
                    <p className="text-sm leading-7 text-slate-400">
                      Drag this panel upward to reveal the subscription form.
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-left text-sm text-slate-300">
                    <p className="font-semibold text-white">Gesture hint</p>
                    <p className="mt-2 leading-7">Swipe this sheet upward. We will expand it into the full newsletter form once you drag past the threshold.</p>
                  </div>

                  <Button type="button" variant="secondary" className="w-full rounded-full" onClick={() => setStage("form")}>
                    Slide up / Continue
                  </Button>

                  <button type="button" onClick={resetState} className="w-full text-sm text-slate-400 transition hover:text-white">
                    Not now
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">Newsletter</p>
                      <h2 className="mt-3 text-2xl font-semibold text-white">Get the next article in your inbox.</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-400">
                        Short notes on product engineering, frontend systems, and practical software insights.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Close newsletter"
                      onClick={resetState}
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
                    <label htmlFor="modal-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <div className="relative flex-1">
                      <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <Input
                        id="modal-newsletter-email"
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
                        disabled={status === "loading"}
                      />
                    </div>
                    <Button type="submit" disabled={status === "loading"} className="rounded-full px-6">
                      {status === "loading" ? "Subscribing..." : "Subscribe"}
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>

                  {message ? (
                    <p className={`mt-4 text-sm ${status === "success" ? "text-emerald-400" : "text-rose-400"}`} aria-live="polite">
                      {message}
                    </p>
                  ) : null}
                </>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default NewsletterModal;
