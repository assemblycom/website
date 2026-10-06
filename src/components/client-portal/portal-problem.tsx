"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import {
  GenericPortalMock,
  IntakeAppMock,
} from "@/components/client-portal/segment-mock";

/**
 * The pain the established operator already feels.
 *
 * The strongest hook in the customer data is not "I have no portal", it is "the
 * portal I have almost fits" — rigidity and missing features are the top two
 * cancellation reasons across the category. So the section names that, and sets
 * up the two-part answer: ready-made apps, then the builder.
 *
 * The picture runs the full rail with the quote under it, rather than the two
 * sharing a row. It is a comparison of two screens, and a comparison squeezed
 * into half a rail is two thumbnails: the screens were drawn at 8px type to
 * fit. Full width they are the same chrome every other screen on this page
 * runs.
 *
 * The Capital One quote that closed the section is out for now. The page
 * already carries three peer quotes in PortalProof, and a fourth here made
 * the section end on testimony rather than on the picture that is its
 * argument.
 *
 * The screens sit in one tray and run off its bottom edge, so the pair reads as
 * two windows onto the same idea rather than two framed pictures.
 */

/** Both columns' copy, above the screen each one describes. */
const SIDES: { label: string; body: string }[] = [
  {
    label: "Almost fits",
    body: "The portal you bought has the apps it has. Everything your firm actually does lives in tabs beside it.",
  },
  {
    label: "Fits",
    body: "Not a feature request in someone's queue. An app in your sidebar, named for the job your firm actually does.",
  },
];

/**
 * A screen in the tray.
 *
 * The two overlap rather than sitting in two columns: side by side they were
 * two pictures with a gutter between them, which reads as two products. Laid
 * over each other they read as one portal seen twice — the same window, once
 * before and once after — and the overlap gives the pair depth without any of
 * it being drawn in perspective.
 *
 * Each one is wider than half the tray, so the pair still fills it. The front
 * screen carries the shadow, because that is the only thing saying which of
 * them is in front; the back one is held back in opacity and desaturated,
 * which says which of them is the past.
 *
 * Picking is the hover: the picked screen's own frame draws up, and it comes
 * to the front. Nothing is clickable — it answers the pointer and that is all
 * it does.
 */
/**
 * The lift the front screen carries, cast on the side where the two actually
 * overlap.
 *
 * It used to be one leftward shadow on whichever screen was selected, which is
 * right for the second screen — it slides left over the first, so its left edge
 * is the one standing proud. On the FIRST screen that same shadow fell away
 * into empty page: the edge doing the covering is its right one, so the screen
 * came forward with nothing under it to say so, and the pair read flat exactly
 * half the time.
 *
 * Kept soft: wider blur, more negative spread and roughly half the ink it
 * carried at first. The lift only has to say which screen is in front, and at
 * full strength it was a dark band down the seam between them.
 *
 * Both strings are written out whole because Tailwind scans source for complete
 * class names and cannot see one assembled from parts.
 */
const LIFT_RIGHT =
  "shadow-[22px_0_48px_-26px_rgba(16,24,40,0.16),0_2px_8px_-4px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:shadow-[22px_0_48px_-26px_rgba(0,0,0,0.5)]";
const LIFT_LEFT =
  "shadow-[-22px_0_48px_-26px_rgba(16,24,40,0.16),0_2px_8px_-4px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:shadow-[-22px_0_48px_-26px_rgba(0,0,0,0.5)]";

function Screen({
  selected,
  overlaps,
  onSelect,
  children,
}: {
  /** The one in front: full colour, shadowed, and at rest height. */
  selected: boolean;
  /** The second of the pair, which slides left over the first. */
  overlaps?: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      // Pointing at a screen picks it, and it stays picked until the other one
      // is pointed at. It used to be a plain :hover, which meant the moment the
      // pointer left, whatever you had raised dropped back behind — you could
      // never actually look at the screen you had just brought forward.
      //
      // The step follows the stack, not the screen. Whichever is selected sits
      // at rest; the other drops a few pixels. With both tops on the same line
      // the pair read as one wide window split down the middle, and with the
      // step pinned to one side the screen you had just raised sat lower than
      // the one behind it, so the depth read backwards.
      //
      // A transform, not a margin. A margin pushed the tray 12px taller, which
      // lifted BOTH screens off its bottom edge — and the screens running off
      // that edge is the whole point of the picture. A transform moves them
      // without touching the layout, so the tray keeps measuring one screen's
      // height and the stepped one is simply clipped further down.
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onSelect}
      className={`group relative w-[62%] shrink-0 cursor-default transition-transform duration-200 motion-reduce:transition-none ${
        overlaps ? "-ml-[24%]" : ""
      } ${selected ? "z-10" : "translate-y-2 md:translate-y-3"}`}
    >
      {/* Hovering lights the screen's OWN border rather than drawing a second
          line around it. There used to be a separate layer at -inset-1 carrying
          the state, which sat 4px off the frame on three sides and read as a
          halo bounding the screen rather than as the screen itself being
          picked — two edges where the picture has one. The frame is already a
          border on three sides, so the state is a colour on it.

          It is group-hover rather than React state, so the lit edge lasts
          exactly as long as the pointer is on the screen. The SELECTION still
          persists — whichever screen you last pointed at stays in front, which
          is the whole reason this is not a plain hover — but a frame left lit
          on a screen nobody is pointing at reads as a control waiting to be
          used rather than as the picture at rest.

          The frame is opaque whichever screen is in front. The dimming used to
          sit here, which made the whole screen translucent — so whenever it
          came forward you could read the other one straight through it. It is
          on the layer inside now, over a ground that hides whatever is
          behind. */}
      <div
        className={`h-[300px] overflow-hidden rounded-t-xl border-l border-r border-t border-border bg-background transition-colors duration-200 group-hover:border-foreground/30 motion-reduce:transition-none md:h-[400px] [[data-theme=dark]_&]:border-[#383838] [[data-theme=dark]_&]:group-hover:border-white/35 ${
          selected ? (overlaps ? LIFT_LEFT : LIFT_RIGHT) : ""
        }`}
      >
        {/* Desaturated and held back in opacity rather than drawn in a second
            set of greys: a muted copy of the same chrome stays correct in both
            themes, where hardcoded greys would only be right in one. Whichever
            screen is behind takes it, so the pair always reads one-in-front —
            the same treatment the left screen carries at rest, now following
            the selection rather than fixed to one side. */}
        <div
          className={`h-full transition duration-300 motion-reduce:transition-none ${
            selected ? "" : "opacity-55 grayscale"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The pair, and which of the two is in front.
 *
 * It opens on the built app, because that is the half the section is arguing
 * for; the generic portal is the before. Pointing at either one picks it and
 * it stays picked — there is no "back to default", since every state here is a
 * legitimate one to leave the picture in.
 */
// Where the screens give out on the tray's right edge. Opaque for most of the
// width, then a short band to nothing — the whole fade happens inside the
// overflow, so no screen that fits is dimmed on its way past.
//
// It sits on the SCREENS, not on the tray. As a mask on the tray it faded the
// tray's own grey along with the windows inside it, so the right of the card
// dissolved into the page instead of the UI dissolving into the card.
//
// SHORT, and only on this edge. A long eased ramp was tried on both edges and
// is what the bottom of this picture must never go back to: the left screen's
// near-black sidebar spread into a grey smear half the height of the tray, and
// the long right ramp took the colour out of both screens on its way across.
// The bottom is a straight crop against the tray's edge instead — these are
// windows onto screens that continue below, and the edge says so.
const SCREEN_FADE =
  "linear-gradient(to right, #000 0 86%, rgba(0,0,0,0.72) 92%, " +
  "rgba(0,0,0,0.3) 97%, transparent 100%)";

function ScreenPair() {
  // Which screen is in front. It persists: pointing at one brings it forward
  // and it stays there, so you can actually look at the screen you raised.
  // The lit frame does NOT persist — that is plain hover on the screen itself,
  // so nothing is outlined once the pointer leaves the picture.
  const [selected, setSelected] = useState(1);
  return (
    <div className="flex">
      <Screen selected={selected === 0} onSelect={() => setSelected(0)}>
        <GenericPortalMock />
      </Screen>
      <Screen selected={selected === 1} overlaps onSelect={() => setSelected(1)}>
        {/* Branded, where the same screen elsewhere on the site is not. This
            pair IS the argument — a portal that is nobody's beside one that is
            yours — and with a neutral nav on both sides the right-hand screen
            was making the case in its labels while quietly contradicting it in
            its colour. */}
        <IntakeAppMock branded action={false} />
      </Screen>
    </div>
  );
}

/**
 * Copy is props so the vertical pages can run the same picture under their own
 * argument. Everything defaults to /client-portal's wording, so that page calls
 * this with no props and is unchanged.
 */
export function PortalProblem({
  heading = "Off-the-shelf portals make you fit the software. Not here.",
  body,
  sides = SIDES,
  screens,
  quote,
  link,
}: {
  heading?: string;
  /** A lead under the heading. /client-portal deliberately has none. */
  body?: string;
  /** Empty drops the two captions entirely, for a page whose brief has none. */
  sides?: { label: string; body: string }[];
  /**
   * What sits in the tray. Defaults to the two overlapping portal screens.
   * A page whose own picture is not built yet passes a plain block of the same
   * height, so the tray holds its shape with nothing drawn in it — better than
   * showing another vertical's portal, which is a claim rather than a gap.
   */
  screens?: React.ReactNode;
  /** Quoted from case-studies.ts, so the page and the story cannot drift. */
  quote?: { text: string; attribution: string; href: string };
  link?: { label: string; href: string };
} = {}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        {/* Ranged left, and the claim on its own. The lead under it said in
            other words what the heading had just said, and the jump link below
            it pointed at a section this one is the set-up for — so the reader
            met two sentences and a button before the picture that is the
            actual argument. */}
        <h2 className="type-h2 max-w-2xl text-balance">{heading}</h2>
        {body ? (
          <p className="mt-5 max-w-xl text-muted-foreground">{body}</p>
        ) : null}

        {/* Above the tray in two columns, in the pair's reading order. They
            stopped being captions aligned under their own screen once the
            screens began to overlap — there is no column for a caption to
            stand in any more, so they read as the before and after of one
            picture, which is what the picture now is. */}
        {sides.length ? (
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-5">
          {sides.map((side) => (
            <div key={side.label} className="max-w-sm">
              <p className="text-base leading-snug text-foreground">
                {side.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {side.body}
              </p>
            </div>
          ))}
        </div>
        ) : null}

        {/* One tray under both, with the screens running off its bottom and
            right. No bottom padding: the crop is the point, and a tray that
            closed under them would make them two pictures sitting on a shelf.

            Top corners only. The screens run to the tray's bottom edge, so a
            radius down there has nothing to round — it clips two notches out
            of them instead, which reads as a rendering fault rather than as a
            corner. */}
        <div className="mt-8 overflow-hidden rounded-t-3xl bg-[var(--surface)] p-4 pb-0 md:mt-10 md:p-6 md:pb-0">
          <div
            style={{
              WebkitMaskImage: SCREEN_FADE,
              maskImage: SCREEN_FADE,
            }}
          >
            {screens ?? <ScreenPair />}
          </div>
        </div>

        {/* Quote and jump link close the section, under the picture that is its
            argument rather than above it. On /client-portal both are absent and
            the section ends on the tray, which is why they are optional. */}
        {quote ? (
          <figure className="mt-12 max-w-2xl">
            <blockquote className="text-pretty text-foreground">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="type-caption mt-3 text-muted-foreground">
              <Link
                href={quote.href}
                className="transition-colors hover:text-foreground"
              >
                {quote.attribution}
              </Link>
            </figcaption>
          </figure>
        ) : null}
        {link ? (
          <Link
            href={link.href}
            className="mt-8 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {link.label}
          </Link>
        ) : null}
      </Reveal>
    </section>
  );
}
