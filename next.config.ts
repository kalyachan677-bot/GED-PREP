import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Next.js image optimization (sharp uses native binaries, not supported on CF Workers)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
