"use client";

import { useCallback, useEffect, useState } from "react";
import { notify } from "@/lib/notifications/notify";
import { SettingsNavHeader } from "./settings-nav-header";

type PaymentSettings = {
  shippingUsa: number;
  shippingInternational: number;
};

export function AdminShippingSettingsPage() {
  const [shippingUsa, setShippingUsa] = useState("0");
  const [shippingInternational, setShippingInternational] = useState("0");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payment-settings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as PaymentSettings;
      setShippingUsa(String(Number(data.shippingUsa ?? 0)));
      setShippingInternational(String(Number(data.shippingInternational ?? 0)));
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to load shipping rates.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveShipping(e: React.FormEvent) {
    e.preventDefault();
    const usa = Number.parseFloat(shippingUsa);
    const intl = Number.parseFloat(shippingInternational);

    if (!Number.isFinite(usa) || usa < 0 || !Number.isFinite(intl) || intl < 0) {
      notify.warning("Shipping amounts must be valid zero or positive numbers.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingUsa: Math.round(usa * 100) / 100,
          shippingInternational: Math.round(intl * 100) / 100,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      notify.success("Shipping rates saved successfully!");
      await load();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : "Failed to save shipping rates.");
    } finally {
      setSaving(false);
    }
  }

  const usaNum = Number.parseFloat(shippingUsa) || 0;
  const intlNum = Number.parseFloat(shippingInternational) || 0;

  if (loading) {
    return (
      <div className="admin-settings-shell p-5 text-center">
        <div className="spinner-border text-warning mb-3" role="status" />
        <p className="text-secondary mb-0">Loading shipping rates…</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-shell">
      {/* Shared Header with Switcher Tabs */}
      <div className="admin-settings-header">
        <SettingsNavHeader
          currentTab="shipping"
          title="Shipping Settings"
          subtitle="Configure flat rates applied to customers during checkout based on delivery country."
        />
      </div>

      <div className="p-4 p-lg-5">
        <form onSubmit={(e) => void saveShipping(e)}>
          <div className="row g-4">
            {/* Rates Input Cards */}
            <div className="col-12 col-xl-7">
              <div className="border rounded-3 p-4 bg-white shadow-xs mb-4">
                <h3 className="h6 fw-semibold text-dark mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                  <i className="bi bi-sliders text-warning" />
                  <span>Flat Shipping Rates</span>
                </h3>

                {/* Domestic USA */}
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fs-5">🇺🇸</span>
                    <div>
                      <strong className="text-dark small d-block">Domestic United States (USA)</strong>
                      <span className="text-secondary small">Applied when the customer selects United States.</span>
                    </div>
                  </div>
                  <div className="luxury-input-group mt-3">
                    <label>Shipping Fee (USD)</label>
                    <div className="luxury-field-shell">
                      <span className="luxury-field-prefix">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        className="luxury-field-input"
                        value={shippingUsa}
                        onChange={(e) => setShippingUsa(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <span className="form-text small text-secondary">Set to 0.00 for free domestic shipping.</span>
                  </div>
                </div>

                {/* International */}
                <div className="p-3 bg-light rounded-3 border mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="fs-5">🌍</span>
                    <div>
                      <strong className="text-dark small d-block">International (Rest of World)</strong>
                      <span className="text-secondary small">Applied for all international orders outside the US.</span>
                    </div>
                  </div>
                  <div className="luxury-input-group mt-3">
                    <label>Shipping Fee (USD)</label>
                    <div className="luxury-field-shell">
                      <span className="luxury-field-prefix">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        inputMode="decimal"
                        className="luxury-field-input"
                        value={shippingInternational}
                        onChange={(e) => setShippingInternational(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <span className="form-text small text-secondary">Applies to all non-US shipping destinations.</span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2 border-top">
                  <button type="submit" className="btn-gold-action" disabled={saving}>
                    {saving ? "Saving Changes…" : "Save Shipping Rates"}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Checkout Simulation Preview */}
            <div className="col-12 col-xl-5">
              <div className="border rounded-3 p-4 bg-light shadow-xs">
                <h3 className="h6 fw-semibold text-dark mb-3 d-flex align-items-center gap-2">
                  <i className="bi bi-cart-check text-warning" />
                  <span>Checkout Shipping Simulation</span>
                </h3>
                <p className="small text-secondary mb-3">
                  Preview how these rates calculate in the customer order summary:
                </p>

                {/* US Simulation Card */}
                <div className="p-3 bg-white rounded-3 border mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span className="small fw-semibold text-dark">🇺🇸 US Customer Order ($100 Cart)</span>
                    <span className="badge bg-light text-secondary border">Domestic</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Items Subtotal:</span>
                    <span>$100.00</span>
                  </div>
                  <div className="d-flex justify-content-between small text-dark mb-2">
                    <span>Flat Shipping:</span>
                    <span className={usaNum === 0 ? "text-success fw-semibold" : ""}>
                      {usaNum === 0 ? "FREE" : `$${usaNum.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold text-dark border-top pt-2">
                    <span>Total Charged:</span>
                    <span className="text-warning">${(100 + usaNum).toFixed(2)}</span>
                  </div>
                </div>

                {/* International Simulation Card */}
                <div className="p-3 bg-white rounded-3 border">
                  <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                    <span className="small fw-semibold text-dark">🌍 International Customer Order ($100 Cart)</span>
                    <span className="badge bg-light text-secondary border">Worldwide</span>
                  </div>
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Items Subtotal:</span>
                    <span>$100.00</span>
                  </div>
                  <div className="d-flex justify-content-between small text-dark mb-2">
                    <span>Flat Shipping:</span>
                    <span className={intlNum === 0 ? "text-success fw-semibold" : ""}>
                      {intlNum === 0 ? "FREE" : `$${intlNum.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold text-dark border-top pt-2">
                    <span>Total Charged:</span>
                    <span className="text-warning">${(100 + intlNum).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
