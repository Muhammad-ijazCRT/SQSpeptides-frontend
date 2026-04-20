import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/server/customer-proxy";

export async function POST(request: Request) {
  const body = await request.text();
  const res = await proxyBackend("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    revalidatePath("/account/orders");
    revalidatePath("/account/dashboard");
    revalidatePath("/account/affiliate");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/orders");
  }
  return NextResponse.json(data, { status: res.status });
}
