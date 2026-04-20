"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SITE_BRAND_NAME } from "@/lib/site-business";

export function CryptoPaySuccessClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = typeof params.token === "string" ? params.token : "";
  const confirmEmail = searchParams.get("confirmEmail") ?? "";

  const [message, setMessage] = useState("Confirming your payment…");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!token || !confirmEmail) {
      setError("Missing confirmation details. Open your payment link again.");
      setDone(true);
      return;
    }
    try {
      const res = await fetch(`/api/public/payment-invoices/${encodeURIComponent(token)}/nowpayments-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: confirmEmail }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        status?: string;
        updated?: boolean;
        message?: string;
      };
      if (!res.ok) {
        setError(typeof json.message === "string" ? json.message : "Could not confirm payment.");
        setDone(true);
        return;
      }
      if (json.status === "paid") {
        setMessage("Payment confirmed. A receipt has been sent to your email.");
      } else {
        setMessage(json.message ?? "We could not confirm payment yet. If you already paid, wait a moment and refresh.");
      }
      setDone(true);
    } catch {
      setError("Network error while confirming payment.");
      setDone(true);
    }
  }, [token, confirmEmail]);

  useEffect(() => {
    void run();
  }, [run]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 py-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/90">{SITE_BRAND_NAME}</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Payment status</h1>
        <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          {error ? <p className="text-sm text-red-300">{error}</p> : <p className="text-sm leading-relaxed text-zinc-300">{message}</p>}
          {done ? (
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/5"
            >
              Return to store
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
