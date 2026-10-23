import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problem Catalog — Practice Algorithmic Coding Challenges",
  description:
    "Explore curated coding challenges across Arrays, Dynamic Programming, Strings, Two Pointers, Trees, and Stacks. Filter by difficulty, view acceptance rates, and run code in isolated sandboxes.",
  keywords: [
    "problem catalog",
    "algorithm problems",
    "coding exercises",
    "data structures",
    "leetcode problems",
    "coding practice",
  ],
  alternates: {
    canonical: "/problems",
  },
  openGraph: {
    title: "Problem Catalog | Katasphere",
    description:
      "Explore curated coding challenges across Arrays, Dynamic Programming, Two Pointers, and Stacks.",
    url: "/problems",
  },
};

export default function ProblemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
