"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/store/types";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { CatalogFaq } from "@/components/store/catalog/catalog-faq";

const CATEGORIES = [
  "Product Catalog",
  "GLPs",
  "Cellular Research Peptides",
  "Metabolic Research Peptides",
  "Neurological Pathway Research Peptides",
  "Specialty Research Peptides",
  "Blend Research Peptides",
  "Laboratory Research Liquids",
  "Popular Peptides",
];

const FILTER_SIZES = [
  { label: "100mg", count: 1 },
  { label: "10mg", count: 18 },
  { label: "10ML", count: 1 },
  { label: "1mg", count: 1 },
  { label: "20mg", count: 1 },
  { label: "30mg", count: 2 },
  { label: "40mg", count: 1 },
  { label: "500mg", count: 1 },
  { label: "50mg", count: 3 },
  { label: "5mg", count: 4 },
  { label: "70mg", count: 1 },
  { label: "80mg", count: 1 },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default sorting" },
  { value: "popularity", label: "Sort by popularity" },
  { value: "latest", label: "Sort by latest" },
  { value: "price-asc", label: "Sort by price: low to high" },
  { value: "price-desc", label: "Sort by price: high to low" },
];

const PER_PAGE = 16;

function CatalogGridCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);

  return (
    <article className="flex flex-col border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4">
      <Link href={`/products-catalog/${safe.slug}`} className="relative mb-3 block aspect-square w-full overflow-hidden bg-neutral-100">
        <Image
          src={img}
          alt={safe.name}
          fill
          unoptimized
          className={productImageBoxClassName(img)}
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />
      </Link>
      <Link href={`/products-catalog/${safe.slug}`} className="text-base font-semibold text-black hover:text-[#b8962e] md:text-lg">
        {safe.name}
      </Link>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-neutral-500">99.9% Purity</p>
      <hr className="my-3 border-neutral-200" />
      <p className="text-lg font-bold text-black">${safe.price.toFixed(2)}</p>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addItem(safe, 1);
          showToast(`${safe.name} added to cart`, "success");
        }}
        className="mt-3 border border-black py-2 text-xs font-semibold text-black hover:bg-black hover:text-white sm:text-sm"
      >
        Add to cart
      </button>
    </article>
  );
}

export function ProductCatalogShell({
  products,
  apiError,
}: {
  products: Product[];
  apiError: boolean;
}) {
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [page, setPage] = useState(1);

  const processed = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case "popularity":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "latest":
        list = [...list].reverse();
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, sort, maxPrice]);

  const total = processed.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageItems = processed.slice(start, start + PER_PAGE);

  return (
    <div className="bg-neutral-100">
      <div className="border-b border-neutral-200 bg-[#c9a227] py-2 text-center text-[11px] font-bold uppercase tracking-widest text-white sm:text-xs">
        For research use only
      </div>

      <div className="mx-auto max-w-[1400px] px-4 py-10 lg:px-8 lg:py-14">
        <h1 className="text-3xl font-bold text-black md:text-4xl lg:text-5xl">All Research Peptides</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-neutral-700 md:text-base">
          A comprehensive collection of research-grade compounds supplied for non-clinical, in-vitro laboratory research and
          development. Designed to support analytical testing, molecular investigation, cellular studies, formulation research,
          and exploratory R&amp;D across multiple scientific disciplines.
        </p>

        {apiError && (
          <p className="mt-6 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Catalog API unavailable — showing empty results. Start the NestJS backend and set{" "}
            <code className="text-xs">NEXT_PUBLIC_API_URL</code>, then run <code className="text-xs">prisma db seed</code>.
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(220px,280px)_1fr] lg:gap-12">
          <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
            <div>
              <h2 className="border-b border-black pb-2 text-lg font-bold text-black">Product categories</h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-800">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <Link href="/products-catalog" className="hover:text-[#b8962e] hover:underline">
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="border-b border-black pb-2 text-lg font-bold text-black">Filter by</h2>
              <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
                {FILTER_SIZES.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-neutral-700">
                    <input type="checkbox" id={f.label} className="rounded border-neutral-300" readOnly title="Display only" />
                    <label htmlFor={f.label} className="cursor-default">
                      {f.label}{" "}
                      <span className="text-neutral-400">({f.count})</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <h3 className="text-sm font-bold text-black">Max Price</h3>
                <p className="mt-1 text-xs text-neutral-500">Price filter</p>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={10}
                  value={Math.min(maxPrice, 2000)}
                  onChange={(e) => {
                    setMaxPrice(Number(e.target.value) || 5000);
                    setPage(1);
                  }}
                  className="mt-3 w-full accent-black"
                />
                <p className="mt-2 text-sm font-medium text-black">${maxPrice >= 2000 ? "2000+" : maxPrice.toFixed(0)}</p>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-600">
                {total === 0 ? (
                  "Showing 0 of 0 results"
                ) : (
                  <>
                    Showing {start + 1}–{Math.min(start + PER_PAGE, total)} of {total} results
                  </>
                )}
              </p>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full max-w-xs border border-neutral-300 bg-white px-3 py-2 text-sm text-black sm:w-auto"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((p) => (
                <CatalogGridCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={`min-w-[2.25rem] border px-3 py-2 text-sm font-medium ${
                      n === safePage ? "border-black bg-black text-white" : "border-neutral-300 bg-white text-black hover:border-black"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                {safePage < totalPages && (
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-black"
                  >
                    →
                  </button>
                )}
              </nav>
            )}
          </div>
        </div>
      </div>

      <section className="border-t border-neutral-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold text-black md:text-3xl">Precision Peptides, Not Mass-Market</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-neutral-600 md:text-base">
            High-purity research compounds formulated for accuracy, consistency, and laboratory use — without fillers, blends,
            or unnecessary additives.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Research-Grade Accuracy", d: "Consistent analytical profiles for reproducible studies." },
              { t: "Verified Purity & Quality", d: "Documentation and batch traceability where applicable." },
              { t: "Focused, Single-Compound Formulation", d: "Clear labeling for laboratory identification." },
              { t: "Domestic fulfillment", d: "Fast processing for in-stock research materials." },
            ].map((x) => (
              <div key={x.t} className="border border-neutral-200 bg-neutral-50 p-6 text-left">
                <h3 className="font-bold text-black">{x.t}</h3>
                <p className="mt-2 text-sm text-neutral-600">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-black md:text-3xl">Related products</h2>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <CatalogGridCard key={`rel-${p.id}`} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-black md:text-3xl">Product Reviews</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
              <blockquote key={r.name} className="border border-neutral-200 bg-neutral-50 p-6 text-left">
                <div className="text-[#c9a227]">★★★★★</div>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-black">
                  {r.name}
                  <span className="ml-2 font-normal text-neutral-500">{r.date}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <CatalogFaq />

      <section className="border-t border-neutral-200 bg-neutral-100 py-14 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-black md:text-3xl">Research-Grade Quality You Can Trust</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-neutral-600 md:text-base">
            Our peptide products are handled in controlled laboratory environments and developed with a strong focus on precision,
            consistency, and research integrity.
          </p>
          <ul className="mx-auto mt-10 max-w-2xl list-inside list-disc space-y-2 text-sm text-neutral-700">
            <li>Research-grade handling in controlled laboratory settings</li>
            <li>Precision testing using advanced analytical instruments</li>
            <li>Clean, controlled environments to ensure consistency</li>
            <li>Batch-level quality checks for reliability</li>
            <li>Designed strictly for research purposes</li>
          </ul>
          <div className="mt-10 text-center">
            <Link href="/products-catalog" className="inline-block border-2 border-black px-8 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white">
              Explore full specifications
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
