"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getCollegeSuggestions } from "@/lib/contest-api";
import { CollegeSuggestionDto } from "@/types/contest";
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
  Check,
  User,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const explicitRedirect = searchParams?.get("redirect") || searchParams?.get("returnTo");
  const roleParam = searchParams?.get("role");
  const initialAccountType: "USER" | "COLLEGE_STUDENT" | "COLLEGE_ADMIN" =
    roleParam === "admin"
      ? "COLLEGE_ADMIN"
      : roleParam === "student"
      ? "COLLEGE_STUDENT"
      : "USER";

  const { register } = useAuth();

  const [accountType, setAccountType] = useState<"USER" | "COLLEGE_STUDENT" | "COLLEGE_ADMIN">(
    initialAccountType
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // "Want to create contest?" (COLLEGE_ADMIN) fields
  const [collegeName, setCollegeName] = useState("");

  // "Are you a student?" (COLLEGE_STUDENT) mandatory fields
  const currentYear = new Date().getFullYear();
  const [studentCollegeName, setStudentCollegeName] = useState("");
  const [studentCollegeCode, setStudentCollegeCode] = useState("");
  const [studentRollNumber, setStudentRollNumber] = useState("");
  const [tenureStartYear, setTenureStartYear] = useState<number>(currentYear - 2);
  const [tenureEndYear, setTenureEndYear] = useState<number>(currentYear + 2);
  const [collegeSuggestions, setCollegeSuggestions] = useState<CollegeSuggestionDto[]>([]);

  useEffect(() => {
    getCollegeSuggestions()
      .then(setCollegeSuggestions)
      .catch(() => {});
  }, []);

  const filteredSuggestions = collegeSuggestions.filter((c) => {
    if (!studentCollegeName.trim()) return true;
    const q = studentCollegeName.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.collegeCode.toLowerCase().includes(q) ||
      (c.city && c.city.toLowerCase().includes(q))
    );
  });

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
      if (!collegeName.trim()) {
        setError("College Name is mandatory to register and create contests.");
        return;
      }
    } else if (accountType === "COLLEGE_STUDENT") {
      if (!studentCollegeName.trim()) {
        setError("College Name is mandatory for student registration.");
        return;
      }
      if (!studentRollNumber.trim()) {
        setError("Roll No. / Student ID is mandatory for student registration.");
        return;
      }
      if (!tenureEndYear || tenureEndYear < tenureStartYear) {
        setError("Graduation / Passing Year must be greater than or equal to Admission Year.");
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
              officialCollegeEmail: email.trim(),
            }
          : accountType === "COLLEGE_STUDENT"
          ? {
              collegeName: studentCollegeName.trim(),
              collegeCode: studentCollegeCode.trim().toUpperCase() || undefined,
              rollNumber: studentRollNumber.trim(),
              tenureStartYear: Number(tenureStartYear),
              tenureEndYear: Number(tenureEndYear),
            }
          : {}),
      });

      if (explicitRedirect) {
        router.push(explicitRedirect);
      } else if (accountType === "COLLEGE_ADMIN" || registeredUser.role === "COLLEGE_ADMIN") {
        // Redirect straight to the Admin Portal (/admin/contests?onboarding=1) where the new Unique College ID is shown
        // and we ask the admin for the remaining college details & Contest Plan purchase
        router.push("/admin/contests?onboarding=1");
      } else if (accountType === "COLLEGE_STUDENT" || registeredUser.role === "COLLEGE_STUDENT") {
        router.push("/contests");
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
            ? "Register College to Create Contests"
            : accountType === "COLLEGE_STUDENT"
            ? "Student Registration"
            : "Create your Katasphere Account"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {accountType === "COLLEGE_ADMIN"
            ? "Register with your Name, College Name, and College Email to generate your Unique College ID."
            : accountType === "COLLEGE_STUDENT"
            ? "Register with your mandatory College Name and Roll No. / Student ID to attend college examinations."
            : "Practice algorithmic coding challenges and track your engineering progress."}
        </p>
      </div>

      {/* Interactive Registration Prompts:
          1. "Are you a student? Register / Log in here"
          2. "Want to create contest?"
          Plus option to switch back to Normal User */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setAccountType(accountType === "COLLEGE_STUDENT" ? "USER" : "COLLEGE_STUDENT");
            }}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
              accountType === "COLLEGE_STUDENT"
                ? "bg-brand-500/15 border-brand-500 text-foreground shadow-sm"
                : "bg-background hover:bg-surface-subtle border-surface-border text-slate-300"
            }`}
          >
            <GraduationCap
              className={`h-4 w-4 shrink-0 mt-0.5 ${
                accountType === "COLLEGE_STUDENT" ? "text-brand-400" : "text-slate-400"
              }`}
            />
            <div>
              <div className="text-xs font-bold text-foreground">
                Are you a student?
              </div>
              <div className="text-[11px] text-brand-400 font-semibold">
                {accountType === "COLLEGE_STUDENT" ? "✓ Student Registration Active" : "Register / Log in here →"}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setAccountType(accountType === "COLLEGE_ADMIN" ? "USER" : "COLLEGE_ADMIN");
            }}
            className={`p-3 rounded-xl border text-left transition flex items-start gap-2.5 ${
              accountType === "COLLEGE_ADMIN"
                ? "bg-purple-500/15 border-purple-500 text-foreground shadow-sm"
                : "bg-background hover:bg-surface-subtle border-surface-border text-slate-300"
            }`}
          >
            <Building2
              className={`h-4 w-4 shrink-0 mt-0.5 ${
                accountType === "COLLEGE_ADMIN" ? "text-purple-400" : "text-slate-400"
              }`}
            />
            <div>
              <div className="text-xs font-bold text-foreground">
                Want to create contest?
              </div>
              <div className="text-[11px] text-purple-400 font-semibold">
                {accountType === "COLLEGE_ADMIN" ? "✓ College Admin Active" : "Register your college →"}
              </div>
            </div>
          </button>
        </div>

        {accountType !== "USER" && (
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span>
              Selected Role:{" "}
              <strong className="text-foreground">
                {accountType === "COLLEGE_STUDENT" ? "College Student" : "College Admin"}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAccountType("USER");
              }}
              className="text-slate-400 hover:text-foreground inline-flex items-center gap-1 underline"
            >
              <User className="h-3 w-3" />
              <span>Switch to Normal User registration</span>
            </button>
          </div>
        )}
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
              {accountType === "COLLEGE_ADMIN" ? "Your Name *" : "Full Name *"}
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
              {accountType === "COLLEGE_ADMIN" ? "College Email ID *" : "Email ID *"}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                accountType === "COLLEGE_ADMIN"
                  ? "admin@college.edu.in"
                  : accountType === "COLLEGE_STUDENT"
                  ? "student@college.edu.in"
                  : "you@example.com"
              }
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>
        </div>

        {/* Option 2: "Want to create contest?" -> Ask for College Name (along with Name & College Email above) */}
        {accountType === "COLLEGE_ADMIN" && (
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/25 space-y-3">
            <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Institution Registration (Generates Unique College ID)</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                College Name *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. IIT Delhi"
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-surface-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upon registration, we will generate your <strong>Unique College ID</strong> on the Admin Portal and ask for your full college details, campus address, optional student count, and <strong>Contest Plan purchase</strong> before scheduling contests.
            </p>
          </div>
        )}

        {/* Option 1: "Are you a student?" -> Mandatory College Name & Mandatory Roll No / Student ID */}
        {accountType === "COLLEGE_STUDENT" && (
          <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/25 space-y-3">
            <div className="text-xs font-bold text-brand-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Mandatory Student Details (College Name &amp; Roll No. / ID)</span>
              </span>
              <Link href="/login" className="text-[11px] underline hover:text-brand-300">
                Already registered? Log in
              </Link>
            </div>

            {/* Saved Colleges Suggestions from DB */}
            {collegeSuggestions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-400 font-medium">
                  Select your college from our registered institutions (auto-fills College Name &amp; ID):
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {filteredSuggestions.slice(0, 8).map((col) => {
                    const isSelected =
                      studentCollegeCode.toUpperCase() === col.collegeCode.toUpperCase();
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          setStudentCollegeName(col.name);
                          setStudentCollegeCode(col.collegeCode);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-left text-[11px] transition ${
                          isSelected
                            ? "bg-brand-500/15 border-brand-500 text-brand-300 font-semibold"
                            : "bg-background border-surface-border text-slate-300 hover:border-brand-500/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-brand-400 shrink-0" />}
                        <span className="truncate max-w-[160px]">{col.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">
                          {col.collegeCode}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                  College Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentCollegeName}
                  onChange={(e) => setStudentCollegeName(e.target.value)}
                  placeholder="e.g. IIT Bombay"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                  Roll No. / Student ID *
                </label>
                <input
                  type="text"
                  required
                  value={studentRollNumber}
                  onChange={(e) => setStudentRollNumber(e.target.value)}
                  placeholder="e.g. 23B030014"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  College ID (if known)
                </label>
                <input
                  type="text"
                  value={studentCollegeCode}
                  onChange={(e) => setStudentCollegeCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KS-57BMQ9"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-surface-border text-foreground font-mono uppercase text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Admission Year
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2040}
                  value={tenureStartYear}
                  onChange={(e) =>
                    setTenureStartYear(parseInt(e.target.value) || currentYear - 2)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Passing / Grad Year *
                </label>
                <input
                  type="number"
                  min={2000}
                  max={2045}
                  value={tenureEndYear}
                  onChange={(e) =>
                    setTenureEndYear(parseInt(e.target.value) || currentYear + 2)
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                />
              </div>
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
                ? "Register College & Open Admin Portal"
                : accountType === "COLLEGE_STUDENT"
                ? "Register as College Student"
                : "Create Account"}
            </span>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-500 hover:text-brand-400 font-medium">
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
