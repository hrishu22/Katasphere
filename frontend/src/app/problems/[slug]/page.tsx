"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  Clock,
  Sparkles,
  Loader2,
  Code2,
} from "lucide-react";

interface TagDto {
  id: string;
  name: string;
  slug: string;
}

interface ExampleDto {
  position: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

interface ProblemDetail {
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

type Language = "PYTHON" | "JAVA" | "CPP" | "JAVASCRIPT";

export default function ProblemWorkspacePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguage, setSelectedLanguage] = useState<Language>("PYTHON");
  const [code, setCode] = useState<string>("");
  const [starterCodes, setStarterCodes] = useState<Record<string, string>>({});

  const [activeTab, setActiveTab] = useState<"testcases" | "result">("testcases");
  const [selectedExampleIdx, setSelectedExampleIdx] = useState(0);

  // Fetch Problem Details
  useEffect(() => {
    async function fetchProblem() {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient<ApiResponse<ProblemDetail>>(`/api/v1/problems/${slug}`);
        if (res && res.data) {
          setProblem(res.data);

          let parsedStarters: Record<string, string> = {};
          try {
            parsedStarters = typeof res.data.starterCode === "string"
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

  const difficultyColors = {
    EASY: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    MEDIUM: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    HARD: "text-rose-500 bg-rose-500/10 border-rose-500/20",
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
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
            onClick={() => setActiveTab("result")}
            className="px-3.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-muted border border-surface-border text-xs font-semibold text-foreground transition flex items-center space-x-1.5"
          >
            <Play className="h-3 w-3 text-emerald-500 fill-emerald-500" />
            <span>Run Code</span>
          </button>

          <button
            onClick={() => setActiveTab("result")}
            className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
          >
            <Send className="h-3 w-3" />
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Resizable Split-Pane View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Panel: Problem Statement */}
        <div className="overflow-y-auto p-6 border-r border-surface-border space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {problem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5">
              {problem.tags.map((t) => (
                <span
                  key={t.id}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-surface-subtle text-slate-500 dark:text-slate-400 font-mono"
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
                        <span className="text-slate-400">Input: </span>
                        <span className="text-foreground">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Output: </span>
                        <span className="text-emerald-500 font-semibold">{ex.expectedOutput}</span>
                      </div>
                      {ex.explanation && (
                        <div>
                          <span className="text-slate-400">Explanation: </span>
                          <span className="text-slate-300">{ex.explanation}</span>
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

        {/* Right Panel: Code Workspace & Results */}
        <div className="flex flex-col h-full bg-surface-subtle">
          {/* Code Area */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                Solution.{selectedLanguage === "PYTHON" ? "py" : selectedLanguage === "JAVA" ? "java" : selectedLanguage === "CPP" ? "cpp" : "js"}
              </span>
              <span>Monaco / Editor Canvas</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full p-4 rounded-xl bg-surface border border-surface-border font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              spellCheck={false}
            />
          </div>

          {/* Bottom Tabs: Test Cases & Execution Verdicts */}
          <div className="h-48 border-t border-surface-border bg-surface flex flex-col">
            <div className="flex border-b border-surface-border px-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab("testcases")}
                className={`py-2 px-3 border-b-2 transition ${
                  activeTab === "testcases"
                    ? "border-brand-500 text-brand-500 font-bold"
                    : "border-transparent text-slate-400 hover:text-foreground"
                }`}
              >
                Sample Testcases
              </button>
              <button
                onClick={() => setActiveTab("result")}
                className={`py-2 px-3 border-b-2 transition ${
                  activeTab === "result"
                    ? "border-brand-500 text-brand-500 font-bold"
                    : "border-transparent text-slate-400 hover:text-foreground"
                }`}
              >
                Execution Result
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto text-xs font-mono">
              {activeTab === "testcases" ? (
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    {problem.examples?.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedExampleIdx(idx)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                          selectedExampleIdx === idx
                            ? "bg-brand-600 text-white"
                            : "bg-surface-subtle text-slate-400 hover:text-foreground"
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  {problem.examples && problem.examples[selectedExampleIdx] && (
                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-400">Input:</span>
                        <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-foreground">
                          {problem.examples[selectedExampleIdx].input}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Expected Output:</span>
                        <div className="mt-1 p-2 rounded bg-surface-subtle border border-surface-border text-emerald-500">
                          {problem.examples[selectedExampleIdx].expectedOutput}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 text-slate-400">
                  <div className="flex items-center space-x-2 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-bold">Ready for Execution</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Judge0 compilation and container execution sandbox will run your test cases in Milestone 5.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
