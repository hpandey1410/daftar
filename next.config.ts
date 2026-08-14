import type { NextConfig } from "next";

// The production deploy is served from daftarco.in's own root, so it must
// NOT have a basePath. But while that domain's DNS isn't live yet, this repo
// is only reachable at the subpath github.io/daftar — this flag (set only by
// the "subpath_preview" manual workflow run, never by the normal push-based
// deploy) rebuilds with that subpath baked into every asset path so the
// interim link actually renders instead of 404ing on every asset.
const isSubpathPreview = process.env.GH_PAGES_SUBPATH_PREVIEW === "1";
const REPO_BASE_PATH = "/daftar";

const nextConfig: NextConfig = {
  // static export for GitHub Pages — no server, so image optimization has
  // to be turned off (every <Image> in this app already passes its own
  // `unoptimized` prop too, this just makes it the default everywhere)
  output: "export",
  ...(isSubpathPreview
    ? { basePath: REPO_BASE_PATH, assetPrefix: `${REPO_BASE_PATH}/` }
    : {}),
  // Next only auto-prefixes basePath onto its own bundled JS/CSS/fonts —
  // plain public/ file references in raw HTML (e.g. a <video src>) need it
  // added manually, hence exposing it here for components to read.
  env: {
    NEXT_PUBLIC_BASE_PATH: isSubpathPreview ? REPO_BASE_PATH : "",
  },
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
