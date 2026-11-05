"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RailArrows } from "@/components/ui/card-rail";

// ─────────────────────────────────────────────────────────────────────────
// INDUSTRIES — the row directly under the hero, so a visitor sees their own
// line of work named before they have scrolled anything.
//
// Round 2 found the shipped message does not win with accounting, finance,
// insurance or legal firms: its extra signups were agencies, consultants and
// coaches. The hero cannot say "accountants" and "agencies" at once without
// going vague, so the specialization claim is made here instead, by naming
// the industries outright and sending each one to the page written for it.
//
// CARDS, NOT CHIPS. The row was a nine-item chip wrap, on the reasoning that
// a grid of tiles would read as nine features rather than as nine ways
// through. In practice the opposite happened: a line of small grey pills
// directly under the hero is the lightest thing on the page, so the one
// section whose job is to let a visitor find their own line of work was the
// one a visitor skimmed past. A card with a picture in it holds the eye long
// enough to be read, and the name still leads.
//
// The picture sits UNDER the name rather than above it. The name is what a
// visitor is scanning for — they are looking for their own trade in a list of
// nine — so it stays on the card's first line where the eye lands, and the
// picture is what makes the card worth stopping at once the name has caught.
//
// THE PICTURES ARE PLACEHOLDERS. `image` is optional and every industry is
// currently without one, so each card draws an empty tinted slot at the size
// and shape the real shot will take. Giving an industry a real picture is
// adding one field to its entry below; nothing else changes.
// ─────────────────────────────────────────────────────────────────────────

interface Industry {
  label: string;
  slug: string;
  /**
   * DRAFT COPY, three or four words, naming what this trade actually runs
   * through the product.
   *
   * It replaced a chevron. The card used to carry one as its "there is a page
   * behind this" mark, which is a thing every card on the page already says by
   * being a card — and it spent the one line under the name saying nothing. A
   * line that names the work tells a visitor whether the page behind it is
   * about them, which is the only question this section asks.
   *
   * ONE LINE, AND SHORT ENOUGH TO STAY ONE. The card is 200px wide in the
   * phone's row, which is about 24 characters at this size — a three-noun
   * list ran to two lines on some cards and one on others, so the captions
   * no longer shared a baseline and the row looked ragged. Two nouns each,
   * and none of these is near the limit.
   *
   * Written here rather than taken from the solution pages: each of those
   * opens on a full paragraph, and none of them has a line this short. Worth
   * a read before this ships.
   */
  blurb: string;
  /** The card's picture. Absent for now, so the card draws its empty slot. */
  image?: { src: string; alt: string };
}

// Ordered by how much of the business each one represents, not alphabetically:
// the first four are the segments the solution pages were written for, and a
// visitor scanning left to right should meet the most likely match first.
const INDUSTRIES: Industry[] = [
  {
    label: "Accounting",
    slug: "accounting-client-portal",
    blurb: "Onboarding and billing",
  },
  {
    label: "Marketing agencies",
    slug: "marketing-agency-client-portal",
    blurb: "Briefs and approvals",
  },
  {
    label: "Consulting",
    slug: "consulting-client-portal",
    blurb: "Scopes and invoices",
  },
  {
    label: "Law firms",
    slug: "law-firm-client-portal-practice-management",
    blurb: "Intake and signatures",
  },
  {
    label: "Real estate",
    slug: "real-estate-property-management-rental-management-client-portal",
    blurb: "Paperwork and payments",
  },
  {
    label: "Design studios",
    slug: "designer-client-portal",
    blurb: "Proposals and reviews",
  },
  {
    label: "Startups",
    slug: "startups-client-portal",
    blurb: "Onboarding and support",
  },
  {
    label: "Freelancers",
    slug: "freelancer-client-portal",
    blurb: "Contracts and payments",
  },
  {
    label: "Small business",
    slug: "small-business-smb-client-portal",
    blurb: "Documents and payments",
  },
];

/** The card's own gap, in px, so a step lands a card on the row's edge. */
const CARD_GAP_PX = 12;
/** A step or a trackpad can leave a fractional scrollLeft; judge the ends loosely. */
const END_SLACK = 2;

export function Industries() {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  // Both start true so a row whose cards all fit never flashes a live pair of
  // arrows before the first measurement corrects them.
  const [atEnd, setAtEnd] = useState(true);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= END_SLACK);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - END_SLACK);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  // One card plus its gap, read off the DOM rather than from the breakpoint,
  // so the step and the cards cannot drift apart if a width changes.
  const step = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const by = (card?.offsetWidth ?? el.clientWidth) + CARD_GAP_PX;
    el.scrollBy({ left: by * direction, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      {/* Heading and links share a row from lg up: the claim is short, and set
          above a nine-item wrap it left a band of empty page between the two
          halves of one sentence. */}
      <div className="grid gap-y-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-x-16">
        <div>
          <p className="type-eyebrow text-muted-foreground">Built for your work</p>
          <h2 className="type-h3 mt-3 text-balance text-foreground">
            Set up for how your industry runs
          </h2>
        </div>
        {/* ONE ROW ON A PHONE, SCROLLED. Two up and five rows deep, nine
            cards with pictures in them were most of a screen on their own —
            a visitor had to go through the whole list to reach the section
            after it, and the one card that mattered to them was as likely to
            be the eighth as the first. A row that runs off the edge says
            "there are more of these" in the height of one card, and the card
            width is set so the next one is always part-visible, which is what
            makes the row read as scrollable without a control saying so.

            The ends are inset by the page gutter and the bleed cancels it, so
            the first card starts on the measure and the last one has room to
            clear it. `scroll-pl-6` is not decoration: a mandatory snap aligns
            a card to the scroll port's own edge, which ignores that padding
            and parked the row 24px in, with the first card flush to the
            screen. Scroll padding is what tells the snap where the measure
            is. The scrollbar is hidden; the snap is what gives the row
            its detents.

            Three up in a grid from sm, where nine divides evenly and the last
            row is never a widow. */}
        <ul ref={railRef} className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-6 px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          {INDUSTRIES.map((industry) => (
            // 200px holds the name on one line for every label here and
            // leaves most of a third card showing at 390. It gives the card
            // back to the grid from sm.
            <li key={industry.slug} className="w-[200px] shrink-0 snap-start sm:w-auto sm:shrink">
              <Link
                href={`/solutions/${industry.slug}`}
                // The card chrome the site already uses for a grid of
                // destinations with a picture in them (see the templates
                // grid), so this is recognisably the same object rather than
                // a tenth kind of tile. `flex flex-col` with the slot last is
                // what lets the picture meet the card's own bottom edge, so
                // the radius cuts the image instead of framing it.
                className="group flex h-full flex-col-reverse justify-end transition-colors hover:[&_.industry-name]:text-foreground sm:flex-col sm:justify-start sm:overflow-hidden sm:rounded-xl sm:border sm:border-border sm:hover:border-foreground/20 sm:[[data-theme=dark]_&]:border-white/15 sm:[[data-theme=dark]_&]:hover:border-white/30"
              >
                {/* UNDER THE PICTURE ON A PHONE, INSIDE THE CARD FROM sm.
                  In a scrolled row the card IS the picture — a name set in a
                  bar across the top of each one turned a row of pictures into
                  a row of headers with pictures hanging off them, and the two
                  tones, surface and slot, made each card read as two stacked
                  blocks rather than one object. Set as a caption below, the
                  row is pictures with their names under them, which is what a
                  row of nine places to go should look like. `flex-col-reverse`
                  is what does it, so the name stays FIRST in the document and
                  the reading order never depends on the layout. */}
                <span className="block pt-2.5 sm:px-3.5 sm:pb-3 sm:pt-3">
                  <span className="industry-name block text-sm text-foreground transition-colors">
                    {industry.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {industry.blurb}
                  </span>
                </span>
                {/* The slot keeps its ratio whether or not there is a picture
                    in it, so dropping real shots in later cannot move the
                    grid. It carries the card's own chrome on a phone, where
                    it IS the card; from sm the chrome moves out to the link
                    and this is flush inside it, with `mt-auto` holding it to
                    the foot of a card whose name wrapped to two lines so
                    every picture in a row starts on the same line. */}
                {/* PORTRAIT ON A PHONE, landscape in the grid. In a scrolled
                    row the card is a 200px column and a 4:3 picture in it is
                    a letterbox — the row read as a strip of wide slots rather
                    than as nine cards. 3:4 fills the column the way the phone
                    holding it is filled, and it is the shape a shot of a
                    person at work wants anyway. The grid keeps 4:3, where the
                    cards are wider than they are tall. */}
                <span className="relative block aspect-[3/4] overflow-hidden rounded-xl border border-border bg-muted sm:mt-auto sm:aspect-[4/3] sm:rounded-none sm:border-0 [[data-theme=dark]_&]:border-white/15">
                  {industry.image ? (
                    <Image
                      src={industry.image.src}
                      alt={industry.image.alt}
                      fill
                      sizes="(min-width: 1024px) 272px, (min-width: 640px) 30vw, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* THE SITE'S OWN STEP ARROWS, from the card rails on the product
            pages — `RailArrows`, the same control, not a second pair drawn to
            match. A row that runs off the edge tells you there is more; the
            arrows are what let someone get at it without guessing that the
            row can be pushed.

            Below sm only: from there the cards are a grid with nothing left
            to step through, and two arrows under a complete set are a control
            that can only ever say no. */}
        <RailArrows
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          atStart={atStart}
          atEnd={atEnd}
          className="mt-6 justify-end sm:hidden"
        />
      </div>
    </section>
  );
}
