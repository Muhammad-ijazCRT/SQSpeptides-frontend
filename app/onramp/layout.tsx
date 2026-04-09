import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crossmint Onramp",
  description: "Fiat-to-crypto onramp demo — direct link only.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function OnrampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
