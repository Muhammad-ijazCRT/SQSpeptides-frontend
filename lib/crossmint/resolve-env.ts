export type CrossmintEnvMode = "production" | "staging";

/**
 * Resolves Crossmint environment for API base URL + Stellar USDC token (pubnet vs testnet).
 * Order: explicit NEXT_PUBLIC_CROSSMINT_ENV → client key prefix → server key prefix → NODE_ENV.
 */
export function getCrossmintEnvMode(): CrossmintEnvMode {
  const explicit = process.env.NEXT_PUBLIC_CROSSMINT_ENV?.trim();
  if (explicit === "production" || explicit === "staging") {
    return explicit;
  }

  const client = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "";
  if (client.startsWith("ck_production_")) return "production";
  if (client.startsWith("ck_staging_")) return "staging";

  const server = process.env.CROSSMINT_SERVER_SIDE_API_KEY ?? "";
  if (server.startsWith("sk_production_")) return "production";
  if (server.startsWith("sk_staging_")) return "staging";

  return process.env.NODE_ENV === "production" ? "production" : "staging";
}
