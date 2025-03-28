import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["raw.githubusercontent.com"], // Allow images from this domain
  },
  typescript: {
    ignoreBuildErrors: false, // Should be false for proper type checking
  },
};

export default nextConfig;
