import { NextResponse } from "next/server";
import { createCrossmintOrder } from "@/lib/crossmint/crossmint-api";

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

  const { amountUsd, email, walletAddress } = body as {
    amountUsd?: unknown;
    email?: unknown;
    walletAddress?: unknown;
  };

  if (typeof amountUsd !== "string" || typeof email !== "string" || typeof walletAddress !== "string") {
    return NextResponse.json(
      { error: "amountUsd, email, and walletAddress are required strings." },
      { status: 400 }
    );
  }

  const data = await createCrossmintOrder(amountUsd.trim(), email.trim(), walletAddress.trim());
  if (data && typeof data === "object" && "error" in data) {
    return NextResponse.json(data, { status: 502 });
  }

  return NextResponse.json(data);
}
