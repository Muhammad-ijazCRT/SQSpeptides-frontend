"use client";

import type { OrderCreated } from "@/lib/store/types";

export type CheckoutPayload = {
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  researchUseAttestation: string;
  items: { productId: string; quantity: number }[];
  affiliateRef?: string;
  storeCreditToUse?: number;
  couponCode?: string;
  paymentProvider?: "crossmint" | "nowpayments" | "zelle" | "payram";
};

function formatOrderApiError(data: unknown, status: number, rawText: string): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const code = o.code;
    const codeSuffix =
      typeof code === "string" && code.trim() ? ` [${code.trim()}]` : "";
    const msg = o.message;
    if (typeof msg === "string" && msg.trim()) return `${msg.trim()}${codeSuffix}`;
    if (Array.isArray(msg)) {
      const joined = msg.map(String).filter(Boolean).join(", ");
      if (joined) return `${joined}${codeSuffix}`;
    }
    if (msg && typeof msg === "object") {
      try {
        const flat = Object.entries(msg as Record<string, unknown>)
          .flatMap(([k, v]) => {
            if (Array.isArray(v)) return v.map((x) => `${k}: ${String(x)}`);
            return [`${k}: ${String(v)}`];
          })
          .join("; ");
        if (flat) return `${flat}${codeSuffix}`;
      } catch {
        /* ignore */
      }
    }
    const err = o.error;
    if (typeof err === "string" && err.trim()) return `${err.trim()}${status ? ` (HTTP ${status})` : ""}${codeSuffix}`;
    if (codeSuffix) return `Checkout failed (HTTP ${status}).${codeSuffix}`;
  }
  const trimmed = rawText?.trim();
  if (trimmed && trimmed.length < 500 && trimmed.startsWith("{")) {
    try {
      return formatOrderApiError(JSON.parse(trimmed) as object, status, "");
    } catch {
      /* ignore */
    }
  }
  if (trimmed && trimmed.length < 300) return trimmed;
  return status ? `Checkout failed (HTTP ${status}).` : "Checkout failed";
}

export async function createOrder(payload: CheckoutPayload): Promise<OrderCreated> {
  const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const rawText = await res.text();
  const elapsedMs = Math.round(
    (typeof performance !== "undefined" ? performance.now() : Date.now()) - t0
  );
  let data: unknown = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const preview =
      typeof data === "object" && data !== null
        ? JSON.stringify(data).slice(0, 1200)
        : rawText.slice(0, 400);
    console.error("[createOrder] failed", {
      status: res.status,
      elapsedMs,
      paymentProvider: payload.paymentProvider,
      bodyPreview: preview,
    });
    throw new Error(formatOrderApiError(data, res.status, rawText));
  }
  if (elapsedMs > 8000) {
    console.warn("[createOrder] slow success", { elapsedMs, paymentProvider: payload.paymentProvider });
  }
  return data as OrderCreated;
}
