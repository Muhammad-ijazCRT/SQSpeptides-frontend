export async function createPayramCheckout({ amount, orderId, customerEmail, mode = "crypto" }) {
  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  const endpoint = backendBase ? `${backendBase.replace(/\/$/, "")}/api/create-payment` : "/api/create-payment";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, orderId, customerEmail, mode }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      Array.isArray(data.message) ? data.message.join(", ") : typeof data.message === "string" ? data.message : "Unable to start PayRam checkout.";
    throw new Error(message);
  }

  if (!data.checkoutUrl || typeof data.checkoutUrl !== "string") {
    throw new Error("PayRam did not return a checkout URL.");
  }

  return {
    checkoutUrl: data.checkoutUrl,
    referenceId: typeof data.referenceId === "string" ? data.referenceId : "",
  };
}
