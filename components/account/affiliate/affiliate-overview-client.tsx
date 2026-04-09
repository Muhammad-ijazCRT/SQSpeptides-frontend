"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { PAYOUT_NETWORKS } from "./payout-networks";
import { useAffiliateMe } from "./use-affiliate-me";

function StatCard({
  label,
  value,
  hint,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  valueClass?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.08)]">
      <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-[#D4AF37] to-[#b8962e]" aria-hidden />
      <p className="pl-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className={`mt-2 pl-3 text-2xl font-bold tabular-nums tracking-tight sm:text-[1.75rem] ${valueClass ?? "text-neutral-900"}`}>
        {value}
      </p>
      {hint ? <p className="mt-1.5 pl-3 text-xs leading-snug text-neutral-500">{hint}</p> : null}
    </div>
  );
}

export function AffiliateOverviewClient() {
  const { data, err, loading, reload } = useAffiliateMe();
  const [payoutAmount, setPayoutAmount] = useState("");
  const [networkPreset, setNetworkPreset] = useState<string>(PAYOUT_NETWORKS[0].value);
  const [networkOther, setNetworkOther] = useState("");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const [payoutMsg, setPayoutMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const resolvedCryptoNetwork = useCallback(() => {
    if (networkPreset === "__other__") return networkOther.trim();
    return networkPreset;
  }, [networkOther, networkPreset]);

  async function submitPayout(e: React.FormEvent) {
    e.preventDefault();
    setPayoutMsg(null);
    const amt = parseFloat(payoutAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      setPayoutMsg("Enter a valid amount.");
      return;
    }
    const net = resolvedCryptoNetwork();
    if (!net || net.length < 2) {
      setPayoutMsg("Select a network or describe it under “Other”.");
      return;
    }
    const addr = cryptoAddress.trim();
    if (addr.length < 10) {
      setPayoutMsg("Enter a full wallet / payout address.");
      return;
    }
    const res = await fetch("/api/customer/affiliate/payout-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amt,
        cryptoNetwork: net,
        cryptoAddress: addr,
        note: payoutNote.trim() || undefined,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setPayoutMsg(typeof body.message === "string" ? body.message : "Request failed");
      return;
    }
    setPayoutAmount("");
    setPayoutNote("");
    setCryptoAddress("");
    setNetworkOther("");
    setNetworkPreset(PAYOUT_NETWORKS[0].value);
    setPayoutMsg("Withdrawal request sent. Track it under Withdrawal history.");
    await reload({ silent: true });
  }

  async function copyReferralLink() {
    if (!data) return;
    const full = `${origin}${data.shareUrlPath}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-36 rounded-2xl bg-neutral-200/80" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-neutral-200/70" />
          <div className="h-28 rounded-2xl bg-neutral-200/70" />
          <div className="h-28 rounded-2xl bg-neutral-200/70" />
        </div>
        <div className="h-64 rounded-2xl bg-neutral-200/60" />
      </div>
    );
  }

  if (err && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-800">
        {err}
      </div>
    );
  }

  if (!data) return null;

  const fullLink = `${origin}${data.shareUrlPath}`;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-amber-100/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950 ring-1 ring-amber-300/50">
          {data.commissionPercentGlobal}% commission
        </span>
        <span className="text-xs text-neutral-500">On referred order subtotal (after coupons)</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Available balance"
          value={`$${data.balance.toFixed(2)}`}
          hint={
            data.pendingPayoutHold > 0
              ? `$${data.pendingPayoutHold.toFixed(2)} held in pending withdrawals`
              : "Use at checkout when signed in"
          }
        />
        <StatCard
          label="This month"
          value={`$${data.analytics.thisMonthEarned.toFixed(2)}`}
          hint="Commission credited this calendar month"
          valueClass="text-[#9a7b1a]"
        />
        <StatCard
          label="Referrals"
          value={data.analytics.referralOrderCount}
          hint={`Lifetime earned $${data.analytics.totalEarned.toFixed(2)}`}
        />
      </div>

      <section className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Your referral link</h2>
            <p className="mt-1 text-sm text-neutral-600">Share this URL — we attribute orders via your code in the link.</p>
          </div>
          <code className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">{data.affiliateCode}</code>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50/80 px-4 py-3 font-mono text-sm text-neutral-900 break-all">
            {fullLink}
          </div>
          <button
            type="button"
            onClick={() => void copyReferralLink()}
            className="shrink-0 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-white to-neutral-50/80 p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)] sm:p-8">
        <h2 className="text-lg font-bold text-neutral-900">Request crypto withdrawal</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Available after pending holds:{" "}
          <strong className="text-neutral-900">${data.availableAfterPending.toFixed(2)}</strong>. Admin will approve or reject; if
          rejected, you will see the reason under{" "}
          <Link href="/account/affiliate/withdrawals" className="font-semibold text-[#b8962e] underline-offset-2 hover:underline">
            Withdrawal history
          </Link>
          .
        </p>
        <form onSubmit={submitPayout} className="mt-6 grid max-w-xl gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-neutral-800">Amount (USD)</span>
            <input
              type="number"
              min={0.01}
              step="0.01"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#b8962e] focus:ring-2 focus:ring-[#D4AF37]/25"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-neutral-800">Network / asset</span>
            <select
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#b8962e] focus:ring-2 focus:ring-[#D4AF37]/25"
              value={networkPreset}
              onChange={(e) => setNetworkPreset(e.target.value)}
            >
              {PAYOUT_NETWORKS.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          {networkPreset === "__other__" ? (
            <label className="block">
              <span className="text-sm font-semibold text-neutral-800">Describe network</span>
              <input
                className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#b8962e] focus:ring-2 focus:ring-[#D4AF37]/25"
                value={networkOther}
                onChange={(e) => setNetworkOther(e.target.value)}
                placeholder="e.g. USDT BEP20"
              />
            </label>
          ) : null}
          <label className="block">
            <span className="text-sm font-semibold text-neutral-800">Payout address</span>
            <textarea
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 font-mono text-sm shadow-sm outline-none transition focus:border-[#b8962e] focus:ring-2 focus:ring-[#D4AF37]/25"
              rows={3}
              value={cryptoAddress}
              onChange={(e) => setCryptoAddress(e.target.value)}
              placeholder="Paste your wallet address"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-neutral-800">Note to admin (optional)</span>
            <textarea
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#b8962e] focus:ring-2 focus:ring-[#D4AF37]/25"
              rows={2}
              value={payoutNote}
              onChange={(e) => setPayoutNote(e.target.value)}
            />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black shadow-sm transition hover:bg-[#c9a432]"
            >
              Submit withdrawal request
            </button>
            <Link
              href="/account/affiliate/withdrawals"
              className="text-sm font-semibold text-[#b8962e] hover:underline"
            >
              View withdrawal history →
            </Link>
          </div>
          {payoutMsg ? <p className="text-sm text-neutral-700">{payoutMsg}</p> : null}
        </form>
      </section>

      <p className="text-center text-sm text-neutral-600 sm:text-left">
        <Link href="/checkout" className="font-semibold text-[#b8962e] hover:underline">
          Checkout
        </Link>{" "}
        — apply your balance on the shipping step when logged in.
      </p>
    </div>
  );
}
