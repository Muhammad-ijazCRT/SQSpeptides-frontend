import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function DELETE(_request: Request, ctx: { params: Promise<{ productId: string }> }) {
  const { productId } = await ctx.params;
  const res = await proxyBackend(`/customer/wishlist/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
