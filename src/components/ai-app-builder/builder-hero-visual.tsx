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
  IconMark,
  NavItem,
  SectionLabel,
} from "@/components/home/build-app-visual";
import { IconArrowUp } from "@/components/home/build-step-visual";
import {
  IconApp,
  IconBook,
  IconBrandMark,
  IconCard,
  IconChevronDown,
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
const BRAND_SIDEBAR = "bg-neutral-900 text-white";

const LINE = "border-border [[data-theme=dark]_&]:border-[#383838]";
// A light lift only: the windows sit on a grey card, so a soft edge is enough
// to separate them without a heavy drop shadow underneath.
const WINDOW = `overflow-hidden rounded-xl border bg-background shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
// The result views' shared furniture, after the dashboards they stand in for:
// a page header, then white panels on the screen's grey ground, tables with a
// tinted label row.
const PANEL = `mt-4 overflow-hidden rounded-lg border bg-background ${LINE}`;
const TABLE_HEAD = `flex items-center gap-3 border-b bg-muted/60 px-3.5 py-2 text-[11.5px] leading-none text-muted-foreground ${LINE} [[data-theme=dark]_&]:bg-white/[0.04]`;

const CHIP = "rounded px-1.5 py-[4px] text-[11px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const WARNING = `${CHIP} bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]`;
const NEUTRAL = `${CHIP} bg-muted text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]`;
// The column keeps a fixed width so the header lines up; the pill inside hugs
// its label.
const STATUS_COL = "flex w-[78px] shrink-0 justify-center";
// A hovered table row takes the same tint as the table head, so it reads as
// part of the table rather than as a new colour. Both views use it: the
// sidebar rows already answered the pointer and the rows beside them did not.
const ROW_HOVER =
  "transition-colors hover:bg-muted/60 [[data-theme=dark]_&]:hover:bg-white/[0.04]";

// How long the planner spends thinking once the prompt is sent.
const THINKING_MS = 2800;

type Phase = "thinking" | "planned";

/**
 * Opens on the finished plan and replays the build only on the reader's click,
 * rather than looping on its own. A reduced-motion visitor stays on the plan.
 */
function useBuildDemo() {
  const [phase, setPhase] = useState<Phase>("planned");

  useEffect(() => {
    if (phase !== "thinking") return;
    const id = setTimeout(() => setPhase("planned"), THINKING_MS);
    return () => clearTimeout(id);
  }, [phase]);

  const play = () => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setPhase(reduce ? "planned" : "thinking");
  };

  return { phase, play };
}

// Fade in only: the outgoing state drops out at once, so two states never
// overlap mid-transition.
const fade = (visible: boolean) =>
  visible
    ? "opacity-100 transition-opacity duration-500 ease-out"
    : "pointer-events-none opacity-0";

/** The product's loading line while the planner works: its animated mark, then "Thinking...". */
function ThinkingLine() {
  return (
    <p className="flex items-center gap-2 text-[14px] leading-[1.5] text-muted-foreground">
      <IconMark animated className="size-[13px] text-foreground" />
      Thinking...
    </p>
  );
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
  `bg-neutral-100 ring-1 [[data-theme=dark]_&]:bg-white/[0.06] ${
    active
      ? "ring-black/[0.06] hover:ring-black/[0.12] [[data-theme=dark]_&]:ring-white/10 [[data-theme=dark]_&]:hover:ring-white/20"
      : "ring-transparent hover:ring-black/[0.08] [[data-theme=dark]_&]:hover:ring-white/15"
  }`;
const CARD_PAD = "p-6 md:p-8";
const HEAD_ROW = "flex min-h-[40px] items-center";

export function BuilderHeroVisual() {
  const { phase, play } = useBuildDemo();
  const planned = phase === "planned";
  // Manual only: the reader chooses which side to look at.
  const [view, setView] = useState(0);
  const [active, setActive] = useState<"chat" | "live">("live");
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
        the other narrows, at a fixed height so the swap never moves the page. */}
      <div
        className={`grid gap-3 transition-[grid-template-columns] duration-[560ms] ease-[cubic-bezier(0.4,0,0.2,1)] lg:h-[600px] ${
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
              // still widening while the plan blanked out under it. The first
              // click only opens the card; once it is open, clicking replays.
              if (active !== "chat") {
                setActive("chat");
                return;
              }
              play();
            }}
            disabled={phase === "thinking"}
            aria-label="Replay the builder writing the plan"
            className="absolute inset-0 z-10 cursor-pointer rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
          />
          {/* Same row height as the toggle's row beside it, so both mocks start
            on one line. Below lg the switch above already names the card. */}
          <div className={`${HEAD_ROW} hidden lg:flex`}>
            <p className="type-h4 text-foreground">Describe it</p>
          </div>
          {/* Above the card's replay button so Approve and Send can show a
            hover; everything else lets the pointer through to the button. */}
          <div
            aria-hidden
            className="pointer-events-none relative z-20 min-h-0 select-none lg:mt-6 lg:flex-1"
          >
            <MockFit className="relative aspect-[24/25] max-h-[460px] w-full [--template-mock-h:500px] [--template-mock-w:480px] lg:aspect-auto lg:h-full lg:max-h-none">
              <div
                style={{ width: CHAT_W, height: CHAT_H }}
                className={`flex flex-col ${WINDOW}`}
              >
                {/* The thread runs from the top. While the planner works a
                  thinking line holds the place; then the plan arrives as a
                  document. */}
                <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-5 pt-5">
                  <p className="shrink-0 rounded-lg bg-muted px-4 py-3 text-[14px] leading-[1.5] text-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
                    {PROMPT}
                  </p>
                  <div className="relative min-h-0 flex-1">
                    <div
                      className={`absolute inset-x-0 top-0 ${fade(phase === "thinking")}`}
                    >
                      <ThinkingLine />
                    </div>
                    <div
                      className={`absolute inset-x-0 top-0 ${fade(planned)}`}
                    >
                      <p className="mb-3 text-[14px] leading-[1.5] text-foreground">
                        Here is the plan. Approve it and I will start building.
                      </p>
                      <PlanDoc />
                    </div>
                  </div>
                </div>
                <Composer phase={phase} />
              </div>
            </MockFit>
          </div>
        </div>

        <div
          className={`${CARD} relative min-w-0 cursor-pointer ${cardTone(active === "live")} ${cardSlot(1)}`}
          onClick={() => setActive("live")}
        >
          <div
            className={`${HEAD_ROW} flex-wrap justify-between gap-3 ${CARD_PAD} pb-0 md:pb-0`}
          >
            <p className="type-h4 hidden text-foreground lg:block">
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
            <div className={`h-[760px] w-full overflow-hidden rounded-tl-xl border-l border-t bg-neutral-50 shadow-[0_8px_24px_-18px_rgba(16,24,40,0.14)] [[data-theme=dark]_&]:bg-background ${LINE}`}>
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
        <ViewToggle options={CARDS} view={shown} onSelect={setShown} />
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

// Short enough to show whole: a hero should read at a glance, not crop mid-line.
const PLAN_FLOWS = [
  "Your team sends a checklist with a due date.",
  "Each client uploads to their own list.",
  "Your team marks each upload received.",
];

/**
 * The plan as the product shows it: a document in the thread, collapsed to its
 * summary with a row to open the rest, so it ends on purpose rather than cut off.
 */
function PlanDoc() {
  return (
    <div
      className={`overflow-hidden rounded-lg border bg-background text-[14px] leading-[1.5] text-foreground ${LINE}`}
    >
      <div className="px-4 py-3.5">
        <p>A checklist each client uploads to, with status your team tracks.</p>
        <p className="mt-3">Core flows</p>
        <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-4 marker:text-foreground">
          {PLAN_FLOWS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div
        className={`pointer-events-auto flex cursor-default items-center justify-center gap-1.5 border-t py-2 text-[13px] leading-none text-muted-foreground transition-colors hover:text-foreground ${LINE}`}
      >
        View full plan
        <IconChevronDown className="size-[10px]" />
      </div>
    </div>
  );
}

/**
 * The builder's message box. Once a plan is waiting, it sits inside a grey tray
 * whose top row is the Requirements bar with Approve, as the product draws it.
 */
function Composer({ phase }: { phase: Phase }) {
  const planned = phase === "planned";
  const box = (
    <div
      className={`rounded-lg border bg-background px-3.5 pb-2.5 pt-3 ${LINE}`}
    >
      {/* Takes typing so the box feels real, but nothing sends: Enter and the
          arrow are inert. Out of the tab order, as the mock around it is
          hidden from assistive tech. */}
      <textarea
        rows={2}
        tabIndex={-1}
        placeholder={planned ? "Type to revise plan" : "Write a message"}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
        className="pointer-events-auto block w-full resize-none bg-transparent text-[14px] leading-[1.4] text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      <div className="flex items-center justify-end">
        <span className="pointer-events-auto flex size-[26px] cursor-default items-center justify-center rounded-[4px] bg-foreground text-background transition-opacity hover:opacity-85">
          <IconArrowUp className="size-[13px]" />
        </span>
      </div>
    </div>
  );
  return (
    <div className="px-5 pb-5 pt-3">
      {planned ? (
        <div className="rounded-lg bg-muted [[data-theme=dark]_&]:bg-white/[0.06]">
          {/* The Approve pill sets this row's height, so slimming the bar is
              mostly slimming the pill. Label drops to the pill's size too —
              at 14px against a 13px button the row read top-heavy. */}
          <div className="flex items-center justify-between py-1.5 pl-3 pr-2">
            <span className="flex items-center gap-2 text-[13px] leading-none text-foreground">
              <IconCheckCircleOutline className="size-[13px]" />
              Requirements
            </span>
            {/* Hover only: it is a picture of the button, so it does nothing. */}
            <span
              className={`pointer-events-auto flex cursor-default items-center rounded-[4px] border bg-background px-3 py-[5px] text-[13px] leading-none text-foreground transition-colors hover:bg-muted ${LINE} [[data-theme=dark]_&]:hover:bg-white/[0.08]`}
            >
              Approve
            </span>
          </div>
          {box}
        </div>
      ) : (
        box
      )}
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
        className={`flex w-[164px] shrink-0 flex-col border-r bg-muted px-1.5 py-2 [--mock-nav-size:13px] [--mock-nav-row:28px] [--mock-section-size:11px] ${LINE} [[data-theme=dark]_&]:bg-white/[0.04] [&>div:not(:first-child)]:h-[28px] [&>div:not(:first-child)]:transition-colors [&>div:not(:first-child):hover]:bg-border/50`}
      >
        <div className="flex items-center gap-1.5 px-1.5 pb-2 pt-0.5">
          <span className="flex size-[16px] items-center justify-center rounded-[3px] bg-foreground text-background">
            <IconBrandMark className="size-[9px]" />
          </span>
          <span className="text-[13px] leading-none text-foreground">
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
                <p className="text-[11.5px] leading-none text-muted-foreground">
                  {label}
                </p>
                <p className="mt-2 text-[18px] leading-none text-foreground">
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
                  <span className="truncate text-[13px] leading-none text-foreground">
                    {row.name}
                  </span>
                  <span className="truncate text-[11px] leading-none text-muted-foreground">
                    {row.firm}
                  </span>
                </span>
                <span className="hidden w-[92px] items-center gap-2 @[420px]:flex">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
                    <span
                      className="block h-full rounded-full bg-foreground"
                      style={{ width: `${(row.done / 12) * 100}%` }}
                    />
                  </span>
                  <span className="text-[11px] leading-none text-muted-foreground">
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
            <p className="text-[11.5px] leading-none text-muted-foreground">
              Documents received
            </p>
            <p className="mt-2 text-[18px] leading-none text-foreground">
              8 of 12
            </p>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
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
                <span className="truncate text-[13px] leading-none text-foreground">
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
