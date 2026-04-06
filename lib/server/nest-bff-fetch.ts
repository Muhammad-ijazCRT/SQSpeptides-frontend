import { getBackendUrl } from "@/lib/server/api-url";

const BFF_TIMEOUT_MS = 45_000;

export function nestFullUrl(path: string): string {
  const base = getBackendUrl().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Server-side fetch to Nest with defaults some hosts expect (User-Agent) and a timeout so calls fail fast.
 */
export async function bffFetch(path: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "SQSpeptides-Next-BFF/1.0");
  new Headers(init?.headers).forEach((v, k) => headers.set(k, v));

  const signal = init?.signal ?? AbortSignal.timeout(BFF_TIMEOUT_MS);

  return fetch(nestFullUrl(path), {
    ...init,
    headers,
    cache: "no-store",
    signal,
  });
}
