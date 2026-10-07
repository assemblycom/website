// ─────────────────────────────────────────────────────────────────────────
// SEGMENT MOCKS — one client-portal screen per segment on the "one portal, a
// different experience for every client" grid.
//
// Deliberately four different KINDS of picture, not one picture four times:
// the section's claim is that these portals do not look alike, and four
// identical screenshots in four identical frames argue the opposite. So one
// card runs the full portal chrome, one is a diagram with no chrome at all,
// one is a single panel floating on the card, and one runs wide beside its
// copy.
//
// Built from the shared mock icon set and the --mock-* status tokens rather
// than a new icon family or new colours. Decorative only.
// ─────────────────────────────────────────────────────────────────────────

import Image from "next/image";

import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconChevronRight,
  IconCheck,
  IconDocuments,
  IconFile,
  IconArrowUpRight,
  IconGlobe,
} from "@/components/home/mock-icons";

// Two glyphs the shared set does not carry, drawn to its light-stroke
// convention rather than pulled from a second icon family.
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function IconLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <rect x="4" y="8.75" width="12" height="8" rx="2" {...STROKE} />
      <path d="M6.9 8.75V6.4a3.1 3.1 0 0 1 6.2 0v2.35" {...STROKE} />
    </svg>
  );
}

export function IconUpload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M10 13.2V3.6m0 0L6.6 7M10 3.6 13.4 7" {...STROKE} />
      <path
        d="M3.9 12.9v1.9a1.8 1.8 0 0 0 1.8 1.8h8.6a1.8 1.8 0 0 0 1.8-1.8v-1.9"
        {...STROKE}
      />
    </svg>
  );
}

const CHIP = "rounded px-1.5 py-[3px] text-[9px] leading-none";
const POSITIVE = `${CHIP} bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]`;
const WARNING = `${CHIP} bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]`;
const NEUTRAL = `${CHIP} bg-muted text-[color:var(--mock-ink-soft)] [[data-theme=dark]_&]:bg-white/[0.08]`;

const LINE = "border-[var(--mock-line)]";
/** The white panel the app is drawn on, wherever a card shows one. */
const PANEL = `bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`;

function NavRow({
  icon,
  label,
  active = false,
  branded = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  branded?: boolean;
}) {
  return (
    <span
      // 4px, matching the portal nav row wherever it is drawn — see the same
      // row in branded-portal-visual. rounded-md is 6px, which at this scale
      // read as a lozenge rather than as a row with its corners taken off.
      className={`flex items-center gap-1.5 rounded-[4px] px-1.5 py-[5px] text-[10px] leading-none ${
        branded
          ? // One colour for every row on the slab, picked or not. Two tones of
            // white plus a fill was the state said twice, and at five rows the
            // brighter one read as the only label that mattered rather than as
            // the one you are on. The fill carries it alone, which is what a
            // nav does — you are never on more than one.
            active
            ? "bg-white/[0.12] text-white/90"
            : "text-white/90"
          : active
            ? // Ink, not a pill. A filled row on a --muted sidebar drew a hard
              // edge that read as a border around it rather than as the row
              // being picked — and at half strength it was still the loudest
              // mark in a mock whose subject is elsewhere. Full-strength type
              // against muted siblings is the whole signal: it is the only
              // black row in the column.
              "text-[color:var(--mock-ink)]"
            : "text-[color:var(--mock-ink-soft)]"
      }`}
    >
      <span className="flex size-[11px] shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}

/** The client's own sidebar. Only the one card that needs full chrome uses it. */
/**
 * The client's own nav down the left of a portal screen. Exported because the
 * hero carousel wraps it around the mocks that do not build one in, so every
 * screen in that set reads as the same portal.
 */
export function PortalSidebar({
  app,
  brand = "Brandmages",
  branded = false,
}: {
  /** The firm's own app, added to the stock nav below. Omit for a portal
      that has no such app — the point the problem section makes. */
  app?: string;
  /** Whose portal this is. The generic one in the problem section is nobody's. */
  brand?: string;
  /**
   * Draws the nav in the firm's own colour rather than the neutral grey.
   *
   * It is off by default because most screens in this set are illustrating
   * what an app DOES, where a brand slab is just contrast nobody asked about.
   * The problem section is the exception: there this screen stands beside a
   * generic portal and the whole argument is that one of them is yours, which
   * a grey nav on both sides quietly contradicts.
   */
  branded?: boolean;
}) {
  return (
    <div
      className={`hidden w-[136px] shrink-0 flex-col gap-[2px] border-r px-2 py-2.5 sm:flex ${LINE} ${
        branded
          ? "bg-[var(--mock-brand)]"
          : "bg-muted [[data-theme=dark]_&]:bg-white/[0.04]"
      }`}
    >
      <span className="flex items-center gap-1.5 px-1.5 pb-2.5">
        {/* The firm's mark on a white tile, which is their file rather than
            our chrome, so it is the same on the brand slab and off it. */}
        <span
          className={`flex size-[15px] items-center justify-center rounded-[3px] ${
            branded ? "bg-white text-black" : "bg-foreground text-background"
          }`}
        >
          <IconBrandMark className="size-[8px]" />
        </span>
        <span
          className={`truncate text-[10.5px] leading-none ${
            branded ? "text-white" : "text-[color:var(--mock-ink)]"
          }`}
        >
          {brand}
        </span>
      </span>
      <NavRow
        icon={<IconGlobe className="size-[11px]" />}
        label="Home"
        branded={branded}
      />
      <NavRow
        icon={<IconChat className="size-[11px]" />}
        label="Messages"
        branded={branded}
      />
      <NavRow
        icon={<IconFile className="size-[11px]" />}
        label="Files"
        branded={branded}
      />
      {/* With no app of its own, the stock nav's last row carries the
          selection — otherwise the sidebar has nothing open. */}
      <NavRow
        icon={<IconCard className="size-[11px]" />}
        label="Billing"
        active={!app}
        branded={branded}
      />
      {app ? (
        <NavRow
          icon={<IconDocuments className="size-[11px]" />}
          label={app}
          active
          branded={branded}
        />
      ) : null}
    </div>
  );
}

/** An app's title bar, with whatever state belongs beside the title. */
function AppHeader({
  title,
  meta,
  crumb,
}: {
  title: string;
  meta?: React.ReactNode;
  /**
   * What this screen sits under, shown as a trail in front of the title.
   *
   * Only for a screen you can be DEEP in. Most of these mocks are a single
   * page reached from the nav, where a crumb would be a path of length one.
   */
  crumb?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${LINE}`}
    >
      {/* 11px. At 12 the app's name was the largest type in the window —
          larger than the content it names — which made every screen in this
          set open on its own title rather than on what it holds. */}
      <span className="flex min-w-0 items-center gap-1.5">
        {crumb ? (
          <>
            {/* The way back. It was cut as copy, which was wrong — a trail is
                navigation, and without it the screen is a dead end you can
                only leave through the nav. Muted against the title, so the
                page you are ON is still the thing you read first. */}
            <span className="shrink-0 truncate text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
              {crumb}
            </span>
            <IconChevronRight className="size-[9px] shrink-0 text-[color:var(--mock-ink-soft)]" />
          </>
        ) : null}
        <span className="truncate text-[11px] leading-none text-[color:var(--mock-ink)]">
          {title}
        </span>
      </span>
      {meta}
    </div>
  );
}

function Row({
  lead,
  label,
  sub,
  trailing,
}: {
  lead?: React.ReactNode;
  label: string;
  sub?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <span
      className={`flex items-center gap-2.5 border-b py-2.5 last:border-b-0 ${LINE}`}
    >
      {lead}
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="truncate text-[10.5px] leading-none text-[color:var(--mock-ink)]">
          {label}
        </span>
        {sub ? (
          <span className="truncate text-[9px] leading-none text-[color:var(--mock-ink-soft)]">
            {sub}
          </span>
        ) : null}
      </span>
      {trailing}
    </span>
  );
}

// ── 1. Agencies — the whole portal, sidebar and all ───────────────────────
// The only card that shows the chrome. It is the section's first claim, that
// this is one portal, so it is the one that needs to show a portal.
//
// Drawn as the approvals screen the product actually ships: a round, the
// designs in it, and the two decisions you can make about them. It used to be
// a file list with Approve underneath, which is a different app — approving a
// ROUND of designs is the thing this template is for, and a list of uploads
// said "files" instead.
//
// What the real screen carries and this does NOT: the "All approvals" crumb
// above the title, and the two paragraphs under the round header explaining
// what changed and that you may pick more than one. Both are a product
// teaching its user, and this is a picture of the product — at this size they
// would be four lines of grey no one reads, pushing the designs themselves off
// the bottom of the card.
// The picked cover's two marks, and they are drawn against two different
// things — which is why they do not share a colour.
//
// THE FRAME is chrome: it sits on the card, so it reads the mock's own ink and
// takes a step down in dark, where --mock-ink-soft resolves to a #9a9a9a ring
// that was brighter than anything else on a dark card.
//
// THE TICK is not chrome. It sits on a PHOTOGRAPH, which can be any tone and
// has no theme, so theming it off the surface was the mistake behind both
// rounds of this: at --mock-ink it was a hard black disc on a pale plate, and
// stepped back for dark it became a grey disc with a grey check on a grey
// photo. It is drawn for imagery instead — a dark scrim with a white check and
// a white hairline, the control every photo picker uses, identical in both
// themes because the thing behind it is identical in both themes.
const PICKED_EDGE =
  "border-[var(--mock-ink-soft)] [[data-theme=dark]_&]:border-[#6b6b6b]";
const DOT_ON_ART = "border backdrop-blur-[2px]";
const PICKED_DOT = `${DOT_ON_ART} border-white/50 bg-black/60 text-white`;
const UNPICKED_DOT = `${DOT_ON_ART} border-white/70 bg-black/25`;

// One of them is already picked, because that is the mechanic this screen is
// for — you choose the designs you are happy with, and you may choose more than
// one. With none picked the round was identical frames and a pair of buttons,
// which is a gallery.
//
// TWO, not three. Three meant a 2x2 grid with an orphan on the second row, and
// splitting the height across two rows left each plate a letterbox — the one
// shape a catalogue cover is never in. One row of two gives each plate the
// panel's whole height.
const COVERS = [
  {
    name: "Cover A",
    src: "/images/mocks/covers/cover-1.jpg",
    picked: true,
    comments: 1,
  },
  { name: "Cover B", src: "/images/mocks/covers/cover-2.jpg", picked: false },
];

export function ApprovalsMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      {/* The firm's own colour. This is the card that claims the portal is
          yours, so the nav it shows should be yours — a neutral grey slab here
          was the one screen in the set making that claim in words only. */}
      <PortalSidebar app="Approvals" branded />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* No chip. "Decision needed" restated the pair of buttons at the foot
            of the round, and alone on the header row it read as a stray pill
            rather than as the screen's state. */}
        <AppHeader crumb="Approvals" title="Spring catalogue covers" />
        <div className="flex min-h-0 flex-1 flex-col px-4 pt-2.5">
          {/* The round you are in, and the ones behind it. Underlined rather
              than filled: a pill here would be a second chip shape on a screen
              whose job is to show a round.

              -mx-4 px-4 runs the strip's rule to both edges of the window while
              the labels stay on the content's measure — a tab rule that stops
              short of the frame reads as a divider inside the page rather than
              as the edge of the tab bar.

              items-END, not centre, and every tab carries a bottom border —
              transparent on the ones not picked. Centred, the active tab's
              border sat wherever its own box ended, which was a pixel or two
              ABOVE the strip's grey rule, so the screen showed two lines. At
              the end, with -mb-px, the black lands exactly on the grey. */}
          <div
            className={`-mx-4 flex shrink-0 items-end gap-4 border-b px-4 ${LINE}`}
          >
            <span className="-mb-px border-b border-[var(--mock-ink)] pb-2 text-[10px] leading-none text-[color:var(--mock-ink)]">
              Current round
            </span>
            <span className="-mb-px flex items-center gap-1.5 border-b border-transparent pb-2 text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
              Previous rounds
              {/* The count is the whole reason the tab is there: a second round
                  means there was a first one to compare against. */}
              <span className="rounded-[3px] bg-[var(--mock-well-2)] px-1 py-[2px] text-[8.5px] leading-none">
                1
              </span>
            </span>
          </div>

          {/* The panel fills the window rather than sizing to its contents, so
              the plates inside it can take whatever height is left after the
              header, the tabs and its own header. A fixed plate height was a
              guess that only held at one card size. */}
          <div
            className={`mb-4 mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[4px] border ${LINE}`}
          >
            <div
              className={`flex shrink-0 items-center justify-between gap-2 border-b bg-[var(--mock-well)] px-2.5 py-2 ${LINE}`}
            >
              <span className="text-[10px] leading-none text-[color:var(--mock-ink)]">
                Round 2
              </span>
              <span className="text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
                Shared Jul 30
              </span>
            </div>
            {/* The designs, two up. Each carries its own select control in the
                corner, which is what makes this an approval rather than a
                gallery — you can pick more than one. */}
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-2.5">
              {COVERS.map(({ name, src, picked, comments }) => (
                <div
                  key={name}
                  // The picked one is outlined in ink. A tint behind it was
                  // tried and is wrong here: the frame holds artwork, and
                  // washing the artwork is how you say "disabled", not
                  // "chosen".
                  className={`flex min-h-0 flex-col overflow-hidden rounded-[4px] border ${
                    picked ? PICKED_EDGE : LINE
                  }`}
                >
                  {/* The art is 3:4 and the plate is nearly square, so
                      object-cover crops the TOP AND BOTTOM. Positioned at 28%
                      rather than centre: these are head-and-shoulders
                      portraits with the face in the upper half, and a centred
                      crop takes the forehead off and keeps the sweater. What
                      goes is background above and knitwear below, which is
                      what a catalogue crop drops anyway.

                      sizes 480 and quality 90, both deliberately generous.
                      The plate is about 200px in the DESIGN space, but this
                      mock is scaled into whatever width its card gets and then
                      rendered on retina, so the 220px variant it used to ask
                      for was being drawn at well over its own size and came
                      out soft. 480 covers the largest card at 2x, and 90
                      overrides next/image's default 75 — on skin and hair,
                      75 is where JPEG starts showing in the gradients. */}
                  <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--mock-well-2)]">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="480px"
                      quality={90}
                      className="object-cover object-[50%_28%]"
                    />
                    <span
                      // Picked is drawn in --mock-ink-soft, not --mock-ink.
                      // At full ink the mark was near-black on a pale plate and
                      // a near-black rule around the frame — the loudest pair
                      // of marks on a screen whose subject is the artwork
                      // inside them. One step back still reads as chosen
                      // against two frames that carry nothing.
                      className={`absolute left-1.5 top-1.5 flex size-[11px] items-center justify-center rounded-full ${
                        picked ? PICKED_DOT : UNPICKED_DOT
                      }`}
                    >
                      {picked ? <IconCheck className="size-[7px]" /> : null}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between gap-1.5 border-t px-2 py-1.5 text-[9.5px] leading-none text-[color:var(--mock-ink)] ${LINE}`}
                  >
                    <span className="truncate">{name}</span>
                    {comments ? (
                      <span className="flex shrink-0 items-center gap-0.5 text-[color:var(--mock-ink-soft)]">
                        <IconChat className="size-[9px]" />
                        {comments}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── 2. Consultants — a chart, no chrome ──────────────────────────────────
// Progress across engagements is a magnitude per client, so it is a bar list:
// four rows, one per engagement, each a track filled to its share. Drawn
// straight onto the card the way the reference draws its artwork, so one card
// in the set is a chart rather than a window.
//
// Labels sit INSIDE the track at full width rather than being the bar itself:
// with the bar's width carrying the value, the shortest row could not hold
// "Northwind Group" and every name would have truncated.
const ENGAGEMENTS = [
  { client: "Meridian Corp", done: 6, total: 6 },
  { client: "Oakwood LLC", done: 5, total: 6 },
  { client: "Bloom Studios", done: 3, total: 6 },
  { client: "Northwind Group", done: 2, total: 6 },
];

export function ProgressMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col justify-center"
    >
      <div className="flex flex-col gap-2">
        {ENGAGEMENTS.map(({ client, done, total }) => (
          <div
            key={client}
            className="relative h-[36px] overflow-hidden rounded-md bg-foreground/[0.05] [[data-theme=dark]_&]:bg-white/[0.06]"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-md bg-foreground/[0.11] [[data-theme=dark]_&]:bg-white/[0.12]"
              style={{ width: `${(done / total) * 100}%` }}
            />
            <div className="relative flex h-full items-center justify-between gap-3 px-3">
              <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                {client}
              </span>
              <span className="shrink-0 text-[13px] leading-none tabular-nums text-[color:var(--mock-ink-soft)]">
                {done}/{total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 2b. Accounting — the collection as an analytics tile ─────────────────
// A SECOND documents picture, for the tailor grid. DocumentsMock below is the
// portal screen and is what the hero carousel draws, so it is left alone; this
// one exists because beside the onboarding board the row-and-chip screen read
// as the same card twice. A headline figure over a column chart is a different
// KIND of picture, which is the whole point of that set.
const UPLOADS = [1, 2, 2, 4, 3, 5];

export function DocumentsStatsMock() {
  const peak = Math.max(...UPLOADS);
  return (
    <div
      aria-hidden
      className={`pointer-events-none flex h-full select-none flex-col gap-4 rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] p-4 ${LINE}`}
    >
      <div>
        <p className="text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
          Documents received
        </p>
        <p className="mt-2 text-[24px] leading-none text-[color:var(--mock-ink)]">8 of 12</p>
      </div>

      {/* No axis rule: with the columns all starting from the same edge the
          baseline is already read, and the line only added a second horizontal
          to a card that has one under the heading. Corners are rounded at both
          ends so each column is a complete shape rather than a strip cut off
          at the bottom — which is what the rule was there to hide. 6px gutter,
          one direct label on the peak. */}
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[86px] flex-1 items-end gap-[6px]">
          {UPLOADS.map((n, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              {n === peak ? (
                <span className="mb-1 text-center text-[10.5px] leading-none tabular-nums text-[color:var(--mock-ink-soft)]">
                  {n}
                </span>
              ) : null}
              <div
                className={`w-full rounded-[4px] ${
                  n === peak
                    ? "bg-foreground"
                    : "bg-foreground/[0.14] [[data-theme=dark]_&]:bg-white/[0.16]"
                }`}
                style={{ height: `${(n / peak) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
          <span>Nov 4</span>
          <span>Dec 9</span>
        </div>
      </div>
    </div>
  );
}

// ── 3. Accounting — the checklist as a portal screen ──────────────────────
// Built to the same shape as the approvals screen: sidebar, app header, then
// the content filling the frame. It used to be a bordered panel floating in the
// window, which inside a framed shot read as two boxes with a gap between them
// — most visible on a phone, where the sidebar is hidden and nothing explained
// the inner edge. What makes it a different app is its CONTENT — a completion
// bar, received tags and an upload action — not a second frame around it.
export function DocumentsMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      <PortalSidebar app="Documents" />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* The count and the meter that measures it, together.

            The meter used to be a full-width rule under the header, filled to
            two thirds, with nothing beside it: no label, no end, and no
            relation to the rows below — so it read as a stray line rather than
            as "8 of 12 are in". Short, and set against the figure it measures,
            it says that once and at a glance. */}
        <AppHeader
          title="2025 year-end"
          meta={
            <span className="flex shrink-0 items-center gap-2">
              <span className="h-1 w-10 overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
                <span className="block h-full w-2/3 rounded-full bg-foreground" />
              </span>
              <span className="text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
                8 of 12
              </span>
            </span>
          }
        />
        <div className="min-h-0 flex-1 px-4 py-3.5">
          <div>
            <Row
              label="W-2, all employees"
              trailing={<span className={POSITIVE}>Received</span>}
            />
            <Row
              label="1099-NEC contractors"
              trailing={<span className={POSITIVE}>Received</span>}
            />
            <Row
              label="Bank statements, Q4"
              trailing={
                <span
                  className={`flex items-center gap-1 rounded-[4px] border px-2 py-[5px] text-[9px] leading-none text-[color:var(--mock-ink)] ${LINE}`}
                >
                  <IconUpload className="size-[9px]" />
                  Upload
                </span>
              }
            />
            <Row
              label="Mileage log"
              trailing={<span className={WARNING}>Awaiting</span>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── The stack section's picture — someone else's tool, inside the portal ──
// The claim is that what a firm already runs comes with it, so the picture is
// an outside tool running as an app in the sidebar: the portal's own chrome
// around a scheduler that is plainly not ours, marked Embedded so nobody reads
// it as a feature we built.
const SLOT_DAYS = ["Mon 14", "Tue 15", "Wed 16"];
const SLOT_TIMES = ["9:00", "11:30", "14:00", "16:30"];

export function EmbedMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      <PortalSidebar app="Book a call" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title="Book a call"
          meta={<span className={NEUTRAL}>Embedded</span>}
        />
        <div className="min-h-0 flex-1 px-4 py-3.5">
          <span className="block text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
            March 2026
          </span>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {SLOT_DAYS.map((day) => (
              <span
                key={day}
                className={`flex items-center justify-center rounded-[4px] border py-[7px] text-[10px] leading-none text-[color:var(--mock-ink)] ${LINE}`}
              >
                {day}
              </span>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            {SLOT_TIMES.map((time, i) => (
              <span
                key={time}
                // The first slot reads as the one being taken, so the panel
                // has a subject rather than four identical rows.
                className={`flex items-center justify-center rounded-[4px] py-[7px] text-[10px] leading-none ${
                  i === 0
                    ? "bg-foreground text-background"
                    : `border text-[color:var(--mock-ink)] ${LINE}`
                }`}
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── The problem section's pictures — the before/after pair ───────────────
// The brief's own diptych: a generic portal with the firm's real tools orbiting
// it as tabs it cannot absorb, beside the Brandmages portal with the Intake app
// sitting in the sidebar where those tabs used to be.
//
// Two full portal screens rather than two miniatures. They were drawn small
// enough to sit inside one card, which made them 8px type nobody could read;
// at a tray's width they are the same chrome every other screen on this page
// runs, so the only differences the eye finds are the ones carrying the
// argument. The left one is held back in opacity and desaturated by the
// section, not here — a mock should not know it is the bad example.

/** The work that has nowhere to live in the portal a firm bought. */
const ORBIT_TOOLS = [
  "Partner intake sheet",
  "Onboarding email thread",
  "Rate card drive",
];

/**
 * The apps the bought portal came with. Four fixed tabs, and that is the set —
 * which is the caption's whole point ("the portal you bought has the apps it
 * has"). Deliberately NOT Assembly's own Home / Messages / Files / Billing: a
 * competitor's product does not share our labels, and a reader who knows the
 * product would have read the same nav twice.
 */
const BOUGHT_TABS = ["Dashboard", "Inbox", "Documents", "Invoices"];

/**
 * The portal a firm bought from somebody else.
 *
 * It used to be drawn in ASSEMBLY's chrome — the same PortalSidebar component
 * as the screen beside it, the same nav labels, the same icons — with only the
 * workspace name changed. So the "before" half of the argument was a picture of
 * our own product wearing a different name, and the comparison read as two
 * states of one app rather than as somebody else's software against ours.
 *
 * Now it is a different product, and says so in its chrome rather than in its
 * copy:
 *
 * - **Tabs across the top, not a sidebar.** This is the single loudest signal,
 *   and it also happens to be the caption: the apps it has, in a row, with no
 *   room to add one.
 * - **No icons on the nav, and a plain wordmark** — no logo tile. Every nav row
 *   on this site carries an icon, so dropping them reads as another product
 *   immediately.
 * - **Squarer corners and a tighter type size** than the Assembly screens,
 *   which is what an older webapp looks like beside a current one.
 *
 * It stays on the --mock-* tokens throughout, so it is a different PRODUCT
 * rather than a different palette, and it is correct in both themes. It is also
 * held back in opacity and desaturated by the section, not here — a mock should
 * not know it is the bad example.
 */
export function GenericPortalMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      {/* The product's own bar. A blank square where a logo would go, and the
          product's name as plain type — it is nobody's portal, so it carries
          nobody's mark. */}
      <div
        className={`flex items-center gap-2 border-b bg-[var(--mock-well)] px-4 py-2.5 ${LINE}`}
      >
        {/* The firm's initial on a plain square — the default avatar a
            workspace gets in a product it did not design. Ink at 10%, so the
            tile steps off whatever it sits on in either theme; on a well
            colour it was the same grey twice and the avatar disappeared.
            Square, not the rounded tile the Assembly screens use. */}
        <span className="flex size-[13px] shrink-0 items-center justify-center rounded-[2px] bg-[var(--mock-ink)]/10 text-[7.5px] leading-none text-[color:var(--mock-ink-soft)]">
          B
        </span>
        {/* Just "Portal". The product is nobody's and is not being sold here,
            so the less it is named the better — and at this size a two-word
            product name beside a one-letter avatar read as the firm's own
            branding rather than as the software's. */}
        <span className="truncate text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
          Portal
        </span>
      </div>

      {/* The fixed set, as a tab strip. The open one is marked by an underline
          sitting on the strip's own rule rather than by a filled pill: the pill
          is how THIS site marks a picked row, and the two screens should not
          mark the same idea the same way. */}
      <div className={`flex items-center gap-5 border-b px-4 ${LINE}`}>
        {BOUGHT_TABS.map((tab, i) => {
          // Dashboard, not one of the three after it. What this screen shows
          // below is a list of work the portal does not hold, which belongs to
          // no particular app — parked under "Invoices" it read as an answer to
          // the wrong question ("why is the rate card drive on the invoices
          // page?"). The overview is the one page where a catch-all list is
          // what you would expect to find.
          const open = i === 0;
          return (
            <span
              key={tab}
              className={`-mb-px border-b py-[9px] text-[10.5px] leading-none ${
                open
                  ? "border-[var(--mock-ink)] text-[color:var(--mock-ink)]"
                  : "border-transparent text-[color:var(--mock-ink-soft)]"
              }`}
            >
              {tab}
            </span>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-3.5">
        {/* "Everything else" was the label here and it did not say what the
            rows were — three dashed boxes under a vague heading, each marked
            with the same icon. This names the one thing they have in common,
            which is the caption's point: the portal does not hold them. */}
        <span className="block text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
          Not in your portal
        </span>
        {/* Dashed, because none of these is an app the portal holds — they are
            the tabs the work actually lives in, parked beside it. Squarer than
            the Assembly screens' rows, like the rest of this product.

            The mark on the right is an OUT arrow, not the house glyph that was
            here before (IconGlobe draws a house despite its name, so all three
            rows carried a home icon, which says nothing about any of them). An
            out arrow is the one mark everybody reads as "this opens somewhere
            else", which is exactly what each of these is. */}
        <div className="mt-2.5 flex flex-col gap-1.5">
          {ORBIT_TOOLS.map((tool) => (
            <span
              key={tool}
              className={`flex items-center justify-between gap-2 truncate rounded-[4px] border border-dashed px-2.5 py-[9px] text-[11px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
            >
              {tool}
              <IconArrowUpRight className="size-[10px] shrink-0" />
            </span>
          ))}
        </div>
        {/* No button. These screens are cropped by the tray they sit in, so a
            control pinned to the bottom of one was half-cut as often as not —
            and a picture of a button that cannot be pressed is a promise the
            mock does not keep. The list above is the point. */}
      </div>
    </div>
  );
}

const INTAKE_FIELDS: { label: string; value: string }[] = [
  { label: "Property", value: "Hotel Corvina, Lisbon" },
  { label: "Rate agreement", value: "2026 preferred" },
  { label: "Onboarding owner", value: "Dana Whitfield" },
];

export function IntakeAppMock({
  /** Draws the client's nav in the firm's colour. See PortalSidebar. */
  branded = false,
  /**
   * The submit control at the foot of the form. Off where the screen is
   * cropped by a tray — a button half-cut by the edge of its own picture reads
   * as a rendering fault rather than as a window onto something larger.
   */
  action = true,
}: { branded?: boolean; action?: boolean } = {}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none bg-[var(--mock-window)] text-[color:var(--mock-ink)]"
    >
      <PortalSidebar app="Partner intake" branded={branded} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* No "Your app" chip. The nav row beside it is lit and says the same
            words, the caption above the picture says them again, and alone on
            the header row it read as a stray pill rather than as whose app
            this is. */}
        <AppHeader title="Partner intake" />
        <div className="flex min-h-0 flex-1 flex-col px-4 py-3.5">
          <div className="flex flex-col gap-2.5">
            {INTAKE_FIELDS.map((field) => (
              <div key={field.label}>
                <span className="block text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
                  {field.label}
                </span>
                <div
                  className={`mt-1.5 flex h-[28px] items-center rounded-[4px] border px-2.5 text-[11px] leading-none text-[color:var(--mock-ink)] ${LINE}`}
                >
                  {field.value}
                </div>
              </div>
            ))}
          </div>
          {action ? (
            <span className="mt-auto w-fit rounded-[4px] bg-foreground px-2.5 py-[7px] text-[10px] leading-none text-background">
              Submit partner
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── 4. Legal — a dashboard of panels, cropped ────────────────────────────
// Not one screen but a board of them, on a recessed tray, with the bottom row
// running off the card. The onboarding app is several things at once — where
// the client is up to, what is signed, what is still missing — and a board
// shows that where a single list would flatten it.
const STEPS = ["Your details", "Engagement letter", "Documents", "Review"];

/** One white panel on the tray. */
function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg border p-3 ${PANEL} ${className}`}
    >
      <p className="truncate text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
        {title}
      </p>
      {children}
    </div>
  );
}

export function OnboardingMock() {
  return (
    <div
      aria-hidden
      // One column on a phone. Two columns of four panels at ~300px wide meant
      // every panel was a third the width it was drawn for: the step names
      // truncated to "Your d…", the figures crowded their labels, and the
      // screen had to be decoded rather than recognised. Stacked, each panel is
      // full width and the shot crops after the second — which is what the
      // other screens in the set do anyway.
      // White, like every other screen in the set. It used to be a recessed
      // tray (a 3.5% black wash) so the white panels would lift off it — but
      // that tone and the panel ground behind the shot are within a hair of
      // each other, so the whole screen sank into the page and only the panels
      // read as anything. On white it is unmistakably an app screen; the panels
      // keep their hairline borders, which is separation enough.
      className="pointer-events-none grid h-full select-none grid-cols-1 content-start gap-2.5 bg-[var(--mock-window)] text-[color:var(--mock-ink)] p-2.5 sm:grid-cols-[1.55fr_1fr]"
    >
      {/* Where this client is up to. */}
      <Panel title="Client onboarding">
        <p className="mt-2 text-[13px] leading-none text-[color:var(--mock-ink)]">
          Engagement letter
        </p>
        {/* One continuous track, filled to where this client has got to —
            the same bar the document checklist uses, so the two screens show
            progress the same way.

            It was four separate segments in four different greys (black, 45%
            black, and two at the muted tone), which at 3px with gaps between
            them read as a row of loading placeholders rather than as one
            measure of how far along something is. A single track with a filled
            run has an obvious start, end and position. */}
        <div className="mt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
            <span className="block h-full w-1/2 rounded-full bg-foreground" />
          </div>
          {/* Hidden on a phone: at four across a 300px screen every name
              truncated to a stub, and a row of stubs reads as damage. The track
              still carries how far along this is, and "Engagement letter" above
              names the step. */}
          <div className="mt-2 hidden grid-cols-4 gap-1.5 sm:grid">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`truncate text-[8.5px] leading-none ${
                  i <= 1 ? "text-[color:var(--mock-ink)]" : "text-[color:var(--mock-ink-soft)]"
                }`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </Panel>

      {/* The reassurance the copy promises: nothing typed is lost. */}
      <Panel title="Progress">
        <p className="mt-2 text-[20px] leading-none text-[color:var(--mock-ink)]">2 of 4</p>
        <span className={`mt-2.5 inline-flex ${POSITIVE}`}>Saved</span>
      </Panel>

      {/* Cropped by the card edge. */}
      <Panel title="Secure data room">
        <div className="mt-1">
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-[color:var(--mock-ink-soft)]" />
            }
            label="Deed of trust.pdf"
            trailing={<span className={POSITIVE}>Uploaded</span>}
          />
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-[color:var(--mock-ink-soft)]" />
            }
            label="Proof of identity.pdf"
            trailing={<span className={POSITIVE}>Uploaded</span>}
          />
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-[color:var(--mock-ink-soft)]" />
            }
            label="Signed letter"
            trailing={<span className={WARNING}>Awaiting</span>}
          />
        </div>
      </Panel>

      {/* Last in, first out: stacked, this one is below the crop anyway, and
          it carries the least — a line and two placeholder bars. */}
      <Panel title="Access" className="hidden sm:block">
        <div className="mt-2 flex items-center gap-1.5 text-[10px] leading-none text-[color:var(--mock-ink)]">
          <IconLock className="size-[11px] text-[color:var(--mock-ink-soft)]" />
          Client only
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          <span className="h-1.5 w-full rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]" />
          <span className="h-1.5 w-2/3 rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]" />
        </div>
      </Panel>
    </div>
  );
}
