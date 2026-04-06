import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardHome } from "@/components/account/dashboard-home";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
      <DashboardHome />
    </Suspense>
  );
}
