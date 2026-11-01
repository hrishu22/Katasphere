import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, Play, Send, RotateCcw } from "lucide-react";

export default function ProblemLoading() {
  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-background">
        {/* Top Navbar Skeleton */}
        <header className="h-12 border-b border-surface-border px-4 flex items-center justify-between shrink-0 bg-surface/50 backdrop-blur-xs">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-20 rounded-md bg-surface-subtle animate-pulse" />
            <div className="h-4 w-px bg-surface-border" />
            <div className="h-5 w-32 rounded-md bg-surface-subtle animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-surface-subtle animate-pulse" />
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-7 w-24 rounded-lg bg-surface-subtle animate-pulse" />
            <div className="h-7 w-20 rounded-lg bg-surface-subtle animate-pulse" />
            <div className="h-7 w-24 rounded-lg bg-brand-600/30 animate-pulse" />
          </div>
        </header>

        {/* Workspace Split Layout Skeleton */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Pane: Problem Description Skeleton */}
          <div className="w-full md:w-1/2 h-full border-r border-surface-border p-6 overflow-y-auto space-y-6">
            <div className="space-y-3">
              <div className="h-8 w-3/4 rounded-lg bg-surface-subtle animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 rounded-full bg-emerald-500/10 animate-pulse" />
                <div className="h-5 w-20 rounded-md bg-surface-subtle animate-pulse" />
                <div className="h-5 w-24 rounded-md bg-surface-subtle animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-surface-subtle animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-surface-subtle animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-surface-subtle animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-surface-subtle animate-pulse" />
            </div>

            {/* Example 1 Skeleton */}
            <div className="p-4 rounded-xl bg-surface-subtle/60 border border-surface-border space-y-3">
              <div className="h-4 w-24 rounded bg-surface animate-pulse" />
              <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-2">
                <div className="h-3.5 w-1/2 rounded bg-surface-subtle animate-pulse" />
                <div className="h-3.5 w-1/3 rounded bg-surface-subtle animate-pulse" />
              </div>
            </div>

            {/* Example 2 Skeleton */}
            <div className="p-4 rounded-xl bg-surface-subtle/60 border border-surface-border space-y-3">
              <div className="h-4 w-24 rounded bg-surface animate-pulse" />
              <div className="p-3 rounded-lg bg-surface border border-surface-border space-y-2">
                <div className="h-3.5 w-1/2 rounded bg-surface-subtle animate-pulse" />
                <div className="h-3.5 w-1/3 rounded bg-surface-subtle animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Pane: Code Editor Skeleton */}
          <div className="w-full md:w-1/2 h-full flex flex-col bg-surface/30">
            <div className="h-10 px-4 border-b border-surface-border flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-surface-subtle animate-pulse" />
              <div className="h-4 w-20 rounded bg-surface-subtle animate-pulse" />
            </div>
            <div className="flex-1 p-4 space-y-3 font-mono text-xs">
              <div className="h-4 w-36 rounded bg-surface-subtle/80 animate-pulse" />
              <div className="h-4 w-56 rounded bg-surface-subtle/60 animate-pulse ml-4" />
              <div className="h-4 w-48 rounded bg-surface-subtle/60 animate-pulse ml-8" />
              <div className="h-4 w-32 rounded bg-surface-subtle/60 animate-pulse ml-8" />
              <div className="h-4 w-16 rounded bg-surface-subtle/60 animate-pulse ml-4" />
              <div className="h-4 w-8 rounded bg-surface-subtle/80 animate-pulse" />
            </div>
            <div className="h-44 border-t border-surface-border p-4 bg-surface-subtle/30">
              <div className="h-4 w-32 rounded bg-surface animate-pulse mb-3" />
              <div className="h-20 rounded-lg bg-surface border border-surface-border animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
