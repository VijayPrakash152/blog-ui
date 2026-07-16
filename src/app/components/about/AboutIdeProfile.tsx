"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";

interface AboutIdeProfileProps {
  name: string;
  role: string;
  markdown: string;
  html: string;
}

type FileTab = "about.md" | "developer.ts" | "preview";

const TECH_STACK_BY_CATEGORY = [
  {
    category: "Frontend",
    items: ["React.js", "React Native", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux Toolkit", "Context API", "TanStack Query", "React Router", "Storybook", "shadcn/ui", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Express.js", "BFF", "REST APIs", "Serverless APIs", "Firebase Functions"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo", "Native Module Integration"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase Firestore", "Redis"],
  },
  {
    category: "Cloud & Infra",
    items: ["AWS Lambda", "API Gateway", "Amazon S3", "CloudFront", "Firebase", "Azure Cloud", "Docker", "Kubernetes", "Nginx"],
  },
  {
    category: "CMS",
    items: ["Strapi CMS", "Headless CMS Architecture"],
  },
  {
    category: "AI & Voice",
    items: ["Azure Speech-to-Text", "Azure Text-to-Speech", "ElevenLabs", "Sarvam AI", "AI Voice Applications", "Speech Processing", "Conversational AI"],
  },
  {
    category: "DevOps & CI/CD",
    items: ["Docker", "Kubernetes", "GitHub Actions", "Jenkins", "CI/CD Pipelines", "Monorepos", "Turborepo"],
  },
  {
    category: "Architecture",
    items: ["Monorepo Architecture", "Micro Frontends", "BFF", "Component-Driven Development", "Design Systems", "Responsive Design", "Accessibility", "System Design"],
  },
  {
    category: "Testing & Quality",
    items: ["Jest", "React Testing Library", "Postman", "ESLint", "Prettier", "Husky", "lint-staged", "Pre-commit Hooks"],
  },
  {
    category: "Messaging",
    items: ["Redis", "Kafka", "RabbitMQ"],
  },
  {
    category: "Auth & Security",
    items: ["JWT", "OAuth 2.0", "Firebase Authentication", "RBAC"],
  },
  {
    category: "Developer Tools",
    items: ["Git", "GitHub", "Bitbucket", "VS Code", "npm", "pnpm", "Yarn", "Verdaccio"],
  },
  {
    category: "Build & Tooling",
    items: ["Vite", "Webpack", "Babel", "Turbo", "SWC"],
  },
  {
    category: "API Development",
    items: ["REST APIs", "OpenAPI", "Swagger", "JSON", "Axios", "Fetch API"],
  },
  {
    category: "Performance",
    items: ["Code Splitting", "Lazy Loading", "SSR", "SSG", "ISR", "Caching Strategies", "Bundle Optimization", "Lighthouse Optimization"],
  },
  {
    category: "Strongest",
    items: ["React.js", "React Native", "TypeScript", "Node.js", "NestJS", "BFF", "Design Systems", "Monorepos", "Firebase", "Docker", "Kubernetes", "AWS Lambda", "Azure AI Speech", "Strapi CMS", "Full Stack Development"],
  },
];

const cleanLine = (line: string) => line.replace(/^[-*]\s*/, "").trim();

const AboutIdeProfile = ({ name, role, markdown, html }: AboutIdeProfileProps) => {
  const [activeFile, setActiveFile] = useState<FileTab>("about.md");
  const [commandIndex, setCommandIndex] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [activeTechCategory, setActiveTechCategory] = useState<string | null>(TECH_STACK_BY_CATEGORY[0]?.category ?? null);
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

  const activeTechBogie = useMemo(
    () => TECH_STACK_BY_CATEGORY.find((item) => item.category === activeTechCategory) || TECH_STACK_BY_CATEGORY[0],
    [activeTechCategory]
  );

  const ballThemes = [
    "from-[#7C61FF] to-[#4E3CFF]",
    "from-[#17D2B9] to-[#0ea89a]",
    "from-[#82aaff] to-[#5a7bff]",
    "from-[#f78c6c] to-[#f25f3a]",
    "from-[#c792ea] to-[#9d6ad9]",
    "from-[#f07178] to-[#d94a62]",
  ];

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
            <div className="mt-4 rounded-lg border border-white/10 bg-[#060A14] p-4 font-mono text-sm text-slate-200">
              <p className="text-emerald-300">
                <span className="text-[#7C61FF]">vijay@workspace</span>:~$ {typedCommand}
                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-white/70 align-middle" aria-hidden="true" />
              </p>
              <div className="mt-3 space-y-1 text-slate-300">
                {commands[commandIndex].output.map((line) => (
                  <p key={line}>{line}</p>
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
            <Card className="rounded-xl border border-white/10 bg-[#0B1220] p-6" hoverable={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7C61FF]">Tech Stack</p>
              <p className="mt-2 text-xs text-slate-400">Hover, focus, or tap a category orb to inspect its technology blocks.</p>

              <div className="relative mt-6 flex min-h-[42rem] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#060A14] p-4">
                <div className="pointer-events-none absolute h-[76%] w-[92%] rounded-[50%] border border-[#7C61FF]/35" />
                <div className="pointer-events-none absolute h-[70%] w-[86%] rounded-[50%] border border-white/10" />

                <motion.div
                  className="relative h-[36rem] w-full max-w-[68rem]"
                  animate={reduceMotion ? undefined : { rotate: 360 }}
                  transition={reduceMotion ? undefined : { duration: 120, repeat: Infinity, ease: "linear" }}
                >
                  {TECH_STACK_BY_CATEGORY.map((bogie, index) => {
                    const angle = (index / TECH_STACK_BY_CATEGORY.length) * Math.PI * 2;
                    const radiusX = 45;
                    const radiusY = 33;
                    const x = 50 + radiusX * Math.cos(angle);
                    const y = 50 + radiusY * Math.sin(angle);
                    const theme = ballThemes[index % ballThemes.length];
                    const isActive = activeTechBogie?.category === bogie.category;

                    return (
                      <motion.div
                        key={bogie.category}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        animate={reduceMotion ? undefined : { rotate: -360 }}
                        transition={reduceMotion ? undefined : { duration: 120, repeat: Infinity, ease: "linear" }}
                      >
                        <button
                          type="button"
                          aria-label={`${bogie.category} tech stack`}
                          aria-haspopup="dialog"
                          onMouseEnter={() => setActiveTechCategory(bogie.category)}
                          onFocus={() => setActiveTechCategory(bogie.category)}
                          onClick={() => setActiveTechCategory(bogie.category)}
                          className={`group relative flex h-24 w-24 items-center justify-center rounded-full border text-center shadow-[0_8px_24px_rgba(3,8,20,0.45)] transition ${
                            isActive ? "scale-105 border-white/50" : "border-white/20 hover:scale-105"
                          } bg-gradient-to-br ${theme}`}
                        >
                          <span className="absolute inset-1 rounded-full bg-[#0B1220]/35 backdrop-blur-sm" />
                          <span className="relative px-2 text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] text-white">
                            {bogie.category}
                          </span>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {activeTechBogie ? (
                  <motion.div
                    key={activeTechBogie.category}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    role="dialog"
                    aria-label={`${activeTechBogie.category} technologies`}
                    className="absolute z-20 w-[92%] max-w-xl rounded-2xl border border-[#7C61FF]/35 bg-[#0B1220]/95 p-5 shadow-[0_18px_42px_rgba(6,10,24,0.55)] backdrop-blur"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7C61FF]">{activeTechBogie.category}</p>
                      <span className="text-xs text-slate-400">{activeTechBogie.items.length} technologies</span>
                    </div>
                    <div className="flex max-h-48 flex-wrap gap-2 overflow-auto pr-1">
                      {activeTechBogie.items.map((tech) => (
                        <span
                          key={`${activeTechBogie.category}-${tech}`}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </div>
            </Card>
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
