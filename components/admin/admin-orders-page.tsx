"use client";

import { useCallback, useEffect, useState } from "react";

function orderStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "pending") return "badge rounded-pill badge-status-pending text-capitalize";
  if (s === "shipped") return "badge rounded-pill badge-status-shipped text-capitalize";
  if (s === "completed") return "badge rounded-pill badge-status-completed text-capitalize";
  return "badge rounded-pill bg-secondary-subtle text-secondary-emphasis text-capitalize";
}

type OrderRow = {
  id: string;
  email: string;
  fullName: string;
  city: string;
  country: string;
  total: number;
  status: string;
  paymentProvider?: string | null;
  paymentCompletion?: string;
  createdAt: string;
  items: { quantity: number; product: { name: string } }[];
};

export function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

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

  return (
    <>
      <div className="row align-items-center g-2 mb-4">
        <div className="col-12 col-lg">
          <p className="text-secondary small mb-0">
            Fulfillment queue and order history. Status updates can be wired to your workflow later.
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
                  <th>Status</th>
                  <th className="pe-4">Placed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td className="ps-4">
                      <span className="font-monospace small text-secondary">{o.id.slice(0, 12)}…</span>
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
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td>
                      <span className={orderStatusBadgeClass(o.status)}>{o.status}</span>
                    </td>
                    <td className="pe-4 text-secondary small text-nowrap">{new Date(o.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
