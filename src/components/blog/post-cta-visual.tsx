"use client";

import { useEffect, useState } from "react";
import type { CtaVisual } from "@/lib/blog-cta-copy";

// Typing pace, in milliseconds per character.
const TYPE_MS = 45;

/**
 * What Assembly does, at the top of the guide card: the name of the app the
 * post is about types into the app builder's box once and stays there.
 * Drawn like the blog's own prompt-box figures (a dark stage, a white field,
 * the resting caret) so it reads as the product rather than an illustration.
 * Decorative: the card's title and copy say the same thing in words.
 */
export function PostCtaVisual({ visual }: { visual: CtaVisual }) {
  // Starts empty so the name never shows whole before it types in.
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    // Without motion the name appears whole, which says it alone.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      timer = setTimeout(() => setTyped(visual.prompt.length));
      return () => clearTimeout(timer);
    }
    const run = (count: number) => {
      setTyped(count);
      if (count < visual.prompt.length)
        timer = setTimeout(() => run(count + 1), TYPE_MS);
    };
    run(0);
    return () => clearTimeout(timer);
  }, [visual.prompt]);

  return (
    <div
      aria-hidden
      className="flex aspect-[16/10] w-full items-center justify-center rounded-lg bg-[#111111] p-3 [[data-theme=dark]_&]:border [[data-theme=dark]_&]:border-white/[0.08] [[data-theme=dark]_&]:bg-[var(--surface-2)]"
    >
      {/* The prompt box, as the app builder draws it, with send on its line. */}
      <div className="flex w-full items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white py-2 pl-2.5 pr-2 text-xs leading-[1.4] text-[#101114]">
        <p className="m-0 min-w-0 flex-1 overflow-hidden whitespace-nowrap">
          {visual.prompt.slice(0, typed)}
          <span
            className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] bg-[#101114]"
            style={{ animation: "composerCaret 1.1s steps(1) infinite" }}
          />
        </p>
        <span className="flex size-[1.125rem] shrink-0 items-center justify-center rounded-[0.25rem] bg-[#101114] text-white">
          <svg
            viewBox="0 0 16 16"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
