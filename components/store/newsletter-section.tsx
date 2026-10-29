"use client";

import { useState } from "react";
import { useToast } from "@/components/store/toast-context";
import {
  SITE_ADDRESS_LINE1,
  SITE_ADDRESS_LINE2,
  SITE_BRAND_NAME,
  SITE_LEGAL_NAME,
  SITE_SUPPORT_EMAIL,
  SITE_SUPPORT_PHONE,
  siteSupportPhoneTelHref,
} from "@/lib/site-business";

export function NewsletterSection() {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(SITE_SUPPORT_EMAIL);
      setCopied(true);
      showToast("Support email copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean || !clean.includes("@")) {
      showToast("Please enter a valid laboratory or professional email.", "error");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      showToast("Thank you for joining our research community. You're now subscribed!", "success");
    }, 800);
  };

  const handleReset = () => {
    setStatus("idle");
    setEmail("");
  };

  return (
    <section
      aria-label="Corporate details and research newsletter"
      className="relative w-full max-w-full bg-transparent px-3.5 py-6 sm:px-6 sm:py-8 lg:px-8 mb-6 sm:mb-10"
    >
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D4AF37]/45 bg-neutral-950/95 p-4 min-[380px]:p-5 sm:p-8 lg:p-9 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur-md">
        {/* Ambient subtle corner gold glows */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-20 blur-3xl"
          style={{ background: "#D4AF37" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full opacity-15 blur-3xl"
          style={{ background: "#D4AF37" }}
          aria-hidden
        />

        <div className="relative z-10 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* LEFT COLUMN: Corporate Identity, Facility Address & Contact */}
          <div className="lg:col-span-5 lg:border-r lg:border-white/10 lg:pr-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-wide text-white">
                    {SITE_BRAND_NAME}
                  </span>
                  <span className="inline-block h-2 w-2 rounded-full bg-[#D4AF37]" />
                </div>
                <p className="text-xs font-semibold text-neutral-200 mt-0.5">
                  {SITE_LEGAL_NAME}
                </p>
              </div>

              {/* Verified U.S. Lab Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D4AF37] shadow-sm">
                <span>✓</span> Verified U.S. Lab
              </span>
            </div>

            <address className="mt-3.5 space-y-3 not-italic text-sm">
              {/* Physical Address with Google Maps link */}
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(`${SITE_ADDRESS_LINE1}, ${SITE_ADDRESS_LINE2}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group/map flex items-start gap-2.5 text-neutral-100 transition hover:text-white"
                title="View facility on Google Maps"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37] transition group-hover/map:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <div className="leading-snug min-w-0">
                  <span className="block font-semibold text-white">{SITE_ADDRESS_LINE1}</span>
                  <span className="block text-neutral-200">{SITE_ADDRESS_LINE2}</span>
                </div>
              </a>

              {/* Support Email with Responsive Wrap for Copy button on narrow screens */}
              <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-2 pt-2 border-t border-white/10">
                <a
                  href={`mailto:${SITE_SUPPORT_EMAIL}`}
                  className="group/mail flex items-center gap-2 font-bold text-[#D4AF37] transition hover:text-[#f3e5ab] text-xs min-[360px]:text-sm min-w-0 max-w-full"
                >
                  <svg
                    className="h-4 w-4 shrink-0 text-[#D4AF37] transition group-hover/mail:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{SITE_SUPPORT_EMAIL}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex self-start min-[420px]:self-auto shrink-0 items-center gap-1.5 rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#D4AF37]/30 hover:border-[#D4AF37] active:scale-95"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Optional Phone */}
              {SITE_SUPPORT_PHONE ? (
                <div className="flex items-center gap-2 pt-0.5">
                  <svg className="h-4 w-4 shrink-0 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a
                    href={`tel:${siteSupportPhoneTelHref()}`}
                    className="font-semibold text-neutral-100 hover:text-white transition text-xs sm:text-sm"
                  >
                    {SITE_SUPPORT_PHONE}
                  </a>
                </div>
              ) : null}
            </address>
          </div>

          {/* RIGHT COLUMN: Compact Newsletter & Research Updates */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              Join the Newsletter · Stay Informed
            </div>

            <h3 className="mt-2 font-serif text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
              Analytical Batch Notices &amp; Catalog Restocks
            </h3>

            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-200">
              Receive lot-specific HPLC verification releases, newly synthesized compound alerts, and technical R&amp;D documentation.
            </p>

            {/* Feature chips - hidden on screens less than 450px */}
            <div className="mt-2.5 hidden min-[450px]:flex flex-wrap gap-2 text-[11px] font-semibold text-neutral-100">
              <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5">
                <span className="text-[#D4AF37] font-bold">✓</span> HPLC Verified
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5">
                <span className="text-[#D4AF37] font-bold">✓</span> Lot Restock Alerts
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5">
                <span className="text-[#D4AF37] font-bold">✓</span> 1-Click Unsubscribe
              </span>
            </div>

            {/* Subscription Form / Success confirmation */}
            <div className="mt-3.5">
              {status === "success" ? (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/60 p-4 text-center backdrop-blur-md">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Subscription Confirmed!</span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-emerald-200">
                    You are now subscribed to SQSpeptides analytical releases. Check your inbox for verification.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 text-xs font-bold text-[#D4AF37] hover:underline"
                  >
                    Register another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <div className="relative w-full flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#D4AF37]">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter laboratory or research email"
                      disabled={status === "submitting"}
                      className="w-full min-h-[44px] rounded-xl border-2 border-[#D4AF37]/50 bg-neutral-900 py-2.5 pl-10 pr-3.5 text-xs sm:text-sm font-medium text-white placeholder:text-neutral-400 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/40 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full sm:w-auto min-h-[44px] shrink-0 flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-black shadow-md transition duration-200 hover:bg-[#e5c34d] hover:shadow-[0_0_16px_rgba(212,175,55,0.4)] active:scale-[0.99] disabled:opacity-60"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black border-r-transparent" />
                        <span>Subscribing…</span>
                      </>
                    ) : (
                      <>
                        <span>Join Newsletter</span>
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
