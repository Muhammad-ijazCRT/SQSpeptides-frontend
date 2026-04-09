"use client";

import { CrossmintProvider, CrossmintEmbeddedCheckout } from "@crossmint/client-sdk-react-ui";
import OnrampDeposit from "@/components/onramp/onramp-deposit";
import OnrampSuccess from "@/components/onramp/onramp-success";
import { OnrampEmailCapture } from "@/components/onramp/onramp-email-capture";
import { useCrossmintOnramp } from "@/lib/useCrossmintOnramp";
import { useState, useEffect, useCallback } from "react";
import { ONRAMP_RECIPIENT_WALLET } from "@/lib/onramp/config";
import { isCrossmintProduction } from "@/lib/onramp/crossmint-public-env";
import { SITE_BRAND_NAME } from "@/lib/site-business";

const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY;

const DEFAULT_AMOUNT = "5.00";

function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length < 5 || t.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

export default function Onramp() {
  const [receiptEmail, setReceiptEmail] = useState("");
  const [amountUsd, setAmountUsd] = useState(DEFAULT_AMOUNT);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txId, setTxId] = useState<string | undefined>();
  const [emailTouched, setEmailTouched] = useState(false);

  const { order, createOrder, orderId, clientSecret, resetOrder } = useCrossmintOnramp({
    email: receiptEmail,
    walletAddress: ONRAMP_RECIPIENT_WALLET,
  });

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = event.data;
    if (data?.event === "order:updated" && data?.data?.order?.phase === "completed") {
      const lineItems = data.data.order.lineItems;
      const deliveryTxId = lineItems?.[0]?.delivery?.txId;
      if (deliveryTxId) setTxId(deliveryTxId);
      setShowSuccess(true);
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [orderId, handleMessage]);

  if (CLIENT_API_KEY == null || CLIENT_API_KEY === "") {
    return (
      <div className="col-span-1 flex min-h-[50vh] items-center justify-center bg-gray-50 px-6 lg:col-span-3">
        <p className="max-w-md text-center text-sm text-neutral-600">
          Card funding is not enabled until{" "}
          <code className="rounded bg-neutral-200 px-1">NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY</code> is configured for this
          deployment. Contact {SITE_BRAND_NAME} support if you believe this is an error.
        </p>
      </div>
    );
  }

  const emailOk = isValidEmail(receiptEmail);
  const showEmailError = emailTouched && receiptEmail.length > 0 && !emailOk;

  function handleContinue() {
    setEmailTouched(true);
    if (!emailOk) return;
    void createOrder(amountUsd);
  }

  const formLocked = order.status === "creating-order" || order.status === "awaiting-payment";

  return (
    <div className="col-span-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12 lg:col-span-3">
      <div className="mb-6 px-2 lg:hidden">
        <p className="mx-auto max-w-md text-center text-sm leading-relaxed text-neutral-600">
          Add funds with a debit or credit card through our licensed partner Crossmint for use with {SITE_BRAND_NAME} checkout
          options that require a funded wallet. This is a merchant payment flow—not an investment product.
        </p>
      </div>
      <div className="mt-4 w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-lg">
          <div className="p-6">
            <div className="flex flex-col">
              {orderId == null && !showSuccess && (
                <>
                  <OnrampEmailCapture
                    email={receiptEmail}
                    onChange={(v) => {
                      setReceiptEmail(v);
                      if (!emailTouched && v.length > 0) setEmailTouched(true);
                    }}
                    disabled={formLocked}
                  />
                  {showEmailError ? (
                    <p className="mb-2 text-center text-xs text-red-600">Enter a valid email address to continue.</p>
                  ) : null}
                </>
              )}

              {orderId == null && !showSuccess && (
                <OnrampDeposit
                  amountUsd={amountUsd}
                  setAmountUsd={setAmountUsd}
                  order={{
                    status: order.status,
                    error: order.error,
                    totalUsd: order.totalUsd,
                    effectiveAmount: order.effectiveAmount,
                  }}
                  onContinue={handleContinue}
                />
              )}

              {orderId && !showSuccess ? (
                <>
                  {!isCrossmintProduction() ? (
                    <>
                      <div>
                        <p className="text-center text-sm text-neutral-600">Sandbox mode: test card numbers may be shown by your processor.</p>
                        <p className="mt-1 text-center text-sm font-semibold text-neutral-800">4242 4242 4242 4242</p>
                      </div>
                      <hr className="my-4" />
                    </>
                  ) : (
                    <p className="mb-4 text-center text-sm text-neutral-600">
                      Complete payment with your card. Charges are processed by Crossmint in production.
                    </p>
                  )}
                  <CrossmintProvider apiKey={CLIENT_API_KEY!}>
                    <div className="mx-auto w-full max-w-[450px]">
                      <CrossmintEmbeddedCheckout
                        orderId={orderId}
                        // @ts-ignore
                        clientSecret={clientSecret}
                        payment={{
                          receiptEmail,
                          crypto: { enabled: false },
                          fiat: { enabled: true },
                          defaultMethod: "fiat",
                        }}
                      />
                    </div>
                  </CrossmintProvider>
                </>
              ) : null}

              {showSuccess && (
                <OnrampSuccess
                  totalUsd={order.totalUsd ?? amountUsd}
                  effectiveAmount={order.effectiveAmount ?? amountUsd}
                  walletAddress={ONRAMP_RECIPIENT_WALLET}
                  txId={txId}
                  onStartNew={() => {
                    setShowSuccess(false);
                    setTxId(undefined);
                    resetOrder();
                    setAmountUsd(DEFAULT_AMOUNT);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
