"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/store/brand-logo";
import { useCart } from "@/components/store/cart-context";

type Me = { id: string; email: string; name: string; role: string };

type NavIcon = ({ className }: { className?: string }) => React.JSX.Element;

type NavItem = {
  href: string;
  label: string;
  icon: NavIcon;
  sub?: { href: string; label: string }[];
};

const nav: NavItem[] = [
  { href: "/account/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/account/orders", label: "My Orders", icon: IconOrders },
  {
    href: "/account/affiliate",
    label: "Affiliate",
    icon: IconAffiliate,
    sub: [
      { href: "/account/affiliate", label: "Overview" },
      { href: "/account/affiliate/withdrawals", label: "Withdrawal history" },
      { href: "/account/affiliate/commissions", label: "Commission history" },
    ],
  },
  { href: "/account/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/cart", label: "Shopping Cart", icon: IconCartNav },
  { href: "/account/profile", label: "Profile & Settings", icon: IconUser },
];

function IconDashboard({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function IconOrders({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
function IconHeart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
function IconCartNav({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function IconAffiliate({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "?") + (p[1]?.[0] ?? "")).toUpperCase();
}

function AccountSidebarLinks({
  pathname,
  onNavigate,
}: {
  pathname: string | null;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-1 p-1">
      {nav.map((item) => {
        const active =
          item.href === "/cart"
            ? pathname === "/cart"
            : pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;

        if (item.sub) {
          const inAffiliate = pathname?.startsWith("/account/affiliate") ?? false;
          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#b8962e]" : "text-neutral-500"}`} />
                {item.label}
              </Link>
              {inAffiliate ? (
                <ul className="ml-2 space-y-0.5 border-l-2 border-amber-200/60 py-0.5 pl-3">
                  {item.sub.map((s) => {
                    const subActive = pathname === s.href;
                    return (
                      <li key={s.href}>
                        <Link
                          href={s.href}
                          onClick={onNavigate}
                          className={`block rounded-lg py-1.5 pl-2 pr-2 text-xs font-medium transition ${
                            subActive ? "bg-amber-100/80 text-amber-950" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                          }`}
                        >
                          {s.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-amber-50 text-amber-950 ring-1 ring-amber-200/80" : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${active ? "text-[#b8962e]" : "text-neutral-500"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

const shellShadow = "shadow-[0_4px_24px_-6px_rgba(15,23,42,0.12)]";

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/auth/customer/me", { cache: "no-store" });
    if (!res.ok) {
      setMe(null);
      return;
    }
    setMe(await res.json());
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (me === null) {
      const next = encodeURIComponent(pathname ?? "/account/dashboard");
      router.replace(`/account/login?next=${next}`);
    }
  }, [me, pathname, router]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (sidebarOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  async function logout() {
    await fetch("/api/auth/customer/logout", { method: "POST" });
    router.push("/account/login");
    router.refresh();
  }

  if (me === null || me === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-neutral-500">
        {me === undefined ? "Loading…" : "Redirecting…"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="shrink-0 rounded-xl p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex min-w-0 items-center" title="Back to store home">
              <BrandLogo height={36} className="max-h-9 min-w-0" />
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <Link href="/products-catalog" className="text-sm font-medium text-neutral-600 hover:text-black">
              Shop
            </Link>
            <Link href="/cart" className="relative rounded-xl p-2 text-neutral-700 hover:bg-neutral-100">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h15l-1.5 9h-12z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {itemCount > 0 ? (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-bold text-black">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-1 pr-2 shadow-sm hover:bg-neutral-50 sm:pr-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-xs font-bold text-black sm:text-sm">
                  {initials(me.name)}
                </span>
                <span className="hidden max-w-[120px] truncate text-left text-sm font-medium text-neutral-800 md:max-w-[160px] lg:block">
                  {me.name}
                </span>
                <svg className="hidden h-4 w-4 text-neutral-500 lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen ? (
                <div className={`absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 bg-white py-1 ${shellShadow}`}>
                  <Link
                    href="/account/profile"
                    className="block px-4 py-2 text-sm hover:bg-neutral-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / tablet: floating drawer (not full viewport height rail) */}
      {sidebarOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-neutral-900/35 backdrop-blur-[2px] lg:hidden"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed left-3 top-17 z-50 flex max-h-[min(70vh,520px)] w-[min(calc(100vw-1.5rem),300px)] flex-col sm:left-4 lg:hidden">
            <div className={`flex max-h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/95 bg-white ${shellShadow}`}>
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <span className="text-sm font-semibold text-neutral-800">Account</span>
                <button
                  type="button"
                  className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"
                  aria-label="Close menu"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain py-2">
                <AccountSidebarLinks pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        </>
      ) : null}

      <div className="mx-auto max-w-[1600px] px-3 pb-10 pt-4 sm:px-5 sm:pt-5 lg:px-8 lg:pb-12 lg:pt-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
          {/* Desktop: compact floating sidebar card — height = content only, sticky */}
          <aside className="hidden shrink-0 lg:block lg:w-56 xl:w-64">
            <div
              className={`sticky top-24 rounded-2xl border border-neutral-200/90 bg-white p-2 ${shellShadow}`}
            >
              <AccountSidebarLinks pathname={pathname} />
            </div>
          </aside>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
