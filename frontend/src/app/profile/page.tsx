"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { User, Mail, Shield, Calendar, LogOut, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500 mb-3" />
          <p className="text-sm text-slate-500">Loading user profile...</p>
        </div>
      </AppShell>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-slate-500 hover:text-foreground inline-flex items-center space-x-1 mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            User Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account details and authentication session.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-surface border border-surface-border shadow-md space-y-6">
          <div className="flex items-center space-x-5">
            <div className="h-16 w-16 rounded-full bg-brand-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
              {user.name ? user.name[0].toUpperCase() : <User className="h-8 w-8" />}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 font-semibold font-mono">
                {user.role}
              </span>
            </div>
          </div>

          <div className="divide-y divide-surface-border border-t border-b border-surface-border py-2 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </span>
              <span className="font-mono text-foreground">{user.email}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Authentication Method
              </span>
              <span className="text-foreground">Password / Local Identity</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account ID
              </span>
              <span className="font-mono text-xs text-slate-500">{user.id}</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-semibold text-xs flex items-center space-x-2 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
