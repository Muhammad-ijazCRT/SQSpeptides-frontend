import { getCrossmintEnvMode } from "@/lib/crossmint/resolve-env";

/**
 * Crossmint crypto onramp token locators for Stellar USDC.
 * @see https://docs.crossmint.com/onramp/quickstarts/react
 */
export const STELLAR_USDC_TOKEN_STAGING = "stellar:CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

/** Circle USDC on Stellar pubnet (Soroban / SEP-41), commonly used for mainnet onramps. */
export const STELLAR_USDC_TOKEN_PRODUCTION = "stellar:CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75";

export function resolveStellarUsdcTokenLocator(): string {
  const raw = process.env.NEXT_PUBLIC_CROSSMINT_STELLAR_USDC_LOCATOR?.trim();
  if (raw) {
    const normalized = raw.replace(/^stellar:\s*/i, "").trim();
    return `stellar:${normalized}`;
  }
  return getCrossmintEnvMode() === "production" ? STELLAR_USDC_TOKEN_PRODUCTION : STELLAR_USDC_TOKEN_STAGING;
}
