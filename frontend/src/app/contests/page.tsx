"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getContests } from "@/lib/contest-api";
import { ContestDto } from "@/types/contest";
import { useAuth } from "@/contexts/AuthContext";
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Building2,
  ArrowRight,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  GraduationCap,
  ExternalLink,
  Loader2,
  Lock,
} from "lucide-react";

export default function ContestsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [contests, setContests] = useState<ContestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING" | "CONCLUDED">("ALL");
  const [quickAccessSlug, setQuickAccessSlug] = useState("");

  const isCollegeAdmin = Boolean(
    user && (user.isCollegeAdmin || user.role === "COLLEGE_ADMIN" || user.role === "ADMIN")
  );
  const hasActiveStudentCollege = Boolean(user && user.collegeId && !user.isTenureExpired);
  const canAccessContests = Boolean(user && (isCollegeAdmin || hasActiveStudentCollege));

  useEffect(() => {
    if (authLoading) return;
    if (!canAccessContests) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await getContests();
        setContests(data);
      } catch (err) {
        console.error("Failed to load contests", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, canAccessContests]);

  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-28">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mx-auto mb-5">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            Sign In Required for College Contests
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Institutional coding examinations are private to verified students and college faculty. Please sign in and link your active college to access your college&apos;s examination portal.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login?redirect=/contests"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 rounded-xl bg-surface border border-surface-border hover:border-brand-500/40 text-foreground text-sm font-semibold transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!canAccessContests) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
            <GraduationCap className="h-7 w-7" />
          </div>
          {user.isTenureExpired ? (
            <>
              <h1 className="text-2xl font-extrabold text-foreground mb-2">
                Candidate Profile Tenure Expired (Batch of {user.tenureEndYear})
              </h1>
              <p className="text-sm text-slate-400 mb-6">
                Candidate profiles and college contests work only during your active college tenure period. Because your graduation year ({user.tenureEndYear}) has passed, you can update your student registration in your Profile if you are currently enrolled in a new program.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition"
              >
                <span>Update Student Registration in Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-foreground mb-2">
                Link Your College to Unlock Contests
              </h1>
              <p className="text-sm text-slate-400 mb-6">
                The Contests portal is exclusively unlocked once a college is registered or linked with your account. Select your college, verify its Unique ID, and enter your tenure year on your Profile.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition"
              >
                <span>Register / Link Your College in Profile</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </AppShell>
    );
  }

  const filteredContests = contests.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedFilter === "ALL") return true;
    return c.status === selectedFilter;
  });

  const activeCount = contests.filter((c) => c.status === "ACTIVE").length;
  const upcomingCount = contests.filter((c) => c.status === "UPCOMING").length;
  const concludedCount = contests.filter((c) => c.status === "CONCLUDED").length;

  const handleQuickEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAccessSlug.trim()) return;
    router.push(`/contests/${encodeURIComponent(quickAccessSlug.trim())}`);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600/15 via-purple-600/10 to-surface border border-brand-500/20 p-8 sm:p-12 mb-10">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-4">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise Multi-Tenant Examination Platform</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Institutional Coding Contests & Exams
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed">
                Conduct secure, high-concurrency coding assessments for university classes (50–100+ students) with
                zero-leakage test grading, server-authoritative timers, and real-time tab proctoring.
              </p>

              {/* Highlights */}
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <span className="flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-lg border border-surface-border">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 100+ Concurrent Workers
                </span>
                <span className="flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-lg border border-surface-border">
                  <Lock className="h-3.5 w-3.5 text-amber-400" /> Zero-Leakage Hidden Cases
                </span>
                <span className="flex items-center gap-1.5 bg-surface/80 px-3 py-1.5 rounded-lg border border-surface-border">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-400" /> Tab-Switch Anti-Cheat
                </span>
              </div>
            </div>

            {/* Quick Access Card */}
            <div className="w-full lg:w-96 bg-surface/90 backdrop-blur-md border border-surface-border rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-foreground font-semibold text-sm mb-2">
                <KeyRound className="h-4 w-4 text-brand-500" />
                <span>Have an Exam Code or Link?</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Enter your university contest slug to join the locked examination waiting room.
              </p>
              <form onSubmit={handleQuickEnter} className="space-y-3">
                <input
                  type="text"
                  placeholder="e.g. iitd-cs201-midsem-2026"
                  value={quickAccessSlug}
                  onChange={(e) => setQuickAccessSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-background border border-surface-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!quickAccessSlug.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium text-sm transition shadow-lg shadow-brand-600/25"
                >
                  <span>Enter Examination Room</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-slate-400">Exam Administrator?</span>
                <Link
                  href={isCollegeAdmin ? "/admin/contests" : "/login?role=admin&redirect=/admin/contests"}
                  className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Faculty Console</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-surface-border w-fit">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedFilter === "ALL"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-foreground"
              }`}
            >
              All Examinations ({contests.length})
            </button>
            <button
              onClick={() => setSelectedFilter("ACTIVE")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedFilter === "ACTIVE"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-foreground"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Now ({activeCount})</span>
            </button>
            <button
              onClick={() => setSelectedFilter("UPCOMING")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedFilter === "UPCOMING"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-foreground"
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setSelectedFilter("CONCLUDED")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedFilter === "CONCLUDED"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-foreground"
              }`}
            >
              Past Contests ({concludedCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search college, title, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface border border-surface-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Contest Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
            <p className="text-sm text-slate-400">Loading scheduled examinations...</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-surface border border-dashed border-surface-border">
            <AlertCircle className="h-10 w-10 text-slate-400 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No examinations found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              No contests match your active filters. If you are a student, verify your examination slug with your course instructor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContests.map((contest) => {
              const startDate = new Date(contest.startTime);
              const endDate = new Date(contest.endTime);

              return (
                <div
                  key={contest.id}
                  className="group flex flex-col justify-between rounded-2xl bg-surface border border-surface-border hover:border-brand-500/40 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div>
                    {/* Status Pill & College Tag */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate font-medium">
                        <Building2 className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                        <span className="truncate">{contest.collegeName}</span>
                      </div>

                      {contest.status === "ACTIVE" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          LIVE
                        </span>
                      )}
                      {contest.status === "UPCOMING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          <Clock className="h-3 w-3" />
                          UPCOMING
                        </span>
                      )}
                      {contest.status === "CONCLUDED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                          <CheckCircle2 className="h-3 w-3" />
                          ENDED
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-foreground group-hover:text-brand-400 transition line-clamp-2">
                      {contest.title}
                    </h3>

                    {/* Description */}
                    {contest.description && (
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {contest.description}
                      </p>
                    )}

                    {/* Exam Metadata */}
                    <div className="mt-5 space-y-2 border-t border-surface-border/70 pt-4 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          Duration:
                        </span>
                        <span className="font-semibold text-foreground">{contest.durationMinutes} minutes</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          Window:
                        </span>
                        <span className="text-foreground">
                          {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                          {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-slate-500" />
                          Problems:
                        </span>
                        <span className="font-semibold text-foreground">{contest.totalProblems} challenges</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          Enrolled:
                        </span>
                        <span className="text-foreground">{contest.totalParticipants} candidates</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      /{contest.slug}
                    </span>

                    <Link
                      href={`/contests/${contest.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition shadow-sm"
                    >
                      <span>{contest.status === "CONCLUDED" ? "View Results" : "Enter Exam"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Educator / Faculty Callout Banner */}
        <div className="mt-16 rounded-3xl bg-surface border border-surface-border p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                College Faculty & Exam Administrators
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Schedule mid-sem exams, pick problems from the Katasphere catalog, set custom points, and monitor live proctoring violations and auto-generated gradebooks in real time.
              </p>
            </div>
          </div>

          <Link
            href="/admin/contests"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background hover:bg-slate-200 dark:hover:bg-slate-300 font-semibold text-xs sm:text-sm transition shadow-md"
          >
            <span>Open Faculty Console</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
