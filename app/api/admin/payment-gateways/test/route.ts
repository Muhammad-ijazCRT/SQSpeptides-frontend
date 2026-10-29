import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body: { gateway?: string; env?: string; apiKey?: string; walletAddress?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const gateway = body.gateway || "crossmint";

  if (gateway === "crossmint") {
    const env = body.env || (process.env.NEXT_PUBLIC_CROSSMINT_ENV ?? "staging").toLowerCase();
    const isProd = env === "production" || env === "prod" || env === "live";
    const baseUrl = isProd ? "https://www.crossmint.com" : "https://staging.crossmint.com";
    const apiKey = (body.apiKey || process.env.CROSSMINT_SERVER_SIDE_API_KEY || "").trim();
    const walletAddress = (
      body.walletAddress ||
      process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_WALLET ||
      "CDRL6CLJMJSLXCK2VTPJWHQRMI7EXG6BZYT7XTMH7DMMNDEDP6N4GKJ3"
    ).trim();
    const email = (body.email || "demos+onramp-existing-user@crossmint.com").trim();

    if (!apiKey) {
      return NextResponse.json(
        { ok: false, message: "Crossmint Server API Key is not set or provided." },
        { status: 400 }
      );
    }

    const t0 = Date.now();
    try {
      const userLocator = `email:${email}`;
      const url = `${baseUrl}/api/2025-06-09/users/${encodeURIComponent(userLocator)}/linked-wallets/${encodeURIComponent(walletAddress)}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({ chain: "stellar" }),
      });
      const latencyMs = Date.now() - t0;
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      if (!res.ok) {
        const errorMsg =
          typeof data.message === "string"
            ? data.message
            : typeof data.error === "string"
              ? data.error
              : `HTTP ${res.status}`;
        return NextResponse.json({
          ok: false,
          statusCode: res.status,
          latencyMs,
          endpoint: baseUrl,
          message: errorMsg,
        });
      }

      return NextResponse.json({
        ok: true,
        statusCode: res.status,
        latencyMs,
        endpoint: baseUrl,
        environment: isProd ? "production" : "staging",
        message: `Successfully connected to Crossmint ${isProd ? "Production" : "Sandbox/Staging"} API (${latencyMs}ms)!`,
      });
    } catch (e) {
      const latencyMs = Date.now() - t0;
      return NextResponse.json({
        ok: false,
        latencyMs,
        endpoint: baseUrl,
        message: e instanceof Error ? e.message : "Network error contacting Crossmint.",
      });
    }
  }

  return NextResponse.json({ ok: false, message: "Unsupported gateway for testing." }, { status: 400 });
}
