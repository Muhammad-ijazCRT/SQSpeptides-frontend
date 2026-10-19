"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  COA_CERTIFICATES,
  COA_FEATURES,
  COA_PROCESS_STEPS,
  type CoaCertificate,
} from "@/lib/store/coa-data";
import { SITE_BRAND_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
];

function sortCertificates(list: CoaCertificate[], sort: SortOption): CoaCertificate[] {
  const next = [...list];
  switch (sort) {
    case "oldest":
      return next.sort((a, b) => a.testedIso.localeCompare(b.testedIso));
    case "name-asc":
      return next.sort((a, b) => a.productName.localeCompare(b.productName));
    case "name-desc":
      return next.sort((a, b) => b.productName.localeCompare(a.productName));
    case "newest":
    default:
      return next.sort((a, b) => b.testedIso.localeCompare(a.testedIso));
  }
}

export function CoaContent() {
  const [sort, setSort] = useState<SortOption>("newest");
  const certificates = sortCertificates(COA_CERTIFICATES, sort);

  return (
    <div className="bg-white text-neutral-950">
      {/* Hero — same framing language as Contact / About */}
      <section className="relative isolate w-full overflow-hidden bg-[#faf8f4]">
        <div className="relative aspect-[5/4] w-full sm:aspect-[16/9] md:aspect-[2.35/1] lg:aspect-[2.5/1]">
          <Image
            src="/about-us.png"
            alt="SQSpeptides laboratory documentation and research materials"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[72%_48%] sm:object-[68%_45%] md:object-[62%_42%] lg:object-[58%_40%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/85 via-white/40 to-transparent max-sm:from-white/94 max-sm:via-white/65 sm:from-white/60 sm:via-white/18 md:from-white/40 md:via-transparent"
          />
          <div className="absolute inset-0 z-10">
            <div className="mx-auto flex h-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-10">
              <div className="w-full max-w-[17.5rem] sm:max-w-sm md:max-w-md lg:max-w-lg">
                <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#C5A02B] sm:text-[11px] md:text-xs md:tracking-[0.38em]">
                  Quality documentation
                </p>
                <h1 className="mt-2 text-[1.85rem] font-bold leading-[1.05] tracking-tight text-neutral-950 sm:mt-3 sm:text-4xl md:text-[2.85rem] lg:text-[3.4rem]">
                  Certificates of <span className="text-[#C5A02B]">Analysis</span>
                </h1>
                <p className="mt-3 max-w-md text-[13px] leading-relaxed text-neutral-600 sm:mt-4 sm:text-[15px] md:text-base lg:text-lg">
                  Browse batch-level COAs for research peptides — verified purity, lot traceability, and transparent lab
                  documentation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate library */}
      <section className="bg-white text-neutral-950" aria-labelledby="coa-library-heading">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                Batch library
              </p>
              <h2 id="coa-library-heading" className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                <span className="text-[#C5A02B]">{certificates.length}</span> Certificates Found
              </h2>
            </div>

            <label className="flex items-center gap-2.5 self-start sm:self-auto">
              <span className="text-sm text-neutral-500">Sort by:</span>
              <span className="relative inline-flex">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-black/[0.1] bg-white py-2.5 pl-3.5 pr-10 text-sm font-medium text-neutral-950 outline-none transition hover:border-[#C5A02B]/50 focus:border-[#C5A02B] focus:ring-2 focus:ring-[#C5A02B]/25"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400" aria-hidden>
                  <ChevronDownIcon />
                </span>
              </span>
            </label>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {certificates.map((cert) => (
              <CoaCard key={cert.id} certificate={cert} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-y border-black/[0.04] bg-[#faf8f4]">
        <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {COA_FEATURES.map((feature) => (
              <article key={feature.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#C5A02B]/35 bg-[#C5A02B]/10 text-[#C5A02B]">
                  <FeatureIcon name={feature.icon} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="text-base font-bold tracking-tight text-neutral-950">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation process */}
      <section className="relative overflow-hidden bg-white" aria-labelledby="coa-process-heading">
        <div
          className="pointer-events-none absolute -right-16 bottom-0 top-0 w-1/2 opacity-[0.06] max-lg:hidden"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 30% 40%, #C5A02B 1px, transparent 1.5px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#C5A02B] sm:text-[11px]">
                How it works
              </p>
              <h2 id="coa-process-heading" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Our Documentation Process
              </h2>
              <span className="mt-3 block h-1 w-14 rounded-full bg-[#C5A02B]" aria-hidden />
              <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">
                Every batch is evaluated through independent laboratory analysis. Results are reviewed for accuracy before
                certificates are published in this library for research traceability.
              </p>
              <p className="mt-4 text-sm text-neutral-500">
                Need a report that isn&apos;t listed?{" "}
                <a
                  href={`mailto:${SITE_SUPPORT_EMAIL}?subject=${encodeURIComponent(`${SITE_BRAND_NAME} COA request`)}`}
                  className="font-semibold text-[#C5A02B] transition hover:text-[#8E701D] hover:underline"
                >
                  Email support
                </a>{" "}
                with your order number, SKU, and batch ID.
              </p>
            </div>

            <div className="lg:col-span-8">
              <ol className="grid gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-6">
                {COA_PROCESS_STEPS.map((step, index) => (
                  <li key={step.step} className="relative flex flex-col items-center text-center sm:items-stretch sm:text-left">
                    {index < COA_PROCESS_STEPS.length - 1 ? (
                      <span
                        className="pointer-events-none absolute left-[calc(50%+2.5rem)] top-10 hidden h-px w-[calc(100%-3rem)] border-t border-dashed border-[#C5A02B]/45 sm:block"
                        aria-hidden
                      />
                    ) : null}

                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#C5A02B]/30 bg-[#faf8f4] text-[#C5A02B] sm:mx-0">
                      <ProcessIcon name={step.icon} />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A02B] text-[11px] font-bold text-white shadow-sm">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold tracking-tight text-neutral-950">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-black/[0.06] bg-[#faf8f4] p-6 sm:mt-14 sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="text-base font-bold tracking-tight text-neutral-950 sm:text-lg">
                Looking for a specific batch?
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Contact us with your order details and we&apos;ll send available documentation.
              </p>
            </div>
            <Link
              href="/contact-us"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C5A02B] px-6 text-sm font-bold text-white transition hover:bg-[#8E701D]"
            >
              Contact support
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CoaCard({ certificate }: { certificate: CoaCertificate }) {
  const contactHref = `/contact-us?subject=${encodeURIComponent(`COA request: ${certificate.productName} (${certificate.batch})`)}`;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-4 text-neutral-950 shadow-[0_10px_36px_-16px_rgba(0,0,0,0.16)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight">{certificate.productName}</h3>
          <p className="mt-0.5 text-sm font-semibold text-neutral-500">{certificate.strength}</p>
        </div>
        {certificate.verified ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
            <CheckIcon />
            Verified
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-3.5">
        <div className="relative h-[4.5rem] w-[3.4rem] shrink-0 overflow-hidden rounded-lg border border-black/[0.08] bg-[#f5f0e6]">
          <Image
            src={certificate.imageSrc}
            alt={`${certificate.productName} certificate preview`}
            fill
            unoptimized
            sizes="54px"
            className="object-cover object-center"
          />
        </div>
        <dl className="min-w-0 flex-1 space-y-1.5 text-sm">
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="font-semibold text-neutral-800">Batch:</dt>
            <dd className="text-neutral-500">{certificate.batch}</dd>
          </div>
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="font-semibold text-neutral-800">Lot:</dt>
            <dd className="text-neutral-500">{certificate.lot}</dd>
          </div>
          <div className="flex flex-wrap gap-x-1.5">
            <dt className="font-semibold text-neutral-800">Tested:</dt>
            <dd className="text-neutral-500">{certificate.tested}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Link
          href={contactHref}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#C5A02B] px-2 text-xs font-bold text-white transition hover:bg-[#8E701D] sm:text-[13px]"
        >
          <EyeIcon />
          View COA
        </Link>
        <Link
          href={contactHref}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-neutral-300 bg-white px-2 text-xs font-bold text-neutral-900 transition hover:border-[#C5A02B]/50 hover:bg-[#faf8f4] sm:text-[13px]"
        >
          <DownloadIcon />
          Download PDF
        </Link>
      </div>
    </article>
  );
}

function FeatureIcon({ name }: { name: (typeof COA_FEATURES)[number]["icon"] }) {
  switch (name) {
    case "shield":
      return <ShieldIcon />;
    case "search":
      return <SearchIcon />;
    case "docs":
      return <DocIcon />;
  }
}

function ProcessIcon({ name }: { name: (typeof COA_PROCESS_STEPS)[number]["icon"] }) {
  switch (name) {
    case "testing":
      return <VialIcon />;
    case "verify":
      return <SearchDocIcon />;
    case "publish":
      return <FolderIcon />;
  }
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 3 4.5 6.5v5.2c0 4.6 3.2 8.7 7.5 9.8 4.3-1.1 7.5-5.2 7.5-9.8V6.5L12 3Z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </svg>
  );
}

function VialIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M9 3h6v4l-2 2v10a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V9L9 7V3Z" />
      <path d="M9 3h6M10 14h4" />
    </svg>
  );
}

function SearchDocIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7 3h7l4 4v6" />
      <path d="M14 3v4h4M9 12h4" />
      <circle cx="15.5" cy="15.5" r="3.5" />
      <path d="m18 18 2.5 2.5" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-10Z" />
    </svg>
  );
}
