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
  Calendar,
  Check,
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
        setError("College Name is required when registering as a College Admin.");
        return;
      }
    } else if (studentCollegeName.trim() || studentCollegeCode.trim()) {
      if (!studentCollegeName.trim() || !studentCollegeCode.trim()) {
        setError("Please select a college from suggestions or provide both College Name and College ID.");
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
              officialCollegeEmail: (officialCollegeEmail.trim() || email.trim()),
            }
          : {
              collegeName: studentCollegeName.trim() || undefined,
              collegeCode: studentCollegeCode.trim().toUpperCase() || undefined,
              rollNumber: studentRollNumber.trim() || undefined,
              tenureStartYear: studentCollegeCode.trim() ? Number(tenureStartYear) : undefined,
              tenureEndYear: studentCollegeCode.trim() ? Number(tenureEndYear) : undefined,
            }),
      });

      if (explicitRedirect) {
        router.push(explicitRedirect);
      } else if (accountType === "COLLEGE_ADMIN" || registeredUser.role === "COLLEGE_ADMIN") {
        // Send newly registered College Admin to /profile?setup=1 to complete college details, address, optional students, and choose a Contest Plan
        router.push("/profile?setup=1");
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

        {/* College Admin Mandatory Fields at Signup: College Name & Email */}
        {accountType === "COLLEGE_ADMIN" ? (
          <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/25 space-y-3">
            <div className="text-xs font-bold text-brand-400 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Step 1: Register with College Name &amp; Official Email</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                College / University Name *
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
              After creating your admin account, you will be directed to your Profile to enter your <strong>College Full Name</strong>, <strong>Campus Address</strong>, <strong>Number of Students (optional)</strong>, and choose your <strong>Contest Plan</strong> (3/month, 6/month, or 20/year).
            </p>
          </div>
        ) : (
          /* Student Optional Immediate Link Fields with Saved College Suggestions & Tenure Year */
          <div className="p-4 rounded-xl bg-surface-subtle/60 border border-surface-border space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-brand-400" />
                <span>Register Your College & Tenure (or link later in Profile)</span>
              </span>
              <span className="text-[10px] text-slate-500">Unlocks Contests Tab</span>
            </div>

            {/* Saved Colleges Suggestions from DB */}
            {collegeSuggestions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[11px] text-slate-400 font-medium">
                  Registered Colleges in Katasphere (click to auto-fill Name & College ID):
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {filteredSuggestions.slice(0, 8).map((col) => {
                    const isSelected = studentCollegeCode.toUpperCase() === col.collegeCode.toUpperCase();
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

            {/* Candidate Tenure Years + Roll Number */}
            {(studentCollegeName.trim() || studentCollegeCode.trim()) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Admission Year
                  </label>
                  <input
                    type="number"
                    min={2000}
                    max={2040}
                    value={tenureStartYear}
                    onChange={(e) => setTenureStartYear(parseInt(e.target.value) || currentYear - 2)}
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
                    onChange={(e) => setTenureEndYear(parseInt(e.target.value) || currentYear + 2)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={studentRollNumber}
                    onChange={(e) => setStudentRollNumber(e.target.value)}
                    placeholder="e.g. 2024CS101"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-surface-border text-foreground text-xs"
                  />
                </div>
              </div>
            )}
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
