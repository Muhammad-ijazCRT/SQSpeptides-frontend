"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sqs_research_gate_v2";

/**
 * Site-wide gate for shop layout: once accepted per browser session, modal stays dismissed.
 * Requires both age 21+ and qualified-researcher attestation.
 */
export function AgeResearchVerification() {
  const [hydrated, setHydrated] = useState(false);
  const [passed, setPassed] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [qualifiedOk, setQualifiedOk] = useState(false);

  useEffect(() => {
    try {
      setPassed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setPassed(false);
    }
    setHydrated(true);
  }, []);

  const canEnter = ageOk && qualifiedOk;

  const accept = useCallback(() => {
    if (!canEnter) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setPassed(true);
  }, [canEnter]);

  const exit = useCallback(() => {
    window.location.href = "https://www.google.com/";
  }, []);

  if (!hydrated || passed) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-research-title"
    >
      <div className="max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h2 id="age-research-title" className="text-center text-xl font-bold text-black sm:text-2xl">
          Age &amp; qualified researcher verification
        </h2>
        <p className="mt-4 text-center text-sm leading-relaxed text-neutral-600">
          This catalog is sold for <strong className="text-black">in-vitro and non-clinical laboratory research only</strong>.
          You must confirm both items below to continue.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed text-neutral-800 sm:text-[15px]">
          <li>Products are <strong>not for human or veterinary use</strong> and are <strong>not</strong> offered to diagnose, treat, cure, or prevent any disease.</li>
          <li>
            By entering, you accept our{" "}
            <Link href="/terms" className="font-semibold text-[#b8962e] underline hover:text-black">
              terms and conditions
            </Link>
            .
          </li>
        </ul>

        <div className="mt-8 space-y-4">
          <label className="flex cursor-pointer gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
            <input
              type="checkbox"
              checked={ageOk}
              onChange={(e) => setAgeOk(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-400 accent-[#D4AF37]"
            />
            <span className="text-sm font-medium text-neutral-900">
              I am <strong>21 years of age or older</strong>.
            </span>
          </label>
          <label className="flex cursor-pointer gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
            <input
              type="checkbox"
              checked={qualifiedOk}
              onChange={(e) => setQualifiedOk(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-400 accent-[#D4AF37]"
            />
            <span className="text-sm font-medium text-neutral-900">
              I am a <strong>qualified researcher</strong> or an <strong>authorized representative</strong> of an organization
              purchasing solely for lawful, non-clinical research use.
            </span>
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={!canEnter}
            onClick={accept}
            className="min-h-11 rounded-lg border border-neutral-300 bg-neutral-200 px-8 text-sm font-semibold text-neutral-800 transition enabled:border-[#b8962e] enabled:bg-[#D4AF37] enabled:text-black enabled:hover:bg-[#c9a432] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enter site
          </button>
          <button
            type="button"
            onClick={exit}
            className="min-h-11 rounded-lg border border-neutral-300 bg-neutral-200 px-8 text-sm font-semibold text-red-600 transition hover:bg-neutral-300"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
