"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrder } from "@/lib/api/orders";
import { useCart } from "@/components/store/cart-context";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import {
  formatResearchAttestationForDisplay,
  isResearchUseAttestation,
  RESEARCH_USE_ATTESTATION_OPTIONS,
} from "@/lib/store/research-attestation";
import { useToast } from "@/components/store/toast-context";
import { CheckoutCrossmint } from "@/components/store/checkout-crossmint";
import { AFFILIATE_REF_STORAGE_KEY } from "@/lib/store/site-access-storage";

const CROSSMINT_CLIENT_API_KEY = (process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "").trim();

function isCrossmintConfigured(): boolean {
  return Boolean(CROSSMINT_CLIENT_API_KEY);
}

const MIN_CARD_USD = 1;
const PENDING_STORAGE_KEY = "sqspeptides_pending_checkout_v1";

type CheckoutSnapshot = {
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  researchUseAttestation: string;
  items: { productId: string; quantity: number }[];
  storeCreditToUse?: number;
  affiliateRef?: string;
  couponCode?: string;
};

type AppliedCoupon = {
  code: string;
  percentOff: number;
  discountAmount: number;
  totalAfterDiscount: number;
};

function readAffiliateRefFromStorage(): string | undefined {
  try {
    const v = localStorage.getItem(AFFILIATE_REF_STORAGE_KEY)?.trim();
    return v || undefined;
  } catch {
    return undefined;
  }
}

function validateAffiliateCredit(credit: number, balance: number, orderSub: number): string | null {
  if (credit <= 0) return null;
  if (credit > balance) return "Affiliate balance use exceeds your available earnings.";
  if (credit > orderSub + 1e-9) return "Amount exceeds order total.";
  const card = Math.round((orderSub - credit) * 100) / 100;
  if (card > 0 && card + 1e-9 < MIN_CARD_USD) {
    return `Either cover the full order ($${orderSub.toFixed(2)}) with your balance or leave at least $${MIN_CARD_USD.toFixed(2)} to pay by card.`;
  }
  return null;
}

function savePendingSnapshot(s: CheckoutSnapshot) {
  try {
    sessionStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function loadPendingSnapshot(): CheckoutSnapshot | null {
  try {
    const raw = sessionStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as CheckoutSnapshot;
    if (!p?.items?.length) return null;
    return p;
  } catch {
    return null;
  }
}

function clearPendingSnapshot() {
  try {
    sessionStorage.removeItem(PENDING_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [researchCategory, setResearchCategory] = useState("");
  const [purchaserTermsAccepted, setPurchaserTermsAccepted] = useState(false);
  const [affiliateBalance, setAffiliateBalance] = useState<number | null>(null);
  const [storeCreditToUse, setStoreCreditToUse] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFieldError, setCouponFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [payKey, setPayKey] = useState(0);
  const finalizeOnce = useRef(false);
  const checkoutSnapshotRef = useRef<CheckoutSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await fetch("/api/auth/customer/me", { cache: "no-store" });
      if (cancelled || !me.ok) return;
      const p = (await me.json()) as { email?: string; name?: string };
      setEmail((e) => e || p.email || "");
      setFullName((n) => n || p.name || "");
      const addrRes = await fetch("/api/customer/addresses", { cache: "no-store" });
      if (!addrRes.ok) return;
      const list = (await addrRes.json()) as {
        isDefault?: boolean;
        fullName: string;
        line1: string;
        city: string;
        postalCode: string;
        country: string;
      }[];
      const d = list.find((a) => a.isDefault) ?? list[0];
      if (d && !cancelled) {
        setFullName(d.fullName);
        setAddressLine1(d.line1);
        setCity(d.city);
        setPostalCode(d.postalCode);
        setCountry(d.country);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/customer/affiliate/me", { cache: "no-store" });
      if (cancelled) return;
      if (!res.ok) {
        setAffiliateBalance(null);
        return;
      }
      const data = (await res.json()) as { balance?: number };
      setAffiliateBalance(typeof data.balance === "number" ? data.balance : null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cartSig = JSON.stringify(lines.map((l) => ({ i: l.product.id, q: l.quantity })));
  useEffect(() => {
    setAppliedCoupon(null);
    setCouponFieldError(null);
  }, [cartSig]);

  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const discountedSubtotal = Math.max(0, Math.round((subtotal - couponDiscount) * 100) / 100);

  const creditAppliedForPayment =
    step === "payment" ? (checkoutSnapshotRef.current?.storeCreditToUse ?? 0) : storeCreditToUse;
  const cardDue = Math.max(0, Math.round((discountedSubtotal - creditAppliedForPayment) * 100) / 100);
  const paymentAmountStr = cardDue.toFixed(2);
  const crossmintOk = isCrossmintConfigured();
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  const finalizeOrder = useCallback(async () => {
    if (finalizeOnce.current) return;
    finalizeOnce.current = true;
    setLoading(true);
    setError(null);

    let snap = checkoutSnapshotRef.current;
    if (!snap?.items?.length) snap = loadPendingSnapshot();
    if (!snap?.items?.length) {
      finalizeOnce.current = false;
      setLoading(false);
      setError(
        "We could not find your checkout details (cart may have been cleared after payment). Open your cart and start checkout again, or contact support with your payment receipt."
      );
      return;
    }
    if (!snap.researchUseAttestation || !isResearchUseAttestation(snap.researchUseAttestation)) {
      finalizeOnce.current = false;
      setLoading(false);
      setError(
        "Your saved checkout is missing a research-use attestation. Go back to shipping, select an attestation, and continue to payment again."
      );
      return;
    }

    try {
      const order = await createOrder({
        email: snap.email,
        fullName: snap.fullName,
        addressLine1: snap.addressLine1,
        city: snap.city,
        postalCode: snap.postalCode,
        country: snap.country,
        researchUseAttestation: snap.researchUseAttestation,
        items: snap.items,
        affiliateRef: snap.affiliateRef,
        storeCreditToUse: snap.storeCreditToUse,
        couponCode: snap.couponCode,
      });
      checkoutSnapshotRef.current = null;
      clearPendingSnapshot();
      clearCart();
      router.replace(`/?checkout=success&ref=${encodeURIComponent(order.id)}`);
    } catch (err) {
      finalizeOnce.current = false;
      setPayKey((k) => k + 1);
      setError(err instanceof Error ? err.message : "Something went wrong");
      showToast("Order could not be saved. If you were charged, keep your receipt and contact support.", "error");
    } finally {
      setLoading(false);
    }
  }, [clearCart, router, showToast]);

  function validateShipping(): boolean {
    if (!email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!fullName.trim() || !addressLine1.trim() || !city.trim() || !postalCode.trim() || !country.trim()) {
      setError("Please complete all address fields.");
      return false;
    }
    const catOk = (RESEARCH_USE_ATTESTATION_OPTIONS as readonly string[]).includes(researchCategory);
    if (!researchCategory.trim() || !catOk) {
      setError("Please select a research-use attestation.");
      return false;
    }
    if (!purchaserTermsAccepted) {
      setError("Please read and accept the purchaser responsibility agreement and terms to continue.");
      return false;
    }
    if (affiliateBalance != null && affiliateBalance > 0 && storeCreditToUse > 0) {
      const msg = validateAffiliateCredit(storeCreditToUse, affiliateBalance, discountedSubtotal);
      if (msg) {
        setError(msg);
        return false;
      }
    }
    return true;
  }

  function captureSnapshot(): CheckoutSnapshot {
    const credit =
      affiliateBalance != null && affiliateBalance > 0
        ? Math.min(Math.max(0, storeCreditToUse), affiliateBalance, discountedSubtotal)
        : 0;
    return {
      email: email.trim(),
      fullName: fullName.trim(),
      addressLine1: addressLine1.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      researchUseAttestation: researchCategory,
      items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      storeCreditToUse: credit > 0 ? Math.round(credit * 100) / 100 : undefined,
      affiliateRef: readAffiliateRefFromStorage(),
      couponCode: appliedCoupon?.code,
    };
  }

  async function applyCouponCode() {
    setCouponFieldError(null);
    const raw = couponInput.trim();
    if (!raw) {
      setCouponFieldError("Enter a coupon code.");
      return;
    }
    if (lines.length === 0) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/orders/coupon-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: raw,
          items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
        }),
      });
      const data = (await res.json()) as { valid?: boolean; message?: string } & Partial<AppliedCoupon>;
      if (!res.ok) {
        setCouponFieldError(typeof data.message === "string" ? data.message : "Could not apply coupon.");
        setAppliedCoupon(null);
        return;
      }
      if (!data.valid) {
        setCouponFieldError(typeof data.message === "string" ? data.message : "Invalid coupon.");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon({
        code: data.code!,
        percentOff: data.percentOff!,
        discountAmount: data.discountAmount!,
        totalAfterDiscount: data.totalAfterDiscount!,
      });
      setCouponInput(data.code!);
    } catch {
      setCouponFieldError("Network error. Try again.");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  function goToPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!validateShipping()) return;
    const snap = captureSnapshot();
    checkoutSnapshotRef.current = snap;
    savePendingSnapshot(snap);
    finalizeOnce.current = false;
    setPayKey((k) => k + 1);
    setStep("payment");
  }

  async function placeOrderWithoutCard() {
    setError(null);
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!validateShipping()) return;
    const snap = captureSnapshot();
    checkoutSnapshotRef.current = snap;
    savePendingSnapshot(snap);
    finalizeOnce.current = false;
    await finalizeOrder();
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-neutral-600">Your cart is empty.</p>
        <Link
          href="/products-catalog"
          className="mt-4 inline-block font-semibold text-[#b8962e] hover:underline"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-black shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black";

  const summaryCard = (
    <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] lg:sticky lg:top-28">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order summary</h2>
      <p className="mt-1 text-sm text-neutral-600">
        {itemCount} {itemCount === 1 ? "item" : "items"} · Research use only
      </p>
      <ul className="mt-6 max-h-[min(50vh,28rem)] space-y-4 overflow-y-auto pr-1">
        {lines.map((l) => {
          const img = resolveProductImage(l.product);
          const lineTotal = l.product.price * l.quantity;
          return (
            <li key={l.product.id} className="flex gap-3 border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
                <Image src={img} alt="" fill className={productImageBoxClassName(img)} unoptimized sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-black">{l.product.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  ${l.product.price.toFixed(2)} each × {l.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-black">${lineTotal.toFixed(2)}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 space-y-4 border-t border-neutral-200 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Coupon code</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                setCouponFieldError(null);
              }}
              className={`${inputClass} sm:min-w-0 sm:flex-1`}
              placeholder="Enter code"
              autoComplete="off"
              disabled={couponLoading}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={couponLoading || lines.length === 0}
                onClick={() => void applyCouponCode()}
                className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
              >
                {couponLoading ? "Checking…" : "Apply"}
              </button>
              {appliedCoupon ? (
                <button
                  type="button"
                  className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponInput("");
                    setCouponFieldError(null);
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          {couponFieldError ? <p className="mt-2 text-xs text-red-600">{couponFieldError}</p> : null}
          {appliedCoupon ? (
            <p className="mt-2 text-xs text-emerald-800">
              <span className="font-semibold">{appliedCoupon.code}</span> ({appliedCoupon.percentOff}% off) saves{" "}
              <span className="tabular-nums font-semibold">${appliedCoupon.discountAmount.toFixed(2)}</span>
            </p>
          ) : null}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="tabular-nums text-black">${subtotal.toFixed(2)}</span>
          </div>
          {couponDiscount > 0 ? (
            <div className="flex justify-between text-emerald-800">
              <span>Coupon</span>
              <span className="tabular-nums">−${couponDiscount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className="text-neutral-500">Calculated at fulfillment</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-black">
            <span>Total</span>
            <span className="tabular-nums">${discountedSubtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {step === "payment" ? (
        <div className="mt-6 rounded-xl bg-neutral-50 p-4 text-xs text-neutral-600">
          <p className="font-semibold uppercase tracking-wide text-neutral-800">Ship to</p>
          <p className="mt-2 leading-relaxed">
            {fullName}
            <br />
            {addressLine1}
            <br />
            {city}, {postalCode}
            <br />
            {country}
            <br />
            <span className="text-neutral-500">{email}</span>
          </p>
          <p className="mt-3 border-t border-neutral-200 pt-3 text-neutral-700">
            <span className="font-semibold text-neutral-800">Research / legal attestation:</span>{" "}
            {formatResearchAttestationForDisplay(researchCategory)}
          </p>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5 lg:order-2">{summaryCard}</div>

      <div className="lg:col-span-7 lg:order-1">
        {step === "shipping" ? (
          <form onSubmit={goToPayment} className="space-y-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Contact & shipping</h2>
              <p className="mt-2 text-sm text-neutral-600">
                We use this for order updates and compliance. On the next step you will complete a secure card payment; your
                order stays under this contact information.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Full name</span>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Street address</span>
                <input
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={inputClass}
                  autoComplete="address-line1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-neutral-800">City</span>
                <input required value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} autoComplete="address-level2" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-neutral-800">Postal code</span>
                <input
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={inputClass}
                  autoComplete="postal-code"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Country</span>
                <input required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} autoComplete="country-name" />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Research-use attestation</span>
                <span className="mt-1 block text-xs text-neutral-500">
                  Required — identify the context of your research use.
                </span>
                <select
                  required
                  value={researchCategory}
                  onChange={(e) => setResearchCategory(e.target.value)}
                  className={inputClass}
                  aria-required="true"
                >
                  <option value="" disabled>
                    Select one…
                  </option>
                  {RESEARCH_USE_ATTESTATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              {affiliateBalance != null && affiliateBalance > 0 ? (
                <div className="block sm:col-span-2 rounded-xl border border-emerald-200/90 bg-emerald-50/50 p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-900">Affiliate balance</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-950">${affiliateBalance.toFixed(2)}</p>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-900/85">
                    Signed-in customers may apply earnings toward this order. Paying by card? Either cover the full order with
                    balance or leave at least ${MIN_CARD_USD.toFixed(2)} for the card charge.
                  </p>
                  <label className="mt-3 block">
                    <span className="text-sm font-medium text-neutral-800">Apply toward order (USD)</span>
                    <input
                      type="number"
                      min={0}
                      max={Math.min(affiliateBalance, discountedSubtotal)}
                      step="0.01"
                      value={storeCreditToUse === 0 ? "" : storeCreditToUse}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setStoreCreditToUse(Number.isFinite(v) ? Math.max(0, v) : 0);
                      }}
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-[#b8962e] hover:underline"
                    onClick={() =>
                      setStoreCreditToUse(Math.round(Math.min(affiliateBalance, discountedSubtotal) * 100) / 100)
                    }
                  >
                    Use max (${Math.min(affiliateBalance, discountedSubtotal).toFixed(2)})
                  </button>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-neutral-200/90 bg-gradient-to-b from-amber-50/50 via-white to-white p-5 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.08)] sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a7b1a]">Privacy &amp; agreement</p>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
                Your personal data will be used to process your order, support your experience throughout this website, and for
                other purposes described in our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-[#9a7b1a] underline decoration-[#D4AF37]/60 underline-offset-2 transition hover:text-black"
                >
                  privacy policy
                </Link>
                . Returns and refunds are limited for research materials; see our{" "}
                <Link
                  href="/refund-policy"
                  className="font-semibold text-[#9a7b1a] underline decoration-[#D4AF37]/60 underline-offset-2 transition hover:text-black"
                >
                  refund policy
                </Link>
                .
              </p>

              <div className="mt-6 flex gap-3.5 border-t border-neutral-200/90 pt-6">
                <input
                  id="checkout-purchaser-terms"
                  type="checkbox"
                  name="purchaserTerms"
                  required
                  checked={purchaserTermsAccepted}
                  onChange={(e) => setPurchaserTermsAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-2 border-neutral-400 bg-white text-black accent-[#D4AF37] checked:border-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2"
                  aria-required="true"
                />
                <label
                  htmlFor="checkout-purchaser-terms"
                  className="cursor-pointer select-none text-[11px] font-semibold uppercase leading-snug tracking-wide text-neutral-800 sm:text-[12px]"
                >
                  Purchaser responsibility: By purchasing, I accept full responsibility for safe, lawful, research-only use and
                  acknowledge that SubQ Scientist LLC bears no liability for misuse. I agree to indemnify and hold
                  harmless SubQ Scientist LLC from any claim. I also attest that I am a qualified researcher (at least
                  21 years of age) and I will not use these products for human, veterinary, or non-research use. I also
                  acknowledge and accept the purchaser responsibility agreement and{" "}
                  <Link
                    href="/terms"
                    className="font-bold text-[#9a7b1a] underline decoration-[#D4AF37]/60 underline-offset-2 transition hover:text-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    terms and conditions
                  </Link>{" "}
                  *
                </label>
              </div>
              {!purchaserTermsAccepted ? (
                <p className="mt-3 text-xs text-neutral-500">You must check the box above to continue to payment.</p>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            ) : null}

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#D4AF37] px-10 text-sm font-bold text-black shadow-sm transition hover:bg-[#c9a432]"
              >
                Continue to payment
              </button>
              <Link href="/cart" className="text-sm font-medium text-neutral-600 hover:text-black hover:underline">
                ← Back to cart
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Secure payment</h2>
              {creditAppliedForPayment > 0 ? (
                <p className="mt-2 text-sm text-emerald-900">
                  Applying{" "}
                  <span className="font-bold tabular-nums">${creditAppliedForPayment.toFixed(2)}</span> from your affiliate
                  balance.
                </p>
              ) : null}
              {cardDue <= 0 ? (
                <p className="mt-2 text-sm text-neutral-600">
                  No card payment required. Click <strong>Complete order</strong> below to place your order.
                </p>
              ) : (
                <p className="mt-2 text-sm text-neutral-600">
                  Amount due by card{" "}
                  <span className="font-bold tabular-nums text-black">${paymentAmountStr}</span> — processed securely. Your
                  order will be recorded for <span className="font-medium text-black">{email}</span> after payment succeeds.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6">
              {cardDue <= 0 ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void finalizeOrder()}
                  className="w-full rounded-full bg-[#D4AF37] py-3 text-sm font-bold text-black shadow-sm transition hover:bg-[#c9a432] disabled:opacity-50"
                >
                  {loading ? "Placing order…" : "Complete order"}
                </button>
              ) : crossmintOk ? (
                <CheckoutCrossmint
                  key={payKey}
                  clientApiKey={CROSSMINT_CLIENT_API_KEY}
                  amountUsd={paymentAmountStr}
                  disabled={loading}
                  onPaymentComplete={() => void finalizeOrder()}
                />
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                  <p className="font-semibold">Card checkout not configured</p>
                  <p className="mt-2 text-amber-900/90">
                    Add the public and server payment keys in your environment to enable card payments from checkout.
                  </p>
                </div>
              )}

              {!crossmintOk && cardDue > 0 && (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void placeOrderWithoutCard()}
                  className="mt-4 w-full rounded-lg border-2 border-dashed border-neutral-400 py-3 text-sm font-semibold text-neutral-700 hover:bg-white disabled:opacity-50"
                >
                  {loading ? "Placing order…" : "Place order without card (development only)"}
                </button>
              )}
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
            ) : null}

            {loading ? (
              <p className="text-center text-sm font-medium text-neutral-600">Saving your order…</p>
            ) : null}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("shipping");
                setError(null);
              }}
              className="text-sm font-medium text-neutral-600 hover:text-black hover:underline"
            >
              ← Edit shipping details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
