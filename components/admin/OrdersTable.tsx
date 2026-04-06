"use client";

import Link from "next/link";

export type OrderTableRow = {
  id: string;
  email: string;
  fullName: string;
  total: number;
  status: string;
  createdAt: string;
};

function statusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "pending")
    return "inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium capitalize text-amber-800";
  if (s === "shipped")
    return "inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium capitalize text-blue-800";
  if (s === "completed")
    return "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium capitalize text-emerald-800";
  return "inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium capitalize text-neutral-700";
}

type OrdersTableProps = {
  orders: OrderTableRow[];
  emptyMessage?: string;
};

const tableShellShadow =
  "shadow-[0_2px_8px_rgba(15,23,42,0.06),0_14px_36px_-8px_rgba(15,23,42,0.16)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.08),0_20px_44px_-10px_rgba(15,23,42,0.2)]";

export function OrdersTable({ orders, emptyMessage = "No orders yet." }: OrdersTableProps) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white ${tableShellShadow}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">Recent orders</h2>
        <Link href="/admin/dashboard/orders" className="text-sm font-semibold text-blue-600 hover:underline">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-neutral-500">{emptyMessage}</div>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/80 text-neutral-600">
                <th className="px-6 py-3 font-medium">ORDER #</th>
                <th className="px-6 py-3 font-medium">CUSTOMER</th>
                <th className="px-6 py-3 font-medium">EMAIL</th>
                <th className="px-6 py-3 font-medium">AMOUNT</th>
                <th className="px-6 py-3 font-medium">STATUS</th>
                <th className="px-6 py-3 font-medium">DATE</th>
                <th className="px-6 py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-neutral-50 last:border-0">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-neutral-800">{o.id.slice(0, 10)}…</span>
                  </td>
                  <td className="px-6 py-4 font-medium text-neutral-900">{o.fullName}</td>
                  <td className="px-6 py-4 text-neutral-600">{o.email}</td>
                  <td className="px-6 py-4 font-medium tabular-nums text-neutral-900">${o.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={statusBadgeClass(o.status)}>{o.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-600">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/dashboard/orders#${o.id}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
              </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
