// pages/about-me.js
import { notFound } from "next/navigation";
import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { remark } from "remark";
import html from "remark-html";

// Fetch profile data
const fetchProfileData = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile data");
  }

  const data = await res.json();
  const profile = data?.data; // Assuming API returns a single profile object

  if (profile?.content) {
    const processedContent = await remark().use(html).process(profile.content);
    profile.content = processedContent.toString();
  }
  return profile;
};

// Metadata generation for dynamic profile data
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
    description: description,
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
      description: description,
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
      description: description,
      image: "https://vijayprakash.co.in/profile-picture.jpg",
    },
  };
}

// Main AboutMe component
const AboutMe = async () => {
  const profile = await fetchProfileData();

  // If the profile data is not found, show a 404 page
  if (!profile) {
    notFound(); // This triggers the Next.js 404 page
  }

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center text-white">
      {/* Profile Section */}
      <section className="relative text-white w-full py-12 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-gray-800 p-8 rounded-4 shadow-lg">
            <img
              src="/profile-picture.jpg"
              alt="Vijay Prakash"
              className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105"
            />
            <h1 className="text-3xl font-semibold mb-1">Vijay Prakash</h1>
            <p className="text-lg mb-4 text-gray-400">
              Software Engineer 🚀 | Lifelong Learner
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mb-6">
              <a
                href="https://github.com/VijayPrakash152"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-white transform transition-all duration-300 hover:scale-110"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/me-vijay-prakash"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-white transform transition-all duration-300 hover:scale-110"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="https://x.com/VijayPr4788148"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-white transform transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={28} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="relative flex-grow w-full about-me-section">
        <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-4 h-full overflow-y-auto shadow-inner">
          <div className="container mx-auto max-w-3xl bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              About Me
            </h2>
            <div
              className="text-gray-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: profile.content }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutMe;
