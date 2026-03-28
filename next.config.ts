import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:43000', 'localhost:3000', 'gokind.flatsync.app', 'https://gokind.flatsync.app', '*.flatsync.app'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    // Proxy Supabase API through Next.js so only port 3000 needs to be exposed
    const supabaseInternal = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
    return [
      { source: "/supabase/:path*", destination: `${supabaseInternal}/:path*` },
    ];
  },
};

export default nextConfig;
