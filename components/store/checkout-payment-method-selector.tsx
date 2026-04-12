"use client";

import type { CheckoutPaymentGateway } from "@/lib/store/checkout-payment-gateway";

type Props = {
  value: CheckoutPaymentGateway;
  onChange: (g: CheckoutPaymentGateway) => void;
};

/** Compact gateway toggles — no provider names or long copy (fits under order total). */
export function CheckoutPaymentMethodSelector({ value, onChange }: Props) {
  const base =
    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition sm:py-3";
  const active = "border-[#c9a432] bg-amber-50/80 ring-1 ring-amber-200/50";
  const idle = "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/80";

  return (
    <div className="space-y-2" role="radiogroup" aria-label="Payment method">
      <button
        type="button"
        role="radio"
        aria-checked={value === "crossmint"}
        onClick={() => onChange("crossmint")}
        className={`${base} ${value === "crossmint" ? active : idle}`}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
            value === "crossmint" ? "border-[#b8962e] bg-[#b8962e]" : "border-neutral-300 bg-white"
          }`}
          aria-hidden
        >
          {value === "crossmint" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
        </span>
        <span className="min-w-0 flex-1 text-neutral-900">Pay with card</span>
        <span className="rounded-full bg-emerald-600/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
          Popular
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={value === "crypto"}
        onClick={() => onChange("crypto")}
        className={`${base} ${value === "crypto" ? active : idle}`}
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
            value === "crypto" ? "border-[#b8962e] bg-[#b8962e]" : "border-neutral-300 bg-white"
          }`}
          aria-hidden
        >
          {value === "crypto" ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
        </span>
        <span className="min-w-0 flex-1 text-neutral-900">Pay with cryptocurrency</span>
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="12" cy="12" r="12" fill="#F7931A" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#fff"
            fontFamily="system-ui, sans-serif"
          >
            ₿
          </text>
        </svg>
      </button>
    </div>
  );
}
