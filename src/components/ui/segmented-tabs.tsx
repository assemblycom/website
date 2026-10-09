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
 *
 * TWO SKINS, ONE CONTROL. `variant` picks the clothes; the semantics, the
 * roving focus and the tab/panel id pair are the same either way, which is the
 * reason this is a prop rather than a second component. See the prop.
 */
export function SegmentedTabs({
  options,
  value,
  onChange,
  label,
  idBase,
  variant = "segmented",
  round = "default",
  className = "",
}: {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  /** Names the control for a screen reader. */
  label: string;
  /** Prefix for the tab/panel id pair, so a panel can point back at its tab. */
  idBase: string;
  /**
   * "segmented" — the bordered track and the gliding thumb. The default, and
   * what a control standing on its own ground wants: it is unmistakably
   * pressable at a glance.
   *
   * "underline" — three plain words with the active one ruled underneath, the
   * feature-comparison table's own tabs (see feature-comparison.tsx). For a
   * control that sits INSIDE something it is the head of, where a filled thumb
   * is the heaviest object in the box and takes the attention the content
   * below it should be getting. The same three labels, a quarter of the ink.
   */
  variant?: "segmented" | "underline";
  /**
   * The track's corner radius.
   *
   * "default" — rounded-lg, the control's own shape, and what every call site
   * that stands on its own ground uses (the pricing billing toggle included).
   *
   * "panel" — rounded-3xl, to match a large rounded panel the control sits
   * directly above, so the two read as one object rather than as a small
   * square-ish control parked on a soft-cornered box. /ai-app-builder's How it
   * works is the case: its panel is rounded-3xl and the control is 12px above
   * it. The thumb's radius follows, so the curves stay concentric.
   *
   * "segmented" only — the underline skin has no track to round.
   */
  round?: "default" | "panel";
  /**
   * Extra classes for the track, for a page whose ground the control has to
   * do something about. /ai-app-builder passes a background and a rail halo:
   * the track is an outline with no fill, so without one the page's vertical
   * rails run straight through the control. Optional and empty by default, so
   * every other call site is unchanged. "segmented" only — the underline skin
   * has no track to put them on.
   */
  className?: string;
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

  // The underline skin: no track, no thumb, nothing to glide. The rule under
  // the active label is the only mark the control makes.
  //
  // NO BASELINE RULE OF ITS OWN, and `-mb-px` so the active label's rule hangs
  // a pixel below the strip. This skin is for a control that heads something
  // already ruled — a table whose first row draws the seam — and a border here
  // would put a second line immediately above that one. The pixel of overhang
  // lands the active rule ON the seam, so the seam simply darkens under the
  // live label, which is the whole effect. A caller with nothing underneath
  // should draw its own rule.
  //
  // Same tablist, same roving focus, same ids.
  if (variant === "underline") {
    return (
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex gap-6 text-sm"
      >
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
            className={`-mb-px shrink-0 whitespace-nowrap border-b pb-2.5 pt-1 transition-colors ${
              o.value === value
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={`relative inline-grid border border-border p-1 text-sm ${
        round === "panel" ? "rounded-3xl" : "rounded-lg"
      } ${className}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        // The thumb's radius follows the track's, one step smaller by the
        // 4px padding between them, so the two curves stay concentric: 8 → 6
        // by default, 24 → 20 on `panel`.
        className={`pointer-events-none absolute inset-y-1 left-1 z-10 overflow-hidden bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          round === "panel" ? "rounded-[20px]" : "rounded-md"
        }`}
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
