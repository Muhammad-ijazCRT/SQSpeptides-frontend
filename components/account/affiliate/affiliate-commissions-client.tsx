"use client";

import Link from "next/link";
import { useAffiliateMe } from "./use-affiliate-me";

export function AffiliateCommissionsClient() {
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
        <h2 className="text-xl font-bold text-neutral-900">Commission history</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Earnings from referred orders. Totals:{" "}
          <strong className="text-neutral-900">${data.analytics.totalEarned.toFixed(2)}</strong> lifetime ·{" "}
          <strong className="text-neutral-900">{data.analytics.referralOrderCount}</strong> orders
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/90 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
              <th className="px-4 py-4 sm:px-6">Date</th>
              <th className="px-4 py-4 sm:px-6">Commission</th>
              <th className="px-4 py-4 sm:px-6">Rate</th>
              <th className="px-4 py-4 sm:px-6">Order subtotal</th>
              <th className="px-4 py-4 text-end sm:px-6">Order</th>
            </tr>
          </thead>
          <tbody>
            {data.earnings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-neutral-500">
                  No referral commissions yet. Share your link from the{" "}
                  <Link href="/account/affiliate" className="font-semibold text-[#b8962e] hover:underline">
                    Overview
                  </Link>{" "}
                  page to get started.
                </td>
              </tr>
            ) : (
              data.earnings.map((e) => (
                <tr key={e.id} className="border-b border-neutral-100 transition hover:bg-amber-50/20 last:border-0">
                  <td className="whitespace-nowrap px-4 py-4 text-neutral-600 sm:px-6">
                    {new Date(e.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-bold tabular-nums text-emerald-800 sm:px-6">+${e.amount.toFixed(2)}</td>
                  <td className="px-4 py-4 tabular-nums text-neutral-700 sm:px-6">{e.commissionPercent}%</td>
                  <td className="px-4 py-4 tabular-nums text-neutral-800 sm:px-6">${e.orderSubtotal.toFixed(2)}</td>
                  <td className="px-4 py-4 text-end sm:px-6">
                    <Link
                      href={`/account/orders/${e.orderId}`}
                      className="inline-flex items-center gap-1 font-semibold text-[#b8962e] hover:underline"
                    >
                      View
                      <span aria-hidden>→</span>
                    </Link>
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
