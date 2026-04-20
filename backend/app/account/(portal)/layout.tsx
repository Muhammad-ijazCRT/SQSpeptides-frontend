import { AccountShell } from "@/components/account/account-shell";

export default function AccountPortalLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
