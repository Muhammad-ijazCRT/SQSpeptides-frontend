"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/store/types";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";

type Props = { product: Product };

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex gap-0.5 text-[#D4AF37]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < full ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);

  function handleAdd() {
    addItem(safe, 1);
    showToast(`${safe.name} added to cart`, "success");
  }

  return (
    <article className="group relative flex flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#D4AF37]/40">
      <Link href={`/products-catalog/${safe.slug}`} className="relative mb-3 block aspect-square overflow-hidden rounded-md bg-neutral-100">
        <Image
          src={img}
          alt={safe.name}
          fill
          unoptimized
          className={productImageBoxClassName(img, "transition group-hover:scale-[1.02]")}
          sizes="(max-width:768px) 100vw, 25vw"
        />
      </Link>
      <Link href={`/products-catalog/${safe.slug}`} className="font-semibold text-black hover:text-[#b8962e]">
        {safe.name}
      </Link>
      <div className="mt-1 flex items-center gap-2">
        <Stars rating={safe.rating} />
      </div>
      <p className="mt-2 text-lg font-bold text-black">${safe.price.toFixed(2)}</p>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 w-full rounded border border-black py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
      >
        Add to cart
      </button>
    </article>
  );
}
