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
  IconApp,
  IconBook,
  IconBrandMark,
  IconCard,
  IconChat,
  IconFile,
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

const PROMPT = "Build a year-end document checklist my clients can upload to.";

// Brandmages' brand colour is black, so the client side runs on ink: fills take
// the foreground, and the sidebar is the brand itself, near-black with white
// type in both themes, the way a firm's portal carries its colour.
const BRAND_FILL = "bg-foreground text-background";
const BRAND_SIDEBAR = "bg-[var(--mock-brand)] text-white";

const LINE = "border-[var(--mock-line)]";
// A light lift only: the windows sit on a grey card, so a soft edge is enough
// to separate them without a heavy drop shadow underneath.
const WINDOW = `overflow-hidden rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
// The result views' shared furniture, after the dashboards they stand in for:
// a page header, then white panels on the screen's grey ground, tables with a
// tinted label row.
const PANEL = `mt-4 overflow-hidden rounded-lg border bg-[var(--mock-window)] ${LINE}`;
const TABLE_HEAD = `flex items-center gap-3 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`;

const CHIP = "rounded px-1.5 py-[4px] text-[11px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const WARNING = `${CHIP} bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]`;
const NEUTRAL = `${CHIP} bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]`;
// The column keeps a fixed width so the header lines up; the pill inside hugs
// its label.
const STATUS_COL = "flex w-[78px] shrink-0 justify-center";
// A hovered table row takes the same tint as the table head, so it reads as
// part of the table rather than as a new colour. Both views use it: the
// sidebar rows already answered the pointer and the rows beside them did not.
const ROW_HOVER = "transition-colors hover:bg-[var(--mock-well)]";

// How long the plan takes to come back once the prompt is sent.
const THINKING_MS = 2800;
// The card's widening transition, matched below on the grid. A replay started
// by the opening click waits this out so the two moves read in order.
const EXPAND_MS = 560;

// idle    — the card at rest: the prompt sitting in the box, nothing sent.
// sent     — the prompt has left the box and is a message in the thread.
// planned  — the requirements have come back under it.
type Phase = "idle" | "sent" | "planned";

/**
 * Opens at rest — just the prompt in the box — and runs the build only on the
 * reader's click, rather than looping on its own. A reduced-motion visitor
 * lands straight on the planned state.
 *
 * `play` takes a delay so the click that opens the card can also start the
 * run: the card widens first, then the build runs, instead of both at once.
 */
function useBuildDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const queued = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase !== "sent") return;
    const id = setTimeout(() => setPhase("planned"), THINKING_MS);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(
    () => () => {
      if (queued.current) clearTimeout(queued.current);
    },
    [],
  );

  /**
   * Drops the demo back to rest and cancels anything queued.
   *
   * Collapsing the card used to leave it running: the replay had been started
   * on the card, not on the view, so the thread carried on writing its plan
   * inside a panel the reader had just narrowed and stopped looking at — and
   * reopening it landed mid-animation rather than at the beginning.
   */
  const stop = () => {
    if (queued.current) clearTimeout(queued.current);
    queued.current = null;
    setPhase("idle");
  };

  const play = (delay = 0) => {
    if (queued.current) clearTimeout(queued.current);
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setPhase("planned");
      return;
    }
    if (delay <= 0) {
      setPhase("sent");
      return;
    }
    queued.current = setTimeout(() => setPhase("sent"), delay);
  };

  return { phase, play, stop };
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
  const { phase, play, stop } = useBuildDemo();
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
            disabled={phase === "sent"}
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
            <div className="flex h-full flex-col justify-center gap-3">
              <Thread phase={phase} />
              <Composer phase={phase} />
            </div>
          </div>
        </div>

        <div
          className={`${CARD} relative min-w-0 cursor-pointer ${cardTone(active === "live")} ${cardSlot(1)}`}
          onClick={() => setActive("live")}
        >
          <div
            className={`${HEAD_ROW} flex-wrap justify-between gap-3 ${CARD_PAD} pb-0 md:pb-0`}
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
              className={`relative h-[760px] w-full overflow-hidden rounded-tl-xl border-l border-t bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE}`}
            >
              {/* The card clips this screen on two sides, which left the last
                  row cut through the middle of its type and the status column
                  sliced down its length — hard edges that read as a rendering
                  fault rather than as a crop. A short fade to the card's own
                  ground ends each instead. Over the screen, under nothing:
                  they are the last things drawn.

                  Two layers rather than one corner gradient: a single diagonal
                  would have dimmed the middle of the table, which is the part
                  worth reading. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-b from-transparent to-[var(--surface)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-r from-transparent to-[var(--surface)]"
              />
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
              ? "border-border bg-background text-foreground shadow-[0_1px_2px_rgba(16,24,40,0.06)] [[data-theme=dark]_&]:border-white/15 [[data-theme=dark]_&]:bg-white/[0.06]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/** What the builder comes back with, read off the prompt above it. */
const REQUIREMENTS = [
  "A checklist of the documents you ask for",
  "Clients upload, replace, and see what is outstanding",
  "Your team sees every client's progress",
];

/**
 * The thread above the box: the prompt once it has been sent, and the
 * requirements that come back under it.
 *
 * Both open on their own height rather than fading in — at rest neither is
 * there at all, and an element with no height has nothing to fade. The rows
 * carry each from nothing to its full height, so the card grows a message and
 * then a plan instead of blinking them on.
 */
function Thread({ phase }: { phase: Phase }) {
  const sent = phase !== "idle";
  const planned = phase === "planned";
  return (
    <div aria-hidden className="flex flex-col gap-2.5">
      {/* The prompt, now a message. It is NOT a copy of what the box holds —
          the box empties when this appears, so the sentence is in one place at
          a time. */}
      <div
        className={`grid transition-[grid-template-rows] duration-[400ms] ease-out motion-reduce:transition-none ${
          sent ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="ml-auto w-fit max-w-[88%] rounded-xl rounded-br-[5px] bg-[var(--mock-well-2)] px-3 py-2 text-[13.5px] leading-[1.45] text-[color:var(--mock-ink)]">
            {PROMPT}
          </p>
        </div>
      </div>

      {/* The plan. The Approve pill used to sit on the composer as a bar; it
          belongs on the thing being approved. */}
      <div
        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
          planned ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`overflow-hidden rounded-lg border bg-[var(--mock-window)] ${LINE}`}
          >
            <div
              className={`flex items-center justify-between border-b py-1.5 pl-3 pr-2 ${LINE}`}
            >
              <span className="flex items-center gap-2 text-[13px] leading-none text-[color:var(--mock-ink)]">
                <IconCheckCircleOutline className="size-[13px]" />
                Requirements
              </span>
              {/* Hover only: it is a picture of the button, so it does nothing. */}
              <span
                className={`pointer-events-auto flex cursor-default items-center rounded-[4px] border bg-[var(--mock-well-2)] px-3 py-[5px] text-[13px] leading-none text-[color:var(--mock-ink)] transition-colors hover:bg-[var(--mock-window)] ${LINE}`}
              >
                Approve
              </span>
            </div>
            <ul className="flex flex-col">
              {REQUIREMENTS.map((line, i) => (
                <li
                  key={line}
                  // One at a time, behind the panel opening, so the list reads
                  // as being written rather than as having been there.
                  className={`flex items-start gap-2 border-b px-3 py-2 text-[13px] leading-[1.4] text-[color:var(--mock-ink)] transition-opacity duration-300 last:border-b-0 motion-reduce:transition-none ${LINE} ${
                    planned ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: `${260 + i * 110}ms` }}
                >
                  <IconCheckCircleOutline className="mt-[2px] size-[13px] shrink-0 text-[color:var(--mock-ink-soft)]" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
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
function Composer({ phase }: { phase: Phase }) {
  const sent = phase !== "idle";
  const box = (
    <div className="px-3.5 pb-2.5 pt-3">
      {/* Takes typing so the box feels real, but nothing sends: Enter and the
          arrow are inert. Out of the tab order, as the mock around it is
          hidden from assistive tech. */}
      {/* Keyed on whether the prompt has been sent, so React remounts the
          field and it genuinely empties rather than keeping the old text. The
          sentence belongs to the thread once it has been sent; leaving it here
          too was the thing that made the old bubble read as a duplicate. */}
      <textarea
        key={sent ? "sent" : "idle"}
        rows={sent ? 2 : 3}
        tabIndex={-1}
        defaultValue={sent ? "" : PROMPT}
        placeholder="Describe what you want to build"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="pointer-events-auto block w-full resize-none bg-transparent text-[14px] leading-[1.4] text-[color:var(--mock-ink)] outline-none placeholder:text-[color:var(--mock-ink-soft)]/60"
      />
      {/* The product's own composer footer: attach on the left, the model and
          send on the right. Without them the box was a bare field with one
          button floating in it, which is not what anyone types into. */}
      <div className="flex items-center justify-between">
        <span className="pointer-events-auto flex size-[26px] cursor-default items-center justify-center rounded-[4px] text-[color:var(--mock-ink-soft)] transition-colors hover:bg-[var(--mock-well)] hover:text-[color:var(--mock-ink)]">
          <IconPlus className="size-[13px]" />
        </span>
        <span className="flex items-center gap-2">
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
    // Capped and centred. The card widens when it is picked, and an uncapped
    // box widened with it — one short prompt stretched across 700px, with the
    // send button a screen away from the words. 560px is the measure the
    // site's other composer already runs at.
    <div className="mx-auto w-full max-w-[560px] pt-3">
      {/* Double outline, in LIGHT only: a soft second rule held off the box,
          the way a focused input reads in the product. One border on a grey
          card was a single thin line doing all the work of saying "this is the
          thing you type into"; the outer ring gives it an edge you can see
          from across the hero.

          Dark does not need it and is worse for it. There the box already
          lifts a full step off the card (--mock-window on --surface) and
          carries a #3a3a3a hairline, so it reads from across the hero on its
          own — and a second pale rule standing 3px off it read as a halo
          around the composer rather than as the composer's own edge, the same
          way the picked screen's old outline did. The padding stays, so the
          box keeps its position either way. */}
      <div className="rounded-[13px] p-[3px] ring-1 ring-foreground/[0.06] [[data-theme=dark]_&]:ring-transparent">
        <div
          className={`overflow-hidden rounded-lg border bg-[var(--mock-window)] ${LINE}`}
        >
          {box}
        </div>
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

/** The team's view, in Assembly's own neutral chrome. */
function TeamDashboard({ live }: { live: boolean }) {
  const rows = [
    {
      name: "Dana Whitfield",
      firm: "Whitfield Coffee Co.",
      done: 8,
      status: "In progress",
    },
    {
      name: "Marcus Lee",
      firm: "Lee & Daughters",
      done: 12,
      status: "Complete",
    },
    { name: "Priya Raman", firm: "Raman Florals", done: 3, status: "Awaiting" },
    {
      name: "Owen Brooks",
      firm: "Brooks Bicycle Works",
      done: 10,
      status: "In progress",
    },
    {
      name: "Lena Ortiz",
      firm: "Ortiz Architecture",
      done: 12,
      status: "Complete",
    },
    {
      name: "Sam Patel",
      firm: "Patel Family Bakery",
      done: 6,
      status: "In progress",
    },
  ];
  return (
    <div className="flex h-full">
      <div
        className={`flex w-[164px] shrink-0 flex-col border-r bg-[var(--mock-well)] px-1.5 py-2 [--mock-nav-size:13px] [--mock-nav-row:28px] [--mock-section-size:11px] ${LINE} [&>div:not(:first-child)]:h-[28px] [&>div:not(:first-child)]:transition-colors [&>div:not(:first-child):hover]:bg-border/50`}
      >
        <div className="flex items-center gap-1.5 px-1.5 pb-2 pt-0.5">
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
        <NavItem icon={<IconApp />} label="Year-end documents" active={live} />
        <NavItem icon={<IconPlus />} label="Add App" muted />
      </div>
      <div className="@container min-w-0 flex-1 pl-5 pt-5">
        <div>
          <div className={`${PANEL} mt-0! grid grid-cols-3`}>
            {[
              ["Clients", "6"],
              ["Complete", "2"],
              ["Awaiting", "1"],
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
              <span className="w-[72px] text-center">Status</span>
            </div>
            {rows.map((row) => (
              <div
                key={row.name}
                className={`flex items-center gap-3 border-b px-3.5 py-[11px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
              >
                <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                  <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                    {row.name}
                  </span>
                  <span className="truncate text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                    {row.firm}
                  </span>
                </span>
                <span className="hidden w-[92px] items-center gap-2 @[420px]:flex">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--mock-well-2)]">
                    <span
                      className="block h-full rounded-full bg-foreground"
                      style={{ width: `${(row.done / 12) * 100}%` }}
                    />
                  </span>
                  <span className="text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                    {row.done}/12
                  </span>
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
                    {row.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** One client's view, inside Brandmages' branded client experience. */
function ClientView() {
  const items = [
    { label: "W-2, all employees", state: "Received" },
    { label: "1099-NEC contractors", state: "Received" },
    { label: "Bank statements, Q4", state: "Upload" },
    { label: "Prior-year return", state: "Received" },
    { label: "Mileage log", state: "Awaiting" },
    { label: "Charitable donation receipts", state: "Awaiting" },
  ];
  // Drawn on the team view's exact grid (sidebar width, row heights, type
  // sizes), so flipping the toggle changes only the brand and the content.
  return (
    <div className="flex h-full">
      <div
        className={`flex w-[164px] shrink-0 flex-col px-1.5 py-2 ${BRAND_SIDEBAR}`}
      >
        <div className="flex items-center gap-1.5 px-1.5 pb-2 pt-0.5">
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
          { icon: <IconFile />, label: "Files" },
          { icon: <IconCard />, label: "Invoices" },
          { icon: <IconApp />, label: "Year-end documents", active: true },
        ].map(({ icon, label, active }) => (
          <div
            key={label}
            className={`flex h-[28px] items-center gap-2 rounded px-1.5 transition-colors ${
              active
                ? "bg-white/[0.12] text-white"
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
      <div className="min-w-0 flex-1 pl-5 pt-5">
        <div>
          <div className={`${PANEL} mt-0! px-3.5 py-3`}>
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
            <div className={TABLE_HEAD}>
              <span className="flex-1">Document</span>
              <span className="w-[72px] text-center">Status</span>
            </div>
            {items.map(({ label, state }) => (
              <div
                key={label}
                className={`flex items-center justify-between gap-3 border-b px-3.5 py-[12px] last:border-b-0 ${ROW_HOVER} ${LINE}`}
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
  );
}
