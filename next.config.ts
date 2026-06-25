import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";

    return [
      {
        source: '/api/blogs',
        destination: `${apiUrl}/api/blogs`,
      },
      {
        source: '/api/categories',
        destination: `${apiUrl}/api/categories`,
      },
      {
        source: '/api/profile',
        destination: `${apiUrl}/api/profile`,
      },
    ];
  },
};

export default nextConfig;
// next.config.js
