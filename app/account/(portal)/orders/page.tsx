"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CustomerOrder } from "@/lib/api/customer-portal";
import { fetchMyOrders } from "@/lib/api/customer-portal";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<CustomerOrder[] | null>(null);

  const load = useCallback(async () => {
    try {
      setOrders(await fetchMyOrders());
    } catch {
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (orders === null) {
    return <p className="text-sm text-neutral-500">Loading orders…</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black">My orders</h1>
        <p className="mt-2 text-sm text-neutral-600">Track shipments and review what you purchased.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/80 px-6 py-16 text-center shadow-sm">
          <p className="text-neutral-600">No orders yet.</p>
          <Link
            href="/products-catalog"
            className="mt-4 inline-flex font-semibold text-blue-600 hover:underline"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {orders.map((o) => {
            const itemCount = o.items.reduce((n, i) => n + i.quantity, 0);
            const preview = o.items.slice(0, 4);
            const extra = o.items.length - preview.length;
            return (
              <li
                key={o.id}
                className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_2px_20px_-12px_rgba(15,23,42,0.12)] ring-1 ring-neutral-100"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-stretch sm:gap-6 sm:p-6">
                  <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
                    <div className="flex shrink-0 gap-2">
                      {preview.map((line) => {
                        const img = resolveProductImage({
                          slug: line.product.slug,
                          imageUrl: line.product.imageUrl ?? null,
                        });
                        return (
                        <Link
                          key={line.id}
                          href={`/products-catalog/${line.product.slug}`}
                          className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/80 transition hover:ring-neutral-400 sm:h-20 sm:w-20"
                        >
                          <Image
                            src={img}
                            alt={line.product.name}
                            fill
                            className={productImageBoxClassName(img)}
                            sizes="80px"
                            unoptimized
                          />
                        </Link>
                        );
                      })}
                      {extra > 0 ? (
                        <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-600 ring-1 ring-neutral-200/80 sm:h-20 sm:w-20">
                          +{extra}
                        </div>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-neutral-700">
                          {o.status}
                        </span>
                        <span className="text-xs text-neutral-500 tabular-nums">
                          {new Date(o.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-xs text-neutral-500">#{o.id}</p>
                      <ul className="mt-3 space-y-1 text-sm text-neutral-700">
                        {o.items.slice(0, 3).map((line) => (
                          <li key={line.id} className="truncate">
                            <span className="font-medium text-black">{line.product.name}</span>
                            <span className="text-neutral-500">
                              {" "}
                              × {line.quantity} · ${line.price.toFixed(2)} ea
                            </span>
                          </li>
                        ))}
                        {o.items.length > 3 ? (
                          <li className="text-neutral-500">+ {o.items.length - 3} more line items</li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                    <div className="text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total</p>
                      <p className="text-xl font-bold tabular-nums text-black">${o.total.toFixed(2)}</p>
                      <p className="text-xs text-neutral-500">
                        {itemCount} {itemCount === 1 ? "unit" : "units"}
                      </p>
                    </div>
                    <Link
                      href={`/account/orders/${o.id}`}
                      className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
