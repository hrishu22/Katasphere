"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Code2,
  ArrowRight,
  Eye,
} from "lucide-react";
import { getProblemHints, ProblemHintStep } from "@/lib/problem-hints-data";

export interface ProblemHintsModalProps {
  problemSlug: string;
  problemTitle: string;
  tags?: string[];
  isOpen: boolean;
  onClose: () => void;
  onOpenVisualizer: () => void;
}

export function ProblemHintsModal({
  problemSlug,
  problemTitle,
  tags = [],
  isOpen,
  onClose,
  onOpenVisualizer,
}: ProblemHintsModalProps) {
  const hintsData = getProblemHints(problemSlug, problemTitle, tags);
  const hints = hintsData.hints;

  // Track max unlocked hint index (0 to 3)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);
  // Current active hint tab being viewed (0 to 3)
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentHint: ProblemHintStep = hints[activeStepIdx] || hints[0];
  const isFinalStep = activeStepIdx === 3;
  const canUnlockNext = unlockedLevel < 3 && activeStepIdx === unlockedLevel;

  const handleRevealNext = () => {
    if (unlockedLevel < 3) {
      const nextLevel = unlockedLevel + 1;
      setUnlockedLevel(nextLevel);
      setActiveStepIdx(nextLevel);
    }
  };

  const stepLabels = [
    { num: 1, title: "Little Hint", desc: "Gentle Nudge" },
    { num: 2, title: "More Hint", desc: "Key Insight" },
    { num: 3, title: "Blueprint", desc: "Algorithm Logic" },
    { num: 4, title: "Visualization", desc: "Mental Model" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-surface-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border bg-surface-subtle shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                Progressive Hints
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                  Step {activeStepIdx + 1} of 4
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-sm sm:max-w-md">
                {problemTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface transition"
            aria-label="Close hints modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-5 py-3 border-b border-surface-border bg-surface grid grid-cols-4 gap-2 shrink-0">
          {stepLabels.map((st, idx) => {
            const isUnlocked = idx <= unlockedLevel;
            const isActive = idx === activeStepIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (isUnlocked) setActiveStepIdx(idx);
                }}
                disabled={!isUnlocked}
                className={`flex flex-col items-start p-2 rounded-lg border text-left transition ${
                  isActive
                    ? "bg-amber-500/10 border-amber-500/50 text-foreground ring-1 ring-amber-500/30"
                    : isUnlocked
                    ? "bg-surface-subtle border-surface-border text-slate-600 dark:text-slate-300 hover:bg-surface-muted"
                    : "bg-surface-subtle/50 border-surface-border/50 text-slate-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      isActive
                        ? "text-amber-600 dark:text-amber-400"
                        : isUnlocked
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    STEP {st.num}
                  </span>
                  {isUnlocked ? (
                    <Unlock className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Lock className="h-3 w-3 text-slate-400" />
                  )}
                </div>
                <div className="font-semibold text-xs truncate w-full mt-0.5">
                  {st.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate w-full hidden sm:block">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Hint Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                {currentHint.badge}
              </span>
            </div>
            <h4 className="text-lg font-bold text-foreground">
              {currentHint.title}
            </h4>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {currentHint.content}
          </p>

          {/* Bullet Points */}
          {currentHint.bullets && currentHint.bullets.length > 0 && (
            <div className="p-3.5 rounded-xl bg-surface-subtle border border-surface-border space-y-2 text-xs">
              {currentHint.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-300 leading-normal">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Code Snippet Hint (if step 3) */}
          {currentHint.codeHint && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5 text-brand-500" />
                Algorithm Pattern Preview
              </div>
              <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {currentHint.codeHint}
              </pre>
            </div>
          )}

          {/* Takeaway Box */}
          {currentHint.keyTakeaway && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              💡 <span className="font-bold">Key Takeaway:</span> {currentHint.keyTakeaway}
            </div>
          )}

          {/* Step 4 Visualizer Launch Card */}
          {isFinalStep && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-brand-500/10 to-purple-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
                <Sparkles className="h-4 w-4" />
                Step 4: Interactive Visual Execution
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch how the pointers move across the data structures in real-time, inspect how variables change on each iteration, and observe the exact solution logic in action.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVisualizer();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Launch Interactive Visualizer</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border bg-surface-subtle shrink-0">
          {/* Back Step */}
          <button
            type="button"
            onClick={() => setActiveStepIdx((prev) => Math.max(prev - 1, 0))}
            disabled={activeStepIdx === 0}
            className="px-3 py-1.5 rounded-lg border border-surface-border text-xs font-semibold text-slate-500 hover:text-foreground hover:bg-surface disabled:opacity-40 transition flex items-center space-x-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous Hint</span>
          </button>

          {/* Action Button: Reveal Next or Launch Visualizer */}
          <div className="flex items-center space-x-2">
            {canUnlockNext ? (
              <button
                type="button"
                onClick={handleRevealNext}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Reveal Hint {unlockedLevel + 2}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : activeStepIdx < unlockedLevel ? (
              <button
                type="button"
                onClick={() => setActiveStepIdx((prev) => Math.min(prev + 1, 3))}
                className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Next Hint</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : isFinalStep ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVisualizer();
                }}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>See Visualizer</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
