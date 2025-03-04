import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
};

export default withPWA(nextConfig);
