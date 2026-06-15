/**
 * Resolves the store API base URL for server-side code (RSC, Route Handlers).
 * Local: prefers localhost from env. Deployed: prefers non-localhost URLs and falls back to Railway.
 */

import { RAILWAY_API_ORIGIN, sanitizeApiOriginForCloud } from "@/lib/api/production-api-origin";

const LOCAL_DEFAULT = "http://localhost:3001";

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

/** Runtime read avoids empty NEXT_PUBLIC values stuck from an old production bundle. */
function readNextPublicApiUrl(): string | undefined {
  const key = "NEXT_PUBLIC_" + "API_URL";
  return process.env[key]?.trim();
}

function pickNonEmpty(...vals: (string | undefined)[]): string[] {
  return vals.filter((v): v is string => Boolean(v?.trim())).map((v) => v.trim());
}

/**
 * Single source of truth for “where is the Fastify API?” on server and in apiUrl().
 */
export function getNestBaseUrl(): string {
  const rawApi = process.env.API_URL?.trim();
  const rawPublic = readNextPublicApiUrl();
  const candidates = pickNonEmpty(rawApi, rawPublic);

  const deployed = isCloudDeploy();

  const ordered = deployed
    ? [...candidates].sort((a, b) => {
        const sa = stripTrailingSlashes(a);
        const sb = stripTrailingSlashes(b);
        return (isLocalhostOrigin(sa) ? 1 : 0) - (isLocalhostOrigin(sb) ? 1 : 0);
      })
    : candidates;

  for (const raw of ordered) {
    const normalized = deployed ? sanitizeApiOriginForCloud(raw) : stripTrailingSlashes(raw);
    if (!normalized) continue;
    if (deployed && isLocalhostOrigin(normalized)) continue;
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return normalized;
    }
  }

  if (deployed) {
    return sanitizeApiOriginForCloud(RAILWAY_API_ORIGIN);
  }

  return LOCAL_DEFAULT;
}
