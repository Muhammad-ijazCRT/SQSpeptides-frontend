"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";
import { useCart } from "@/components/store/cart-context";
import { useToast } from "@/components/store/toast-context";
import { addWishlistProduct } from "@/lib/api/customer-portal";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { normalizeProduct } from "@/lib/store/normalize-product";
import { looksLikeHtml } from "@/lib/store/strip-html";
import type { Product } from "@/lib/store/types";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-detail-serif",
});

function Stars({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)));
  return (
    <div className="flex items-center gap-1.5" aria-label={`${rating} out of 5 stars`}>
      <div className="flex text-[#D4AF37] text-base drop-shadow-[0_1px_3px_rgba(212,175,55,0.4)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="leading-none">
            {i < full ? "★" : "☆"}
          </span>
        ))}
      </div>
      <span className="text-xs font-bold text-neutral-800">
        {rating.toFixed(1)} <span className="font-medium text-neutral-500">· Analytical Lot Verified</span>
      </span>
    </div>
  );
}

export function ProductDetailShell({
  product,
  relatedProducts = [],
}: {
  product: Product;
  relatedProducts?: Product[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();

  const safe = useMemo(() => normalizeProduct(product) ?? product, [product]);
  const img = useMemo(() => resolveProductImage(safe), [safe]);

  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [coaModalOpen, setCoaModalOpen] = useState(false);
  const [coaSubmitted, setCoaSubmitted] = useState(false);
  const [coaEmail, setCoaEmail] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Monitor BuyBox position for mobile sticky bottom action bar
  useEffect(() => {
    const el = buyBoxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Bulk discount calculation
  const unitPrice = safe.price;
  const discountMultiplier = qty >= 5 ? 0.9 : qty >= 3 ? 0.95 : 1.0;
  const effectiveUnitPrice = unitPrice * discountMultiplier;
  const subtotal = effectiveUnitPrice * qty;

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    addItem(safe, qty);
    showToast(
      qty > 1 ? `${qty} × ${safe.name} added to cart` : `${safe.name} added to cart`,
      "success"
    );
  };

  const handleInstantBuy = () => {
    addItem(safe, qty);
    router.push("/checkout");
  };

  const handleToggleWishlist = async () => {
    if (wishlistBusy) return;
    setWishlistBusy(true);
    try {
      await addWishlistProduct(safe.id);
      setIsWishlisted(true);
      showToast(`${safe.name} saved to wishlist`, "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not add to wishlist";
      if (msg === "Unauthorized") {
        showToast("Please sign in to save items to your wishlist", "error");
        return;
      }
      showToast(msg, "error");
    } finally {
      setWishlistBusy(false);
    }
  };

  const handleCoaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coaEmail.trim()) return;
    setCoaSubmitted(true);
    setTimeout(() => {
      setCoaModalOpen(false);
      setCoaSubmitted(false);
      setCoaEmail("");
      showToast(`COA for ${safe.name} requested. Our analytical team will email you shortly.`, "success");
    }, 1500);
  };

  return (
    <div className={`${playfair.variable} w-full max-w-full overflow-x-hidden bg-white text-black`}>
      <div className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500 sm:text-sm">
          <Link href="/" className="transition hover:text-black hover:underline">
            Home
          </Link>
          <span className="text-neutral-300">/</span>
          <Link href="/products-catalog" className="transition hover:text-black hover:underline">
            Product Catalog
          </Link>
          {safe.category ? (
            <>
              <span className="text-neutral-300">/</span>
              <Link
                href={`/products-catalog?cat=${encodeURIComponent(safe.category.slug)}`}
                className="transition hover:text-black hover:underline"
              >
                {safe.category.name}
              </Link>
            </>
          ) : null}
          <span className="text-neutral-300">/</span>
          <span className="truncate max-w-[200px] sm:max-w-xs font-semibold text-neutral-900" title={safe.name}>
            {safe.name}
          </span>
        </nav>

        {/* Main Grid: Gallery Card on Left, Unified Purchase Suite Card on Right */}
        <div className="grid w-full max-w-full gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Gallery Card & Quick Specs */}
          {/* ========================================================= */}
          <div className="w-full lg:col-span-6 xl:col-span-6 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-4 sm:p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] transition duration-500 hover:shadow-[0_12px_36px_-6px_rgba(212,175,55,0.12)]">
              {/* Product Badges */}
              <div className="absolute left-6 top-6 z-10 flex flex-col items-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-black/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] backdrop-blur-md shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  99.9% Purity
                </span>
                {safe.spotlight ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    ★ Bench Favorite
                  </span>
                ) : null}
              </div>

              {/* Lightbox Trigger Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-6 top-6 z-10 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur-md transition hover:bg-neutral-900 hover:text-white"
                title="Expand image in high resolution"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Zoom</span>
              </button>

              {/* Main Image Frame with Smooth Micro-Hover */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl bg-white ring-1 ring-neutral-200/70"
              >
                <Image
                  src={img}
                  alt={safe.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, (max-width: 1535px) 50vw, 680px"
                  className={productImageBoxClassName(img, "transition duration-700 ease-out group-hover:scale-105")}
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Unified Outer Card with Nested Inner Cards */}
          {/* ========================================================= */}
          <div className="w-full lg:col-span-6 xl:col-span-6">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]">
              {/* Header Info & Badges Row */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-[#9a7b1a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    {safe.category?.name ?? "Metabolic Research Peptides"}
                  </span>

                  {/* Prominent Featured Bootstrap-Style Badge */}
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-[#9a7b1a] shadow-xs">
                    <span>★</span> Featured
                  </span>
                </div>

                {/* Ready to Ship Pulse Beacon */}
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  In Stock · Ready to Ship
                </div>
              </div>

              {/* Product Title with Professional Typography */}
              <h1 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-3xl lg:text-[2.5rem]">
                {safe.name}
              </h1>

              {/* Star Rating & COA Link */}
              <div className="mt-3.5 flex flex-wrap items-center gap-3.5 border-b border-neutral-200/80 pb-5">
                <Stars rating={safe.rating} />
                <span className="text-neutral-300">|</span>
                <button
                  type="button"
                  onClick={() => setCoaModalOpen(true)}
                  className="text-xs font-bold text-[#b8962e] hover:text-black hover:underline"
                >
                  Request Certificate of Analysis (COA)
                </button>
              </div>

              {/* NESTED INNER CARD 1: Price Box & Volume Tiers & Buy Controls */}
              <div className="mt-5 rounded-xl border border-neutral-200/90 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tabular-nums tracking-tight text-neutral-950 sm:text-4xl">
                      ${effectiveUnitPrice.toFixed(2)}
                    </span>
                    {qty >= 3 ? (
                      <span className="text-sm font-medium text-neutral-400 line-through">
                        ${unitPrice.toFixed(2)}
                      </span>
                    ) : null}
                    <span className="text-xs font-semibold text-neutral-500">/ vial</span>
                  </div>
                  {qty >= 3 ? (
                    <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      {qty >= 5 ? "10% Volume Tier Active" : "5% Volume Tier Active"}
                    </span>
                  ) : null}
                </div>

                {/* Clickable Volume Discount Buttons */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-neutral-50 p-2 text-center ring-1 ring-neutral-200/70 text-xs">
                  {/* Tier 1: 1-2 vials -> sets quantity to 1 */}
                  <button
                    type="button"
                    onClick={() => setQty(1)}
                    className={`cursor-pointer rounded-lg p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                      qty < 3
                        ? "bg-neutral-950 font-bold text-white shadow-sm scale-[1.02]"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 hover:text-black"
                    }`}
                  >
                    <p className="font-bold">1 – 2 vials</p>
                    <p className="text-[11px] opacity-85 mt-0.5">${unitPrice.toFixed(2)} ea</p>
                  </button>

                  {/* Tier 2: 3-4 vials -> sets quantity to 3 */}
                  <button
                    type="button"
                    onClick={() => setQty(3)}
                    className={`cursor-pointer rounded-lg p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                      qty >= 3 && qty < 5
                        ? "bg-[#D4AF37] font-extrabold text-black shadow-sm scale-[1.02]"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 hover:text-black"
                    }`}
                  >
                    <p className="font-bold">3 – 4 vials</p>
                    <p className="text-[11px] opacity-90 mt-0.5">5% OFF (${(unitPrice * 0.95).toFixed(2)})</p>
                  </button>

                  {/* Tier 3: 5+ vials -> sets quantity to 5 */}
                  <button
                    type="button"
                    onClick={() => setQty(5)}
                    className={`cursor-pointer rounded-lg p-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                      qty >= 5
                        ? "bg-[#D4AF37] font-extrabold text-black shadow-sm scale-[1.02]"
                        : "bg-white text-neutral-700 hover:bg-neutral-100 hover:text-black"
                    }`}
                  >
                    <p className="font-bold">5+ vials</p>
                    <p className="text-[11px] opacity-90 mt-0.5">10% OFF (${(unitPrice * 0.9).toFixed(2)})</p>
                  </button>
                </div>

                {/* Interactive Quantity Selector (with Direct Number Input) & Buy Controls */}
                <div ref={buyBoxRef} className="mt-5 flex flex-col gap-3.5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Stepper with Direct Editable Numeric Input */}
                    <div className="flex items-center justify-between sm:justify-start rounded-xl border border-neutral-300 bg-white p-1 shadow-xs">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-30 active:scale-95"
                      >
                        −
                      </button>

                      {/* Direct numeric input so users can type 100 or any custom amount */}
                      <input
                        type="number"
                        min={1}
                        max={999}
                        value={qty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (isNaN(val)) {
                            setQty(1);
                          } else {
                            setQty(Math.max(1, Math.min(999, val)));
                          }
                        }}
                        onBlur={() => {
                          if (!qty || qty < 1) setQty(1);
                        }}
                        className="w-14 text-center text-base font-bold tabular-nums text-neutral-900 outline-none border-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Product quantity input"
                      />

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty((q) => Math.min(999, q + 1))}
                        disabled={qty >= 999}
                        className="flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold text-neutral-800 transition hover:bg-neutral-100 disabled:opacity-30 active:scale-95"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart()}
                      className="group relative flex min-h-12 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-neutral-950 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md transition duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-lg active:scale-[0.99]"
                    >
                      <svg className="h-4 w-4 transition group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span>Add {qty > 1 ? `${qty} Vials` : "to Cart"} · ${subtotal.toFixed(2)}</span>
                    </button>

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      disabled={wishlistBusy}
                      aria-label={isWishlisted ? "Saved to wishlist" : "Add to wishlist"}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-white text-neutral-700 transition hover:border-black hover:text-black ${
                        isWishlisted ? "border-rose-400 bg-rose-50 text-rose-600" : ""
                      }`}
                      title={isWishlisted ? "In your wishlist" : "Save to wishlist"}
                    >
                      <svg className={`h-5 w-5 ${isWishlisted ? "fill-rose-600 text-rose-600" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Instant Checkout Button */}
                  <button
                    type="button"
                    onClick={handleInstantBuy}
                    className="w-full rounded-xl border-2 border-neutral-900 bg-transparent py-3 text-xs font-bold uppercase tracking-wider text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                  >
                    Buy Now &amp; Checkout Fast
                  </button>
                </div>

                {/* Research Attestation Warning inside Card */}
                <div className="mt-4 rounded-xl border border-amber-300/80 bg-amber-50/70 p-3.5 text-xs leading-relaxed text-amber-950">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-600 text-sm font-bold" aria-hidden>
                      ⚠
                    </span>
                    <p>
                      <strong>Laboratory Attestation:</strong> Supplied exclusively for in-vitro, analytical, or scientific R&amp;D. Strictly not for human or veterinary administration.
                    </p>
                  </div>
                </div>
              </div>

              {/* NESTED INNER CARD 2: Quality & Fulfillment Feature Cards */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="group rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-lg text-[#9a7b1a] transition-colors group-hover:bg-[#D4AF37] group-hover:text-black">
                    🔬
                  </span>
                  <p className="mt-2 text-xs font-bold text-neutral-900">≥99.0% Purity</p>
                  <p className="text-[11px] font-medium text-neutral-500">HPLC batch verified</p>
                </div>

                <div className="group rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-lg text-[#9a7b1a] transition-colors group-hover:bg-[#D4AF37] group-hover:text-black">
                    🛡️
                  </span>
                  <p className="mt-2 text-xs font-bold text-neutral-900">Vacuum Sealed</p>
                  <p className="text-[11px] font-medium text-neutral-500">Inert nitrogen purge</p>
                </div>

                <div className="group rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-lg text-[#9a7b1a] transition-colors group-hover:bg-[#D4AF37] group-hover:text-black">
                    ⚡
                  </span>
                  <p className="mt-2 text-xs font-bold text-neutral-900">Fast Shipping</p>
                  <p className="text-[11px] font-medium text-neutral-500">Dispatches in 24–48h</p>
                </div>

                <div className="group rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_20px_rgba(212,175,55,0.15)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-lg text-[#9a7b1a] transition-colors group-hover:bg-[#D4AF37] group-hover:text-black">
                    📋
                  </span>
                  <p className="mt-2 text-xs font-bold text-neutral-900">COA Available</p>
                  <p className="text-[11px] font-medium text-neutral-500">Lot traceability</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SIMULTANEOUS DUAL DOSSIER ROW: Description (col-7) & Quality Assurance & COA (col-5) */}
        {/* ========================================================= */}
        <div className="mt-14 w-full max-w-full border-t border-neutral-200/80 pt-10 lg:pt-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 xl:gap-10 items-stretch">
            {/* LEFT / COL-7: Dynamic Description from Database */}
            <div className="w-full lg:col-span-7 flex flex-col">
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(212,175,55,0.12)] hover:border-[#D4AF37]/50 flex flex-col justify-between">
                {/* Decorative Subtle Gold Top Edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#ecd57b] to-transparent opacity-90"
                  aria-hidden
                />

                <div>
                  {/* Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-xl font-bold text-[#9a7b1a] shadow-xs">
                        <svg className="h-5 w-5 text-[#9a7b1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </span>
                      <div>
                        <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-neutral-950">
                          Description &amp; Specifications
                        </h2>
                        <p className="text-xs font-medium text-neutral-500">
                          Official catalog profile &amp; verified laboratory parameters
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-[11px] font-semibold text-neutral-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Analytical Monograph
                    </span>
                  </div>

                  {/* Description Body - Dynamic from DB */}
                  <div className="break-words text-neutral-800 leading-relaxed [overflow-wrap:anywhere]">
                    {safe.description ? (
                      looksLikeHtml(safe.description) ? (
                        <div
                          className="product-description prose prose-neutral max-w-none text-sm sm:text-base leading-relaxed text-neutral-800 [&_a]:text-[#9a7b1a] [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-neutral-950 [&_h2]:font-serif [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-neutral-950 [&_h3]:font-serif [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-neutral-900 [&_li]:my-1.5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3.5 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-neutral-950"
                          dangerouslySetInnerHTML={{ __html: safe.description }}
                        />
                      ) : (
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line text-neutral-800">
                          {safe.description}
                        </p>
                      )
                    ) : (
                      <p className="text-sm sm:text-base leading-relaxed text-neutral-700">
                        <strong className="text-neutral-950 font-bold">{safe.name}</strong> is synthesized with precise molecular integrity and verified via rigorous chromatographic screening. Each unit is delivered lyophilized as a high-purity laboratory reference standard, prepared strictly for qualified in-vitro scientific research.
                      </p>
                    )}
                  </div>
                </div>

                {/* Laboratory Quick Specification Badges at bottom of Description */}
                <div className="mt-8 pt-5 border-t border-neutral-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#9a7b1a] mb-3">
                    Compound Reference Parameters
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2.5 transition hover:border-[#D4AF37]/50 hover:bg-white">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Physical State</span>
                      <span className="text-xs font-bold text-neutral-900 mt-0.5 block truncate">Lyophilized Solid</span>
                    </div>
                    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2.5 transition hover:border-[#D4AF37]/50 hover:bg-white">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Purity Standard</span>
                      <span className="text-xs font-bold text-neutral-900 mt-0.5 block truncate">≥ 99.0% (HPLC)</span>
                    </div>
                    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2.5 transition hover:border-[#D4AF37]/50 hover:bg-white">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Optimal Storage</span>
                      <span className="text-xs font-bold text-neutral-900 mt-0.5 block truncate">−20°C Desiccated</span>
                    </div>
                    <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 p-2.5 transition hover:border-[#D4AF37]/50 hover:bg-white">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">Application</span>
                      <span className="text-xs font-bold text-neutral-900 mt-0.5 block truncate">In-Vitro R&amp;D Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT / COL-5: Quality Assurance & COA Card */}
            <div className="w-full lg:col-span-5 flex flex-col">
              <div className="relative flex-1 overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_32px_-6px_rgba(212,175,55,0.12)] hover:border-[#D4AF37]/50 flex flex-col justify-between">
                {/* Decorative Subtle Gold Top Edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#ecd57b] opacity-90"
                  aria-hidden
                />

                <div className="relative z-10">
                  {/* Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-xl font-bold text-[#9a7b1a] shadow-xs">
                        <svg className="h-5 w-5 text-[#9a7b1a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <div>
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-950 tracking-tight">
                          Quality Assurance &amp; COA
                        </h3>
                        <p className="text-xs font-semibold text-[#9a7b1a]">
                          Batch-Specific HPLC &amp; MS Verification
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      100% Lot Verified
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-neutral-600">
                    Every synthesized batch of <strong className="text-neutral-950 font-bold">{safe.name}</strong> undergoes rigorous analytical chromatography before catalog release.
                  </p>

                  {/* Verification Key Points (White Card Treatment) */}
                  <div className="mt-5 space-y-3 text-xs sm:text-sm">
                    {/* Item 1 */}
                    <div className="group flex items-start gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 transition-all duration-200 hover:border-[#D4AF37]/60 hover:bg-amber-50/30">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#9a7b1a] font-black text-sm transition group-hover:bg-[#D4AF37] group-hover:text-black">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-neutral-900 block">Reverse-Phase HPLC Verified</span>
                        <span className="text-neutral-600 text-xs leading-normal">Purity confirmed ≥ 99.0% with zero unknown chromatographic peaks.</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="group flex items-start gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 transition-all duration-200 hover:border-[#D4AF37]/60 hover:bg-amber-50/30">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#9a7b1a] font-black text-sm transition group-hover:bg-[#D4AF37] group-hover:text-black">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-neutral-900 block">Mass Spectrometry (MS)</span>
                        <span className="text-neutral-600 text-xs leading-normal">Precise molecular weight verification matches empirical peptide identity.</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="group flex items-start gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 transition-all duration-200 hover:border-[#D4AF37]/60 hover:bg-amber-50/30">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/15 text-[#9a7b1a] font-black text-sm transition group-hover:bg-[#D4AF37] group-hover:text-black">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-neutral-900 block">Lot Traceability &amp; Archival</span>
                        <span className="text-neutral-600 text-xs leading-normal">Lot numbers printed on vials link directly to archived analytical data.</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Trust Metrics Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 text-center text-xs">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-950">≥ 99.0%</p>
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight">HPLC Purity</p>
                    </div>
                    <div className="border-x border-neutral-200/80">
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-950">0.22 μm</p>
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight">Filtered</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-neutral-950">&lt;0.01 EU</p>
                      <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-tight">Endotoxin</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Request COA CTA Button */}
                <div className="relative z-10 mt-6 pt-5 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setCoaModalOpen(true)}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black shadow-sm transition-all duration-300 hover:bg-[#c9a22f] hover:shadow-[0_4px_16px_rgba(212,175,55,0.35)] active:scale-[0.99]"
                  >
                    <span>Request COA for {safe.name}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1 font-bold">→</span>
                  </button>
                  <p className="mt-2.5 text-center text-[11px] font-medium text-neutral-500 flex items-center justify-center gap-1.5">
                    <svg className="h-3 w-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    PDF documentation dispatched to verified institutional emails within 12–24h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RELATED PRODUCTS SECTION */}
        {/* ========================================================= */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-neutral-200 pt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7b1a]">Catalog Showcase</p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-neutral-950 sm:text-3xl">
                  Related Research Compounds
                </h3>
              </div>
              <Link
                href="/products-catalog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9a7b1a] hover:text-black hover:underline"
              >
                <span>View Full Catalog</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rel) => {
                const relImg = resolveProductImage(rel);
                return (
                  <article
                    key={rel.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-xl"
                  >
                    <Link
                      href={`/products-catalog/${rel.slug}`}
                      className="relative aspect-square w-full overflow-hidden bg-neutral-50"
                    >
                      <Image
                        src={relImg}
                        alt={rel.name}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className={productImageBoxClassName(relImg, "transition duration-500 group-hover:scale-105")}
                        unoptimized
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-neutral-200 bg-white/90 px-2 py-0.5 text-[10px] font-bold text-neutral-700 backdrop-blur-md">
                        99.9% Purity
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <Link href={`/products-catalog/${rel.slug}`}>
                        <h4 className="font-serif text-base font-bold text-neutral-950 transition group-hover:text-[#9a7b1a] line-clamp-1">
                          {rel.name}
                        </h4>
                      </Link>
                      <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
                        {rel.category?.name ?? "Research peptide vial"}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                        <span className="text-lg font-extrabold tabular-nums text-neutral-900">
                          ${rel.price.toFixed(2)}
                        </span>
                        <Link
                          href={`/products-catalog/${rel.slug}`}
                          className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#D4AF37] hover:text-black"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOBILE STICKY BOTTOM BAR (Appears on scroll) */}
      {/* ========================================================= */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-md transition-all duration-300 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)] ${
          showStickyBar ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <Image src={img} alt={safe.name} fill className="object-contain p-1" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-neutral-900">{safe.name}</p>
              <p className="text-sm font-extrabold text-[#9a7b1a]">${effectiveUnitPrice.toFixed(2)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleAddToCart()}
            className="shrink-0 rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#D4AF37] hover:text-black"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* HIGH-RES LIGHTBOX MODAL */}
      {/* ========================================================= */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900/70 text-white transition hover:bg-neutral-900"
              aria-label="Close lightbox"
            >
              ✕
            </button>
            <div className="relative aspect-square w-full">
              <Image src={img} alt={safe.name} fill className="object-contain" unoptimized />
            </div>
            <p className="mt-3 text-center text-xs font-semibold text-neutral-500">
              {safe.name} · Laboratory Inspection View
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* COA REQUEST MODAL */}
      {/* ========================================================= */}
      {coaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setCoaModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setCoaModalOpen(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-black"
              aria-label="Close modal"
            >
              ✕
            </button>
            <h3 className="font-serif text-xl font-bold text-neutral-950">
              Request Certificate of Analysis
            </h3>
            <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
              We provide lot-specific HPLC and Mass Spectrometry analytical reports for verified laboratories. Enter your research email below.
            </p>

            <form onSubmit={handleCoaSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700" htmlFor="coa-sku">
                  Product / SKU
                </label>
                <input
                  id="coa-sku"
                  readOnly
                  value={safe.name}
                  className="mt-1 w-full rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700" htmlFor="coa-email">
                  Laboratory / Professional Email
                </label>
                <input
                  id="coa-email"
                  type="email"
                  required
                  placeholder="researcher@university.edu"
                  value={coaEmail}
                  onChange={(e) => setCoaEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <button
                type="submit"
                disabled={coaSubmitted}
                className="w-full rounded-xl bg-neutral-950 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#D4AF37] hover:text-black disabled:opacity-50"
              >
                {coaSubmitted ? "Requesting Document…" : "Send Analytical COA"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
