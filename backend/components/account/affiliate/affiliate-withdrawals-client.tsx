"use client";

import Link from "next/link";
import { statusLabel, truncateAddr } from "./utils";
import { useAffiliateMe } from "./use-affiliate-me";

export function AffiliateWithdrawalsClient() {
  const { data, err, loading } = useAffiliateMe();

  if (loading && !data) {
    return <div className="h-64 animate-pulse rounded-2xl bg-neutral-200/70" />;
  }

  if (err && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 px-5 py-4 text-sm text-red-800">
        {err}
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)]">
      <div className="border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white px-6 py-5 sm:px-8">
        <h2 className="text-xl font-bold text-neutral-900">Withdrawal history</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Every crypto payout request and its status.{" "}
          <Link href="/account/affiliate" className="font-semibold text-[#b8962e] hover:underline">
            Request a new withdrawal
          </Link>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/90 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
              <th className="px-4 py-4 sm:px-6">Requested</th>
              <th className="px-4 py-4 sm:px-6">Amount</th>
              <th className="px-4 py-4 sm:px-6">Status</th>
              <th className="px-4 py-4 sm:px-6">Network</th>
              <th className="px-4 py-4 sm:px-6">Address</th>
              <th className="px-4 py-4 sm:px-6">Your note</th>
              <th className="px-4 py-4 sm:px-6">Response</th>
            </tr>
          </thead>
          <tbody>
            {data.payoutRequests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <p className="text-neutral-500">No withdrawal requests yet.</p>
                  <Link
                    href="/account/affiliate"
                    className="mt-3 inline-block text-sm font-semibold text-[#b8962e] hover:underline"
                  >
                    Submit your first request
                  </Link>
                </td>
              </tr>
            ) : (
              data.payoutRequests.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 transition hover:bg-amber-50/20 last:border-0">
                  <td className="whitespace-nowrap px-4 py-4 text-neutral-600 sm:px-6">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-bold tabular-nums text-neutral-900 sm:px-6">${p.amount.toFixed(2)}</td>
                  <td className="px-4 py-4 sm:px-6">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                        p.status === "paid"
                          ? "bg-emerald-100 text-emerald-900"
                          : p.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {statusLabel(p.status)}
                    </span>
                  </td>
                  <td className="max-w-[140px] px-4 py-4 text-neutral-800 sm:px-6">{p.cryptoNetwork || "—"}</td>
                  <td
                    className="max-w-[200px] px-4 py-4 font-mono text-xs text-neutral-600 sm:px-6"
                    title={p.cryptoAddress}
                  >
                    {p.cryptoAddress ? truncateAddr(p.cryptoAddress) : "—"}
                  </td>
                  <td className="max-w-[160px] px-4 py-4 text-xs text-neutral-600 sm:px-6">{p.note ?? "—"}</td>
                  <td className="max-w-[240px] px-4 py-4 text-xs text-neutral-700 sm:px-6">
                    {p.status === "rejected" && p.rejectionReason ? (
                      <span className="text-red-800">{p.rejectionReason}</span>
                    ) : p.status === "paid" ? (
                      <span className="text-emerald-800">Completed — sent per your instructions.</span>
                    ) : (
                      <span className="text-neutral-500">Awaiting admin review.</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
