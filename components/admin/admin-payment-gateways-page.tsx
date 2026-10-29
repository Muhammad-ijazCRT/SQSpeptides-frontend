"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { notify } from "@/lib/notifications/notify";
import { SettingsNavHeader } from "./settings-nav-header";

type CrossmintConfig = {
  env: "production" | "staging";
  projectId: string;
  clientApiKey: string;
  serverApiKeyMasked: string;
  hasServerApiKey: boolean;
  recipientWallet: string;
  returningEmail: string;
  stellarLocator: string;
  sandboxBaseUrl: string;
  productionBaseUrl: string;
  sandboxConsoleUrl: string;
  productionConsoleUrl: string;
};

type NowpaymentsConfig = {
  apiKeyMasked: string | null;
  publicKeyMasked: string | null;
  sandbox: boolean;
  configured: boolean;
  sandboxUrl: string;
  productionUrl: string;
  dashboardUrl: string;
  webhookUrl: string;
};

type ZelleConfig = {
  email: string | null;
  phone: string | null;
  configured: boolean;
  instructions: string;
};

type PayramConfig = {
  dashboardUrl: string;
  webhookUrl: string;
};

type GatewayData = {
  crossmint: CrossmintConfig;
  nowpayments: NowpaymentsConfig;
  zelle: ZelleConfig;
  payram: PayramConfig;
};

type ActiveGateway = "crossmint" | "nowpayments" | "payram" | "zelle";

export function AdminPaymentGatewaysPage() {
  const [data, setData] = useState<GatewayData | null>(null);
  const [activeGateway, setActiveGateway] = useState<ActiveGateway>("crossmint");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showServerKey, setShowServerKey] = useState(false);
  const [showNowpaymentsKey, setShowNowpaymentsKey] = useState(false);

  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
    statusCode?: number;
  } | null>(null);

  // Crossmint form states
  const [cmEnv, setCmEnv] = useState<"production" | "staging">("staging");
  const [cmProjectId, setCmProjectId] = useState("");
  const [cmClientKey, setCmClientKey] = useState("");
  const [cmServerKey, setCmServerKey] = useState("");
  const [cmRecipientWallet, setCmRecipientWallet] = useState("");
  const [cmReturningEmail, setCmReturningEmail] = useState("");

  // NOWPayments form states
  const [npApiKey, setNpApiKey] = useState("");
  const [npPublicKey, setNpPublicKey] = useState("");
  const [npSandbox, setNpSandbox] = useState(true);

  // Zelle form states
  const [zelleEmail, setZelleEmail] = useState("");
  const [zellePhone, setZellePhone] = useState("");

  const populateFields = useCallback((val: GatewayData) => {
    setData(val);
    setCmEnv(val.crossmint.env);
    setCmProjectId(val.crossmint.projectId);
    setCmClientKey(val.crossmint.clientApiKey);
    setCmRecipientWallet(val.crossmint.recipientWallet);
    setCmReturningEmail(val.crossmint.returningEmail);
    setCmServerKey("");

    setNpSandbox(val.nowpayments.sandbox);
    setNpApiKey("");
    setNpPublicKey("");

    setZelleEmail(val.zelle.email ?? "");
    setZellePhone(val.zelle.phone ?? "");
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-gateways", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as GatewayData;
      populateFields(json);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to load payment gateways.");
    } finally {
      setLoading(false);
    }
  }, [populateFields]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(label);
      notify.success(`${label} copied!`);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      notify.error("Could not copy to clipboard");
    }
  }

  async function saveCrossmint(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        crossmint: {
          env: cmEnv,
          projectId: cmProjectId.trim(),
          clientApiKey: cmClientKey.trim(),
          recipientWallet: cmRecipientWallet.trim(),
          returningEmail: cmReturningEmail.trim(),
        },
      };
      if (cmServerKey.trim()) {
        (body.crossmint as Record<string, unknown>).serverApiKey = cmServerKey.trim();
      }

      const res = await fetch("/api/admin/payment-gateways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      notify.success("Crossmint configuration saved successfully!");
      setCmServerKey("");
      await loadData();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to save Crossmint configuration.");
    } finally {
      setSaving(false);
    }
  }

  async function testCrossmintConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/admin/payment-gateways/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gateway: "crossmint",
          serverApiKey: cmServerKey.trim() || undefined,
          projectId: cmProjectId.trim() || undefined,
          env: cmEnv,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok: boolean;
        message: string;
        latencyMs?: number;
        statusCode?: number;
      };
      setTestResult(json);
      if (json.ok) {
        notify.success(json.message);
      } else {
        notify.error(`Test failed: ${json.message}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Connection failed.";
      setTestResult({ ok: false, message: msg });
      notify.error(msg);
    } finally {
      setTesting(false);
    }
  }

  async function saveNowpayments(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        nowpayments: {
          sandbox: npSandbox,
        },
      };
      if (npApiKey.trim()) (body.nowpayments as Record<string, unknown>).apiKey = npApiKey.trim();
      if (npPublicKey.trim()) (body.nowpayments as Record<string, unknown>).publicKey = npPublicKey.trim();

      const res = await fetch("/api/admin/payment-gateways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      notify.success("NOWPayments configuration saved successfully!");
      setNpApiKey("");
      setNpPublicKey("");
      await loadData();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to save NOWPayments settings.");
    } finally {
      setSaving(false);
    }
  }

  async function saveZelle(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        zelle: {
          email: zelleEmail.trim(),
          phone: zellePhone.trim(),
        },
      };
      const res = await fetch("/api/admin/payment-gateways", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      notify.success("Zelle settings saved successfully!");
      await loadData();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to save Zelle settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-settings-shell p-5 text-center">
        <div className="spinner-border text-warning mb-3" role="status" />
        <p className="text-secondary mb-0">Loading payment gateway credentials…</p>
      </div>
    );
  }

  const crossmintIsStaging = cmEnv === "staging";

  return (
    <div className="admin-settings-shell">
      {/* Shared Header with Switcher Tabs */}
      <div className="admin-settings-header">
        <SettingsNavHeader
          currentTab="payment"
          title="Payment Settings"
          subtitle="Configure Crossmint card-to-crypto checkout, NOWPayments crypto, PayRam, and Zelle manual transfers."
        />
      </div>

      <div className="p-4 p-lg-5">
        {/* Gateway Selection Grid */}
        <div className="row g-3 mb-4">
          {/* Crossmint */}
          <div className="col-12 col-sm-6 col-xl-3">
            <button
              type="button"
              className={`gateway-choice-card ${activeGateway === "crossmint" ? "is-selected" : ""}`}
              onClick={() => setActiveGateway("crossmint")}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-dark text-warning p-2">
                  <i className="bi bi-credit-card-2-front fs-5" />
                </span>
                <span
                  className={`badge rounded-pill ${
                    data?.crossmint.env === "staging" ? "bg-warning-subtle text-dark border border-warning-subtle" : "bg-success-subtle text-success border border-success-subtle"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {data?.crossmint.env === "staging" ? "⚡ Sandbox" : "✓ Live"}
                </span>
              </div>
              <h3 className="h6 fw-semibold text-dark mb-1">Crossmint Card</h3>
              <p className="small text-secondary mb-0">Credit / Debit Card Checkout</p>
            </button>
          </div>

          {/* NOWPayments */}
          <div className="col-12 col-sm-6 col-xl-3">
            <button
              type="button"
              className={`gateway-choice-card ${activeGateway === "nowpayments" ? "is-selected" : ""}`}
              onClick={() => setActiveGateway("nowpayments")}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-dark text-warning p-2">
                  <i className="bi bi-currency-bitcoin fs-5" />
                </span>
                <span
                  className={`badge rounded-pill ${
                    data?.nowpayments.configured ? "bg-success-subtle text-success border border-success-subtle" : "bg-secondary-subtle text-secondary"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {data?.nowpayments.configured ? "✓ Configured" : "○ Inactive"}
                </span>
              </div>
              <h3 className="h6 fw-semibold text-dark mb-1">NOWPayments</h3>
              <p className="small text-secondary mb-0">Multi-Crypto Gateway</p>
            </button>
          </div>

          {/* PayRam */}
          <div className="col-12 col-sm-6 col-xl-3">
            <button
              type="button"
              className={`gateway-choice-card ${activeGateway === "payram" ? "is-selected" : ""}`}
              onClick={() => setActiveGateway("payram")}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-dark text-warning p-2">
                  <i className="bi bi-shield-check fs-5" />
                </span>
                <span className="badge rounded-pill bg-info-subtle text-info border border-info-subtle" style={{ fontSize: "0.72rem" }}>
                  Active
                </span>
              </div>
              <h3 className="h6 fw-semibold text-dark mb-1">PayRam</h3>
              <p className="small text-secondary mb-0">Card-to-Crypto Direct</p>
            </button>
          </div>

          {/* Zelle */}
          <div className="col-12 col-sm-6 col-xl-3">
            <button
              type="button"
              className={`gateway-choice-card ${activeGateway === "zelle" ? "is-selected" : ""}`}
              onClick={() => setActiveGateway("zelle")}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-3 bg-dark text-warning p-2">
                  <i className="bi bi-bank fs-5" />
                </span>
                <span
                  className={`badge rounded-pill ${
                    data?.zelle.configured ? "bg-success-subtle text-success border border-success-subtle" : "bg-secondary-subtle text-secondary"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {data?.zelle.configured ? "✓ Enabled" : "○ Inactive"}
                </span>
              </div>
              <h3 className="h6 fw-semibold text-dark mb-1">Zelle Wire</h3>
              <p className="small text-secondary mb-0">Manual Bank Transfer</p>
            </button>
          </div>
        </div>

        {/* ========================================================
            CROSSMINT PANEL
           ======================================================== */}
        {activeGateway === "crossmint" && (
          <div>
            {/* Top Status & Mode Toggle */}
            <div className="p-3 p-md-4 rounded-3 border bg-light mb-4 d-flex flex-wrap justify-content-between align-items-center gap-3">
              <div>
                <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">Operating Environment</span>
                <div className="env-pill-toggle">
                  <button
                    type="button"
                    className={`env-pill-btn ${crossmintIsStaging ? "active-sandbox" : ""}`}
                    onClick={() => setCmEnv("staging")}
                  >
                    <i className="bi bi-lightning-charge" />
                    Sandbox / Staging
                  </button>
                  <button
                    type="button"
                    className={`env-pill-btn ${!crossmintIsStaging ? "active-prod" : ""}`}
                    onClick={() => setCmEnv("production")}
                  >
                    <i className="bi bi-shield-lock" />
                    Production (Live)
                  </button>
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <a
                  href={crossmintIsStaging ? data?.crossmint.sandboxConsoleUrl : data?.crossmint.productionConsoleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-dark btn-sm rounded-2 d-inline-flex align-items-center gap-1"
                >
                  <i className="bi bi-box-arrow-up-right" />
                  <span>Open {crossmintIsStaging ? "Staging" : "Live"} Console</span>
                </a>
              </div>
            </div>

            {/* Test Connection Banner (if tested) */}
            {testResult && (
              <div
                className={`alert ${
                  testResult.ok ? "alert-success border-success" : "alert-danger border-danger"
                } rounded-3 d-flex align-items-center justify-content-between p-3 mb-4`}
              >
                <div className="d-flex align-items-center gap-2">
                  <i className={`bi ${testResult.ok ? "bi-check-circle-fill text-success" : "bi-exclamation-triangle-fill text-danger"} fs-5`} />
                  <div>
                    <strong className="d-block">{testResult.ok ? "Connection Verified" : "Connection Failed"}</strong>
                    <span className="small text-secondary">{testResult.message}</span>
                  </div>
                </div>
                {testResult.latencyMs != null && (
                  <span className="badge bg-white text-dark border small">{testResult.latencyMs} ms latency</span>
                )}
              </div>
            )}

            {/* Form & Cheatsheet Layout */}
            <div className="row g-4">
              {/* Form Controls */}
              <div className="col-12 col-xl-7">
                <form onSubmit={(e) => void saveCrossmint(e)} className="border rounded-3 p-4 bg-white shadow-xs">
                  <h3 className="h6 fw-semibold text-dark mb-4 pb-2 border-bottom">API Credentials & Configuration</h3>

                  {/* Project ID */}
                  <div className="luxury-input-group mb-3">
                    <label>Crossmint Project ID</label>
                    <div className="luxury-field-shell">
                      <input
                        type="text"
                        className="luxury-field-input"
                        placeholder="e.g. daa018b7-000d-4c3c-9e97-7b232d172a5d"
                        value={cmProjectId}
                        onChange={(e) => setCmProjectId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Client Side API Key */}
                  <div className="luxury-input-group mb-3">
                    <label>Client Side API Key (Starts with {crossmintIsStaging ? "ck_staging_" : "ck_production_"})</label>
                    <div className="luxury-field-shell">
                      <input
                        type="text"
                        className="luxury-field-input"
                        placeholder="ck_staging_..."
                        value={cmClientKey}
                        onChange={(e) => setCmClientKey(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className={`luxury-field-action-btn ${copiedKey === "Client API Key" ? "is-copied" : ""}`}
                        onClick={() => copyToClipboard(cmClientKey, "Client API Key")}
                        title="Copy Client API Key"
                      >
                        <i className={`bi ${copiedKey === "Client API Key" ? "bi-check-lg" : "bi-copy"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Server Side API Key */}
                  <div className="luxury-input-group mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="mb-0">
                        Server Side API Key (Starts with {crossmintIsStaging ? "sk_staging_" : "sk_production_"})
                      </label>
                      {data?.crossmint.hasServerApiKey && (
                        <span className="small text-muted">Current: {data.crossmint.serverApiKeyMasked}</span>
                      )}
                    </div>
                    <div className="luxury-field-shell">
                      <input
                        type={showServerKey ? "text" : "password"}
                        className="luxury-field-input"
                        placeholder={data?.crossmint.hasServerApiKey ? "Leave blank to keep saved server key" : "sk_staging_..."}
                        value={cmServerKey}
                        onChange={(e) => setCmServerKey(e.target.value)}
                      />
                      <button
                        type="button"
                        className="luxury-field-action-btn"
                        onClick={() => setShowServerKey((v) => !v)}
                        title={showServerKey ? "Hide key" : "Show key"}
                      >
                        <i className={`bi ${showServerKey ? "bi-eye-slash" : "bi-eye"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Stellar Recipient Wallet */}
                  <div className="luxury-input-group mb-3">
                    <label>Recipient Stellar Wallet (Receives USDC settlements)</label>
                    <div className="luxury-field-shell">
                      <input
                        type="text"
                        className="luxury-field-input"
                        placeholder="G... (56-character Stellar public key)"
                        value={cmRecipientWallet}
                        onChange={(e) => setCmRecipientWallet(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Returning Customer Email */}
                  <div className="luxury-input-group mb-4">
                    <label>Fallback Onramp Customer Email</label>
                    <div className="luxury-field-shell">
                      <input
                        type="email"
                        className="luxury-field-input"
                        placeholder="support@sqspeptides.com"
                        value={cmReturningEmail}
                        onChange={(e) => setCmReturningEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top">
                    <button type="submit" className="btn-gold-action" disabled={saving}>
                      {saving ? "Saving Changes…" : "Save Crossmint Configuration"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
                      onClick={() => void testCrossmintConnection()}
                      disabled={testing || saving}
                    >
                      {testing ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" />
                          <span>Testing API…</span>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-play-circle text-warning" />
                          <span>Test API Connection</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Developer & Sandbox Cheatsheet */}
              <div className="col-12 col-xl-5">
                <div className="border rounded-3 p-4 bg-light h-100 shadow-xs">
                  <h3 className="h6 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-check text-warning" />
                    <span>Sandbox Testing Cheatsheet</span>
                  </h3>

                  {/* Test Card Info */}
                  <div className="p-3 bg-white rounded-3 border mb-3">
                    <span className="text-secondary small fw-semibold text-uppercase d-block mb-2">Sandbox Test Card</span>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light border mb-2">
                      <code className="text-dark fw-bold">4242 4242 4242 4242</code>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none p-0 text-secondary"
                        onClick={() => copyToClipboard("4242424242424242", "Card Number")}
                        title="Copy Card Number"
                      >
                        <i className={`bi ${copiedKey === "Card Number" ? "bi-check-lg text-success" : "bi-copy"}`} />
                      </button>
                    </div>
                    <div className="d-flex justify-content-between text-secondary small">
                      <span>Exp: <strong className="text-dark">12/34</strong></span>
                      <span>CVC: <strong className="text-dark">123</strong></span>
                      <span>ZIP: <strong className="text-dark">10001</strong></span>
                    </div>
                  </div>

                  {/* Token Locator */}
                  <div className="p-3 bg-white rounded-3 border mb-3">
                    <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">Stellar USDC Token Locator</span>
                    <p className="small text-muted mb-2">
                      {crossmintIsStaging ? "Testnet USDC Locator (Sandbox):" : "Pubnet USDC Locator (Production):"}
                    </p>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light border">
                      <code className="text-truncate small text-dark me-2">
                        {crossmintIsStaging
                          ? "stellar:CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
                          : "stellar:CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"}
                      </code>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none p-0 text-secondary"
                        onClick={() =>
                          copyToClipboard(
                            crossmintIsStaging
                              ? "stellar:CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
                              : "stellar:CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
                            "Token Locator"
                          )
                        }
                        title="Copy Token Locator"
                      >
                        <i className={`bi ${copiedKey === "Token Locator" ? "bi-check-lg text-success" : "bi-copy"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Webhook Endpoint */}
                  <div className="p-3 bg-white rounded-3 border">
                    <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">Webhook Endpoint</span>
                    <p className="small text-muted mb-2">Subscribe to order status updates in Crossmint Console:</p>
                    <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light border">
                      <code className="text-truncate small text-dark me-2">/api/crossmint/webhook</code>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none p-0 text-secondary"
                        onClick={() => copyToClipboard("/api/crossmint/webhook", "Webhook URL")}
                        title="Copy Webhook URL"
                      >
                        <i className={`bi ${copiedKey === "Webhook URL" ? "bi-check-lg text-success" : "bi-copy"}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            NOWPAYMENTS PANEL
           ======================================================== */}
        {activeGateway === "nowpayments" && (
          <div className="row g-4">
            <div className="col-12 col-xl-7">
              <form onSubmit={(e) => void saveNowpayments(e)} className="border rounded-3 p-4 bg-white shadow-xs">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                  <h3 className="h6 fw-semibold text-dark mb-0">NOWPayments API Configuration</h3>
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="np-sandbox-switch"
                      checked={npSandbox}
                      onChange={(e) => setNpSandbox(e.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold text-secondary" htmlFor="np-sandbox-switch">
                      {npSandbox ? "Sandbox Mode" : "Production Mode"}
                    </label>
                  </div>
                </div>

                <div className="luxury-input-group mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="mb-0">API Key</label>
                    {data?.nowpayments.apiKeyMasked && (
                      <span className="small text-muted">Current: {data.nowpayments.apiKeyMasked}</span>
                    )}
                  </div>
                  <div className="luxury-field-shell">
                    <input
                      type={showNowpaymentsKey ? "text" : "password"}
                      className="luxury-field-input"
                      placeholder="New API Key (leave blank to keep current)"
                      value={npApiKey}
                      onChange={(e) => setNpApiKey(e.target.value)}
                    />
                    <button
                      type="button"
                      className="luxury-field-action-btn"
                      onClick={() => setShowNowpaymentsKey((v) => !v)}
                      title={showNowpaymentsKey ? "Hide key" : "Show key"}
                    >
                      <i className={`bi ${showNowpaymentsKey ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                  </div>
                </div>

                <div className="luxury-input-group mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="mb-0">Public Key</label>
                    {data?.nowpayments.publicKeyMasked && (
                      <span className="small text-muted">Current: {data.nowpayments.publicKeyMasked}</span>
                    )}
                  </div>
                  <div className="luxury-field-shell">
                    <input
                      type="text"
                      className="luxury-field-input"
                      placeholder="Public key from NOWPayments dashboard"
                      value={npPublicKey}
                      onChange={(e) => setNpPublicKey(e.target.value)}
                    />
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-3 pt-3 border-top">
                  <button type="submit" className="btn-gold-action" disabled={saving}>
                    {saving ? "Saving Changes…" : "Save NOWPayments Keys"}
                  </button>
                  <a
                    href="https://account.nowpayments.io"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-dark d-inline-flex align-items-center gap-2"
                  >
                    <i className="bi bi-box-arrow-up-right" />
                    <span>Open NOWPayments Dashboard</span>
                  </a>
                </div>
              </form>
            </div>

            <div className="col-12 col-xl-5">
              <div className="border rounded-3 p-4 bg-light h-100 shadow-xs">
                <h3 className="h6 fw-semibold text-dark mb-3">NOWPayments Integration Details</h3>
                <p className="small text-secondary mb-4">
                  NOWPayments handles crypto payments such as Bitcoin, Ethereum, USDT, and Solana. Checkout checks payment status
                  automatically when the customer finishes their transaction.
                </p>

                <div className="p-3 bg-white rounded-3 border mb-3">
                  <span className="text-secondary small fw-semibold text-uppercase d-block mb-1">IPN / Sync Callback</span>
                  <div className="d-flex align-items-center justify-content-between p-2 rounded bg-light border">
                    <code className="text-truncate small text-dark me-2">/api/checkout/nowpayments/sync</code>
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0 text-secondary"
                      onClick={() => copyToClipboard("/api/checkout/nowpayments/sync", "Sync URL")}
                    >
                      <i className={`bi ${copiedKey === "Sync URL" ? "bi-check-lg text-success" : "bi-copy"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PAYRAM PANEL
           ======================================================== */}
        {activeGateway === "payram" && (
          <div className="row g-4">
            <div className="col-12 col-xl-7">
              <div className="border rounded-3 p-4 bg-white shadow-xs">
                <h3 className="h6 fw-semibold text-dark mb-3 pb-2 border-bottom">PayRam Card-to-Crypto Engine</h3>
                <p className="small text-secondary mb-4">
                  PayRam routes card transactions into crypto tokens using a self-hosted instance. Transactions update orders via IPN
                  callbacks.
                </p>

                <div className="luxury-input-group mb-4">
                  <label>Self-Hosted Dashboard</label>
                  <div className="luxury-field-shell">
                    <input
                      type="text"
                      className="luxury-field-input"
                      readOnly
                      value={data?.payram.dashboardUrl ?? "http://2.24.201.234/project/all/dashboard"}
                    />
                    <a
                      href={data?.payram.dashboardUrl ?? "http://2.24.201.234/project/all/dashboard"}
                      target="_blank"
                      rel="noreferrer"
                      className="luxury-field-action-btn text-dark text-decoration-none"
                    >
                      <i className="bi bi-box-arrow-up-right me-1" />
                      Open
                    </a>
                  </div>
                </div>

                <div className="luxury-input-group mb-4">
                  <label>Webhook Callback Endpoint</label>
                  <div className="luxury-field-shell">
                    <input type="text" className="luxury-field-input" readOnly value="/api/payram/webhook" />
                    <button
                      type="button"
                      className={`luxury-field-action-btn ${copiedKey === "Payram Webhook" ? "is-copied" : ""}`}
                      onClick={() => copyToClipboard("/api/payram/webhook", "Payram Webhook")}
                    >
                      <i className={`bi ${copiedKey === "Payram Webhook" ? "bi-check-lg" : "bi-copy"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ZELLE PANEL
           ======================================================== */}
        {activeGateway === "zelle" && (
          <div className="row g-4">
            <div className="col-12 col-xl-7">
              <form onSubmit={(e) => void saveZelle(e)} className="border rounded-3 p-4 bg-white shadow-xs">
                <h3 className="h6 fw-semibold text-dark mb-3 pb-2 border-bottom">Zelle Direct Bank Transfer</h3>
                <p className="small text-secondary mb-4">
                  Displayed on the checkout page when at least one field is provided. Customers complete the payment inside their
                  banking app, then submit proof which you review under Orders.
                </p>

                <div className="luxury-input-group mb-3">
                  <label>Zelle Recipient Email</label>
                  <div className="luxury-field-shell">
                    <input
                      type="email"
                      className="luxury-field-input"
                      placeholder="payments@sqspeptides.com"
                      value={zelleEmail}
                      onChange={(e) => setZelleEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="luxury-input-group mb-4">
                  <label>Zelle Recipient Phone Number</label>
                  <div className="luxury-field-shell">
                    <input
                      type="tel"
                      className="luxury-field-input"
                      placeholder="+1 (555) 000-0000"
                      value={zellePhone}
                      onChange={(e) => setZellePhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-3 border-top">
                  <button type="submit" className="btn-gold-action" disabled={saving}>
                    {saving ? "Saving Changes…" : "Save Zelle Details"}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-12 col-xl-5">
              <div className="border rounded-3 p-4 bg-light h-100 shadow-xs">
                <h3 className="h6 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-eye text-warning" />
                  <span>Customer Checkout Preview</span>
                </h3>
                <p className="small text-secondary mb-3">Here is how Zelle appears to customers during checkout:</p>
                <div className="p-3 bg-white rounded-3 border">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-dark text-warning p-2 rounded">
                      <i className="bi bi-bank" />
                    </span>
                    <strong className="text-dark small">Pay with Zelle</strong>
                  </div>
                  <p className="small text-secondary mb-2">
                    Send funds directly using Zelle to our business account:
                  </p>
                  <ul className="small text-dark mb-0 ps-3">
                    {zelleEmail ? (
                      <li>
                        Email: <strong>{zelleEmail}</strong>
                      </li>
                    ) : null}
                    {zellePhone ? (
                      <li>
                        Phone: <strong>{zellePhone}</strong>
                      </li>
                    ) : null}
                    {!zelleEmail && !zellePhone ? (
                      <li className="text-muted">Not configured — add an email or phone number.</li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
