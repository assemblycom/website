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
} from "@/components/home/mock-icons";

// 3:4, the rail's card shape.
const W = 340;
const H = 453;

const LINE = "border-[var(--mock-line)]";
const WINDOW = `overflow-hidden rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
const BRAND_SIDEBAR = "bg-[var(--mock-brand)] text-white";
const TABLE_HEAD = `flex items-center gap-3 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`;
const CHIP = "rounded px-1.5 py-[4px] text-[11px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const NEUTRAL = `${CHIP} bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]`;

// Every hover move hangs off this, so "no motion" is one rule rather than
// four separate ones that can drift.
const MOVE =
  "motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out motion-reduce:transition-none";

/** The frame each card's scene is drawn in, scaled to whatever the rail gives it. */
function Scene({
  children,
  bleed = false,
}: {
  children: React.ReactNode;
  /**
   * Draws the mock at its own size running off the card's right and bottom
   * edges, rather than fitting it inside. A screen squeezed into 300px
   * truncates every label it has; cropped, it keeps full-size type and reads
   * as a window onto something larger — which is what it is.
   */
  bleed?: boolean;
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
                WebkitMaskImage: fadeMask("to right", 52),
                maskImage: fadeMask("to right", 52),
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
    <Scene>
      <div className={`flex flex-col ${WINDOW} p-4`}>
        <p className="text-[14px] leading-[1.5] text-[color:var(--mock-ink)]">
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
            className={`${MOVE} flex size-[24px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--mock-ink)] text-[color:var(--mock-window)] group-hover/card:scale-110`}
          >
            <IconArrowUp className="size-[12px]" />
          </span>
        </div>
      </div>
    </Scene>
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
const PLAN_ITEMS = [
  { label: "Each client sees their own", done: true },
  { label: "Your team sees all projects", done: true },
  { label: "Name, milestones, status", done: true },
  { label: "Due dates", done: false },
  { label: "Email reminders", done: false },
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
        className="stroke-[var(--mock-line)]"
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
    <Scene>
      <div className={`flex flex-col ${WINDOW}`}>
        <div className={`flex items-center gap-2.5 border-b px-4 py-3 ${LINE}`}>
          <Ring value={DONE / PLAN_ITEMS.length} />
          <span className="flex-1 truncate text-[14px] leading-none text-[color:var(--mock-ink)]">
            Plan
          </span>
          <span className="shrink-0 text-[12px] leading-none text-[color:var(--mock-ink-soft)]">
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
              className={`flex items-center gap-2.5 border-b px-4 py-[11px] transition-colors last:border-b-0 hover:bg-[var(--mock-well-2)] ${LINE}`}
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
                    className={`size-[16px] rounded-full border border-dashed ${LINE}`}
                  />
                )}
              </span>
              <span
                className={`min-w-0 flex-1 truncate text-[13.5px] leading-none ${
                  done ? "text-[color:var(--mock-ink-soft)]" : "text-[color:var(--mock-ink)]"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
}

// ── 3. Build ─────────────────────────────────────────────────────────────
// Hover lands the app: the new row drops into the nav and the rest makes room.
// What the client sees: their own project, not a roster. "Each client sees
// only their own project" is the plan the step before approved, so a list of
// four firms here would contradict it.
const MILESTONES = [
  { name: "Kickoff and scope", owner: "Dana W.", state: "Complete" },
  { name: "Discovery workshop", owner: "Dana W.", state: "Complete" },
  { name: "Draft delivery", owner: "Marcus L.", state: "In review" },
  { name: "Final sign-off", owner: "Marcus L.", state: "To do" },
];

const CLIENT_NAV = [
  { icon: <IconGlobe />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconCard />, label: "Invoices" },
];

export function BuildCard() {
  return (
    <Scene bleed>
      {/* The client's portal, in the firm's colour. No Clients, no Billing, no
          Add App — those are the team's, and a client never sees them.
          
          This is the PUBLISHED state, start to finish. Gating the nav row
          behind hover while the panel already showed the tracker had the card
          claiming the app was hidden and open at the same time, which is not
          a state the product has. The hover is a small settle, not a claim. */}
      <div
        style={{ width: 560, height: 372 }}
        className={`flex shrink-0 ${WINDOW} rounded-b-none rounded-tr-none border-b-0 border-r-0`}
      >
        <div
          className={`flex w-[150px] shrink-0 flex-col px-2 py-2.5 ${BRAND_SIDEBAR}`}
        >
          <span className="flex items-center gap-1.5 px-1.5 pb-3 pt-0.5">
            {/* The firm's own logo: a black mark on a white tile, the same in
                both themes because it is their file, not our chrome. */}
            <span className="flex size-[16px] items-center justify-center rounded-[3px] bg-white text-black">
              <IconBrandMark className="size-[9px]" />
            </span>
            <span className="truncate text-[13px] leading-none text-white">
              Brandmages
            </span>
          </span>
          {CLIENT_NAV.map(({ icon, label }) => (
            <ClientNavRow key={label} icon={icon} label={label} />
          ))}
          <ClientNavRow icon={<IconApp />} label="Project tracker" active />
        </div>

        {/* No app title across the top. The nav row beside it is lit and says
            "Project tracker" an inch to the left, so the screen opened by
            naming itself twice. The client chip that shared that row goes with
            it: this card is cropped at the right, so the chip was off the
            frame anyway, and alone on a row it reads as a stray pill rather
            than as whose project this is. */}
        <div className="flex min-w-0 flex-1 flex-col px-4 pt-4">
          <div
            className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 ${LINE}`}
          >
            <span className="whitespace-nowrap text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
              2 of 4 complete
            </span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--mock-well-2)]">
              <span
                className={`${MOVE} block h-full w-[18%] rounded-full bg-[var(--mock-ink)] group-hover/card:w-1/2`}
              />
            </span>
          </div>

          <div className={`mt-3 overflow-hidden rounded-lg border ${LINE}`}>
            <div className={TABLE_HEAD}>
              <span className="w-[164px] shrink-0">Milestone</span>
              <span className="w-[84px] shrink-0">Owner</span>
              <span className="w-[82px] shrink-0">Status</span>
            </div>
            {MILESTONES.map(({ name, owner, state }) => (
              <div
                key={name}
                className={`flex items-center gap-3 border-b px-3.5 py-[9px] last:border-b-0 ${LINE}`}
              >
                <span className="w-[164px] shrink-0 whitespace-nowrap text-[13px] leading-none text-[color:var(--mock-ink)]">
                  {name}
                </span>
                <span className="w-[84px] shrink-0 whitespace-nowrap text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                  {owner}
                </span>
                <span className="w-[82px] shrink-0">
                  <span className={state === "Complete" ? POSITIVE : NEUTRAL}>
                    {state}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Scene>
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
      className={`flex h-[28px] items-center gap-2 rounded px-1.5 ${
        active ? "bg-white/[0.12] text-white" : "text-white/60"
      }`}
    >
      <span className="flex shrink-0 items-center justify-center [&>svg]:size-[16px]">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] leading-none">
        {label}
      </span>
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
        className="stroke-[var(--mock-line)]"
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
        <p className="shrink-0 bg-[var(--mock-well-2)] px-4 py-3 text-[14px] leading-[1.5] text-[color:var(--mock-ink)]">
          Add a due date to every project.
        </p>
        <div className="px-4 py-4">
          <div className={`overflow-hidden rounded-lg border ${LINE}`}>
            <div
              className={`flex items-center gap-2 border-b bg-[var(--mock-well)] px-3 py-2 text-[11.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
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
                className={`flex items-center gap-2 border-b px-3 py-[11px] last:border-b-0 ${LINE}`}
              >
                <span className="flex-1 truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                  {client}
                </span>
                <span
                  className={`${MOVE} w-0 overflow-hidden whitespace-nowrap text-right text-[11px] leading-none text-[color:var(--mock-ink-soft)] opacity-0 group-hover/card:w-[58px] group-hover/card:opacity-100`}
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
            className={`flex items-center gap-2 border-b px-3.5 py-[13px] ${LINE}`}
          >
            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
              <IconCheck className="size-[10px]" />
            </span>
            <span className="flex-1 truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
              {who}
            </span>
            <span className={NEUTRAL}>{access}</span>
          </div>
        ))}
        <div className="px-3.5 py-3">
          <p className="text-[11.5px] leading-[1.5] text-[color:var(--mock-ink-soft)]">
            Built and maintained by Assembly.
          </p>
        </div>
      </div>
    </Scene>
  );
}
