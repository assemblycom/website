import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────
// CUSTOMER QUOTES — four firms across, for /ai-app-builder only.
//
// The page ran the shared <Testimonials> block: ONE featured story, composed
// editorially — attribution, a large pull quote, a portrait pinned upper-right
// and the stats as a descending bar chart. That composition is still the right
// one where a page is making a single customer's case, which is why this file
// does not touch it. The homepage is unaffected.
//
// This page is making a different claim. Everything above this section argues
// that a firm can describe an app and have it built; the question a reader
// arrives at the bottom with is "who else", and one name answers it less well
// than four.
//
// THE INTERACTION: a row of tall cards at equal width that EXPAND under the
// pointer, the others giving up the width. What the expansion reveals is the
// QUOTE — the portrait is a small square thumbnail in both states and never
// changes size.
//
// It got there the long way round. The picture was the card's background, then
// a full-width band that grew on open, and every version of that had the same
// two faults: the band is wide and the source files are square or 1.79, so
// `object-cover` could only ever show a head; and a picture that changes size
// by 200px leaves a hole in the closed card that no arrangement of the copy
// hides. A fixed thumbnail has neither problem. The reference does the same —
// avatar top-left at one size, quote revealed underneath, attribution at the
// foot — and it is the arrangement that actually survives four cards of
// different quote lengths.
//
// It is pure CSS and there is no state. Every card is `flex-1`, the hovered
// one grows, and because the row is a fixed width the rest are squeezed by
// flexbox on their own. No JS, no measuring, nothing to go wrong on resize —
// and it keeps this a server component.
//
// EVERY QUOTE IS VERBATIM from src/lib/case-studies.ts. They are not re-worded
// to fit the card, and not shortened except where noted on the entry. This
// site already quotes one customer three different ways across three pages,
// which is how a quote stops being a quote.
// ─────────────────────────────────────────────────────────────────────────

type CustomerQuote = {
  quote: string;
  name: string;
  firm: string;
  /** Portrait or firm shot in /public/images/customers. */
  image: string;
  href: string;
};

const QUOTES: CustomerQuote[] = [
  {
    // The first sentence of a two-sentence quote, cut at the full stop. The
    // whole thing runs 282 characters, and the second sentence explains the
    // first rather than extending it ("Instead of duplicating work across
    // systems…"), so the claim survives the cut intact — but it IS a cut, and
    // the full wording is on the case study a click away.
    quote:
      "What excites me is how our partner data collected in Assembly flows directly into our internal quality control processes.",
    name: "Phillip LaRue",
    firm: "Capital One",
    image: "/images/customers/capital-one-hero.jpg",
    href: "/customers/capital-one-luxury-travel",
  },
  {
    // Not the "five to ten years" line the shared Testimonials block runs.
    // That one is a claim about SPEED, which the section above this one has
    // already made twice; this is the same founder on what the apps do once
    // they exist, which a reader at the bottom of this page has not been told.
    quote:
      "I’m already starting to see myself get hours back each week, because there’s less maintenance and fewer things I need to stay on top of. The apps are doing a lot of this themselves.",
    name: "Garrett Leonard",
    firm: "Advertai Marketing",
    image: "/images/customers/advertai-marketing.jpg",
    href: "/customers/advertai-marketing",
  },
  {
    // An outcome with a number in it, so the row is not four statements of
    // how it feels.
    quote:
      "We had more tax returns in the door, ready to start being prepped, earlier than ever this year than in our entire history.",
    name: "Kyle Pearson",
    // "Collective CPA", not the registered "Collective CPA & Advisors" the
    // case study uses. The full name is the only one of the four that wraps to
    // two lines in a closed card, and the "& Advisors" half is the part a
    // reader does not need to know who is speaking. The case study a click
    // away carries the name in full.
    firm: "Collective CPA",
    image: "/images/customers/collective-cpa.jpg",
    href: "/customers/collective-cpa",
  },
  {
    // The one quote on the site that names the alternative this page spends a
    // whole section comparing against — building the portal yourself — which
    // is why it closes the row.
    quote:
      "Assembly saves us from building custom portals from scratch. We can go fast and create lasting value for the businesses we serve.",
    name: "Robert Prochnow",
    firm: "Zen Aegis",
    image: "/images/customers/zen-aegis-hero2.jpg",
    href: "/customers/zen-aegis",
  },
];

export function BuilderCustomerQuotes() {
  return (
    // The measure and rhythm BuilderTemplates uses, so the two sections either
    // side of the divider between them sit on one column.
    <section className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
      <h2 className="type-h3 text-balance">Firms already building</h2>

      {/* BELOW `md` THERE IS NO ROW AND NO EXPANDING.
          Hover is not a thing a phone has, and four cards that only open under
          a pointer would be four faces and no quotes on the device most of
          this page is read on. So the same four entries stack as ordinary
          cards with everything already visible. */}
      <ul
        // ONE CARD IS ALREADY OPEN, and it is the first.
        //
        // A row of four identical closed cards gives a reader nothing to read
        // and no reason to think anything would happen if they moved the
        // pointer. Opening one states the pattern: this is what a card does.
        //
        // `&:not(:hover)` is doing the work, and the `:not` is why this needs
        // no state and no specificity fight. The default-open rules apply only
        // while the pointer is OUTSIDE the row, so they can never compete with
        // the `hover:` rules on an individual card — the moment the row is
        // hovered they all switch off together and the hovered card is the
        // only thing growing.
        className="mt-10 flex flex-col gap-4 md:mt-12 md:h-[400px] md:flex-row md:gap-3 md:[&:not(:hover)>li:first-child]:grow-[3] md:[&:not(:hover)>li:first-child_blockquote]:mt-5 md:[&:not(:hover)>li:first-child_blockquote]:max-h-28 md:[&:not(:hover)>li:first-child_blockquote]:translate-y-0 md:[&:not(:hover)>li:first-child_blockquote]:opacity-100"
      >
        {QUOTES.map((q) => (
          <li
            key={q.firm}
            // THE EXPANSION, in one declaration.
            //
            // Every card is flex-1 — four equal columns. The hovered card's
            // grow factor goes to 3, so it takes three shares of the row's
            // free space against its neighbours' one, and flexbox takes the
            // difference out of them without anything being told to shrink.
            // `focus-within` does the same for a keyboard: the card is a link,
            // so tabbing to it opens it exactly as hovering does.
            //
            // The transition is on `flex-grow` alone. Animating `width` or
            // `flex-basis` here would fight the row's own sizing on resize;
            // the grow factor is a pure ratio and interpolates cleanly.
            //
            // A NEUTRAL CARD. --surface is the ground the pillar cards above
            // already use, so the row is the page's own material with pictures
            // set into it and every ink on it is an ordinary token.
            className="group overflow-hidden rounded-xl bg-[var(--surface)] p-5 transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:min-w-0 md:flex-1 md:hover:grow-[3] md:focus-within:grow-[3]"
          >
            <Link href={q.href} className="flex h-full flex-col">
              {/* THE THUMBNAIL IS ONE SIZE IN BOTH STATES.
                  72px square, top-left, `shrink-0` — it does not grow with the
                  card and it is not tied to the card's width. That is the
                  whole reason the crop is safe: a square box takes a square
                  source (collective-cpa, zen-aegis) whole and a 1.79 one
                  (capital-one, advertai) with a trim off each side, which a
                  centred studio portrait survives. Nothing here is ever asked
                  to show a head-and-shoulders photograph in a wide band. */}
              <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-muted [[data-theme=dark]_&]:bg-white/[0.06]">
                <Image
                  src={q.image}
                  alt=""
                  fill
                  // Declared well above the 72px box: object-cover scales by
                  // the short side, and a retina screen doubles it again. The
                  // shared Testimonials portrait documents the same trap.
                  sizes="160px"
                  quality={90}
                  className="object-cover object-top"
                />
              </div>

              {/* THE QUOTE, which is what opening the card is FOR.
                  It takes NO HEIGHT when the card is closed — max-height and
                  its top margin both go to zero — so a closed card is a
                  thumbnail with a name under it and nothing is reserved for a
                  sentence that is not showing.
                  112px open is four lines at 15/1.53; the longest of these
                  four sets to three at the width an open card has, so the
                  clamp is headroom rather than a crop. */}
              <blockquote className="overflow-hidden text-[15px] leading-relaxed text-foreground transition-[max-height,opacity,margin,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:mt-0 md:max-h-0 md:translate-y-1 md:opacity-0 md:group-hover:mt-5 md:group-hover:max-h-28 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:mt-5 md:group-focus-within:max-h-28 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 max-md:mt-5">
                “{q.quote}”
              </blockquote>

              {/* THE ATTRIBUTION SITS AT THE FOOT, in both states, so the
                  slack a closed card has collects in one place — between the
                  copy and the name — rather than being split around it.
                  Name in the reading face, firm under it in the muted step. It
                  wraps rather than truncating: a closed card is 189px and this
                  is its only copy, so an ellipsis would cut the two things the
                  card exists to say. */}
              <div className="mt-auto shrink-0 pt-6">
                <p className="min-w-0 text-balance text-[15px] leading-snug text-foreground">
                  {q.name}
                </p>
                <p className="mt-1 text-balance text-[15px] leading-snug text-muted-foreground">
                  {q.firm}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
