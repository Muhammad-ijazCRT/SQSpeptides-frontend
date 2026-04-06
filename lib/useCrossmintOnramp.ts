"use client";

import { useCallback, useState } from "react";
import { CreateOrderResponse } from "./types";
import { linkWallet, createCrossmintOrder } from "./actions";

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
        const linkResult = await linkWallet(email, walletAddress);
        if (linkResult && "error" in linkResult) {
          setError(linkResult.error);
          setStatus("error");
          return;
        }

        const data = await createCrossmintOrder(amountUsd, email, walletAddress);

        if (data && typeof data === "object" && "error" in data && (data as { error?: string }).error) {
          setError(String((data as { error: string }).error));
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
