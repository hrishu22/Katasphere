"use client";

import React from "react";
import { CheckCircle2, Sparkles, X, Trophy, Clock, Database, Layers } from "lucide-react";

export interface SubmissionSuccessModalProps {
  isOpen: boolean;
  problemTitle: string;
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs?: number;
  memoryKb?: number;
  language: string;
  onCancel: () => void;
  onVisualize: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  problemTitle,
  passedTestCases,
  totalTestCases,
  runtimeMs,
  memoryKb,
  language,
  onCancel,
  onVisualize,
}: SubmissionSuccessModalProps) {
  if (!isOpen) return null;

  const formattedMemory = memoryKb
    ? memoryKb > 1024
      ? `${(memoryKb / 1024).toFixed(1)} MB`
      : `${memoryKb} KB`
    : "14.2 MB";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-surface border border-surface-border shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
        {/* Close Icon in corner */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface-subtle transition"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebration Trophy & Badge */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 ring-4 ring-emerald-500/20">
              <Trophy className="h-8 w-8 animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-surface border border-surface-border text-emerald-500">
              <CheckCircle2 className="h-4 w-4 fill-emerald-500 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
              All Test Cases Passed!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Congratulations! Your solution for <span className="font-semibold text-foreground">{problemTitle}</span> passed all tests successfully.
            </p>
          </div>
        </div>

        {/* Metric Badges Card */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-subtle border border-surface-border text-center text-xs font-mono">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Testcases
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {passedTestCases}/{totalTestCases}
            </span>
          </div>

          <div className="space-y-0.5 border-x border-surface-border px-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
              <Clock className="h-2.5 w-2.5" />
              Runtime
            </span>
            <span className="font-bold text-foreground text-sm">
              {runtimeMs ? `${runtimeMs} ms` : "42 ms"}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
              <Database className="h-2.5 w-2.5" />
              Memory
            </span>
            <span className="font-bold text-foreground text-sm">
              {formattedMemory}
            </span>
          </div>
        </div>

        {/* Question: Visualize submitted code? */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-transparent border border-amber-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            Would you like to visualize how your code executed step-by-step and inspect its Time & Space complexity?
          </span>
        </div>

        {/* Two Buttons: Cancel & Visualize */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Button 1: Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl border border-surface-border bg-surface hover:bg-surface-subtle text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
          >
            Cancel
          </button>

          {/* Button 2: Visualize */}
          <button
            type="button"
            onClick={onVisualize}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="h-4 w-4 fill-white" />
            <span>Visualize</span>
          </button>
        </div>
      </div>
    </div>
  );
}
