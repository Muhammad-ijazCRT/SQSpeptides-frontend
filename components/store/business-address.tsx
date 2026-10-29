"use client";

import { useState } from "react";
import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SITE_SUPPORT_EMAIL,
  SITE_SUPPORT_PHONE,
  siteSupportPhoneTelHref,
} from "@/lib/site-business";

type Variant = "footer" | "inline";

export function BusinessAddress({
  variant = "inline",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(SITE_SUPPORT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "footer") {
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_8px_30px_rgba(212,175,55,0.1)] ${className}`}
      >
        {/* Subtle accent corner glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl"
          style={{ background: "#D4AF37" }}
          aria-hidden
        />

        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif text-base font-bold text-white tracking-wide">
                {SITE_BRAND_NAME}
              </span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
            </div>
            <p className="text-xs font-medium text-white/55">{SITE_LEGAL_NAME}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
            <span className="text-[11px]">✓</span> Verified U.S. Lab
          </span>
        </div>

        <address className="mt-3.5 space-y-2.5 not-italic text-xs sm:text-sm">
          {/* Physical Address with Google Maps link */}
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${SITE_ADDRESS_LINE1}, ${SITE_ADDRESS_LINE2}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/map flex items-start gap-2.5 text-white/75 transition hover:text-white"
            title="View on Google Maps"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37] transition group-hover/map:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <div className="leading-snug">
              <span className="block font-medium">{SITE_ADDRESS_LINE1}</span>
              <span className="block text-white/60">{SITE_ADDRESS_LINE2}</span>
            </div>
          </a>

          {/* Direct Support Email with 1-click Copy */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
            <a
              href={`mailto:${SITE_SUPPORT_EMAIL}`}
              className="group/mail flex items-center gap-2.5 font-medium text-[#D4AF37] transition hover:text-[#e5c34d]"
            >
              <svg
                className="h-4 w-4 shrink-0 text-[#D4AF37] transition group-hover/mail:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{SITE_SUPPORT_EMAIL}</span>
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
              title="Copy email address"
            >
              {copied ? (
                <>
                  <span className="text-emerald-400">✓</span>
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Support Phone if set */}
          {SITE_SUPPORT_PHONE ? (
            <div className="flex items-center gap-2.5 pt-1">
              <svg className="h-4 w-4 shrink-0 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a
                href={`tel:${siteSupportPhoneTelHref()}`}
                className="font-medium text-white/80 transition hover:text-white"
              >
                {SITE_SUPPORT_PHONE}
              </a>
            </div>
          ) : null}
        </address>
      </div>
    );
  }

  // Inline variant
  return (
    <address className={`not-italic ${className}`}>
      <p className="text-sm font-semibold text-black">{SITE_BRAND_NAME}</p>
      <p className="text-xs text-neutral-600">{SITE_LEGAL_NAME}</p>
      <p className="mt-2 text-sm text-neutral-600">{SITE_ADDRESS_LINE1}</p>
      <p className="text-sm text-neutral-600">{SITE_ADDRESS_LINE2}</p>
      <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="mt-2 inline-block text-sm font-medium text-[#b8962e] hover:underline">
        {SITE_SUPPORT_EMAIL}
      </a>
      {SITE_SUPPORT_PHONE ? (
        <a href={`tel:${siteSupportPhoneTelHref()}`} className="mt-1 block text-sm font-medium text-[#b8962e] hover:underline">
          {SITE_SUPPORT_PHONE}
        </a>
      ) : null}
    </address>
  );
}
