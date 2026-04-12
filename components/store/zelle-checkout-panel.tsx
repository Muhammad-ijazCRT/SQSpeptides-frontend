"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const ZELLE_PENDING_SESSION_KEY = "sqspeptides_zelle_pending_v1";

export type ZelleStorefrontConfig = {
  enabled: boolean;
  zelleEmail: string | null;
  zellePhone: string | null;
};

type Props = {
  orderId: string;
  email: string;
  amountUsd: string;
  config: ZelleStorefrontConfig | null;
};

export function ZelleCheckoutPanel({ orderId, email, amountUsd, config }: Props) {
  const [txnId, setTxnId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied", { duration: 2500 });
    } catch {
      toast.error("Could not copy — select and copy the ID manually.", { duration: 4000 });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLocalErr(null);
    if (!txnId.trim()) {
      setLocalErr("Enter the Zelle transaction ID or confirmation from your bank.");
      return;
    }
    if (!file) {
      setLocalErr("Upload a screenshot of your Zelle payment.");
      return;
    }
    setSubmitting(true);
    try {
      const up = new FormData();
      up.append("file", file);
      const ur = await fetch("/api/upload/zelle", { method: "POST", body: up });
      const uj = (await ur.json().catch(() => ({}))) as { message?: string; url?: string };
      if (!ur.ok) {
        throw new Error(typeof uj.message === "string" ? uj.message : "Could not upload image.");
      }
      const proofUrl = uj.url;
      if (!proofUrl || typeof proofUrl !== "string") throw new Error("Upload did not return a file URL.");

      const pr = await fetch("/api/orders/zelle-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email,
          transactionId: txnId.trim(),
          proofUrl,
        }),
      });
      const pj = (await pr.json().catch(() => ({}))) as { message?: string | string[] };
      if (!pr.ok) {
        const m = Array.isArray(pj.message)
          ? pj.message.join(", ")
          : typeof pj.message === "string"
            ? pj.message
            : "Could not submit proof.";
        throw new Error(m);
      }
      try {
        sessionStorage.removeItem(ZELLE_PENDING_SESSION_KEY);
      } catch {
        /* ignore */
      }
      toast.success("Payment proof received", {
        description:
          "We’ll verify your Zelle payment shortly. Your order stays pending until an administrator confirms it. You can track status in My orders.",
        duration: 7000,
      });
      setDone(true);
    } catch (err) {
      setLocalErr(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-center text-base font-semibold text-neutral-900">Proof submitted</p>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Track status in <span className="font-medium text-neutral-800">My orders</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Link
            href="/account/orders"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:flex-none"
          >
            View orders
          </Link>
          <Link
            href="/products-catalog"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50 sm:flex-none"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const hasPayee = Boolean(config?.zelleEmail?.trim() || config?.zellePhone?.trim());

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold tracking-tight text-black">Pay with Zelle</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Send the exact amount, put the order ID in your bank’s memo, then upload proof below.
        </p>
      </div>

      <div className="grid gap-4 border-b border-neutral-100 px-5 py-5 sm:grid-cols-2 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Amount due</p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-black">${amountUsd}</p>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Memo / reference</p>
          <div className="mt-1 flex items-start gap-2">
            <p className="min-w-0 flex-1 break-all font-mono text-xs font-medium leading-snug text-neutral-900 sm:text-sm">
              {orderId}
            </p>
            <button
              type="button"
              onClick={() => void copyRef()}
              className="shrink-0 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Send payment to</p>
        {hasPayee ? (
          <ul className="mt-2 space-y-1 text-sm text-neutral-800">
            {config?.zelleEmail ? (
              <li>
                <span className="text-neutral-500">Email</span>{" "}
                <span className="font-medium text-black">{config.zelleEmail}</span>
              </li>
            ) : null}
            {config?.zellePhone ? (
              <li>
                <span className="text-neutral-500">Phone</span>{" "}
                <span className="font-medium text-black">{config.zellePhone}</span>
              </li>
            ) : null}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-amber-900">Zelle contact is not configured. Please reach out to the store.</p>
        )}
      </div>

      <form className="border-t border-neutral-100 bg-neutral-50/50 px-5 py-5 sm:px-6" onSubmit={(e) => void submit(e)}>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Confirm payment</p>
        <div className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">Transaction ID or confirmation</span>
            <input
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              placeholder="From your bank or Zelle receipt"
              autoComplete="off"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">Screenshot</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1.5 w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-200 file:px-3 file:py-2 file:text-sm file:font-medium"
            />
            <span className="mt-1 block text-xs text-neutral-500">JPG, PNG, or WebP · max 5 MB</span>
          </label>
          {localErr ? <p className="text-sm text-red-600">{localErr}</p> : null}
          <button
            type="submit"
            disabled={submitting || !hasPayee}
            className="w-full rounded-xl bg-[#f0c14b] py-3 text-sm font-bold text-[#111] shadow-[0_2px_0_0_#c9a227] transition hover:bg-[#f2ca5c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit payment proof"}
          </button>
        </div>
      </form>
    </div>
  );
}
