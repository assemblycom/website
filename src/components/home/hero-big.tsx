import { Fragment } from "react";
import { AppMarkGlyph, type AppMark, type MarkTint } from "./app-marks";
import { SIGNUP_URL, DEMO_URL } from "@/lib/constants";

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

function HeadlineTiles({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center align-[-0.04em]"
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
}: {
  text: string;
  iconAfter?: string;
  iconPair?: boolean;
  iconBefore?: string;
}) {
  const afterAt = iconAfter ? text.indexOf(iconAfter) : -1;
  const beforeAt = iconBefore ? text.indexOf(iconBefore) : -1;

  const tiles = [
    {
      at: afterAt >= 0 ? afterAt + iconAfter!.length : -1,
      tile: (
        <HeadlineTiles>
          <HeadlineTile {...HEADLINE_MARKS[0]} />
          {iconPair && <HeadlineTile {...HEADLINE_MARKS[1]} />}
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

export function HeroBig({
  headline,
  body,
  lines,
  iconAfter,
  iconPair,
  iconBefore,
  signupHref = SIGNUP_URL,
}: {
  headline: string;
  body?: string;
  lines?: string[];
  iconAfter?: string;
  iconPair?: boolean;
  iconBefore?: string;
  /** Signup, carrying the arm. Falls back to the plain CTA URL. */
  signupHref?: string;
}) {
  return (
    <section className="relative -mt-14 bg-white md:-mt-16 [[data-theme=dark]_&]:bg-[#0a0a0a]">
      {/* Sized to its content with a floor under it, not to the viewport. At a
          full 100svh the box stood ~230px taller than the headline, body and
          buttons inside it, and all of that slack sat underneath them — which
          put the numbers band entirely below the fold on a laptop. The floor
          keeps the hero generous on a short viewport; above that it stops
          growing and the band comes up into view. */}
      <div className="mx-auto flex min-h-[calc(68svh-5rem)] max-w-[1200px] flex-col justify-center px-6 pb-16 pt-28 md:px-10 md:pb-20">
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
            // White on dark, not `bg-foreground`. That token resolves to
            // #d9d9d9 there, which next to the nav's own primary a few hundred
            // pixels above reads as a greyed-out version of the same button.
            // The nav uses bg-white/text-neutral-900 on a dark top; this is the
            // same pair, written as a data-theme variant so it is right on the
            // first paint.
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-4 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2 md:px-5 md:py-2.5 [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900"
          >
            Get started
          </a>
          <a
            href={DEMO_URL}
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2 md:px-5 md:py-2.5"
          >
            Book a demo
          </a>
        </div>
      </div>
    </section>
  );
}
