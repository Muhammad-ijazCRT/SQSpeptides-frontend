import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await proxyBackend(
    "/api/orders/coupon-preview",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    },
    request
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
