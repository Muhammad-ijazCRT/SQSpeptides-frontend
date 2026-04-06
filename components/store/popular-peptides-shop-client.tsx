"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ATTRIBUTE_FILTERS, CATEGORY_NAV } from "@/lib/store/popular-peptides-data";
import { resolveProductImage } from "@/lib/store/catalog-image";
import type { Product } from "@/lib/store/types";

type SortKey = "popularity" | "latest" | "price-asc" | "price-desc";

const gridImageSizes = "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw";

type Props = {
  products: Product[];
  headingFont: string;
};

function sortProducts(list: Product[], key: SortKey): Product[] {
  const copy = [...list];
  switch (key) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "latest":
      return copy.sort((a, b) => b.slug.localeCompare(a.slug));
    case "popularity":
    default:
      return copy.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
  }
}

export function PopularPeptidesShopClient({ products, headingFont }: Props) {
  const priceMax = useMemo(() => {
    const raw = products.length ? Math.max(...products.map((p) => p.price)) : 0;
    return Math.min(20000, Math.max(500, Math.ceil(Math.max(raw, 1) / 50) * 50));
  }, [products]);

  const [maxPrice, setMaxPrice] = useState(priceMax);

  useEffect(() => {
    setMaxPrice(priceMax);
  }, [priceMax]);

  const [sort, setSort] = useState<SortKey>("popularity");

  const filtered = useMemo(() => {
    const byPrice = products.filter((p) => p.price <= maxPrice);
    return sortProducts(byPrice, sort);
  }, [products, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14 xl:gap-16">
        <aside className="w-full shrink-0 rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-5 shadow-sm sm:p-6 lg:sticky lg:top-28 lg:z-10 lg:max-h-[min(calc(100vh-7rem),52rem)] lg:w-72 lg:overflow-y-auto lg:overscroll-contain lg:self-start xl:w-80">
          <h2 className="border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
            Product categories
          </h2>
          <ul className="mt-5 space-y-2.5 text-sm text-neutral-700 sm:text-[15px]">
            {CATEGORY_NAV.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className={`block rounded-md py-0.5 transition hover:text-black hover:underline ${
                    c.current ? "font-semibold text-black" : "text-neutral-600"
                  }`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-black">Max price</h3>
            <p className="mt-1 text-xs text-neutral-500">Drag to filter results</p>
            <input
              type="range"
              min={0}
              max={priceMax}
              step={Math.max(5, Math.round(priceMax / 100))}
              value={Math.min(maxPrice, priceMax)}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-4 h-2 w-full cursor-pointer accent-black"
              aria-label="Maximum price"
            />
            <p className="mt-3 text-base font-semibold tabular-nums text-black">
              ${maxPrice >= priceMax ? `${priceMax}+` : maxPrice.toFixed(0)}
            </p>
          </div>

          <h3 className="mt-10 border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
            Filter by attribute
          </h3>
          <ul className="mt-5 max-h-40 space-y-2.5 overflow-y-auto overscroll-contain pr-1 text-sm sm:max-h-48">
            {ATTRIBUTE_FILTERS.map((f) => (
              <li key={f.id}>
                <label className="flex cursor-pointer items-center gap-3 text-neutral-700">
                  <input type="checkbox" defaultChecked={false} className="h-4 w-4 shrink-0 rounded border-neutral-300 accent-black" />
                  {f.label}
                </label>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-neutral-50/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm font-medium text-neutral-700 sm:text-base">
              Showing <span className="tabular-nums font-semibold text-black">{filtered.length}</span> results
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <label htmlFor="pp-sort" className="text-sm font-medium text-neutral-600 sm:shrink-0">
                Sort
              </label>
              <select
                id="pp-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="min-h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-auto sm:min-w-[12rem]"
              >
                <option value="popularity">Sort by popularity</option>
                <option value="latest">Sort by latest</option>
                <option value="price-asc">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-12 text-center text-neutral-500">
              No products in the catalog yet. Add products in the admin dashboard.
            </p>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:mt-12 lg:gap-11 xl:grid-cols-3">
              {filtered.map((p) => {
                const img = resolveProductImage(p);
                return (
                  <li key={p.id} className="group flex h-full flex-col">
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200/90 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:ring-neutral-300">
                      <Link
                        href={`/products-catalog/${p.slug}`}
                        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
                            sizes={gridImageSizes}
                            unoptimized
                          />
                        </div>
                      </Link>
                      <div className="flex flex-1 flex-col px-4 pb-5 pt-5 sm:px-5 sm:pb-6 sm:pt-6">
                        <Link href={`/products-catalog/${p.slug}`}>
                          <h3
                            className={`text-lg font-semibold leading-snug tracking-tight text-black transition-colors group-hover:text-[#9a7b1a] sm:text-xl ${headingFont}`}
                          >
                            {p.name}
                          </h3>
                        </Link>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 sm:text-xs">
                          99.9% Purity
                        </p>
                        <div className="mt-auto border-t border-neutral-100 pt-5">
                          <p className="text-2xl font-bold tabular-nums text-black sm:text-[1.65rem]">${p.price.toFixed(2)}</p>
                          <Link
                            href={`/products-catalog/${p.slug}`}
                            className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
                          >
                            Select options
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
