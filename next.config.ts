import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "ui-lib.com" }],
    // Allow unoptimized images from backend-assets (since they're served via API route)
    unoptimized: false,
    // Add loader for backend-assets
    loader: "default",
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/backend-assets/:path*",
        destination: "/api/backend-assets/:path*",
      },
    ];
  },
};

export default nextConfig;
