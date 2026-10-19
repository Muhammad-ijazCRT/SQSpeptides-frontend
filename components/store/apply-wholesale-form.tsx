"use client";

import { useId, useState } from "react";
import { notify } from "@/lib/notifications/notify";

export function ApplyWholesaleForm() {
  const [payment, setPayment] = useState<"bank" | "credit">("bank");
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const formId = useId();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("w9") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      notify.warning("W9 file must be 5MB or smaller.");
      return;
    }
    setSent(true);
    notify.success("Thank you — your wholesale application has been received.");
  }

  function fieldShell(name: string) {
    const active = focused === name;
    return [
      "rounded-xl border bg-white transition duration-200",
      active
        ? "border-[#C5A02B] shadow-[0_0_0_3px_rgba(197,160,43,0.16)]"
        : "border-neutral-200 hover:border-neutral-300",
    ].join(" ");
  }

  const inputClass =
    "w-full rounded-xl bg-transparent px-4 py-3.5 text-base text-neutral-950 outline-none placeholder:text-neutral-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Your Name <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("name")}>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              required
              placeholder="Full name"
              autoComplete="name"
              className={inputClass}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Username <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("username")}>
            <input
              id={`${formId}-username`}
              name="username"
              type="text"
              required
              placeholder="Choose a username"
              autoComplete="username"
              className={inputClass}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Account Email <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("accountEmail")}>
            <input
              id={`${formId}-account-email`}
              name="accountEmail"
              type="email"
              required
              placeholder="you@lab.example"
              autoComplete="email"
              className={inputClass}
              onFocus={() => setFocused("accountEmail")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-900">
            Payment Email <span className="text-red-500">*</span>
          </span>
          <div className={fieldShell("paymentEmail")}>
            <input
              id={`${formId}-payment-email`}
              name="paymentEmail"
              type="email"
              required
              placeholder="payments@lab.example"
              autoComplete="email"
              className={inputClass}
              onFocus={() => setFocused("paymentEmail")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-900">Website URL</span>
        <div className={fieldShell("website")}>
          <input
            id={`${formId}-website`}
            name="website"
            type="url"
            placeholder="https://"
            className={inputClass}
            onFocus={() => setFocused("website")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-neutral-900">
          How will you promote us? <span className="text-red-500">*</span>
        </span>
        <div className={fieldShell("plans")}>
          <textarea
            id={`${formId}-plans`}
            name="plans"
            required
            rows={6}
            placeholder="Tell us about your lab, audience, and how you plan to promote SQSpeptides…"
            className={`${inputClass} min-h-[150px] resize-y`}
            onFocus={() => setFocused("plans")}
            onBlur={() => setFocused(null)}
          />
        </div>
      </label>

      <fieldset className="space-y-3 border-0 p-0">
        <legend className="mb-3 block text-sm font-semibold text-neutral-900">
          Payment Preference <span className="text-red-500">*</span>
        </legend>

        <label
          className={[
            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition duration-200",
            payment === "bank"
              ? "border-[#C5A02B] bg-[#C5A02B]/[0.06] shadow-[0_0_0_3px_rgba(197,160,43,0.12)]"
              : "border-neutral-200 bg-white hover:border-neutral-300",
          ].join(" ")}
        >
          <input
            type="radio"
            name="paymentPreference"
            value="bank"
            checked={payment === "bank"}
            onChange={() => setPayment("bank")}
            className="mt-1 h-4 w-4 border-neutral-400 text-[#C5A02B] focus:ring-[#C5A02B]"
          />
          <span>
            <span className="block text-sm font-semibold text-neutral-900">
              Cash / Bank Payment
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-neutral-500">
              W9 form required for payout processing
            </span>
          </span>
        </label>

        <label
          className={[
            "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition duration-200",
            payment === "credit"
              ? "border-[#C5A02B] bg-[#C5A02B]/[0.06] shadow-[0_0_0_3px_rgba(197,160,43,0.12)]"
              : "border-neutral-200 bg-white hover:border-neutral-300",
          ].join(" ")}
        >
          <input
            type="radio"
            name="paymentPreference"
            value="credit"
            checked={payment === "credit"}
            onChange={() => setPayment("credit")}
            className="mt-1 h-4 w-4 border-neutral-400 text-[#C5A02B] focus:ring-[#C5A02B]"
          />
          <span>
            <span className="block text-sm font-semibold text-neutral-900">
              Receive as Store Credit
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-neutral-500">
              No W9 needed — credit applied to future orders
            </span>
          </span>
        </label>
      </fieldset>

      <div>
        <span className="mb-2 block text-sm font-semibold text-neutral-900">
          Upload W9 Form{" "}
          <span className="font-normal text-neutral-500">(PDF, JPG, PNG · Max 5MB)</span>
          {payment === "bank" ? <span className="text-red-500"> *</span> : null}
        </span>
        <label
          htmlFor={`${formId}-w9`}
          className={[
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition duration-200",
            focused === "w9"
              ? "border-[#C5A02B] bg-[#C5A02B]/[0.04] shadow-[0_0_0_3px_rgba(197,160,43,0.12)]"
              : "border-neutral-300 bg-neutral-50/80 hover:border-[#C5A02B]/60 hover:bg-[#C5A02B]/[0.03]",
          ].join(" ")}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C5A02B]/12 text-[#C5A02B]">
            <UploadIcon />
          </span>
          <span className="text-sm font-semibold text-neutral-900">
            {fileName ? fileName : "Click to upload or drag and drop"}
          </span>
          <span className="text-xs text-neutral-500">
            {payment === "bank"
              ? "Required for bank / cash payment preference"
              : "Optional when using store credit"}
          </span>
          <input
            id={`${formId}-w9`}
            name="w9"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            required={payment === "bank"}
            className="sr-only"
            onFocus={() => setFocused("w9")}
            onBlur={() => setFocused(null)}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileName(file?.name ?? null);
            }}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={sent}
        className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A02B] to-[#8E701D] px-8 text-sm font-bold text-white shadow-[0_10px_24px_-12px_rgba(142,112,29,0.7)] transition duration-300 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A02B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-[3.25rem] sm:text-[15px]"
      >
        <span>{sent ? "Application submitted" : "Submit Application"}</span>
        {!sent ? <ArrowIcon className="transition duration-300 group-hover:translate-x-0.5" /> : null}
      </button>
    </form>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 16V5M8.5 8.5 12 5l3.5 3.5" />
      <path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
    </svg>
  );
}
