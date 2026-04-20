import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const res = await proxyBackend(`/orders/my/${encodeURIComponent(id)}`);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
