"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SUBNAV = [
  { href: "/account/affiliate", label: "Overview", exact: true },
  { href: "/account/affiliate/withdrawals", label: "Withdrawal history", exact: false },
  { href: "/account/affiliate/commissions", label: "Commission history", exact: false },
] as const;

export function AffiliatePortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 via-white to-neutral-50 p-6 shadow-[0_4px_24px_-8px_rgba(180,140,40,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#D4AF37]/15 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-10 left-1/4 h-24 w-24 rounded-full bg-amber-200/20 blur-xl" aria-hidden />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-900/70">Earn &amp; share</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Affiliate program</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            Share your referral link, earn commission on qualifying orders, use your balance at checkout, and request crypto
            withdrawals when you are ready.
          </p>
        </div>

        <nav
          className="relative mt-6 flex flex-wrap gap-2 border-t border-amber-200/50 pt-6"
          aria-label="Affiliate sections"
        >
          {SUBNAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/15"
                    : "bg-white/80 text-neutral-700 ring-1 ring-neutral-200/80 hover:bg-white hover:ring-amber-300/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {children}
    </div>
  );
}
