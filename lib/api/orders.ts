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
  paymentProvider?: "crossmint" | "nowpayments" | "zelle";
};

export async function createOrder(payload: CheckoutPayload): Promise<OrderCreated> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.message)
      ? data.message.join(", ")
      : typeof data.message === "string"
        ? data.message
        : "Checkout failed";
    throw new Error(msg);
  }
  return data;
}
