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

import { useState } from "react";
import { MockFit } from "@/components/templates/mock-fit";
import { IconArrowUp } from "@/components/home/build-step-visual";
import {
  IconApp,
  IconCheck,
  IconChecks,
  IconDocuments,
  IconForm,
  IconBrandMark,
  IconCard,
  IconChat,
  IconFile,
  IconGlobe,
} from "@/components/home/mock-icons";

// 3:4, the rail's card shape.
const W = 340;
const H = 453;

const LINE = "border-border [[data-theme=dark]_&]:border-[#383838]";
const WINDOW = `overflow-hidden rounded-xl border bg-background shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-18px_rgba(16,24,40,0.14)] ${LINE} [[data-theme=dark]_&]:shadow-[0_8px_24px_-18px_rgba(0,0,0,0.5)]`;
const BRAND_SIDEBAR = "bg-neutral-900 text-white";
const TABLE_HEAD = `flex items-center gap-3 border-b bg-muted/60 px-3.5 py-2 text-[11.5px] leading-none text-muted-foreground ${LINE} [[data-theme=dark]_&]:bg-white/[0.04]`;
const CHIP = "rounded px-1.5 py-[4px] text-[11px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const NEUTRAL = `${CHIP} bg-muted text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]`;

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
                // The crop dissolves instead of stopping dead — the same move
                // the hero makes at the foot of its shot. A mask rather than a
                // gradient overlay, so it fades to whatever the card's ground
                // is and needs no second value for dark.
                WebkitMaskImage:
                  "linear-gradient(to right, #000 0 68%, transparent 97%)",
                maskImage:
                  "linear-gradient(to right, #000 0 68%, transparent 97%)",
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

// ── 1. Describe ──────────────────────────────────────────────────────────
// The step's own fork: start from nothing, or start from something. The
// segmented control is the site's existing one (pricing's billing toggle),
// thumb and clipped label strip included, so this is not a second kind of
// switch. Two tabs rather than four: at the rail's card width a row of
// template names cannot be read, so the names live in the body instead.
const TEMPLATES = [
  { name: "Content approval flow", icon: <IconChecks /> },
  { name: "Client onboarding wizard", icon: <IconForm /> },
  { name: "Document collector", icon: <IconDocuments /> },
];

const TABS = ["Your own app", "Template"] as const;

export function DescribeCard() {
  const [tab, setTab] = useState(0);
  return (
    <Scene>
      <div className={`flex flex-col ${WINDOW} p-4`}>
        {/* The body the switch controls: the thing you would type, or the
            working apps you could start from instead. */}
        {tab === 0 ? (
          <p className="text-[14px] leading-[1.5] text-foreground">
            Add a project tracker each client sees for their own project.
            {/* The site's own caret blink (--animate-caret, the one the hero
                typewriter uses), run only while the card is hovered: at rest
                it is a resting insertion point, on hover someone is typing.
                No MOVE here — a transition-all fights the keyframes. */}
            <span className="ml-[1px] inline-block h-[14px] w-[1.5px] translate-y-[2px] bg-foreground motion-safe:group-hover/card:animate-caret" />
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {TEMPLATES.map(({ name, icon }, i) => (
              <span
                key={name}
                className={`${MOVE} flex items-center gap-2.5 rounded-md border px-2.5 py-2.5 text-[13px] leading-none text-foreground group-hover/card:translate-x-[2px] ${LINE}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className="flex shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-[15px]">
                  {icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{name}</span>
              </span>
            ))}
          </div>
        )}

        {/* The switch lives on the composer's control row, where the product
            puts its composer controls, rather than floating above the box as
            a second piece of chrome. */}
        <div className="mt-6 flex items-center justify-between gap-2">
          <div
            role="radiogroup"
            aria-label="Where the app starts"
            className="relative grid grid-cols-2 rounded-[7px] bg-muted p-[2px] text-[11px] [[data-theme=dark]_&]:bg-white/[0.08]"
          >
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-y-[2px] left-[2px] z-10 w-[calc(50%-2px)] overflow-hidden rounded-[5px] bg-background shadow-[0_1px_2px_rgba(16,24,40,0.1)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                tab === 1 ? "translate-x-full" : ""
              }`}
            >
              <span
                className={`absolute inset-0 grid w-[200%] grid-cols-2 text-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  tab === 1 ? "-translate-x-1/2" : ""
                }`}
              >
                {TABS.map((label) => (
                  <span
                    key={label}
                    className="flex items-center justify-center whitespace-nowrap"
                  >
                    {label}
                  </span>
                ))}
              </span>
            </span>
            {TABS.map((label, i) => (
              <button
                key={label}
                role="radio"
                aria-checked={tab === i}
                onClick={() => setTab(i)}
                className="relative whitespace-nowrap rounded-[5px] px-2 py-[5px] text-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </button>
            ))}
          </div>

          <span
            className={`${MOVE} flex size-[24px] shrink-0 items-center justify-center rounded-[5px] bg-foreground text-background group-hover/card:scale-110`}
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
        className="stroke-border [[data-theme=dark]_&]:stroke-[#383838]"
      />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${c * value} ${c}`}
        className="stroke-foreground"
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
          <span className="flex-1 truncate text-[14px] leading-none text-foreground">
            Plan
          </span>
          <span className="shrink-0 text-[12px] leading-none text-muted-foreground">
            {DONE} of {PLAN_ITEMS.length}
          </span>
        </div>

        {PLAN_ITEMS.map(({ label, done }, i) => {
          // The first unsettled row: the one the builder is asking about now.
          const next = !done && (PLAN_ITEMS[i - 1]?.done ?? true);
          return (
            <div
              key={label}
              className={`flex items-center gap-2.5 border-b px-4 py-[11px] last:border-b-0 ${LINE} ${
                next ? "bg-muted/60 [[data-theme=dark]_&]:bg-white/[0.04]" : ""
              }`}
            >
              {/* Three states, as the reference draws them: filled with a check
                for settled, a crisp open circle for the one in play, and a
                dashed faint circle for the ones still queued. One washed-out
                ring doing both of the last two jobs read as a blob rather
                than as a state. All three share the 16px outer diameter, so
                the column lines up and no mark looks heavier than another. */}
              <span className="flex size-[18px] shrink-0 items-center justify-center">
                {done ? (
                  <span className="flex size-[16px] items-center justify-center rounded-full bg-foreground text-background">
                    <IconCheck className="size-[10px]" />
                  </span>
                ) : next ? (
                  <span
                    className={`${MOVE} size-[16px] rounded-full border-2 border-muted-foreground/70 group-hover/card:border-foreground`}
                  />
                ) : (
                  <span
                    className={`size-[16px] rounded-full border border-dashed ${LINE}`}
                  />
                )}
              </span>
              <span
                className={`min-w-0 flex-1 truncate text-[13.5px] leading-none ${
                  done ? "text-muted-foreground" : "text-foreground"
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

        <div className="flex min-w-0 flex-1 flex-col px-4 pt-3.5">
          <div className="flex items-center justify-between gap-3">
            <span className="whitespace-nowrap text-[14px] leading-none text-foreground">
              Project tracker
            </span>
            <span className={`${NEUTRAL} whitespace-nowrap`}>
              Meridian Corp
            </span>
          </div>

          <div
            className={`mt-3 flex items-center gap-3 rounded-lg border px-3.5 py-2.5 ${LINE}`}
          >
            <span className="whitespace-nowrap text-[11.5px] leading-none text-muted-foreground">
              2 of 4 complete
            </span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
              <span
                className={`${MOVE} block h-full w-[18%] rounded-full bg-foreground group-hover/card:w-1/2`}
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
                <span className="w-[164px] shrink-0 whitespace-nowrap text-[13px] leading-none text-foreground">
                  {name}
                </span>
                <span className="w-[84px] shrink-0 whitespace-nowrap text-[11px] leading-none text-muted-foreground">
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

// ── 4. Iterate ───────────────────────────────────────────────────────────
// Hover applies the change: the revision is sent and the column it asked for
// appears in the table.
export function IterateCard() {
  return (
    <Scene>
      <div className={`flex flex-col ${WINDOW}`}>
        <p className="shrink-0 bg-muted px-4 py-3 text-[14px] leading-[1.5] text-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
          Add a due date to every project.
        </p>
        <div className="px-4 py-4">
          <div className={`overflow-hidden rounded-lg border ${LINE}`}>
            <div
              className={`flex items-center gap-2 border-b bg-muted/60 px-3 py-2 text-[11.5px] leading-none text-muted-foreground ${LINE} [[data-theme=dark]_&]:bg-white/[0.04]`}
            >
              <span className="flex-1">Client</span>
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
                <span className="flex-1 truncate text-[13px] leading-none text-foreground">
                  {client}
                </span>
                <span
                  className={`${MOVE} w-0 overflow-hidden whitespace-nowrap text-right text-[11px] leading-none text-muted-foreground opacity-0 group-hover/card:w-[58px] group-hover/card:opacity-100`}
                  style={{ transitionDelay: `${i * 70}ms` }}
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
            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <IconCheck className="size-[10px]" />
            </span>
            <span className="flex-1 truncate text-[13px] leading-none text-foreground">
              {who}
            </span>
            <span className={NEUTRAL}>{access}</span>
          </div>
        ))}
        <div className="px-3.5 py-3">
          <p className="text-[11.5px] leading-[1.5] text-muted-foreground">
            Built and maintained by Assembly.
          </p>
        </div>
      </div>
    </Scene>
  );
}
