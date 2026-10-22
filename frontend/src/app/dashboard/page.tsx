"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import {
  Code2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Requirement 1: Developer dashboard comes after login only
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-slate-500">Checking authentication...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-600/10 via-surface to-surface border border-brand-500/20">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>Developer Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Logged in as <span className="font-mono text-foreground">{user.email}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/problems"
              className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm shadow-sm transition flex items-center space-x-2"
            >
              <span>Practice Problems</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <span>Total Solved</span>
              <Award className="h-4 w-4 text-brand-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-foreground">0</span>
              <span className="text-xs text-slate-500">/ 6 practice problems</span>
            </div>
            <div className="mt-3 w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-brand-500 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm">
            <div className="flex items-center justify-between text-xs text-emerald-500 font-semibold uppercase tracking-wider">
              <span>Easy</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-emerald-500">0</span>
              <span className="text-xs text-slate-500">/ 4 easy</span>
            </div>
            <div className="mt-3 w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm">
            <div className="flex items-center justify-between text-xs text-amber-500 font-semibold uppercase tracking-wider">
              <span>Medium</span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-amber-500">0</span>
              <span className="text-xs text-slate-500">/ 1 medium</span>
            </div>
            <div className="mt-3 w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm">
            <div className="flex items-center justify-between text-xs text-rose-500 font-semibold uppercase tracking-wider">
              <span>Hard</span>
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-rose-500">0</span>
              <span className="text-xs text-slate-500">/ 1 hard</span>
            </div>
            <div className="mt-3 w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-rose-500 h-1.5 rounded-full w-[0%]" />
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Explore Algorithmic Katas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse popular coding problems inspired by LeetCode and HackerRank with real multi-language execution in Java, Python, C++, and JavaScript.
            </p>
            <div className="pt-2">
              <Link
                href="/problems"
                className="text-sm font-semibold text-brand-500 hover:text-brand-400 inline-flex items-center space-x-1"
              >
                <span>Browse Problem Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Interview Preparation Tracks</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Follow curated tracks like the Blind 75 and Big Tech 150 roadmaps designed specifically for technical interview readiness.
            </p>
            <div className="pt-2">
              <Link
                href="/interview-prep"
                className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 inline-flex items-center space-x-1"
              >
                <span>View Interview Roadmaps</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
