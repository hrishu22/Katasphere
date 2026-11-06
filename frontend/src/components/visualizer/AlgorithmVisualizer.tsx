"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Clock,
  Database,
  Sliders,
  CheckCircle2,
  Info,
  HelpCircle,
  Hash,
  Layers,
  ArrowDown,
  ArrowUp,
  Cpu,
} from "lucide-react";
import {
  generateExecutionTrace,
  TraceFrame,
  AlgorithmAnalysis,
} from "./algorithm-tracer";

export interface AlgorithmVisualizerProps {
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
  isMaximized?: boolean;
  onToggleMaximize?: () => void;
}

export function AlgorithmVisualizer({
  problemSlug,
  problemTitle,
  code,
  language,
  examples = [],
  onClose,
  isMaximized = false,
  onToggleMaximize,
}: AlgorithmVisualizerProps) {
  // Input selection state
  const [selectedExampleIdx, setSelectedExampleIdx] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>("");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Playback state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine current raw input string
  const activeInput = useMemo(() => {
    if (isCustomMode && customInput.trim()) {
      return customInput;
    }
    if (examples && examples.length > 0) {
      const ex = examples[selectedExampleIdx] || examples[0];
      return ex.input || "";
    }
    return "nums = [2,7,11,15], target = 9";
  }, [isCustomMode, customInput, selectedExampleIdx, examples]);

  // Generate trace frames
  const traceResult = useMemo(() => {
    return generateExecutionTrace(problemSlug, code, activeInput, language);
  }, [problemSlug, code, activeInput, language]);

  const frames = traceResult.frames || [];
  const analysis: AlgorithmAnalysis = traceResult.analysis;
  const totalFrames = frames.length;

  // Clamp current step if frames length changes
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [activeInput, problemSlug]);

  // Current frame
  const currentFrame: TraceFrame | undefined = frames[currentStep];

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      const delayMs = Math.max(500, Math.floor(1400 / playbackSpeed));
      timerRef.current = setTimeout(() => {
        if (currentStep < totalFrames - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, delayMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, totalFrames, playbackSpeed]);

  const handlePlayPause = () => {
    if (currentStep >= totalFrames - 1) {
      // Loop back to start if finished
      setCurrentStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < totalFrames - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  // Phase badge styling
  const phaseBadge = useMemo(() => {
    const phase = currentFrame?.phase || "init";
    switch (phase) {
      case "init":
        return { label: "INITIALIZATION", bg: "bg-blue-500/10 text-blue-500 border-blue-500/30" };
      case "check":
        return { label: "EVALUATE", bg: "bg-amber-500/10 text-amber-500 border-amber-500/30" };
      case "update":
        return { label: "STATE UPDATE", bg: "bg-purple-500/10 text-purple-500 border-purple-500/30" };
      case "found":
        return { label: "MATCH FOUND", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" };
      case "done":
        return { label: "TERMINATED", bg: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
      default:
        return { label: "ITERATION", bg: "bg-brand-500/10 text-brand-500 border-brand-500/30" };
    }
  }, [currentFrame?.phase]);

  return (
    <div className="flex flex-col h-full bg-surface border border-surface-border rounded-xl shadow-lg overflow-hidden select-none">
      {/* 1. Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-surface-border bg-surface-subtle shrink-0">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-xs text-foreground tracking-tight flex items-center gap-1.5">
            Algorithm Visualizer
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20">
              Interactive
            </span>
          </span>
        </div>

        {/* Test Case & Custom Input Switcher */}
        <div className="flex items-center space-x-1.5 text-xs">
          <div className="flex items-center space-x-0.5 p-0.5 bg-surface rounded-lg border border-surface-border text-[11px]">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setSelectedExampleIdx(idx);
                }}
                className={`px-2 py-0.5 rounded transition ${
                  !isCustomMode && selectedExampleIdx === idx
                    ? "bg-brand-600 text-white font-semibold shadow-xs"
                    : "text-slate-500 hover:text-foreground"
                }`}
                title={`Run trace on Example ${ex.position}`}
              >
                Ex {ex.position}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (!isCustomMode) {
                  setCustomInput(activeInput);
                }
                setIsCustomMode(!isCustomMode);
              }}
              className={`px-2 py-0.5 rounded transition ${
                isCustomMode
                  ? "bg-amber-600 text-white font-semibold shadow-xs"
                  : "text-slate-500 hover:text-foreground"
              }`}
              title="Test custom testcase input"
            >
              Custom
            </button>
          </div>

          {/* Maximize / Minimize toggle */}
          {onToggleMaximize && (
            <button
              type="button"
              onClick={onToggleMaximize}
              className="p-1 rounded text-slate-400 hover:text-foreground hover:bg-surface transition"
              title={isMaximized ? "Restore split layout" : "Expand visualizer to full pane"}
            >
              {isMaximized ? (
                <Minimize2 className="h-3.5 w-3.5" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-surface transition"
            title="Close visualizer panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Custom Input Drawer (if open) */}
      {isCustomMode && (
        <div className="p-2.5 bg-surface-subtle border-b border-surface-border flex items-center gap-2 text-xs">
          <span className="font-mono text-slate-400 shrink-0">Input:</span>
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. nums = [3, 2, 4], target = 6"
            className="flex-1 px-2.5 py-1 rounded bg-surface border border-surface-border text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="px-2.5 py-1 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold transition shrink-0"
          >
            Update Trace
          </button>
        </div>
      )}

      {/* 2. Main Visualizer Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Step Narrative Card */}
        {currentFrame ? (
          <div className="p-3 rounded-xl bg-gradient-to-br from-surface to-surface-subtle border border-surface-border space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${phaseBadge.bg}`}
              >
                {phaseBadge.label}
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Step {currentStep + 1} of {totalFrames}
              </span>
            </div>

            <h4 className="font-bold text-sm text-foreground tracking-tight">
              {currentFrame.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentFrame.explanation}
            </p>

            {currentFrame.codeLine && (
              <div className="pt-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-0.5">
                  Code Action
                </div>
                <div className="font-mono text-xs px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-emerald-600 dark:text-emerald-400 overflow-x-auto whitespace-pre">
                  {currentFrame.codeLine}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-400">
            No trace available for current input.
          </div>
        )}

        {/* 3. Data Structure Visualizations */}
        {currentFrame && (
          <div className="space-y-3">
            {/* Array Visualizations */}
            {currentFrame.arrays && currentFrame.arrays.length > 0 && (
              <div className="space-y-2">
                {currentFrame.arrays.map((arr, arrIdx) => (
                  <div
                    key={arrIdx}
                    className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-brand-500" />
                        {arr.name} [{arr.elements.length}]
                      </span>
                      {arr.pointers.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-[11px]">
                          {arr.pointers.map((ptr, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.2 rounded font-mono font-medium border"
                              style={{
                                color: ptr.color || "#f59e0b",
                                borderColor: `${ptr.color || "#f59e0b"}40`,
                                backgroundColor: `${ptr.color || "#f59e0b"}15`,
                              }}
                            >
                              {ptr.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Array Cells Row */}
                    <div className="overflow-x-auto py-2 flex items-center justify-start gap-1.5">
                      {arr.elements.map((el, elIdx) => {
                        const activePtrs = arr.pointers.filter((p) => p.index === elIdx);
                        const isMatch = el.state === "matched";
                        const isActive = el.state === "active";
                        const isPivot = el.state === "pivot";
                        const isVisited = el.state === "visited";

                        let cellStyle =
                          "border-surface-border bg-surface text-foreground";
                        if (isMatch) {
                          cellStyle =
                            "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-bold scale-105";
                        } else if (isActive) {
                          cellStyle =
                            "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30 font-bold scale-105";
                        } else if (isPivot) {
                          cellStyle =
                            "border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-2 ring-purple-500/30 font-bold";
                        } else if (isVisited) {
                          cellStyle =
                            "border-surface-border/60 bg-surface/50 text-slate-400 opacity-75";
                        }

                        return (
                          <div
                            key={elIdx}
                            className="flex flex-col items-center shrink-0 min-w-[42px] transition-all duration-150"
                          >
                            {/* Top Pointer Arrow */}
                            <div className="h-4 flex items-center justify-center">
                              {activePtrs.length > 0 && (
                                <ArrowDown
                                  className="h-3.5 w-3.5 animate-bounce"
                                  style={{ color: activePtrs[0].color || "#f59e0b" }}
                                />
                              )}
                            </div>

                            {/* Array Value Box */}
                            <div
                              className={`w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-xs shadow-xs transition-transform ${cellStyle}`}
                            >
                              {el.value}
                            </div>

                            {/* Bottom Index Label */}
                            <span className="text-[10px] font-mono text-slate-400 mt-1">
                              [{elIdx}]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hash Map Visualizer */}
            {currentFrame.maps && currentFrame.maps.length > 0 && (
              <div className="space-y-2">
                {currentFrame.maps.map((m, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Hash className="h-3.5 w-3.5 text-amber-500" />
                        {m.name} ({m.entries.length} {m.entries.length === 1 ? "entry" : "entries"})
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        O(1) average lookup
                      </span>
                    </div>

                    {m.entries.length === 0 ? (
                      <div className="p-2.5 rounded-lg border border-dashed border-surface-border text-center text-slate-400 text-xs font-mono">
                        Hash Map is currently empty
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {m.entries.map((entry, eIdx) => {
                          const isMatched = entry.state === "matched";
                          const isActive = entry.state === "active";
                          return (
                            <div
                              key={eIdx}
                              className={`p-1.5 px-2.5 rounded-lg border font-mono text-xs flex items-center justify-between transition ${
                                isMatched
                                  ? "bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20"
                                  : isActive
                                  ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400 font-bold ring-2 ring-amber-500/20"
                                  : "bg-surface border-surface-border text-foreground"
                              }`}
                            >
                              <span className="text-slate-500 dark:text-slate-400">
                                {entry.key}
                              </span>
                              <span className="text-slate-400 font-normal">➔</span>
                              <span className="font-semibold">{entry.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Stack Visualizer */}
            {currentFrame.stacks && currentFrame.stacks.length > 0 && (
              <div className="space-y-2">
                {currentFrame.stacks.map((stk, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Database className="h-3.5 w-3.5 text-blue-500" />
                        {stk.name} (LIFO Stack)
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Top element at right
                      </span>
                    </div>

                    {stk.items.length === 0 ? (
                      <div className="p-2.5 rounded-lg border border-dashed border-surface-border text-center text-slate-400 text-xs font-mono">
                        Stack is currently empty
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {stk.items.map((item, itmIdx) => {
                          const isTop = itmIdx === stk.items.length - 1;
                          return (
                            <div
                              key={itmIdx}
                              className={`px-3 py-1.5 rounded-md border font-mono text-xs flex items-center gap-1.5 ${
                                isTop
                                  ? "bg-blue-500/15 border-blue-500 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-500/30"
                                  : "bg-surface border-surface-border text-foreground"
                              }`}
                            >
                              <span>{item.value}</span>
                              {isTop && (
                                <span className="text-[10px] text-blue-500 uppercase tracking-tighter">
                                  TOP
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Variables Watch List */}
            {currentFrame.variables &&
              Object.keys(currentFrame.variables).length > 0 && (
                <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-purple-500" />
                    Live Variable Monitor
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs font-mono">
                    {Object.entries(currentFrame.variables).map(([k, v], vIdx) => (
                      <div
                        key={vIdx}
                        className="px-2 py-1 rounded bg-surface border border-surface-border flex items-center justify-between"
                      >
                        <span className="text-slate-500 dark:text-slate-400 truncate mr-1">
                          {k}
                        </span>
                        <span className="font-bold text-brand-600 dark:text-brand-400 shrink-0">
                          {String(v)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* 4. Time & Space Complexity Cards */}
        {analysis && (
          <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-brand-500" />
                Complexity Analysis
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 font-semibold border border-brand-500/20">
                {analysis.approach}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Time Complexity Card */}
              <div className="p-2.5 rounded-lg bg-surface border border-surface-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3 text-emerald-500" />
                    Time Complexity
                  </span>
                  <span className="font-mono font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {analysis.timeComplexity}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {analysis.timeComplexityName}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  {analysis.timeExplanation}
                </p>
              </div>

              {/* Space Complexity Card */}
              <div className="p-2.5 rounded-lg bg-surface border border-surface-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                    <Database className="h-3 w-3 text-purple-500" />
                    Space Complexity
                  </span>
                  <span className="font-mono font-extrabold text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    {analysis.spaceComplexity}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-foreground">
                  {analysis.spaceComplexityName}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                  {analysis.spaceExplanation}
                </p>
              </div>
            </div>

            {/* Key Insights List */}
            {analysis.keyInsights && analysis.keyInsights.length > 0 && (
              <div className="pt-1 space-y-1">
                {analysis.keyInsights.map((insight, inIdx) => (
                  <div
                    key={inIdx}
                    className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"
                  >
                    <CheckCircle2 className="h-3 w-3 text-brand-500 shrink-0 mt-0.5" />
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Playback Scrub & Control Bar (Sticky Bottom) */}
      <div className="border-t border-surface-border bg-surface-subtle p-3 space-y-2 shrink-0">
        {/* Step Scrubber Slider */}
        <div className="flex items-center space-x-2">
          <span className="font-mono text-[10px] text-slate-400 w-7">
            {currentStep + 1}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(totalFrames - 1, 0)}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="flex-1 h-1.5 bg-surface-border rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <span className="font-mono text-[10px] text-slate-400 w-7 text-right">
            {totalFrames}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface border border-surface-border transition"
              title="Reset execution to step 1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Prev Step */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface border border-surface-border disabled:opacity-40 transition"
              title="Previous execution step"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Play / Pause */}
            <button
              type="button"
              onClick={handlePlayPause}
              className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-xs transition flex items-center space-x-1.5"
              title={isPlaying ? "Pause playback" : "Play step-by-step execution"}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>{currentStep >= totalFrames - 1 ? "Replay" : "Play"}</span>
                </>
              )}
            </button>

            {/* Next Step */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentStep >= totalFrames - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-surface border border-surface-border disabled:opacity-40 transition"
              title="Next execution step"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              Speed:
            </span>
            <div className="flex items-center space-x-0.5 p-0.5 bg-surface rounded-lg border border-surface-border text-[10px] font-mono">
              {[0.5, 1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded transition ${
                    playbackSpeed === spd
                      ? "bg-brand-600 text-white font-bold"
                      : "text-slate-500 hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
