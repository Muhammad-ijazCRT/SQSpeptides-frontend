"use client";

import { useCallback, useEffect, useState } from "react";

type PaymentSettings = {
  nowpaymentsApiKeyMasked: string | null;
  nowpaymentsPublicKeyMasked: string | null;
  nowpaymentsSandbox: boolean;
  nowpaymentsConfigured: boolean;
  zelleEmail: string | null;
  zellePhone: string | null;
  zelleConfigured: boolean;
  mailHost: string | null;
  mailPort: number | null;
  mailSecure: boolean;
  mailUser: string | null;
  mailPasswordMasked: string | null;
  mailFrom: string | null;
  mailConfigured: boolean;
};

type SettingsTab = "payment" | "smtp";

export function AdminPaymentSettingsPage() {
  const [data, setData] = useState<PaymentSettings | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("payment");
  const [apiKey, setApiKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [sandbox, setSandbox] = useState(true);
  const [zelleEmail, setZelleEmail] = useState("");
  const [zellePhone, setZellePhone] = useState("");
  const [mailHost, setMailHost] = useState("");
  const [mailPort, setMailPort] = useState("587");
  const [mailSecure, setMailSecure] = useState(false);
  const [mailUser, setMailUser] = useState("");
  const [mailPassword, setMailPassword] = useState("");
  const [mailFrom, setMailFrom] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const applySaved = useCallback((saved: PaymentSettings) => {
    setData(saved);
    setSandbox(saved.nowpaymentsSandbox);
    setZelleEmail(saved.zelleEmail ?? "");
    setZellePhone(saved.zellePhone ?? "");
    setMailHost(saved.mailHost ?? "");
    setMailPort(saved.mailPort != null ? String(saved.mailPort) : "587");
    setMailSecure(Boolean(saved.mailSecure));
    setMailUser(saved.mailUser ?? "");
    setMailPassword("");
    setMailFrom(saved.mailFrom ?? "");
    setApiKey("");
    setPublicKey("");
  }, []);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-settings", { cache: "no-store" });
      const j = (await res.json().catch(() => ({}))) as PaymentSettings & { message?: string | string[] };
      if (!res.ok) {
        const apiMsg = Array.isArray(j.message) ? j.message.join(", ") : typeof j.message === "string" ? j.message : "";
        throw new Error(
          apiMsg ||
            (res.status === 401
              ? "Not signed in as admin. Open /admin/login in this browser, then try again."
              : `Could not load payment settings (HTTP ${res.status}). Is the API running on port 3001? Run: cd backend && npx prisma migrate deploy`)
        );
      }
      applySaved(j);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [applySaved]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchSettings(body: Record<string, unknown>, successMsg: string) {
    setErr(null);
    setMsg(null);
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
      setMsg(successMsg);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function savePayment(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {
      nowpaymentsSandbox: sandbox,
      zelleEmail: zelleEmail.trim() || "",
      zellePhone: zellePhone.trim() || "",
    };
    if (apiKey.trim()) body.nowpaymentsApiKey = apiKey.trim();
    if (publicKey.trim()) body.nowpaymentsPublicKey = publicKey.trim();
    await patchSettings(body, "Payment settings saved.");
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

  async function clearSmtpPassword() {
    if (!confirm("Remove the saved SMTP password? You can set a new one after saving.")) return;
    setErr(null);
    setMsg(null);
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
      setMsg("SMTP password removed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setSaving(false);
    }
  }

  async function clearKeys() {
    if (!confirm("Remove NOWPayments API and public keys? Crypto checkout will stop until you add them again.")) return;
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nowpaymentsApiKey: "",
          nowpaymentsPublicKey: "",
          nowpaymentsSandbox: sandbox,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error("Could not clear keys.");
      applySaved(j as PaymentSettings);
      setMsg("NOWPayments keys removed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "form-control";

  function tabBtnClass(tab: SettingsTab): string {
    return `nav-link ${activeTab === tab ? "active fw-semibold" : "text-secondary"}`;
  }

  return (
    <div className="admin-card-elevated rounded-3 border-0 bg-white p-4 p-lg-5">
      <h1 className="h4 fw-bold text-dark mb-1">Store settings</h1>
      <p className="text-secondary small mb-0">
        Payment gateways and outgoing mail are stored in the database. Each tab has its own save action and only updates that section.
      </p>

      {loading ? (
        <p className="text-secondary small mt-4">Loading…</p>
      ) : err && !data ? (
        <div className="alert alert-danger mt-4">{err}</div>
      ) : (
        <div className="mt-4">
          {err ? (
            <div className="alert alert-danger mb-3" role="alert">
              {err}
            </div>
          ) : null}
          {msg ? (
            <div className="alert alert-success mb-3" role="status">
              {msg}
            </div>
          ) : null}

          <ul className="nav nav-tabs nav-fill border-bottom mb-0" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={tabBtnClass("payment")}
                id="tab-payment"
                role="tab"
                aria-selected={activeTab === "payment"}
                onClick={() => setActiveTab("payment")}
              >
                <i className="bi bi-credit-card-2-front me-2 d-none d-sm-inline" aria-hidden />
                Payment
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={tabBtnClass("smtp")}
                id="tab-smtp"
                role="tab"
                aria-selected={activeTab === "smtp"}
                onClick={() => setActiveTab("smtp")}
              >
                <i className="bi bi-envelope-at me-2 d-none d-sm-inline" aria-hidden />
                SMTP / email
              </button>
            </li>
          </ul>

          <div className="tab-content border border-top-0 rounded-bottom p-4 p-lg-4 bg-white">
            <div
              className={`tab-pane fade ${activeTab === "payment" ? "show active" : ""}`}
              role="tabpanel"
              aria-labelledby="tab-payment"
            >
              <form onSubmit={(e) => void savePayment(e)} className="mb-0">
                <p className="small text-secondary mb-4">
                  Zelle and NOWPayments power checkout and admin payment links. The storefront checks NOWPayments when the customer returns
                  — no IPN webhook.
                </p>

                <h2 className="h6 fw-semibold text-dark mb-2">Zelle (manual bank transfer)</h2>
                <p className="small text-secondary mb-3">
                  Shown on checkout when at least one field is set. Customers pay outside the site, then submit proof; you verify in
                  Orders.
                </p>
                <p className="small mb-3">
                  Status:{" "}
                  {data?.zelleConfigured ? (
                    <span className="text-success fw-medium">Zelle checkout enabled</span>
                  ) : (
                    <span className="text-secondary fw-medium">Not shown — add an email and/or phone</span>
                  )}
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">Zelle email</label>
                    <input
                      type="email"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="payments@yourbusiness.com"
                      value={zelleEmail}
                      onChange={(e) => setZelleEmail(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">Zelle phone</label>
                    <input
                      type="tel"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="+1… (optional if email is set)"
                      value={zellePhone}
                      onChange={(e) => setZellePhone(e.target.value)}
                    />
                  </div>
                </div>

                <hr className="text-secondary opacity-25" />

                <h2 className="h6 fw-semibold text-dark mb-2">NOWPayments</h2>
                <p className="small text-secondary mb-3">
                  Status:{" "}
                  {data?.nowpaymentsConfigured ? (
                    <span className="text-success fw-medium">Ready for crypto checkout</span>
                  ) : (
                    <span className="text-warning fw-medium">Not configured — add both API key and public key</span>
                  )}
                </p>

                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">API key</label>
                    <p className="small text-muted mb-1">Current: {data?.nowpaymentsApiKeyMasked ?? "—"}</p>
                    <input
                      type="password"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="New API key (leave blank to keep)"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">Public key</label>
                    <p className="small text-muted mb-1">Current: {data?.nowpaymentsPublicKeyMasked ?? "—"}</p>
                    <input
                      type="text"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="Public key from NOWPayments dashboard"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="np-sandbox"
                        checked={sandbox}
                        onChange={(e) => setSandbox(e.target.checked)}
                      />
                      <label className="form-check-label small" htmlFor="np-sandbox">
                        Use NOWPayments sandbox API (<code>api-sandbox.nowpayments.io</code>)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2 pt-4 mt-4 border-top">
                  <button type="submit" className="btn btn-dark" disabled={saving}>
                    {saving ? "Saving…" : "Save payment settings"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    disabled={saving || !data?.nowpaymentsConfigured}
                    onClick={() => void clearKeys()}
                  >
                    Remove NOWPayments keys
                  </button>
                </div>
              </form>
            </div>

            <div
              className={`tab-pane fade ${activeTab === "smtp" ? "show active" : ""}`}
              role="tabpanel"
              aria-labelledby="tab-smtp"
            >
              <form onSubmit={(e) => void saveSmtp(e)} className="mb-0">
                <p className="small text-secondary mb-4">
                  Used for payment-link confirmations and other transactional mail from the API. Credentials are stored in the database;
                  the password is never returned in full.
                </p>
                <p className="small mb-4">
                  Status:{" "}
                  {data?.mailConfigured ? (
                    <span className="text-success fw-medium">Mailer configured</span>
                  ) : (
                    <span className="text-secondary fw-medium">Not active — set host and From address</span>
                  )}
                  {data?.mailPasswordMasked ? (
                    <span className="text-secondary"> · Password on file: {data.mailPasswordMasked}</span>
                  ) : null}
                </p>

                <div className="row g-3">
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">SMTP host</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="smtp.yourhost.com"
                      value={mailHost}
                      onChange={(e) => setMailHost(e.target.value)}
                    />
                  </div>
                  <div className="col-6 col-lg-3">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">Port</label>
                    <input
                      type="number"
                      min={1}
                      max={65535}
                      className={fieldClass}
                      value={mailPort}
                      onChange={(e) => setMailPort(e.target.value)}
                    />
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
                      <label className="form-check-label small" htmlFor="mail-secure">
                        TLS / SSL (e.g. 465)
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">SMTP username (optional)</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={fieldClass}
                      value={mailUser}
                      onChange={(e) => setMailUser(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-lg-6">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">SMTP password</label>
                    <p className="small text-muted mb-1">Leave blank to keep the current password.</p>
                    <div className="d-flex flex-wrap gap-2 align-items-center">
                      <input
                        type="password"
                        autoComplete="new-password"
                        className={fieldClass}
                        style={{ minWidth: "12rem", flex: "1 1 12rem" }}
                        value={mailPassword}
                        onChange={(e) => setMailPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm text-nowrap"
                        disabled={saving || !data?.mailPasswordMasked}
                        onClick={() => void clearSmtpPassword()}
                      >
                        Clear saved password
                      </button>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-secondary text-uppercase">From (visible to recipients)</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className={fieldClass}
                      placeholder="SQSpeptides <billing@yourdomain.com>"
                      value={mailFrom}
                      onChange={(e) => setMailFrom(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-top">
                  <button type="submit" className="btn btn-dark" disabled={saving}>
                    {saving ? "Saving…" : "Save SMTP settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
