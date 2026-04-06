"use client";

import { useMemo, useState } from "react";

/** Golden accent (tailwind amber-500 family, aligned with reference). */
const ACCENT = "#EAB308";
/** Unselected preset label color — dark reddish maroon (reference). */
const MAROON = "#880808";

const TARGET_PRESETS_ROW1 = [0.1, 0.25, 0.5, 1, 2.5] as const;
const TARGET_PRESETS_ROW2 = [5, 10] as const;
const VIAL_PRESETS = [5, 10, 20, 50, 100] as const;
const WATER_PRESETS = [0.5, 1, 1.5, 2, 3, 5] as const;

function approxEq(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}

function formatTargetResultMg(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const s = n.toFixed(4).replace(/\.?0+$/, "");
  return s === "" ? "0" : s;
}

function formatMl(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toFixed(4).replace(/\.?0+$/, "").replace(/\.$/, "") || "0";
}

function formatConc(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return `${n.toFixed(4).replace(/\.?0+$/, "").replace(/\.$/, "")} mg/mL`;
}

function formatUnits(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toFixed(2).replace(/\.?0+$/, "") + " units";
}

type PresetButtonProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function PresetButton({ label, selected, onClick }: PresetButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 min-w-[3.75rem] rounded-md border px-2.5 py-2 text-center text-xs font-semibold transition sm:min-w-[4.25rem] sm:text-sm ${
        selected
          ? "border-[#EAB308] bg-[#EAB308] text-white hover:border-[#CA8A04] hover:bg-[#CA8A04]"
          : "border-neutral-300 bg-white hover:border-neutral-400"
      }`}
      style={selected ? undefined : { color: MAROON }}
    >
      {label}
    </button>
  );
}

export function LabReconstitutionCalculator() {
  const [targetMg, setTargetMg] = useState(1);
  const [totalVialMg, setTotalVialMg] = useState(10);
  const [waterMl, setWaterMl] = useState(1.5);

  const results = useMemo(() => {
    if (totalVialMg <= 0 || waterMl <= 0 || targetMg < 0) {
      return {
        concentration: null as number | null,
        equivMl: null as number | null,
        u100Units: null as number | null,
      };
    }
    const concentration = totalVialMg / waterMl;
    const equivMl = targetMg / concentration;
    const u100Units = equivMl * 100;
    return { concentration, equivMl, u100Units };
  }, [targetMg, totalVialMg, waterMl]);

  const inputClass =
    "mt-4 w-full rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-base font-medium tabular-nums text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400";

  return (
    <div className="mx-auto max-w-6xl rounded-xl border border-neutral-200/90 bg-white p-6 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.18)] sm:p-8 lg:p-10">
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
        {/* Target Amount (mg) */}
        <div>
          <h3 className="text-base font-bold sm:text-lg" style={{ color: ACCENT }}>
            Target Amount (mg)
          </h3>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">Select desired measurement amount</p>
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {TARGET_PRESETS_ROW1.map((v) => (
                <PresetButton
                  key={v}
                  label={`${v}mg`}
                  selected={approxEq(targetMg, v)}
                  onClick={() => setTargetMg(v)}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {TARGET_PRESETS_ROW2.map((v) => (
                <PresetButton
                  key={v}
                  label={`${v}mg`}
                  selected={approxEq(targetMg, v)}
                  onClick={() => setTargetMg(v)}
                />
              ))}
            </div>
          </div>
          <label className="block">
            <span className="sr-only">Target amount in milligrams</span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={targetMg}
              onChange={(e) => setTargetMg(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
        </div>

        {/* Total Vial Content (mg) */}
        <div>
          <h3 className="text-base font-bold sm:text-lg" style={{ color: ACCENT }}>
            Total Vial Content (mg)
          </h3>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">Total material present in vial</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {VIAL_PRESETS.map((v) => (
              <PresetButton
                key={v}
                label={`${v}mg`}
                selected={approxEq(totalVialMg, v)}
                onClick={() => setTotalVialMg(v)}
              />
            ))}
          </div>
          <label className="block">
            <span className="sr-only">Total vial content milligrams</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={totalVialMg}
              onChange={(e) => setTotalVialMg(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
        </div>

        {/* Bacteriostatic Water */}
        <div>
          <h3 className="text-base font-bold sm:text-lg" style={{ color: ACCENT }}>
            Bacteriostatic Water Added (mL)
          </h3>
          <p className="mt-1 text-xs text-neutral-500 sm:text-sm">Liquid volume added to vial</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {WATER_PRESETS.map((v) => (
              <PresetButton
                key={v}
                label={`${v}mL`}
                selected={approxEq(waterMl, v)}
                onClick={() => setWaterMl(v)}
              />
            ))}
          </div>
          <label className="block">
            <span className="sr-only">Bacteriostatic water milliliters</span>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={waterMl}
              onChange={(e) => setWaterMl(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </label>
        </div>
      </div>

      <div className="mt-12 rounded-lg border-2 border-neutral-200 bg-neutral-50/40 px-5 py-8 sm:px-8">
        <h4 className="text-center text-lg font-bold text-neutral-700">Results</h4>
        <ul className="mx-auto mt-8 max-w-xl space-y-5">
          <li className="flex flex-col gap-1 border-b border-neutral-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-neutral-500">Target Amount:</span>
            <span className="text-base font-bold tabular-nums" style={{ color: ACCENT }}>
              {targetMg >= 0 ? `${formatTargetResultMg(targetMg)} mg` : "—"}
            </span>
          </li>
          <li className="flex flex-col gap-1 border-b border-neutral-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-neutral-500">Equivalent Volume:</span>
            <span className="text-base font-bold tabular-nums" style={{ color: ACCENT }}>
              {results.equivMl != null ? `${formatMl(results.equivMl)} mL` : "—"}
            </span>
          </li>
          <li className="flex flex-col gap-1 border-b border-neutral-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-neutral-500">Equivalent Volume (U-100 syringe units):</span>
            <span className="text-base font-bold tabular-nums" style={{ color: ACCENT }}>
              {formatUnits(results.u100Units)}
            </span>
          </li>
          <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-neutral-500">Resulting concentration:</span>
            <span className="text-base font-bold tabular-nums" style={{ color: ACCENT }}>
              {formatConc(results.concentration)}
            </span>
          </li>
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-neutral-500">
          This calculator is provided for laboratory measurement reference only and does not provide medical instructions.
        </p>
      </div>
    </div>
  );
}
