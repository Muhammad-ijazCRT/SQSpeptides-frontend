import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions of use and purchase.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <Link href="/" className="text-sm font-medium text-[#b8962e] hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-black">Terms and conditions</h1>
      <p className="mt-6 text-sm leading-relaxed text-neutral-600">
        By purchasing, you accept full responsibility for safe, lawful, research-only use and acknowledge that Petra Peptide
        Science LLC bears no liability for misuse, subject to the full agreement at checkout. This page is a placeholder —
        publish your complete terms, indemnity, and eligibility requirements here before production.
      </p>
      <p className="mt-4 text-sm text-neutral-600">
        Questions? <Link href="/contact-us" className="font-semibold text-black underline">Contact us</Link>.
      </p>
    </div>
  );
}
