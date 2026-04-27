import { getBackendUrl } from "@/lib/server/api-url";
import { bffSelfProxyErrorBody, bffTargetsSameHostPortAsRequest } from "@/lib/server/bff-self-proxy";

/** Override with NEST_BFF_TIMEOUT_MS (5000–300000). Default 120s for cold DB + Neon latency. */
export function getNestBffTimeoutMs(): number {
  const raw = process.env.NEST_BFF_TIMEOUT_MS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(n) && n >= 5000 && n <= 300_000) return n;
  return 120_000;
}

export function nestFullUrl(path: string): string {
  const base = getBackendUrl().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** Server → Nest with headers and timeout (see NEST_BFF_TIMEOUT_MS). Pass `incomingRequest` when in a Route Handler so same-origin misconfig fails fast. */
export async function bffFetch(
  path: string,
  init?: RequestInit,
  incomingRequest?: Pick<Request, "url">
): Promise<Response> {
  if (incomingRequest?.url && bffTargetsSameHostPortAsRequest(incomingRequest.url)) {
    return Response.json(bffSelfProxyErrorBody(), { status: 500 });
  }
  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("User-Agent", "SQSpeptides-Next-BFF/1.0");
  new Headers(init?.headers).forEach((v, k) => headers.set(k, v));

  const signal = init?.signal ?? AbortSignal.timeout(getNestBffTimeoutMs());

  return fetch(nestFullUrl(path), {
    ...init,
    headers,
    cache: "no-store",
    signal,
  });
}
