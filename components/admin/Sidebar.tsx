"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { BrandLogo } from "@/components/store/brand-logo";

function navActive(pathname: string, href: string) {
  if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(
    () => pathname.startsWith("/admin/dashboard/products") || pathname.startsWith("/admin/dashboard/inventory")
  );
  const [usersOpen, setUsersOpen] = useState(() => pathname.startsWith("/admin/dashboard/customers"));

  const linkClass = useCallback(
    (href: string) => {
      const active = navActive(pathname, href);
      return `nav-link d-flex align-items-center gap-2 ${active ? "active" : ""}`;
    },
    [pathname]
  );

  return (
    <div className="d-flex flex-column h-100">
      <div className="px-3 py-4 border-bottom border-secondary border-opacity-25">
        <Link
          href="/admin/dashboard"
          className="bg-white rounded-3 px-3 py-2 d-flex align-items-center gap-2 text-decoration-none text-dark"
          onClick={onNavigate}
        >
          <BrandLogo height={30} className="flex-shrink-0" />
          <div className="text-start lh-sm min-w-0">
            <span className="text-secondary admin-logo-sub d-block">ADMIN</span>
          </div>
        </Link>
      </div>

      <nav className="flex-grow-1 overflow-auto py-3 px-2">
        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard")} href="/admin/dashboard" onClick={onNavigate}>
              <i className="bi bi-house-door fs-5" aria-hidden />
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link w-100 d-flex align-items-center justify-content-between gap-2 text-start border-0 bg-transparent"
              onClick={() => setProductsOpen((v) => !v)}
              aria-expanded={productsOpen}
            >
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-box-seam fs-5" aria-hidden />
                Products
              </span>
              <i className={`bi ${productsOpen ? "bi-chevron-up" : "bi-chevron-down"} small`} aria-hidden />
            </button>
            {productsOpen ? (
              <ul className="nav flex-column mt-1">
                <li className="nav-item">
                  <Link className={`nav-link nav-link-sub ${navActive(pathname, "/admin/dashboard/products") ? "active" : ""}`} href="/admin/dashboard/products" onClick={onNavigate}>
                    All products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link nav-link-sub ${navActive(pathname, "/admin/dashboard/inventory") ? "active" : ""}`} href="/admin/dashboard/inventory" onClick={onNavigate}>
                    Inventory
                  </Link>
                </li>
              </ul>
            ) : null}
          </li>

          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard/orders")} href="/admin/dashboard/orders" onClick={onNavigate}>
              <i className="bi bi-clipboard-check fs-5" aria-hidden />
              <span>Orders</span>
            </Link>
          </li>

          <li className="nav-item">
            <button
              type="button"
              className="nav-link w-100 d-flex align-items-center justify-content-between gap-2 text-start border-0 bg-transparent"
              onClick={() => setUsersOpen((v) => !v)}
              aria-expanded={usersOpen}
            >
              <span className="d-flex align-items-center gap-2">
                <i className="bi bi-people fs-5" aria-hidden />
                Users
              </span>
              <i className={`bi ${usersOpen ? "bi-chevron-up" : "bi-chevron-down"} small`} aria-hidden />
            </button>
            {usersOpen ? (
              <ul className="nav flex-column mt-1">
                <li className="nav-item">
                  <Link className={`nav-link nav-link-sub ${navActive(pathname, "/admin/dashboard/customers") ? "active" : ""}`} href="/admin/dashboard/customers" onClick={onNavigate}>
                    All users
                  </Link>
                </li>
              </ul>
            ) : null}
          </li>

          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard/invoices")} href="/admin/dashboard/invoices" onClick={onNavigate}>
              <i className="bi bi-receipt fs-5" aria-hidden />
              <span>Invoices</span>
            </Link>
          </li>
        </ul>

        <p className="text-secondary text-uppercase px-3 mt-4 mb-2 fw-semibold admin-nav-section-label">Settings</p>
        <ul className="nav flex-column gap-1 px-0">
          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard/affiliate")} href="/admin/dashboard/affiliate" onClick={onNavigate}>
              <i className="bi bi-percent fs-5" aria-hidden />
              <span>Affiliate program</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard/coupons")} href="/admin/dashboard/coupons" onClick={onNavigate}>
              <i className="bi bi-ticket-perforated fs-5" aria-hidden />
              <span>Coupons</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className={linkClass("/admin/dashboard/settings")} href="/admin/dashboard/settings" onClick={onNavigate}>
              <i className="bi bi-gear fs-5" aria-hidden />
              <span>Store settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-2 border-top border-secondary border-opacity-25 mt-auto">
        <Link href="/" className="nav-link d-flex align-items-center gap-2" onClick={onNavigate}>
          <i className="bi bi-arrow-left" aria-hidden />
          <span>Back to store</span>
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="admin-sidebar position-fixed top-0 start-0 h-100 d-none d-lg-flex flex-column text-white">
      <SidebarNav />
    </aside>
  );
}
