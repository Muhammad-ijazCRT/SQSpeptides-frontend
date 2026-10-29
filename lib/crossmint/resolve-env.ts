export type CrossmintEnvMode = "production" | "staging";

/**
 * Resolves Crossmint environment for API base URL + Stellar USDC token (pubnet vs testnet).
 * Order:
 * 1. Explicit NEXT_PUBLIC_CROSSMINT_ENV ("production" vs "staging" | "sandbox" | "test" | "dev")
 * 2. Key prefixes (ck_staging_ / sk_staging_ -> staging, ck_production_ / sk_production_ -> production)
 * 3. Fallback to NODE_ENV
 */
export function getCrossmintEnvMode(): CrossmintEnvMode {
  const explicit = (process.env.NEXT_PUBLIC_CROSSMINT_ENV ?? "").trim().toLowerCase();
  if (explicit === "production" || explicit === "prod" || explicit === "live") {
    return "production";
  }
  if (
    explicit === "staging" ||
    explicit === "sandbox" ||
    explicit === "test" ||
    explicit === "dev" ||
    explicit === "development"
  ) {
    return "staging";
  }

  const client = (process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "").trim();
  if (client.startsWith("ck_staging_") || client.startsWith("ck_development_")) return "staging";
  if (client.startsWith("ck_production_")) return "production";

  const server = (process.env.CROSSMINT_SERVER_SIDE_API_KEY ?? "").trim();
  if (server.startsWith("sk_staging_") || server.startsWith("sk_development_")) return "staging";
  if (server.startsWith("sk_production_")) return "production";

  return process.env.NODE_ENV === "production" ? "production" : "staging";
}
