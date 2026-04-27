import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

/**
 * PayRam posts to the storefront URL (e.g. https://www.sqspeptides.com/api/payram/webhook).
 * This route forwards the body and API key to the Nest API.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const url = `${getBackendUrl().replace(/\/+$/, "")}/api/payram/webhook`;
  const headers = new Headers();
  headers.set("Content-Type", request.headers.get("content-type") ?? "application/json");
  const apiKey =
    request.headers.get("api-key") ??
    request.headers.get("API-Key") ??
    request.headers.get("x-api-key") ??
    "";
  if (apiKey) headers.set("API-Key", apiKey);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
