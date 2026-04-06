import { AdminStaticPage } from "@/components/admin/admin-static-page";

export default function AdminInventoryRoutePage() {
  return (
    <AdminStaticPage
      title="Inventory"
      description="Track stock, variants, and low-stock alerts. This screen is ready for you to connect to warehouse or fulfillment data when your catalog supports quantity fields."
      bullets={[
        "Low-stock thresholds and email alerts can be added alongside product quantity in the API.",
        "Use Products to review SKUs and pricing while inventory features are expanded.",
        "Bulk CSV import/export is a common next step for ops-heavy stores.",
      ]}
      ctas={[
        { label: "Open products", href: "/admin/dashboard/products" },
        { label: "View orders", href: "/admin/dashboard/orders" },
      ]}
    />
  );
}
