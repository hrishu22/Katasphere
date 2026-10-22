import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { User, Shield } from "lucide-react";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            User Profile
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manage your account settings and connected identities.
          </p>
        </div>

        <div className="p-8 rounded-xl bg-surface border border-surface-border text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-400 mx-auto">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Authenticated Profile Module</h3>
            <p className="text-sm text-slate-400">
              User identity, profile stats, and session management will be populated in Milestone 2.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
