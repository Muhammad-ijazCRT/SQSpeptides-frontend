"use client";

import { useCallback, useEffect, useState } from "react";

type PaymentSettings = {
  nowpaymentsApiKeyMasked: string | null;
  nowpaymentsPublicKeyMasked: string | null;
  nowpaymentsSandbox: boolean;
  nowpaymentsConfigured: boolean;
};

export function AdminPaymentSettingsPage() {
  const [data, setData] = useState<PaymentSettings | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [sandbox, setSandbox] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

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
      setData(j);
      setSandbox(j.nowpaymentsSandbox);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      const body: Record<string, unknown> = { nowpaymentsSandbox: sandbox };
      if (apiKey.trim()) body.nowpaymentsApiKey = apiKey.trim();
      if (publicKey.trim()) body.nowpaymentsPublicKey = publicKey.trim();
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
      setData(j as PaymentSettings);
      setApiKey("");
      setPublicKey("");
      setMsg("Settings saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
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
      setData(j as PaymentSettings);
      setMsg("Keys removed.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Clear failed");
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = "form-control";

  return (
    <div className="admin-card-elevated rounded-3 border-0 bg-white p-4 p-lg-5">
      <h1 className="h4 fw-bold text-dark mb-2">Store settings</h1>
      <p className="text-secondary small mb-4">
        NOWPayments uses your <strong>API key</strong> (server) and <strong>public key</strong> (stored for checkout; safe to expose to the browser).
        After payment, the storefront checks status with the NOWPayments API when the customer returns — no IPN webhook is used.
      </p>

      {loading ? (
        <p className="text-secondary small">Loading…</p>
      ) : err && !data ? (
        <div className="alert alert-danger">{err}</div>
      ) : (
        <form onSubmit={(e) => void save(e)} className="row g-4">
          {err ? (
            <div className="col-12">
              <div className="alert alert-danger mb-0">{err}</div>
            </div>
          ) : null}
          {msg ? (
            <div className="col-12">
              <div className="alert alert-success mb-0">{msg}</div>
            </div>
          ) : null}

          <div className="col-12">
            <h2 className="h6 fw-semibold text-dark mb-3">NOWPayments</h2>
            <p className="small text-secondary mb-3">
              Status:{" "}
              {data?.nowpaymentsConfigured ? (
                <span className="text-success fw-medium">Ready for crypto checkout</span>
              ) : (
                <span className="text-warning fw-medium">Not configured — add both API key and public key</span>
              )}
            </p>
          </div>

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

          <div className="col-12 col-lg-6 d-flex align-items-end">
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

          <div className="col-12 d-flex flex-wrap gap-2">
            <button type="submit" className="btn btn-dark" disabled={saving}>
              {saving ? "Saving…" : "Save payment settings"}
            </button>
            <button type="button" className="btn btn-outline-danger" disabled={saving || !data?.nowpaymentsConfigured} onClick={() => void clearKeys()}>
              Remove keys
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
