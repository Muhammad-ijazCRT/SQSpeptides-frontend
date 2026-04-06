import { AdminStaticPage } from "@/components/admin/admin-static-page";

export default function AdminInvoicesRoutePage() {
  return (
    <AdminStaticPage
      title="Invoices"
      description="Generate and track invoices per order, export PDFs, and sync with accounting. This module is ready to connect once you add invoice records to your API."
      bullets={[
        "Typical fields: invoice number, order reference, tax lines, payment status, due date.",
        "Batch export to CSV helps finance teams reconcile monthly.",
        "Link from each order row once GET /admin/invoices is implemented.",
      ]}
      ctas={[
        { label: "Orders", href: "/admin/dashboard/orders" },
        { label: "Dashboard", href: "/admin/dashboard" },
      ]}
    />
  );
}
