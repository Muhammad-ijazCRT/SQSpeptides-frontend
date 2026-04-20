import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteCtx) {
  const { id } = await ctx.params;
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const body = await request.text();
  const res = await fetch(`${getBackendUrl()}/admin/affiliate/payout-requests/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
