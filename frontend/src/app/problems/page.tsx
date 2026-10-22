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
} from "lucide-react";

interface TagDto {
  id: string;
  name: string;
  slug: string;
}

interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: TagDto[];
  acceptanceRate: string;
}

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

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch Tags
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await apiClient<ApiResponse<TagDto[]>>("/api/v1/tags");
        if (res && res.data) {
          setTags(res.data);
        }
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    }
    fetchTags();
  }, []);

  // Fetch Problems
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);

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
        `/api/v1/problems?${params.toString()}`
      );

      if (res && res.data) {
        setProblems(res.data.content || []);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err: any) {
      setError("Unable to load problem catalog. Please ensure the backend is running.");
    } finally {
      setLoading(false);
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
            <div className="text-xs text-slate-500 font-mono hidden sm:block">
              <span className="font-bold text-foreground">{problems.length}</span> of{" "}
              <span className="font-bold text-foreground">{totalElements}</span> challenges
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                placeholder="Search problem title..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-subtle border border-surface-border text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {/* Difficulty Filter Buttons */}
            <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    selectedDifficulty === diff
                      ? "bg-brand-600 text-white shadow-sm"
                      : "bg-surface-subtle hover:bg-surface-muted text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {diff.charAt(0) + diff.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Tag Filter Pills */}
          {tags.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-surface-border pb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <TagIcon className="h-3 w-3" /> Topics:
              </span>
              <button
                onClick={() => {
                  setSelectedTag("");
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
              {tags.map((t) => (
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
        {loading ? (
          <div className="p-16 text-center rounded-xl bg-surface border border-surface-border space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-sm text-slate-500">Loading catalog from database...</p>
          </div>
        ) : error ? (
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
                    {problem.tags.map((t) => (
                      <span
                        key={t.id}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface-subtle text-slate-600 dark:text-slate-400 border border-surface-border font-mono"
                      >
                        {t.name}
                      </span>
                    ))}
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
