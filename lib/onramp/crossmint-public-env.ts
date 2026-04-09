import { getCrossmintEnvMode } from "@/lib/crossmint/resolve-env";

/** True when using production Crossmint + Stellar pubnet USDC (matches lib/crossmint/crossmint-api.ts). */
export function isCrossmintProduction(): boolean {
  return getCrossmintEnvMode() === "production";
}
