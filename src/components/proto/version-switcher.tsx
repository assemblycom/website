"use client";

import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────────────
// PROTOTYPE SWITCHER — moves between the versions of the homepage this
// prototype holds. Prototype furniture, not site chrome: it is the one piece
// here that would never ship, so it is deliberately plain and sits over the
// page rather than in it.
// ─────────────────────────────────────────────────────────────────────────

export interface ProtoVersion {
  /** What the URL carries, e.g. `?v=2`. */
  key: string;
  label: string;
  /** One line under the label in the switcher, naming what the version is. */
  note: string;
}

export const VERSIONS: ProtoVersion[] = [
  { key: "1", label: "V1", note: "Live homepage" },
  { key: "2", label: "V2", note: "Round 4" },
  { key: "3", label: "V3", note: "Photo hero" },
];

export function VersionSwitcher({ active }: { active: string }) {
  const router = useRouter();

  function go(key: string) {
    // Scroll stays put so the same point in the page can be compared across
    // versions — the sections below the hero are mostly shared, and jumping to
    // the top on every switch hid exactly the difference being looked at.
    router.replace(`/?v=${key}`, { scroll: false });
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background/90 p-1 shadow-[0_8px_30px_-12px_rgba(16,24,40,0.3)] backdrop-blur [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-neutral-900/90">
        {VERSIONS.map((v) => {
          const on = v.key === active;
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => go(v.key)}
              aria-pressed={on}
              className={`flex items-baseline gap-2 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                on
                  ? "bg-foreground text-background [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {v.label}
              <span
                className={`text-[11px] ${on ? "opacity-70" : "opacity-60"}`}
              >
                {v.note}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
