import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";
import { bffFetch, getNestBffTimeoutMs } from "@/lib/server/nest-bff-fetch";

export async function POST(request: Request) {
  const body = await request.text();
  let res: Response;
  try {
    res = await bffFetch(
      "/api/create-payment",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      },
      request
    );
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const isTimeout = err.name === "TimeoutError" || err.name === "AbortError";
    const ms = getNestBffTimeoutMs();
    const upstream = getBackendUrl().replace(/\/+$/, "");
    const hintLocal =
      upstream.includes("localhost") || upstream.includes("127.0.0.1")
        ? " Start Nest (SQSpeptides-backend: pnpm dev) or run pnpm dev:all from the storefront."
        : " Confirm API_URL and that Nest is running.";
    console.error("[POST /api/create-payment] BFF failed:", err.name, err.message);
    return NextResponse.json(
      {
        message: isTimeout
          ? `Nest PayRam create-payment timed out (${ms}ms). Check PAYRAM_* on Nest and NEST_BFF_TIMEOUT_MS.`
          : `Could not reach Nest create-payment at ${upstream}: ${err.message}.${hintLocal}`,
        code: isTimeout ? "NEST_UPSTREAM_TIMEOUT" : "NEST_PROXY_UNREACHABLE",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[POST /api/create-payment] Nest returned", res.status, JSON.stringify(data).slice(0, 2000));
  }
  return NextResponse.json(data, { status: res.status });
}
