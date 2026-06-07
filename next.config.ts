import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "assets.adidas.com" },
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "images.asics.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
