"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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

  const binaryRows = useMemo(
    () =>
      Array.from({ length: 14 }, (_, row) =>
        Array.from({ length: 18 }, (_, col) => ((row * 7 + col * 13 + name.length + role.length) % 2 === 0 ? "1" : "0")).join("")
      ),
    [name.length, role.length]
  );

  const floatingBits = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        bit: index % 2 === 0 ? "1" : "0",
        left: `${(index * 17) % 100}%`,
        top: `${(index * 29) % 100}%`,
        delay: (index % 8) * 0.16,
        duration: 2.6 + (index % 5) * 0.35,
      })),
    []
  );

  const codeLines = activeFile === "about.md" ? markdownLines : devObjectSnippet;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070B] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(124,97,255,0.14),transparent_42%),radial-gradient(circle_at_80%_10%,rgba(23,210,185,0.1),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="relative border-b border-white/10 px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl space-y-8">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto flex w-full max-w-xl justify-center"
          >
            <div className="group relative h-[290px] w-[290px] sm:h-[320px] sm:w-[320px]">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 rounded-[2rem] border border-[#17D2B9]/30"
                animate={reduceMotion ? undefined : { scale: [0.98, 1.02, 0.98], opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                aria-hidden="true"
                className="absolute inset-2 rounded-[1.9rem] border border-[#7C61FF]/25 mix-blend-screen"
                animate={reduceMotion ? undefined : { opacity: [0.12, 0.4, 0.12], rotate: [0, 0.3, -0.3, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="absolute inset-4 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#08101C]">
                <Image
                  src="/profile-picture.jpg"
                  alt={`${name} profile picture`}
                  fill
                  priority
                  sizes="(max-width: 640px) 260px, 300px"
                  className="object-cover saturate-90 transition duration-700 group-hover:scale-[1.04] group-hover:saturate-110"
                />

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-200 group-hover:opacity-80"
                  style={{
                    backgroundImage: "url('/profile-picture.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "contrast(1.1) saturate(1.2)",
                  }}
                  animate={reduceMotion ? undefined : { x: [0, -2, 1, -1, 0], y: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 0.42, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-full w-full bg-[#ff2b6f]/35" />
                </motion.div>

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-200 group-hover:opacity-75"
                  style={{
                    backgroundImage: "url('/profile-picture.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "contrast(1.08) saturate(1.25)",
                  }}
                  animate={reduceMotion ? undefined : { x: [0, 2, -1, 1, 0], y: [0, -1, 0, 1, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-full w-full bg-[#00e8ff]/30" />
                </motion.div>

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 mix-blend-screen"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(124,97,255,0.08) 0%,rgba(124,97,255,0) 20%,rgba(23,210,185,0.14) 52%,rgba(23,210,185,0) 82%,rgba(124,97,255,0.1) 100%)",
                  }}
                  animate={reduceMotion ? undefined : { x: ["-12%", "12%", "-12%"] }}
                  transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.14)_50%,transparent_100%)] opacity-20"
                  animate={reduceMotion ? undefined : { y: ["-100%", "160%"] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.05)_0%,rgba(5,7,11,0.45)_100%)]" />

                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 font-mono text-[10px] leading-4 text-emerald-200/55">
                  {binaryRows.map((line, index) => (
                    <motion.p
                      key={`${line}-${index}`}
                      initial={reduceMotion ? undefined : { opacity: 0.2, x: -8 }}
                      animate={reduceMotion ? undefined : { opacity: [0.2, 0.7, 0.2], x: [0, 2, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.05 }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-[#17D2B9]/25 to-transparent"
                  animate={reduceMotion ? undefined : { y: [0, 230, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
                />

                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_1px,transparent_1px,transparent_3px)] opacity-15" />

                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#7C61FF]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  animate={reduceMotion ? undefined : { x: [0, -6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="pointer-events-none absolute inset-0">
                {floatingBits.map((item) => (
                  <motion.span
                    key={item.id}
                    className="absolute font-mono text-xs text-[#17D2B9]/60"
                    style={{ left: item.left, top: item.top }}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            y: [0, -10, 0],
                            opacity: [0.3, 0.9, 0.3],
                          }
                    }
                    transition={{ duration: item.duration, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
                  >
                    {item.bit}
                  </motion.span>
                ))}
              </div>

              <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[#17D2B9]/30 bg-[#05070B]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#17D2B9]">
                010101 profile decoded
              </div>
            </div>
          </motion.div>

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
