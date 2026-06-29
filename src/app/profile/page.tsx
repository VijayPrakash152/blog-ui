import { notFound } from "next/navigation";
import { GithubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/icons";
import { remark } from "remark";
import html from "remark-html";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";

const getApiUrl = (path: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "https://api.vijayprakash.co.in";
  return new URL(path, apiUrl).toString();
};

const fetchProfileData = async () => {
  const res = await fetch(getApiUrl('/api/profile'), {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const data = await res.json();
  const profile = data?.data;

  if (profile?.content) {
    const processedContent = await remark().use(html).process(profile.content);
    profile.content = processedContent.toString();
  }
  return profile;
};

export async function generateMetadata() {
  const profile = await fetchProfileData();

  if (!profile) {
    return {
      title: "404 - Page Not Found",
    };
  }

  const { name = "Vijay Prakash", description = "Software Engineer" } = profile;

  return {
    title: `About ${name} - Software Engineer | Lifelong Learner`,
    description,
    keywords: [
      "Vijay Prakash",
      "Software Engineer",
      "About Me",
      "GitHub",
      "LinkedIn",
      "Twitter",
      "React Developer",
      "Next.js Developer",
    ],
    openGraph: {
      type: "website",
      url: "https://vijayprakash.co.in/profile",
      title: `About ${name} - Software Engineer | Lifelong Learner`,
      description,
      images: [
        {
          url: "https://vijayprakash.co.in/profile-picture.jpg",
          width: 800,
          height: 600,
          alt: "Vijay Prakash",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      url: "https://vijayprakash.co.in/profile",
      title: `About ${name} - Software Engineer | Lifelong Learner`,
      description,
      image: "https://vijayprakash.co.in/profile-picture.jpg",
    },
  };
}

const AboutMe = async () => {
  const profile = await fetchProfileData();

  if (!profile) {
    notFound();
  }

  return (
    <div className="bg-[#05070B] min-h-screen text-white">
      <section className="border-b border-white/10 py-16">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-[2rem] border border-white/10 bg-[#0B1220] p-8 shadow-lg shadow-black/20">
            <img
              src="/profile-picture.jpg"
              alt="Vijay Prakash"
              className="mx-auto mb-6 h-36 w-36 rounded-full object-cover shadow-xl"
            />
            <h1 className="text-3xl font-semibold text-white">Vijay Prakash</h1>
            <p className="mt-3 text-lg text-slate-300">Senior Software Engineer with 5+ years shaping elegant product systems.</p>
            <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
              <a href="https://github.com/VijayPrakash152" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-[#7C61FF] hover:text-white">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/in/me-vijay-prakash" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-[#7C61FF] hover:text-white">
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a href="https://x.com/VijayPr4788148" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-[#7C61FF] hover:text-white">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0B1220] p-8 shadow-lg shadow-black/20">
            <SectionHeader
              label="About"
              title="A few words about my journey and what I build."
              description="This page highlights the motivations, experience, and focus areas behind the blog and engineering work."
            />
            <div className="prose prose-invert mt-6 max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: profile.content }} />
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AboutMe;
