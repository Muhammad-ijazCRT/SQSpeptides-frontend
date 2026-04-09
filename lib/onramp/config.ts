/**
 * Crossmint link-wallet + embedded checkout: recipient wallet must match the linked wallet for ONRAMP_RETURNING_EMAIL.
 * Prefer NEXT_PUBLIC_ONRAMP_RECIPIENT_WALLET (Stellar). Legacy NEXT_PUBLIC_ONRAMP_RECIPIENT_SOLANA is still read as fallback.
 */

const FALLBACK_STELLAR_RECIPIENT = "CDRL6CLJMJSLXCK2VTPJWHQRMI7EXG6BZYT7XTMH7DMMNDEDP6N4GKJ3";
const FALLBACK_EMAIL = "demos+onramp-existing-user@crossmint.com";

function envOrFallback(value: string | undefined, fallback: string): string {
  const t = (value ?? "").trim();
  return t || fallback;
}

/** Strip optional `stellar:` prefix from env values. */
function normalizeRecipient(raw: string): string {
  const t = raw.trim();
  if (t.toLowerCase().startsWith("stellar:")) {
    return t.slice("stellar:".length).trim();
  }
  return t;
}

export const ONRAMP_RECIPIENT_WALLET = normalizeRecipient(
  envOrFallback(
    process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_WALLET || process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_SOLANA,
    FALLBACK_STELLAR_RECIPIENT,
  ),
);

/** @deprecated Use ONRAMP_RECIPIENT_WALLET (Stellar). */
export const ONRAMP_RECIPIENT_SOLANA = ONRAMP_RECIPIENT_WALLET;

export const ONRAMP_RETURNING_EMAIL = envOrFallback(
  process.env.NEXT_PUBLIC_ONRAMP_RETURNING_EMAIL,
  FALLBACK_EMAIL,
);
