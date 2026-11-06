"use client";

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
    image: {
      src: "/images/solutions/accounting-desk.webp",
      alt: "An accountant at a desk",
    },
  },
  {
    label: "Marketing agencies",
    slug: "marketing-agency-client-portal",
    blurb: "Briefs and approvals",
    image: {
      src: "/images/mocks/describe-sneakers.webp",
      alt: "Someone talking in a sunlit sitting room",
    },
  },
  {
    label: "Consulting",
    slug: "consulting-client-portal",
    blurb: "Scopes and invoices",
    image: {
      src: "/images/mocks/describe-laptop.webp",
      alt: "Someone reading at a laptop in afternoon light",
    },
  },
  {
    label: "Law firms",
    slug: "law-firm-client-portal-practice-management",
    blurb: "Intake and signatures",
    image: {
      src: "/images/mocks/sign-in-bg.jpg",
      alt: "Someone working at a desk",
    },
  },
  {
    label: "Real estate",
    slug: "real-estate-property-management-rental-management-client-portal",
    blurb: "Paperwork and payments",
    image: {
      src: "/images/mocks/hosted-mvp-bg.jpg",
      alt: "A room in daylight",
    },
  },
  {
    label: "Design studios",
    slug: "designer-client-portal",
    blurb: "Proposals and reviews",
    image: {
      src: "/images/mocks/crm-bg.webp",
      alt: "A designer at work",
    },
  },
  {
    label: "Startups",
    slug: "startups-client-portal",
    blurb: "Onboarding and support",
    image: {
      src: "/images/mocks/public-store-bg.jpg",
      alt: "Two people reviewing a screen together",
    },
  },
  {
    label: "Freelancers",
    slug: "freelancer-client-portal",
    blurb: "Contracts and payments",
    image: {
      src: "/images/mocks/describe-phone.webp",
      alt: "Someone holding a phone on a sofa",
    },
  },
  {
    label: "Small business",
    slug: "small-business-smb-client-portal",
    blurb: "Documents and payments",
    image: {
      src: "/images/mocks/support-desk.webp",
      alt: "Someone at a support desk",
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
                  // THE CARD IS THE PICTURE, with the name written across its
                  // foot. It used to be a name in a bar with a picture hanging
                  // under it, which made each card two stacked blocks in two
                  // tones rather than one object — and in a grid of nine that
                  // is eighteen things to look at. One frame, one subject, the
                  // name on it.
                  //
                  // A SOFT SHADOW ON HOVER, NOT A BRIGHTER BORDER. Lifting the
                  // border to white on hover drew a hard ring around the card,
                  // which in dark is the brightest thing in the section and
                  // reads as a selection rather than as a pointer resting on
                  // something. Depth says the same thing without a line: the
                  // card lifts a little and its picture moves under the frame.
                  className="group relative block aspect-[3/4] overflow-hidden rounded-xl border border-border shadow-[0_0_0_0_rgba(16,24,40,0)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgba(16,24,40,0.45)] sm:aspect-[4/3] [[data-theme=dark]_&]:border-transparent [[data-theme=dark]_&]:hover:shadow-[0_12px_32px_-14px_rgba(0,0,0,0.85)]"
                >
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
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    />
                  ) : (
                    // The slot keeps the card's shape while an industry is
                    // still without a shot, so dropping real pictures in later
                    // cannot move the grid.
                    <span aria-hidden className="absolute inset-0 bg-muted" />
                  )}
                  {/* THE NAME'S OWN GROUND. The type is white in both themes —
                    it is written on a photograph, not on the page — so it
                    needs the foot of the picture settled under it whatever
                    the shot turns out to be. It deepens slightly on hover,
                    with the lift, rather than switching colour. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,12,16,0.86)_0%,rgba(10,12,16,0.55)_30%,rgba(10,12,16,0.12)_62%,transparent_100%)] transition-opacity duration-300 group-hover:opacity-90 motion-reduce:transition-none"
                  />
                  <span className="absolute inset-x-0 bottom-0 p-3.5">
                    <span className="block text-sm text-white">
                      {industry.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-white/70">
                      {industry.blurb}
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
