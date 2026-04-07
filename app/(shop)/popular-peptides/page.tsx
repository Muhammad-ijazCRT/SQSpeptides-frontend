import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { PopularPeptidesFaqClient } from "@/components/store/popular-peptides-faq-client";
import { PopularPeptidesShopClient } from "@/components/store/popular-peptides-shop-client";
import { fetchProducts } from "@/lib/api/products";
import {
  FAQ_ITEMS,
  POPULAR_PEPTIDES_INTRO,
  PRECISION_FEATURES,
  PRECISION_INTRO,
  RESEARCH_QUALITY,
  REVIEWS,
} from "@/lib/store/popular-peptides-data";
import { popularPepImage } from "@/lib/store/popular-peptides-images";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import type { Product } from "@/lib/store/types";

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
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-50/80 shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:ring-neutral-300">
        <Link
          href={`/products-catalog/${product.slug}`}
          className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:aspect-square"
        >
          <Image
            src={img}
            alt={product.name}
            fill
            className={productImageBoxClassName(img, "transition duration-500 group-hover:scale-[1.03]")}
            sizes={relatedImageSizes}
            unoptimized
          />
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
          <Link href={`/products-catalog/${product.slug}`}>
            <h3
              className={`text-base font-semibold leading-snug text-black transition-colors group-hover:text-[#9a7b1a] sm:text-lg ${headingClass}`}
            >
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            99.9% purity. Not intended for human or veterinary use.
          </p>
          <p className="mt-4 text-xl font-bold tabular-nums text-black sm:text-2xl">${product.price.toFixed(2)}</p>
          <Link
            href={`/products-catalog/${product.slug}`}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-black px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800"
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
  const related = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const heading = playfair.className;

  return (
    <div className={`${playfair.variable} ${dmSans.variable} ${dmSans.className} text-black`}>
      <div className="bg-black py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white sm:text-xs">
        Free Shipping on Orders over $200
      </div>

      <section className="bg-[#ebe6dc] px-4 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-[1400px]">
          <nav className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-600">
            <Link href="/" className="hover:text-black">
              Home
            </Link>
            <span className="mx-2 text-neutral-400">/</span>
            <span className="text-black">Popular Peptides</span>
          </nav>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-500 sm:text-[11px]">
            Metabolic research only
          </p>
          <h1 className={`mt-3 text-4xl font-bold tracking-tight text-black md:text-5xl lg:text-6xl ${heading}`}>
            Popular Peptides
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">{POPULAR_PEPTIDES_INTRO}</p>
        </div>
      </section>

      <section className="bg-white">
        <PopularPeptidesShopClient products={products} headingFont={heading} />
      </section>

      <section className="bg-neutral-950 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className={`text-center text-3xl font-bold md:text-4xl ${heading}`}>Precision Peptides, Not Mass-Market</h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-white/75 md:text-base">
            {PRECISION_INTRO}
          </p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PRECISION_FEATURES.map((f) => (
              <div
                key={f.title}
                className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-lg border border-white/10 p-8"
              >
                <Image
                  src={popularPepImage(f.imageSeed)}
                  alt=""
                  fill
                  className="object-cover brightness-[0.35]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="relative z-10">
                  <h3 className={`text-xl font-bold md:text-2xl ${heading}`}>{f.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{f.subtitle}</p>
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
            Curated picks that pair well with metabolic research workflows.
          </p>
          {related.length === 0 ? (
            <p className="mt-12 text-center text-neutral-500">Add catalog items in the admin dashboard to show related products here.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} headingClass={heading} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-black py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
          <h2 className={`text-center text-3xl font-bold md:text-4xl ${heading}`}>Product Reviews</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <blockquote
                key={r.name}
                className="flex flex-col rounded-lg border border-white/15 bg-white/[0.04] p-8 backdrop-blur-sm"
              >
                <div className="text-[#D4AF37]">★★★★★</div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/85">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-6 text-sm">
                  <span className="font-semibold text-white">{r.name}</span>
                  <span className="text-white/50"> — {r.date}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <PopularPeptidesFaqClient items={FAQ_ITEMS} headingFont={heading} />

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="relative aspect-[16/10] min-h-[240px] overflow-hidden rounded-lg bg-neutral-200">
            <Image
              src={popularPepImage("research-lab-wide")}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority={false}
            />
          </div>
          <div>
            <h2 className={`text-3xl font-bold text-black md:text-4xl ${heading}`}>{RESEARCH_QUALITY.title}</h2>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">{RESEARCH_QUALITY.body}</p>
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
              className="mt-10 inline-block border-2 border-black bg-black px-10 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
            >
              Shop now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
