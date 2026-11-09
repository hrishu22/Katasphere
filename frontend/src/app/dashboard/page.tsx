"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { CollegeAdminDashboardView } from "@/components/college/CollegeAdminDashboardView";
import { getStudentExamDashboard } from "@/lib/contest-api";
import { StudentExamDashboardDto, ExamSummaryDto } from "@/types/contest";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import {
  Code2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  AlertTriangle,
  Activity,
  Flame,
  Check,
  Trophy,
  Building2,
  Calendar,
} from "lucide-react";

interface SubmissionSummary {
  id: string;
  problemSlug: string;
  problemTitle: string;
  problemDifficulty?: string;
  language: string;
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  executionTimeMs?: number;
  memoryKb?: number;
  errorMessage?: string;
  createdAt: string;
}

interface UserDashboardData {
  totalSolved: number;
  totalProblems: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  acceptanceRate: number;
  recentSubmissions: SubmissionSummary[];
  solvedProblemSlugs: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function formatSubmissionDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function formatLanguageName(lang: string): string {
  switch (lang?.toUpperCase()) {
    case "JAVA":
      return "Java 21";
    case "PYTHON":
      return "Python 3";
    case "CPP":
      return "C++ 20";
    case "JAVASCRIPT":
      return "JavaScript";
    default:
      return lang || "Code";
  }
}

function renderVerdictBadge(verdict: string) {
  const v = verdict?.toUpperCase() || "";
  if (v === "ACCEPTED") {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Accepted</span>
      </span>
    );
  }
  if (v === "WRONG_ANSWER") {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
        <XCircle className="h-3.5 w-3.5" />
        <span>Wrong Answer</span>
      </span>
    );
  }
  if (v.includes("TIME_LIMIT") || v === "TLE") {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Clock className="h-3.5 w-3.5" />
        <span>Time Limit Exceeded</span>
      </span>
    );
  }
  if (v.includes("COMPILE") || v === "COMPILATION_ERROR") {
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>Compile Error</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-surface-border">
      <AlertTriangle className="h-3.5 w-3.5" />
      <span>{verdict || "Executed"}</span>
    </span>
  );
}

function renderDifficultyBadge(difficulty?: string) {
  const d = difficulty?.toUpperCase() || "EASY";
  if (d === "EASY") {
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        Easy
      </span>
    );
  }
  if (d === "MEDIUM") {
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        Medium
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
      Hard
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isStudentMode } = useAuth();

  const [dashboard, setDashboard] = useState<UserDashboardData | null>(null);
  const [studentExamDash, setStudentExamDash] = useState<StudentExamDashboardDto | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isCollegeAdmin = Boolean(
    user && (user.isCollegeAdmin || user.role === "COLLEGE_ADMIN")
  );

  // Requirement: Developer dashboard comes after login only
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [user, isLoading, router]);

  // Fetch real-time dashboard data (Student Mode vs Normal User Mode)
  useEffect(() => {
    if (!user || isCollegeAdmin) return;

    let isMounted = true;
    async function fetchDashboard() {
      try {
        setLoadingDashboard(true);
        if (isStudentMode) {
          const sDash = await getStudentExamDashboard();
          if (isMounted) {
            setStudentExamDash(sDash);
            setError(null);
          }
        } else {
          const res = await apiClient<ApiResponse<UserDashboardData>>(
            "/api/v1/users/me/dashboard",
            { timeoutMs: 15000 }
          );
          if (isMounted && res && res.data) {
            setDashboard(res.data);
            setError(null);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Failed to load dashboard:", err);
          setError(err?.message || "Failed to load dashboard progress.");
        }
      } finally {
        if (isMounted) {
          setLoadingDashboard(false);
        }
      }
    }

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [user, isCollegeAdmin, isStudentMode]);

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

  // Dedicated College Admin Dashboard specific to this admin's institution only
  if (isCollegeAdmin) {
    return (
      <AppShell>
        <CollegeAdminDashboardView />
      </AppShell>
    );
  }

  // Dedicated Student Dashboard when Student Toggle is ON
  if (isStudentMode) {
    const col = studentExamDash?.college;
    const liveAndUpcoming: ExamSummaryDto[] = [
      ...(studentExamDash?.active || []),
      ...(studentExamDash?.upcoming || []),
    ];
    const pastExams: ExamSummaryDto[] = studentExamDash?.past || [];

    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
          {/* Student Header Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600/15 via-brand-600/10 to-surface border border-emerald-500/30 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Student Mode Active</span>
                </span>
                {col?.collegeCode && (
                  <span className="px-2.5 py-1 rounded-full bg-surface border border-surface-border font-mono text-xs font-extrabold text-brand-400">
                    College ID: {col.collegeCode}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {col?.name || "Student"} — Candidate Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Student: <strong className="text-foreground">{user.name}</strong>
                {user.collegeRollNumber ? (
                  <>
                    {" "}• Roll No / ID:{" "}
                    <strong className="font-mono text-foreground">{user.collegeRollNumber}</strong>
                  </>
                ) : null}
                {user.tenureEndYear ? (
                  <>
                    {" "}• Tenure:{" "}
                    <strong className="text-foreground">
                      {user.tenureStartYear ? `${user.tenureStartYear}–` : ""}
                      {user.tenureEndYear}
                    </strong>
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/contests"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition shadow-lg shadow-brand-600/25"
              >
                <Trophy className="h-4 w-4" />
                <span>Open School Contests</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 3 Student KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>School Contests Attempted</span>
                <BookOpen className="h-4 w-4 text-brand-400" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-foreground">
                {studentExamDash?.examsAttempted ?? 0}
              </div>
              <span className="text-[11px] text-slate-500">
                {studentExamDash?.active.length ?? 0} live • {studentExamDash?.upcoming.length ?? 0} upcoming
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Best Contest Rank</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-amber-400">
                {studentExamDash?.bestRank ? `#${studentExamDash.bestRank}` : "—"}
              </div>
              <span className="text-[11px] text-slate-500">In completed college contests</span>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Average Score</span>
                <Award className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-3xl font-extrabold text-emerald-400">
                {studentExamDash?.averageScorePercent ?? 0}%
              </div>
              <span className="text-[11px] text-slate-500">Across graded college assessments</span>
            </div>
          </div>

          {/* Live & Upcoming School Examinations */}
          <div className="rounded-3xl bg-surface border border-surface-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-foreground">
                  Live &amp; Upcoming School Contests ({liveAndUpcoming.length})
                </h2>
                <p className="text-xs text-slate-400">
                  Examinations scheduled by your {col?.name || "college"} Admin.
                </p>
              </div>
              <Link href="/contests" className="text-xs font-bold text-brand-400 hover:underline">
                View All →
              </Link>
            </div>

            {loadingDashboard ? (
              <div className="py-10 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              </div>
            ) : liveAndUpcoming.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No live or upcoming school contests at the moment.
              </div>
            ) : (
              <div className="space-y-3">
                {liveAndUpcoming.map((exam) => (
                  <div
                    key={exam.contestId}
                    className="p-4 rounded-2xl bg-background border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            exam.status === "ACTIVE"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {exam.status}
                        </span>
                        <span className="text-xs text-slate-400">{exam.collegeName}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{exam.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Duration: {exam.durationMinutes} mins • {exam.totalProblems} problems ({exam.maxScore} pts)
                      </p>
                    </div>
                    <Link
                      href={`/contests/${exam.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition self-start sm:self-auto"
                    >
                      <span>{exam.status === "ACTIVE" ? "Enter Exam" : "Waiting Room"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Results & Ranks */}
          <div className="rounded-3xl bg-surface border border-surface-border p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground">
              Past School Contests &amp; My Ranks ({pastExams.length})
            </h2>
            {pastExams.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No concluded school contests yet.
              </div>
            ) : (
              <div className="space-y-3">
                {pastExams.map((exam) => (
                  <div
                    key={exam.contestId}
                    className="p-4 rounded-2xl bg-background border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{exam.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Concluded {new Date(exam.endTime).toLocaleDateString()} • Solved {exam.solvedProblems ?? 0}/
                        {exam.totalProblems} problems
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {exam.rank && (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-extrabold">
                          Rank #{exam.rank} / {exam.totalParticipants || 1}
                        </span>
                      )}
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-extrabold">
                        {exam.score ?? 0} / {exam.maxScore} pts
                      </span>
                      <Link
                        href={`/contests/${exam.slug}`}
                        className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-xs font-semibold text-foreground"
                      >
                        Leaderboard
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  const totalSolved = dashboard?.totalSolved ?? 0;
  const totalProblems = dashboard?.totalProblems ?? 79;
  const totalPct = totalProblems > 0 ? Math.min(100, Math.round((totalSolved / totalProblems) * 100)) : 0;

  const easySolved = dashboard?.easySolved ?? 0;
  const totalEasy = dashboard?.totalEasy ?? 19;
  const easyPct = totalEasy > 0 ? Math.min(100, Math.round((easySolved / totalEasy) * 100)) : 0;

  const mediumSolved = dashboard?.mediumSolved ?? 0;
  const totalMedium = dashboard?.totalMedium ?? 52;
  const mediumPct = totalMedium > 0 ? Math.min(100, Math.round((mediumSolved / totalMedium) * 100)) : 0;

  const hardSolved = dashboard?.hardSolved ?? 0;
  const totalHard = dashboard?.totalHard ?? 8;
  const hardPct = totalHard > 0 ? Math.min(100, Math.round((hardSolved / totalHard) * 100)) : 0;

  const totalSubmissions = dashboard?.totalSubmissions ?? 0;
  const acceptanceRate = dashboard?.acceptanceRate ?? 0;
  const recentSubmissions = dashboard?.recentSubmissions ?? [];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-600/10 via-surface to-surface border border-brand-500/20 shadow-sm">
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

        {/* Progress Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Solved */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Solved</span>
                <Award className="h-4 w-4 text-brand-500" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {loadingDashboard ? (
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400 inline" />
                  ) : (
                    totalSolved
                  )}
                </span>
                <span className="text-xs text-slate-500">/ {totalProblems} katas</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Progress</span>
                <span className="font-mono font-medium">{totalPct}%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Easy */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                <span>Easy</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {loadingDashboard ? "..." : easySolved}
                </span>
                <span className="text-xs text-slate-500">/ {totalEasy}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Easy Solved</span>
                <span className="font-mono font-medium">{easyPct}%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${easyPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Medium */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
                <span>Medium</span>
                <span className="h-2 w-2 rounded-full bg-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {loadingDashboard ? "..." : mediumSolved}
                </span>
                <span className="text-xs text-slate-500">/ {totalMedium}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Medium Solved</span>
                <span className="font-mono font-medium">{mediumPct}%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${mediumPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hard */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold uppercase tracking-wider">
                <span>Hard</span>
                <span className="h-2 w-2 rounded-full bg-rose-500" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  {loadingDashboard ? "..." : hardSolved}
                </span>
                <span className="text-xs text-slate-500">/ {totalHard}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>Hard Solved</span>
                <span className="font-mono font-medium">{hardPct}%</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${hardPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Acceptance Rate */}
          <div className="p-5 rounded-xl bg-surface border border-surface-border shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">
                <span>Acceptance Rate</span>
                <Activity className="h-4 w-4 text-sky-500" />
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">
                  {loadingDashboard ? "..." : `${acceptanceRate}%`}
                </span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              <div className="flex justify-between mb-1">
                <span>Total Submissions</span>
                <span className="font-mono font-medium">{totalSubmissions}</span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, acceptanceRate)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions Section */}
        <div className="rounded-2xl bg-surface border border-surface-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-surface-border flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center">
                <Code2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Recent Submissions</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your code submissions across all practice problems
                </p>
              </div>
            </div>

            <Link
              href="/problems"
              className="text-xs font-semibold text-brand-500 hover:text-brand-400 flex items-center space-x-1"
            >
              <span>Solve more katas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loadingDashboard ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="h-7 w-7 animate-spin text-brand-500 mx-auto" />
              <p className="text-xs text-slate-500">Loading your submissions...</p>
            </div>
          ) : recentSubmissions.length === 0 ? (
            <div className="py-16 text-center space-y-3 px-4">
              <div className="h-12 w-12 rounded-full bg-surface-muted mx-auto flex items-center justify-center text-slate-400">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">No submissions yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Once you solve problems and hit <strong>Submit</strong>, your verdicts, runtimes, and memory statistics will appear here.
              </p>
              <div className="pt-2">
                <Link
                  href="/problems"
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition"
                >
                  <span>Browse Problems</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider border-b border-surface-border text-[11px]">
                  <tr>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Problem</th>
                    <th className="py-3 px-5">Language</th>
                    <th className="py-3 px-5">Runtime</th>
                    <th className="py-3 px-5">Memory</th>
                    <th className="py-3 px-5">Submitted</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {recentSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-surface-muted/50 transition-colors"
                    >
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        {renderVerdictBadge(sub.verdict)}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/problems/${sub.problemSlug}`}
                            className="font-bold text-foreground hover:text-brand-500 transition line-clamp-1"
                          >
                            {sub.problemTitle || sub.problemSlug}
                          </Link>
                          {renderDifficultyBadge(sub.problemDifficulty)}
                        </div>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-surface-muted border border-surface-border text-[11px]">
                          {formatLanguageName(sub.language)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {sub.executionTimeMs != null ? `${sub.executionTimeMs} ms` : "—"}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {sub.memoryKb != null
                          ? `${(sub.memoryKb / 1024).toFixed(1)} MB`
                          : "—"}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                        {formatSubmissionDate(sub.createdAt)}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/problems/${sub.problemSlug}`}
                          className="text-xs font-semibold text-brand-500 hover:text-brand-400"
                        >
                          Solve Again &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-surface border border-surface-border space-y-3">
            <div className="h-10 w-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Explore Algorithmic Katas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse popular coding problems inspired by LeetCode and HackerRank with real multi-language execution in Java 21, Python 3, C++ 20, and JavaScript.
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
