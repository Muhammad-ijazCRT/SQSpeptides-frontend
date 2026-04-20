"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { InvoiceRow } from "@/components/admin/admin-invoices-types";

export function AdminInvoicesCreatePage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const [pendingCount, setPendingCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  const [gatewayType, setGatewayType] = useState<"nowpayments" | "zelle" | "external">("nowpayments");
  const [gatewayLabel, setGatewayLabel] = useState("NOWPayments");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/payment-invoices", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !Array.isArray(data)) {
        setPendingCount(0);
        setPaidCount(0);
        setTotalCount(0);
        return;
      }
      const rows = data as InvoiceRow[];
      setTotalCount(rows.length);
      setPendingCount(rows.filter((r) => r.status.toLowerCase() === "pending").length);
      setPaidCount(rows.filter((r) => r.status.toLowerCase() === "paid").length);
    } catch {
      setPendingCount(0);
      setPaidCount(0);
      setTotalCount(0);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setCreating(true);
    try {
      const amt = Number(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        throw new Error("Enter a valid amount.");
      }
      const body: Record<string, unknown> = {
        gatewayType,
        gatewayLabel:
          gatewayLabel.trim() ||
          (gatewayType === "nowpayments" ? "NOWPayments" : gatewayType === "zelle" ? "Zelle" : "Payment link"),
        amount: amt,
        currency: currency.trim().toLowerCase() || "usd",
        customerEmail: customerEmail.trim(),
        description: description.trim() || undefined,
        customerName: customerName.trim() || undefined,
      };
      if (gatewayType === "external") {
        body.externalCheckoutUrl = externalUrl.trim();
      }
      const res = await fetch("/api/admin/payment-invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        const m = typeof j.message === "string" ? j.message : Array.isArray(j.message) ? j.message.join(", ") : "Create failed";
        throw new Error(m);
      }
      setMsg("Payment link created.");
      setAmount("");
      setCustomerEmail("");
      setCustomerName("");
      setDescription("");
      setExternalUrl("");
      await loadStats();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="container-fluid py-2 py-lg-3 px-0 px-sm-1">
      {err ? (
        <div className="alert alert-danger border-0 rounded-3 shadow-sm py-3 small mb-3" role="alert">
          {err}
        </div>
      ) : null}
      {msg ? (
        <div className="alert alert-success border-0 rounded-3 shadow-sm py-3 small mb-3" role="status">
          {msg}{" "}
          <Link href="/admin/dashboard/history" className="alert-link fw-semibold">
            View recent links
          </Link>
        </div>
      ) : null}

      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--warning" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Pending</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{statsLoading ? "—" : pendingCount}</p>
                <p className="small text-secondary mb-0 mt-1">Awaiting payment</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--success" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Paid</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{statsLoading ? "—" : paidCount}</p>
                <p className="small text-secondary mb-0 mt-1">Completed links</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--primary" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">All links</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{statsLoading ? "—" : totalCount}</p>
                <p className="small text-secondary mb-0 mt-1">Created to date</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-xl-4">
        <div className="col-lg-6 col-xl-5">
          <div className="card border-0 admin-card-elevated admin-card-gold-cap h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold text-dark mb-1">New invoice</h2>
              <p className="small text-secondary mb-4">
                NOWPayments uses keys from Store settings. Zelle uses your saved payee; customers can submit proof on the pay page.
                External sends buyers to any https URL you provide.
              </p>
              <form onSubmit={createInvoice} className="vstack gap-3">
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Gateway mode</label>
                  <select
                    className="form-select rounded-3"
                    value={gatewayType}
                    onChange={(e) => {
                      const v = e.target.value as "nowpayments" | "zelle" | "external";
                      setGatewayType(v);
                      if (v === "nowpayments") setGatewayLabel("NOWPayments");
                      else if (v === "zelle") setGatewayLabel("Zelle");
                      else setGatewayLabel("External");
                    }}
                  >
                    <option value="nowpayments">NOWPayments (crypto)</option>
                    <option value="zelle">Zelle (instructions — you confirm)</option>
                    <option value="external">External https link (you confirm)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Display label</label>
                  <input
                    className="form-control rounded-3"
                    value={gatewayLabel}
                    onChange={(e) => setGatewayLabel(e.target.value)}
                    placeholder="Shown to customer"
                    maxLength={80}
                    required
                  />
                </div>
                <div className="row g-2">
                  <div className="col-7">
                    <label className="form-label small fw-semibold text-secondary mb-1">Amount</label>
                    <input
                      className="form-control rounded-3"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-5">
                    <label className="form-label small fw-semibold text-secondary mb-1">Currency</label>
                    <input
                      className="form-control rounded-3"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      maxLength={10}
                      placeholder="usd"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Customer email</label>
                  <input
                    className="form-control rounded-3"
                    type="email"
                    autoComplete="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Customer name (optional)</label>
                  <input
                    className="form-control rounded-3"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    maxLength={120}
                  />
                </div>
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Memo / description (optional)</label>
                  <input className="form-control rounded-3" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
                </div>
                {gatewayType === "external" ? (
                  <div>
                    <label className="form-label small fw-semibold text-secondary mb-1">Payment URL (https only)</label>
                    <input
                      className="form-control rounded-3 text-break"
                      type="url"
                      value={externalUrl}
                      onChange={(e) => setExternalUrl(e.target.value)}
                      placeholder="https://…"
                      required
                    />
                  </div>
                ) : gatewayType === "nowpayments" ? (
                  <p className="small text-secondary mb-0">
                    Invoice amount in <strong>USD</strong>. Keys live under{" "}
                    <Link href="/admin/dashboard/settings" className="fw-semibold">
                      Store settings
                    </Link>
                    .
                  </p>
                ) : (
                  <p className="small text-secondary mb-0">
                    Payee details come from{" "}
                    <Link href="/admin/dashboard/settings" className="fw-semibold">
                      Store settings
                    </Link>
                    . Mark paid from Recent payment links after you verify the transfer.
                  </p>
                )}
                <button type="submit" className="btn btn-admin-gold btn-lg rounded-pill mt-1" disabled={creating}>
                  <i className="bi bi-plus-lg me-2" aria-hidden />
                  {creating ? "Creating…" : "Create payment link"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-xl-7">
          <div className="card border-0 admin-card-elevated h-100">
            <div className="card-body p-4 d-flex flex-column">
              <h2 className="h5 fw-bold text-dark mb-2">Quick reference</h2>
              <ul className="small text-secondary mb-0 ps-3 vstack gap-2">
                <li>Copy the customer link from Recent payment links after each create.</li>
                <li>Zelle and external invoices stay pending until you mark them paid.</li>
                <li>Configure SMTP under Store settings so confirmation emails send reliably.</li>
              </ul>
              <div className="mt-auto pt-4">
                <Link href="/admin/dashboard/history" className="btn btn-outline-secondary rounded-pill px-4">
                  <i className="bi bi-clock-history me-2" aria-hidden />
                  Recent payment links
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
