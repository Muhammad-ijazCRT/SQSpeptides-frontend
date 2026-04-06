import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE, COOKIE_MAX_AGE_SEC } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

function authCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_SEC,
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${getBackendUrl()}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { accessToken?: string; message?: string | string[] };
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Login failed";
    return NextResponse.json({ message: msg }, { status: res.status });
  }
  if (!data.accessToken) {
    return NextResponse.json({ message: "Invalid response from server" }, { status: 502 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_TOKEN_COOKIE, data.accessToken, authCookieOptions());
  return response;
}
