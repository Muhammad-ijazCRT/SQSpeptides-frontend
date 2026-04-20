import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, ctx: RouteContext) {
  const { token } = await ctx.params;
  const res = await fetch(`${getBackendUrl()}/public/payment-invoices/${encodeURIComponent(token)}`, {
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
