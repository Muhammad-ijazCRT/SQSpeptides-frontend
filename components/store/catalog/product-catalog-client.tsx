"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/store/types";
import { resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { CATALOG_CATEGORIES, FILTER_SIZES, type SortKey } from "@/components/store/catalog/catalog-constants";
import { CatalogFaq } from "@/components/store/catalog/catalog-faq";

const PER_PAGE = 12;

function sortProducts(list: Product[], key: SortKey): Product[] {
  const next = [...list];
  switch (key) {
    case "price-asc":
      return next.sort((a, b) => a.price - b.price);
    case "price-desc":
      return next.sort((a, b) => b.price - a.price);
    case "popularity":
      return next.sort((a, b) => b.rating - a.rating);
    case "latest":
      return next;
    default:
      return next.sort((a, b) => a.name.localeCompare(b.name));
  }
}

const mainGridImageSizes =
  "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, (max-width: 1799px) 33vw, 520px";
const relatedImageSizes =
  "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw";

function CatalogGridCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);

  return (
    <li className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200/90 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:ring-neutral-300">
        <Link href={`/products-catalog/${safe.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
            <Image
              src={img}
              alt={safe.name}
              fill
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
              sizes={mainGridImageSizes}
              unoptimized
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-5 sm:px-5 sm:pb-6 sm:pt-6">
          <Link href={`/products-catalog/${safe.slug}`} className="block">
            <h3 className="text-lg font-semibold leading-snug tracking-tight text-black transition-colors group-hover:text-[#9a7b1a] sm:text-xl">
              {safe.name}
            </h3>
          </Link>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 sm:text-xs">
            99.9% Purity
          </p>
          <div className="mt-auto flex flex-col gap-4 border-t border-neutral-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-2xl font-bold tabular-nums tracking-tight text-black sm:text-[1.65rem]">
              ${safe.price.toFixed(2)}
            </p>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <Link
                href={`/products-catalog/${safe.slug}`}
                className="inline-flex min-h-11 min-w-[7.5rem] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 text-xs font-semibold uppercase tracking-wide text-neutral-800 transition hover:border-black hover:bg-neutral-50"
              >
                View
              </Link>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addItem(safe, 1);
                  showToast(`${safe.name} added to cart`, "success");
                }}
                className="inline-flex min-h-11 min-w-[7.5rem] items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function RelatedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);

  return (
    <li className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-50/80 shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:ring-neutral-300">
        <Link href={`/products-catalog/${safe.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
            <Image
              src={img}
              alt={safe.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes={relatedImageSizes}
              unoptimized
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5">
          <Link href={`/products-catalog/${safe.slug}`}>
            <h3 className="text-base font-semibold leading-snug text-black transition-colors group-hover:text-[#9a7b1a] sm:text-lg">
              {safe.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Supplied for laboratory and non-clinical research use only.
          </p>
          <p className="mt-4 text-xl font-bold tabular-nums text-black">${safe.price.toFixed(2)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/products-catalog/${safe.slug}`}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 bg-white px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 transition hover:border-black sm:flex-none sm:px-4"
            >
              View
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(safe, 1);
                showToast(`${safe.name} added to cart`, "success");
              }}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-black px-3 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 sm:flex-none sm:px-4"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProductCatalogClient({
  products,
  apiError,
}: {
  products: Product[];
  apiError: boolean;
}) {
  const [sort, setSort] = useState<SortKey>("default");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [page, setPage] = useState(1);

  const filteredSorted = useMemo(() => {
    const priced = products.filter((p) => p.price <= maxPrice);
    return sortProducts(priced, sort);
  }, [products, maxPrice, sort]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const slice = filteredSorted.slice(start, start + PER_PAGE);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PER_PAGE, total);

  const related = useMemo(() => products.slice(0, 6), [products]);

  return (
    <div className="bg-white text-black">
      <div className="border-b border-[#c9a227] bg-[#c9a227] py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
        For Research Use Only
      </div>

      <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          All Research Peptides
        </h1>
        <p className="mt-5 max-w-4xl text-base leading-relaxed text-neutral-600 lg:text-lg lg:leading-relaxed">
          A comprehensive collection of research-grade compounds supplied for non-clinical, in-vitro laboratory research and
          development. Designed to support analytical testing, molecular investigation, cellular studies, formulation research,
          and exploratory R&amp;D across multiple scientific disciplines.
        </p>

        {apiError && (
          <p className="mt-6 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Catalog API unavailable. Start the NestJS backend and set <code className="text-xs">NEXT_PUBLIC_API_URL</code>.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-14 xl:gap-16">
          <aside className="w-full shrink-0 rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-5 shadow-sm sm:p-6 lg:sticky lg:top-28 lg:z-10 lg:max-h-[min(calc(100vh-7rem),52rem)] lg:w-72 lg:overflow-y-auto lg:overscroll-contain lg:self-start xl:w-80">
            <h2 className="border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
              Product categories
            </h2>
            <ul className="mt-5 space-y-2.5 text-sm text-neutral-700 sm:text-[15px]">
              {CATALOG_CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    href={c === "Product Catalog" ? "/products-catalog" : "#"}
                    className="block rounded-md py-0.5 transition hover:text-black hover:underline"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
              Filter by
            </h2>
            <ul className="mt-5 max-h-48 space-y-2.5 overflow-y-auto overscroll-contain pr-1 text-sm sm:max-h-56">
              {FILTER_SIZES.map((f) => (
                <li key={f.label} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`f-${f.label}`}
                    className="h-4 w-4 shrink-0 rounded border-neutral-400 text-black focus:ring-black"
                    title="Filter UI (connect to attributes later)"
                  />
                  <label htmlFor={`f-${f.label}`} className="cursor-pointer text-neutral-600">
                    {f.label}{" "}
                    <span className="text-neutral-400">({f.count})</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-black">Max price</h3>
              <p className="mt-1 text-xs text-neutral-500">Drag to filter the catalog</p>
              <input
                type="range"
                min={0}
                max={5000}
                step={50}
                value={Math.min(maxPrice, 5000)}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="mt-4 h-2 w-full cursor-pointer accent-black"
              />
              <p className="mt-3 text-base font-semibold tabular-nums text-black">
                ${maxPrice >= 5000 ? "5000+" : maxPrice.toFixed(0)}
              </p>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-neutral-50/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-sm font-medium text-neutral-700 sm:text-base">
                Showing <span className="tabular-nums text-black">{showingFrom}</span>–
                <span className="tabular-nums text-black">{showingTo}</span> of{" "}
                <span className="tabular-nums text-black">{total}</span> results
              </p>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                <label htmlFor="catalog-sort" className="text-sm font-medium text-neutral-600 sm:shrink-0">
                  Sort
                </label>
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="min-h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:w-auto sm:min-w-[12rem]"
                >
                  <option value="default">Default sorting</option>
                  <option value="popularity">Sort by popularity</option>
                  <option value="latest">Sort by latest</option>
                  <option value="price-asc">Sort by price: low to high</option>
                  <option value="price-desc">Sort by price: high to low</option>
                </select>
              </div>
            </div>

            {total === 0 ? (
              <p className="mt-12 text-center text-base text-neutral-500">No products match this filter.</p>
            ) : (
              <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:mt-12 lg:gap-11 xl:grid-cols-3">
                {slice.map((p) => (
                  <CatalogGridCard key={p.id} product={p} />
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`min-h-11 min-w-11 rounded-lg border px-3 text-sm font-semibold transition ${
                      currentPage === n
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 text-black hover:border-neutral-400 hover:bg-neutral-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="min-h-11 rounded-lg border border-neutral-300 px-4 text-sm font-semibold hover:bg-neutral-50"
                  >
                    Next →
                  </button>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem]">
            Precision Peptides, Not Mass-Market
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-neutral-600 lg:text-lg">
            High-purity research compounds formulated for accuracy, consistency, and laboratory use — without fillers,
            blends, or unnecessary additives.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Research-Grade Accuracy", "Consistent analytical profiles for reproducible studies."],
              ["Verified Purity & Quality", "Batch-focused quality documentation where applicable."],
              ["Focused, Single-Compound Formulation", "Clear labeling for research traceability."],
              ["Domestic Fulfillment", "U.S.-based storage and shipping on in-stock items."],
            ].map(([t, d]) => (
              <div key={t} className="text-left">
                <h3 className="text-sm font-bold text-black sm:text-base">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-[2rem]">Related Product</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">
            Frequently viewed alongside the catalog — same research-grade standards.
          </p>
          <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {related.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Product Reviews</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {[
              {
                name: "James R",
                date: "Sept 12, 2025",
                text: "The product arrived in perfect condition with secure, professional packaging. Labeling was clear and matched the specifications provided on the website.",
              },
              {
                name: "Daniel Smith",
                date: "Sept 12, 2025",
                text: "From placing the order to receiving the shipment, the process was seamless. The product was well protected and arrived within the expected timeframe.",
              },
              {
                name: "Sarah L",
                date: "Sept 12, 2025",
                text: "Professional-grade product and trustworthy service. Clear documentation and transparent product details were reassuring.",
              },
            ].map((r) => (
              <blockquote
                key={r.name}
                className="flex h-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-sm sm:p-8"
              >
                <p className="text-base leading-relaxed text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-6 border-t border-neutral-100 pt-5 text-base font-semibold text-black">
                  {r.name}
                  <span className="mt-1 block text-sm font-normal text-neutral-500 sm:inline sm:ml-2 sm:mt-0">{r.date}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <CatalogFaq />

      <section className="border-t border-neutral-200 bg-neutral-50 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold md:text-3xl">Research-Grade Quality You Can Trust</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Our peptide products are handled in controlled laboratory environments and developed with a strong focus on
            precision, consistency, and research integrity. Every step reflects our commitment to high-quality standards
            suitable for professional research use.
          </p>
          <ul className="mx-auto mt-8 max-w-xl space-y-2 text-left text-sm text-neutral-700">
            {[
              "Research-grade handling in controlled laboratory settings",
              "Precision testing using advanced analytical instruments",
              "Clean, controlled environments to ensure consistency",
              "Batch-level quality checks for reliability",
              "Designed strictly for research purposes",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-[#c9a227]">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/contact-us"
            className="mt-10 inline-block border-2 border-black px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-black hover:text-white"
          >
            Explore Full Specifications
          </Link>
        </div>
      </section>
    </div>
  );
}
