import { AdminStaticPage } from "@/components/admin/admin-static-page";

export default function AdminAnalyticsRoutePage() {
  return (
    <AdminStaticPage
      title="Analytics"
      description="High-level metrics already appear on the dashboard (revenue, orders, catalog size, customers). Dedicated charts and date ranges can plug into the same admin API as you grow reporting needs."
      bullets={[
        "Revenue and order volume: extend GET /admin/overview with time-bucketed aggregates.",
        "Funnel and conversion: wire storefront events or your analytics provider.",
        "Export: scheduled CSV or BI tool integration from PostgreSQL.",
      ]}
      ctas={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Orders", href: "/admin/dashboard/orders" },
      ]}
    />
  );
}
