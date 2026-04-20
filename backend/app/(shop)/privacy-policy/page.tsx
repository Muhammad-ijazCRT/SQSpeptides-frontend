import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_BRAND_NAME} collects, uses, and protects personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy policy" lastUpdated="April 9, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Introduction</h2>
        <p>
          {SITE_LEGAL_NAME}, doing business as {SITE_BRAND_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
          operates this website and related services. This Privacy Policy describes how we collect, use, disclose, and safeguard
          information when you visit our site, create an account, place an order, or otherwise interact with us.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Information we collect</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-black">Account and contact data:</strong> name, email address, phone number (if provided),
            shipping and billing addresses, and account credentials.
          </li>
          <li>
            <strong className="text-black">Order information:</strong> products purchased, order history, payment-related
            references (we do not store full card numbers on our servers; payment processors handle card data).
          </li>
          <li>
            <strong className="text-black">Technical data:</strong> IP address, browser type, device identifiers, pages viewed,
            and approximate location derived from IP for fraud prevention and analytics.
          </li>
          <li>
            <strong className="text-black">Communications:</strong> messages you send to {SITE_SUPPORT_EMAIL} or through contact
            forms.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. How we use information</h2>
        <p>We use personal information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Process, fulfill, and support orders;</li>
          <li>Authenticate accounts and prevent fraud;</li>
          <li>Communicate about orders, policies, and (where permitted) marketing;</li>
          <li>Improve our website, products, and customer service;</li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. Payments and on-ramp services</h2>
        <p>
          Card payments and optional digital-asset funding flows may be processed by third-party providers such as{" "}
          <strong className="text-black">Crossmint</strong> and other payment partners. Those providers collect and process data
          under their own terms and privacy policies. We receive limited transaction data (for example, confirmation status,
          amounts, and risk signals) as needed to complete your purchase.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. Sharing of information</h2>
        <p>We may share information with:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Payment processors, fraud-screening vendors, and shipping carriers;</li>
          <li>Professional advisers (lawyers, accountants) when required;</li>
          <li>Authorities when required by law, subpoena, or to protect rights and safety.</li>
        </ul>
        <p>We do not sell your personal information for money.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Cookies and similar technologies</h2>
        <p>
          We use cookies and similar tools for essential site operation, preferences, analytics, and security. You can control
          cookies through your browser settings; disabling certain cookies may limit site functionality.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Data retention</h2>
        <p>
          We retain information as long as needed to fulfill the purposes above, comply with law, resolve disputes, and enforce
          agreements. Order and tax records may be kept for extended periods as required by regulation.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">8. Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational measures to protect personal information. No method
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
        <h2 className="text-base font-bold text-black">10. Children</h2>
        <p>
          Our services are not directed to anyone under 21. We do not knowingly collect personal information from children. If
          you believe we have collected such information, contact us and we will take appropriate steps to delete it.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">11. International visitors</h2>
        <p>
          If you access our site from outside the United States, your information may be processed in the United States, where
          privacy laws may differ from those in your country.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">12. Changes</h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top will change when we do. For
          material changes, we will provide notice as appropriate (for example, by email or a notice on the site).
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
