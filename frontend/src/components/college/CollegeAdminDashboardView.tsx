"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getCollegeAdminDashboard,
  getExportGradebookUrl,
  purchaseAdditionalContests,
} from "@/lib/contest-api";
import {
  CollegeAdminDashboardDto,
  AdminParticipantDetailDto,
  AdminCheatIncidentDto,
  AdminEnrolledStudentDto,
  AdminContestSummaryDto,
} from "@/types/contest";
import {
  Building2,
  Users,
  Trophy,
  ShieldAlert,
  ShieldCheck,
  Search,
  Download,
  Plus,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  FileCode2,
  RefreshCw,
  Filter,
  Eye,
} from "lucide-react";

export function CollegeAdminDashboardView() {
  const [data, setData] = useState<CollegeAdminDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "RANKINGS" | "PARTICIPANTS" | "CHEATS" | "STUDENTS" | "CONTESTS"
  >("RANKINGS");
  const [selectedContestId, setSelectedContestId] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [purchasingQuota, setPurchasingQuota] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCollegeAdminDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load College Admin Dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePurchasePlusTwo = async () => {
    try {
      setPurchasingQuota(true);
      await purchaseAdditionalContests(2);
      await loadDashboard();
    } catch (err) {
      console.error("Failed to purchase +2 contests", err);
    } finally {
      setPurchasingQuota(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-brand-500 mb-3" />
        <p className="text-sm text-slate-400">
          Loading your institution&apos;s analytics, student rankings &amp; anti-cheat telemetry...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Building2 className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">
          Complete Your College Registration
        </h2>
        <p className="text-sm text-slate-400">
          {error ||
            "Please complete your college profile and select a contest plan to unlock your dedicated College Admin Dashboard."}
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
        >
          <span>Go to Profile &amp; College Setup</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const { college } = data;
  const q = searchQuery.trim().toLowerCase();

  const filteredParticipants = data.participantsAndRankings.filter((p) => {
    if (selectedContestId !== "ALL" && p.contestId !== selectedContestId) return false;
    if (!q) return true;
    return (
      p.studentName.toLowerCase().includes(q) ||
      p.studentEmail.toLowerCase().includes(q) ||
      (p.rollNumber && p.rollNumber.toLowerCase().includes(q)) ||
      p.contestTitle.toLowerCase().includes(q)
    );
  });

  const filteredCheats = data.cheatIncidents.filter((c) => {
    if (selectedContestId !== "ALL" && c.contestId !== selectedContestId) return false;
    if (!q) return true;
    return (
      c.studentName.toLowerCase().includes(q) ||
      c.studentEmail.toLowerCase().includes(q) ||
      (c.rollNumber && c.rollNumber.toLowerCase().includes(q)) ||
      c.contestTitle.toLowerCase().includes(q)
    );
  });

  const filteredEnrolledStudents = data.enrolledStudents.filter((s) => {
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(q))
    );
  });

  const selectedContestObj =
    selectedContestId !== "ALL"
      ? data.contests.find((c) => c.contestId === selectedContestId)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Institutional Banner (Scoped exclusively to this Admin's College) */}
      <div className="rounded-3xl bg-gradient-to-br from-brand-600/20 via-purple-600/10 to-surface border border-brand-500/30 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-extrabold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>College Admin Dashboard</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface border border-surface-border text-xs font-bold text-slate-300">
                {college.planName || "Active Plan"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {college.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Manage your college details, contest quota, student participation metrics, rankings/results, and anti-cheat violation reports.
            </p>
          </div>

          {/* Right Quick Actions: College ID + Contests Left + Schedule Exam */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-background/90 border border-brand-500/40 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  College Unique ID
                </span>
                <span className="font-mono text-base font-extrabold text-brand-400 tracking-wider">
                  {college.collegeCode}
                </span>
              </div>
              <button
                onClick={() => handleCopyCode(college.collegeCode)}
                className="p-2 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-foreground transition"
                title="Copy College Unique ID"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 text-brand-400" />
                )}
              </button>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-background/90 border border-amber-500/40 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  Contests Left
                </span>
                <span className="text-base font-extrabold text-amber-400">
                  {college.contestsLeft} left{" "}
                  <span className="text-[11px] font-normal text-slate-400">
                    ({college.contestsUsed}/{college.contestQuotaTotal})
                  </span>
                </span>
              </div>
              <button
                type="button"
                disabled={purchasingQuota}
                onClick={handlePurchasePlusTwo}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold transition disabled:opacity-50"
              >
                {purchasingQuota ? "Adding..." : "Purchase +2 Contests"}
              </button>
            </div>

            <Link
              href="/admin/contests"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold transition shadow-lg shadow-brand-600/25"
            >
              <Plus className="h-4 w-4" />
              <span>Create / Manage Contests</span>
            </Link>

            <button
              onClick={loadDashboard}
              className="p-3 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-border text-slate-300 hover:text-foreground transition"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Registered College Details Grid inside Admin Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-surface-border/70 text-xs">
          <div className="p-3.5 rounded-2xl bg-background/80 border border-surface-border">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Official College Email
            </span>
            <span className="font-mono text-foreground font-semibold truncate block mt-0.5">
              {college.officialEmail}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/80 border border-surface-border">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Campus Address &amp; Location
            </span>
            <span className="text-foreground font-semibold truncate block mt-0.5">
              {[college.address, college.city, college.state].filter(Boolean).join(", ") || "Not added yet"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/80 border border-surface-border">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Department &amp; Expected Students
            </span>
            <span className="text-foreground font-semibold truncate block mt-0.5">
              {college.department || "All Engineering / CS"} • {college.expectedStudents || 100} expected
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-background/80 border border-surface-border flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Institution Settings
              </span>
              <span className="text-emerald-400 font-bold block mt-0.5">
                {college.linkedStudents} Verified Students
              </span>
            </div>
            <Link
              href="/profile"
              className="px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-foreground font-bold text-[11px] transition shrink-0"
            >
              Edit Details
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Enrolled College Students</span>
            <Users className="h-4 w-4 text-brand-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {data.totalLinkedStudents}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">
              {data.activeTenureStudents} Active Tenure
            </span>
            <span>•</span>
            <span>{data.passedOutStudents} Alumni</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Examinations Conducted</span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {data.totalContestsConducted}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{data.activeContestsCount} Live</span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">{data.upcomingContestsCount} Upcoming</span>
            <span>•</span>
            <span>{data.completedContestsCount} Past</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-surface-border shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Total Participations &amp; Avg Score</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold text-foreground">
              {data.totalParticipations}
            </span>
            <span className="text-sm font-bold text-emerald-400">
              ({data.averageScorePercent}% avg score)
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across all graded college examinations
          </div>
        </div>

        <div
          onClick={() => setActiveTab("CHEATS")}
          className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition ${
            data.totalCheatIncidents > 0
              ? "bg-rose-500/10 border-rose-500/35 hover:border-rose-500"
              : "bg-surface border-surface-border hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-bold ${
                data.totalCheatIncidents > 0 ? "text-rose-300" : "text-slate-400"
              }`}
            >
              Cheats &amp; Tab Violations
            </span>
            <ShieldAlert
              className={`h-4 w-4 ${
                data.totalCheatIncidents > 0 ? "text-rose-400" : "text-emerald-400"
              }`}
            />
          </div>
          <div
            className={`mt-2 text-3xl font-extrabold ${
              data.totalCheatIncidents > 0 ? "text-rose-400" : "text-emerald-400"
            }`}
          >
            {data.totalCheatIncidents}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
            <span className="text-rose-400 font-bold">
              {data.criticalDisqualifiedCount} Auto-Flagged
            </span>
            <span>•</span>
            <span>{data.totalTabSwitchesRecorded} Total Tab Switches</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Card: Filter Bar + Tabs */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-lg">
        {/* Top Controls: Tabs + Contest Filter + Search */}
        <div className="p-6 border-b border-surface-border space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-background border border-surface-border">
              <button
                onClick={() => setActiveTab("RANKINGS")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "RANKINGS"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-foreground"
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Rankings &amp; Results ({filteredParticipants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("PARTICIPANTS")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "PARTICIPANTS"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-foreground"
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5" />
                <span>Students Participated ({filteredParticipants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("CHEATS")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "CHEATS"
                    ? "bg-rose-600 text-white shadow-sm"
                    : data.totalCheatIncidents > 0
                    ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                    : "text-slate-400 hover:text-foreground"
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Cheats / Violations ({filteredCheats.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("STUDENTS")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "STUDENTS"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Enrolled Students ({filteredEnrolledStudents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("CONTESTS")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === "CONTESTS"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-foreground"
                }`}
              >
                <Filter className="h-3.5 w-3.5" />
                <span>Exam Summary ({data.contests.length})</span>
              </button>
            </div>

            {/* Filter by Specific Contest + Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {activeTab !== "STUDENTS" && activeTab !== "CONTESTS" && (
                <select
                  value={selectedContestId}
                  onChange={(e) => setSelectedContestId(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-background border border-surface-border text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="ALL">All College Examinations ({data.contests.length})</option>
                  {data.contests.map((c) => (
                    <option key={c.contestId} value={c.contestId}>
                      {c.title} ({c.totalParticipants} students)
                    </option>
                  ))}
                </select>
              )}

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student name, roll no, email..."
                  className="pl-8 pr-3.5 py-2 rounded-xl bg-background border border-surface-border text-xs text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-60"
                />
              </div>

              {selectedContestObj && (
                <a
                  href={getExportGradebookUrl(selectedContestObj.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: RANKINGS & RESULTS */}
        {activeTab === "RANKINGS" && (
          <div className="overflow-x-auto">
            {filteredParticipants.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No student rankings recorded yet for the selected filter. Once students join and submit code in your college examinations, their live ranks and scores will appear here.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-background/60 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 font-bold">Rank</th>
                    <th className="py-3.5 px-4 font-bold">Candidate Details</th>
                    <th className="py-3.5 px-4 font-bold">Roll No &amp; Batch</th>
                    <th className="py-3.5 px-4 font-bold">Examination</th>
                    <th className="py-3.5 px-4 font-bold">Problems Solved</th>
                    <th className="py-3.5 px-4 font-bold">Score &amp; %</th>
                    <th className="py-3.5 px-4 font-bold">Integrity / Cheating Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredParticipants.map((p: AdminParticipantDetailDto) => (
                    <tr key={p.participantId} className="hover:bg-surface-subtle/50 transition">
                      <td className="py-3.5 px-4 font-extrabold">
                        <span
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-extrabold ${
                            p.rank === 1
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : p.rank === 2
                              ? "bg-slate-300/20 text-slate-200 border border-slate-400/40"
                              : p.rank === 3
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                              : "bg-background text-slate-400 border border-surface-border"
                          }`}
                        >
                          #{p.rank}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{p.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.studentEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-foreground">
                          {p.rollNumber || "—"}
                        </div>
                        {p.tenureEndYear && (
                          <div className="text-[10px] text-slate-400">
                            Batch {p.tenureStartYear ? `${p.tenureStartYear}–` : ""}
                            {p.tenureEndYear}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Link
                          href={`/contests/${p.contestSlug}`}
                          className="font-bold text-brand-400 hover:underline"
                        >
                          {p.contestTitle}
                        </Link>
                        <div className="text-[10px] text-slate-500">{p.contestStatus}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground">
                          {p.solvedProblems} / {p.totalProblems}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-emerald-400">
                          {p.totalScore} / {p.maxScore} pts
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.scorePercent}% • Penalty {Math.floor(p.penaltySeconds / 60)}m
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {p.cheatSeverity === "CRITICAL" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>Flagged Cheat ({p.tabSwitchCount} tab switches)</span>
                          </span>
                        ) : p.cheatSeverity === "WARNING" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Suspicious ({p.tabSwitchCount}/{p.maxTabSwitches} switches)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Clean (0 switches)</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 2: STUDENTS PARTICIPATED DETAILS */}
        {activeTab === "PARTICIPANTS" && (
          <div className="overflow-x-auto">
            {filteredParticipants.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No student participation records found for the selected filter.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-background/60 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 font-bold">Student Name &amp; Email</th>
                    <th className="py-3.5 px-4 font-bold">Roll No &amp; Tenure</th>
                    <th className="py-3.5 px-4 font-bold">Examination</th>
                    <th className="py-3.5 px-4 font-bold">Session Status</th>
                    <th className="py-3.5 px-4 font-bold">Started / Submitted</th>
                    <th className="py-3.5 px-4 font-bold">Score &amp; Rank</th>
                    <th className="py-3.5 px-4 font-bold">Tab Switches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredParticipants.map((p: AdminParticipantDetailDto) => (
                    <tr key={p.participantId} className="hover:bg-surface-subtle/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{p.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.studentEmail}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-foreground">
                          {p.rollNumber || "Not set"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.tenureEndYear
                            ? `${p.tenureStartYear || ""}–${p.tenureEndYear}`
                            : "Active Candidate"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{p.contestTitle}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{p.contestSlug}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === "FLAGGED_VIOLATION"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : p.status === "SUBMITTED"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        <div>
                          Started:{" "}
                          {new Date(p.startedAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                        <div>
                          Submitted:{" "}
                          {p.submittedAt
                            ? new Date(p.submittedAt).toLocaleString([], {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "In Progress / Auto-closed"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">
                          {p.totalScore} / {p.maxScore} pts
                        </div>
                        <div className="text-[11px] text-amber-400 font-semibold">
                          Rank #{p.rank} of {p.totalParticipants}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold ${
                            p.tabSwitchCount > p.maxTabSwitches
                              ? "text-rose-400"
                              : p.tabSwitchCount > 0
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {p.tabSwitchCount} / {p.maxTabSwitches}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: CHEATS & PROCTORING VIOLATIONS ("IF HAPPENED, WHO HAS DONE") */}
        {activeTab === "CHEATS" && (
          <div className="p-6 space-y-4">
            {filteredCheats.length === 0 ? (
              <div className="p-10 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-extrabold text-foreground">
                  Zero Cheating or Tab-Switch Violations Detected
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All candidates in the selected examination(s) maintained full-screen focus with 0 unauthorized tab or window switches.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 text-rose-300 font-bold">
                    <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>
                      Anti-Cheat Proctoring Log: {filteredCheats.length} candidate(s) switched tabs or lost exam window focus during a proctored test.
                    </span>
                  </div>
                </div>

                {filteredCheats.map((c: AdminCheatIncidentDto) => {
                  const isCritical = c.severity === "CRITICAL_DISQUALIFIED";
                  return (
                    <div
                      key={c.participantId}
                      className={`p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        isCritical
                          ? "bg-rose-500/10 border-rose-500/40"
                          : "bg-amber-500/10 border-amber-500/30"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              isCritical
                                ? "bg-rose-600 text-white"
                                : "bg-amber-500 text-slate-950"
                            }`}
                          >
                            {isCritical
                              ? "CRITICAL — EXCEEDED TAB LIMIT / FLAGGED"
                              : "WARNING — TAB SWITCH DETECTED"}
                          </span>

                          <span className="text-xs font-bold text-foreground">
                            Exam: {c.contestTitle}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-base font-extrabold text-foreground">
                            {c.studentName}
                          </span>
                          <span className="text-xs font-mono text-slate-300">
                            ({c.studentEmail})
                          </span>
                          {c.rollNumber && (
                            <span className="px-2 py-0.5 rounded bg-background/80 border border-surface-border font-mono text-xs font-bold text-brand-300">
                              Roll No: {c.rollNumber}
                            </span>
                          )}
                          {c.tenureEndYear && (
                            <span className="text-xs text-slate-400">
                              Batch {c.tenureStartYear ? `${c.tenureStartYear}–` : ""}
                              {c.tenureEndYear}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-200 font-medium">
                          {c.violationSummary}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 shrink-0">
                        <div className="px-4 py-2 rounded-xl bg-background/90 border border-surface-border text-center">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Tab Switches
                          </div>
                          <div
                            className={`text-lg font-mono font-extrabold ${
                              isCritical ? "text-rose-400" : "text-amber-400"
                            }`}
                          >
                            {c.tabSwitchCount} / {c.maxTabSwitches}
                          </div>
                        </div>

                        <div className="px-4 py-2 rounded-xl bg-background/90 border border-surface-border text-center">
                          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                            Score &amp; Rank
                          </div>
                          <div className="text-sm font-extrabold text-foreground">
                            {c.totalScore}/{c.maxScore} pts (#{c.rank})
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ENROLLED COLLEGE STUDENTS DIRECTORY */}
        {activeTab === "STUDENTS" && (
          <div className="overflow-x-auto">
            {filteredEnrolledStudents.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No students have linked your College Unique ID ({college.collegeCode}) yet. Share your College ID with your students so they appear here.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-border bg-background/60 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4 font-bold">Student Name &amp; Email</th>
                    <th className="py-3.5 px-4 font-bold">Roll Number</th>
                    <th className="py-3.5 px-4 font-bold">Tenure Year &amp; Status</th>
                    <th className="py-3.5 px-4 font-bold">Exams Attempted</th>
                    <th className="py-3.5 px-4 font-bold">Best Rank</th>
                    <th className="py-3.5 px-4 font-bold">Avg Score %</th>
                    <th className="py-3.5 px-4 font-bold">Cheat Flags / Tab Switches</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredEnrolledStudents.map((s: AdminEnrolledStudentDto) => (
                    <tr key={s.userId} className="hover:bg-surface-subtle/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-foreground">{s.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                        {s.rollNumber || "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {s.tenureEndYear
                              ? `${s.tenureStartYear ? `${s.tenureStartYear}–` : ""}${s.tenureEndYear}`
                              : "Active"}
                          </span>
                          {s.isTenureExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              Passed Out
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Active Student
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {s.examsAttempted}
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-amber-400">
                        {s.bestRank ? `#${s.bestRank}` : "—"}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        {s.averageScorePercent}%
                      </td>

                      <td className="py-3.5 px-4">
                        {s.flaggedViolationsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <ShieldAlert className="h-3 w-3" />
                            <span>
                              {s.flaggedViolationsCount} exam(s) • {s.totalTabSwitches} switches
                            </span>
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Clean (0)</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 5: CONTEST SUMMARY & CSV EXPORTS */}
        {activeTab === "CONTESTS" && (
          <div className="p-6 space-y-4">
            {data.contests.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No examinations scheduled yet for {college.name}.
              </div>
            ) : (
              data.contests.map((c: AdminContestSummaryDto) => (
                <div
                  key={c.contestId}
                  className="p-5 rounded-2xl bg-background border border-surface-border flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          c.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : c.status === "UPCOMING"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : "bg-slate-500/15 text-slate-300 border-slate-500/30"
                        }`}
                      >
                        {c.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{c.slug}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-foreground">{c.title}</h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>
                        Participants: <strong className="text-foreground">{c.totalParticipants}</strong> ({c.submittedCount} submitted)
                      </span>
                      <span>•</span>
                      <span>
                        Avg Score: <strong className="text-emerald-400">{c.averageScorePercent}%</strong>
                      </span>
                      {c.topScorerName && (
                        <>
                          <span>•</span>
                          <span>
                            Rank #1: <strong className="text-amber-400">{c.topScorerName} ({c.topScore} pts)</strong>
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className={c.flaggedCheatersCount > 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                        Cheats Flagged: {c.flaggedCheatersCount} ({c.totalTabSwitches} tab switches)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedContestId(c.contestId);
                        setActiveTab("RANKINGS");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-xs font-bold text-foreground transition"
                    >
                      <Eye className="h-3.5 w-3.5 text-brand-400" />
                      <span>View Rankings &amp; Cheats</span>
                    </button>

                    <a
                      href={getExportGradebookUrl(c.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>CSV Gradebook</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
