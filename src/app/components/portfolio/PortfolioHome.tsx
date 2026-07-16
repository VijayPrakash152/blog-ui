"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Code2, Mail, MoveRight, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";
import type { Daum } from "@/api/blog/blog.interface";
import NewsletterModal from "@/app/components/NewsletterModal";

interface PortfolioHomeProps {
  posts: Array<Daum & { contentHtml: string }>;
}

const careerSteps = [
  {
    title: "Graduation",
    subtitle: "B.Tech, Civil Engineering",
    detail: "Built a strong analytical foundation at NIT Durgapur and completed the degree in 2021 with a strong GPA.",
  },
  {
    title: "Engineering Intern",
    subtitle: "Mathongo",
    detail: "Worked on OCR and analytics experiences while strengthening backend and product engineering fundamentals.",
  },
  {
    title: "Software Engineer",
    subtitle: "Wipro",
    detail: "Delivered MERN-based applications with secure authentication, CI/CD, and modern delivery practices.",
  },
  {
    title: "Product Engineer",
    subtitle: "ElevateHQ and Medi Assist",
    detail: "Expanded into scalable microservices, performance tuning, cloud deployment, and resilient product systems.",
  },
  {
    title: "Current Role",
    subtitle: "Senior Analyst – Software Engineering at Cigna Healthcare",
    detail: "Building full-stack healthcare applications with React, React Native, Node.js, AWS, and Kubernetes.",
  },
];

const skills = [
  { category: "Frontend", items: ["React", "TypeScript", "Redux", "Tailwind CSS", "Storybook"] },
  { category: "Backend", items: ["NestJS", "Node.js", "Java", "REST APIs", "Redis", "Kafka"] },
  { category: "Platform", items: ["AWS", "Docker", "Kubernetes", "Firebase", "Postgres", "MongoDB"] },
  { category: "AI & Product", items: ["Speech STT/TTS", "Azure", "Microfrontend", "Design systems", "Accessibility"] },
];

const experience = [
  {
    company: "Cigna Healthcare",
    role: "Senior Analyst – Software Engineering",
    duration: "Jul 2026 — Present",
    description:
      "Designing and developing scalable, secure healthcare applications across web and mobile with full-stack engineering practices.",
    technologies: ["React", "React Native", "Node.js", "AWS Lambda", "Kubernetes"],
    achievements: ["Built BFF services", "Worked in monorepo architecture", "Integrated Firebase and CMS-driven experiences"],
  },
  {
    company: "Havells",
    role: "Research Engineer",
    duration: "Apr 2026 — Jul 2026",
    description:
      "Built AI-powered voice and communications systems using speech, cloud, and integration technologies for intelligent user experiences.",
    technologies: ["Azure", "STT", "TTS", "ElevenLabs", "Sarvam AI"],
    achievements: ["Built voice-enabled workflows", "Integrated AI notification systems", "Evaluated emerging AI APIs"],
  },
  {
    company: "Medi Assist",
    role: "Software Engineer II",
    duration: "May 2023 — Mar 2026",
    description:
      "Led healthtech and insurtech application optimization across frontend, backend, infrastructure, and performance engineering.",
    technologies: ["React", "NestJS", "Docker", "Kubernetes", "AWS"],
    achievements: ["Improved performance and reliability", "Implemented microfrontend architecture", "Built centralized configuration services"],
  },
];

const stats = [
  { value: "5+", label: "Years building" },
  { value: "20+", label: "Product solutions" },
  { value: "8+", label: "Core technologies" },
  { value: "1", label: "Newsletter community" },
];

const PortfolioHome = ({ posts }: PortfolioHomeProps) => {
  const latestPosts = posts.slice(0, 3);

  return (
    <div className="bg-[#05070B] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#070A11] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,97,255,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(23,210,185,0.12),transparent_24%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7C61FF]/60 to-transparent" aria-hidden="true" />
        <Container className="relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200">
                <Sparkles className="h-4 w-4 text-[#7C61FF]" />
                Software engineer crafting premium digital products
              </div>
              <h1 className="mt-8 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
                Vijay Prakash
              </h1>
              <p className="mt-5 text-lg text-[#BAC7D6] sm:text-xl">
                I build elegant, high-quality software experiences with a deep focus on product, performance, and design systems.
              </p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                I’m a developer who cares about the details that make interfaces feel effortless — from architecture to animation to the final pixel.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.linkedin.com/in/me-vijay-prakash"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-full bg-[#7C61FF] px-6 text-sm font-semibold text-white transition duration-200 hover:bg-[#6c53ff]"
                  )}
                >
                  View profile <MoveRight className="ml-2 h-4 w-4" />
                </a>
                <NewsletterModal />
              </div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-[2rem] border border-white/10 bg-[#0B1220]/90 p-7 shadow-lg shadow-black/30 backdrop-blur">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-[#7C61FF]">
                <BriefcaseBusiness className="h-4 w-4" />
                Current focus
              </div>
              <div className="mt-6 space-y-4">
                {[
                  "Designing polished, reliable product experiences",
                  "Building approachable systems with strong engineering fundamentals",
                  "Writing about modern web development and product thinking",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <Code2 className="mt-0.5 h-4 w-4 text-[#17D2B9]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4 }} className="rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-6 text-center shadow-sm shadow-black/20">
                <p className="text-3xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-6 py-4 sm:px-10 lg:px-16">
        <Container>
          <SectionHeader label="Career journey" title="A measured path from fundamentals to modern product engineering." description="The milestones that shaped how I build today." />
          <div className="mt-10 grid gap-4 lg:grid-cols-5">
            {careerSteps.map((step, index) => (
              <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-6 shadow-sm shadow-black/20">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-[#17D2B9]">{step.subtitle}</p>
                <p className="mt-4 text-sm leading-7 text-slate-400">{step.detail}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Container>
          <SectionHeader label="Skills" title="A focused stack built for modern product work." description="The tools and patterns I use to deliver thoughtful interfaces and durable systems." />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skills.map((skill) => (
              <Card key={skill.category} className="rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-6" hoverable>
                <h3 className="text-lg font-semibold text-white">{skill.category}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-6 py-4 sm:px-10 lg:px-16">
        <Container>
          <SectionHeader label="Experience" title="Selected experience focused on modern product delivery." description="Work that blends engineering quality with polished user experiences." />
          <div className="mt-10 space-y-6">
            {experience.map((item, index) => (
              <motion.article key={item.company} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, delay: index * 0.05 }} className="rounded-[1.75rem] border border-white/10 bg-[#0B1220] p-8 shadow-sm shadow-black/20">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">{item.duration}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{item.role}</h3>
                    <p className="mt-2 text-lg text-slate-300">{item.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">{tech}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-6 max-w-3xl text-base leading-7 text-slate-400">{item.description}</p>
                <ul className="mt-6 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="rounded-2xl border border-white/10 bg-white/5 p-3">{achievement}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section className="px-6 py-4 sm:px-10 lg:px-16">
        <Container>
          <SectionHeader label="Latest writing" title="A short preview of the engineering blog." description="The most recent posts remain available on the dedicated blog route." />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Card key={post.id} as={motion.article} className="rounded-[1.5rem] border border-white/10 bg-[#0B1220] p-6" hoverable>
                <p className="text-sm uppercase tracking-[0.24em] text-[#7C61FF]">{post.category?.name || "Uncategorized"}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">{post.contentHtml.replace(/<[^>]+>/g, "")}</p>
                <Link href={`/posts/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7C61FF] transition hover:text-white">
                  Read article <ArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-start">
            <Link href="/posts" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
              View all articles <MoveRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="px-6 py-20 sm:px-10 lg:px-16">
        <Container>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.4 }} className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0B1220] to-[#111827] p-10 shadow-lg shadow-black/30">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C61FF]">Contact</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Let’s build something thoughtful together.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">If you are looking for a thoughtful engineer to shape products, design systems, or product experiences, I’d love to connect.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:vijayprakash152@gmail.com"
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-full bg-[#7C61FF] px-6 text-sm font-semibold text-white transition duration-200 hover:bg-[#6c53ff]"
                  )}
                >
                  <Mail className="mr-2 h-4 w-4" /> Email me
                </a>
                <a
                  href="https://www.linkedin.com/in/me-vijay-prakash"
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-100 transition duration-200 hover:bg-white/10"
                  )}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default PortfolioHome;
