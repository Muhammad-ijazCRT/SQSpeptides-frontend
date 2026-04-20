import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function GET() {
  const res = await proxyBackend("/customer/wishlist");
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.text();
  const res = await proxyBackend("/customer/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
