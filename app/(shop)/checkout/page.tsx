import Link from "next/link";
import { BrandLogo } from "@/components/store/brand-logo";
import { CheckoutForm } from "@/components/store/checkout-form";

export const metadata = {
  title: "Checkout | SQSpeptides",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-neutral-100 to-neutral-50 py-10 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-xs font-medium text-neutral-500">
          <Link href="/" className="transition hover:text-[#b8962e]">
            Home
          </Link>
          <span className="mx-2 text-neutral-300">/</span>
          <span className="font-medium text-black">Checkout</span>
        </nav>

        <header className="mt-6 border-b border-neutral-200/80 pb-6">
          <BrandLogo height={40} className="max-h-10" />
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black sm:text-3xl">Checkout</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Review your order, enter shipping, then choose card or crypto on the right — one page. Research-use only; not for
            human consumption.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-amber-900">
            <span className="rounded-full bg-amber-100 px-3 py-1">Not for human use</span>
            <span className="rounded-full bg-neutral-200/80 px-3 py-1 text-neutral-800">Lab &amp; R&amp;D only</span>
          </div>
        </header>

        <div className="mt-10 pb-12">
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
}
