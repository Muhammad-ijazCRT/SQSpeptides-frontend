import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { bffFetch } from "@/lib/server/nest-bff-fetch";

export async function GET() {
  const token = (await cookies()).get(CUSTOMER_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let res: Response;
  try {
    res = await bffFetch("/auth/customer/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error("[api/auth/customer/me] backend unreachable", err);
    return NextResponse.json({ message: "API unreachable" }, { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
