import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only the photos /design-system draws are remote; everything else is on
    // disk. The pattern names that host and its photo paths, not the host whole,
    // so this site's optimiser is not a proxy for the rest of the host.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*" }],
  },
};

export default nextConfig;
