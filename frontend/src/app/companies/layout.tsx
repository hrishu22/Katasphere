import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company Interview Questions — Google, Amazon, Meta, Microsoft (SDE-1)",
  description:
    "Targeted FAANG & Tier-1 company interview questions for SDE-1 roles. Practice verified problems asked in Online Assessments (OA), Phone Screens, and Onsite DSA rounds.",
  keywords: [
    "company interview questions",
    "google sde 1 questions",
    "amazon sde 1 interview",
    "meta coding interview",
    "microsoft interview questions",
    "faang coding round questions",
    "katasphere pro",
  ],
  alternates: {
    canonical: "/companies",
  },
  openGraph: {
    title: "Company Interview Questions (SDE-1) | Katasphere Pro",
    description:
      "Targeted FAANG & Tier-1 company interview questions for SDE-1 roles with round breakdowns and frequency stats.",
    url: "/companies",
  },
};

export default function CompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
