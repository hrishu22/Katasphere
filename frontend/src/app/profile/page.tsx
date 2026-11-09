"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import {
  getMyCollegeContext,
  registerCollege,
  updateMyCollege,
  linkStudentCollege,
  getStudentExamDashboard,
  getCollegeSuggestions,
  getCollegePlans,
  selectOrExtendCollegePlan,
  purchaseAdditionalContests,
} from "@/lib/contest-api";
import {
  CollegeAdminDto,
  CollegePlanOptionDto,
  StudentCollegeDto,
  StudentExamDashboardDto,
  ExamSummaryDto,
  CollegeSuggestionDto,
} from "@/types/contest";
import {
  User,
  Mail,
  Shield,
  Calendar,
  LogOut,
  Loader2,
  ArrowLeft,
  Building2,
  GraduationCap,
  Copy,
  Check,
  Edit3,
  Plus,
  Trophy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Users,
  Globe,
  Phone,
  MapPin,
  KeyRound,
  Award,
  Sparkles,
  FileCode2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout, refreshUser } = useAuth();
  const currentYear = new Date().getFullYear();

  // College context state
  const [contextLoading, setContextLoading] = useState(true);
  const [adminCollege, setAdminCollege] = useState<CollegeAdminDto | null>(null);
  const [studentCollege, setStudentCollege] = useState<StudentCollegeDto | null>(null);
  const [examDashboard, setExamDashboard] = useState<StudentExamDashboardDto | null>(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeSuggestionDto[]>([]);

  // Unlinked onboarding mode switcher: "STUDENT" | "ADMIN"
  const [onboardingTab, setOnboardingTab] = useState<"STUDENT" | "ADMIN">("STUDENT");

  // Student link form state
  const [linkName, setLinkName] = useState("");
  const [linkCode, setLinkCode] = useState("");
  const [linkRoll, setLinkRoll] = useState("");
  const [linkStartYear, setLinkStartYear] = useState<number>(currentYear - 2);
  const [linkEndYear, setLinkEndYear] = useState<number>(currentYear + 2);
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);
  const [editingStudentLink, setEditingStudentLink] = useState(false);

  // Admin register / edit college form state
  const [editingCollege, setEditingCollege] = useState(false);
  const [colName, setColName] = useState("");
  const [colEmail, setColEmail] = useState("");
  const [colExpected, setColExpected] = useState<string>("100");
  const [colDept, setColDept] = useState("");
  const [colWebsite, setColWebsite] = useState("");
  const [colPhone, setColPhone] = useState("");
  const [colAddress, setColAddress] = useState("");
  const [colCity, setColCity] = useState("");
  const [colState, setColState] = useState("");
  const [colCountry, setColCountry] = useState("India");
  const [colInitialPlan, setColInitialPlan] = useState<string>("STARTER_MONTHLY");
  const [savingCollege, setSavingCollege] = useState(false);
  const [collegeError, setCollegeError] = useState<string | null>(null);
  const [collegeSuccess, setCollegeSuccess] = useState<string | null>(null);

  // Admin Contest Plan & Top-Up Purchase state
  const [planOptions, setPlanOptions] = useState<CollegePlanOptionDto[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseTab, setPurchaseTab] = useState<"TOPUP" | "PLANS">("TOPUP");
  const [topUpCount, setTopUpCount] = useState<number>(2);
  const [purchasingQuota, setPurchasingQuota] = useState(false);

  // Student exam activity tab
  const [examTab, setExamTab] = useState<"UPCOMING_ACTIVE" | "PAST_RESULTS" | "COLLEGE_HISTORY">("UPCOMING_ACTIVE");
  const [copiedId, setCopiedId] = useState(false);

  const filteredCollegeSuggestions = collegeSuggestions.filter((c) => {
    if (!linkName.trim()) return true;
    const q = linkName.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.collegeCode.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q)) ||
      (c.department && c.department.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  const populateAdminForm = useCallback((col: CollegeAdminDto) => {
    setColName(col.name || "");
    setColEmail(col.officialEmail || "");
    setColExpected(col.expectedStudents ? String(col.expectedStudents) : "");
    setColDept(col.department || "");
    setColWebsite(col.website || "");
    setColPhone(col.phone || "");
    setColAddress(col.address || "");
    setColCity(col.city || "");
    setColState(col.state || "");
    setColCountry(col.country || "India");
  }, []);

  const loadCollegeData = useCallback(async () => {
    if (!user) return;
    try {
      setContextLoading(true);
      const [ctx, suggestions, plans] = await Promise.all([
        getMyCollegeContext(),
        getCollegeSuggestions().catch(() => []),
        getCollegePlans().catch(() => []),
      ]);
      setAdminCollege(ctx.adminCollege);
      setStudentCollege(ctx.studentCollege);
      setCollegeSuggestions(suggestions);
      setPlanOptions(plans);

      if (ctx.adminCollege) {
        populateAdminForm(ctx.adminCollege);
        // If newly registered admin has not completed address or plan selection yet, open setup editor
        if (!ctx.adminCollege.address || ctx.adminCollege.contestQuotaTotal === 0) {
          setEditingCollege(true);
          if (ctx.adminCollege.contestQuotaTotal === 0) {
            setPurchaseTab("PLANS");
          }
        }
      } else if (user.email) {
        setColEmail(user.email);
      }

      if (ctx.studentCollege) {
        setLinkName(ctx.studentCollege.name);
        setLinkCode(ctx.studentCollege.collegeCode);
        setLinkRoll(ctx.studentCollege.rollNumber || "");
        setLinkStartYear(ctx.studentCollege.tenureStartYear || currentYear - 2);
        setLinkEndYear(ctx.studentCollege.tenureEndYear || currentYear + 2);
        const dash = await getStudentExamDashboard();
        setExamDashboard(dash);
        if (ctx.studentCollege.isTenureExpired || dash.isTenureExpired) {
          setExamTab("PAST_RESULTS");
        } else if (dash.active.length === 0 && dash.upcoming.length === 0 && dash.past.length > 0) {
          setExamTab("PAST_RESULTS");
        }
      }
    } catch (err) {
      console.error("Failed to load college context", err);
    } finally {
      setContextLoading(false);
    }
  }, [user, populateAdminForm, currentYear]);

  useEffect(() => {
    if (!isLoading && user) {
      loadCollegeData();
    }
  }, [isLoading, user, loadCollegeData]);

  const handleCopyCollegeId = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollegeError(null);
    setCollegeSuccess(null);

    if (!colName.trim() || !colEmail.trim()) {
      setCollegeError("College Full Name and Official College Email are mandatory.");
      return;
    }

    setSavingCollege(true);
    try {
      const parsedExpected = colExpected.trim() ? parseInt(colExpected.trim(), 10) : undefined;
      const payload = {
        name: colName.trim(),
        officialEmail: colEmail.trim(),
        expectedStudents: parsedExpected && parsedExpected > 0 ? parsedExpected : undefined,
        department: colDept.trim() || undefined,
        website: colWebsite.trim() || undefined,
        phone: colPhone.trim() || undefined,
        address: colAddress.trim() || undefined,
        city: colCity.trim() || undefined,
        state: colState.trim() || undefined,
        country: colCountry.trim() || "India",
        planCode: (!adminCollege || adminCollege.contestQuotaTotal === 0) ? colInitialPlan : undefined,
      };

      const saved = adminCollege
        ? await updateMyCollege(payload)
        : await registerCollege(payload);

      setAdminCollege(saved);
      populateAdminForm(saved);
      setEditingCollege(false);
      await refreshUser();
      setCollegeSuccess(
        adminCollege
          ? `College profile & plan updated! You have ${saved.contestsLeft} contest(s) available to schedule.`
          : `College registered! Your unique College ID is ${saved.collegeCode} with ${saved.contestsLeft} contest(s) ready.`
      );
    } catch (err: any) {
      setCollegeError(err.message || "Failed to save college details.");
    } finally {
      setSavingCollege(false);
    }
  };

  const handleSelectOrExtendPlan = async (planCode: string) => {
    setCollegeError(null);
    setCollegeSuccess(null);
    setPurchasingQuota(true);
    try {
      const updated = await selectOrExtendCollegePlan(planCode);
      setAdminCollege(updated);
      setShowPurchaseModal(false);
      setCollegeSuccess(
        `Plan activated! Your college now has ${updated.contestsLeft} contest(s) available to schedule.`
      );
    } catch (err: any) {
      setCollegeError(err.message || "Failed to update college plan.");
    } finally {
      setPurchasingQuota(false);
    }
  };

  const handlePurchaseTopUpContests = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollegeError(null);
    setCollegeSuccess(null);
    if (!topUpCount || topUpCount < 1) {
      setCollegeError("Please enter at least 1 contest to purchase.");
      return;
    }
    setPurchasingQuota(true);
    try {
      const updated = await purchaseAdditionalContests(Number(topUpCount));
      setAdminCollege(updated);
      setShowPurchaseModal(false);
      setCollegeSuccess(
        `Successfully purchased +${topUpCount} contest(s)! You now have ${updated.contestsLeft} contest(s) left.`
      );
    } catch (err: any) {
      setCollegeError(err.message || "Failed to purchase additional contests.");
    } finally {
      setPurchasingQuota(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setLinkSuccess(null);

    if (!linkName.trim()) {
      setLinkError("College Name is mandatory to register as a student.");
      return;
    }
    if (!linkRoll.trim()) {
      setLinkError("Roll No. / Student ID is mandatory to register as a student.");
      return;
    }
    if (!linkEndYear || linkEndYear < 1990 || linkEndYear > 2055) {
      setLinkError("Please provide a valid Graduation / Tenure Passing Year.");
      return;
    }
    if (linkStartYear && linkEndYear < linkStartYear) {
      setLinkError("Graduation / Passing Year cannot be earlier than Admission / Start Year.");
      return;
    }

    setLinking(true);
    try {
      const linked = await linkStudentCollege({
        collegeName: linkName.trim(),
        collegeCode: linkCode.trim().toUpperCase(),
        rollNumber: linkRoll.trim(),
        tenureStartYear: linkStartYear ? Number(linkStartYear) : undefined,
        tenureEndYear: Number(linkEndYear),
      });
      setStudentCollege(linked);
      setEditingStudentLink(false);
      await refreshUser();
      if (linked.isTenureExpired) {
        setLinkSuccess(
          `Your tenure (${linked.tenureStartYear ? `${linked.tenureStartYear}–` : ""}${linked.tenureEndYear}) has ended. Candidate profile works only during active tenure time.`
        );
        setExamDashboard(null);
      } else {
        setLinkSuccess(
          `Registered as a student of ${linked.name} (${linked.collegeCode})! The Contests tab is now unlocked with your college's upcoming and past contests.`
        );
        const dash = await getStudentExamDashboard();
        setExamDashboard(dash);
      }
    } catch (err: any) {
      setLinkError(
        err.message || "Could not verify college details. Select a college from suggestions or check the Unique ID."
      );
    } finally {
      setLinking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-slate-500">Loading your profile...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-foreground inline-flex items-center space-x-1.5 mb-2 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Profile &amp; Institutional Hub
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Manage your account identity, college affiliation, and university examination records.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs border border-rose-500/20 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Account Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-extrabold text-white shadow-lg shadow-brand-600/25 shrink-0">
                {user.name ? user.name[0].toUpperCase() : <User className="h-8 w-8" />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  {adminCollege ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/25 font-bold font-mono">
                      COLLEGE ADMIN
                    </span>
                  ) : studentCollege && !studentCollege.isTenureExpired ? (
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-bold font-mono">
                      COLLEGE STUDENT
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    Authenticated Session
                  </span>
                  {user.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {adminCollege && (
              <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-brand-300 block">
                    College Unique ID
                  </span>
                  <span className="font-mono text-lg font-extrabold text-foreground tracking-wider">
                    {adminCollege.collegeCode}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCollegeId(adminCollege.collegeCode)}
                  className="p-2 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-foreground transition"
                  title="Copy College Unique ID"
                >
                  {copiedId ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-brand-400" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            COLLEGE & EXAMINATION SECTION
           ===================================================================== */}
        {contextLoading ? (
          <div className="p-12 rounded-3xl bg-surface border border-surface-border flex flex-col items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-brand-500 mb-3" />
            <p className="text-xs text-slate-400">Loading institutional affiliation &amp; exam records...</p>
          </div>
        ) : adminCollege ? (
          /* ===================================================================
             MODE A: REGISTERED COLLEGE ADMIN VIEW + EDIT DETAILS
             =================================================================== */
          <div className="space-y-6">
            <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-lg">
              {/* Banner */}
              <div className="bg-gradient-to-r from-brand-600/20 via-purple-600/10 to-surface p-6 sm:p-8 border-b border-surface-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Registered Institution</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-foreground">{adminCollege.name}</h2>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Share the <strong>College Name</strong> and <strong>College Unique ID</strong> below with your students so they can link their profiles and attend college examinations.
                  </p>
                </div>

                {/* Unique ID Passcard */}
                <div className="p-5 rounded-2xl bg-background border-2 border-brand-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Official College Unique ID
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-brand-400 tracking-widest mt-0.5">
                      {adminCollege.collegeCode}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Mandatory for student profile verification
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCollegeId(adminCollege.collegeCode)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-md shadow-brand-600/25"
                  >
                    {copiedId ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {collegeSuccess && (
                <div className="mx-6 mt-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{collegeSuccess}</span>
                </div>
              )}

              {/* Metrics + Contest Quota Left + Purchase More Button */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Prominent Contest Quota & Purchase Bar */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-brand-500/15 via-purple-500/10 to-background border border-brand-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                        {adminCollege.planName || "No Active Plan"}
                      </span>
                      {adminCollege.planExpiresAt && (
                        <span className="text-[11px] text-slate-400">
                          Valid till {new Date(adminCollege.planExpiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
                        {adminCollege.contestsLeft} Contest{adminCollege.contestsLeft === 1 ? "" : "s"} Left
                      </span>
                      <span className="text-xs text-slate-400">
                        ({adminCollege.contestsUsed} scheduled out of {adminCollege.contestQuotaTotal} total quota)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {adminCollege.contestsLeft > 0
                        ? `You can schedule ${adminCollege.contestsLeft} more coding examination(s) under your current quota.`
                        : "Your contest quota is exhausted (0 left). Purchase extra contests or extend your plan to schedule more examinations."}
                    </p>
                  </div>

                  {/* Beside the Contests Left count: Purchase More Contests / Extend Plan buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setCollegeError(null);
                        setCollegeSuccess(null);
                        setPurchaseTab("TOPUP");
                        setShowPurchaseModal(!showPurchaseModal);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-amber-500/20"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Purchase More Contests</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCollegeError(null);
                        setCollegeSuccess(null);
                        setPurchaseTab("PLANS");
                        setShowPurchaseModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-foreground font-bold text-xs transition"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                      <span>{adminCollege.contestQuotaTotal === 0 ? "Choose Plan" : "Extend / Upgrade Plan"}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Purchase Contests / Extend Plan Panel */}
                {showPurchaseModal && (
                  <div className="p-6 rounded-2xl bg-background border-2 border-brand-500/40 shadow-xl space-y-5 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
                      <div>
                        <h3 className="text-base font-extrabold text-foreground">
                          Increase Your College Contest Quota
                        </h3>
                        <p className="text-xs text-slate-400">
                          Purchase individual extra contests (added directly to your existing plan) or extend/upgrade your subscription plan.
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface border border-surface-border self-start">
                        <button
                          type="button"
                          onClick={() => setPurchaseTab("TOPUP")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            purchaseTab === "TOPUP"
                              ? "bg-brand-600 text-white"
                              : "text-slate-400 hover:text-foreground"
                          }`}
                        >
                          Buy Extra Contests
                        </button>
                        <button
                          type="button"
                          onClick={() => setPurchaseTab("PLANS")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            purchaseTab === "PLANS"
                              ? "bg-brand-600 text-white"
                              : "text-slate-400 hover:text-foreground"
                          }`}
                        >
                          3 / 6 / 20 Contest Plans
                        </button>
                      </div>
                    </div>

                    {collegeError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{collegeError}</span>
                      </div>
                    )}

                    {purchaseTab === "TOPUP" ? (
                      <form onSubmit={handlePurchaseTopUpContests} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <div className="space-y-2">
                            <label className="block font-bold text-slate-300">
                              How many additional contests do you need?
                            </label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 5, 10].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setTopUpCount(preset)}
                                  className={`px-3 py-2 rounded-xl border font-bold transition ${
                                    topUpCount === preset
                                      ? "bg-brand-600 text-white border-brand-500"
                                      : "bg-surface border-surface-border text-slate-300 hover:border-brand-500/40"
                                  }`}
                                >
                                  +{preset}
                                </button>
                              ))}
                              <input
                                type="number"
                                min={1}
                                max={200}
                                value={topUpCount}
                                onChange={(e) => setTopUpCount(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-24 px-3 py-2 rounded-xl bg-surface border border-surface-border text-foreground font-bold text-center"
                              />
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Rate under your current tier:{" "}
                              <strong className="text-foreground">
                                ₹{adminCollege.topUpPricePerContestInr || 499} per contest
                              </strong>
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-surface border border-surface-border flex items-center justify-between">
                            <div>
                              <div className="text-[11px] text-slate-400 font-semibold">Total Top-Up Cost</div>
                              <div className="text-2xl font-extrabold text-amber-400">
                                ₹{((topUpCount || 1) * (adminCollege.topUpPricePerContestInr || 499)).toLocaleString("en-IN")}
                              </div>
                              <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                                New quota: {adminCollege.contestsLeft} + {topUpCount || 1} ={" "}
                                {adminCollege.contestsLeft + (topUpCount || 1)} Contests Left
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={purchasingQuota}
                              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md disabled:opacity-50"
                            >
                              {purchasingQuota && <Loader2 className="h-4 w-4 animate-spin" />}
                              <span>
                                Purchase +{topUpCount || 1} Contest{(topUpCount || 1) > 1 ? "s" : ""}
                              </span>
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {(planOptions.length > 0
                          ? planOptions
                          : [
                              {
                                planCode: "STARTER_MONTHLY",
                                name: "Starter Plan (3 Contests / Month)",
                                contestsIncluded: 3,
                                periodLabel: "per month",
                                priceInr: 1499,
                                topUpPricePerContestInr: 499,
                                description: "Includes 3 proctored college contests per month.",
                              },
                              {
                                planCode: "GROWTH_MONTHLY",
                                name: "Growth Plan (6 Contests / Month)",
                                contestsIncluded: 6,
                                periodLabel: "per month",
                                priceInr: 2499,
                                topUpPricePerContestInr: 399,
                                description: "Includes 6 proctored college contests per month.",
                              },
                              {
                                planCode: "CAMPUS_YEARLY",
                                name: "Campus Annual (20 Contests / Year)",
                                contestsIncluded: 20,
                                periodLabel: "per year",
                                priceInr: 6999,
                                topUpPricePerContestInr: 349,
                                description: "Includes 20 proctored college contests per year.",
                              },
                            ]
                        ).map((plan) => {
                          const isCurrent = adminCollege.planCode === plan.planCode;
                          return (
                            <div
                              key={plan.planCode}
                              className={`p-5 rounded-2xl border flex flex-col justify-between gap-4 ${
                                isCurrent
                                  ? "bg-brand-500/10 border-brand-500"
                                  : "bg-surface border-surface-border"
                              }`}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-500/20 text-brand-300">
                                    +{plan.contestsIncluded} CONTESTS
                                  </span>
                                  {isCurrent && (
                                    <span className="text-[10px] font-bold text-emerald-400">Current Plan</span>
                                  )}
                                </div>
                                <h4 className="text-sm font-extrabold text-foreground">{plan.name}</h4>
                                <div className="text-xl font-extrabold text-foreground">
                                  ₹{plan.priceInr.toLocaleString("en-IN")}{" "}
                                  <span className="text-xs font-normal text-slate-400">{plan.periodLabel}</span>
                                </div>
                                <p className="text-[11px] text-slate-400">{plan.description}</p>
                                <div className="text-[11px] text-slate-300">
                                  Add-on top-up rate: <strong>₹{plan.topUpPricePerContestInr}/contest</strong>
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={purchasingQuota}
                                onClick={() => handleSelectOrExtendPlan(plan.planCode)}
                                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition disabled:opacity-50"
                              >
                                {isCurrent
                                  ? `Extend (+${plan.contestsIncluded} Contests)`
                                  : `Select Plan (+${plan.contestsIncluded} Contests)`}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowPurchaseModal(false)}
                        className="text-xs text-slate-400 hover:text-foreground"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-background border border-surface-border">
                    <span className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Expected Student Capacity</span>
                      <Users className="h-4 w-4 text-brand-400" />
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {adminCollege.expectedStudents ? adminCollege.expectedStudents.toLocaleString() : "Optional"}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-surface-border">
                    <span className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Verified Linked Students</span>
                      <GraduationCap className="h-4 w-4 text-emerald-400" />
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                      {adminCollege.linkedStudents.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-surface-border">
                    <span className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Contests Left / Scheduled</span>
                      <Trophy className="h-4 w-4 text-amber-400" />
                    </span>
                    <div className="text-2xl font-extrabold text-amber-400 mt-1">
                      {adminCollege.contestsLeft} left{" "}
                      <span className="text-xs font-normal text-slate-400">
                        ({adminCollege.contestsUsed} used)
                      </span>
                    </div>
                  </div>
                </div>

                {!editingCollege ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                      <div className="p-4 rounded-2xl bg-background border border-surface-border space-y-2.5">
                        <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                          Primary Institution Details
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">College Name:</span>
                          <span className="font-semibold text-foreground">{adminCollege.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Official Email:</span>
                          <span className="font-mono text-foreground">{adminCollege.officialEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Department:</span>
                          <span className="text-foreground">{adminCollege.department || "All Engineering / CS"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expected Students:</span>
                          <span className="font-semibold text-foreground">
                            {adminCollege.expectedStudents || "Optional"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Active Plan:</span>
                          <span className="font-semibold text-brand-400">
                            {adminCollege.planName} ({adminCollege.contestsLeft} left)
                          </span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-background border border-surface-border space-y-2.5">
                        <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                          Additional Campus Details
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-foreground">
                            {[adminCollege.city, adminCollege.state, adminCollege.country]
                              .filter(Boolean)
                              .join(", ") || "Not specified"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Website:</span>
                          <span className="text-brand-400 truncate max-w-[200px]">
                            {adminCollege.website || "Not added yet"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Contact Phone:</span>
                          <span className="text-foreground">{adminCollege.phone || "Not added yet"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Address:</span>
                          <span className="text-foreground truncate max-w-[220px]">
                            {adminCollege.address || "Not added yet"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-border">
                      <button
                        onClick={() => {
                          setCollegeError(null);
                          setCollegeSuccess(null);
                          populateAdminForm(adminCollege);
                          setEditingCollege(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-border border border-surface-border text-foreground text-xs font-bold transition"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-brand-400" />
                        <span>Modify / Add More College Details</span>
                      </button>

                      <Link
                        href="/admin/contests"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-lg shadow-brand-600/25"
                      >
                        <Trophy className="h-4 w-4" />
                        <span>Manage College Examinations</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </>
                ) : (
                  /* Admin Edit College Form */
                  <form onSubmit={handleSaveCollege} className="space-y-4 pt-2 text-xs">
                    <div className="flex items-center justify-between border-b border-surface-border pb-3">
                      <h3 className="text-sm font-bold text-foreground">
                        Update / Add College Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingCollege(false)}
                        className="text-slate-400 hover:text-foreground text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    {collegeError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{collegeError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          College Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Indian Institute of Technology Delhi"
                          value={colName}
                          onChange={(e) => setColName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Official College Email ID *
                        </label>
                        <input
                          type="email"
                          required
                          value={colEmail}
                          onChange={(e) => setColEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-300 mb-1">
                          Campus Address *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Full campus street address (e.g. Hauz Khas, New Delhi)"
                          value={colAddress}
                          onChange={(e) => setColAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Number of Expected Students (Optional)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100000}
                          placeholder="Optional (e.g. 150)"
                          value={colExpected}
                          onChange={(e) => setColExpected(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      {adminCollege.contestQuotaTotal === 0 && (
                        <div className="sm:col-span-2 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 space-y-2.5">
                          <label className="block font-bold text-brand-300">
                            Choose Your College Contest Plan *
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { code: "STARTER_MONTHLY", label: "3 Contests / Month", price: "₹1,499/mo" },
                              { code: "GROWTH_MONTHLY", label: "6 Contests / Month", price: "₹2,499/mo" },
                              { code: "CAMPUS_YEARLY", label: "20 Contests / Year", price: "₹6,999/yr" },
                            ].map((p) => (
                              <button
                                key={p.code}
                                type="button"
                                onClick={() => setColInitialPlan(p.code)}
                                className={`p-3 rounded-xl border text-left transition ${
                                  colInitialPlan === p.code
                                    ? "bg-brand-600 text-white border-brand-500 font-bold"
                                    : "bg-background border-surface-border text-slate-300"
                                }`}
                              >
                                <div className="text-xs font-extrabold">{p.label}</div>
                                <div className="text-[11px] opacity-80 mt-0.5">{p.price}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Department / Faculty
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Dept. of Computer Science & Engineering"
                          value={colDept}
                          onChange={(e) => setColDept(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Official Website
                        </label>
                        <input
                          type="text"
                          placeholder="https://www.college.edu.in"
                          value={colWebsite}
                          onChange={(e) => setColWebsite(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Contact Phone Number
                        </label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={colPhone}
                          onChange={(e) => setColPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">City</label>
                        <input
                          type="text"
                          placeholder="e.g. New Delhi"
                          value={colCity}
                          onChange={(e) => setColCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">State</label>
                        <input
                          type="text"
                          placeholder="e.g. Delhi"
                          value={colState}
                          onChange={(e) => setColState(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-300 mb-1">
                          Campus Address
                        </label>
                        <input
                          type="text"
                          placeholder="Full campus street address"
                          value={colAddress}
                          onChange={(e) => setColAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingCollege(false)}
                        className="px-4 py-2 rounded-xl bg-surface-subtle text-foreground font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingCollege}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition disabled:opacity-50"
                      >
                        {savingCollege && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        <span>Save College Details</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : studentCollege && !studentCollege.isTenureExpired ? (
          /* ===================================================================
             MODE B: ACTIVE STUDENT CANDIDATE VIEW (WORKS ONLY DURING ACTIVE TENURE)
             =================================================================== */
          <div className="space-y-8">
            {/* Student Linked College Full Details Card */}
            <div className="rounded-3xl bg-surface border border-surface-border p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Active College Candidate — Contests Unlocked</span>
                    </span>

                    {studentCollege.tenureEndYear && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-surface-border text-xs font-semibold text-slate-300">
                        <Calendar className="h-3.5 w-3.5 text-brand-400" />
                        <span>
                          Active Tenure: {studentCollege.tenureStartYear ? `${studentCollege.tenureStartYear} – ` : "Graduating "}
                          {studentCollege.tenureEndYear}
                        </span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {studentCollege.name}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/25">
                      <span>College ID:</span>
                      <strong className="font-mono text-brand-400">{studentCollege.collegeCode}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyCollegeId(studentCollege.collegeCode)}
                        className="ml-1 text-slate-400 hover:text-foreground transition"
                        title="Copy College ID"
                      >
                        {copiedId ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </span>

                    {studentCollege.rollNumber && (
                      <span>
                        Roll / Student ID:{" "}
                        <strong className="font-mono text-foreground">{studentCollege.rollNumber}</strong>
                      </span>
                    )}

                    {studentCollege.department && (
                      <>
                        <span>•</span>
                        <span>{studentCollege.department}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start">
                  <Link
                    href="/contests"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-md shadow-brand-600/20"
                  >
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Open College Contests (Upcoming &amp; Past)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      setLinkError(null);
                      setLinkSuccess(null);
                      setEditingStudentLink(!editingStudentLink);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-border border border-surface-border text-xs font-semibold text-foreground transition"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-brand-400" />
                    <span>{editingStudentLink ? "Close Editor" : "Update Student Details"}</span>
                  </button>
                </div>
              </div>

              {/* Full College Details Grid for Candidate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-surface-border text-xs">
                <div className="p-3.5 rounded-2xl bg-background border border-surface-border">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-brand-400" />
                    <span>Campus Location</span>
                  </div>
                  <div className="font-bold text-foreground truncate">
                    {[studentCollege.city, studentCollege.state, studentCollege.country || "India"]
                      .filter(Boolean)
                      .join(", ") || "India"}
                  </div>
                  {studentCollege.address && (
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{studentCollege.address}</div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-surface-border">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5 text-purple-400" />
                    <span>Official College Contact</span>
                  </div>
                  <div className="font-bold text-foreground truncate">
                    {studentCollege.officialEmail || "Verified Institution"}
                  </div>
                  {studentCollege.phone && (
                    <div className="text-[11px] text-slate-500 mt-0.5">{studentCollege.phone}</div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-surface-border">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>College Cohort</span>
                  </div>
                  <div className="font-bold text-foreground">
                    {studentCollege.linkedStudents ?? 1} Linked Students
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Capacity: {studentCollege.expectedStudents ?? 100} candidates
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-surface-border">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    <span>College Contest History</span>
                  </div>
                  <div className="font-bold text-foreground">
                    {studentCollege.totalContests ?? 0} Examinations Conducted
                  </div>
                  {studentCollege.website ? (
                    <a
                      href={studentCollege.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-brand-400 hover:underline truncate block mt-0.5"
                    >
                      {studentCollege.website}
                    </a>
                  ) : (
                    <div className="text-[11px] text-slate-500 mt-0.5">Official Katasphere Partner</div>
                  )}
                </div>
              </div>

              {linkSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{linkSuccess}</span>
                </div>
              )}

              {editingStudentLink && (
                <form
                  onSubmit={handleLinkStudent}
                  className="pt-6 border-t border-surface-border space-y-4 text-xs"
                >
                  {linkError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{linkError}</span>
                    </div>
                  )}

                  {/* Saved Colleges in DB as Suggestions */}
                  {collegeSuggestions.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-300">
                        Saved Colleges in Katasphere (Click a suggestion to auto-fill Name &amp; College ID):
                      </label>
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                        {filteredCollegeSuggestions.map((col) => {
                          const isSelected = linkCode.toUpperCase() === col.collegeCode.toUpperCase();
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => {
                                setLinkName(col.name);
                                setLinkCode(col.collegeCode);
                              }}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-left transition ${
                                isSelected
                                  ? "bg-brand-500/15 border-brand-500 text-brand-300 font-bold"
                                  : "bg-background border-surface-border text-slate-300 hover:border-brand-500/40"
                              }`}
                            >
                              {isSelected && <Check className="h-3.5 w-3.5 text-brand-400" />}
                              <span>{col.name}</span>
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">
                                {col.collegeCode}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">College Name *</label>
                      <input
                        type="text"
                        required
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Roll No. / Student ID *</label>
                      <input
                        type="text"
                        required
                        value={linkRoll}
                        onChange={(e) => setLinkRoll(e.target.value)}
                        placeholder="e.g. 2026CS1042"
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">College Unique ID</label>
                      <input
                        type="text"
                        value={linkCode}
                        onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Admission / Tenure Start Year *
                      </label>
                      <input
                        type="number"
                        required
                        min={1995}
                        max={2040}
                        value={linkStartYear}
                        onChange={(e) => setLinkStartYear(parseInt(e.target.value) || currentYear - 2)}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Graduation / Tenure Passing Year *{" "}
                        <span className="text-[11px] font-normal text-slate-400">
                          (Candidate profile works only during active tenure)
                        </span>
                      </label>
                      <input
                        type="number"
                        required
                        min={1995}
                        max={2045}
                        value={linkEndYear}
                        onChange={(e) => setLinkEndYear(parseInt(e.target.value) || currentYear + 2)}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={linking}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
                    >
                      {linking && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Save Student Details</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Student Performance KPIs */}
            {examDashboard && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Examinations Attempted</span>
                    <FileCode2 className="h-4 w-4 text-brand-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-foreground">
                    {examDashboard.examsAttempted}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {studentCollege.isTenureExpired
                      ? `Graduated Batch of ${studentCollege.tenureEndYear}`
                      : `${examDashboard.active.length} active • ${examDashboard.upcoming.length} upcoming`}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Best Contest Rank</span>
                    <Trophy className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-amber-400">
                    {examDashboard.bestRank ? `#${examDashboard.bestRank}` : "—"}
                  </div>
                  <span className="text-[11px] text-slate-500">Across completed college contests</span>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Average Score</span>
                    <Award className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-400">
                    {examDashboard.averageScorePercent}%
                  </div>
                  <span className="text-[11px] text-slate-500">On graded past examinations</span>
                </div>
              </div>
            )}

            {/* College Examination Activities, Past Results & College History */}
            <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
              <div className="p-6 border-b border-surface-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {studentCollege.isTenureExpired
                      ? `${studentCollege.name} — Past Results & College Examination History`
                      : "College Examinations, Past Ranks & Institution History"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {studentCollege.isTenureExpired
                      ? "Active contests are hidden because your tenure has ended. View your past contest ranks and your college's contest history below."
                      : "Attend live or upcoming college examinations, inspect your past ranks, and browse your college's complete contest history."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-background border border-surface-border self-start lg:self-auto">
                  {!studentCollege.isTenureExpired && (
                    <button
                      onClick={() => setExamTab("UPCOMING_ACTIVE")}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        examTab === "UPCOMING_ACTIVE"
                          ? "bg-brand-600 text-white"
                          : "text-slate-400 hover:text-foreground"
                      }`}
                    >
                      Live &amp; Upcoming (
                      {(examDashboard?.active.length || 0) + (examDashboard?.upcoming.length || 0)})
                    </button>
                  )}
                  <button
                    onClick={() => setExamTab("PAST_RESULTS")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      examTab === "PAST_RESULTS"
                        ? "bg-brand-600 text-white"
                        : "text-slate-400 hover:text-foreground"
                    }`}
                  >
                    My Past Ranks ({examDashboard?.past.length || 0})
                  </button>
                  <button
                    onClick={() => setExamTab("COLLEGE_HISTORY")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      examTab === "COLLEGE_HISTORY"
                        ? "bg-brand-600 text-white"
                        : "text-slate-400 hover:text-foreground"
                    }`}
                  >
                    College&apos;s History ({examDashboard?.collegeHistory?.length || 0})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {examTab === "UPCOMING_ACTIVE" && !studentCollege.isTenureExpired ? (
                  <div className="space-y-4">
                    {[...(examDashboard?.active || []), ...(examDashboard?.upcoming || [])].length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-500">
                        No live or upcoming examinations scheduled for {studentCollege.name} right now.
                      </div>
                    ) : (
                      [...(examDashboard?.active || []), ...(examDashboard?.upcoming || [])].map(
                        (exam: ExamSummaryDto) => (
                          <div
                            key={exam.contestId}
                            className="p-5 rounded-2xl bg-background border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/40 transition"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {exam.status === "ACTIVE" ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    LIVE NOW
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                    <Clock className="h-3 w-3" />
                                    UPCOMING
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 font-medium">
                                  {exam.collegeName}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-foreground">{exam.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>Duration: {exam.durationMinutes} mins</span>
                                <span>•</span>
                                <span>
                                  {exam.totalProblems} problems ({exam.maxScore} pts)
                                </span>
                                <span>•</span>
                                <span>
                                  Starts: {new Date(exam.startTime).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {exam.score !== null && exam.score !== undefined && (
                                <div className="text-right mr-2">
                                  <div className="text-xs text-slate-400">Current Score</div>
                                  <div className="text-sm font-extrabold text-emerald-400">
                                    {exam.score} / {exam.maxScore} pts
                                  </div>
                                </div>
                              )}
                              <Link
                                href={`/contests/${exam.slug}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-sm"
                              >
                                <span>{exam.status === "ACTIVE" ? "Enter Exam Hall" : "View Waiting Room"}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                ) : examTab === "COLLEGE_HISTORY" ? (
                  /* COLLEGE'S COMPLETE EXAMINATION HISTORY */
                  <div className="space-y-4">
                    {(examDashboard?.collegeHistory || []).length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-500">
                        {studentCollege.name} has not concluded any past examinations yet.
                      </div>
                    ) : (
                      (examDashboard?.collegeHistory || []).map((exam: ExamSummaryDto) => {
                        const attended = exam.participationStatus && exam.participationStatus !== "ABSENT";
                        return (
                          <div
                            key={exam.contestId}
                            className="p-5 rounded-2xl bg-background border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/15 text-brand-400 border border-brand-500/30">
                                  {studentCollege.collegeCode} ARCHIVE
                                </span>
                                <span className="text-xs text-slate-400">
                                  Concluded{" "}
                                  {new Date(exam.endTime).toLocaleDateString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-300 font-semibold">
                                  {exam.totalParticipants || 0} College Candidates Participated
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-foreground">{exam.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>Duration: {exam.durationMinutes} mins</span>
                                <span>•</span>
                                <span>
                                  {exam.totalProblems} Problems ({exam.maxScore} max pts)
                                </span>
                                {attended && (
                                  <>
                                    <span>•</span>
                                    <span className="text-emerald-400 font-semibold">
                                      Your Score: {exam.score ?? 0}/{exam.maxScore} pts (Rank #{exam.rank})
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <Link
                                href={`/contests/${exam.slug}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-xs font-semibold text-foreground transition"
                              >
                                <span>View College Leaderboard</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  /* PAST CONTEST RESULTS WITH RANK */
                  <div className="space-y-4">
                    {(examDashboard?.past || []).length === 0 ? (
                      <div className="text-center py-12 text-xs text-slate-500">
                        No past examinations recorded yet. Once an examination concludes, your score and rank will appear here.
                      </div>
                    ) : (
                      (examDashboard?.past || []).map((exam: ExamSummaryDto) => {
                        const attended = exam.participationStatus && exam.participationStatus !== "ABSENT";
                        return (
                          <div
                            key={exam.contestId}
                            className="p-5 rounded-2xl bg-background border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
                                  COMPLETED
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(exam.endTime).toLocaleDateString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-foreground">{exam.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span>
                                  Problems Solved:{" "}
                                  <strong className="text-foreground">
                                    {exam.solvedProblems ?? 0} / {exam.totalProblems}
                                  </strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Status:{" "}
                                  <strong
                                    className={
                                      exam.participationStatus === "FLAGGED_VIOLATION"
                                        ? "text-rose-400"
                                        : attended
                                        ? "text-emerald-400"
                                        : "text-slate-500"
                                    }
                                  >
                                    {exam.participationStatus || "ABSENT"}
                                  </strong>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 shrink-0">
                              {attended ? (
                                <>
                                  <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                                    <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300">
                                      Contest Rank
                                    </div>
                                    <div className="text-lg font-extrabold text-amber-400">
                                      #{exam.rank}{" "}
                                      <span className="text-xs font-normal text-slate-400">
                                        / {exam.totalParticipants || 1}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-center">
                                    <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-300">
                                      Final Score
                                    </div>
                                    <div className="text-lg font-extrabold text-emerald-400">
                                      {exam.score ?? 0}{" "}
                                      <span className="text-xs font-normal text-slate-400">
                                        / {exam.maxScore} pts
                                      </span>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <span className="px-3 py-1.5 rounded-xl bg-surface text-xs text-slate-500 border border-surface-border">
                                  Did Not Attend
                                </span>
                              )}

                              <Link
                                href={`/contests/${exam.slug}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-subtle border border-surface-border text-xs font-semibold text-foreground transition"
                              >
                                <span>Standings</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ===================================================================
             MODE C: USER / EXPIRED TENURE — REGISTER YOURSELF AS A STUDENT
             =================================================================== */
          <div className="space-y-6">
            {studentCollege && studentCollege.isTenureExpired && (
              <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="space-y-1 text-xs">
                  <h3 className="text-base font-extrabold text-amber-300">
                    Candidate Profile Tenure Expired ({studentCollege.tenureStartYear ? `${studentCollege.tenureStartYear}–` : ""}{studentCollege.tenureEndYear})
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Your registered tenure at <strong>{studentCollege.name}</strong> ({studentCollege.collegeCode}) ended in <strong>{studentCollege.tenureEndYear}</strong>. Because a candidate profile works only during your active college tenure period, the Contests tab and college examination profile are currently deactivated. If you are enrolled in an active degree program, update your student tenure below.
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-lg">
              <div className="p-6 sm:p-8 border-b border-surface-border bg-gradient-to-br from-brand-600/10 via-surface to-surface">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-400 text-xs font-bold mb-2">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Student Registration</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Register Yourself as a College Student
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Enter your <strong>College Name</strong>, mandatory <strong>Roll No. / Student ID</strong>, and <strong>Tenure Years</strong> to unlock the <strong>Contests</strong> tab with your college&apos;s upcoming and past contests.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handleLinkStudent} className="space-y-5 max-w-3xl text-xs">
                  {linkError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{linkError}</span>
                    </div>
                  )}

                  {linkSuccess && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{linkSuccess}</span>
                    </div>
                  )}

                  {/* Saved Colleges Suggestions from DB */}
                  {collegeSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-brand-400" />
                          <span>Saved Colleges in Katasphere (Click your college to auto-fill Name &amp; College ID)</span>
                        </label>
                        <span className="text-[11px] text-slate-500">
                          {filteredCollegeSuggestions.length} registered
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto pr-1">
                        {filteredCollegeSuggestions.map((col) => {
                          const isSelected = linkCode.toUpperCase() === col.collegeCode.toUpperCase();
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => {
                                setLinkName(col.name);
                                setLinkCode(col.collegeCode);
                              }}
                              className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-brand-500/15 border-brand-500 shadow-sm"
                                  : "bg-background border-surface-border hover:border-brand-500/40"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="font-bold text-foreground truncate flex items-center gap-1.5">
                                  {isSelected && <Check className="h-3.5 w-3.5 text-brand-400 shrink-0" />}
                                  <span className="truncate">{col.name}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {[col.department, col.city, col.state].filter(Boolean).join(" • ") ||
                                    `${col.linkedStudents} students • ${col.totalContests} contests`}
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                                  College ID
                                </div>
                                <span className="inline-block font-mono text-xs px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 font-extrabold border border-brand-500/30">
                                  {col.collegeCode}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        College / University Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Search or select your college (e.g. IIT Bombay)"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Roll No. / Student ID <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2026CS1042"
                        value={linkRoll}
                        onChange={(e) => setLinkRoll(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        College Unique ID (Auto-filled on selection)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. KS-57BMQ9"
                        value={linkCode}
                        onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono uppercase tracking-wider placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1.5">
                          Admission Year <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={1995}
                          max={2040}
                          value={linkStartYear}
                          onChange={(e) => setLinkStartYear(parseInt(e.target.value) || currentYear - 2)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1.5">
                          Passing Year <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min={1995}
                          max={2045}
                          value={linkEndYear}
                          onChange={(e) => setLinkEndYear(parseInt(e.target.value) || currentYear + 2)}
                          className="w-full px-3 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Note: Your candidate profile and access to the <strong>Contests</strong> tab remain active only during your college tenure period (until <strong>{linkEndYear}</strong>).
                  </p>

                  <button
                    type="submit"
                    disabled={linking}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-600/25 disabled:opacity-50"
                  >
                    {linking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Registering Student Profile...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Register as Student &amp; Unlock Contests</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
