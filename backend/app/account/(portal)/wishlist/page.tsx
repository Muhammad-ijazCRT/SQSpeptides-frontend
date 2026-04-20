"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import type { WishlistRow } from "@/lib/api/customer-portal";
import { fetchWishlist, removeWishlistProduct } from "@/lib/api/customer-portal";

export default function WishlistPage() {
  const [rows, setRows] = useState<WishlistRow[] | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await fetchWishlist());
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(productId: string) {
    await removeWishlistProduct(productId);
    void load();
  }

  if (rows === null) {
    return <p className="text-sm text-neutral-500">Loading wishlist…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black">Wishlist</h1>
      {rows.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <p className="text-neutral-600">Your wishlist is empty.</p>
          <Link href="/products-catalog" className="mt-4 inline-block font-semibold text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((w) => {
            const img = resolveProductImage({
              slug: w.product.slug,
              imageUrl: w.product.imageUrl ?? null,
            });
            return (
              <li
                key={w.id}
                className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
              >
                <Link href={`/products-catalog/${w.product.slug}`} className="relative aspect-square bg-neutral-100">
                  <Image
                    src={img}
                    alt=""
                    fill
                    unoptimized
                    className={productImageBoxClassName(img)}
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <Link href={`/products-catalog/${w.product.slug}`} className="font-semibold hover:text-blue-600">
                    {w.product.name}
                  </Link>
                  <p className="mt-2 text-lg font-bold">${w.product.price.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => void remove(w.product.id)}
                    className="mt-auto pt-4 text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
