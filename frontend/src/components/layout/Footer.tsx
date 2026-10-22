import React from "react";
import Link from "next/link";
import { Code2, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-border bg-surface/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-7 w-7 rounded-md bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Code2 className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm text-foreground">CodeForge</span>
            <span className="text-slate-500 text-sm">— Practice. Improve. Repeat.</span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-slate-400">
            <Link href="/problems" className="hover:text-foreground transition">
              Problems
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition">
              Dashboard
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-500">
              Backend API & Judge0 Execution Engine
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
