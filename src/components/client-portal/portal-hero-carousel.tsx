"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ApprovalsMock,
  DocumentsMock,
  OnboardingMock,
  PortalSidebar,
} from "@/components/client-portal/segment-mock";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { getTemplateBySlug } from "@/lib/templates";

// ─────────────────────────────────────────────────────────────────────────
// The hero's product shot: one grey panel holding the app the reader picked,
// named top left, shown as a single window in the middle, with the row of
// apps to pick from along the bottom. Nothing moves on its own.
// ─────────────────────────────────────────────────────────────────────────

type Item = {
  key: string;
  title: string;
  description: string;
  /**
   * "fill" mocks bring their own ground, "inset" ones sit padded in the
   * window, and "bare" ones skip the window and sit on the panel itself.
   */
  frame: "fill" | "inset" | "bare";
  mock: ReactNode;
};

// Titles and descriptions come from the template data, so they cannot drift
// from /templates. The AI builder leads, since building your own is what
// sets this portal apart; it has no template.
function templateItem(
  slug: string,
  frame: Item["frame"],
  mock: ReactNode,
): Item | null {
  const t = getTemplateBySlug(slug);
  return t
    ? { key: slug, title: t.title, description: t.description, frame, mock }
    : null;
}

/**
 * Puts the client's nav down the left of a mock that does not carry one.
 * ApprovalsMock builds its own; these two were drawn as bare screens, so in a
 * set meant to read as four views of ONE portal they looked like three
 * different products. Composed here rather than added inside the mocks, because
 * the cards further down the page deliberately vary — only one of those carries
 * a sidebar, and that is the card making the point.
 */
function WithSidebar({
  app,
  children,
}: {
  app: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background">
      <PortalSidebar app={app} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

const ITEMS: Item[] = [
  {
    key: "your-own",
    // Copy review: the label, its line and the prompt in PromptMock are mine,
    // not the brief's.
    title: "Your own app",
    description: "Described in a sentence, built by AI",
    frame: "bare" as const,
    mock: <PromptMock />,
  },
  templateItem("content-approval-flow", "fill", <ApprovalsMock />),
  templateItem(
    "client-onboarding-wizard",
    "fill",
    <WithSidebar app="Onboarding">
      <OnboardingMock />
    </WithSidebar>,
  ),
  // Builds its own sidebar now, like the approvals screen, so no wrapper.
  templateItem("document-collection", "fill", <DocumentsMock />),
  // Four, not five. A fifth name pushed the row past the panel and the last one
  // was clipped at the edge; the set is illustrating that the portal comes with
  // ready-made apps, which four do as well as five. The project tracker goes
  // rather than one of the others because the three kept are the ones the page
  // argues for further down. ProgressMock is untouched in segment-mock.tsx and
  // drops back in here if the row ever has room.
].filter((item): item is Item => item !== null);

// ── How big the window is drawn ──────────────────────────────────────────
//
// One fluid rule rather than a set of breakpoints. The mock inside is fluid
// (h-full / flex-1), so the window's width is a LAYOUT width: a bigger window
// means the mock reflows with more room at the same type size, not the same
// picture magnified. That makes stepped sizes actively wrong — each step popped
// the shot by over a hundred pixels mid-drag — while a fluid width simply
// tracks the panel.
//
// It also fixes what phones had before: a fixed 360px design width scaled to
// fit a 342px panel, which drew every label at 84% of its designed size. The
// mock was not smaller, it was fine print. Drawn at the width it will actually
// occupy, it reflows at full size and `scale` stays 1 everywhere except the
// narrowest phones.

/** Floor: below this the mock's own layout (sidebar beside content) crowds, so
 *  the last few pixels come out of scale instead of width. Only the narrowest
 *  phones reach it. */
const MIN_W = 320;
/** Ceiling: the shot is framed BY the panel, so past this it stops growing and
 *  the grey around it opens up instead. Without a cap a 1320px panel held a
 *  near-edge-to-edge window and there was no panel left to sit in. */
const MAX_W = 880;

/** Taller on a phone, where the mock stacks into rows and a letterbox leaves
 *  them nothing; wider as it grows, where it lays out side by side.
 *
 *  The phone end is close to square on purpose. At 3:4 the shot came out ~230px
 *  tall, and once the control sat on its foot there was very little screen left
 *  to look at. Only phones actually reach this value — from mid widths up the
 *  viewport cap below is the binding constraint, so raising it does not make
 *  the tall panels tall again. */
const MIN_RATIO = 0.95;
const MAX_RATIO = 0.55;

/**
 * Side gutter between window and panel edge, widening faster than the panel.
 * A flat 6% kept the window at ~88% of the panel at every size, so a 900px
 * panel held a 792px shot — nearly edge to edge, and tall to match — while a
 * 1320px one held the same proportion. Opening the gutter as the panel grows
 * is what keeps the shot a shot rather than the whole panel.
 *
 * Measured from MIN_W rather than from zero so phones are untouched: there the
 * term is near nothing and the gutter stays at its 16px floor.
 */
function padXFor(panelW: number): number {
  return Math.round(Math.min(140, Math.max(16, (panelW - MIN_W) * 0.18)));
}

/**
 * The shot's height is also capped against the VIEWPORT, not just its own
 * shape. Chrome is most of this block — the shot sat inside 144px of padding
 * under an 84px header and above a 62px row of names — so at its full shape it
 * ran to 92% of a 900px-tall window and the hero could not be seen whole. Tall
 * screens still get the full shape; short ones get a shorter shot rather than a
 * page that scrolls to show one picture.
 */
const VIEWPORT_BUDGET = 0.42;
/** …but never flatter than this, whatever the window height. */
const MIN_SHAPE = 0.42;

/**
 * Where the four names lay out whole on one row. Below this they are replaced
 * by the position, between the same two arrows.
 *
 * Measured rather than borrowed from a Tailwind breakpoint: the row of four is
 * 674px plus its gutters, so it fits from about 754. `lg` would hold the
 * stepper on panels with room to spare, and `md` would clip the last name.
 *
 * The shot bleeds off the foot at EVERY width — see FOOT_PX and the dissolve,
 * which are sized so the control always lands on solid ground however short the
 * shot is.
 */
const WIDE_FROM_PX = 760;

/**
 * The band the control occupies at the foot of the panel: a 36px button on 24px
 * of padding, plus a little air. The dissolve must be fully opaque by here or
 * the app's rows read through the arrows, which is exactly what went wrong when
 * the fade was sized to itself rather than to the thing sitting on it.
 */
const FOOT_PX = 64;

/**
 * The dissolve that takes the foot of the shot into the panel ground. Its
 * height tracks the shot so a short one is not half swallowed, and its stop is
 * worked back from FOOT_PX so the opaque part always starts above the control —
 * on a phone that means a shorter, firmer fade, on desktop a long soft one.
 */
function dissolveFor(h: number): { height: number; stop: number } {
  const height = Math.round(Math.min(160, Math.max(96, h * 0.3)));
  return { height, stop: Math.round(((height - FOOT_PX) / height) * 100) };
}

type Fit = {
  w: number;
  h: number;
  scale: number;
  padY: number;
  /**
   * Wide enough for the names row, and so for the shot to bleed off the foot.
   */
  wide: boolean;
};

function fitFor(panelW: number, viewportH: number): Fit {
  const avail = Math.max(1, panelW - 2 * padXFor(panelW));
  const w = Math.min(MAX_W, Math.max(MIN_W, avail));
  // How far along the phone→desktop range this width sits. Drives the shape and
  // the vertical padding together, so both ease instead of stepping.
  const t = Math.min(1, Math.max(0, (w - MIN_W) / (MAX_W - MIN_W)));
  const shaped = w * (MIN_RATIO + (MAX_RATIO - MIN_RATIO) * t);
  const h = Math.round(
    Math.max(w * MIN_SHAPE, Math.min(shaped, viewportH * VIEWPORT_BUDGET)),
  );
  return {
    w,
    h,
    scale: Math.min(1, avail / w),
    // Tied to the shot rather than fixed, so a shot the viewport shortened does
    // not keep a desktop-sized band of grey above and below it.
    padY: Math.round(Math.min(56, Math.max(20, h * 0.11))),
    wide: panelW >= WIDE_FROM_PX,
  };
}

export function PortalHeroCarousel() {
  const [active, setActive] = useState(0);
  const [fit, setFit] = useState<Fit | null>(null);
  const [headerH, setHeaderH] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const apply = () => {
      setFit(fitFor(el.clientWidth, window.innerHeight));
      // Measured, not assumed: the description wraps to a second line on a
      // phone, so this is taller there than on desktop.
      setHeaderH(headerRef.current?.offsetHeight ?? 0);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    if (headerRef.current) observer.observe(headerRef.current);
    // The panel's own box does not change when only the window's HEIGHT does,
    // so the ResizeObserver never fires for it — and height is now an input.
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  // Server render and first paint, before the panel has been measured. The
  // panel is hidden until `fit` lands, so these only set the shape of an
  // invisible box.
  const F = fit ?? fitFor(1320, 900);
  const current = ITEMS[active];

  /**
   * What the bare composer keeps clear at the foot of the shot.
   *
   * It is `headerH + padY` because the shot is NOT the frame the composer
   * reads against — the panel is, and the panel carries the title block above
   * the shot. Centred in the shot alone it came out that much below the middle
   * of the panel, which is what reads as "sitting low". This is the exact
   * offset that puts it on the panel's centre line; the floor keeps it clear of
   * the control if the header is ever tiny.
   */
  const bareFoot = Math.max(FOOT_PX, headerH + F.padY);

  return (
    <div
      ref={panelRef}
      // Flat ground, deliberately: the gradient belongs to the product shot
      // sitting on it, and two graded surfaces one inside the other cancel each
      // other out — the shot stops reading as a separate thing.
      //
      // Held as a token because the dissolve at the foot of the stage has to
      // END on exactly this colour; as two separate declarations they drift the
      // moment one is touched and the fade stops at a visible edge. Same two
      // values as before — dark is what white/6 over the page ground composited
      // to — each in its own theme block.
      className="relative mt-12 overflow-hidden rounded-[28px] bg-[var(--portal-ground)] [--portal-ground:#f5f5f5] md:mt-16 [[data-theme=dark]_&]:[--portal-ground:#191919]"
      style={{ opacity: fit ? 1 : 0 }}
    >
      <div
        ref={headerRef}
        className="px-6 pt-6 md:px-10 md:pt-8"
        aria-live="polite"
      >
        <p className="text-base text-foreground">{current.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {current.description}
        </p>
      </div>

      <div
        role="tabpanel"
        id="portal-hero-panel"
        aria-label={current.title}
        // Padded at the top only. The shot runs OFF the bottom of the panel
        // rather than floating clear of it with a band of grey underneath: it
        // reads as a window onto an app that carries on past the frame, which
        // is what the cards further down the page already do.
        className="relative"
        style={{ height: F.h * F.scale + F.padY }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={item.key}
            aria-hidden={i !== active}
            className={`absolute bottom-0 left-1/2 transition-opacity duration-500 motion-reduce:transition-none ${
              i === active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{
              width: F.w,
              height: F.h,
              marginLeft: -F.w / 2,
              bottom: 0,
              // Scaled from the bottom edge, so a scaled-down shot stays welded
              // to the foot of the panel instead of lifting off it.
              transformOrigin: "bottom center",
              scale: String(F.scale),
            }}
          >
            <Window item={item} foot={bareFoot} />
          </div>
        ))}

        {/* Dissolves the foot of the shot into the panel so it ends by fading
            rather than on a hard edge, and gives the control something to sit
            on. Ends on the ground colour exactly — see the token on the panel —
            and reaches it above the control, or the app's rows read through the
            arrows. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: dissolveFor(F.h * F.scale).height,
            backgroundImage: `linear-gradient(to bottom, transparent 0%, var(--portal-ground) ${dissolveFor(F.h * F.scale).stop}%)`,
          }}
        />
      </div>

      {/* Names alone — no arrows beside them. Every name is already a one-tap
          way to any screen, so a pair of arrows next to them is a second
          control for a job the first one does better.

          The names only appear where the row lays out whole (see
          WIDE_FROM_PX); scrolled sideways it showed one whole pill between two
          cut words, with no edge to say it scrolled, so the labels read as
          broken rather than as more. Narrower than that the arrows are the
          whole control, because there the names cannot be shown at all.

          Sitting on the dissolve rather than under the shot, so the shot can
          reach the foot. */}
      {F.wide ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center px-10 pb-7">
          {/* The same switch the AI app builder's hero uses (ViewToggle in
              builder-hero-visual.tsx): the pills sit INSIDE a bordered track
              rather than floating on the panel, so the set reads as one control
              with a selected segment. Loose pills on the ground were a second
              style for something the site had already settled. */}
          <div
            role="tablist"
            aria-label="Apps in the portal"
            className="flex items-center gap-0.5 rounded-full border border-border p-1 [[data-theme=dark]_&]:border-white/15"
          >
            {ITEMS.map((item, i) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="portal-hero-panel"
                onClick={(e) => {
                  setActive(i);
                  revealTab(e.currentTarget);
                }}
                onKeyDown={(e) => {
                  const dir =
                    e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                  if (!dir) return;
                  const next = (i + dir + ITEMS.length) % ITEMS.length;
                  setActive(next);
                  const tabs = e.currentTarget.parentElement?.children;
                  const el = tabs?.[next] as HTMLElement | undefined;
                  el?.focus();
                  if (el) revealTab(el);
                }}
                tabIndex={i === active ? 0 : -1}
                className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1 text-sm transition-colors duration-300 ${
                  i === active
                    ? "border-border bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* The phone control. Steps rather than tabs: the app's name is already
          the line above the shot, so the control's job is only to move, and two
          chevrons either side of the position do that in a row that cannot be
          cut off however long the names get. The square chevron button is the
          shape the changelog's pager already collapses to on a phone, for the
          same reason — a label that will not fit becomes an arrow. */}
      {F.wide ? null : (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4 px-6 pb-6">
          <StepButton
            direction="prev"
            onClick={() =>
              setActive((i) => (i - 1 + ITEMS.length) % ITEMS.length)
            }
          />
          {/* Tabular figures so the row does not shift width as the number
            changes under the thumb. */}
          <p className="text-sm tabular-nums text-muted-foreground" aria-hidden>
            {active + 1} / {ITEMS.length}
          </p>
          <StepButton
            direction="next"
            onClick={() => setActive((i) => (i + 1) % ITEMS.length)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * One step of the control, on both layouts. A 32px square holding a 14px
 * chevron: the changelog pager's glyph, a size down from its 36px box. The
 * arrows sit ON the shot here rather than under an archive, so they want to be
 * the quietest thing in the frame — at 44px the box dwarfed its own chevron and
 * the pair read as the heaviest thing on the panel.
 */
function StepButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-controls="portal-hero-panel"
      aria-label={direction === "prev" ? "Previous app" : "Next app"}
      className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={direction === "prev" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
      </svg>
    </button>
  );
}

/**
 * Keeps the tab you just picked inside the scroller. The row scrolls sideways
 * on a phone rather than wrapping, so arrowing or tapping towards either end
 * used to select a tab sitting off the edge, with nothing to show which one was
 * active. Scrolls the row itself rather than calling scrollIntoView, which
 * would also scroll the page to the hero.
 */
const TAB_REVEAL_PAD = 16;

function revealTab(el: HTMLElement) {
  const row = el.parentElement;
  if (!row) return;
  const left = el.offsetLeft - TAB_REVEAL_PAD;
  const right =
    el.offsetLeft + el.offsetWidth - row.clientWidth + TAB_REVEAL_PAD;
  if (left < row.scrollLeft) row.scrollTo({ left, behavior: "smooth" });
  else if (right > row.scrollLeft)
    row.scrollTo({ left: right, behavior: "smooth" });
}

/**
 * `foot` is FOOT_PX: the band the control sits in. A `fill` or `inset` mock is a
 * screen carrying on past the frame, so it runs under the control quite happily.
 * A `bare` one is not a screen at all — it is a composer floating on the panel —
 * so it keeps clear and centres in what is actually visible. Without it the
 * composer centred on the whole window, part of which is behind the control,
 * and sat low against it.
 */
function Window({ item, foot }: { item: Item; foot: number }) {
  if (item.frame === "bare") {
    return (
      <div className="h-full" style={{ paddingBottom: foot }}>
        {item.mock}
      </div>
    );
  }
  return (
    <div
      // The screen's own surface is graded rather than flat: a top-down fall
      // across 500px of white is what makes it read as a lit screen instead of
      // a white rectangle. Light and dark carry their own ramps — nothing is
      // shared.
      //
      // Shallow on purpose. It used to land on #f3f6f9, within a few levels of
      // the panel ground behind the shot, so a screen whose own fill is cleared
      // below (the `fill` branch) had no white left in its lower half and sank
      // into the page — worst on the onboarding screen, which is mostly ground.
      // Blending into the panel is the DISSOLVE's job at the very foot; up here
      // the screen should still read as white. Dark had the same fault and the
      // same fix: its ramp ended on #191919, the exact ground colour, so the
      // screen had no edge at all down there.
      //
      // `fill` mocks paint their own ground edge to edge, so the gradient would
      // sit under an opaque layer; clearing the mock's root fill here (and only
      // here) lets it through. Scoped to this component, so the same mocks keep
      // their solid ground on the cards further down the page.
      className={`h-full w-full overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,#ffffff_0%,#fdfefe_55%,#fafbfd_100%)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.28)] [[data-theme=dark]_&]:bg-[linear-gradient(180deg,#242424_0%,#222222_55%,#1f1f1f_100%)] [[data-theme=dark]_&]:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] ${
        item.frame === "inset" ? "p-6" : "[&>*]:bg-transparent"
      }`}
    >
      {item.mock}
    </div>
  );
}

/**
 * The builder's composer with a request for an app no template covers, set
 * straight on the panel: the point is that building starts from a sentence.
 */
function PromptMock() {
  return (
    <div aria-hidden className="flex h-full select-none items-center">
      {/* Capped and centred rather than full width. The window grew to 880px,
          and a composer stretched across all of it stopped reading as a box you
          type a sentence into — one line of text left most of it empty. This is
          about the measure the real composer sits at. */}
      {/* Shorter on a phone: the empty run under the sentence is there to say
          "there is room to type more", and at phone width it was most of the
          shot rather than a hint. */}
      <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-background p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5 [[data-theme=dark]_&]:bg-white/[0.06]">
        <p className="min-h-[44px] text-[15px] leading-[1.6] text-foreground sm:min-h-[72px]">
          Build a retainer tracker my clients can check their hours in.
        </p>
        <div className="mt-4 flex justify-end">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <IconArrowUp className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
