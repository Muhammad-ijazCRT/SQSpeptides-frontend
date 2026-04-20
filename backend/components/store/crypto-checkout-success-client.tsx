"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SyncState = "idle" | "syncing" | "done" | "error";

export function CryptoCheckoutSuccessClient({ orderId, confirmEmail }: { orderId: string; confirmEmail: string }) {
  const [state, setState] = useState<SyncState>("idle");
  const [paid, setPaid] = useState(false);
  const [note, setNote] = useState<string | null>(null);

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
            ? "Your order is marked paid. You can view details in your orders list."
            : "If you completed checkout on NOWPayments, we recheck status when you load this page. Blockchain confirmations can take a few minutes — refresh if needed."}
      </p>
      {orderId ? (
        <p className="mt-4 font-mono text-xs text-neutral-500">
          Reference: <span className="select-all">{orderId}</span>
        </p>
      ) : null}
      {note ? <p className="mt-4 text-sm text-amber-900">{note}</p> : null}
      {state === "done" && !paid ? (
        <button
          type="button"
          className="mt-6 text-sm font-semibold text-[#b8962e] hover:underline"
          onClick={() => window.location.reload()}
        >
          Refresh status
        </button>
      ) : null}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/account/orders"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D4AF37] px-6 text-sm font-bold text-black hover:bg-[#c9a432]"
        >
          View orders
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-neutral-600 hover:text-black hover:underline"
        >
          Back home
        </Link>
      </div>
    </>
  );
}
