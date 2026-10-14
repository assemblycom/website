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

import { SIGNUP_URL } from "@/lib/constants";

// Real products, because the claim is about a firm's existing stack and a list
// of invented tools would be a list of nothing. Names only, no logos: those are
// other people's marks, and a lettered tile is what the product itself shows
// before anyone uploads one.
//
// Grouped so no two neighbours share a mechanism. Three Integrations in a row
// would read as the column being sorted by it, and the point is that the three
// ways in are mixed through one stack.
// `logo` is the file under public/images/logos. Where a tool has none the
// lettered tile stands in — which is what the product itself shows before
// anyone uploads a mark, so the fallback is a real state rather than a gap.
const TOOLS: {
  initials: string;
  name: string;
  does: string;
  how: string;
  logo?: string;
}[] = [
  {
    initials: "GC",
    name: "Google Calendar",
    does: "Booking and availability",
    how: "Embed",
    logo: "google-calendar.png",
  },
  {
    initials: "ST",
    name: "Stripe",
    does: "Payments and invoices",
    how: "Connect",
    logo: "stripe.svg",
  },
  {
    initials: "SL",
    name: "Slack",
    does: "Alerts and handoffs",
    how: "Automate",
    logo: "slack.png",
  },
  {
    initials: "DS",
    name: "DocuSign",
    does: "Signatures and records",
    how: "Embed",
    logo: "docusign.png",
  },
  {
    initials: "QB",
    name: "QuickBooks",
    does: "Ledger and reconciliation",
    how: "Connect",
    logo: "quickbooks.png",
  },
  {
    initials: "ZP",
    name: "Zapier",
    does: "Routing between tools",
    how: "Automate",
    logo: "zapier.svg",
  },
  {
    initials: "CL",
    name: "Calendly",
    does: "Scheduling and reminders",
    how: "Embed",
    logo: "calendly.png",
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
const PLATE = "bg-[#e6e7ea] text-[#101114] [[data-theme=dark]_&]:bg-[#c8c9cd]";

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
      // NOT aria-hidden any more. It was, on the grounds that every tool here
      // is an example of a claim the copy beside it already makes and there
      // was nothing to act on — which stopped being true the moment the rows
      // became links. A hidden list of real destinations is a set of doors a
      // keyboard can tab into and a screen reader is never told about.
      title={title}
      // THE GROUND FADES OUT TO THE RIGHT, from lg.
      //
      // This card deliberately runs past the 1200px rail and off the viewport,
      // and it was ending on a hard vertical: a border and a block of surface
      // stopping dead against the page. That reads as a panel that has been
      // cut, which is the opposite of what the bleed is for — the card is
      // supposed to carry on.
      //
      // So the FILL dissolves instead of stopping. The gradient is its own
      // layer behind the rows rather than the element's background, which is
      // what keeps the text out of it: a mask on the card would have taken the
      // right-hand descriptions with it, and those are the column that has to
      // stay readable. One declaration for both themes, because --surface
      // resolves per theme and `transparent` lets whatever is behind through.
      //
      // Below lg the card does not bleed — the grid has padding on both sides
      // there — so it keeps a plain closed panel with its border all round.
      // AND FROM lg IT GETS AN EDGE BACK, as a lit ring rather than a border.
      //
      // Dropping the border at lg is right — there is no right side to draw on
      // a card that runs off the grid — but it left the panel with no edge at
      // ALL on the three sides that do exist, so in dark a near-black list sat
      // on a near-black page as rows floating in space rather than as a screen.
      //
      // .mock-lit-edge is the site's own answer to exactly that: a 1px ring lit
      // at the top, down to the plain hairline by 45%, gone by the foot — the
      // same edge the cropped product shots wear. --bleed-right masks it to
      // dissolve rightward on the card's own fill stops so the one edge that is
      // a crop stays a crop, and switches the whole ring off below lg, where
      // the border is still there doing the job. See globals.css — and when
      // the fill's stops change, that mask changes with them, which is why
      // easing the ramp below meant editing both.
      className="mock-lit-edge mock-lit-edge--bleed-right relative flex h-[300px] flex-col justify-center gap-1 rounded-2xl border border-border bg-[var(--surface)] p-4 md:h-[380px] md:p-5 lg:h-[440px] lg:rounded-r-none lg:border-r-0 lg:border-transparent lg:bg-transparent [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:lg:border-transparent"
      // THE SELECTION STAYS WHERE YOU LEFT IT.
      //
      // Leaving the panel used to snap it back to the first row, on the
      // argument that this is a picture and should look the same every time
      // you come back to it. Wrong once the rows became links: a row you
      // pointed at and then moved away from — towards its button, or away to
      // think about it — is the row you are still considering, and resetting
      // it takes the answer off the screen mid-thought. It also made the panel
      // twitch every time the pointer crossed it on the way somewhere else.
      //
      // The first row is still what it opens on, so the panel is never waiting
      // to be touched; it just stops arguing with you afterwards.
    >
      {/* The ground. Only from lg, where the card bleeds; below that the
          element's own background is doing the job. The left corners stay
          rounded and the right simply runs out.

          EASED, NOT TWO-STOP. It ran solid to 58% and then straight to
          transparent, which is a linear alpha ramp with a corner in the curve
          at each end — and a corner in an alpha curve is a visible line. On a
          white page both corners fall between two near-white values and
          nothing shows; on near-black the card is #191919 giving out onto
          #0a0a0a, so the same two corners read as the edges of a band down the
          right of the picture, with the rows' descriptions sitting inside it.

          The stops below approximate an ease: the fill starts giving way
          earlier (42%) and never changes rate sharply enough to draw a line,
          so the panel dissolves over most of its width instead of ending in a
          gradient. Same declaration for both themes, because --surface
          resolves per theme and color-mix carries that through — this is the
          shape of the ramp changing, not its colour.

          The same stops as `edgeFade` on the hero, run the other way: that one
          brings a card's ground IN over a screen, this one takes it OUT. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden rounded-l-2xl bg-[linear-gradient(to_right,var(--surface)_0%,var(--surface)_42%,color-mix(in_srgb,var(--surface)_88%,transparent)_54%,color-mix(in_srgb,var(--surface)_72%,transparent)_64%,color-mix(in_srgb,var(--surface)_52%,transparent)_73%,color-mix(in_srgb,var(--surface)_33%,transparent)_81%,color-mix(in_srgb,var(--surface)_18%,transparent)_88%,color-mix(in_srgb,var(--surface)_8%,transparent)_94%,transparent_100%)] lg:block"
      />
      {TOOLS.map(({ initials, name, does, how, logo }, i) => {
        const on = i === active;
        return (
          <a
            key={name}
            href={SIGNUP_URL}
            onMouseEnter={() => setActive(i)}
            // Focus selects the row too, so tabbing through shows the same
            // state pointing does. Without it a keyboard lands on a row that
            // looks exactly like the six it is not on.
            onFocus={() => setActive(i)}
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
            // min-w-0: a flex item floors at its own min-content width unless
            // told otherwise, and this row's floor — plate, name, and a right
            // column that does not shrink — came to ~376px. On a phone that
            // propped the section's single grid track open past the viewport
            // and took the heading over the edge with it. See the note on the
            // track in portal-stack.tsx.
            className={`${ROW_AT[i] ?? "flex"} relative min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              on
                ? "bg-foreground/[0.06] [[data-theme=dark]_&]:bg-white/[0.07]"
                : ""
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40`}
          >
            {logo ? (
              // The tool's own mark, on the same plate the initials use so the
              // column lines up whichever a row has. object-contain with a
              // little padding, because these marks are drawn to their own
              // ratios — a square tile would squash the wide ones.
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/logos/${logo}`}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </span>
            ) : (
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] leading-none ${PLATE}`}
              >
                {/* Nudged down half a cap height: flex centring lines up the
                    text's box, which puts two capitals with no descender in its
                    top half. Same fix as the portal mocks' avatars. */}
                <span className="block translate-y-[0.1em]">{initials}</span>
              </span>
            )}
            {/* THE NAME DOES NOT GIVE WAY FIRST. Now that the row shrinks on
                a phone, something in it has to lose width, and between a
                tool's name and a description of what it does, the name is the
                token being scanned for — "DocuSi…" beside "Signatures and
                rec…" is two truncations where one would have done. shrink-0
                keeps it whole and the description absorbs the squeeze; the
                cap is the backstop, so a name longer than any here still
                cannot take the row. */}
            <span className="min-w-0 max-w-[60%] shrink-0 truncate text-[15px] text-foreground">
              {name}
            </span>
            {/* The link's name on its own is a product Assembly does not make.
                "Google Calendar" announced as a link, with no indication of
                where it leads, is the kind of thing that reads as an outbound
                link to Google. The destination said out loud, for anyone not
                reading the button. */}
            <span className="sr-only">
              — connect it in Assembly, get started
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
            {/* The pill never shrinks — it is a control, and a truncated verb
                is not one. The description does, so that on a narrow row it
                gives way with an ellipsis instead of holding the row open. */}
            <span className={`ml-auto pl-3 ${on ? "shrink-0" : "min-w-0"}`}>
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
          </a>
        );
      })}
    </div>
  );
}
