import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

export async function GET() {
  const res = await fetch(`${getBackendUrl()}/categories`, {
    next: { revalidate: 60 },
  });
  const data = await res.json().catch(() => ([]));
  return NextResponse.json(data, { status: res.status });
}
