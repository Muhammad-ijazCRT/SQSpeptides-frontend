import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

export async function GET() {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  let res: Response;
  try {
    res = await fetch(`${getBackendUrl()}/auth/customer/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "API unreachable" }, { status: 502 });
  }
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
