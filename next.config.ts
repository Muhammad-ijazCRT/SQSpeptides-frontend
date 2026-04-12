import type { NextConfig } from "next";
import { RAILWAY_API_ORIGIN } from "./lib/api/production-api-origin";
import { getCrossmintEnvMode } from "./lib/crossmint/resolve-env";

const LOCAL_API_ORIGIN = "http://localhost:3001";

/** Production → Railway by default; development → localhost unless .env overrides. */
const defaultNextPublicApiUrl =
  process.env.NODE_ENV === "production" ? RAILWAY_API_ORIGIN : LOCAL_API_ORIGIN;

const nextPublicApiUrl = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || defaultNextPublicApiUrl
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  /** Dev: allow both hostname spellings so RSC / HMR / internal fetches are not blocked when switching localhost ↔ 127.0.0.1. */
  allowedDevOrigins: ["localhost:3000", "127.0.0.1:3000"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "127.0.0.1:3000"],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: nextPublicApiUrl,
    /** Ensures production builds use www.crossmint.com + Stellar pubnet USDC when env var is missing but keys are production. */
    NEXT_PUBLIC_CROSSMINT_ENV: getCrossmintEnvMode(),
  },
  async headers() {
    return [
      {
        source: "/animation.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate=86400, immutable",
          },
        ],
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "fastly.picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async redirects() {
    return [
      // `/products` → catalog is handled in `middleware.ts` so `/products/images/*` (public files) is never redirected.
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/favicon.ico", destination: "/logo.png", permanent: false },
    ];
  },
};

export default nextConfig;
