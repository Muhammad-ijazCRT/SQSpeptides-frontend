import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

export async function GET() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const res = await fetch(`${getBackendUrl()}/admin/affiliate/payout-requests`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
