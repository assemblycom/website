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

import { ApprovalCovers } from "@/components/client-portal/approval-covers";

import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconChevronDown,
  IconChevronRight,
  IconDocuments,
  IconFile,
  IconArrowUpRight,
  IconGlobe,
  IconPlus,
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

// The same two pills, quieter — for the onboarding board only.
//
// Every other mock in this file shows one or two status pills on a screen.
// The board shows four at once across two panels, and at that count the full
// -strength washes were the first thing the eye landed on: a picture of a
// wizard where the colour belonged to the chips rather than to the steps.
//
// A VARIANT, not a second opinion. Both cuts are defined together in
// globals.css, in each theme's own block, and both are read here as tokens —
// so the quiet pills cannot drift away from the loud ones, and neither can
// drift between themes. A local hex here would have given this board a private
// palette that nothing else could follow.
const POSITIVE_QUIET = `${CHIP} bg-[var(--mock-positive-muted-bg)] text-[color:var(--mock-positive-muted-fg)]`;
const WARNING_QUIET = `${CHIP} bg-[var(--mock-warning-muted-bg)] text-[color:var(--mock-warning-muted-fg)]`;
const NEUTRAL = `${CHIP} bg-muted text-[color:var(--mock-ink-soft)] [[data-theme=dark]_&]:bg-white/[0.08]`;

const LINE = "border-[var(--mock-line)]";
/** The white panel the app is drawn on, wherever a card shows one. */
// The ordinary panel ground: a half step off the board, not the board itself.
//
// Flat --mock-window, these were the same tone as the surface behind them and
// were held together only by their hairlines — four outlines on one field. A
// slight lift makes each one an object. It is deliberately HALF of the step
// panel's --mock-well: that panel is the thing to read first, and it can only
// be stepped forward of these if these are not standing at the same height.
//
// Grey, with no hue in it. The board already tried a blue wash and lost it —
// colour on a panel ground reads as the panel meaning something.
const PANEL = `bg-[var(--mock-well-soft)] text-[color:var(--mock-ink)] ${LINE}`;

// The tinted ground, for the ONE panel that gets it.
//
// --mock-well, not a hue. A blue wash was tried and dropped: colour here reads
// as a status — the panel meaning something — when all it has to do is be the
// panel you look at first. --mock-well is the neutral step this mock family
// already uses wherever a surface sits apart from the window (the portal bar,
// the round header), so the first panel is lifted by the same amount and in
// the same direction as every other lifted surface on the site, in both
// themes, rather than by a one-off value.
// It also catches the light, like the frame around it.
//
// .mock-edge again — the hero's lit border, and now the board's outer frame's —
// with two overrides it needs and the frame does not:
//
//   --mock-edge-fill  so the ramp paints the BORDER but leaves the inside on
//                     --mock-well. Without it the class's default fill would
//                     put the panel back on --mock-window and the lift above
//                     would be undone by the thing meant to dress it.
//   -w / -h in %      because the default 540x400 ellipse is tuned to the
//                     hero's 760px screen, and this panel is ~335x92 — the box
//                     would sit entirely in the bright end of the ramp and read
//                     as one flat grey. 120/150% is what the other card-sized
//                     callers (the composer, the build cards) already use.
//
// Dark only, where the class is defined: the lift alone carries the panel in
// light, and a ramp on a white card has nothing to fall into.
const PANEL_TINT = `mock-edge [--mock-edge-fill:var(--mock-well)] [--mock-edge-w:120%] [--mock-edge-h:150%] bg-[var(--mock-well)] text-[color:var(--mock-ink)] ${LINE}`;

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
      {/* 10.5px — the set's label size, the same step as a row label, the
          sidebar and the tab strips.

          It was 12 first, then 11, both of which left the app's name the
          largest type in the window — larger than the content it names — so
          every screen opened on its own title rather than on what it holds.
          11 was close enough to the 10.5 everywhere else to look like a
          mistake rather than a step: half a pixel is not a hierarchy, it is a
          wobble. The trail and the title carry their rank in COLOUR (soft vs
          ink) and in position, which is enough, and the row now sits flush
          with the tabs directly beneath it. */}
      <span className="flex min-w-0 items-center gap-1.5">
        {crumb ? (
          <>
            {/* The way back. It was cut as copy, which was wrong — a trail is
                navigation, and without it the screen is a dead end you can
                only leave through the nav. Muted against the title, so the
                page you are ON is still the thing you read first. */}
            <span className="shrink-0 truncate text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
              {crumb}
            </span>
            <IconChevronRight className="size-[9px] shrink-0 text-[color:var(--mock-ink-soft)]" />
          </>
        ) : null}
        <span className="truncate text-[10.5px] leading-none text-[color:var(--mock-ink)]">
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
            <span className="-mb-px border-b border-[var(--mock-ink)] pb-2 text-[10.5px] leading-none text-[color:var(--mock-ink)]">
              Current round
            </span>
            <span className="-mb-px flex items-center gap-1.5 border-b border-transparent pb-2 text-[10.5px] leading-none text-[color:var(--mock-ink-soft)]">
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
            {/* The designs, two up, with the select control in each corner —
                which is what makes this an approval rather than a gallery.
                One at a time; see ApprovalCovers for why. */}
            <ApprovalCovers />
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

// NO FIGURES. The rows carried "6/6", "5/6" and so on at the right end, and
// they were the one thing on this card asking to be read rather than seen.
//
// A bar already states a proportion — that is the entire reason to draw one —
// so the count beside it was the same fact in a second notation, at 13px, on a
// mock nobody is meant to study. What is left is four lengths and four client
// names, which is what a glanceable dashboard is.
//
// It also removes the awkward part of the hover: the figures had to crossfade
// between two readings to keep up with the bars growing, which was machinery
// in service of something the bars were already saying.
//
// The bars are drawn in Haze, the brand blue (#7DA4FF on /brand), through
// --mock-accent-bg.
//
// They were grey, which said how far along each engagement is and nothing
// else; they were then briefly a green/amber/red traffic light, which said far
// too much. How far through a piece of work a client is is a MAGNITUDE, and
// the length of the bar already carries it — recolouring that scale as good,
// warning and bad turns the chart into a judgement about four named clients
// that nothing on the card supports. One tone leaves the length to do its job
// and makes the card read as ours.
//
// The tokens, not the hex. Haze is a fixed brand value but the TINT of it that
// works on a card is not: light needs it mixed into white, dark needs it
// translucent, and only --mock-accent-bg knows which is in force.
//
// One RUNG PER ROW, strongest first, the way the brand's charts separate a
// series by tint rather than by hue. ENGAGEMENTS is ordered by completeness,
// so the index is the rank — the furthest-along client gets Haze at full and
// each one behind it steps a shade lighter. Length still carries the number;
// the tint just stops four bars of one colour reading as one block.
const BAR_RAMP = [
  "bg-[var(--mock-accent-bg)]",
  "bg-[var(--mock-accent-bg-2)]",
  "bg-[var(--mock-accent-bg-3)]",
  "bg-[var(--mock-accent-bg-4)]",
];

// Hover advances the bars, the same move the rail's project card already makes
// and on the same easing — a dashboard's claim is that the work moves, and a
// still list of four fixed bars is the one thing that cannot say so.
//
// Each row that is NOT already complete gains one milestone. Meridian is at
// 6/6 and stays there, which is what keeps the move reading as progress rather
// than as a decorative wobble: the bar that has nowhere to go does not move.
//
// Staggered top to bottom so the four read as a cascade rather than as one
// block resizing. Written out as literal classes for Tailwind's scanner, and
// the whole thing is motion-safe — the widths simply land at their resting
// value with no transition under reduced motion.
const BAR_MOVE =
  "motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out motion-reduce:transition-none";
const BAR_DELAY = [
  "",
  "motion-safe:delay-[60ms]",
  "motion-safe:delay-[120ms]",
  "motion-safe:delay-[180ms]",
];

export function ProgressMock() {
  return (
    <div
      aria-hidden
      className="group/progress flex h-full select-none flex-col justify-center"
    >
      <div className="flex flex-col gap-2">
        {ENGAGEMENTS.map(({ client, done, total }, i) => {
          // The track stays neutral. Tinting it too would make every row a
          // full-width block of the same blue and the lengths would stop
          // reading — the bar has to end somewhere visible to be a bar.
          const rest = (done / total) * 100;
          const lifted = (Math.min(done + 1, total) / total) * 100;
          return (
            <div
              key={client}
              className="relative h-[36px] overflow-hidden rounded-md bg-foreground/[0.05] [[data-theme=dark]_&]:bg-white/[0.06]"
            >
              <div
                className={`absolute inset-y-0 left-0 rounded-md w-[var(--bar-rest)] group-hover/progress:w-[var(--bar-lifted)] ${BAR_RAMP[i] ?? ""} ${BAR_MOVE} ${BAR_DELAY[i] ?? ""}`}
                style={
                  {
                    // BOTH widths are handed over as custom properties and
                    // applied by CLASS. An inline `width` would win against
                    // the hover rule outright — inline style beats any
                    // selector — so the bars simply never moved. This way the
                    // values stay computed and the rules stay literal classes
                    // the scanner can see, with :hover's specificity deciding
                    // which one is in force.
                    "--bar-rest": `${rest}%`,
                    "--bar-lifted": `${lifted}%`,
                  } as React.CSSProperties
                }
              />
              {/* One label, left. The figures that used to sit at the right
                  end are gone — see the note on ENGAGEMENTS. */}
              <div className="relative flex h-full items-center px-3">
                <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
                  {client}
                </span>
              </div>
            </div>
          );
        })}
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
        <p className="mt-2 text-[24px] leading-none text-[color:var(--mock-ink)]">
          8 of 12
        </p>
      </div>

      {/* No axis rule: with the columns all starting from the same edge the
          baseline is already read, and the line only added a second horizontal
          to a card that has one under the heading. Corners are rounded at both
          ends so each column is a complete shape rather than a strip cut off
          at the bottom — which is what the rule was there to hide. 6px gutter.

          No date range under it and no figure over the peak either. "8 of 12"
          is the number this card is making, stated once at full size; a 10.5px
          "5" above the last column and a "Nov 4 / Dec 9" rule under the chart
          were two more figures competing with it, both of them detail nobody
          reads at this size. The shape of the columns is the claim — uploads
          climbing — and the shape survives losing its labels, which is the
          test of whether they were carrying anything. */}
      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[86px] flex-1 items-end gap-[6px]">
          {UPLOADS.map((n, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              {/* The same Haze pair the progress card uses, and the same
                  reason: the peak was near-black against grey, which made the
                  one column the card is pointing at read as ink rather than as
                  a value — the heaviest mark on a card whose heading is set
                  lighter than it. Full Haze for the peak, a tint of it for the
                  rest, so the highlight is a step along one hue instead of a
                  jump to a different kind of mark. */}
              <div
                className={`w-full rounded-[4px] ${
                  n === peak
                    ? "bg-[var(--mock-accent-bg)]"
                    : "bg-[var(--mock-accent-bg-3)]"
                }`}
                style={{ height: `${(n / peak) * 100}%` }}
              />
            </div>
          ))}
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

// The intake, as a form rather than as a record.
//
// It was three labelled rows with their answers already in them, which reads
// as a detail view of something somebody else filled in — and this screen is
// the "Fits" half of an argument about work your firm actually does, so it has
// to look like work being done. The question-per-card shape is the one every
// client on earth already recognises as "a form to fill in".
//
// The chrome around it does NOT change: sidebar, app header, the portal's own
// frame. That separation is the whole claim — the familiar form, living inside
// your portal rather than in a tab beside it. Which is also why none of the
// borrowed look goes further than the card shape: the OTHER screen in this
// pair lists "Partner intake sheet", "Onboarding email thread" and "Rate card
// drive" as the tools this replaces, so leaning any harder on that house style
// would make the after look like the before.
//
// Every answer is TYPED. A radio set was tried for the rate agreement, on the
// grounds that a choice is what makes a stack of cards read as a form — but it
// also made the screen a questionnaire, and this app's job is collecting a
// partner's details, which is typing. Four written answers read as a record
// being filled in; one radio among them read as a survey that had wandered in.
const INTAKE_QUESTIONS: { label: string; value: string }[] = [
  { label: "Property", value: "Hotel Corvina, Lisbon" },
  { label: "Rate agreement", value: "2026 preferred" },
  { label: "Onboarding owner", value: "Dana Whitfield" },
  // The fourth is what turns a short list into a form you are partway down —
  // three cards and a "Step 1 of 4" would have had the reader counting them
  // and coming up short.
  { label: "Billing contact", value: "ap@hotelcorvina.com" },
];

// The form's own header, above the questions.
//
// It names the section and says where in the sequence you are, which is the
// one thing the cards alone cannot say: four questions on screen look like the
// whole job, and the point of this app is that it is a real intake with more
// behind it. The bar under it is the same Haze the charts on this page use, so
// the accent means one thing across the set.
const INTAKE_STEP = { title: "Partner details", step: 1, of: 4 };

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
      {/* The sidebar goes on a phone and the bar takes over, the same swap the
          onboarding wizard makes — at that width a 150px nav column against a
          form is most of the screen spent on navigation nobody is using. */}
      <div className="hidden sm:flex">
        <PortalSidebar app="Partner intake" branded={branded} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileAppBar app="Partner intake" />
        {/* No "Your app" chip. The nav row beside it is lit and says the same
            words, the caption above the picture says them again, and alone on
            the header row it read as a stray pill rather than as whose app
            this is. */}
        <AppHeader title="Partner intake" />
        {/* RECESSED, where every other screen's body is the window's own
            ground. The cards have to sit on something to read as cards, and
            --mock-well is the step the scale already has for a recess inside a
            panel — a second white on white would have needed a shadow to
            separate, which nothing else in this set uses. */}
        <div className="flex min-h-0 flex-1 flex-col bg-[var(--mock-well)] px-4 py-3.5">
          {/* Centred on its own measure rather than run to the window's edges.
              A form is a column you work down; stretched across a wide screen
              the questions stop being a sequence and the answers end up a long
              way from what they answer. */}
          <div className="mx-auto flex w-full max-w-[300px] flex-col gap-2">
            {/* The form's title card, built the way every form builder
                builds one: a band of colour across the very top edge, then the
                name of the form under it.

                The band is what does the work — it is the only full-bleed
                shape in the column, so the card stops being the first question
                in the stack and becomes the thing the stack sits under. That
                was a Haze tint across the whole card first, which said the same
                thing far more quietly and put the page's accent colour on a
                screen whose subject is a form, not a chart.

                --mock-ink, not the accent. Black is this screen's own colour —
                the sidebar, the submit button and the field labels are all
                drawn in it — and a blue band here was the one thing on the
                screen borrowed from somewhere else.

                overflow-hidden so the band takes the card's top corners rather
                than squaring them off. */}
            <div
              className={`overflow-hidden rounded-[5px] border bg-[var(--mock-window)] ${LINE}`}
            >
              <div className="h-[4px] bg-[var(--mock-ink)]" />
              <div className="flex items-center justify-between gap-2 p-2.5">
                <span className="truncate text-[10.5px] leading-none text-[color:var(--mock-ink)]">
                  {INTAKE_STEP.title}
                </span>
                <span className="shrink-0 text-[9.5px] leading-none tabular-nums text-[color:var(--mock-ink-soft)]">
                  Step {INTAKE_STEP.step} of {INTAKE_STEP.of}
                </span>
              </div>
            </div>

            {INTAKE_QUESTIONS.map((q) => (
              <div
                key={q.label}
                className={`rounded-[5px] border bg-[var(--mock-window)] p-2.5 ${LINE}`}
              >
                <span className="block text-[10.5px] leading-none text-[color:var(--mock-ink)]">
                  {q.label}
                </span>
                {/* On a rule rather than in a box — the underline is what says
                    "this is where you write", and a bordered field inside a
                    bordered card was two frames around one value. */}
                <span
                  className={`mt-2 block truncate border-b pb-1.5 text-[10px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
                >
                  {q.value}
                </span>
              </div>
            ))}
            {/* The form's own action, at the foot of the column rather than
                off to one side — a form you work down ends in the button that
                sends it. */}
            {action ? (
              <span className="mt-1 w-fit rounded-[4px] bg-[var(--mock-ink)] px-2.5 py-[6px] text-[10px] leading-none text-[color:var(--mock-window)]">
                Submit
              </span>
            ) : null}
          </div>
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

// Two people, not five. The list is the proof that "Client only" resolves to
// somebody, and two names carry that as well as ten — while the panel is
// 216px wide and sits under a crop, so a longer list would be showing its own
// scrollbar rather than its contents.
//
// One client and one person from the firm, in that order: the client is the
// subject of the screen, and a list that opened on the firm would be saying
// who is working on them rather than who can see it.
const ACCESS = [
  { initials: "MR", name: "Marta Reyes", role: "Client" },
  { initials: "JO", name: "James Okafor", role: "Partner" },
];

/**
 * The initials tile — the default avatar a person gets before anyone uploads a
 * photo, which is most of them.
 *
 * Ink at 10% rather than a grey, so the tile steps off whatever it sits on in
 * either theme; on a well colour a fixed grey was the same tone twice and the
 * avatar vanished. Same values as the portal bar's workspace tile and the
 * build cards' client tile.
 */
function Initials({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-[14px] shrink-0 items-center justify-center rounded-[3px] bg-[var(--mock-ink)]/10 text-[7px] leading-none text-[color:var(--mock-ink-soft)]">
      {children}
    </span>
  );
}

/** One white panel on the tray. */
function Panel({
  title,
  children,
  className = "",
  hideTitleOnPhone = false,
  tinted = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Puts this panel on the lifted ground instead of the window.
   *
   * For the step panel alone. A board of four identically-weighted panels has
   * no first thing to read, and the one that says where the client is up to is
   * the reason the screen exists — so it is the one that steps forward. The
   * other three stay on the window: lift them all and nothing is lifted.
   */
  tinted?: boolean;
  /**
   * Drops the panel's own label below sm.
   *
   * For the one panel whose title is the same words as the phone bar above it
   * — the bar names the screen at that width, so the panel repeating it puts
   * the same phrase twice in forty pixels. From sm the bar is gone and the
   * label is the only thing naming the panel, so it comes back.
   */
  hideTitleOnPhone?: boolean;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg border p-3 ${
        tinted ? PANEL_TINT : PANEL
      } ${className}`}
    >
      <p
        className={`truncate text-[10px] leading-none text-[color:var(--mock-ink-soft)] ${
          hideTitleOnPhone ? "hidden sm:block" : ""
        }`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// ── The onboarding wizard's phone chrome ─────────────────────────────────
// Below sm this screen is a single column of panels and nothing else, so it
// opened straight into content with no app around it — a stack of cards, not
// an app. The other screens in the set carry a sidebar that does that job;
// this one has none, and a sidebar is the wrong answer on a phone anyway.
//
// So it gets the bar the product itself shows at that width: the nav collapsed
// to a hamburger, the app named with the switcher's chevron beside it, and the
// row's actions held to the right. sm:hidden, because from sm the two-column
// layout already reads as a desktop screen and a phone bar on top of it would
// be two different devices in one picture.
function IconHamburger({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M4.5 6.5h11M4.5 10h11M4.5 13.5h11" {...STROKE} />
    </svg>
  );
}

function IconEllipsis({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      {/* Dots, not a stroked path — at this size a three-dot path set with
          round caps renders as a dashed line rather than as three marks. */}
      <circle cx="5.5" cy="10" r="1.1" fill="currentColor" />
      <circle cx="10" cy="10" r="1.1" fill="currentColor" />
      <circle cx="14.5" cy="10" r="1.1" fill="currentColor" />
    </svg>
  );
}

// The squared control the bar's buttons wear. rounded-[5px] rather than the
// window's xl: these are small controls inside a screen, and they follow the
// radius the mock's own rows and chips use, not the frame's.
const BAR_BUTTON = `flex size-[26px] shrink-0 items-center justify-center rounded-[5px] border ${LINE}`;

function MobileAppBar({
  app,
  className = "",
}: {
  app: string;
  /**
   * The bleed, which belongs to the CALLER.
   *
   * A toolbar inset from the screen's edges reads as another panel, so it has
   * to run the full width — but how far it has to pull out depends on the
   * padding of whatever is holding it, and the two screens using this differ.
   * The onboarding board sits in a p-2.5 grid and cancels that; the intake
   * form's column has no padding of its own and needs nothing.
   */
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 border-b px-2.5 py-2 sm:hidden ${LINE} ${className}`}
    >
      <span className={`${BAR_BUTTON} text-[color:var(--mock-ink)]`}>
        <IconHamburger className="size-[13px]" />
      </span>
      {/* The app name on the switcher's own quiet fill, so it reads as the
          control it is rather than as a title that happens to sit there. */}
      <span className="flex min-w-0 items-center gap-1 rounded-[5px] bg-[var(--mock-well)] px-2 py-[5px]">
        {/* 13px, the size this file sets a panel title at — the bar names
            the screen, so it belongs on that step and not a smaller one. */}
        <span className="truncate text-[13px] leading-none text-[color:var(--mock-ink)]">
          {app}
        </span>
        <IconChevronDown className="size-[11px] shrink-0 text-[color:var(--mock-ink-soft)]" />
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <span className={`${BAR_BUTTON} text-[color:var(--mock-ink-soft)]`}>
          <IconEllipsis className="size-[13px]" />
        </span>
        {/* The one filled control, the way a primary action is drawn
            everywhere else in these mocks. */}
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
          <IconPlus className="size-[12px]" />
        </span>
      </span>
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
      <MobileAppBar app="Client onboarding" className="-mx-2.5 -mt-2.5" />

      {/* Where this client is up to. */}
      <Panel title="Client onboarding" hideTitleOnPhone tinted>
        <p className="mt-2 text-[13px] leading-none text-[color:var(--mock-ink)]">
          Engagement letter
        </p>
        {/* One segment per step, on the SAME GRID as the step names.

            This was four segments once before and was replaced by a single
            continuous track, because those segments were drawn in four
            different greys (black, 45% black, and two at the muted tone) on
            their own measure, which at 3px with gaps between them read as a
            row of loading placeholders rather than as a measure of anything.

            The fault was not that it was segmented — it was that the segments
            answered to nothing. grid-cols-4 gap-1.5 here is the identical grid
            the names use below, so every bar is literally its own step's
            width, sitting directly over the word it belongs to. Read down from
            a bar and you land on its name; read up from a name and you see
            whether it is done. A continuous track cannot do that: it shows how
            far along the client is as a fraction, but not which of the four
            named things that fraction is standing on, and a wizard's whole
            subject is the named things.

            TWO tones, not four. Done and current are filled; not-yet is ink
            at 12%. The old version's four greys implied four states on a
            control that has two, which is most of why it looked broken — and
            the current step is already called out in the line above and in the
            names below, so the bar does not need a third tone to say it a
            third time.

            The bars stay NEUTRAL. They were put on the Haze ramp once and taken
            back off: colour on the track makes the progress bar the loudest
            thing on the board, and the tint this picture wanted belongs to the
            panel behind it, where it reads as the surface being tinted rather
            than as the data being coloured.

            The empty tone is INK AT 12%, not bg-muted. Segmented, the unfilled
            bars are carrying something the continuous track never asked them
            to: they are the only thing saying there are four steps at all, so
            they have to be visible rather than merely present. bg-muted is
            #f6f7f9 against a #fcfcfd panel — six points apart, which rendered
            as a bar that stopped halfway and nothing after it. A percentage of
            the ink token resolves against whichever theme is up, so one value
            holds in both instead of a light hex and a dark override that can
            drift apart. */}
        <div className="mt-3">
          <div className="grid grid-cols-4 gap-1.5">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`h-1 rounded-full ${
                  i <= 1 ? "bg-foreground" : "bg-[var(--mock-ink)]/12"
                }`}
              />
            ))}
          </div>
          {/* The NAMES are hidden on a phone, not the bars. At four across a
              300px screen every name truncated to a stub, and a row of stubs
              reads as damage. The bars survive that width intact — four of
              them, two filled, is still legible at 60px apiece — and
              "Engagement letter" above names the step the client is on, which
              is the one name that matters while they are in it. */}
          <div className="mt-2 hidden grid-cols-4 gap-1.5 sm:grid">
            {STEPS.map((s, i) => (
              <span
                key={s}
                className={`truncate text-[8.5px] leading-none ${
                  i <= 1
                    ? "text-[color:var(--mock-ink)]"
                    : "text-[color:var(--mock-ink-soft)]"
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
        <p className="mt-2 text-[20px] leading-none text-[color:var(--mock-ink)]">
          2 of 4
        </p>
        <span className={`mt-2.5 inline-flex ${POSITIVE_QUIET}`}>Saved</span>
      </Panel>

      {/* Cropped by the card edge. */}
      <Panel title="Secure data room">
        {/* No leading file icon. Three identical glyphs down the left of three
            rows is a column of the same mark repeated — it separates nothing,
            because every row is a file and the panel already says so. The
            names carry their own extensions, and dropping the icons gives the
            names the row's left edge, which is where the eye starts. */}
        <div className="mt-1">
          <Row
            label="Deed of trust.pdf"
            trailing={<span className={POSITIVE_QUIET}>Uploaded</span>}
          />
          <Row
            label="Proof of identity.pdf"
            trailing={<span className={POSITIVE_QUIET}>Uploaded</span>}
          />
          <Row
            label="Signed letter"
            trailing={<span className={WARNING_QUIET}>Awaiting</span>}
          />
        </div>
      </Panel>

      {/* Who can see this onboarding.
      
          It used to be the rule line and two grey bars. The bars were standing
          in for content nobody had decided on, which is the one thing a mock
          on a marketing page cannot afford: every other panel here shows a
          real screen, so a panel of placeholders reads as the product being
          unfinished rather than as the picture being cropped.
      
          Naming the people is the whole panel. "Client only" was the rule
          stated in words, and a claim about a set of people is answered by
          showing the set — so the panel lists them, which is the same move the
          Secure data room panel makes (a heading, then the actual files)
          rather than a sentence about what it contains.

          Built from the parts already in this file: Row for the lines, and the
          initials-on-a-tile avatar the portal bar and the build cards use. A
          new row shape here would have been a third way of drawing a person on
          one screen. */}
      <Panel title="Access" className="hidden sm:block">
        {/* No "Client only" line above the names any more. With the list in
            place it was the same fact twice — the rule, and then the set it
            resolves to — and the rule said it less precisely. The names are
            the stronger form of the claim, so the restatement goes. */}
        <div className="mt-2">
          {/* The role is the reason the person is in the list, so it sits where
              the file panel puts its status: at the end of the row, muted, as
              the answer to the name rather than as a second heading. Plain
              type and not a chip — these are not states, and a pill here would
              be the third chip shape on the board. */}
          {ACCESS.map(({ initials, name, role }) => (
            <Row
              key={name}
              lead={<Initials>{initials}</Initials>}
              label={name}
              trailing={
                <span className="shrink-0 text-[9px] leading-none text-[color:var(--mock-ink-soft)]">
                  {role}
                </span>
              }
            />
          ))}
        </div>
      </Panel>
    </div>
  );
}
