"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import TechStackSection from "./TechStackSection";
import { TECH_STACK_BY_CATEGORY } from "./tech-stack-data";

interface AboutIdeProfileProps {
  name: string;
  role: string;
  markdown: string;
  html: string;
}

type FileTab = "about.md" | "developer.ts" | "preview";

const cleanLine = (line: string) => line.replace(/^[-*]\s*/, "").trim();

const AboutIdeProfile = ({ name, role, markdown, html }: AboutIdeProfileProps) => {
  const [activeFile, setActiveFile] = useState<FileTab>("about.md");
  const [commandIndex, setCommandIndex] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const reduceMotion = useReducedMotion();

  const markdownLines = useMemo(() => markdown.split("\n"), [markdown]);

  const technologies = useMemo(() => {
    const list = TECH_STACK_BY_CATEGORY.flatMap((group) => group.items);
    const seen = new Set<string>();
    return list.filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, []);

  const timelineLines = useMemo(() => {
    return markdownLines
      .map((line) => cleanLine(line))
      .filter((line) => line.length > 10 && /(19|20)\d{2}|present|current/i.test(line))
      .slice(0, 7);
  }, [markdownLines]);

  const yearsMatch = markdown.match(/(\d+)\+?\s+years/i);
  const companyMatches = Array.from(markdown.matchAll(/(?:^|\n)([A-Z][A-Za-z0-9&.\- ]+),\s*[A-Z][A-Za-z ]+/g)).map((m) => m[1].trim());
  const uniqueCompanies = Array.from(new Set(companyMatches));

  const stats = [
    yearsMatch ? { label: "Years of Experience", value: `${yearsMatch[1]}+` } : null,
    uniqueCompanies.length > 0 ? { label: "Companies", value: String(uniqueCompanies.length) } : null,
    technologies.length > 0 ? { label: "Technologies", value: String(technologies.length) } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const commands = useMemo(
    () => [
      {
        command: "whoami",
        output: [name],
      },
      {
        command: "cat about.md | head -n 4",
        output: markdownLines.map((line) => cleanLine(line)).filter(Boolean).slice(0, 4),
      },
      {
        command: "npm run career",
        output: technologies.slice(0, 6).map((tech) => `✔ ${tech}`),
      },
    ],
    [name, markdownLines, technologies]
  );

  useEffect(() => {
    if (commands.length === 0) {
      return;
    }

    if (reduceMotion) {
      setTypedCommand(commands[commandIndex].command);
      const timer = window.setTimeout(() => {
        setCommandIndex((prev) => (prev + 1) % commands.length);
      }, 2200);
      return () => window.clearTimeout(timer);
    }

    const fullCommand = commands[commandIndex].command;
    if (typedCommand.length < fullCommand.length) {
      const timer = window.setTimeout(() => {
        setTypedCommand(fullCommand.slice(0, typedCommand.length + 1));
      }, 34);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setTypedCommand("");
      setCommandIndex((prev) => (prev + 1) % commands.length);
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [commands, commandIndex, typedCommand, reduceMotion]);

  const devObjectSnippet = useMemo(() => {
    const focus = timelineLines[0] || "Building scalable product experiences";
    return [
      "export const developer = {",
      `  name: \"${name}\",`,
      `  role: \"${role}\",`,
      `  focus: \"${focus.replace(/\"/g, "'")}\",`,
      `  technologies: [${technologies.slice(0, 8).map((tech) => `\"${tech}\"`).join(", ")}],`,
      "  status: \"open_to_build\"",
      "} as const;",
    ];
  }, [name, role, timelineLines, technologies]);

  const codeLines = activeFile === "about.md" ? markdownLines : devObjectSnippet;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,97,255,0.14),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(23,210,185,0.1),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative border-b border-white/10 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeader
            label="About"
            title="Developer Workspace"
            description="Browse my professional journey in a code-first workspace that reflects how I build software."
          />

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-4" hoverable={false}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Explorer</p>
              <div className="mt-4 space-y-2 font-mono text-sm">
                {["profile/", "about.md", "developer.ts", "terminal.sh", "career.git"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                      (item === "about.md" && activeFile === "about.md") || (item === "developer.ts" && activeFile === "developer.ts")
                        ? "bg-[#7C61FF]/20 text-white"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                    onClick={() => {
                      if (item === "about.md") setActiveFile("about.md");
                      if (item === "developer.ts") setActiveFile("developer.ts");
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1220]" hoverable={false}>
              <div className="flex items-center justify-between border-b border-white/10 bg-[#0E1628] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 ${activeFile === "about.md" ? "bg-white/10 text-white" : "text-slate-400"}`}
                    onClick={() => setActiveFile("about.md")}
                  >
                    about.md
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 ${activeFile === "developer.ts" ? "bg-white/10 text-white" : "text-slate-400"}`}
                    onClick={() => setActiveFile("developer.ts")}
                  >
                    developer.ts
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-2 py-1 ${activeFile === "preview" ? "bg-white/10 text-white" : "text-slate-400"}`}
                    onClick={() => setActiveFile("preview")}
                  >
                    preview
                  </button>
                </div>
              </div>

              {activeFile !== "preview" ? (
                <div className="max-h-[30rem] overflow-auto p-4 font-mono text-sm">
                  {codeLines.map((line, index) => (
                    <div key={`${line}-${index}`} className="grid grid-cols-[40px_1fr] gap-3 py-0.5">
                      <span className="select-none text-right text-slate-500">{index + 1}</span>
                      <span className={line.startsWith("#") ? "text-[#82aaff]" : "text-slate-200"}>{line || " "}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="prose prose-invert max-h-[30rem] overflow-auto p-6 text-slate-300" dangerouslySetInnerHTML={{ __html: html }} />
              )}

              <div className="border-t border-white/10 bg-[#0E1628] px-4 py-2 text-xs text-slate-400">
                UTF-8 · TypeScript React · Markdown source linked
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
            <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Terminal</p>
            <div className="mt-4 h-[176px] overflow-hidden rounded-lg border border-white/10 bg-[#060A14] p-4 font-mono text-sm text-slate-200">
              <p className="overflow-hidden text-emerald-300 whitespace-nowrap text-ellipsis">
                <span className="text-[#7C61FF]">vijay@workspace</span>:~$ {typedCommand}
                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-white/70 align-middle" aria-hidden="true" />
              </p>
              <div className="mt-3 h-[120px] overflow-auto space-y-1 text-slate-300">
                {commands[commandIndex].output.map((line) => (
                  <p key={line} className="overflow-hidden whitespace-nowrap text-ellipsis">{line}</p>
                ))}
              </div>
            </div>
          </Card>

          {stats.length > 0 ? (
            <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Stats</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </section>

      {technologies.length > 0 ? (
        <section className="relative px-6 py-4 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <TechStackSection categories={TECH_STACK_BY_CATEGORY} />
          </div>
        </section>
      ) : null}

      {timelineLines.length > 0 ? (
        <section className="relative px-6 py-10 pb-20 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Git History View</p>
              <div className="mt-6 space-y-4">
                {timelineLines.map((entry, index) => (
                  <div key={`${entry}-${index}`} className="grid grid-cols-[20px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#17D2B9]" />
                      {index < timelineLines.length - 1 ? <span className="mt-1 h-full w-px bg-white/10" /> : null}
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-slate-200">
                      <span className="text-[#7C61FF]">commit</span> {entry}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default AboutIdeProfile;
