import catalogJson from "./catalog.json";

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface ExampleDto {
  position: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface ProblemDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  constraintsText: string;
  starterCode: Record<string, string> | string;
  tags: TagDto[];
  examples: ExampleDto[];
  acceptanceRate?: string;
  inputFormat?: string;
  outputFormat?: string;
}

interface RawProblemItem {
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  constraintsText?: string;
  tags?: string[];
  starterCode?: Record<string, string>;
  examples?: Array<{
    position: number;
    input: string;
    expectedOutput: string;
    explanation?: string;
  }>;
}

const rawCatalog = catalogJson as RawProblemItem[];

// Pre-transformed map for instant O(1) slug lookup
const problemsMap = new Map<string, ProblemDetail>();
const allSlugs: string[] = [];

for (const item of rawCatalog) {
  const problem: ProblemDetail = {
    id: `prob-${item.slug}`,
    slug: item.slug,
    title: item.title,
    description: item.description,
    difficulty: (item.difficulty as "EASY" | "MEDIUM" | "HARD") || "EASY",
    constraintsText: item.constraintsText || "",
    starterCode: item.starterCode || {},
    examples: item.examples || [],
    tags: (item.tags || []).map((t) => ({
      id: `tag-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: t,
      slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    })),
    acceptanceRate: "72%",
  };
  problemsMap.set(item.slug, problem);
  allSlugs.push(item.slug);
}

/**
 * Returns complete problem details from local bundled catalog in 0ms synchronously.
 */
export function getLocalProblemDetail(slug: string): ProblemDetail | null {
  if (!slug) return null;
  return problemsMap.get(slug) || null;
}

/**
 * Returns all canonical problem slugs for Next.js static page generation.
 */
export function getAllProblemSlugs(): string[] {
  return allSlugs;
}
