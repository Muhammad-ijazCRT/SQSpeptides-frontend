"use client";

import { isCrossmintProduction } from "@/lib/onramp/crossmint-public-env";
import { SITE_BRAND_NAME } from "@/lib/site-business";

type OnrampSuccessProps = {
  totalUsd: string;
  effectiveAmount: string;
  walletAddress: string;
  txId?: string;
  onStartNew: () => void;
};

function formatUsdc(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return num.toFixed(2);
}

function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function OnrampSuccess({
  totalUsd,
  effectiveAmount,
  walletAddress,
  txId,
  onStartNew,
}: OnrampSuccessProps) {
  const net = isCrossmintProduction() ? "public" : "testnet";
  const explorerUrl = txId
    ? `https://stellar.expert/explorer/${net}/tx/${encodeURIComponent(txId)}`
    : `https://stellar.expert/explorer/${net}/account/${encodeURIComponent(walletAddress)}`;
  const formattedUsdc = formatUsdc(effectiveAmount);
  const formattedUsd = formatUsdc(totalUsd);

  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative mb-5">
        <div className="flex h-16 w-16 animate-in items-center justify-center rounded-full bg-green-50 duration-500 zoom-in">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <h2 className="mb-1 text-lg font-semibold text-gray-900">Payment completed</h2>
      <p className="mb-6 max-w-sm text-center text-sm leading-relaxed text-gray-500">
        Your card payment was processed by our partner. USDC settlement to the wallet on file is shown below. This supports{" "}
        {SITE_BRAND_NAME} checkout workflows that use a funded wallet—not trading or investment returns.
      </p>

      <div className="mb-5 w-full rounded-xl bg-gray-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">You paid</span>
          <span className="text-sm font-medium text-gray-900">${formattedUsd}</span>
        </div>
        <div className="my-3 border-t border-gray-200" />
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Credited (USDC)</span>
          <div className="flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
              <span className="text-[8px] font-bold text-white">$</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{formattedUsdc} USDC</span>
          </div>
        </div>
        <div className="my-3 border-t border-gray-200" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Destination</span>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-green-600 transition-colors hover:text-green-700 hover:underline"
          >
            {truncateAddress(walletAddress)}
          </a>
        </div>
      </div>

      <div className="w-full space-y-2.5">
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          View on network explorer
          <svg className="ml-1.5 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

        <button
          type="button"
          onClick={onStartNew}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          New transaction
        </button>
      </div>
    </div>
  );
}
