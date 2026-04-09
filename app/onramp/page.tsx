import Link from "next/link";
import { OnrampLandingPage } from "@/components/onramp/onramp-landing-page";
import { BrandLogo } from "@/components/store/brand-logo";
import { SITE_ADDRESS_SINGLE_LINE, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export default function OnrampPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <header className="border-b border-neutral-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo height={32} className="max-h-8" />
            <span className="text-sm font-medium text-neutral-600">Back to store</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-600">
            <Link href="/about-us" className="hover:text-black">
              About
            </Link>
            <Link href="/contact-us" className="hover:text-black">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-black">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-black">
              Privacy
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <OnrampLandingPage />
      </main>
      <footer className="border-t border-neutral-200 bg-white px-4 py-4 text-center text-xs text-neutral-600">
        <p>
          {SITE_ADDRESS_SINGLE_LINE} ·{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-medium text-black underline hover:text-neutral-800">
            {SITE_SUPPORT_EMAIL}
          </a>
        </p>
      </footer>
    </div>
  );
}
