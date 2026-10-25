"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
  Code2,
  BookOpen,
  Award,
  Layers,
  Compass,
  Search,
  Filter,
  Building2,
  Check,
  TrendingUp,
  Cpu,
} from "lucide-react";

import { INITIAL_PROBLEMS, ProblemSummary } from "@/lib/problems-catalog";

interface PatternCategory {
  id: string;
  category: string;
  description: string;
  slugs: string[];
}

const BLIND_75_CATEGORIES: PatternCategory[] = [
  {
    id: "arrays-and-hashing",
    category: "Arrays & Hashing",
    description: "Frequency counting, hash maps, prefix products, and duplicate detection.",
    slugs: [
      "two-sum",
      "contains-duplicate",
      "valid-anagram",
      "group-anagrams",
      "top-k-frequent-elements",
      "product-of-array-except-self",
      "longest-consecutive-sequence",
      "encode-and-decode-strings",
      "subarray-sum-equals-k",
    ],
  },
  {
    id: "two-pointers",
    category: "Two Pointers",
    description: "Opposite and same-direction pointer manipulation, palindromes, and container area maximization.",
    slugs: [
      "valid-palindrome",
      "3sum",
      "container-with-most-water",
      "trapping-rain-water",
    ],
  },
  {
    id: "sliding-window",
    category: "Sliding Window",
    description: "Dynamic and fixed-length window expansions over continuous subarrays and substrings.",
    slugs: [
      "best-time-to-buy-and-sell-stock",
      "longest-substring-without-repeating-characters",
      "longest-repeating-character-replacement",
      "minimum-window-substring",
    ],
  },
  {
    id: "stack",
    category: "Stack",
    description: "LIFO ordering, balanced parentheses validation, and monotonic stacks.",
    slugs: ["valid-parentheses"],
  },
  {
    id: "binary-search",
    category: "Binary Search",
    description: "Logarithmic search boundaries, inflection point discovery, and median partitions.",
    slugs: [
      "find-minimum-in-rotated-sorted-array",
      "search-in-rotated-sorted-array",
      "median-of-two-sorted-arrays",
    ],
  },
  {
    id: "linked-list",
    category: "Linked List",
    description: "Node traversals, fast & slow pointer cycle detection, in-place list reversal, and multi-way list merges.",
    slugs: [
      "reverse-linked-list",
      "linked-list-cycle",
      "merge-two-sorted-lists",
      "remove-nth-node-from-end-of-list",
      "reorder-list",
      "lru-cache",
      "merge-k-sorted-lists",
    ],
  },
  {
    id: "trees",
    category: "Trees & Binary Search Trees",
    description: "DFS/BFS traversals, subtree isomorphism, BST validation, LCA, and tree reconstruction.",
    slugs: [
      "invert-binary-tree",
      "maximum-depth-of-binary-tree",
      "same-tree",
      "subtree-of-another-tree",
      "lowest-common-ancestor-of-a-binary-tree",
      "binary-tree-level-order-traversal",
      "validate-binary-search-tree",
      "kth-smallest-element-in-a-bst",
      "construct-binary-tree-from-preorder-and-inorder-traversal",
      "binary-tree-maximum-path-sum",
    ],
  },
  {
    id: "tries",
    category: "Tries (Prefix Trees)",
    description: "Prefix tree data structure, autocomplete dictionary, and wildcard matching.",
    slugs: [
      "implement-trie-prefix-tree",
      "design-add-and-search-words-data-structure",
      "word-search-ii",
    ],
  },
  {
    id: "heap",
    category: "Heap & Priority Queue",
    description: "Min/max heap priority queues, streaming median calculation, and k-largest selection.",
    slugs: [
      "kth-largest-element-in-an-array",
      "find-median-from-data-stream",
    ],
  },
  {
    id: "backtracking-matrix",
    category: "Backtracking & Matrix",
    description: "Recursive branch exploration, constraint satisfaction, and grid spiral transformations.",
    slugs: [
      "combination-sum",
      "word-search",
      "set-matrix-zeroes",
      "spiral-matrix",
      "rotate-image",
    ],
  },
  {
    id: "graphs",
    category: "Graphs",
    description: "Breadth-first / depth-first search, connected components, cycle detection, and topological sorting.",
    slugs: [
      "number-of-islands",
      "clone-graph",
      "pacific-atlantic-water-flow",
      "course-schedule",
      "graph-valid-tree",
      "number-of-connected-components-in-an-undirected-graph",
      "alien-dictionary",
    ],
  },
  {
    id: "1d-dynamic-programming",
    category: "1-D Dynamic Programming",
    description: "Optimal substructures, state transition recurrence relations, memoization, and bottom-up DP.",
    slugs: [
      "climbing-stairs",
      "house-robber",
      "house-robber-ii",
      "longest-palindromic-substring",
      "palindromic-substrings",
      "decode-ways",
      "coin-change",
      "maximum-product-subarray",
      "word-break",
      "longest-increasing-subsequence",
    ],
  },
  {
    id: "2d-dynamic-programming-intervals",
    category: "2-D Dynamic Programming & Intervals",
    description: "Grid paths, longest common subsequences, overlapping interval consolidation, and scheduling.",
    slugs: [
      "unique-paths",
      "longest-common-subsequence",
      "meeting-rooms",
      "meeting-rooms-ii",
      "insert-interval",
      "merge-intervals",
      "non-overlapping-intervals",
    ],
  },
  {
    id: "bit-manipulation-greedy",
    category: "Bit Manipulation & Greedy",
    description: "Binary bit manipulation, hamming weights, XOR single number, and greedy choice properties.",
    slugs: [
      "number-of-1-bits",
      "counting-bits",
      "missing-number",
      "reverse-bits",
      "sum-of-two-integers",
      "maximum-subarray",
      "jump-game",
    ],
  },
];

const DIFFICULTY_STYLES = {
  EASY: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
  HARD: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
};

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<"blind75" | "top150" | "companies">("blind75");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Map slugs to ProblemSummary from INITIAL_PROBLEMS
  const problemMap = useMemo(() => {
    const map = new Map<string, ProblemSummary>();
    for (const prob of INITIAL_PROBLEMS) {
      map.set(prob.slug, prob);
    }
    return map;
  }, []);

  // Filtered categories and problems
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return BLIND_75_CATEGORIES.map((cat) => {
      // If user selected a specific category, filter others out
      if (selectedCategory !== "ALL" && cat.id !== selectedCategory) {
        return { ...cat, problems: [] };
      }

      const matchingProblems = cat.slugs
        .map((slug) => problemMap.get(slug))
        .filter((prob): prob is ProblemSummary => {
          if (!prob) return false;

          // Difficulty filter
          if (selectedDifficulty !== "ALL" && prob.difficulty !== selectedDifficulty) {
            return false;
          }

          // Search query
          if (query) {
            const matchesTitle = prob.title.toLowerCase().includes(query);
            const matchesCategory = cat.category.toLowerCase().includes(query);
            const matchesTags = prob.tags.some((t) => t.name.toLowerCase().includes(query));
            if (!matchesTitle && !matchesCategory && !matchesTags) {
              return false;
            }
          }

          return true;
        });

      return {
        ...cat,
        problems: matchingProblems,
      };
    }).filter((cat) => cat.problems.length > 0);
  }, [problemMap, searchQuery, selectedDifficulty, selectedCategory]);

  const totalVisibleProblems = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.problems.length, 0);
  }, [filteredCategories]);

  // Overall catalog counts
  const totalBlind75Count = BLIND_75_CATEGORIES.reduce((acc, c) => acc + c.slugs.length, 0);
  const easyCount = BLIND_75_CATEGORIES.flatMap((c) => c.slugs)
    .map((s) => problemMap.get(s))
    .filter((p) => p?.difficulty === "EASY").length;
  const mediumCount = BLIND_75_CATEGORIES.flatMap((c) => c.slugs)
    .map((s) => problemMap.get(s))
    .filter((p) => p?.difficulty === "MEDIUM").length;
  const hardCount = BLIND_75_CATEGORIES.flatMap((c) => c.slugs)
    .map((s) => problemMap.get(s))
    .filter((p) => p?.difficulty === "HARD").length;

  const companyTracks = [
    {
      name: "Google SDE Interview Track",
      slug: "google",
      description: "Focus on graphs, dynamic programming, sliding windows, and deep algorithmic optimization.",
      problemsCount: "28+ Curated SDE-1 Challenges",
      accent: "border-blue-500/30 bg-blue-500/5",
    },
    {
      name: "Meta (Facebook) Track",
      slug: "meta",
      description: "Emphasis on array manipulation, two pointers, binary trees, and rapid coding speed.",
      problemsCount: "24+ Curated SDE-1 Challenges",
      accent: "border-indigo-500/30 bg-indigo-500/5",
    },
    {
      name: "Amazon SDE Track",
      slug: "amazon",
      description: "High priority on priority queues, hash tables, linked lists, and leadership principle alignment.",
      problemsCount: "34+ Curated SDE-1 Challenges",
      accent: "border-amber-500/30 bg-amber-500/5",
    },
    {
      name: "Microsoft Track",
      slug: "microsoft",
      description: "Practical algorithmic puzzles, trees, string parsing, and clean modular code.",
      problemsCount: "22+ Curated SDE-1 Challenges",
      accent: "border-sky-500/30 bg-sky-500/5",
    },
    {
      name: "Apple Track",
      slug: "apple",
      description: "Array indexing, low-level data structure optimization, and bit manipulation.",
      problemsCount: "18+ Curated SDE-1 Challenges",
      accent: "border-slate-500/30 bg-slate-500/5",
    },
    {
      name: "Uber Track",
      slug: "uber",
      description: "Graph shortest paths, Trie prefix matching, and high-concurrency interview questions.",
      problemsCount: "16+ Curated SDE-1 Challenges",
      accent: "border-zinc-500/30 bg-zinc-500/5",
    },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Header Hero */}
        <div className="relative overflow-hidden p-8 rounded-2xl bg-gradient-to-r from-brand-600/15 via-surface to-surface border border-brand-500/30 shadow-lg">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-500">
              <GraduationCap className="h-4 w-4" />
              <span>Interview Readiness Tracks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Master Technical Coding Interviews
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              Curated roadmaps and problem sets categorized by algorithmic patterns. Solve the most frequently asked interview problems in Java, Python, C++, and JavaScript.
            </p>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-surface-border space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("blind75")}
            className={`pb-3.5 border-b-2 transition flex items-center space-x-2 ${
              activeTab === "blind75"
                ? "border-brand-500 text-brand-500 font-bold"
                : "border-transparent text-slate-500 hover:text-foreground"
            }`}
          >
            <Flame className="h-4 w-4" />
            <span>Blind 75 Essentials ({totalBlind75Count})</span>
          </button>

          <button
            onClick={() => setActiveTab("top150")}
            className={`pb-3.5 border-b-2 transition flex items-center space-x-2 ${
              activeTab === "top150"
                ? "border-brand-500 text-brand-500 font-bold"
                : "border-transparent text-slate-500 hover:text-foreground"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Top Interview 150</span>
          </button>

          <button
            onClick={() => setActiveTab("companies")}
            className={`pb-3.5 border-b-2 transition flex items-center space-x-2 ${
              activeTab === "companies"
                ? "border-brand-500 text-brand-500 font-bold"
                : "border-transparent text-slate-500 hover:text-foreground"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Big Tech Company Tracks</span>
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === "blind75" && (
          <div className="space-y-6">
            {/* Header & Stats Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Blind 75 Pattern Roadmap
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    Complete Collection
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  The definitive collection of {totalBlind75Count} algorithmic questions covering all 14 high-yield patterns asked by FAANG & Tier-1 companies.
                </p>
              </div>

              {/* Progress / Stat Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-medium">
                  <span className="text-slate-400 mr-1.5">Total:</span>
                  <span className="font-bold text-foreground">{totalBlind75Count}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <span className="opacity-75 mr-1">Easy:</span>
                  <span>{easyCount}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <span className="opacity-75 mr-1">Medium:</span>
                  <span>{mediumCount}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  <span className="opacity-75 mr-1">Hard:</span>
                  <span>{hardCount}</span>
                </div>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search problem title or pattern..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-subtle border border-surface-border text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                  />
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center space-x-1.5 self-start md:self-auto">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Difficulty:</span>
                  {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                        selectedDifficulty === diff
                          ? "bg-brand-600 text-white font-semibold shadow-xs"
                          : "bg-surface-subtle text-slate-600 dark:text-slate-300 hover:bg-surface-muted"
                      }`}
                    >
                      {diff.charAt(0) + diff.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pattern Category Quick Selectors */}
              <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-surface-border pb-1 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Layers className="h-3.5 w-3.5 text-brand-500" /> Patterns:
                </span>
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition ${
                    selectedCategory === "ALL"
                      ? "bg-brand-600 text-white font-semibold shadow-xs"
                      : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-muted"
                  }`}
                >
                  All ({totalBlind75Count})
                </button>
                {BLIND_75_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.id ? "ALL" : cat.id)
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition flex items-center gap-1 border ${
                      selectedCategory === cat.id
                        ? "bg-brand-600 text-white border-brand-600 font-semibold shadow-xs"
                        : "bg-surface-subtle text-slate-600 dark:text-slate-400 border-surface-border hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat.category}</span>
                    <span className="opacity-75 text-[10px]">({cat.slugs.length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count Banner if filter active */}
            {(searchQuery || selectedDifficulty !== "ALL" || selectedCategory !== "ALL") && (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing <strong className="text-foreground">{totalVisibleProblems}</strong> of{" "}
                  <strong>{totalBlind75Count}</strong> challenges
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDifficulty("ALL");
                    setSelectedCategory("ALL");
                  }}
                  className="text-brand-500 hover:underline font-medium"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Categorized Problem Accordion Cards */}
            {filteredCategories.length === 0 ? (
              <div className="p-16 text-center rounded-xl bg-surface border border-surface-border space-y-3">
                <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
                <h3 className="text-base font-semibold text-foreground">No problems found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No challenges match your search query or selected difficulty filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDifficulty("ALL");
                    setSelectedCategory("ALL");
                  }}
                  className="mt-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredCategories.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-xl bg-surface border border-surface-border overflow-hidden shadow-sm"
                  >
                    <div className="px-5 py-4 bg-surface-subtle border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-base text-foreground">
                            {group.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold font-mono">
                            {group.problems.length} problems
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {group.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto text-xs text-slate-400">
                        <span>
                          {group.problems.filter((p) => p.difficulty === "EASY").length} Easy •{" "}
                          {group.problems.filter((p) => p.difficulty === "MEDIUM").length} Med •{" "}
                          {group.problems.filter((p) => p.difficulty === "HARD").length} Hard
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-surface-border">
                      {group.problems.map((prob) => {
                        const isSde1 = prob.tags.some((t) => t.slug === "sde-1");
                        return (
                          <div
                            key={prob.slug}
                            className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-subtle/50 transition group"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <Circle className="h-4 w-4 text-slate-400 group-hover:text-brand-500 shrink-0 transition" />
                              <div className="flex items-center space-x-2 min-w-0">
                                <Link
                                  href={`/problems/${prob.slug}`}
                                  className="text-sm font-semibold text-foreground hover:text-brand-500 transition truncate"
                                >
                                  {prob.title}
                                </Link>
                                {isSde1 && (
                                  <span className="hidden md:inline px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                    SDE-1
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pl-7 sm:pl-0">
                              <span className="text-xs text-slate-500 font-mono hidden lg:inline">
                                Acceptance:{" "}
                                <span className="font-semibold text-foreground">
                                  {prob.acceptanceRate}
                                </span>
                              </span>
                              <span
                                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${
                                  DIFFICULTY_STYLES[prob.difficulty]
                                }`}
                              >
                                {prob.difficulty}
                              </span>
                              <Link
                                href={`/problems/${prob.slug}`}
                                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1 transition"
                              >
                                <span>Solve</span>
                                <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top Interview 150 Tab */}
        {activeTab === "top150" && (
          <div className="space-y-6">
            <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center space-y-4">
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto">
                <Compass className="h-6 w-6" />
              </div>
              <div className="max-w-xl mx-auto space-y-2">
                <h3 className="text-xl font-bold text-foreground">Top Interview 150 Track</h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Extends beyond foundational patterns into senior engineering concepts: LRU/LFU cache implementations, monotonic stacks, union-find graphs, 2-D dynamic programming, and streaming medians.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  href="/problems?tag=sde-1"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition shadow-sm"
                >
                  <span>Practice SDE-1 Core Sheet (79 Challenges)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/companies"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-surface border border-surface-border hover:border-amber-500 text-foreground text-xs font-semibold transition"
                >
                  <Building2 className="h-4 w-4 text-amber-500" />
                  <span>Explore Company-Specific Tracks</span>
                </Link>
              </div>
            </div>

            {/* Pattern Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-2">
                <div className="flex items-center space-x-2 text-brand-500 font-bold text-sm">
                  <Layers className="h-4 w-4" />
                  <span>Advanced Graphs & TopoSort</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Master Alien Dictionary, Course Schedule cycle detection, and Connected Components across undirected graphs.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-2">
                <div className="flex items-center space-x-2 text-amber-500 font-bold text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>2D DP & Subsequence Match</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Tackle Longest Common Subsequence, Unique Paths, and multi-stage stock profit maximization.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-surface border border-surface-border space-y-2">
                <div className="flex items-center space-x-2 text-emerald-500 font-bold text-sm">
                  <Cpu className="h-4 w-4" />
                  <span>System Data Structures</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Build custom LRU Caches with Doubly Linked Lists and Find Median from dynamic data streams with dual heaps.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Company Tracks Tab */}
        {activeTab === "companies" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Big Tech Company Roadmaps</h2>
                <p className="text-xs text-slate-500">
                  Targeted question sets asked in actual Online Assessments, Phone Screens, and Onsite rounds.
                </p>
              </div>
              <Link
                href="/companies"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
              >
                <span>View All 8 Companies</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companyTracks.map((trk, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border ${trk.accent} flex flex-col justify-between space-y-4`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-surface text-foreground border border-surface-border text-xs font-mono font-semibold">
                        {trk.problemsCount}
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                        PRO
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{trk.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {trk.description}
                    </p>
                  </div>
                  <Link
                    href={`/companies?company=${trk.slug}`}
                    className="w-full py-2 px-3 rounded-lg bg-surface border border-surface-border hover:border-amber-500 hover:text-amber-500 text-foreground text-xs font-bold text-center block transition shadow-xs"
                  >
                    Explore {trk.name} &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interview Strategy Tips */}
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" />
            Tips for Technical Coding Interviews
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
              <span className="font-bold text-foreground block">1. Clarify Requirements</span>
              <p>
                Always state your assumptions, ask about nulls, empty inputs, and value ranges before writing code.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
              <span className="font-bold text-foreground block">2. Analyze Time & Space</span>
              <p>
                State the brute-force complexity first, then optimize using hash tables, two pointers, or binary search.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
              <span className="font-bold text-foreground block">3. Dry Run with Edge Cases</span>
              <p>
                Trace your solution manually with sample inputs, 0-element inputs, and negative numbers before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
