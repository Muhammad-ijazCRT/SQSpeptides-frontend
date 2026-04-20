import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

import "./admin-panel.css";

export const dynamic = "force-dynamic";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardShell>{children}</AdminDashboardShell>;
}
