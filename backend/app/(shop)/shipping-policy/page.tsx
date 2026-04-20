import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Shipping Policy",
  description: `Processing times, carriers, and delivery for ${SITE_BRAND_NAME} orders.`,
};

export default function ShippingPolicyPage() {
  return (
    <LegalPageShell title="Shipping policy" lastUpdated="April 9, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Processing</h2>
        <p>
          Orders are typically processed on business days (Monday–Friday, excluding U.S. holidays). Same-day processing may be
          available when stated at checkout and inventory allows. You will receive email updates when your order is confirmed
          and when it ships.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Carriers and delivery</h2>
        <p>
          We ship via major carriers (for example, USPS, UPS, or FedEx) selected at checkout or assigned based on service level.
          Delivery dates are estimates, not guarantees. {SITE_LEGAL_NAME} is not liable for carrier delays, failed delivery
          attempts due to recipient unavailability, or address errors entered by the customer.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. Domestic (United States)</h2>
        <p>
          Standard and expedited options may be offered where available. Shipping costs and estimated transit times are shown
          before you pay. Signature or adult verification may be required for certain shipments or destinations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. International</h2>
        <p>
          Where international shipping is available, you are the importer of record. You are responsible for customs duties,
          taxes, permits, and compliance with local laws regarding research materials. We may cancel or refuse orders we cannot
          ship lawfully to a destination.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. Research materials</h2>
        <p>
          Products are packaged and labeled for research use. Handling and storage instructions on the label or product page
          should be followed. {SITE_BRAND_NAME} does not ship products for human consumption or for uses prohibited on this site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Questions</h2>
        <p>
          For shipping issues after delivery, see our{" "}
          <a href="/refund-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Refund Policy
          </a>
          . For all other questions:{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
            {SITE_SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
