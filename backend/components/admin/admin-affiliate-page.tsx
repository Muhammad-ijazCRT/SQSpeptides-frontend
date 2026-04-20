"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Settings = { affiliateCommissionPercent: number };

type PayoutRow = {
  id: string;
  amount: number;
  status: string;
  note: string | null;
  adminNote: string | null;
  cryptoNetwork: string | null;
  cryptoAddress: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer: { email: string; name: string; affiliateBalance: number; affiliateCode: string | null } | null;
};

type ResolveModal = { id: string; mode: "paid" | "rejected" };

function truncateMid(s: string, max = 36) {
  if (s.length <= max) return s;
  const keep = max - 3;
  const head = Math.ceil(keep / 2);
  const tail = Math.floor(keep / 2);
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

function PayoutStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "pending") {
    return <span className="badge rounded-pill badge-payout-pending text-uppercase">{status}</span>;
  }
  if (s === "paid") {
    return <span className="badge rounded-pill badge-payout-paid text-uppercase">{status}</span>;
  }
  if (s === "rejected") {
    return <span className="badge rounded-pill badge-payout-rejected text-uppercase">{status}</span>;
  }
  return <span className="badge rounded-pill bg-light text-dark text-uppercase">{status}</span>;
}

export function AdminAffiliatePage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [pctDraft, setPctDraft] = useState("10");
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolveModal, setResolveModal] = useState<ResolveModal | null>(null);
  const [modalRejectionReason, setModalRejectionReason] = useState("");
  const [modalAdminNote, setModalAdminNote] = useState("");
  const [modalSubmitting, setModalSubmitting] = useState(false);

  const pendingStats = useMemo(() => {
    const pending = payouts.filter((p) => p.status === "pending");
    return {
      count: pending.length,
      totalUsd: pending.reduce((s, p) => s + p.amount, 0),
    };
  }, [payouts]);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const [sRes, pRes] = await Promise.all([
        fetch("/api/admin/affiliate/settings", { cache: "no-store" }),
        fetch("/api/admin/affiliate/payout-requests", { cache: "no-store" }),
      ]);
      if (!sRes.ok) throw new Error("Could not load affiliate settings.");
      const s = (await sRes.json()) as Settings;
      setSettings(s);
      setPctDraft(String(s.affiliateCommissionPercent));
      if (pRes.ok) {
        setPayouts((await pRes.json()) as PayoutRow[]);
      } else {
        setPayouts([]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function openResolveModal(id: string, mode: "paid" | "rejected") {
    setErr(null);
    setModalRejectionReason("");
    setModalAdminNote("");
    setResolveModal({ id, mode });
  }

  async function submitResolveModal() {
    if (!resolveModal) return;
    setErr(null);
    if (resolveModal.mode === "rejected" && !modalRejectionReason.trim()) {
      setErr("Enter a rejection reason — the affiliate will see it on their dashboard.");
      return;
    }
    setModalSubmitting(true);
    try {
      const body: Record<string, string | undefined> = {
        status: resolveModal.mode,
        adminNote: modalAdminNote.trim() || undefined,
      };
      if (resolveModal.mode === "rejected") {
        body.rejectionReason = modalRejectionReason.trim();
      }
      const res = await fetch(`/api/admin/affiliate/payout-requests/${encodeURIComponent(resolveModal.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(
          typeof data.message === "string"
            ? data.message
            : Array.isArray(data.message)
              ? data.message.join(", ")
              : "Update failed"
        );
        return;
      }
      setResolveModal(null);
      setMsg(resolveModal.mode === "paid" ? "Marked as paid and balance deducted." : "Request rejected.");
      await load();
    } finally {
      setModalSubmitting(false);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const n = parseFloat(pctDraft);
    if (!Number.isFinite(n) || n < 10 || n > 100) {
      setErr("Commission must be between 10% and 100%.");
      return;
    }
    const res = await fetch("/api/admin/affiliate/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ affiliateCommissionPercent: n }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(typeof data.message === "string" ? data.message : "Save failed");
      return;
    }
    setSettings(data as Settings);
    setMsg("Commission rate saved.");
  }

  if (loading && !settings) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-2 py-lg-3 px-0 px-sm-1">
      <header className="admin-page-hero d-flex flex-wrap gap-3 align-items-start">
        <div
          className="rounded-3 icon-soft-warning d-flex align-items-center justify-content-center shrink-0"
          style={{ width: "3.25rem", height: "3.25rem" }}
        >
          <i className="bi bi-diagram-3 fs-4" aria-hidden />
        </div>
        <div className="grow min-w-0">
          <p className="admin-section-title mb-1">Revenue share</p>
          <h1 className="admin-page-hero-title mb-2">Affiliate program</h1>
          <p className="admin-page-hero-sub mb-0">
            Set the global commission on referred order subtotals (minimum 10%). Confirm withdrawals only after crypto is sent —
            balances deduct on <strong>Mark paid</strong>. Rejections require a reason affiliates see on{" "}
            <code className="px-1 rounded bg-light small">/account/affiliate</code>.
          </p>
        </div>
      </header>

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
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--warning" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Pending queue</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{pendingStats.count}</p>
                <p className="small text-secondary mb-0 mt-1">Open withdrawal requests</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--success" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Pending volume</p>
                <p className="h3 fw-bold mb-0 tabular-nums">${pendingStats.totalUsd.toFixed(2)}</p>
                <p className="small text-secondary mb-0 mt-1">USD requested (not yet paid)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--violet" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Global rate</p>
                <p className="h3 fw-bold mb-0 tabular-nums admin-gold-accent">{settings?.affiliateCommissionPercent ?? "—"}%</p>
                <p className="small text-secondary mb-0 mt-1">On referred subtotal</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="card border-0 admin-card-elevated admin-card-gold-cap h-100">
            <div className="card-body p-3 p-md-4">
              <p className="admin-section-title mb-2">Update commission</p>
              <form onSubmit={saveSettings} className="d-flex flex-wrap align-items-end gap-2">
                <div className="grow" style={{ minWidth: "5.5rem" }}>
                  <label className="form-label small text-secondary mb-1">Rate (%)</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    step="0.1"
                    className="form-control"
                    value={pctDraft}
                    onChange={(e) => setPctDraft(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-admin-gold px-3">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 admin-card-elevated">
        <div className="card-body p-0">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-4 py-3 border-bottom bg-light bg-opacity-50">
            <div>
              <h2 className="h5 fw-bold text-dark mb-0">Withdrawal requests</h2>
              <p className="small text-secondary mb-0 mt-1">Crypto destination, amounts, and resolution</p>
            </div>
            <span className="badge rounded-pill bg-white border text-secondary fw-normal px-3 py-2">
              {payouts.length} total · {pendingStats.count} pending
            </span>
          </div>

          {payouts.length === 0 ? (
            <div className="admin-empty-panel border-0 rounded-0">
              <i className="bi bi-inbox fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
              No withdrawal requests yet. They will appear here when affiliates submit from their dashboard.
            </div>
          ) : (
            <div className="table-responsive">
              <div className="admin-table-shell border-0 rounded-0 shadow-none">
                <table className="table table-admin table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th className="text-end">Amount</th>
                      <th>Network</th>
                      <th>Address</th>
                      <th>Note</th>
                      <th>Status</th>
                      <th>Resolution</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((p) => (
                      <tr key={p.id}>
                        <td className="text-nowrap small text-secondary">{new Date(p.createdAt).toLocaleString()}</td>
                        <td>
                          <div className="small fw-semibold text-dark text-break">{p.customer?.email ?? "—"}</div>
                          <div className="small text-secondary">
                            Balance ${p.customer?.affiliateBalance?.toFixed(2) ?? "—"}
                          </div>
                        </td>
                        <td className="text-end fw-bold tabular-nums">${p.amount.toFixed(2)}</td>
                        <td>
                          <span className="small fw-medium text-dark">{p.cryptoNetwork ?? "—"}</span>
                        </td>
                        <td style={{ maxWidth: "11rem" }}>
                          <code
                            className="small text-break d-block text-secondary"
                            style={{ fontSize: "0.72rem" }}
                            title={p.cryptoAddress ?? ""}
                          >
                            {p.cryptoAddress ? truncateMid(p.cryptoAddress, 26) : "—"}
                          </code>
                        </td>
                        <td style={{ maxWidth: "9rem" }}>
                          <span className="small text-secondary text-break">{p.note ?? "—"}</span>
                        </td>
                        <td>
                          <PayoutStatusBadge status={p.status} />
                        </td>
                        <td style={{ maxWidth: "14rem" }}>
                          {p.status === "pending" ? (
                            <span className="small text-muted">Awaiting action</span>
                          ) : p.status === "rejected" && p.rejectionReason ? (
                            <span className="small text-danger text-break d-block">User: {p.rejectionReason}</span>
                          ) : p.status === "paid" ? (
                            <span className="small text-success fw-medium">Settled</span>
                          ) : (
                            <span className="small text-muted">—</span>
                          )}
                          {p.adminNote ? (
                            <span className="small text-muted text-break d-block mt-1">
                              <span className="fw-semibold">Internal:</span> {p.adminNote}
                            </span>
                          ) : null}
                        </td>
                        <td className="text-end text-nowrap">
                          {p.status === "pending" ? (
                            <div className="btn-group btn-group-sm shadow-sm">
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => openResolveModal(p.id, "paid")}
                              >
                                Paid
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => openResolveModal(p.id, "rejected")}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="small text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {resolveModal ? (
        <div
          className="modal show d-block admin-modal-surface"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div>
                  <p className="admin-section-title mb-1">
                    {resolveModal.mode === "paid" ? "Confirm settlement" : "Reject request"}
                  </p>
                  <h5 className="modal-title fw-bold">
                    {resolveModal.mode === "paid" ? "Mark withdrawal as paid" : "Reject withdrawal"}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={modalSubmitting}
                  onClick={() => setResolveModal(null)}
                />
              </div>
              <div className="modal-body pt-3">
                {resolveModal.mode === "rejected" ? (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Reason for affiliate (required)</label>
                    <textarea
                      className="form-control rounded-3"
                      rows={4}
                      value={modalRejectionReason}
                      onChange={(e) => setModalRejectionReason(e.target.value)}
                      placeholder="Visible on the user’s affiliate dashboard — be clear and professional."
                    />
                  </div>
                ) : (
                  <div className="alert alert-light border rounded-3 small mb-3">
                    <i className="bi bi-info-circle me-2 text-primary" aria-hidden />
                    The affiliate’s balance will be reduced by this request amount. Only confirm after funds have been sent to
                    their address.
                  </div>
                )}
                <div>
                  <label className="form-label small text-muted">Internal note (optional, not shown to user)</label>
                  <textarea
                    className="form-control form-control-sm rounded-3"
                    rows={2}
                    value={modalAdminNote}
                    onChange={(e) => setModalAdminNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={modalSubmitting}
                  onClick={() => setResolveModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill px-4 ${resolveModal.mode === "paid" ? "btn-success" : "btn-danger"}`}
                  disabled={modalSubmitting}
                  onClick={() => void submitResolveModal()}
                >
                  {modalSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden />
                      Saving…
                    </>
                  ) : resolveModal.mode === "paid" ? (
                    "Confirm paid"
                  ) : (
                    "Reject request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
