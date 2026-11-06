"use client";

import React from "react";
import { X, Sparkles, Cpu, Clock, Database, CheckCircle2, ArrowLeft } from "lucide-react";
import { AlgorithmVisualizer } from "@/components/visualizer/AlgorithmVisualizer";
import { analyzeComplexity } from "@/components/visualizer/algorithm-tracer";

export interface SubmissionVisualizerModalProps {
  isOpen: boolean;
  problemSlug: string;
  problemTitle: string;
  code: string;
  language: string;
  examples: {
    position: number;
    input: string;
    expectedOutput: string;
    explanation?: string;
  }[];
  onClose: () => void;
}

export function SubmissionVisualizerModal({
  isOpen,
  problemSlug,
  problemTitle,
  code,
  language,
  examples = [],
  onClose,
}: SubmissionVisualizerModalProps) {
  if (!isOpen) return null;

  const analysis = analyzeComplexity(code, problemSlug);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-5xl h-[92vh] rounded-2xl bg-surface border border-surface-border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border bg-surface-subtle shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-brand-600 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                Submitted Code Visualization & Complexity
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Accepted Solution
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {problemTitle} &bull; {language}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface transition"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Top Summary: Time & Space Complexity Highlight Banner */}
        <div className="px-5 py-3 border-b border-surface-border bg-surface grid grid-cols-1 md:grid-cols-2 gap-3 shrink-0">
          {/* Time Complexity Card */}
          <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                Time Complexity
              </span>
              <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {analysis.timeComplexity}
              </span>
            </div>
            <div className="text-xs font-bold text-foreground">
              {analysis.timeComplexityName}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {analysis.timeExplanation}
            </p>
          </div>

          {/* Space Complexity Card */}
          <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-purple-500" />
                Space Complexity
              </span>
              <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                {analysis.spaceComplexity}
              </span>
            </div>
            <div className="text-xs font-bold text-foreground">
              {analysis.spaceComplexityName}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {analysis.spaceExplanation}
            </p>
          </div>
        </div>

        {/* Main Body: Interactive Step-by-Step Visualizer */}
        <div className="flex-1 min-h-0 overflow-hidden p-3 bg-surface-subtle">
          <AlgorithmVisualizer
            problemSlug={problemSlug}
            problemTitle={problemTitle}
            code={code}
            language={language}
            examples={examples}
            onClose={onClose}
            isMaximized={true}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-surface-border bg-surface flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click step scrubber or Play button above to watch memory and pointer executions.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-surface-border bg-surface-subtle hover:bg-surface-muted text-foreground text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
