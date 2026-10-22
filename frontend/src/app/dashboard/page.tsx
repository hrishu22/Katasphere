import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { LayoutDashboard, CheckCircle2, Clock, Code2, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Developer Dashboard
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Track your problem solving progress, statistics, and recent activity.
          </p>
        </div>

        {/* Milestone 1 Shell State */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-surface border border-surface-border">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
              Total Solved
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white">0</span>
              <span className="text-xs text-slate-500">/ 0 problems</span>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface border border-surface-border">
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
              Easy Solved
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-emerald-400">0</span>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface border border-surface-border">
            <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">
              Medium Solved
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-amber-400">0</span>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-surface border border-surface-border">
            <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold">
              Hard Solved
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-rose-400">0</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-surface border border-surface-border text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto">
            <Code2 className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-semibold text-white">Ready to begin your journey?</h3>
            <p className="text-sm text-slate-400">
              Browse algorithm challenges and practice with real-time test execution.
            </p>
          </div>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition"
          >
            <span>Explore Problem Catalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
