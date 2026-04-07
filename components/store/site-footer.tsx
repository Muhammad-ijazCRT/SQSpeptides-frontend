"use client";

import Link from "next/link";
import { BrandWordmark } from "@/components/store/brand-wordmark";
import { LinktreeLinks } from "@/components/store/linktree-links";
import { MolecularLogo } from "@/components/store/molecular-logo";
import { NewsletterForm } from "@/components/store/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MolecularLogo size={32} />
              <BrandWordmark variant="onDark" className="text-lg" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Advanced chemical research solutions for the modern laboratory environment.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="text-white/70 hover:text-[#D4AF37]" aria-label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-white/70 hover:text-[#D4AF37]" aria-label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">Link in bio</p>
            <LinktreeLinks variant="footer" />
          </div>

          <div>
            <h3 className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">Catalog</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/products-catalog" className="hover:text-white">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/popular-peptides" className="hover:text-white">
                  Popular Peptides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#D4AF37] text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/account/dashboard" className="hover:text-white">
                  My account
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  CoA Lookup
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Request Testing Reports
                </a>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-bold leading-snug text-white mb-4 normal-case tracking-normal">
              Privacy isn&apos;t just a feature for us it&apos;s a promise.
            </h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between text-sm text-white/50">
          <p className="flex flex-wrap items-center gap-1.5 text-white/50">
            <span>© {new Date().getFullYear()}</span>
            <a
              href="https://dowhf.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 underline decoration-white/30 underline-offset-2 transition hover:text-[#D4AF37] hover:decoration-[#D4AF37]"
            >
              SQSpeptides
            </a>
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
