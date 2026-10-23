import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import {
  Terminal,
  Layers,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const languages = [
    { name: "Python", ext: "py", version: "3.10+" },
    { name: "Java", ext: "java", version: "21 LTS" },
    { name: "C++", ext: "cpp", version: "GCC 13" },
    { name: "JavaScript", ext: "js", version: "Node 20" },
  ];

  const features = [
    {
      icon: Terminal,
      title: "Real Execution Engine",
      description:
        "Run code against isolated Judge0 containers with actual runtime, memory, and timeout telemetry.",
    },
    {
      icon: Layers,
      title: "Split-Pane Workspace",
      description:
        "Monaco-powered coding environment with smart indentation, line numbers, and multi-language template drafts.",
    },
    {
      icon: Shield,
      title: "Safe Test Evaluation",
      description:
        "Execute sample test cases in real-time and validate edge-cases against hidden problem test suites.",
    },
    {
      icon: Zap,
      title: "Submission Progress",
      description:
        "Persistent tracking across Easy, Medium, and Hard challenges with granular execution verdict histories.",
    },
  ];

  const sampleProblems = [
    {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "EASY",
      difficultyClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      tags: ["Arrays", "Hash Table"],
      acceptance: "49.8%",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "MEDIUM",
      difficultyClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      tags: ["Hash Table", "Sliding Window", "String"],
      acceptance: "34.2%",
    },
    {
      title: "Median of Two Sorted Arrays",
      slug: "median-of-two-sorted-arrays",
      difficulty: "HARD",
      difficultyClass: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20",
      tags: ["Binary Search", "Divide and Conquer"],
      acceptance: "38.5%",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://katasphere.com/#website",
        "url": "https://katasphere.com",
        "name": "Katasphere",
        "description":
          "Full-stack algorithmic coding platform with multi-language execution engine and real-time test verification.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": "https://katasphere.com/problems?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://katasphere.com/#software",
        "name": "Katasphere",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Solve algorithmic coding katas, execute code in isolated sandboxes across Java, Python, C++, and JavaScript, and master technical interviews.",
      },
    ],
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-surface-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-surface-border text-xs text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium">Full-Stack Coding Practice Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Master Code Katas. <span className="text-brand-600 dark:text-brand-400">Repeat.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              Step into Katasphere to master algorithmic problem solving and ace technical interviews
              with real multi-language execution, comprehensive test suites, and transparent progress tracking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/problems"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium shadow-md shadow-brand-500/20 transition flex items-center justify-center space-x-2"
              >
                <span>Explore Problems</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-surface border border-surface-border hover:border-slate-400 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200 font-medium transition flex items-center justify-center shadow-sm"
              >
                Create Free Account
              </Link>
            </div>

            {/* Supported Languages Pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs uppercase font-semibold text-slate-700 dark:text-slate-300 mr-2">
                Languages:
              </span>
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className="px-3 py-1 rounded-md bg-surface-subtle border border-surface-border text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 shadow-sm"
                >
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">{lang.name}</span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">({lang.version})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-b border-surface-border bg-surface-subtle/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineered for developer productivity
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base">
              A distraction-free IDE workflow designed to mirror real interview environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-surface border border-surface-border hover:border-brand-500/40 transition-all flex flex-col space-y-3 shadow-sm hover:shadow-md"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Problems Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Practice Popular Problems
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                Curated challenges with real sample test cases and hidden evaluation suites.
              </p>
            </div>
            <Link
              href="/problems"
              className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center space-x-1"
            >
              <span>View full problem catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {sampleProblems.map((prob) => (
              <div
                key={prob.slug}
                className="p-4 sm:p-5 rounded-xl bg-surface border border-surface-border hover:border-slate-400 dark:hover:border-slate-600 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition cursor-pointer">
                      {prob.title}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${prob.difficultyClass}`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {prob.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded bg-surface-subtle text-slate-600 dark:text-slate-400 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-6">
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    Acceptance: <span className="font-semibold text-slate-800 dark:text-slate-200">{prob.acceptance}</span>
                  </div>
                  <Link
                    href={`/problems/${prob.slug}`}
                    aria-label={`Solve ${prob.title} challenge`}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-surface-subtle hover:bg-brand-600 text-slate-700 dark:text-slate-200 hover:text-white border border-surface-border hover:border-brand-500 transition shadow-sm"
                  >
                    Solve Challenge
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
