import { Suspense } from "react";
import { CryptoPaySuccessClient } from "./crypto-pay-success-client";

export const metadata = {
  title: "Crypto payment status",
  robots: { index: false, follow: false },
};

export default function PayInvoiceCryptoSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">Loading…</div>
      }
    >
      <CryptoPaySuccessClient />
    </Suspense>
  );
}
