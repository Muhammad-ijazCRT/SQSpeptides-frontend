import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

export async function GET() {
  const res = await fetch(`${getBackendUrl()}/checkout/nowpayments/availability`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
