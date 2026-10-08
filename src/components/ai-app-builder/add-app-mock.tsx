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

import { IconChevronDown, IconPlus } from "@/components/home/mock-icons";
import { IconArrowUp } from "@/components/home/build-step-visual";

const LINE = "border-[var(--mock-line)]";

/**
 * The shelf under the box. Four, because four is what fits the card's width at
 * the size the product draws them — a fifth would take every card under 140px
 * and the names start wrapping.
 *
 * The names are the ones /templates and the section further down this page
 * use, so a visitor who keeps scrolling meets the cards they just saw in the
 * picture rather than a different four. The covers are blank — see below.
 */
const TEMPLATES = [
  "Client onboarding wizard",
  "Client project tracker",
  "Proposal builder",
  "Time tracker",
];

export function AddAppMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col bg-[var(--mock-window)] px-6 pt-10 text-[color:var(--mock-ink)]"
    >
      {/* Named, because the product names you. "What app will you add?" on its
          own is a page title; with the name in front of it, it is the workspace
          talking to the person who opened it, which is the difference between a
          screenshot of a form and a screenshot of somebody's Monday. */}
      <p className="text-center text-[17px] leading-[1.3] tracking-[-0.01em]">
        Margot, what app will you add?
      </p>

      {/* The box, at the measure the product gives it rather than the card's
          full width — a composer run edge to edge across 709px stops reading as
          a thing you type one sentence into. */}
      <div className="mx-auto mt-5 w-full max-w-[460px]">
        {/* THE DOUBLE OUTLINE — the composer's own hairline, a 3px band of the
            screen's ground, then a second line around that. It is the
            treatment the hero's composer and the Describe card both wear, and
            it is what makes the band read as a GAP rather than as a fat
            border: the middle layer is --mock-window, the same tone as the
            screen behind it, so what you see between the two lines is the page
            showing through.

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
              <span className="text-[12.5px] leading-[1.4] text-[color:var(--mock-ink-soft)]">
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
                  <span className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                    Auto
                    <IconChevronDown className="size-[9px] shrink-0" />
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

      {/* The shelf. Ranged left under a centred box on purpose — it is a list
          of things, and a centred list of four is a decoration. */}
      <p className="mt-9 text-[11.5px] leading-none text-[color:var(--mock-ink)]">
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
                the shelf reads as a shelf and the names do the naming. */}
            <div className="h-[74px] bg-[var(--mock-well)]" />
            {/* Two lines of room, always. These are the templates' real names
                and the longest of them runs to two lines in a 150px card — on
                one line with a truncate it came out "Client onboarding w…",
                which is a smaller mistake than a second set of shortened names
                but still a mistake. The min-height is what keeps the four
                cards ending on the same line once one of them wraps. */}
            <div
              className={`min-h-[36px] border-t px-2.5 py-2 text-[10.5px] leading-[1.35] ${LINE}`}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
