"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/admin/Navbar";
import { Sidebar, SidebarNav } from "@/components/admin/Sidebar";

function pageTitle(pathname: string): string {
  if (pathname === "/admin/dashboard") return "Dashboard";
  const segment = pathname.replace("/admin/dashboard/", "").split("/")[0] ?? "";
  const map: Record<string, string> = {
    products: "Products",
    inventory: "Inventory",
    orders: "Orders",
    customers: "Users",
    invoices: "Invoices",
    settings: "Store settings",
    analytics: "Analytics",
    marketing: "Marketing",
  };
  return map[segment] ?? "Admin";
}

export function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = useMemo(() => pageTitle(pathname), [pathname]);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-bs-root admin-dashboard-canvas min-vh-100">
      <Sidebar />

      {mobileOpen ? (
        <button
          type="button"
          className="offcanvas-backdrop fade show border-0 p-0 w-100 h-100 position-fixed top-0 start-0 admin-offcanvas-backdrop-fix"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      {mobileOpen ? (
        <div
          className="offcanvas offcanvas-start show text-white admin-sidebar d-lg-none position-fixed top-0 start-0 h-100 admin-offcanvas-panel"
          tabIndex={-1}
        >
          <div className="offcanvas-header border-bottom border-secondary border-opacity-25">
            <h2 className="offcanvas-title h6 mb-0">Menu</h2>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => setMobileOpen(false)} />
          </div>
          <div className="offcanvas-body p-0 overflow-auto">
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="admin-main-wrap d-flex flex-column min-vh-100">
        <Navbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-grow-1 overflow-auto px-2 px-sm-3 py-3 py-lg-3">
          <div className="admin-main-inner mx-auto w-100">{children}</div>
        </main>
      </div>
    </div>
  );
}
