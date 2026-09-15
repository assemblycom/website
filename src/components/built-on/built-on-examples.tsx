"use client";

import { useState } from "react";
import { TemplateDetailPanel } from "@/components/proposal/template-detail-panel";
import { V69CardMock } from "@/components/home/hero-v71";
import { MockFit } from "@/components/templates/mock-fit";
import { useTheme } from "@/components/theme/theme-provider";
import type { Template } from "@/lib/templates";

/**
 * The template's widget cover — the same drawing /templates and the home hero
 * put on it, not a second set made for this page.
 *
 * These pages used to show the app's screenshot letterboxed into the frame,
 * which left most of the card grey. The covers are drawn at a fixed design
 * size and scaled to whatever frame they are given, so they fill it at any
 * card size and follow the site's light/dark skin.
 */
function Preview({
  template,
  className,
  dark,
}: {
  template: Template;
  className: string;
  dark: boolean;
}) {
  return (
    // No MOCK_DESIGN_SIZE here. The gallery draws a few covers in a smaller
    // design box so a sparse one fills its tile, but that also scales its type
    // up — and in a grid of six equal cards the effect is six different type
    // sizes. One design box for all of them keeps the type on one scale across
    // the row, at the cost of two covers sitting a little smaller in their
    // square than they do on /templates.
    // built-on-cover carries this page's larger phone design box (globals.css).
    // It has to live there rather than as a utility here: the gallery's own box
    // is set by an unlayered `:has()` rule, which outranks any Tailwind class.
    <MockFit
      className={`built-on-cover relative overflow-hidden bg-background [[data-theme=dark]_&]:bg-[#151515] ${className}`}
    >
      {/* template-mock-gallery marks the rail a few covers are skinned for;
          .template-mock alone would render this page a different drawing than
          the gallery the visitor may have just come from. */}
      <div
        className={`template-mock template-mock-gallery template-mock-live [font-family:var(--font-inter),system-ui,sans-serif] ${
          dark ? "v72-mock-dark" : ""
        }`}
      >
        <V69CardMock slug={template.slug} />
      </div>
    </MockFit>
  );
}

/**
 * Frame radius. 14px on phones is not a taste call: below sm the covers switch
 * to their phone design box and draw their own inner corners against a 14px
 * card (see the proposal panel's max-sm:rounded-[14px]), so an 8px frame reads
 * squarer than everything sitting inside it. From sm up the covers scale down
 * and the tighter corner is the right one again.
 */
const RADIUS = "rounded-[14px] sm:rounded-[8px]";

/** The hairline is drawn over the cover, the way the gallery draws it: a border
 *  would take a pixel of layout and leave a pale gap inside the frame. */
const EDGE =
  "pointer-events-none absolute inset-0 ring-1 ring-foreground/10 transition-[box-shadow,--tw-ring-color] duration-300 group-hover:ring-foreground/20";

/**
 * Hover: the widget itself plays, the way these covers do in the home hero —
 * bars fill, figures roll, a request resolves. The covers already carry that
 * sequence, written against `.group:hover`; the gallery freezes it and this
 * page opts back in (see .template-mock-live in globals.css).
 *
 * The frame itself does nothing: no lift, no shadow, no scale. Each of those
 * was tried and each competed with the widget it was framing — the card moved
 * and the thing worth watching did not read.
 */
const FRAME = `relative block w-full overflow-hidden ${RADIUS}`;

/**
 * The whole card is the hit area, but the fill is gone: bleeding it 1rem past
 * the content drew a rounded rectangle offset from the text it belonged to, so
 * the page grew a shape on hover instead of responding to one. The preview
 * answers instead — it is the thing being offered and has edges of its own.
 *
 * The negative margin is HORIZONTAL only. It lets the fill bleed past the
 * content so the content itself still starts on the grid line, and leaving the
 * vertical padding in the flow is what keeps stacked cards apart: cancel it
 * too and the rows collapse onto each other with their hover fills overlapping.
 */
const CARD =
  // w-[calc(100%+2rem)] is load-bearing: a <button> sizes to fit its content
  // even at display:block, so without an explicit width the card collapsed to
  // the width of its own text and the preview frame shrank with it. The extra
  // 2rem is what the negative margin gives back.
  "group w-full cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background";

/**
 * The proof section under the hero: what the visitor's firm built, and what
 * they could build.
 *
 * Deliberately asymmetric. A flat row of four equal cards gave every app the
 * same weight and nothing to look at, so the section read as a list. One app
 * leads at full size and the rest run beside it as compact rows, so the eye
 * lands somewhere and then scans.
 *
 * Each card opens the detail panel rather than linking out to /templates: the
 * visitor has one thing to do on this page, and a catalogue to browse is a way
 * to lose them.
 */
export function BuiltOnExamples({
  heading,
  templates,
  signupHref,
}: {
  heading: string;
  templates: Template[];
  signupHref: string;
}) {
  // The covers reskin to the dark surface, the same as on /templates.
  const { theme } = useTheme();
  const dark = theme === "dark";

  // `active` outlives `open` so the panel can animate out with its content
  // still in place instead of emptying mid-slide.
  const [active, setActive] = useState<Template | null>(null);
  const [open, setOpen] = useState(false);

  const [lead, ...rest] = templates;
  if (!lead) return null;

  const show = (template: Template) => {
    setActive(template);
    setOpen(true);
  };

  // Ordinary section rhythm, not a second gap: from md the hero already holds
  // a full screen and centres its content, so the separation is done before
  // this section starts. Stacking more on top of it read as a hole.
  return (
    <section className="pb-20 pt-14 md:pb-28 md:pt-24">
      {/* The site's content column: capped to the 1200px rail width with the
          standard 40px inset, so the heading's left edge lands where every
          other section's does rather than out at the viewport gutter. */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        {/* Hidden on phones, where the cards carry the section on their own and
            a second headline under the hero's read as a false start. sr-only
            rather than hidden: it still names the section for a screen reader
            and still takes no space. */}
        <h2 className="type-h2 max-w-xl text-balance text-foreground max-sm:sr-only">
          {heading}
        </h2>

        {/* One large card beside a 2x3 of small ones. A flat row of equal cards
            gave every app the same weight and read as a list; this lands the
            eye on one app and lets the rest be scanned.

            The lead sticks while the grid beside it scrolls past — plain CSS
            position:sticky, so the page still scrolls at its own speed and
            nothing is pinned or scrubbed. It is `items-start` that lets it:
            a stretched grid item fills the row and has nothing to stick
            within. Below lg the columns stack and it is an ordinary card. */}
        {/* No top margin on a phone: that margin exists to sit the grid under the
            heading, and with the heading hidden there it stacked on the
            section's own padding and left a hole under the hero. */}
        <div className="mt-12 grid items-start gap-8 max-sm:mt-0 lg:grid-cols-2 lg:gap-10">
          <button
            type="button"
            onClick={() => show(lead)}
            aria-label={`${lead.title} details`}
            className={`flex flex-col lg:sticky lg:top-24 ${CARD}`}
          >
            <span className={FRAME}>
              {/* Full width throughout, but not square until lg. Between sm and
                  lg the columns have not split yet, so a full-width square lead
                  ran most of a screen tall. It takes a 16:10 frame there — and
                  with it the covers' own 336x210 phone design box, which is
                  what lets a wide frame fit the drawing instead of cropping the
                  top and bottom off it. Below sm that box is already in force
                  via media query; at lg the square frame and the 288 box meet. */}
              <Preview
                template={lead}
                dark={dark}
                className={`aspect-[16/10] lg:aspect-square ${RADIUS} sm:max-lg:[--template-mock-h:210px] sm:max-lg:[--template-mock-w:336px]`}
              />
              <span aria-hidden className={`${EDGE} ${RADIUS}`} />
            </span>
            <h3 className="type-body mt-4 text-foreground">{lead.title}</h3>
            <p className="type-caption mt-1 max-w-md text-muted-foreground">
              {lead.description}
            </p>
          </button>

          <div className="grid gap-8 sm:grid-cols-2 lg:gap-6">
            {rest.map((template) => (
              <button
                key={template.slug}
                type="button"
                onClick={() => show(template)}
                aria-label={`${template.title} details`}
                className={`flex flex-col ${CARD}`}
              >
                <span className={FRAME}>
                  <Preview
                    template={template}
                    dark={dark}
                    className={`aspect-[16/10] w-full sm:aspect-square ${RADIUS}`}
                  />
                  <span aria-hidden className={`${EDGE} ${RADIUS}`} />
                </span>
                <h3 className="type-body mt-4 text-foreground">
                  {template.title}
                </h3>
                <p className="type-caption mt-1 text-muted-foreground">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* The proposal page's panel, reused rather than rebuilt: same right-hand
          slide-in, same Esc-to-close and scroll lock. */}
      {active && (
        <TemplateDetailPanel
          template={active}
          open={open}
          onClose={() => setOpen(false)}
          onStart={() => {
            window.location.href = signupHref;
          }}
        />
      )}
    </section>
  );
}
