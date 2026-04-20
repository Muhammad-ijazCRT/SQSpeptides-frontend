import { BrandLogo } from "@/components/store/brand-logo";

/** Thin wrapper around `BrandLogo` for legacy imports. */
type Props = { className?: string; size?: number };

export function MolecularLogo({ className = "", size = 40 }: Props) {
  return <BrandLogo height={size} className={className} />;
}
