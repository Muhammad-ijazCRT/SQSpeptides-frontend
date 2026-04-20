import { NextResponse } from "next/server";
import { linkWallet } from "@/lib/crossmint/crossmint-api";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const { email, walletAddress } = body as { email?: unknown; walletAddress?: unknown };
  if (typeof email !== "string" || typeof walletAddress !== "string" || !email.trim() || !walletAddress.trim()) {
    return NextResponse.json({ error: "email and walletAddress are required." }, { status: 400 });
  }

  const result = await linkWallet(email.trim(), walletAddress.trim());
  if (result && "error" in result) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
