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

// The lifted ground, for the ONE panel that gets it.
//
// --mock-well-2, not a hue. A blue wash was tried and dropped: colour here
// reads as a status — the panel meaning something — when all it has to do is
// be the panel you look at first.
//
// It started on --mock-well, one rung down, and that was too close to the
// half-step the other three sit on to be worth the distinction. -2 is the top
// of the same neutral ladder and moves the right way in BOTH themes on its
// own: dark goes up (#292929 → #303030) because lifting a surface off black
// means more light, light goes down (#f7f8fa → #f2f3f6) because lifting a
// surface off white means less. One token name, two opposite directions,
// which is the whole reason to take the rung rather than brighten a value by
// hand and have to remember to darken the other theme to match.
// It also catches the light, like the frame around it.
//
// .mock-edge again — the hero's lit border, and now the board's outer frame's —
// with two overrides it needs and the frame does not:
//
//   --mock-edge-fill  so the ramp paints the BORDER but leaves the inside on
//                     --mock-well-2. Without it the class's default fill would
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
//
// DOUBLE OUTLINE, as two spread shadows rather than a second element: 3px of
// the board's own ground, then 1px of the hairline. DARK ONLY — on a light
// board --mock-window is #fcfcfd, so the ring laid a second hairline a few
// pixels outside the panel's own and read as the border drawn twice by
// mistake. In dark the gap is a real tone and the pair works. The first ring is what
// makes it double — without a gap in the board's colour the two lines would
// meet and read as one thick border, which is heavier than either and says
// nothing. With it, the card looks mounted on the board rather than cut out of
// it, and the step panel gains a second mark distinguishing it from the three
// plain ones without going brighter again.
//
// Same shape the hero composer and the build cards already use; only the gap
// colour differs, because those sit on --surface and this sits on the board's
// --mock-window. 4px total clears the board's 10px gutter and 10px padding, so
// the ring never meets a neighbour or the frame.
const PANEL_TINT = `mock-edge [--mock-edge-fill:var(--mock-well-2)] [--mock-edge-w:120%] [--mock-edge-h:150%] bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] [[data-theme=dark]_&]:shadow-[0_0_0_3px_var(--mock-window),0_0_0_4px_var(--mock-line)] ${LINE}`;

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

// ── 2b. Accounting — the collection, as the act of collecting ────────────
// A SECOND documents picture, for the tailor grid. DocumentsMock below is the
// portal screen and is what the hero carousel draws, so it is left alone; this
// one exists because beside the onboarding board the row-and-chip screen read
// as the same card twice.
//
// It was a headline figure over a column chart — uploads per week, climbing.
// The shape was fine and it said nothing the card's own heading did not: a
// count of documents received, drawn twice. What the card is selling is the
// COLLECTING — "a per-client checklist with upload tracking" — and the moment
// that describes is a client putting a file in, which a bar chart of last
// month's totals is the one picture that cannot show.
//
// So it is the drop target, and only that — a well with its own ground, which
// reads as somewhere to put something without a glyph to announce it.
//
// The border is SOLID. It was dashed, which is the convention for a drop zone
// and the reason it went in; but this card already sits inside a dashed-free
// set, and at mock scale a dashed hairline on a filled panel reads as a dotted
// seam rather than as an invitation. The fill is what says "put it here"; the
// edge only has to close the shape. The
// arrow that sat above the copy was the third thing in a box that says "drop
// files to upload" in words directly underneath.
//
// Two upload rows sat under it for a while, a landed file and one still going,
// on the reasoning that "tracking" was half the sentence. They made the card
// busy in the wrong way: a dropzone with a list beneath it is a file manager,
// and the thing worth showing here is the invitation, not the log. The well
// gets the whole card instead, which is also how it reads at a glance from
// across the grid.
export function DocumentsStatsMock() {
  return (
    <div
      aria-hidden
      // No h-full. The card stretched to whatever the grid row gave it, which is
      // set by the taller cards beside it — so shortening the well just moved
      // the empty space below it and left a white box trailing under the drop
      // target. Sized to its contents, the card ends where the well ends.
      className={`pointer-events-none flex select-none flex-col gap-3 rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] p-4 ${LINE}`}
    >
      <p className="text-[11.5px] leading-none text-[color:var(--mock-ink-soft)]">
        Year-end documents
      </p>

      {/* The well. Dashed because that is what a drop target has looked like
          for fifteen years, and flex-1 so it takes the height the columns used
          to — a dropzone that is not the biggest thing on the card reads as a
          field in a form rather than as somewhere to put something. */}
      <div
        // No flex-1. It used to take whatever height the card had left, and on
        // a card sized for a column chart that was most of it — a drop target
        // tall enough to lose its own label in the middle of. A well is read by
        // its shape, not its area, so it gets a height of its own and the card
        // closes up around it.
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border bg-[var(--mock-well)] px-4 py-10 text-center ${LINE}`}
      >
        <span className="text-[11.5px] leading-none text-[color:var(--mock-ink)]">
          Drop files to upload
        </span>
        <span className="text-[10px] leading-none text-[color:var(--mock-ink-soft)]">
          PDF, XLSX or CSV, up to 25 MB
        </span>
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

// Ticks per step in the progress meter.
//
// Fourteen across a ~73px step, with a 2px gap: the marks come out about 3.3px,
// so each stays a mark rather than a hairline, and the space between them is
// narrower than the mark itself. At twelve-on-3px the gap matched the mark and
// the run read as a row of separate blocks; a meter wants to read as one object
// made of divisions, which means the marks have to sit closer together than
// they are wide.
const TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// Three people, not five. The list is the proof that the access rule resolves
// to somebody, and three names carry that as well as ten — while the panel is
// 216px wide, so a longer list would be showing its own scrollbar rather than
// its contents.
//
// Three rather than two because the row above lost its "Saved" pill and got
// shorter; the panels below take that height back, so the board keeps its
// proportions instead of ending on a band of empty ground.
//
// The client first, then the firm: the client is the subject of the screen,
// and a list that opened on the firm would be saying who is working on them
// rather than who can see it.
const ACCESS = [
  { initials: "MR", name: "Marta Reyes", role: "Client" },
  { initials: "JO", name: "James Okafor", role: "Partner" },
  { initials: "PS", name: "Priya Shah", role: "Associate" },
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
   * For a panel whose title is the same words as the phone bar above it — the
   * bar names the screen at that width, so the panel repeating it puts the
   * same phrase twice in forty pixels. From sm the bar is gone and the label is
   * the only thing naming the panel, so it comes back.
   *
   * Nothing passes it at present: the step panel did, back when it was titled
   * "Client onboarding" like the bar. It is kept because the clash it solves is
   * a property of the layout, not of that one title — any panel renamed to the
   * app's own name runs into it again.
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
   * The intake form's column has no padding of its own and needs nothing. The
   * onboarding board used to pass -mx-2.5 -mt-2.5 to cancel its grid's padding;
   * the bar now sits above that grid rather than inside it, so there is nothing
   * left to cancel.
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
      // WIDER THAN ITS FRAME from sm, so the right-hand column runs off the
      // card's edge the way the project tracker's lane does. The frame around
      // this already bleeds right and clips, so the only effect is that the
      // panels are drawn at the size they were designed for instead of being
      // squeezed into the ~583px the card happens to have — the same trade the
      // board already makes by cropping its bottom row.
      className="pointer-events-none flex h-full select-none flex-col bg-[var(--mock-window)] text-[color:var(--mock-ink)] sm:w-[660px] sm:shrink-0"
    >
      <MobileAppBar app="Client onboarding" />
      {/* The same bar the approvals screen carries, for the same reason.

          This was the one card in the set that opened straight onto its
          content: four panels and no chrome above them, so where the approvals
          card plainly showed an app, this showed a board that could have come
          from anywhere. The set's argument is that these are all one portal,
          and a screen with no header is the one that does not make it.

          Crumb AND title, because this board is a record you are deep in — one
          client's onboarding — which is the case AppHeader's crumb exists for.
          The client named is the one the Access panel lists first, so the
          header and the panels describe the same engagement.

          Hidden below sm: MobileAppBar above is the bar at that width, and two
          headers stacked on a phone would make the chrome taller than the
          content it introduces. */}
      <div className="hidden sm:block">
        <AppHeader crumb="Client onboarding" title="Marta Reyes" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2.5 p-2.5 sm:grid-cols-[1.55fr_1fr]">
        {/* Where this client is up to. */}
        {/* "Onboarding progress", and nothing else above the meter.
      
          It was an eyebrow reading "Client onboarding" with "Engagement letter"
          set large underneath — the app's name, then the current step, stacked
          as a title and a subtitle. Two problems. The eyebrow repeated the
          phone bar directly above it and the board it sits on, so it named the
          app for the third time in one picture; and the big step name was the
          largest type on the board, which made the panel look like a document
          header when what it holds is a progress meter.

          The step name is not lost: it is in the labels under the meter, where
          the filled run already points at it. Saying it twice, once in 13px,
          was the heading competing with the thing it was heading. */}
        <Panel title="Onboarding progress" tinted>
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

            Each step is a RUN OF TICKS, not a solid bar — the meter shape from
            the reference, where a count is drawn as a row of thin marks rather
            than as a filled length.

            Drawn as TWELVE ELEMENTS per step, not as a mask over a solid bar.

            Two mask versions came first and both ended every run on a hairline.
            A fixed 3px-on-6px pitch was the obvious bug — a step is ~73px and
            73/6 is 12.17, so the twelfth tick was cut a sixth of the way
            through. Switching the tile to calc(100%/12) was meant to fix that
            by construction, and did not: the tile then measures 6.07px, the
            mask raster snaps each repeat to whole device pixels, and the error
            accumulates across twelve repeats until the last mark is clipped to
            a sliver. A proportion that divides evenly in CSS still has to land
            on a pixel grid.

            Flexbox has no remainder to leave behind. Each tick is a real
            element, so the browser distributes the fractional width across
            twelve of them and every one is drawn whole — the last tick is a
            tick, not whatever was left over. flex-1 keeps them even at any card
            width, which is what the mask was for.

            Equal mark and gap is what makes each tick legible as a unit. At
            2px-on-5px the marks were hairlines, and a row of hairlines reads as
            a dashed rule rather than as a count of something.

            7px tall. A tick has to be taller than it is wide to read as a tick;
            at the old 4px bar height the marks were square.

            GREEN for the done steps, from --mock-positive-fg. The meter reads
            as a count being filled in, and the thing being counted here is
            steps completed — the same thing the Uploaded pills report one row
            at a time, so it is the same green rather than a second one chosen
            for this spot. Full strength, not the quiet cut the pills use: the
            pills are four small marks repeated down a column where the colour
            accumulates, while this is one object that the panel is built
            around.

            Not-yet stays ink at 12% — neutral, because an unfinished step has
            no state worth colouring, and a second hue would make the track an
            argument between two of them.

            Ink at 12% specifically, not bg-muted: the unfilled ticks are the
            only thing saying there are four steps at all, so they have to be
            visible rather than merely present, and bg-muted is #f6f7f9 against
            a #fcfcfd panel — six points apart, which rendered as a track that
            stopped halfway and nothing after it. A percentage of the ink token
            resolves against whichever theme is up, so one value holds in both
            instead of a light hex and a dark override that can drift apart. */}
          <div className="mt-3">
            <div className="grid grid-cols-4 gap-1.5">
              {STEPS.map((s, i) => (
                <span key={s} className="flex gap-[2px]">
                  {TICKS.map((j) => (
                    <span
                      key={j}
                      className={`h-[7px] flex-1 rounded-[1px] ${
                        i <= 1
                          ? "bg-[var(--mock-positive-fg)]"
                          : "bg-[var(--mock-ink)]/12"
                      }`}
                    />
                  ))}
                </span>
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

        {/* Just the count now.

          The "Saved" pill under it was the tallest thing in the top row, and
          because grid items stretch, it was setting the height of the step
          panel beside it — which is how that panel ended up with a band of
          empty ground under its meter. The pill was the least of the four
          things on the board and it was dictating the geometry of the most
          important one.

          Nothing is lost by dropping it: the meter next door shows two steps
          done, which is the same claim — progress is being kept — made by the
          thing the panel is actually about. */}
        <Panel title="Progress">
          <p className="mt-2 text-[20px] leading-none text-[color:var(--mock-ink)]">
            2 of 4
          </p>
        </Panel>

        {/* Cropped by the card edge. */}
        <Panel title="Secure data room">
          {/* The files sit in a RULED BOX — a table, not a loose list.

            Three rows divided by hairlines and nothing else were three lines of
            text that happened to have rules between them; the rules read as
            separators in the panel rather than as the structure of a thing with
            rows. An outline closes it: the first row has a top, the last has a
            bottom, and the dividers become interior rules of one object instead
            of three floating ones.

            It also gives the status pills a right edge to sit against, which is
            what makes a column look like a column.

            The padding goes on the ROWS, not this box, via [&>span]:px-2.5 —
            Row's divider is a bottom border on the row itself, so padding the
            container would have inset the rules along with the text and left
            the box's own edges orphaned from them. On the rows, the text insets
            and the rules still run the full width, wall to wall, the way a
            table's do.

            No leading file icon, from an earlier pass and still right: three
            identical glyphs down the left of three rows separate nothing, since
            every row is a file and the panel says so. The names carry their own
            extensions, and without the icons the names start at the column's
            edge, which is where the eye starts. */}
          <div
            className={`mt-2 overflow-hidden rounded-[6px] border [&>span]:px-2.5 ${LINE}`}
          >
            <Row
              label="Deed of trust.pdf"
              trailing={<span className={POSITIVE_QUIET}>Uploaded</span>}
            />
            <Row
              label="Proof of identity.pdf"
              trailing={<span className={POSITIVE_QUIET}>Uploaded</span>}
            />
            <Row
              label="Source of funds.pdf"
              trailing={<span className={POSITIVE_QUIET}>Uploaded</span>}
            />
            {/* The outstanding one stays LAST. The list is read top to bottom and
              the thing still wanted is the thing to end on; sorted any other
              way the panel closes on something already done. */}
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
          {/* Ruled like the data room's files, and for the same reason: three
            rows divided by hairlines and nothing else are three lines of text
            that happen to have rules between them. The outline closes it, so
            the dividers become interior rules of one object and the roles on
            the right get an edge to sit against.

            Identical classes to that panel's box, down to the 6px radius and
            the [&>span]:px-2.5 that pads the rows rather than the container —
            two lists on one board drawn two ways would be the inconsistency
            this file keeps arguing against. */}
          <div
            className={`mt-2 overflow-hidden rounded-[6px] border [&>span]:px-2.5 ${LINE}`}
          >
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
    </div>
  );
}
