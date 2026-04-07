import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crossmint Onramp",
  description: "Fiat-to-crypto onramp demo — direct link only.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function OnrampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
