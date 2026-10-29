"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type SettingsNavHeaderProps = {
  currentTab: "payment" | "shipping" | "smtp";
  title: string;
  subtitle: string;
};

export function SettingsNavHeader({ currentTab, title, subtitle }: SettingsNavHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      id: "payment",
      label: "Payment Settings",
      shortLabel: "Payments",
      href: "/admin/dashboard/settings/payment-gateways",
      icon: "bi-credit-card-2-front",
      badge: "Crossmint & Crypto",
    },
    {
      id: "shipping",
      label: "Shipping Settings",
      shortLabel: "Shipping",
      href: "/admin/dashboard/settings/shipping",
      icon: "bi-truck",
      badge: "Flat Rates",
    },
    {
      id: "smtp",
      label: "SMTP Settings",
      shortLabel: "SMTP / Email",
      href: "/admin/dashboard/settings/smtp",
      icon: "bi-envelope-at",
      badge: "Transactional Mail",
    },
  ];

  return (
    <div className="mb-4">
      {/* Top Breadcrumb & Mobile Dropdown */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <Link href="/admin/dashboard" className="text-decoration-none text-secondary">
                Dashboard
              </Link>
            </li>
            <li className="breadcrumb-item text-secondary">Settings</li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {tabs.find((t) => t.id === currentTab)?.label || title}
            </li>
          </ol>
        </nav>

        {/* Quick Mobile Dropdown Selector */}
        <div className="d-md-none w-100">
          <label className="form-label small text-secondary fw-semibold mb-1">Switch Settings Section:</label>
          <select
            className="form-select form-select-sm border-secondary-subtle fw-medium"
            value={currentTab}
            onChange={(e) => {
              const target = tabs.find((t) => t.id === e.target.value);
              if (target) router.push(target.href);
            }}
          >
            {tabs.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label} ({t.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 pb-3 border-bottom">
        <div>
          <h1 className="h4 fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <span
              className="d-inline-flex align-items-center justify-content-center rounded-3 bg-dark text-warning p-2"
              style={{ width: "2.4rem", height: "2.4rem" }}
            >
              <i className={`bi ${tabs.find((t) => t.id === currentTab)?.icon || "bi-gear"} fs-5`} />
            </span>
            <span>{title}</span>
          </h1>
          <p className="text-secondary small fw-medium mb-0">{subtitle}</p>
        </div>

        {/* Desktop Tabs Switcher */}
        <div className="d-none d-md-flex align-items-center p-1 bg-light rounded-3 border border-secondary-subtle">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`btn btn-sm px-3 py-2 d-inline-flex align-items-center gap-2 rounded-2 text-decoration-none transition-all ${
                  isActive
                    ? "bg-white text-dark fw-bold shadow-sm border border-secondary"
                    : "text-secondary hover-text-dark border-0 fw-semibold"
                }`}
                style={
                  isActive
                    ? {
                        borderLeft: "3.5px solid #d4af37",
                      }
                    : undefined
                }
              >
                <i className={`bi ${tab.icon} ${isActive ? "text-warning fs-6" : "text-secondary"}`} />
                <span>{tab.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
