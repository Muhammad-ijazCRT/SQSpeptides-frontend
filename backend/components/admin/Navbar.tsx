"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/store/brand-logo";
import { useCallback, useEffect, useRef, useState } from "react";

type Me = { name?: string; email?: string };

type Notice = { id: string; title: string; detail: string; time: string; unread: boolean; href?: string };

type NoticeWithSort = Notice & { sortKey: number };

const ORDER_NOTIF_ACK_KEY = "sqspeptides_admin_order_notif_ack";
const INVOICE_NOTIF_ACK_KEY = "sqspeptides_admin_invoice_pay_notif_ack";

type ApiOrderRow = { id: string; email: string; total: number; createdAt: string };

type ApiInvoicePaidRow = {
  id: string;
  paidAt: string;
  amount: number;
  currency: string;
  customerEmail: string;
  gatewayLabel: string;
};

function initialsFromUser(name: string | undefined, email: string | undefined) {
  const n = (name ?? "").trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  }
  return (email ?? "?").slice(0, 2).toUpperCase();
}

type NavbarProps = {
  title: string;
  onMenuClick?: () => void;
};

export function Navbar({ title, onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ackMs, setAckMs] = useState<number | null>(null);
  const [invoiceAckMs, setInvoiceAckMs] = useState<number | null>(null);

  const loadMe = useCallback(async () => {
    const res = await fetch("/api/auth/admin/me");
    if (res.ok) setMe(await res.json());
  }, []);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let rawOrder = localStorage.getItem(ORDER_NOTIF_ACK_KEY);
    if (!rawOrder) {
      rawOrder = new Date().toISOString();
      localStorage.setItem(ORDER_NOTIF_ACK_KEY, rawOrder);
    }
    setAckMs(new Date(rawOrder).getTime());

    let rawInv = localStorage.getItem(INVOICE_NOTIF_ACK_KEY);
    if (!rawInv) {
      rawInv = new Date().toISOString();
      localStorage.setItem(INVOICE_NOTIF_ACK_KEY, rawInv);
    }
    setInvoiceAckMs(new Date(rawInv).getTime());
  }, []);

  useEffect(() => {
    if (ackMs == null || invoiceAckMs == null) return;
    const orderThreshold = ackMs;
    const invThreshold = invoiceAckMs;
    let cancelled = false;
    async function loadNotices() {
      const [orderRes, invRes] = await Promise.all([
        fetch("/api/admin/orders", { cache: "no-store" }),
        fetch("/api/admin/payment-invoices/notifications", { cache: "no-store" }),
      ]);
      if (cancelled) return;

      const orderParts: NoticeWithSort[] = [];
      if (orderRes.ok) {
        const orders = (await orderRes.json()) as ApiOrderRow[];
        if (Array.isArray(orders)) {
          for (const o of orders.slice(0, 10)) {
            const ts = new Date(o.createdAt).getTime();
            orderParts.push({
              id: `order-${o.id}`,
              title: "New store order",
              detail: `${o.email} · $${Number(o.total).toFixed(2)}`,
              time: new Date(o.createdAt).toLocaleString(),
              unread: ts > orderThreshold,
              href: `/admin/dashboard/orders#${o.id}`,
              sortKey: ts,
            });
          }
        }
      }

      const invParts: NoticeWithSort[] = [];
      if (invRes.ok) {
        const inv = (await invRes.json()) as ApiInvoicePaidRow[];
        if (Array.isArray(inv)) {
          for (const r of inv.slice(0, 12)) {
            const ts = new Date(r.paidAt).getTime();
            const amt = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: r.currency.toUpperCase(),
            }).format(r.amount);
            invParts.push({
              id: `invoice-${r.id}`,
              title: "Invoice paid",
              detail: `${r.gatewayLabel} · ${r.customerEmail} · ${amt}`,
              time: new Date(r.paidAt).toLocaleString(),
              unread: ts > invThreshold,
              href: "/admin/dashboard/history",
              sortKey: ts,
            });
          }
        }
      }

      const merged = [...orderParts, ...invParts]
        .sort((a, b) => b.sortKey - a.sortKey)
        .slice(0, 15)
        .map(({ sortKey: _s, ...rest }) => rest);
      setNotices(merged);
    }
    void loadNotices();
    const t = setInterval(loadNotices, 45_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [ackMs, invoiceAckMs]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(t)) setUserOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function logout() {
    await fetch("/api/auth/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/admin/dashboard/products?q=${encodeURIComponent(q)}`);
  }

  const unreadCount = notices.filter((n) => n.unread).length;

  function markNotificationsRead() {
    const now = Date.now();
    const iso = new Date(now).toISOString();
    localStorage.setItem(ORDER_NOTIF_ACK_KEY, iso);
    localStorage.setItem(INVOICE_NOTIF_ACK_KEY, iso);
    setAckMs(now);
    setInvoiceAckMs(now);
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
    setNotifOpen(false);
  }

  return (
    <header className="sticky-top bg-white border-bottom admin-header-elevated z-3">
      <div className="d-flex align-items-center gap-3 px-3 px-lg-4 py-2 py-lg-3">
        <button
          type="button"
          className="btn btn-outline-secondary d-lg-none"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <i className="bi bi-list fs-5" aria-hidden />
        </button>

        <Link href="/admin/dashboard" className="d-flex align-items-center flex-shrink-0 text-decoration-none me-1 me-sm-2">
          <BrandLogo height={32} className="max-h-8" />
        </Link>

        <h1 className="h5 mb-0 fw-bold text-dark text-truncate">{title}</h1>

        <form className="d-none d-md-flex flex-grow-1 justify-content-center mx-auto admin-search-max" onSubmit={onSearch}>
          <div className="admin-search-shell d-flex align-items-stretch w-100">
            <span className="input-group-text admin-search-icon border-0">
              <i className="bi bi-search" aria-hidden />
            </span>
            <input
              type="search"
              className="form-control admin-search-input shadow-none"
              placeholder="Search products, SKUs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search catalog"
            />
          </div>
        </form>

        <div className="d-flex align-items-center gap-1 gap-sm-2 ms-auto">
          <form className="d-md-none" onSubmit={onSearch}>
            <div className="admin-search-shell d-flex align-items-stretch admin-mobile-search">
              <span className="input-group-text admin-search-icon border-0 py-1">
                <i className="bi bi-search small" aria-hidden />
              </span>
              <input
                type="search"
                className="form-control form-control-sm admin-search-input shadow-none py-1"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search catalog"
              />
            </div>
          </form>

          <div className="position-relative" ref={notifRef}>
            <button
              type="button"
              className="btn btn-light admin-notif-trigger border-0 shadow-none"
              aria-expanded={notifOpen}
              aria-label="Notifications"
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen((v) => !v);
                setUserOpen(false);
              }}
            >
              <i className="bi bi-bell fs-5 text-secondary" aria-hidden />
              {unreadCount > 0 ? (
                <span className="admin-notif-count-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
              ) : null}
            </button>
            {notifOpen ? (
              <div className="dropdown-menu show border-0 end-0 mt-2 p-0 admin-notif-panel admin-card-elevated">
                <div className="px-3 py-3 border-bottom">
                  <p className="mb-0 fw-semibold small">Notifications</p>
                  <p className="mb-0 text-secondary small">Orders and paid invoice links (refreshes every 45s).</p>
                </div>
                <ul className="list-unstyled mb-0 overflow-auto admin-notif-list">
                  {notices.length === 0 ? (
                    <li className="px-3 py-4 text-secondary small">No recent activity.</li>
                  ) : (
                    notices.map((n) => (
                      <li key={n.id} className="border-bottom border-light">
                        <Link
                          href={n.href ?? "/admin/dashboard/orders"}
                          className={`dropdown-item text-start py-3 px-3 ${n.unread ? "bg-warning bg-opacity-10" : ""}`}
                          onClick={() => setNotifOpen(false)}
                        >
                          <span className="d-flex align-items-center gap-2">
                            {n.unread ? <span className="rounded-circle bg-warning d-inline-block admin-unread-dot" aria-hidden /> : null}
                            <span className="fw-semibold small">{n.title}</span>
                          </span>
                          <span className="d-block small text-secondary ps-3 mt-1">{n.detail}</span>
                          <span className="d-block text-secondary ps-3 mt-1 admin-notif-time">{n.time}</span>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
                <div className="px-3 py-2 border-top bg-light">
                  <button
                    type="button"
                    className="btn btn-link btn-sm text-decoration-none p-0 text-secondary"
                    onClick={markNotificationsRead}
                  >
                    Mark all read
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="position-relative" ref={userRef}>
            <button
              type="button"
              className="btn btn-link text-decoration-none text-dark d-flex align-items-center gap-2 p-1"
              aria-expanded={userOpen}
              onClick={(e) => {
                e.stopPropagation();
                setUserOpen((v) => !v);
                setNotifOpen(false);
              }}
            >
              <span className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-semibold admin-avatar-sm">
                {initialsFromUser(me?.name, me?.email)}
              </span>
              <span className="d-none d-sm-flex flex-column text-start lh-sm">
                <span className="small fw-semibold">{me?.name ?? "Admin"}</span>
                <span className="text-secondary admin-role-sub">Administrator</span>
              </span>
              <i className="bi bi-chevron-down small text-secondary d-none d-sm-inline" aria-hidden />
            </button>
            {userOpen ? (
              <ul className="dropdown-menu show border-0 mt-2 py-2 admin-user-dropdown admin-card-elevated">
                <li>
                  <span className="dropdown-item-text small text-secondary">Signed in as {me?.email ?? "—"}</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" href="/admin/dashboard/settings" onClick={() => setUserOpen(false)}>
                    Store settings
                  </Link>
                </li>
                <li>
                  <button type="button" className="dropdown-item text-danger" onClick={() => void logout()}>
                    Sign out
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
