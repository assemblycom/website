"use client";

import { useState } from "react";
import { TemplateDetailPanel } from "@/components/proposal/template-detail-panel";
import type { Template } from "@/lib/templates";

/**
 * Plain fill standing in for the app preview while the artwork is decided.
 *
 * --muted, the same token the FAQ rows use, so the two greys on the page are
 * one grey rather than two that nearly match.
 */
const SURFACE =
  "bg-muted ring-1 ring-foreground/10 transition-colors duration-200 group-hover:bg-foreground/[0.07] group-hover:ring-foreground/20";

/**
 * The app's own screenshot, the same one its template page shows, or the grey
 * frame while a template still has none.
 */
function Preview({
  template,
  className,
}: {
  template: Template;
  className: string;
}) {
  return (
    <div
      aria-hidden
      className={`overflow-hidden ${className} ${SURFACE}`}
    >
      {template.image ? (
        // A plain img, not next/image: a cover can come from Contentful or from
        // public/, and only one of those is an allowed optimisation host.
        //
        // Contain, with padding: these are whole app screens, and cover cut the
        // sidebar off one edge and the header off the other, so the card showed
        // a crop of a UI rather than a UI. The outlined frame is what keeps the
        // letterboxing reading as a frame rather than as a small image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={template.image}
          alt=""
          className="size-full object-contain p-2"
        />
      ) : null}
    </div>
  );
}

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
        <h2 className="type-h2 max-w-xl text-balance text-foreground">
          {heading}
        </h2>

        <div className="mt-12 grid items-start gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-y-12">
          <div>
            <button
              type="button"
              onClick={() => show(lead)}
              aria-label={`${lead.title} details`}
              className={`block ${CARD}`}
            >
              <Preview
                template={lead}
                className="aspect-[16/10] rounded-[8px]"
              />
              <h3 className="type-h4 mt-5 text-foreground">{lead.title}</h3>
              <p className="type-body mt-1.5 max-w-md text-muted-foreground">
                {lead.description}
              </p>
            </button>
          </div>

          {/* No rules between the rows. Each thumbnail already gives its row a
              left edge and a block of its own, so a hairline on top of that was
              a second separator doing the same job. The gap is set so the three
              rows sit clear of each other once each one's own padding is
              counted. */}
          <div className="flex flex-col gap-10 lg:aspect-[8/7] lg:gap-3">
            {rest.map((template) => (
              <div key={template.slug} className="lg:min-h-0 lg:flex-1">
                <button
                  type="button"
                  onClick={() => show(template)}
                  aria-label={`${template.title} details`}
                  className={`block lg:flex lg:h-full lg:items-center lg:gap-5 ${CARD}`}
                >
                  <Preview
                    template={template}
                    className="aspect-[16/10] w-full rounded-[8px] lg:aspect-square lg:h-full lg:w-auto lg:shrink-0"
                  />
                  <div className="mt-5 min-w-0 lg:mt-0">
                    <h3 className="type-h4 text-foreground lg:type-body">
                      {template.title}
                    </h3>
                    <p className="type-body mt-1.5 text-muted-foreground lg:type-caption">
                      {template.description}
                    </p>
                  </div>
                </button>
              </div>
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
