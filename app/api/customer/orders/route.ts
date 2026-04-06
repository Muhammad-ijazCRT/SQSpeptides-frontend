import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function GET() {
  const res = await proxyBackend("/orders/my");
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
