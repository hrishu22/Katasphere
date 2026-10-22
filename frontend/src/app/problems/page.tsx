import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import Link from "next/link";
import { BookOpen, Search, Filter } from "lucide-react";

export default function ProblemsPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Problem Catalog
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Sharpen your algorithmic skills with multi-language execution challenges.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface border border-surface-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems by title or topic..."
              className="w-full pl-9 pr-4 py-2 rounded-md bg-surface-subtle border border-surface-border text-sm text-foreground placeholder-slate-500 focus:outline-none focus:border-brand-500"
              disabled
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-mono">Catalog Loading... (Milestone 3)</span>
          </div>
        </div>

        <div className="p-12 text-center rounded-xl bg-surface/50 border border-surface-border space-y-3">
          <BookOpen className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-medium text-slate-300">
            Problem Catalog & Server-Side Filtering API
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Problem schemas, seed problems, and tag filters will be wired up with backend PostgreSQL in Milestone 3.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
