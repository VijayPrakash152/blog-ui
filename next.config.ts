import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/blogs',  // your frontend route
        destination: 'http://localhost:1337/api/blogs',  // backend API
      },
    ];
  },
};

export default nextConfig;
// next.config.js
