"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  Code2,
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  User,
  GraduationCap,
  Building2,
  Crown,
  Sparkles,
  LogOut,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  const isPremiumUser = Boolean(user && (user.isPremium || user.role === "PREMIUM" || user.role === "ADMIN"));

  // Requirement 1: Dashboard is only shown for authenticated users
  const navLinks = [
    { href: "/problems", label: "Problems", icon: BookOpen, isPro: false },
    { href: "/companies", label: "Companies", icon: Building2, isPro: true },
    { href: "/interview-prep", label: "Interview Prep", icon: GraduationCap, isPro: false },
    { href: "/pricing", label: "Plans", icon: Sparkles, isPro: false },
    ...(user ? [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, isPro: false }] : []),
  ];

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname?.startsWith(path));

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="h-9 w-9 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 group-hover:bg-brand-500/20 group-hover:border-brand-500/50 transition-all">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground tracking-tight">
                  Katasphere
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-surface text-foreground font-semibold shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-surface-subtle"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                    {link.isPro && (
                      <span className="ml-0.5 inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                        PRO
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action: Theme Toggle + Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {!isLoading && user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-full bg-surface border border-surface-border hover:border-slate-500 transition"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="h-7 w-7 rounded-full bg-brand-600 flex items-center justify-center text-xs font-semibold text-white">
                    {user.name ? user.name[0].toUpperCase() : <User className="h-4 w-4" />}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {user.name}
                  </span>
                  {isPremiumUser && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 flex items-center gap-0.5">
                      <Crown className="h-2.5 w-2.5" /> PRO
                    </span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface border border-surface-border shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-surface-border">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">Membership</span>
                        <span
                          className={`text-[11px] font-semibold flex items-center gap-1 ${
                            isPremiumUser ? "text-amber-500" : "text-slate-400"
                          }`}
                        >
                          {isPremiumUser ? (
                            <>
                              <Crown className="h-3 w-3" /> Katasphere Pro
                            </>
                          ) : (
                            "Free Member"
                          )}
                        </span>
                      </div>
                    </div>

                    {!isPremiumUser && (
                      <div className="p-2 border-b border-surface-border bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                        <Link
                          href="/pricing"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-center space-x-1.5 w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-xs transition"
                        >
                          <Crown className="h-3.5 w-3.5" />
                          <span>Unlock Pro Access</span>
                        </Link>
                      </div>
                    )}

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-surface-subtle transition"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-surface-subtle transition"
                    >
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Profile</span>
                    </Link>

                    <div className="border-t border-surface-border my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : !isLoading ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-foreground rounded-md hover:bg-surface transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-md shadow-sm transition"
                >
                  Create Account
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-subtle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-surface px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? "bg-surface-subtle text-foreground font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-surface-subtle"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.isPro && (
                  <span className="ml-auto inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-surface-border space-y-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                  Signed in as <span className="font-medium text-foreground">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-rose-500 bg-rose-500/10 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-surface-subtle rounded-md"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 rounded-md"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
