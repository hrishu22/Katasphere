"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api-client";
import {
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Circle,
  ArrowRight,
  Loader2,
  AlertCircle,
  Tag as TagIcon,
  Sparkles,
  Building2,
  Crown,
  Target,
} from "lucide-react";

import {
  INITIAL_PROBLEMS,
  INITIAL_TAGS,
  TagDto,
  ProblemSummary,
} from "@/lib/problems-catalog";

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function filterFallbackProblems(
  catalog: ProblemSummary[],
  search: string,
  difficulty: string,
  tag: string
): ProblemSummary[] {
  return catalog.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.tags.some((t) => t.name.toLowerCase().includes(query) || t.slug.toLowerCase().includes(query));

    const matchesDiff =
      difficulty === "ALL" || p.difficulty.toUpperCase() === difficulty.toUpperCase();

    const matchesTag =
      !tag ||
      p.tags.some(
        (t) =>
          t.slug.toLowerCase() === tag.toLowerCase() ||
          t.name.toLowerCase() === tag.toLowerCase()
      );

    return matchesSearch && matchesDiff && matchesTag;
  });
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemSummary[]>(INITIAL_PROBLEMS);
  const [tags, setTags] = useState<TagDto[]>(INITIAL_TAGS);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(INITIAL_PROBLEMS.length);

  // Fetch Tags from Backend
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await apiClient<ApiResponse<TagDto[]>>("/api/v1/tags", { timeoutMs: 7000 });
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          // Merge unique tags
          const existingSlugs = new Set(INITIAL_TAGS.map((t) => t.slug.toLowerCase()));
          const newTags = res.data.filter((t) => !existingSlugs.has(t.slug.toLowerCase()));
          setTags([...INITIAL_TAGS, ...newTags]);
        }
      } catch (err) {
        // Retain initial curated tags
      }
    }
    fetchTags();
  }, []);

  // Fetch Problems from Backend with instant fallback
  const fetchProblems = useCallback(async () => {
    setError(null);
    setIsSyncing(true);

    // Apply immediate client-side filter so UI never waits
    const localFiltered = filterFallbackProblems(
      INITIAL_PROBLEMS,
      search,
      selectedDifficulty,
      selectedTag
    );
    setProblems(localFiltered);
    setTotalElements(localFiltered.length);

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (selectedDifficulty && selectedDifficulty !== "ALL") {
        params.append("difficulty", selectedDifficulty);
      }
      if (selectedTag) params.append("tag", selectedTag);
      params.append("page", page.toString());
      params.append("size", "20");

      const res = await apiClient<ApiResponse<PageResponse<ProblemSummary>>>(
        `/api/v1/problems?${params.toString()}`,
        { timeoutMs: 9000 }
      );

      if (res && res.data && Array.isArray(res.data.content) && res.data.content.length > 0) {
        setProblems(res.data.content);
        setTotalElements(res.data.totalElements || res.data.content.length);
        setIsLiveConnected(true);
      }
    } catch (err: any) {
      console.warn("Live database sync notice (using offline catalog):", err?.message || err);
      setIsLiveConnected(false);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [search, selectedDifficulty, selectedTag, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProblems();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchProblems]);

  const difficultyColors = {
    EASY: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    HARD: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
  };

  const COMPANY_SLUGS = ["amazon", "google", "meta", "microsoft", "apple", "uber", "bloomberg", "netflix"];
  const companyTags = tags.filter((t) => COMPANY_SLUGS.includes(t.slug.toLowerCase()));
  const topicTags = tags.filter(
    (t) => !COMPANY_SLUGS.includes(t.slug.toLowerCase()) && t.slug.toLowerCase() !== "sde-1"
  );

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Practice Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Problem Catalog
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              Sharpen your algorithmic skills with real multi-language execution challenges.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/problems/new"
              className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
            >
              <span>+ Add Challenge</span>
            </Link>
            <div className="flex items-center space-x-2 text-xs">
              {isSyncing ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/25 text-[11px] font-medium animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Syncing database...</span>
                </span>
              ) : isLiveConnected ? (
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 text-[11px] font-medium">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Live DB</span>
                </span>
              ) : null}
              <div className="text-xs text-slate-500 font-mono hidden sm:block">
                <span className="font-bold text-foreground">{problems.length}</span> of{" "}
                <span className="font-bold text-foreground">{totalElements}</span> challenges
              </div>
            </div>
          </div>
        </div>

        {/* Company Interview Hub Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-transparent border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground">
                  Company-Specific Interview Roadmaps & Round Breakdowns
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Practice verified interview questions asked in Google, Amazon, Meta, Microsoft, and Apple rounds (OA, Phone Screen & Onsite DSA).
              </p>
            </div>
          </div>
          <Link
            href="/companies"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shrink-0 transition shadow-sm flex items-center justify-center space-x-2"
          >
            <Crown className="h-3.5 w-3.5" />
            <span>Explore Company Sets</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-4 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search problem title or algorithm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-subtle border border-surface-border text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {/* Quick Filter: SDE-1 Sheet & Difficulty */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedTag(selectedTag === "sde-1" ? "" : "sde-1");
                  setPage(0);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  selectedTag === "sde-1"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-2 ring-amber-500/40"
                    : "bg-surface-subtle hover:bg-surface-muted text-slate-700 dark:text-slate-200 border border-surface-border"
                }`}
              >
                <Target className="h-3.5 w-3.5 text-amber-500" />
                <span>🎯 SDE-1 Core Sheet</span>
                {selectedTag === "sde-1" && (
                  <span className="ml-1 text-[10px] bg-white/25 px-1.5 py-0.2 rounded-full uppercase">
                    Active
                  </span>
                )}
              </button>

              <div className="h-5 w-px bg-surface-border hidden sm:block mx-1" />

              {/* Difficulty Filter Buttons */}
              <div className="flex items-center space-x-1">
                {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      setSelectedDifficulty(diff);
                      setPage(0);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                      selectedDifficulty === diff
                        ? "bg-brand-600 text-white shadow-sm font-semibold"
                        : "bg-surface-subtle hover:bg-surface-muted text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Company Filter Chips */}
          {companyTags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pt-3 border-t border-surface-border pb-1 text-xs">
              <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-brand-500" /> Companies:
              </span>
              <button
                onClick={() => {
                  if (COMPANY_SLUGS.includes(selectedTag.toLowerCase())) setSelectedTag("");
                  setPage(0);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition ${
                  !COMPANY_SLUGS.includes(selectedTag.toLowerCase())
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                    : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-muted"
                }`}
              >
                All
              </button>
              {companyTags.map((t) => {
                const isSelected = selectedTag.toLowerCase() === t.slug.toLowerCase();
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTag(isSelected ? "" : t.slug);
                      setPage(0);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition flex items-center gap-1 ${
                      isSelected
                        ? "bg-brand-600 text-white font-semibold shadow-xs"
                        : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-muted border border-surface-border"
                    }`}
                  >
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Topic Filter Pills */}
          {topicTags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-surface-border pb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <TagIcon className="h-3 w-3" /> Topics:
              </span>
              <button
                onClick={() => {
                  if (!COMPANY_SLUGS.includes(selectedTag.toLowerCase()) && selectedTag !== "sde-1") {
                    setSelectedTag("");
                  }
                  setPage(0);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-mono shrink-0 transition ${
                  selectedTag === ""
                    ? "bg-brand-500 text-white font-medium"
                    : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-muted"
                }`}
              >
                All
              </button>
              {topicTags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTag(t.slug === selectedTag ? "" : t.slug);
                    setPage(0);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono shrink-0 transition ${
                    selectedTag === t.slug
                      ? "bg-brand-500 text-white font-medium"
                      : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-muted"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Problems List */}
        {loading && problems.length === 0 ? (
          <div className="p-16 text-center rounded-xl bg-surface border border-surface-border space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-sm text-slate-500">Loading catalog from database...</p>
          </div>
        ) : error && problems.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 space-y-2">
            <AlertCircle className="h-8 w-8 mx-auto" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : problems.length === 0 ? (
          <div className="p-16 text-center rounded-xl bg-surface border border-surface-border space-y-3">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-foreground">No problems match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or removing the selected difficulty/tag filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedDifficulty("ALL");
                setSelectedTag("");
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="p-4 sm:p-5 rounded-xl bg-surface border border-surface-border hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Circle className="h-4 w-4 text-slate-400 shrink-0" />
                    <Link
                      href={`/problems/${problem.slug}`}
                      className="font-bold text-foreground hover:text-brand-500 text-base transition"
                    >
                      {problem.title}
                    </Link>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold tracking-wide ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pl-7">
                    {problem.tags.map((t) => {
                      const isCompany = COMPANY_SLUGS.includes(t.slug.toLowerCase());
                      const isSde1 = t.slug.toLowerCase() === "sde-1";
                      return (
                        <span
                          key={t.id}
                          className={`text-[11px] px-2 py-0.5 rounded border font-mono ${
                            isSde1
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                              : isCompany
                              ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/30 font-semibold"
                              : "bg-surface-subtle text-slate-600 dark:text-slate-400 border-surface-border"
                          }`}
                        >
                          {t.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-6 shrink-0 pl-7 sm:pl-0">
                  <div className="text-xs text-slate-500 font-mono">
                    Acceptance: <span className="font-semibold text-foreground">{problem.acceptanceRate}</span>
                  </div>
                  <Link
                    href={`/problems/${problem.slug}`}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm flex items-center space-x-1.5"
                  >
                    <span>Solve</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
