import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 produces a plain `out/` directory for GitHub Pages.
 * Feeds are then frozen at build time instead of revalidating every 6h.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStatic ? { output: "export", images: { unoptimized: true } } : {}),
  images: {
    unoptimized: isStatic,
    remotePatterns: [
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
    ],
  },
};

export default nextConfig;
