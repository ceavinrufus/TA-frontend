import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ipfs.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ipfs.filebase.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "self-hosting-v1.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
  experimental: {
    // Try enabling modern module resolution
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Add alias resolution for the '@' prefix
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        "@": path.resolve(__dirname),
      },
    };
    return config;
  },
};

export default nextConfig;
