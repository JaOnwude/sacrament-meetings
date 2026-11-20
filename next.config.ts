import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // By default, a page's <title> and <meta> tags that come from generateMetadata (like our
  // per-meeting titles) are streamed in and appended to <body>. This setting keeps them in
  // <head> for every visitor, so the page source, search engines and tools like Lighthouse
  // always find them. (The trade-off: the page waits for its metadata.)
  htmlLimitedBots: /.*/,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
