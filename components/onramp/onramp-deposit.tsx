"use client";

import React from "react";
import { Order } from "@/lib/types";
import Tooltip from "@/components/onramp/tooltip";
import { isCrossmintProduction } from "@/lib/onramp/crossmint-public-env";

type Props = {
  amountUsd: string;
  setAmountUsd: (v: string) => void;
  order: Order;
  onContinue: () => void;
  children?: React.ReactNode;
};

function PricingInfo({ effectiveAmount, totalUsd }: { effectiveAmount: string | null; totalUsd: string | null }) {
  if (effectiveAmount === null || totalUsd === null) return null;

  const addedToBalance = parseFloat(effectiveAmount);
  const totalAmountUsd = parseFloat(totalUsd);
  const feesUsd = totalAmountUsd - addedToBalance;
  const prod = isCrossmintProduction();

  return (
    <div className="mt-6 rounded-lg bg-gray-50 p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Added to your balance</span>
          <span className="font-medium text-gray-900">${addedToBalance.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Fees</span>
          <div className="flex items-center gap-2">
            {feesUsd <= 0.01 && (
              <Tooltip
                content={
                  prod
                    ? "Fees may still apply depending on Crossmint and your card issuer; check your receipt or Crossmint dashboard for details."
                    : "Fee display in staging may differ from production."
                }
                className="inline-flex h-5 w-5 cursor-default items-center justify-center rounded-full border border-gray-300 text-xs text-gray-600"
              >
                ?
              </Tooltip>
            )}
            <span className="font-medium text-gray-900">${feesUsd.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
          <span className="font-medium text-gray-900">Total amount</span>
          <span className="text-lg font-semibold text-gray-900">${totalAmountUsd.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function OnrampDeposit({
  amountUsd,
  setAmountUsd,
  order,
  onContinue,
  children,
}: Props) {
  return (
    <div className="px-6">
      <h2 className="text-center text-lg font-semibold">Amount</h2>

      {children}

      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="text-5xl text-gray-500">$</div>
        <input
          className="w-auto min-w-[120px] max-w-[300px] text-center text-5xl font-semibold text-gray-800 outline-none"
          type="number"
          min={0}
          step={1}
          value={amountUsd}
          onChange={(e) => setAmountUsd(e.target.value)}
          disabled={order.status === "creating-order" || order.status === "awaiting-payment"}
        />
      </div>

      <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        <p className="text-center text-sm leading-snug text-neutral-700">
          Card payments are processed by Crossmint. Additional verification may be required for fraud prevention and
          regulations. By continuing, you agree to our{" "}
          <a href="/terms" className="font-medium text-black underline hover:text-neutral-900">
            terms
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="font-medium text-black underline hover:text-neutral-900">
            privacy policy
          </a>
          .
        </p>
      </div>

      {order.status === "error" && order.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-center text-sm text-red-800">{order.error}</p>
        </div>
      )}

      <PricingInfo effectiveAmount={order.effectiveAmount} totalUsd={order.totalUsd} />

      {order.totalUsd == null && (
        <div className="mt-6">
          <button
            className="w-full rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-50"
            onClick={onContinue}
            disabled={order.status === "creating-order"}
          >
            {order.status === "creating-order" ? "Creating order..." : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
