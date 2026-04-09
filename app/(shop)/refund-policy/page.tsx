import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Refund Policy",
  description: `Returns, refunds, and order issues for ${SITE_BRAND_NAME}.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund policy" lastUpdated="April 9, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Overview</h2>
        <p>
          {SITE_LEGAL_NAME} d/b/a {SITE_BRAND_NAME} wants every order to arrive correct and documented. Because many items are
          temperature- and integrity-sensitive research materials, <strong className="text-black">all sales are final</strong>{" "}
          except where we confirm an error on our part, severe in-transit damage, or non-delivery as described below.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Order errors and defects</h2>
        <p>If we ship the wrong product, quantity, or an item that fails to match the published specification for that SKU:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Contact us at{" "}
            <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
              {SITE_SUPPORT_EMAIL}
            </a>{" "}
            within <strong className="text-black">seventy-two (72) hours</strong> of delivery with your order number and clear
            photos of labels and contents.
          </li>
          <li>
            After review, we may offer replacement, store credit, or refund at our discretion, and may require return of the
            incorrect item when safe and lawful to do so.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. Shipping damage</h2>
        <p>
          If outer packaging or product integrity is clearly compromised in transit, notify us within seventy-two (72) hours with
          photos of the shipping box and affected items. We will work with you and the carrier where applicable. Resolution may
          be replacement, partial credit, or refund depending on the facts.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. Non-delivery</h2>
        <p>
          If tracking shows no delivery or a prolonged exception, contact us. We will investigate with the carrier. If the
          package is confirmed lost, we will reship or refund the product portion of your order.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. What we generally do not refund</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Change of mind, buyer&apos;s remorse, or ordering mistakes after shipment;</li>
          <li>Delays caused by customs, weather, or carrier service disruptions outside our control;</li>
          <li>Issues arising from incorrect shipping information provided by the customer;</li>
          <li>Product opened or used in a way that prevents resale or compromises safety and compliance.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Payment processor and on-ramp charges</h2>
        <p>
          Refunds for card or partner-processed payments are issued to the original payment method when technically possible.
          Processing times vary by bank or processor (typically several business days). Fees charged by third-party payment or
          on-ramp providers may not be reversible; those are governed by the processor&apos;s terms.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Chargebacks</h2>
        <p>
          Please contact us before initiating a chargeback so we can resolve the issue. Abusive or fraudulent chargebacks may
          result in account closure and collection of fees we incur.
        </p>
      </section>
    </LegalPageShell>
  );
}
