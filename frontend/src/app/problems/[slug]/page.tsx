import React from "react";
import type { Metadata } from "next";
import { ProblemWorkspace, ProblemDetail } from "./ProblemWorkspace";

interface PageProps {
  params: {
    slug: string;
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katasphere.com";

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProblem(slug: string): Promise<ProblemDetail | null> {
  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://katasphere.onrender.com"
      : "http://localhost:8080");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${apiUrl}/api/v1/problems/${slug}`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const body = await res.json();
    return body?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const problem = await getProblem(params.slug);
  const fallbackTitle = formatSlugToTitle(params.slug);

  const title = problem?.title || fallbackTitle;
  const difficulty = problem?.difficulty || "Challenge";
  const tagsList = problem?.tags?.map((t) => t.name).join(", ") || "Algorithms, Data Structures";
  const rawDescription =
    problem?.description?.replace(/\s+/g, " ").trim().slice(0, 160) ||
    `Solve ${title} on Katasphere. Run and benchmark your code in isolated sandboxes across Java, Python, C++, and JavaScript.`;
  const description = `${title} (${difficulty}) — ${rawDescription}`;

  return {
    title: `${title} — Practice & Solutions`,
    description,
    keywords: [
      title,
      difficulty,
      ...(problem?.tags?.map((t) => t.name) || []),
      "coding interview",
      "algorithm problem",
      "online judge",
      "leetcode alternative",
      "interview solution",
    ],
    alternates: {
      canonical: `/problems/${params.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${siteUrl}/problems/${params.slug}`,
      title: `${title} (${difficulty}) | Katasphere`,
      description,
      siteName: "Katasphere",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${title} on Katasphere`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} (${difficulty}) | Katasphere`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function ProblemPage({ params }: PageProps) {
  const problem = await getProblem(params.slug);

  const jsonLd = problem
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        "name": problem.title,
        "description": problem.description.slice(0, 300),
        "programmingLanguage": ["Python", "Java", "C++", "JavaScript"],
        "educationalLevel": problem.difficulty,
        "keywords": problem.tags?.map((t) => t.name).join(", "),
        "url": `${siteUrl}/problems/${problem.slug}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProblemWorkspace slug={params.slug} initialProblem={problem} />
    </>
  );
}
