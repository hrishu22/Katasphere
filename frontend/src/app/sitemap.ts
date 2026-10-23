import { MetadataRoute } from "next";

const DEFAULT_SLUGS = [
  "two-sum",
  "3sum",
  "longest-substring-without-repeating-characters",
  "best-time-to-buy-and-sell-stock",
  "valid-parentheses",
  "valid-palindrome",
  "container-with-most-water",
  "maximum-subarray",
  "climbing-stairs",
  "reverse-linked-list",
  "merge-two-sorted-lists",
  "invert-binary-tree",
  "binary-tree-level-order-traversal",
  "kth-largest-element-in-an-array",
  "product-of-array-except-self",
  "group-anagrams",
  "search-in-rotated-sorted-array",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://katasphere.com";
  const apiUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://katasphere.onrender.com"
      : "http://localhost:8080");

  let problemSlugs = DEFAULT_SLUGS;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${apiUrl}/api/v1/problems?size=100`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const fetchedSlugs = data?.data?.content?.map((p: any) => p.slug);
      if (Array.isArray(fetchedSlugs) && fetchedSlugs.length > 0) {
        problemSlugs = Array.from(new Set([...DEFAULT_SLUGS, ...fetchedSlugs]));
      }
    }
  } catch {
    // Graceful fallback to static seeded slugs without blocking build workers
  }

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/problems`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/companies`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/interview-prep`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const problemRoutes: MetadataRoute.Sitemap = problemSlugs.map((slug) => ({
    url: `${siteUrl}/problems/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...problemRoutes];
}
