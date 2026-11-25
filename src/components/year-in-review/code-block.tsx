"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const COPIED_MS = 1600;
const MONO = "[font-family:var(--font-diatype-mono),ui-monospace,monospace]";
// Strings and comments, the two things worth telling apart at a glance.
const TOKEN = /("[^"]*"|'[^']*'|`[^`]*`|\/\/.*$)/;

/** Two tones from the site's own palette: code in ink, strings and comments
 * stepped back, so the shape of a call reads before its arguments do. */
function highlight(line: string) {
  return line.split(TOKEN).map((part, i) =>
    part === "" ? null : (
      <span
        key={i}
        className={
          i % 2 === 1 ? "text-muted-foreground" : "text-foreground"
        }
      >
        {part}
      </span>
    ),
  );
}

/**
 * A code sample at the reading measure: the language over the code and a copy
 * action beside it, on the same grey the article's pictures sit on.
 */
export function CodeBlock({
  code,
  language,
  className,
}: {
  code: string;
  language: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Blocked in some embedded contexts; the code is on screen either way.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <div className={cn("rounded-lg bg-[var(--surface)]", className)}>
      <div className="flex items-center justify-between px-5 pt-4 md:px-6">
        <span className="type-caption text-muted-foreground">{language}</span>
        <button
          type="button"
          onClick={copy}
          className="type-caption rounded-full px-3 py-1 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto px-5 pb-5 pt-3 text-sm leading-[1.75] md:px-6 md:pb-6",
          MONO,
        )}
      >
        <code>
          {code.split("\n").map((line, i) => (
            <span key={i} className="block min-h-[1lh]">
              {highlight(line)}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
