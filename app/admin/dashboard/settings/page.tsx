import { redirect } from "next/navigation";

export default function AdminSettingsRoutePage() {
  redirect("/admin/dashboard/settings/payment-gateways");
}
