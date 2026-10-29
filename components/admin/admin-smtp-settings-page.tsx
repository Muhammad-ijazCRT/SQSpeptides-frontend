"use client";

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
};

export function AdminSmtpSettingsPage() {
  const [data, setData] = useState<PaymentSettings | null>(null);
  const [mailHost, setMailHost] = useState("");
  const [mailPort, setMailPort] = useState("587");
  const [mailSecure, setMailSecure] = useState(false);
  const [mailUser, setMailUser] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [mailFrom, setMailFrom] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applySaved = useCallback((saved: PaymentSettings) => {
    setData(saved);
    setMailHost(saved.mailHost ?? "");
    setMailPort(saved.mailPort != null ? String(saved.mailPort) : "587");
    setMailSecure(Boolean(saved.mailSecure));
    setMailUser(saved.mailUser ?? "");
    setMailPassword("");
    setMailFrom(saved.mailFrom ?? "");
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-settings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = (await res.json()) as PaymentSettings;
      applySaved(j);
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to load SMTP settings.");
    } finally {
      setLoading(false);
    }
  }, [applySaved]);

  useEffect(() => {
    void load();
  }, [load]);

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

    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = (await res.json()) as PaymentSettings;
      applySaved(saved);
      notify.success("SMTP mailer settings saved successfully!");
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to save SMTP settings.");
    } finally {
      setSaving(false);
    }
  }

  async function clearSmtpPassword() {
    if (!confirm("Are you sure you want to remove the saved SMTP password?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mailPassword: "" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved = (await res.json()) as PaymentSettings;
      applySaved(saved);
      notify.success("Saved SMTP password removed.");
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to remove password.");
    } finally {
      setSaving(false);
    }
  }

  function applyPreset(host: string, port: string, secure: boolean) {
    setMailHost(host);
    setMailPort(port);
    setMailSecure(secure);
    notify.info(`Applied ${host} preset.`);
  }

  if (loading) {
    return (
      <div className="admin-settings-shell p-5 text-center">
        <div className="spinner-border text-warning mb-3" role="status" />
        <p className="text-secondary mb-0">Loading SMTP mailer configuration…</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-shell">
      {/* Shared Header with Switcher Tabs */}
      <div className="admin-settings-header">
        <SettingsNavHeader
          currentTab="smtp"
          title="SMTP Settings"
          subtitle="Configure outbound transactional email delivery for order receipts and admin notifications."
        />
      </div>

      <div className="p-4 p-lg-5">
        <div className="row g-4">
          {/* Main SMTP Form */}
          <div className="col-12 col-xl-7">
            <form onSubmit={(e) => void saveSmtp(e)} className="border rounded-3 p-4 bg-white shadow-xs">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h3 className="h6 fw-semibold text-dark mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-envelope-check text-warning" />
                  <span>Outbound Mailer Configuration</span>
                </h3>
                <span
                  className={`badge rounded-pill ${
                    data?.mailConfigured ? "bg-success-subtle text-success border border-success-subtle" : "bg-warning-subtle text-dark border border-warning-subtle"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {data?.mailConfigured ? "✓ Active Mailer" : "○ Inactive"}
                </span>
              </div>

              {/* Host */}
              <div className="luxury-input-group mb-3">
                <label>SMTP Host</label>
                <div className="luxury-field-shell">
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-field-input"
                    placeholder="e.g. smtp.hostinger.com or smtp.gmail.com"
                    value={mailHost}
                    onChange={(e) => setMailHost(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Port & SSL */}
              <div className="row g-3 mb-3 align-items-center">
                <div className="col-12 col-sm-6">
                  <div className="luxury-input-group">
                    <label>Port</label>
                    <div className="luxury-field-shell">
                      <input
                        type="number"
                        min={1}
                        max={65535}
                        className="luxury-field-input"
                        value={mailPort}
                        onChange={(e) => setMailPort(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-6 pt-sm-4">
                  <div className="form-check form-switch mt-1">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="mail-secure"
                      checked={mailSecure}
                      onChange={(e) => setMailSecure(e.target.checked)}
                    />
                    <label className="form-check-label text-dark small" htmlFor="mail-secure">
                      SSL / TLS (e.g. 465)
                    </label>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="luxury-input-group mb-3">
                <label>SMTP Username / Account Email</label>
                <div className="luxury-field-shell">
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-field-input"
                    placeholder="e.g. support@sqspeptides.com"
                    value={mailUser}
                    onChange={(e) => setMailUser(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="luxury-input-group mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="mb-0">SMTP Password</label>
                  {data?.mailPasswordMasked && (
                    <span className="small text-muted">Password on file: {data.mailPasswordMasked}</span>
                  )}
                </div>
                <div className="luxury-field-shell">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="luxury-field-input"
                    placeholder={data?.mailPasswordMasked ? "Leave blank to keep current password" : "Enter SMTP account password"}
                    value={mailPassword}
                    onChange={(e) => setMailPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="luxury-field-action-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                  {data?.mailPasswordMasked && (
                    <button
                      type="button"
                      className="luxury-field-action-btn is-danger"
                      onClick={() => void clearSmtpPassword()}
                      title="Clear saved password"
                      disabled={saving}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </div>
              </div>

              {/* From Address */}
              <div className="luxury-input-group mb-4">
                <label>From Display Address (Visible to Customer)</label>
                <div className="luxury-field-shell">
                  <input
                    type="text"
                    autoComplete="off"
                    className="luxury-field-input"
                    placeholder="SQSpeptides <support@sqspeptides.com>"
                    value={mailFrom}
                    onChange={(e) => setMailFrom(e.target.value)}
                  />
                </div>
                <span className="form-text small text-secondary">
                  Tip: Use the same sender domain as your SMTP server to prevent emails from being flagged as spam.
                </span>
              </div>

              {/* Save Button */}
              <div className="pt-3 border-top">
                <button type="submit" className="btn-gold-action" disabled={saving}>
                  {saving ? "Saving Changes…" : "Save SMTP Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Presets & Guidance */}
          <div className="col-12 col-xl-5">
            <div className="border rounded-3 p-4 bg-light h-100 shadow-xs">
              <h3 className="h6 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-magic text-warning" />
                <span>Common Mail Server Presets</span>
              </h3>
              <p className="small text-secondary mb-3">
                Quickly fill common host and port settings for popular email providers:
              </p>

              {/* Hostinger Preset */}
              <div className="p-3 bg-white rounded-3 border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="small text-dark">Hostinger Business Mail</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => applyPreset("smtp.hostinger.com", "465", true)}
                  >
                    Use Preset
                  </button>
                </div>
                <span className="small text-secondary font-monospace">smtp.hostinger.com : 465 (SSL)</span>
              </div>

              {/* Gmail / Google Workspace Preset */}
              <div className="p-3 bg-white rounded-3 border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="small text-dark">Google Workspace / Gmail</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => applyPreset("smtp.gmail.com", "587", false)}
                  >
                    Use Preset
                  </button>
                </div>
                <span className="small text-secondary font-monospace">smtp.gmail.com : 587 (TLS)</span>
              </div>

              {/* SendGrid */}
              <div className="p-3 bg-white rounded-3 border">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="small text-dark">SendGrid API Relay</strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark"
                    onClick={() => applyPreset("smtp.sendgrid.net", "587", false)}
                  >
                    Use Preset
                  </button>
                </div>
                <span className="small text-secondary font-monospace">smtp.sendgrid.net : 587 (TLS)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
