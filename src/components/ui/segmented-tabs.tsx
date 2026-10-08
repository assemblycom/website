"use client";

import { useRef } from "react";

/**
 * The site's segmented control, generalised past two options.
 *
 * It is the pricing billing toggle's mechanics exactly — a bordered track with
 * 4px of padding, a thumb that GLIDES between cells, and the active-coloured
 * labels carried inside the thumb's own clipped window so the highlight is
 * revealed as it travels rather than cross-fading the text underneath (which
 * dips through a low-contrast state on switch: the "blink"). The inner label
 * strip counter-slides to stay registered with the base labels below it.
 *
 * Extracted rather than copied because this is the third place the control is
 * wanted and the pricing one is hardcoded to two cells. Pricing has NOT been
 * moved onto it — that toggle also animates its own price column off the same
 * state, so it is worth doing deliberately rather than as a drive-by here.
 *
 * Tabs, not radios: these select which panel is shown, so they carry tablist
 * semantics and the roving arrow-key focus that goes with them.
 */
export function SegmentedTabs({
  options,
  value,
  onChange,
  label,
  idBase,
}: {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  /** Names the control for a screen reader. */
  label: string;
  /** Prefix for the tab/panel id pair, so a panel can point back at its tab. */
  idBase: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = options.length;
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  // Left/Right move the selection and the focus together, which is what a
  // tablist does; Home/End jump to the ends.
  function onKeyDown(e: React.KeyboardEvent) {
    const delta =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    let next = -1;
    if (delta) next = (index + delta + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="relative inline-grid rounded-lg border border-border p-1 text-sm"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-1 left-1 z-10 overflow-hidden rounded-md bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 0.5rem) / ${count})`,
          transform: `translateX(${index * 100}%)`,
        }}
      >
        <span
          className="absolute inset-0 grid text-background transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{
            width: `${count * 100}%`,
            gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
            transform: `translateX(-${(index * 100) / count}%)`,
          }}
        >
          {options.map((o) => (
            <span
              key={o.value}
              className="flex items-center justify-center whitespace-nowrap px-4 py-1.5"
            >
              {o.label}
            </span>
          ))}
        </span>
      </span>

      {options.map((o, i) => (
        <button
          key={o.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          id={`${idBase}-tab-${o.value}`}
          aria-controls={`${idBase}-panel-${o.value}`}
          aria-selected={o.value === value}
          tabIndex={o.value === value ? 0 : -1}
          onClick={() => onChange(o.value)}
          className="relative whitespace-nowrap rounded-md px-4 py-1.5 text-center text-muted-foreground transition-colors hover:text-foreground"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
