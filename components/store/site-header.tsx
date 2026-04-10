"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { SiteHeaderSearchSync } from "@/components/store/site-header-search-sync";
import { BrandLogo } from "@/components/store/brand-logo";
import { useCart } from "@/components/store/cart-context";
import {
  SITE_ADDRESS_SINGLE_LINE,
  SITE_SUPPORT_EMAIL,
  SITE_SUPPORT_PHONE,
  siteSupportPhoneTelHref,
} from "@/lib/site-business";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/products-catalog", label: "Product Catalog" },
  { href: "/popular-peptides", label: "Popular Peptides" },
  { href: "/lab-calculator", label: "Lab Calculator" },
  { href: "/apply-wholesale", label: "Apply for Wholesale" },
  { href: "/#become-affiliate", label: "Become an Affiliate" },
  { href: "/contact-us", label: "Contact Us" },
];

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative whitespace-nowrap py-1 text-sm font-medium text-black transition-colors hover:text-[#b8962e] ${
        active ? "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[#D4AF37]" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [customerAuthed, setCustomerAuthed] = useState<boolean | null>(null);

  const applyUrlQueryToDraft = useCallback((q: string) => {
    setSearchDraft(q);
  }, []);

  function submitHeaderSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchDraft.trim();
    setSearchOpen(false);
    router.push(q ? `/products-catalog?q=${encodeURIComponent(q)}` : "/products-catalog");
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/customer/me", { cache: "no-store" });
      if (!cancelled) setCustomerAuthed(res.ok);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/popular-peptides") return pathname === "/popular-peptides";
    if (href === "/lab-calculator") return pathname === "/lab-calculator";
    if (href.startsWith("/products-catalog"))
      return pathname === "/products-catalog" || pathname.startsWith("/products-catalog/");
    if (href === "/contact-us") return pathname === "/contact-us";
    if (href === "/about-us") return pathname === "/about-us";
    if (href === "/apply-wholesale") return pathname === "/apply-wholesale";
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div
        className="bg-black px-3 py-2 text-center text-[11px] font-semibold leading-snug text-white sm:text-xs sm:leading-normal"
        role="status"
        aria-live="polite"
      >
        <span className="inline-flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
          <span aria-hidden className="text-amber-400">
            ⚠
          </span>
          <span>Warning For Research Purposes Only / Not For Human Consumption Warning</span>
          <span aria-hidden className="text-amber-400">
            ⚠
          </span>
        </span>
      </div>

      <div className="border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-center text-[10px] leading-snug text-neutral-700 sm:text-xs">
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-x-4">
          <span className="font-medium text-neutral-800">{SITE_ADDRESS_SINGLE_LINE}</span>
          <span className="hidden text-neutral-300 sm:inline" aria-hidden>
            |
          </span>
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-[#b8962e] hover:underline">
            {SITE_SUPPORT_EMAIL}
          </a>
          {SITE_SUPPORT_PHONE ? (
            <>
              <span className="hidden text-neutral-300 sm:inline" aria-hidden>
                |
              </span>
              <a href={`tel:${siteSupportPhoneTelHref()}`} className="font-semibold text-neutral-900 hover:underline">
                {SITE_SUPPORT_PHONE}
              </a>
            </>
          ) : null}
        </span>
      </div>

      <div className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center">
            <BrandLogo height={40} className="max-h-10 sm:max-h-11" />
          </Link>

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-7 2xl:gap-8">
            {nav.map((item) => (
              <NavLink
                key={item.href + item.label}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-md p-2 text-black hover:bg-neutral-100"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href="/cart"
              className="relative rounded-md p-2 text-black hover:bg-neutral-100"
              aria-label="Cart"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h15l-1.5 9h-12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            {customerAuthed === null ? (
              <span
                className="ml-1 hidden h-9 w-[5.5rem] animate-pulse rounded-md bg-neutral-200 sm:inline-block"
                aria-hidden
              />
            ) : (
              <Link
                href={customerAuthed ? "/account/dashboard" : "/account/login"}
                className="ml-1 hidden rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 sm:inline"
              >
                {customerAuthed ? "Dashboard" : "Login"}
              </Link>
            )}
            <button
              type="button"
              className="lg:hidden rounded-md p-2 text-black hover:bg-neutral-100"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50/80 px-4 py-4 lg:px-8">
            <Suspense fallback={null}>
              <SiteHeaderSearchSync onQuery={applyUrlQueryToDraft} />
            </Suspense>
            <form
              onSubmit={submitHeaderSearch}
              className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end"
              role="search"
            >
              <div className="min-w-0 flex-1">
                <label htmlFor="site-header-search" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Search catalog
                </label>
                <input
                  id="site-header-search"
                  type="search"
                  name="q"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  placeholder="Product name, keyword, or SKU…"
                  autoComplete="off"
                  className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-neutral-400 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
                <p className="mt-1.5 text-xs text-neutral-500">Results open on the product catalog page.</p>
              </div>
              <div className="flex shrink-0 gap-2 sm:pb-0.5">
                <button
                  type="submit"
                  className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchDraft("");
                    setSearchOpen(false);
                    router.push("/products-catalog");
                  }}
                  className="rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  View all
                </button>
              </div>
            </form>
          </div>
        )}

        {open && (
          <nav className="flex flex-col gap-1 border-t border-neutral-200 bg-white px-4 py-4 lg:hidden">
            {nav.map((item) => (
              <NavLink
                key={item.href + item.label}
                href={item.href}
                label={item.label}
                active={isActive(item.href)}
                onNavigate={() => setOpen(false)}
              />
            ))}
            {customerAuthed === null ? (
              <span className="mt-2 block h-10 w-full animate-pulse rounded-md bg-neutral-200 sm:hidden" aria-hidden />
            ) : (
              <Link
                href={customerAuthed ? "/account/dashboard" : "/account/login"}
                className="mt-2 flex w-full items-center justify-center rounded-md bg-black py-2.5 text-sm font-semibold text-white sm:hidden"
              >
                {customerAuthed ? "Dashboard" : "Login"}
              </Link>
            )}
            <Link
              href="/onramp"
              className="py-2 text-sm text-neutral-500"
              onClick={() => setOpen(false)}
            >
              Crypto onramp (direct)
            </Link>
          </nav>
        )}
      </div>

      <div className="overflow-hidden bg-[#c9a227] py-2 text-[11px] font-semibold uppercase tracking-wide text-white sm:text-xs">
        <div
          className="flex w-max px-4"
          style={{ animation: "marquee 35s linear infinite" }}
        >
          <span className="flex shrink-0 items-center gap-4 pr-8">
            <span>NOT FOR HUMAN OR VETERINARY USE — FOR LABORATORY RESEARCH ONLY</span>
            <span className="text-[#ffb020]" aria-hidden>
              ▶
            </span>
            <span>RESEARCH CATALOG OFFER IS ACTIVE!</span>
            <span className="text-[#ffb020]" aria-hidden>
              ▶
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-4 pr-8" aria-hidden>
            <span>NOT FOR HUMAN OR VETERINARY USE — FOR LABORATORY RESEARCH ONLY</span>
            <span className="text-[#ffb020]">▶</span>
            <span>RESEARCH CATALOG OFFER IS ACTIVE!</span>
            <span className="text-[#ffb020]">▶</span>
          </span>
        </div>
      </div>
    </header>
  );
}
