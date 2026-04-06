import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

function revalidateCatalog(slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/popular-peptides");
  revalidatePath("/products-catalog");
  revalidatePath("/products-catalog", "layout");
  for (const s of slugs) {
    if (s) revalidatePath(`/products-catalog/${s}`);
  }
}

export async function GET() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const res = await fetch(`${getBackendUrl()}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const res = await fetch(`${getBackendUrl()}/admin/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && typeof data?.slug === "string") {
    revalidateCatalog([data.slug]);
  }
  return NextResponse.json(data, { status: res.status });
}
