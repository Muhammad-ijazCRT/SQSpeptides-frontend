import type { Metadata } from "next";
import Link from "next/link";
import { CustomerSignupForm } from "@/components/account/customer-signup-form";

export const metadata: Metadata = {
  title: "Create Account",
};

export default function AccountSignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-center text-xl font-bold text-neutral-900">Create account</h1>
          <p className="mt-2 text-center text-sm text-neutral-600">Register for research catalog access.</p>
          <div className="mt-8">
            <CustomerSignupForm />
          </div>
        </div>
        <Link href="/" className="mt-8 text-sm text-neutral-600 hover:text-black">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
