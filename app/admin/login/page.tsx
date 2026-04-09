import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { BrandLogo } from "@/components/store/brand-logo";

export const metadata: Metadata = {
  title: "Admin Sign In",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <div className="bg-[#b91c1c] py-2 text-center text-[11px] font-bold uppercase tracking-wide text-white sm:text-xs">
        Admin access — authorized personnel only
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex justify-center">
            <BrandLogo height={44} className="max-h-11" />
          </div>
          <h1 className="text-center text-xl font-bold text-neutral-900">Admin sign in</h1>
          <p className="mt-2 text-center text-sm text-neutral-600">
            Run <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">pnpm prisma db seed</code> in{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">backend/</code>, then sign in with{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">ADMIN_EMAIL</code> /{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">ADMIN_PASSWORD</code> from{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">backend/.env</code> (defaults:{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">admin@sqspeptides.local</code> /{" "}
            <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">ChangeMeAdmin123!</code>).
          </p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
