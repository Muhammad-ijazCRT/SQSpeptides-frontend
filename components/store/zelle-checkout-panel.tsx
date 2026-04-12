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
      <section className="rounded-xl border border-neutral-200/90 bg-white p-5 text-center shadow-sm sm:p-6">
        <p className="text-base font-semibold text-neutral-900">Proof submitted</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Check <span className="font-medium text-neutral-800">My orders</span> for updates. We’ll confirm your payment as
          soon as possible.
        </p>
        <div className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Link
            href="/account/orders"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            View your orders
          </Link>
          <Link
            href="/products-catalog"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#c9a432]/40 bg-amber-50/40 p-4 sm:p-5">
      <h3 className="text-base font-semibold text-neutral-900">Complete Zelle payment</h3>
      <p className="mt-1 text-sm text-neutral-600">
        Use this <strong>order ID</strong> in your Zelle memo / note so we can match your payment:
      </p>
      <p className="mt-2 font-mono text-sm font-bold tracking-tight text-black">{orderId}</p>
      <p className="mt-3 text-lg font-bold tabular-nums text-black">${amountUsd}</p>

      <div className="mt-4 space-y-1.5 rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-800">
        <p className="font-medium text-neutral-900">Send payment via Zelle to:</p>
        {config?.zelleEmail ? (
          <p>
            <span className="text-neutral-500">Email:</span>{" "}
            <span className="font-semibold text-neutral-900">{config.zelleEmail}</span>
          </p>
        ) : null}
        {config?.zellePhone ? (
          <p>
            <span className="text-neutral-500">Phone:</span>{" "}
            <span className="font-semibold text-neutral-900">{config.zellePhone}</span>
          </p>
        ) : null}
        {!config?.zelleEmail && !config?.zellePhone ? (
          <p className="text-amber-900">Zelle contact is not set up yet. Please contact the store.</p>
        ) : null}
      </div>

      <form className="mt-4 space-y-3" onSubmit={(e) => void submit(e)}>
        <label className="block">
          <span className="text-sm font-medium text-neutral-800">Zelle transaction ID or confirmation</span>
          <input
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black focus:ring-1 focus:ring-black"
            placeholder="From your bank app receipt"
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-neutral-800">Screenshot of payment</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-200 file:px-3 file:py-1.5 file:text-sm file:font-medium"
          />
          <span className="mt-1 block text-xs text-neutral-500">JPG, PNG, or WebP — max 5 MB</span>
        </label>
        {localErr ? <p className="text-sm text-red-600">{localErr}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#f0c14b] py-2.5 text-sm font-bold text-[#111] shadow-[0_2px_0_0_#c9a227] transition hover:bg-[#f2ca5c] disabled:cursor-wait disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit payment proof"}
        </button>
      </form>
    </section>
  );
}
