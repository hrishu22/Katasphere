"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { getPowerAdminOverview } from "@/lib/contest-api";
import { PowerAdminOverviewDto } from "@/types/contest";
import {
  Crown,
  Building2,
  GraduationCap,
  Users,
  Trophy,
  Activity,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  ShieldCheck,
  Database,
  Cpu,
  HardDrive,
  Server,
  KeyRound,
  Mail,
  MapPin,
  Calendar,
  Loader2,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from "lucide-react";

type PowerTab = "dashboard" | "colleges" | "students" | "users" | "contests" | "health";

function PowerAdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = (searchParams?.get("tab") || "dashboard") as PowerTab;

  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<PowerTab>(tabParam);
  const [overview, setOverview] = useState<PowerAdminOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search filters
  const [collegeSearch, setCollegeSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [contestSearch, setContestSearch] = useState("");

  useEffect(() => {
    if (
      tabParam &&
      ["dashboard", "colleges", "students", "users", "contests", "health"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const isPowerUser = Boolean(
    user &&
      (user.isPowerUser ||
        user.role === "POWER_USER" ||
        user.email?.toLowerCase() === "hrishu22@gmail.com")
  );

  const fetchOverview = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getPowerAdminOverview();
      setOverview(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load Power User system overview.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?redirect=/power-admin");
      return;
    }
    if (!isPowerUser) {
      router.replace("/dashboard");
      return;
    }
    fetchOverview(false);
  }, [authLoading, user, isPowerUser, router]);

  const switchTab = (tab: PowerTab) => {
    setActiveTab(tab);
    router.replace(`/power-admin?tab=${tab}`);
  };

  const formatUptime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  };

  if (authLoading || loading) {
    return (
      <div className="py-28 flex flex-col items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-amber-400 mb-3" />
        <p className="text-sm font-semibold text-foreground">
          Loading Katasphere Owner &amp; Power User Console...
        </p>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-surface border border-rose-500/30 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-extrabold text-foreground">Power User Telemetry Unavailable</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={() => fetchOverview(false)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const { systemHealth } = overview;
  const memPct =
    systemHealth.memoryMaxMb > 0
      ? Math.min(100, Math.round((systemHealth.memoryUsedMb / systemHealth.memoryMaxMb) * 100))
      : 25;

  const filteredColleges = overview.colleges.filter((c) => {
    const q = collegeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.collegeCode.toLowerCase().includes(q) ||
      c.officialEmail.toLowerCase().includes(q) ||
      c.adminName.toLowerCase().includes(q) ||
      c.planName.toLowerCase().includes(q)
    );
  });

  const filteredStudents = overview.students.filter((s) => {
    const q = studentSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.collegeName.toLowerCase().includes(q) ||
      s.collegeCode.toLowerCase().includes(q) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(q))
    );
  });

  const filteredUsers = overview.users.filter((u) => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.collegeName && u.collegeName.toLowerCase().includes(q))
    );
  });

  const filteredContests = overview.contests.filter((c) => {
    const q = contestSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.collegeName.toLowerCase().includes(q) ||
      c.collegeCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Power User Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-brand-600/15 to-surface border border-amber-500/35 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              <span>Katasphere Platform Owner • Power User</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Status: {systemHealth.status}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Katasphere Command Center ({user?.email})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
            Complete platform visibility across all registered colleges, college plans &amp; remaining contest quotas, registered students with their colleges, registered users (including student tags), contest analytics, and live system health.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={refreshing}
            onClick={() => fetchOverview(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-border text-xs font-bold text-foreground transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-amber-400 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Refresh All Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* Power User Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-surface border border-surface-border">
        {[
          { id: "dashboard", label: "Dashboard Overview", icon: Activity },
          {
            id: "colleges",
            label: `Registered Colleges (${overview.totalRegisteredColleges})`,
            icon: Building2,
          },
          {
            id: "students",
            label: `Registered Students (${overview.totalRegisteredStudents})`,
            icon: GraduationCap,
          },
          {
            id: "users",
            label: `Registered Users (${overview.totalRegisteredUsers})`,
            icon: Users,
          },
          {
            id: "contests",
            label: `Contests & College Quota (${overview.totalContestsScheduled})`,
            icon: Trophy,
          },
          { id: "health", label: "System Health", icon: Server },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchTab(item.id as PowerTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                active
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "text-slate-400 hover:text-foreground hover:bg-surface-subtle"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: DASHBOARD OVERVIEW
         ===================================================================== */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Top 6 Platform KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              onClick={() => switchTab("colleges")}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-brand-500/40 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Registered Colleges</span>
                <Building2 className="h-4 w-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {overview.totalRegisteredColleges}
              </div>
              <p className="text-[11px] text-slate-400">
                Click to inspect college plans, contest usage &amp; remaining quota
              </p>
            </div>

            <div
              onClick={() => switchTab("students")}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-emerald-500/40 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Registered Students</span>
                <GraduationCap className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400">
                {overview.totalRegisteredStudents}
              </div>
              <p className="text-[11px] text-slate-400">
                Verified students linked with a college &amp; roll number
              </p>
            </div>

            <div
              onClick={() => switchTab("users")}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-purple-500/40 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Registered Users</span>
                <Users className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {overview.totalRegisteredUsers}
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold">
                {overview.totalUsersWhoAreAlsoStudents} user(s) also registered as College Students
              </p>
            </div>

            <div
              onClick={() => switchTab("contests")}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-amber-500/40 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>No. of Contests Happened</span>
                <Trophy className="h-4 w-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-400">
                {overview.totalContestsHappened}
              </div>
              <p className="text-[11px] text-slate-400">
                Total Scheduled: {overview.totalContestsScheduled} ({overview.totalActiveContests} Live •{" "}
                {overview.totalUpcomingContests} Upcoming)
              </p>
            </div>

            <div
              onClick={() => switchTab("contests")}
              className="p-6 rounded-2xl bg-surface border border-surface-border hover:border-brand-500/40 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Total Contest Participations</span>
                <Sparkles className="h-4 w-4 text-brand-400" />
              </div>
              <div className="text-3xl font-extrabold text-foreground">
                {overview.totalContestParticipations}
              </div>
              <p className="text-[11px] text-slate-400">
                {overview.totalContestSubmissions} code submissions evaluated across contests
              </p>
            </div>

            <div
              onClick={() => switchTab("health")}
              className="p-6 rounded-2xl bg-surface border border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer transition space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>System Health Status</span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6" />
                <span>{systemHealth.status}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Memory: {systemHealth.memoryUsedMb}MB / {systemHealth.memoryMaxMb}MB • Uptime:{" "}
                {formatUptime(systemHealth.uptimeSeconds)}
              </p>
            </div>
          </div>

          {/* College Plan, Contests Taken & Remaining Quota Breakdown */}
          <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
            <div className="p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold text-foreground">
                  College Plans, Contest Usage &amp; Remaining Quota Matrix
                </h2>
                <p className="text-xs text-slate-400">
                  Which college is on which plan, how many contests each college has taken, and how many contests are left with that college.
                </p>
              </div>
              <button
                onClick={() => switchTab("colleges")}
                className="text-xs font-bold text-brand-400 hover:underline self-start sm:self-auto"
              >
                Open Full Colleges Directory →
              </button>
            </div>

            {overview.colleges.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No colleges have been registered yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-3.5">College &amp; Unique ID</th>
                      <th className="px-6 py-3.5">Admin Account</th>
                      <th className="px-6 py-3.5">Current Plan</th>
                      <th className="px-6 py-3.5">Contests Taken / Used</th>
                      <th className="px-6 py-3.5">Contests Left</th>
                      <th className="px-6 py-3.5">Happened / Live / Upcoming</th>
                      <th className="px-6 py-3.5">Registered Students</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {overview.colleges.map((col) => (
                      <tr key={col.id} className="hover:bg-surface-subtle/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground text-sm">{col.name}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 font-mono font-bold text-[10px]">
                              {col.collegeCode}
                            </span>
                            {col.city && <span className="text-[11px] text-slate-400">{col.city}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{col.adminName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{col.adminEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-[11px]">
                            {col.planName}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-1 font-mono">
                            Code: {col.planCode}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-foreground text-sm">
                            {col.contestsUsed} / {col.contestQuotaTotal} quota used
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {col.totalContestsCreated} total contest(s) created
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-xl font-extrabold text-xs ${
                              col.contestsLeft > 0
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {col.contestsLeft} left
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-semibold">
                            <span className="text-slate-300">{col.contestsHappenedCount} Past</span>
                            <span>•</span>
                            <span className="text-emerald-400">{col.activeContestsCount} Live</span>
                            <span>•</span>
                            <span className="text-blue-400">{col.upcomingContestsCount} Upcoming</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">
                            {col.registeredStudentsCount} student(s)
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {col.activeTenureStudentsCount} active • {col.expiredTenureStudentsCount} graduated
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: REGISTERED COLLEGES
         ===================================================================== */}
      {activeTab === "colleges" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                All Registered Colleges ({filteredColleges.length})
              </h2>
              <p className="text-xs text-slate-400">
                Complete institutional profile, active plan, contests taken, remaining contest quota, and student counts for every college.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by college name, ID, admin, plan..."
                value={collegeSearch}
                onChange={(e) => setCollegeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface border border-surface-border text-foreground"
              />
            </div>
          </div>

          {filteredColleges.length === 0 ? (
            <div className="p-12 rounded-3xl bg-surface border border-surface-border text-center text-xs text-slate-500">
              No colleges match your search query.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredColleges.map((col) => (
                <div
                  key={col.id}
                  className="p-6 rounded-3xl bg-surface border border-surface-border shadow-md space-y-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-surface-border pb-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/15 border border-brand-500/30 font-mono text-xs font-extrabold text-brand-400">
                          {col.collegeCode}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold">
                          Plan: {col.planName}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${
                            col.contestsLeft > 0
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {col.contestsLeft} Contest(s) Left
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-foreground">{col.name}</h3>
                      <p className="text-xs text-slate-400">
                        Admin: <strong className="text-foreground">{col.adminName}</strong> (
                        <span className="font-mono">{col.adminEmail}</span>) • Official Email:{" "}
                        <span className="font-mono text-slate-300">{col.officialEmail}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs shrink-0">
                      <div className="px-3.5 py-2 rounded-2xl bg-background border border-surface-border">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Quota Total
                        </span>
                        <span className="text-base font-extrabold text-foreground">
                          {col.contestQuotaTotal}
                        </span>
                      </div>
                      <div className="px-3.5 py-2 rounded-2xl bg-background border border-surface-border">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Contests Used
                        </span>
                        <span className="text-base font-extrabold text-amber-400">
                          {col.contestsUsed}
                        </span>
                      </div>
                      <div className="px-3.5 py-2 rounded-2xl bg-background border border-surface-border">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Contests Left
                        </span>
                        <span className="text-base font-extrabold text-emerald-400">
                          {col.contestsLeft}
                        </span>
                      </div>
                      <div className="px-3.5 py-2 rounded-2xl bg-background border border-surface-border">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Students
                        </span>
                        <span className="text-base font-extrabold text-brand-400">
                          {col.registeredStudentsCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Campus &amp; Department:</span>
                      <span className="text-foreground font-semibold">
                        {col.department || "All Engineering Departments"}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {[col.address, col.city, col.state, col.country].filter(Boolean).join(", ") ||
                          "India"}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Contest Activity:</span>
                      <span className="text-foreground font-semibold">
                        {col.contestsHappenedCount} Happened • {col.activeContestsCount} Active •{" "}
                        {col.upcomingContestsCount} Upcoming
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Total Student Participations: {col.totalStudentParticipations}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Plan &amp; Registration Dates:</span>
                      <span className="text-foreground font-semibold">
                        Registered: {new Date(col.createdAt).toLocaleDateString()}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Plan Expiry:{" "}
                        {col.planExpiresAt
                          ? new Date(col.planExpiresAt).toLocaleDateString()
                          : "No Expiry / Active"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: REGISTERED STUDENTS WITH THEIR COLLEGE
         ===================================================================== */}
      {activeTab === "students" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                Registered Students &amp; College Affiliations ({filteredStudents.length})
              </h2>
              <p className="text-xs text-slate-400">
                Every student registered on Katasphere along with their College Name, Unique ID, Roll No., Tenure, and Contest Performance.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, email, college, roll no..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface border border-surface-border text-foreground"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
            {filteredStudents.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No registered students match your search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-3.5">Student Name &amp; Email</th>
                      <th className="px-6 py-3.5">Registered College</th>
                      <th className="px-6 py-3.5">Roll No. / ID</th>
                      <th className="px-6 py-3.5">Academic Tenure</th>
                      <th className="px-6 py-3.5">Contests Participated</th>
                      <th className="px-6 py-3.5">Total Contest Points</th>
                      <th className="px-6 py-3.5">Practice Solved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {filteredStudents.map((stu) => (
                      <tr key={stu.userId} className="hover:bg-surface-subtle/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground text-sm">{stu.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">{stu.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{stu.collegeName}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 font-mono font-bold text-[10px]">
                            {stu.collegeCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-foreground">
                          {stu.rollNumber || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">
                            {stu.tenureStartYear ? `${stu.tenureStartYear} – ` : ""}
                            {stu.tenureEndYear || "—"}
                          </div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              stu.isTenureExpired
                                ? "bg-slate-500/15 text-slate-400"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}
                          >
                            {stu.isTenureExpired ? "Graduated / Expired" : "Active Tenure"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-foreground">
                            {stu.contestsParticipated}
                          </span>{" "}
                          <span className="text-slate-400">
                            ({stu.contestsSubmitted} submitted)
                          </span>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-emerald-400">
                          {stu.totalScoreEarned} pts
                        </td>
                        <td className="px-6 py-4 font-bold text-brand-400">
                          {stu.practiceProblemsSolved} solved
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: REGISTERED USERS (WITH "ALSO A STUDENT" TAG)
         ===================================================================== */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                All Registered Platform Users ({filteredUsers.length})
              </h2>
              <p className="text-xs text-slate-400">
                Every user account on Katasphere, highlighting normal users who are also registered as college students.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users by name, email, role, college..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface border border-surface-border text-foreground"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3.5">User Name &amp; Email</th>
                    <th className="px-6 py-3.5">Role &amp; Student Affiliation Tag</th>
                    <th className="px-6 py-3.5">College / Institution Details</th>
                    <th className="px-6 py-3.5">Practice Activity</th>
                    <th className="px-6 py-3.5">Contest Activity</th>
                    <th className="px-6 py-3.5">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.userId} className="hover:bg-surface-subtle/50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground text-sm">{u.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {u.isPowerUser ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              POWER USER (OWNER)
                            </span>
                          ) : u.isCollegeAdmin ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              COLLEGE ADMIN
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                              NORMAL USER
                            </span>
                          )}

                          {/* Explicit Tag showing that this Normal User is ALSO a Registered Student */}
                          {u.isAlsoStudent && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <GraduationCap className="h-3 w-3 text-emerald-400" />
                              <span>Normal User is Also a Student</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {u.isAlsoStudent ? (
                          <div>
                            <div className="font-bold text-foreground">
                              {u.collegeName} ({u.collegeCode})
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Roll No: {u.rollNumber || "—"} • Tenure:{" "}
                              {u.tenureStartYear ? `${u.tenureStartYear}–` : ""}
                              {u.tenureEndYear || "—"}
                            </div>
                          </div>
                        ) : u.isCollegeAdmin && u.ownedCollegeName ? (
                          <div>
                            <div className="font-bold text-purple-300">
                              Admin of {u.ownedCollegeName} ({u.ownedCollegeCode})
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-500">Not linked to a college</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-foreground">
                          {u.practiceProblemsSolved} solved
                        </span>{" "}
                        <span className="text-slate-400">
                          ({u.practiceSubmissionsCount} submissions)
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {u.contestParticipationsCount} contest(s)
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: CONTESTS & COLLEGE QUOTA ANALYTICS
         ===================================================================== */}
      {activeTab === "contests" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-slate-400 block">Total Contests Happened</span>
              <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
                {overview.totalContestsHappened}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-slate-400 block">Live Active Contests</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {overview.totalActiveContests}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-slate-400 block">Upcoming Contests</span>
              <span className="text-2xl font-extrabold text-blue-400 mt-1 block">
                {overview.totalUpcomingContests}
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-surface-border">
              <span className="text-xs text-slate-400 block">Total Scheduled Contests</span>
              <span className="text-2xl font-extrabold text-foreground mt-1 block">
                {overview.totalContestsScheduled}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-foreground">
                All Institutional Contests ({filteredContests.length})
              </h2>
              <p className="text-xs text-slate-400">
                Every examination scheduled across all colleges on Katasphere.
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search contests by title, college, slug..."
                value={contestSearch}
                onChange={(e) => setContestSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-surface border border-surface-border text-foreground"
              />
            </div>
          </div>

          <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
            {filteredContests.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No contests match your search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-surface-border">
                    <tr>
                      <th className="px-6 py-3.5">Contest Title &amp; Slug</th>
                      <th className="px-6 py-3.5">College &amp; Unique ID</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Schedule &amp; Duration</th>
                      <th className="px-6 py-3.5">Problems</th>
                      <th className="px-6 py-3.5">Participants / Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {filteredContests.map((c) => (
                      <tr key={c.contestId} className="hover:bg-surface-subtle/50 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground text-sm">{c.title}</div>
                          <div className="text-[11px] font-mono text-slate-500">/{c.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-foreground">{c.collegeName}</div>
                          <span className="px-2 py-0.5 rounded bg-brand-500/15 text-brand-400 font-mono text-[10px] font-bold">
                            {c.collegeCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              c.status === "ACTIVE"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : c.status === "UPCOMING"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300">
                          <div>{c.durationMinutes} mins</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(c.startTime).toLocaleString([], {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">
                          {c.totalProblems} problems
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-foreground">
                            {c.totalParticipants} enrolled
                          </span>{" "}
                          <span className="text-emerald-400">
                            ({c.submittedParticipants} submitted)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: SYSTEM HEALTH & INFRASTRUCTURE TELEMETRY
         ===================================================================== */}
      {activeTab === "health" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-surface border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Core Platform Status</span>
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">{systemHealth.status}</div>
              <p className="text-xs text-slate-400">
                Checked at {new Date(systemHealth.checkedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-brand-400">
                <span>PostgreSQL Database</span>
                <Database className="h-5 w-5" />
              </div>
              <div className="text-lg font-extrabold text-foreground">
                {systemHealth.databaseStatus}
              </div>
              <p className="text-xs text-slate-400">
                {systemHealth.totalProblemsInCatalog} Catalog Problems •{" "}
                {systemHealth.totalTestCasesInDb} Test Cases
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                <span>Compiler Execution Engine</span>
                <Cpu className="h-5 w-5" />
              </div>
              <div className="text-lg font-extrabold text-foreground">
                {systemHealth.executionEngineStatus}
              </div>
              <p className="text-xs text-slate-400">
                In-process JavaCompiler + Isolated Process Sandbox
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-6">
            <h3 className="text-base font-extrabold text-foreground">
              Runtime &amp; Resource Utilization
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-semibold">JVM Heap Memory Usage</span>
                <span className="font-mono font-bold text-foreground">
                  {systemHealth.memoryUsedMb} MB used / {systemHealth.memoryMaxMb} MB max ({memPct}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-background overflow-hidden border border-surface-border">
                <div
                  style={{ width: `${memPct}%` }}
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-background border border-surface-border">
                <span className="text-slate-400 block">Java Runtime</span>
                <strong className="text-foreground text-sm mt-1 block font-mono">
                  Java {systemHealth.javaVersion}
                </strong>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-surface-border">
                <span className="text-slate-400 block">Operating System</span>
                <strong className="text-foreground text-sm mt-1 block">
                  {systemHealth.osName}
                </strong>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-surface-border">
                <span className="text-slate-400 block">CPU Cores Available</span>
                <strong className="text-foreground text-sm mt-1 block">
                  {systemHealth.availableProcessors} vCPUs
                </strong>
              </div>
              <div className="p-4 rounded-2xl bg-background border border-surface-border">
                <span className="text-slate-400 block">Server Uptime</span>
                <strong className="text-emerald-400 text-sm mt-1 block font-mono">
                  {formatUptime(systemHealth.uptimeSeconds)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PowerAdminPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="py-28 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          </div>
        }
      >
        <PowerAdminContent />
      </Suspense>
    </AppShell>
  );
}
