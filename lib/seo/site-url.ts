/** Canonical public site origin (no trailing slash). */
export const DEFAULT_SITE_URL = "https://www.sqspeptides.com";

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (!fromEnv) return DEFAULT_SITE_URL;
  const withProtocol = fromEnv.startsWith("http") ? fromEnv : `https://${fromEnv}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
