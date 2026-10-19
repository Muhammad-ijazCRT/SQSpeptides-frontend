"use client";

import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/store/types";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { CatalogFaq } from "@/components/store/catalog/catalog-faq";
import { PopularProductBadge } from "@/components/store/catalog/popular-product-badge";
import { ShopProductBrowser } from "@/components/store/catalog/shop-product-browser";
import { ShopPageBanner } from "@/components/store/shop-page-banner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-catalog-serif",
});

const relatedImageSizes =
  "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw";

function RelatedProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const safe = normalizeProduct(product) ?? product;
  const img = resolveProductImage(safe);

  return (
    <li className="group flex h-full flex-col">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-neutral-50/80 shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:ring-neutral-300">
        <Link
          href={`/products-catalog/${safe.slug}`}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-neutral-100 to-neutral-50 sm:aspect-square">
            {safe.spotlight ? <PopularProductBadge /> : null}
            <Image
              src={img}
              alt={safe.name}
              fill
              className={productImageBoxClassName(img, "transition duration-500 group-hover:scale-[1.03]")}
              sizes={relatedImageSizes}
              unoptimized
            />
          </div>
        </Link>
        <div className="flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5">
          <Link href={`/products-catalog/${safe.slug}`}>
            <h3 className="text-base font-semibold leading-snug text-black transition-colors group-hover:text-[#9a7b1a] sm:text-lg">
              {safe.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Supplied for laboratory and non-clinical research use only.
          </p>
          <p className="mt-4 text-xl font-bold tabular-nums text-black">${safe.price.toFixed(2)}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/products-catalog/${safe.slug}`}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 bg-white px-3 text-[11px] font-semibold uppercase tracking-wide text-neutral-800 transition hover:border-black sm:flex-none sm:px-4"
            >
              View
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(safe, 1);
                showToast(`${safe.name} added to cart`, "success");
              }}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-full bg-black px-3 text-[11px] font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800 sm:flex-none sm:px-4"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ProductCatalogClient({
  products,
  apiError,
}: {
  products: Product[];
  apiError: boolean;
}) {
  const [healthCheck, setHealthCheck] = useState<{
    ok: boolean;
    status: number;
    resolvedApiUrl: string;
    healthUrl: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!apiError) return;
    let cancelled = false;
    fetch("/api/health/backend", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setHealthCheck({
          ok: Boolean(json?.ok),
          status: Number(json?.status ?? 0),
          resolvedApiUrl: String(json?.resolvedApiUrl ?? ""),
          healthUrl: String(json?.healthUrl ?? ""),
          error: json?.error ? String(json.error) : undefined,
        });
      })
      .catch((e) => {
        if (cancelled) return;
        setHealthCheck({
          ok: false,
          status: 0,
          resolvedApiUrl: "",
          healthUrl: "",
          error: e instanceof Error ? e.message : "Health check failed",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [apiError]);

  const related = useMemo(() => products.slice(0, 6), [products]);

  const heading = playfair.className;

  return (
    <div className={`${playfair.variable} bg-white text-black`}>
      <ShopPageBanner
        brandClassName={heading}
        breadcrumbLabel="Product Catalogue"
        eyebrow="Full research catalog"
        title="Product Catalogue"
        intro="Every research-grade line in one place—filter by pathway, size, and price. Spotlight picks wear a Popular badge so the bench favorites stand out."
        primaryCta={{ href: "#catalog", label: "Browse catalog" }}
        secondaryCta={{ href: "/popular-peptides", label: "Popular peptides" }}
      />

      <div className="border-b border-[#c9a227] bg-[#c9a227] py-2 text-center text-xs font-bold uppercase tracking-widest text-white">
        For Research Use Only
      </div>

      <div id="catalog" className="scroll-mt-24 mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        {apiError && (
          <div className="mb-8 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p>
              Catalog API unavailable. Check backend health at <code className="text-xs">/health</code> and verify{" "}
              <code className="text-xs">NEXT_PUBLIC_API_URL</code>.
            </p>
            {healthCheck && (
              <p className="mt-2 text-xs text-amber-950">
                Runtime API URL: <code>{healthCheck.resolvedApiUrl || "(unknown)"}</code> · Health:{" "}
                {healthCheck.ok ? "UP" : `DOWN (${healthCheck.status || "no status"})`}
                {healthCheck.error ? ` · ${healthCheck.error}` : ""}
              </p>
            )}
          </div>
        )}

        <ShopProductBrowser products={products} basePath="/products-catalog" showSpotlightBadge />
      </div>

      <section className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-16 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem]">
            Precision Peptides, Not Mass-Market
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-neutral-600 lg:text-lg">
            High-purity research compounds formulated for accuracy, consistency, and laboratory use — without fillers,
            blends, or unnecessary additives.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Research-Grade Accuracy", "Consistent analytical profiles for reproducible studies."],
              ["Verified Purity & Quality", "Batch-focused quality documentation where applicable."],
              ["Focused, Single-Compound Formulation", "Clear labeling for research traceability."],
              ["Domestic Fulfillment", "U.S.-based storage and shipping on in-stock items."],
            ].map(([t, d]) => (
              <div key={t} className="text-left">
                <h3 className="text-sm font-bold text-black sm:text-base">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-[2rem]">Related Product</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-600 sm:text-base">
            Frequently viewed alongside the catalog — same research-grade standards.
          </p>
          <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:grid-cols-4">
            {related.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Product Reviews</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
            {[
              {
                name: "James R",
                date: "Sept 12, 2025",
                text: "The product arrived in perfect condition with secure, professional packaging. Labeling was clear and matched the specifications provided on the website.",
              },
              {
                name: "Daniel Smith",
                date: "Sept 12, 2025",
                text: "From placing the order to receiving the shipment, the process was seamless. The product was well protected and arrived within the expected timeframe.",
              },
              {
                name: "Sarah L",
                date: "Sept 12, 2025",
                text: "Professional-grade product and trustworthy service. Clear documentation and transparent product details were reassuring.",
              },
            ].map((r) => (
              <blockquote
                key={r.name}
                className="flex h-full flex-col rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-sm sm:p-8"
              >
                <p className="text-base leading-relaxed text-neutral-700">&ldquo;{r.text}&rdquo;</p>
                <footer className="mt-6 border-t border-neutral-100 pt-5 text-base font-semibold text-black">
                  {r.name}
                  <span className="mt-1 block text-sm font-normal text-neutral-500 sm:ml-2 sm:mt-0 sm:inline">
                    {r.date}
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <CatalogFaq />

      <section className="border-t border-neutral-200 bg-neutral-50 py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h2 className="text-2xl font-bold md:text-3xl">Research-Grade Quality You Can Trust</h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
            Our peptide products are handled in controlled laboratory environments and developed with a strong focus on
            precision, consistency, and research integrity. Every step reflects our commitment to high-quality standards
            suitable for professional research use.
          </p>
          <ul className="mx-auto mt-8 max-w-xl space-y-2 text-left text-sm text-neutral-700">
            {[
              "Research-grade handling in controlled laboratory settings",
              "Precision testing using advanced analytical instruments",
              "Clean, controlled environments to ensure consistency",
              "Batch-level quality checks for reliability",
              "Designed strictly for research purposes",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-[#c9a227]">✓</span>
                {t}
              </li>
            ))}
          </ul>
          <Link
            href="/contact-us"
            className="mt-10 inline-block border-2 border-black px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-black hover:text-white"
          >
            Explore Full Specifications
          </Link>
        </div>
      </section>
    </div>
  );
}
