import { NextResponse } from "next/server";
import { COOKIE_MAX_AGE_SEC, CUSTOMER_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { bffFetch } from "@/lib/server/nest-bff-fetch";

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
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  let res: Response;
  try {
    res = await bffFetch("/auth/customer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[api/auth/customer/signup] Nest unreachable", err);
    return NextResponse.json(
      {
        message:
          "Could not reach the peptide API from the server. In Vercel → Environment Variables, set NEXT_PUBLIC_API_URL to https://sqspeptides-backend-production.up.railway.app (and remove API_URL if it still says localhost), then redeploy. Check Vercel function logs for details.",
      },
      { status: 502 },
    );
  }

  const data = (await res.json().catch(() => ({}))) as { accessToken?: string; message?: string | string[] };
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join(", ") : data.message ?? "Signup failed";
    return NextResponse.json({ message: msg }, { status: res.status });
  }
  if (!data.accessToken) {
    return NextResponse.json({ message: "Invalid response from server" }, { status: 502 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_TOKEN_COOKIE, data.accessToken, authCookieOptions());
  return response;
}
