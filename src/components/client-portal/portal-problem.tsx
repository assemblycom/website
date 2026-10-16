"use client";

import { useState } from "react";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { ViewToggle } from "@/components/ui/view-toggle";
import Image from "next/image";
import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { Reveal } from "@/components/ui/reveal";
import {
  DOTTED_RULE_AFTER_MOBILE,
  DOTTED_RULE_BEFORE_MOBILE,
} from "@/components/ui/dotted-rule";
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
      // WIDER ON A PHONE, and the overlap widens with it.
      //
      // The pair is sized so the two always add up to the tray: 62 + 62 − 24
      // on a desktop, where the tray is most of a 1200px rail and 62% of it is
      // a screen you can read. Below md the same proportion is 62% of about
      // 300px, which left each window under 190 — the intake form's labels and
      // values stacked into two-word lines and the left screen showed about a
      // tab and a half. 72 + 72 − 44 is the same sum with more of it spent on
      // each screen: they overlap harder, which costs the back one some of its
      // right edge, and that one is the generic portal — the screen the
      // argument is pointing away from.
      className={`group relative w-[72%] shrink-0 cursor-default transition-transform duration-200 motion-reduce:transition-none md:w-[62%] ${
        overlaps ? "-ml-[44%] md:-ml-[24%]" : ""
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
      {/* THE FRAME'S GROUND IS THE MOCK'S OWN, not --background.
          
          It was `bg-background`, which is the page's ground and was right
          while the tray was dark: the screen sat on near-black and the ground
          behind its content was near-black too. The tray is #F5F5F0 paper in
          dark now and scopes a ladder onto its subtree (see the tray above),
          so --background resolves to #ffffff in here — and a white ground
          under a near-black screen shows at every edge the content does not
          cover, which is the white hairline around the picture.

          --mock-window is what a screen in this family stands on and carries
          its own value per theme, so the ground is behind the UI rather than
          around it. The border takes the same treatment the toggle's thumb
          needed: the dark value is the BASE and light is the scoped variant,
          because `border-border` plus a dark override left the near-white
          ladder value winning.

          AND IT IS --mock-line, NOT #383838. That value is from when these
          screens sat on a near-black tray and the frame had to separate them
          from the page behind it. The tray is paper now and does that on its
          own, so a +23 step off the window read as a lit edge drawn around a
          dark screen — the brightest thing in a picture whose subject is the
          two forms. --mock-line is the hairline every other surface in this
          family is drawn with, a few points off the window rather than two
          dozen, and the hover comes down with it: white/12, not /20. */}
      <div
        className={`h-[300px] overflow-hidden rounded-t-xl border-l border-r border-t border-[var(--mock-line)] bg-[var(--mock-window)] transition-colors duration-200 group-hover:border-white/12 motion-reduce:transition-none md:h-[400px] [[data-theme=light]_&]:border-border [[data-theme=light]_&]:group-hover:border-foreground/15 ${
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
            selected
              ? ""
              : "opacity-55 grayscale [[data-theme=dark]_&]:opacity-[0.85]"
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
// The stops live in globals.css, as --portal-screen-fade, because the mask has
// to be able to say "nothing" in dark and an inline style has no theme to
// branch on. See the token for why dark wants none.
const SCREEN_FADE = "var(--portal-screen-fade)";

function ScreenPair({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (i: number) => void;
}) {
  // Which screen is in front is OWNED BY THE SECTION now, not by this pair,
  // because the Theirs/Ours toggle above the tray sets the same thing. Pointing
  // at a screen still brings it forward and it stays there, and doing so moves
  // the toggle with it — the two are one control in two places rather than two
  // controls that can disagree.
  //
  // The lit frame does NOT persist — that is plain hover on the screen itself,
  // so nothing is outlined once the pointer leaves the picture.
  return (
    <div className="flex">
      <Screen selected={selected === 0} onSelect={() => setSelected(0)}>
        <GenericPortalMock />
      </Screen>
      <Screen
        selected={selected === 1}
        overlaps
        onSelect={() => setSelected(1)}
      >
        {/* Branded, where the same screen elsewhere on the site is not. This
            pair IS the argument — a portal that is nobody's beside one that is
            yours — and with a neutral nav on both sides the right-hand screen
            was making the case in its labels while quietly contradicting it in
            its colour. */}
        <IntakeAppMock branded />
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
  heading = "Other portals make your firm fit the software. Not Assembly.",
  body,
  sides = [],
  screens,
  quote,
  trayImage,
  trayBackground,
  link,
  linkFirst = false,
  split = false,
}: {
  heading?: string;
  /** A lead under the heading. /client-portal deliberately has none. */
  body?: string;
  /**
   * The two captions above the tray. Empty by default: handoff v2 removed
   * section 3's bullets from /client-portal and lets the quote carry the
   * problem. A vertical page whose brief has them passes its own pair.
   */
  sides?: { label: string; body: string }[];
  /**
   * What sits in the tray. Defaults to the two overlapping portal screens.
   * A page whose own picture is not built yet passes a plain block of the same
   * height, so the tray holds its shape with nothing drawn in it — better than
   * showing another vertical's portal, which is a claim rather than a gap.
   */
  screens?: React.ReactNode;
  /** Quoted from case-studies.ts, so the page and the story cannot drift. */
  /** A photograph filling the picture's tray, behind `screens`. */
  trayImage?: string;
  /** A CSS background (e.g. a gradient stack) filling the tray instead. */
  trayBackground?: string;
  quote?: {
    text: string;
    attribution: string;
    href: string;
    /** The firm's logo, by case-study slug, in the card's thumbnail tile. */
    logoSlug?: string;
  };
  link?: { label: string; href: string };
  /**
   * Put the link directly under the lead instead of at the section's foot.
   * /client-portal does: its link sets up a later section, and read after
   * the picture it arrived once the argument was already made. Default is
   * the foot, which is where /solutions/accounting-client-portal wants its
   * own link and where this section has always put it.
   */
  linkFirst?: boolean;
  /**
   * Lays the picture and the quote out as one row from md, instead of the
   * quote sitting under the picture. See the wrapper in the markup.
   */
  split?: boolean;
} = {}) {
  // 1, the built app, because that is the half the section argues for; the
  // generic portal is the before. Only the default pair reads this — a page
  // passing its own `screens` gets no toggle and nothing to drive.
  const [selected, setSelected] = useState(1);
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal className="flex flex-col">
        {/* Ranged left, and the claim on its own. The lead under it said in
            other words what the heading had just said, and the jump link below
            it pointed at a section this one is the set-up for — so the reader
            met two sentences and a button before the picture that is the
            actual argument. */}
        {/* Split pages run heading and lead as two columns, with the jump
            link under the heading rather than at the foot of the section.

            The stacked layout is untouched: heading, lead beneath it, link
            last. `contents` again, so the wrapper is invisible there and the
            three stay direct children of the section's flex column — which is
            what their order-N classes are addressing. */}
        <div
          className={
            split
              ? "order-1 grid gap-6 md:grid-cols-2 md:items-start md:gap-12"
              : "contents"
          }
        >
          {/* On a PHONE the split grid is one column, so a link kept under
              the heading landed between the heading and the lead it is the
              answer to. Below md this wrapper dissolves, leaving heading,
              lead and link as the grid's own items, and the link is ordered
              last: heading, lead, button, as every other section reads. */}
          <div
            className={
              split ? "flex flex-col items-start max-md:contents" : "contents"
            }
          >
            <h2 className="type-h2 max-w-2xl text-balance">{heading}</h2>
            {split && link ? (
              <Link
                href={link.href}
                className={`max-md:order-last md:mt-6 ${QUIET_BUTTON}`}
              >
                {link.label}
              </Link>
            ) : null}
          </div>
          {body ? (
            <p
              className={
                split
                  ? "max-w-xl text-muted-foreground md:mt-2"
                  : "mt-5 max-w-xl text-muted-foreground"
              }
            >
              {body}
            </p>
          ) : null}
        </div>

        {/* Above the tray in two columns, in the pair's reading order. They
            stopped being captions aligned under their own screen once the
            screens began to overlap — there is no column for a caption to
            stand in any more, so they read as the before and after of one
            picture, which is what the picture now is. */}
        {/* On a PHONE the pair moves below the tray and becomes a ruled list;
            from md it goes back above it as two columns.

            Both halves are a reading of the same picture, so on a desktop —
            where the two columns sit side by side and are taken in together —
            they belong above it, as the question the picture answers. Stacked
            on a phone they are not a pair any more, they are two paragraphs in
            sequence, and two paragraphs before the picture is a wall to get
            through before the argument starts. Under it they read as the
            caption they have become.

            Ruled like the FAQ further down this same page, on its own dotted
            hairline rather than a second one invented here — two dotted rules a
            screen apart that disagree about pitch read as a mistake. The rules
            only, though: no chevron and nothing collapsed, because the whole
            section is the Almost fits / Fits contrast and a contrast you have
            to tap twice to see is not one. */}
        {sides.length ? (
          <div
            className={`order-2 mt-12 md:order-1 md:mt-16 md:grid md:grid-cols-2 md:gap-5 max-md:relative max-md:after:absolute max-md:after:inset-x-0 max-md:after:bottom-0 max-md:after:h-px max-md:after:content-[''] ${DOTTED_RULE_AFTER_MOBILE}`}
          >
            {sides.map((side) => (
              <div
                key={side.label}
                className={`md:max-w-sm max-md:relative max-md:py-5 max-md:before:absolute max-md:before:inset-x-0 max-md:before:top-0 max-md:before:h-px max-md:before:content-[''] ${DOTTED_RULE_BEFORE_MOBILE}`}
              >
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

            Rounded on all four, with the screens running flush off the
            bottom — and the two do not fight, because THE RADIUS EQUALS THE
            SIDE PADDING. A corner of radius r only eats into the content box
            where x < r, and the screens start at x = p, so at p = r the curve
            is exactly tangent to their bottom corners and clips nothing. That
            is the whole trick, and it is why the pairs move together: 2xl with
            p-4, 3xl with p-6. Round harder than you pad and the curve takes a
            wedge out of each screen's foot.

            No bottom fade, in either theme. It existed only to clear those
            corners, and on a white tray it ramped the Brandmages slab through
            grey — a smear in light, buying something the geometry gives for
            free. The bottom is a straight crop against the tray's edge, which
            is what these screens are: windows onto something that continues. */}
        {/* The tray, plus the phone's copy of the toggle under it. Wrapped so
            the two move as one block in the section's order, rather than the
            toggle needing a slot of its own between the tray and the columns. */}
        {/* Picture and quote, as one row or as two stacked blocks.

            `contents` is the default, so the wrapper vanishes from layout
            entirely and /client-portal and the agency page lay out exactly as
            they did — tray, then quote beneath it, both on the section's full
            measure.

            `split` puts them side by side from md: the picture left, the quote
            reading beside it rather than under it. Only the accounting page
            asks for this. Still stacked on a phone, where two columns would
            give the picture half a 375px screen. */}
        <div
          className={
            split
              ? // mt-10 replaces the margin the picture used to carry itself —
                // taking it off the tray for the split layout left this row
                // sitting directly under the header with nothing between the
                // jump link and the cards.
                "order-2 mt-10 grid gap-8 md:grid-cols-2 md:items-stretch md:gap-8"
              : "contents"
          }
        >
          <div
            // The order and the top margin belong to the stacked layout,
            // where this has to sit between the captions and the quote and
            // clear the lead above it. Inside the split grid both are wrong:
            // md:order-2 was putting the PICTURE second, which read as the
            // quote taking the left column, and the margin dropped it out of
            // line with the card beside it.
            className={split ? "" : "order-1 mt-10 md:order-2 md:mt-10"}
          >
            {/* THE TRAY IS PAPER IN DARK, like the hero's cards.

              --surface was the ground here, which is right for a card you are
              meant to see as a card. At #191919 on a #0a0a0a page it was not
              reading as one — it was a slightly lighter slab behind two dark
              screens, so the section came out as three dark rectangles and the
              two that carry the argument had to compete with the one holding
              them.

              #F5F5F0 settles it the other way: the tray becomes a lit surface
              and the two screens become objects standing on it, which is the
              relationship the hero already uses and the one stage 2 of the
              journey rail uses for its cover plates. The comparison is between
              the two screens, and they are the only dark things in the frame
              now.

              ITS OWN LADDER, for the reason the hero's cards need one. Flipping
              a fill to near-white in dark leaves everything inside still
              resolving page tokens tuned for near-black — the toggle reads
              --border/--background/--foreground, and on paper that is a white
              ring with a white thumb on white. So the five tokens its subtree
              reads are re-pointed to light values, declared ONLY in the dark
              branch; light resolves exactly what it always did. The --mock-*
              tokens are deliberately untouched, so the two screens stay
              dark-themed — which is the whole point of standing them on this.

              --muted-foreground is light's own #6b7079 here, not the navy the
              hero needs: that card is a mid blue, this tray is near-white, so
              the grey tuned against white is correct again. */}
            <div className="relative overflow-hidden rounded-2xl bg-[var(--surface)] px-4 pb-0 pt-3 md:rounded-3xl md:px-6 md:pb-0 md:pt-4 [[data-theme=dark]_&]:bg-[#F5F5F0] [[data-theme=dark]_&]:[--surface:#F5F5F0] [[data-theme=dark]_&]:[--foreground:#101114] [[data-theme=dark]_&]:[--muted-foreground:#6b7079] [[data-theme=dark]_&]:[--border:#e8e9ec] [[data-theme=dark]_&]:[--background:#ffffff]">
              {/* THEIRS / OURS, inside the tray and above the screens — FROM md.
              On a phone it moves out from under the tray; see the copy below.

              The handoff labels the two screens underneath them, which names
              what you are looking at but leaves the pair reading as two
              pictures. As a control it is the section's argument in two
              words, and it gives the comparison a way in on a touch screen,
              where the hover that drives the pair does not exist.

              IN THE TRAY, not above it: the thing it switches is in the tray,
              and parked on the page outside it the control read as belonging
              to the section rather than to the picture.

              OUTSIDE THE MASK below, though. The screens carry a fade on
              their right edge, and anything inside that wrapper fades with
              them — a control dissolving at one end is a rendering fault, not
              a crop.

              Only on the default pair: a page passing its own `screens` has
              no two states for this to switch between.

              THE HERO'S TOGGLE, not the page's segmented control. Both
              exist and they are for different grounds: SegmentedTabs has a
              filled track, which on a tray reads as a second panel laid on
              the first. This one is a hairline with no fill, so the tray
              reads through it — see ui/view-toggle.tsx.

              TOP RIGHT, not top left. It is a control on a picture rather
              than a heading for one: at the left it sat directly under the
              section's own left-ranged copy and read as the next line of it.
              In the corner the screens have the tray to themselves and the
              switch is plainly furniture. */}
              {/* THE GAP OVER THE SCREENS IS THE TOGGLE'S ROW, NOT A MARGIN.
              The tray paid 24px of top padding and the toggle another 24
              under itself, so above the picture sat a 48px band of bare tray
              plus the control's own height — on a card whose subject is the
              two screens, the first third of it was empty. The control still
              has room to be a control; it just stops reserving a second one. */}
              {trayBackground ? (
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: trayBackground }}
                />
              ) : null}
              {trayImage ? (
                <Image
                  src={trayImage}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 600px, 100vw"
                  className="object-cover"
                />
              ) : null}
              {!screens ? (
                <div className="hidden justify-end md:mb-3 md:flex">
                  <ViewToggle
                    // The tray is paper in dark (see above), so the control's
                    // dark variants — a white hairline and a white-wash thumb —
                    // would paint white on white. onPaper drops them and lets
                    // the base classes resolve the tray's own ladder.
                    onPaper
                    options={["Theirs", "Ours"]}
                    view={selected}
                    onSelect={setSelected}
                    label="Which portal to show"
                  />
                </div>
              ) : null}

              {/* Two masks, nested rather than two layers on one element: CSS
              composites mask layers by union, so declared together the right
              fade and the bottom fade would each hold the other's edge open
              instead of both applying. Only the right one is left — see the
              tray above for why the bottom needs none. */}
              <div className="relative">
                <div
                  // No edge fade over a photograph: it would dissolve the
                  // picture laid on it into the scene behind.
                  style={
                    trayImage || trayBackground
                      ? undefined
                      : { WebkitMaskImage: SCREEN_FADE, maskImage: SCREEN_FADE }
                  }
                >
                  {screens ?? (
                    <ScreenPair selected={selected} setSelected={setSelected} />
                  )}
                </div>
              </div>
            </div>

            {/* THE PHONE'S COPY: under the tray, on the page's own ground, centred
            — the same move the builder hero makes with its two cards.

            In the tray's top-right corner it works on a wide screen, where the
            screens have room to spare beside it. On a 375px phone the tray is
            the full measure and the control sat on top of the picture it
            switches, taking a row out of the shot and reading as part of the
            app in it. Under the tray it is plainly a control for the thing
            above it, and the screens get the whole tray back.

            Rendered a second time rather than moved with order utilities: it
            has to leave the tray's padding and its overflow-hidden box to sit
            on the page at all, and the two are in different stacking parents.
            Both drive the same `selected` state, so there is nothing to keep
            in sync. */}
            {!screens ? (
              <div className="mt-4 flex justify-center md:hidden">
                <ViewToggle
                  options={["Theirs", "Ours"]}
                  view={selected}
                  onSelect={setSelected}
                  label="Which portal to show"
                />
              </div>
            ) : null}
          </div>
          {/* Quote and jump link close the section, under the picture that is its
            argument rather than above it. On /client-portal both are absent and
            the section ends on the tray, which is why they are optional. */}
          {quote ? (
            <figure
              // A card of its own when it sits BESIDE the picture, plain text
              // when it sits under it. Beside, it is one of two objects on the
              // row and needs a ground to be an object at all — set bare it
              // read as a caption that had drifted into the margin. Under, the
              // section's own measure already frames it, and a panel would end
              // the section on two stacked boxes.
              //
              // Same tray colour as the picture beside it, so the pair reads
              // as two halves of one row. --surface carries its own light and
              // dark values, so there is no hardcoded grey here.
              className={
                split
                  ? `flex h-full flex-col rounded-3xl bg-[var(--surface)] p-8 md:p-10 ${
                      quote.logoSlug
                        ? "justify-between gap-10"
                        : "justify-center"
                    }`
                  : "order-3 mt-12 max-w-2xl"
              }
            >
              {/* The firm's logo, top left, on the white tile the customer
                  quote cards use (BuilderCustomerQuotes) — the same treatment
                  for a firm with no portrait. The quote drops to the foot. */}
              {split && quote.logoSlug ? (
                <div className="flex size-[72px] shrink-0 items-center justify-center rounded-lg bg-white p-3.5 text-[#1B1F24] [[data-theme=dark]_&]:bg-[#d4d4d0] ring-1 ring-inset ring-black/[0.06]">
                  <CustomerLogo slug={quote.logoSlug} fit />
                </div>
              ) : null}
              <div>
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
              </div>
            </figure>
          ) : null}
        </div>

        {/* Split pages render this under the heading instead — see the
            header block above — so it is not repeated here. */}
        {link && !split ? (
          <Link
            href={link.href}
            className={`${linkFirst ? "order-0 mt-6" : "order-4 mt-8"} sm:self-start ${QUIET_BUTTON}`}
          >
            {link.label}
          </Link>
        ) : null}
      </Reveal>
    </section>
  );
}
