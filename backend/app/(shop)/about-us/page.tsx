import Link from "next/link";
import { BusinessAddress } from "@/components/store/business-address";
import { SITE_BRAND_NAME, SITE_BUSINESS_TAGLINE, SITE_LEGAL_NAME } from "@/lib/site-business";

export const metadata = {
  title: "About Us",
  description: `${SITE_BRAND_NAME} — research peptides and lab supplies for qualified professionals. ${SITE_BUSINESS_TAGLINE}`,
};

export default function AboutUsPage() {
  return (
    <div className="bg-white text-black">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-12 lg:px-8 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7b1a]">About</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{SITE_BRAND_NAME}</h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">{SITE_BUSINESS_TAGLINE}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-12 px-4 py-14 lg:px-8">
        <section className="space-y-4 text-sm leading-relaxed text-neutral-700">
          <h2 className="text-xl font-bold text-black">Who we are</h2>
          <p>
            {SITE_BRAND_NAME} is operated by {SITE_LEGAL_NAME}, based in Lewisville, Texas. We supply catalog research peptides
            and related materials to qualified buyers who need reliable documentation, consistent quality, and predictable
            fulfillment for laboratory workflows.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-neutral-700">
          <h2 className="text-xl font-bold text-black">What we sell (and what we do not)</h2>
          <p>
            Our products are offered <strong className="text-black">strictly for in-vitro research and laboratory use</strong>{" "}
            by individuals and organizations with appropriate training. They are{" "}
            <strong className="text-black">not</strong> drugs, supplements, or foods, and{" "}
            <strong className="text-black">are not intended for human consumption, veterinary use, diagnostics, or any clinical
            application</strong>. Purchasers are responsible for lawful use in their jurisdiction.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-neutral-700">
          <h2 className="text-xl font-bold text-black">How payments work on this site</h2>
          <p>
            Standard checkout uses established card and payment flows. Where we offer optional card-to-digital-asset funding
            (an &ldquo;on-ramp&rdquo;) through our partner <strong className="text-black">Crossmint</strong>, it exists so
            approved customers can fund a wallet in line with our checkout options—not as an investment, trading, or
            &ldquo;get rich&rdquo; product. All fees, verification, and settlement are disclosed by the processor at the time
            of payment.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-neutral-700">
          <h2 className="text-xl font-bold text-black">Quality and operations</h2>
          <p>
            We focus on clear product data, batch-oriented traceability where applicable, and responsive support through the
            channels listed on our <Link href="/contact-us" className="font-semibold text-[#b8962e] hover:underline">contact page</Link>.
            Specific claims for any SKU appear on the product detail page and supporting documentation we provide for that item.
          </p>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-bold text-black">Business location &amp; contact</h2>
          <BusinessAddress variant="inline" className="mt-4" />
          <p className="mt-6 text-sm text-neutral-600">
            <Link href="/contact-us" className="font-semibold text-[#b8962e] hover:underline">
              Contact us
            </Link>{" "}
            for wholesale applications, order questions, or documentation requests.
          </p>
        </section>

        <section className="flex flex-wrap gap-4 border-t border-neutral-200 pt-10">
          <Link
            href="/products-catalog"
            className="inline-flex items-center justify-center rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black hover:bg-[#c9a432]"
          >
            Browse catalog
          </Link>
          <Link href="/terms" className="inline-flex items-center justify-center text-sm font-semibold text-[#b8962e] hover:underline">
            Terms &amp; conditions
          </Link>
          <Link href="/privacy-policy" className="inline-flex items-center justify-center text-sm font-semibold text-[#b8962e] hover:underline">
            Privacy policy
          </Link>
        </section>
      </div>
    </div>
  );
}
