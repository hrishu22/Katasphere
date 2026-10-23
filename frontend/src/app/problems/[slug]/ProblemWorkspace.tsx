"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  Code2,
  GripVertical,
  GripHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Terminal,
} from "lucide-react";

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface ExampleDto {
  position: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface ProblemDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  constraintsText: string;
  starterCode: string; // JSON string
  inputFormat?: string;
  outputFormat?: string;
  tags: TagDto[];
  examples: ExampleDto[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TestCaseResult {
  caseNumber: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
  executionTimeMs?: number;
  memoryKb?: number;
  status: string;
  stdout?: string | null;
}

interface ExecutionResult {
  verdict: string;
  totalTestCases: number;
  passedTestCases: number;
  runtimeMs: number;
  memoryKb: number;
  compileOutput?: string;
  errorMessage?: string;
  testCases: TestCaseResult[];
  timestamp: string;
}

interface SubmissionResult {
  id: string;
  problemSlug: string;
  problemTitle: string;
  language: string;
  verdict: string;
  passedTestCases: number;
  totalTestCases: number;
  executionTimeMs?: number;
  memoryKb?: number;
  errorMessage?: string;
  createdAt: string;
}

type Language = "PYTHON" | "JAVA" | "CPP" | "JAVASCRIPT";

interface ProblemWorkspaceProps {
  slug: string;
  initialProblem?: ProblemDetail | null;
}

export function ProblemWorkspace({ slug, initialProblem }: ProblemWorkspaceProps) {
  // Parse initial starter code
  let initialStarters: Record<string, string> = {};
  if (initialProblem?.starterCode) {
    try {
      initialStarters =
        typeof initialProblem.starterCode === "string"
          ? JSON.parse(initialProblem.starterCode)
          : initialProblem.starterCode;
    } catch {
      initialStarters = {};
    }
  }

  const [problem, setProblem] = useState<ProblemDetail | null>(initialProblem || null);
  const [loading, setLoading] = useState(!initialProblem);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<Language>("PYTHON");
  const [code, setCode] = useState<string>(
    initialStarters["PYTHON"] || "// Write your code here"
  );
  const [starterCodes, setStarterCodes] =
    useState<Record<string, string>>(initialStarters);

  const [activeTab, setActiveTab] = useState<"testcases" | "result">("testcases");
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);

  // Execution & Submission state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [selectedResultCaseIdx, setSelectedResultCaseIdx] = useState(0);

  // Horizontal split-pane resize state
  const [leftWidth, setLeftWidth] = useState<number>(50); // percentage 20% to 80%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dragging event listeners for horizontal resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(rawPercent, 20), 80);
      setLeftWidth(clamped);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current || e.touches.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPercent = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(Math.max(rawPercent, 20), 80);
      setLeftWidth(clamped);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Vertical split-pane resize state (Code Editor vs Test Cases)
  const [bottomHeight, setBottomHeight] = useState<number>(170); // default compact height in px
  const [isDraggingVertical, setIsDraggingVertical] = useState<boolean>(false);
  const [isBottomCollapsed, setIsBottomCollapsed] = useState<boolean>(false);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  // Vertical dragging event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingVertical || !rightPaneRef.current) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const newHeight = rect.bottom - e.clientY;
      const maxAllowed = Math.min(rect.height * 0.75, 550);
      const clamped = Math.min(Math.max(newHeight, 80), maxAllowed);
      setBottomHeight(clamped);
      if (isBottomCollapsed) setIsBottomCollapsed(false);
    };

    const handleMouseUp = () => {
      setIsDraggingVertical(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingVertical || !rightPaneRef.current || e.touches.length === 0) return;
      const rect = rightPaneRef.current.getBoundingClientRect();
      const newHeight = rect.bottom - e.touches[0].clientY;
      const maxAllowed = Math.min(rect.height * 0.75, 550);
      const clamped = Math.min(Math.max(newHeight, 80), maxAllowed);
      setBottomHeight(clamped);
      if (isBottomCollapsed) setIsBottomCollapsed(false);
    };

    if (isDraggingVertical) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDraggingVertical, isBottomCollapsed]);

  // Fetch Problem Details if not provided via initialProblem or if slug changes
  useEffect(() => {
    async function fetchProblem() {
      if (!slug) return;
      // If we already have the matching problem from initialProblem, skip fetching
      if (problem && problem.slug === slug) return;

      setLoading(true);
      setError(null);

      try {
        const res = await apiClient<ApiResponse<ProblemDetail>>(`/api/v1/problems/${slug}`);
        if (res && res.data) {
          setProblem(res.data);

          let parsedStarters: Record<string, string> = {};
          try {
            parsedStarters =
              typeof res.data.starterCode === "string"
                ? JSON.parse(res.data.starterCode)
                : res.data.starterCode;
          } catch {
            parsedStarters = {};
          }
          setStarterCodes(parsedStarters);
          setCode(parsedStarters["PYTHON"] || "// Write your code here");
        }
      } catch (err: any) {
        setError("Problem not found or could not be loaded.");
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [slug]);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    if (starterCodes[lang]) {
      setCode(starterCodes[lang]);
    }
  };

  const handleReset = () => {
    if (starterCodes[selectedLanguage]) {
      setCode(starterCodes[selectedLanguage]);
    }
  };

  const handleRunCode = async () => {
    if (!slug || isRunning || isSubmitting) return;
    setIsRunning(true);
    setSubmissionResult(null);
    setActiveTab("result");
    if (isBottomCollapsed) setIsBottomCollapsed(false);

    try {
      const res = await apiClient<ApiResponse<ExecutionResult>>("/api/v1/submissions/run", {
        method: "POST",
        body: JSON.stringify({
          problemSlug: slug,
          language: selectedLanguage,
          sourceCode: code,
        }),
      });

      if (res && res.data) {
        setExecutionResult(res.data);
        setSelectedResultCaseIdx(0);
      }
    } catch (err: any) {
      setExecutionResult({
        verdict: "INTERNAL_ERROR",
        totalTestCases: 0,
        passedTestCases: 0,
        runtimeMs: 0,
        memoryKb: 0,
        errorMessage: err?.message || "Execution failed",
        testCases: [],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!slug || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setExecutionResult(null);
    setActiveTab("result");
    if (isBottomCollapsed) setIsBottomCollapsed(false);

    try {
      const res = await apiClient<ApiResponse<SubmissionResult>>("/api/v1/submissions", {
        method: "POST",
        body: JSON.stringify({
          problemSlug: slug,
          language: selectedLanguage,
          sourceCode: code,
        }),
      });

      if (res && res.data) {
        setSubmissionResult(res.data);
      }
    } catch (err: any) {
      setSubmissionResult({
        id: "",
        problemSlug: slug,
        problemTitle: problem?.title || "",
        language: selectedLanguage,
        verdict: "INTERNAL_ERROR",
        passedTestCases: 0,
        totalTestCases: 0,
        errorMessage: err?.message || "Submission failed",
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyColors = {
    EASY: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    MEDIUM: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
    HARD: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-slate-500">Loading problem workspace...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !problem) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Problem Not Found</h2>
          <p className="text-sm text-slate-500">{error || "Could not locate this challenge."}</p>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Problem Catalog</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Problem Navigation Bar */}
      <header className="h-14 border-b border-surface-border bg-surface px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/problems"
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface-subtle transition"
            title="Back to problems"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-bold text-sm text-foreground flex items-center gap-2">
            {problem.title}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {problem.difficulty}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Split Ratio Presets */}
          <div className="hidden sm:flex items-center space-x-0.5 p-0.5 bg-surface-subtle rounded-lg border border-surface-border text-xs font-mono">
            <button
              type="button"
              onClick={() => setLeftWidth(35)}
              title="Code focus (35% question / 65% editor)"
              className={`px-2 py-1 rounded transition ${
                leftWidth <= 40
                  ? "bg-brand-600 text-white font-semibold shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-foreground"
              }`}
            >
              35%
            </button>
            <button
              type="button"
              onClick={() => setLeftWidth(50)}
              title="Balanced split (50% question / 50% editor)"
              className={`px-2 py-1 rounded transition ${
                leftWidth > 40 && leftWidth < 60
                  ? "bg-brand-600 text-white font-semibold shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-foreground"
              }`}
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setLeftWidth(65)}
              title="Reading focus (65% question / 35% editor)"
              className={`px-2 py-1 rounded transition ${
                leftWidth >= 60
                  ? "bg-brand-600 text-white font-semibold shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-foreground"
              }`}
            >
              65%
            </button>
          </div>

          {/* Language Selector */}
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="PYTHON">Python 3</option>
            <option value="JAVA">Java 21</option>
            <option value="CPP">C++ 20</option>
            <option value="JAVASCRIPT">JavaScript</option>
          </select>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface-subtle transition"
            title="Reset to starter code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            className="px-3.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-muted border border-surface-border text-xs font-semibold text-foreground transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="h-3 w-3 animate-spin text-brand-500" />
            ) : (
              <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />
            )}
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </div>
      </header>

      {/* Main Resizable Split-Pane View */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative"
      >
        {/* Left Panel: Problem Statement */}
        <div
          className="overflow-y-auto p-6 space-y-6 w-full lg:w-[var(--left-width)] shrink-0 min-w-0 border-b lg:border-b-0 lg:border-r border-surface-border"
          style={{ "--left-width": `${leftWidth}%` } as React.CSSProperties}
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {problem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              {problem.tags.map((t) => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-surface-subtle text-slate-600 dark:text-slate-400 border border-surface-border font-mono"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line text-slate-700 dark:text-slate-300">
            {problem.description}
          </div>

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Examples
              </h3>
              <div className="space-y-3">
                {problem.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-2 text-xs"
                  >
                    <span className="font-bold text-foreground">Example {ex.position}:</span>
                    <div className="font-mono bg-surface p-2.5 rounded border border-surface-border space-y-1">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Input: </span>
                        <span className="text-foreground">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Output: </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {ex.expectedOutput}
                        </span>
                      </div>
                      {ex.explanation && (
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Explanation: </span>
                          <span className="text-slate-700 dark:text-slate-300">
                            {ex.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {problem.constraintsText && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Constraints
              </h3>
              <div className="p-4 rounded-xl bg-surface-subtle border border-surface-border text-xs font-mono whitespace-pre-line text-slate-600 dark:text-slate-300">
                {problem.constraintsText}
              </div>
            </div>
          )}
        </div>

        {/* Draggable & Scrollable Horizontal Divider Gutter */}
        <div
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onDoubleClick={() => setLeftWidth(50)}
          className={`hidden lg:flex items-center justify-center relative z-20 select-none shrink-0 w-3 -mx-1.5 cursor-col-resize group transition-colors ${
            isDragging ? "bg-brand-500/20" : "hover:bg-brand-500/10"
          }`}
          title="Drag horizontally to resize | Double-click to reset (50/50)"
        >
          {/* Central Line Indicator */}
          <div
            className={`w-[2px] h-full transition-colors ${
              isDragging
                ? "bg-brand-500 shadow-sm"
                : "bg-surface-border group-hover:bg-brand-500/60"
            }`}
          />

          {/* Floating Pill Scroll Button with Chevron Nudge + Grip Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 flex items-center shadow-md border rounded-full px-1 py-1.5 bg-surface transition-all duration-150 ${
              isDragging
                ? "border-brand-500 scale-110 shadow-brand-500/30 ring-2 ring-brand-500/20 text-brand-500"
                : "border-surface-border text-slate-500 group-hover:border-brand-500/50 group-hover:text-brand-500 group-hover:scale-105"
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLeftWidth((w) => Math.max(w - 10, 20));
              }}
              title="Shrink problem pane (-10%)"
              className="p-0.5 hover:text-brand-500 text-slate-400 hover:bg-surface-subtle rounded transition"
            >
              <ChevronLeft className="h-3 w-3" />
            </button>

            <div className="flex flex-col items-center justify-center px-0.5 cursor-col-resize">
              <GripVertical className="h-3.5 w-3.5" />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLeftWidth((w) => Math.min(w + 10, 80));
              }}
              title="Expand problem pane (+10%)"
              className="p-0.5 hover:text-brand-500 text-slate-400 hover:bg-surface-subtle rounded transition"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Right Panel: Code Workspace & Results */}
        <div
          ref={rightPaneRef}
          className="flex flex-col h-full bg-surface-subtle overflow-hidden w-full lg:flex-1 min-w-0"
        >
          {/* Code Area (Expanded to occupy majority of height) */}
          <div className="flex-1 flex flex-col p-3 pb-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                Solution.
                {selectedLanguage === "PYTHON"
                  ? "py"
                  : selectedLanguage === "JAVA"
                  ? "java"
                  : selectedLanguage === "CPP"
                  ? "cpp"
                  : "js"}
              </span>
              <span>Monaco / Editor Canvas</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-surface border border-surface-border font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none overflow-auto shadow-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Vertical Draggable Gutter / Scrollable Split Button */}
          <div
            onMouseDown={() => setIsDraggingVertical(true)}
            onTouchStart={() => setIsDraggingVertical(true)}
            onDoubleClick={() => {
              if (isBottomCollapsed) {
                setIsBottomCollapsed(false);
                setBottomHeight(170);
              } else {
                setBottomHeight(170);
              }
            }}
            className={`w-full h-3 -my-1.5 relative z-20 select-none cursor-row-resize flex items-center justify-center group transition-colors ${
              isDraggingVertical ? "bg-brand-500/20" : "hover:bg-brand-500/10"
            }`}
            title="Drag vertically to resize testcases / editor | Double-click to reset"
          >
            {/* Horizontal line indicator */}
            <div
              className={`h-[2px] w-full transition-colors ${
                isDraggingVertical
                  ? "bg-brand-500 shadow-sm"
                  : "bg-surface-border group-hover:bg-brand-500/60"
              }`}
            />

            {/* Scrollable / Draggable Grip Pill Button */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 flex items-center shadow-md border rounded-full px-2.5 py-0.5 bg-surface transition-all duration-150 ${
                isDraggingVertical
                  ? "border-brand-500 text-brand-500 scale-105 shadow-brand-500/30 ring-2 ring-brand-500/20"
                  : "border-surface-border text-slate-500 dark:text-slate-400 group-hover:border-brand-500/50 group-hover:text-brand-500 group-hover:scale-105"
              }`}
            >
              <GripHorizontal className="h-3.5 w-5" />
            </div>
          </div>

          {/* Bottom Tabs: Test Cases & Execution Verdicts (Scrollable & Collapsible) */}
          <div
            className="border-t border-surface-border bg-surface flex flex-col shrink-0 transition-[height] duration-75"
            style={{ height: isBottomCollapsed ? "38px" : `${bottomHeight}px` }}
          >
            <div className="flex items-center justify-between border-b border-surface-border px-3 text-xs font-semibold shrink-0 h-[38px]">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setActiveTab("testcases");
                    if (isBottomCollapsed) setIsBottomCollapsed(false);
                  }}
                  className={`py-2 px-3 border-b-2 transition ${
                    activeTab === "testcases"
                      ? "border-brand-500 text-brand-500 font-bold"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-foreground"
                  }`}
                >
                  Sample Testcases
                </button>
                <button
                  onClick={() => {
                    setActiveTab("result");
                    if (isBottomCollapsed) setIsBottomCollapsed(false);
                  }}
                  className={`py-2 px-3 border-b-2 transition ${
                    activeTab === "result"
                      ? "border-brand-500 text-brand-500 font-bold"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-foreground"
                  }`}
                >
                  Execution Result
                </button>
              </div>

              {/* Right side controls: Expand/Collapse */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => {
                    if (isBottomCollapsed) {
                      setIsBottomCollapsed(false);
                      setBottomHeight(170);
                    } else {
                      setIsBottomCollapsed(true);
                    }
                  }}
                  className="px-2 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-surface-subtle transition flex items-center space-x-1 text-xs"
                  title={
                    isBottomCollapsed
                      ? "Expand test cases (view test inputs)"
                      : "Collapse test cases (maximize code editor height)"
                  }
                >
                  {isBottomCollapsed ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-medium hidden sm:inline">Expand</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-medium hidden sm:inline">Collapse</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Cases Scrollable Content */}
            {!isBottomCollapsed && (
              <div className="p-3 flex-1 overflow-y-auto text-xs font-mono space-y-3">
                {activeTab === "testcases" ? (
                  <div className="space-y-3">
                    {/* Horizontal scrollable case pill buttons */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                      {problem.examples?.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedExampleIdx(idx)}
                          className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition ${
                            selectedExampleIdx === idx
                              ? "bg-brand-600 text-white shadow-xs"
                              : "bg-surface-subtle text-slate-600 dark:text-slate-400 hover:text-foreground border border-surface-border"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {problem.examples && problem.examples[selectedExampleIdx] && (
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Input:</span>
                          <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-foreground overflow-x-auto">
                            {problem.examples[selectedExampleIdx].input}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">
                            Expected Output:
                          </span>
                          <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                            {problem.examples[selectedExampleIdx].expectedOutput}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isRunning ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                    <p className="text-xs font-semibold text-foreground">
                      Running sample test cases in Judge0 sandbox...
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Compiling code and gathering runtime telemetry
                    </p>
                  </div>
                ) : isSubmitting ? (
                  <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
                    <p className="text-xs font-semibold text-foreground">
                      Evaluating submission against all test suites...
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Running against public & hidden test cases
                    </p>
                  </div>
                ) : submissionResult ? (
                  <div className="space-y-3">
                    <div
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        submissionResult.verdict === "ACCEPTED"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {submissionResult.verdict === "ACCEPTED" ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-sm tracking-wide">
                            {submissionResult.verdict === "ACCEPTED"
                              ? "Accepted"
                              : submissionResult.verdict.replace(/_/g, " ")}
                          </span>
                          <span className="ml-2 text-xs opacity-80">
                            ({submissionResult.passedTestCases} / {submissionResult.totalTestCases}{" "}
                            test cases passed)
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-mono space-x-3 opacity-90">
                        {submissionResult.executionTimeMs != null && (
                          <span>
                            Runtime:{" "}
                            <strong className="text-foreground">
                              {submissionResult.executionTimeMs} ms
                            </strong>
                          </span>
                        )}
                        {submissionResult.memoryKb != null && (
                          <span>
                            Memory:{" "}
                            <strong className="text-foreground">
                              {(submissionResult.memoryKb / 1024).toFixed(1)} MB
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {submissionResult.errorMessage && (
                      <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border text-rose-500 font-mono text-xs whitespace-pre-wrap">
                        {submissionResult.errorMessage}
                      </div>
                    )}
                  </div>
                ) : executionResult ? (
                  <div className="space-y-3">
                    {/* Overall Verdict Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                            executionResult.verdict === "ACCEPTED"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {executionResult.verdict === "ACCEPTED"
                            ? "Accepted"
                            : executionResult.verdict.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {executionResult.passedTestCases} / {executionResult.totalTestCases} passed
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span>
                          Runtime:{" "}
                          <strong className="text-foreground">{executionResult.runtimeMs} ms</strong>
                        </span>
                        {executionResult.memoryKb > 0 && (
                          <span>
                            Memory:{" "}
                            <strong className="text-foreground">
                              {(executionResult.memoryKb / 1024).toFixed(1)} MB
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compile Error Output */}
                    {executionResult.compileOutput && (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 font-mono text-xs whitespace-pre-wrap">
                        <div className="font-bold mb-1">Compilation Output:</div>
                        {executionResult.compileOutput}
                      </div>
                    )}

                    {/* Per-Test Case Tabs */}
                    {executionResult.testCases && executionResult.testCases.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                          {executionResult.testCases.map((tc, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedResultCaseIdx(idx)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold shrink-0 transition flex items-center space-x-1.5 ${
                                selectedResultCaseIdx === idx
                                  ? "bg-surface text-foreground border border-slate-400 dark:border-slate-500 shadow-xs"
                                  : "bg-surface-subtle text-slate-500 hover:text-foreground border border-surface-border"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  tc.passed ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              <span>Case {tc.caseNumber}</span>
                            </button>
                          ))}
                        </div>

                        {executionResult.testCases[selectedResultCaseIdx] && (
                          <div className="space-y-2 pt-1 font-mono text-xs">
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">Input:</span>
                              <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-foreground overflow-x-auto">
                                {executionResult.testCases[selectedResultCaseIdx].input}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">
                                  Expected Output:
                                </span>
                                <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-emerald-600 dark:text-emerald-400 overflow-x-auto">
                                  {executionResult.testCases[selectedResultCaseIdx].expectedOutput}
                                </div>
                              </div>

                              <div>
                                <span className="text-slate-500 dark:text-slate-400">
                                  Your Output:
                                </span>
                                <div
                                  className={`mt-1 p-2 rounded bg-surface-subtle border border-surface-border overflow-x-auto ${
                                    executionResult.testCases[selectedResultCaseIdx].passed
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-rose-600 dark:text-rose-400"
                                  }`}
                                >
                                  {executionResult.testCases[selectedResultCaseIdx].actualOutput ||
                                    "(empty output)"}
                                </div>
                              </div>
                            </div>

                            {executionResult.testCases[selectedResultCaseIdx].stdout && (
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">
                                  Stdout / Debug Console:
                                </span>
                                <div className="mt-1 p-2.5 rounded bg-surface-subtle border border-surface-border text-foreground font-mono text-xs whitespace-pre-wrap">
                                  {executionResult.testCases[selectedResultCaseIdx].stdout}
                                </div>
                              </div>
                            )}

                            {executionResult.testCases[selectedResultCaseIdx].error && (
                              <div>
                                <span className="text-rose-500">Error / Diagnostics:</span>
                                <div className="mt-1 p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 whitespace-pre-wrap">
                                  {executionResult.testCases[selectedResultCaseIdx].error}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2 text-slate-500 dark:text-slate-400">
                    <div className="h-9 w-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500 mx-auto">
                      <Terminal className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">No execution results yet</h4>
                    <p className="text-xs max-w-sm mx-auto">
                      Click <span className="font-semibold text-foreground">Run Code</span> to test
                      against sample cases, or{" "}
                      <span className="font-semibold text-foreground">Submit</span> to evaluate
                      against hidden test suites.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
