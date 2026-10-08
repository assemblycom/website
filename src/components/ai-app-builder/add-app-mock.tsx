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
  MOCK_BODY,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
  MOCK_SECONDARY_STACKED,
  MOCK_TITLE,
} from "@/components/ui/mock-type";
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import { IconArrowUp } from "@/components/home/build-step-visual";

const LINE = "border-[var(--mock-line)]";

/**
 * The shelf under the box — the four templates it offers anyone who would
 * rather not start from a sentence.
 *
 * It was a "Browse all apps" library: a count, a filter row and six named apps
 * in three columns. That said the place is already full, which is true, but it
 * also put a control row (filters, a search field) into a picture whose subject
 * is the ONE box above it — the eye went to the chips. Four covers are a shelf,
 * and a shelf is quiet enough to stay the screen's second thing.
 *
 * Four, in four columns. It is what the width holds before the covers stop
 * reading as covers and the names start wrapping.
 *
 * The names are the ones /templates and the section further down this page use,
 * so a visitor who keeps scrolling meets the cards they just saw in the picture
 * rather than a different four. The covers are blank — see below.
 */
const TEMPLATES = [
  "Client onboarding wizard",
  "Client project tracker",
  "Proposal builder",
  "Time tracker",
];

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
      className="pointer-events-none flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      {/* The firm's own nav, with Add App lit. A bar naming the page was
          tried first and said less: it told you the page's name, which the
          headline under it already says, where the nav says WHERE the page is
          — inside a workspace that already has a CRM, a team and three apps in
          it. That is the claim the card is making.

          Shared with nothing else at the moment and deliberately its own
          component: this nav is drawn inline in two other mocks, and a third
          copy would be the thing that lets them drift apart.

          Narrower than the CRM card drew it (136 against 148/164), and always
          shown — this shot is never below `sm`, and every pixel the rail takes
          is a pixel off the pane that is the subject. */}
      <WorkspaceSidebar active="Add App" className="flex w-[136px]" />

      {/* min-w-0 is load-bearing. A flex child defaults to min-width:auto,
          so the pane refused to shrink below its widest child — the 520px app
          grid — and grew to 572 inside a 455px slot, pushing the composer's
          send button out past the card's edge. With it, the pane is the width
          the nav leaves it and the grid is the only thing that overflows,
          which is what the overflow was for. */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pl-8 pr-5 pt-8">
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
        <p className={`text-center tracking-[-0.01em] ${MOCK_TITLE}`}>
          Margot, what app will you add?
        </p>

        {/* The box, at the measure the product gives it rather than the card's
          full width — a composer run edge to edge across 709px stops reading as
          a thing you type one sentence into. */}
        <div className="mx-auto mt-5 w-full max-w-[400px]">
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
          <div className="rounded-[12px] bg-[linear-gradient(to_bottom,#d9ed92_0%,#9fd6c4_45%,#8ea2f4_100%)] p-px">
            <div className="rounded-[11px] bg-[var(--mock-window)] p-[3px]">
              <div
                className={`flex flex-col gap-3 rounded-lg border bg-[var(--mock-window)] px-3 py-2.5 ${LINE}`}
              >
                <span
                  className={`text-[color:var(--mock-ink-soft)] ${MOCK_BODY}`}
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
                    <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
                      <IconArrowUp className="size-[11px]" />
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
        <p className={`mt-16 text-[color:var(--mock-ink)] ${MOCK_PRIMARY}`}>
          Start from a template
        </p>
        <div className="mt-2.5 grid grid-cols-4 gap-2.5">
          {TEMPLATES.map((name) => (
            <div
              key={name}
              className={`overflow-hidden rounded-[8px] border bg-[var(--mock-window)] ${LINE}`}
            >
              {/* A plain cover, and plain on purpose. It carried each
                template's own drawn mark, which put four pieces of detailed
                artwork in a picture whose subject is the box above them — the
                marks were the highest-contrast thing on the card and the eye
                went to the shelf instead of to the thing you type into. Empty,
                the shelf reads as a shelf and the names do the naming.

                At this height the cover is most of what survives the card's
                fadeBottom, which starts at 84% of a 300px box — the name strip
                under it sits past the ramp's end and does not render. Raise
                fadeBottom on this pillar if the names should read; the markup
                is here and correct either way. */}
              <div className="h-[74px] bg-[var(--mock-well)]" />
              {/* Two lines of room, always. These are the templates' real names
                and the longest of them wraps in a card this wide — on one line
                with a truncate it came out "Client onboarding w…", which is a
                smaller mistake than a second set of shortened names but still a
                mistake. The min-height is what keeps the four cards ending on
                the same line once one of them wraps. */}
              <div
                className={`min-h-[36px] border-t px-2.5 py-2 ${MOCK_SECONDARY_STACKED} ${LINE}`}
              >
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
