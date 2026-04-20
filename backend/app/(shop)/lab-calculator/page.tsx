import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { LabReconstitutionCalculator } from "@/components/store/lab-reconstitution-calculator";
import { PopularPeptidesFaqClient } from "@/components/store/popular-peptides-faq-client";
import {
  LAB_CALC_PRECISION_FEATURES,
  LAB_CALC_PRECISION_INTRO,
  RELATED_PRODUCTS,
  RESEARCH_QUALITY,
} from "@/lib/store/lab-calculator-page-data";
import { FAQ_ITEMS, POPULAR_TRUST_HIGHLIGHTS } from "@/lib/store/popular-peptides-data";
import { popularPepImage } from "@/lib/store/popular-peptides-images";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-lc-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-lc-sans",
});

export const metadata: Metadata = {
  title: "Lab Reconstitution Calculator",
  description:
    "Laboratory reconstitution reference calculator for lyophilized peptides and bacteriostatic water. For research use only.",
};

const relatedImageSizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw";

function RelatedCard({ name, slug, price, purity }: (typeof RELATED_PRODUCTS)[number]) {
  return (
    <article className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-50/80 shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:ring-neutral-300">
        <Link
          href={`/products-catalog/${slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:aspect-square"
        >
          <Image
            src={popularPepImage(`lc-related-${slug}`)}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes={relatedImageSizes}
          />
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
          <Link href={`/products-catalog/${slug}`}>
            <h3
              className={`text-base font-semibold leading-snug text-black transition-colors group-hover:text-[#9a7b1a] sm:text-lg ${playfair.className}`}
            >
              {name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {purity}. Not intended for human or veterinary use.
          </p>
          <p className="mt-4 text-xl font-bold tabular-nums text-black sm:text-2xl">${price.toFixed(2)}</p>
          <Link
            href={`/products-catalog/${slug}`}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
          >
            Select options
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function LabCalculatorPage() {
  const heading = playfair.className;

  return (
    <div className={`${playfair.variable} ${dmSans.variable} ${dmSans.className} text-black`}>
      <div className="bg-black py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white sm:text-xs">
        Free Shipping on Orders over $200
      </div>

      <section className="bg-neutral-100 px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1400px] text-center">
          <nav className="text-left text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-600">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-black">Lab Calculator</span>
          </nav>
          <h1 className={`mt-8 text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl ${heading}`}>
            Lab Reconstitution Calculator
          </h1>
        </div>
      </section>

      <section className="bg-neutral-100 px-4 pb-16 pt-2 lg:px-8 lg:pb-24">
        <LabReconstitutionCalculator />
      </section>

      <section className="bg-neutral-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className={`text-center text-2xl font-bold leading-tight md:text-3xl lg:text-4xl ${heading}`}>
            Precision Peptides, Not Mass-Market Supplements
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-white/75 md:text-base">
            {LAB_CALC_PRECISION_INTRO}
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {LAB_CALC_PRECISION_FEATURES.map((f) => (
              <div
                key={f.title}
                className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-xl border border-white/10 p-8"
              >
                <Image
                  src={popularPepImage(f.imageSeed)}
                  alt=""
                  fill
                  className="object-cover grayscale brightness-[0.45]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="relative z-10">
                  <h3 className={`text-xl font-bold md:text-2xl ${heading}`}>{f.title}</h3>
                  <p className="mt-2 text-sm text-white/85">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 className={`text-center text-2xl font-bold tracking-tight text-black sm:text-3xl md:text-[2rem] ${heading}`}>
            Related Product
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">
            Essentials for reconstitution and parallel research workflows.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {RELATED_PRODUCTS.map((p) => (
              <RelatedCard key={p.slug + p.name} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className={`text-center text-3xl font-bold md:text-4xl ${heading}`}>Policies &amp; support</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/70">
            The same legal pages and contact information as the rest of the SQSpeptides store.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {POPULAR_TRUST_HIGHLIGHTS.map((t) => (
              <div
                key={t.title}
                className="flex flex-col rounded-lg border border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-[#D4AF37]">{t.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/85">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/contact-us" className="font-semibold text-white underline decoration-white/40 hover:decoration-white">
              Contact
            </Link>
            <Link href="/terms" className="font-semibold text-white underline decoration-white/40 hover:decoration-white">
              Terms
            </Link>
          </div>
        </div>
      </section>

      <PopularPeptidesFaqClient items={FAQ_ITEMS} headingFont={heading} />

      <section className="bg-neutral-100 py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-lg bg-neutral-200">
            <Image
              src={popularPepImage("lab-calc-trust-lab")}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className={`text-3xl font-bold text-black md:text-4xl ${heading}`}>{RESEARCH_QUALITY.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">{RESEARCH_QUALITY.body}</p>
            <ul className="mt-8 space-y-3 text-sm text-neutral-800">
              {RESEARCH_QUALITY.bullets.map((line) => (
                <li key={line} className="flex gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black"
                    aria-hidden
                  >
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/products-catalog"
              className="mt-10 inline-block border-2 border-black bg-black px-10 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
            >
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
