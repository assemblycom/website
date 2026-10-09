// ─────────────────────────────────────────────────────────────────────────
// ADD APP — the product's own front door, as the first pillar's picture.
//
// The claim this backs is "Build client apps and internal tools in one place",
// and the ONE PLACE is this screen: a single box that takes a sentence, with
// the template shelf under it for anyone who would rather not start from one.
// Whether what you describe ends up in a client's
// portal or in your own dashboard is decided by what you type, not by which
// product you opened — which is the part no other builder can say.
//
// It replaces a shot of a built app sitting in a client's sidebar. That showed
// where an app LANDS, which is a true thing about Assembly and is also what the
// two cards further down this row already show; the claim above it is about
// where every app starts.
//
// NO SIDEBAR, unlike its neighbours. The screen is one column with its subject
// in the middle, and a nav rail down the left of it would spend a quarter of a
// 709px card telling you which product this is — which the card's own heading
// already does. The cropping frame it sits in (see FeatureCard) cuts it at the
// foot, so the template shelf runs off the card the way a real page does.
//
// Everything here reads --mock-* tokens, so it themes with the rest of the set.
// ─────────────────────────────────────────────────────────────────────────

import { IconPlus } from "@/components/home/mock-icons";
import {
  MOCK_PRIMARY,
  MOCK_PRIMARY_STACKED,
  MOCK_SECONDARY,
  MOCK_TITLE,
} from "@/components/ui/mock-type";
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import { IconArrowUp } from "@/components/home/build-step-visual";

const LINE = "border-[var(--mock-line)]";

/**
 * The shelf under the box — the templates it offers anyone who would rather not
 * start from a sentence.
 *
 * It was a "Browse all apps" library: a count, a filter row and six named apps
 * in three columns. That said the place is already full, which is true, but it
 * also put a control row (filters, a search field) into a picture whose subject
 * is the ONE box above it — the eye went to the chips. Four covers are a shelf,
 * and a shelf is quiet enough to stay the screen's second thing.
 *
 * Four, in four columns. It is what the width holds before the covers stop
 * reading as covers.
 *
 * A COUNT, NOT NAMES. The cards carried the real template names under their
 * covers, which put four pieces of readable copy at the foot of a picture whose
 * subject is the box above them — and the card crops this screen mid-shelf, so
 * the fourth name was always cut through. Blank covers read as a shelf without
 * asking to be read; the section further down this page is where the templates
 * are actually named.
 */
const TEMPLATE_COUNT = 4;

export function AddAppMock() {
  // UNEVEN PADDING on the pane (pl-8 / pr-5), and it has to be. The card crops
  // this screen on its RIGHT edge, so the pane is a window onto a page that
  // carries on — and content centred in the window sits left of where it would
  // be on the whole page. The few extra pixels on the left are that
  // difference. Even padding measured correctly and still read as squeezed.
  //
  // THE PAGE IS --mock-window — the product's own page ground, white in light
  // and #212121 in dark. It was tried on --mock-well, which separates the
  // composer and the cards from the page they sit on by giving the page a
  // tint; the screen then read as a recessed tray inside the card rather than
  // as the app's own page. The objects are told apart by their hairlines
  // instead, which is how the product does it.
  return (
    <div
      aria-hidden
      // NO pointer-events-none: the composer's brand ramp answers the cursor
      // (below). `select-none` stays — this is a picture of a screen.
      className="flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      {/* The firm's own nav, with Add App lit. A bar naming the page was
          tried first and said less: it told you the page's name, which the
          headline under it already says, where the nav says WHERE the page is
          — inside a workspace that already has a CRM, a team and three apps in
          it. That is the claim the card is making.

          Shared with nothing else at the moment and deliberately its own
          component: this nav is drawn inline in two other mocks, and a third
          copy would be the thing that lets them drift apart.

          Narrower than the CRM card drew it (140 against 148/164), and always
          shown — every pixel the rail takes is a pixel off the pane that is
          the subject.

          132 UNDER `sm`, against 140 above. The pillar card is 327px on a
          phone and this mock lays out at the card's own width, so the rail was
          taking 43% of the screen. 132 is the smallest number that still sets
          "Year-end docs" — the longest label — on one line; 116 was tried and
          truncated it, which is worse than a wide rail. */}
      <WorkspaceSidebar
        active="Add App"
        className="flex w-[132px] sm:w-[140px]"
      />

      {/* min-w-0 is load-bearing. A flex child defaults to min-width:auto,
          so the pane refused to shrink below its widest child — the 520px app
          grid — and grew to 572 inside a 455px slot, pushing the composer's
          send button out past the card's edge. With it, the pane is the width
          the nav leaves it and the grid is the only thing that overflows,
          which is what the overflow was for. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-4 pr-3 pt-5 sm:pl-8 sm:pr-5 sm:pt-8">
        {/* Named, because the product names you. "What app will you add?" on its
          own is a page title; with the name in front of it, it is the workspace
          talking to the person who opened it, which is the difference between a
          screenshot of a form and a screenshot of somebody's Monday. */}
        {/* 13.5px — 17, then 15, then here. The product sets this heading at
          roughly 1.7x its composer, and copying that ratio is what made it
          wrong: this whole mock is drawn at about half product scale, where a
          1.7x heading is a marketing headline that wandered into a product
          screenshot. A mock's biggest type has to stay inside the mock's own
          range or it stops being part of the screen.
          One point above the composer's 12.5 is enough here, because the
          heading is already the only centred line on the screen and the only
          one in full ink — position and weight are doing the work that size
          does at full scale. */}
        {/* RANGED LEFT UNDER `sm`. Centring is right when the line has room
          to be a line: on the desktop card it sits over a centred composer and
          the two share an axis. On a phone the pane is ~180px, so the heading
          broke onto two centred lines over a composer that now starts at the
          pane's left edge — a centred rag over a left-ranged box, which is two
          different alignments in one 200px column. */}
        <p
          // RANGED LEFT AND ON ONE LINE UNDER `sm`. Centring is right when the
          // line has room to be a line: on the desktop card it sits over a
          // centred composer and the two share an axis. On a phone the pane is
          // ~180px, so it broke into two centred lines over a composer that
          // starts at the pane's left edge — a centred rag above a
          // left-ranged box, which is two alignments in one narrow column.
          // `whitespace-nowrap` lets it run under the card's crop the way the
          // composer beneath it does, rather than wrapping to fit a width this
          // screen is not actually drawn at.
          className={`whitespace-nowrap text-left tracking-[-0.01em] sm:whitespace-normal sm:text-center ${MOCK_TITLE}`}
        >
          Margot, what app will you add?
        </p>

        {/* The box, at the measure the product gives it rather than the card's
          full width — a composer run edge to edge across 709px stops reading as
          a thing you type one sentence into. */}
        <div
          // CUT, NOT SQUISHED. The box is a fixed 400px under `sm` instead of
          // `w-full max-w-[400px]`, and the card crops whatever does not fit.
          //
          // Shrink-to-fit was the wrong answer on a phone: at the ~180px the
          // pane has left, the composer stopped being a composer — the sentence
          // wrapped onto two lines and the box turned into a square. Everything
          // else on this page runs off the card's edge on purpose, and a
          // composer that carries on past the crop says the same thing the CRM
          // table beside it says. The cost is the Auto chip and the send button,
          // which fall off the right edge on a phone.
          className="mt-5 w-[400px] max-w-none sm:mx-auto sm:w-full sm:max-w-[400px]"
        >
          {/* THE DOUBLE OUTLINE — the composer's own hairline, a 3px band of the
            screen's ground, then a second line around that. It is the
            treatment the hero's composer and the Describe card both wear, and
            it is what makes the band read as a GAP rather than as a fat
            border: the middle layer is --mock-window, the same tone as the
            page behind it, so what you see between the two lines is that page
            showing through rather than a second border.

            The outer line is the brand ramp rather than a hairline — the
            footer aurora's own lime → mint → blue, running top to bottom. It
            is the one place in this picture that carries colour, and it
            carries it on the object the whole screen is about. Painted as a
            1px-padded gradient box rather than a border-image or a shadow,
            because neither of those takes a gradient and follows a radius.

            The radii step with the layers: 8 inside, +3 for the band, +1 for
            the line. Any other numbers and the three curves stop being
            concentric, which is the one way this effect reads as a mistake.

            It replaces the drop shadow this box carried. A cast under it and a
            ring around it are two ways of saying the same thing, and with both
            the composer looked lifted AND outlined. */}
          {/* THE RAMP TRAVELS ON HOVER. The ring is painted at twice the box's
            height and parked at its top, so the band you see is the lime→mint
            half of it; hovering slides the paint to its other end and the blue
            comes up through the box. Nothing moves and nothing re-renders —
            it is one background-position, which is why it can be a CSS
            transition on a static mock rather than state.

            Down, not around: the ramp is a vertical one, so travelling along
            its own axis reads as the same light moving rather than as a
            different gradient being swapped in.

            700ms and ease-out. The ring is decoration on a picture, and at the
            150ms a control would use it snapped — which asks to be noticed, on
            the one object this screen is already pointing at. */}
          <div className="rounded-[12px] bg-[linear-gradient(to_bottom,#d9ed92_0%,#9fd6c4_45%,#8ea2f4_100%)] bg-[length:100%_200%] bg-[position:0%_0%] p-px transition-[background-position] duration-700 ease-out hover:bg-[position:0%_100%] motion-reduce:transition-none">
            <div className="rounded-[11px] bg-[var(--mock-window)] p-[3px]">
              <div
                className={`flex flex-col gap-3 rounded-lg border bg-[var(--mock-window)] px-3 py-2.5 ${LINE}`}
              >
                {/* MOCK_PRIMARY_STACKED (11.5px), not MOCK_BODY (12.5). One
              rung down the shared scale rather than a number of its own: at
              12.5 the sentence was the largest type on a screen whose other
              text — the shelf's label, the Auto chip — sits at 11.5 and below,
              so the composer read as zoomed rather than as the screen's
              subject. The box already says it is the subject, by being the one
              object in the middle of an otherwise empty page with a brand ramp
              drawn round it; the type does not have to say it again.

              STACKED, so the line has leading if it ever wraps. It fits on one
              at this measure, but MOCK_PRIMARY's leading-none would set a
              wrapped sentence solid. */}
                <span
                  className={`text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY_STACKED}`}
                >
                  Build an onboarding wizard for my clients
                </span>
                {/* Two rows, like every other composer in this set: what you type,
              then the controls under it. */}
                <div className="flex items-center justify-between gap-2">
                  <span className="flex size-[20px] items-center justify-center text-[color:var(--mock-ink)]">
                    <IconPlus className="size-[12px]" />
                  </span>
                  <span className="flex items-center gap-1.5">
                    {/* "Auto", not a model name. The product shows whichever model is
                  selected, which on a marketing page is a mock that goes
                  quietly out of date the next time the default changes and that
                  nobody would think to come back here for. Auto is the setting,
                  so it stays true. Same reasoning as the Describe card's. */}
                    {/* The word alone, no chevron. A caret says "this opens",
                  which in a still picture is a promise the picture cannot
                  keep — and at 9px it read as a smudge beside the type
                  rather than as a mark. */}
                    <span
                      className={`rounded-[4px] px-1.5 py-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
                    >
                      Auto
                    </span>
                    {/* 18px, down from 22. It is the only filled slab in the
                  shot — near-black on white, near-white on the dark card —
                  so it carries far more weight per pixel than anything
                  around it, and at 22 it was the loudest object on a screen
                  whose subject is the sentence above it. 18 sits just under
                  the + opposite it (a 20px hit box), which is the right
                  order: both are controls on the same row, and the send
                  button does not need to be the biggest thing there to be
                  found. The arrow comes down with it, 11 → 10, so the glyph
                  keeps its air inside the tile. */}
                    <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
                      <IconArrowUp className="size-[10px]" />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The shelf. Ranged left under a centred box on purpose — it is a
          list of things, and a centred list of four is a decoration. */}
        {/* mt-16. The shelf is the screen's SECOND thing, and the gap is what
          separates "say what you want" from "or take one of these" — at 32px
          the covers read as hanging off the composer, and at 48 they were
          still close enough to belong to it. 64 is where the two stop being
          one block; it also puts the composer nearer the optical middle of the
          part of the screen the card shows. */}
        {/* --mock-ink-soft, not --mock-ink. In dark the full ink is #ededed,
          and a near-white line over four blank covers made the label the
          brightest thing on the lower half of a screen whose subject is the
          box above it — the eye landed on the shelf's name. Soft is the same
          ink the composer's own sentence wears, so the two quiet things on
          this screen are quiet together.

          BOTH THEMES, deliberately. The complaint is dark's, but the reason is
          not: this is a label over the screen's SECOND thing, and a label set
          at full ink was louder than its own subject in light too — there it
          just had nowhere bright to go. #6b7079 on #fcfcfd is 5.3:1, so it
          stays a label rather than becoming a whisper. */}
        <p
          // mt-8 under `sm`. 64px between the composer and the shelf is the
          // right separation on a 709px card; on a 327px one it was a quarter
          // of the card's height spent on a gap.
          className={`mt-8 text-[color:var(--mock-ink-soft)] sm:mt-16 ${MOCK_PRIMARY}`}
        >
          Start from a template
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {Array.from({ length: TEMPLATE_COUNT }, (_, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-[8px] border bg-[var(--mock-window)] ${LINE}`}
            >
              {/* A plain cover, and plain on purpose. It carried each
                template's own drawn mark, which put four pieces of detailed
                artwork in a picture whose subject is the box above them — the
                marks were the highest-contrast thing on the card and the eye
                went to the shelf instead of to the thing you type into.

                110px, which is the 74px cover plus the 36px name strip that
                used to sit under it. The number is kept so the shelf still
                meets the card's fadeBottom ramp at the same point — the covers
                are what dissolve into the card's foot, and shortening them
                would have pulled the whole shelf up into the clear part of the
                shot. */}
              {/* 76px under `sm`, with two columns instead of four. Four in
                the 135px the pane had left on a phone made each cover 26px
                wide against 110 tall — a 4:1 sliver, which is not a cover of
                anything. Two and a shorter cover put it back to roughly
                square, which is the proportion that reads as artwork. */}
              <div className="h-[76px] bg-[var(--mock-well)] sm:h-[110px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
