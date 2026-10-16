"use client";

import { useEffect, useRef, useState } from "react";
import { IconGlobeSolid } from "@/components/home/mock-icons";

const TYPE_STEP_MS = 70;
const START_DELAY_MS = 400;

/**
 * Types `text` out one character at a time once its element scrolls into
 * view. Reduced motion shows the whole string at once.
 */
function useTypedText<T extends HTMLElement>(text: string) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (reduced) {
          setShown(text.length);
          return;
        }
        const step = (n: number) => {
          setShown(n);
          if (n < text.length)
            timer = setTimeout(() => step(n + 1), TYPE_STEP_MS);
        };
        timer = setTimeout(() => step(1), START_DELAY_MS);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [text]);

  return [ref, shown] as const;
}

/** The typed string and a caret that sits right after its last letter. */
function TypedRun({ text, shown }: { text: string; shown: number }) {
  return (
    <span className="flex min-w-0 items-center">
      <span className="truncate">{text.slice(0, shown)}</span>
      <span className="ml-px inline-block h-[1.1em] w-[1.5px] shrink-0 animate-caret bg-[var(--mock-ink)]" />
    </span>
  );
}

/**
 * Just the typed run, for a field drawn elsewhere. The caret follows the
 * rendered text rather than a fixed width, so it stays on the last letter in
 * any typeface.
 */
export function TypedText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [ref, shown] = useTypedText<HTMLSpanElement>(text);
  return (
    <span ref={ref} aria-hidden className={`flex min-w-0 ${className}`}>
      <TypedRun text={text} shown={shown} />
    </span>
  );
}

/**
 * An address field that types its domain out once it scrolls into view, then
 * rests on a blinking caret: someone heading to a public site, no sign-in in
 * the way.
 */
export function TypedAddress({ url }: { url: string }) {
  const [ref, shown] = useTypedText<HTMLDivElement>(url);

  return (
    <div
      ref={ref}
      aria-hidden
      className="flex w-full max-w-[260px] items-center gap-2 rounded-full border border-[var(--mock-line)] bg-[var(--mock-window)] py-3 pl-3.5 pr-4 text-[14px] leading-none text-[color:var(--mock-ink)] sm:gap-2.5 sm:pl-4 sm:pr-5 sm:text-[15px]"
    >
      <IconGlobeSolid className="size-4 shrink-0 text-[color:var(--mock-ink-soft)]" />
      <TypedRun text={url} shown={shown} />
    </div>
  );
}
