import { NextResponse } from "next/server";
import { bffFetch } from "@/lib/server/nest-bff-fetch";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await bffFetch("/orders/zelle/submit-proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
