import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";

/** Proxies admin product image uploads to the Nest API (stored under `uploads/products/`). */
export async function POST(req: NextRequest) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "Missing file" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "File too large (max 5 MB)" }, { status: 400 });
  }

  const backend = getBackendUrl();
  try {
    const out = new FormData();
    out.append("file", file, file.name || "product.jpg");

    const res = await fetch(`${backend}/admin/products/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: out,
    });

    const data = (await res.json().catch(() => ({}))) as { message?: string | string[]; url?: string };
    if (!res.ok) {
      const msg = Array.isArray(data.message)
        ? data.message.join(", ")
        : typeof data.message === "string"
          ? data.message
          : "Upload failed";
      return NextResponse.json({ message: msg }, { status: res.status });
    }
    if (!data.url || typeof data.url !== "string") {
      return NextResponse.json({ message: "Upload did not return a file URL." }, { status: 502 });
    }
    return NextResponse.json({ url: data.url });
  } catch (e) {
    console.error("[api/admin/products/upload]", e);
    return NextResponse.json(
      { message: "Upload service unavailable. Ensure the API is running and NEXT_PUBLIC_API_URL is set." },
      { status: 503 }
    );
  }
}
