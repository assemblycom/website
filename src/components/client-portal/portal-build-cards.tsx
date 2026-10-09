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

import Image from "next/image";
import { MockFit } from "@/components/templates/mock-fit";
import { fadeMask } from "@/components/ui/fade-mask";
import { IconArrowUp } from "@/components/home/build-step-visual";
import {
  IconApp,
  IconCheck,
  IconBrandMark,
  IconChat,
  IconFile,
  IconGlobe,
  IconPlus,
  IconClock,
  IconSearch,
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
// as a smaller thing further away. At 14px the sentence the visitor is meant
// to read matches the copy introducing it.
const CARD_BODY_PLAIN = "text-[14px] leading-[1.45]";
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
const UI_PLAIN = "text-[12.5px] leading-none";
/** The plan document's own scale.
    
    A step up from the UI labels around the mocks, because this is the one
    scene that IS a document — it is read, not glanced at — and it is drawn at
    1:1 in a 560 box with nothing else competing for the width. At the in-mock
    10px it was legible but looked like fine print in a screenshot. */
// BIGGER ON A PHONE, and the scale factor is the reason. This scene is drawn
// at 360x300 and MockFit fits it into a ~327px slot, so everything in it comes
// out at 0.91 — which took an 11px document down to 10px rendered, the
// smallest type anywhere on the page. 14px design is ~12.7px on screen, which
// reads as the small type inside a product screen rather than as fine print.
// From `sm` the scene is drawn 1:1 at 620 and 11px is already correct there.
// The document is deliberately cropped (see the foot ramp and the chevron), so
// larger type costs visible lines rather than breaking the box.
/* 13px from `sm`, not 11. The plan is the one thing in these mocks a reader
   is expected to actually READ rather than recognise as a shape, and at 11px
   in a ~400px card it was the smallest type on the page by some way — legible
   in principle, ignored in practice. 13 is still clearly mock-scale against
   the 15px body around it. The document already overflows and fades at the
   foot, so the extra size costs a line of the last flow, not a flow. */
const PLAN_HEAD = "text-[14px] leading-[1.3] sm:text-[13px]";
/* 1.6, not 1.45. This is the one block on the site that is set as a DOCUMENT
   — paragraphs and a list, read rather than scanned — and document leading is
   looser than a UI label's. It also makes the list's bullets land clear of the
   line above them rather than between two lines. */
const PLAN_PROSE = "text-[14px] leading-[1.6] sm:text-[13px]";

const LINE = "border-[var(--mock-line)]";
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
//   R_PANEL   a card, or the one exposed corner of a window. The biggest
//             object gets the biggest corner.
// rounded-full is exempt throughout: a circle is not a corner.
const R_CHROME = "rounded-[4px]";
const R_PANEL = "rounded-[10px]";
const WINDOW = `overflow-hidden ${R_CHROME} border bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
const BRAND_SIDEBAR = "bg-[var(--mock-brand)] text-white";
const TABLE_HEAD = `flex items-center gap-3 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`;
const CHIP = `rounded px-1.5 py-[4px] ${UI_SECONDARY}`;
const NEUTRAL = `${CHIP} bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]`;

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
                  height: h,
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
            ? "flex flex-col justify-end overflow-hidden pl-5 pt-5"
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
type SceneProps = { plain?: boolean };

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

export function DescribeCard({ plain = false }: SceneProps = {}) {
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
            src="/images/mocks/describe-phone.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
        </div>
      )}
      <Scene
        {...(plain
          ? {
              boxClass: PANEL_SCENE_PHONE.vars,
              boxSizeClass: PANEL_SCENE_PHONE.size,
            }
          : {})}
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
          } ${plain ? `${R_PANEL} gap-2.5` : R_CHROME} border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE} ${
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
                "mb-auto px-4 py-6 shadow-[0_0_0_3px_var(--surface),0_0_0_4px_var(--mock-line)] sm:mt-[66px]"
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
              : "Add a project tracker each client sees for their own project."}
            {/* The site's own caret blink (--animate-caret, the one the hero
              typewriter uses), run only while the card is hovered: at rest
              it is a resting insertion point, on hover someone is typing.
              No MOVE here — a transition-all fights the keyframes. */}
            <span
              className={`ml-[1px] inline-block w-[1.5px] translate-y-[2px] bg-[var(--mock-ink)] motion-safe:group-hover/card:animate-caret ${plain ? "h-[15px]" : "h-[14px]"}`}
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
              <span className="flex size-[26px] shrink-0 items-center justify-center text-[color:var(--mock-ink)]">
                <IconPlus className="size-[16px]" />
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
                  plain ? "size-[26px]" : "size-[20px]"
                }`}
              >
                <IconArrowUp
                  className={plain ? "size-[13px]" : "size-[10px]"}
                />
              </span>
            </span>
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
const PLAN_ITEMS = [
  { label: "Each client sees only their own", done: true },
  { label: "Your team sees every project", done: true },
  { label: "Track name, milestones, status", done: true },
  { label: "Due date on each milestone", done: false },
];
const DONE = PLAN_ITEMS.filter((i) => i.done).length;

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

export function PlanCard({ plain = false }: SceneProps = {}) {
  return (
    <>
      {/* The Plan card's ground — and the one ground in the set that DOES
          flip with the theme.

          #101010 in light: the plan window is white there, so a near-black
          card is what lifts it. In dark that same ground put a #212121 panel
          on a #101010 card, eight points apart, and the one object the card is
          about became the hardest thing on it to find.

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
      {!plain && (
        <div className="absolute -inset-px bg-[#101010] [[data-theme=dark]_&]:bg-[#FBFBF5]" />
      )}
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
        <Scene>
          <div className={`flex flex-col ${WINDOW}`}>
            {/* The header takes the well's tint. On --mock-window it was the same
            white as the rows under it, so the card opened on five identical
            bands and the one naming the thing had nothing marking it as the
            header — the rule under it was doing that job alone. */}
            <div
              className={`flex items-center gap-2.5 border-b bg-[var(--mock-well)] px-4 py-3 ${LINE}`}
            >
              <Ring value={DONE / PLAN_ITEMS.length} />
              <span
                className={`flex-1 truncate text-[color:var(--mock-ink)] ${UI_PRIMARY}`}
              >
                Plan
              </span>
              <span
                className={`shrink-0 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
              >
                {DONE} of {PLAN_ITEMS.length}
              </span>
            </div>

            {PLAN_ITEMS.map(({ label, done }) => {
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
  flows: [
    "Internal user opens the app from the dashboard → sees the week across every client → filters by company or status.",
    "Internal user clicks New event → picks a company, a time and a length → publishes it to that client's calendar.",
    "Client opens the calendar in the client experience → sees their own events and the open slots for their company.",
    "Client books an open slot → gets a confirmation, and a reminder before it starts.",
  ],
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
          className={`relative flex h-full flex-col overflow-hidden ${R_PANEL} rounded-b-none border border-b-0 bg-[var(--mock-window)] ${LINE}`}
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
            <span
              className={`flex shrink-0 items-center ${R_CHROME} border bg-[var(--mock-window)] px-3 py-1.5 text-[color:var(--mock-ink)] ${PLAN_HEAD} ${LINE}`}
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
          <div className="mx-auto flex min-h-0 w-full max-w-[340px] flex-1 flex-col gap-2 px-6 pb-4 pt-2">
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
              {PLAN_DOC.flows.map((f) => (
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
                  <span className="min-w-0">{f}</span>
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

function CalendarPane() {
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
        <span
          className={`whitespace-nowrap text-[color:var(--mock-ink-soft)] ${UI_PRIMARY}`}
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
          <div className={`w-[38px] shrink-0 border-r sm:w-[46px] ${LINE}`} />
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
              className={`min-w-0 flex-1 flex-col items-center gap-[3px] py-1.5 ${
                d.today ? "bg-[var(--mock-well-3)]" : ""
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
          <div
            className={`relative w-[38px] shrink-0 border-r sm:w-[46px] ${LINE}`}
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
                  className={`absolute inset-x-[2px] overflow-hidden ${R_CHROME} bg-[color-mix(in_srgb,var(--cal-hue)_18%,var(--mock-well-2))] pb-[3px] pl-1.5 pr-1 pt-[3px]`}
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
                      "--cal-hue": CAL_HUES[e.who] ?? "var(--mock-ink)",
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

/** The nav beside the board. Three rows and the app, which is as many as fit
    before the board loses the width it needs.
    Billing is deliberately NOT here. The app the step just built is the row
    that matters in this shot — the claim is that it lands in the nav — and a
    billing row above it is the one stock entry that pulls toward a different
    part of the product than the one the card is about. */
const TEAM_NAV = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
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
function ProjectCard({
  who,
  initials,
  title,
  done,
  of,
  lead = false,
}: {
  who: string;
  initials: string;
  title: string;
  done: number;
  of: number;
  /** The one card whose bar advances on hover — see the card's hover move. */
  lead?: boolean;
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
        {/* The client's initials on a plain tile — the default avatar a record
            gets before anyone uploads a logo, which is most of them. */}
        <span
          className={`flex size-[14px] shrink-0 items-center justify-center ${R_CHROME} bg-[var(--mock-ink)]/10 text-[7px] leading-none text-[color:var(--mock-ink-soft)]`}
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

export function BuildCard({ plain = false }: SceneProps = {}) {
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
          can only serve one of them. #CFCFCF lifts the white screen in light;
          Haze (#7DA4FF, the brand blue) does the same job for the dark screen,
          and is the one card in the set where the brand colour gets to be the
          whole surface rather than a bar or a tint.

          Describe is the exception: a photograph has its own light and
          nothing to lose to the panel in front of it, so it stays fixed. */}
      {/* -inset-px, not inset-0. The card box underneath paints --surface, and
          at fractional widths the rounding leaves a sub-pixel sliver of it
          along an edge — which in dark is #191919 against a near-black page
          and reads as a pale hairline drawn under the card. Over-covering by a
          pixel removes it; the parent is overflow-hidden, so the extra is
          clipped and the radius is unaffected. */}
      {!plain && (
        <div className="absolute -inset-px bg-[#CFCFCF] [[data-theme=dark]_&]:bg-[#7DA4FF]" />
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
          : {})}
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
          style={plain ? undefined : { width: 380, height: 412 }}
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
          className={`flex shrink-0 ${WINDOW} ${R_PANEL} rounded-b-none rounded-tr-none border-b-0 border-r-0 sm:rounded-tr-[10px] sm:border-r ${
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
            className={`flex w-[124px] shrink-0 flex-col px-2 py-2.5 sm:w-[136px] ${BRAND_SIDEBAR}`}
          >
            <span className="flex items-center gap-1.5 px-1.5 pb-3 pt-0.5">
              <span
                className={`flex size-[14px] items-center justify-center ${R_CHROME} bg-white text-black`}
              >
                <IconBrandMark className="size-[8px]" />
              </span>
              <span className={`truncate text-white ${UI_PRIMARY}`}>
                Brandmages
              </span>
            </span>
            {TEAM_NAV.map(({ icon, label }) => (
              <ClientNavRow key={label} icon={icon} label={label} />
            ))}
            {/* The lit row names the app the pane is showing, which is the
                whole reason neither pane carries a title bar. */}
            <ClientNavRow
              icon={plain ? <IconClock /> : <IconApp />}
              label={plain ? "Calendar" : "Project tracker"}
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
                        {BOARD.name}
                      </span>
                      <span
                        className={`text-[color:var(--mock-ink-soft)] ${UI_SECONDARY}`}
                      >
                        {BOARD.count}
                      </span>
                    </div>
                    {BOARD.cards.map((card, i) => (
                      <ProjectCard key={card.title} {...card} lead={i === 0} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Scene>
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
      // LIGHT carries the fill harder, 22% against dark's 12%, and the hover
      // follows it at 12% against 7% so the two keep their one-stop gap.
      //
      // The value was found by overshooting from both sides. 18% composites to
      // #414141 on the slab — a 26-point step, measurable but not visible at
      // this scale, where a 24px row is drawn down into a card. 30% reached
      // #5d5d5d and went the other way, reading as a lit chip rather than as a
      // row that happens to be the current one. 22% lands near #4a4a4a, which
      // is the picked row being quietly obvious.
      //
      // The slab is near-black in BOTH themes (--mock-brand #171717 light,
      // #121212 dark), so this is not a contrast difference — 12% lands at
      // about #333 either way. It is an adaptation one: the same step is read
      // easily by an eye settled into a dark page and is nearly invisible to
      // one adapted to a bright one, and the picked row is the thing this card
      // is pointing at. Dark is left exactly where it was.
      className={`flex h-[24px] items-center gap-1.5 ${R_CHROME} px-1.5 transition-colors ${
        active
          ? "bg-white/[0.22] text-white [[data-theme=dark]_&]:bg-white/[0.12]"
          : "text-white/60 hover:bg-white/[0.12] hover:text-white [[data-theme=dark]_&]:hover:bg-white/[0.07]"
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
  const ROWS: [string, string][] = [
    ["Your team", "Full access"],
    ["Your clients", "Their own data"],
  ];
  return (
    <Scene>
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
    </Scene>
  );
}
