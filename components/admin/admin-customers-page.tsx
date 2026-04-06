"use client";

import { useCallback, useEffect, useState } from "react";

type Customer = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function AdminCustomersPage() {
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/customers");
      if (!res.ok) {
        setErr("Could not load customers.");
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
            Registered storefront accounts (separate from admin users). Export and segmentation can be added later.
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
          <div className="p-5 text-center text-secondary small">Loading customers…</div>
        ) : rows.length === 0 ? (
          <div className="p-5 text-center text-secondary small">No customer sign-ups yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-admin mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Name</th>
                  <th>Email</th>
                  <th className="pe-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="ps-4 fw-medium text-dark">{c.name}</td>
                    <td className="text-secondary small">{c.email}</td>
                    <td className="pe-4 text-secondary small">{new Date(c.createdAt).toLocaleString()}</td>
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
