import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import { PopularProductBadge } from "@/components/store/catalog/popular-product-badge";
import { ShopProductBrowser } from "@/components/store/catalog/shop-product-browser";
import { PopularPeptidesFaqClient } from "@/components/store/popular-peptides-faq-client";
import { ShopPageBanner } from "@/components/store/shop-page-banner";
import { fetchProducts } from "@/lib/api/products";
import {
  FAQ_ITEMS,
  FAQ_SUBTITLE,
  POPULAR_PEPTIDES_EYEBROW,
  POPULAR_PEPTIDES_INTRO,
  POPULAR_TRUST_HIGHLIGHTS,
  PRECISION_FEATURES,
  PRECISION_INTRO,
  RELATED_INTRO,
  RESEARCH_QUALITY,
} from "@/lib/store/popular-peptides-data";
import { popularPepImage } from "@/lib/store/popular-peptides-images";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import type { Product } from "@/lib/store/types";

const HERO_IMAGE = "/products/popular-pepetides/popular-pepetides.png";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-pp-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-pp-sans",
});

export const metadata: Metadata = {
  title: "Popular Peptides",
  description: POPULAR_PEPTIDES_INTRO,
};

export const revalidate = 60;

const relatedImageSizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw";

function RelatedCard({ product, headingClass }: { product: Product; headingClass: string }) {
  const img = resolveProductImage(product);
  return (
    <article className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden border border-black/10 bg-white transition duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.18)]">
        <Link
          href={`/products-catalog/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-[#f4f0e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 sm:aspect-square"
        >
          {product.spotlight ? <PopularProductBadge /> : null}
          <Image
            src={img}
            alt={product.name}
            fill
            className={productImageBoxClassName(img, "transition duration-700 group-hover:scale-[1.04]")}
            sizes={relatedImageSizes}
            unoptimized
          />
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
          <Link href={`/products-catalog/${product.slug}`}>
            <h3
              className={`text-base font-semibold leading-snug text-neutral-950 transition-colors group-hover:text-[#9a7b1a] sm:text-lg ${headingClass}`}
            >
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">99.9% purity. Research use only.</p>
          <p className="mt-4 text-xl font-bold tabular-nums text-neutral-950 sm:text-2xl">${product.price.toFixed(2)}</p>
          <Link
            href={`/products-catalog/${product.slug}`}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center bg-neutral-950 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#D4AF37] hover:text-black"
          >
            Select options
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function PopularPeptidesPage() {
  let products: Product[] = [];
  try {
    products = await fetchProducts();
  } catch {
    products = [];
  }
  const spotlightProducts = products.filter((p) => Boolean(p.spotlight));
  const related = [...spotlightProducts].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const heading = playfair.className;

  return (
    <div className={`${playfair.variable} ${dmSans.variable} ${dmSans.className} text-neutral-950`}>
      <div className="bg-neutral-950 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] sm:text-xs">
        Free Shipping on Orders over $200
      </div>

      <ShopPageBanner
        brandClassName={heading}
        breadcrumbLabel="Popular Peptides"
        eyebrow={POPULAR_PEPTIDES_EYEBROW}
        title="Popular Peptides"
        intro={POPULAR_PEPTIDES_INTRO}
        primaryCta={{ href: "#catalog", label: "Explore the bench" }}
        secondaryCta={{ href: "/products-catalog", label: "Full catalog" }}
      />

      <section id="catalog" className="scroll-mt-24 border-t border-black/5 bg-white">
        <div className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <div className="mb-10 max-w-2xl lg:mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
              The collection
            </p>
            <h2 className={`mt-2 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl ${heading}`}>
              Shop Spotlight peptides
            </h2>
            <p className="mt-2 text-sm text-neutral-600 sm:text-base">
              Only products marked Spotlight in admin appear here—filter, sort, and page through the bench favorites.
            </p>
          </div>
          <Suspense
            fallback={<div className="py-16 text-center text-sm text-neutral-500">Loading Spotlight products…</div>}
          >
            <ShopProductBrowser
              products={spotlightProducts}
              basePath="/popular-peptides"
              showSpotlightBadge
              emptyMessage="No Spotlight products yet. Turn on Spotlight for products in the admin dashboard."
            />
          </Suspense>
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-16 text-white lg:py-24">
        <div
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-[#D4AF37]/5 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37] sm:text-[11px]">
            Why SQS
          </p>
          <h2 className={`mt-3 text-center text-3xl font-bold md:text-4xl lg:text-5xl ${heading}`}>
            Precision peptides, not mass-market noise
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-white/75 md:text-base">
            {PRECISION_INTRO}
          </p>
          <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {PRECISION_FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden border border-white/10 p-8 transition duration-500 hover:border-[#D4AF37]/45"
              >
                <Image
                  src={popularPepImage(f.imageSeed)}
                  alt=""
                  fill
                  className="object-cover brightness-[0.32] transition duration-700 group-hover:scale-105 group-hover:brightness-[0.4]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" aria-hidden />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">0{i + 1}</span>
                  <h3 className={`mt-2 text-xl font-bold md:text-2xl ${heading}`}>{f.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{f.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
            Keep the thread
          </p>
          <h2 className={`mt-3 text-center text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl md:text-[2.35rem] ${heading}`}>
            Related picks
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">{RELATED_INTRO}</p>
          {related.length === 0 ? (
            <p className="mt-12 text-center text-neutral-500">
              Add catalog items in the admin dashboard to show related products here.
            </p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} headingClass={heading} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0c0b09] py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-[#D4AF37] sm:text-[11px]">
            Order with clarity
          </p>
          <h2 className={`mt-3 text-center text-3xl font-bold md:text-4xl ${heading}`}>Ordering with SQSpeptides</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/70">
            Real policies. A real address. No paid review theater.
          </p>
          <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {POPULAR_TRUST_HIGHLIGHTS.map((t, i) => (
              <div
                key={t.title}
                className="group flex flex-col border border-white/12 bg-white/[0.03] p-8 transition duration-300 hover:border-[#D4AF37]/40 hover:bg-white/[0.06]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]/80">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold text-[#D4AF37]">{t.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/85">{t.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/contact-us"
              className="font-semibold text-white underline decoration-[#D4AF37]/50 underline-offset-4 transition hover:decoration-[#D4AF37]"
            >
              Contact &amp; address
            </Link>
            <Link
              href="/refund-policy"
              className="font-semibold text-white underline decoration-[#D4AF37]/50 underline-offset-4 transition hover:decoration-[#D4AF37]"
            >
              Refund policy
            </Link>
          </div>
        </div>
      </section>

      <PopularPeptidesFaqClient items={FAQ_ITEMS} headingFont={heading} subtitle={FAQ_SUBTITLE} />

      <section className="relative overflow-hidden bg-[#faf8f4] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden border border-black/10 bg-neutral-200">
            <Image
              src={HERO_IMAGE}
              alt="SQS popular peptides research vials"
              fill
              className="object-cover object-center transition duration-700 hover:scale-[1.03]"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-transparent" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a7b1a] sm:text-[11px]">
              Research integrity
            </p>
            <h2 className={`mt-3 text-3xl font-bold text-neutral-950 md:text-4xl ${heading}`}>{RESEARCH_QUALITY.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-neutral-700 md:text-base">{RESEARCH_QUALITY.body}</p>
            <ul className="mt-8 space-y-3 text-sm text-neutral-800">
              {RESEARCH_QUALITY.bullets.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/products-catalog"
              className="mt-10 inline-flex min-h-12 items-center justify-center border-2 border-neutral-950 bg-neutral-950 px-10 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
            >
              Shop now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
