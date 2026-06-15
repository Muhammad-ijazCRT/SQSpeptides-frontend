import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Refund Policy",
  description: `Returns, refunds, and order resolution for research peptide orders from ${SITE_BRAND_NAME}.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund policy" lastUpdated="June 13, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Overview</h2>
        <p>
          {SITE_LEGAL_NAME} d/b/a {SITE_BRAND_NAME} is committed to delivering research-grade peptides and laboratory materials
          that match published specifications and arrive in suitable condition for qualified laboratory use. Because peptides and
          related compounds are sensitive to temperature, light, and handling,{" "}
          <strong className="text-black">all sales are final</strong> except where we confirm an error on our part, documented
          in-transit compromise, or confirmed non-delivery as described below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Order errors and specification mismatches</h2>
        <p>
          If we ship the wrong peptide, incorrect quantity, or a product that does not match the published specification or COA
          for that catalog SKU:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Contact us at{" "}
            <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
              {SITE_SUPPORT_EMAIL}
            </a>{" "}
            within <strong className="text-black">seventy-two (72) hours</strong> of delivery with your order number, batch or
            lot reference (if shown on the label), and clear photos of outer packaging, vial labels, and contents.
          </li>
          <li>
            After review, we may offer replacement from the same batch where available, store credit, or refund at our
            discretion. We may request return of the incorrect material when safe, lawful, and necessary to complete our
            investigation.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. Shipping and packaging damage</h2>
        <p>
          Research materials should arrive intact with legible labeling. If outer packaging, cold-chain materials (where
          applicable), or vial integrity is clearly compromised in transit, notify us within seventy-two (72) hours with photos
          of the shipping container, internal packaging, and affected units. We will coordinate with the carrier where
          applicable. Resolution may include replacement, partial credit, or refund depending on the facts and product
          recoverability.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. Non-delivery</h2>
        <p>
          If carrier tracking shows no delivery, prolonged exception, or loss in transit, contact us promptly. We will
          investigate with the carrier. If the shipment is confirmed lost before delivery to your laboratory address, we will
          reship the product (subject to inventory) or refund the product portion of your order.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. What we generally do not refund</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Change of mind, ordering errors, or protocol changes after shipment;</li>
          <li>
            Dissatisfaction with research outcomes, experimental results, or suitability for a particular study (products are
            supplied for laboratory research; validation is the purchaser&apos;s responsibility);
          </li>
          <li>Delays caused by customs, weather, or carrier service disruptions outside our control;</li>
          <li>Issues arising from incorrect or incomplete shipping information provided by the purchaser;</li>
          <li>
            Materials opened, reconstituted, aliquoted, or stored in a manner that breaks chain-of-custody or prevents
            verification of the original shipment condition.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Payment refunds</h2>
        <p>
          Approved refunds for card or partner-processed payments are issued to the original payment method when technically
          possible. Processing times vary by bank or processor (typically several business days). Fees charged by third-party
          payment or cryptocurrency providers may not be reversible; those are governed by the processor&apos;s terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Chargebacks</h2>
        <p>
          Please contact us before initiating a chargeback so we can review your order, documentation, and shipment records.
          Abusive or fraudulent chargebacks may result in account closure and recovery of fees we incur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">8. Documentation requests</h2>
        <p>
          For questions about COA availability, batch records, or order documentation before requesting a refund, email{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
            {SITE_SUPPORT_EMAIL}
          </a>{" "}
          with your order number. Many issues can be resolved without a return when documentation or replacement vials are
          available.
        </p>
      </section>
    </LegalPageShell>
  );
}
