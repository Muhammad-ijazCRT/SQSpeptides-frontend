"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import {
  CATALOG_NAV,
  productMatchesCatalogCategory,
  type CatalogCategoryId,
} from "@/lib/store/catalog-filters";
import type { Product } from "@/lib/store/types";

const GOLD = "#D4AF37";
const GOLD_DARK = "#b8962e";
const CREAM = "#fffbf2";
const PRICE_MAX = 5000;

export type SizeFacet = { label: string; count: number };

export type CatalogFiltersSidebarProps = {
  products: Product[];
  basePath: string;
  activeCategory: CatalogCategoryId;
  hrefWithParams: (next: { q?: string; cat?: CatalogCategoryId }) => string;
  sizeFacets: SizeFacet[];
  selectedSizes: string[];
  onToggleSize: (label: string) => void;
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onClearFilters: () => void;
  /** Mobile drawer open state — when set, renders as a slide-in panel */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** When true, omit outer chrome used only for the sticky desktop card */
  variant?: "desktop" | "drawer";
};

function categoryLabel(id: CatalogCategoryId, fallback: string): string {
  if (id === "all") return "All Products";
  return fallback;
}

function CategoryIcon({ id, className = "" }: { id: CatalogCategoryId; className?: string }) {
  const common = `h-[18px] w-[18px] shrink-0 ${className}`;
  switch (id) {
    case "all":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "glp":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        </svg>
      );
    case "cellular":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 3c2.5 4 6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 9.5 7 12 3Z" />
          <path d="M12 13v8" />
        </svg>
      );
    case "metabolic":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M13 2 4 14h7l-1 8 10-14h-7l0-6Z" strokeLinejoin="round" />
        </svg>
      );
    case "neurological":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 4a5 5 0 0 1 5 5c0 1.4-.5 2.4-1.2 3.2.8.6 1.2 1.5 1.2 2.6a3.2 3.2 0 0 1-3.2 3.2h-.6v2.5M12 4a5 5 0 0 0-5 5c0 1.4.5 2.4 1.2 3.2-.8.6-1.2 1.5-1.2 2.6A3.2 3.2 0 0 0 10.2 18h.6v2.5" />
        </svg>
      );
    case "specialty":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case "blend":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" />
          <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="10" cy="17" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "liquids":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 3s5 6.2 5 10a5 5 0 0 1-10 0c0-3.8 5-10 5-10Z" />
        </svg>
      );
    case "popular":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path
            d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function FunnelIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5Z" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="m6 15 6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M21 12a9 9 0 1 1-2.6-6.3" strokeLinecap="round" />
      <path d="M21 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DualPriceSlider({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}) {
  const lo = Math.min(minPrice, maxPrice);
  const hi = Math.max(minPrice, maxPrice);
  const leftPct = (lo / PRICE_MAX) * 100;
  const rightPct = (hi / PRICE_MAX) * 100;

  return (
    <div className="relative h-8 touch-none select-none">
      <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-neutral-200" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full"
        style={{
          left: `${leftPct}%`,
          width: `${Math.max(0, rightPct - leftPct)}%`,
          backgroundColor: GOLD,
        }}
      />
      <input
        type="range"
        min={0}
        max={PRICE_MAX}
        step={50}
        value={lo}
        aria-label="Minimum price"
        onChange={(e) => {
          const next = Number(e.target.value);
          onMinPriceChange(Math.min(next, hi));
        }}
        className="catalog-dual-range absolute inset-0 z-[2] h-full w-full appearance-none bg-transparent"
      />
      <input
        type="range"
        min={0}
        max={PRICE_MAX}
        step={50}
        value={hi}
        aria-label="Maximum price"
        onChange={(e) => {
          const next = Number(e.target.value);
          onMaxPriceChange(Math.max(next, lo));
        }}
        className="catalog-dual-range absolute inset-0 z-[3] h-full w-full appearance-none bg-transparent"
      />
    </div>
  );
}

function SidebarPanel({
  products,
  basePath,
  activeCategory,
  hrefWithParams,
  sizeFacets,
  selectedSizes,
  onToggleSize,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters,
  onApply,
  showDrawerChrome,
}: CatalogFiltersSidebarProps & {
  onApply?: () => void;
  showDrawerChrome?: boolean;
}) {
  const reactId = useId();
  const [sizeOpen, setSizeOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const categoryCounts = useMemo(() => {
    const map = {} as Record<CatalogCategoryId, number>;
    for (const nav of CATALOG_NAV) {
      map[nav.id] = products.filter((p) => productMatchesCatalogCategory(p, nav.id)).length;
    }
    return map;
  }, [products]);

  const hasActiveFilters =
    selectedSizes.length > 0 || minPrice > 0 || maxPrice < PRICE_MAX;

  const minDisplay = minPrice <= 0 ? "0" : String(minPrice);
  const maxDisplay = maxPrice >= PRICE_MAX ? "5000+" : String(maxPrice);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {showDrawerChrome ? (
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-950">
            <FunnelIcon className="h-4 w-4 text-neutral-700" />
            Filters &amp; Categories
          </div>
          <button
            type="button"
            onClick={onApply}
            aria-label="Close filters"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {/* Hero header card */}
        <div className="relative mx-3 mt-3 overflow-hidden rounded-2xl sm:mx-4 sm:mt-4">
          <div
            className="relative min-h-[7.5rem] px-5 py-5 sm:min-h-[8.25rem] sm:px-6 sm:py-6"
            style={{
              background:
                "radial-gradient(ellipse 80% 120% at 85% 20%, rgba(212,175,55,0.45) 0%, transparent 55%), radial-gradient(ellipse 60% 80% at 15% 90%, rgba(212,175,55,0.2) 0%, transparent 50%), linear-gradient(145deg, #0a0a0a 0%, #1a1510 45%, #0d0d0d 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-6 -top-8 h-36 w-36 rounded-full opacity-40 blur-2xl"
              style={{ background: GOLD }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 right-8 h-20 w-20 rounded-full opacity-25 blur-xl"
              style={{ background: GOLD }}
              aria-hidden
            />
            <h2 className="relative text-xl font-bold tracking-tight text-white sm:text-2xl">
              Product <span style={{ color: GOLD }}>Catalog</span>
            </h2>
            <p className="relative mt-1.5 max-w-[16rem] text-xs leading-relaxed text-white/75 sm:text-[13px]">
              Explore our research peptides and laboratory products.
            </p>
          </div>
        </div>

        {/* Categories */}
        <nav className="mt-2 px-2 sm:px-3" aria-label="Product categories">
          <ul className="divide-y divide-neutral-100">
            {CATALOG_NAV.map((c) => {
              const active = activeCategory === c.id;
              const count = categoryCounts[c.id] ?? 0;
              const label = categoryLabel(c.id, c.label);
              return (
                <li key={c.id}>
                  <Link
                    href={hrefWithParams({ cat: c.id })}
                    scroll={false}
                    onClick={() => {
                      if (showDrawerChrome) onApply?.();
                    }}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                      active
                        ? "border border-[#D4AF37]/45 bg-[#fffbf2] shadow-sm"
                        : "border border-transparent hover:bg-neutral-50"
                    }`}
                    style={active ? { backgroundColor: CREAM } : undefined}
                  >
                    <span className={active ? "text-[#D4AF37]" : "text-neutral-500 group-hover:text-neutral-800"}>
                      <CategoryIcon id={c.id} />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-sm ${
                        active ? "font-semibold text-[#9a7b1a]" : "font-medium text-neutral-800"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                        active ? "bg-[#D4AF37]/20 text-[#9a7b1a]" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {count}
                    </span>
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 ${active ? "text-[#D4AF37]" : "text-neutral-300"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Filters */}
        <div className="mt-4 border-t border-neutral-100 px-4 pb-5 pt-4 sm:px-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-950">
              <FunnelIcon className="h-4 w-4" />
              Filters
            </div>
            <button
              type="button"
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
              style={{ color: GOLD_DARK }}
            >
              <RefreshIcon />
              Clear All
            </button>
          </div>

          {/* Size accordion */}
          <div className="rounded-xl border border-neutral-200/90 bg-white">
            <button
              type="button"
              onClick={() => setSizeOpen((o) => !o)}
              className="flex w-full items-center justify-between px-3.5 py-3 text-left"
              aria-expanded={sizeOpen}
            >
              <span className="text-sm font-semibold text-neutral-900">Size / Concentration</span>
              <ChevronUp
                className={`h-4 w-4 text-neutral-400 transition ${sizeOpen ? "" : "rotate-180"}`}
              />
            </button>
            {sizeOpen ? (
              <ul className="space-y-1 border-t border-neutral-100 px-3.5 pb-3.5 pt-2">
                {sizeFacets.length === 0 ? (
                  <li className="py-1 text-xs text-neutral-500">No size tags match this category.</li>
                ) : (
                  sizeFacets.map((f) => {
                    const id = `${reactId}-size-${basePath.replace(/\W/g, "")}-${f.label.replace(/\s+/g, "-")}`;
                    const checked = selectedSizes.includes(f.label);
                    return (
                      <li key={f.label}>
                        <label
                          htmlFor={id}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-1 py-2 transition hover:bg-neutral-50"
                        >
                          <span className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                            <input
                              type="checkbox"
                              id={id}
                              checked={checked}
                              onChange={() => onToggleSize(f.label)}
                              className="peer sr-only"
                            />
                            <span
                              className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border transition peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37]/50 ${
                                checked
                                  ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                                  : "border-neutral-300 bg-white"
                              }`}
                              aria-hidden
                            >
                              {checked ? (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M2.5 6.2 4.8 8.5 9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : null}
                            </span>
                          </span>
                          <span className="text-sm text-neutral-700">
                            {f.label}{" "}
                            <span className="text-neutral-400">({f.count})</span>
                          </span>
                        </label>
                      </li>
                    );
                  })
                )}
              </ul>
            ) : null}
          </div>

          {/* Price accordion */}
          <div className="mt-3 rounded-xl border border-neutral-200/90 bg-white">
            <button
              type="button"
              onClick={() => setPriceOpen((o) => !o)}
              className="flex w-full items-center justify-between px-3.5 py-3 text-left"
              aria-expanded={priceOpen}
            >
              <span className="text-sm font-semibold text-neutral-900">Price Range</span>
              <ChevronUp
                className={`h-4 w-4 text-neutral-400 transition ${priceOpen ? "" : "rotate-180"}`}
              />
            </button>
            {priceOpen ? (
              <div className="border-t border-neutral-100 px-3.5 pb-4 pt-3">
                <DualPriceSlider
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onMinPriceChange={onMinPriceChange}
                  onMaxPriceChange={onMaxPriceChange}
                />
                <div className="mt-1 flex justify-between text-[11px] font-medium tabular-nums text-neutral-500">
                  <span>$0</span>
                  <span>$5000+</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <label className="sr-only" htmlFor={`${reactId}-min-input`}>
                    Minimum price
                  </label>
                  <div className="flex min-h-10 flex-1 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm tabular-nums text-neutral-800">
                    <span className="mr-1 text-neutral-400">$</span>
                    <input
                      id={`${reactId}-min-input`}
                      type="text"
                      inputMode="numeric"
                      value={minDisplay}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d]/g, "");
                        if (raw === "") {
                          onMinPriceChange(0);
                          return;
                        }
                        const n = Math.min(PRICE_MAX, Math.max(0, Number(raw)));
                        onMinPriceChange(Math.min(n, maxPrice));
                      }}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  <span className="text-neutral-300">–</span>
                  <label className="sr-only" htmlFor={`${reactId}-max-input`}>
                    Maximum price
                  </label>
                  <div className="flex min-h-10 flex-1 items-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-sm tabular-nums text-neutral-800">
                    <span className="mr-1 text-neutral-400">$</span>
                    <input
                      id={`${reactId}-max-input`}
                      type="text"
                      inputMode="numeric"
                      value={maxDisplay}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^\d+]/g, "").replace(/\+/g, "");
                        if (raw === "") {
                          onMaxPriceChange(PRICE_MAX);
                          return;
                        }
                        const n = Math.min(PRICE_MAX, Math.max(0, Number(raw)));
                        onMaxPriceChange(Math.max(n, minPrice));
                      }}
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-neutral-100 bg-white p-3 sm:p-4">
        <button
          type="button"
          onClick={onApply}
          className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          <FunnelIcon className="h-4 w-4 text-white" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

/**
 * Shared catalog filters & categories panel — desktop sticky card + mobile drawer shell.
 */
export function CatalogFiltersSidebar(props: CatalogFiltersSidebarProps) {
  const { mobileOpen = false, onMobileClose, variant = "desktop" } = props;

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen || !onMobileClose) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onMobileClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onMobileClose]);

  if (variant === "drawer") {
    return (
      <>
        <div
          className={`fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300 lg:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!mobileOpen}
          onClick={onMobileClose}
        />
        <aside
          className={`fixed inset-y-0 right-0 z-[70] flex w-[min(100vw,22rem)] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:w-[24rem] lg:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Filters and categories"
          aria-hidden={!mobileOpen}
        >
          <SidebarPanel {...props} showDrawerChrome onApply={onMobileClose} />
        </aside>
      </>
    );
  }

  return (
    <aside className="hidden w-full shrink-0 lg:sticky lg:top-24 lg:z-20 lg:flex lg:h-[calc(100dvh-5.5rem)] lg:max-h-[calc(100dvh-5.5rem)] lg:w-80 lg:flex-col lg:self-start xl:w-[22rem]">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)]">
        <SidebarPanel {...props} onApply={onMobileClose} />
      </div>
    </aside>
  );
}

export const CATALOG_PRICE_MAX = PRICE_MAX;
