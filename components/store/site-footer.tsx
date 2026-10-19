"use client";

import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/store/brand-logo";
import { BusinessAddress } from "@/components/store/business-address";
import { LinktreeLinks } from "@/components/store/linktree-links";
import { NewsletterForm } from "@/components/store/newsletter-form";
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
  { href: "/account/dashboard", label: "My account" },
  { href: "/account/orders", label: "Orders & tracking" },
  { href: "/contact-us", label: "COA / batch docs" },
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
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              href={item.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
            >
              {item.label}
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
    <footer className="relative overflow-hidden bg-neutral-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 0% 0%, rgba(212,175,55,0.14), transparent 55%), radial-gradient(ellipse 50% 35% at 100% 100%, rgba(212,175,55,0.08), transparent 50%)",
        }}
      />

      <div className="relative border-t-2 border-[#D4AF37]">
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

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Link href="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950">
                <BrandLogo height={40} className="max-h-10" />
              </Link>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">{SITE_BUSINESS_TAGLINE}</p>
              <div className="mt-6 border-l-2 border-[#D4AF37]/50 pl-4">
                <BusinessAddress variant="footer" />
              </div>
              {/* <div className="mt-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Social &amp; links</p>
                <LinktreeLinks variant="footer" />
              </div> */}
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6 lg:col-span-7 lg:gap-8">
              <FooterNavColumn title="Catalog" links={catalogLinks} />
              <FooterNavColumn title="Company" links={companyLinks} />
              <div className="col-span-2 sm:col-span-1">
                <FooterNavColumn title="Legal" links={legalLinks} />
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-6 rounded-xl border border-[#D4AF37]/25 bg-gradient-to-br from-[#D4AF37]/10 via-white/[0.03] to-transparent p-6 sm:mt-14 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Stay informed</p>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-white sm:text-xl">
                Research updates for your inbox
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">
                Catalog notices and fulfillment updates for qualified laboratories—no clinical or dosing content.
              </p>
            </div>
            <div>
              <NewsletterForm />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-8 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="space-y-1.5">
              <p className="text-sm text-white/50">
                © {year}{" "}
                <span className="font-semibold text-white/85">{SITE_BRAND_NAME}</span>
                . All rights reserved.
              </p>
              <p className="text-xs text-white/35">
                Products are for laboratory research by qualified professionals only.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Payments</span>
              {paymentMethods.map((method) => (
                <span
                  key={method.src}
                  className="inline-flex items-center justify-center overflow-hidden rounded border border-white/15 bg-white p-0.5 shadow-sm"
                >
                  <Image
                    src={method.src}
                    alt={method.alt}
                    width={method.width}
                    height={method.height}
                    className="h-[28px] w-auto object-contain"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
