"use client";

import { useState } from "react";
import type { Product } from "@/lib/store/types";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { addWishlistProduct } from "@/lib/api/customer-portal";

export function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const [qty, setQty] = useState(1);

  async function addWish() {
    try {
      await addWishlistProduct(safe.id);
      showToast(`${safe.name} saved to wishlist`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not add to wishlist";
      if (msg === "Unauthorized") {
        showToast("Sign in to use wishlist", "error");
        return;
      }
      showToast(msg, "error");
    }
  }

  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <label className="flex flex-col gap-2 text-sm font-medium text-neutral-700 sm:shrink-0">
        <span>Quantity</span>
        <input
          type="number"
          min={1}
          max={99}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="min-h-12 w-full min-w-[5.5rem] max-w-[8rem] rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base font-semibold tabular-nums text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-28"
        />
      </label>
      <button
        type="button"
        onClick={() => {
          addItem(safe, qty);
          showToast(
            qty > 1 ? `${qty} × ${safe.name} added to cart` : `${safe.name} added to cart`,
            "success"
          );
        }}
        className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-black px-10 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 sm:min-w-[12rem] sm:flex-none sm:px-12"
      >
        Add to cart
      </button>
      <button
        type="button"
        onClick={() => void addWish()}
        className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-neutral-300 px-8 py-3 text-sm font-semibold text-neutral-800 transition hover:border-black hover:text-black"
      >
        Add to wishlist
      </button>
      </div>
    </div>
  );
}
