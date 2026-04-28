import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const resolvedApiUrl = getBackendUrl().replace(/\/+$/, "");
  const healthUrl = `${resolvedApiUrl}/health`;

  try {
    const res = await fetch(healthUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });
    const body = await res.json().catch(() => null);
    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        resolvedApiUrl,
        healthUrl,
        backend: body,
      },
      { status: res.ok ? 200 : 502 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        ok: false,
        status: 0,
        resolvedApiUrl,
        healthUrl,
        error: message,
      },
      { status: 502 },
    );
  }
}
