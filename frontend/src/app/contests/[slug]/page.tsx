"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import {
  getContestDetail,
  getParticipantState,
  joinContest,
  getContestLeaderboard,
} from "@/lib/contest-api";
import {
  ContestDetailDto,
  ContestParticipantDto,
  ContestLeaderboardEntryDto,
} from "@/types/contest";
import {
  Clock,
  Building2,
  Trophy,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Lock,
  CheckCircle2,
  FileCode2,
  LogIn,
  KeyRound,
  ExternalLink,
  Users,
  Timer,
  ChevronRight,
} from "lucide-react";

export default function ContestWaitingRoomPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [detail, setDetail] = useState<ContestDetailDto | null>(null);
  const [participant, setParticipant] = useState<ContestParticipantDto | null>(null);
  const [leaderboard, setLeaderboard] = useState<ContestLeaderboardEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"EXAM_DETAILS" | "LEADERBOARD">("EXAM_DETAILS");

  // Live countdown state
  const [secondsUntilStart, setSecondsUntilStart] = useState<number | null>(null);
  const [secondsUntilEnd, setSecondsUntilEnd] = useState<number | null>(null);

  useEffect(() => {
    async function loadContest() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await getContestDetail(slug);
        setDetail(data);

        // Fetch leaderboard in parallel
        getContestLeaderboard(slug).then(setLeaderboard).catch(console.error);

        // If user is authenticated, check their participant status
        if (user) {
          const part = await getParticipantState(slug);
          setParticipant(part);
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to load examination details.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadContest();
    }
  }, [slug, user, authLoading]);

  // Compute countdown ticker
  useEffect(() => {
    if (!detail) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(detail.contest.startTime).getTime();
      const end = new Date(detail.contest.endTime).getTime();

      setSecondsUntilStart(Math.max(0, Math.floor((start - now) / 1000)));
      setSecondsUntilEnd(Math.max(0, Math.floor((end - now) / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [detail]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMsg("Please enter the college examination access code.");
      return;
    }

    setErrorMsg(null);
    setJoining(true);

    try {
      const p = await joinContest(slug, accessCode.trim());
      setParticipant(p);
      router.push(`/contests/${slug}/exam`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to enter examination. Check your access code.");
    } finally {
      setJoining(false);
    }
  };

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || authLoading) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-4" />
          <p className="text-sm text-slate-400">Loading examination environment...</p>
        </div>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto my-20 p-8 rounded-2xl bg-surface border border-surface-border text-center">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground">Examination Not Found</h2>
          <p className="mt-2 text-sm text-slate-400">
            {errorMsg || "The requested examination slug could not be located in the university registry."}
          </p>
          <div className="mt-6">
            <Link
              href="/contests"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-500 transition"
            >
              <span>Back to Contests</span>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const { contest, problems } = detail;
  const isStarted = secondsUntilStart !== null && secondsUntilStart === 0;
  const isEnded = secondsUntilEnd !== null && secondsUntilEnd === 0;
  const isInSession = isStarted && !isEnded;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/contests" className="hover:text-foreground transition">
            Examinations
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{contest.collegeName}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-mono text-slate-500">{contest.slug}</span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl bg-surface border border-surface-border p-6 sm:p-10 shadow-lg relative overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 mb-2">
                <Building2 className="h-4 w-4" />
                <span>{contest.collegeName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {contest.title}
              </h1>
              {contest.description && (
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {contest.description}
                </p>
              )}

              {/* Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-surface-border text-foreground">
                  <Clock className="h-3.5 w-3.5 text-brand-400" />
                  <span>Duration: <strong className="font-semibold">{contest.durationMinutes} mins</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-surface-border text-foreground">
                  <FileCode2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Problems: <strong className="font-semibold">{contest.totalProblems} challenges</strong></span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background border border-surface-border text-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Proctoring: <strong className="font-semibold">{contest.allowTabSwitch ? `Max ${contest.maxTabSwitches} tab switches` : "Locked tabs"}</strong></span>
                </div>
              </div>
            </div>

            {/* Countdown / Status Widget */}
            <div className="w-full lg:w-80 shrink-0 p-6 rounded-2xl bg-background border border-surface-border flex flex-col items-center text-center">
              {isInSession ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-3">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>EXAMINATION IN SESSION</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold text-foreground tracking-wider mb-1">
                    {secondsUntilEnd !== null ? formatCountdown(secondsUntilEnd) : "--:--:--"}
                  </div>
                  <p className="text-[11px] text-slate-500">Remaining until examination window closes</p>
                </>
              ) : !isStarted ? (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold mb-3">
                    <Timer className="h-3.5 w-3.5" />
                    <span>STARTING SOON</span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-extrabold text-brand-400 tracking-wider mb-1">
                    {secondsUntilStart !== null ? formatCountdown(secondsUntilStart) : "--:--:--"}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Starts at {new Date(contest.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/25 text-slate-400 text-xs font-bold mb-3">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>EXAMINATION CONCLUDED</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-2">The testing window has closed</p>
                  <p className="text-[11px] text-slate-500 mt-1">Submissions are now finalized</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action / Entry Gatekeeper Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-surface-border">
              <button
                onClick={() => setActiveTab("EXAM_DETAILS")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "EXAM_DETAILS"
                    ? "border-brand-500 text-foreground"
                    : "border-transparent text-slate-400 hover:text-foreground"
                }`}
              >
                Challenges & Points ({problems.length})
              </button>
              <button
                onClick={() => setActiveTab("LEADERBOARD")}
                className={`pb-3 text-sm font-bold border-b-2 transition ${
                  activeTab === "LEADERBOARD"
                    ? "border-brand-500 text-foreground"
                    : "border-transparent text-slate-400 hover:text-foreground"
                }`}
              >
                Standings & Leaderboard ({leaderboard.length})
              </button>
            </div>

            {activeTab === "EXAM_DETAILS" ? (
              <div className="space-y-4">
                {problems.map((prob, idx) => (
                  <div
                    key={prob.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-surface-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-background border border-surface-border flex items-center justify-center font-bold text-foreground">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{prob.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prob.difficulty === "EASY"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : prob.difficulty === "MEDIUM"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                          <span>•</span>
                          <span>{prob.sampleTestCases?.length || 0} visible sample test cases</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-foreground">{prob.points}</span>
                      <span className="text-xs text-slate-500 ml-1">pts</span>
                    </div>
                  </div>
                ))}

                {/* Anti-cheat guidelines */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Important Anti-Cheat & Examination Regulations</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    <li>Once you enter the workspace, your personal timer will tick down continuously.</li>
                    <li>
                      Tab-switches and window minimizes are recorded live. Faculty is alerted when violations exceed {contest.maxTabSwitches}.
                    </li>
                    <li>Code is verified against strict hidden edge cases on submit. Public network tampering is prohibited.</li>
                    <li>When your timer expires, remaining solutions are automatically submitted.</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Leaderboard Tab */
              <div className="rounded-2xl bg-surface border border-surface-border overflow-hidden">
                <div className="p-4 border-b border-surface-border bg-surface-subtle font-semibold text-xs text-slate-400 flex justify-between">
                  <span>Candidate</span>
                  <span>Score / Tab Switches</span>
                </div>
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No candidates have submitted solutions yet.
                  </div>
                ) : (
                  <div className="divide-y divide-surface-border">
                    {leaderboard.map((entry) => (
                      <div
                        key={entry.participantId}
                        className="p-4 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              entry.rank === 1
                                ? "bg-amber-500 text-black"
                                : entry.rank === 2
                                ? "bg-slate-300 text-black"
                                : entry.rank === 3
                                ? "bg-amber-700 text-white"
                                : "bg-surface-border text-slate-400"
                            }`}
                          >
                            {entry.rank}
                          </span>
                          <div>
                            <p className="font-bold text-foreground">{entry.studentName}</p>
                            <p className="text-[11px] text-slate-500">{entry.studentEmail}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-extrabold text-foreground text-sm">
                            {entry.totalScore} pts
                          </span>
                          <p className="text-[10px] text-slate-400">
                            {entry.tabSwitchCount} tab switch{entry.tabSwitchCount === 1 ? "" : "es"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Admission Gate */}
          <div className="space-y-6">
            {!user ? (
              <div className="p-6 rounded-2xl bg-surface border border-surface-border text-center">
                <LogIn className="h-10 w-10 text-brand-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground">Sign In Required</h3>
                <p className="mt-1 text-xs text-slate-400">
                  You must be signed in with your university Katasphere account to enter this examination.
                </p>
                <div className="mt-5 space-y-2">
                  <Link
                    href={`/login?returnTo=/contests/${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition"
                  >
                    <span>Sign In to Continue</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/register?returnTo=/contests/${slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-surface border border-surface-border hover:bg-surface-subtle text-foreground font-medium text-xs transition"
                  >
                    <span>Create University Account</span>
                  </Link>
                </div>
              </div>
            ) : participant ? (
              <div className="p-6 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Enrolled Candidate</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Candidate Status</h3>
                <div className="mt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Name:</span>
                    <strong className="text-foreground">{participant.studentName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Current Score:</span>
                    <strong className="text-emerald-400 font-bold">{participant.totalScore} pts</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Proctor Status:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        participant.status === "SUBMITTED"
                          ? "bg-blue-500/10 text-blue-400"
                          : participant.status === "FLAGGED_VIOLATION"
                          ? "bg-rose-500/10 text-rose-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {participant.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tab Switches:</span>
                    <strong className={participant.tabSwitchCount > contest.maxTabSwitches ? "text-rose-400" : "text-foreground"}>
                      {participant.tabSwitchCount} / {contest.maxTabSwitches}
                    </strong>
                  </div>
                </div>

                <div className="mt-6">
                  {participant.status === "SUBMITTED" ? (
                    <div className="p-3 rounded-xl bg-surface-subtle text-center text-xs text-slate-400">
                      Your examination has been submitted. Check the leaderboard for your final rank.
                    </div>
                  ) : (
                    <Link
                      href={`/contests/${slug}/exam`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition shadow-lg shadow-brand-600/25"
                    >
                      <span>Resume Examination</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ) : isEnded ? (
              <div className="p-6 rounded-2xl bg-surface border border-surface-border text-center">
                <CheckCircle2 className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-foreground">Examination Closed</h3>
                <p className="mt-1 text-xs text-slate-400">
                  The official window for this examination has concluded. New candidates can no longer register.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-surface border border-surface-border">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-1">
                  <KeyRound className="h-4 w-4 text-brand-500" />
                  <span>Access Code Required</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Please enter the access code provided by your instructor or exam proctor.
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleJoin} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. IITD2026"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 text-center font-mono tracking-widest text-base font-bold rounded-xl bg-background border border-surface-border text-foreground placeholder:text-slate-500 uppercase focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={joining || !accessCode.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-brand-600/25"
                  >
                    {joining ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying Admission...</span>
                      </>
                    ) : (
                      <>
                        <span>Enter Examination Hall</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
