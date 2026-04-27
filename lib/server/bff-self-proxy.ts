import { getBackendUrl } from "@/lib/server/api-url";

/** True when Nest base URL is the same host+port as this Next request (infinite proxy loop). */
export function bffTargetsSameHostPortAsRequest(requestUrl: string): boolean {
  let incoming: URL;
  let upstream: URL;
  try {
    incoming = new URL(requestUrl);
    upstream = new URL(getBackendUrl());
  } catch {
    return false;
  }
  const port = (u: URL) => u.port || (u.protocol === "https:" ? "443" : "80");
  return incoming.hostname === upstream.hostname && port(incoming) === port(upstream);
}

export function bffSelfProxyErrorBody() {
  return {
    code: "BFF_SELF_PROXY" as const,
    message:
      "API_URL / NEXT_PUBLIC_API_URL points at this Next server (same port), not the Nest API. " +
      "Run SQSpeptides-backend on port 3001 (pnpm dev in that folder, or pnpm dev:all from the storefront root). " +
      "Do not run the duplicate app in storefront backend/ on 3001 — it uses port 3002.",
  };
}
