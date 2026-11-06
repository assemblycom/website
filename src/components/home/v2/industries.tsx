"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { CardRail } from "@/components/ui/card-rail";

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
// The name sits ON the picture, across its foot. It used to be set in a bar
// above it, which made every card two stacked blocks in two tones — a row of
// headers with pictures hanging off them rather than a row of pictures. One
// frame, one subject, the name written on it.
//
// THE PICTURES ARE PLACEHOLDERS, taken from the site's own photography so the
// cards can be judged full rather than empty. They are not shots OF these
// trades; swapping one for a real picture is changing the `image` field on its
// entry below, and nothing else moves.
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
  /**
   * `position` anchors the crop (object-position, and the zoom's origin) for a
   * shot whose subject is off-centre; `zoom` enlarges a figure that sits small
   * in its frame.
   */
  image?: { src: string; alt: string; position?: string; zoom?: number };
}

// Ordered by how much of the business each one represents, not alphabetically:
// the first four are the segments the solution pages were written for, and a
// visitor scanning left to right should meet the most likely match first.
const INDUSTRIES: Industry[] = [
  {
    label: "Accounting",
    slug: "accounting-client-portal",
    blurb: "Onboarding and billing",
    image: {
      src: "/images/mocks/accounting-glasses.jpg",
      alt: "A smiling man in amber glasses and a grey sweater",
      // A tall shot in a wide card: the crop starts just above his head and
      // takes the wall above him, not his hair.
      position: "50% 17%",
    },
  },
  {
    label: "Marketing agencies",
    slug: "marketing-agency-client-portal",
    blurb: "Briefs and approvals",
    image: {
      src: "/images/mocks/marketing-pinboard.webp",
      alt: "A woman in a blue sweater pointing at work pinned to a wall",
      // Anchored near the top so her hair is not cut, and nudged right so the
      // phone's tall crop keeps her and her pointing hand.
      position: "60% 12%",
    },
  },
  {
    label: "Consulting",
    slug: "consulting-client-portal",
    blurb: "Scopes and invoices",
    image: {
      src: "/images/mocks/consulting-suit.webp",
      alt: "A man in a grey suit and green tie",
      // A tall portrait in a wide card: anchored near the top so the crop
      // takes his jacket, not his head.
      position: "50% 5%",
    },
  },
  {
    label: "Law firms",
    slug: "law-firm-client-portal-practice-management",
    blurb: "Intake and signatures",
    image: {
      src: "/images/mocks/law-portrait.webp",
      alt: "A smiling woman in glasses and a lilac shirt",
      // She stands small in a wide frame; zoomed from just above her head.
      position: "50% 5%",
      zoom: 1.35,
    },
  },
  {
    label: "Real estate",
    slug: "real-estate-property-management-rental-management-client-portal",
    blurb: "Paperwork and payments",
    image: {
      src: "/images/mocks/real-estate-agent.webp",
      alt: "A man in a navy shirt in a bright office",
      // Anchored to the top so the crop takes his shirt, not his head.
      position: "50% 0%",
    },
  },
  {
    label: "Design studios",
    slug: "designer-client-portal",
    blurb: "Proposals and reviews",
    image: {
      src: "/images/mocks/design-studio-painter.webp",
      alt: "An artist in an orange top at her desk with paints",
      // A tall shot in a wide card: the crop starts just above her head and
      // takes the shelves above her, not her hair.
      position: "50% 20%",
    },
  },
  {
    label: "Startups",
    slug: "startups-client-portal",
    blurb: "Onboarding and support",
    image: {
      src: "/images/mocks/startups-meeting-close.webp",
      alt: "A woman in a rust turtleneck listening at a meeting table",
      // A tall shot in a wide card: the crop starts just above her head and
      // takes the empty whiteboard, not her.
      position: "50% 15%",
    },
  },
  {
    label: "Freelancers",
    slug: "freelancer-client-portal",
    blurb: "Contracts and payments",
    image: {
      src: "/images/mocks/freelancer-portrait.jpg",
      alt: "A man in clear glasses against a slatted wood wall",
      // A tall portrait in a wide card: framed so his whole head, crown to
      // chin, sits inside the crop.
      position: "50% 35%",
    },
  },
  {
    label: "Small business",
    slug: "small-business-smb-client-portal",
    blurb: "Documents and payments",
    image: {
      src: "/images/mocks/small-business-portrait.webp",
      alt: "A woman in glasses and a blue sweater at her desk",
      // A tall portrait in a wide card: anchored near the top so the crop
      // takes her lap, not her hair.
      position: "50% 5%",
    },
  },
];

/** Long enough to read a card's name and line before the next one arrives. */
const AUTO_ADVANCE_MS = 3500;

export function Industries() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      {/* THE RAILS GO SOFT BEHIND THIS SECTION, IN DARK ONLY. The grid runs
          between nine cards and through the gaps around them, and in dark
          those lines are the brightest thing in the section — drawn at full
          strength across a block whose subject is nine pictures. A small
          backdrop blur keeps the grid present and takes it out of focus, so
          it reads as the surface the cards sit on. Light needs none of it:
          there the rails are ink at 5.5% on white and already sit back. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden [[data-theme=dark]_&]:block [[data-theme=dark]_&]:backdrop-blur-[3px]"
      />
      {/* Heading and links share a row from lg up: the claim is short, and set
          above a nine-item wrap it left a band of empty page between the two
          halves of one sentence. */}
      <div className="relative grid gap-y-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-x-16">
        <div>
          <p className="type-eyebrow text-muted-foreground">
            Built for your work
          </p>
          <h2 className="type-h3 mt-3 text-balance text-foreground">
            Set up for how your industry runs
          </h2>
        </div>
        {/* ONE ROW AT EVERY WIDTH, on the product pages' own rail: drag,
            arrows, and the soft edge where the next card runs off. It was a
            row on a phone and a 3x3 grid from sm, and the grid made nine
            pictures the heaviest block on the page. Three show at a time on
            desktop with the rest a step away. On a phone the card stays 200px,
            narrower than the rail's own cards, so a third still peeks. */}
        <div className="min-w-0">
          {/* Moves on its own so all nine trades pass through the three
              slots without a click. See CardRail's autoAdvanceMs for when
              it holds still. */}
          <CardRail label="Industries" autoAdvanceMs={AUTO_ADVANCE_MS}>
            {INDUSTRIES.map((industry) => (
              // 200px holds the name on one line for every label here and
              // leaves most of a third card showing at 390. From sm the
              // widths are the rail's own: two up, then three from lg.
              <div
                key={industry.slug}
                className="w-[200px] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
              >
                <Link
                  href={`/solutions/${industry.slug}`}
                  // THE PICTURE, THEN ITS NAME UNDER IT. The name used to sit on
                  // the photo over a dark scrim, which darkened every shot to
                  // keep white type legible; below the frame the pictures stay
                  // at full strength and the name reads in the page's own ink.
                  //
                  // Hover pushes the picture in rather than casting a shadow:
                  // the rail clips its row, so a shadow was cut off at the
                  // card's sides and foot.
                  className="group block"
                >
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-xl sm:aspect-[4/3]">
                    {industry.image ? (
                      <Image
                        src={industry.image.src}
                        alt={industry.image.alt}
                        fill
                        sizes="(min-width: 1024px) 272px, (min-width: 640px) 30vw, 45vw"
                        // EAGER, NOT LAZY. Nine cards of 272px sit a screen into
                        // the page, well inside the margin a browser loads lazy
                        // images within — and most of them still did not load,
                        // because the row is a nine-item grid whose cards are the
                        // same size and the observer settles on a few of them.
                        // The result was a section of empty slots with names on
                        // them. Eager rather than `priority`: they should load
                        // without being preloaded ahead of the hero.
                        loading="eager"
                        style={
                          {
                            objectPosition: industry.image.position,
                            transformOrigin: industry.image.position,
                            "--zoom": industry.image.zoom ?? 1,
                          } as CSSProperties
                        }
                        className="object-cover transition-transform duration-500 ease-out scale-[var(--zoom)] group-hover:scale-[calc(var(--zoom)*1.04)] motion-reduce:transition-none"
                      />
                    ) : (
                      // The slot keeps the card's shape while an industry is
                      // still without a shot, so dropping real pictures in later
                      // cannot move the grid.
                      <span aria-hidden className="absolute inset-0 bg-muted" />
                    )}
                  </span>
                  <span className="mt-3 block">
                    {/* The site's eyebrow style (Diatype Mono, caps), so the
                        name reads as a tag on the picture. */}
                    <span className="type-eyebrow block text-foreground">
                      {industry.label}
                    </span>
                  </span>
                </Link>
              </div>
            ))}
          </CardRail>
        </div>
      </div>
    </section>
  );
}
