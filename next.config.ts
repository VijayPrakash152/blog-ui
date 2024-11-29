import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/blogs',  // your frontend route
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`,  // backend API
      },
    ];
  },
};

export default nextConfig;
// next.config.js
