import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "How SQSpeptides handles your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-8">
      <Link href="/" className="text-sm font-medium text-[#b8962e] hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-black">Privacy policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-neutral-600">
        Your personal data will be used to process your order, support your experience throughout this website, and for other
        purposes described in this policy. This page is a placeholder — replace with your full privacy policy and data
        processing disclosures before production.
      </p>
      <p className="mt-4 text-sm text-neutral-600">
        Questions? <Link href="/contact-us" className="font-semibold text-black underline">Contact us</Link>.
      </p>
    </div>
  );
}
