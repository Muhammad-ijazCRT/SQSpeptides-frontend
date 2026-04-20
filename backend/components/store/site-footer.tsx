"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/store/brand-logo";
import { BusinessAddress } from "@/components/store/business-address";
import { LinktreeLinks } from "@/components/store/linktree-links";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { SITE_BUSINESS_TAGLINE } from "@/lib/site-business";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <BrandLogo height={36} className="max-h-9" />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/60">{SITE_BUSINESS_TAGLINE}</p>
            <BusinessAddress variant="footer" className="mb-6" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Social &amp; links</p>
            <LinktreeLinks variant="footer" />
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">Catalog</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/products-catalog" className="hover:text-white">
                  Shop all
                </Link>
              </li>
              <li>
                <Link href="/popular-peptides" className="hover:text-white">
                  Popular peptides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">Company &amp; support</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/about-us" className="hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/account/dashboard" className="hover:text-white">
                  My account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white">
                  Orders &amp; tracking
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  COA / batch documentation
                </Link>
              </li>
            </ul>
            <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-[#D4AF37]">Legal</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Terms &amp; conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white">
                  Refund policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white">
                  Shipping policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-bold leading-snug tracking-normal text-white normal-case">
              Privacy isn&apos;t just a feature for us—it&apos;s a promise.
            </h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-1.5 text-white/50">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-semibold text-white/80">SQSpeptides</span>
            <span>. All rights reserved.</span>
          </p>
          <div className="flex flex-wrap gap-2 opacity-70">
            <span className="rounded border border-white/20 px-2 py-0.5 text-xs">VISA</span>
            <span className="rounded border border-white/20 px-2 py-0.5 text-xs">MC</span>
            <span className="rounded border border-white/20 px-2 py-0.5 text-xs">AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
