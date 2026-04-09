import Link from "next/link";
import { BusinessAddress } from "@/components/store/business-address";

export function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <Link href="/" className="text-sm font-medium text-[#b8962e] hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-black">{title}</h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: {lastUpdated}</p>
      <BusinessAddress variant="inline" className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4" />
      <div className="mt-10 space-y-6 text-sm leading-relaxed text-neutral-700">{children}</div>
      <p className="mt-12 border-t border-neutral-200 pt-8 text-sm text-neutral-600">
        Questions?{" "}
        <Link href="/contact-us" className="font-semibold text-black underline hover:text-[#b8962e]">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
