/**
 * Crossmint link-wallet + embedded checkout must use this email with ONRAMP_RECIPIENT_SOLANA.
 * Store checkout uses the same pair for every customer so the wallet is not re-linked per shopper.
 * Order records still use each customer's email from checkout (Nest/Prisma).
 */

const FALLBACK_SOLANA = "HEDZpt7fh7PsBVyYjTPBno3JSRN6TE8kBY3Zm2UWEszU";
const FALLBACK_EMAIL = "demos+onramp-existing-user@crossmint.com";

function envOrFallback(value: string | undefined, fallback: string): string {
  const t = (value ?? "").trim();
  return t || fallback;
}

export const ONRAMP_RECIPIENT_SOLANA = envOrFallback(
  process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_SOLANA,
  FALLBACK_SOLANA
);

export const ONRAMP_RETURNING_EMAIL = envOrFallback(
  process.env.NEXT_PUBLIC_ONRAMP_RETURNING_EMAIL,
  FALLBACK_EMAIL
);
