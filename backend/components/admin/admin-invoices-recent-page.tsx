"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { invoiceStatusBadgeClass, type InvoiceRow } from "@/components/admin/admin-invoices-types";

function invoiceSearchBlob(r: InvoiceRow): string {
  const amountFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: r.currency.toUpperCase(),
  }).format(r.amount);
  return [
    r.id,
    r.publicToken,
    r.customerEmail,
    r.customerName ?? "",
    r.description ?? "",
    r.gatewayLabel,
    r.gatewayType,
    r.status,
    r.shareUrl,
    r.checkoutUrl ?? "",
    r.zelleTransactionId ?? "",
    r.zelleProofUrl ?? "",
    r.currency,
    String(r.amount),
    amountFormatted,
    r.createdAt,
    r.paidAt ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function AdminInvoicesRecentPage() {
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [markModal, setMarkModal] = useState<InvoiceRow | null>(null);
  const [markNote, setMarkNote] = useState("");
  const [markBusy, setMarkBusy] = useState(false);

  const pendingCount = useMemo(() => rows.filter((r) => r.status.toLowerCase() === "pending").length, [rows]);
  const paidCount = useMemo(() => rows.filter((r) => r.status.toLowerCase() === "paid").length, [rows]);

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => invoiceSearchBlob(r).includes(q));
  }, [rows, searchQuery]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/payment-invoices", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof data.message === "string" ? data.message : "Could not load invoices.");
        setRows([]);
        return;
      }
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setErr("Network error.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Copied to clipboard.");
      setTimeout(() => setMsg(null), 2500);
    } catch {
      setErr("Could not copy — select the link manually.");
    }
  }

  async function submitMarkPaid() {
    if (!markModal) return;
    setMarkBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/payment-invoices/${encodeURIComponent(markModal.id)}/mark-external-paid`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNote: markNote.trim() || undefined }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof j.message === "string" ? j.message : "Update failed");
      }
      setMarkModal(null);
      setMarkNote("");
      setMsg("Marked as paid. Customer confirmation email was sent if mail is configured.");
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Update failed");
    } finally {
      setMarkBusy(false);
    }
  }

  if (loading && rows.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-2 py-lg-3 px-0 px-sm-1">
      <div className="d-flex flex-wrap justify-content-end gap-2 mb-3">
        <Link href="/admin/dashboard/invoices/new" className="btn btn-admin-gold rounded-pill px-4">
          <i className="bi bi-plus-lg me-2" aria-hidden />
          Create link
        </Link>
        <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={() => void load()} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden />
          Refresh
        </button>
      </div>

      {err ? (
        <div className="alert alert-danger border-0 rounded-3 shadow-sm py-3 small mb-3" role="alert">
          {err}
        </div>
      ) : null}
      {msg ? (
        <div className="alert alert-success border-0 rounded-3 shadow-sm py-3 small mb-3" role="status">
          {msg}
        </div>
      ) : null}

      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--warning" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Pending</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{pendingCount}</p>
                <p className="small text-secondary mb-0 mt-1">Open payment links</p>
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
                <p className="h3 fw-bold mb-0 tabular-nums">{paidCount}</p>
                <p className="small text-secondary mb-0 mt-1">Completed</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--primary" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Total links</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{rows.length}</p>
                <p className="small text-secondary mb-0 mt-1">All statuses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 admin-card-elevated mb-4">
        <div className="card-body p-0">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 px-4 py-3 border-bottom bg-light bg-opacity-50">
            <div className="min-w-0 flex-grow-1">
              <h2 className="h5 fw-bold text-dark mb-0">Payment link history</h2>
              <p className="small text-secondary mb-0 mt-1">Newest invoices appear first after refresh</p>
              {searchQuery.trim() && rows.length > 0 ? (
                <p className="small text-secondary mb-0 mt-1">
                  Showing <span className="fw-semibold text-dark">{filteredRows.length}</span> of {rows.length}
                </p>
              ) : null}
            </div>
            <div
              className="position-relative flex-shrink-0"
              style={{ width: "100%", maxWidth: "min(26rem, 100%)" }}
            >
              <i
                className="bi bi-search position-absolute top-50 translate-middle-y text-secondary opacity-75"
                style={{ left: "1rem", fontSize: "0.95rem", zIndex: 2, pointerEvents: "none" }}
                aria-hidden
              />
              <input
                id="invoice-history-search"
                type="search"
                className="form-control rounded-pill border-0 py-2 ps-5"
                style={{
                  paddingRight: searchQuery ? "2.5rem" : "1rem",
                  background: "linear-gradient(180deg, #fff 0%, #fafbfc 100%)",
                  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.05)",
                }}
                placeholder="Search email, amount, link, ID…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                aria-label="Search invoices"
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="btn btn-sm btn-link position-absolute top-50 translate-middle-y p-0 text-secondary"
                  style={{ right: "0.65rem", zIndex: 2, lineHeight: 1 }}
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-lg" style={{ fontSize: "0.85rem" }} aria-hidden />
                </button>
              ) : null}
            </div>
          </div>
          {rows.length === 0 ? (
            <div className="admin-empty-panel border-0 rounded-0">
              <i className="bi bi-receipt fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
              No payment links yet.{" "}
              <Link href="/admin/dashboard/invoices/new" className="fw-semibold">
                Create one
              </Link>
              .
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="admin-empty-panel border-0 rounded-0">
              <i className="bi bi-search fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
              <p className="mb-2">No invoices match &quot;{searchQuery.trim()}&quot;.</p>
              <button type="button" className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => setSearchQuery("")}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <div className="admin-table-shell border-0 rounded-0 shadow-none">
                <table className="table table-admin table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Status</th>
                      <th>Customer</th>
                      <th>Gateway</th>
                      <th>Zelle proof</th>
                      <th className="text-end">Amount</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <span className={invoiceStatusBadgeClass(r.status)}>{r.status}</span>
                          {r.paidAt ? (
                            <div className="small text-secondary mt-1">{new Date(r.paidAt).toLocaleString()}</div>
                          ) : null}
                        </td>
                        <td>
                          <div className="small fw-semibold text-break">{r.customerEmail}</div>
                          {r.customerName ? <div className="small text-secondary">{r.customerName}</div> : null}
                        </td>
                        <td>
                          <div className="small fw-medium">{r.gatewayLabel}</div>
                          <div className="small text-secondary text-capitalize">{r.gatewayType.replace("_", " ")}</div>
                        </td>
                        <td className="small">
                          {r.gatewayType === "zelle" ? (
                            r.zelleSubmittedAt ? (
                              <>
                                <span className="badge rounded-pill bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-2 py-1">
                                  Submitted
                                </span>
                                {r.zelleTransactionId ? (
                                  <div className="mt-1 text-break" title={r.zelleTransactionId}>
                                    <span className="text-secondary">TXN:</span> {r.zelleTransactionId.slice(0, 36)}
                                    {r.zelleTransactionId.length > 36 ? "…" : ""}
                                  </div>
                                ) : null}
                                {r.zelleProofUrl ? (
                                  <a href={r.zelleProofUrl} target="_blank" rel="noopener noreferrer" className="d-inline-block mt-1 small fw-semibold">
                                    View screenshot
                                  </a>
                                ) : null}
                              </>
                            ) : (
                              <span className="text-secondary">—</span>
                            )
                          ) : (
                            <span className="text-secondary">—</span>
                          )}
                        </td>
                        <td className="text-end small fw-semibold tabular-nums">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: r.currency.toUpperCase() }).format(r.amount)}
                        </td>
                        <td className="text-end">
                          <div className="d-flex flex-column gap-1 align-items-end">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                              onClick={() => void copyText(r.shareUrl)}
                            >
                              Copy link
                            </button>
                            {(r.gatewayType === "external" || r.gatewayType === "zelle") && r.status === "pending" ? (
                              <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => setMarkModal(r)}>
                                Mark paid
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="px-4 py-3 border-top bg-light bg-opacity-25">
            <p className="small text-secondary mb-0">
              NOWPayments results are stored in <code className="small">paymentDetails</code> when paid. Outgoing mail:{" "}
              <Link href="/admin/dashboard/settings">Store settings</Link>.
            </p>
          </div>
        </div>
      </section>

      {markModal ? (
        <div className="modal d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.45)" }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-3">
              <div className="modal-header border-0 pb-0">
                <h2 className="modal-title h5 fw-bold">
                  {markModal.gatewayType === "zelle" ? "Confirm Zelle payment" : "Confirm external payment"}
                </h2>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => !markBusy && setMarkModal(null)} />
              </div>
              <div className="modal-body">
                <p className="small text-secondary">
                  Only mark paid after you have verified the funds. This records the invoice as paid and emails the customer.
                </p>
                <p className="small mb-2">
                  <span className="text-secondary">Customer:</span> {markModal.customerEmail}
                </p>
                {markModal.gatewayType === "zelle" && !markModal.zelleSubmittedAt ? (
                  <p className="small text-warning mb-3">The customer has not submitted a transaction ID or screenshot yet.</p>
                ) : null}
                {markModal.gatewayType === "zelle" && markModal.zelleSubmittedAt ? (
                  <div className="small mb-3 rounded-3 border bg-light p-3">
                    <div className="fw-semibold text-dark mb-1">Customer proof on file</div>
                    {markModal.zelleTransactionId ? (
                      <div className="text-break mb-1">
                        <span className="text-secondary">Transaction ID:</span> {markModal.zelleTransactionId}
                      </div>
                    ) : null}
                    {markModal.zelleProofUrl ? (
                      <a href={markModal.zelleProofUrl} target="_blank" rel="noopener noreferrer" className="small fw-semibold">
                        Open screenshot
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <label className="form-label small fw-semibold">Internal reference (optional)</label>
                <input className="form-control form-control-sm rounded-3" value={markNote} onChange={(e) => setMarkNote(e.target.value)} maxLength={500} />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill" onClick={() => setMarkModal(null)} disabled={markBusy}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success rounded-pill px-4" onClick={() => void submitMarkPaid()} disabled={markBusy}>
                  {markBusy ? "Saving…" : "Confirm paid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
