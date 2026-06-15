import { Suspense } from "react";
import { CheckoutSuccessClient } from "@/components/store/checkout-success-client";

export const metadata = {
  title: "Order success | SQSpeptides",
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="px-4 py-20 text-center text-sm text-neutral-600">Loading…</div>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
