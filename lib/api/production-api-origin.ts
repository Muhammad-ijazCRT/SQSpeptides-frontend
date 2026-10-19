/** Live Nest API on Railway (no trailing slash). Override with NEXT_PUBLIC_API_URL / API_URL for staging. */
export const RAILWAY_API_ORIGIN = "https://sqspeptides-backend-production-ce84.up.railway.app";

/** Previous Railway host. Production builds that still have it set must use the current origin. */
const RETIRED_API_HOSTS = new Set(["sqspeptides-backend-production.up.railway.app"]);

/** Cloud-safe API origin: no trailing slash, no localhost, prefer HTTPS. */
export function sanitizeApiOriginForCloud(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return RAILWAY_API_ORIGIN;

  try {
    const u = new URL(trimmed);
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1" || RETIRED_API_HOSTS.has(u.hostname)) {
      return RAILWAY_API_ORIGIN;
    }
    if (u.protocol === "http:") {
      u.protocol = "https:";
    }
    return u.toString().replace(/\/+$/, "");
  } catch {
    return RAILWAY_API_ORIGIN;
  }
}
