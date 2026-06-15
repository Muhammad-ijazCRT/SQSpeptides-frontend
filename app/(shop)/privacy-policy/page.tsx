import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_BRAND_NAME} collects, uses, and protects information for qualified research customers.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy policy" lastUpdated="June 13, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Introduction</h2>
        <p>
          {SITE_LEGAL_NAME}, doing business as {SITE_BRAND_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
          supplies research-grade peptides and related laboratory materials to qualified professionals. This Privacy Policy
          explains how we collect, use, disclose, and safeguard information when you visit our site, register a laboratory or
          institutional account, request documentation, or place a research order.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-black">Account and contact data:</strong> name, institutional or laboratory affiliation
            (where provided), professional email address, shipping address for laboratory delivery, billing details, and
            account credentials.
          </li>
          <li>
            <strong className="text-black">Order and research-use records:</strong> products ordered, quantities, order history,
            attestation selections, and requests for Certificates of Analysis (COA) or batch documentation.
          </li>
          <li>
            <strong className="text-black">Payment references:</strong> transaction confirmations and amounts. Full payment card
            numbers are processed by third-party providers and are not stored on our servers.
          </li>
          <li>
            <strong className="text-black">Technical data:</strong> IP address, browser type, device identifiers, pages viewed,
            and approximate location derived from IP for fraud prevention, security, and site analytics.
          </li>
          <li>
            <strong className="text-black">Communications:</strong> correspondence with {SITE_SUPPORT_EMAIL}, wholesale inquiries,
            and documentation requests submitted through our contact forms.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. How we use information</h2>
        <p>We use personal and institutional information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Process, fulfill, and support research material orders;</li>
          <li>Verify purchaser eligibility and maintain compliance with our research-use standards;</li>
          <li>Provide order confirmations, shipping updates, and COA or batch documentation when available;</li>
          <li>Authenticate accounts, prevent fraud, and protect the integrity of our catalog;</li>
          <li>Improve our website, product information, and professional support services;</li>
          <li>Comply with legal obligations and enforce our terms and policies.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. Payments</h2>
        <p>
          Card payments and optional digital-asset checkout flows may be processed by third-party providers such as{" "}
          <strong className="text-black">Crossmint</strong>, cryptocurrency payment partners, and other authorized processors.
          Those providers collect and process data under their own terms and privacy policies. We receive limited transaction
          data (for example, confirmation status, amounts, and risk signals) as needed to complete your purchase and maintain
          order records.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. Sharing of information</h2>
        <p>We may share information with:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment processors, fraud-screening vendors, and shipping carriers fulfilling laboratory deliveries;</li>
          <li>Professional advisers (legal, accounting) when required for business operations;</li>
          <li>Regulatory or law-enforcement authorities when required by law, subpoena, or to protect rights and safety.</li>
        </ul>
        <p>We do not sell your personal information for monetary consideration.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Cookies and similar technologies</h2>
        <p>
          We use cookies and similar tools for essential site operation, session management, preferences, analytics, and
          security. You may control cookies through your browser settings; disabling certain cookies may limit site
          functionality, including checkout and account access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Data retention</h2>
        <p>
          We retain information as long as needed to fulfill the purposes described above, support order history and
          documentation requests, comply with law, resolve disputes, and enforce agreements. Order, tax, and compliance records
          may be retained for extended periods as required by applicable regulation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">8. Security</h2>
        <p>
          We apply reasonable administrative, technical, and organizational measures to protect personal information. No method
          of transmission over the Internet is completely secure; we cannot guarantee absolute security.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">9. Your choices and rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or restrict certain processing of your
          personal information, or to object to processing. To exercise these rights, contact us at{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
            {SITE_SUPPORT_EMAIL}
          </a>
          . We may verify your request as permitted by law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">10. Professional purchasers only</h2>
        <p>
          Our services are directed to qualified adults (21+) engaged in lawful laboratory research or authorized procurement
          on behalf of a research organization. We do not knowingly collect personal information from individuals who do not meet
          our eligibility standards. If you believe information was collected in error, contact us and we will take appropriate
          steps to review and delete it where required.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">11. International visitors</h2>
        <p>
          If you access our site from outside the United States, your information may be processed in the United States, where
          privacy laws may differ from those in your country. You are responsible for ensuring that your purchase and use of
          research materials complies with local import and research regulations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">12. Changes</h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top will change when we do.
          For material changes, we will provide notice as appropriate (for example, by email or a notice on the site).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">13. Contact</h2>
        <p>
          {SITE_LEGAL_NAME} d/b/a {SITE_BRAND_NAME}
          <br />
          Email:{" "}
          <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-black underline hover:text-[#b8962e]">
            {SITE_SUPPORT_EMAIL}
          </a>
        </p>
      </section>
    </LegalPageShell>
  );
}
