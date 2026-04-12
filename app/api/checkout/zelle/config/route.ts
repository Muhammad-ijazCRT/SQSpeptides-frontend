import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/server/nest-bff-fetch";

export async function GET() {
  const res = await bffFetch("/checkout/zelle/config", { method: "GET" });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
