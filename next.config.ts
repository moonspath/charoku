import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for external kakejiku images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thumbnail.image.rakuten.co.jp" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
