"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SITE_BRAND_NAME } from "@/lib/site-business";

type PublicInvoice = {
  publicToken: string;
  status: string;
  amount: number;
  currency: string;
  gatewayLabel: string;
  gatewayType: string;
  description: string | null;
  checkoutUrl: string | null;
  customerEmailMasked: string;
  zellePayeeEmail?: string | null;
  zellePayeePhone?: string | null;
  memoReference?: string;
  zelleProofSubmitted?: boolean;
};

export function PayInvoiceClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = typeof params.token === "string" ? params.token : "";
  const cancelled = searchParams.get("cancelled") === "1";

  const [data, setData] = useState<PublicInvoice | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [txnId, setTxnId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/public/payment-invoices/${encodeURIComponent(token)}`, { cache: "no-store" });
      const json = (await res.json().catch(() => ({}))) as PublicInvoice & { message?: string; statusCode?: number };
      if (!res.ok) {
        setErr(typeof json.message === "string" ? json.message : "This payment link is invalid or has expired.");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setErr("Could not load this payment page.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const amountLabel =
    data != null
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: data.currency.toUpperCase() }).format(data.amount)
      : "";

  async function submitZelleProof(e: React.FormEvent) {
    e.preventDefault();
    setSubmitErr(null);
    const email = confirmEmail.trim().toLowerCase();
    if (!email) {
      setSubmitErr("Enter the same email address that was used for this invoice.");
      return;
    }
    if (!txnId.trim()) {
      setSubmitErr("Enter your Zelle transaction ID or confirmation text from your bank.");
      return;
    }
    if (!file) {
      setSubmitErr("Choose a screenshot image of your Zelle payment (JPG, PNG, or WebP).");
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

      const pr = await fetch(`/api/public/payment-invoices/${encodeURIComponent(token)}/zelle-proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          transactionId: txnId.trim(),
          proofUrl,
        }),
      });
      const pj = (await pr.json().catch(() => ({}))) as { message?: string | string[] };
      if (!pr.ok) {
        const m = Array.isArray(pj.message) ? pj.message.join(", ") : typeof pj.message === "string" ? pj.message : "Submit failed.";
        throw new Error(m);
      }

      setTxnId("");
      setFile(null);
      setConfirmEmail("");
      await load();
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-0.5 w-full rounded-md border border-white/15 bg-black/30 px-2.5 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30";

  const isZelle = data?.gatewayType === "zelle";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-8 sm:px-5">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-500/90">{SITE_BRAND_NAME}</p>
        <h1 className="mt-2 text-center text-lg font-semibold tracking-tight text-white">{isZelle ? "Zelle payment" : "Secure payment"}</h1>
        {!isZelle ? (
          <p className="mt-1 text-center text-xs text-zinc-500">Complete checkout with your selected provider.</p>
        ) : null}

        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-4 shadow-lg shadow-black/30 backdrop-blur sm:p-5">
          {loading ? (
            <p className="text-center text-sm text-zinc-400">Loading…</p>
          ) : err ? (
            <p className="text-center text-sm text-red-300">{err}</p>
          ) : data?.status === "paid" ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <span className="text-2xl" aria-hidden>
                  ✓
                </span>
              </div>
              <p className="font-medium text-white">This invoice is already paid.</p>
              <p className="mt-2 text-sm text-zinc-400">Thank you. A confirmation was sent to the payer&apos;s email on file.</p>
            </div>
          ) : (
            <>
              {cancelled && data?.gatewayType !== "zelle" ? (
                <p className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-sm text-amber-100">
                  Checkout was cancelled. You can try again when you&apos;re ready.
                </p>
              ) : null}
              <dl className="space-y-2 border-b border-white/10 pb-3 text-sm sm:space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <dt className="text-zinc-500">{isZelle ? "Pay" : "Amount due"}</dt>
                  <dd className={`text-right font-semibold text-white ${isZelle ? "text-base" : "text-lg"}`}>{amountLabel}</dd>
                </div>
                {!isZelle ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Gateway</dt>
                    <dd className="text-right font-medium text-zinc-200">{data?.gatewayLabel}</dd>
                  </div>
                ) : (
                  <div className="flex justify-between gap-2 text-xs text-zinc-500">
                    <span>{data?.gatewayLabel}</span>
                    <span className="text-right text-zinc-400">{data?.customerEmailMasked}</span>
                  </div>
                )}
                {!isZelle && data?.description ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Reference</dt>
                    <dd className="max-w-[60%] text-right text-zinc-300">{data.description}</dd>
                  </div>
                ) : null}
                {!isZelle ? (
                  <div className="flex justify-between gap-4">
                    <dt className="text-zinc-500">Receipt email</dt>
                    <dd className="text-right text-zinc-400">{data?.customerEmailMasked}</dd>
                  </div>
                ) : null}
              </dl>
              {data?.gatewayType === "zelle" ? (
                <div className="mt-3 space-y-3 text-left text-sm">
                  <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2.5">
                    {data.memoReference ? (
                      <p className="font-mono text-xs text-amber-200">
                        Memo <span className="font-semibold">{data.memoReference}</span>
                      </p>
                    ) : null}
                    <div className={`space-y-1 text-xs ${data.memoReference ? "mt-2 border-t border-white/10 pt-2" : ""}`}>
                      {data.zellePayeeEmail ? (
                        <p className="text-zinc-400">
                          To <span className="select-all font-medium text-white">{data.zellePayeeEmail}</span>
                        </p>
                      ) : null}
                      {data.zellePayeePhone ? (
                        <p className="text-zinc-400">
                          Phone <span className="select-all font-medium text-white">{data.zellePayeePhone}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {data.zelleProofSubmitted ? (
                    <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-center text-xs text-emerald-200/95">
                      <span className="font-medium text-emerald-100">Proof received.</span> We&apos;ll email you when this invoice is marked
                      paid.
                    </div>
                  ) : (
                    <form onSubmit={(e) => void submitZelleProof(e)} className="space-y-2.5">
                      {submitErr ? <p className="text-xs text-red-300">{submitErr}</p> : null}

                      <label className="block text-[11px] font-medium text-zinc-500">
                        Email on invoice
                        <input
                          type="email"
                          autoComplete="email"
                          className={inputClass}
                          placeholder="full address (must match)"
                          value={confirmEmail}
                          onChange={(e) => setConfirmEmail(e.target.value)}
                          required
                        />
                      </label>

                      <label className="block text-[11px] font-medium text-zinc-500">
                        Transaction ID / confirmation
                        <input
                          type="text"
                          className={inputClass}
                          placeholder="from your bank app"
                          value={txnId}
                          onChange={(e) => setTxnId(e.target.value)}
                          required
                        />
                      </label>

                      <label className="block text-[11px] font-medium text-zinc-500">
                        Screenshot
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="mt-1 block w-full text-[11px] text-zinc-500 file:mr-2 file:rounded file:border-0 file:bg-amber-600/90 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-zinc-950 hover:file:bg-amber-500"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="mt-1 w-full rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 py-2 text-sm font-semibold text-zinc-950 shadow-md shadow-amber-900/25 transition enabled:hover:from-amber-500 enabled:hover:to-amber-400 disabled:opacity-50"
                      >
                        {submitting ? "Submitting…" : "Submit proof"}
                      </button>
                    </form>
                  )}
                </div>
              ) : data?.checkoutUrl ? (
                <a
                  href={data.checkoutUrl}
                  className="mt-6 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-4 py-3 text-center text-sm font-semibold text-zinc-950 shadow-md shadow-amber-900/25 transition hover:from-amber-500 hover:to-amber-400"
                >
                  Continue to {data.gatewayLabel}
                </a>
              ) : (
                <p className="mt-4 text-center text-sm text-zinc-500">No payment link is available for this invoice yet.</p>
              )}
            </>
          )}
        </div>

        {data ? (
          <p className="mt-4 text-center text-[10px] leading-snug text-zinc-600">
            {data.gatewayType === "zelle"
              ? "Use your bank's official Zelle flow only."
              : `You will leave this site to pay. ${SITE_BRAND_NAME} does not store your full card or wallet credentials on our servers.`}
          </p>
        ) : null}
        <Link href="/" className="mt-4 text-center text-xs font-medium text-amber-500/90 underline-offset-4 hover:text-amber-400 hover:underline">
          Back to store
        </Link>
      </div>
    </div>
  );
}
