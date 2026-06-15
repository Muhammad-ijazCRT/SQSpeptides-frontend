"use client";

import { useCallback, useEffect, useState } from "react";

const ORDER_STATUSES = ["pending", "shipped", "completed", "cancelled"] as const;

function orderStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "pending") return "badge rounded-pill badge-status-pending text-capitalize";
  if (s === "shipped") return "badge rounded-pill badge-status-shipped text-capitalize";
  if (s === "completed") return "badge rounded-pill badge-status-completed text-capitalize";
  if (s === "cancelled") return "badge rounded-pill bg-danger-subtle text-danger-emphasis text-capitalize";
  return "badge rounded-pill bg-secondary-subtle text-secondary-emphasis text-capitalize";
}

type OrderRow = {
  id: string;
  email: string;
  fullName: string;
  addressLine1?: string;
  city: string;
  postalCode?: string;
  country: string;
  total: number;
  status: string;
  paymentProvider?: string | null;
  paymentCompletion?: string;
  zelleTransactionId?: string | null;
  zelleProofUrl?: string | null;
  zelleRejectionNote?: string | null;
  createdAt: string;
  items: { quantity: number; price?: number; product: { name: string } }[];
};

type OrderDetail = OrderRow & {
  researchUseAttestation?: string;
  storeCreditUsed?: number;
  couponDiscountAmount?: number;
  couponCodeSnapshot?: string | null;
  customer?: { id: string; email: string; name: string } | null;
};

type ZelleVerifyModal = {
  orderId: string;
  action: "approve" | "reject";
  customerEmail: string;
  total: number;
};

export function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [zelleBusyId, setZelleBusyId] = useState<string | null>(null);
  const [zelleModal, setZelleModal] = useState<ZelleVerifyModal | null>(null);
  const [zelleRejectNote, setZelleRejectNote] = useState("");
  const [zelleModalSubmitting, setZelleModalSubmitting] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailStatus, setDetailStatus] = useState("");
  const [detailSaving, setDetailSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) {
        setErr("Could not load orders.");
        setRows([]);
        return;
      }
      const data = await res.json();
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

  const openOrderDetail = useCallback(async (orderId: string) => {
    setDetailLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}`);
      const data = (await res.json().catch(() => ({}))) as OrderDetail & { message?: string };
      if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Could not load order details.");
      }
      setDetailOrder(data);
      setDetailStatus(data.status);
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${orderId}`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load order details.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "").trim();
      if (!hash) return;
      void openOrderDetail(hash);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openOrderDetail]);

  function closeOrderDetail() {
    setDetailOrder(null);
    setDetailStatus("");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  async function saveOrderStatus() {
    if (!detailOrder || detailStatus === detailOrder.status) return;
    setDetailSaving(true);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(detailOrder.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: detailStatus }),
      });
      const data = (await res.json().catch(() => ({}))) as OrderDetail & { message?: string };
      if (!res.ok) {
        throw new Error(typeof data.message === "string" ? data.message : "Could not update status.");
      }
      setDetailOrder((prev) => (prev ? { ...prev, ...data } : prev));
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not update status.");
    } finally {
      setDetailSaving(false);
    }
  }

  function openZelleModal(o: OrderRow, action: "approve" | "reject") {
    setErr(null);
    setZelleRejectNote("");
    setZelleModal({
      orderId: o.id,
      action,
      customerEmail: o.email,
      total: o.total,
    });
  }

  function closeZelleModal() {
    if (zelleModalSubmitting) return;
    setZelleModal(null);
    setZelleRejectNote("");
  }

  async function submitZelleModal() {
    if (!zelleModal) return;
    const { orderId, action } = zelleModal;
    const note = action === "reject" ? zelleRejectNote.trim() || undefined : undefined;

    setZelleModalSubmitting(true);
    setZelleBusyId(orderId);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/zelle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...(note ? { note } : {}) }),
      });
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        throw new Error(typeof j.message === "string" ? j.message : "Zelle action failed.");
      }
      setZelleModal(null);
      setZelleRejectNote("");
      await load();
      if (detailOrder?.id === orderId) {
        await openOrderDetail(orderId);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Zelle action failed.");
    } finally {
      setZelleBusyId(null);
      setZelleModalSubmitting(false);
    }
  }

  return (
    <>
      <div className="row align-items-center g-2 mb-4">
        <div className="col-12 col-lg">
          <p className="text-secondary small mb-0">
            Fulfillment queue and order history. Open an order to view details and update fulfillment status.
          </p>
        </div>
        <div className="col-12 col-lg-auto">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => void load()}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden />
            Refresh
          </button>
        </div>
      </div>

      {err ? (
        <div className="alert alert-danger border-0 admin-card-elevated rounded-3 mb-4" role="alert">
          {err}
        </div>
      ) : null}

      <div className="card border-0 admin-card-elevated rounded-3 overflow-hidden bg-white">
        {loading ? (
          <div className="p-5 text-center text-secondary small">Loading orders…</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-center text-secondary small">No orders in the database yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-admin mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Customer</th>
                  <th>Ship to</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Pay</th>
                  <th>Zelle</th>
                  <th>Status</th>
                  <th className="pe-4">Placed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className={detailOrder?.id === o.id ? "table-active" : undefined}>
                    <td className="ps-4">
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 font-monospace text-secondary text-decoration-none"
                        onClick={() => void openOrderDetail(o.id)}
                      >
                        {o.id.slice(0, 12)}…
                      </button>
                    </td>
                    <td>
                      <span className="fw-medium text-dark d-block">{o.fullName}</span>
                      <span className="small text-secondary">{o.email}</span>
                    </td>
                    <td className="small text-secondary">
                      {o.city}, {o.country}
                    </td>
                    <td className="small text-secondary">
                      {o.items?.length ? (
                        <ul className="list-unstyled mb-0 admin-items-col">
                          {o.items.slice(0, 3).map((i, idx) => (
                            <li key={idx}>
                              {i.quantity}× {i.product?.name ?? "Product"}
                            </li>
                          ))}
                          {o.items.length > 3 ? <li className="text-muted">+{o.items.length - 3} more</li> : null}
                        </ul>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="fw-semibold">${o.total.toFixed(2)}</td>
                    <td className="small text-secondary">
                      {o.paymentProvider === "nowpayments" ? (
                        <>
                          <span className="d-block text-dark">Crypto</span>
                          <span className="text-capitalize">{o.paymentCompletion ?? "—"}</span>
                        </>
                      ) : o.paymentProvider === "crossmint" ? (
                        <span className="text-dark">Card</span>
                      ) : o.paymentProvider === "zelle" ? (
                        <>
                          <span className="d-block text-dark">Zelle</span>
                          <span className="text-capitalize">{o.paymentCompletion ?? "—"}</span>
                        </>
                      ) : o.paymentProvider === "payram" ? (
                        <>
                          <span className="d-block text-dark">PayRam</span>
                          <span className="text-capitalize">{o.paymentCompletion ?? "—"}</span>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="small">
                      {o.paymentProvider === "zelle" ? (
                        <div className="d-flex flex-column gap-1">
                          {o.zelleProofUrl ? (
                            <a
                              href={o.zelleProofUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              View proof
                            </a>
                          ) : (
                            <span className="text-secondary">No proof</span>
                          )}
                          {o.zelleTransactionId ? (
                            <span className="text-secondary text-break" title={o.zelleTransactionId}>
                              Txn: {o.zelleTransactionId.length > 24 ? `${o.zelleTransactionId.slice(0, 24)}…` : o.zelleTransactionId}
                            </span>
                          ) : null}
                          {o.paymentCompletion === "zelle_pending_review" ? (
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={zelleModal !== null || zelleBusyId === o.id}
                                onClick={() => openZelleModal(o, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                disabled={zelleModal !== null || zelleBusyId === o.id}
                                onClick={() => openZelleModal(o, "reject")}
                              >
                                Reject
                              </button>
                            </div>
                          ) : o.paymentCompletion === "zelle_rejected" && o.zelleRejectionNote ? (
                            <span className="text-danger small">{o.zelleRejectionNote}</span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </td>
                    <td>
                      <span className={orderStatusBadgeClass(o.status)}>{o.status}</span>
                    </td>
                    <td className="pe-4 text-secondary small text-nowrap">
                      <div>{new Date(o.createdAt).toLocaleString()}</div>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 mt-1 text-decoration-none"
                        onClick={() => void openOrderDetail(o.id)}
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detailOrder || detailLoading ? (
        <div
          className="modal show d-block admin-modal-surface"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-detail-modal-title"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !detailLoading) closeOrderDetail();
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content rounded-3 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <div>
                  <p className="text-uppercase text-secondary small fw-semibold mb-1">Order details</p>
                  <h2 id="order-detail-modal-title" className="modal-title h5 fw-bold mb-0 font-monospace">
                    {detailOrder?.id ?? "Loading…"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={detailLoading || detailSaving}
                  onClick={closeOrderDetail}
                />
              </div>
              <div className="modal-body pt-3 px-4">
                {detailLoading || !detailOrder ? (
                  <p className="text-secondary small mb-0">Loading order…</p>
                ) : (
                  <>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <p className="small text-secondary mb-1">Customer</p>
                        <p className="mb-0 fw-semibold">{detailOrder.fullName}</p>
                        <p className="mb-0 small text-secondary">{detailOrder.email}</p>
                        {detailOrder.customer ? (
                          <p className="mb-0 mt-1 small text-success">Linked account: {detailOrder.customer.name}</p>
                        ) : null}
                      </div>
                      <div className="col-md-6">
                        <p className="small text-secondary mb-1">Shipping</p>
                        <p className="mb-0 small">
                          {detailOrder.addressLine1}
                          <br />
                          {detailOrder.city}, {detailOrder.postalCode} {detailOrder.country}
                        </p>
                      </div>
                    </div>

                    <p className="small text-secondary mb-2">Line items</p>
                    <ul className="list-group list-group-flush border rounded-3 mb-4">
                      {detailOrder.items.map((item, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between small">
                          <span>
                            {item.quantity}× {item.product.name}
                          </span>
                          <span className="tabular-nums">
                            ${((item.price ?? 0) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="row g-3 mb-4 small">
                      <div className="col-sm-4">
                        <span className="text-secondary d-block">Total</span>
                        <span className="fw-semibold">${detailOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="col-sm-4">
                        <span className="text-secondary d-block">Payment</span>
                        <span className="text-capitalize">
                          {detailOrder.paymentProvider ?? "—"} ({detailOrder.paymentCompletion ?? "—"})
                        </span>
                      </div>
                      <div className="col-sm-4">
                        <span className="text-secondary d-block">Placed</span>
                        <span>{new Date(detailOrder.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border rounded-3 p-3 bg-light">
                      <label className="form-label fw-semibold small mb-2" htmlFor="order-status-select">
                        Fulfillment status
                      </label>
                      <div className="d-flex flex-wrap gap-2 align-items-center">
                        <select
                          id="order-status-select"
                          className="form-select form-select-sm w-auto"
                          value={detailStatus}
                          disabled={detailSaving}
                          onChange={(e) => setDetailStatus(e.target.value)}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <span className={orderStatusBadgeClass(detailOrder.status)}>{detailOrder.status}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary rounded-pill px-3"
                          disabled={detailSaving || detailStatus === detailOrder.status}
                          onClick={() => void saveOrderStatus()}
                        >
                          {detailSaving ? "Saving…" : "Update status"}
                        </button>
                      </div>
                    </div>

                    {detailOrder.paymentProvider === "zelle" && detailOrder.zelleProofUrl ? (
                      <div className="mt-3 small">
                        <a href={detailOrder.zelleProofUrl} target="_blank" rel="noopener noreferrer">
                          View Zelle proof
                        </a>
                        {detailOrder.zelleTransactionId ? (
                          <p className="mb-0 mt-1 text-secondary">Txn: {detailOrder.zelleTransactionId}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                )}
              </div>
              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={detailLoading || detailSaving}
                  onClick={closeOrderDetail}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {zelleModal ? (
        <div
          className="modal show d-block admin-modal-surface"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="zelle-verify-modal-title"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeZelleModal();
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border-0 shadow-lg">
              <div className="modal-header border-0 pb-0 pt-4 px-4">
                <div>
                  <p className="text-uppercase text-secondary small fw-semibold mb-1">
                    {zelleModal.action === "approve" ? "Confirm payment" : "Reject payment"}
                  </p>
                  <h2 id="zelle-verify-modal-title" className="modal-title h5 fw-bold mb-0">
                    {zelleModal.action === "approve" ? "Approve Zelle payment?" : "Reject this Zelle payment?"}
                  </h2>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={zelleModalSubmitting}
                  onClick={closeZelleModal}
                />
              </div>
              <div className="modal-body pt-3 px-4">
                <p className="small text-secondary mb-2">
                  Order <span className="font-monospace text-dark">{zelleModal.orderId.slice(0, 14)}…</span>
                  <span className="d-block mt-1">{zelleModal.customerEmail}</span>
                  <span className="fw-semibold text-dark">${zelleModal.total.toFixed(2)}</span>
                </p>
                {zelleModal.action === "approve" ? (
                  <div className="alert alert-light border rounded-3 small mb-0">
                    <i className="bi bi-check2-circle me-2 text-success" aria-hidden />
                    This marks the order as <strong>paid</strong> and allows fulfillment to proceed. Only confirm after you
                    have verified the Zelle deposit matches this order.
                  </div>
                ) : (
                  <div className="mb-0">
                    <label className="form-label fw-semibold small" htmlFor="zelle-reject-note">
                      Note for customer <span className="fw-normal text-muted">(optional)</span>
                    </label>
                    <textarea
                      id="zelle-reject-note"
                      className="form-control rounded-3"
                      rows={3}
                      value={zelleRejectNote}
                      onChange={(e) => setZelleRejectNote(e.target.value)}
                      placeholder="e.g. Amount or memo did not match — please contact support with your receipt."
                      disabled={zelleModalSubmitting}
                    />
                    <p className="form-text small mb-0 mt-2">
                      The order will be cancelled. If you add a note, the customer may see it on their order details.
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0 px-4 pb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={zelleModalSubmitting}
                  onClick={closeZelleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn rounded-pill px-4 ${zelleModal.action === "approve" ? "btn-success" : "btn-danger"}`}
                  disabled={zelleModalSubmitting}
                  onClick={() => void submitZelleModal()}
                >
                  {zelleModalSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden />
                      Saving…
                    </>
                  ) : zelleModal.action === "approve" ? (
                    "Approve payment"
                  ) : (
                    "Reject payment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
