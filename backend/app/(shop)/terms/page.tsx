import { LegalPageShell } from "@/components/store/legal-page-shell";
import { SITE_BRAND_NAME, SITE_LEGAL_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site-business";

export const metadata = {
  title: "Terms & Conditions",
  description: `Terms of use and purchase for ${SITE_BRAND_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms & conditions" lastUpdated="April 9, 2026">
      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">1. Agreement</h2>
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the website and services operated
          by {SITE_LEGAL_NAME} d/b/a {SITE_BRAND_NAME} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using the
          site, creating an account, or placing an order, you agree to these Terms and our{" "}
          <a href="/privacy-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">2. Eligibility</h2>
        <p>
          You must be at least <strong className="text-black">21 years of age</strong> and able to form a binding contract. You
          represent that you are a qualified researcher or authorized representative of an organization that may lawfully
          purchase research-use materials in your jurisdiction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">3. Research use only</h2>
        <p>
          All products are sold <strong className="text-black">solely for laboratory and research use</strong>, not for human
          consumption, veterinary use, diagnostics, or any clinical or therapeutic purpose. You assume full responsibility for
          lawful storage, handling, and use. {SITE_LEGAL_NAME} disclaims any liability for misuse, unauthorized use, or use
          contrary to applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">4. Accounts</h2>
        <p>
          You are responsible for safeguarding your login credentials and for all activity under your account. Notify us
          promptly at {SITE_SUPPORT_EMAIL} if you suspect unauthorized access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">5. Orders, pricing, and acceptance</h2>
        <p>
          Product descriptions, prices, and availability are subject to change without notice. We reserve the right to refuse or
          cancel any order (including after payment) if we suspect fraud, regulatory risk, or violation of these Terms. If we
          cancel after payment, we will refund amounts paid for the canceled portion in accordance with our{" "}
          <a href="/refund-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Refund Policy
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">6. Payment</h2>
        <p>
          You authorize us and our payment partners to charge your selected payment method for all amounts due. You agree to
          provide current, complete, and accurate purchase and account information. Additional verification (including identity
          checks) may be required by our processors for card or on-ramp transactions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">7. Shipping and risk of loss</h2>
        <p>
          Title and risk of loss pass as described in our{" "}
          <a href="/shipping-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Shipping Policy
          </a>
          . You are responsible for import duties, permits, or restrictions in your location where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">8. Returns and refunds</h2>
        <p>
          Research materials are subject to strict return limitations. See our{" "}
          <a href="/refund-policy" className="font-semibold text-black underline hover:text-[#b8962e]">
            Refund Policy
          </a>{" "}
          for details.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">9. Prohibited conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the site for unlawful purposes or to procure products for unauthorized human or veterinary use;</li>
          <li>Interfere with site security, other users, or our systems;</li>
          <li>Misrepresent your identity, affiliation, or intended use;</li>
          <li>Scrape, reverse engineer, or exploit the site except as allowed by law.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">10. Intellectual property</h2>
        <p>
          All content on the site (text, graphics, logos, and layout) is owned by us or our licensors and is protected by
          intellectual property laws. You may not copy or use it for commercial purposes without our written permission.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">11. Disclaimers</h2>
        <p>
          THE SITE AND PRODUCTS ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE.&rdquo; TO THE MAXIMUM EXTENT PERMITTED
          BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR ERROR-FREE OPERATION.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">12. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE_LEGAL_NAME} AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOST PROFITS, ARISING OUT OF
          YOUR USE OF THE SITE OR PRODUCTS. OUR AGGREGATE LIABILITY FOR ANY CLAIM RELATING TO AN ORDER SHALL NOT EXCEED THE
          AMOUNT YOU PAID US FOR THAT ORDER IN THE TWELVE (12) MONTHS BEFORE THE CLAIM.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">13. Indemnity</h2>
        <p>
          You agree to indemnify, defend, and hold harmless {SITE_LEGAL_NAME} and its affiliates from claims, damages, losses,
          and expenses (including reasonable attorneys&apos; fees) arising from your use of the site or products, your breach
          of these Terms, or your violation of law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">14. Governing law and venue</h2>
        <p>
          These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law rules. You agree that
          courts located in Denton County, Texas, shall have exclusive jurisdiction over disputes, subject to mandatory consumer
          protections in your jurisdiction where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">15. Changes</h2>
        <p>
          We may modify these Terms at any time. The updated Terms will be posted on this page with a revised &ldquo;Last
          updated&rdquo; date. Continued use after changes constitutes acceptance. If you do not agree, discontinue use of the
          site.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-black">16. Contact</h2>
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
