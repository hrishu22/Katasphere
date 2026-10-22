"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<"blind75" | "top150" | "companies">("blind75");

  const blind75Categories = [
    {
      category: "Arrays & Hashing",
      problems: [
        { title: "Two Sum", slug: "two-sum", difficulty: "EASY", diffColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
        { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "EASY", diffColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
      ],
    },
    {
      category: "Two Pointers & Sliding Window",
      problems: [
        { title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "EASY", diffColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
        { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "MEDIUM", diffColor: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
      ],
    },
    {
      category: "Stacks & Queues",
      problems: [
        { title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "EASY", diffColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
      ],
    },
    {
      category: "Binary Search & Advanced",
      problems: [
        { title: "Median of Two Sorted Arrays", slug: "median-of-two-sorted-arrays", difficulty: "HARD", diffColor: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
      ],
    },
  ];

  const companyTracks = [
    {
      name: "Google Interview Track",
      description: "Focus on graphs, dynamic programming, sliding windows, and deep algorithmic optimization.",
      problemsCount: "45 Challenges",
      accent: "border-blue-500/30 bg-blue-500/5",
    },
    {
      name: "Meta (Facebook) Track",
      description: "Emphasis on array manipulation, two pointers, binary trees, and rapid coding speed.",
      problemsCount: "40 Challenges",
      accent: "border-indigo-500/30 bg-indigo-500/5",
    },
    {
      name: "Amazon Interview Track",
      description: "High priority on priority queues, hash tables, linked lists, and leadership principle alignment.",
      problemsCount: "50 Challenges",
      accent: "border-amber-500/30 bg-amber-500/5",
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
            <span>Blind 75 Essentials</span>
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Blind 75 Pattern Roadmap</h2>
                <p className="text-xs text-slate-500">
                  The definitive collection of algorithmic questions covering all high-yield patterns.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {blind75Categories.map((group, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-surface border border-surface-border overflow-hidden shadow-sm"
                >
                  <div className="px-5 py-3.5 bg-surface-subtle border-b border-surface-border flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{group.category}</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {group.problems.length} problems
                    </span>
                  </div>

                  <div className="divide-y divide-surface-border">
                    {group.problems.map((prob) => (
                      <div
                        key={prob.slug}
                        className="px-5 py-3.5 flex items-center justify-between hover:bg-surface-subtle/50 transition"
                      >
                        <div className="flex items-center space-x-3">
                          <Circle className="h-4 w-4 text-slate-400" />
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="text-sm font-semibold text-foreground hover:text-brand-500 transition"
                          >
                            {prob.title}
                          </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${prob.diffColor}`}
                          >
                            {prob.difficulty}
                          </span>
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm flex items-center space-x-1"
                          >
                            <span>Solve</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "top150" && (
          <div className="p-8 rounded-2xl bg-surface border border-surface-border text-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto">
              <Compass className="h-6 w-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-foreground">Top 150 Comprehensive Track</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Covers advanced dynamic programming, graph traversals (BFS/DFS), union-find, and monotonic queues.
              </p>
            </div>
            <Link
              href="/problems"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition"
            >
              <span>Explore All Catalog Problems</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {activeTab === "companies" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companyTracks.map((trk, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${trk.accent} flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-surface text-foreground border border-surface-border text-xs font-mono font-semibold">
                    {trk.problemsCount}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{trk.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {trk.description}
                  </p>
                </div>
                <Link
                  href="/problems"
                  className="w-full py-2 px-3 rounded-lg bg-surface border border-surface-border hover:border-brand-500 text-foreground text-xs font-semibold text-center block transition"
                >
                  Start Track
                </Link>
              </div>
            ))}
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
              <p>Always state your assumptions, ask about nulls, empty inputs, and value ranges before writing code.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
              <span className="font-bold text-foreground block">2. Analyze Time & Space</span>
              <p>State the brute-force complexity first, then optimize using hash tables, two pointers, or binary search.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
              <span className="font-bold text-foreground block">3. Dry Run with Edge Cases</span>
              <p>Trace your solution manually with sample inputs, 0-element inputs, and negative numbers before submitting.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
