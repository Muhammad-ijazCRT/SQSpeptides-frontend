import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_TOKEN_COOKIE } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/server/api-url";
import { readCrossmintConfig, updateEnvLocalKeys } from "@/lib/server/env-config";

export async function GET() {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // 1. Crossmint settings from local env
  const crossmint = readCrossmintConfig();

  // 2. Fetch backend payment settings (NOWPayments, Zelle, SMTP, Shipping)
  let backendSettings: Record<string, unknown> = {};
  try {
    const res = await fetch(`${getBackendUrl()}/admin/payment-settings`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (res.ok) {
      backendSettings = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    }
  } catch {
    /* backend may be offline */
  }

  // 3. PayRam details from env
  const payram = {
    dashboardUrl: process.env.NEXT_PUBLIC_PAYRAM_DASHBOARD_URL || "http://2.24.201.234/project/all/dashboard",
    webhookUrl: "/api/payram/webhook",
  };

  return NextResponse.json({
    crossmint,
    nowpayments: {
      apiKeyMasked: backendSettings.nowpaymentsApiKeyMasked ?? null,
      publicKeyMasked: backendSettings.nowpaymentsPublicKeyMasked ?? null,
      sandbox: backendSettings.nowpaymentsSandbox ?? true,
      configured: Boolean(backendSettings.nowpaymentsConfigured),
      sandboxUrl: "https://api-sandbox.nowpayments.io/v1",
      productionUrl: "https://api.nowpayments.io/v1",
      dashboardUrl: "https://account.nowpayments.io",
      webhookUrl: "/api/checkout/nowpayments/sync",
    },
    zelle: {
      email: backendSettings.zelleEmail ?? null,
      phone: backendSettings.zellePhone ?? null,
      configured: Boolean(backendSettings.zelleConfigured),
      instructions: "Direct bank transfer; customer submits confirmation ID + proof receipt.",
    },
    payram,
  });
}

export async function PATCH(request: Request) {
  const token = (await cookies()).get(ADMIN_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  // 1. If Crossmint fields are provided, update .env.local
  if (body.crossmint && typeof body.crossmint === "object") {
    const cm = body.crossmint as Record<string, unknown>;
    const updates: Record<string, string> = {};

    if (typeof cm.env === "string" && (cm.env === "production" || cm.env === "staging")) {
      updates.NEXT_PUBLIC_CROSSMINT_ENV = cm.env;
    }
    if (typeof cm.projectId === "string") {
      updates.NEXT_PUBLIC_CROSSMINT_PROJECT_ID = cm.projectId.trim();
    }
    if (typeof cm.clientApiKey === "string" && cm.clientApiKey.trim()) {
      updates.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY = cm.clientApiKey.trim();
    }
    if (typeof cm.serverApiKey === "string" && cm.serverApiKey.trim()) {
      updates.CROSSMINT_SERVER_SIDE_API_KEY = cm.serverApiKey.trim();
    }
    if (typeof cm.recipientWallet === "string" && cm.recipientWallet.trim()) {
      updates.NEXT_PUBLIC_ONRAMP_RECIPIENT_WALLET = cm.recipientWallet.trim();
    }
    if (typeof cm.returningEmail === "string" && cm.returningEmail.trim()) {
      updates.NEXT_PUBLIC_ONRAMP_RETURNING_EMAIL = cm.returningEmail.trim();
    }

    if (Object.keys(updates).length > 0) {
      updateEnvLocalKeys(updates);
    }
  }

  // 2. If NOWPayments or Zelle fields are provided, patch backend
  const backendFields: Record<string, unknown> = {};
  if (body.nowpayments && typeof body.nowpayments === "object") {
    const np = body.nowpayments as Record<string, unknown>;
    if (typeof np.apiKey === "string" && np.apiKey.trim()) backendFields.nowpaymentsApiKey = np.apiKey.trim();
    if (typeof np.publicKey === "string" && np.publicKey.trim()) backendFields.nowpaymentsPublicKey = np.publicKey.trim();
    if (typeof np.sandbox === "boolean") backendFields.nowpaymentsSandbox = np.sandbox;
  }
  if (body.zelle && typeof body.zelle === "object") {
    const z = body.zelle as Record<string, unknown>;
    if (typeof z.email === "string") backendFields.zelleEmail = z.email.trim();
    if (typeof z.phone === "string") backendFields.zellePhone = z.phone.trim();
  }

  if (Object.keys(backendFields).length > 0) {
    try {
      await fetch(`${getBackendUrl()}/admin/payment-settings`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(backendFields),
      });
    } catch {
      /* ignore backend failure */
    }
  }

  return NextResponse.json({ ok: true, crossmint: readCrossmintConfig() });
}
