"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// PROTOTYPE SWITCHER — moves between the versions of the homepage this
// prototype holds. Prototype furniture, not site chrome: it is the one piece
// here that would never ship, so it is deliberately plain and sits over the
// page rather than in it.
//
// SHUT BY DEFAULT. It has been a pill across the foot and then a column down
// the right edge, and both had the same problem — whatever it was parked
// over was a part of the page someone was trying to look at. A control for
// comparing designs cannot be sitting on the design.
//
// So at rest it is one small mark showing which version is on, and the list
// is behind a click. Open, it closes again on a choice, on Escape, or on a
// click anywhere else, so it is never left covering anything.
// ─────────────────────────────────────────────────────────────────────────

export interface ProtoVersion {
  /** What the URL carries, e.g. `?v=2`. */
  key: string;
  label: string;
  /** One line under the label in the switcher, naming what the version is. */
  note: string;
}

// Every version runs the same page and differs only in its hero, so the notes
// name heroes rather than homepages.
export const VERSIONS: ProtoVersion[] = [
  { key: "1", label: "V1", note: "Live hero" },
  { key: "2", label: "V2", note: "Split hero" },
  { key: "3", label: "V3", note: "Photo hero" },
];

const SHELL =
  "rounded-2xl border border-border bg-background/90 shadow-[0_8px_30px_-12px_rgba(16,24,40,0.3)] backdrop-blur [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-neutral-900/90";

export function VersionSwitcher({ active }: { active: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Escape and outside clicks both close it. Bound only while it is open, so
  // the page carries no listeners for a control nobody has touched.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Capture, so a click on a page element that stops propagation still
    // closes it — this sits over the whole page and must not get stuck open.
    window.addEventListener("pointerdown", onDown, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown, true);
    };
  }, [open]);

  function go(key: string) {
    // Scroll stays put so the same point in the page can be compared across
    // versions — the sections below the hero are mostly shared, and jumping to
    // the top on every switch hid exactly the difference being looked at.
    router.replace(`/?v=${key}`, { scroll: false });
    setOpen(false);
  }

  const current = VERSIONS.find((v) => v.key === active) ?? VERSIONS[1];

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed right-3 top-1/2 z-50 -translate-y-1/2 md:right-5"
    >
      {open ? (
        <div className={`pointer-events-auto flex flex-col gap-1 p-1 ${SHELL}`}>
          {VERSIONS.map((v) => {
            const on = v.key === active;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => go(v.key)}
                aria-pressed={on}
                className={`flex flex-col items-start rounded-xl px-3 py-1.5 text-sm transition-colors ${
                  on
                    ? "bg-foreground text-background [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {v.label}
                <span
                  className={`text-[10px] leading-tight ${on ? "opacity-70" : "opacity-60"}`}
                >
                  {v.note}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        // THE RESTING STATE: the active version's name and nothing else, at
        // the size of a tab's label. It names the version rather than showing
        // a generic glyph, so the one thing worth knowing at a glance — which
        // of the three you are looking at — is readable without opening it.
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-label={`Version ${current.label}, ${current.note}. Show the other versions`}
          className={`pointer-events-auto flex size-9 items-center justify-center text-[13px] text-muted-foreground transition-colors hover:text-foreground ${SHELL}`}
        >
          {current.label}
        </button>
      )}
    </div>
  );
}
