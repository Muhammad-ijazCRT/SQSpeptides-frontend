"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createOrder } from "@/lib/api/orders";
import { useCart } from "@/components/store/cart-context";
import { resolveProductImage } from "@/lib/store/catalog-image";
import { CheckoutCrossmint, isCrossmintConfigured } from "@/components/store/checkout-crossmint";
import { useToast } from "@/components/store/toast-context";

const MIN_CARD_USD = 1;
const PENDING_STORAGE_KEY = "sqspeptides_pending_checkout_v1";

type CheckoutSnapshot = {
  email: string;
  fullName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  items: { productId: string; quantity: number }[];
};

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

  const paymentAmount = Math.max(MIN_CARD_USD, subtotal).toFixed(2);
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

    try {
      const order = await createOrder({
        email: snap.email,
        fullName: snap.fullName,
        addressLine1: snap.addressLine1,
        city: snap.city,
        postalCode: snap.postalCode,
        country: snap.country,
        items: snap.items,
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
    return true;
  }

  function captureSnapshot(): CheckoutSnapshot {
    return {
      email: email.trim(),
      fullName: fullName.trim(),
      addressLine1: addressLine1.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      items: lines.map((l) => ({ productId: l.product.id, quantity: l.quantity })),
    };
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
                <Image src={img} alt="" fill className="object-cover" unoptimized sizes="64px" />
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
      <div className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-sm">
        <div className="flex justify-between text-neutral-600">
          <span>Subtotal</span>
          <span className="tabular-nums text-black">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Shipping</span>
          <span className="text-neutral-500">Calculated at fulfillment</span>
        </div>
        <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-bold text-black">
          <span>Total</span>
          <span className="tabular-nums">${subtotal.toFixed(2)}</span>
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
                We use this for order updates and compliance. Card payment on the next step uses our Crossmint merchant
                account; your store order stays under this contact information.
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
              <p className="mt-2 text-sm text-neutral-600">
                Amount due <span className="font-bold tabular-nums text-black">${paymentAmount}</span> — processed with
                card via Crossmint (same integration as <a href="/onramp" className="font-semibold text-[#b8962e] underline">/onramp</a>
                ). Your order will be recorded for <span className="font-medium text-black">{email}</span> after payment succeeds.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6">
              {crossmintOk ? (
                <CheckoutCrossmint
                  key={payKey}
                  amountUsd={paymentAmount}
                  disabled={loading}
                  onPaymentComplete={() => void finalizeOrder()}
                />
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                  <p className="font-semibold">Card checkout not configured</p>
                  <p className="mt-2 text-amber-900/90">
                    Add <code className="rounded bg-amber-100/80 px-1 text-xs">NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY</code> and{" "}
                    <code className="text-xs">CROSSMINT_SERVER_SIDE_API_KEY</code> to enable Crossmint.
                  </p>
                </div>
              )}

              {!crossmintOk && (
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
