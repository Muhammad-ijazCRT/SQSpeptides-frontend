/**
 * Lenient Stellar destination check (typical strkey length, account `G…` or contract `C…`).
 * Crossmint may use contract strkeys that differ from classic base32 rules.
 */
export function isValidStellarWalletAddress(address: string): boolean {
  const t = address.trim();
  if (t.length !== 56) return false;
  return (t.startsWith("G") || t.startsWith("C")) && /^[A-Z2-7]+$/i.test(t);
}
