"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type CouponRow = {
  id: string;
  code: string;
  percentOff: number;
  active: boolean;
  maxUses: number | null;
  createdAt: string;
  updatedAt: string;
};

type Analytics = {
  summary: { totalDiscountAllTime: number; totalRedemptions: number };
  byCoupon: {
    couponId: string | null;
    code: string;
    percentOff: number | null;
    active: boolean | null;
    redemptionCount: number;
    totalDiscount: number;
  }[];
  recentRedemptions: {
    orderId: string;
    email: string;
    code: string | null;
    discount: number;
    createdAt: string;
  }[];
};

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [code, setCode] = useState("");
  const [pct, setPct] = useState("10");
  const [maxUses, setMaxUses] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const activeCodes = useMemo(() => coupons.filter((c) => c.active).length, [coupons]);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const [cRes, aRes] = await Promise.all([
        fetch("/api/admin/coupons", { cache: "no-store" }),
        fetch("/api/admin/coupons/analytics", { cache: "no-store" }),
      ]);
      if (!cRes.ok) throw new Error("Could not load coupons.");
      const list = (await cRes.json()) as CouponRow[];
      setCoupons(
        list.map((c) => ({
          ...c,
          percentOff: typeof c.percentOff === "number" ? c.percentOff : Number(c.percentOff),
        }))
      );
      if (aRes.ok) {
        setAnalytics((await aRes.json()) as Analytics);
      } else {
        setAnalytics(null);
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

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    const percentOff = parseFloat(pct);
    if (!Number.isFinite(percentOff) || percentOff <= 0 || percentOff > 100) {
      setErr("Percent off must be between 0.01 and 100.");
      return;
    }
    const body: Record<string, unknown> = {
      code: code.trim(),
      percentOff,
      active: true,
    };
    const mu = maxUses.trim() ? parseInt(maxUses, 10) : undefined;
    if (mu !== undefined && (!Number.isFinite(mu) || mu < 1)) {
      setErr("Max uses must be a positive integer or left empty.");
      return;
    }
    if (mu !== undefined) body.maxUses = mu;

    const res = await fetch("/api/admin/coupons", {
      method: "POST",
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
            : "Create failed"
      );
      return;
    }
    setCode("");
    setMaxUses("");
    setMsg("Coupon created.");
    await load();
  }

  async function patchCoupon(id: string, patch: Record<string, unknown>) {
    setErr(null);
    const res = await fetch(`/api/admin/coupons/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
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
    await load();
  }

  if (loading && coupons.length === 0 && !analytics) {
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
          className="rounded-3 icon-soft-violet d-flex align-items-center justify-content-center shrink-0"
          style={{ width: "3.25rem", height: "3.25rem" }}
        >
          <i className="bi bi-ticket-perforated fs-4" aria-hidden />
        </div>
        <div className="grow min-w-0">
          <p className="admin-section-title mb-1">Promotions</p>
          <h1 className="admin-page-hero-title mb-2">Coupons</h1>
          <p className="admin-page-hero-sub mb-0">
            Percent discounts apply to cart subtotals before affiliate balance and card payment. Track redemptions, discount
            volume, and toggle codes without losing history.
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
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--success" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Discount given</p>
                <p className="h3 fw-bold mb-0 tabular-nums">
                  ${analytics?.summary.totalDiscountAllTime.toFixed(2) ?? "0.00"}
                </p>
                <p className="small text-secondary mb-0 mt-1">Lifetime coupon savings</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--primary" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Redemptions</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{analytics?.summary.totalRedemptions ?? 0}</p>
                <p className="small text-secondary mb-0 mt-1">Orders that used a code</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 col-lg-4">
          <div className="card border-0 admin-card-elevated overflow-hidden h-100">
            <div className="card-body d-flex p-0">
              <div className="admin-stat-strip admin-stat-strip--orange" aria-hidden />
              <div className="p-3 p-md-4 grow">
                <p className="admin-stat-label text-secondary text-uppercase fw-semibold mb-1">Active codes</p>
                <p className="h3 fw-bold mb-0 tabular-nums">{activeCodes}</p>
                <p className="small text-secondary mb-0 mt-1">
                  {coupons.length} total · {coupons.length - activeCodes} inactive
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 g-xl-4 mb-4">
        <div className="col-lg-5 col-xl-4">
          <div className="card border-0 admin-card-elevated admin-card-gold-cap h-100">
            <div className="card-body p-4">
              <h2 className="h5 fw-bold text-dark mb-1">Create coupon</h2>
              <p className="small text-secondary mb-4">Codes are stored uppercase. Leave max uses empty for unlimited.</p>
              <form onSubmit={createCoupon} className="vstack gap-3">
                <div>
                  <label className="form-label small fw-semibold text-secondary mb-1">Code</label>
                  <input
                    className="form-control form-control-lg rounded-3 font-monospace"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="SAVE10"
                    required
                    maxLength={40}
                    autoComplete="off"
                  />
                </div>
                <div className="row g-2">
                  <div className="col-7">
                    <label className="form-label small fw-semibold text-secondary mb-1">Percent off</label>
                    <div className="input-group">
                      <input
                        type="number"
                        step="0.01"
                        min={0.01}
                        max={100}
                        className="form-control rounded-start-3"
                        value={pct}
                        onChange={(e) => setPct(e.target.value)}
                        required
                      />
                      <span className="input-group-text rounded-end-3 bg-light text-secondary">%</span>
                    </div>
                  </div>
                  <div className="col-5">
                    <label className="form-label small fw-semibold text-secondary mb-1">Max uses</label>
                    <input
                      type="number"
                      min={1}
                      className="form-control rounded-3"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder="∞"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-admin-gold btn-lg rounded-pill mt-1">
                  <i className="bi bi-plus-lg me-2" aria-hidden />
                  Create coupon
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7 col-xl-8">
          <div className="card border-0 admin-card-elevated h-100">
            <div className="card-body p-0 d-flex flex-column h-100">
              <div className="px-4 py-3 border-bottom bg-light bg-opacity-50">
                <h2 className="h5 fw-bold text-dark mb-0">Performance by code</h2>
                <p className="small text-secondary mb-0 mt-1">Uses and total discount per coupon</p>
              </div>
              {analytics?.byCoupon?.length ? (
                <div className="table-responsive grow">
                  <div className="admin-table-shell border-0 rounded-0 shadow-none">
                    <table className="table table-admin table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Code</th>
                          <th className="text-end">Uses</th>
                          <th className="text-end">Discount</th>
                          <th className="text-end">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.byCoupon.map((r) => (
                          <tr key={r.couponId ?? r.code}>
                            <td>
                              <span className="font-monospace fw-semibold px-2 py-1 rounded-2 bg-light text-dark">
                                {r.code}
                              </span>
                            </td>
                            <td className="text-end tabular-nums fw-medium">{r.redemptionCount}</td>
                            <td className="text-end tabular-nums text-success fw-semibold">
                              ${r.totalDiscount.toFixed(2)}
                            </td>
                            <td className="text-end text-secondary small">
                              {r.percentOff != null ? `${r.percentOff}%` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="admin-empty-panel grow rounded-0">
                  <i className="bi bi-graph-up-arrow fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
                  No redemption data yet. When customers apply coupons at checkout, breakdowns appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 admin-card-elevated mb-4">
        <div className="card-body p-0">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 px-4 py-3 border-bottom bg-light bg-opacity-50">
            <div>
              <h2 className="h5 fw-bold text-dark mb-0">Coupon library</h2>
              <p className="small text-secondary mb-0 mt-1">Activate or pause codes anytime</p>
            </div>
          </div>
          {coupons.length === 0 ? (
            <div className="admin-empty-panel border-0 rounded-0">
              <i className="bi bi-ticket-perforated fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
              No coupons yet. Create one using the panel on the left.
            </div>
          ) : (
            <div className="table-responsive">
              <div className="admin-table-shell border-0 rounded-0 shadow-none">
                <table className="table table-admin table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Code</th>
                      <th className="text-end">Discount</th>
                      <th>Cap</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <span className="font-monospace fw-bold px-2 py-1 rounded-2 bg-dark bg-opacity-10">
                            {c.code}
                          </span>
                        </td>
                        <td className="text-end">
                          <span className="fw-semibold tabular-nums admin-gold-accent">
                            {Number(c.percentOff).toFixed(2)}%
                          </span>
                        </td>
                        <td className="small text-secondary">{c.maxUses == null ? "Unlimited" : `${c.maxUses} max`}</td>
                        <td>
                          {c.active ? (
                            <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                              Active
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2">Off</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 ${c.active ? "btn-outline-secondary" : "btn-admin-gold"}`}
                            onClick={() => void patchCoupon(c.id, { active: !c.active })}
                          >
                            {c.active ? (
                              <>
                                <i className="bi bi-pause-fill me-1" aria-hidden />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <i className="bi bi-play-fill me-1" aria-hidden />
                                Activate
                              </>
                            )}
                          </button>
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

      <section className="card border-0 admin-card-elevated">
        <div className="card-body p-0">
          <div className="px-4 py-3 border-bottom bg-light bg-opacity-50">
            <h2 className="h5 fw-bold text-dark mb-0">Recent checkouts</h2>
            <p className="small text-secondary mb-0 mt-1">Last 100 orders that applied a coupon</p>
          </div>
          {analytics?.recentRedemptions?.length ? (
            <div className="table-responsive">
              <div className="admin-table-shell border-0 rounded-0 shadow-none">
                <table className="table table-admin table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Email</th>
                      <th>Code</th>
                      <th className="text-end">Saved</th>
                      <th>Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentRedemptions.map((r) => (
                      <tr key={r.orderId}>
                        <td className="text-nowrap small text-secondary">{new Date(r.createdAt).toLocaleString()}</td>
                        <td className="small text-break">{r.email}</td>
                        <td>
                          <span className="font-monospace small fw-semibold">{r.code ?? "—"}</span>
                        </td>
                        <td className="text-end tabular-nums fw-semibold text-success">${r.discount.toFixed(2)}</td>
                        <td>
                          <code className="small text-secondary">{r.orderId.slice(0, 14)}…</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="admin-empty-panel border-0 rounded-0">
              <i className="bi bi-receipt fs-1 text-secondary opacity-50 d-block mb-2" aria-hidden />
              No coupon checkouts recorded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
