import { redirect } from "next/navigation";

/** Legacy URL: payment link list now lives at /admin/dashboard/history */
export default function AdminInvoicesLegacyRedirectPage() {
  redirect("/admin/dashboard/history");
}
