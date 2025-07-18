import type { NextConfig } from "next";

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  runtimeCaching,
  customWorkerDir: "worker",
  exclude: [
    ({ asset }: { asset: { name: string } }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      return false;
    },
  ],
  fallbacks: {
    document: "/_offline",
  },
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  reactStrictMode: true,
  output: "standalone",
};

export default withPWA(nextConfig);
