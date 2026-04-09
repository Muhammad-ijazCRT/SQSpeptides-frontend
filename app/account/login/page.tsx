import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CustomerLoginForm } from "@/components/account/customer-login-form";
import { BrandLogo } from "@/components/store/brand-logo";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function AccountLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-5 flex justify-center">
            <BrandLogo height={40} className="max-h-10" />
          </div>
          <h1 className="text-center text-xl font-bold text-neutral-900">Sign in</h1>
          <p className="mt-2 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-neutral-600">
            <span>Access your</span>
            <BrandLogo height={22} className="max-h-5" />
            <span>account.</span>
          </p>
          <div className="mt-8">
            <Suspense fallback={<p className="text-center text-sm text-neutral-500">Loading…</p>}>
              <CustomerLoginForm />
            </Suspense>
          </div>
        </div>
        <Link href="/" className="mt-8 text-sm text-neutral-600 hover:text-black">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
