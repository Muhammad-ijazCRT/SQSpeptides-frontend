"use client";

export type StatAccent = "primary" | "success" | "violet" | "warning" | "danger" | "orange";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  iconClass: string;
  accent: StatAccent;
  size?: "lg" | "md";
};

const strip: Record<StatAccent, string> = {
  primary: "border-l-blue-500",
  success: "border-l-emerald-500",
  violet: "border-l-violet-500",
  warning: "border-l-amber-500",
  danger: "border-l-red-500",
  orange: "border-l-amber-500",
};

const iconWrap: Record<StatAccent, string> = {
  primary: "bg-blue-50 text-blue-600",
  success: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  warning: "bg-amber-50 text-amber-600",
  danger: "bg-red-50 text-red-600",
  orange: "bg-amber-50 text-amber-600",
};

const cardShadow =
  "shadow-[0_2px_8px_rgba(15,23,42,0.06),0_14px_36px_-8px_rgba(15,23,42,0.16)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.08),0_20px_44px_-10px_rgba(15,23,42,0.2)]";

export function StatCard({ label, value, subtext, iconClass, accent, size = "lg" }: StatCardProps) {
  const pad = size === "lg" ? "px-4 py-3" : "p-4";
  const valueClass = size === "lg" ? "text-xl" : "text-xl";
  const valueMargin = size === "lg" ? "mt-1" : "mt-2";
  const subMargin = size === "lg" ? "mt-1" : "mt-2";
  const subSize = size === "lg" ? "text-xs leading-snug text-neutral-500" : "text-sm text-neutral-500";
  const iconBox = size === "lg" ? "p-2" : "p-2";
  const iconSize = size === "lg" ? "1.25rem" : "1.25rem";

  return (
    <div
      className={`flex h-full min-h-0 flex-col rounded-xl border border-neutral-200 bg-white border-l-4 ${strip[accent]} ${cardShadow}`}
    >
      <div className={`flex flex-1 items-stretch ${pad}`}>
        <div className="flex w-full items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
            <p className={`${valueMargin} font-bold tabular-nums text-neutral-900 ${valueClass}`}>{value}</p>
            {subtext ? <p className={`${subMargin} ${subSize}`}>{subtext}</p> : null}
          </div>
          <div className={`flex shrink-0 rounded-full ${iconBox} ${iconWrap[accent]}`}>
            <i
              className={`bi ${iconClass} leading-none`}
              style={{ fontSize: iconSize }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
