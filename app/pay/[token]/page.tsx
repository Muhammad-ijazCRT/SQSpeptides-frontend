import { Suspense } from "react";
import { PayInvoiceClient } from "./pay-invoice-client";

export const metadata = {
  title: "Pay invoice",
  robots: { index: false, follow: false },
};

export default function PayInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">Loading…</div>
      }
    >
      <PayInvoiceClient />
    </Suspense>
  );
}
