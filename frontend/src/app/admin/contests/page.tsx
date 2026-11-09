"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import {
  getFacultyContests,
  createFacultyContest,
  getAdminParticipants,
  getAdminSubmissions,
  getExportGradebookUrl,
} from "@/lib/contest-api";
import { apiClient, ApiResponse } from "@/lib/api-client";
import {
  ContestDto,
  ContestParticipantDto,
  ContestSubmissionDto,
  CreateContestPayload,
} from "@/types/contest";
import {
  ShieldCheck,
  Building2,
  Users,
  Trophy,
  Calendar,
  Clock,
  Plus,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  KeyRound,
  FileCode2,
  Copy,
  Check,
  Eye,
  X,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

interface CatalogProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export default function AdminContestsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [contests, setContests] = useState<ContestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogProblems, setCatalogProblems] = useState<CatalogProblemSummary[]>([]);

  // Modal: Create Exam Wizard
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Form State
  const [formCollege, setFormCollege] = useState("IIT Delhi - Dept. of Computer Science");
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formDuration, setFormDuration] = useState(90);
  const [formStartTime, setFormStartTime] = useState("");
  const [formEndTime, setFormEndTime] = useState("");
  const [formAllowTabSwitch, setFormAllowTabSwitch] = useState(true);
  const [formMaxTabSwitches, setFormMaxTabSwitches] = useState(3);
  const [selectedProblems, setSelectedProblems] = useState<Array<{ id: string; title: string; difficulty: string; points: number }>>([]);
  const [problemSearch, setProblemSearch] = useState("");

  // Drawer / Modal: Live Proctoring Monitor
  const [selectedContestForMonitor, setSelectedContestForMonitor] = useState<ContestDto | null>(null);
  const [monitorParticipants, setMonitorParticipants] = useState<ContestParticipantDto[]>([]);
  const [monitorSubmissions, setMonitorSubmissions] = useState<ContestSubmissionDto[]>([]);
  const [monitorLoading, setMonitorLoading] = useState(false);
  const [monitorTab, setMonitorTab] = useState<"PARTICIPANTS" | "SUBMISSIONS">("PARTICIPANTS");

  // Copy code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Initialize dates
  useEffect(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    setFormStartTime(now.toISOString().slice(0, 16));
    setFormEndTime(end.toISOString().slice(0, 16));
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getFacultyContests();
      setContests(data);
    } catch (err) {
      console.error("Failed to load faculty contests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading]);

  // Load problem catalog for selector
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const res = await apiClient<ApiResponse<{ content: CatalogProblemSummary[] }>>("/api/v1/problems?size=100");
        if (res.data?.content) {
          setCatalogProblems(res.data.content);
        }
      } catch (err) {
        console.error("Failed to fetch catalog problems", err);
      }
    }
    fetchCatalog();
  }, []);

  // Open monitor drawer
  const openMonitor = async (c: ContestDto) => {
    setSelectedContestForMonitor(c);
    setMonitorLoading(true);
    try {
      const [parts, subs] = await Promise.all([
        getAdminParticipants(c.slug),
        getAdminSubmissions(c.slug),
      ]);
      setMonitorParticipants(parts);
      setMonitorSubmissions(subs);
    } catch (err) {
      console.error("Failed to fetch monitor data", err);
    } finally {
      setMonitorLoading(false);
    }
  };

  const generateSlugAndCode = () => {
    if (formTitle) {
      const slugVal = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormSlug(slugVal);
    }
    const randCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormCode(randCode);
  };

  const handleAddProblem = (p: CatalogProblemSummary) => {
    if (selectedProblems.some((x) => x.id === p.id)) return;
    const defaultPts = p.difficulty === "EASY" ? 100 : p.difficulty === "MEDIUM" ? 200 : 300;
    setSelectedProblems([...selectedProblems, { id: p.id, title: p.title, difficulty: p.difficulty, points: defaultPts }]);
  };

  const handleRemoveProblem = (id: string) => {
    setSelectedProblems(selectedProblems.filter((p) => p.id !== id));
  };

  const handlePointChange = (id: string, pts: number) => {
    setSelectedProblems(
      selectedProblems.map((p) => (p.id === id ? { ...p, points: Math.max(10, pts) } : p))
    );
  };

  const handleCreateContest = async () => {
    if (!formTitle || !formCollege || !formSlug || !formCode) {
      setCreateError("Please complete all required fields.");
      return;
    }
    if (selectedProblems.length === 0) {
      setCreateError("Please select at least 1 problem for the examination.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    const payload: CreateContestPayload = {
      collegeName: formCollege,
      title: formTitle,
      slug: formSlug,
      description: formDesc,
      accessCode: formCode,
      startTime: new Date(formStartTime).toISOString(),
      endTime: new Date(formEndTime).toISOString(),
      durationMinutes: formDuration,
      scoringSystem: "POINTS",
      allowTabSwitch: formAllowTabSwitch,
      maxTabSwitches: formMaxTabSwitches,
      isPublished: true,
      problems: selectedProblems.map((p, idx) => ({
        problemId: p.id,
        points: p.points,
        orderIndex: idx,
      })),
    };

    try {
      await createFacultyContest(payload);
      setShowCreateModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setCreateError(err.message || "Failed to create contest.");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormTitle("");
    setFormSlug("");
    setFormDesc("");
    setFormCode("");
    setSelectedProblems([]);
    setWizardStep(1);
    setCreateError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Compute aggregate stats
  const totalExams = contests.length;
  const activeExams = contests.filter((c) => c.status === "ACTIVE").length;
  const totalStudents = contests.reduce((acc, c) => acc + (c.totalParticipants || 0), 0);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-1">
              <GraduationCap className="h-4 w-4" />
              <span>University Faculty Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Institutional Examination Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create proctored coding assessments, enforce access control, and monitor live test-taker violations.
            </p>
          </div>

          <button
            onClick={() => {
              generateSlugAndCode();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm transition shadow-lg shadow-brand-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Examination</span>
          </button>
        </div>

        {/* Stats Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Exams Scheduled</span>
              <Trophy className="h-4 w-4 text-brand-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{totalExams}</div>
            <span className="text-[11px] text-slate-500">Across department sessions</span>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-surface-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Sessions</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-400">{activeExams}</div>
            <span className="text-[11px] text-slate-500">Live test-taking windows</span>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-surface-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Candidates Evaluated</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">{totalStudents}</div>
            <span className="text-[11px] text-slate-500">Enrolled student submissions</span>
          </div>
        </div>

        {/* Contests Table */}
        <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden shadow-sm">
          <div className="p-5 border-b border-surface-border flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">Examination Schedule & Roster</h3>
            <span className="text-xs text-slate-400">{contests.length} examinations</span>
          </div>

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-3" />
              <p className="text-xs text-slate-400">Loading examinations...</p>
            </div>
          ) : contests.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No examinations created yet. Click &ldquo;Create New Examination&rdquo; to launch your first exam.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3.5">Examination & College</th>
                    <th className="px-6 py-3.5">Access Code</th>
                    <th className="px-6 py-3.5">Window & Duration</th>
                    <th className="px-6 py-3.5">Challenges</th>
                    <th className="px-6 py-3.5">Enrolled</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {contests.map((c) => {
                    const isCopied = copiedCode === c.accessCode;
                    return (
                      <tr key={c.id} className="hover:bg-surface-subtle/50 transition">
                        {/* Title & College */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-foreground text-sm">{c.title}</p>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                            <Building2 className="h-3 w-3 text-brand-400" />
                            <span>{c.collegeName}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-500">/{c.slug}</span>
                          </div>
                        </td>

                        {/* Access Code */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => copyToClipboard(c.accessCode)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-surface-border font-mono font-bold text-foreground hover:border-brand-500 transition"
                            title="Click to copy access code"
                          >
                            <span>{c.accessCode}</span>
                            {isCopied ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-slate-400" />
                            )}
                          </button>
                        </td>

                        {/* Window */}
                        <td className="px-6 py-4 text-slate-300">
                          <div>{c.durationMinutes} minutes</div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(c.startTime).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </div>
                        </td>

                        {/* Challenges */}
                        <td className="px-6 py-4 font-semibold text-foreground">
                          {c.totalProblems} problems
                        </td>

                        {/* Enrolled */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span>{c.totalParticipants}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {c.status === "ACTIVE" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                          {c.status === "UPCOMING" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                              UPCOMING
                            </span>
                          )}
                          {c.status === "CONCLUDED" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                              CONCLUDED
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openMonitor(c)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-border text-foreground font-semibold transition"
                          >
                            <Eye className="h-3.5 w-3.5 text-brand-400" />
                            <span>Monitor</span>
                          </button>

                          <a
                            href={getExportGradebookUrl(c.slug)}
                            download
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-border text-foreground font-semibold transition"
                          >
                            <Download className="h-3.5 w-3.5 text-emerald-400" />
                            <span>CSV</span>
                          </a>

                          <Link
                            href={`/contests/${c.slug}`}
                            target="_blank"
                            className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-foreground transition"
                            title="Open Student Waiting Room"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Live Proctoring Monitor Drawer */}
        {selectedContestForMonitor && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in">
            <div className="w-full max-w-2xl bg-surface border-l border-surface-border h-full flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-6 border-b border-surface-border flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Live Proctoring Monitor</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">
                    {selectedContestForMonitor.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Max permitted tab switches: {selectedContestForMonitor.maxTabSwitches}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={getExportGradebookUrl(selectedContestForMonitor.slug)}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Gradebook CSV</span>
                  </a>
                  <button
                    onClick={() => setSelectedContestForMonitor(null)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-foreground hover:bg-surface-subtle"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-4 px-6 border-b border-surface-border bg-surface-subtle text-xs font-semibold">
                <button
                  onClick={() => setMonitorTab("PARTICIPANTS")}
                  className={`py-3 border-b-2 transition ${
                    monitorTab === "PARTICIPANTS"
                      ? "border-brand-500 text-foreground"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Candidate Proctoring Feed ({monitorParticipants.length})
                </button>
                <button
                  onClick={() => setMonitorTab("SUBMISSIONS")}
                  className={`py-3 border-b-2 transition ${
                    monitorTab === "SUBMISSIONS"
                      ? "border-brand-500 text-foreground"
                      : "border-transparent text-slate-400"
                  }`}
                >
                  Live Submissions Log ({monitorSubmissions.length})
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {monitorLoading ? (
                  <div className="py-16 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-3" />
                    <p className="text-xs text-slate-400">Streaming proctoring data...</p>
                  </div>
                ) : monitorTab === "PARTICIPANTS" ? (
                  <div className="space-y-3">
                    {monitorParticipants.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-8">
                        No students have entered this examination room yet.
                      </p>
                    ) : (
                      monitorParticipants.map((p, idx) => {
                        const hasViolation = p.tabSwitchCount > selectedContestForMonitor.maxTabSwitches;
                        return (
                          <div
                            key={p.id}
                            className={`p-4 rounded-xl border transition ${
                              hasViolation
                                ? "bg-rose-500/10 border-rose-500/30"
                                : "bg-background border-surface-border"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground text-xs">
                                  #{idx + 1} {p.studentName}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  ({p.studentEmail})
                                </span>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  hasViolation || p.status === "FLAGGED_VIOLATION"
                                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                    : p.status === "SUBMITTED"
                                    ? "bg-blue-500/15 text-blue-400"
                                    : "bg-emerald-500/15 text-emerald-400"
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 pt-2 border-t border-surface-border/50">
                              <div>
                                <span className="text-[10px] text-slate-500 block">Score:</span>
                                <strong className="text-emerald-400 font-bold text-sm">
                                  {p.totalScore} pts
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Tab Violations:</span>
                                <strong
                                  className={`text-sm ${
                                    hasViolation ? "text-rose-400 font-extrabold" : "text-foreground font-bold"
                                  }`}
                                >
                                  {p.tabSwitchCount} / {selectedContestForMonitor.maxTabSwitches}
                                </strong>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 block">Time Left:</span>
                                <span className="font-mono text-foreground">
                                  {Math.floor(p.timeRemainingSeconds / 60)}m {p.timeRemainingSeconds % 60}s
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {monitorSubmissions.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-8">
                        No submissions recorded yet.
                      </p>
                    ) : (
                      monitorSubmissions.map((s) => (
                        <div
                          key={s.id}
                          className="p-3.5 rounded-xl bg-background border border-surface-border text-xs flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{s.studentName}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-300 font-semibold">{s.problemTitle}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {s.language} • {s.runtimeMs}ms • {new Date(s.createdAt).toLocaleTimeString()}
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.verdict === "ACCEPTED"
                                  ? "bg-emerald-500/15 text-emerald-400"
                                  : "bg-rose-500/15 text-rose-400"
                              }`}
                            >
                              {s.verdict}
                            </span>
                            <div className="text-[11px] font-semibold text-emerald-400 mt-0.5">
                              +{s.scoreAwarded} pts
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Create Examination Wizard */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-surface border border-surface-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
              {/* Wizard Header */}
              <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Create New Examination</h3>
                  <p className="text-xs text-slate-400">Step {wizardStep} of 3</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {createError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 shrink-0">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              {/* Wizard Steps */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {wizardStep === 1 && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        College / Department Name *
                      </label>
                      <input
                        type="text"
                        value={formCollege}
                        onChange={(e) => setFormCollege(e.target.value)}
                        placeholder="e.g. IIT Delhi - Dept. of Computer Science"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Examination Title *
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (!formSlug) {
                            setFormSlug(
                              e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "")
                            );
                          }
                        }}
                        placeholder="e.g. CS201 Data Structures Mid-Semester Examination"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Unique URL Slug *
                        </label>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                          placeholder="e.g. iitd-cs201-midsem-2026"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Student Access Code *
                        </label>
                        <input
                          type="text"
                          value={formCode}
                          onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                          placeholder="e.g. IITD2026"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground font-mono uppercase font-bold focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Examination Duration (Minutes) *
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="300"
                        value={formDuration}
                        onChange={(e) => setFormDuration(parseInt(e.target.value) || 90)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Window Start Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formStartTime}
                          onChange={(e) => setFormStartTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-300 mb-1">
                          Window End Time
                        </label>
                        <input
                          type="datetime-local"
                          value={formEndTime}
                          onChange={(e) => setFormEndTime(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-surface-border text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4 text-xs">
                    <p className="text-slate-400">
                      Select challenges from the Katasphere catalog and assign points for each challenge.
                    </p>

                    {/* Selected Problems List */}
                    {selectedProblems.length > 0 && (
                      <div className="space-y-2 p-3 rounded-2xl bg-background border border-surface-border">
                        <div className="font-semibold text-foreground">
                          Chosen Challenges ({selectedProblems.length}):
                        </div>
                        {selectedProblems.map((p, idx) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-surface border border-surface-border"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-400">
                                {String.fromCharCode(65 + idx)}.
                              </span>
                              <span className="font-semibold text-foreground">{p.title}</span>
                              <span className="text-[10px] text-slate-500">({p.difficulty})</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="10"
                                max="1000"
                                value={p.points}
                                onChange={(e) => handlePointChange(p.id, parseInt(e.target.value) || 100)}
                                className="w-16 px-2 py-1 rounded bg-background border border-surface-border text-center font-bold text-foreground"
                              />
                              <span className="text-slate-500 text-[11px]">pts</span>
                              <button
                                onClick={() => handleRemoveProblem(p.id)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Problem Catalog Picker */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search available catalog problems..."
                          value={problemSearch}
                          onChange={(e) => setProblemSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-surface-border text-foreground"
                        />
                      </div>

                      <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-surface-border">
                        {catalogProblems
                          .filter((p) =>
                            p.title.toLowerCase().includes(problemSearch.toLowerCase())
                          )
                          .slice(0, 15)
                          .map((p) => {
                            const isAdded = selectedProblems.some((x) => x.id === p.id);
                            return (
                              <div
                                key={p.id}
                                className="pt-1.5 pb-1.5 flex items-center justify-between text-xs hover:bg-surface-subtle px-2 rounded"
                              >
                                <div>
                                  <span className="font-semibold text-foreground">{p.title}</span>
                                  <span className="ml-2 text-[10px] text-slate-500 font-mono">
                                    {p.difficulty}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  disabled={isAdded}
                                  onClick={() => handleAddProblem(p)}
                                  className="px-2.5 py-1 rounded-lg bg-surface border border-surface-border font-semibold text-brand-400 hover:text-white hover:bg-brand-600 disabled:opacity-40 transition"
                                >
                                  {isAdded ? "Added" : "+ Add"}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-background border border-surface-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-foreground">Anti-Cheat Tab Proctoring</div>
                          <p className="text-slate-400 text-[11px]">
                            Track candidate tab switches and window blur events in real-time.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={formAllowTabSwitch}
                          onChange={(e) => setFormAllowTabSwitch(e.target.checked)}
                          className="h-4 w-4 rounded accent-brand-500"
                        />
                      </div>

                      {formAllowTabSwitch && (
                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Maximum Permitted Tab Switches Before Flagging
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={formMaxTabSwitches}
                            onChange={(e) => setFormMaxTabSwitches(parseInt(e.target.value) || 0)}
                            className="w-32 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-foreground font-bold"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            Exceeding this threshold marks the candidate as &ldquo;FLAGGED_VIOLATION&rdquo;.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Summary confirmation */}
                    <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-1.5 text-xs text-slate-300">
                      <div className="font-bold text-brand-300">Ready to Publish Examination</div>
                      <div>
                        Title: <strong className="text-foreground">{formTitle}</strong>
                      </div>
                      <div>
                        Access Code: <strong className="font-mono text-emerald-400">{formCode}</strong>
                      </div>
                      <div>
                        Problems: <strong className="text-foreground">{selectedProblems.length} challenges</strong>
                      </div>
                      <div>
                        Duration: <strong className="text-foreground">{formDuration} minutes</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Wizard Footer Navigation */}
              <div className="border-t border-surface-border pt-4 mt-6 flex items-center justify-between shrink-0">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 rounded-xl bg-surface-subtle text-foreground text-xs font-semibold hover:bg-surface-border transition"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (wizardStep === 1 && (!formTitle || !formSlug || !formCode)) {
                        setCreateError("Please complete the required details.");
                        return;
                      }
                      if (wizardStep === 2 && selectedProblems.length === 0) {
                        setCreateError("Please pick at least 1 problem.");
                        return;
                      }
                      setCreateError(null);
                      setWizardStep((prev) => (prev + 1) as any);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-sm"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={creating}
                    onClick={handleCreateContest}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-lg shadow-brand-600/25 disabled:opacity-50"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Publishing Examination...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Publish & Launch Exam</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
