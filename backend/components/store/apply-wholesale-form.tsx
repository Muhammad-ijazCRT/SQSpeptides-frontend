"use client";

import { useState } from "react";

const fieldClass =
  "mt-1.5 w-full rounded border border-neutral-300 bg-white px-3 py-2.5 text-base text-black outline-none transition focus:border-black focus:ring-1 focus:ring-black";
const labelClass = "block text-sm font-medium text-neutral-700";

export function ApplyWholesaleForm() {
  const [payment, setPayment] = useState<"bank" | "credit">("bank");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("w9") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("W9 file must be 5MB or smaller.");
      return;
    }
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="ww-name">
          Your Name
        </label>
        <input id="ww-name" name="name" type="text" required className={fieldClass} autoComplete="name" />
      </div>
      <div>
        <label className={labelClass} htmlFor="ww-username">
          Username
        </label>
        <input id="ww-username" name="username" type="text" required className={fieldClass} autoComplete="username" />
      </div>
      <div>
        <label className={labelClass} htmlFor="ww-account-email">
          Account Email
        </label>
        <input id="ww-account-email" name="accountEmail" type="email" required className={fieldClass} autoComplete="email" />
      </div>
      <div>
        <label className={labelClass} htmlFor="ww-payment-email">
          Payment Email
        </label>
        <input id="ww-payment-email" name="paymentEmail" type="email" required className={fieldClass} autoComplete="email" />
      </div>
      <div>
        <label className={labelClass} htmlFor="ww-website">
          Website URL
        </label>
        <input id="ww-website" name="website" type="url" className={fieldClass} placeholder="https://" />
      </div>
      <div>
        <label className={labelClass} htmlFor="ww-promote">
          How will you promote us?
        </label>
        <textarea
          id="ww-promote"
          name="plans"
          required
          rows={6}
          className={`${fieldClass} min-h-[160px] resize-y`}
        />
      </div>

      <fieldset className="space-y-3 border-0 p-0">
        <legend className={labelClass}>Payment Preference</legend>
        <label className="flex cursor-pointer items-start gap-3 pt-2">
          <input
            type="radio"
            name="paymentPreference"
            value="bank"
            checked={payment === "bank"}
            onChange={() => setPayment("bank")}
            className="mt-1 h-4 w-4 border-neutral-400 text-black focus:ring-black"
          />
          <span className="text-sm text-neutral-800">Cash / Bank Payment (W9 form required)</span>
        </label>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="radio"
            name="paymentPreference"
            value="credit"
            checked={payment === "credit"}
            onChange={() => setPayment("credit")}
            className="mt-1 h-4 w-4 border-neutral-400 text-black focus:ring-black"
          />
          <span className="text-sm text-neutral-800">Receive as Store Credit (no W9 needed)</span>
        </label>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="ww-w9">
          Upload W9 Form (PDF, JPG, PNG) <span className="font-normal text-neutral-500">Max file size: 5MB</span>
        </label>
        <input
          id="ww-w9"
          name="w9"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="mt-2 block w-full text-sm text-neutral-600 file:mr-4 file:rounded-md file:border file:border-neutral-300 file:bg-neutral-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-neutral-100"
        />
      </div>

      <div className="flex flex-col items-start gap-3 pt-2">
        <button
          type="submit"
          className="rounded-md border border-rose-300 bg-rose-50 px-8 py-2.5 text-sm font-semibold text-rose-600 transition hover:border-rose-400 hover:bg-rose-100 hover:text-rose-700"
        >
          Register
        </button>
        {sent ? (
          <p className="text-sm font-medium text-neutral-700" role="status">
            Thank you — your wholesale application has been received. We will review and respond by email.
          </p>
        ) : null}
      </div>
    </form>
  );
}
