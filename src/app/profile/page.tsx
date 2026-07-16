import { notFound } from "next/navigation";
import { markdownToHtml } from "@/lib/cheatsheet-markdown";
import AboutIdeProfile from "@/app/components/about/AboutIdeProfile";

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
  return data?.data;
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

  const markdownContent = profile.content || "";
  const contentHtml = await markdownToHtml(markdownContent);

  return (
    <AboutIdeProfile
      name={profile.name || "Vijay Prakash"}
      role={profile.description || "Software Engineer"}
      markdown={markdownContent}
      html={contentHtml}
    />
  );
};

export default AboutMe;
