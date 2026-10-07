// ─────────────────────────────────────────────────────────────────────────
// STACK PICKER — the "Keep the tools you already use" section's visual.
//
// The slot beside that claim held its proportions and nothing else, waiting on
// a shot of one outside tool running inside the portal. A single screenshot
// was always going to undersell the claim: the sentence is that the portal
// meets whatever a firm already runs, and one scheduler in a frame is one
// scheduler, not a stack.
//
// So it is a CATALOGUE rather than a screenshot — the tools a firm brings with
// it, each marked with the mechanism it arrives by. That mechanism is the
// list on the left of the same section (Embeds, Integrations, Automations), so
// the two halves describe each other: the copy names the three ways in, the
// picture names what comes in by each.
//
// POINTING AT A ROW SELECTS IT, which is the only moving part. It is doing a
// job rather than decorating: the three mechanisms are abstract until you see
// which tool is which, and a reader who runs Stripe wants to find Stripe. The
// first row is selected at rest so the panel is never in a neutral state
// waiting to be touched — the same reason the reference picker opens on a
// voice already chosen.
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";

// Real products, because the claim is about a firm's existing stack and a list
// of invented tools would be a list of nothing. Names only, no logos: those are
// other people's marks, and a lettered tile is what the product itself shows
// before anyone uploads one.
//
// Grouped so no two neighbours share a mechanism. Three Integrations in a row
// would read as the column being sorted by it, and the point is that the three
// ways in are mixed through one stack.
const TOOLS = [
  {
    initials: "GC",
    name: "Google Calendar",
    does: "Booking and availability",
    how: "Embed",
  },
  {
    initials: "ST",
    name: "Stripe",
    does: "Payments and invoices",
    how: "Connect",
  },
  {
    initials: "SL",
    name: "Slack",
    does: "Alerts and handoffs",
    how: "Automate",
  },
  {
    initials: "DS",
    name: "DocuSign",
    does: "Signatures and records",
    how: "Embed",
  },
  {
    initials: "QB",
    name: "QuickBooks",
    does: "Ledger and reconciliation",
    how: "Connect",
  },
  {
    initials: "ZP",
    name: "Zapier",
    does: "Routing between tools",
    how: "Automate",
  },
  {
    initials: "CL",
    name: "Calendly",
    does: "Scheduling and reminders",
    how: "Embed",
  },
];

/**
 * The tile the lettered mark sits on.
 *
 * The same plate the section's own rows use and the template rail before them
 * — light in both themes, dimmed a step in dark so it does not glare. Keeping
 * one value here means the picture's tiles and the copy's tiles are plainly
 * the same object, which is most of what ties the two halves together.
 */
const PLATE =
  "bg-[#e6e7ea] text-[#101114] [[data-theme=dark]_&]:bg-[#c8c9cd]";

// Which rows survive which breakpoint; see the note on the row's className.
const ROW_AT: Record<number, string> = {
  5: "hidden md:flex",
  6: "hidden lg:flex",
};

export function StackPicker({
  /**
   * The slot's art direction, carried through from PortalStack's `visualTitle`.
   *
   * Two solutions pages still pass a note describing the shot they want in
   * this position. The catalogue is what stands here now, but the notes are a
   * live instruction to whoever makes those pages' own pictures, so they ride
   * on the panel rather than being deleted with the empty div they annotated.
   */
  title,
}: { title?: string } = {}) {
  const [active, setActive] = useState(0);

  return (
    <div
      // aria-hidden, like the other pictures on this page. Every tool named
      // here is an example of something the copy beside it already states, so
      // a screen reader that walked the list would be read the same claim
      // twice — once as the argument and once as seven product names with no
      // way to act on any of them.
      aria-hidden
      title={title}
      // A DOUBLE BORDER, drawn the way the hero's frames are.
      //
      // `.mock-edge` is the lit bezel from globals.css — a radial ramp painted
      // into the border box from the top-left with a white counter-light at
      // the opposite corner, so the edge reads as an object catching light
      // rather than as a hairline someone dimmed. It is dark-only by
      // definition there, which is correct: the ramp's whole job is to lift an
      // edge off a near-black ground, and on white it would be a grey smudge.
      // --mock-edge-fill is handed the band's own surface, because the class
      // paints the interior too and would otherwise repaint this panel back to
      // the mock window colour.
      //
      // ONE EDGE, not two. A second ring inside the first was tried and is
      // gone: the bezel this class paints is already a graded edge rather than
      // a flat hairline, so a ring a few pixels in gave it a second, harder
      // line to compete with and the card read as being framed twice.
      className="mock-edge flex h-[300px] flex-col justify-center gap-1 rounded-2xl border border-border bg-[var(--surface)] p-4 [--mock-edge-fill:var(--surface)] md:h-[380px] md:p-5 lg:h-[440px] lg:rounded-r-none [[data-theme=dark]_&]:border-[#383838]"
      // Leaving the panel puts the selection back on the first row rather than
      // stranding it wherever the pointer left. A picture that keeps the last
      // thing you touched reads as a control you have used; this one is a
      // picture, and it should look the same every time you come back to it.
      onMouseLeave={() => setActive(0)}
    >
      {TOOLS.map(({ initials, name, does, how }, i) => {
        const on = i === active;
        return (
          <div
            key={name}
            onMouseEnter={() => setActive(i)}
            // THE LIST IS AS LONG AS THE PANEL IS TALL.
            //
            // The slot is 300px on a phone, 380 from md and 440 from lg, and
            // seven rows need about 400 — so at the two smaller sizes the
            // stack overflowed a panel that clips, and the first and last rows
            // were cut through the middle. A cropped row here is not the
            // deliberate crop the portal mocks make: those run off the card's
            // edge to say the screen continues, while this is a list that fits
            // or does not, and half a row reads as damage.
            //
            // So the tail drops instead. Seven at lg, six from md, five below
            // — the rows that go are the end of a list whose order carries
            // nothing, and five tools still make the point that a stack is
            // mixed. The mechanisms stay mixed at every length because they
            // alternate down the list rather than being grouped.
            className={`${ROW_AT[i] ?? "flex"} items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              on
                ? "bg-foreground/[0.06] [[data-theme=dark]_&]:bg-white/[0.07]"
                : ""
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] leading-none ${PLATE}`}
            >
              {/* Nudged down half a cap height: flex centring lines up the
                  text's box, which puts two capitals with no descender in its
                  top half. Same fix as the portal mocks' avatars. */}
              <span className="block translate-y-[0.1em]">{initials}</span>
            </span>
            <span className="min-w-0 truncate text-[15px] text-foreground">
              {name}
            </span>
            {/* WHAT IT DOES at rest, WHAT YOU DO WITH IT on hover.

                The right column carried the mechanism in both states, which
                made the row a label and its category — true, and not worth
                pointing at. A tool's job is what a reader scans for, so that
                is what the column says standing still; pointing at the row
                asks "and how does that get in here", and the answer arrives
                as the control that would do it.

                A BUTTON, not a tag. A chip is a label — it states a fact about
                the row and sits inside the row's own measure, which is why the
                first attempt ended up reading as a second name beside the
                first. The reference puts an actual control on the right edge,
                and that is the difference: a tag says what this tool is, a
                button says what you are about to do with it. The site's own
                outlined secondary, on the panel's ground so it lifts off the
                selected row's fill.

                The label is the mechanism AS A VERB — Embed, Connect,
                Automate — so the button is both the action and the answer to
                how this tool arrives. */}
            <span className="ml-auto shrink-0 pl-3">
              {on ? (
                <span className="inline-block whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-sm text-background">
                  {how}
                </span>
              ) : (
                <span className="block truncate text-sm text-muted-foreground">
                  {does}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
