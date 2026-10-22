"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  PlusCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
} from "lucide-react";

interface ExampleInput {
  position: number;
  input: string;
  expectedOutput: string;
  explanation: string;
}

export default function CreateProblemPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
  const [description, setDescription] = useState("");
  const [constraintsText, setConstraintsText] = useState("• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4");
  const [tagsInput, setTagsInput] = useState("Array, Hash Table");
  const [examples, setExamples] = useState<ExampleInput[]>([
    { position: 1, input: "nums = [2,7,11,15], target = 9", expectedOutput: "[0,1]", explanation: "Because 2 + 7 = 9" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExample = () => {
    setExamples([
      ...examples,
      { position: examples.length + 1, input: "", expectedOutput: "", explanation: "" },
    ]);
  };

  const removeExample = (idx: number) => {
    setExamples(examples.filter((_, i) => i !== idx));
  };

  const updateExample = (idx: number, field: keyof ExampleInput, value: string) => {
    const updated = [...examples];
    (updated[idx] as any)[field] = value;
    setExamples(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title,
        slug: slug.trim() || undefined,
        difficulty,
        description,
        constraintsText,
        tags,
        examples,
      };

      const res = await apiClient<{ success: boolean; data: { slug: string } }>(
        "/api/v1/admin/problems",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      if (res && res.data) {
        router.push(`/problems/${res.data.slug}`);
      } else {
        router.push("/problems");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to create problem. Please verify fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div>
          <Link
            href="/problems"
            className="text-xs text-slate-500 hover:text-foreground inline-flex items-center space-x-1 mb-3"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to Problem Catalog</span>
          </Link>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 text-xs font-semibold mb-2">
            <Sparkles className="h-3 w-3" />
            <span>Extensible Problem Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Add New Algorithmic Challenge
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Easily expand Katasphere&apos;s catalog with verified algorithmic problems, sample cases, and multi-language starter templates.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <h2 className="text-base font-bold text-foreground">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Problem Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Reverse Linked List"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Topic Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Array, Hash Table, Two Pointers"
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Problem Statement (Markdown Supported)
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Given the head of a singly linked list, reverse the list, and return the reversed list."
                className="w-full p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Constraints
              </label>
              <textarea
                required
                rows={3}
                value={constraintsText}
                onChange={(e) => setConstraintsText(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Examples Section */}
          <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Sample Test Cases / Examples</h2>
              <button
                type="button"
                onClick={addExample}
                className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-muted text-xs font-semibold text-brand-500 flex items-center space-x-1.5 transition"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add Example</span>
              </button>
            </div>

            <div className="space-y-4">
              {examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-surface-subtle border border-surface-border space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-foreground">
                    <span>Example {idx + 1}</span>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(idx)}
                        className="text-rose-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Input</label>
                      <input
                        type="text"
                        required
                        value={ex.input}
                        onChange={(e) => updateExample(idx, "input", e.target.value)}
                        placeholder="head = [1,2,3,4,5]"
                        className="w-full p-2 rounded bg-surface border border-surface-border font-mono text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Expected Output</label>
                      <input
                        type="text"
                        required
                        value={ex.expectedOutput}
                        onChange={(e) => updateExample(idx, "expectedOutput", e.target.value)}
                        placeholder="[5,4,3,2,1]"
                        className="w-full p-2 rounded bg-surface border border-surface-border font-mono text-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={ex.explanation}
                      onChange={(e) => updateExample(idx, "explanation", e.target.value)}
                      placeholder="The list is reversed from right to left."
                      className="w-full p-2 rounded bg-surface border border-surface-border text-foreground"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Link
              href="/problems"
              className="px-5 py-2.5 rounded-lg bg-surface border border-surface-border hover:bg-surface-subtle text-slate-400 hover:text-foreground text-sm font-medium transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing Challenge...</span>
                </>
              ) : (
                <span>Publish Challenge</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
