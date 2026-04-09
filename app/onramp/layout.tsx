import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card funding | SQSpeptides",
  description:
    "Add funds with a card through our licensed payment partner for SQSpeptides checkout. Research supply merchant flow—not an investment product.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function OnrampLayout({ children }: { children: React.ReactNode }) {
  return children;
}
