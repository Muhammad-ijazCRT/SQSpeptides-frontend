import type { Metadata } from "next";
import { AdminCategoriesPage } from "@/components/admin/admin-categories-page";

export const metadata: Metadata = {
  title: "Categories | Admin",
};

export default function AdminCategoriesRoute() {
  return <AdminCategoriesPage />;
}
