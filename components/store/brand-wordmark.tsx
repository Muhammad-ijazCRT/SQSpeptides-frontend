/**
 * Brand lockup: **SQS** (gold) + **peptides** (black on light, white on dark) → SQSpeptides.
 */
export function BrandWordmark({
  variant = "onLight",
  className = "",
}: {
  variant?: "onLight" | "onDark";
  className?: string;
}) {
  const rest = variant === "onDark" ? "text-white" : "text-black";
  return (
    <span className={`inline font-bold tracking-tight ${className}`.trim()}>
      <span className="text-[#D4AF37]">SQS</span>
      <span className={rest}>peptides</span>
    </span>
  );
}
