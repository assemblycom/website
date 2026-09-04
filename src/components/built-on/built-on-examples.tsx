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
const SURFACE = "bg-muted";

/**
 * The whole card is the hit area, so the whole card is what fills on hover, not
 * the image inside it.
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
  "group -mx-4 w-[calc(100%+2rem)] cursor-pointer rounded-2xl p-4 text-left transition-colors outline-none hover:bg-muted/55 focus-visible:ring-2 focus-visible:ring-foreground/40";

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

  return (
    <section className="py-20 md:py-28">
      {/* The site's content column: capped to the 1200px rail width with the
          standard 40px inset, so the heading's left edge lands where every
          other section's does rather than out at the viewport gutter. */}
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <h2 className="type-h2 max-w-xl text-balance text-foreground">
          {heading}
        </h2>

        <div className="mt-12 grid items-start gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <button
              type="button"
              onClick={() => show(lead)}
              aria-label={`${lead.title} details`}
              className={`block ${CARD}`}
            >
              <div
                aria-hidden
                className={`aspect-[16/10] rounded-[16px] ${SURFACE}`}
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
          <div className="flex flex-col gap-2 lg:col-span-5">
            {rest.map((template) => (
              <div key={template.slug}>
                <button
                  type="button"
                  onClick={() => show(template)}
                  aria-label={`${template.title} details`}
                  className={`flex items-center gap-5 ${CARD}`}
                >
                  <div
                    aria-hidden
                    className={`size-24 shrink-0 rounded-[12px] sm:size-28 ${SURFACE}`}
                  />
                  <div className="min-w-0">
                    <h3 className="type-body text-foreground">
                      {template.title}
                    </h3>
                    <p className="type-caption mt-1.5 text-muted-foreground">
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
          plainPreview
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
