import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE, COOKIE_MAX_AGE_SEC } from "@/lib/auth/cookies";
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

function nestErrorMessage(data: Record<string, unknown>): string {
  const m = data.message;
  if (Array.isArray(m)) return m.map(String).filter(Boolean).join(", ");
  if (typeof m === "string" && m.trim()) return m;
  return "Login failed";
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
    res = await bffFetch("/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[api/auth/admin/login] backend unreachable", err);
    return NextResponse.json(
      {
        message:
          "Could not reach the API from the server. For local dev run `pnpm dev:api` (or `pnpm dev:all`) and set NEXT_PUBLIC_API_URL=http://localhost:3001 if needed.",
      },
      { status: 502 },
    );
  }

  try {
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
      accessToken?: string;
    };
    if (!res.ok) {
      const msg = nestErrorMessage(data);
      const status = typeof data.statusCode === "number" ? data.statusCode : res.status;
      return NextResponse.json({ message: msg }, { status });
    }
    if (!data.accessToken || typeof data.accessToken !== "string") {
      return NextResponse.json({ message: "Invalid response from server" }, { status: 502 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_TOKEN_COOKIE, data.accessToken, authCookieOptions());
    return response;
  } catch (err) {
    console.error("[api/auth/admin/login] unexpected error", err);
    return NextResponse.json(
      {
        message:
          "Sign-in could not be completed. Ensure JWT_SECRET is set in the app .env (same as backend), the API is running, and you ran `pnpm prisma db seed` in backend/.",
      },
      { status: 500 },
    );
  }
}
