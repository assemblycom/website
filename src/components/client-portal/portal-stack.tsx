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
const WAYS: {
  label: string;
  body: string;
  href: string;
  icon: (props: { className?: string }) => React.ReactElement;
}[] = [
  {
    label: "Embeds",
    body: "Drop a tool your clients already open straight into the portal.",
    href: GUIDE_URL,
    icon: IconTemplateEmbeds,
  },
  {
    label: "Integrations",
    body: "Connect what your team runs to the same client records.",
    href: API_REFERENCE_URL,
    icon: IconTemplateIntegrations,
  },
  {
    label: "Automations",
    body: "Hand the busywork between them without anyone retyping it.",
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
  body = "Embed what your clients already use, connect what you run, and automate the busywork. Every app connects to the same client records.",
  ways = WAYS,
  visualTitle = "Stack visual — an outside tool running as an app inside the portal: Assembly's sidebar with a scheduler open in the content area, marked Embedded, cropped right so the screen continues past the rail.",
}: {
  heading?: string;
  body?: string;
  ways?: typeof WAYS;
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
        {/* No right padding from lg up: the picture runs off the rail and past
            the viewport's edge, so it reads as a portal that continues rather
            than a screenshot centred in a band. */}
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:gap-16 lg:pr-0">
          <div className="max-w-xl">
            <h2 className="type-h2 text-balance">{heading}</h2>
            <p className="mt-5 text-muted-foreground">{body}</p>

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
              <ul className="mt-10 flex flex-col">
                {ways.map(({ label, body, href }, i) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      // -mx-3 px-3 so the hover fill extends past the type
                      // without the labels being indented out of the column.
                      // The rules are pseudo-elements pinned to the padding
                      // box's edges, so they span that same full width.
                      className={`group relative -mx-3 flex items-start gap-4 rounded-xl px-3 py-4 transition-colors before:absolute before:inset-x-3 before:top-0 before:h-px before:content-[''] hover:bg-foreground/[0.04] ${DOTTED_RULE_BEFORE} ${
                        i === ways.length - 1
                          ? `after:absolute after:inset-x-3 after:bottom-0 after:h-px after:content-[''] ${DOTTED_RULE_AFTER}`
                          : ""
                      } [[data-theme=dark]_&]:hover:bg-white/[0.04]`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] text-foreground">
                          {label}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                          {body}
                        </span>
                      </span>
                      {/* The chevron, at the row's far edge rather than beside
                          the label — it marks where the row ENDS, which is
                          what makes a list of them read as a column of
                          destinations. Muted at rest and full strength under
                          the pointer, so the row answers without moving. */}
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="mt-[3px] size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                      >
                        <path
                          d="M6 3.5 10.5 8 6 12.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
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
          <StackPicker title={visualTitle} />
        </div>
      </Reveal>
    </section>
  );
}
