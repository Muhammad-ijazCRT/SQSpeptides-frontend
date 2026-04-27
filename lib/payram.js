export async function createPayramCheckout({ amount, orderId, customerEmail, mode = "crypto" }) {
  /** Always same-origin Next route so the browser never calls the API host directly (avoids CORS / wrong BACKEND_URL). */
  const endpoint = "/api/create-payment";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, orderId, customerEmail, mode }),
  });

  const rawText = await res.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = {};
  }
  if (!res.ok) {
    const d = data;
    const msg =
      Array.isArray(d.message) ? d.message.join(", ") : typeof d.message === "string" ? d.message : typeof d.error === "string" ? d.error : rawText.trim().slice(0, 200) || `Unable to start PayRam checkout (HTTP ${res.status}).`;
    console.error("[createPayramCheckout] Nest/Next create-payment failed", {
      status: res.status,
      orderId,
      message: d.message,
      error: d.error,
      code: d.code,
      rawSnippet: rawText.slice(0, 800),
    });
    throw new Error(msg);
  }

  if (!data.checkoutUrl || typeof data.checkoutUrl !== "string") {
    throw new Error("PayRam did not return a checkout URL.");
  }

  return {
    checkoutUrl: data.checkoutUrl,
    referenceId: typeof data.referenceId === "string" ? data.referenceId : "",
  };
}
