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
  IconCard,
  IconChat,
  IconFile,
  IconGlobe,
  IconSearch,
} from "@/components/home/mock-icons";

// 3:4, the rail's card shape.
const W = 340;
const H = 453;

const UI_PRIMARY = "text-[11.5px] leading-none";
const UI_SECONDARY = "text-[10.5px] leading-none";
const CARD_BODY = "text-[12.5px] leading-[1.4]";

const LINE = "border-[var(--mock-line)]";
const WINDOW = `overflow-hidden rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
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
}: {
  children: React.ReactNode;
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
}) {
  return (
    <MockFit className="absolute inset-0 [--template-mock-h:453px] [--template-mock-w:340px]">
      <div
        style={
          bleed
            ? {
                width: W,
                height: H,
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
            : { width: W, height: H }
        }
        className={
          bleed
            ? "flex flex-col justify-end overflow-hidden pl-5 pt-5"
            : "flex flex-col justify-center gap-4 p-5"
        }
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
export function DescribeCard() {
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
      <div className="absolute -inset-px">
        <Image
          src="/images/mocks/describe-phone.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 420px, 90vw"
          className="object-cover"
        />
      </div>
      <Scene>
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
          // The double ring is DARK ONLY. On a dark page it separates the card
          // from the ground behind it; on a light one --surface is a hair off
          // white and the pair read as a second, fatter border outside the real
          // one — two outlines where the card has one edge.
          className={`mock-edge [--mock-edge-h:150%] [--mock-edge-w:120%] flex flex-col overflow-hidden rounded-xl border bg-[var(--mock-window)] p-4 text-[color:var(--mock-ink)] [[data-theme=dark]_&]:shadow-[0_0_0_3px_var(--surface),0_0_0_4px_var(--mock-line)] ${LINE}`}
        >
          <p className={`text-[color:var(--mock-ink)] ${CARD_BODY}`}>
            Add a project tracker each client sees for their own project.
            {/* The site's own caret blink (--animate-caret, the one the hero
              typewriter uses), run only while the card is hovered: at rest
              it is a resting insertion point, on hover someone is typing.
              No MOVE here — a transition-all fights the keyframes. */}
            <span className="ml-[1px] inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-[var(--mock-ink)] motion-safe:group-hover/card:animate-caret" />
          </p>

          {/* The composer's control row, where the product puts it. With the
            switch gone the send button is on its own, so the row is laid out
            from the right rather than split between two ends. */}
          <div className="mt-6 flex items-center justify-end">
            <span
              className={`${MOVE} flex size-[20px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[color:var(--mock-window)] group-hover/card:scale-110`}
            >
              <IconArrowUp className="size-[10px]" />
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

export function PlanCard() {
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
      <div className="absolute -inset-px bg-[#101010] [[data-theme=dark]_&]:bg-[#FBFBF5]" />
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

/** The nav beside the board. Four rows and the app, which is as many as fit
    before the board loses the width it needs. */
const TEAM_NAV = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconCard />, label: "Billing" },
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
      className={`overflow-hidden rounded-[5px] border bg-[var(--mock-window)] px-2 py-[7px] ${LINE}`}
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
        <span className="flex size-[14px] shrink-0 items-center justify-center rounded-[3px] bg-[var(--mock-ink)]/10 text-[7px] leading-none text-[color:var(--mock-ink-soft)]">
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

export function BuildCard() {
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
      <div className="absolute -inset-px bg-[#CFCFCF] [[data-theme=dark]_&]:bg-[#7DA4FF]" />
      {/* fadeFrom 100 — the right-edge fade is OFF for this card. That ramp
          exists to dissolve art that overruns the card, and nothing overruns it
          any more: the window is drawn at exactly the width the card shows.
          With a single column the fade had nothing to soften and everything to
          spoil, dimming the only column on screen from 82% of its width on. */}
      <Scene bleed fadeFrom={100}>
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
          style={{ width: 380, height: 412 }}
          className={`flex shrink-0 ${WINDOW} rounded-b-none rounded-tr-none border-b-0 border-r-0`}
        >
          <div
            className={`flex w-[136px] shrink-0 flex-col px-2 py-2.5 ${BRAND_SIDEBAR}`}
          >
            <span className="flex items-center gap-1.5 px-1.5 pb-3 pt-0.5">
              <span className="flex size-[14px] items-center justify-center rounded-[3px] bg-white text-black">
                <IconBrandMark className="size-[8px]" />
              </span>
              <span className={`truncate text-white ${UI_PRIMARY}`}>
                Brandmages
              </span>
            </span>
            {TEAM_NAV.map(({ icon, label }) => (
              <ClientNavRow key={label} icon={icon} label={label} />
            ))}
            <ClientNavRow icon={<IconApp />} label="Project tracker" active />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            {/* No title bar. It carried the app's name and nothing else, and the
              lit row in the nav an inch to its left says the same words — so
              the screen opened by naming itself twice and spent a bar's height
              on the repeat. The same bar came off the hero's two screens for
              the same reason. */}
            {/* Search alone. Filters sat beside it and was the first thing the
              crop took, so the row ended on half a control. */}
            <div className="flex shrink-0 items-center px-3 pt-2.5">
              <span
                className={`flex h-[22px] w-[120px] items-center gap-1.5 rounded-[4px] border px-2 text-[color:var(--mock-ink-soft)] ${UI_SECONDARY} ${LINE}`}
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
              <div className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-t-[6px] bg-[var(--mock-well-2)] p-1.5">
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
      className={`flex h-[24px] items-center gap-1.5 rounded-[4px] px-1.5 transition-colors ${
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
          <div className={`overflow-hidden rounded-lg border ${LINE}`}>
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
