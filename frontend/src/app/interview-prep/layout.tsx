import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Interview Prep — Blind 75, Top 150 & Company Roadmaps",
  description:
    "Structured study plans for software engineering technical interviews: Blind 75, Top 150, and targeted company interview tracks for Google, Meta, and Amazon.",
  keywords: [
    "blind 75",
    "top 150 interview questions",
    "google coding interview",
    "meta software engineer interview",
    "faang interview prep",
    "technical interview roadmap",
  ],
  alternates: {
    canonical: "/interview-prep",
  },
  openGraph: {
    title: "Interview Prep Roadmaps | Katasphere",
    description:
      "Structured study plans for software engineering technical interviews: Blind 75, Top 150, and company interview tracks.",
    url: "/interview-prep",
  },
};

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
