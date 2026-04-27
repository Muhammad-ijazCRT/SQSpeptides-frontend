import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";
import { proxyBackend } from "@/lib/server/customer-proxy";
import { getNestBffTimeoutMs } from "@/lib/server/nest-bff-fetch";

export const maxDuration = 120;

export async function POST(request: Request) {
  const body = await request.text();
  const upstream = getBackendUrl().replace(/\/+$/, "");
  let res: Response;
  try {
    res = await proxyBackend(
      "/api/orders",
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
    const hintLocal =
      upstream.includes("localhost") || upstream.includes("127.0.0.1")
        ? " Start the Nest API (folder SQSpeptides-backend: pnpm install then pnpm dev), or from the storefront repo run pnpm dev:all to start Next and Nest together."
        : " Confirm API_URL / NEXT_PUBLIC_API_URL and that the Nest process is running.";
    const message = isTimeout
      ? `Nest store API timed out before responding (${ms}ms, set NEST_BFF_TIMEOUT_MS to adjust). ` +
        `Target: ${upstream}. PayRam runs only after the order exists (POST /api/create-payment). ` +
        `Check: Nest is running, DATABASE_URL is reachable, and consider raising NEST_BFF_TIMEOUT_MS for cold starts.`
      : `Next could not reach the Nest API at ${upstream}: ${err.message}.${hintLocal}`;
    console.error("[POST /api/orders] upstream proxy failed:", err.name, err.message);
    return NextResponse.json(
      {
        message,
        code: isTimeout ? "NEST_UPSTREAM_TIMEOUT" : "NEST_PROXY_UNREACHABLE",
        upstream,
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("[POST /api/orders] Nest returned", res.status, JSON.stringify(data).slice(0, 2000));
  }
  if (res.ok) {
    after(() => {
      revalidatePath("/account/orders");
      revalidatePath("/account/dashboard");
      revalidatePath("/account/affiliate");
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/dashboard/orders");
    });
  }
  return NextResponse.json(data, { status: res.status });
}
