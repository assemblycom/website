import Link from "next/link";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { Reveal } from "@/components/ui/reveal";
import {
  ApprovalsMock,
  CustomDomainMock,
} from "@/components/client-portal/segment-mock";
import { BrandedLoginScreen } from "@/components/comparison/branded-login-hero-visual";
import {
  CustomerLogo,
  hasCustomerLogo,
} from "@/components/customers/customer-logos";
import { SIGNUP_URL } from "@/lib/constants";

/**
 * Section 5 of handoff v2: the portal becomes yours three ways — your brand,
 * the apps in the sidebar, and your own domain.
 *
 * This is also the target of the problem section's jump link, which is why it
 * takes an `id`.
 *
 * EACH CARD OPENS ON ITS OWN CLAIM. The handoff writes the three as a short
 * sentence followed by its detail ("Make it look like your firm. Your logo,
 * images, colors…"), so the first sentence is the card's title and the rest is
 * its body. Splitting them in the data rather than rendering one blob keeps the
 * three titles scannable down the row, which is the whole reason the section is
 * three cards and not a paragraph.
 *
 * THE THREE SCENES COME FROM THE SEGMENT GRID that handoff v2 retires. V5's
 * own art is marked "Needs design", and these were already drawn for cards of
 * this size, so each slot takes the one that argues nearest to its claim:
 * the branded intake form under "make it look like your firm", the portal
 * sidebar with its apps under "fill the sidebar", and the per-client
 * dashboard under "fully white-label".
 *
 * The third is the loosest fit — a progress chart is not a domain — and it is
 * the first to replace when V5 lands.
 */
const CARDS: {
  title: string;
  body: string;
  visual: React.ReactNode;
  /**
   * The picture's height, as a fixed value (see the note at the render).
   * Per card rather than one constant because the third one sits alone on the
   * second row beside the quote, and at the first row's height that row was a
   * tall gantt next to four lines of type and a great deal of empty card. The
   * two rows do not have to match — they are not read side by side — and only
   * cards within a row need a common height.
   */
  pictureClass?: string;
  /**
   * The card's share of the row, in fifths of a five-column track. Two equal
   * halves made every scene the same width, which is the one thing these
   * three are not: the approvals screen carries a sidebar AND a content pane,
   * the gantt is a wide timeline, and the intake form is a column. A 2/3 split
   * that alternates down the rows gives each one closer to its own
   * proportion, and stops the grid reading as a sheet of identical tiles.
   */
  span?: string;
  /**
   * Inset from the card's right edge instead of bleeding past it. The sign-in
   * is a centred column, so cropping its right side cut into the form rather
   * than suggesting more app beyond the frame. Capped and centred while the
   * card is full width, so the form keeps a sign-in's proportions.
   */
  contained?: boolean;
  /**
   * Fades the window out where it is cropped, so it blends into the card
   * rather than stopping on a cut edge.
   */
  fadeClass?: string;
}[] = [
  {
    title: "Make it look like your firm",
    body: "Your logo, images, colors, and typography on every screen, down to the sign-in page clients see first.",
    // THE SIGN-IN, because the copy names it: "down to the sign-in page
    // clients see first". It drew an onboarding FORM, which is a screen deep
    // inside the portal and carries no branding at all beyond an avatar — the
    // one card about the firm's logo and colours was illustrated with neither.
    //
    // `brand` puts the firm's colour on the mark and the button, which is the
    // "colors" half of the claim. Without it the screen is the same neutral
    // black-and-white one the comparison page shows, and the card would again
    // be making its point in words only.
    // quietFoot off: that default is for a card that ramps this screen's
    // foot, and this one shows the whole button — where an unlabelled slab is
    // just a coloured rectangle.
    // frame={false}: the card's picture box below already draws the
    // window — hairline, radius and .mock-edge — so a screen that frames
    // itself puts a second one a pixel inside it.
    visual: <BrandedLoginScreen brand quietFoot={false} frame={false} />,
    span: "lg:col-span-2",
    contained: true,
    fadeClass: "[mask-image:linear-gradient(to_bottom,#000_78%,transparent)]",
  },
  {
    title: "Fill the sidebar with the apps your firm needs",
    body: "Install or tailor apps in one click, or build a completely custom app with AI.",
    visual: <ApprovalsMock />,
    span: "lg:col-span-3",
  },
  {
    title: "Fully white-label",
    body: "Your own custom domain, emails from your address, and no mention of Assembly. On Professional and up.",
    // The firm's host in a browser bar, over the firm's own portal. It drew a
    // Gantt chart, which the note at the top of this file already flagged as
    // the loosest fit in the section — a progress chart is not a domain. See
    // CustomDomainMock.
    visual: <CustomDomainMock />,
    pictureClass: "h-[200px] md:h-[240px]",
    fadeClass: "[mask-image:linear-gradient(to_right,#000_70%,transparent)]",
    span: "lg:col-span-3",
  },
];

/** The Sargent CPAs quote, which is this section's claim in a customer's words. */
const QUOTE = {
  text: "When clients log into the portal, they see our branded colors and our logos. They feel like it’s a safe, trusted place, with custom features in the side menu that are exactly what we need for our clients.",
  attribution: "Anthony Drozd, Operations Manager, Sargent CPAs",
  href: "/customers/sargent-cpa",
  /** Whose mark heads the card. Keyed to CUSTOMER_LOGO_SPECS. */
  slug: "sargent-cpa",
};

export function PortalCustomizations({
  id,
  heading = "Customize everything, from your brand to your apps",
  // The handoff writes this as a one-line lead plus a separate support line
  // under the cards. Both say what the section customizes, so split they read
  // as the same claim made twice, a grid apart.
  //
  // Joined whole it ran to three lines, so it is cut to two: what is yours,
  // and what a new app inherits. The plan boundary that closed it moved onto
  // the white-label card, which is the card it actually bounds — a custom
  // domain and badge removal are exactly what that one offers.
  body = "Your logo, colors, and domain on every screen. New apps inherit your brand, logins, and permissions, and you choose which apps each client sees.",
  cards = CARDS,
  quote = QUOTE,
  cta = { label: "Describe your first app", href: SIGNUP_URL },
}: {
  id?: string;
  heading?: string;
  body?: string;
  cards?: typeof CARDS;
  // `slug` keys the mark over the quote; optional, so a page passing its own
  // quote with no logo on file simply gets the card without a tile.
  quote?: {
    text: string;
    attribution: string;
    href: string;
    slug?: string;
  };
  cta?: { label: string; href: string };
} = {}) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24"
    >
      <Reveal>
        {/* Heading, copy, then the way in — the shape the templates section
            above and the stack section below both use, so the page's section
            heads agree.

            The lead carries what used to be a separate support line under
            the cards. It qualifies all three of them (what a new app
            inherits, per-client visibility, which plan the domain is on), and
            read after the grid it landed as a footnote to a section that had
            already finished. */}
        <div className="max-w-2xl">
          <h2 className="type-h2 text-balance">{heading}</h2>
          <p className="mt-4 text-pretty text-muted-foreground">{body}</p>
          {cta ? (
            <a href={cta.href} className={`mt-6 ${QUIET_BUTTON}`}>
              {cta.label}
            </a>
          ) : null}
        </div>

        {/* TWO UP, TWO DOWN. Three across made each card a narrow column, and
            these scenes are wide — the picture was the first thing to suffer
            for it. On a two-column grid each card is half the measure rather
            than a third, so the same scene lands about 50% larger and the
            captions stop setting to three short lines.

            That leaves a fourth cell under the third card, and the quote
            takes it. It was a loose figure below the grid before, which put
            the section's proof after its support line and left the row
            visibly one card short. As the fourth card it closes the grid and
            reads as part of the set.

            The tinted pad is the same object the rest of the page's cards
            use — same radius, same ground — so the set reads as one family. */}
        <div className="mt-12 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.title}
              // min-w-0 AND overflow-hidden, both load-bearing. These scenes
              // are drawn around 580px wide, and a grid item defaults to
              // `min-width: auto` — it refuses to shrink below its content's
              // min-content width. So on a phone each card grew to the width
              // of the mock inside it, ran off the viewport, and took its own
              // caption with it: the body copy was clipped mid-sentence while
              // the page itself reported no horizontal overflow, because an
              // ancestor was hiding it. min-w-0 lets the card take the
              // column's width; overflow-hidden is then what crops the scene
              // to it, and the crop is the intended treatment anyway.
              className={`flex min-w-0 flex-col overflow-hidden rounded-3xl bg-[var(--surface)] p-6 md:p-8 ${card.span ?? "lg:col-span-2"}`}
            >
              {/* COPY FIRST, PICTURE UNDER IT. The scene used to sit on top
                  with the caption beneath, which put the three titles on a
                  different line in each card — they are one, two and one line
                  long — and left the reader meeting a screenshot before being
                  told what it was. Above, the titles line up across the row
                  and each scene illustrates a claim already made.

                  max-w-md on the body so the measure stays readable at the
                  card's full width. */}
              <p className="text-base leading-snug text-foreground">
                {card.title}
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {card.body}
              </p>

              {/* The scene, cropped by the card rather than fitted into it.
                  It bleeds to the card's right edge AND its foot, so it reads
                  as a window onto an app that continues past the frame —
                  the same treatment and the same `.mock-edge` these carried in
                  the grid they come from.

                  THE SCENE'S HEIGHT IS FIXED, AND THE SLACK SITS ABOVE IT.
                  A min-height here does not do what it looks like it does: a
                  flex column still takes its intrinsic height from its
                  content, so the mock's own height set the card's and the
                  min-height never bound anything — the second row came out
                  taller than the first however low that number went.

                  So the picture is a fixed height, and the box around it
                  flexes with `justify-end` instead. Where the grid stretches a
                  card to match its neighbour (the titles are one, two and one
                  line), the extra falls between the copy and the picture, and
                  the picture stays flush with the card's foot where the bleed
                  needs it. */}
              <div
                className={`-mb-6 mt-6 flex min-h-0 flex-1 flex-col justify-end overflow-hidden md:-mb-8 md:mt-8 ${card.contained ? "" : "-mr-6 md:-mr-8"}`}
              >
                <div
                  className={`shrink-0 overflow-hidden ${card.pictureClass ?? "h-[300px] md:h-[380px]"} ${card.contained ? "mx-auto w-full max-w-[440px] lg:max-w-none" : ""}`}
                >
                  <div
                    className={`mock-edge h-full overflow-hidden border-l border-t border-[var(--mock-line)] bg-[var(--mock-window)] ${card.contained ? "rounded-t-xl border-r" : "rounded-tl-xl"} ${card.fadeClass ?? ""}`}
                  >
                    {card.visual}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* THE FOURTH CARD IS THE QUOTE. No picture, so the quote itself
              takes the space one would have had and sets at lead size — it is
              the card's content rather than a caption under something else.
              The attribution is pinned to the foot with mt-auto so it lands
              on the same line as the other cards' captions. */}
          {quote ? (
            <figure className="flex min-w-0 flex-col rounded-3xl bg-[var(--surface)] p-6 md:p-8 lg:col-span-2">
              {/* Ranged top, with the other cards' copy. This one has no
                  picture, so the slack it would have taken collects under the
                  quote instead; the attribution is pinned to the foot so the
                  card still closes on the same line as its neighbour. */}
              {/* THE FIRM'S MARK, in a square tile over the quote.
                  This card is the only one in the row with no picture, and it
                  opened cold on a sentence in quotation marks — the reader
                  learned whose words they were at the foot, after reading
                  them. The mark says it first, and it gives the card the same
                  "something, then copy" shape its three neighbours have.

                  A SQUARE TILE rather than the bare wordmark: these marks are
                  drawn to their own proportions, and set loose on the card a
                  wide one and a stacked one read as two different sizes of
                  heading. A fixed box with the mark contained inside it is how
                  the logo row below already handles the same problem.

                  On --background rather than the card's own --surface, so the
                  tile reads as a thing set INTO the card instead of a patch of
                  it; the hairline keeps its edge when a mark is light. */}
              {quote.slug && hasCustomerLogo(quote.slug) ? (
                <div className="mb-6 flex size-14 shrink-0 items-center justify-center rounded-xl bg-background p-3 text-foreground ring-1 ring-black/[0.06] [[data-theme=dark]_&]:ring-white/10">
                  <CustomerLogo slug={quote.slug} fit />
                </div>
              ) : null}
              <blockquote className="type-lead text-pretty text-foreground">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <figcaption className="type-caption mt-auto pt-8 text-muted-foreground">
                <Link
                  href={quote.href}
                  className="transition-colors hover:text-foreground"
                >
                  {quote.attribution}
                </Link>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
