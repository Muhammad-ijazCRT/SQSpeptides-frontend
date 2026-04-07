"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useCart } from "@/components/store/cart-context";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";

export default function CartPage() {
  const router = useRouter();
  const [checkoutPending, startCheckoutTransition] = useTransition();
  const { lines, setQuantity, removeLine, subtotal } = useCart();

  useEffect(() => {
    if (lines.length > 0) {
      router.prefetch("/checkout");
    }
  }, [lines.length, router]);

  return (
    <div className="bg-neutral-50 min-h-[60vh] py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-black">Your cart</h1>
        {lines.length === 0 ? (
          <p className="mt-8 text-neutral-600">
            Your cart is empty.{" "}
            <Link href="/products-catalog" className="font-medium text-[#b8962e] hover:underline">
              Browse products
            </Link>
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {lines.map(({ product, quantity }) => {
              const img = resolveProductImage(product);
              return (
                <li
                  key={product.id}
                  className="flex flex-wrap gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="relative h-24 w-24 shrink-0">
                    <Image src={img} alt={product.name} fill className={productImageBoxClassName(img)} unoptimized />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Link href={`/products-catalog/${product.slug}`} className="font-semibold text-black hover:text-[#b8962e]">
                      {product.name}
                    </Link>
                    <p className="text-sm text-neutral-500 mt-1">${product.price.toFixed(2)} each</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="text-sm text-neutral-600 flex items-center gap-2">
                        Qty
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={quantity}
                          onChange={(e) => setQuantity(product.id, Math.max(1, Number(e.target.value) || 1))}
                          className="w-16 rounded border border-neutral-300 px-2 py-1 text-sm"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeLine(product.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-black">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {lines.length > 0 && (
          <div className="mt-8 flex flex-col items-end gap-4 border-t border-neutral-200 pt-6">
            <p className="text-lg">
              Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span>
            </p>
            <button
              type="button"
              disabled={checkoutPending}
              onClick={() => startCheckoutTransition(() => router.push("/checkout"))}
              className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black transition hover:bg-[#c9a432] disabled:cursor-wait disabled:opacity-80"
            >
              {checkoutPending ? (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black"
                    aria-hidden
                  />
                  Going to checkout…
                </span>
              ) : (
                "Proceed to checkout"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
