import { AdminStaticPage } from "@/components/admin/admin-static-page";

export default function AdminMarketingRoutePage() {
  return (
    <AdminStaticPage
      title="Marketing"
      description="Promotions, coupons, and campaigns typically live here. The storefront checkout can be extended to accept discount codes once your backend models them."
      bullets={[
        "Coupon codes and percentage/fixed discounts require schema and validation at checkout.",
        "Email campaigns often integrate with Mailchimp, Resend, or similar via server jobs.",
        "Abandoned cart recovery needs cart persistence and optional user email capture.",
      ]}
      ctas={[
        { label: "Customer accounts", href: "/admin/dashboard/customers" },
        { label: "Storefront", href: "/" },
      ]}
    />
  );
}
