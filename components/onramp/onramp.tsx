"use client";

import { CrossmintProvider, CrossmintEmbeddedCheckout } from "@crossmint/client-sdk-react-ui";
import OnrampDeposit from "@/components/onramp/onramp-deposit";
import OnrampSuccess from "@/components/onramp/onramp-success";
import { useCrossmintOnramp } from "@/lib/useCrossmintOnramp";
import { useState, useEffect, useCallback } from "react";
import UserTypeSelector from "@/components/onramp/user-type-selector";
import { ONRAMP_RECIPIENT_WALLET, ONRAMP_RETURNING_EMAIL } from "@/lib/onramp/config";
import { isCrossmintProduction } from "@/lib/onramp/crossmint-public-env";

const CLIENT_API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY;

const DEFAULT_AMOUNT = "5.00";

export default function Onramp() {
  const [userType, setUserType] = useState<"returning" | "new">("returning");
  const [receiptEmail, setReceiptEmail] = useState<string>(ONRAMP_RETURNING_EMAIL);

  const [amountUsd, setAmountUsd] = useState(DEFAULT_AMOUNT);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txId, setTxId] = useState<string | undefined>();

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
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-6 col-span-1 lg:col-span-3">
        <p className="max-w-md text-center text-sm text-neutral-600">
          Set <code className="rounded bg-neutral-200 px-1">NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY</code> in{" "}
          <code className="rounded bg-neutral-200 px-1">.env.local</code> to use the onramp demo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 px-6 py-12 col-span-1 lg:col-span-3">
      <div className="w-full max-w-md mt-10">
        <div className="bg-white rounded-3xl border shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col">
              <UserTypeSelector
                userType={userType}
                onUserTypeChange={(newType, email) => {
                  setUserType(newType);
                  setReceiptEmail(email);
                  resetOrder();
                }}
              />

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
                  onContinue={() => createOrder(amountUsd)}
                  userType={userType}
                />
              )}

              {orderId && !showSuccess && (<>
                {!isCrossmintProduction() ? (
                  <>
                    <div>
                      <p className="text-sm text-center">Use this card to test the payment process:</p>
                      <p className="text-sm font-semibold filter-green text-center">4242 4242 4242 4242.</p>
                    </div>
                    <hr className="mt-4 mb-4" />
                  </>
                ) : (
                  <p className="mb-4 text-center text-sm text-neutral-600">
                    Complete payment with your card. Charges are processed in production mode.
                  </p>
                )}
                <CrossmintProvider apiKey={CLIENT_API_KEY!}>
                  <div className="max-w-[450px] w-full mx-auto">
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
              </>)}

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
