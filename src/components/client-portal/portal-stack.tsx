import Link from "next/link";
import {
  IconTemplateAutomations,
  IconTemplateEmbeds,
  IconTemplateIntegrations,
} from "@/components/templates/template-icons";

import {
  DOTTED_RULE_AFTER,
  DOTTED_RULE_BEFORE,
} from "@/components/ui/dotted-rule";
import { Reveal } from "@/components/ui/reveal";
import { StackPicker } from "@/components/client-portal/stack-picker";
import { API_REFERENCE_URL, GUIDE_URL } from "@/lib/constants";

/**
 * The three ways Assembly meets a stack a firm already runs.
 *
 * It was the fifth card in the tailor grid, which is where it went wrong: a
 * full-width card holding one short paragraph and three rows is mostly empty
 * card, and the four cards above it are each a picture of one app, so a claim
 * about all of them read as a fifth, pictureless example.
 *
 * As a section it gets the split the claim deserves: the argument on the left,
 * and on the right someone else's tool running inside the portal, which is the
 * only form of proof this one has. The band is the page's own soft ground with
 * a rule top and bottom, so the section reads as a different kind of statement
 * from the cards above without inventing a new card.
 *
 * NOTE: the handoff leaves these link targets undecided ("docs embeds page or
 * /templates", pending Vivienne). These are the nearest real routes the site
 * has and they resolve, but they stand in for that decision.
 */
type Way = {
  label: string;
  body: string;
  /** Absent: the row is a statement, not a destination — no link, no arrow. */
  href?: string;
  icon?: (props: { className?: string }) => React.ReactElement;
};

const WAYS: Way[] = [
  {
    label: "Embeds",
    body: "Put any link or dashboard inside your portal, next to your apps.",
    href: GUIDE_URL,
    icon: IconTemplateEmbeds,
  },
  {
    label: "Integrations",
    body: "API and MCP connector on every paid plan, plus Zapier and Make.",
    href: API_REFERENCE_URL,
    icon: IconTemplateIntegrations,
  },
  {
    label: "Automations",
    body: "An action in one app fires a workflow, with no handoffs by hand.",
    href: GUIDE_URL,
    icon: IconTemplateAutomations,
  },
];

/**
 * Copy and the row set are props. A page whose brief states the integrations in
 * one paragraph passes `ways: []` and the list drops out entirely, leaving the
 * claim and the picture — which is what /solutions/accounting-client-portal
 * does, since its copy names the tools outright rather than linking on.
 */
export function PortalStack({
  heading = "Keep the tools you already use",
  // The handoff's wording names API, MCP connector, Zapier, Make and the
  // automation builder in the lead — and every one of them is in the three
  // rows directly beneath it, so the paragraph was the list read out before
  // the list. It states the three ways in and leaves the naming to the rows.
  body = "Embed the tools your clients already use, connect what you run, and automate the busywork. Every app connects to the same client records.",
  ways = WAYS,
  visual,
  visualTitle = "Stack visual — an outside tool running as an app inside the portal: Assembly's sidebar with a scheduler open in the content area, marked Embedded, cropped right so the screen continues past the rail.",
}: {
  heading?: string;
  /** null drops the line under the heading. */
  body?: string | null;
  ways?: Way[];
  /**
   * The right-hand picture in place of the stack picker — the template pages
   * run their own screenshot here. null drops the column altogether.
   */
  visual?: React.ReactNode;
  visualTitle?: string;
} = {}) {
  return (
    // Ruled top AND bottom, and both full-bleed, because the band is.
    //
    // It used to carry the top rule only and let the page's GridDivider close
    // it, but that divider is capped to the 1200px column while this section's
    // tint runs to the viewport — so past 1200px the band's foot had no line
    // in either gutter and simply stopped, while its head ran edge to edge.
    // Every page that uses this section drops its GridDivider underneath in
    // exchange, so there is still exactly one hairline here.
    // Half-strength. A full-bleed band carries far more area than a tray or a
    // card, so the same grey reads a step darker across it; at 50% it sits
    // between the page and the slot inside it, which is what a band is for.
    <section className="border-y border-border bg-[var(--surface)]/50 [[data-theme=dark]_&]:border-[#383838]">
      <Reveal>
        {/* grid-cols-[minmax(0,1fr)] IS LOAD-BEARING BELOW lg. A grid track
            sized `auto` floors at its content's min-content width, and a
            default grid item floors at its own (min-width: auto). The picker
            below is a column of rows — icon, name, role, button — whose
            min-content width comes to ~376px, so the single track below lg
            opened to 376 inside a 327px content box. Everything in the first
            cell inherited that width: the h2 ran 25px past the viewport and
            was cut mid-word, and the dotted rules ran out under the edge.
            minmax(0,1fr) lets the track shrink to the box; the rows below
            carry min-w-0 so they shrink with it rather than pushing back.
            Tailwind's lg:grid-cols-2 is already repeat(2,minmax(0,1fr)), so
            the two-column layout is unchanged.

            No right padding from lg up: the picture runs off the rail and past
            the viewport's edge, so it reads as a portal that continues rather
            than a screenshot centred in a band. */}
        <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* `contents` BELOW lg, a block from lg. The picture goes directly
              under the body copy on a phone — it is what the sentence is
              describing, and three rows of list in between meant a reader met
              the claim, then a menu, and only then the thing itself. But from
              lg the heading, the copy and the list are one column beside the
              picture, so they have to be one box again.
              display:contents dissolves this wrapper below lg, which puts the
              heading block and the list straight into the flex column where
              `order` can interleave them with the picker. No duplicated
              markup, and the lg layout is untouched. */}
          <div className="contents lg:block lg:max-w-xl">
            <div className="order-1 lg:contents">
              <h2 className="type-h2 text-balance">{heading}</h2>
              {body ? (
                <p className="mt-5 text-muted-foreground">{body}</p>
              ) : null}
            </div>

            {/* THE DIVIDED LIST, the one this page already draws.

                These were three rows with a filled icon plate ahead of each —
                a tile the glyphs had been held back from, so for a while the
                plate was an empty block whose only job was to indent the copy.
                The art landed, and the rows still read as a feature grid: three
                badges down the left of a column that is otherwise type.

                The page has a better shape for a short list of destinations
                and uses it twice already — the FAQ and the problem section's
                halves: a dotted hairline between rows, the label at full
                strength, a chevron on the right edge. It says "these go
                somewhere" with the thing that goes somewhere rather than with
                a decoration beside it, and it is the rule this page is ruled
                with rather than a fourth idea about lists.

                The rule is on each row's `before`, which is what lets the
                hover fill run the full width without a divider sitting inside
                it; `after` on the last row closes the list. Shared constants,
                because two dotted rules on one page that disagree about pitch
                read as a mistake — see dotted-rule.ts.

                `ways` keeps carrying an `icon` so nothing downstream breaks,
                and the body copy stays: it is the sentence that distinguishes
                three words that would otherwise be three nouns. */}
            {ways.length ? (
              // order-3 puts the list AFTER the picture below lg; from lg
              // the wrapper is a block again and order means nothing. The top
              // margin goes with it: as a flex item the column's gap-10
              // already separates it, and mt-10 on top of that was 80px.
              <ul className="order-3 mt-0 flex flex-col lg:order-none lg:mt-10">
                {ways.map(({ label, body, href }, i) => {
                  const rule = `relative flex items-start gap-4 px-3 py-4 before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] ${DOTTED_RULE_BEFORE} ${
                    i === ways.length - 1
                      ? `after:absolute after:inset-x-0 after:bottom-0 after:h-px after:content-[''] ${DOTTED_RULE_AFTER}`
                      : ""
                  }`;
                  const text = (
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-foreground">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </span>
                    </span>
                  );
                  // A row with nowhere to go is the same rule and type, with
                  // no hover and no arrow: an arrow on a row that goes nowhere
                  // promises a destination the row doesn't have.
                  if (!href) {
                    return (
                      <li key={label} className={rule}>
                        {text}
                      </li>
                    );
                  }
                  return (
                    <li key={label}>
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        // SQUARE HOVER FILL, AND EXACTLY AS WIDE AS THE RULES.
                        //
                        // It was rounded-xl, which on a row spanning a ruled list
                        // put a pill between two straight hairlines — the fill
                        // pulled away from the rules at every corner and the row
                        // read as a card that had landed in a table. A list
                        // divided by full-width rules is a set of bands, so the
                        // band is what highlights.
                        //
                        // And it was -mx-3 px-3, which pulled the fill twelve
                        // pixels wider than the rules at each end: the band stuck
                        // out past the lines that are supposed to bound it, so
                        // the row looked like it was overflowing its own list.
                        //
                        // The row sits in the column now, so the band and the
                        // rules share one measure — and the padding went INSIDE
                        // it rather than outside. Without it the label started on
                        // the band's own edge and the arrow ended on it, which
                        // read as text that had been pushed up against the walls.
                        // The cost is that the labels are inset from the heading
                        // above them; the band having room is worth more than
                        // that alignment, since the band is the thing you see
                        // move.
                        className={`group transition-colors hover:bg-foreground/[0.04] [[data-theme=dark]_&]:hover:bg-white/[0.04] ${rule}`}
                      >
                        {/* Label and its sentence, per handoff v2, which writes
                          these three as cards rather than as bare destinations.
                          An earlier pass ran the label alone on the grounds
                          that the lead above already defines the words; v2
                          names a plan boundary in each one ("on every paid
                          plan", "any link or dashboard"), which is the kind of
                          thing a reader cannot infer from the word. So the
                          sentence is back, and the row is a block rather than
                          a line: no `truncate`, since these wrap by design. */}
                        <span className="min-w-0 flex-1">
                          <span className="block text-[15px] text-foreground">
                            {label}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                            {body}
                          </span>
                        </span>
                        {/* AN ARROW, not a caret.

                          A chevron is the mark for a disclosure — something
                          that opens where it stands, which is what the first
                          pass drew. These rows leave the page. An arrow is the
                          one that means "goes somewhere", and it is the mark
                          this site already uses for that.

                          At the row's far edge rather than beside the label,
                          so it marks where the row ends; muted at rest and
                          full strength under the pointer, so the row answers
                          without moving.

                          THE FONT'S ARROW, not a drawn one. This was an SVG
                          path unique to this file — the only place on the
                          site that glyph existed — so its weight, its
                          terminals and the angle of its head were one
                          person's guess rather than anything the rest of the
                          page is set in. PP Mori has the character, it
                          inherits the row's own size and colour, and it is
                          the same mark in both themes for free.

                          aria-hidden: the row is already a link with its
                          label, so a screen reader reading "right arrow"
                          after it adds nothing. */}
                        <span
                          aria-hidden
                          className="shrink-0 text-[15px] leading-none text-muted-foreground transition-colors group-hover:text-foreground"
                        >
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* THE CATALOGUE, in place of the shot that was never made.

              The slot held its proportions for a photograph of one outside
              tool running inside the portal. That shot would have undersold
              the claim: the sentence is that the portal meets whatever a firm
              already runs, and one scheduler in a frame is one scheduler. The
              picker names a stack instead, and marks each tool with which of
              the three ways in it arrives by — so the list on the left and the
              picture on the right describe each other. See stack-picker.tsx.

              `visualTitle` still rides through as the slot's art direction for
              any page that wants its own picture here. */}
          {/* order-2: directly under the body copy on a phone, before the
              list. From lg the parent is a two-column grid and this is simply
              the second cell again. */}
          {visual === null ? null : (
            <div className="order-2 min-w-0 lg:order-none">
              {visual ?? <StackPicker title={visualTitle} />}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
