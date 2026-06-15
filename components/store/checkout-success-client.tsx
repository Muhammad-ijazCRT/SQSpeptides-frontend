"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearCheckoutSuccess,
  loadCheckoutSuccess,
  type CheckoutSuccessPayload,
} from "@/lib/store/checkout-success-storage";

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId") ?? "";
  const [payload, setPayload] = useState<CheckoutSuccessPayload | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const data = loadCheckoutSuccess(orderIdParam || undefined);
    setPayload(data);
    if (data?.temporaryPassword) {
      clearCheckoutSuccess();
    }
    setReady(true);
  }, [orderIdParam]);

  if (!ready) {
    return <p className="text-center text-sm text-neutral-600">Loading order details…</p>;
  }

  const orderId = payload?.orderId ?? orderIdParam;
  const showAccount = Boolean(payload?.accountCreated && payload?.temporaryPassword);

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a227]">Order placed</p>
        <h1 className="mt-3 text-center text-2xl font-bold text-neutral-900">Thank you for your order</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-neutral-600">
          We received your order and sent a confirmation to{" "}
          <span className="font-medium text-neutral-800">{payload?.email ?? "your email"}</span>.
        </p>

        {orderId ? (
          <div className="mt-6 rounded-xl bg-neutral-50 px-4 py-3 text-center">
            <p className="text-xs uppercase tracking-wide text-neutral-500">Order reference</p>
            <p className="mt-1 select-all font-mono text-sm text-neutral-900">{orderId}</p>
          </div>
        ) : null}

        {payload ? (
          <dl className="mt-6 space-y-2 text-sm text-neutral-700">
            <div className="flex justify-between gap-4">
              <dt>Total</dt>
              <dd className="font-semibold tabular-nums">${payload.total.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Status</dt>
              <dd className="capitalize">{payload.status}</dd>
            </div>
            {payload.paymentProvider ? (
              <div className="flex justify-between gap-4">
                <dt>Payment</dt>
                <dd className="capitalize">{payload.paymentProvider.replace(/_/g, " ")}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {showAccount && payload ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-left">
            <p className="text-sm font-semibold text-amber-950">Your account was created</p>
            <p className="mt-2 text-sm text-amber-900">
              Use these details to sign in and track your order. Change your password after your first login.
            </p>
            <p className="mt-3 text-sm text-amber-950">
              <span className="font-medium">Email:</span> {payload.email}
            </p>
            <p className="mt-1 text-sm text-amber-950">
              <span className="font-medium">Temporary password:</span>{" "}
              <code className="select-all rounded bg-amber-100 px-2 py-0.5 font-mono text-xs">
                {payload.temporaryPassword}
              </code>
            </p>
            <p className="mt-3 text-xs text-amber-800">
              These credentials were also emailed to you. This page shows them once — save them now.
            </p>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-neutral-600">
            Sign in to your account to view order history and tracking updates.
          </p>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/account/login"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Sign in
          </Link>
          <Link
            href="/account/orders"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-200 px-6 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            My orders
          </Link>
          <Link
            href="/products-catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-200 px-6 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
