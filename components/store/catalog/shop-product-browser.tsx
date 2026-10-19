"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { FILTER_SIZES, SHOP_PRODUCTS_PER_PAGE, type SortKey } from "@/components/store/catalog/catalog-constants";
import { PopularProductBadge } from "@/components/store/catalog/popular-product-badge";
import {
  CATALOG_NAV,
  compareSizeLabels,
  countProductsWithSize,
  isCatalogCategoryId,
  productMatchesCatalogCategory,
  productMatchesSizeLabel,
  type CatalogCategoryId,
} from "@/lib/store/catalog-filters";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import type { Product } from "@/lib/store/types";

const PER_PAGE = SHOP_PRODUCTS_PER_PAGE;

const mainGridImageSizes =
  "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, (max-width: 1799px) 33vw, 520px";

function productMatchesQuery(product: Product, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  return (
    product.name.toLowerCase().includes(q) ||
    product.slug.toLowerCase().includes(q) ||
    (product.description ?? "").toLowerCase().includes(q)
  );
}

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

function CatalogGridCard({
  product,
  showSpotlightBadge = false,
}: {
  product: Product;
  showSpotlightBadge?: boolean;
}) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);
  const isPopular = showSpotlightBadge && Boolean(safe.spotlight);

  return (
    <li className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200/90 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:ring-neutral-300">
        <Link
          href={`/products-catalog/${safe.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
            {isPopular ? <PopularProductBadge /> : null}
            <Image
              src={img}
              alt={safe.name}
              fill
              className={productImageBoxClassName(img, "transition duration-500 ease-out group-hover:scale-[1.04]")}
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

export type ShopProductBrowserProps = {
  products: Product[];
  /** Path used for search / category query updates (e.g. `/products-catalog` or `/popular-peptides`). */
  basePath: string;
  className?: string;
  emptyMessage?: string;
  /** When true, Spotlight products show a Popular badge on the image (catalog page). */
  showSpotlightBadge?: boolean;
};

/**
 * Shared sidebar filters + product grid + pagination for catalog and popular peptides.
 */
export function ShopProductBrowser({
  products,
  basePath,
  className = "",
  emptyMessage = "No products match this filter.",
  showSpotlightBadge = false,
}: ShopProductBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q")?.trim() ?? "";
  const catRaw = searchParams.get("cat");
  const activeCategory: CatalogCategoryId = isCatalogCategoryId(catRaw) ? catRaw : "all";

  const [sort, setSort] = useState<SortKey>("default");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(qParam);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    setSearchInput(qParam);
  }, [qParam]);

  const sizesKey = selectedSizes.slice().sort().join(",");

  useEffect(() => {
    setPage(1);
  }, [activeCategory, qParam, sizesKey, basePath]);

  const afterCategory = useMemo(
    () => products.filter((p) => productMatchesCatalogCategory(p, activeCategory)),
    [products, activeCategory],
  );

  const sizeFacets = useMemo(() => {
    return FILTER_SIZES.map((f) => ({
      label: f.label,
      count: countProductsWithSize(afterCategory, f.label),
    }))
      .filter((x) => x.count > 0)
      .sort((a, b) => compareSizeLabels(a.label, b.label));
  }, [afterCategory]);

  useEffect(() => {
    const available = new Set<string>(sizeFacets.map((f) => f.label));
    setSelectedSizes((prev) => prev.filter((l) => available.has(l)));
  }, [sizeFacets]);

  const afterSizes = useMemo(() => {
    if (selectedSizes.length === 0) return afterCategory;
    return afterCategory.filter((p) => selectedSizes.some((sz) => productMatchesSizeLabel(p, sz)));
  }, [afterCategory, selectedSizes]);

  const filteredSorted = useMemo(() => {
    const priced = afterSizes.filter((p) => p.price <= maxPrice);
    const matched = qParam ? priced.filter((p) => productMatchesQuery(p, qParam)) : priced;
    return sortProducts(matched, sort);
  }, [afterSizes, maxPrice, sort, qParam]);

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

  function hrefWithParams(next: { q?: string; cat?: CatalogCategoryId }): string {
    const params = new URLSearchParams();
    const q = next.q !== undefined ? next.q : qParam;
    const cat = next.cat !== undefined ? next.cat : activeCategory;
    if (q) params.set("q", q);
    if (cat !== "all") params.set("cat", cat);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function submitCatalogSearch(e: React.FormEvent) {
    e.preventDefault();
    const v = searchInput.trim();
    setPage(1);
    router.push(hrefWithParams({ q: v }));
  }

  function clearCatalogSearch() {
    setSearchInput("");
    setPage(1);
    router.push(hrefWithParams({ q: "" }));
  }

  function toggleSizeFilter(label: string) {
    setSelectedSizes((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  }

  return (
    <div className={`flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14 xl:gap-16 ${className}`}>
      <aside className="w-full shrink-0 rounded-2xl border border-neutral-200/90 bg-neutral-50/60 shadow-sm lg:sticky lg:top-24 lg:z-20 lg:flex lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)] lg:w-72 lg:flex-col lg:overflow-hidden lg:self-start xl:w-80">
        <div className="flex max-h-[min(28rem,70vh)] flex-col overflow-y-auto overscroll-contain p-5 sm:p-6 lg:max-h-none lg:flex-1 lg:pr-2">
          <h2 className="border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
            Product categories
          </h2>
          <ul className="mt-5 space-y-1 text-sm text-neutral-700 sm:text-[15px]">
            {CATALOG_NAV.map((c) => {
              const active = activeCategory === c.id;
              return (
                <li key={c.id}>
                  <Link
                    href={hrefWithParams({ cat: c.id })}
                    scroll={false}
                    className={`block rounded-md px-2 py-1.5 transition ${
                      active ? "bg-black font-semibold text-white" : "hover:bg-neutral-200/80 hover:text-black"
                    }`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <h2 className="mt-8 border-b border-black/90 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
            Filter by
          </h2>
          <p className="mt-3 text-xs text-neutral-500">Size / concentration (matches name or slug)</p>
          <ul className="mt-4 space-y-2.5 pr-1 text-sm">
            {sizeFacets.length === 0 ? (
              <li className="text-xs text-neutral-500">No size tags match this category.</li>
            ) : (
              sizeFacets.map((f) => {
                const id = `f-${basePath.replace(/\W/g, "")}-${f.label.replace(/\s+/g, "-")}`;
                return (
                  <li key={f.label} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={id}
                      checked={selectedSizes.includes(f.label)}
                      onChange={() => toggleSizeFilter(f.label)}
                      className="h-4 w-4 shrink-0 rounded border-neutral-400 text-black focus:ring-black"
                    />
                    <label htmlFor={id} className="cursor-pointer text-neutral-600">
                      {f.label} <span className="text-neutral-400">({f.count})</span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
          {selectedSizes.length > 0 ? (
            <button
              type="button"
              onClick={() => setSelectedSizes([])}
              className="mt-3 text-xs font-semibold text-black underline decoration-neutral-400 underline-offset-2 hover:decoration-black"
            >
              Clear size filters
            </button>
          ) : null}

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
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200/80 bg-neutral-50/40 px-4 py-4 sm:px-5">
          <form
            onSubmit={submitCatalogSearch}
            className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3"
            role="search"
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor={`shop-search-${basePath}`}
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600"
              >
                Search products
              </label>
              <input
                id={`shop-search-${basePath}`}
                type="search"
                name="q"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name, keyword, or URL slug…"
                autoComplete="off"
                className="min-h-11 w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
            <div className="flex shrink-0 gap-2 sm:items-end sm:pt-5">
              <button
                type="submit"
                className="min-h-11 rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Search
              </button>
              {qParam ? (
                <button
                  type="button"
                  onClick={clearCatalogSearch}
                  className="min-h-11 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </form>

          <div className="flex flex-col gap-4 border-t border-neutral-200/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-neutral-700 sm:text-base">
              Showing <span className="tabular-nums text-black">{showingFrom}</span>–
              <span className="tabular-nums text-black">{showingTo}</span> of{" "}
              <span className="tabular-nums text-black">{total}</span> results
              {activeCategory !== "all" ? (
                <>
                  {" "}
                  ·{" "}
                  <span className="font-semibold text-black">
                    {CATALOG_NAV.find((c) => c.id === activeCategory)?.label}
                  </span>
                </>
              ) : null}
              {qParam ? (
                <>
                  {" "}
                  for <span className="font-semibold text-black">&ldquo;{qParam}&rdquo;</span>
                </>
              ) : null}
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <label htmlFor={`shop-sort-${basePath}`} className="text-sm font-medium text-neutral-600 sm:shrink-0">
                Sort
              </label>
              <select
                id={`shop-sort-${basePath}`}
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
        </div>

        {total === 0 ? (
          <p className="mt-12 text-center text-base text-neutral-500">
            {qParam ? (
              <>
                No products match &ldquo;{qParam}&rdquo;. Try another term, adjust the price filter, or{" "}
                <button type="button" onClick={clearCatalogSearch} className="font-semibold text-black underline">
                  clear search
                </button>
                .
              </>
            ) : (
              emptyMessage
            )}
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:mt-12 lg:gap-11 xl:grid-cols-3">
            {slice.map((p) => (
              <CatalogGridCard key={p.id} product={p} showSpotlightBadge={showSpotlightBadge} />
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
  );
}
