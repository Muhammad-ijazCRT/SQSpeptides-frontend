"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/store/types";
import { resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";

export function CatalogGridItem({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const src = resolveProductImage(safe);

  return (
    <li className="border-b border-neutral-200 pb-8">
      <Link href={`/products-catalog/${safe.slug}`} className="block">
        <div className="relative mx-auto aspect-square max-w-[280px] overflow-hidden bg-neutral-50">
          <Image
            src={src}
            alt={safe.name}
            fill
            className="object-cover transition hover:opacity-95"
            sizes="(max-width:768px) 100vw, 280px"
            unoptimized
          />
        </div>
        <h3 className="mt-4 text-center text-base font-semibold text-black hover:text-[#b8962e] md:text-lg">
          {safe.name}
        </h3>
      </Link>
      <p className="mt-2 text-center text-sm text-neutral-600">99.9% Purity</p>
      <hr className="mx-auto mt-3 max-w-[120px] border-neutral-300" />
      <p className="mt-3 text-center text-lg font-semibold text-black">${safe.price.toFixed(2)}</p>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addItem(safe, 1);
          showToast(`${safe.name} added to cart`, "success");
        }}
        className="mt-3 w-full border border-black py-2 text-sm font-medium text-black hover:bg-black hover:text-white"
      >
        Add to cart
      </button>
    </li>
  );
}
