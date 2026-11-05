import { Fragment, type ReactNode } from "react";
import { AppMarkGlyph, type AppMark, type MarkTint } from "./app-marks";
import { APP_URL, SIGNUP_URL, DEMO_URL } from "@/lib/constants";
import { trackHeroCta } from "./hero-experiment";
import { HeroCredibility } from "@/components/home/v2/hero-credibility";

// The "big type" arm of the hero test (see src/lib/hero-variants.ts): oversized
// type with app marks set into the headline, and no prompt box — the ask is the
// pair of buttons underneath.
//
// Ported from the hero prototype. The prototype's rotating-firm toggle did not
// come with it: it was a thing to look at while the layouts were being drawn,
// not one of the test's two factors, and a word that swaps itself would be a
// third variable inside the arm.

/**
 * An app mark on its tile, set into the headline. Sized in em so it scales with
 * the type rather than needing a breakpoint of its own. An overflow-hidden
 * inline-block baselines on its bottom edge, so the tile sits on the text line;
 * an inline-grid would baseline on the glyph inside and hang below the words.
 */
function HeadlineTile({ mark, tint }: { mark: AppMark; tint: MarkTint }) {
  return (
    // The tile is near-black on the light page, which is the contrast it wants
    // there. On the dark page #171717 sits three steps off the #0a0a0a ground
    // and the tile all but disappears, leaving the marks floating on nothing —
    // so dark takes a lighter fill and the tile reads as a surface again.
    <span className="relative inline-block h-[0.78em] w-[0.78em] shrink-0 overflow-hidden rounded-[0.2em] bg-neutral-900 [[data-theme=dark]_&]:bg-neutral-700">
      <span className="grid h-full w-full place-items-center">
        {/* The marks have different proportions, so each fits the same square
            box on its longest side. The box leaves an even inset whichever way
            a mark runs. */}
        <AppMarkGlyph
          mark={mark}
          tint={tint}
          className="h-[0.58em] w-[0.58em]"
        />
      </span>
    </span>
  );
}

/**
 * The three marks the headline carries, in reading order. They are three
 * different apps on purpose: a repeated mark reads as decoration, where three
 * distinct ones read as the product's range.
 */
const HEADLINE_MARKS: { mark: AppMark; tint: MarkTint }[] = [
  { mark: "tasks", tint: "lavender" },
  { mark: "file-sharing", tint: "blue" },
  { mark: "client-portal", tint: "mint" },
];

/**
 * The tiles carry their own spacing rather than sitting between word spaces: a
 * word space at this size is wider than the gap the marks want, and it left the
 * tiles floating away from the words they belong to. One value sets both the
 * gap to the text and the gap inside a pair, so the group reads evenly.
 */
const TILE_GAP = "0.17em";

function HeadlineTiles({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center align-[-0.04em] ${className}`}
      style={{ gap: TILE_GAP, marginInline: TILE_GAP }}
    >
      {children}
    </span>
  );
}

/**
 * The headline, with an app tile set after `iconAfter` and another before
 * `iconBefore`. Both are optional; without them this is just large text.
 */
function BigHeadline({
  text,
  iconAfter,
  iconPair,
  iconBefore,
  iconSplitAfter,
}: {
  text: string;
  iconAfter?: string;
  iconPair?: boolean;
  iconBefore?: string;
  iconSplitAfter?: string;
}) {
  const afterAt = iconAfter ? text.indexOf(iconAfter) : -1;
  const beforeAt = iconBefore ? text.indexOf(iconBefore) : -1;
  // Where the pair's second mark goes once the line has wrapped — see
  // `iconSplitAfter` on HeroBig. Only when this line holds both words.
  const splitAt =
    iconPair && iconSplitAfter && afterAt >= 0
      ? text.indexOf(iconSplitAfter)
      : -1;

  const tiles = [
    {
      at: afterAt >= 0 ? afterAt + iconAfter!.length : -1,
      tile: (
        <HeadlineTiles>
          <HeadlineTile {...HEADLINE_MARKS[0]} />
          {iconPair && (
            // The second mark is drawn twice and one of the two is always
            // hidden: there is no way to move a node between two points in a
            // sentence with CSS, and the pair has to sit together on a line
            // that does not wrap and apart on one that does.
            <span
              className={
                splitAt >= 0 ? "hidden min-[560px]:contents" : "contents"
              }
            >
              <HeadlineTile {...HEADLINE_MARKS[1]} />
            </span>
          )}
        </HeadlineTiles>
      ),
    },
    {
      at: splitAt >= 0 ? splitAt + iconSplitAfter!.length : -1,
      tile: (
        <HeadlineTiles className="min-[560px]:hidden">
          <HeadlineTile {...HEADLINE_MARKS[1]} />
        </HeadlineTiles>
      ),
    },
    {
      at: beforeAt,
      tile: (
        <HeadlineTiles>
          <HeadlineTile {...HEADLINE_MARKS[2]} />
        </HeadlineTiles>
      ),
    },
  ]
    .filter((t) => t.at >= 0)
    .sort((a, b) => a.at - b.at);

  // Each tile takes the text from where the previous one ended up to its own
  // position, so the boundaries are just the tile offsets with a 0 in front.
  // Written this way rather than with a cursor advanced inside the map: a
  // variable reassigned during render is flagged by react-hooks/immutability,
  // and rightly — it only works while the map runs exactly once.
  const starts = [0, ...tiles.map((tile) => tile.at)];

  return (
    <>
      {tiles.map((tile, i) => (
        <Fragment key={tile.at}>
          {text.slice(starts[i], tile.at).trim()}
          {tile.tile}
        </Fragment>
      ))}
      {text.slice(starts[starts.length - 1]).trim()}
    </>
  );
}

/** The hero's primary action. Exported so a second hero layout runs the
 * same control rather than restating its classes. */
export const PRIMARY_CTA =
  "inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-4 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2 md:px-5 md:py-2.5 [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900";

export function HeroBig({
  headline,
  body,
  lines,
  iconAfter,
  iconPair,
  iconBefore,
  iconSplitAfter,
  signupHref = SIGNUP_URL,
  trustSlot,
  roomy = false,
  rating = false,
}: {
  headline: string;
  body?: string;
  lines?: string[];
  iconAfter?: string;
  iconPair?: boolean;
  iconBefore?: string;
  /**
   * The word the pair's SECOND mark moves to once the headline wraps, below
   * md.
   *
   * The lockup is one line on a desktop, so both marks sit together after
   * the first word and read as a pair. On a phone that line breaks, and the
   * pair went with it: two marks crowded onto the end of a short first line
   * with the next word alone underneath. Moving one of them to the end of
   * the wrapped word puts a mark on each line. Opt-in, so the live hero is
   * unchanged.
   *
   * 560, NOT md. The split is only right on a line that has actually
   * wrapped, and this lockup holds one line down to about 550 — so between
   * there and md the two marks were separated across a line that had not
   * broken, which is just a mark adrift at the end of a word. Measured, not
   * picked: the line sets on one row at 560 and on two at 540.
   */
  iconSplitAfter?: string;
  /** Signup, carrying the arm. Falls back to the plain CTA URL. */
  signupHref?: string;
  /**
   * A row of proof under the button pair. See hero-v76's own `trustSlot` — the
   * two heroes take the same slot so a version can hand one row to whichever
   * layout it renders, without knowing which it got.
   */
  trustSlot?: ReactNode;
  /**
   * Opens the hero's own box, for a page that does not run this hero's usual
   * neighbours. See `roomy` on HeroV76, which passes it through.
   *
   * It raises the floor and the insets together rather than only the padding:
   * the box already centres its content (`justify-center`), so a taller floor
   * is what gives the lockup room on both sides of itself instead of pushing
   * it down into the section below.
   *
   * FULL SCREEN, PHONES INCLUDED. The hero gets the first view to itself:
   * with the box at 80svh the next section's heading and half its chips sat
   * under the buttons on a laptop, so the page opened on two things at once
   * and the hero never had a moment of its own. At 100svh the content still
   * centres, it just centres in the whole screen, and the top padding drops
   * to match so the lockup does not slide down with the floor.
   *
   * BUT NOT ON A WIDE DISPLAY. A screen is a good measure of the hero while
   * the screen is a laptop's; at 1920 it is 1080px of box holding 460px of
   * lockup, so the headline floats in the middle of a field with a third of a
   * screen of nothing above it and a third below, and the logo reel that
   * should close the hero is pushed out of view entirely. The box takes its
   * content's own height there instead, with a floor under it — which is what
   * every wide-screen page that reads well does: the column stops growing and
   * the margins take the extra.
   *
   * The phone was left at 80svh and had the same fault for the same reason —
   * the eyebrow of the industries row sat under the buttons. It takes
   * `100svh + 3.5rem` rather than a plain 100svh because the section is
   * pulled up under the fixed bar by -mt-14: at exactly one screen the box
   * ends 56px above the fold and that much of the next section shows through
   * under it. The extra is that pull given back.
   */
  roomy?: boolean;
  /**
   * The G2 line above the headline.
   *
   * Off by default: this hero ships on several pages and the rating belongs
   * to the homepage's argument, not to every one of them. Centred here rather
   * than ranged left as it is in the split hero, because this lockup is
   * centred and the rating is part of it.
   */
  rating?: boolean;
}) {
  return (
    <section className="relative -mt-14 bg-white md:-mt-16 [[data-theme=dark]_&]:bg-[#0a0a0a]">
      {/* Sized to its content with a floor under it, not to the viewport. At a
          full 100svh the box stood ~230px taller than the headline, body and
          buttons inside it, and all of that slack sat underneath them — which
          put the numbers band entirely below the fold on a laptop. The floor
          keeps the hero generous on a short viewport; above that it stops
          growing and the band comes up into view. */}
      <div
        className={`mx-auto flex max-w-[1200px] flex-col justify-center px-6 md:px-10 ${
          roomy
            ? "min-h-[calc(100svh+3.5rem)] pb-24 pt-32 md:min-h-[100svh] md:pb-28 md:pt-32 wide:min-h-[660px] wide:pb-20 wide:pt-28"
            : "min-h-[calc(68svh-5rem)] pb-16 pt-28 md:pb-20"
        }`}
      >
        {/* ABOVE THE CLAIM IT VOUCHES FOR, not under it: a rating read
            before the claim frames the claim — someone else already vouched
            for this — where the same line read after it is a footnote to
            something you have already decided about. Shared with the split
            hero rather than restated, so the two are one object. */}
        {rating ? (
          <div className="mb-1 text-center">
            {/* The count is dropped on a phone here: this hero centres its
                rating over a full-width column, where the line is at its
                longest and nearest the screen's edges. */}
            <HeroCredibility compactOnPhone />
          </div>
        ) : null}
        <h1
          className={`type-display-xl mx-auto text-balance text-center ${lines ? "max-w-none" : "max-w-[16ch]"} text-neutral-900 [[data-theme=dark]_&]:text-white`}
        >
          {lines ? (
            // The lockup's breaks are honoured at every width. They used to be
            // released below md so the browser could re-balance the whole
            // headline — but the balancer has no idea which words belong
            // together, and on "Become an AI-native business" it broke the
            // compound at its own hyphen ("an AI-" / "native"). Each line is a
            // block, so the breaks hold; only `whitespace-nowrap` is held back
            // below md, which lets a line that is too long for a narrow screen
            // wrap inside itself rather than overflow.
            lines.map((line) => (
              // No separating space between lines any more: they were joined
              // inline below md and needed one, and as blocks they do not.
              <span key={line} className="block md:whitespace-nowrap">
                <BigHeadline
                  text={line}
                  iconAfter={iconAfter}
                  iconPair={iconPair}
                  iconBefore={iconBefore}
                  iconSplitAfter={iconSplitAfter}
                />
              </span>
            ))
          ) : (
            <BigHeadline
              text={headline}
              iconAfter={iconAfter}
              iconPair={iconPair}
              iconBefore={iconBefore}
            />
          )}
        </h1>

        {body && (
          <p className="type-lead mx-auto mt-7 max-w-xl text-pretty text-center text-muted-foreground">
            {body}
          </p>
        )}

        {/* Full-width and stacked on a phone, the way a headline this size asks
            for: a pair of small pills under 40px type read as an afterthought,
            and a thumb wants the whole measure. They become the ordinary inline
            pair from sm up. */}
        <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <a
            href={signupHref}
            onClick={() => trackHeroCta("bigtype-primary")}
            // White on dark, not `bg-foreground`. That token resolves to
            // #d9d9d9 there, which next to the nav's own primary a few hundred
            // pixels above reads as a greyed-out version of the same button.
            // The nav uses bg-white/text-neutral-900 on a dark top; this is the
            // same pair, written as a data-theme variant so it is right on the
            // first paint.
            className={`unauth-only ${PRIMARY_CTA}`}
          >
            Get started
          </a>
          {/* Signed-in visitors are never enrolled in the test, so this one
              carries no arm and no tracking. Both ship and `data-authed` picks
              one before paint (see globals.css). */}
          <a href={APP_URL} className={`auth-only ${PRIMARY_CTA}`}>
            Open Assembly
          </a>
          <a
            href={DEMO_URL}
            onClick={() => trackHeroCta("bigtype-demo")}
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2 md:px-5 md:py-2.5"
          >
            Book a demo
          </a>
        </div>

        {trustSlot}
      </div>
    </section>
  );
}
