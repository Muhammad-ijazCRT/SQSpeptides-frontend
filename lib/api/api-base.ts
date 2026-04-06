/**
 * NestJS API origin for server-side fetch (RSC, route handlers).
 * Uses API_URL when set and non-empty, else NEXT_PUBLIC_API_URL, else localhost.
 * Trailing slashes are stripped so paths like `/auth/...` join correctly.
 */
export function getNestBaseUrl(): string {
  const fromDedicated = process.env.API_URL?.trim();
  const fromPublic = process.env.NEXT_PUBLIC_API_URL?.trim();
  const raw = (fromDedicated || fromPublic || "http://localhost:3001").replace(/\/$/, "");
  return raw;
}
