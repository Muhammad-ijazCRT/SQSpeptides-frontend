import type { NextConfig } from "next";
import { RAILWAY_API_ORIGIN } from "./lib/api/production-api-origin";

const LOCAL_API_ORIGIN = "http://localhost:3001";

/** Production → Railway by default; development → localhost unless .env overrides. */
const defaultNextPublicApiUrl =
  process.env.NODE_ENV === "production" ? RAILWAY_API_ORIGIN : LOCAL_API_ORIGIN;

const nextPublicApiUrl = (
  process.env.NEXT_PUBLIC_API_URL?.trim() || defaultNextPublicApiUrl
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: nextPublicApiUrl,
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
    ];
  },
};

export default nextConfig;
