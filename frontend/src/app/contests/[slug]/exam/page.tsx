"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { useAuth } from "@/contexts/AuthContext";
import {
  getContestDetail,
  getParticipantState,
  runSampleCode,
  submitContestCode,
  recordTabSwitch,
  finishExam,
  getMyContestSubmissions,
  RunSampleResponse,
} from "@/lib/contest-api";
import {
  ContestDetailDto,
  ContestParticipantDto,
  ContestProblemDto,
  ContestSubmissionDto,
} from "@/types/contest";
import {
  Play,
  Send,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Terminal,
  LogOut,
  Building2,
  Trophy,
  Code2,
  Sparkles,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function ContestExamWorkspacePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Core Data
  const [detail, setDetail] = useState<ContestDetailDto | null>(null);
  const [participant, setParticipant] = useState<ContestParticipantDto | null>(null);
  const [submissions, setSubmissions] = useState<ContestSubmissionDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Problem & Code State
  const [activeProblemIndex, setActiveProblemIndex] = useState(0);
  const [language, setLanguage] = useState<"JAVA" | "PYTHON" | "CPP" | "JAVASCRIPT">("JAVA");
  const [codePerProblemLang, setCodePerProblemLang] = useState<Record<string, string>>({});

  // Execution & Submission State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sampleRunResult, setSampleRunResult] = useState<RunSampleResponse | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<"TEST_CASES" | "OUTPUT">("TEST_CASES");
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  const [activeSampleCaseIndex, setActiveSampleCaseIndex] = useState(0);

  // Resizable Split Pane State (Question / Editor / Output windows)
  const [leftPanelWidthPct, setLeftPanelWidthPct] = useState<number>(48);
  const [consoleHeightPx, setConsoleHeightPx] = useState<number>(260);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isDraggingHorizontalRef = useRef<boolean>(false);
  const isDraggingVerticalRef = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHorizontalRef.current && splitContainerRef.current) {
        const rect = splitContainerRef.current.getBoundingClientRect();
        const newPct = ((e.clientX - rect.left) / rect.width) * 100;
        setLeftPanelWidthPct(Math.min(72, Math.max(25, newPct)));
      }
      if (isDraggingVerticalRef.current && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        const newHeight = rect.bottom - e.clientY;
        const maxConsoleHeight = Math.max(180, rect.height - 140);
        setConsoleHeightPx(Math.min(maxConsoleHeight, Math.max(110, newHeight)));
        if (!isConsoleExpanded) {
          setIsConsoleExpanded(true);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHorizontalRef.current || isDraggingVerticalRef.current) {
        isDraggingHorizontalRef.current = false;
        isDraggingVerticalRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isConsoleExpanded]);

  // Success & Warning Dialogs
  const [submissionSuccessModal, setSubmissionSuccessModal] = useState<ContestSubmissionDto | null>(null);
  const [tabSwitchWarning, setTabSwitchWarning] = useState<number | null>(null);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [examSubmittedCompleted, setExamSubmittedCompleted] = useState(false);

  // Server-Authoritative Timer
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  // Load contest & participant details
  useEffect(() => {
    async function initWorkspace() {
      if (!slug) return;
      try {
        setLoading(true);
        const data = await getContestDetail(slug);
        setDetail(data);

        if (!user) {
          router.replace(`/contests/${slug}`);
          return;
        }

        const part = await getParticipantState(slug);
        if (!part) {
          router.replace(`/contests/${slug}`);
          return;
        }

        setParticipant(part);
        setRemainingSeconds(part.timeRemainingSeconds);

        if (part.status === "SUBMITTED") {
          setExamSubmittedCompleted(true);
        }

        // Fetch user submissions for this contest
        const subs = await getMyContestSubmissions(slug);
        setSubmissions(subs);

        // Populate initial starter code for problems
        const initialCodeMap: Record<string, string> = {};
        data.problems.forEach((p) => {
          const defaultStarter =
            p.starterCode?.["JAVA"] ||
            p.starterCode?.["java"] ||
            "// Write your Java solution here\nclass Solution {\n    \n}";
          initialCodeMap[`${p.id}_JAVA`] = defaultStarter;
          if (p.starterCode?.["PYTHON"]) initialCodeMap[`${p.id}_PYTHON`] = p.starterCode["PYTHON"];
          if (p.starterCode?.["CPP"]) initialCodeMap[`${p.id}_CPP`] = p.starterCode["CPP"];
          if (p.starterCode?.["JAVASCRIPT"]) initialCodeMap[`${p.id}_JAVASCRIPT`] = p.starterCode["JAVASCRIPT"];
        });
        setCodePerProblemLang((prev) => ({ ...initialCodeMap, ...prev }));
      } catch (err: any) {
        console.error("Workspace init error", err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      initWorkspace();
    }
  }, [slug, user, authLoading, router]);

  // Countdown timer ticker & auto-submit on 0
  useEffect(() => {
    if (examSubmittedCompleted || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds, examSubmittedCompleted]);

  const handleAutoSubmit = useCallback(async () => {
    try {
      setIsFinishing(true);
      await finishExam(slug);
      setExamSubmittedCompleted(true);
    } catch (err) {
      console.error("Auto submit error", err);
    } finally {
      setIsFinishing(false);
    }
  }, [slug]);

  // Anti-cheat Proctoring: Tab-Switch Detection
  useEffect(() => {
    if (examSubmittedCompleted || !detail?.contest.allowTabSwitch) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          const updated = await recordTabSwitch(slug);
          setParticipant(updated);
          setTabSwitchWarning(updated.tabSwitchCount);
        } catch (err) {
          console.error("Failed to record tab switch", err);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [slug, examSubmittedCompleted, detail]);

  // Helper getters
  const currentProblem: ContestProblemDto | undefined = detail?.problems[activeProblemIndex];
  const currentCodeKey = currentProblem ? `${currentProblem.id}_${language}` : "";
  const currentCode = (currentProblem && codePerProblemLang[currentCodeKey]) || "";

  const handleCodeChange = (newCode: string) => {
    if (!currentProblem) return;
    setCodePerProblemLang((prev) => ({
      ...prev,
      [currentCodeKey]: newCode,
    }));
  };

  const handleLanguageChange = (newLang: "JAVA" | "PYTHON" | "CPP" | "JAVASCRIPT") => {
    setLanguage(newLang);
    if (currentProblem) {
      const key = `${currentProblem.id}_${newLang}`;
      if (!codePerProblemLang[key]) {
        const starter =
          currentProblem.starterCode?.[newLang] ||
          currentProblem.starterCode?.[newLang.toLowerCase()] ||
          `// Write your ${newLang} solution here`;
        setCodePerProblemLang((prev) => ({
          ...prev,
          [key]: starter,
        }));
      }
    }
  };

  // Run Code against visible sample cases
  const handleRunCode = async () => {
    if (!currentProblem || isRunning || isSubmitting) return;

    setIsRunning(true);
    setActiveOutputTab("OUTPUT");
    try {
      const result = await runSampleCode(slug, currentProblem.problemId, {
        problemSlug: currentProblem.slug,
        language,
        sourceCode: currentCode,
      });
      setSampleRunResult(result);
    } catch (err: any) {
      setSampleRunResult({
        verdict: "EXECUTION_ERROR",
        totalTestCases: 0,
        passedTestCases: 0,
        runtimeMs: 0,
        memoryKb: 0,
        errorMessage: err.message || "Execution failed. Check backend compiler.",
        testCases: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code for official contest grading (hidden test cases)
  const handleSubmitCode = async () => {
    if (!currentProblem || isRunning || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const sub = await submitContestCode(slug, {
        problemId: currentProblem.problemId,
        language,
        sourceCode: currentCode,
      });

      // Update submissions list
      setSubmissions((prev) => [sub, ...prev]);

      // Refresh participant state
      const updatedPart = await getParticipantState(slug);
      if (updatedPart) setParticipant(updatedPart);

      // Open Success or Failure Result Modal
      setSubmissionSuccessModal(sub);
    } catch (err: any) {
      alert(err.message || "Failed to submit code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Finish Exam
  const handleFinishExam = async () => {
    try {
      setIsFinishing(true);
      const res = await finishExam(slug);
      setParticipant(res);
      setExamSubmittedCompleted(true);
      setShowFinishConfirm(false);
    } catch (err: any) {
      alert(err.message || "Failed to finalize examination.");
    } finally {
      setIsFinishing(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading || authLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Entering locked examination hall...</p>
      </div>
    );
  }

  if (examSubmittedCompleted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-surface-border shadow-2xl">
          <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Examination Completed</h2>
          <p className="mt-2 text-xs text-slate-400">
            Your solutions have been securely finalized and submitted for academic evaluation.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-background border border-surface-border text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Score:</span>
              <strong className="text-emerald-400 font-bold text-sm">{participant?.totalScore || 0} pts</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tab Switch Alerts:</span>
              <span className="font-semibold text-foreground">{participant?.tabSwitchCount || 0} recorded</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Submission Time:</span>
              <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/contests/${slug}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition"
            >
              <span>View Contest Standings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasSolvedCurrentProblem = submissions.some(
    (s) => s.problemId === currentProblem?.problemId && s.verdict === "ACCEPTED"
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden select-none">
      {/* Top Lock Bar */}
      <header className="h-14 border-b border-surface-border bg-surface px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: College & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 className="h-4 w-4 text-brand-500" />
            <span className="font-bold text-foreground max-w-[200px] sm:max-w-xs truncate">
              {detail?.contest.title}
            </span>
          </div>

          {/* Problem Carousel Pills */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 pl-4 border-l border-surface-border">
            {detail?.problems.map((prob, idx) => {
              const isSolved = submissions.some(
                (s) => s.problemId === prob.problemId && s.verdict === "ACCEPTED"
              );
              const isActive = idx === activeProblemIndex;

              return (
                <button
                  key={prob.id}
                  onClick={() => setActiveProblemIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-brand-600 text-white shadow-xs"
                      : "bg-surface-subtle text-slate-400 hover:text-foreground"
                  }`}
                >
                  {isSolved ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <span>{String.fromCharCode(65 + idx)}.</span>
                  )}
                  <span className="truncate max-w-[100px]">{prob.title}</span>
                  <span className="text-[10px] opacity-75">({prob.points}p)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Timer & Proctoring Status & Finish */}
        <div className="flex items-center gap-3">
          {/* Proctoring Badge */}
          {detail?.contest.allowTabSwitch && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                (participant?.tabSwitchCount || 0) > detail.contest.maxTabSwitches
                  ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                  : "bg-surface-border/50 text-slate-400"
              }`}
              title="Monitored Tab Switch Alerts"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Alerts:</span>
              <span>
                {participant?.tabSwitchCount || 0}/{detail.contest.maxTabSwitches}
              </span>
            </div>
          )}

          {/* Server-Authoritative Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono text-xs sm:text-sm font-extrabold border ${
              remainingSeconds < 180
                ? "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse"
                : remainingSeconds < 600
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-background text-foreground border-surface-border"
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          {/* Score Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-subtle text-xs font-bold text-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>{participant?.totalScore || 0} pts</span>
          </div>

          {/* Finish Exam Button */}
          <button
            onClick={() => setShowFinishConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Finish Exam</span>
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div
        ref={splitContainerRef}
        className="flex-1 min-h-0 min-w-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden"
      >
        {/* Left Panel: Question / Problem Statement Window */}
        <div
          style={{ width: undefined }}
          className="w-full lg:w-(--left-panel-width) min-h-[340px] lg:min-h-0 min-w-0 flex flex-col border-b lg:border-b-0 lg:border-r border-surface-border overflow-hidden bg-background shrink-0"
          ref={(el) => {
            if (el) {
              el.style.setProperty("--left-panel-width", `${leftPanelWidthPct}%`);
            }
          }}
        >
          {/* Problem Statement Header */}
          <div className="p-4 border-b border-surface-border bg-surface flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-extrabold text-foreground text-base truncate">
                {String.fromCharCode(65 + activeProblemIndex)}. {currentProblem?.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  currentProblem?.difficulty === "EASY"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : currentProblem?.difficulty === "MEDIUM"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-rose-500/10 text-rose-400"
                }`}
              >
                {currentProblem?.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-foreground bg-surface-border px-2.5 py-1 rounded-md">
                {currentProblem?.points} pts
              </span>
              {hasSolvedCurrentProblem && (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/25">
                  <CheckCircle2 className="h-3 w-3" /> Solved
                </span>
              )}
            </div>
          </div>

          {/* Problem Content Scroll Area */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain select-text p-6 space-y-6 text-sm text-slate-300 leading-relaxed">
            {/* Description */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-line break-words">
              {currentProblem?.description}
            </div>

            {/* Public Sample Test Cases */}
            <div className="space-y-4 pt-4 border-t border-surface-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sample Test Cases
              </h4>
              {currentProblem?.sampleTestCases?.map((tc, i) => (
                <div
                  key={tc.caseNumber || i}
                  className="rounded-xl bg-surface border border-surface-border p-4 text-xs font-mono space-y-2"
                >
                  <div className="font-bold text-slate-400">Sample #{tc.caseNumber || i + 1}</div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Input:</span>
                    <pre className="bg-background p-2 rounded-lg text-emerald-400 overflow-x-auto">
                      {tc.input}
                    </pre>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Expected Output:</span>
                    <pre className="bg-background p-2 rounded-lg text-foreground overflow-x-auto">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero-Leakage Security Banner */}
            <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-[11px] text-slate-500 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                Hidden comprehensive test cases are evaluated securely on the Katasphere compiler sandbox.
              </span>
            </div>
          </div>
        </div>

        {/* Horizontal Resize Divider (Desktop) */}
        <div
          onMouseDown={() => {
            isDraggingHorizontalRef.current = true;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
          title="Drag to resize Question and Editor panels"
          className="hidden lg:flex w-1.5 hover:w-2 bg-surface-border/40 hover:bg-brand-500/60 cursor-col-resize items-center justify-center transition-colors shrink-0 z-10"
        >
          <div className="h-8 w-0.5 rounded-full bg-slate-500/60" />
        </div>

        {/* Right Panel: Code Editor Window + Console Output Window */}
        <div
          ref={rightPanelRef}
          className="flex-1 min-h-[520px] lg:min-h-0 min-w-0 flex flex-col overflow-hidden bg-surface"
        >
          {/* Editor Header Toolbar */}
          <div className="h-11 border-b border-surface-border px-4 flex items-center justify-between shrink-0 bg-surface">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-slate-400" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-background text-xs font-semibold rounded-lg border border-surface-border px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="JAVA">Java 21</option>
                <option value="PYTHON">Python 3.11</option>
                <option value="CPP">C++ 20</option>
                <option value="JAVASCRIPT">JavaScript (Node 20)</option>
              </select>
            </div>

            {/* Action Buttons: Run & Submit */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-subtle hover:bg-surface-border border border-surface-border text-xs font-semibold text-foreground transition disabled:opacity-50"
              >
                {isRunning ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                )}
                <span>Run Samples</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Monaco Code Editor Window */}
          <div className="flex-1 min-h-[200px] min-w-0 relative overflow-hidden">
            <CodeEditor
              value={currentCode}
              onChange={handleCodeChange}
              language={language}
              className="h-full w-full rounded-none border-0"
            />
          </div>

          {/* Vertical Resize Divider between Editor and Output Console */}
          <div
            onMouseDown={() => {
              isDraggingVerticalRef.current = true;
              document.body.style.cursor = "row-resize";
              document.body.style.userSelect = "none";
            }}
            title="Drag to resize Editor and Output area"
            className="h-1.5 hover:h-2 bg-surface-border/50 hover:bg-brand-500/60 cursor-row-resize flex items-center justify-center transition-colors shrink-0 z-10"
          >
            <div className="w-8 h-0.5 rounded-full bg-slate-500/60" />
          </div>

          {/* Bottom Console / Output Window */}
          <div
            style={{ height: isConsoleExpanded ? `${consoleHeightPx}px` : "40px" }}
            className="border-t border-surface-border bg-background flex flex-col min-h-0 min-w-0 overflow-hidden shrink-0"
          >
            {/* Console Toolbar */}
            <div className="h-10 border-b border-surface-border px-4 flex items-center justify-between shrink-0 bg-surface">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    setIsConsoleExpanded(true);
                    setActiveOutputTab("TEST_CASES");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                    activeOutputTab === "TEST_CASES"
                      ? "bg-background text-foreground"
                      : "text-slate-400 hover:text-foreground"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5 text-brand-400" />
                  <span>Test Cases</span>
                </button>

                <button
                  onClick={() => {
                    setIsConsoleExpanded(true);
                    setActiveOutputTab("OUTPUT");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition ${
                    activeOutputTab === "OUTPUT"
                      ? "bg-background text-foreground"
                      : "text-slate-400 hover:text-foreground"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Execution Output</span>
                  {sampleRunResult && (
                    <span
                      className={`h-2 w-2 rounded-full ${
                        sampleRunResult.verdict === "ACCEPTED" ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                  )}
                </button>
              </div>

              <button
                onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                className="p-1 rounded text-slate-400 hover:text-foreground transition"
              >
                {isConsoleExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
            </div>

            {/* Console Scrollable Body */}
            {isConsoleExpanded && (
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto overscroll-contain select-text p-4 text-xs font-mono">
                {activeOutputTab === "TEST_CASES" ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {currentProblem?.sampleTestCases?.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveSampleCaseIndex(idx)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            activeSampleCaseIndex === idx
                              ? "bg-brand-600 text-white"
                              : "bg-surface text-slate-400 hover:text-foreground"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {currentProblem?.sampleTestCases?.[activeSampleCaseIndex] && (
                      <div className="space-y-2 mt-2">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Input:</span>
                          <pre className="p-2 rounded-lg bg-surface text-emerald-400 overflow-x-auto">
                            {currentProblem.sampleTestCases[activeSampleCaseIndex].input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Expected Output:</span>
                          <pre className="p-2 rounded-lg bg-surface text-foreground overflow-x-auto">
                            {currentProblem.sampleTestCases[activeSampleCaseIndex].expectedOutput}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {isRunning ? (
                      <div className="flex items-center gap-2 text-slate-400 py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                        <span>Compiling and executing sample cases...</span>
                      </div>
                    ) : sampleRunResult ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                              sampleRunResult.verdict === "ACCEPTED"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {sampleRunResult.verdict}
                          </span>
                          <span className="text-slate-400">
                            {sampleRunResult.passedTestCases} / {sampleRunResult.totalTestCases} samples passed
                          </span>
                          <span className="text-slate-500">({sampleRunResult.runtimeMs}ms)</span>
                        </div>

                        {sampleRunResult.compileOutput && (
                          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 overflow-x-auto">
                            <pre className="whitespace-pre-wrap">{sampleRunResult.compileOutput}</pre>
                          </div>
                        )}

                        {sampleRunResult.errorMessage && (
                          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 overflow-x-auto">
                            {sampleRunResult.errorMessage}
                          </div>
                        )}

                        <div className="space-y-2">
                          {sampleRunResult.testCases?.map((tc, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-xl border ${
                                tc.passed
                                  ? "bg-surface border-surface-border"
                                  : "bg-rose-500/5 border-rose-500/25"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-400">Sample #{tc.caseNumber}</span>
                                <span className={tc.passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                  {tc.passed ? "PASSED" : "FAILED"}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 mt-2">
                                <div className="min-w-0">
                                  <span className="text-slate-500 block">Your Output:</span>
                                  <pre className="p-1.5 rounded bg-background text-foreground mt-0.5 overflow-x-auto">
                                    {tc.actualOutput || "(none)"}
                                  </pre>
                                </div>
                                <div className="min-w-0">
                                  <span className="text-slate-500 block">Expected:</span>
                                  <pre className="p-1.5 rounded bg-background text-foreground mt-0.5 overflow-x-auto">
                                    {tc.expectedOutput}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 py-4">Click &ldquo;Run Samples&rdquo; to test your code.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proctoring Tab Switch Alert Modal */}
      {tabSwitchWarning !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-surface border border-rose-500/40 shadow-2xl text-center">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Proctoring Alert: Tab Switch Detected</h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              You left or minimized the examination environment. This violation has been logged to your college faculty proctoring dashboard.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-background border border-surface-border text-xs">
              <span className="text-slate-400">Total Alerts Recorded: </span>
              <strong className="text-rose-400 font-bold">
                {tabSwitchWarning} of {detail?.contest.maxTabSwitches} permitted
              </strong>
            </div>
            {tabSwitchWarning > (detail?.contest.maxTabSwitches || 3) && (
              <p className="mt-2 text-[11px] text-rose-400 font-semibold">
                Warning: You have exceeded the permitted threshold. Your submission may be flagged for academic review.
              </p>
            )}
            <button
              onClick={() => setTabSwitchWarning(null)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition"
            >
              I Understand & Return to Examination
            </button>
          </div>
        </div>
      )}

      {/* Submission Result Modal */}
      {submissionSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl">
            <div className="text-center">
              {submissionSuccessModal.verdict === "ACCEPTED" ? (
                <>
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Accepted! Challenge Solved</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Passed all {submissionSuccessModal.totalTestCases} hidden test cases.
                  </p>
                  <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-semibold">Score Awarded:</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      +{submissionSuccessModal.scoreAwarded} pts
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-14 w-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto mb-3">
                    <XCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{submissionSuccessModal.verdict}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Failed on hidden test cases ({submissionSuccessModal.passedTestCases} of{" "}
                    {submissionSuccessModal.totalTestCases} passed).
                  </p>
                  {submissionSuccessModal.compileOutput && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-500/10 text-rose-400 text-left text-[11px] font-mono max-h-32 overflow-y-auto">
                      {submissionSuccessModal.compileOutput}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => setSubmissionSuccessModal(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition"
              >
                Continue Working
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Finish Modal */}
      {showFinishConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-surface border border-surface-border shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Finalize and Submit Examination?</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Once you submit your examination, you will not be able to edit or resubmit your code. Your score will be locked on the institutional leaderboard.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-background border border-surface-border text-xs flex justify-between">
              <span className="text-slate-400">Current Score:</span>
              <strong className="text-emerald-400 font-bold">{participant?.totalScore || 0} pts</strong>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowFinishConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface-border text-foreground font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishExam}
                disabled={isFinishing}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition disabled:opacity-50"
              >
                {isFinishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Confirm Submit</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
