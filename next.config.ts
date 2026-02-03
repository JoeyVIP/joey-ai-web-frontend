import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use SSR for dynamic routes (not static export)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
