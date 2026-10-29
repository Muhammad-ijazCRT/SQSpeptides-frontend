"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/store/brand-logo";
import { BackToTop } from "@/components/store/back-to-top";
import { NewsletterSection } from "@/components/store/newsletter-section";
import { SITE_BRAND_NAME, SITE_BUSINESS_TAGLINE } from "@/lib/site-business";

const paymentMethods = [
  { src: "/payments/visa.svg", alt: "Visa", width: 52, height: 33 },
  { src: "/payments/mastercard.svg", alt: "Mastercard", width: 52, height: 33 },
  { src: "/payments/amex.svg", alt: "American Express", width: 52, height: 33 },
] as const;

const catalogLinks = [
  { href: "/products-catalog", label: "Shop all" },
  { href: "/popular-peptides", label: "Popular peptides" },
  { href: "/apply-wholesale", label: "Wholesale inquiry" },
  { href: "/#become-affiliate", label: "Affiliate program" },
] as const;

const companyLinks = [
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact us" },
  { href: "/account/orders", label: "Orders & tracking" },
  { href: "/coa", label: "COA / batch docs" },
] as const;

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/refund-policy", label: "Refund policy" },
  { href: "/shipping-policy", label: "Shipping policy" },
] as const;

function FooterNavColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              href={item.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-neutral-100 transition-all duration-200 hover:text-white"
            >
              <span className="text-[#D4AF37] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                ›
              </span>
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* 1. COMBINED PRE-FOOTER SECTION (Corporate Info + Compact Newsletter) */}
      <NewsletterSection />

      {/* 2. THE MAIN STORE FOOTER WITH FLOATING COLORS LIKE THE HOME HERO */}
      <footer className="relative w-full max-w-full overflow-hidden bg-black text-white">
        {/* Ambient radial color gradients matching homepage hero */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-90"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(212,175,55,0.32), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(212,175,55,0.18), transparent), radial-gradient(ellipse 50% 50% at 0% 80%, rgba(212,175,55,0.14), transparent)",
          }}
        />

        {/* Floating animated ambient color orbs like hero section */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 z-0 h-96 w-96 rounded-full bg-[#D4AF37]/20 blur-3xl footer-float-orb-1"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-28 -right-28 z-0 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl footer-float-orb-2"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 z-0 h-72 w-72 -translate-y-1/2 rounded-full bg-[#e5c34d]/10 blur-3xl footer-float-orb-3"
          aria-hidden
        />

        {/* Hero subtle fractal noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.06%22/%3E%3C/svg%3E')]"
          aria-hidden
        />

        {/* Top Gold Border & Content Container */}
        <div className="relative z-10 border-t-2 border-[#D4AF37]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-12">
              {/* Brand and Value Highlights */}
              <div className="lg:col-span-5">
                <Link
                  href="/"
                  className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <BrandLogo height={42} className="max-h-11" />
                </Link>
                <p className="mt-3.5 max-w-md text-sm font-medium leading-relaxed text-neutral-100">
                  {SITE_BUSINESS_TAGLINE}
                </p>

                {/* Laboratory Standards Pill Badges */}
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-neutral-100">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3 py-1 text-white">
                    <span className="text-[#D4AF37] font-bold">✓</span> Documented Lot Purity
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3 py-1 text-white">
                    <span className="text-[#D4AF37] font-bold">✓</span> Fast U.S. Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 px-3 py-1 text-white">
                    <span className="text-[#D4AF37] font-bold">✓</span> Research Traceability
                  </span>
                </div>
              </div>

              {/* Navigation Link Columns */}
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-8 lg:col-span-7 lg:gap-10">
                <FooterNavColumn title="Catalog" links={catalogLinks} />
                <FooterNavColumn title="Company" links={companyLinks} />
                <div className="col-span-2 sm:col-span-1">
                  <FooterNavColumn title="Legal & Policy" links={legalLinks} />
                </div>
              </div>
            </div>

            {/* Bottom Copyright & Payment Badges */}
            <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-neutral-100">
                  © {year} <span className="font-bold text-white">{SITE_BRAND_NAME}</span>. All rights reserved.
                </p>
                <p className="text-xs font-normal text-neutral-300">
                  All compounds are supplied exclusively for qualified laboratory research. Not for human or veterinary use.
                </p>
              </div>

              {/* Yellow/Gold-Bordered Payment Method Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#D4AF37]">
                  Payments
                </span>
                <div className="flex items-center gap-2">
                  {paymentMethods.map((method) => (
                    <span
                      key={method.src}
                      className="inline-flex items-center justify-center overflow-hidden rounded-lg border-2 border-[#D4AF37] bg-white p-1 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                      title={method.alt}
                    >
                      <Image
                        src={method.src}
                        alt={method.alt}
                        width={method.width}
                        height={method.height}
                        className="h-[24px] w-auto object-contain"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* 3. FIXED CIRCULAR BACK TO TOP BUTTON (Appears when scrolled > 110% viewport height) */}
      <BackToTop />
    </>
  );
}
