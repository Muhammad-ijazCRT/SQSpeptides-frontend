/**
 * NestJS API origin for server-side fetch (RSC, route handlers).
 * Paths are joined as `${base}/auth/...`, `/products`, etc. — no `/api` segment unless you put it in the env base.
 */

/** Public production API (Railway). Used on Vercel when env points at localhost or is unset. */
const SQSPEPTIDES_PRODUCTION_API = "https://sqspeptides-backend-production.up.railway.app";

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

/**
 * Resolves Nest base URL. On Vercel, `API_URL=http://localhost:3001` from templates is ignored so
 * `NEXT_PUBLIC_API_URL` (Railway) or the production default is used instead.
 */
export function getNestBaseUrl(): string {
  const onVercel = process.env.VERCEL === "1";
  const candidates = [process.env.API_URL?.trim(), process.env.NEXT_PUBLIC_API_URL?.trim()].filter(
    (v): v is string => Boolean(v),
  );

  for (const raw of candidates) {
    const normalized = stripTrailingSlashes(raw);
    if (onVercel && isLocalhostOrigin(normalized)) {
      continue;
    }
    return normalized;
  }

  if (onVercel) {
    return stripTrailingSlashes(SQSPEPTIDES_PRODUCTION_API);
  }

  return "http://localhost:3001";
}
