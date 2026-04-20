"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SITE_BRAND_NAME } from "@/lib/site-business";

const features = [
  {
    title: "Licensed card processing",
    description:
      "Debit and credit card payments are handled by Crossmint, a regulated payments partner. You complete checkout in a secure embedded flow.",
    iconPath: "/shield-check.svg",
  },
  {
    title: "Clear business purpose",
    description: `${SITE_BRAND_NAME} uses this option so approved customers can fund a wallet for catalog purchases—not for trading, investing, or speculative crypto activity.`,
    iconPath: "/window.svg",
  },
  {
    title: "Verification when required",
    description:
      "Depending on amount, issuer, and risk checks, you may be asked to verify identity. This is standard for card-to-asset flows and helps prevent fraud.",
    iconPath: "/file.svg",
  },
  {
    title: "Receipts and records",
    description:
      "You receive confirmation from the processor. Keep your email and any receipts for your records. Full policies are in our Terms and Privacy pages.",
    iconPath: "/globe.svg",
  },
];

export default function FeatureHighlights() {
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative m-3 col-span-2 hidden flex-col justify-center rounded-[20px] px-12 py-8 lg:flex"
      style={{
        backgroundImage: `url('/grid-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[20px] bg-black/40 transition-opacity duration-600 ease-out",
          showFeatures ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="relative z-10 flex flex-col gap-12 text-white">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">Card funding</h1>
          <p className="text-lg text-white/70">
            Add funds with a U.S. card through our payment partner for use with {SITE_BRAND_NAME} checkout options that require a
            funded wallet. This is a merchant checkout feature—not a standalone investment or &ldquo;crypto profits&rdquo;
            product.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`flex items-start gap-5 rounded-2xl border border-white/10 bg-blue-300/3 p-4 backdrop-blur-sm transition-all duration-600 ease-out ${
                showFeatures ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{
                transitionDelay: showFeatures ? `${index * 150}ms` : "0ms",
              }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center self-center rounded-full border-2 border-white/20">
                <Image
                  className="filter-green w-6"
                  src={feature.iconPath}
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
              <div>
                <h3 className="font-medium text-white">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80">
          <Link href="/about-us" className="hover:text-white hover:underline">
            About {SITE_BRAND_NAME}
          </Link>
          <Link href="/terms" className="hover:text-white hover:underline">
            Terms
          </Link>
          <Link href="/privacy-policy" className="hover:text-white hover:underline">
            Privacy
          </Link>
          <Link href="/contact-us" className="hover:text-white hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
