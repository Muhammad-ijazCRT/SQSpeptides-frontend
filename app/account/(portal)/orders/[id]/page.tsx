"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { CustomerOrder } from "@/lib/api/customer-portal";
import { fetchMyOrder } from "@/lib/api/customer-portal";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { formatResearchAttestationForDisplay } from "@/lib/store/research-attestation";

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [order, setOrder] = useState<CustomerOrder | null | undefined>(undefined);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setErr(null);
    try {
      setOrder(await fetchMyOrder(id));
    } catch {
      setErr("Order not found.");
      setOrder(null);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (order === undefined) {
    return <p className="text-sm text-neutral-500">Loading…</p>;
  }
  if (order === null || err) {
    return (
      <div className="space-y-4">
        <p className="text-red-600">{err ?? "Not found"}</p>
        <Link href="/account/orders" className="text-blue-600 hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/account/orders" className="text-sm font-medium text-blue-600 hover:underline">
            ← All orders
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-black">Order details</h1>
          <p className="mt-1 font-mono text-xs text-neutral-500">{order.id}</p>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium capitalize">{order.status}</span>
      </div>

      <div className="grid gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-500">Shipping</h2>
          <p className="mt-2 font-medium text-neutral-900">{order.fullName}</p>
          <p className="mt-1 text-sm text-neutral-600">{order.addressLine1}</p>
          <p className="text-sm text-neutral-600">
            {order.city}, {order.postalCode}
          </p>
          <p className="text-sm text-neutral-600">{order.country}</p>
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wide text-neutral-500">Contact</h2>
          <p className="mt-2 text-sm text-neutral-700">{order.email}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Placed</p>
          <p className="mt-1 text-sm text-neutral-700">{new Date(order.createdAt).toLocaleString()}</p>
          {order.researchUseAttestation ? (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-neutral-500">Research-use attestation</p>
              <p className="mt-1 text-sm text-neutral-700">
                {formatResearchAttestationForDisplay(order.researchUseAttestation)}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
        <h2 className="border-b border-neutral-100 px-6 py-4 text-lg font-semibold">Line items</h2>
        <ul className="divide-y divide-neutral-100">
          {order.items.map((line) => {
            const img = resolveProductImage({
              slug: line.product.slug,
              imageUrl: line.product.imageUrl ?? null,
            });
            return (
              <li key={line.id} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-6">
                <Link
                  href={`/products-catalog/${line.product.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/80 sm:h-24 sm:w-24"
                >
                  <Image src={img} alt={line.product.name} fill className={productImageBoxClassName(img)} sizes="96px" unoptimized />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products-catalog/${line.product.slug}`}
                    className="font-semibold text-neutral-900 hover:text-blue-600"
                  >
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    Qty {line.quantity} × ${line.price.toFixed(2)} each
                  </p>
                </div>
                <p className="w-full text-right text-lg font-semibold tabular-nums sm:w-auto">
                  ${(line.quantity * line.price).toFixed(2)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="space-y-1 border-t border-neutral-100 px-6 py-4 text-right text-sm text-neutral-600">
          {(() => {
            const linesSubtotal = order.items.reduce((s, l) => s + l.quantity * l.price, 0);
            const disc = order.couponDiscountAmount ?? 0;
            if (disc <= 0) return null;
            return (
              <>
                <p>
                  Subtotal (items):{" "}
                  <span className="font-semibold tabular-nums text-black">${linesSubtotal.toFixed(2)}</span>
                </p>
                <p className="text-emerald-800">
                  Coupon{order.couponCodeSnapshot ? ` (${order.couponCodeSnapshot})` : ""}: −
                  <span className="font-semibold tabular-nums">${disc.toFixed(2)}</span>
                </p>
              </>
            );
          })()}
          {(order.storeCreditUsed ?? 0) > 0 ? (
            <p>
              Affiliate balance applied:{" "}
              <span className="font-semibold tabular-nums text-black">${(order.storeCreditUsed ?? 0).toFixed(2)}</span>
            </p>
          ) : null}
          <p className="text-lg font-bold text-black">
            Order total: <span className="tabular-nums">${order.total.toFixed(2)}</span>
          </p>
          {(order.storeCreditUsed ?? 0) > 0 ? (
            <p className="text-xs">
              Card / other payment:{" "}
              <span className="font-semibold tabular-nums text-black">${(order.cardAmountDue ?? 0).toFixed(2)}</span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
