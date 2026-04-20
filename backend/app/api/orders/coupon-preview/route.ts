import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await proxyBackend("/orders/coupon-preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
