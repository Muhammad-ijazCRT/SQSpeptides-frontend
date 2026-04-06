import { AdminStaticPage } from "@/components/admin/admin-static-page";

export default function AdminSettingsRoutePage() {
  return (
    <AdminStaticPage
      title="Settings"
      description="Environment-driven configuration keeps secrets out of the browser. Match JWT_SECRET between the Next app and Nest API; point NEXT_PUBLIC_API_URL at your API origin (e.g. http://localhost:3001)."
      bullets={[
        "Admin login: default seed user is configurable via ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env.",
        "API URL: NEXT_PUBLIC_API_URL must be reachable from the browser for the products list in admin.",
        "Production: use HTTPS, rotate secrets, and restrict admin routes by IP or SSO if required.",
      ]}
      ctas={[
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "View storefront", href: "/" },
      ]}
    />
  );
}
