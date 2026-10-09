"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CustomerQuote } from "./builder-customer-quotes";

// ─────────────────────────────────────────────────────────────────────────
// CUSTOMER QUOTES, BELOW `md` — the row's expansion, as an accordion.
//
// The stack used to render every card already open: four portraits each with
// a full quote under it, which is five screens of scrolling for a section
// whose job is to say "here are four firms". The row above `md` solves that
// by opening one card at a time; this is the same idea with a tap where the
// pointer is, so the section is one screen on a phone and the quotes are
// still all reachable.
//
// IT IS THE FAQ'S ACCORDION, not a new one. Single-open controlled state, the
// `grid-rows` 0fr → 1fr reveal, `aria-expanded` on a full-width button, and
// the same right-at-rest / down-on-open chevron. See home/faq.tsx — that file
// is where the mechanics are explained, and copying its shape means the two
// tap-to-open lists on the site behave identically.
//
// WHY THE REVEAL IS `grid-rows` AND NOT THE ROW'S `max-height`. The cards
// above animate a quote between 0 and 112px, which works because every quote
// there sets to three lines at an open card's width. Stacked on a phone the
// same four run two to five lines, so a shared clamp would either crop the
// long one or leave a gap under the short one. 0fr → 1fr animates to the
// content's own height without measuring it.
//
// WHY A BUTTON AND NOT THE CARD-AS-LINK. Above `md` the whole card is a
// link and hovering opens it — a pointer can reveal without committing. A tap
// cannot: it is both the hover and the click, so a card that is a link and an
// accordion at once would navigate away from the quote it just opened. The
// row header toggles, and the story is a link inside the opened body, which
// also means the destination is named ("Read the story") rather than being an
// unlabelled whole-card target.
// ─────────────────────────────────────────────────────────────────────────

export function BuilderCustomerQuotesStack({
  quotes,
}: {
  quotes: CustomerQuote[];
}) {
  // Opens on the first entry, which is the rest state the row above `md`
  // shows too — a stack of four closed rows gives a reader nothing to read
  // and no reason to think a tap would do anything.
  //
  // Keyed by firm rather than by index so the open row survives any reorder
  // of the data; `null` is a legal state because tapping the open row closes
  // it, exactly as the FAQ does.
  const [openFirm, setOpenFirm] = useState<string | null>(quotes[0]?.firm ?? null);

  return (
    <ul className="mt-10 flex flex-col gap-3 md:hidden">
      {quotes.map((q) => {
        const open = openFirm === q.firm;
        const panelId = `builder-quote-${q.href.split("/").pop()}`;

        return (
          <li
            key={q.firm}
            // The row's own ground and radius are the card's from the row
            // above, so the two layouts are the same object at two widths.
            // overflow-hidden keeps the reveal inside the rounded corners.
            // `relative` so the story arrow can be positioned against the row.
            // It CANNOT live inside the header: the header is a button, and a
            // link nested in a button is neither valid nor operable. It is a
            // sibling laid over the header's right instead, which also keeps
            // the whole header tappable for the expand.
            className="relative overflow-hidden rounded-xl bg-[var(--surface)]"
          >
            <button
              type="button"
              onClick={() => setOpenFirm((cur) => (cur === q.firm ? null : q.firm))}
              aria-expanded={open}
              aria-controls={panelId}
              // Inset ring, for the same reason the FAQ's row carries one: the
              // card clips its overflow, so an outline drawn outside the
              // button is cropped on every side and the row has no visible
              // focus state at all.
              // pr-14 always, open or closed: the arrow is laid over this
              // corner when the row is open, and reserving the room in both
              // states stops the name reflowing as the card opens.
              className="flex w-full cursor-pointer items-center gap-4 p-4 pr-14 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40"
            >
              {/* 48px, not the row's 72px. Closed, this is a list of four
                  rows that should fit a screen together; the portrait is
                  identifying the speaker here rather than being the card's
                  own image. Same square crop, so the same sources are safe. */}
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted [[data-theme=dark]_&]:bg-white/[0.06]">
                <Image
                  src={q.image}
                  alt=""
                  fill
                  // Declared above the box: object-cover scales by the short
                  // side and a retina screen doubles it again.
                  sizes="120px"
                  quality={90}
                  className="object-cover object-top"
                />
              </div>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] leading-snug text-foreground">
                  {q.name}
                </span>
                <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">
                  {q.firm}
                </span>
              </span>

              {/* NO MARKER IN THE HEADER. The chevron that used to sit here
                  is gone with the "Read the story" line: the open card carries
                  one arrow for both jobs (below), and a closed row carries
                  nothing. A closed row is still tappable — the whole header is
                  the button — it just does not advertise it with a glyph. */}
            </button>

            {/* THE STORY ARROW — the card's only mark, and only while it is
                open. It replaces two things at once: the chevron that marked
                the row, and the "Read the story" line that used to sit under
                the quote. Closed, there is nothing to read yet and so nothing
                to go to; open, the one arrow is the way out to the case study.

                A SIBLING OF THE BUTTON, laid over its right-hand end. The
                header is a <button> and an anchor inside one is neither valid
                nor reliably operable, so the link sits outside it and the
                button keeps a pr-14 well for it to land in.

                ON THE NAME'S LINE, not the portrait's centre. Centring it in
                the 48px portrait row put it at 40px, which is between the two
                lines of the attribution — level with neither, so it read as
                floating. The name's own centre measures 27.7px from the card's
                top (16px padding, the text stack centred in the 48px row, half
                of a 20.6px line), so 28px puts the arrow on the name it
                belongs to and gives the pair a shared axis.

                It is labelled, because an arrow on its own names no
                destination to a screen reader. */}
            {open ? (
              <Link
                href={q.href}
                aria-label={`Read ${q.firm}'s story`}
                className="group/story absolute right-4 top-[28px] flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/40"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="transition-transform duration-200 group-hover/story:translate-x-0.5 motion-reduce:transition-none"
                >
                  <path
                    d="M4.75 10h10.5M10.75 5.5L15.25 10l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : null}

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              {/* Closed, this HAS to be overflow-hidden — that is what
                  suppresses a grid item's automatic minimum size, and without
                  it the 0fr row cannot collapse and every quote stands open.
                  Open, it becomes a clip with a margin so the link's focus
                  outline is not cropped at the edges. min-h-0 keeps the row
                  collapsible while the transition is still running. */}
              <div
                className={`min-h-0 ${open ? "overflow-clip [overflow-clip-margin:6px]" : "overflow-hidden"}`}
              >
                {/* pt-1 is headroom for that focus ring, not spacing. */}
                <div className="px-4 pb-4 pt-1">
                  {/* 17px, where the row above `md` runs 19. Same move — the quote
                      outranks the attribution that opened it — at the size a
                      ~310px phone measure can carry without setting three
                      words to a line. */}
                  <blockquote className="text-[17px] leading-snug text-foreground">
                    “{q.quote}”
                  </blockquote>
                  {/* NO "Read the story" LINE. The quote is the whole body
                      now; the way to the case study is the arrow at the top of
                      the open card, which is the one mark this card carries. */}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
