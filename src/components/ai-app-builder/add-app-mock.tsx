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
import { WorkspaceSidebar } from "@/components/home/workspace-sidebar";
import { IconArrowUp } from "@/components/home/build-step-visual";

const LINE = "border-[var(--mock-line)]";

/**
 * The library under the box — the product's "Browse all apps" shelf.
 *
 * It was four template cover cards, which made the screen say "start from a
 * template" twice: once here and once in the page's own templates section a
 * few screens down. The library is the other half of the claim above it —
 * "one place" is a place that already HAS apps in it, and a named list of
 * twenty-one of them says that where four blank covers did not.
 *
 * Six, in three columns — the product's own column count. Three is what makes
 * the row read as a LIBRARY rather than as a short list, and it costs about
 * 45px per card against two.
 *
 * Which is why these six and not the page's flagship templates. A card is
 * ~165px here, leaving ~119px for type, and "Client project tracker" and
 * "Client onboarding wizard" both truncate in that. Every app named below fits
 * at full length, name and line, with its own line written to the same
 * measure — a truncated name in a mock of a product is worse than showing six
 * other real apps out of twenty-one.
 */
const APPS = [
  { name: "Document collector", about: "Docs with a checklist" },
  { name: "Helpdesk", about: "Guides for clients" },
  { name: "Data room", about: "Share files securely" },
  { name: "Proposals", about: "Branded, e-signable" },
  { name: "Design approvals", about: "Sign-off by round" },
  { name: "New client intake", about: "Scope, goals, budget" },
];

/**
 * The filters over the library. "All" is the one that is on, and the rest are
 * the product's own categories in its own order; "More" is where the row stops
 * rather than an invented category, which is what keeps the set honest at a
 * width that cannot hold eleven of them.
 */
const FILTERS = [
  "Knowledge base",
  "Dashboards",
  "Internal",
  "Trackers",
  "More",
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
        {/* 15px, down from 17. It is the biggest type in the shot either way,
          which is right — it is the screen's own h1 — but at 17 against a
          12.5px composer and a 10.5px nav it was nearly half again the size of
          everything else and read as a marketing headline that had wandered
          into a product screenshot. 15 still leads the page and stays in the
          same family as the type under it. */}
      <p className="text-center text-[15px] leading-[1.3] tracking-[-0.01em]">
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
                    {/* The word alone, no chevron. A caret says "this opens",
                  which in a still picture is a promise the picture cannot
                  keep — and at 9px it read as a smudge beside the type
                  rather than as a mark. */}
                    <span className="rounded-[4px] px-1.5 py-1 text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
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

        {/* The library. Ranged left under a centred box on purpose — it is a
          list of things, and a centred list is a decoration.

          The count is the point of the heading, not decoration: "Browse all
          apps" alone is a link, "21" is the claim that the place you just
          typed into is already full. */}
        {/* mt-16. The library is the screen's SECOND thing, and the gap is what
          separates "say what you want" from "or take one of these" — at 32px
          the chips read as hanging off the composer, and at 48 they were still
          close enough to belong to it. 64 is where the two stop being one
          block; it also puts the composer nearer the optical middle of the
          part of the screen the card shows. */}
        <div className="mt-16 flex items-baseline gap-2">
          <span className="text-[11.5px] leading-none text-[color:var(--mock-ink)]">
            Browse all apps
          </span>
          <span className="text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
            21
          </span>
        </div>

        {/* Filters, with search pushed to the far end of the row the way the
          product has it. The chips are the mocks' own shape (R_CHROME, a
          hairline, the window ground); the one that is ON takes the solid well
          and drops its border, so the set reads as one control with a
          selection rather than as six buttons. */}
        <div className="mt-2.5 flex items-center gap-1.5">
          <span
            className={`shrink-0 rounded-[4px] bg-[var(--mock-well-2)] px-2 py-1 text-[10px] leading-none text-[color:var(--mock-ink)]`}
          >
            All
          </span>
          {FILTERS.map((f) => (
            <span
              key={f}
              className={`shrink-0 rounded-[4px] border bg-[var(--mock-window)] px-2 py-1 text-[10px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
            >
              {f}
            </span>
          ))}
          <span
            className={`ml-auto flex w-[104px] shrink-0 items-center rounded-[4px] border bg-[var(--mock-window)] px-2 py-1 text-[10px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
          >
            Search
          </span>
        </div>

        {/* Wider than the pane, on purpose. Three columns at the pane's own
            width would be ~130px each and truncate half the names; at 520 they
            are the width they are drawn for and the third column runs off the
            card's right edge — which is the crop this whole shot already
            carries. A screen that continues is the claim; a truncated product
            name is a mistake. */}
        <div className="mt-2.5 grid w-[520px] grid-cols-3 gap-2">
          {APPS.map(({ name, about }) => (
            <div
              key={name}
              className={`flex items-center gap-2 rounded-[8px] border bg-[var(--mock-window)] px-2 py-2 ${LINE}`}
            >
              {/* A plain tile, no glyph. The product draws each app's own mark
                here; six pieces of artwork in a list whose job is to say "there
                are twenty-one of these" put the detail on the wrong thing, and
                the same argument already took the marks off the covers this
                list replaces. */}
              <span className="size-[22px] shrink-0 rounded-[6px] bg-[var(--mock-well)]" />
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate text-[11px] leading-none text-[color:var(--mock-ink)]">
                  {name}
                </span>
                <span className="truncate text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
                  {about}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
