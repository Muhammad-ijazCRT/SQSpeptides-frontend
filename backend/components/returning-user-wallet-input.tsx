"use client";

import { useState } from "react";
import { isValidStellarWalletAddress } from "@/lib/onramp/stellar-address";

type ReturningUserWalletInputProps = {
  email: string;
  amountUsd: string;
  setAmountUsd: (amount: string) => void;
  onContinue: (walletAddress: string) => void;
  isCreatingOrder: boolean;
};

export default function ReturningUserWalletInput({
  email,
  amountUsd,
  setAmountUsd,
  onContinue,
  isCreatingOrder,
}: ReturningUserWalletInputProps) {
  const [walletAddress, setWalletAddress] = useState("");

  const canContinue =
    !isCreatingOrder &&
    parseFloat(amountUsd) >= 5 &&
    isValidStellarWalletAddress(walletAddress);

  const handleUseExample = () => {
    setWalletAddress("CDRL6CLJMJSLXCK2VTPJWHQRMI7EXG6BZYT7XTMH7DMMNDEDP6N4GKJ3");
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-center mb-4">Deposit</h2>

      {/* Amount - Same style as OnrampDeposit */}
      <div className="flex items-center justify-center gap-2">
        <div className="text-5xl text-gray-500">$</div>
        <input
          className="text-5xl font-semibold text-gray-800 text-center outline-none min-w-[120px] max-w-[300px] w-auto [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          type="number"
          min={5}
          step={1}
          value={amountUsd}
          onChange={(e) => setAmountUsd(e.target.value)}
          disabled={isCreatingOrder}
        />
      </div>

      {/* Wallet Address */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Destination Wallet Address
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter Stellar wallet address (G… or C…)"
          disabled={isCreatingOrder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
        />
        <button
          onClick={handleUseExample}
          disabled={isCreatingOrder}
          className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Use example address
        </button>
      </div>

      {/* Continue Button */}
      <div className="mt-6">
        <button
          onClick={() => onContinue(walletAddress)}
          disabled={!canContinue}
          className={`w-full py-2 px-5 rounded-full text-sm font-medium transition-colors ${
            canContinue
              ? "bg-black text-white hover:bg-gray-800 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isCreatingOrder ? "Creating order..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
