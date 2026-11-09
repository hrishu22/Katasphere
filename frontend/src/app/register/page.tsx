"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getApiBaseUrl } from "@/lib/api-client";
import { AppShell } from "@/components/layout/AppShell";
import {
  Code2,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
  Building2,
  KeyRound,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams?.get("redirect") || searchParams?.get("returnTo");
  const initialAccountType = searchParams?.get("role") === "admin" ? "COLLEGE_ADMIN" : "USER";

  const { register } = useAuth();

  const [accountType, setAccountType] = useState<"USER" | "COLLEGE_ADMIN">(initialAccountType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // College Admin fields
  const [collegeName, setCollegeName] = useState("");
  const [officialCollegeEmail, setOfficialCollegeEmail] = useState("");
  const [expectedStudents, setExpectedStudents] = useState<number>(100);
  const [department, setDepartment] = useState("");

  // Optional Student immediate college link fields
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeCode, setStudentCollegeCode] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (accountType === "COLLEGE_ADMIN") {
      if (!collegeName.trim() || !officialCollegeEmail.trim() || !expectedStudents || expectedStudents < 1) {
        setError("College Name, Official College Email ID, and Expected Students are required for College Admins.");
        return;
      }
    }

    setLoading(true);

    try {
      const registeredUser = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        accountType,
        ...(accountType === "COLLEGE_ADMIN"
          ? {
              collegeName: collegeName.trim(),
              officialCollegeEmail: officialCollegeEmail.trim(),
              expectedStudents: Number(expectedStudents),
              department: department.trim() || undefined,
            }
          : {
              collegeName: studentCollegeName.trim() || undefined,
              collegeCode: studentCollegeCode.trim().toUpperCase() || undefined,
              rollNumber: studentRollNumber.trim() || undefined,
            }),
      });

      if (explicitRedirect) {
        router.push(explicitRedirect);
      } else if (accountType === "COLLEGE_ADMIN" || registeredUser.role === "COLLEGE_ADMIN") {
        // Send newly registered College Admin to /profile so they immediately see their Unique College ID
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full space-y-6 p-8 rounded-2xl bg-surface border border-surface-border shadow-2xl">
      <div className="text-center space-y-2">
        <div className="h-11 w-11 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 mx-auto">
          <Code2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {accountType === "COLLEGE_ADMIN"
            ? "Register as College Admin"
            : "Create your Student Account"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {accountType === "COLLEGE_ADMIN"
            ? "Register your institution to receive an official College Unique ID and conduct proctored exams."
            : "Practice algorithmic coding challenges and attend your university examinations."}
        </p>
      </div>

      {/* Role Selector: Student / Candidate vs College Admin */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-background border border-surface-border">
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAccountType("USER");
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
            accountType === "USER"
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-400 hover:text-foreground"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Student / Candidate</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setError(null);
            setAccountType("COLLEGE_ADMIN");
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
            accountType === "COLLEGE_ADMIN"
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-400 hover:text-foreground"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>College Admin / Faculty</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-rose-500 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {accountType === "COLLEGE_ADMIN" ? "Admin / Professor Name *" : "Full Name *"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={accountType === "COLLEGE_ADMIN" ? "Prof. R. K. Sharma" : "Jane Doe"}
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              {accountType === "COLLEGE_ADMIN" ? "Login Email *" : "Email Address *"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!officialCollegeEmail) setOfficialCollegeEmail(e.target.value);
              }}
              placeholder={
                accountType === "COLLEGE_ADMIN" ? "sharma@iitd.ac.in" : "student@college.edu.in"
              }
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>
        </div>

        {/* College Admin Mandatory Fields */}
        {accountType === "COLLEGE_ADMIN" ? (
          <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/25 space-y-3.5">
            <div className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Institution Registration Details (Generates Unique College ID)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                College / University Name *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. IIT Delhi"
                className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Official Email ID of College *
                </label>
                <input
                  type="email"
                  required
                  value={officialCollegeEmail}
                  onChange={(e) => setOfficialCollegeEmail(e.target.value)}
                  placeholder="e.g. exams@iitd.ac.in"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  No. of Expected Students *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100000}
                  required
                  value={expectedStudents}
                  onChange={(e) => setExpectedStudents(parseInt(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Department (Optional — can add more details in Profile)
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Dept. of Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        ) : (
          /* Student Optional Immediate Link Fields */
          <div className="p-4 rounded-xl bg-surface-subtle/60 border border-surface-border space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-brand-400" />
                <span>Have your College ID? Link now (or later in Profile)</span>
              </span>
              <span className="text-[10px] text-slate-500">Optional at signup</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={studentCollegeName}
                onChange={(e) => setStudentCollegeName(e.target.value)}
                placeholder="College Name (e.g. IIT Delhi)"
                className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs"
              />
              <input
                type="text"
                value={studentCollegeCode}
                onChange={(e) => setStudentCollegeCode(e.target.value.toUpperCase())}
                placeholder="College ID (e.g. KS-57BMQ9)"
                className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground font-mono uppercase text-xs"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Confirm Password *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20 text-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>
              {accountType === "COLLEGE_ADMIN"
                ? "Register College & Create Admin Account"
                : "Create Student Account"}
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link
          href={`/login${accountType === "COLLEGE_ADMIN" ? "?role=admin" : ""}`}
          className="text-brand-500 hover:text-brand-400 font-medium"
        >
          Sign in
        </Link>
      </p>

      <div className="text-center text-xs text-slate-400 pt-2 border-t border-surface-border">
        <Link href="/" className="hover:text-foreground inline-flex items-center space-x-1">
          <ArrowLeft className="h-3 w-3" />
          <span>Back to home</span>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AppShell>
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </AppShell>
  );
}
