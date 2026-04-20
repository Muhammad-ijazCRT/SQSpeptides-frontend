import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/server/api-url";

/**
 * Proxies multipart uploads to the Nest API. The storefront (e.g. Vercel) filesystem is read-only,
 * so files are stored on the API server and served via `next.config` rewrites for `/uploads/zelle/*`.
 */
export async function POST(req: NextRequest) {
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
    out.append("file", file, file.name || "proof.jpg");

    const res = await fetch(`${backend}/orders/zelle/upload`, {
      method: "POST",
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
    console.error("[api/upload/zelle]", e);
    return NextResponse.json(
      { message: "Upload service unavailable. Ensure the API is running and NEXT_PUBLIC_API_URL is set." },
      { status: 503 }
    );
  }
}
