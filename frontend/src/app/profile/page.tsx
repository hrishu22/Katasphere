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
} from "@/lib/contest-api";
import {
  CollegeAdminDto,
  StudentCollegeDto,
  StudentExamDashboardDto,
  ExamSummaryDto,
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
  const { user, isLoading, logout } = useAuth();

  // College context state
  const [contextLoading, setContextLoading] = useState(true);
  const [adminCollege, setAdminCollege] = useState<CollegeAdminDto | null>(null);
  const [studentCollege, setStudentCollege] = useState<StudentCollegeDto | null>(null);
  const [examDashboard, setExamDashboard] = useState<StudentExamDashboardDto | null>(null);

  // Unlinked onboarding mode switcher: "STUDENT" | "ADMIN"
  const [onboardingTab, setOnboardingTab] = useState<"STUDENT" | "ADMIN">("STUDENT");

  // Student link form state
  const [linkName, setLinkName] = useState("");
  const [linkCode, setLinkCode] = useState("");
  const [linkRoll, setLinkRoll] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState<string | null>(null);
  const [editingStudentLink, setEditingStudentLink] = useState(false);

  // Admin register / edit college form state
  const [editingCollege, setEditingCollege] = useState(false);
  const [colName, setColName] = useState("");
  const [colEmail, setColEmail] = useState("");
  const [colExpected, setColExpected] = useState<number>(100);
  const [colDept, setColDept] = useState("");
  const [colWebsite, setColWebsite] = useState("");
  const [colPhone, setColPhone] = useState("");
  const [colAddress, setColAddress] = useState("");
  const [colCity, setColCity] = useState("");
  const [colState, setColState] = useState("");
  const [colCountry, setColCountry] = useState("India");
  const [savingCollege, setSavingCollege] = useState(false);
  const [collegeError, setCollegeError] = useState<string | null>(null);
  const [collegeSuccess, setCollegeSuccess] = useState<string | null>(null);

  // Student exam activity tab
  const [examTab, setExamTab] = useState<"UPCOMING_ACTIVE" | "PAST_RESULTS">("UPCOMING_ACTIVE");
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  const populateAdminForm = useCallback((col: CollegeAdminDto) => {
    setColName(col.name || "");
    setColEmail(col.officialEmail || "");
    setColExpected(col.expectedStudents || 100);
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
      const ctx = await getMyCollegeContext();
      setAdminCollege(ctx.adminCollege);
      setStudentCollege(ctx.studentCollege);

      if (ctx.adminCollege) {
        populateAdminForm(ctx.adminCollege);
      } else if (user.email) {
        setColEmail(user.email);
      }

      if (ctx.studentCollege) {
        setLinkName(ctx.studentCollege.name);
        setLinkCode(ctx.studentCollege.collegeCode);
        setLinkRoll(ctx.studentCollege.rollNumber || "");
        const dash = await getStudentExamDashboard();
        setExamDashboard(dash);
        if (dash.active.length === 0 && dash.upcoming.length === 0 && dash.past.length > 0) {
          setExamTab("PAST_RESULTS");
        }
      }
    } catch (err) {
      console.error("Failed to load college context", err);
    } finally {
      setContextLoading(false);
    }
  }, [user, populateAdminForm]);

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

    if (!colName.trim() || !colEmail.trim() || !colExpected || colExpected < 1) {
      setCollegeError("College Name, Official College Email, and Expected Students are mandatory.");
      return;
    }

    setSavingCollege(true);
    try {
      const payload = {
        name: colName.trim(),
        officialEmail: colEmail.trim(),
        expectedStudents: Number(colExpected),
        department: colDept.trim() || undefined,
        website: colWebsite.trim() || undefined,
        phone: colPhone.trim() || undefined,
        address: colAddress.trim() || undefined,
        city: colCity.trim() || undefined,
        state: colState.trim() || undefined,
        country: colCountry.trim() || "India",
      };

      const saved = adminCollege
        ? await updateMyCollege(payload)
        : await registerCollege(payload);

      setAdminCollege(saved);
      populateAdminForm(saved);
      setEditingCollege(false);
      setCollegeSuccess(
        adminCollege
          ? "College details updated successfully!"
          : `College registered! Your unique College ID is ${saved.collegeCode}.`
      );
    } catch (err: any) {
      setCollegeError(err.message || "Failed to save college details.");
    } finally {
      setSavingCollege(false);
    }
  };

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setLinkSuccess(null);

    if (!linkName.trim() || !linkCode.trim()) {
      setLinkError("Both College Name and College Unique ID are mandatory.");
      return;
    }

    setLinking(true);
    try {
      const linked = await linkStudentCollege({
        collegeName: linkName.trim(),
        collegeCode: linkCode.trim().toUpperCase(),
        rollNumber: linkRoll.trim() || undefined,
      });
      setStudentCollege(linked);
      setEditingStudentLink(false);
      setLinkSuccess(`Successfully linked to ${linked.name} (${linked.collegeCode})!`);
      const dash = await getStudentExamDashboard();
      setExamDashboard(dash);
    } catch (err: any) {
      setLinkError(
        err.message || "Could not verify college details. Check the College Name and Unique ID with your faculty."
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
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/25 font-bold font-mono">
                    {adminCollege ? "COLLEGE ADMIN" : studentCollege ? "VERIFIED STUDENT" : user.role}
                  </span>
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

              {/* Metrics + Details or Edit Form */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-background border border-surface-border">
                    <span className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Expected Student Capacity</span>
                      <Users className="h-4 w-4 text-brand-400" />
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {adminCollege.expectedStudents.toLocaleString()}
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
                      <span>Examinations Conducted</span>
                      <Trophy className="h-4 w-4 text-amber-400" />
                    </span>
                    <div className="text-2xl font-extrabold text-foreground mt-1">
                      {adminCollege.totalContests}
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
                          <span className="font-semibold text-foreground">{adminCollege.expectedStudents}</span>
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
                          College / University Name *
                        </label>
                        <input
                          type="text"
                          required
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

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Expected Number of Students *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100000}
                          required
                          value={colExpected}
                          onChange={(e) => setColExpected( parseInt(e.target.value) || 100 )}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

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
        ) : studentCollege ? (
          /* ===================================================================
             MODE B: LINKED STUDENT VIEW — COLLEGE DETAILS + EXAMS + PAST RANKS
             =================================================================== */
          <div className="space-y-8">
            {/* Student Linked College Card */}
            <div className="rounded-3xl bg-surface border border-surface-border p-6 sm:p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified College Candidate</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {studentCollege.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>
                      College ID:{" "}
                      <strong className="font-mono text-brand-400">{studentCollege.collegeCode}</strong>
                    </span>
                    {studentCollege.rollNumber && (
                      <>
                        <span>•</span>
                        <span>
                          Roll / Reg No:{" "}
                          <strong className="font-mono text-foreground">{studentCollege.rollNumber}</strong>
                        </span>
                      </>
                    )}
                    {studentCollege.department && (
                      <>
                        <span>•</span>
                        <span>{studentCollege.department}</span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLinkError(null);
                    setLinkSuccess(null);
                    setEditingStudentLink(!editingStudentLink);
                  }}
                  className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-border border border-surface-border text-xs font-semibold text-foreground transition"
                >
                  <Edit3 className="h-3.5 w-3.5 text-brand-400" />
                  <span>{editingStudentLink ? "Close Editor" : "Update College / Roll No"}</span>
                </button>
              </div>

              {linkSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{linkSuccess}</span>
                </div>
              )}

              {editingStudentLink && (
                <form
                  onSubmit={handleLinkStudent}
                  className="mt-6 pt-6 border-t border-surface-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs"
                >
                  {linkError && (
                    <div className="sm:col-span-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{linkError}</span>
                    </div>
                  )}
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
                    <label className="block font-semibold text-slate-300 mb-1">College Unique ID *</label>
                    <input
                      type="text"
                      required
                      value={linkCode}
                      onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Roll / Student ID</label>
                    <input
                      type="text"
                      value={linkRoll}
                      onChange={(e) => setLinkRoll(e.target.value)}
                      placeholder="e.g. 2026CS1042"
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-surface-border text-foreground font-mono"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end gap-2">
                    <button
                      type="submit"
                      disabled={linking}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition"
                    >
                      {linking && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      <span>Save Changes</span>
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
                    {examDashboard.active.length} active • {examDashboard.upcoming.length} upcoming
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

            {/* College Examination Activities & Past Results */}
            <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-md">
              <div className="p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    College Examinations &amp; Past Contest Results
                  </h3>
                  <p className="text-xs text-slate-400">
                    Attend live or upcoming college examinations and inspect your scores and ranks for completed contests.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-surface-border self-start sm:self-auto">
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
                  <button
                    onClick={() => setExamTab("PAST_RESULTS")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                      examTab === "PAST_RESULTS"
                        ? "bg-brand-600 text-white"
                        : "text-slate-400 hover:text-foreground"
                    }`}
                  >
                    Past Results &amp; Ranks ({examDashboard?.past.length || 0})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {examTab === "UPCOMING_ACTIVE" ? (
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
             MODE C: UNLINKED USER — STUDENT LINK FORM OR ADMIN COLLEGE REGISTER
             =================================================================== */
          <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-lg">
            {/* Switcher Header */}
            <div className="p-6 sm:p-8 border-b border-surface-border bg-gradient-to-br from-brand-600/10 via-surface to-surface">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Complete Your Institutional Profile</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    Connect With Your College on Katasphere
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Students must enter their mandatory <strong>College Name</strong> and <strong>College Unique ID</strong> to unlock college exams. Faculty/Admins can register their college here to receive a unique College ID.
                  </p>
                </div>

                {/* Role Tabs */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-background border border-surface-border shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => setOnboardingTab("STUDENT")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      onboardingTab === "STUDENT"
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-foreground"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>I&apos;m a Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnboardingTab("ADMIN")}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      onboardingTab === "ADMIN"
                        ? "bg-brand-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-foreground"
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Register a College (Admin)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {onboardingTab === "STUDENT" ? (
                /* STUDENT MANDATORY COLLEGE LINK FORM */
                <form onSubmit={handleLinkStudent} className="space-y-5 max-w-2xl text-xs">
                  <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-slate-300 space-y-1">
                    <div className="font-bold text-brand-300 flex items-center gap-1.5">
                      <KeyRound className="h-4 w-4" />
                      <span>Mandatory Candidate Verification</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Enter the exact <strong>College Name</strong> and <strong>College Unique ID</strong> (e.g. <code className="font-mono text-foreground">KS-7X9K2P</code>) shared by your professor or placement cell. Once verified, all upcoming and past college examinations with your ranks will appear here.
                    </p>
                  </div>

                  {linkError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{linkError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        College / University Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. IIT Delhi"
                        value={linkName}
                        onChange={(e) => setLinkName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        College Unique ID <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. KS-7X9K2P"
                        value={linkCode}
                        onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono uppercase tracking-wider placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        University Roll / Registration No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 2026CS1042"
                        value={linkRoll}
                        onChange={(e) => setLinkRoll(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={linking}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-600/25 disabled:opacity-50"
                  >
                    {linking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying College ID...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verify &amp; Link My College</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ADMIN REGISTER COLLEGE FORM */
                <form onSubmit={handleSaveCollege} className="space-y-5 text-xs">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-slate-300 space-y-1">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      <span>Institutional Registration for Faculty &amp; Placement Cells</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Register your college with expected student count and official email. Upon registration, a unique <strong>College ID</strong> (e.g. <code className="font-mono text-foreground">KS-XXXXXX</code>) will be generated and displayed on your profile.
                    </p>
                  </div>

                  {collegeError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{collegeError}</span>
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
                        placeholder="e.g. IIT Delhi"
                        value={colName}
                        onChange={(e) => setColName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Official Email ID of College <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. exams@iitd.ac.in"
                        value={colEmail}
                        onChange={(e) => setColEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        No. of Expected Students <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100000}
                        required
                        value={colExpected}
                        onChange={(e) => setColExpected(parseInt(e.target.value) || 100)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Department / School
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dept. of Computer Science"
                        value={colDept}
                        onChange={(e) => setColDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. New Delhi"
                        value={colCity}
                        onChange={(e) => setColCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Delhi"
                        value={colState}
                        onChange={(e) => setColState(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        College Website
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.iitd.ac.in"
                        value={colWebsite}
                        onChange={(e) => setColWebsite(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        placeholder="+91 11 2659 7135"
                        value={colPhone}
                        onChange={(e) => setColPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingCollege}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg shadow-brand-600/25 disabled:opacity-50"
                  >
                    {savingCollege ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Registering College...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Register College &amp; Generate Unique ID</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
