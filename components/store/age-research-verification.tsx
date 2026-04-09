"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

/**
 * Home (`/`) only: modal appears on every visit (each load or navigation to home).
 * Acceptance is not persisted — leaving and returning to home shows the gate again.
 * Other storefront routes are not blocked by this component.
 */
export function AgeResearchVerification() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [homeDismissed, setHomeDismissed] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    setHomeDismissed(false);
    setAgreed(false);
  }, [pathname]);

  const open = isHome && !homeDismissed;

  const accept = useCallback(() => {
    if (!agreed) return;
    setHomeDismissed(true);
  }, [agreed]);

  const exit = useCallback(() => {
    window.location.href = "https://www.google.com/";
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-research-title"
    >
      <div className="max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <h2 id="age-research-title" className="text-center text-xl font-bold text-black sm:text-2xl">
          Age &amp; Research Use Verification
        </h2>
        <ul className="mt-6 list-disc space-y-3 pl-5 text-sm leading-relaxed text-neutral-800 sm:text-[15px]">
          <li>
            I confirm I am <strong>18 years of age or older</strong>
          </li>
          <li>
            I acknowledge all products sold are <strong>for research purposes only</strong>
          </li>
          <li>
            I acknowledge products are <strong>not for human or veterinary use</strong>
          </li>
          <li>
            By clicking &quot;<strong>I Agree</strong>&quot;, I accept and acknowledge these terms
          </li>
        </ul>

        <label className="mt-8 flex cursor-pointer gap-3 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded border-neutral-400 accent-[#D4AF37]"
          />
          <span className="text-sm font-medium text-neutral-900">I have read and agree to the above terms</span>
        </label>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            disabled={!agreed}
            onClick={accept}
            className="min-h-11 rounded-lg border border-neutral-300 bg-neutral-200 px-8 text-sm font-semibold text-neutral-800 transition enabled:border-[#b8962e] enabled:bg-[#D4AF37] enabled:text-black enabled:hover:bg-[#c9a432] disabled:cursor-not-allowed disabled:opacity-50"
          >
            I Agree
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
