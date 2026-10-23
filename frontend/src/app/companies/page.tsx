"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building2,
  Lock,
  Unlock,
  CheckCircle2,
  Crown,
  Sparkles,
  ArrowRight,
  Search,
  Filter,
  BarChart2,
  Layers,
  Award,
  ShieldCheck,
  ChevronRight,
  Loader2,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react";

interface CompanySummary {
  name: string;
  slug: string;
  accentColor: string;
  description: string;
  interviewRounds: string;
  totalProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  isPremium: boolean;
}

interface CompanyProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  frequencyPercent: number;
  typicalRound: string;
  tags: string[];
  isLocked: boolean;
}

interface CompanyDetailResponse {
  company: CompanySummary;
  isUnlocked: boolean;
  problems: CompanyProblem[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function CompaniesContent() {
  const searchParams = useSearchParams();
  const initialCompany = searchParams.get("company") || "google";

  const { user, isLoading: authLoading, upgradeToPremium, togglePremium } = useAuth();
  const isUserPremium = Boolean(user && (user.isPremium || user.role === "PREMIUM" || user.role === "ADMIN"));

  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>(initialCompany);
  const [companyDetail, setCompanyDetail] = useState<CompanyDetailResponse | null>(null);

  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [roundFilter, setRoundFilter] = useState("ALL");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Companies List
  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoadingCompanies(true);
        const res = await apiClient<ApiResponse<CompanySummary[]>>("/api/v1/companies");
        if (res && res.data) {
          setCompanies(res.data);
          // If the initial slug doesn't match any company, pick the first
          if (!res.data.some((c) => c.slug === selectedSlug) && res.data.length > 0) {
            setSelectedSlug(res.data[0].slug);
          }
        }
      } catch (err: any) {
        setError("Failed to load company directory.");
      } finally {
        setLoadingCompanies(false);
      }
    }
    loadCompanies();
  }, []);

  // Fetch Selected Company Details
  const fetchCompanyDetails = useCallback(async (slug: string) => {
    setLoadingDetail(true);
    try {
      const res = await apiClient<ApiResponse<CompanyDetailResponse>>(`/api/v1/companies/${slug}`);
      if (res && res.data) {
        setCompanyDetail(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load company detail", err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      fetchCompanyDetails(selectedSlug);
    }
  }, [selectedSlug, fetchCompanyDetails, user?.role, user?.isPremium]);

  // Handle Instant Upgrade / Toggle for Demo
  const handleUpgradeOrToggle = async (action: "upgrade" | "toggle") => {
    if (!user) {
      window.location.href = "/login?redirect=/companies";
      return;
    }

    try {
      setIsUpgrading(true);
      if (action === "upgrade") {
        await upgradeToPremium();
        showToast("🎉 Welcome to Katasphere Pro! All company question banks are now unlocked.");
      } else {
        const updated = await togglePremium();
        const nowPro = updated.role === "PREMIUM" || updated.isPremium;
        showToast(
          nowPro
            ? "✨ Pro Mode Activated! Company interview sets unlocked."
            : "ℹ️ Switched to Free Tier preview mode."
        );
      }
      // Re-fetch company details
      await fetchCompanyDetails(selectedSlug);
    } catch (err: any) {
      showToast("Operation failed. Please ensure you are logged in.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const difficultyColors = {
    EASY: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    HARD: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
  };

  // Filter problems by round & search
  const filteredProblems = useMemo(() => {
    if (!companyDetail?.problems) return [];
    return companyDetail.problems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRound =
        roundFilter === "ALL" ||
        (roundFilter === "OA" && p.typicalRound.toLowerCase().includes("assessment")) ||
        (roundFilter === "PHONE" && p.typicalRound.toLowerCase().includes("phone")) ||
        (roundFilter === "ONSITE" && p.typicalRound.toLowerCase().includes("onsite"));

      return matchesSearch && matchesRound;
    });
  }, [companyDetail?.problems, searchQuery, roundFilter]);

  const currentCompany = companyDetail?.company || companies.find((c) => c.slug === selectedSlug);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3">
            <div className="px-4 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl flex items-center space-x-3 text-sm font-semibold border border-slate-700">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-surface-border">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-brand-500/15 to-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span>Katasphere Pro Exclusive — SDE-1 Interview Tracks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Company-Specific Interview Questions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Master exact algorithmic questions asked in Online Assessments (OA), Technical Phone Screens, and Onsite DSA rounds for Google, Amazon, Meta, and Microsoft.
            </p>
          </div>

          {/* User Membership & Action Card */}
          <div className="p-4 rounded-2xl bg-surface border border-surface-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 lg:max-w-md">
            <div className="flex items-center space-x-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isUserPremium
                    ? "bg-amber-500/20 text-amber-500 border border-amber-500/30"
                    : "bg-surface-subtle text-slate-400 border border-surface-border"
                }`}
              >
                {isUserPremium ? <Crown className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-foreground">
                    {isUserPremium ? "Katasphere Pro Active" : "Free Plan Preview"}
                  </span>
                  {isUserPremium && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500 text-white">
                      UNLOCKED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isUserPremium
                    ? "Unlimited access to all company questions & rounds."
                    : "First 2 questions unlocked per company."}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              {!isUserPremium ? (
                <button
                  onClick={() => handleUpgradeOrToggle("upgrade")}
                  disabled={isUpgrading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5"
                >
                  {isUpgrading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Zap className="h-3.5 w-3.5" />
                  )}
                  <span>Unlock Pro</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUpgradeOrToggle("toggle")}
                  disabled={isUpgrading}
                  title="Toggle Free/Pro for demonstration"
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-muted text-slate-600 dark:text-slate-300 text-xs font-medium border border-surface-border transition flex items-center justify-center space-x-1"
                >
                  {isUpgrading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span>Demo Free Mode</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Company Selection Horizontal Pills / Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-brand-500" />
              <span>Target Companies</span>
            </h2>
            <span className="text-xs text-slate-400">Select a company to view curated SDE-1 questions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {companies.map((company) => {
              const isSelected = company.slug === selectedSlug;
              return (
                <button
                  key={company.slug}
                  onClick={() => setSelectedSlug(company.slug)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-surface border-brand-500 shadow-md ring-2 ring-brand-500/20"
                      : "bg-surface border-surface-border hover:border-slate-400 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{company.name}</span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: company.accentColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{company.totalProblems} qs</span>
                    <span className="font-semibold text-amber-500 text-[10px]">PRO</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Company Focus Section */}
        {loadingDetail ? (
          <div className="p-16 text-center rounded-2xl bg-surface border border-surface-border space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-sm text-slate-500">Loading {selectedSlug} interview questions...</p>
          </div>
        ) : currentCompany ? (
          <div className="space-y-6">
            {/* Company Overview & Interview Stages Banner */}
            <div className="p-6 rounded-2xl bg-surface border border-surface-border shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-sm"
                    style={{ backgroundColor: currentCompany.accentColor }}
                  >
                    {currentCompany.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        {currentCompany.name} SDE-1 Interview Track
                      </h2>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        {currentCompany.totalProblems} Questions
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {currentCompany.description}
                    </p>
                  </div>
                </div>

                {/* Question Difficulty Split */}
                <div className="flex items-center space-x-3 text-xs shrink-0 bg-surface-subtle p-2.5 rounded-xl border border-surface-border">
                  <div className="text-center px-2">
                    <div className="text-emerald-500 font-bold">{currentCompany.easyCount}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Easy</div>
                  </div>
                  <div className="h-6 w-px bg-surface-border" />
                  <div className="text-center px-2">
                    <div className="text-amber-500 font-bold">{currentCompany.mediumCount}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Medium</div>
                  </div>
                  <div className="h-6 w-px bg-surface-border" />
                  <div className="text-center px-2">
                    <div className="text-rose-500 font-bold">{currentCompany.hardCount}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Hard</div>
                  </div>
                </div>
              </div>

              {/* Typical Rounds Pipeline */}
              <div className="pt-3 border-t border-surface-border flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 mr-1">
                  <Layers className="h-3.5 w-3.5 text-brand-500" /> Typical Hiring Pipeline:
                </span>
                <span className="px-2.5 py-1 rounded-md bg-surface-subtle border border-surface-border text-foreground font-medium">
                  {currentCompany.interviewRounds}
                </span>
              </div>
            </div>

            {/* Filter Toolbar for Questions */}
            <div className="p-4 rounded-xl bg-surface border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              {/* Search Inside Company */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentCompany.name} questions...`}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs sm:text-sm text-foreground placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
              </div>

              {/* Round Filters */}
              <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs text-slate-400 font-medium mr-1 hidden md:inline">
                  Filter Round:
                </span>
                {[
                  { id: "ALL", label: "All Rounds" },
                  { id: "OA", label: "Online Assessment" },
                  { id: "PHONE", label: "Phone Screen" },
                  { id: "ONSITE", label: "Onsite DSA" },
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setRoundFilter(rf.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      roundFilter === rf.id
                        ? "bg-brand-600 text-white shadow-xs"
                        : "bg-surface-subtle text-slate-600 dark:text-slate-300 hover:bg-surface-muted"
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Problems List */}
            {filteredProblems.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-surface border border-surface-border space-y-2">
                <p className="text-sm font-semibold text-foreground">No questions found</p>
                <p className="text-xs text-slate-500">
                  Try clearing the round filter or adjusting your search term.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProblems.map((problem, index) => {
                  const isLocked = Boolean(problem.isLocked);

                  return (
                    <div
                      key={problem.id}
                      className={`p-4 sm:p-5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isLocked
                          ? "bg-surface/50 border-surface-border opacity-75 hover:opacity-100"
                          : "bg-surface border-surface-border hover:border-slate-400 dark:hover:border-slate-600 shadow-sm"
                      }`}
                    >
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            #{index + 1}
                          </span>

                          {isLocked ? (
                            <span className="font-bold text-foreground text-base flex items-center gap-2">
                              {problem.title}
                              <Lock className="h-3.5 w-3.5 text-amber-500" />
                            </span>
                          ) : (
                            <Link
                              href={`/problems/${problem.slug}`}
                              className="font-bold text-foreground hover:text-brand-500 text-base transition"
                            >
                              {problem.title}
                            </Link>
                          )}

                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${
                              difficultyColors[problem.difficulty]
                            }`}
                          >
                            {problem.difficulty}
                          </span>

                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 font-medium">
                            {problem.typicalRound}
                          </span>
                        </div>

                        {/* Frequency Stats & Tags */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {/* Frequency Bar */}
                          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
                            <BarChart2 className="h-3.5 w-3.5 text-amber-500" />
                            <span className="font-mono text-[11px]">
                              Asked in <strong className="text-foreground">{problem.frequencyPercent}%</strong> of rounds
                            </span>
                          </div>

                          <div className="h-3 w-px bg-surface-border hidden sm:block" />

                          {/* Tags */}
                          <div className="flex flex-wrap items-center gap-1">
                            {problem.tags.slice(0, 4).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] px-2 py-0.2 rounded bg-surface-subtle text-slate-500 dark:text-slate-400 border border-surface-border font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex items-center justify-end">
                        {isLocked ? (
                          <button
                            onClick={() => handleUpgradeOrToggle("upgrade")}
                            className="px-4 py-2 rounded-lg bg-surface-subtle hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center space-x-1.5 transition"
                          >
                            <Lock className="h-3.5 w-3.5" />
                            <span>Unlock with Pro</span>
                          </button>
                        ) : (
                          <Link
                            href={`/problems/${problem.slug}`}
                            className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-xs flex items-center space-x-1.5"
                          >
                            <span>Solve Challenge</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Premium Paywall Section (Rendered when company set is not fully unlocked) */}
            {!companyDetail?.isUnlocked && (
              <div className="mt-8 p-8 rounded-3xl bg-gradient-to-b from-surface via-surface to-amber-500/5 border-2 border-amber-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Crown className="h-48 w-48 text-amber-500" />
                </div>

                <div className="max-w-2xl space-y-4 relative z-10">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-500/30">
                    <Crown className="h-3.5 w-3.5" />
                    <span>KATASPHERE PRO MEMBERSHIP</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    Unlock All {currentCompany.totalProblems} Questions Asked at {currentCompany.name}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    You are currently previewing 2 free sample questions. Katasphere Pro provides verified, high-frequency interview questions with complete testcase suites and optimal multi-language solutions.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    <div className="flex items-center space-x-2 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Full 2026 {currentCompany.name} OA & Onsite Question Bank</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Question frequency & recency rankings</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Optimal Java, C++, Python, TS solutions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Access to Google, Meta, Amazon, and Microsoft sets</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => handleUpgradeOrToggle("upgrade")}
                      disabled={isUpgrading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2"
                    >
                      {isUpgrading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Crown className="h-4 w-4" />
                      )}
                      <span>Upgrade to Katasphere Pro</span>
                    </button>

                    <button
                      onClick={() => handleUpgradeOrToggle("toggle")}
                      disabled={isUpgrading}
                      className="px-4 py-3 rounded-xl bg-surface-subtle hover:bg-surface-muted text-slate-700 dark:text-slate-300 font-semibold text-xs border border-surface-border transition flex items-center justify-center space-x-1.5"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>Instant 1-Click Pro Simulation (Demo)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500 mx-auto" />
            <p className="text-sm text-slate-500 mt-3">Loading Company Hub...</p>
          </div>
        </AppShell>
      }
    >
      <CompaniesContent />
    </Suspense>
  );
}
