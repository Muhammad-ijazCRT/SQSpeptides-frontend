"use client";

import { useCallback, useState } from "react";
import { CreateOrderResponse } from "./types";

export type OnrampStatus =
  | "not-created"
  | "creating-order"
  | "awaiting-payment"
  | "error";

type UseCrossmintOnrampArgs = {
  email: string;
  walletAddress: string;
};

export function useCrossmintOnramp({
  email,
  walletAddress,
}: UseCrossmintOnrampArgs) {
  const [status, setStatus] = useState<OnrampStatus>("not-created");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalUsd, setTotalUsd] = useState<string | null>(null);
  const [effectiveAmount, setEffectiveAmount] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createOrder = useCallback(
    async (amountUsd: string) => {
      setError(null);
      setStatus("creating-order");

      try {
        const linkRes = await fetch("/api/crossmint/link-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, walletAddress }),
        });
        const linkJson = (await linkRes.json()) as { ok?: boolean; error?: string };
        if (!linkRes.ok || linkJson.error) {
          setError(linkJson.error ?? `Wallet link failed (HTTP ${linkRes.status}).`);
          setStatus("error");
          return;
        }

        const orderRes = await fetch("/api/crossmint/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amountUsd, email, walletAddress }),
        });
        const data = (await orderRes.json()) as CreateOrderResponse | { error?: string };

        if (!orderRes.ok || (data && typeof data === "object" && "error" in data && data.error)) {
          setError(
            typeof data === "object" && data && "error" in data && data.error
              ? String(data.error)
              : `Order creation failed (HTTP ${orderRes.status}).`
          );
          setStatus("error");
          return;
        }

        const orderData = data as CreateOrderResponse;
        const oid = orderData?.order?.orderId;
        const secret = orderData?.clientSecret;
        const lineItem = orderData?.order?.lineItems?.[0];
        const total = orderData?.order?.quote?.totalPrice?.amount;
        const effective = lineItem?.quote?.quantityRange?.lowerBound;

        if (!oid || !secret || total == null || effective == null) {
          setError("Unexpected response from Crossmint. Check API keys and order payload.");
          setStatus("error");
          return;
        }

        setOrderId(oid);
        setClientSecret(secret);
        setTotalUsd(total);
        setEffectiveAmount(effective);
        setStatus("awaiting-payment");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong creating the order.";
        setError(msg);
        setStatus("error");
      }
    },
    [email, walletAddress]
  );

  const resetOrder = useCallback(() => {
    setStatus("not-created");
    setOrderId(null);
    setError(null);
    setTotalUsd(null);
    setEffectiveAmount(null);
    setClientSecret(null);
  }, []);

  return {
    order: {
      status,
      error,
      totalUsd,
      effectiveAmount,
    },
    orderId,
    clientSecret,
    createOrder,
    resetOrder,
  } as const;
}
