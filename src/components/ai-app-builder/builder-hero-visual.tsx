"use client";

// ─────────────────────────────────────────────────────────────────────────
// BUILDER HERO VISUAL — the brief's one product shot, split into two cards so
// each half has room. Left: the builder chat, where a Brandmages team member
// asks for a year-end checklist and the builder thinks, then returns a plan.
// Right: the result as one screen with a toggle, flipping between the team's
// dashboard in Assembly's own neutral chrome and one client's view in
// Brandmages' branded client experience, so the reader sees the same app open
// in both places.
//
// Each card's mock is drawn once at a fixed design size and scaled into its
// card (MockFit), because reflowing a composition this tuned only cramps it.
// Built from the builder mocks' chat and sidebar rows, the year-end checklist
// rows, and the --mock-* status tokens. Brandmages' brand colour is black,
// and its logo a black mark on a white tile.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import { MockFit } from "@/components/templates/mock-fit";
import {
  NavItem,
  SectionLabel,
} from "@/components/home/build-app-visual";
import { IconArrowUp } from "@/components/home/build-step-visual";
import {
  IconBookBlank,
  IconBook,
  IconBrandMark,
  IconChat,
  IconGlobe,
  IconPlus,
  IconUsers,
} from "@/components/home/mock-icons";

// Each card's design size; MockFit scales it to the card's width.
// Narrow enough that the card's fixed height, not its width, sets the scale,
// so the chat holds still while the cards trade widths.
const CHAT_W = 480;
const CHAT_H = 500;
const LIVE_W = 720;

/**
 * The sentence the box writes — one, not a set.
 *
 * It has to be THIS one, because the card beside it is the app this sentence
 * asks for: "Year-end docs" in the portal's own nav, with every client's
 * upload status beside it. The two cards are one claim read left to right —
 * you describe it, and that is what your clients get — so a box cycling
 * through three prompts broke it twice over: it ended on an app the picture
 * does not show, and it offered a choice where the point is a consequence.
 *
 * So: change this line and the Live card beside it has to change with it.
 */
const PROMPT = "Build a year-end document checklist my clients can upload to.";

// Brandmages' brand colour is black, so the client side runs on ink: fills take
// the foreground, and the sidebar is the brand itself, near-black with white
// type in both themes, the way a firm's portal carries its colour.
const BRAND_FILL = "bg-foreground text-background";
// The firm's slab. Near-black in light, and in DARK it carries colour instead:
// at #121212 on a #191919 card it read as absence rather than as a brand, which
// is the one thing this screen is claiming. Scoped here rather than pushed into
// --mock-brand, because that token is also the branded nav on /ai-app-builder
// and in the comparison mocks, and those are not what was asked for.
//
// Near-black in both themes, from --mock-brand. Blue was tried here and taken
// back out: a slab is a large flat FIELD, and a colour that reads as a
// pleasant accent on a chip glares at 160x300 against a near-black card.
// Dropped to a deep navy it stopped glaring but also stopped being worth the
// departure, so the slab stays the firm's own near-black.
const BRAND_SIDEBAR = "bg-[var(--mock-brand)] text-white";

const LINE = "border-[var(--mock-line)]";
// A light lift only: the windows sit on a grey card, so a soft edge is enough
// to separate them without a heavy drop shadow underneath.
const WINDOW = `overflow-hidden rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
// The result views' shared furniture, after the dashboards they stand in for:
// a page header, then white panels on the screen's grey ground, tables with a
// tinted label row.
const PANEL = `mt-4 overflow-hidden rounded-lg border bg-[var(--mock-window)] ${LINE}`;
const TABLE_HEAD = `flex items-center gap-5 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`;

const CHIP = "rounded px-1.5 py-[4px] text-[11px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const WARNING = `${CHIP} bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]`;
const NEUTRAL = `${CHIP} bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]`;
// The column keeps a fixed width so the header lines up; the pill inside hugs
// its label.
const STATUS_COL = "flex w-[78px] shrink-0 justify-start";
// A hovered table row takes the same tint as the table head, so it reads as
// part of the table rather than as a new colour. Both views use it: the
// sidebar rows already answered the pointer and the rows beside them did not.
const ROW_HOVER = "transition-colors hover:bg-[var(--mock-well)]";

// The card's widening transition, matched below on the grid. A replay started
// by the opening click waits this out so the two moves read in order.
const EXPAND_MS = 560;

// idle    — the card at rest: the prompt sitting in the box, nothing sent.
// sent     — the prompt has left the box and is a message in the thread.
// planned  — the requirements have come back under it.
type Phase = "idle" | "typing";

/**
 * Opens at rest — an empty box with its placeholder — and types the prompt out
 * on the reader's click, rather than looping on its own.
 *
 * It used to run a three-beat thread: the sentence left the box as a message,
 * three seconds passed, and a Requirements card with an Approve button came
 * back. That was the product's whole plan-and-approve flow squeezed into a
 * hero card, and it spent most of its height on the answer rather than on the
 * thing this card is named for. The card says "Describe it", so what it shows
 * is the describing.
 *
 * `play` takes a delay so the click that opens the card can also start the
 * run: the card widens first, then the typing starts, instead of both at once.
 * `run` increments on every play, which is what restarts the composer's run:
 * a replay rubs out whatever is in the box and writes the line again, rather
 * than resuming on a finished one.
 */
function useBuildDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const queued = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (queued.current) clearTimeout(queued.current);
    },
    [],
  );

  /** Drops the demo back to rest and cancels anything queued. */
  const stop = () => {
    if (queued.current) clearTimeout(queued.current);
    queued.current = null;
    setPhase("idle");
  };

  const play = (delay = 0) => {
    if (queued.current) clearTimeout(queued.current);
    setRun((n) => n + 1);
    setPhase("idle");
    if (delay <= 0) {
      setPhase("typing");
      return;
    }
    queued.current = setTimeout(() => setPhase("typing"), delay);
  };

  return { phase, run, play, stop };
}


// The result card's two views, with the brief's labels for each side.
const VIEWS = ["Your team", "Your clients"] as const;
// Below the side-by-side breakpoint only one card shows, picked by this switch.
const CARDS = ["Describe it", "See it live"] as const;

const CARD =
  "flex flex-col overflow-hidden rounded-[28px] transition-[background-color,box-shadow] duration-300";
// Both cards share one grey; the clicked card is marked by width, not colour,
// and hover only firms up the outline.
const cardTone = (active: boolean) =>
  `bg-[var(--surface)] ring-1 ${
    active
      ? "ring-black/[0.06] hover:ring-black/[0.12] [[data-theme=dark]_&]:ring-white/10 [[data-theme=dark]_&]:hover:ring-white/20"
      : "ring-transparent hover:ring-black/[0.08] [[data-theme=dark]_&]:hover:ring-white/15"
  }`;
const CARD_PAD = "p-6 md:p-8";
const HEAD_ROW = "flex min-h-[40px] items-center";

export function BuilderHeroVisual() {
  const { phase, run, play, stop } = useBuildDemo();
  // Manual only: the reader chooses which side to look at.
  const [view, setView] = useState(0);
  const [active, setActive] = useState<"chat" | "live">("live");
  // The demo belongs to the chat card, so it runs only while that card is the
  // open one. Narrowing it stops the replay rather than letting it play on
  // behind a panel nobody is looking at.
  useEffect(() => {
    if (active !== "chat") stop();
    // `stop` is recreated each render and would re-fire this on every one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  // Kept apart from `active` so the phone opens on the prompt, in reading
  // order, without changing which card desktop widens first.
  const [shown, setShown] = useState(0);
  // Both cards share one grid cell below lg, so the taller one holds the
  // height and switching never moves the page.
  const cardSlot = (i: number) =>
    `[grid-area:1/1] lg:[grid-area:auto] ${shown === i ? "" : "invisible lg:visible"}`;

  return (
    <div className="mt-12 md:mt-16">
      {/* Two cards rather than one composed scene: each half gets its own frame
        and scales on its own. On desktop the card the reader clicks widens and
        the other narrows, at a fixed height so the swap never moves the page.
        500px is the height the client portal hero's panel resolves to, so the
        two product pages open on a band of the same depth — at 600 this one sat
        a hundred pixels lower before the page began. */}
      <div
        className={`grid gap-3 transition-[grid-template-columns] duration-[560ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:h-[500px] ${
          active === "chat"
            ? "lg:grid-cols-[7fr_5fr]"
            : "lg:grid-cols-[5fr_7fr]"
        }`}
      >
        <div
          className={`${CARD} ${CARD_PAD} relative min-w-0 justify-center lg:justify-start ${cardTone(active === "chat")} ${cardSlot(0)}`}
        >
          {/* The whole card replays the build, so it moves only when the reader
            asks for it. */}
          <button
            type="button"
            onClick={() => {
              // Expanding and replaying at once read as a jump: the card was
              // still widening while the thread blanked out under it. So the
              // click that opens the card queues the replay behind the widen
              // rather than skipping it — opening the card is what the reader
              // asked to watch, and a second click should not be the price.
              if (active !== "chat") {
                setActive("chat");
                play(EXPAND_MS);
                return;
              }
              play();
            }}
            aria-label="Replay the builder writing the plan"
            className="absolute inset-0 z-10 cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
          />
          {/* Same row height and the same top edge as the toggle's row beside
            it, so both mocks start on one line. Below lg the switch above
            already names the card.

            Out of the flow, though, unlike that one: this card's whole content
            is a single box that should sit on the card's centre line. In flow
            the heading and its margin took 64px off the top of the space the
            box centres in, so the box sat ~95px below the middle of the card
            while the heading above it had an empty third to itself. */}
          <div
            className={`${HEAD_ROW} absolute inset-x-6 top-6 z-10 hidden md:inset-x-8 md:top-8 lg:flex`}
          >
            {/* type-body, not type-h4. These are the cards' NAMES, not headings —
                the page's own h1 is right above them — and at 18px each one sat
                alone at the top of a tall card reading as a second title. 15px
                is the step /templates uses for exactly this job.

                And muted, not full ink. At --foreground the label was set in
                exactly the same colour as the type INSIDE the mock under it,
                so it read as another line of that app's UI rather than as a
                caption naming it. Stepping it back to --muted-foreground is
                what separates the two — the label is the quieter thing,
                because the screen it names is the subject. A token rather than
                an opacity, so it holds its contrast against both themes'
                card instead of thinning towards whatever is behind it. */}
            <p className="type-body text-muted-foreground">Describe it</p>
          </div>
          {/* Above the card's replay button so Approve and Send can show a
            hover; everything else lets the pointer through to the button. */}
          <div
            aria-hidden
            className="pointer-events-none relative z-20 min-h-0 select-none lg:flex-1"
          >
            {/* No MockFit and no window: the composer lays out at the card's
              own width, at its own type size.

              It used to be a 480×500 panel scaled to fit, which at this card's
              height resolved to 0.744 — so 14px type rendered at 10.4px while
              the Live card beside it, which is not scaled, rendered its 13px at
              13px. The left half of the hero was simply smaller than the right.
              Dropping the fixed design size removes the scale, and dropping the
              white window stops the chat reading as a screenshot pasted onto
              the card: it is the card.

              The thread above the box is back, but not as it was. It was once
              a bubble repeating as a message what the box below still held as
              text, with the card's whole middle empty between them — the same
              sentence twice and nothing to look at. Now the prompt LEAVES the
              box when it is sent, so it is in one place at a time, and what
              fills the space is the plan that came back rather than air.

              No "Thinking…" line either. A spinner is the product telling you
              to wait; this card has three seconds to show what the builder
              does, and sending a message and getting requirements back IS
              that. The wait is the gap between the two, which needs no
              caption. */}
            {/* ONE measure for the three things stacked here. The composer
                used to cap itself at 560px while the thread above it ran the
                card's full width, so the sent message, the plan and the box
                were three different widths in a column — which is what made
                the card read as unorganised rather than as one conversation.
                The cap lives here now and the composer inherits it. */}
            <div className="mx-auto flex h-full w-full max-w-[560px] flex-col justify-center">
              <Composer run={run} typing={phase === "typing"} />
            </div>
          </div>
        </div>

        <div
          className={`${CARD} relative min-w-0 cursor-pointer ${cardTone(active === "live")} ${cardSlot(1)}`}
          onClick={() => setActive("live")}
        >
          <div
            className={`${HEAD_ROW} relative z-20 flex-wrap justify-between gap-3 ${CARD_PAD} pb-0 md:pb-0`}
          >
            <p className="type-body hidden text-muted-foreground lg:block">
              Live for your team and your clients
            </p>
            <ViewToggle options={VIEWS} view={view} onSelect={setView} />
          </div>
          {/* One screen, running off the card's right and bottom edges, so it
            reads as a window into the product rather than a framed picture.
            Its ground is off-white, not white, so where it meets the card's
            edge it does not melt into the white page below. */}
          {/* Size-contained so the screen fills whatever height the prompt
              card sets, rather than stretching both cards to its own. */}
          <WidthScaled
            designW={LIVE_W}
            className="mt-6 min-h-[280px] flex-1 pl-6 [contain:size] md:pl-8 lg:min-h-0"
          >
            <div
              // The mock ink is set on the canvas, not only on the leaves: most of
              // what is drawn inside sets no colour of its own and inherits,
              // and what it was inheriting was the PAGE's --foreground — tuned
              // for the near-black ground, not for this lifted panel.
              className={`mock-edge relative h-[760px] w-full overflow-hidden rounded-tl-xl border-l border-t bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE}`}
            >
              {/* The card clips this screen on two sides, which left the status
                  column sliced down its length — a hard edge that reads as a
                  rendering fault rather than as a crop. A short fade to the
                  card's own ground ends it instead. Over the screen, under
                  nothing: it is the last thing drawn.

                  Only the RIGHT edge is handled here. This box is the artwork's
                  own 760px height, and the card shows about 400px of it, so an
                  `inset-x-0 bottom-0` layer in here hangs 200-odd px BELOW the
                  card's crop and is never on screen — which is exactly what
                  "the bottom doesn't blend" was. The bottom fade is drawn on
                  the card instead, where the crop actually happens. The right
                  edge has no such problem: it is `inset-y-0`, so it spans
                  whatever is visible.

                  Two layers rather than one corner gradient: a single diagonal
                  would have dimmed the middle of the table, which is the part
                  worth reading. */}
              <div className="relative h-full">
                {VIEWS.map((label, i) => (
                  <div
                    key={label}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      view === i
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                  >
                    {i === 0 ? <TeamDashboard live /> : <ClientView />}
                  </div>
                ))}
              </div>
            </div>
          </WidthScaled>
          {/* The screen gives out into the card's own ground at the card's own
              foot. Anchored to the CARD, not to the artwork inside it: the
              card is what crops the picture, so the card is the only box whose
              bottom edge the fade can be measured against. Clipped by the
              card's 28px radius like everything else in it.

              TEAM VIEW ONLY. The client view leads with the firm's near-black
              brand slab running the full height of the screen, and a fade to
              the card's light ground across it does not read as the picture
              giving out — it reads as the slab going grey and dying, which is
              the highest-contrast thing this ramp can be asked to do. That
              screen keeps its hard bottom edge. Faded out rather than
              unmounted, on the same 500ms the two views cross on, so it leaves
              with the screen it belongs to instead of popping. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 transition-opacity duration-500 motion-reduce:transition-none ${
              view === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: edgeFade("to bottom") }}
          />
          {/* The right edge, on the CARD for the same reason the bottom one is:
              the screen is laid out wider than the card and overflows it by
              about 40px, so a ramp anchored to the ARTWORK put its strongest
              stretch past the crop — at the card's edge it was only two thirds
              through its run, which is why the status chips stayed solid right
              up to the cut. On the card it finishes where the picture actually
              ends. Spans the card's full height; the head row above carries
              z-20 so the toggle stays clear of it. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28"
            style={{ backgroundImage: edgeFade("to right") }}
          />
          {/* And the dark-only second pass over its tail: the long ramp ends at
              96% of --surface, invisible on white but 4% of #ededed still
              reads on #191919. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-14 [[data-theme=dark]_&]:block"
            style={{ backgroundImage: edgeFade("to right") }}
          />
          {/* A second, shorter ramp, DARK ONLY. The one above ends at 96% of
              --surface a row short of the crop, which is invisible on white
              but not on #191919: 4% of #ededed ink still reads, so the last
              row sat there as a legible ghost instead of giving out. Stacking
              a 64px ramp over the tail of the long one takes that stretch to
              solid without touching the light ramp, which is already right —
              see the globals.css note on tuning one theme into the other. */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 transition-opacity duration-500 motion-reduce:transition-none [[data-theme=dark]_&]:block ${
              view === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: edgeFade("to bottom") }}
          />
        </div>
      </div>
      {/* Under the picture rather than above it, so it reads as part of the
          shot and does not compete with the hero's buttons. */}
      <div className="mt-4 flex justify-center lg:hidden">
        <ViewToggle
          options={CARDS}
          view={shown}
          onSelect={(i) => {
            setShown(i);
            // Stacked, switching to the prompt card is the only "opening" it
            // has, and nothing is widening to wait for.
            if (i === 0) play();
          }}
        />
      </div>
    </div>
  );
}

// From this width up the cards sit side by side and the result screen is drawn
// at its natural size; below it, it scales to fit its full-width card.
const SIDE_BY_SIDE_PX = 1024;
// How far the screen runs past the card's right edge. No right padding inside
// it: panels run on past the crop, the way a real screen continues off-frame.
const BLEED_PX = 40;
// Stacked, just enough that the panels' borders clear the card's rounded
// corner without cropping the status column a phone still needs.
const STACKED_BLEED_PX = 12;
// Side by side the screen is drawn at its design size.
const SIDE_BY_SIDE_SCALE = 1;
// The narrowest layout the stacked screen reflows to before it starts scaling.
const STACKED_MIN_W = 460;

/**
 * Holds the result screen pinned to the top left and crops whatever runs past
 * the box. Side by side, the screen keeps its natural type size and reflows to
 * the card's width, so a narrowed card never shrinks the text; stacked, it
 * scales its design width to fit.
 */
function WidthScaled({
  designW,
  className = "",
  children,
}: {
  designW: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<{
    scale: number;
    width: number | string;
  } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The observer fires every frame while the cards trade widths, but side by
    // side the fit is constant. Re-rendering the whole result screen on each of
    // those frames is what made the expand stutter, so only a changed fit sets
    // state.
    const next = (fit: { scale: number; width: number | string }) =>
      setFit((prev) =>
        prev && prev.scale === fit.scale && prev.width === fit.width
          ? prev
          : fit,
      );
    const apply = () => {
      if (window.innerWidth >= SIDE_BY_SIDE_PX) {
        next({
          scale: SIDE_BY_SIDE_SCALE,
          width: `calc((100% + ${BLEED_PX}px) / ${SIDE_BY_SIDE_SCALE})`,
        });
        return;
      }
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      // Narrower than the design, the screen reflows to this width before it
      // shrinks, so a phone shows fewer columns at a readable size rather than
      // the whole desktop layout scaled down to fine print.
      const avail = el.clientWidth - pad;
      const scale = Math.min(SIDE_BY_SIDE_SCALE, avail / STACKED_MIN_W);
      next({ scale, width: (avail + STACKED_BLEED_PX) / scale });
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [designW]);

  return (
    <div
      ref={ref}
      aria-hidden
      // Takes hover (the sidebar rows respond) but stays out of the
      // accessibility tree and text selection; it is a picture of the product.
      className={`relative select-none overflow-hidden ${className}`}
    >
      <div
        className="origin-top-left"
        style={{
          scale: String(fit?.scale ?? 1),
          width: fit?.width ?? designW,
          opacity: fit ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** A pill switch: flips the result screen's side, and on phones picks the card. */
function ViewToggle({
  options,
  view,
  onSelect,
}: {
  options: readonly string[];
  view: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border p-1 [[data-theme=dark]_&]:border-white/15">
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onSelect(i)}
          aria-pressed={i === view}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1 text-sm transition-colors duration-300 ${
            i === view
              ? // No border on the thumb in DARK: the track already carries one
                // 4px outside it, so the pair read as two concentric rings
                // around one small control. The fill is what marks the thumb
                // there — lifted to 8% so it still reads once the ring is
                // gone. Light keeps its border, because a white thumb on a
                // near-white card has nothing else to separate it.
                "border-border bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:border-transparent [[data-theme=dark]_&]:bg-white/[0.08] [[data-theme=dark]_&]:shadow-none"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * The fade that ends the cropped screen on the card's bottom and right edges.
 *
 * It was `from-transparent to-[var(--surface)]` over 80px (bottom) and 96px
 * (right) — a two-stop linear ramp, which has a corner in its alpha curve at
 * each end. A corner in the curve is a visible line, so the fade meant to hide
 * a hard crop drew a soft band with its own hard edges instead, and over only
 * 80px the table rows went from fully readable to gone fast enough to read as
 * a cut rather than a dissolve.
 *
 * Eased and longer: the stops approximate an ease-in, so the screen gives way
 * slowly at first and the rate never changes sharply enough to show. Built
 * from --surface through color-mix rather than a hardcoded value, so it stays
 * the card's own ground in both themes.
 */
function edgeFade(direction: "to bottom" | "to right") {
  const mix = (pct: number) =>
    `color-mix(in srgb, var(--surface) ${pct}%, transparent)`;
  return (
    `linear-gradient(${direction}, transparent 0%, ${mix(4)} 18%, ` +
    `${mix(12)} 32%, ${mix(24)} 44%, ${mix(40)} 56%, ${mix(58)} 67%, ` +
    `${mix(75)} 77%, ${mix(88)} 86%, ${mix(96)} 94%, var(--surface) 100%)`
  );
}

/**
 * The builder's message box, and at rest the whole card: the prompt is in it as
 * typed text rather than above it as a sent message. Once a plan is waiting the
 * Requirements bar with Approve opens on top of it as the frame's first row, as
 * the product draws it — so expanding the card has something to land on.
 *
 * That bar used to be a grey tray wrapped around a white box. On a grey card
 * the tray had nothing to show against — --muted and the card's own grey are a
 * shade apart in light, and in dark both are a wash over near-black — so the
 * bar read as card, not as part of the input. Now the whole composer is one
 * bordered surface and the bar is a row inside it, separated by the same rule
 * the rest of the mock uses.
 */
/** How fast the box erases and writes. Erasing is quicker than typing — it is
 *  a line being cleared, not a line being composed. */
const ERASE_MS = 14;
const TYPE_MS = 32;
/** The beat the empty box is held for between the two. */
const TURNAROUND_MS = 260;

function Composer({ run, typing }: { run: number; typing: boolean }) {
  // Empty at rest, showing its placeholder, so the first thing the card does
  // is the thing it is named for: the sentence is written in front of you
  // rather than already sitting there. A replay rubs it out and writes it
  // again from nothing.
  const [text, setText] = useState("");
  // What is on screen right now, readable from inside the run below without
  // making `text` a dependency of it — which would restart the run on every
  // character it wrote.
  const shown = useRef("");
  const show = (value: string) => {
    shown.current = value;
    setText(value);
  };

  useEffect(() => {
    if (!typing) return;
    const next = PROMPT;
    let timer: ReturnType<typeof setTimeout>;
    let i = shown.current.length;
    let erasing = i > 0;
    // Both branches below write through a timer rather than straight from the
    // effect body, so the run is a subscription to a clock rather than a
    // cascading render.
    const tick = () => {
      if (erasing) {
        i -= 1;
        show(shown.current.slice(0, i));
        if (i > 0) {
          timer = setTimeout(tick, ERASE_MS);
          return;
        }
        erasing = false;
        timer = setTimeout(tick, TURNAROUND_MS);
        return;
      }
      i += 1;
      show(next.slice(0, i));
      if (i < next.length) {
        timer = setTimeout(tick, TYPE_MS);
        return;
      }
      finished = true;
    };
    // Whether the sentence got all the way out. A FINISHED run leaves its
    // sentence standing — that is the card's resting state, and the picture
    // beside it is the app this sentence asks for. An INTERRUPTED one does
    // not: leaving half a sentence frozen in the box reads as the demo having
    // broken, not as a demo at rest. So an interrupted run clears on its way
    // out and the placeholder comes back.
    //
    // This fires whenever `typing` drops — which is what the other card's
    // toggle does, since the demo is stopped while the chat card is not the
    // open one.
    let finished = false;
    // Reduced motion gets the destination and none of the journey — and that
    // counts as finished, or it would be wiped the moment anything changed.
    timer = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? setTimeout(() => {
          show(next);
          finished = true;
        }, 0)
      : setTimeout(tick, 120);
    return () => {
      clearTimeout(timer);
      if (!finished) show("");
    };
  }, [typing, run]);

  const box = (
    <div className="px-3.5 pb-2.5 pt-3">
      {/* A still, not a field. It was a textarea you could type into, which
          fought the replay button covering the card — a click on the box was
          the one click that did not replay — and the card is aria-hidden
          anyway, so nothing was reachable there on purpose.

          Three lines of height held open whether or not there is text in it,
          so the card does not change height as the sentence is rubbed out and
          a longer or shorter one takes its place. */}
      <p className="min-h-[59px] text-[14px] leading-[1.4] text-[color:var(--mock-ink)]">
        {/* The placeholder belongs to rest, not to the run: between rubbing
            the old line out and writing the new one the box is empty for a
            beat, and the placeholder flashing into that gap read as the field
            resetting rather than as someone retyping. */}
        {text ||
          (typing ? null : (
            <span className="text-[color:var(--mock-ink-soft)]/60">
              Describe what you want to build
            </span>
          ))}
        {/* The site's own caret blink, on only while a line is being written
            or cleared. At rest the sentence is a sentence, not a field still
            waiting for the rest of it. */}
        {typing ? (
          <span className="ml-[1px] inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-[var(--mock-ink)] motion-safe:animate-caret" />
        ) : null}
      </p>
      {/* The product's own composer footer: attach on the left, the model and
          send on the right. Without them the box was a bare field with one
          button floating in it, which is not what anyone types into. */}
      <div className="flex items-center justify-between">
        <span className="pointer-events-auto flex size-[26px] cursor-default items-center justify-center rounded-[4px] text-[color:var(--mock-ink-soft)] transition-colors hover:bg-[var(--mock-well)] hover:text-[color:var(--mock-ink)]">
          <IconPlus className="size-[13px]" />
        </span>
        {/* 12px between the model name and the send button, not 8: the button
            is a filled 26px tile and the label is loose grey type, so at 8 the
            words sat on the tile's edge and read as part of it. */}
        <span className="flex items-center gap-3">
          <span className="text-[12px] leading-none text-[color:var(--mock-ink-soft)]">
            Opus 5
          </span>
          {/* The mock's own ink, not the page's: this button sits on a lifted
              panel, and --foreground is tuned for the near-black ground. */}
          <span className="pointer-events-auto flex size-[26px] cursor-default items-center justify-center rounded-[4px] bg-[var(--mock-ink)] text-[color:var(--mock-window)] transition-opacity hover:opacity-85">
            <IconArrowUp className="size-[13px]" />
          </span>
        </span>
      </div>
    </div>
  );
  return (
    // The 560px cap it used to set itself now sits on the column above, so
    // the box shares a measure with the message and the plan rather than being
    // the only capped thing in the stack. 560px is the measure the site's
    // other composer already runs at.
    <div className="w-full pt-3">
      {/* Fill and rule, no cast. The panel is --mock-window inside the mock's
          own hairline, which is what every other window on these pages is made
          of; a drop shadow under it was a second way of saying the same thing
          and, on a card this large, a grey smudge across the ground under the
          box.

          DOUBLE OUTLINE: the element's own hairline, then a 3px band of the
          card's ground, then a second hairline — drawn as two spread shadows
          rather than a ring with an offset, so both lines and the gap between
          them are declared in one place and both read tokens. The gap is
          --surface because that is the card this box sits on, in both themes;
          a hardcoded grey there would show as a band the moment the theme
          flipped. Shadows are not clipped by the overflow-hidden above, so
          the outer line survives it. */}
      <div
        className={`overflow-hidden rounded-xl border bg-[var(--mock-window)] shadow-[0_0_0_3px_var(--surface),0_0_0_4px_var(--mock-line)] ${LINE}`}
      >
        {box}
      </div>
    </div>
  );
}

/** An outlined check circle, as the Requirements bar draws it. */
export function IconCheckCircleOutline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" />
      <path d="m5.6 8 1.6 1.6 3.2-3.2" />
    </svg>
  );
}

/** How many rows at the foot of the table fall inside the card's bottom fade. */
const QUIET_ROWS = 2;

/** The team's view, in Assembly's own neutral chrome. */
function TeamDashboard({ live }: { live: boolean }) {
  const rows = [
    {
      name: "Dana Whitfield",
      done: 8,
      status: "In progress",
    },
    {
      name: "Marcus Lee",
      done: 12,
      status: "Complete",
    },
    { name: "Priya Raman", done: 3, status: "Awaiting" },
    {
      name: "Owen Brooks",
      done: 10,
      status: "In progress",
    },
    {
      name: "Lena Ortiz",
      done: 12,
      status: "Complete",
    },
    {
      name: "Sam Patel",
      done: 6,
      status: "In progress",
    },
    {
      name: "Nina Alvarez",
      done: 12,
      status: "Complete",
    },
    {
      name: "Tomas Ferreira",
      done: 5,
      status: "Awaiting",
    },
    {
      name: "Grace Mwangi",
      done: 9,
      status: "In progress",
    },
  ];
  return (
    <div className="flex h-full">
      <div
        className={`flex w-[164px] shrink-0 flex-col border-r bg-[var(--mock-well)] px-1.5 py-2 [--mock-nav-size:13px] [--mock-nav-row:28px] [--mock-section-size:11px] ${LINE} [&>div:not(:first-child)]:h-[28px] [&>div:not(:first-child)]:transition-colors [&>div:not(:first-child):hover]:bg-border/50`}
      >
        <div className="flex items-center gap-1.5 px-1.5 pb-4 pt-3">
          <span className="flex size-[16px] items-center justify-center rounded-[3px] bg-foreground text-background">
            <IconBrandMark className="size-[9px]" />
          </span>
          <span className="text-[13px] leading-none text-[color:var(--mock-ink)]">
            BrandMages
          </span>
        </div>
        <NavItem icon={<IconBook />} label="CRM" />
        <NavItem icon={<IconUsers />} label="Team" />
        <SectionLabel>Apps</SectionLabel>
        <NavItem icon={<IconGlobe />} label="Home" />
        <NavItem icon={<IconChat />} label="Messages" />
        <NavItem icon={<IconBookBlank />} label="Year-end docs" active={live} />
        <NavItem icon={<IconPlus />} label="Add App" muted />
      </div>
      <div className="@container flex min-w-0 flex-1 flex-col">
        {/* The app's own bar, which this screen had none of: the pane began
            on a row of stat tiles, so nothing said WHICH app the table
            belonged to and the sidebar's lit row was carrying that alone.

            It is the AppHeader shape the other mocks in this family already
            use — name on the left, trailing content on the right, closed by a
            hairline. Just the app's name: an "Apps >" crumb in front of it
            spent two thirds of the bar's left side on a word that is already
            the lit row in the sidebar three inches away. Two actions, not the
            four a real toolbar carries — at 11px a fourth is a grey tick, and
            the shot is here to show where an app lands, not to be operated. */}
        <div
          className={`flex shrink-0 items-center border-b py-2.5 pl-5 pr-4 ${LINE}`}
        >
          <span className="min-w-0 truncate text-[12px] leading-none text-[color:var(--mock-ink)]">
            Year-end docs
          </span>
        </div>
        <div className="min-h-0 flex-1 pl-5 pt-4">
        <div>
          {/* Tinted in DARK only. --mock-window on --mock-window is no step at
              all, so on the dark card this strip was a hairline rectangle
              drawn around nothing; --mock-well is the family's own lift (in
              dark the wells step UP, see globals.css), which separates the
              summary from the table under it. Light already works — #ffffff
              inside a #e8e9ec hairline on a grey card is a clear panel — and
              a tint there would only muddy it. */}
          <div
            className={`${PANEL} mt-0! grid grid-cols-3 [[data-theme=dark]_&]:bg-[var(--mock-well)]`}
          >
            {[
              ["Clients", "9"],
              ["Complete", "3"],
              ["Awaiting", "2"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={`px-3.5 py-3 ${i ? `border-l ${LINE}` : ""}`}
              >
                <p className="text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
                  {label}
                </p>
                <p className="mt-2 text-[18px] leading-none text-[color:var(--mock-ink)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className={PANEL}>
            <div className={TABLE_HEAD}>
              <span className="flex-1">Client</span>
              {/* Dropped when the card narrows, so names keep their room. */}
              <span className="hidden w-[92px] @[420px]:block">Progress</span>
              {/* 78px, matching STATUS_COL on the rows below. It was 72, and
                  the 6px it was short pulled every column left of it out of
                  register with its own heading — which is why the bars started
                  before the "P" of Progress. Ranged left, like the chips. */}
              <span className="w-[78px]">Status</span>
            </div>
            {rows.map((row, i) => {
              // The last rows sit in the card's bottom fade and are drawn
              // EMPTY — no name, no count, no status, and no progress bar.
              // Anything with its own shape survives the fade as a legible
              // object floating in nothing, which reads as a rendering fault;
              // the row's border alone reads as the list carrying on past the
              // edge, which is what the crop is claiming.
              const quiet = i >= rows.length - QUIET_ROWS;
              return (
              <div
                key={row.name}
                className={`flex items-center gap-5 border-b px-3.5 py-[7px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
              >
                {/* The client's name, and nothing under it. The firm's name
                    sat below it in --mock-ink-soft, which made every row two
                    lines deep for a second piece of type nobody reads at this
                    size — the table is here to show a list of clients with
                    progress against each, not to be read. */}
                <span className="min-w-0 flex-1 truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                  {quiet ? "" : row.name}
                </span>
                <span className="hidden w-[92px] items-center @[420px]:flex">
                  {quiet ? null : (
                    <span className="h-[3px] w-[62px] overflow-hidden rounded-full bg-[var(--mock-well-2)]">
                      <span
                        className="block h-full rounded-full bg-[color:var(--mock-ink-soft)]"
                        style={{ width: `${(row.done / 12) * 100}%` }}
                      />
                    </span>
                  )}
                </span>
                <span className={STATUS_COL}>
                  <span
                    className={
                      row.status === "Complete"
                        ? POSITIVE
                        : row.status === "Awaiting"
                          ? WARNING
                          : NEUTRAL
                    }
                  >
                    {quiet ? "" : row.status}
                  </span>
                </span>
              </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/** One client's view, inside Brandmages' branded client experience. */
function ClientView() {
  const items = [
    { label: "Signed scope of work", state: "Received" },
    { label: "PO for next retainer", state: "Received" },
    { label: "Updated billing contact", state: "Received" },
    { label: "Campaign spend summary", state: "Upload" },
    { label: "Asset usage rights renewal", state: "Awaiting" },
    { label: "Next-year brand plan", state: "Awaiting" },
  ];
  // Drawn on the team view's exact grid (sidebar width, row heights, type
  // sizes), so flipping the toggle changes only the brand and the content.
  return (
    <div className="flex h-full">
      <div
        className={`flex w-[164px] shrink-0 flex-col px-1.5 py-2 ${BRAND_SIDEBAR}`}
      >
        <div className="flex items-center gap-1.5 px-1.5 pb-4 pt-3">
          {/* The firm's own logo: a black mark on a white tile, the same in
              both themes because it is their file, not our chrome. */}
          <span className="flex size-[16px] items-center justify-center rounded-[3px] bg-white text-black">
            <IconBrandMark className="size-[9px]" />
          </span>
          <span className="text-[13px] leading-none text-white">
            Brandmages
          </span>
        </div>
        {[
          { icon: <IconGlobe />, label: "Home" },
          { icon: <IconChat />, label: "Messages" },
          { icon: <IconBookBlank />, label: "Year-end docs", active: true },
        ].map(({ icon, label, active }) => (
          <div
            key={label}
            className={`flex h-[28px] items-center gap-2 rounded px-1.5 transition-colors ${
              active
                ? "bg-white/[0.12] text-white [[data-theme=dark]_&]:bg-white/[0.07]"
                : "text-white/60 hover:bg-white/[0.06] hover:text-white/90"
            }`}
          >
            <span className="flex shrink-0 items-center justify-center [&>svg]:size-[16px]">
              {icon}
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] leading-none">
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {/* The same bar the team side carries, so the two views are one app
            seen from two sides rather than two different screens — but with
            the app's name alone. The team's bar offers Export and Add client,
            which are the firm's actions; the client's equivalent would be an
            Upload control, and the rows below already carry one each, against
            the specific thing being asked for. */}
        <div
          className={`flex shrink-0 items-center border-b py-2.5 pl-5 pr-4 ${LINE}`}
        >
          <span className="min-w-0 truncate text-[12px] leading-none text-[color:var(--mock-ink)]">
            Year-end docs
          </span>
        </div>
        {/* pt-7, not pt-4. This screen has no bottom fade — the brand slab
            washed out under one — so the card crops it on a hard line, and at
            pt-4 that line fell exactly on a row's 1px bottom border. The
            border and the card's own 1px ring then sat together and read as a
            doubled rule. The extra 12px drops the crop into the middle of a
            row instead, where a cut row reads as a cut row.

            Worth knowing: this is a height coincidence, not a structural fix.
            If the card's height changes, a different row can land on the
            crop. The robust answer is the short fade the team side carries. */}
        <div className="min-h-0 flex-1 pl-5 pt-7">
        <div>
          <div
            className={`${PANEL} mt-0! px-3.5 py-3 [[data-theme=dark]_&]:bg-[var(--mock-well)]`}
          >
            <p className="text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
              Documents received
            </p>
            <p className="mt-2 text-[18px] leading-none text-[color:var(--mock-ink)]">
              8 of 12
            </p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--mock-well-2)]">
              <span
                className={`block h-full w-2/3 rounded-full ${BRAND_FILL}`}
              />
            </div>
          </div>
          <div className={PANEL}>
            <div className={`${TABLE_HEAD} pr-16!`}>
              <span className="flex-1">Document</span>
              {/* 78px, matching STATUS_COL on the rows below. It was 72, and
                  the 6px it was short pulled every column left of it out of
                  register with its own heading — which is why the bars started
                  before the "P" of Progress. Ranged left, like the chips. */}
              <span className="w-[78px]">Status</span>
            </div>
            {items.map(({ label, state }) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-3 border-b px-3.5 py-[12px] pr-16! last:border-b-0 ${ROW_HOVER} ${LINE}`}
              >
                <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                  {label}
                </span>
                <span className={STATUS_COL}>
                  <span
                    className={
                      state === "Received"
                        ? POSITIVE
                        : state === "Awaiting"
                          ? WARNING
                          : `${CHIP} ${BRAND_FILL}`
                    }
                  >
                    {state}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
