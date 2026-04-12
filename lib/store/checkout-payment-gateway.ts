const KEY = "sqspeptides_checkout_payment_gateway";

export type CheckoutPaymentGateway = "crossmint" | "crypto" | "zelle";

export function readCheckoutGateway(): CheckoutPaymentGateway {
  if (typeof window === "undefined") return "crossmint";
  try {
    const v = sessionStorage.getItem(KEY);
    if (v === "crypto") return "crypto";
    if (v === "zelle") return "zelle";
  } catch {
    /* ignore */
  }
  return "crossmint";
}

export function writeCheckoutGateway(g: CheckoutPaymentGateway): void {
  try {
    sessionStorage.setItem(KEY, g);
  } catch {
    /* ignore */
  }
}
