/**
 * Store API origin (Fastify on Railway) for server-side fetch (RSC, route handlers).
 * Paths join as `${base}/auth/...`, `/products`, etc. — add `/api` in env only if your server uses that prefix.
 */

import { RAILWAY_API_ORIGIN } from "@/lib/api/production-api-origin";

function stripTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

function isLocalhostOrigin(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return /^https?:\/\/(localhost|127\.0\.0\.1)\b/i.test(url);
  }
}

/** Hosted deploy (Vercel, etc.) — not `next dev` on a laptop. */
function isCloudDeploy(): boolean {
  return (
    process.env.VERCEL === "1" ||
    Boolean(process.env.VERCEL_URL) ||
    process.env.CF_PAGES === "1" ||
    process.env.NETLIFY === "true" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.RAILWAY_ENVIRONMENT)
  );
}

/**
 * Read at runtime so Vercel env changes are not lost to build-time inlining of empty values.
 */
function readNextPublicApiUrl(): string | undefined {
  const key = "NEXT_PUBLIC_" + "API_URL";
  return process.env[key]?.trim();
}

export function getNestBaseUrl(): string {
  const rawApi = process.env.API_URL?.trim();
  const rawPublic = readNextPublicApiUrl();
  const candidates = [rawApi, rawPublic].filter((v): v is string => Boolean(v));

  const deployed = isCloudDeploy();

  const ordered = deployed
    ? [...candidates].sort((a, b) => {
        const sa = stripTrailingSlashes(a);
        const sb = stripTrailingSlashes(b);
        return (isLocalhostOrigin(sa) ? 1 : 0) - (isLocalhostOrigin(sb) ? 1 : 0);
      })
    : candidates;

  for (const raw of ordered) {
    const normalized = stripTrailingSlashes(raw);
    if (!normalized) continue;
    if (deployed && isLocalhostOrigin(normalized)) continue;
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }
  }

  if (deployed) {
    return stripTrailingSlashes(RAILWAY_API_ORIGIN);
  }

  return "http://localhost:3001";
}
