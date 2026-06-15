import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Shipping Policy",
  description: `Processing, carriers, and delivery for research peptide orders from ${SITE_BRAND_NAME}.`,
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageShell title="Shipping policy" lastUpdated="June 13, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Processing</h2>
        <p>
          Research orders are typically processed on business days (Monday–Friday, excluding U.S. federal holidays). Same-day
          processing may be available when stated at checkout and inventory allows. You will receive email confirmation when
          your order is accepted and again when it ships, including tracking information when provided by the carrier.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Carriers and delivery</h2>
        <p>
          We ship via major carriers (for example, USPS, UPS, or FedEx) selected at checkout or assigned based on service level
          and product requirements. Estimated delivery dates are not guaranteed. {SITE_LEGAL_NAME} is not liable for carrier
          delays, failed delivery attempts due to recipient unavailability, or address errors entered at checkout.
        </p>
        <p>
          Deliveries are made to the shipping address you provide—typically a laboratory, institutional mailroom, or authorized
          receiving location. Ensure someone authorized to accept research materials is available where required by the carrier.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. Domestic (United States)</h2>
        <p>
          Standard and expedited options may be offered where available. Shipping costs and estimated transit times are displayed
          before payment. Signature confirmation or age verification may be required for certain destinations or service levels.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. International</h2>
        <p>
          Where international shipping is available, you are the importer of record. You are responsible for customs duties,
          taxes, import permits, and compliance with local regulations governing research peptides and laboratory reagents. We
          may decline or cancel orders we cannot lawfully export to a given destination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. Research material handling</h2>
        <p>
          Peptides and related products are packaged and labeled for qualified laboratory research. Upon receipt, store materials
          according to the product page, label instructions, and your laboratory standard operating procedures. Many peptides
          require controlled temperature storage; inspect shipments promptly and document condition on arrival for your records.
        </p>
        <p>
          {SITE_BRAND_NAME} ships only to purchasers who have confirmed eligible research-use attestation at checkout. We do not
          fulfill orders intended for applications outside lawful in vitro or laboratory research programs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Order tracking and support</h2>
        <p>
          Tracking links are included in shipment confirmation emails when available. If tracking stalls or shows an exception,
          contact {SITE_SUPPORT_EMAIL} with your order number before the estimated delivery window ends so we can assist with
          carrier inquiry.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Questions after delivery</h2>
        <p>
          For damaged shipments, specification concerns, or non-delivery, see our{" "}
          <a href="/refund-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Refund Policy
          </a>
          . For all other shipping questions:{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
            {SITE_SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
