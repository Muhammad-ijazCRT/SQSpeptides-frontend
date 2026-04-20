"use client";

import Link from "next/link";

type Props = {
  email: string;
  onChange: (email: string) => void;
  disabled?: boolean;
};

export function OnrampEmailCapture({ email, onChange, disabled }: Props) {
  return (
    <div className="mb-4">
      <label htmlFor="onramp-email" className="mb-1 block text-xs font-medium text-neutral-600">
        Email for receipts and verification
      </label>
      <input
        id="onramp-email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onChange(e.target.value.trim())}
        disabled={disabled}
        placeholder="you@lab-or-organization.com"
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none ring-offset-2 focus:border-black focus:ring-2 focus:ring-black/10 disabled:opacity-60"
      />
      <p className="mt-2 text-xs leading-snug text-neutral-500">
        Enter a valid address you control. Our card processor (Crossmint) may collect information required for fraud prevention
        and regulations; see our{" "}
        <Link href="/privacy-policy" className="font-medium text-black underline hover:text-neutral-700">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
