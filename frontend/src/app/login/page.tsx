import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Code2, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-surface border border-surface-border">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto">
              <Code2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign in to CodeForge</h2>
            <p className="text-sm text-slate-400">
              Enter your credentials to continue your practice session
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-400 text-center">
            Authentication with secure Spring Security sessions and Google OAuth2 will be integrated in Milestone 2.
          </div>

          <div className="text-center text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-400 flex items-center justify-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to home</span>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
