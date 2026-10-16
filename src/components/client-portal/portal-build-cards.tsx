// ─────────────────────────────────────────────────────────────────────────
// BUILD STEP CARDS — the four pictures in the Build section's rail.
//
// One card per step, drawn from the same product vocabulary as the rest of
// the page: the --mock-* status tokens, the shared workspace nav, and the
// builder hero's 13px type scale, so a reader coming from /ai-app-builder
// sees one product.
//
// Each card carries a small hover move, and each one is the step's own verb
// rather than decoration: the prompt finishes typing, the plan is approved,
// the app lands in the nav, the revision takes effect. CSS only, under
// group-hover, and every one of them is dropped under reduced motion.
// ─────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import Image from "next/image";
import { MockFit } from "@/components/templates/mock-fit";
import { fadeMask } from "@/components/ui/fade-mask";
import { FootBlur } from "@/components/ui/foot-blur";
import { PANEL_BG } from "@/components/comparison/brand-panel";
import { IconArrowUp } from "@/components/home/build-step-visual";
import {
  IconApp,
  IconCalendarDays,
  IconCheck,
  IconBloomhouseMark,
  IconBrandMark,
  IconLedgerline,
  IconChat,
  IconCreditCard,
  IconDocuments,
  IconFile,
  IconGlobe,
  IconPenFilled,
  IconPlus,
  IconClock,
  IconSearch,
  IconMegaphone,
  IconPenNib,
} from "@/components/home/mock-icons";

// 3:4, the rail's card shape.
const W = 340;
const H = 453;

const UI_PRIMARY = "text-[11.5px] leading-none";
const UI_SECONDARY = "text-[10.5px] leading-none";
const CARD_BODY = "text-[12.5px] leading-[1.4]";
// The same line, at the PAGE's body size, for a `plain` scene.
//
// The rail's cards draw their scene at 340px wide, so 12.5px there is type
// inside a picture of a screen and reads as such. /ai-app-builder's panel draws
// the same scene at 560px, 1:1 with no MockFit scaling left to do, which puts
// that 12.5px directly beside the panel's own 14px caption a few lines above
// it — close enough to compare, small enough to read as a mistake rather than
// as a smaller thing further away.
//
// Back on the shared mock scale now: every visual on the site draws its type
// from mock-type.ts, and the 14px prompt read as oversized next to the hero's
// composer at 12.5. The panel's caption is page copy, not part of the mock.
const CARD_BODY_PLAIN = "text-[12.5px] leading-[1.45]";
/**
 * The composer's CONTROL row on a `plain` scene.
 *
 * Same argument as CARD_BODY_PLAIN, and it was half-applied: the prompt was
 * moved up to 14px for the panel because that scene draws 1:1 at 580px, but
 * the row under it kept UI_SECONDARY (10.5px) and 20px hit areas — numbers
 * drawn for the rail's 340px card, where the whole mock is a third the size.
 * So the box grew and its controls did not, which is why they read as too
 * small for it rather than as small type.
 *
 * 12.5px against the prompt's 14px, and 26px buttons, which is the ratio the
 * rail already has between its own body and its send button, applied to the
 * bigger body rather than left behind at the smaller one.
 */
const UI_PLAIN = "text-[10.5px] leading-none";
/** The plan document's own scale.
    
    A step up from the UI labels around the mocks, because this is the one
    scene that IS a document — it is read, not glanced at — and it is drawn at
    1:1 in a 560 box with nothing else competing for the width. At the in-mock
    10px it was legible but looked like fine print in a screenshot. */
// ON A PHONE the plan sits a step under the card's own 14px copy, at the mock
// scale's body size, and its window is inset from the card's edges: at 14px
// and edge to edge it read as more body copy rather than as a product screen.
// The document is deliberately cropped (see the foot ramp and the chevron), so
// type size costs visible lines rather than breaking the box.
/* The mock scale's title and body steps (13.5 / 12.5) at every width, so the
   plan reads as part of the same system as the other two steps. The document
   already overflows and fades at the foot, so type size costs lines, not the
   box. */
const PLAN_HEAD = "text-[13.5px] leading-[1.3]";
/* 1.6, not 1.45. This is the one block on the site that is set as a DOCUMENT
   — paragraphs and a list, read rather than scanned — and document leading is
   looser than a UI label's. It also makes the list's bullets land clear of the
   line above them rather than between two lines. */
const PLAN_PROSE = "text-[12.5px] leading-[1.6]";

const LINE = "border-[var(--mock-line)]";

/**
 * A flow, with its one marked term underlined.
 *
 * Splits on the first occurrence and nothing more — no regex over the whole
 * string, so a term that happens to appear twice is marked where it is
 * introduced rather than everywhere it is mentioned.
 *
 * `decoration-dotted` at 1px with a 3px offset: the dots have to sit clear of
 * the descenders in "dashboard" and read as a mark rather than as a link,
 * which on this site is a solid 1px rule. The colour is inherited, so the
 * mark fades with its line under the foot ramp instead of staying lit after
 * the words around it have gone.
 */
function markedFlow(text: string, mark: string) {
  const at = text.indexOf(mark);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="underline decoration-dotted decoration-1 underline-offset-[3px]">
        {mark}
      </span>
      {text.slice(at + mark.length)}
    </>
  );
}
// ── Corner radius: a SCALE of three, not a value per element ─────────────
// These mocks had five radii — 3, 4, 5, 6 and 8px plus Tailwind's own lg and
// xl — picked as each was drawn, which on a card showing several at once reads
// as several different UIs. Flattening them all to 4 fixed that and introduced
// the opposite problem: a 4px corner on a 250px card is a corner you cannot
// see, and the product's own screens do not draw cards that way.
//
// So three steps, each with a job:
//   R_CHROME  things INSIDE a screen — nav rows, chips, event blocks, the
//             segmented control. Small objects, small corner.
//   R_WINDOW  the screen itself — the outer box every scene is drawn in. It
//             borrowed R_CHROME, which is the reason a 250px window wore the
//             same 4px corner as a 22px chip inside it: the corner vanished
//             at that size and the screen read as a rectangle of paper.
//   R_PANEL   a card, or the one exposed corner of a window. The biggest
//             object gets the biggest corner.
// rounded-full is exempt throughout: a circle is not a corner.
const R_CHROME = "rounded-[4px]";
const R_WINDOW = "rounded-[8px]";
const R_PANEL = "rounded-[10px]";
// NO DROP SHADOW. The window used to cast one, which is what a floating panel
// does — but these screens are not floating on anything: each is set INTO a
// card that is itself the artwork, and a shadow under it lifted the screen off
// its own card and made the card read as a backdrop the UI had been pasted
// onto. The ground, the radius and (where it is needed) the hairline do all
// the separating these need. The comment bubble in the Collaborate scene keeps
// its shadow, because that one IS floating — it lies on top of a photograph.
const WINDOW = `overflow-hidden ${R_WINDOW} border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`;
// THE CLIENT'S BRANDED RAIL. --mock-brand-slab, not --mock-brand.
//
// The two are the same near-black in light and deliberately different in dark:
// --mock-brand stays #121212 because it is also a 15px glyph on the invoice
// mark and the branded nav elsewhere, while --mock-brand-slab is the site's
// own Haze mixed most of the way into that near-black — a value drawn for a
// large flat FIELD. This rail is one, 124–136px wide and the full height of
// the window, and at --mock-brand it was near-black beside a near-black pane:
// the one element in the shot that is supposed to say "this portal carries the
// firm's colour" was showing no colour at all.
//
// The token already existed for exactly this (see globals.css, and the hero's
// own BRAND_SIDEBAR which has used it all along) — this rail had simply never
// been moved onto it. Light is untouched: there both tokens are #171717.
// Dark swaps the Haze-tinted slab for a neutral grey from the mock palette:
// the blue cast read as a colour cast rather than the firm's brand.
const BRAND_SIDEBAR =
  "bg-[var(--mock-brand-slab)] text-white [[data-theme=dark]_&]:bg-[var(--mock-well-2)]";
const TABLE_HEAD = `flex items-center gap-3 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`;
const CHIP = `rounded px-1.5 py-[4px] ${UI_SECONDARY}`;
const NEUTRAL = `${CHIP} bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]`;
// The settled state — a paid invoice, an approved plan. Same pair of tokens
// the other mocks on the site reach for (see segment-mock, build-step-visual),
// so "good" is one colour decision across every picture rather than per card.
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;

// ONE type scale for the whole rail, and TWO sizes in it. Nothing else.
//
// The three cards had grown their own: 12.5 and 10.5 in Describe and Plan, 10
// and 8.5 in the board, because the board was the denser screen and seemed to
// need its own step. Side by side in a rail that reads as noise rather than as
// hierarchy — the same kind of row is a different size depending on which card
// it is in, which is the one thing a set of three pictures must not do.
//
// UI_PRIMARY is anything a reader lands on: a nav row, a requirement, a
// project's title, a column's name. UI_SECONDARY qualifies one of those: a
// count, a progress figure, whose project it is. CARD_BODY is the one thing in
// the rail that is a SENTENCE rather than a row — the line being typed in
// Describe — so it is a step up and carries prose leading.
//
// UI_PRIMARY is 11.5, not the 12.5 it started at. At 12.5 a project's title
// was the same size as the sentence someone types, which made the board's
// cards read as headlines rather than as rows in a list.

// A row answering the pointer// A row answering the pointer, shared by every table in the rail so one card's
// rows don't feel live while the next card's feel dead.
//
// --mock-well-2, the solid well, not --mock-well: the faint one is two percent
// off white and a hover nobody can see is not a hover state.
const ROW_HOVER = "transition-colors hover:bg-[var(--mock-well-2)]";

// The dashed row marks and the unfilled rings they match. Both used to read off
// --mock-line, which is the hairline that DIVIDES rows — right for a rule a
// reader should not notice, and too quiet for a mark that is the only thing
// saying a requirement is still open. It vanished at #2e2e2e on the dark window
// and was barely there at #e8e9ec on the light one, and a dashed stroke loses
// more than a solid one does, because half of it is gaps.
//
// Each theme gets its own value, a step firmer than --mock-line in both. They
// are not one value with an opacity on it: light darkens and dark lightens.
const CIRCLE_TRACK = "border-[#ccd0d6] [[data-theme=dark]_&]:border-[#4d4d4d]";
const CIRCLE_STROKE = "stroke-[#ccd0d6] [[data-theme=dark]_&]:stroke-[#4d4d4d]";

// Every hover move hangs off this, so "no motion" is one rule rather than
// four separate ones that can drift.
const MOVE =
  "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out motion-reduce:transition-none";

/** The frame each card's scene is drawn in, scaled to whatever the rail gives it. */
// How far a BLEED scene's box overruns its own design height, in design px.
//
// It covers a rounding slack that is nobody's bug in particular. MockFit sizes
// the scene by `el.clientHeight`, which is an INTEGER, while the card it is
// measuring is a fraction of a pixel taller than that — a rail card's height
// comes from a percentage width through an aspect ratio, so 255.05 is the
// normal case and 255 is what the scale gets told. The scene therefore lands
// flush against a card that is still 0.05px deeper, and in a bleed scene,
// where the artwork is supposed to run off the foot, that last sliver is the
// card's GROUND: on step 3 a periwinkle hairline drawn under the whole width
// of the screen, which reads as an outline somebody added rather than as the
// crop it is.
//
// Fixed here rather than in MockFit on purpose. Measuring the fractional
// height there would re-scale every mock on the site to chase a rounding
// error, and the seam only has consequences where artwork meets the card's
// edge — which is this flag and no other scene.
//
// 2px, not 1: the overrun is spent in DESIGN pixels and then scaled down with
// everything else, and these scenes run at about 0.56 on a phone, so one pixel
// buys half of one on screen — not reliably more than a slack that can be just
// under a whole pixel. Two buys a little over one and still costs nothing: the
// box is centred, so this is ~0.5px added at the top and bottom of a scene
// whose foot is already a crop.
const BLEED_FOOT_OVERRUN = 2;

function Scene({
  children,
  bleed = false,
  fadeFrom = 52,
  w = W,
  h = H,
  boxClass,
  boxSizeClass,
  footFlush = false,
}: {
  children: React.ReactNode;
  /**
   * The scene's design box. The rail's three scenes are all portrait (340x453)
   * because the rail's cards are, and MockFit fits the whole box — so in a
   * LANDSCAPE slot a portrait scene is sized by the slot's height and leaves
   * the width either side empty, however wide the slot is. A scene with no
   * artwork ground behind it (see `plain`) has nothing to fill that margin
   * with, so it redraws itself to the slot's shape instead.
   */
  w?: number;
  h?: number;
  /**
   * The design box as Tailwind arbitrary values instead of `w`/`h`, for a
   * scene whose box CHANGES WITH THE BREAKPOINT. MockFit reads
   * --template-mock-w/h off computed style, so a class sets them just as well
   * as the inline style does — and unlike the style it can carry an `lg:`.
   * Declares --template-mock-w/h only; `boxSizeClass` sizes the box itself to
   * the same numbers. They are two strings and not one because this frame is
   * `absolute inset-0` — a `w-[820px]` meant for the box would resize the
   * frame, and the frame's width is what MockFit measures the scale against.
   */
  boxClass?: string;
  /** The box's own width/height, matching `boxClass`'s vars at every breakpoint. */
  boxSizeClass?: string;
  /**
   * Draws the mock at its own size running off the card's right and bottom
   * edges, rather than fitting it inside. A screen squeezed into 300px
   * truncates every label it has; cropped, it keeps full-size type and reads
   * as a window onto something larger — which is what it is.
   */
  bleed?: boolean;
  /**
   * Where the right-edge fade begins, as a percent of the 340px scene.
   *
   * 52 suits a mock whose subject starts at the left edge. The board in step 3
   * has a sidebar in front of it, so at 52 the fade began 7px into the board
   * itself and the whole thing was drawn in the ramp. A card that spends its
   * width getting TO its subject has to start fading later.
   */
  fadeFrom?: number;
  /**
   * Drops the box's bottom inset so a child can run to the scene's foot and be
   * cut by it.
   *
   * The 20px inset is right for a scene whose subject is an object sitting in
   * a frame — the composer, the board — where the air around it is what makes
   * it read as placed rather than as cropped. It is wrong for the plan, whose
   * subject is a DOCUMENT longer than the window it is read in: there the
   * bottom inset put a 20px band of ground under a card that is supposed to
   * carry on past the edge, which reads as the card ending early with room to
   * spare rather than as a page running off the bottom.
   */
  footFlush?: boolean;
}) {
  return (
    <MockFit
      className={`absolute inset-0 ${boxClass ?? ""}`}
      style={
        boxClass
          ? undefined
          : ({
              "--template-mock-w": `${w}px`,
              "--template-mock-h": `${h}px`,
            } as React.CSSProperties)
      }
    >
      <div
        style={
          boxClass
            ? {
                ...(bleed
                  ? {
                      WebkitMaskImage: fadeMask("to right", fadeFrom),
                      maskImage: fadeMask("to right", fadeFrom),
                    }
                  : {}),
              }
            : bleed
              ? {
                  width: w,
                  // See BLEED_FOOT_OVERRUN. The box is a touch taller than the
                  // design height it is SCALED by — --template-mock-h stays `h`,
                  // so the scale is unchanged and only the box's own edges move.
                  height: h + BLEED_FOOT_OVERRUN,
                  // The right edge only. It was a two-stop ramp that changed rate
                  // hard enough to draw a vertical line down the card; the shared
                  // eased curve is what fixed that — see fade-mask.ts.
                  //
                  // The BOTTOM is a straight crop, deliberately. A fade was tried
                  // there and this card is the worst case for one: its sidebar is
                  // near-black over a light card, so any ramp across it is a grey
                  // wash with the sidebar's own shape, and it read as the artwork
                  // being wrong rather than as the picture giving out. The card's
                  // edge cutting the screen says "this continues" on its own.
                  WebkitMaskImage: fadeMask("to right", fadeFrom),
                  maskImage: fadeMask("to right", fadeFrom),
                }
              : { width: w, height: h }
        }
        className={`${boxSizeClass ?? ""} ${
          bleed
            ? // WHICH END THE CROP FALLS ON, and it changes with the slot.
              //
              // A bleed scene is taller than its card, so one end is always
              // lost. From `lg` the card is 3:4 and the scene is pinned to the
              // FOOT: the board's rows run off the bottom, where a cut row
              // still reads as a list carrying on.
              //
              // Below lg the card is square and the box loses 113px, which
              // at the foot took the sidebar's own header — the firm's mark
              // and name — off the top of a card whose subject is the firm's
              // portal. Pinned to the top instead, the same 113px comes off
              // the bottom, which is the end that was always meant to be cut.
              "flex flex-col justify-start overflow-hidden pl-5 pt-5 lg:justify-end"
            : `flex flex-col gap-4 p-5 ${
                // justify-center centres a short scene in the box; with the
                // foot open the child is meant to FILL it and be cut, so it
                // stretches instead and the centring has nothing to do.
                footFlush ? "justify-stretch pb-0" : "justify-center"
              }`
        }`}
      >
        {children}
      </div>
    </MockFit>
  );
}

// ── 1. Describe ──────────────────────────────────────────────
// The composer, and nothing else. It carried a segmented control that switched
// the body between a typed sentence and three starter templates — a second
// claim ("or start from a template") riding on the step that is about saying
// what you want, and the only control in a rail of otherwise still pictures.
// The templates have their own section further down the page, so the step is
// left to make one point.
/**
 * Opt-in: draw the scene with no artwork ground behind it.
 *
 * The three grounds — a photograph, #101010, #CFCFCF/Haze — are drawn for the
 * RAIL on /client-portal, where each card is about 340px wide and the ground is
 * what separates one card from the next in a row of three. /ai-app-builder
 * shows the same three scenes one at a time inside a single wide --surface
 * panel, where there is no neighbour to separate from: the ground stops being
 * separation and becomes a heavy block of colour sitting inside an otherwise
 * quiet panel, with the actual subject floating in the middle of it.
 *
 * So this is a property of the SLOT, not of the scene, and only the panel
 * passes it. The rail keeps every ground exactly as drawn.
 */
type SceneProps = {
  plain?: boolean;
  /**
   * Whose firm the rail's three build steps belong to. The default is
   * /client-portal's: Brandmages building a project tracker. The accounting
   * page passes "accounting", which runs the same three scenes as Ledgerline
   * building a month-end close tracker — the agency's vocabulary was the one
   * thing on that page's build section in the wrong firm's words.
   *
   * "agency" is the marketing-agency page's: Bloomhouse building the same
   * project tracker, in an agency's words — campaigns and creative rather than
   * the generic set's data rooms — with the hero's own apps in its nav, so the
   * page shows one firm from hero to build rail.
   */
  vertical?: "default" | "accounting" | "agency";
};

/**
 * The design box a `plain` scene is drawn at: the panel slot's own landscape
 * shape (620x400), in place of the rail's portrait 340x453. MockFit fits the
 * whole box, so a portrait scene in a landscape slot is sized by height alone
 * and leaves the width empty either side — which the artwork grounds used to
 * fill and, with them gone, nothing does. One box for all three from `sm` up,
 * so the three steps stay the same size as you tab between them.
 */
/**
 * The same box with a PHONE step in front of it, as classes rather than
 * numbers, for the scenes the /ai-app-builder panel draws.
 *
 * 620x400 is a desktop measurement. MockFit fits the whole design box, so in
 * the panel's ~327px slot on a phone it resolved to a scale of 0.53 — the
 * composer, the plan list and the portal screen were all drawn at half the
 * size their type was set for, which is the "too tiny" you see, and the scene
 * then filled 211px of a 360px slot and left 149px of bare panel under it.
 *
 * 360x300 is the same scene redrawn to a phone's shape: it reflows the content
 * to a narrow box instead of shrinking it, so the fit comes out near 1:1 and
 * the type is the size it was set at. The slot carries the matching 6:5 aspect
 * below `sm` (see BuilderHowItWorks), so the scene lands on the slot exactly
 * and there is no dead panel in either axis at any phone width.
 */
/**
 * The rail scene's box on a PHONE, where the card is square.
 *
 * The default box is 340x453 — 3:4, which is the shape a rail card takes from
 * `sm` up and the reason that number was chosen. On a phone the card is
 * `aspect-square`, and MockFit fits the WHOLE box, so a 3:4 scene in a 1:1
 * slot is sized by its height: it scales to 255/453 and sits centred with a
 * band of card down either side.
 *
 * Two things follow from that, and they were reported separately as if they
 * were separate bugs. The type comes out small — every size in these mocks is
 * drawn at design scale and then multiplied by 0.56, so 12px lands near 7px.
 * And a window meant to BLEED off the right edge cannot reach it, because the
 * artwork stops short of the card on both sides; the crop that makes a screen
 * read as a window onto something larger simply does not happen.
 *
 * Squaring the box on a phone fixes both at once: width and height constrain
 * equally, so the scene fills the card instead of being letterboxed, the scale
 * goes to 255/340 — about a third larger — and the right-hand bleed lands on
 * the card's own edge. From `lg` the box goes back to 453 and nothing changes,
 * because from `lg` the card is 3:4 again and the default was always right.
 *
 * Content is centred in the box, so the 113px a phone loses off the design
 * height comes off the empty air above and below the artwork rather than the
 * artwork. Any scene whose subject is TALLER than 340 would be cropped by this
 * and should not take it — which is why it is opt-in per card rather than the
 * new default.
 */
// A SMALLER DESIGN BOX ON A PHONE, which is how the UI inside gets BIGGER.
//
// These scenes are drawn at a fixed size and fitted to the card, so the scale
// is card width over design width and every type size inside rides on it. At
// 340 against a phone card of about 255 that is 0.75 — an 11.5px row label
// renders at 8.6px, under every caption around it, on the one card a reader is
// meant to recognise as product UI. 290 takes the same card to 0.88 and the
// label to a little over 10px.
//
// The box stays SQUARE until lg because the rail card does (see
// card-rail.tsx). Going 3:4 at sm instead letterboxed every scene into a
// square card between sm and lg, leaving bare ground down both sides.
//
// 400 rather than 340 in that range, because the card there runs 340 to 460
// wide: at 340 the scale reached 1.36 and the mock type came out oversized.
// --rail-phone-h / --rail-phone-h-wide are the 4:5 heights a tallOnPhone card
// sets (362 at 290 wide, 500 at 400 wide).
//
// The 400 box starts at 480, not sm: a phone card is 78% of the screen, so on
// a wide phone it reached 460px and drew the 290 box at 1.59x.
const RAIL_SCENE_PHONE = {
  vars:
    "[--template-mock-w:290px] [--template-mock-h:var(--rail-phone-h,290px)] " +
    "min-[480px]:[--template-mock-w:400px] min-[480px]:[--template-mock-h:var(--rail-phone-h-wide,400px)] " +
    "sm:[--template-mock-w:400px] sm:[--template-mock-h:400px] " +
    "lg:[--template-mock-w:340px] lg:[--template-mock-h:453px]",
  size:
    "w-[290px] h-[var(--rail-phone-h,290px)] min-[480px]:w-[400px] min-[480px]:h-[var(--rail-phone-h-wide,400px)] " +
    "sm:w-[400px] sm:h-[400px] lg:w-[340px] lg:h-[453px]",
};
/** Spread form, so a card opts in with one line and cannot pair the wrong two. */
const RAIL_SCENE_PHONE_PROPS = {
  boxClass: RAIL_SCENE_PHONE.vars,
  boxSizeClass: RAIL_SCENE_PHONE.size,
};

const PANEL_SCENE_PHONE = {
  vars: "[--template-mock-w:360px] [--template-mock-h:300px] sm:[--template-mock-w:620px] sm:[--template-mock-h:400px]",
  size: "w-[360px] h-[300px] sm:w-[620px] sm:h-[400px]",
};

/**
 * Build's panel box, which is WIDER than the other two from `lg` up.
 *
 * Step 3's scene is a portal screen, and a screen is the one subject here that
 * goes on being a screen the more of it you show. At 560 it filled its half of
 * a 1120px panel and left the other half bare — the step whose point is "here
 * is the app, running" was the smallest thing in the section. 820 takes it to
 * roughly three quarters of the panel, and because the sidebar is fixed at 136
 * every one of the extra pixels lands on the board.
 *
 * Two steps, not one, and for the same reason there is a step at all: the slot
 * is `w-full max-w-[…]`, so a box wider than the panel is fitted DOWN and takes
 * the mock's type with it — 0.84 scale at the md breakpoint is how an 11.5px
 * label becomes 9.7px. So each width waits for a panel that can hold it at 1:1.
 * The panel is 944 inside at `lg` (holds 900) and 1072 at 1152 (holds 1040).
 *
 * THE SECOND STEP IS AT 1152, NOT AT `xl` (1280), and the first is 900 rather
 * than 820. The slot is `ml-auto`, so every pixel the box is narrower than the
 * panel is a pixel of bare panel on the LEFT — and waiting for 1280 meant the
 * worst case sat just under it: a 1120px panel holding an 820px box, 300px of
 * nothing under the copy. 1152 is simply the width at which the panel first
 * holds 1040 at 1:1, which is the rule the other steps already follow; it just
 * was not a breakpoint anyone had named. The gap now peaks near 170 instead of
 * 300, and is 32 from 1152 up.
 *
 * The `xl` step is what closes the gap on the LEFT. The slot is `ml-auto`, so
 * the scene's right edge is the panel's right edge and all the slack collects
 * under the copy on the left — at 820 in a 1120 panel that was 300px of bare
 * panel beside the one thing the step is about. Widening is the only lever
 * that moves it left, because the right edge is pinned by the bleed.
 *
 * The height does not move. The three steps share one panel and tabbing
 * between them must not resize it, so only the width is per-step — and width
 * is the axis with the slack, since all three slots run to the panel's foot.
 */
const PANEL_SCENE_WIDE = {
  // The phone step is the same one PANEL_SCENE_PHONE takes and for the
  // same reason — see there. Build's scene is a portal screen that bleeds off
  // its own right edge, so a narrow box crops it further rather than squeezing
  // it, which is the behaviour this scene already has at every other width.
  vars: "[--template-mock-w:360px] [--template-mock-h:300px] sm:[--template-mock-w:620px] sm:[--template-mock-h:400px] lg:[--template-mock-w:900px] lgx:[--template-mock-w:1040px]",
  size: "w-[360px] h-[300px] sm:w-[620px] sm:h-[400px] lg:w-[900px] lgx:w-[1040px]",
};

export function DescribeCard({
  plain = false,
  vertical = "default",
}: SceneProps = {}) {
  return (
    <>
      {/* A photograph behind this card only, scrimmed hard.
      
          The Describe card is the composer and nothing else, which left two
          thirds of it as bare grey — and of the three, it is the one whose
          subject is a person deciding what they want rather than a screen, so
          it is the one a picture can say something on.

          LIGHT runs it at full strength, no scrim at all. It went 86% then
          62% then none, and the direction was consistent the whole way: a
          white veil over a sunlit photograph takes the COLOUR out before it
          takes the detail out, so every step of scrim bought less separation
          than it cost in warmth, and at 86% what was left read as grey weather
          rather than as a room. The composer is a solid panel sitting on top
          and holds its own against the picture without help.

          NO SCRIM IN DARK EITHER, and that is a reversal. It carried one at
          45%, on the grounds that a bright sunlit frame beside two near-black
          cards is a lightbox rather than a card. That was true when it was
          true — but the other two grounds now flip with the theme (Plan to
          #FBFBF5, Build to Haze), so in dark this sits beside a paper card and
          a blue one, not two black ones. The reason for the scrim went away
          with them, and darkening a photograph costs the warmth that is the
          only reason to use one.

          absolute inset-0 against RailCard's own box, which is relative and
          overflow-hidden, so this fills the card and takes its radius without
          needing to know what that radius is.

          Decorative: empty alt, and no priority — it is well below the fold
          and must not compete with the hero for bandwidth.

          Named for its content rather than its slot, and that is not only
          tidiness: replacing a photograph at the SAME path ships new bytes to
          an unchanged URL, which the browser and Vercel's image optimiser both
          go on serving from cache. A new name is a new URL, so the swap
          actually reaches people. */}
      {/* -inset-px, not inset-0. The card box underneath paints --surface, and
          at fractional widths the rounding leaves a sub-pixel sliver of it
          along an edge — which in dark is #191919 against a near-black page
          and reads as a pale hairline drawn under the card. Over-covering by a
          pixel removes it; the parent is overflow-hidden, so the extra is
          clipped and the radius is unaffected. */}
      {!plain && (
        <div className="absolute -inset-px">
          <Image
            // The agency page's own still — someone at a laptop in warm late
            // light — in place of the phone-on-sofa shot the other pages
            // share. Landscape into a portrait card, so it is anchored right
            // of centre, where she sits, rather than cropped to the wall.
            src={
              vertical === "agency"
                ? "/images/mocks/describe-laptop.webp"
                : "/images/mocks/describe-phone.webp"
            }
            alt=""
            fill
            // A landscape photo in a portrait card is sized by the card's
            // HEIGHT, so it is drawn ~1.8x the card's width — at the card's
            // own width the optimiser served half the pixels and it came out
            // soft. The phone shot is near-square and fits its old size.
            sizes={
              vertical === "agency"
                ? "(min-width: 1024px) 760px, 165vw"
                : "(min-width: 1024px) 420px, 90vw"
            }
            quality={vertical === "agency" ? 90 : undefined}
            className={`object-cover ${vertical === "agency" ? "object-[68%_50%]" : ""}`}
          />
        </div>
      )}
      {/* The rail takes the PHONE box too, like Build beside it. Without it
          this scene fitted its 340x453 box into the square phone card at
          0.56 while Build ran at 0.88, so the sentence being typed came out
          at 7px next to a board at 10 — three cards, two sizes of UI. */}
      <Scene
        {...(plain
          ? {
              boxClass: PANEL_SCENE_PHONE.vars,
              boxSizeClass: PANEL_SCENE_PHONE.size,
            }
          : RAIL_SCENE_PHONE_PROPS)}
      >
        {/* Not WINDOW. This box is the same object as the hero's composer, so it
          wears the hero's treatment: the element's own hairline, a 3px band of
          the card's ground, then a second hairline — drawn as two spread
          shadows rather than a ring with an offset, so both lines and the gap
          between them are declared in one place and all three read tokens.
          The gap is --surface because that is the rail card this sits on, in
          both themes; a hardcoded grey would show the moment the theme flipped.

          WINDOW's drop shadow goes with it. A cast under the box and a double
          outline around it are two ways of saying the same thing, and on this
          card the cast was a grey smudge on the ground rather than a lift. */}
        {/* THE OUTER LINE IS THE BRAND RAMP, on the panel only — the same
            treatment the Add App mock's composer wears under "Build client
            apps and internal tools in one place". Both pictures are of the one
            box you type an app into, so the one place this family carries
            colour is that box, and it should be the same colour in both.

            It is the footer aurora's lime → mint → blue, running top to
            bottom. Painted as a 1px-padded gradient box rather than a
            border-image or a spread shadow, because neither of those takes a
            gradient and follows a radius — which is also why the double
            outline moved off the composer's own `shadow` and onto these two
            wrappers. The middle layer is --surface, the card's own ground, so
            what reads between the two lines is still the card showing through
            rather than a second border.

            The radii step with the layers: 10 inside (R_PANEL), +3 for the
            band, +1 for the line. Any other numbers and the three curves stop
            being concentric, which is the one way this effect reads as a
            mistake.

            THE RAMP TRAVELS ON HOVER, like the Add App one: the ring is
            painted at twice the box's height and parked at its top, so the
            band at rest is the lime→mint half of it; hovering the card slides
            the paint to its other end and the blue comes up. Nothing moves and
            nothing re-renders — it is one background-position. Keyed off
            `group/card` rather than the ring's own hover, because every other
            flourish on this card (the caret, the send button) answers the card
            and a ring that answered only itself would fire at a different
            moment from them.

            700ms and ease-out. This is decoration on a picture, and at the
            150ms a control would use it snapped — which asks to be noticed, on
            the one object the step is already pointing at.

            THE RAIL IS UNCHANGED. There the box sits on a photograph, where a
            band of --surface is a grey stripe over the picture rather than a
            gap in it; `contents` makes both wrappers vanish from the layout so
            that case is structurally exactly what it was. */}
        <div
          className={
            plain
              ? // Lifted 13px on a phone, where the panel's caption sits right
                // above the slot and a centred composer read as sitting low.
                "max-sm:-translate-y-[13px] rounded-[14px] bg-[linear-gradient(to_bottom,#d9ed92_0%,#9fd6c4_45%,#8ea2f4_100%)] bg-[length:100%_200%] bg-[position:0%_0%] p-px transition-[background-position] duration-700 ease-out group-hover/card:bg-[position:0%_100%] motion-reduce:transition-none sm:mb-auto sm:mt-[66px]"
              : "contents"
          }
        >
          <div
            className={
              plain ? "rounded-[13px] bg-[var(--surface)] p-[3px]" : "contents"
            }
          >
            <div
              // .mock-edge, the same lit border the hero's composer and the Live
              // screen beside it wear: a radial falling from the top-left corner into
              // the card's ground, painted into the border itself. This box is the
              // same object as the hero's composer, so it catches the light the same
              // way.
              //
              // Sized in PERCENT, like the hero's. The class defaults to a 540x400
              // ellipse, tuned to a 760px-tall screen; on a box this small the whole
              // border sits inside the bright end of it and comes out flat. At 120%
              // the ramp always ends a fifth past the right edge, whatever width the
              // rail gives the card.
              //
              // Dark only, which is where the class lives — in light the plain
              // --mock-line hairline already reads against the card.
              //
              // THE DOUBLE RING. A hairline, a 3px band of the ground, a second
              // hairline. It used to be dark-only, and the reason it was is worth
              // keeping: on the RAIL this box sits on a photograph, so a band of
              // --surface there is a grey stripe over the picture rather than a gap
              // in it, and the pair read as one fat border. That still holds, so
              // the rail is unchanged.
              //
              // The panel is the opposite case. There the composer sits on a plain
              // --surface card, so the band IS the card showing through — the eye
              // reads a gap, not a stripe, which is the whole trick — and it works
              // in light exactly as it does in dark. Both themes take tokens, so
              // neither can drift from the card behind it.
              // plain: the photograph is gone, so the composer takes the scene's
              // full WIDTH — it is the only thing left on the frame and at the
              // rail's width it read as a small panel adrift in an empty one.
              //
              // SIZED BY ITS CONTENT on the panel, not to a fixed height — the
              // same shape the Plan step's revise box has, which is what makes the
              // two steps read as the same control at two moments rather than two
              // different boxes.
              //
              // It was a fixed slab: 240 first, then 150, with the control row
              // pinned to the floor by mt-auto. Both left a band of empty white
              // between the sentence and the controls, which is the thing that
              // made the controls look too small for the box — they were being
              // measured against a box most of which was nothing.
              //
              // MOBILE CENTRES IT; ONLY THE DESKTOP PUSH IS ARITHMETIC.
              // `mb-auto` is `sm:` now, so below that the scene's own
              // justify-center places the box. Topping it out there was
              // measured against the CARD, and by that measure it was right —
              // the box sat within 10px of the card's middle. But the card
              // opens with a heading and a line of copy, so centring against
              // its full height spends the top on type and leaves the box
              // hugging it: 43px between the subtitle and the box, 134px of
              // empty grey below. The space a reader sees the box sitting in
              // is the part UNDER the header, and it belongs in the middle of
              // that.
              //
              // POSITION is still arithmetic. A box centred in the SCENE sits ~60px
              // below the centre of the PANEL, because the panel is a header plus
              // this scene and the header is all taken off the top. So it is topped
              // out and pushed down by `120 - height/2` — 120 being the distance
              // from the scene's content edge to the panel's middle. At 92px tall
              // that is 74. Re-measure it if the row ever grows a line.
              className={`mock-edge [--mock-edge-h:150%] [--mock-edge-w:120%] flex flex-col ${
                plain
                  ? // A STRONGER EDGE ON THE PANEL, via the three tokens the rule
                    // exposes (see .mock-edge). The shared ramp is tuned for a
                    // frame the size of a whole screen; on a box this small only
                    // its brightest corner is ever on screen, so the hairline came
                    // out close to flat and the composer — the one object this
                    // step is about — had the quietest edge in the panel. Lifted
                    // about two stops at the top of the ramp and left to meet the
                    // shared tail, so it is the same light, just further up.
                    //
                    // The rail keeps the default: there the box sits on a
                    // photograph rather than a --surface card, and a brighter edge
                    // over artwork reads as a glow around the box.
                    "[--mock-edge-1:#6e6e6e] [--mock-edge-2:#555555] [--mock-edge-3:#3e3e3e]"
                  : ""
              } ${plain ? `${R_PANEL} gap-[26px]` : R_WINDOW} border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE} ${
                plain
                  ? // py-6 against the rail's p-4. The box is sized by its content
                    // and at p-4 it measured 92px — a sentence and a control row
                    // with very little air around either, which on a 620px scene
                    // read as a control squeezed rather than a composer. The extra
                    // 16px goes above and below the pair, not between them.
                    //
                    // mt-[66px], down from 74, and the two numbers move together:
                    // the box is topped out and pushed to the panel's optical
                    // middle by `120 - height/2`, so a 16px taller box comes down
                    // 8px less. Re-measure both if the row ever grows a line.
                    // TOPPED OUT IN THE SCENE AT EVERY WIDTH; only the push down
                    // is `sm`-only.
                    //
                    // The offset below is arithmetic against the DESKTOP panel: a
                    // box centred in the scene sits ~60px under the centre of the
                    // panel, because the panel is a header plus this scene and the
                    // header comes off the top, so the box is topped out and
                    // pushed down by `120 - height/2`. None of those numbers hold
                    // on a phone — the header wraps to two lines and the scene is
                    // the 360x300 box, not 620x400 — so the same push put the
                    // composer near the floor with a third of the panel empty
                    // above it.
                    //
                    // Letting the scene's own `justify-center` centre it there was
                    // the first correction, and it was still wrong — just less so.
                    // The scene is only the LOWER part of the panel, so a box
                    // centred in it sits ~64px under the centre of the card: the
                    // header costs that much off the top and nothing below pays it
                    // back. Topping the box out is what actually centres it, and
                    // the arithmetic is a coincidence worth writing down — the
                    // scene's vertical slack (~121px) is almost exactly twice that
                    // offset, so moving the box to the top of the scene lands its
                    // middle within ~4px of the card's. The header is balanced by
                    // the scene's own foot.
                    // The double outline and the position now live on the two
                    // wrappers above (see the brand ramp there), because the outer
                    // line is a gradient and a box-shadow cannot take one. All
                    // this box keeps is its own padding and its own hairline.
                    // py-4 with a 26px gap, from py-6 with 10. The box is
                    // sized by its content, so where the sentence and the
                    // control row sit inside it is decided entirely by how
                    // that 104px is split between padding and the gap — and
                    // at 24/10/24 the two rows were a tight pair floating in
                    // the middle of the box, which is what a composer never
                    // looks like. A real one tops the sentence out and leaves
                    // the controls on the floor.
                    //
                    // 16/26/16 is the same 104px total, so the arithmetic that
                    // places the box in the panel (sm:mt-[66px] ≈ 120 -
                    // height/2, on the wrapper above) still holds and nothing
                    // below it moves. The sentence rises 8px and the control
                    // row drops 8px, which is the whole change.
                    "px-4 py-4"
                  : "overflow-hidden p-4 [[data-theme=dark]_&]:shadow-[0_0_0_3px_var(--surface),0_0_0_4px_var(--mock-line)]"
              }`}
            >
              <p
                className={`text-[color:var(--mock-ink)] ${plain ? CARD_BODY_PLAIN : CARD_BODY}`}
              >
                {/* The panel and the rail ask for DIFFERENT apps, and have to.
                These three scenes are one sequence — what you typed, what came
                back, what got built — so the prompt has to name the app the
                other two steps show. The panel's Plan and Build are now the
                calendar; /client-portal's rail still runs the project tracker
                through its own Plan and Build, and a prompt shared between them
                would be wrong on one page whichever app it named. */}
                {plain
                  ? "Add a shared calendar each client books their own time on."
                  : vertical === "accounting"
                    ? "Add a month-end close tracker each client sees for their own books."
                    : vertical === "agency"
                      ? "Add a project tracker each client sees for their own campaigns."
                      : "Add a project tracker each client sees for their own project."}
                {/* The site's own caret blink (--animate-caret, the one the
              hero typewriter uses). It BLINKS AT REST now rather than only
              while the card is hovered: a still caret parked after a finished
              sentence reads as a stray mark on the mock, where a blinking one
              says the field is live and someone is mid-thought. It is also the
              only moving thing in a picture that otherwise does nothing until
              it is hovered — which on a phone is never.
              No MOVE here — a transition-all fights the keyframes. */}
                <span
                  className={`ml-[1px] inline-block w-[1.5px] translate-y-[2px] bg-[var(--mock-ink)] motion-safe:animate-caret ${plain ? "h-[15px]" : "h-[14px]"}`}
                />
              </p>

              {/* The composer's control row, where the product puts it.

              The PANEL gets the product's full row — attach on the left, the
              model picker and send on the right — because at 580px wide there
              is room for it and an empty row under one sentence is the one
              thing a composer never looks like. The RAIL keeps send alone: its
              card is 300px and the same three controls there are a crowd.

              "Auto" rather than a model name. The product shows whichever
              model is selected, which on a marketing page means a mock that
              quietly goes out of date the next time the default changes — and
              nobody would think to come back here for that. Auto is the
              setting, not the model, so it stays true. */}
              <div
                className={`${plain ? "" : "mt-6"} flex items-center ${
                  plain ? "justify-between" : "justify-end"
                } gap-2`}
              >
                {/* Full ink on the attach control, not the soft step. It is an
                action, and the reference draws it as dark as the type above
                it; at --mock-ink-soft beside a near-black send button it read
                as disabled rather than quiet. */}
                {plain ? (
                  <span className="flex size-[22px] shrink-0 items-center justify-center text-[color:var(--mock-ink)]">
                    <IconPlus className="size-[13px]" />
                  </span>
                ) : null}
                <span className="flex items-center gap-2">
                  {plain ? (
                    // The word alone, no chevron — the same call the Add App
                    // mock's composer already made. A caret says "this opens",
                    // which in a still picture is a promise the picture cannot
                    // keep, and at 10px it read as a smudge beside the type rather
                    // than as a mark.
                    <span
                      className={`flex items-center ${R_CHROME} px-1.5 py-1 text-[color:var(--mock-ink-soft)] ${UI_PLAIN}`}
                    >
                      Auto
                    </span>
                  ) : null}
                  <span
                    className={`${MOVE} flex shrink-0 items-center justify-center ${R_CHROME} bg-[var(--mock-ink)] text-[color:var(--mock-window)] group-hover/card:scale-110 ${
                      plain ? "size-[22px]" : "size-[20px]"
                    }`}
                  >
                    <IconArrowUp
                      className={plain ? "size-[11px]" : "size-[10px]"}
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Scene>
    </>
  );
}

// ── 2. Plan ──────────────────────────────────────────────────────────────
// Hover approves it: the Approve button fills and the plan is marked settled.
// The plan as the product's own checklist card: a header carrying how far
// through it you are, divided rows each with a state, and one action across
// the foot. Settled requirements are ticked; the two still open are the ones
// the builder is asking about, which is what "asks a few questions" looks
// like on screen.
//
// Monochrome rather than the reference's blue — this page carries colour only
// in the --mock-* status chips.
// What the builder came back with, written as REQUIREMENTS rather than as
// labels.
//
// They were sentence fragments — "Due dates", "Email reminders", "Name,
// milestones, status" — which is a feature list, and a feature list is what
// you write before you know the answer. A plan states decisions: who sees
// what, which fields exist, what happens when. The card's caption promises
// "a plan you approve or edit", and you cannot approve "Due dates".
//
// FOUR, not five. The fifth was "Email reminder before due date", which is a
// notification setting rather than a decision about the tracker — and it made
// the list long enough that the card's last row sat against its bottom edge.
// The header counts off the array (DONE of PLAN_ITEMS.length), so dropping it
// moved the ring and the figure to 3 of 4 on their own.
//
// Each one answers something in the prompt on the Describe card beside it
// ("Add a project tracker each client sees for their own project"), because
// that is what makes the two cards read as one sequence rather than as two
// screenshots. Kept under ~35 characters: the row truncates, and the label has
// about 240px of the 340px design width to work in.
/** The accounting page's plan, answering its own prompt the same way. */
const PLAN_ITEMS_ACCOUNTING = [
  { label: "Each client sees only their own close", done: true },
  { label: "Your team sees every client", done: true },
  { label: "Track each close step and its status", done: true },
  { label: "Due date on each step", done: false },
];

/** The agency page's plan: campaigns, creative and launch dates. */
const PLAN_ITEMS_AGENCY = [
  { label: "Each client sees only their campaigns", done: true },
  { label: "Your team sees every client", done: true },
  { label: "Track deliverables and approvals", done: true },
  { label: "Launch date on each campaign", done: false },
];

const PLAN_ITEMS = [
  { label: "Each client sees only their own", done: true },
  { label: "Your team sees every project", done: true },
  { label: "Track name, milestones, status", done: true },
  { label: "Due date on each milestone", done: false },
];

/**
 * The header's progress ring.
 *
 * Matched to the pending row marks on BOTH counts, because matching only the
 * stroke was not enough: 1px on a 12px dot is 8.3% of its diameter and 1px on
 * a 20px ring is 5%, so the smaller circle read as the heavier one even
 * though the strokes were identical. Same 16px outer diameter, same 2px
 * stroke, same ratio.
 *
 * The viewBox is 16 so one user unit is one rendered pixel, and 2 is also the
 * stroke that makes the geometry exact: a stroke straddles its radius, so r 7
 * plus a 2 stroke lands the outer edge on 16. At 1 it stopped at 15, which is
 * part of why this ring read lighter than the row marks beside it.
 */
function Ring({ value }: { value: number }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 16 16" className="size-[16px] shrink-0 -rotate-90">
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        className={CIRCLE_STROKE}
      />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${c * value} ${c}`}
        className="stroke-[var(--mock-ink)]"
      />
    </svg>
  );
}

/**
 * THE CHECKLIST WINDOW, shared by the Plan and Onboard scenes.
 *
 * Extracted when the Onboard stage took the same picture: a titled header
 * with a progress ring and a count, then one ruled row per item, settled rows
 * ticked and dimmed. Two copies of sixty lines would have drifted the first
 * time either one's row padding was touched, and the two are deliberately the
 * SAME object — a plan and an onboarding checklist are both "a list of things
 * that get ticked off", and the page is stronger for them looking it.
 *
 * The caller supplies the title and the rows; everything else — the ring, the
 * two mark states, the hover — is fixed here.
 */
/**
 * The Assembly mark as a loading state: its three stepped bars, which light in
 * turn while the card is hovered — the builder at work — and sit as the plain
 * mark at rest. Keyed off `group/card`, the rail card's own hover, like the
 * other flourishes on these cards.
 */
const ASSEMBLY_BARS = [
  "M138.879 4.1366V17.6205C138.879 25.9122 132.143 32.638 123.829 32.638H100.325L131.815 1.21717C134.421 -1.38353 138.879 0.459594 138.879 4.1366Z",
  "M138.879 47.1379V70.5811C138.879 78.8728 132.143 85.5986 123.829 85.5986H47.2427L82.3575 50.5654C84.5565 48.3712 87.5379 47.1379 90.6489 47.1379H138.884H138.879Z",
  "M138.878 100.104V123.552C138.878 131.844 132.142 138.57 123.832 138.57H4.14569C0.460605 138.57 -1.38657 134.121 1.21984 131.521L29.2747 103.532C31.4737 101.338 34.4597 100.104 37.5707 100.104H138.888H138.878Z",
];

function AssemblyLoader() {
  return (
    // A 16px slot like the ring it replaces, so "Building…" keeps the rows'
    // label line; the mark is drawn smaller inside it.
    <svg
      viewBox="-30 -30 199 199"
      className="size-[16px] shrink-0 text-[color:var(--mock-ink)]"
      fill="currentColor"
      aria-hidden
    >
      {/* Bottom bar first: the mark builds up from its base. */}
      {[...ASSEMBLY_BARS].reverse().map((d, i) => (
        <path
          key={d}
          d={d}
          className="group-hover/card:animate-[asm-build_1.2s_ease-in-out_infinite] motion-reduce:!animate-none"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </svg>
  );
}

function ChecklistWindow({
  title,
  items,
  loader = false,
  className = "",
}: {
  title: string;
  items: { label: string; done: boolean }[];
  /** The Assembly mark in place of the progress ring. */
  loader?: boolean;
  className?: string;
}) {
  const done = items.filter((i) => i.done).length;
  return (
    <div className={`flex flex-col ${WINDOW} ${className}`}>
      {/* The header takes the well's tint. On --mock-window it was the same
            white as the rows under it, so the card opened on five identical
            bands and the one naming the thing had nothing marking it as the
            header — the rule under it was doing that job alone.

            A RUNG HIGHER IN DARK. --mock-well is #292929 against the window's
            #212121 — eight points, which is enough to separate a header from
            rows on a card where the window is the only object, and not enough
            once the window is a panel lying on a PHOTOGRAPH. There the whole
            thing reads as one dark rectangle on a bright picture and the
            eight-point step inside it disappears, so the list opened on five
            bands again. --mock-well-2 is #303030, fifteen points up, which
            holds the header apart at the distance the photograph now demands.

            Light is untouched: there the wells RECESS from the window, the
            step is read against a near-white panel, and nothing about the
            ground behind it changed. */}
      <div
        className={`flex items-center gap-2.5 border-b bg-[var(--mock-well)] px-4 py-3 [[data-theme=dark]_&]:bg-[var(--mock-well-2)] ${LINE}`}
      >
        {loader ? <AssemblyLoader /> : <Ring value={done / items.length} />}
        <span
          className={`flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
        >
          {title}
        </span>
        <span
          className={`shrink-0 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
        >
          {done} of {items.length}
        </span>
      </div>

      {items.map(({ label, done }) => {
        return (
          <div
            key={label}
            // Hover is per ROW, not per card. One row used to be marked as
            // "the one in play" — a tint and a heavier ring on the first
            // unsettled item — which picked a row out of a list where
            // nothing had been picked yet, and left the reader with a state
            // they could not change. Now the two open requirements look the
            // same as each other and the pointer is what lights one up.
            //
            // --mock-well-2, the solid well, not --mock-well: the faint one
            // is two percent off white and a hover nobody can see is not a
            // hover state.
            className={`flex items-center gap-2.5 border-b px-4 py-[11px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
          >
            {/* Two states, not three: filled with a check for settled, a
                dashed faint circle for everything still open. All of them
                share the 16px outer diameter, so the column lines up and no
                mark looks heavier than another. */}
            <span className="flex size-[18px] shrink-0 items-center justify-center">
              {done ? (
                <span className="flex size-[16px] items-center justify-center rounded-full bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
                  <IconCheck className="size-[10px]" />
                </span>
              ) : (
                <span
                  className={`size-[16px] rounded-full border border-dashed ${CIRCLE_TRACK}`}
                />
              )}
            </span>
            <span
              className={`min-w-0 flex-1 truncate ${UI_PRIMARY} ${
                done
                  ? "text-[color:var(--mock-ink-soft)]"
                  : "text-[color:var(--mock-ink)]"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function PlanCard({
  plain = false,
  vertical = "default",
}: SceneProps = {}) {
  // The agency and accounting pages run the build-in-progress version.
  const building = vertical === "agency" || vertical === "accounting";
  return (
    <>
      {/* The Plan card's ground — and the one ground in the set that DOES
          flip with the theme.

          #3A3A3A in light: the plan window is white there, so a dark card is
          what lifts it. It was #101010, which read as flat black beside the
          photograph on Describe and the haze on Build — three grounds, and the
          middle one was the only true black in the set. Grey keeps the lift
          the white panel needs (still ~14 points of separation) without the
          card itself becoming the darkest object on the page.

          Going lighter than this does not work: the panel is white, so a pale
          grey ground would need the panel restyled to stay visible at all.

          In dark the old ground put a #212121 panel on a #101010 card, eight
          points apart, and the one object the card is about became the hardest
          thing on it to find.

          #FBFBF5 in dark rather than repainting the panel. The panel is a
          product screen and themes with the product; the card behind it is
          artwork and can simply be the other value. Warm off-white rather than
          light's own #fcfcfd, so it reads as paper against a cold near-black
          page rather than as a light-mode card that escaped.

          The Describe and Build grounds stay fixed in both themes — a
          photograph and a flat tone have nothing to lose to a dark panel. */}
      {/* -inset-px, not inset-0. The card box underneath paints --surface, and
          at fractional widths the rounding leaves a sub-pixel sliver of it
          along an edge — which in dark is #191919 against a near-black page
          and reads as a pale hairline drawn under the card. Over-covering by a
          pixel removes it; the parent is overflow-hidden, so the extra is
          clipped and the radius is unaffected. */}
      {/* The vertical pages' Plan sits on a pale lime, in both themes, and
          shows the build in progress: a light ground the white panel reads on
          without restyling, and the Assembly mark as its loader. */}
      {!plain &&
        (vertical === "agency" ? (
          // The agency page's Plan sits on a photograph — a creative at work
          // — like Describe beside it.
          <div className="absolute -inset-px">
            <Image
              src="/images/mocks/sign-in-bg.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              quality={90}
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`absolute -inset-px ${
              building
                ? "bg-[#D1E59A]"
                : "bg-[#3A3A3A] [[data-theme=dark]_&]:bg-[#FBFBF5]"
            }`}
          />
        ))}
      {plain ? (
        // The standard box, not the wide one: with the nav and the window gone
        // there is no screen left to need a screen's width — two cards and a
        // measure of prose, which is what the shared 620 is for.
        <Scene
          boxClass={PANEL_SCENE_PHONE.vars}
          boxSizeClass={PANEL_SCENE_PHONE.size}
          // The card runs to the panel's bottom edge and is cut by it — see
          // footFlush, and the deeper foot ramp inside RequirementsPane.
          footFlush
        >
          <RequirementsPane />
        </Scene>
      ) : (
        // The PHONE box, as Describe and Build take — see the note on
        // Describe's Scene. One scale across the rail's three cards.
        <Scene {...RAIL_SCENE_PHONE_PROPS}>
          <ChecklistWindow
            title={building ? "Building…" : "Plan"}
            loader={building}
            items={
              vertical === "accounting"
                ? PLAN_ITEMS_ACCOUNTING
                : vertical === "agency"
                  ? PLAN_ITEMS_AGENCY
                  : PLAN_ITEMS
            }
          />
        </Scene>
      )}
    </>
  );
}

// ── 3. Build ─────────────────────────────────────────────────────────────
// The app that was planned, open in the TEAM's dashboard.
//
// It used to draw one client's own milestones inside the branded portal, on the
// grounds that "each client sees their own project" is what step 2 approved.
// True, but that plan has a second line — "your team sees all projects" — and
// this step's caption says the app lands in your dashboard AND portal. The hero
// at the top of the page already shows the portal side, so this shows the other
// half rather than a second picture of the same one. A roster of other firms
// inside one client's branded portal would have contradicted the plan outright,
// which is why the nav is the team's neutral one here, not the brand slab.
//
// Drawn as the board the product actually ships: three status columns, a card
// per project carrying whose it is, how far through it is, and what is next.
// The window is 760 wide against a card that shows about 420 of it, so the
// third column is cropped — which is what the bleed is for.
// ONE column, not three. The card shows 380px of the window and 136 of that is
// the sidebar, so a three-column board meant two columns cropped — and a column
// sliced down its length reads as a rendering fault, not as a board continuing.
// The one column that is left gets the whole width instead, which is enough for
// a project card to carry its client, its name and its progress at a readable
// size. A board is recognisable from one column; it is not recognisable from
// three slivers.
const BOARD = {
  name: "Active",
  count: 21,
  cards: [
    // Titles are written to FIT the column at the rail's shared type size.
    // They were a step longer, from when the board ran smaller type than the
    // cards beside it; back on one scale, two of them truncated mid-word, and a
    // truncated project name in a mock is just a smaller mistake than a second
    // type size.
    {
      who: "Lumen Analytics",
      initials: "LA",
      title: "Series B Data Room",
      done: 1,
      of: 4,
    },
    {
      who: "Cascade Outdoor",
      initials: "CO",
      title: "Catalog Launch",
      done: 1,
      of: 4,
    },
    {
      who: "Brookline Media",
      initials: "BM",
      title: "Media Strategy",
      done: 2,
      of: 5,
    },
  ],
};

/** The agency page's board: client campaigns, the hero's book of work. */
const BOARD_AGENCY = {
  name: "Active",
  count: 21,
  cards: [
    {
      who: "Cascade Outdoor",
      initials: "CO",
      title: "Spring Campaign",
      done: 2,
      of: 5,
    },
    {
      who: "Northwind Coffee",
      initials: "NC",
      title: "Brand Refresh",
      done: 1,
      of: 4,
    },
    {
      who: "Lumen Skincare",
      initials: "LS",
      title: "Q3 Paid Social",
      done: 3,
      of: 5,
    },
  ],
};

/** The accounting page's board: clients part-way through their close. */
const BOARD_ACCOUNTING = {
  name: "In progress",
  count: 18,
  cards: [
    {
      who: "Harbor Dental",
      initials: "HD",
      title: "September Close",
      done: 3,
      of: 5,
    },
    {
      who: "Northwind Logistics",
      initials: "NL",
      title: "Q3 Payroll Filing",
      done: 1,
      of: 4,
    },
    {
      who: "Cascade Outdoor",
      initials: "CO",
      title: "Year-end Adjustments",
      done: 2,
      of: 5,
    },
  ],
};

// ── The Requirements screen, which is what the PANEL's Plan step shows ────
//
// The rail on /client-portal keeps the four-item checklist below; this is the
// wide `plain` scene only, for the same reason the calendar is. A checklist is
// a picture of a plan; the product's actual plan step is a DOCUMENT you read
// and approve, with a composer under it for saying what to change. At the
// panel's width there is room to show that, and showing it is worth more than
// a tidier abstraction — "Approve or edit the plan before anything is built"
// is a promise about a control, and the control is now on screen.
//
// Everything here is about the same app the other two steps are about. The
// three scenes are one sequence: a calendar is described, planned, and built.

/** The requirements the builder came back with, for the calendar the Describe
    step asked for. Prose, not fragments — this is a document, and the thing
    being approved is the reasoning. */
const PLAN_DOC = {
  // Two lines, not three. The scene is 400 tall and the approve bar grew a row
  // when it gained its controls, which left the document 242px for 262px of
  // content and clipped the last flow — the one the whole app is for. The
  // sentence that went said the app is scoped per company, which flows two and
  // three already demonstrate rather than assert.
  overview:
    "A client-facing calendar app where your team schedules sessions and each client sees and books only their own.",
  // WRITTEN AS SENTENCES, not as arrow chains. Each flow used to be three
  // clauses joined by "→", which is notation: it reads as a diagram that
  // happens to be set in type, and at a wrapped line the arrow lands at the
  // start of the next row where it points at nothing. Plain connectives say
  // the same sequence and survive wrapping, which is what this column does
  // most of.
  flows: [
    "Internal user opens the app from the dashboard, sees the week across every client, and filters by company or status.",
    "Internal user clicks New event, picks a company, a time and a length, then publishes it to that client's calendar.",
    "Client opens the calendar in the client experience and sees their own events and the open slots for their company.",
    "Client books an open slot, gets a confirmation, and a reminder before it starts.",
  ],
  // The words in the flows above that name a PLACE OR A THING IN THE PRODUCT
  // rather than describing an action — the surfaces the app is being built
  // against. A dotted underline is what a plan does with those: it marks the
  // nouns it is committing to, the way a spec underlines a defined term, and
  // it reads as the document having been written rather than generated.
  //
  // Substrings, matched once each, in the shape faq.tsx already uses for its
  // answer links — the copy stays a plain sentence and the marks live beside
  // it, so neither has to be read through the other's markup.
  //
  // Deliberately ONE per flow. Two marks in a three-clause sentence and the
  // underline stops being a mark and becomes the texture of the paragraph.
  marks: ["dashboard", "New event", "client experience", "reminder"],
};

/**
 * The plan, as the CONVERSATION it arrives in: what you asked for, what came
 * back, and the box you answer in.
 *
 * It was the document and its approve strip alone, stacked in the middle of an
 * otherwise empty scene — right about the two objects, silent about where they
 * are. The product's plan step is a thread: the sentence from step one is still
 * on screen above the plan, the plan comes back as a reply, and the composer
 * under it is the same composer that sentence was typed into. That is what
 * "approve or edit the plan before anything is built" looks like in use — a
 * reply you can talk back to, not a form with a button on it.
 *
 * So four things down the scene: the prompt as a bubble, one line of reply, the
 * requirements card, the composer. The bubble carries the Describe step's own
 * sentence VERBATIM, which is what makes the three panels read as one session
 * rather than as three screenshots of one product.
 *
 * Still no sidebar and no window chrome. Where the plan LIVES is step three's
 * job; this step is only what the plan says and whether you accept it.
 */
function RequirementsPane() {
  return (
    <div className="flex size-full flex-col gap-2.5">
      {/* NO PROMPT BUBBLE AND NO COMPOSER. The scene used to run the whole
          exchange: the typed sentence as a bubble, the one-line reply, the
          requirements card, and the composer you would revise in.

          Four stacked objects left the card — the thing the step is actually
          about, the one with Approve on it — holding well under half the
          scene, and the conversation around it was saying what the Describe
          step above has already said. The card alone fills the box, the
          document inside it is legible at the size it is drawn, and the step
          still reads: here is the plan, approve it.

          This is now what BOTH widths show. The phone cut to the card alone
          for the same reason and had been carrying the better version of this
          scene since. */}
      {/* NO REPLY LINE. "Here's the plan. Approve it, or tell me what to
          change." was the sentence that made the card read as something that
          CAME BACK — which it needed while the typed prompt was on screen
          above it. With the prompt gone there is no exchange left for it to be
          the middle of, and it was narrating a card that says the same thing
          itself: it is headed Requirements and it has Approve on it. */}
      {/* NO TITLE. "Requirements" sat out here naming what the reply was
          sending, which is a job that existed while there was a reply: a
          prompt above, a sentence introducing the card, then the card. With
          the thread gone it was a label floating over a document that opens
          on its own heading two lines below it, and the scene read as two
          starts. The card is the whole scene now and needs no caption. */}
      {/* The card, and the mark saying it continues past the crop.

          Relative wrapper rather than one box, because the chevron straddles
          the card's bottom EDGE and the card is overflow-hidden — anything
          drawn inside it is clipped by the thing it is meant to hang off. */}
      <div className="relative min-h-0 flex-1">
        <div
          // SQUARE AT THE FOOT, and no bottom hairline. The card is cut by
          // the panel's edge rather than ending at it, and a rounded corner
          // is a statement that the object finishes here — two of them at the
          // cut turned the crop back into a card that just happens to stop
          // short. The bottom border goes for the same reason: a hairline
          // drawn across the cut closes the shape the ramp above it is
          // busy opening.
          // .mock-edge, so the top corner catches light instead of being a
          // flat hairline. It is the same treatment the composer on the
          // Describe step wears, which matters: these are two moments of one
          // sequence, and a lit edge on the first with a dead one on the
          // second reads as two different materials.
          //
          // THE RIGHT TOOL FOR A BORDERED BOX. .mock-lit-edge is the other
          // lit ring on this site and it could not be used here — it is an
          // ::after at inset 0, which on a box with a border is the PADDING
          // box, so it either draws a second hairline just inside this one or,
          // with the border made transparent, nests two radii a pixel apart.
          // .mock-edge paints the light INTO the border itself, so there is
          // only ever one line.
          //
          // Default ellipse (540x400), unlike the composer's percentage
          // sizing: that box is ~100px tall, where only the brightest corner
          // of the ramp would ever be on screen, so it had to be rescaled.
          // This panel is about the size the class was drawn for.
          //
          // Dark only, which is where the class lives — in light the plain
          // --mock-line hairline already reads against the card. The missing
          // bottom border is unaffected: the ramp is painted on the border box
          // and simply has no band to paint there.
          className={`mock-edge relative flex h-full flex-col overflow-hidden ${R_PANEL} rounded-b-none border border-b-0 bg-[var(--mock-window)] max-sm:mx-6 ${LINE}`}
        >
          {/* The action, in the card's own top-right corner — the corner the
              product puts a document's controls in, and where the eye goes
              once it has read the title above the card.

              Its own row rather than floated over the text: the document
              starts with a heading on the left, so an absolutely positioned
              button would be a control hovering beside "Overview" with
              nothing holding the two apart.

              A quiet button, not the page's primary. The point of this screen
              is that you can revise instead, so the control you are NOT being
              pushed towards must not be the heaviest object on it. */}
          {/* THE CARD'S OWN HEADER ROW ON A PHONE: the title on the left, the
              action on the right, ruled off from the document under it.

              The title lives OUTSIDE the card from `sm` up, where it reads as
              the reply naming what it is sending. On a phone the reply is gone
              — the thread and the composer are hidden — so an outside title
              had nothing to belong to and was hidden with them, which left the
              card opening on a button floating in white with no idea what it
              approved. Inside, on the row the button is already on, it costs
              no height at all and the card says what it is.

              The rule under it is what makes the pair read as a header rather
              than as the document's first line; it is the same hairline the
              card's own border draws, so nothing new is introduced. */}
          {/* Just the action now. The card carried a phone-only title on this
              row because the outside one was hidden below `sm`; the outside
              title is unconditional since the thread came out, so a second
              "Requirements" an inch under the first is all that row would add.
              The sm-only shape — ranged right, no rule under it — is the shape
              at every width for the same reason. */}
          <div
            className={`flex shrink-0 items-center justify-end gap-2 px-4 pb-0 pt-3`}
          >
            {/* IT ANSWERS THE CURSOR, like the rows in the other mocks do
                (ROW_HOVER above, same two tokens). The shot is a picture of a
                screen whose whole argument is that you can approve or revise
                before anything is built — and the control carrying that
                argument was the one object on the card that did not move when
                you pointed at it, which reads as a flat image of a button
                rather than as the button.
                --mock-well is one step off --mock-window in both themes, so
                this is a tone the screen already has. */}
            <span
              className={`flex shrink-0 items-center ${R_CHROME} border bg-[var(--mock-window)] px-3 py-1.5 text-[color:var(--mock-ink)] transition-colors hover:bg-[var(--mock-well)] ${UI_PRIMARY} ${LINE}`}
            >
              Approve
            </span>
          </div>

          {/* The document. It OVERFLOWS, and is meant to: the thread above and
              the composer below take about 130px of the 360 the scene has, so
              the last flow falls past the card's foot. That is the honest
              shape of a plan — it is longer than the window it is read in —
              and the fade and the chevron under it say so. Clipping it to fit
              would mean a four-flow plan that happens to end exactly where the
              card does, which no real one ever does. */}
          {/* Set like a document, not like a panel's contents: a wide inset
              either side, air between the blocks, and a list that hangs its
              bullets off the measure rather than butting them against it. The
              reference for this is any artifact card — the text sits in from
              the card's edges far enough that the card reads as paper around
              it. px-6 and not more: this card is ~400px of measure, and every
              pixel of inset is a pixel the sentences wrap in. */}
          {/* A CENTRED COLUMN inside the card, not the card's full width.
              px-6 alone ranged the document hard left against a card that is
              ~400px of measure, so the text filled every available pixel and
              the card stopped reading as paper with a document on it — it read
              as a pane whose contents had been poured in. Capped and centred,
              the two margins are equal and the card has a page in it. The cap
              is a max-width rather than more padding so it still fills the
              column at the narrower widths this scene is drawn at. */}
          <div className="mx-auto flex min-h-0 w-full max-w-[380px] flex-1 flex-col gap-2 px-6 pb-4 pt-2">
            <span className={`text-[color:var(--mock-ink)] ${PLAN_HEAD}`}>
              Overview
            </span>
            <p className={`text-[color:var(--mock-ink-soft)] ${PLAN_PROSE}`}>
              {PLAN_DOC.overview}
            </p>
            <span className={`mt-1 text-[color:var(--mock-ink)] ${PLAN_HEAD}`}>
              Core Flows
            </span>
            <ul className="flex flex-col gap-1.5">
              {PLAN_DOC.flows.map((f, i) => (
                <li
                  key={f}
                  className={`flex gap-2 text-[color:var(--mock-ink-soft)] ${PLAN_PROSE}`}
                >
                  {/* A DRAWN DOT, not the "•" character. At 11px the glyph
                      renders as a 1–2px speck whose size and vertical position
                      are the font's business rather than ours, and in this face
                      it sat low and read as a stray full stop. A 3px circle is
                      the same mark at a size we choose, and the wrapper box
                      gives it the line's own height so it centres on the FIRST
                      line of a flow that wraps to two rather than drifting with
                      the text. */}
                  {/* The line's own height, so the dot centres on a flow's
                      FIRST line — which means it tracks PLAN_PROSE's
                      line-height at both sizes: 14 x 1.6 on a phone, 13 x 1.6
                      from `sm`. Both numbers move with PLAN_PROSE. */}
                  <span className="flex h-[22.4px] shrink-0 items-center sm:h-[20.8px]">
                    <span className="size-[3px] rounded-full bg-current" />
                  </span>
                  <span className="min-w-0">
                    {markedFlow(f, PLAN_DOC.marks[i])}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The last 96px of the card, ramped to its own ground. A hard crop
              across a line of type reads as a rendering fault; a ramp reads as
              the page carrying on. Both stops are --mock-window, so it cannot
              drift from the card it is painted on in either theme.

              96 and not 40. At 40 the ramp was shorter than one wrapped flow,
              so a line went from full ink to nothing inside its own height and
              the dissolve read as a band laid over the text. Over 96 it
              crosses three lines, which is slow enough that no single line is
              visibly inside a gradient — the document just gets quieter until
              it is gone. Three stops rather than two, so the fade is already
              under way at the top of the ramp instead of holding full strength
              and then falling off a cliff at the midpoint. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent_0%,color-mix(in_srgb,var(--mock-window)_55%,transparent)_45%,var(--mock-window)_88%)]" />
        </div>

        {/* NO CHEVRON. It used to straddle the card's bottom edge — half on,
            half off — to say the document carried on past the crop. The card
            runs to the scene's own foot now, so there is nothing below for it
            to hang into: it would be a control cut in half by the edge of the
            picture. The foot ramp below says the same thing and is the part
            that was always doing the work. */}
      </div>
    </div>
  );
}

// ── The calendar app, which is what the PANEL's Build step shows ──────────
//
// The rail on /client-portal keeps the project board below; this is the wide
// `plain` scene only. Two reasons it is not shared. The board is one column of
// three stacked cards, drawn for a 244px pane, and at the panel's 884px that
// column had nowhere to go but wider — three cards with a progress bar running
// half a metre across an otherwise empty lane. A week grid is the opposite
// shape: it WANTS width, because width is days. And the rail's pane is 244px,
// where seven columns would be 30px each and the thing would stop being
// legible as a calendar at all.
//
// Drawn from the product's own calendar: the week range with its arrows, the
// Filters control and the Month/Week/Day segment, a seven-column grid under a
// day header, and the red now-line. No title bar, for the reason the board has
// none — the lit row in the nav an inch to the left already names the app.

/** 10am–7pm, at 38px a row.
    
    Ten rows is 380 against the ~300 the pane has under its toolbar and day
    header, and the overflow is deliberate: the window already bleeds off the
    scene's bottom edge, so the grid runs past the crop the same way the rest
    of the screen does. Sized to END there instead, it stopped 33px short and
    drew its own bottom border across an otherwise bleeding screen — a calendar
    that finishes at 5pm inside a window that doesn't finish at all. A full day
    would be 24 rows of 11px, which is a grid with no room for an event in it. */
const CAL_HOURS = [
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
];
const CAL_ROW_H = 38;
/** Hour 0 of the grid, so an event's `at` can be written as a clock time. */
const CAL_START = 10;

const CAL_DAYS = [
  { label: "SUN", date: 4 },
  { label: "MON", date: 5 },
  { label: "TUE", date: 6 },
  { label: "WED", date: 7 },
  { label: "THU", date: 8, today: true },
  { label: "FRI", date: 9 },
  { label: "SAT", date: 10 },
];

/**
 * The week's events. `day` indexes CAL_DAYS, `at` and `end` are 24h clock.
 *
 * The clients are the board's — Lumen, Cascade, Brookline — because this is the
 * same firm's workspace either way, and a calendar full of unrelated names
 * would read as a different company's screen.
 *
 * Titles are SHORT by necessity: the pane reflows with the breakpoint, so a
 * column is 119px at xl, 88px at lg and about 50px below that. They truncate
 * rather than wrap — at the narrow end the events read as blocks on a grid,
 * which is still unmistakably a calendar.
 */
/**
 * A hue per CLIENT, not per event — two meetings with the same company are the
 * same colour, which is the whole point of colouring a calendar.
 *
 * The --mock-gantt-* set, reused rather than extended. It is the one
 * categorical palette the mocks already have: four mid-tones that carry no
 * rank and exist to tell one engagement from the next, which is this job
 * exactly. Both themes define all four, so a client is the same hue in either.
 *
 * 1, 2 and 4 — teal, rose, indigo. Not 3, which is a purple sitting close
 * enough to 4's indigo that two clients a column apart would read as one.
 */
const CAL_HUES: Record<string, string> = {
  Lumen: "var(--mock-gantt-1)",
  Cascade: "var(--mock-gantt-2)",
  Brookline: "var(--mock-gantt-4)",
};

/**
 * A brighter set for a calendar shown on its own, where the event colours are
 * part of the picture rather than a quiet key on a busy card. Picked from the
 * event-colour picker calendars ship: teal, tangerine, blue, one per client,
 * far enough apart that no two read as one.
 */
const CAL_HUES_VIVID: Record<string, string> = {
  Lumen: "#2F9E8F",
  Cascade: "#E8763A",
  Brookline: "#4A86E8",
};

const CAL_EVENTS = [
  { day: 1, at: 10.5, end: 11.5, title: "Kickoff", who: "Lumen" },
  { day: 2, at: 12, end: 13, title: "Catalog review", who: "Cascade" },
  { day: 3, at: 11, end: 12, title: "Content sync", who: "Brookline" },
  { day: 5, at: 10, end: 10.75, title: "Design review", who: "Cascade" },
  { day: 4, at: 13, end: 14.25, title: "Client check-in", who: "Lumen" },
  { day: 5, at: 14, end: 15.5, title: "Media plan", who: "Brookline" },
];

/** Where the red line sits: 11:40 on the day marked today. */
const CAL_NOW = 11.67;
const CAL_NOW_DAY = 4;

/**
 * TWO DAYS ON A PHONE, seven from `sm` up.
 *
 * Below `sm` this scene is drawn into a 360px box, and a seven-day week in the
 * ~180px the pane has left after the nav is a 19px column — narrower than the
 * day label above it. See the count below for why it settled on two. The window used to just overrun the box instead, which
 * cut the week mid-column and took the toolbar off the top; it now fits the
 * box exactly (see the `w-[340px] h-[280px]` below), and three columns is what
 * that width holds at a size the events are still readable at.
 *
 * Days 3–4, not 0–2, because day 4 is the one marked today and carries the red
 * now-line — a calendar cropped to a stretch of week with no "now" in it is a
 * calendar of some other week. Both have events on them.
 *
 * TWO, DOWN FROM THREE. Three columns in the ~158px the pane has left came to
 * 48px each, where every event drew as "Desi…" — a calendar whose entries
 * cannot be read is a grid. Two is 79px, which sets the titles these events
 * actually have. The toolbar still names the week, as a phone calendar's does
 * while showing a day or two of it.
 *
 * Done by hiding columns rather than slicing CAL_DAYS: the events, the
 * now-line and the hour lines are all positioned by index into that array, so
 * a shorter array on one breakpoint would mean re-indexing all of them.
 */
const CAL_PHONE_FIRST = 3;
const CAL_PHONE_LAST = 4;
const calDayHidden = (i: number, display: "flex" | "block") =>
  i >= CAL_PHONE_FIRST && i <= CAL_PHONE_LAST
    ? ""
    : display === "flex"
      ? "hidden sm:flex"
      : "hidden sm:block";
/** The last VISIBLE column draws no right edge; the grid's own frame closes it. */
const calDayEdge = (i: number) =>
  i === CAL_DAYS.length - 1
    ? ""
    : i === CAL_PHONE_LAST
      ? `sm:border-r ${LINE}`
      : `border-r ${LINE}`;

export function CalendarPane({
  /** CAL_HUES_VIVID on a white ground, for a calendar that is the subject. */
  vivid = false,
}: { vivid?: boolean } = {}) {
  const gridH = CAL_HOURS.length * CAL_ROW_H;
  const y = (clock: number) => (clock - CAL_START) * CAL_ROW_H;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Toolbar: the week on the left, the controls on the right. */}
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 pt-2.5">
        {/* The week, with NO prev/next pair in front of it. At 9px the two
            chevrons were a pair of grey ticks the size of the punctuation
            beside them — too small to read as controls, and the first thing in
            the toolbar. A still picture cannot page a calendar anyway, so what
            they bought was the suggestion of a control the shot can never
            demonstrate, in the slot where the week's own name should start.
            The segmented Month/Week/Day control at the other end already says
            this view has controls on it, and that one is legible. */}
        {/* Soft ink, not full. The date names the view; the week under it is
            the subject. At full ink it was the darkest type on the screen and
            the first thing the eye landed on, which is the toolbar winning
            against the calendar. */}
        {/* A STEP DOWN ON A PHONE ONLY: 10.5px below `sm`, the UI_PRIMARY
            11.5 from there up. The toolbar loses its Month/Week/Day control at
            this width (just below), so the date is left as the only thing on
            the bar — and at the full step it then read as the shot's heading
            rather than as the label on a toolbar. One rung down puts it back
            beside the day names it belongs with. The class comes after
            UI_PRIMARY's own 11.5 from `sm`.

            NOT `${UI_PRIMARY} text-[10.5px]`. Both are plain utilities in the
            same layer, so which one wins is decided by the order Tailwind
            emits them, not by the order they appear in the string — written
            that way the token's 11.5 held at every width. The size is spelled
            out here and only `leading-none`, which nothing else sets, is
            carried over from the token. */}
        <span
          className={`whitespace-nowrap text-[10.5px] leading-none text-[color:var(--mock-ink-soft)] sm:text-[11.5px]`}
        >
          Oct 4–10, 2026
        </span>
        {/* HIDDEN ON A PHONE. Three segments in the ~200px the pane has left
            is a control nobody can read, and it was taking enough of the
            toolbar to break "Oct 4–10, 2026" onto two lines beside it — a
            date wrapping mid-phrase is a worse fault than a missing toggle.
            The week is the view either way; the control only says you could
            change it, which is a claim a still picture cannot demonstrate. */}
        <span className="hidden items-center gap-1.5 sm:flex">
          {/* The segmented control, the site's own shape: the picked segment is
              a raised white chip inside a filled track. */}
          <span
            className={`flex items-center gap-0.5 ${R_CHROME} bg-[var(--mock-well-2)] p-[2px] ${UI_SECONDARY}`}
          >
            {["Month", "Week", "Day"].map((v) => (
              <span
                key={v}
                className={`${R_CHROME} px-1.5 py-[3px] ${
                  v === "Week"
                    ? "bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
                    : "text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {v}
              </span>
            ))}
          </span>
        </span>
      </div>

      {/* The grid. One column for the hour gutter, seven for the week. */}
      <div className="mt-2 flex min-h-0 flex-1 flex-col px-3">
        {/* shrink-0 for the same reason the grid below carries it: the grid is
            deliberately taller than the space available, and a flex sibling
            without it is squashed to nothing — which is exactly what happened
            to this row, and a week view with no day names is just a table. */}
        <div
          className={`flex shrink-0 overflow-hidden rounded-t-[4px] border border-b-0 ${LINE}`}
        >
          {/* Day header. The gutter's cell is empty, which is what keeps the
              seven day columns aligned with the seven below them. */}
          {/* 34px under `sm`. The gutter is fixed and the day columns are
              flex-1, so every pixel it holds comes off them — and at 46 it was
              nearly as wide as a whole phone column. 34 still sets "11 AM" on
              one line. */}
          {/* GONE ON A PHONE, with the body's gutter below it. The two are one
              column and have to appear and disappear together, or the day
              names stop sitting over their own columns. */}
          <div
            className={`hidden w-[38px] shrink-0 border-r sm:block sm:w-[46px] ${LINE}`}
          />
          {CAL_DAYS.map((d, i) => (
            <div
              key={d.label}
              // TODAY IS THE WHOLE CELL, not a chip under the digit. A slab
              // behind the numeral alone was the heaviest object in the
              // header — a filled rectangle in a row of hairlines and grey
              // type — and it marked the date rather than the day. Tinting
              // the cell marks the column, which is what the header column
              // is for.
              //
              // --mock-well-3 and not --mock-well: the events in this column
              // are drawn on a well themselves, so at the first rung the
              // header and the block under it were close enough to read as
              // one shape running down the day. The third rung clears them.
              // DARK STEPS BACK A RUNG. The third rung is right in light,
              // where the wells are near-white and the whole set sits inside
              // four points of each other. In dark they are 17 points apart
              // and --mock-well-3 #3a3a3a against the #212121 window is the
              // brightest surface in the mock — the day header read as
              // selected rather than as today. --mock-well-2 #303030 still
              // clears the events drawn on --mock-well beneath it, which is
              // the whole reason this is not the first rung.
              className={`min-w-0 flex-1 flex-col items-center gap-[3px] py-1.5 ${
                d.today
                  ? "bg-[var(--mock-well-3)] [[data-theme=dark]_&]:bg-[var(--mock-well-2)]"
                  : ""
              } ${calDayHidden(
                i,
                "flex",
              )} ${i >= CAL_PHONE_FIRST && i <= CAL_PHONE_LAST ? "flex" : "sm:flex"} ${calDayEdge(i)}`}
            >
              <span
                className={`text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
              >
                {d.label}
              </span>
              {/* The digit. Its emphasis is the cell's tint plus full ink —
                  see both below. What follows is the history of the mark
                  itself, kept because each step was a wrong turn worth not
                  repeating.

                  A SQUARISH OUTLINE, not a filled circle. The disc was the
                  heaviest object in the whole shot — a solid near-black dot in
                  a header of hairlines and grey type, so the eye landed on a
                  date rather than on the week of events the card is about. An
                  outline marks the same day and weighs what the rest of the
                  header weighs. Square-ish, because every other selected thing
                  in this set is a rounded rectangle (the Week chip two inches
                  to its right, the chrome buttons, the cards) and a circle was
                  the one shape here from a different vocabulary.

                  R_CHROME, the set's own small radius, so it matches that Week
                  chip exactly rather than being a third corner size.

                  18px. The digit measures centred to within a quarter of a
                  pixel, so this was never an alignment fault — an 11.5px
                  numeral in a 15px box simply fills nearly all of it, and a
                  glyph with no room around it reads as cropped whatever its
                  centring says. 18 puts a ring of ground back.

                  tabular-nums so 8 and 10 set to one width: the header is seven
                  columns of digits and proportional figures make the marks sit
                  on slightly different centres across the row. */}
              <span
                // NO BOX ON A PHONE. The marker is right at the width it was
                // drawn for; in a 51px column it is the heaviest object in the
                // shot — a near-black rectangle under a grey day label, which
                // swamps the column rather than reading as today. Below `sm`
                // today is simply the digit in full ink, and the red now-line
                // in its column is the other half of the marking, which no
                // other day has.
                // NO FILL OF ITS OWN. The cell behind it carries the mark; a
                // chip inside a tinted cell would be marking today twice, in
                // two different languages, an eighth of an inch apart. Full
                // ink against the soft-ink day labels is the whole difference
                // the digit needs to make.
                className={`flex size-[18px] items-center justify-center tabular-nums ${UI_PRIMARY} ${
                  d.today
                    ? "text-[color:var(--mock-ink)]"
                    : "text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {d.date}
              </span>
            </div>
          ))}
        </div>

        {/* shrink-0: it is TALLER than the pane on purpose (see CAL_HOURS), and
            a flex child without it would be squashed back to the space left.
            No bottom border and no bottom radius, because there is no bottom —
            the window's own crop is the edge. */}
        <div
          className={`flex shrink-0 overflow-hidden border border-b-0 ${LINE}`}
          style={{ height: gridH }}
        >
          {/* Hour gutter.
          
              46px, up from 34. "12 PM" sets 28.5px wide and the labels are
              flush right with a 4px gutter, which left half a pixel between the
              widest of them and the grid's own left border — close enough to
              touching that the column read as clipped rather than as right
              ranged. 46 gives every label a clear 13px.

              Centred ON the hour line, not offset by a guessed number of
              pixels: -translate-y-1/2 halves whatever the label's own box turns
              out to be, where the -4px it used to carry was half of a 10.5px
              line rounded down, and drifted the moment the type size moved. */}
          {/* GONE ON A PHONE. At 38px the gutter was taking a sixth of the
              visible grid to label hours nobody reads off a picture — the
              shot's subject is the two events sitting in the week, and the
              hour lines still say what shape a day is without a number beside
              each one. The day columns take the width back, which is what
              makes the two blocks wide enough to read their own titles.

              `sm:block`, not `sm:flex`: the labels inside are absolutely
              positioned against this box, so it only has to be a block for
              `relative` to mean anything. */}
          <div
            className={`relative hidden w-[38px] shrink-0 border-r sm:block sm:w-[46px] ${LINE}`}
          >
            {CAL_HOURS.map((h, i) => (
              <span
                key={h}
                // whitespace-nowrap: the labels are absolutely positioned but
                // still wrap to the gutter's width, and at the phone's narrower
                // gutter "12 PM" broke onto two lines — a stack of digits down
                // the side of a calendar.
                className={`absolute right-1.5 -translate-y-1/2 whitespace-nowrap tabular-nums text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                style={{ top: i * CAL_ROW_H }}
              >
                {i === 0 ? "" : h}
              </span>
            ))}
          </div>

          {CAL_DAYS.map((d, dayIndex) => (
            <div
              key={d.label}
              className={`relative min-w-0 flex-1 ${calDayHidden(
                dayIndex,
                "block",
              )} ${calDayEdge(dayIndex)}`}
            >
              {/* The hour lines, drawn per column rather than as one band
                  behind the grid, so a column's events paint over its own
                  lines and not over its neighbour's. */}
              {CAL_HOURS.slice(1).map((h, i) => (
                <span
                  key={h}
                  className={`absolute inset-x-0 border-t ${LINE}`}
                  style={{ top: (i + 1) * CAL_ROW_H }}
                />
              ))}

              {CAL_EVENTS.filter((e) => e.day === dayIndex).map((e) => (
                <span
                  key={e.title}
                  // COLOURED BY CLIENT — see CAL_HUES. The blocks were
                  // monochrome, a grey fill with a dark rule down the leading
                  // edge, which is the SHAPE of a calendar entry but not the
                  // information one carries: six identical grey blocks say
                  // "there are meetings" where the card's claim is that the
                  // week is legible per client at a glance.
                  //
                  // The hue goes in two places, at two strengths. The leading
                  // rule takes it at full value, where 2px of saturated colour
                  // is what the eye picks up scanning down a column; the fill
                  // takes 18% of it mixed into the ground it already had, so
                  // the block is tinted rather than coloured and the title on
                  // it is still reading against --mock-well-2 and not against
                  // a hue. color-mix rather than a prepared token per client,
                  // because both operands are theme-scoped — the mix lands on
                  // each theme's own ground with each theme's own hue, and no
                  // value is written down twice.
                  className={`absolute inset-x-[2px] overflow-hidden ${R_CHROME} ${
                    vivid
                      ? "bg-[color-mix(in_srgb,var(--cal-hue)_16%,var(--mock-window))]"
                      : "bg-[color-mix(in_srgb,var(--cal-hue)_18%,var(--mock-well-2))]"
                  } pb-[3px] pl-1.5 pr-1 pt-[3px]`}
                  style={
                    {
                      top: y(e.at) + 1,
                      height: y(e.end) - y(e.at) - 2,
                      // A FLOOR, because duration alone does not guarantee the
                      // block can hold its own two lines. At CAL_ROW_H 38 an
                      // hour is 36px and the title/client pair needs 26, so
                      // most events have room to spare — but the 45-minute one
                      // (Design review) comes out at 26.5px, which is the two
                      // lines and half a pixel under them. The block read as
                      // having its copy pushed against the bottom edge.
                      //
                      // 32 = 3px + 10.5 + 2 + 10.5 + 3px: the pair with the
                      // same breathing room above and below. It costs about
                      // five minutes of apparent length on the shortest block
                      // — nothing else on that day is near it, so no event
                      // gains an overlap it does not have — and a mock whose
                      // shortest entry can be read is worth more than one
                      // whose grid is exact to the pixel.
                      minHeight: 32,
                      "--cal-hue":
                        (vivid ? CAL_HUES_VIVID : CAL_HUES)[e.who] ??
                        "var(--mock-ink)",
                    } as React.CSSProperties
                  }
                >
                  <span className="absolute inset-y-0 left-0 w-[2px] bg-[var(--cal-hue)]" />
                  <span
                    className={`block truncate text-[color:var(--mock-ink)] ${UI_SECONDARY}`}
                  >
                    {e.title}
                  </span>
                  <span
                    className={`mt-[2px] block truncate text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                  >
                    {e.who}
                  </span>
                </span>
              ))}

              {/* The now-line. The one red thing on the page, and it earns it:
                  it is the only mark here that means "this is live" rather
                  than naming something. Fixed red in both themes — it is a
                  product signal, like the mark on the brand slab. */}
              {dayIndex === CAL_NOW_DAY ? (
                <span
                  className="absolute inset-x-0 z-10 h-px bg-[#e5484d]"
                  style={{ top: y(CAL_NOW) }}
                >
                  <span className="absolute -left-[2px] -top-[2px] size-[5px] rounded-full bg-[#e5484d]" />
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The nav beside the board.
 *
 * Six stock rows and then the app. It was three, on the argument that a
 * billing row pulls toward a different part of the product than the card is
 * about — but that reasoning only held while the nav was short enough to read
 * as a sketch. At three rows the rail was mostly empty under them, and a
 * portal whose whole claim is that it holds the client relationship showed a
 * client a home, a chat and a folder. The money rows are the ones a reader
 * scans for, and their absence was louder than their presence.
 *
 * ORDERED BY THE ENGAGEMENT, not alphabetically: a proposal is accepted, a
 * contract is signed, an invoice is paid. That is the same order the Transact
 * stage states in its own copy a few cards along, so the mock and the sentence
 * agree.
 *
 * The glyphs are the padded (-4 -4 28 28) product set, so they carry the same
 * optical weight as Home/Messages/Files beside them — IconDocument was the
 * obvious pick for Proposals and is the SAME path as IconFile, which would
 * have put two identical marks in one rail. */
/** Ledgerline's client nav: the stock rows plus what an accounting firm adds. */
const TEAM_NAV_ACCOUNTING = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconPenFilled />, label: "Engagements" },
  { icon: <IconCreditCard />, label: "Invoices" },
];

/**
 * Bloomhouse's client nav: the stock rows, then the apps the hero shows. Their
 * short names here — "Creative approvals" truncated in this 136px rail — on
 * the hero's glyphs, so the two still read as the same apps.
 */
const TEAM_NAV_AGENCY = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconCreditCard />, label: "Invoices" },
  { icon: <IconPenNib />, label: "Briefs" },
  { icon: <IconMegaphone />, label: "Approvals" },
];

const TEAM_NAV = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconDocuments />, label: "Proposals" },
  { icon: <IconPenFilled />, label: "Contracts" },
  { icon: <IconCreditCard />, label: "Invoices" },
];

/**
 * One project on the board.
 *
 * Three lines and no more: what it is, whose it is, how far through it is. It
 * carried a fourth — the next task and its date, on a divided footer — and at
 * this card's width that row was the first thing the crop cut, so every card
 * ended on half a sentence behind a fade. The board's job here is to be
 * recognisably a board, not to be read.
 *
 * The client used to lead and the project name sat under it. That put the
 * qualifier above the thing it qualifies, so the eye met a small grey line,
 * then dropped onto a larger bright one — and a card that gets BIGGER as you
 * read down it reads as having no hierarchy at all, which is the half-step
 * between these two sizes being spent backwards. Name first and the same two
 * sizes read as a heading with its byline under it.
 */
/**
 * The default-avatar tints, one per record. Written out rather than built from
 * the index, because Tailwind reads the source as text and never emits a class
 * it cannot see. Three, cycled — the board shows three cards, and a fourth
 * would start the set again rather than introduce a hue nobody chose.
 */
const AVATAR_TINT = [
  "bg-[var(--mock-avatar-a-bg)] text-[color:var(--mock-avatar-a-fg)]",
  "bg-[var(--mock-avatar-b-bg)] text-[color:var(--mock-avatar-b-fg)]",
  "bg-[var(--mock-avatar-c-bg)] text-[color:var(--mock-avatar-c-fg)]",
];

function ProjectCard({
  who,
  initials,
  title,
  done,
  of,
  lead = false,
  tint = 0,
}: {
  who: string;
  initials: string;
  title: string;
  done: number;
  of: number;
  /** The one card whose bar advances on hover — see the card's hover move. */
  lead?: boolean;
  /** Which identity tint this record's avatar wears. See AVATAR_TINT. */
  tint?: number;
}) {
  return (
    <div
      className={`overflow-hidden ${R_CHROME} border bg-[var(--mock-window)] px-2 py-[7px] ${LINE}`}
    >
      {/* Stepped back in dark. --mock-ink is #ededed there, so a column of
          project names was the brightest type on the card — brighter than the
          nav beside it and the page's own headline above it. Light's #101114
          on a near-white card is an ordinary reading contrast and keeps it. */}
      <p
        className={`truncate text-[color:var(--mock-ink)] [[data-theme=dark]_&]:text-[#b8b8b8] ${UI_PRIMARY}`}
      >
        {title}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        {/* The client's initials on a tile — the default avatar a record gets
            before anyone uploads a logo, which is most of them.

            A COLOUR PER RECORD, which is what a default avatar is for. It was
            --mock-ink/10 on every card, so the column read as three identical
            grey squares: the one element on the board whose job is to tell one
            client from the next was the one element that made them look the
            same. Every product that draws initials picks a hue per record for
            exactly this reason.

            The tints are their own family rather than the status pills reused
            — a green avatar would read as a finished project. See
            --mock-avatar-* in globals.css. */}
        <span
          className={`flex size-[18px] shrink-0 items-center justify-center ${R_CHROME} text-[9.5px] leading-none ${AVATAR_TINT[tint % AVATAR_TINT.length]}`}
        >
          {initials}
        </span>
        <span
          className={`min-w-0 flex-1 truncate text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
        >
          {who}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--mock-well-2)]">
          <span
            className={`block h-full rounded-full bg-[var(--mock-ink)] ${
              lead ? `${MOVE} group-hover/card:w-[62%]` : ""
            }`}
            style={{ width: `${(done / of) * 100}%` }}
          />
        </span>
        <span
          className={`shrink-0 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
        >
          {done}/{of}
        </span>
      </div>
    </div>
  );
}

export function BuildCard({
  plain = false,
  vertical = "default",
}: SceneProps = {}) {
  // Ledgerline only off the panel: the wide `plain` scene is the calendar,
  // which no vertical changes.
  const ledgerline = vertical === "accounting" && !plain;
  const bloomhouse = vertical === "agency" && !plain;
  const board = ledgerline
    ? BOARD_ACCOUNTING
    : bloomhouse
      ? BOARD_AGENCY
      : BOARD;
  return (
    <>
      {/* The Build card's ground, the third of the set — the Describe card
          carries a photograph and the Plan card a lime-on-black gradient, so
          this one being the rail's plain --surface left it reading as the
          unfinished one.

          A flat tone rather than a picture, and that is the point: this card's
          subject is a whole portal screen with its own sidebar, board and
          white panels, which is already the busiest of the three. It needs a
          ground to sit on, not something else to look at.

          It flips with the theme, like the Plan card's ground beside it. The
          portal screen on top of it is a product screen and themes with the
          product — near-white in light, near-black in dark — so a fixed ground
          can only serve one of them.

          BOTH THEMES NOW GET THE RAMP, not a flat tone. Dark had Haze and
          light had #CFCFCF, a neutral grey chosen only to lift a white screen
          — which it did, and said nothing while doing it: the one card in the
          rail that is a whole brand surface was brand-coloured in one theme
          and plain grey in the other. The ramp is the same run the hero and
          the frictionless thread card take, Haze down to lime, so a reader
          moving down the page meets one surface rather than three ideas of
          one.

          It still lifts the screen in both: the screen sits in the ramp's top
          half, where it is Haze against a near-white portal in light and
          against a near-black one in dark.

          Describe is the exception: a photograph has its own light and
          nothing to lose to the panel in front of it, so it stays fixed. */}
      {/* -inset-px, not inset-0. The card box underneath paints --surface, and
          at fractional widths the rounding leaves a sub-pixel sliver of it
          along an edge — which in dark is #191919 against a near-black page
          and reads as a pale hairline drawn under the card. Over-covering by a
          pixel removes it; the parent is overflow-hidden, so the extra is
          clipped and the radius is unaffected. */}
      {!plain && (
        // The comparison pages' grained brand panel, so the rail's picture
        // grounds match theirs.
        <div
          className="absolute -inset-px"
          style={{ backgroundImage: PANEL_BG }}
        />
      )}
      {/* fadeFrom 100 — the right-edge fade is OFF for this card. That ramp
          exists to dissolve art that overruns the card, and nothing overruns it
          any more: the window is drawn at exactly the width the card shows.
          With a single column the fade had nothing to soften and everything to
          spoil, dimming the only column on screen from 82% of its width on. */}
      <Scene
        bleed
        fadeFrom={100}
        {...(plain
          ? {
              boxClass: PANEL_SCENE_WIDE.vars,
              boxSizeClass: PANEL_SCENE_WIDE.size,
            }
          : // The phone box, like the other rail cards — see RAIL_SCENE_PHONE.
            // It matters more here than anywhere: this card's whole idea is a
            // screen running off the card's right edge, and letterboxed into a
            // square slot it could not reach that edge, so the one card built
            // to be a crop was the one that read as a framed picture.
            //
            // It is a BLEED scene, so the 113px the box loses on a phone comes
            // off the TOP rather than off the middle — the window is pinned to
            // the foot. That is the right end to lose it: the board's rows
            // carry on down past the cut either way, and the sidebar's own
            // header stays inside what is left.
            RAIL_SCENE_PHONE_PROPS)}
      >
        {/* 320 wide, which is exactly what the card shows — the scene is 340 and
          the bleed insets it by 20. So the board is cropped on the BOTTOM only,
          where a cut row still reads as a list continuing, and not on the right,
          where a cut column read as a mistake.

          The sidebar is 136 — narrower than the 150 the other mocks carry,
          because every pixel it takes comes off the board, but not the 110 it
          was: at 110 it truncated its own labels ("Brandmag…", "Project t…"),
          and a nav that cannot show its words is worse than a narrower board. */}
        {/* 412 tall, up from 372. The bleed pins the scene to the BOTTOM of the
          453 box, so the window's height is what decides where its top edge
          lands — and at 372 it started about sixty pixels down, leaving a band
          of bare card above a screenshot that is the card's whole subject. At
          412 it begins just under the scene's own top padding, so the window
          reads as filling the frame rather than floating in it. */}
        {/* 380 WIDE, up from 320, and the extra 60 all goes to the board.
          The sidebar is fixed at 136, so widening the window is the only way to
          give the lane more room — and the window already runs off the card's
          right edge (rounded-tr-none, border-r-0), so the cost is simply that
          the crop falls further right. Nothing new is hidden: what gets cut is
          the empty right half of a lane that was already cut.

          It buys the project cards about a third more measure, which is the
          difference between titles written to fit and titles that fit. */}
        <div
          // plain: the scene is landscape and there is no ground behind the
          // window any more, so a 380-wide screen left a third of the frame as
          // bare panel to its right and the step's own subject reading as a
          // narrow column. 540x380 is the scene inside its padding, so the
          // window fills it — the sidebar is fixed at 136, so every one of the
          // extra pixels goes to the board, which is the part worth seeing.
          // plain: sized in CLASSES, not inline, because the box behind it
          // steps at lg (see PANEL_SCENE_WIDE) and the window has to step with
          // it — 20px of scene padding on the left and top, nothing on the
          // right or bottom, which is where it bleeds off.
          // WIDTH IN CLASSES BELOW sm, because the phone needs a different
          // one. The fit rule centres the scene (left:50% + translate), so a
          // window wider than its design box overflows BOTH sides equally —
          // fine at 380 in a 340 box with the dark rail absorbing the left
          // crop, and wrong once the rail is hidden on a phone and the box
          // drops to 290: the board's own titles were being cut on the left.
          //
          // 340 in a 290 box overflows 50, so 25 a side; the translate puts
          // all 50 on the right. The window then starts at the box's left edge
          // and runs off the right, which is the crop the card wants and the
          // only one it should have.
          //
          // The same correction applies from sm, where the box is 340 and the
          // window 380: 40 of overflow, 20 a side, so a 20px shift puts all of
          // it on the right. It was translate-x-0 there, which left the window
          // cropped on BOTH sides — a left crop with no rail behind it to
          // absorb it, and a right edge that stopped short of the card.
          style={plain ? undefined : { height: 412 }}
          // The TOP-LEFT is the only corner this window has: it bleeds off the
          // right and the bottom, so three of its corners are crops. That one
          // visible corner carries the whole window's shape, and at the chrome
          // step (4px) on a 380px-tall screen it read as a square cut — the
          // dark sidebar met the ground at what looked like a right angle. It
          // takes the panel step instead, the biggest in the scale, because it
          // belongs to the biggest object.
          // A PLAIN BORDER, NOT .mock-lit-edge. The lit ring is a ::after at
          // `inset: 0`, which on a bordered box is the PADDING box — so using
          // it here meant either two hairlines side by side (the ring beside
          // the border) or, with the border made transparent to stop that, a
          // box whose outer curve is 10px while `overflow: hidden` clips the
          // children at 9px. Two radii a pixel apart do not nest: at the
          // top-left the near-black sidebar stopped short of the curve and
          // read as a black line hooked around the corner.
          //
          // The ring buys a dark-mode highlight on one edge. It is not worth a
          // corner artifact in light to get it, and --mock-line states the
          // edge in both themes the way the rest of the mock family does.
          // .mock-lit-edge is untouched for the frames that carry no border of
          // their own — there it is the only edge and nothing nests inside it.
          // THE RIGHT SIDE CLOSES FROM `sm`. The window used to run off the
          // panel's right edge, so its top-right was a crop and a border there
          // would have been a line drawn across open artwork. The panel centres
          // the scene from `sm` now (see builder-how-it-works), which puts that
          // edge back inside the card where it can be seen — and a square
          // corner with no border on a screen whose other three corners are
          // finished reads as the shot having been cut, not as it continuing.
          // Below `sm` it still bleeds and still ramps out, so the crop stays.
          // THE PANEL'S WINDOW WEARS .mock-edge, the lit border the Describe
          // composer and the Plan document carry beside it, so all three steps
          // catch light the same way in dark. Dark-only and unlayered, so it
          // takes over the transparent border below without touching light.
          // NO HAIRLINE IN LIGHT. WINDOW carries one so a white screen can be
          // told from a white page, which is right for every scene whose card
          // is near-black — there the line never shows. This card is the one
          // with a LIGHT ground, and on it the #e8e9ec rule read as a pale
          // outline drawn around the shot: a mount, not an edge. The window's
          // own white already separates it from the grey it sits on.
          // Transparent rather than border-0, so the 1px stays in the box and
          // nothing inside shifts. DARK GOES WITHOUT IT TOO: the card's ground
          // is the light Haze-to-lime ramp in both themes now, so dark's
          // --mock-line hairline drew a black outline round the shot there,
          // the same mount light had and lost.
          //
          // background-clip IS THE OTHER HALF OF IT, and without it the fix
          // made things worse. A transparent border is not a gap: by default
          // the element paints its own background under the border box, so the
          // 1px simply showed --mock-window instead of --mock-line — a grey
          // hairline became a WHITE one, which is brighter against this card's
          // grey ground than the rule it replaced. Clipping the background to
          // the padding box leaves the border area genuinely empty, so the
          // card's own ground shows through and there is no line at all.
          className={`flex shrink-0 ${plain ? "mock-edge" : "w-[340px] translate-x-[25px] sm:w-[380px] sm:translate-x-[20px]"} ${WINDOW} ${R_PANEL} rounded-b-none rounded-tr-none border-transparent [background-clip:padding-box] border-b-0 border-r-0 sm:rounded-tr-[10px] sm:border-r ${
            plain
              ? // 340x280 ON A PHONE, which is the 360x300 box exactly minus
                // the scene's own 20px top and left padding — so the window
                // lands flush on the box's right and bottom edges and nothing
                // is cropped. It used to keep the desktop 600x380 here and
                // simply overrun: the week was cut mid-column on the right,
                // and because a bleed scene is pinned to the FOOT of its box
                // the 80px it overran vertically came off the TOP, taking the
                // toolbar — the date and the Month/Week/Day control — with it.
                // From `sm` the window is the box MINUS 40: the scene's own
                // 20px left pad, and 20 left over on the right to answer it.
                // The bleed frame only pads the left (`pl-5 pt-5`), which is
                // correct while the window runs off the right edge — there is
                // no right side to pad. Now that the slot is centred and the
                // window's right side closes, that lone left pad was the whole
                // of the remaining 20px lean, so the window gives it back.
                // 620→580, 900→860, 1040→1000.
                //
                // `lg` was also a rung behind before this (800 in a 900 box),
                // and the 80px of bare box it left was enough to throw the
                // scene visibly off-centre on its own. `lgx`, not `xl`: the box
                // steps at lgx (PANEL_SCENE_WIDE), and a window stepping at a
                // different breakpoint from its own box is how that got in.
                //
                // The PHONE step stays flush at 340 in its 360 box. It still
                // bleeds off the right and ramps out into the panel, so there
                // the left pad is doing its job and nothing answers it.
                "h-[280px] w-[340px] sm:h-[380px] sm:w-[580px] lg:w-[860px] lgx:w-[1000px]"
              : ""
          }`}
        >
          <div
            // 124 ON A PHONE. The rail is fixed, so every pixel it takes comes
            // off the week beside it — in a 340px window 136 left the three day
            // columns at 45px, where the event titles came out as "Desi…".
            //
            // 116 was tried first and went one step too far: the rail's own
            // padding takes 16, the name row's another 12, and the mark and its
            // gap 20, which left 68px for "Brandmages" — about two short, so
            // the workspace name itself truncated. A nav that cannot set its
            // own name is a worse trade than a slightly narrower week. 124
            // leaves 76 for a ~66px name and still puts the columns near 49.
            // GONE BELOW lg, not just on a phone. The rail is fixed-width, so
            // on a 290px design box it took 124 of them — nearly half the
            // window — to show a nav whose rows are not what this card is
            // about. The claim over it is that every client sees status and
            // key dates without asking, and that is the BOARD: three projects,
            // each with its client and how far along it is.
            //
            // The cut was at sm first, which was the wrong breakpoint: the
            // rail card is one-up until md and two-up from there, so between
            // sm and lg it is still only ~360px wide and the rail was taking a
            // third of it. lg is where the row goes three-up on a full-width
            // page, which is the first width the portal has room to read as a
            // portal. Below it the board gets the whole window and runs off
            // the right edge, which is what says the screen carries on.
            // Ledgerline's slab is its own clay in both themes — a firm's
            // colour does not flip with ours. See --ledgerline-* in globals.
            className={`hidden w-[124px] shrink-0 flex-col px-2 py-2.5 lg:flex lg:w-[136px] ${
              ledgerline
                ? "bg-[var(--ledgerline-clay)] text-white"
                : BRAND_SIDEBAR
            }`}
          >
            <span className="flex items-center gap-1.5 px-1.5 pb-3 pt-0.5">
              {ledgerline ? (
                <span
                  className={`flex size-[14px] items-center justify-center ${R_CHROME} bg-[var(--ledgerline-sage)] text-[color:var(--ledgerline-ink)]`}
                >
                  <IconLedgerline className="size-[9px]" />
                </span>
              ) : (
                <span
                  className={`flex size-[14px] items-center justify-center ${R_CHROME} bg-white text-black`}
                >
                  {bloomhouse ? (
                    <IconBloomhouseMark className="size-[10px]" />
                  ) : (
                    <IconBrandMark className="size-[8px]" />
                  )}
                </span>
              )}
              <span className={`truncate text-white ${UI_PRIMARY}`}>
                {ledgerline
                  ? "Ledgerline"
                  : bloomhouse
                    ? "Bloomhouse"
                    : "Brandmages"}
              </span>
            </span>
            {(ledgerline
              ? TEAM_NAV_ACCOUNTING
              : bloomhouse
                ? TEAM_NAV_AGENCY
                : TEAM_NAV
            ).map(({ icon, label }) => (
              <ClientNavRow key={label} icon={icon} label={label} />
            ))}
            {/* The lit row names the app the pane is showing, which is the
                whole reason neither pane carries a title bar. */}
            <ClientNavRow
              icon={
                plain ? (
                  <IconClock />
                ) : bloomhouse ? (
                  <IconCalendarDays />
                ) : (
                  <IconApp />
                )
              }
              label={
                plain
                  ? "Calendar"
                  : ledgerline
                    ? "Close tracker"
                    : "Project tracker"
              }
              active
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* No title bar. It carried the app's name and nothing else, and the
              lit row in the nav an inch to its left says the same words — so
              the screen opened by naming itself twice and spent a bar's height
              on the repeat. The same bar came off the hero's two screens for
              the same reason. */}
            {plain ? (
              <CalendarPane />
            ) : (
              <>
                {/* Search alone. Filters sat beside it and was the first thing the
              crop took, so the row ended on half a control. */}
                <div className="flex shrink-0 items-center px-3 pt-2.5">
                  <span
                    className={`flex h-[22px] w-[120px] items-center gap-1.5 ${R_CHROME} border px-2 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`}
                  >
                    <IconSearch className="size-[9px] shrink-0" />
                    Search
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 px-3 pt-2.5">
                  {/* --mock-well-2, not --mock-well. The lane holds white project
                cards, so it has to read as the recess they sit in — and in
                light --mock-well is #f7f8fa against a #fcfcfd window, a step of
                five points that the eye does not find. The cards floated on
                what looked like the window itself and the column stopped
                reading as a lane. --mock-well-2 is #f2f3f6, double the step,
                which is the scale's own next rung rather than a value invented
                here. */}
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-t-[4px] bg-[var(--mock-well-2)] p-1.5">
                    <div className="flex items-center gap-1.5 px-0.5 pt-0.5">
                      <span
                        className={`text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
                      >
                        {board.name}
                      </span>
                      <span
                        className={`text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                      >
                        {board.count}
                      </span>
                    </div>
                    {board.cards.map((card, i) => (
                      <ProjectCard
                        key={card.title}
                        {...card}
                        lead={i === 0}
                        tint={i}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Scene>
      {/* Phone only, in the rail: the board's rows run off the square card's
          foot, and a hard cut there read as the screen stopping. The shared
          progressive blur softens it into the edge, as the comparison pages'
          phone windows do. */}
      {!plain && <FootBlur className="sm:hidden" />}
    </>
  );
}

/** A row of the client's own nav, on the firm's colour. */
function ClientNavRow({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      // On the slab a row cannot answer the pointer in ink — white against
      // white/60 is too small a step — so it takes the same quiet fill the
      // picked row wears, one stop down. The picked row is already at its
      // fill and does not move.
      //
      // LIGHT carries the fill harder, 16% against dark's 12%, and the hover
      // follows it at 8% against 7% so the two keep their one-stop gap.
      //
      // The value was found by overshooting from both sides. 30% reached
      // #5d5d5d and read as a lit chip rather than as a row that happens to be
      // the current one. 22% landed near #4a4a4a and was still too light a
      // patch on a near-black slab — on the Build step, where the picked row
      // is the only object on an otherwise empty nav, it was the brightest
      // thing in a shot whose subject is the pane beside it. 16% composites to
      // about #3c3c3c: a 37-point step off the slab, which is enough to read
      // as the picked row at a 24px rung without becoming a chip.
      //
      // The slab is near-black in BOTH themes (--mock-brand #171717 light,
      // #121212 dark), so this is not a contrast difference — 12% lands at
      // about #333 either way. It is an adaptation one: the same step is read
      // easily by an eye settled into a dark page and is nearly invisible to
      // one adapted to a bright one, and the picked row is the thing this card
      // is pointing at. Dark is left exactly where it was.
      //
      // THE UNPICKED ROWS ARE white/40, not white/60. They are furniture:
      // the nav is in these mocks to say the app has a place in a sidebar,
      // and the only row that carries meaning is the lit one naming the app
      // the pane is showing. At 60% the other three were nearly as present as
      // the picked one, so the list read as four options rather than as one
      // open app among them. 40% still names them legibly at this size and
      // puts the step where it belongs. Hover still takes a row to full
      // white, so the fill and the ink move together.
      className={`flex h-[24px] items-center gap-1.5 ${R_CHROME} px-1.5 transition-colors ${
        active
          ? "bg-white/[0.16] text-white [[data-theme=dark]_&]:bg-white/[0.12]"
          : "text-white/40 hover:bg-white/[0.08] hover:text-white [[data-theme=dark]_&]:hover:bg-white/[0.07]"
      }`}
    >
      <span className="flex shrink-0 items-center justify-center [&>svg]:size-[13px]">
        {icon}
      </span>
      {/* On the board's scale, like everything else in that card. At 13px these
          rows were the largest type in the mock — larger than the app's own
          name beside them — and "Project tracker" truncated in its own nav. */}
      <span className={`min-w-0 flex-1 truncate ${UI_PRIMARY}`}>{label}</span>
    </span>
  );
}

/**
 * The builder working, as a quarter-ring spinning in place.
 *
 * Same geometry as the plan card's Ring and the row marks it matches — 16px
 * outer, 2px stroke — so every circle in this family is one circle. The spin
 * and the retire are in globals.css (.mock-building), because they have to
 * key off the CARD's hover rather than this element's own.
 */
function BusyRing({ className = "" }: { className?: string }) {
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className={`mock-building size-[13px] shrink-0 opacity-0 ${className}`}
    >
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        className={CIRCLE_STROKE}
      />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${c * 0.28} ${c}`}
        className="stroke-[color:var(--mock-ink-soft)]"
      />
    </svg>
  );
}

// ── 4. Iterate ───────────────────────────────────────────────────────────
// Hover applies the change: the revision is sent and the column it asked for
// appears in the table.
export function IterateCard() {
  return (
    <Scene>
      <div className={`flex flex-col ${WINDOW}`}>
        <p
          className={`shrink-0 bg-[var(--mock-well-2)] px-4 py-3 text-[color:var(--mock-ink)] ${CARD_BODY}`}
        >
          Add a due date to every project.
        </p>
        <div className="px-4 py-4">
          <div className={`overflow-hidden ${R_CHROME} border ${LINE}`}>
            <div
              className={`flex items-center gap-2 border-b bg-[var(--mock-well)] px-3 py-2 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`}
            >
              <span className="flex-1">Client</span>
              {/* The spinner leads the new column in and then retires, so the
                  card shows the builder DOING the change the line above it
                  asked for — at rest the table simply has no Due date, which
                  is the before. */}
              <BusyRing />
              <span
                className={`${MOVE} w-0 overflow-hidden whitespace-nowrap text-right opacity-0 group-hover/card:w-[58px] group-hover/card:opacity-100`}
              >
                Due date
              </span>
            </div>
            {[
              ["Meridian Corp", "12 Nov"],
              ["Oakwood LLC", "28 Nov"],
              ["Bloom Studios", "4 Dec"],
            ].map(([client, due], i) => (
              <div
                key={client}
                className={`flex items-center gap-2 border-b px-3 py-[11px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
              >
                <span
                  className={`flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
                >
                  {client}
                </span>
                <span
                  className={`${MOVE} w-0 overflow-hidden whitespace-nowrap text-right text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} opacity-0 group-hover/card:w-[58px] group-hover/card:opacity-100`}
                  // Held back behind the spinner rather than starting with it.
                  // The dates used to land in the same instant the column was
                  // asked for, which read as a column that had been there all
                  // along; arriving one at a time while the ring is still
                  // turning, they read as values being written into it.
                  style={{ transitionDelay: `${260 + i * 90}ms` }}
                >
                  {due}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scene>
  );
}

/**
 * The fifth card: who wrote the login.
 *
 * The four steps before it all describe something the AI does, which raises
 * the question this card answers — so it is drawn as a panel the builder has
 * no hand in. Two audiences, what each can reach, and the line that says who
 * maintains it. No hover move: the other four animate because something in
 * them changes, and the point here is that this part does not.
 */
export function SecuredCard() {
  return (
    <Scene>
      <AccessPanel />
    </Scene>
  );
}

/** SecuredCard's panel without its scene, for a frame that places it itself. */
export function AccessPanel() {
  const ROWS: [string, string][] = [
    ["Your team", "Full access"],
    ["Your clients", "Their own data"],
  ];
  return (
    <div className={`flex flex-col ${WINDOW}`}>
      <div className={TABLE_HEAD}>
        <span className="flex-1">Who can see this</span>
      </div>
      {ROWS.map(([who, access]) => (
        <div
          key={who}
          className={`flex items-center gap-2 border-b px-3.5 py-[13px] ${ROW_HOVER} ${LINE}`}
        >
          <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
            <IconCheck className="size-[10px]" />
          </span>
          <span
            className={`flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
          >
            {who}
          </span>
          <span className={NEUTRAL}>{access}</span>
        </div>
      ))}
      <div className="px-3.5 py-3">
        <p className="text-[10.5px] leading-[1.5] text-[color:var(--mock-ink-soft)]">
          Built and maintained by Assembly.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// REVIEW CARD — the Collaborate stage's scene.
//
// It replaced the plan checklist, which was the right picture for a different
// claim. "Clients review work, leave feedback, and sign off round by round"
// is three verbs about a piece of work, and a list of ticked requirements
// shows none of them: a checklist is what a build produces, not what a client
// does to it. The Plan card is still the Plan card and still the right scene
// on /ai-app-builder, which is why this is a new component rather than an
// edit to that one.
//
// SO THE WORK ITSELF IS THE SUBJECT. A cover plate fills the window — the
// same pair the Approvals mock picks between, so the two screens are showing
// one product rather than two inventions — and the round is marked on it: the
// tick at the corner says this is the one being run, and the comment says
// what is still being said about it. Between them they carry "review",
// "leave feedback" and "sign off" in one still, which is what the sentence
// under the card promises.
//
// THE COMMENT OVERLAPS THE PLATE rather than sitting under it. Parked below,
// it reads as a caption describing the picture; laid across its foot it reads
// as a note left ON the work, which is the thing being demonstrated. It is
// ranged left and stops short of the right edge so the plate is still plainly
// a plate behind it.
// ─────────────────────────────────────────────────────────────────────────

/** The comment on the cover, and the only copy in the scene. */
const REVIEW_COMMENT = {
  // Invented, like every other name in these mocks (Dana Whitfield, Priya
  // Raman, Meridian Corp). The first draft borrowed a real colleague's name
  // off the reference screenshot, which is not a name to ship on a public
  // marketing page.
  who: "Clara Mendes",
  initials: "CM",
  when: "3 hr. ago",
  // Cut mid-sentence on purpose. A note someone is still writing reads as a
  // live thread; a complete, tidy sentence reads as a caption written for the
  // mock. The reply count under it says the thread continued.
  text: "Clearer crop on this round — the shoulder is doing a lot of…",
  // The phone's line, one line long. The long one ran three lines on a small
  // card, and a cut-down version of it read as jargon; a sign-off is the
  // stage's point anyway.
  textShort: "Approved for print.",
  replies: "1 reply",
};

// A SECOND NOTE, COLLAPSED. The product draws an unopened comment as its
// author's avatar in the same bubble the open one wears, pinned where it was
// left on the artwork — so one picture can carry several without becoming a
// wall of text. Two marks is also what makes the open one read as OPEN: on
// its own it is just a card lying on a photograph, and the pin beside it says
// the card is one of these, expanded.
//
// A client rather than a second person from the firm: the stage's sentence is
// "clients review work, leave feedback", and a thread with the firm talking to
// itself does not show that.
const REVIEW_PIN = { initials: "AB" };

// THE PIN'S FACE IS A PERSON'S COLOUR, NOT THE FIRM'S.
//
// It read --mock-brand, which is the wrong token for an avatar: that is the
// FIRM's colour — the slab behind the branded sidebar, the logo tile, the
// document mark — and it is near-black in both themes by design. Borrowed for
// a face it made the one client in the scene a black disc, which is the same
// object the brand mark is and reads as chrome rather than as somebody.
//
// #5c78b9 is the site's own periwinkle at its INK step — AVATAR_TINTS
// .periwinkle.fg in whole-stack.tsx, where the mock avatar palette lives and
// the rule is one colour per person. Nothing new enters the palette.
//
// PINNED ACROSS BOTH THEMES, like the tick on the approval plates and for the
// same reason: this mark sits on a photograph and inside a hardcoded white
// bubble, neither of which themes, so a token that flipped underneath it
// would be the mismatch rather than the fix.
//
// The ink step rather than the accent itself (#7da4ff): the disc carries 8px
// white initials, and on the lighter value they wash out. #5c78b9 holds them.
const PIN_FACE = "bg-[#5c78b9]";

// CLARA'S FACE, AND IT HAS TO BE A DIFFERENT ONE.
//
// She read --mock-brand too, for the same wrong reason the pin did: that is
// the firm's near-black slab, not a person. With the pin moved to periwinkle
// she was also the only black disc left in a scene that now had a coloured
// one, which reads as the two marks being different KINDS of object rather
// than two people.
//
// #b34b5f is AVATAR_TINTS.rose.fg from whole-stack.tsx, where the mock avatar
// palette lives and the rule is one colour per person — so this is a second
// person, not a second style. Rose rather than another cool tint: the pin
// beside her is periwinkle and two blues at 18px read as one person twice.
// It also carries 8px white initials at a little over 4.5:1, which the paler
// tints in that palette do not.
//
// Pinned across both themes like the pin, and for the same reason: it sits on
// a photograph, inside a bubble whose ground is already theme-scoped.
const COMMENT_FACE = "bg-[#b34b5f]";

export function ReviewCard({ plain = false }: SceneProps = {}) {
  // The tick toggles, like the approvals card's covers: the one live control
  // on a card about signing off.
  const [approved, setApproved] = useState(true);
  return (
    <>
      {/* The same ground the Plan card used, and for the same reason: a cover
          plate is a bright object and a near-black card is what lifts it.
          Flipped in dark, where a near-black card under a photograph loses the
          plate's own edge — see the Plan card's note on this pair. */}
      {!plain && (
        // Pale lime in light, the agency page's Plan ground; dark keeps its
        // paper.
        <div className="absolute -inset-px bg-[#D1E59A] [[data-theme=dark]_&]:bg-[#FBFBF5]" />
      )}
      <Scene
        boxClass={plain ? PANEL_SCENE_PHONE.vars : RAIL_SCENE_PHONE.vars}
        boxSizeClass={plain ? PANEL_SCENE_PHONE.size : RAIL_SCENE_PHONE.size}
      >
        {/* WINDOW WITHOUT ITS HAIRLINE. Every other scene in the set is a
            product screen, where the border separates a white UI from a white
            page. This one is a picker full of photographs, and a light rule
            drawn around them on a near-black card reads as a mount — the
            plates looked matted rather than cropped. Everything else (radius,
            ground, shadow, ink) is WINDOW's, copied rather than overridden so
            no utility has to fight another for width.

            IT RUNS TO THE CARD'S RIGHT EDGE. The scene is drawn in a box with
            20px of air on every side, which left the window floating with an
            even margin all round — a picture of a screen with a mount around
            it, where the Track card beside it in the same rail runs off its
            edge and reads as a window onto something larger. -mr-5 pays back
            the box's right inset so this one does the same, and the right
            radius goes with it: a rounded corner on an edge that is supposed
            to be a CUT is the one detail that gives a crop away.

            BOTH THEMES, though the gap was reported in dark. The inset is the
            same 20px either way — dark only makes it obvious, because there
            the card is near-white and the window near-black, so the margin is
            a bright band around a dark panel rather than the other way round.
            A layout that differed by theme would be a worse answer than the
            gap. */}
        <div
          className={`relative -mr-5 flex flex-col overflow-hidden ${R_WINDOW} rounded-r-none bg-[var(--mock-window)] p-3 text-[color:var(--mock-ink)]`}
        >
          {/* TWO PLATES, THE SECOND PEEKING. One plate filling the window was
              a photograph with a caption — a picture of a cover, which says
              nothing about reviewing one. A round has options in it, and the
              second plate cut by the window's edge is what says so: this is a
              choice being made, not an image being shown. It is also what
              brings the first plate down to a size the comment can sit on
              without covering a face.

              -mr-3 pays back the window's padding on the right only, so the
              row runs under the edge and B is clipped by the window's own
              overflow rather than ending neatly inside it. */}
          {/* A FIXED ROW HEIGHT, not flex-1. Filling the card made each
              plate a tall portrait slot, and a 4:5 photograph cropped into
              one shows a head at the top and a lot of dark clothing under it
              — the picture got bigger and less legible at once. At 196 the
              plates keep a portrait crop a cover thumbnail actually wears,
              and the window shrinks to its contents instead of being a tall
              white sheet with pictures at the top of it. 248 rather than 196:
              at the shorter height the note covered most of the artwork, and
              a review screen whose comment hides the work is the one thing
              this card must not be. */}
          <div className="-mr-3 flex h-[248px] gap-2.5">
            {[
              {
                name: "Cover A",
                src: "/images/mocks/covers/cover-1.jpg",
                picked: true,
              },
              { name: "Cover B", src: "/images/mocks/covers/cover-2.jpg" },
            ].map(({ name, src, picked }) => (
              <div
                key={name}
                // The picked plate takes the room; the other is the sliver.
                // 4:1 — the second plate is a sliver cut by the window's
                // edge, not a second column. At 2.4:1 it was simply a smaller
                // picture sitting beside the first, which reads as a pair
                // being compared rather than as a row continuing.
                className={`flex min-w-0 flex-col ${picked ? "flex-[4]" : "flex-[1]"}`}
              >
                <div
                  className={`relative min-h-0 flex-1 overflow-hidden ${R_CHROME}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="320px"
                    // object-top: these are head-and-shoulders shots, so a
                    // crop taken from the middle loses the face first.
                    className="object-cover object-top"
                  />
                  {/* THE TICK, on the plate rather than beside it. This is the
                      chosen cover, which is the "sign off" half of the
                      sentence; on the plate it marks the artwork, parked
                      outside it would mark a row. */}
                  {picked ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden
                      onClick={() => setApproved((v) => !v)}
                      // No shadow: the white tile is its own separation from
                      // the photograph. Unchecked keeps the same square as an
                      // outline so the control stays findable.
                      className={`pointer-events-auto absolute left-1.5 top-1.5 flex size-[14px] cursor-pointer items-center justify-center border transition-colors ${R_CHROME} ${
                        approved
                          ? "border-white bg-white text-black"
                          : "border-white/80 bg-black/25 hover:bg-black/40"
                      }`}
                    >
                      <IconCheck
                        className={`size-[8px] transition-opacity ${approved ? "opacity-100" : "opacity-0"}`}
                      />
                    </button>
                  ) : null}
                  {/* THE COLLAPSED NOTE. The same bubble as the open one —
                      round but for a squared bottom-left — shrunk to hold
                      nothing but the avatar, which is how an unopened comment
                      is drawn. Pinned high and right so it is clear of the
                      tick at one corner and the open note at the foot, and so
                      the two notes read as having been left in two places on
                      the artwork rather than queued down one side. */}
                  {picked ? (
                    <span className="absolute right-2.5 top-[30%] flex rounded-full rounded-bl-none bg-white p-[3px] shadow-[0_2px_8px_-1px_rgba(16,24,40,0.45)]">
                      <span
                        className={`flex size-[20px] items-center justify-center rounded-full ${PIN_FACE} text-[9.5px] leading-none text-white`}
                      >
                        {REVIEW_PIN.initials}
                      </span>
                    </span>
                  ) : null}
                </div>
                {/* THE NAME AS A CAPTION, not a filled bar. It was a strip of
                    --mock-well under the plate, which on a near-black card was
                    the brightest thing in the scene — a band of near-white
                    competing with the photograph it was supposed to label.
                    Set on the window's own ground in the muted step it is a
                    caption again, which is all it ever needed to be. */}
                <p
                  className={`mt-2 truncate text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                >
                  {name}
                </p>
              </div>
            ))}
          </div>

          {/* THE NOTE, lying across the plates rather than under them.

              DRAWN AS A COMMENT, not as a panel. The first pass was a bordered
              rectangle with the name ranged left and the time pushed to the
              far right, which is the anatomy of a LIST ROW — and a list row
              laid on a photograph reads as a widget dropped onto it. A comment
              in this product is a soft-cornered card with no outline, a round
              avatar, and the name and time set together as one line, because
              they are one fact: who said this, and when. The shadow does the
              separating the border used to, which is also what lets it sit on
              a photograph without cutting a hard edge into it.

              Body and meta are indented to the NAME, not to the avatar, so the
              attribution and the words it belongs to share a left edge and the
              avatar sits in its own gutter.

              ONE CORNER IS SQUARE. Rounded on all four it is a card, and a
              card laid on a photograph is a panel floating there; squaring the
              bottom-left anchors it — the same move a speech bubble makes with
              its tail, which is what tells you this is something someone SAID
              rather than a box of text. Bottom-left because that is the corner
              nearest the avatar.

              RAISED OFF THE FOOT. At the plate's bottom edge it read as a
              caption bar fixed to the picture; a third of the way up it reads
              as a note left on it, and the face above it stays clear. */}
          {/* INSET FROM THE PLATE ON EVERY SIDE. Flush to the window's own
              padding, the note's left edge landed exactly on the picked
              plate's left edge and its right ran to the sliver — two edges
              agreeing like that read as a bar docked across the screen, not
              as something lying on a photograph. Floating it clear on all
              four sides is what makes it sit ON the work: the plate shows
              around it, which is the whole reason it is there. */}
          {/* ITS GROUND LIFTS IN DARK, and only in dark.

              --mock-window is the right ground in light: #fcfcfd on a
              photograph is a white card lying on a picture, and the shadow
              under it does the separating. In dark the same token is #212121
              — the EXACT value of the window the note is lying in — so the
              bubble had no edge of its own anywhere it overran the plate, and
              where it covered the black knitwear it was two near-blacks
              meeting. The shadow could not rescue it either: a navy-black at
              50% on a near-black ground is nothing, because a shadow
              separates by darkening and there is nothing left to darken.

              --mock-well-2 is the token for this exact object — globals.css
              names it "the chat bubble" where it is defined — and it moves
              the right way per theme on its own: in dark it LIFTS to #303030,
              15 points clear of the window and clear of the dark clothing
              under it, which is what gives the note an edge without drawing
              one. Light is left untouched: it already reads, and well-2's
              #f2f3f6 would have RECESSED the bubble there, which is the
              opposite move.

              NO RULE AROUND IT. A 10% white hairline was added with the
              lifted ground, to hold the bubble's shape where a bright crop
              runs up against #303030. The ground does that job on its own,
              and the rule cost more than it bought: an outline on a card
              lying on a photograph reads as a box that has been drawn there,
              which is the one thing this note must not look like — it is
              something somebody SAID. The shadow and the lift are the
              separation. */}
          <div className="absolute bottom-10 left-7 right-[72px] flex gap-2 rounded-[10px] rounded-bl-none bg-[var(--mock-window)] p-2.5 shadow-[0_10px_28px_-8px_rgba(16,24,40,0.5)] [[data-theme=dark]_&]:bg-[var(--mock-well-2)]">
            {/* Round and filled, not a tinted square: this is the default
                avatar a person gets before they upload a photo, and at 18px a
                tinted square with two grey letters read as a file icon rather
                than as somebody. */}
            <span
              className={`flex size-[20px] shrink-0 items-center justify-center rounded-full ${COMMENT_FACE} text-[9.5px] leading-none text-white`}
            >
              {REVIEW_COMMENT.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-1.5">
                <span
                  className={`truncate font-medium text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
                >
                  {REVIEW_COMMENT.who}
                </span>
                <span
                  className={`shrink-0 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                >
                  {REVIEW_COMMENT.when}
                </span>
              </p>
              <p className={`mt-1 text-[color:var(--mock-ink)] ${CARD_BODY}`}>
                <span className="max-sm:hidden">{REVIEW_COMMENT.text}</span>
                <span className="sm:hidden">{REVIEW_COMMENT.textShort}</span>
              </p>
              <p
                className={`mt-1.5 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
              >
                {REVIEW_COMMENT.replies}
              </p>
            </div>
          </div>
        </div>
      </Scene>
    </>
  );
}

// ── Onboard ──────────────────────────────────────────────────────────────
// The client's own first-steps list, which is what the stage's sentence
// promises: "intake, document collection, and a clear first-steps checklist,
// with progress saved as they go."
//
// It takes the checklist window the Plan scene uses — see ChecklistWindow for
// why that is shared rather than copied. The rows are the CLIENT's steps, not
// the firm's: each one is a thing the client did, in their words, and the
// three ticked against one open row is the "saved as they go" half of the
// sentence — a list someone is partway through rather than one they are
// looking at for the first time.
// THREE ROWS, DOWN FROM FOUR. The scene is drawn at a fixed design size and
// scaled to the card, so on a phone a header plus four rows is five bands in a
// 255px-wide panel — the list stopped being a list you read and became texture
// on a photograph. Three still carries the whole sentence: two things the
// client has done and one they have not, which is the "saved as they go" half,
// and a list someone is partway through rather than one they are looking at
// for the first time. The row that went is the engagement letter, because
// signing is the Collaborate card's subject two stages along.
const ONBOARD_ITEMS = [
  { label: "Intake form completed", done: true },
  { label: "ID and documents uploaded", done: true },
  { label: "Kickoff call booked", done: false },
];

export function OnboardCard({ plain = false }: SceneProps = {}) {
  return (
    <>
      {/* A PHOTOGRAPH, NOT A FLAT GROUND — the same one the Describe card
          carries, reused rather than re-shot. The stage is the client's first
          steps, and the picture is a person on their phone with the list open:
          it puts the checklist in somebody's hands instead of on a swatch,
          which is the half of "intake, document collection, a clear
          first-steps checklist" that a flat ground cannot show.

          The SAME FILE as Describe, deliberately. These two are the only
          photographic grounds in the set, and one image used twice reads as
          one product being shown in two moments; a second photo would be a
          second place and a second person.

          ONE ARTWORK FOR BOTH THEMES, like Describe's. A photograph carries
          its own light and has nothing to lose to the panel in front of it,
          so it does not flip — which is also why the near-black/#FBFBF5 pair
          it replaces is simply gone rather than kept underneath.

          -inset-px, not inset-0, for the reason the other grounds carry it:
          the card box under this paints --surface, and at fractional widths
          the rounding leaves a sub-pixel sliver of it along an edge. The
          parent is overflow-hidden, so the extra pixel is clipped and the
          radius is unaffected.

          Decorative, so empty alt; no priority, because it is well below the
          fold and must not compete with the hero for bandwidth. */}
      {!plain && (
        <div className="absolute -inset-px">
          <Image
            src="/images/mocks/describe-phone.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
        </div>
      )}
      <Scene {...(plain ? {} : RAIL_SCENE_PHONE_PROPS)}>
        {/* "Onboarding" — the window is titled with the stage it belongs to,
            so the card's label and the screen inside it name the same thing. */}
        {/* No outline: on the photograph the hairline read as a frame drawn
            around the panel. */}
        <ChecklistWindow
          title="Onboarding"
          items={ONBOARD_ITEMS}
          className="border-0"
        />
      </Scene>
    </>
  );
}

// ── Transact ─────────────────────────────────────────────────────────────
// THE INVOICE ITSELF, rather than a screen about invoicing.
//
// The stage says "proposals to accept, contracts to sign, and invoices to
// pay, all in your brand", and of the three the invoice is the one with a
// recognisable shape — a reader knows what they are looking at before they
// read a word of it, which no list of settings achieves. It is also the only
// one of the three that carries the brand claim visibly: the firm's name is
// the thing issuing it.
//
// DRAWN AS THE DOCUMENT, not as the app around it. No tab bar, no toolbar —
// those name the product, and the product is not the subject here. The
// amount is the biggest type on the card because paying is the action the
// stage is about.
//
// AND NO PAY BUTTON. It was here to say the invoice is payable in place, but
// a filled control is the loudest thing a mock can hold and it was pulling
// rank on the figure above it — on a card the reader cannot click, a button
// is a picture of a button. The status pill says it better anyway: "Paid" is
// the outcome the button was only promising.
//
// ── Drawn from the product's own invoice, not invented ───────────────────
// This was a single flat panel: a head, a figure, then line items stacked
// against the same ground. It read as an invoice in outline and as nothing
// the product actually renders. The real screen is a PAGE WITH PANELS ON IT
// — summary at the top set straight on the page, a dashed rule under it, and
// the parties and the arithmetic each in their own lifted card. That nesting
// is the whole reason the real one looks like software rather than a
// receipt, so the mock now has it:
//
// A PANEL HAS TO LIFT IN BOTH THEMES, and no single token does that. As
// segment-mock's PANEL_TINT puts it: lifting a surface off white means going
// darker, so the move that means "forward" on black means "back" on white.
// That card could shrug and let light give the lift up. This one cannot —
// the nesting is the whole structure here, not an emphasis on one panel of
// four — so each theme names its own two rungs, and both pick a pair that
// steps UP:
//
//            page               panels standing on it
//   light    --mock-well        --mock-window     (#f7f8fa → #fcfcfd)
//   dark     --mock-window      --mock-well-2     (#212121 → #303030)
//
// Both pairs are adjacent rungs of the ladder the rail already climbs, and
// dark's is the same step PANEL_TINT lifts its step panel by. Written as a
// base class with a [[data-theme=dark]] override so the two value sets stay
// separate — per the repo's CLAUDE.md, a shared hardcoded colour across both
// themes is how this family regresses.
//
// NOTE the bg cannot simply be appended to WINDOW: WINDOW already sets
// bg-[var(--mock-window)], and two classes of equal specificity are settled
// by stylesheet order, not by the order they appear in the string. The first
// pass did append it, and the page and its panels rendered the same tone in
// both themes. So the page spells its own box out instead.
//
// The two sub-panels wear R_CHROME, the page wears R_WINDOW: objects inside a
// screen get the small corner, the screen gets the big one.
const DOC_PAGE = `overflow-hidden ${R_WINDOW} border bg-[var(--mock-well)] text-[color:var(--mock-ink)] [[data-theme=dark]_&]:bg-[var(--mock-window)] ${LINE}`;
const DOC_PANEL = `${R_CHROME} border bg-[var(--mock-window)] [[data-theme=dark]_&]:bg-[var(--mock-well-2)] ${LINE}`;
const INVOICE_LINES = [
  { what: "Mobile app development", qty: "1", amount: "$3,000" },
  { what: "Website design", qty: "1", amount: "$1,500" },
];

// NO SUBTOTAL AND NO TAX ROW. They were here on the argument that the
// arithmetic is what turns a list of prices into an invoice — true of a real
// one, and beside the point in a card this size. The panel carried a header,
// a column rule, two services and three more rows of sums, and at mock scale
// that reads as a dense table rather than as a document: the reader counts
// rows instead of taking in the shape. What the stage claims is "invoices to
// pay", and two services with a total says that in three lines.
//
// The figures were re-done with them, not just left behind. 3,000 + 1,500 is
// 4,500, so the total is 4,500 and the masthead figure is 4,500.00 — it used
// to read 4,000.00 over a 4,950 total, which disagreed with itself twice over
// and would have gone on disagreeing once the tax row was gone.

export function InvoiceCard({ plain = false }: SceneProps = {}) {
  return (
    <>
      {/* THE COLLABORATE CARD'S PAPER, not the Build card's Haze.

          This ground has been round the houses: paper first, then Haze on the
          argument that a near-black document needs lifting the way the Build
          card's near-black SCREEN does. The two cases are not the same. Build
          shows a product screen that themes with the product, so a fixed tone
          can only ever serve one theme and Haze earns the departure. This card
          shows a DOCUMENT, and a document's ground is paper — the same #FBFBF5
          the Collaborate card puts behind its cover plates two stages back.

          It also settles the rail's rhythm. With Haze here, stages 3 and 4 were
          two blue cards running together and the set read as having a blue
          half; with paper, Haze belongs to the Build card alone, which is the
          one place it was chosen for.

          LIGHT IS HAZE NOW. It was #101010 on the reasoning that a near-white
          document needs a black ground to lift it. True, and a black card in a
          rail of five was also the only pure-black object on a light page —
          it read as a hole rather than as a surface. Haze lifts a near-white
          document just as well (the document is #fcfcfd, Haze is a mid blue)
          and it is a colour the page already owns.

          The rhythm note above still holds, in reverse: dark keeps paper here
          so Haze belongs to the Build card alone there. The two themes now
          each have exactly one Haze card in the rail, just not the same one. */}
      {!plain && (
        <div className="absolute -inset-px bg-[#7DA4FF] [[data-theme=dark]_&]:bg-[#FBFBF5]" />
      )}
      {/* IT SITS WHOLE AND CENTRED. It used to start partway down and run off
          the foot under a ramp, on the argument that a document is tall and
          should say so by being cut. At five line items that made the card
          mostly document, and the fade over the last rows read as the artwork
          giving out rather than as paper continuing. Short enough to end, it
          is better as an object in the frame: Scene's default centring places
          it, and the air above and below is what makes it read as placed. */}
      <Scene {...(plain ? {} : RAIL_SCENE_PHONE_PROPS)}>
        {/* The page. WINDOW's own ground is the panel tone, which is what the
            cards INSIDE this one need, so the page itself steps down a rung
            to --mock-well and they lift off it. */}
        <div className={`flex flex-col ${DOC_PAGE} px-3 py-[10px]`}>
          {/* THE SUMMARY, set straight on the page rather than in a panel of
              its own — it is the document's masthead, not one of its parts.

              The brand mark leads the line where the real screen puts a
              document glyph. The glyph says "this is a document", which the
              shape has already said; the mark says whose document it is,
              which is the "all in your brand" half of the caption and the one
              claim this card exists to make. */}
          <div className="flex items-center gap-2 px-1">
            <span
              className={`flex size-[15px] shrink-0 items-center justify-center ${R_CHROME} bg-[var(--mock-brand)] text-white`}
            >
              <IconBrandMark className="size-[8px]" />
            </span>
            <span
              className={`min-w-0 truncate text-[color:var(--mock-ink-soft)] ${UI_PRIMARY}`}
            >
              INV-110450
            </span>
            {/* Paid, in the rail's own positive pill. The status belongs up
                here beside the number, where one glance settles whether this
                is a bill or a receipt — and it is the only colour on the
                card, so it is also what the eye lands on first. */}
            <span className={POSITIVE}>Paid</span>
          </div>

          {/* The figure. Still the biggest type on the card: whatever else an
              invoice says, the amount is what it is for. */}
          <p className="mt-[9px] px-1 text-[18px] leading-none text-[color:var(--mock-ink)]">
            $4,500.00
          </p>

          {/* The dashed rule, straight off the real screen. A solid hairline
              here would read as the same divider that separates the table's
              rows below; dashed says this is a FOLD — the amount above, what
              makes it up underneath.

              WHAT USED TO SIT EITHER SIDE OF IT. An Issued/Due pair rode under
              the figure and a "Billed to" panel under the rule. Both were true
              and neither was the point: the card is captioned "invoices to
              pay, all in your brand", and a reader takes that from the mark,
              the figure and the itemisation. The dates and the client's email
              were detail at a size nobody reads on a card they cannot click,
              and they were most of the document's height. Cut, the invoice
              says the same thing with two blocks instead of four. */}
          <div
            className={`mx-1 mt-[13px] border-t border-dashed ${LINE}`}
            aria-hidden
          />

          {/* ── Item details ──────────────────────────────────────────── */}
          <div className={`mt-[9px] overflow-hidden ${DOC_PANEL}`}>
            <p
              className={`px-[10px] pb-[9px] pt-[10px] text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
            >
              Item details
            </p>

            {/* Description / QTY / Price, in the rail's shared table head, so
                this table and the Track card's read as one product. The two
                number columns are fixed widths rather than flex, so the
                figures line up under their headings instead of drifting with
                the length of each description. */}
            <div
              className={`flex items-center border-y bg-[var(--mock-well)] px-[10px] py-[6px] text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`}
            >
              <span className="min-w-0 flex-1 truncate">Description</span>
              <span className="w-[26px] shrink-0 text-right">QTY</span>
              <span className="w-[52px] shrink-0 text-right">Price</span>
            </div>

            {INVOICE_LINES.map(({ what, qty, amount }) => (
              <div
                key={what}
                className={`flex items-center border-b px-[10px] py-[7px] ${ROW_HOVER} ${LINE}`}
              >
                <span
                  className={`min-w-0 flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
                >
                  {what}
                </span>
                <span
                  className={`w-[26px] shrink-0 text-right text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                >
                  {qty}
                </span>
                <span
                  className={`w-[52px] shrink-0 text-right text-[color:var(--mock-ink)] ${UI_SECONDARY}`}
                >
                  {amount}
                </span>
              </div>
            ))}

            {/* The total. Same two sizes as everything else in the rail — it
                is separated by its ROW (a well behind it, no rule under it)
                rather than by weight, because the site is 400/500 only and a
                mock is not where that gets broken. */}
            <div
              className={`flex items-center bg-[var(--mock-well)] px-[10px] py-[8px] ${ROW_HOVER}`}
            >
              <span
                className={`min-w-0 flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
              >
                Total
              </span>
              <span
                className={`shrink-0 text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
              >
                $4,500
              </span>
            </div>
          </div>
        </div>
      </Scene>
    </>
  );
}
// ── Support ──────────────────────────────────────────────────────────────
// THE REQUEST QUEUE, which is the first of the three things the stage names
// ("a request queue, a resource library, and an assistant that answers from
// your own docs") and the only one that is a place rather than a capability.
//
// A queue also shows the two facts the other two cannot: that a request has a
// STATE — new, open, answered — and that it belongs to a named client. The
// previous scene here was a permissions panel, which is a true thing about
// the product and a strange thing to end a client-journey rail on: the last
// card said who can see the app rather than what the client does next.
//
// ONE ROW AND A HEADER. It was three, then two, and is now one — each cut for
// the same reason, which is that this card gained a photograph behind it. The
// window is no longer the only thing in the frame: it is a panel lying on a
// picture of two people at their desks, and every row it grows covers more of
// them. At one row it states the claim — a request came in, it is sitting in a
// queue, somebody is about to answer it — in the smallest object that can.
//
// The badge survives the cut and matters more for it. With nothing to be
// distinguished FROM it stops being a way of picking one row out of a list and
// becomes what it says: this one is new.
const SUPPORT_REQUESTS = [
  {
    subject: "Best practice for organising files",
    who: "Amelia Brooks",
    tag: "General",
    state: "New",
  },
];

export function SupportCard({ plain = false }: SceneProps = {}) {
  return (
    <>
      {/* A PHOTOGRAPH, like Onboard at the other end of the rail. Support is
          the stage about people answering people — a request queue, a library,
          an assistant — and two colleagues reading a screen together is what
          that looks like before anyone opens a ticket.

          THE RAIL IS BOOKENDED BY THEM, deliberately: Onboard opens on a
          client alone with their phone, Support closes on the firm at their
          desk. The three stages between are product screens on flat grounds,
          so the photographs sit at the ends rather than scattered through —
          which is the difference between a set with two bookends and a set
          that cannot decide what it is.

          One artwork for both themes, like the others: a photograph carries
          its own light and has nothing to lose to the panel in front of it.

          -inset-px for the sub-pixel sliver the other grounds pay for too;
          empty alt because it is decorative; no priority because the rail is
          well below the fold. */}
      {!plain && (
        <div className="absolute -inset-px">
          <Image
            src="/images/mocks/support-desk.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
        </div>
      )}
      <Scene {...(plain ? {} : RAIL_SCENE_PHONE_PROPS)}>
        {/* PUSHED BELOW THE MIDDLE. Centred, the panel sat across the standing
            figure's face — the one part of a photograph of people that the
            picture is actually for, and the one place a UI panel must not
            land. mt-auto drops it to the lower half, where it covers the desk
            instead: papers, a laptop, two coffees. The work, not the person.
            The Scene's own bottom padding still holds it off the foot. */}
        {/* No outline, matching the Onboard card: on a photograph the hairline
            read as a frame drawn around the panel. */}
        <div className={`sm:mt-auto flex flex-col ${WINDOW} border-0`}>
          <div
            className={`flex items-center gap-2.5 border-b bg-[var(--mock-well)] px-4 py-3 ${LINE}`}
          >
            <span
              className={`flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
            >
              Requests
            </span>
            {/* Counted off the array, so the header cannot disagree with the
                rows under it the next time one is added or dropped. */}
            <span
              className={`shrink-0 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
            >
              {SUPPORT_REQUESTS.length} open
            </span>
          </div>

          {SUPPORT_REQUESTS.map(({ subject, who, tag, state }) => (
            <div
              key={subject}
              className={`border-b px-4 py-[11px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`min-w-0 flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
                >
                  {subject}
                </span>
                {/* Only the unanswered one is badged. A state chip on every
                    row is a column, and a column of identical chips says
                    nothing — the badge is here to pick ONE row out.

                    BLUE, through --mock-info-*, rather than a tint of the
                    row's own ink: a grey chip on a grey panel is the same
                    object as the row it is meant to lift out of. The token
                    carries its own value per theme, so the wash stays a wash
                    in light and does not glow in dark. */}
                {state ? (
                  <span
                    className={`shrink-0 ${R_CHROME} bg-[var(--mock-info-bg)] px-1.5 py-0.5 text-[color:var(--mock-info-fg)] ${UI_SECONDARY}`}
                  >
                    {state}
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-1.5 truncate text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
              >
                {who} · {tag}
              </p>
            </div>
          ))}
        </div>
      </Scene>
    </>
  );
}
