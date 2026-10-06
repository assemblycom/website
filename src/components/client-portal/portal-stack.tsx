import Link from "next/link";
import { IconBolt, IconGlobe, IconSync } from "@/components/home/mock-icons";
import { Reveal } from "@/components/ui/reveal";
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
    icon: IconGlobe,
  },
  {
    label: "Integrations",
    body: "Connect what your team runs to the same client records.",
    href: API_REFERENCE_URL,
    icon: IconSync,
  },
  {
    label: "Automations",
    body: "Hand the busywork between them without anyone retyping it.",
    href: GUIDE_URL,
    icon: IconBolt,
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
    // Top rule only: the page draws a GridDivider under this section, and a
    // border-b here put a second hairline a few pixels above it.
    <section className="border-t border-border bg-muted/40 [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-white/[0.02]">
      <Reveal>
        {/* No right padding from lg up: the picture runs off the rail and past
            the viewport's edge, so it reads as a portal that continues rather
            than a screenshot centred in a band. */}
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-2 lg:gap-16 lg:pr-0">
          <div className="max-w-xl">
            <h2 className="type-h2 text-balance">{heading}</h2>
            <p className="mt-5 text-muted-foreground">{body}</p>

            {/* Each row goes somewhere instead of opening a drawer, so the
                section hands the reader on. No rules and an icon in a filled
                square: a short list of destinations reads as a set, where
                hairlines would make it a table with three entries in it. */}
            {ways.length ? (
            <ul className="mt-10 flex flex-col gap-1">
              {ways.map(({ label, body, href, icon: Icon }) => (
                <li key={label}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    // -mx-3 px-3 so the hover fill extends past the type
                    // without the labels being indented out of the column.
                    className="group -mx-3 flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/[0.04] [[data-theme=dark]_&]:hover:bg-white/[0.04]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground [&>svg]:size-[18px] [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:bg-white/[0.06]">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] text-foreground">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-muted-foreground">
                        {body}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            ) : null}
          </div>

          {/* The shot has not been made yet, so the slot holds its proportions
              rather than filling with a mock that would have to be unbuilt
              later. Solid --muted, not the dashed VisualSlot the page uses
              elsewhere: that frame is muted at 40% and so is this band, so it
              would be an empty space marked by nothing. The art direction
              rides in `title` for whoever makes the shot. */}
          <div
            aria-hidden
            title={visualTitle}
            className="h-[300px] rounded-2xl bg-muted md:h-[380px] lg:h-[440px] lg:rounded-r-none [[data-theme=dark]_&]:bg-white/[0.06]"
          />
        </div>
      </Reveal>
    </section>
  );
}
