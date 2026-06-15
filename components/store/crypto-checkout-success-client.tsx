"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearCheckoutSuccess,
  loadCheckoutSuccess,
  type CheckoutSuccessPayload,
} from "@/lib/store/checkout-success-storage";

type SyncState = "idle" | "syncing" | "done" | "error";

function AccountCredentialsBlock({ payload }: { payload: CheckoutSuccessPayload }) {
  if (!payload.accountCreated || !payload.temporaryPassword) return null;
  return (
    <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-left">
      <p className="text-sm font-semibold text-amber-950">Your account was created</p>
      <p className="mt-2 text-sm text-amber-900">
        Sign in with the details below. Change your password after your first login.
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
    </div>
  );
}

export function CryptoCheckoutSuccessClient({ orderId, confirmEmail }: { orderId: string; confirmEmail: string }) {
  const [state, setState] = useState<SyncState>("idle");
  const [paid, setPaid] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<CheckoutSuccessPayload | null>(null);

  useEffect(() => {
    const data = loadCheckoutSuccess(orderId || undefined);
    setAccountInfo(data);
    if (data?.temporaryPassword) clearCheckoutSuccess();
  }, [orderId]);

  useEffect(() => {
    if (!orderId || !confirmEmail) {
      setState("error");
      setNote("Missing order reference. Open your orders from the account menu if you are signed in.");
      return;
    }
    let cancelled = false;
    setState("syncing");
    (async () => {
      try {
        const res = await fetch("/api/checkout/nowpayments/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, email: confirmEmail }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          paymentCompletion?: string;
          updated?: boolean;
          message?: string | string[];
        };
        if (cancelled) return;
        if (!res.ok) {
          const m = Array.isArray(data.message) ? data.message.join(", ") : data.message;
          setState("error");
          setNote(typeof m === "string" ? m : "Could not verify payment.");
          return;
        }
        setPaid(data.paymentCompletion === "paid");
        setNote(
          typeof data.message === "string"
            ? data.message
            : data.paymentCompletion === "paid"
              ? null
              : "Payment is not confirmed yet. If you already sent crypto, wait a few minutes and refresh this page."
        );
        setState("done");
      } catch {
        if (!cancelled) {
          setState("error");
          setNote("Network error while checking payment status.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, confirmEmail]);

  return (
    <>
      <h1 className="text-2xl font-bold text-black">
        {state === "syncing" ? "Checking payment…" : paid ? "Payment received" : "Thanks — almost there"}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-neutral-600">
        {state === "syncing"
          ? "Talking to NOWPayments to update your order."
          : paid
            ? "Your order is marked paid. Open your order confirmation for full details."
            : "If you completed checkout on NOWPayments, we recheck status when you load this page. Blockchain confirmations can take a few minutes — refresh if needed."}
      </p>
      {orderId ? (
        <p className="mt-4 font-mono text-xs text-neutral-500">
          Reference: <span className="select-all">{orderId}</span>
        </p>
      ) : null}
      {note ? <p className="mt-4 text-sm text-amber-900">{note}</p> : null}
      {accountInfo ? <AccountCredentialsBlock payload={accountInfo} /> : null}
      {state === "done" && !paid ? (
        <button
          type="button"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-bold text-white hover:bg-neutral-800"
          onClick={() => window.location.reload()}
        >
          Refresh status
        </button>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={orderId ? `/checkout/success?orderId=${encodeURIComponent(orderId)}` : "/checkout/success"}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D4AF37] px-6 text-sm font-bold text-black hover:bg-[#c9a432]"
        >
          Order confirmation
        </Link>
        <Link href="/account/orders" className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-neutral-700 hover:underline">
          View orders
        </Link>
      </div>
    </>
  );
}
