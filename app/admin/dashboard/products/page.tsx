import { Suspense } from "react";
import { AdminProductsPage } from "@/components/admin/admin-products-page";

function ProductsFallback() {
  return (
    <div className="py-5 text-center text-secondary small">
      <div className="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true" />
      Loading products…
    </div>
  );
}

export default function AdminProductsRoutePage() {
  return (
    <Suspense fallback={<ProductsFallback />}>
      <AdminProductsPage />
    </Suspense>
  );
}
