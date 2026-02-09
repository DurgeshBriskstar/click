import type { NextConfig } from "next";

// CORS: use NEXT_PUBLIC_BASE_URL or on Vercel fall back to VERCEL_URL
const baseUrlOrigin = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const corsOrigin = baseUrlOrigin || vercelOrigin;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.vercel.app", pathname: "/**" },
    ],
    unoptimized: false,
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
  async headers() {
    if (!corsOrigin) return [];
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: corsOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, PATCH, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
      {
        source: "/backend-assets/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: corsOrigin },
        ],
      },
    ];
  },
};

export default nextConfig;
