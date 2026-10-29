"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { notify } from "@/lib/notifications/notify";
import { SettingsNavHeader } from "./settings-nav-header";

type PaymentSettings = {
  mailHost: string | null;
  mailPort: number | null;
  mailSecure: boolean;
  mailUser: string | null;
  mailPasswordMasked: string | null;
  mailFrom: string | null;
  mailConfigured: boolean;
  shippingUsa: number;
  shippingInternational: number;
};

type SettingsTab = "shipping" | "smtp";

export function AdminPaymentSettingsPage() {
  const [data, setData] = useState<PaymentSettings | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("shipping");
  const [mailHost, setMailHost] = useState("");
  const [mailPort, setMailPort] = useState("587");
  const [mailSecure, setMailSecure] = useState(false);
  const [mailUser, setMailUser] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [mailFrom, setMailFrom] = useState("");
  const [shippingUsa, setShippingUsa] = useState("0");
  const [shippingInternational, setShippingInternational] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const applySaved = useCallback((saved: PaymentSettings) => {
    setData(saved);
    setMailHost(saved.mailHost ?? "");
    setMailPort(saved.mailPort != null ? String(saved.mailPort) : "587");
    setMailSecure(Boolean(saved.mailSecure));
    setMailUser(saved.mailUser ?? "");
    setMailPassword("");
    setMailFrom(saved.mailFrom ?? "");
    setShippingUsa(String(Number(saved.shippingUsa ?? 0)));
    setShippingInternational(String(Number(saved.shippingInternational ?? 0)));
  }, []);

  const load = useCallback(async () => {
    setLoadErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-settings", { cache: "no-store" });
      const j = (await res.json().catch(() => ({}))) as PaymentSettings & { message?: string | string[] };
      if (!res.ok) {
        const apiMsg = Array.isArray(j.message) ? j.message.join(", ") : typeof j.message === "string" ? j.message : "";
        throw new Error(
          apiMsg ||
            (res.status === 401
              ? "Not signed in as admin."
              : `Could not load store settings (HTTP ${res.status}).`)
        );
      }
      applySaved(j);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load";
      setLoadErr(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }, [applySaved]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchSettings(body: Record<string, unknown>, successMsg: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        const m = typeof j.message === "string" ? j.message : Array.isArray(j.message) ? j.message.join(", ") : "Save failed";
        throw new Error(m);
      }
      applySaved(j as PaymentSettings);
      notify.success(successMsg);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveSmtp(e: React.FormEvent) {
    e.preventDefault();
    const portNum = Number.parseInt(mailPort.trim(), 10);
    const body: Record<string, unknown> = {
      mailHost: mailHost.trim(),
      mailPort: Number.isFinite(portNum) ? portNum : 587,
      mailSecure,
      mailUser: mailUser.trim(),
      mailFrom: mailFrom.trim(),
    };
    if (mailPassword.trim()) body.mailPassword = mailPassword.trim();
    await patchSettings(body, "SMTP settings saved.");
  }

  async function saveShipping(e: React.FormEvent) {
    e.preventDefault();
    const usa = Number.parseFloat(shippingUsa);
    const intl = Number.parseFloat(shippingInternational);
    if (!Number.isFinite(usa) || usa < 0 || !Number.isFinite(intl) || intl < 0) {
      notify.warning("Shipping amounts must be zero or positive numbers.");
      return;
    }
    await patchSettings(
      {
        shippingUsa: Math.round(usa * 100) / 100,
        shippingInternational: Math.round(intl * 100) / 100,
      },
      "Shipping rates saved."
    );
  }

  async function clearSmtpPassword() {
    if (!confirm("Remove the saved SMTP password? You can set a new one after saving.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailPassword: "" }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Could not clear SMTP password.");
      applySaved(j as PaymentSettings);
      notify.success("SMTP password removed.");
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-settings-shell p-5 text-center">
        <div className="spinner-border text-warning mb-3" role="status" />
        <p className="text-secondary mb-0">Loading store settings…</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-shell">
      {/* Shared Header with Switcher Tabs */}
      <div className="admin-settings-header">
        <SettingsNavHeader
          currentTab="shipping"
          title="Store Settings"
          subtitle="Manage flat shipping rates and SMTP outbound mailer configuration."
        />
      </div>

      <div className="p-4 p-lg-5">
        {/* Navigation Tabs for Shipping and SMTP */}
        <div className="d-flex align-items-center gap-2 mb-4 pb-2 border-bottom">
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 rounded-2 ${
              activeTab === "shipping" ? "btn-dark fw-bold" : "btn-outline-secondary"
            }`}
            onClick={() => setActiveTab("shipping")}
          >
            <i className="bi bi-truck me-2" />
            Shipping Rates
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 rounded-2 ${
              activeTab === "smtp" ? "btn-dark fw-bold" : "btn-outline-secondary"
            }`}
            onClick={() => setActiveTab("smtp")}
          >
            <i className="bi bi-envelope-at me-2" />
            SMTP / Mailer
          </button>
          <Link
            href="/admin/dashboard/settings/payment-gateways"
            className="btn btn-sm btn-outline-warning text-dark fw-semibold ms-auto"
          >
            <i className="bi bi-credit-card-2-front me-2 text-warning" />
            Go to Payment Gateways ↗
          </Link>
        </div>

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <form onSubmit={(e) => void saveShipping(e)} className="border rounded-3 p-4 bg-white shadow-sm">
            <h2 className="h6 fw-bold text-dark mb-3 pb-2 border-bottom">Shipping Rates (Flat Rate)</h2>
            <p className="small text-secondary mb-4">
              Flat shipping amounts shown on checkout based on the customer&apos;s selected country. United States uses the USA rate;
              every other country uses the international rate. Amounts are in USD.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-6">
                <div className="luxury-input-group">
                  <label htmlFor="shipping-usa">USA / United States shipping (USD)</label>
                  <input
                    id="shipping-usa"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    className="luxury-input"
                    value={shippingUsa}
                    onChange={(e) => setShippingUsa(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="luxury-input-group">
                  <label htmlFor="shipping-international">International shipping (USD)</label>
                  <input
                    id="shipping-international"
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    className="luxury-input"
                    value={shippingInternational}
                    onChange={(e) => setShippingInternational(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-top">
              <button type="submit" className="btn-gold-action" disabled={saving}>
                {saving ? "Saving…" : "Save Shipping Settings"}
              </button>
            </div>
          </form>
        )}

        {/* SMTP Tab */}
        {activeTab === "smtp" && (
          <form onSubmit={(e) => void saveSmtp(e)} className="border rounded-3 p-4 bg-white shadow-sm">
            <h2 className="h6 fw-bold text-dark mb-3 pb-2 border-bottom">SMTP Outbound Mailer</h2>
            <p className="small text-secondary mb-4">
              Used for payment-link confirmations and other transactional mail from the API. Credentials are stored securely in the
              database.
            </p>

            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-6">
                <div className="luxury-input-group">
                  <label>SMTP host</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-input"
                    placeholder="smtp.yourhost.com"
                    value={mailHost}
                    onChange={(e) => setMailHost(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="luxury-input-group">
                  <label>Port</label>
                  <input
                    type="number"
                    min={1}
                    max={65535}
                    className="luxury-input"
                    value={mailPort}
                    onChange={(e) => setMailPort(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-6 col-lg-3 d-flex align-items-end">
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="mail-secure"
                    checked={mailSecure}
                    onChange={(e) => setMailSecure(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold text-secondary" htmlFor="mail-secure">
                    TLS / SSL (e.g. 465)
                  </label>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="luxury-input-group">
                  <label>SMTP username</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-input"
                    value={mailUser}
                    onChange={(e) => setMailUser(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="luxury-input-group">
                  <label>SMTP password</label>
                  <div className="input-group">
                    <input
                      type="password"
                      autoComplete="new-password"
                      className="luxury-input"
                      placeholder={data?.mailPasswordMasked ? "Leave blank to keep password" : "Enter password"}
                      value={mailPassword}
                      onChange={(e) => setMailPassword(e.target.value)}
                    />
                    {data?.mailPasswordMasked ? (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm text-nowrap"
                        disabled={saving}
                        onClick={() => void clearSmtpPassword()}
                      >
                        Clear password
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="luxury-input-group">
                  <label>From address (visible to recipients)</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-input"
                    placeholder="SQSpeptides <support@sqspeptides.com>"
                    value={mailFrom}
                    onChange={(e) => setMailFrom(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-top">
              <button type="submit" className="btn-gold-action" disabled={saving}>
                {saving ? "Saving…" : "Save SMTP Settings"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
