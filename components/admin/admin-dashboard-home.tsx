"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { OrdersTable, type OrderTableRow } from "@/components/admin/OrdersTable";
import { StatCard } from "@/components/admin/StatCard";

type Overview = {
  orderCount: number;
  productCount: number;
  customerCount: number;
  revenueTotal: number;
  ordersToday: number;
  ordersThisMonth: number;
  pendingOrders: number;
  completedOrderCount: number;
  revenueFromCompleted: number;
  customersNewToday: number;
};

export function AdminDashboardHome() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<OrderTableRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const [oRes, ordRes] = await Promise.all([fetch("/api/admin/overview"), fetch("/api/admin/orders")]);
      if (oRes.ok) {
        const data = await oRes.json();
        setOverview({
          orderCount: Number(data.orderCount ?? 0),
          productCount: Number(data.productCount ?? 0),
          customerCount: Number(data.customerCount ?? 0),
          revenueTotal: Number(data.revenueTotal ?? 0),
          ordersToday: Number(data.ordersToday ?? 0),
          ordersThisMonth: Number(data.ordersThisMonth ?? 0),
          pendingOrders: Number(data.pendingOrders ?? 0),
          completedOrderCount: Number(data.completedOrderCount ?? 0),
          revenueFromCompleted: Number(data.revenueFromCompleted ?? 0),
          customersNewToday: Number(data.customersNewToday ?? 0),
        });
      } else {
        setErr("Could not load overview.");
      }
      if (ordRes.ok) {
        const list = (await ordRes.json()) as OrderTableRow[];
        setOrders(Array.isArray(list) ? list.slice(0, 8) : []);
      }
    } catch {
      setErr("Network error — is the API running on port 3001?");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const o = overview;

  return (
    <div className="space-y-8">
      {err ? (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_10px_28px_-8px_rgba(15,23,42,0.12)]"
          role="alert"
        >
          {err}
        </p>
      ) : null}

      <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={o?.orderCount ?? "—"}
          subtext={`${o?.ordersThisMonth ?? 0} this month`}
          iconClass="bi-clipboard-data"
          accent="primary"
          size="lg"
        />
        <StatCard
          label="Total products"
          value={o?.productCount ?? "—"}
          subtext="Stock tracking can be added to the catalog"
          iconClass="bi-box-seam"
          accent="success"
          size="lg"
        />
        <StatCard
          label="Total users"
          value={o?.customerCount ?? "—"}
          subtext={`${o?.customersNewToday ?? 0} new today`}
          iconClass="bi-people"
          accent="violet"
          size="lg"
        />
        <StatCard
          label="Total revenue"
          value={
            o != null
              ? `$${o.revenueTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "—"
          }
          subtext={`From ${o?.completedOrderCount ?? 0} completed orders`}
          iconClass="bi-currency-dollar"
          accent="warning"
          size="lg"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Today's orders"
          value={o?.ordersToday ?? "—"}
          subtext="Since midnight (server time)"
          iconClass="bi-calendar-event"
          accent="primary"
          size="md"
        />
        <StatCard
          label="Monthly orders"
          value={o?.ordersThisMonth ?? "—"}
          subtext="Current calendar month"
          iconClass="bi-bar-chart-line"
          accent="danger"
          size="md"
        />
        <StatCard
          label="Pending orders"
          value={o?.pendingOrders ?? "—"}
          subtext="Awaiting fulfillment"
          iconClass="bi-clock-history"
          accent="orange"
          size="md"
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06),0_14px_36px_-8px_rgba(15,23,42,0.16)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.08),0_20px_44px_-10px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex shrink-0 rounded-full bg-blue-50 p-3 text-blue-600">
              <i className="bi bi-envelope-heart text-2xl leading-none" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-neutral-900">Stay updated – Newsletter subscribers</h2>
              <p className="mt-1 text-sm text-neutral-500">
                See registered storefront accounts as your subscriber list grows. Connect an email provider when you are
                ready to send campaigns.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
            <span className="text-2xl font-bold tabular-nums text-neutral-900">{o?.customerCount ?? 0}</span>
            <Link
              href="/admin/dashboard/customers"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View list
            </Link>
          </div>
        </div>
      </div>

      <OrdersTable orders={orders} emptyMessage="No orders yet. Checkout creates records via the store API." />
    </div>
  );
}
