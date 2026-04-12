"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrder } from "@/lib/api/orders";
import { useCart } from "@/components/store/cart-context";
import { productImageBoxClassName, resolveProductImage } from "@/lib/store/catalog-image";
import { isResearchUseAttestation, RESEARCH_USE_ATTESTATION_OPTIONS } from "@/lib/store/research-attestation";
import { useToast } from "@/components/store/toast-context";
import { CheckoutCrossmint } from "@/components/store/checkout-crossmint";
import { CheckoutPaymentMethodSelector } from "@/components/store/checkout-payment-method-selector";
import {
  readCheckoutGateway,
  writeCheckoutGateway,
  type CheckoutPaymentGateway,
} from "@/lib/store/checkout-payment-gateway";
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

function validateAffiliateCreditForGateway(
  credit: number,
  balance: number,
  orderSub: number,
  gateway: ReturnType<typeof readCheckoutGateway>
): string | null {
  if (gateway === "crypto") {
    if (credit > 0) {
      return "Cryptocurrency checkout cannot use affiliate balance. Set applied balance to zero or choose Pay with card above.";
    }
    return null;
  }
  return validateAffiliateCredit(credit, balance, orderSub);
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
  const { lines, subtotal, clearCart, setQuantity, removeLine } = useCart();
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
  const [payKey, setPayKey] = useState(0);
  const [payGateway, setPayGateway] = useState<CheckoutPaymentGateway>("crossmint");
  const [npAvailable, setNpAvailable] = useState<boolean | null>(null);
  const finalizeOnce = useRef(false);
  const checkoutSnapshotRef = useRef<CheckoutSnapshot | null>(null);

  /** Autofill/password managers often update the DOM without firing `onChange`, so controlled state can stay empty. */
  const emailRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const addressLine1Ref = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const researchCategoryRef = useRef<HTMLSelectElement>(null);

  function inputTrim(ref: RefObject<HTMLInputElement | null>, state: string): string {
    return (ref.current?.value ?? state).trim();
  }

  function selectTrim(ref: RefObject<HTMLSelectElement | null>, state: string): string {
    return (ref.current?.value ?? state).trim();
  }

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/checkout/nowpayments/availability", { cache: "no-store" });
      if (cancelled) return;
      if (!res.ok) {
        setNpAvailable(false);
        return;
      }
      const data = (await res.json()) as { enabled?: boolean };
      if (!cancelled) setNpAvailable(Boolean(data.enabled));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPayGateway(readCheckoutGateway());
  }, []);

  function selectPayGateway(g: CheckoutPaymentGateway) {
    setPayGateway(g);
    writeCheckoutGateway(g);
  }

  const cartSig = JSON.stringify(lines.map((l) => ({ i: l.product.id, q: l.quantity })));
  useEffect(() => {
    setAppliedCoupon(null);
    setCouponFieldError(null);
  }, [cartSig]);

  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const discountedSubtotal = Math.max(0, Math.round((subtotal - couponDiscount) * 100) / 100);

  const creditApplied =
    affiliateBalance != null && affiliateBalance > 0
      ? Math.min(Math.max(0, storeCreditToUse), affiliateBalance, discountedSubtotal)
      : 0;
  const cardDue = Math.max(0, Math.round((discountedSubtotal - creditApplied) * 100) / 100);
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
        "We could not find your checkout details (your bag may have been cleared after payment). Return to checkout from the shop, or contact support with your payment receipt."
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

  const startCryptoCheckout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (!prepareSnapshotForPayment()) {
        setLoading(false);
        return;
      }
      let snap = checkoutSnapshotRef.current;
      if (!snap?.items?.length) snap = loadPendingSnapshot();
      if (!snap?.items?.length) {
        setError(
          "We could not find your checkout details. Return to checkout from the shop, or contact support with your order reference."
        );
        return;
      }
      if (!snap.researchUseAttestation || !isResearchUseAttestation(snap.researchUseAttestation)) {
        setError("Your saved checkout is missing a research-use attestation. Go back to shipping and try again.");
        return;
      }
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
        couponCode: snap.couponCode,
        paymentProvider: "nowpayments",
      });
      const inv = await fetch("/api/checkout/nowpayments/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, email: snap.email }),
      });
      const invData = (await inv.json().catch(() => ({}))) as {
        message?: string | string[];
        invoiceUrl?: string;
      };
      if (!inv.ok) {
        const m = Array.isArray(invData.message)
          ? invData.message.join(", ")
          : typeof invData.message === "string"
            ? invData.message
            : "Could not start cryptocurrency payment.";
        throw new Error(m);
      }
      const url = typeof invData.invoiceUrl === "string" ? invData.invoiceUrl : "";
      if (!url) throw new Error("Payment provider did not return a URL.");
      checkoutSnapshotRef.current = null;
      clearPendingSnapshot();
      clearCart();
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cryptocurrency checkout failed.");
      showToast("If an order was created, keep your reference email; contact support if payment cannot continue.", "error");
    } finally {
      setLoading(false);
    }
  }, [clearCart, showToast]);

  function validateShipping(): boolean {
    const emailVal = inputTrim(emailRef, email);
    const fullNameVal = inputTrim(fullNameRef, fullName);
    const addressVal = inputTrim(addressLine1Ref, addressLine1);
    const cityVal = inputTrim(cityRef, city);
    const postalVal = inputTrim(postalCodeRef, postalCode);
    const countryVal = inputTrim(countryRef, country);
    const researchVal = selectTrim(researchCategoryRef, researchCategory);

    if (!emailVal) {
      setError("Email is required.");
      return false;
    }
    if (!fullNameVal || !addressVal || !cityVal || !postalVal || !countryVal) {
      setError("Please complete all address fields.");
      return false;
    }
    const catOk = (RESEARCH_USE_ATTESTATION_OPTIONS as readonly string[]).includes(researchVal);
    if (!researchVal || !catOk) {
      setError("Please select a research-use attestation.");
      return false;
    }
    if (!purchaserTermsAccepted) {
      setError("Please read and accept the purchaser responsibility agreement and terms to continue.");
      return false;
    }
    if (affiliateBalance != null && affiliateBalance > 0 && storeCreditToUse > 0) {
      const msg = validateAffiliateCreditForGateway(
        storeCreditToUse,
        affiliateBalance,
        discountedSubtotal,
        readCheckoutGateway()
      );
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
      email: inputTrim(emailRef, email),
      fullName: inputTrim(fullNameRef, fullName),
      addressLine1: inputTrim(addressLine1Ref, addressLine1),
      city: inputTrim(cityRef, city),
      postalCode: inputTrim(postalCodeRef, postalCode),
      country: inputTrim(countryRef, country),
      researchUseAttestation: selectTrim(researchCategoryRef, researchCategory),
      items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
      storeCreditToUse: credit > 0 ? Math.round(credit * 100) / 100 : undefined,
      affiliateRef: readAffiliateRefFromStorage(),
      couponCode: appliedCoupon?.code,
    };
  }

  function prepareSnapshotForPayment(): boolean {
    setError(null);
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return false;
    }
    if (!validateShipping()) return false;
    const snap = captureSnapshot();
    checkoutSnapshotRef.current = snap;
    savePendingSnapshot(snap);
    finalizeOnce.current = false;
    setPayKey((k) => k + 1);
    return true;
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

  async function placeOrderWithoutCard() {
    setError(null);
    if (!prepareSnapshotForPayment()) return;
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
    "mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black";

  const summaryCard = (
    <div className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-neutral-200/90 bg-white p-4 shadow-[0_4px_24px_-12px_rgba(15,23,42,0.1)] sm:p-5">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Order summary</h2>
      <p className="mt-1 text-sm text-neutral-600">
        {itemCount} {itemCount === 1 ? "item" : "items"} · Research use only
      </p>
      <div className="mt-4 space-y-4 border-t border-neutral-200 pt-4">
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

      <div className="mt-4 border-t border-neutral-200 pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Payment</p>
        <div className="mt-2">
          <CheckoutPaymentMethodSelector value={payGateway} onChange={selectPayGateway} />
        </div>
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-4">
        {creditApplied > 0 ? (
          <p className="mb-3 text-xs text-emerald-900">
            Balance applied: <span className="font-bold tabular-nums">${creditApplied.toFixed(2)}</span>
          </p>
        ) : null}

        <div className="rounded-lg border border-neutral-200 bg-neutral-50/60 p-3">
          {cardDue <= 0 ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (prepareSnapshotForPayment()) void finalizeOrder();
              }}
              className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#f0c14b] px-4 text-sm font-bold text-[#111] shadow-[0_2px_0_0_#c9a227] transition hover:bg-[#f2ca5c] disabled:cursor-wait disabled:opacity-50"
            >
              {loading ? "Placing order…" : "Place order"}
            </button>
          ) : payGateway === "crypto" ? (
            <>
              {npAvailable === null ? (
                <p className="text-center text-sm text-neutral-600">Checking crypto checkout…</p>
              ) : !npAvailable ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  Configure crypto payments in{" "}
                  <Link href="/admin/dashboard/settings" className="font-semibold underline">
                    Admin settings
                  </Link>
                  .
                </div>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void startCryptoCheckout()}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#f0c14b] px-4 text-sm font-bold text-[#111] shadow-[0_2px_0_0_#c9a227] transition hover:bg-[#f2ca5c] disabled:cursor-wait disabled:opacity-50"
                >
                  {loading ? "Preparing…" : `Pay $${paymentAmountStr} with crypto`}
                </button>
              )}
            </>
          ) : crossmintOk ? (
            <CheckoutCrossmint
              key={payKey}
              clientApiKey={CROSSMINT_CLIENT_API_KEY}
              amountUsd={paymentAmountStr}
              disabled={loading}
              onBeforeStartPayment={prepareSnapshotForPayment}
              onPaymentComplete={() => void finalizeOrder()}
            />
          ) : (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              Card payment is not configured (missing API keys).
            </div>
          )}

          {!crossmintOk && cardDue > 0 && payGateway === "crossmint" ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => void placeOrderWithoutCard()}
              className="mt-3 w-full rounded-lg border border-dashed border-neutral-400 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              {loading ? "Placing order…" : "Dev: place order without card"}
            </button>
          ) : null}
        </div>

        {loading ? <p className="mt-2 text-center text-xs text-neutral-500">Working…</p> : null}
      </div>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className="lg:col-span-7 space-y-5">
        <section className="rounded-xl border border-neutral-200/90 bg-white p-3 shadow-[0_1px_8px_-4px_rgba(15,23,42,0.08)] sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2.5">
            <h2 className="text-base font-semibold tracking-tight text-black sm:text-lg">
              Your order
              <span className="ml-1.5 font-normal text-neutral-500 sm:ml-2">
                · {itemCount} {itemCount === 1 ? "item" : "items"} · Research use only
              </span>
            </h2>
            <Link
              href="/products-catalog"
              className="text-xs font-medium text-[#9a7b1a] hover:text-black hover:underline sm:text-sm"
            >
              Continue shopping
            </Link>
          </div>
          <ul className="mt-2 space-y-2">
            {lines.map(({ product, quantity }) => {
              const img = resolveProductImage(product);
              const lineTotal = product.price * quantity;
              return (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-lg border border-neutral-100 bg-neutral-50/60 p-3 sm:gap-3.5"
                >
                  <Link
                    href={`/products-catalog/${product.slug}`}
                    className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-neutral-100 ring-1 ring-neutral-100 sm:h-20 sm:w-20"
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className={productImageBoxClassName(img)}
                      unoptimized
                      sizes="72px"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/products-catalog/${product.slug}`}
                        className="text-sm font-medium leading-snug text-neutral-900 hover:text-[#b8962e] sm:text-[15px]"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">${product.price.toFixed(2)} each</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="flex items-center gap-2 text-sm text-neutral-700">
                          <span className="text-neutral-500">Qty</span>
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={quantity}
                            onChange={(e) =>
                              setQuantity(product.id, Math.max(1, Math.min(99, Number(e.target.value) || 1)))
                            }
                            className="w-14 rounded border border-neutral-300 bg-white py-1 text-center text-xs font-medium text-neutral-900 sm:text-sm"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeLine(product.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline sm:text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 text-right sm:mt-0 sm:shrink-0 sm:pl-2">
                      <p className="text-sm font-semibold tabular-nums text-neutral-900 sm:text-base">${lineTotal.toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight text-black sm:text-lg">Shipping &amp; contact</h2>

        <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Email</span>
                <input
                  ref={emailRef}
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Full name</span>
                <input
                  ref={fullNameRef}
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onInput={(e) => setFullName(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="name"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Street address</span>
                <input
                  ref={addressLine1Ref}
                  required
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  onInput={(e) => setAddressLine1(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="address-line1"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-neutral-800">City</span>
                <input
                  ref={cityRef}
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onInput={(e) => setCity(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="address-level2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-neutral-800">Postal code</span>
                <input
                  ref={postalCodeRef}
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onInput={(e) => setPostalCode(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="postal-code"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Country</span>
                <input
                  ref={countryRef}
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onInput={(e) => setCountry(e.currentTarget.value)}
                  className={inputClass}
                  autoComplete="country-name"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-neutral-800">Research-use attestation</span>
                <select
                  ref={researchCategoryRef}
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
                <div className="block sm:col-span-2 rounded-lg border border-emerald-200/90 bg-emerald-50/50 p-3 sm:p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-900">Affiliate balance</p>
                  <p className="mt-0.5 text-xl font-bold tabular-nums text-emerald-950 sm:text-2xl">${affiliateBalance.toFixed(2)}</p>
                  <p className="mt-1.5 text-[11px] leading-snug text-emerald-900/85 sm:text-xs">
                    Signed-in customers may apply earnings toward this order. Paying by card? Either cover the full order with
                    balance or leave at least ${MIN_CARD_USD.toFixed(2)} for the card charge.
                  </p>
                  <label className="mt-2 block">
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
                    className="mt-1.5 text-xs font-semibold text-[#b8962e] hover:underline"
                    onClick={() =>
                      setStoreCreditToUse(Math.round(Math.min(affiliateBalance, discountedSubtotal) * 100) / 100)
                    }
                  >
                    Use max (${Math.min(affiliateBalance, discountedSubtotal).toFixed(2)})
                  </button>
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-neutral-200/90 bg-gradient-to-b from-amber-50/40 via-white to-white p-4 shadow-[0_2px_16px_-8px_rgba(15,23,42,0.08)] sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7b1a]">Privacy &amp; agreement</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
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

              <div className="mt-4 flex gap-3 border-t border-neutral-200/90 pt-4">
                <input
                  id="checkout-purchaser-terms"
                  type="checkbox"
                  name="purchaserTerms"
                  required
                  checked={purchaserTermsAccepted}
                  onChange={(e) => setPurchaserTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-2 border-neutral-400 bg-white text-black accent-[#D4AF37] checked:border-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-1 sm:h-5 sm:w-5"
                  aria-required="true"
                />
                <label
                  htmlFor="checkout-purchaser-terms"
                  className="cursor-pointer select-none text-[10px] font-semibold uppercase leading-snug tracking-wide text-neutral-800 sm:text-[11px]"
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
                <p className="mt-2 text-[11px] text-neutral-500">Check the box to complete checkout.</p>
              ) : null}
            </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">{error}</div>
        ) : null}

        <Link
          href="/products-catalog"
          className="inline-block text-xs font-medium text-neutral-600 hover:text-black hover:underline sm:text-sm"
        >
          ← Continue shopping
        </Link>
        </div>
      </div>

      <div className="lg:col-span-5 lg:order-2">{summaryCard}</div>
    </div>
  );
}
