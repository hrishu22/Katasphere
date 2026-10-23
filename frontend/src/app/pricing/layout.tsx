import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing & Plans — Katasphere Pro",
  description:
    "Upgrade to Katasphere Pro to unlock company-specific interview question sets for Google, Amazon, Meta, and Microsoft with round breakdowns and editorial solutions.",
  keywords: [
    "katasphere pricing",
    "katasphere pro",
    "coding interview prep subscription",
    "faang company questions pro",
    "tech interview roadmap",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing & Plans | Katasphere Pro",
    description:
      "Unlock full company question banks and editorial solutions with Katasphere Pro.",
    url: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
