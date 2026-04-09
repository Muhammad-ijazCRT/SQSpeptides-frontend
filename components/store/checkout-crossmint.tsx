"use client";

import { CrossmintProvider, CrossmintEmbeddedCheckout } from "@crossmint/client-sdk-react-ui";
import { useCallback, useEffect, useRef } from "react";
import { useCrossmintOnramp } from "@/lib/useCrossmintOnramp";
import { ONRAMP_RECIPIENT_WALLET, ONRAMP_RETURNING_EMAIL } from "@/lib/onramp/config";
import { isCrossmintProduction } from "@/lib/onramp/crossmint-public-env";

export type CheckoutPaymentInfo = { txId?: string };

type Props = {
  /** Must be passed from the parent bundle so Turbopack/dynamic-import chunks still receive the key. */
  clientApiKey: string;
  amountUsd: string;
  disabled?: boolean;
  onPaymentComplete: (info: CheckoutPaymentInfo) => void;
};

/** Embedded checkout user must match the linked-wallet identity used for card settlement. */
const CROSSMINT_CHECKOUT_EMAIL = ONRAMP_RETURNING_EMAIL.trim();

export function CheckoutCrossmint({ clientApiKey, amountUsd, disabled, onPaymentComplete }: Props) {
  const completedRef = useRef(false);

  const { order, createOrder, orderId, clientSecret } = useCrossmintOnramp({
    email: CROSSMINT_CHECKOUT_EMAIL,
    walletAddress: ONRAMP_RECIPIENT_WALLET,
  });

  const onPaymentCompleteRef = useRef(onPaymentComplete);
  onPaymentCompleteRef.current = onPaymentComplete;

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = event.data;
    if (data?.event !== "order:updated" || data?.data?.order?.phase !== "completed") return;
    if (completedRef.current) return;
    completedRef.current = true;
    const lineItems = data.data.order.lineItems;
    const deliveryTxId = lineItems?.[0]?.delivery?.txId as string | undefined;
    onPaymentCompleteRef.current({ txId: deliveryTxId });
  }, []);

  useEffect(() => {
    if (!orderId) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [orderId, handleMessage]);

  const apiKey = clientApiKey.trim();
  if (!apiKey) {
    return null;
  }

  async function startPay() {
    completedRef.current = false;
    await createOrder(amountUsd);
  }

  return (
    <div className="space-y-4">
      {orderId == null ? (
        <>
          <p className="text-center text-sm text-neutral-600">
            Pay{" "}
            <span className="font-bold tabular-nums text-black" suppressHydrationWarning>
              ${amountUsd}
            </span>{" "}
            with card. Your store order uses the email you entered for shipping.
          </p>
          <button
            type="button"
            disabled={disabled || order.status === "creating-order"}
            onClick={() => void startPay()}
            className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {order.status === "creating-order" ? "Preparing secure checkout…" : "Continue to card payment"}
          </button>
        </>
      ) : (
        <>
          {!isCrossmintProduction() ? (
            <p className="text-center text-xs text-neutral-500">Test card (staging): 4242 4242 4242 4242</p>
          ) : (
            <p className="text-center text-xs text-neutral-500">Secure card checkout (production)</p>
          )}
          <CrossmintProvider apiKey={apiKey}>
            <div className="mx-auto w-full max-w-[450px]">
              <CrossmintEmbeddedCheckout
                orderId={orderId}
                // @ts-expect-error SDK typing
                clientSecret={clientSecret}
                payment={{
                  receiptEmail: CROSSMINT_CHECKOUT_EMAIL,
                  crypto: { enabled: false },
                  fiat: { enabled: true },
                  defaultMethod: "fiat",
                }}
              />
            </div>
          </CrossmintProvider>
        </>
      )}
      {order.status === "error" && order.error ? (
        <p className="text-center text-sm text-red-600">{order.error}</p>
      ) : null}
    </div>
  );
}

export function isCrossmintConfigured(clientApiKey?: string): boolean {
  const key = (clientApiKey ?? process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "").trim();
  return Boolean(key);
}
