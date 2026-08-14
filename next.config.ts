import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // static export for GitHub Pages — no server, so image optimization has
  // to be turned off (every <Image> in this app already passes its own
  // `unoptimized` prop too, this just makes it the default everywhere)
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
};

export default nextConfig;
