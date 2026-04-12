import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await fetch(`${getBackendUrl()}/checkout/nowpayments/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
