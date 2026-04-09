"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CustomerOrder } from "@/lib/api/customer-portal";
import { fetchMyOrders } from "@/lib/api/customer-portal";
import { BrandLogo } from "@/components/store/brand-logo";
import { useCart } from "@/components/store/cart-context";

function isCompletedStatus(s: string) {
  return /^(completed|delivered|shipped|fulfilled)$/i.test(s.trim());
}

function StatCard({
  title,
  value,
  accent,
  icon,
}: {
  title: string;
  value: string;
  accent: "blue" | "amber" | "emerald" | "violet";
  icon: React.ReactNode;
}) {
  const border = {
    blue: "border-l-blue-500",
    amber: "border-l-amber-500",
    emerald: "border-l-emerald-500",
    violet: "border-l-violet-500",
  }[accent];
  const iconWrap = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  }[accent];
  return (
    <div
      className={`rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.1)] border-l-4 ${border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-neutral-900">{value}</p>
        </div>
        <div className={`flex shrink-0 rounded-full p-2.5 ${iconWrap}`}>{icon}</div>
      </div>
    </div>
  );
}

export function DashboardHome() {
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";
  const { lines: cartLines } = useCart();
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);
  const [wishCount, setWishCount] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const [o, wRes] = await Promise.all([
        fetchMyOrders(),
        fetch("/api/customer/wishlist", { cache: "no-store" }),
      ]);
      setOrders(o);
      if (wRes.ok) {
        const w = (await wRes.json()) as unknown[];
        setWishCount(w.length);
      } else setWishCount(0);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load dashboard");
      setOrders([]);
      setWishCount(0);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(() => {
    const list = orders ?? [];
    const total = list.length;
    const pending = list.filter((x) => !isCompletedStatus(x.status)).length;
    const completed = list.filter((x) => isCompletedStatus(x.status)).length;
    const spent = list.reduce((s, x) => s + x.total, 0);
    return { total, pending, completed, spent };
  }, [orders]);

  const recent = useMemo(() => (orders ?? []).slice(0, 5), [orders]);

  if (orders === null) {
    return <p className="text-sm text-neutral-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-8">
      {welcome ? (
        <div
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 pl-1 pr-4 py-3 shadow-sm"
          role="status"
        >
          <div className="h-full w-1 self-stretch rounded-full bg-emerald-600" aria-hidden />
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-emerald-900">
            <span>Account created successfully! Welcome to</span>
            <BrandLogo height={20} className="max-h-5" />
            <span>.</span>
          </p>
        </div>
      ) : null}

      {err ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">{err}</p>
      ) : null}

      <h1 className="text-3xl font-bold tracking-tight text-black">My Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={String(stats.total)}
          accent="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Pending Orders"
          value={String(stats.pending)}
          accent="amber"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Completed Orders"
          value={String(stats.completed)}
          accent="emerald"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.spent.toFixed(2)}`}
          accent="violet"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/cart"
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-neutral-900">Shopping Cart</p>
            <p className="mt-1 text-sm text-neutral-500">{cartLines.reduce((n, l) => n + l.quantity, 0)} items</p>
          </div>
          <div className="rounded-full bg-blue-50 p-3 text-blue-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </Link>
        <Link
          href="/account/wishlist"
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-red-100 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-neutral-900">Wishlist</p>
            <p className="mt-1 text-sm text-neutral-500">{wishCount ?? 0} items</p>
          </div>
          <div className="rounded-full bg-red-50 p-3 text-red-500">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </Link>
        <Link
          href="/products-catalog"
          className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-emerald-100 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-neutral-900">Continue Shopping</p>
            <p className="mt-1 text-sm text-neutral-500">Browse Products</p>
          </div>
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </Link>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-[0_4px_24px_-8px_rgba(15,23,42,0.1)]">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-blue-600 hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/80 text-neutral-600">
                <th className="px-6 py-3 font-medium">ORDER #</th>
                <th className="px-6 py-3 font-medium">DATE</th>
                <th className="px-6 py-3 font-medium">TOTAL</th>
                <th className="px-6 py-3 font-medium">STATUS</th>
                <th className="px-6 py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-neutral-500">
                    No orders yet.{" "}
                    <Link href="/products-catalog" className="font-semibold text-blue-600 hover:underline">
                      Start shopping!
                    </Link>
                  </td>
                </tr>
              ) : (
                recent.map((o) => (
                  <tr key={o.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-6 py-4 font-mono text-xs text-neutral-800">{o.id.slice(0, 12)}…</td>
                    <td className="px-6 py-4 text-neutral-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium tabular-nums">${o.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/account/orders/${o.id}`} className="font-semibold text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
