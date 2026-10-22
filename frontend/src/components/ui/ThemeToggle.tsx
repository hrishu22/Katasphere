"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-surface border border-surface-border" />;
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface border border-surface-border text-slate-400 hover:text-foreground hover:bg-surface-subtle transition-colors flex items-center justify-center"
      aria-label="Toggle Dark / Light Mode"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 text-brand-600 transition-transform -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
}
