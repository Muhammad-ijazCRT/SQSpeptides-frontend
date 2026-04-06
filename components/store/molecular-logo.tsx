type Props = { className?: string; size?: number };

export function MolecularLogo({ className = "", size = 40 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="24" cy="12" r="5" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <circle cx="12" cy="32" r="5" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <circle cx="36" cy="32" r="5" stroke="#D4AF37" strokeWidth="2" fill="none" />
      <line x1="24" y1="17" x2="14" y2="28" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="24" y1="17" x2="34" y2="28" stroke="#D4AF37" strokeWidth="1.5" />
      <line x1="17" y1="32" x2="31" y2="32" stroke="#D4AF37" strokeWidth="1.5" />
    </svg>
  );
}
