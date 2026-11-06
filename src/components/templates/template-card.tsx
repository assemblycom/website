"use client";

import Link from "next/link";
import type { Template } from "@/lib/templates";
import { V69CardMock } from "@/components/home/hero-v71";
import { useTheme } from "@/components/theme/theme-provider";
import { MockFit, MOCK_DESIGN_SIZE } from "@/components/templates/mock-fit";
import { cn } from "@/lib/utils";

// Covers whose own fill runs dark all the way to the card edge. The frame's
// hairline and inner highlight are both light, so on those cards they drew a pale
// outline across the dark area instead of disappearing into it; the dark fill
// already defines the card's edge, so the overlay is dropped entirely.
const BLEED_COVERS = new Set(["design-approvals"]);

/**
 * One template card: the widget cover, the name, and the line under it. The
 * /templates gallery and a detail page's Works with row both render this, so
 * the two can't drift into two drawings of the same card.
 *
 * `chip` is the site's standard tag chip under the text, for a row that needs
 * to say something about a card (the Works with row marks internal-only apps).
 */
export function TemplateCard({
  template,
  chip,
  className,
}: {
  template: Template;
  chip?: string;
  className?: string;
}) {
  // Widget covers (shared with the home hero) reskin to the dark surface.
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <article className={cn("w-full", className)}>
      {/* Its own focus ring rather than the global outline fallback:
        that one is full-strength foreground with square corners, so on
        a rounded cover it landed as a hard black box around the card
        and its caption. Same weight and tint as the filter chips and
        the arrows. Drawn on the cover rather than on the whole link:
        around the link it enclosed the caption too, and a two-line
        description ran right into it. */}
      <Link
        href={`/templates/${template.slug}`}
        className="group/card block outline-none"
      >
        {/* Real preview image when set; otherwise the template's widget
          cover mock (shared with the home hero). */}
        {/* Square at every width: the widgets are drawn square, and the
          old 5/4 mobile frame cropped the bottom off the taller ones. */}
        {/* The outline is drawn OVER the cover, not as a border on the
          frame. A border takes a pixel of layout, so the widget could
          only ever fill the content box and stopped 1px short of the
          edge — with the card's white ground under a 60%-opacity
          hairline, that pixel read as a pale gap rather than an outline
          hugging the colour. No border means the cover fills the whole
          square and the hairline sits on its outermost pixel.
          It can't live inside MockFit: `.template-mock-fit > *` sizes
          and scales every direct child to the design size. */}
        <div className="relative rounded-[14px] transition-shadow group-focus-visible/card:ring-2 group-focus-visible/card:ring-foreground/40 group-focus-visible/card:ring-offset-4 group-focus-visible/card:ring-offset-background sm:rounded-[20px]">
          <MockFit
            className={`relative aspect-[16/10] overflow-hidden rounded-[14px] bg-background sm:aspect-square sm:rounded-[20px] [[data-theme=dark]_&]:bg-[#151515] ${MOCK_DESIGN_SIZE[template.slug] ?? ""}`}
          >
            {/* template-mock-gallery marks this rail specifically — a few
              covers are skinned for the gallery alone, and .template-mock
              by itself would carry those into the proposal page's mocks
              too. */}
            <div
              className={`template-mock template-mock-gallery [font-family:var(--font-inter),system-ui,sans-serif] ${
                dark ? "v72-mock-dark" : ""
              }`}
            >
              <V69CardMock slug={template.slug} />
            </div>
          </MockFit>
          {!BLEED_COVERS.has(template.slug) && (
            <div
              aria-hidden
              // One hairline and nothing else. It used to also carry a 1px
              // white inner ring: invisible on the pale mocks, but a bright
              // second line on the dark ones, so the rail looked like it had
              // two different border weights in it. The two soft dark insets
              // went the same way — on the warm light covers they shaded the
              // widget's own ground and read as a vignette rather than as
              // depth. Light only: the dark surface has no hairline to catch
              // a highlight.
              className="pointer-events-none absolute inset-0 rounded-[14px] border border-border/45 sm:rounded-[20px] [[data-theme=dark]_&]:border-transparent"
            />
          )}
        </div>
        {/* Card text on the site's own steps: body for the name, caption
          for the line under it. Both sit at 400 — the name reads as the
          heading through colour and the space above it, not weight.
          The category tag that used to close the card is gone: it was
          the only uppercase on the page, and the row it sat on was most
          of what made the grid feel packed. The filter tabs above
          already say which category you're looking at. */}
        <h3 className="type-body mt-4 text-foreground">
          {template.title}
        </h3>
        {/* Two lines are reserved whether or not the line under the name needs
            them. Grid cells stretch to the tallest in their row, so a one-line
            description left its own cell short and the whole gap to the next
            row read bigger under that card than under its neighbours. 42px is
            two lines of .type-caption (14px at 1.5). */}
        <p className="type-caption mt-1 min-h-[42px] text-muted-foreground">
          {template.description}
        </p>
        {chip && (
          <span className="mt-3 inline-flex rounded-md bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
            {chip}
          </span>
        )}
      </Link>
    </article>
  );
}
