export const RESEARCH_USE_ATTESTATION_OPTIONS = [
  "Independent",
  "Educational",
  "University",
  "Laboratory",
] as const;

/** Stored on the order when the checkout purchaser-responsibility checkbox is accepted. */
export const PURCHASER_RESPONSIBILITY_ATTESTATION = "PETRA_PEPTIDE_PURCHASER_AGREEMENT_V1" as const;

export type ResearchUseAttestation = (typeof RESEARCH_USE_ATTESTATION_OPTIONS)[number] | typeof PURCHASER_RESPONSIBILITY_ATTESTATION;

export function isResearchUseAttestation(value: string): value is ResearchUseAttestation {
  return (
    (RESEARCH_USE_ATTESTATION_OPTIONS as readonly string[]).includes(value) ||
    value === PURCHASER_RESPONSIBILITY_ATTESTATION
  );
}

export function formatResearchAttestationForDisplay(value: string): string {
  if (value === PURCHASER_RESPONSIBILITY_ATTESTATION) {
    return "Purchaser responsibility & terms accepted";
  }
  return value;
}
