"use client";

import { useEffect, useRef, useState } from "react";
import { IconGlobeSolid } from "@/components/home/mock-icons";

const TYPE_STEP_MS = 70;
const START_DELAY_MS = 400;

/**
 * An address field that types its domain out once it scrolls into view, then
 * rests on a blinking caret: someone heading to a public site, no sign-in in
 * the way. Reduced motion shows the whole domain at once.
 */
export function TypedAddress({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
          setShown(url.length);
          return;
        }
        const step = (n: number) => {
          setShown(n);
          if (n < url.length)
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
  }, [url]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="flex w-full max-w-[260px] items-center gap-2.5 rounded-full border border-[var(--mock-line)] bg-[var(--mock-window)] py-3 pl-4 pr-5 text-[15px] leading-none text-[color:var(--mock-ink)]"
    >
      <IconGlobeSolid className="size-4 shrink-0 text-[color:var(--mock-ink-soft)]" />
      <span className="flex min-w-0 items-center">
        <span className="truncate">{url.slice(0, shown)}</span>
        <span className="ml-px inline-block h-[1.1em] w-[1.5px] shrink-0 animate-caret bg-[var(--mock-ink)]" />
      </span>
    </div>
  );
}
