"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/contexts/ThemeContext";
import { Code2, Loader2 } from "lucide-react";

// Pair definitions for bracket auto-completion in fallback mode
const BRACKET_PAIRS: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
};
const CLOSING_BRACKETS = new Set([")", "]", "}", '"', "'", "`"]);

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "PYTHON" | "JAVA" | "CPP" | "JAVASCRIPT" | string;
  className?: string;
  readOnly?: boolean;
}

// Dynamically import Monaco Editor without SSR
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => null,
});

export function CodeEditor({
  value,
  onChange,
  language,
  className = "",
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const [monacoFailed, setMonacoFailed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Map Katasphere language string to Monaco language ID
  const monacoLanguage = useMemo(() => {
    const lang = (language || "").toUpperCase();
    switch (lang) {
      case "PYTHON":
        return "python";
      case "JAVA":
        return "java";
      case "CPP":
        return "cpp";
      case "JAVASCRIPT":
        return "javascript";
      default:
        return "plaintext";
    }
  }, [language]);

  // Synchronize scroll between line numbers and textarea in fallback mode
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Smart keyboard handler for fallback textarea:
  // 1. Enter key preserves indentation and adds extra indent after {, (, [, :
  // 2. Enter key between matching braces {} formats to 3 lines
  // 3. Auto-completes brackets (), [], {}, "", '', ``
  // 4. Overtype skips closing brackets
  // 5. Backspace between matching pairs deletes both
  // 6. Tab / Shift+Tab indents / outdents 4 spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const target = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = target;

    // 1. SMART ENTER INDENTATION
    if (e.key === "Enter") {
      e.preventDefault();
      const lastNewline = value.lastIndexOf("\n", start - 1);
      const currentLine = value.substring(lastNewline + 1, start);

      // Extract leading spaces/tabs from the current line
      let indent = "";
      for (const ch of currentLine) {
        if (ch === " " || ch === "\t") indent += ch;
        else break;
      }

      const prevChar = start > 0 ? value[start - 1] : "";
      const nextChar = start < value.length ? value[start] : "";

      // Case A: Cursor is directly between matching braces/brackets like { | }
      if (
        (prevChar === "{" && nextChar === "}") ||
        (prevChar === "(" && nextChar === ")") ||
        (prevChar === "[" && nextChar === "]")
      ) {
        const extraIndent = "    "; // 4 spaces
        const insertText = `\n${indent}${extraIndent}\n${indent}`;
        const newValue = value.substring(0, start) + insertText + value.substring(end);
        onChange(newValue);

        const newPos = start + 1 + indent.length + extraIndent.length;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
          }
        });
        return;
      }

      // Case B: Previous line ended with {, (, [, or : (e.g. Java method/class or Python block)
      const trimmed = currentLine.trimEnd();
      const shouldIncreaseIndent =
        trimmed.endsWith("{") ||
        trimmed.endsWith("(") ||
        trimmed.endsWith("[") ||
        trimmed.endsWith(":");

      const extraIndent = shouldIncreaseIndent ? "    " : "";
      const insertText = `\n${indent}${extraIndent}`;
      const newValue = value.substring(0, start) + insertText + value.substring(end);
      onChange(newValue);

      const newPos = start + insertText.length;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
        }
      });
      return;
    }

    // 2. OVERTYPE CLOSING BRACKETS / QUOTES
    if (CLOSING_BRACKETS.has(e.key) && start === end && start < value.length && value[start] === e.key) {
      e.preventDefault();
      const newPos = start + 1;
      target.selectionStart = newPos;
      target.selectionEnd = newPos;
      return;
    }

    // 3. AUTO-COMPLETE OPENING BRACKETS & QUOTES
    if (BRACKET_PAIRS[e.key]) {
      e.preventDefault();
      const closing = BRACKET_PAIRS[e.key];

      if (start !== end) {
        // Selection wrapping e.g. select text and type ( -> (selection)
        const selectedText = value.substring(start, end);
        const newValue = value.substring(0, start) + e.key + selectedText + closing + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start + 1;
            textareaRef.current.selectionEnd = end + 1;
          }
        });
        return;
      }

      const newValue = value.substring(0, start) + e.key + closing + value.substring(end);
      onChange(newValue);
      const newPos = start + 1;
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
        }
      });
      return;
    }

    // 4. BACKSPACE PAIR DELETION
    if (e.key === "Backspace" && start === end && start > 0 && start < value.length) {
      const prevCh = value[start - 1];
      const nextCh = value[start];
      if (BRACKET_PAIRS[prevCh] === nextCh) {
        e.preventDefault();
        const newValue = value.substring(0, start - 1) + value.substring(start + 1);
        onChange(newValue);
        const newPos = start - 1;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
          }
        });
        return;
      }
    }

    // 5. TAB / SHIFT+TAB HANDLING
    if (e.key === "Tab") {
      e.preventDefault();
      if (!e.shiftKey) {
        // Insert 4 spaces
        const tabSpaces = "    ";
        const newValue = value.substring(0, start) + tabSpaces + value.substring(end);
        onChange(newValue);
        const newPos = start + 4;
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = newPos;
            textareaRef.current.selectionEnd = newPos;
          }
        });
      } else {
        // Shift + Tab: unindent current line
        const lastNewline = value.lastIndexOf("\n", start - 1);
        const lineStart = lastNewline + 1;
        const linePrefix = value.substring(lineStart, lineStart + 4);
        let removeCount = 0;
        for (const ch of linePrefix) {
          if (ch === " ") removeCount++;
          else break;
        }
        if (removeCount > 0) {
          const newValue = value.substring(0, lineStart) + value.substring(lineStart + removeCount);
          onChange(newValue);
          const newPos = Math.max(lineStart, start - removeCount);
          requestAnimationFrame(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = newPos;
              textareaRef.current.selectionEnd = newPos;
            }
          });
        }
      }
    }
  };

  const lineCount = useMemo(() => {
    return Math.max(1, (value || "").split("\n").length);
  }, [value]);

  return (
    <div className={`relative flex flex-col w-full h-full rounded-xl overflow-hidden border border-surface-border bg-surface shadow-xs ${className}`}>
      {/* Monaco Editor Canvas (Primary IDE engine) */}
      {mounted && !monacoFailed && (
        <div className={`w-full h-full flex-1 ${monacoLoaded ? "opacity-100" : "opacity-0 absolute pointer-events-none"} transition-opacity duration-200`}>
          <MonacoEditor
            height="100%"
            width="100%"
            language={monacoLanguage}
            theme={theme === "dark" ? "vs-dark" : "light"}
            value={value}
            onChange={(val) => onChange(val || "")}
            onMount={() => setMonacoLoaded(true)}
            options={{
              readOnly,
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "var(--font-mono), 'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              tabSize: 4,
              insertSpaces: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              autoClosingDelete: "always",
              autoClosingOvertype: "always",
              autoSurround: "brackets",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              lineNumbers: "on",
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              renderLineHighlight: "all",
              scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8,
              },
              padding: { top: 12, bottom: 12 },
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
      )}

      {/* Smart Fallback Editor (Active while Monaco loads or if offline) */}
      {(!mounted || !monacoLoaded || monacoFailed) && (
        <div className="relative flex flex-1 w-full h-full overflow-hidden bg-surface">
          {/* Line Numbers Gutter */}
          <div
            ref={lineNumbersRef}
            className="w-12 py-3 px-1 text-right select-none font-mono text-xs text-slate-400 dark:text-slate-600 bg-surface-subtle border-r border-surface-border overflow-hidden leading-relaxed shrink-0"
          >
            {Array.from({ length: lineCount }).map((_, idx) => (
              <div key={idx} className="h-6 leading-6">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Textarea with Smart Auto-Indentation & Bracket Pairs */}
          <div className="relative flex-1 h-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              readOnly={readOnly}
              className="w-full h-full py-3 px-4 font-mono text-sm text-foreground bg-transparent resize-none focus:outline-none overflow-auto leading-6 whitespace-pre"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              placeholder="Write your solution here..."
            />
          </div>

          {!monacoLoaded && (
            <div className="absolute top-2 right-3 flex items-center space-x-1.5 text-[11px] text-slate-400 dark:text-slate-500 bg-surface-subtle/80 backdrop-blur-xs px-2 py-0.5 rounded border border-surface-border pointer-events-none">
              <Loader2 className="h-3 w-3 animate-spin text-brand-500" />
              <span>Initializing Monaco...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
