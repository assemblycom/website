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
import { fadeMask } from "@/components/ui/fade-mask";

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

// ── The mock type scale ──────────────────────────────────────────────────
// Four steps, and screens in this set use ONLY these:
//
//   10.5px  the primary line — a row's name, a tab, a title in a header
//   10px    a panel or section label, and the text inside a control
//   9.5px   the secondary line — a sub, a role, a timestamp, a caption
//   9px     a status chip, which is the one thing allowed to be smaller
//           because its shape already separates it from the line it sits on
//
// Two things go off it deliberately: a headline figure (the board's "2 of 4"),
// and the initials on an avatar tile, which is a glyph rather than type.
//
// It is written down because the cards sit side by side on one page and the
// eye compares them. The upload card drifted to 11.5px and the onboarding
// board's subs to 9px, and the result was a grid where some screens looked
// zoomed in and others out — which reads as the screens being different sizes
// rather than as different screens.
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
// The lift is DARK ONLY now. In dark the panel stands a rung above its three
// neighbours on --mock-well-2; in light it sits on --mock-well-soft, the same
// ground they use, so nothing marks it out there.
//
// Why light gives it up: lifting a surface off white means going DARKER, and
// --mock-well-2 is #f2f3f6 against a near-white board — a grey panel among
// three pale ones, which reads as that panel being disabled or sunken rather
// than brought forward. The move that means "forward" on black means "back" on
// white, and there is no value that says forward in both. Dark keeps it,
// because there the rung does read as a lift (#292929 → #303030).
//
// So in light the step panel is distinguished by nothing at all, which is the
// honest outcome: the meter inside it is already the loudest thing on the
// board, and on a white ground that is enough.
//
// Not a hue either way. A blue wash was tried and dropped — colour here reads
// as a status, the panel meaning something, when all it has to do is be the
// panel you look at first.
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
const PANEL_TINT = `mock-edge [--mock-edge-fill:var(--mock-well-2)] [--mock-edge-w:120%] [--mock-edge-h:150%] bg-[var(--mock-well-soft)] [[data-theme=dark]_&]:bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] [[data-theme=dark]_&]:shadow-[0_0_0_3px_var(--mock-window),0_0_0_4px_var(--mock-line)] ${LINE}`;

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
        icon={<IconGlobe className="size-[13px]" />}
        label="Home"
        branded={branded}
      />
      <NavRow
        icon={<IconChat className="size-[13px]" />}
        label="Messages"
        branded={branded}
      />
      <NavRow
        icon={<IconFile className="size-[13px]" />}
        label="Files"
        branded={branded}
      />
      {/* With no app of its own, the stock nav's last row carries the
          selection — otherwise the sidebar has nothing open. */}
      <NavRow
        icon={<IconCard className="size-[13px]" />}
        label="Billing"
        active={!app}
        branded={branded}
      />
      {app ? (
        <NavRow
          icon={<IconDocuments className="size-[13px]" />}
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
          <span className="truncate text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
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

// ── 2b. Accounting — the collection, as what came back ───────────────────
// A SECOND documents picture, for the tailor grid. DocumentsMock below is the
// portal screen and is what the hero carousel draws, so it is left alone; this
// one exists because beside the onboarding board the row-and-chip screen read
// as the same card twice.
//
// Its third form. It was a headline figure over a column chart — uploads per
// week, climbing — which said nothing the card's heading did not. Then it was
// the drop target alone, on the argument that the card sells the COLLECTING
// and the moment that describes is a client putting a file in.
//
// That was half the sentence. "A per-client checklist with upload tracking" is
// a list of things asked for and what came back against each, and an empty
// drop well shows neither: it is the same invitation whoever the client is and
// whatever they owe, so the one card in the set that could show a per-client
// state showed a blank. Three answered questions is the picture — the document
// asked for, the file that arrived, and when — which is also the form the
// product renders a completed upload field in.
//
// NAMED THE WAY THIS SET NAMES THINGS. They were real-looking filenames —
// "FY2026-engagement-letter-signed.pdf", "FY2025-form-1120.pdf" — and they
// were wrong twice over. They are the longest strings on the board, so three
// of them in a narrow card is a column of hyphenated machine text; and no
// other screen in the set talks like that. The approvals window names its
// subject "Spring catalogue covers" and its plates "Cover A" and "Cover B",
// which is how a person refers to the thing, and the stamp beside it is
// "Shared Jul 30" rather than a full timestamp. These follow it: the document
// the slot asked for, and the day it landed.
//
// NO FILE GLYPH on the rows. The product draws one and it is right there,
// where a row is one of many in a scrolling list and the icon is the column
// that says what kind of thing each row is. Here there are three rows, every
// one is a file, each is labelled with the document it answers, and the names
// carry their own extensions — so the glyph would be the same mark three times
// saying what three labels already say.
const SUBMITTED = [
  { file: "Engagement letter.pdf", at: "Submitted Jun 17" },
  { file: "Trial balance.pdf", at: "Submitted Jun 19" },
  { file: "Prior-year return.pdf", at: "Submitted Jun 21" },
  // THE FOURTH IS THE ONE THAT FADES. Three rows ending cleanly said the
  // checklist had three things on it; a fourth going under says there are
  // more, which is what "a per-client checklist" is claiming. It carries real
  // content rather than being a blank strip, because the fade has to look like
  // the picture continuing, not like a row that failed to load.
  { file: "Bank statements.pdf", at: "Submitted Jun 23" },
];

/**
 * The file-type mark, from the product's own icon file — a page outline with
 * the extension lettered into its foot.
 *
 * Two things changed on the way in. The source paints `fill="black"`, which is
 * a hardcoded themed colour and would sit as a black mark on a near-black
 * panel in dark; it reads `currentColor` here so the tile's own token carries
 * it. And the source clips to a 22.5x20 rect while the lettering runs to
 * y=21.4, so the bottom of "PDF" was cut off — the viewBox is opened to clear
 * the glyph and the clip dropped.
 */
function IconFilePdf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23.5 21.5" className={className} aria-hidden>
      <path d="M8.125 1.875H3.75C3.40625 1.875 3.125 2.15625 3.125 2.5V17.5C3.125 17.8438 3.40625 18.125 3.75 18.125H6.875V20H3.75C2.37109 20 1.25 18.8789 1.25 17.5V2.5C1.25 1.12109 2.37109 0 3.75 0H8.96484C9.62891 0 10.2656 0.261719 10.7344 0.730469L15.5195 5.51953C15.9883 5.98828 16.25 6.625 16.25 7.28906V13.1289H14.375V8.12891H10.9375C9.38281 8.12891 8.125 6.87109 8.125 5.31641V1.87891V1.875ZM13.5977 6.25L10 2.65234V5.3125C10 5.83203 10.418 6.25 10.9375 6.25H13.5977ZM9.375 14.8438H10.625C11.918 14.8438 12.9688 15.8945 12.9688 17.1875C12.9688 18.4805 11.918 19.5312 10.625 19.5312H10.1562V20.625C10.1562 21.0547 9.80469 21.4062 9.375 21.4062C8.94531 21.4062 8.59375 21.0547 8.59375 20.625V15.625C8.59375 15.1953 8.94531 14.8438 9.375 14.8438ZM10.625 17.9688C11.0547 17.9688 11.4062 17.6172 11.4062 17.1875C11.4062 16.7578 11.0547 16.4062 10.625 16.4062H10.1562V17.9688H10.625ZM14.375 14.8438H15.625C16.7461 14.8438 17.6562 15.7539 17.6562 16.875V19.375C17.6562 20.4961 16.7461 21.4062 15.625 21.4062H14.375C13.9453 21.4062 13.5938 21.0547 13.5938 20.625V15.625C13.5938 15.1953 13.9453 14.8438 14.375 14.8438ZM15.625 19.8438C15.8828 19.8438 16.0938 19.6328 16.0938 19.375V16.875C16.0938 16.6172 15.8828 16.4062 15.625 16.4062H15.1562V19.8438H15.625ZM18.5938 15.625C18.5938 15.1953 18.9453 14.8438 19.375 14.8438H21.25C21.6797 14.8438 22.0312 15.1953 22.0312 15.625C22.0312 16.0547 21.6797 16.4062 21.25 16.4062H20.1562V17.3438H21.25C21.6797 17.3438 22.0312 17.6953 22.0312 18.125C22.0312 18.5547 21.6797 18.9062 21.25 18.9062H20.1562V20.625C20.1562 21.0547 19.8047 21.4062 19.375 21.4062C18.9453 21.4062 18.5938 21.0547 18.5938 20.625V15.625Z" fill="currentColor" />
    </svg>
  );
}

export function DocumentsStatsMock() {
  return (
    <div
      aria-hidden
      // NO WHITE PANEL AROUND THEM, and no title above them.
      //
      // The rows sat in a bordered window with a "Year-end documents" eyebrow,
      // the way the other mocks in this set are framed — and this is the one
      // card in the set that is artwork rather than a screen, like the Gantt
      // beside it. A frame around three rows made them look like a cropped
      // screenshot of a panel; without it they are three answered questions
      // sitting on the card, which is what the card is about. The card's own
      // heading already names them, so the eyebrow was saying it twice.
      //
      // The per-row labels go with it. "ENGAGEMENT LETTER" over
      // "FY2026-engagement-letter-signed.pdf" is the filename read twice, and
      // three of them turned a short list into a stack of six lines where
      // every other one was a heading.
      //
      // No h-full: sized to its contents, so the card ends where the last row
      // ends rather than trailing empty ground under it.
      // DRAWN LARGER THAN THE FRAMED MOCKS, on purpose.
      //
      // The other cards in this set are windows: their type is sized to look
      // right inside a screenshot, so 10.5px reads as an app's own UI seen at
      // a distance. This card has no frame — three rows sit directly on it —
      // so there is no screenshot for the eye to scale them against, and at
      // that size they read as small rather than as far away. A step up puts
      // them at the size the card itself is drawn at.
      className="pointer-events-none flex select-none flex-col gap-2"
      // THE LAST ROW DISSOLVES, and this is the edge a fade belongs on.
      //
      // The Gantt's right edge refused one: four saturated bars running into
      // the cut, so any ramp took the colour out of the artwork itself. These
      // are near-white rows on a pale card — barely any contrast to lose — so
      // the ramp reads as the list carrying on past the card rather than as
      // the rows going pale.
      //
      // Starting at 76 puts the whole of it inside the fourth row, so the
      // three above are untouched and the one that fades is a whole row doing
      // it. The number tracks the gap: four rows on a 8px gap put the last
      // one's top edge at ~77% of the stack, and a ramp that began above that
      // would take the bottom off the third row as well. The shared curve, as
      // everywhere else — see fade-mask.ts.
      style={{
        WebkitMaskImage: fadeMask("to bottom", 76),
        maskImage: fadeMask("to bottom", 76),
      }}
    >
      {SUBMITTED.map(({ file, at }) => (
        <div
          key={file}
          className={`flex items-center gap-3 rounded-lg border bg-[var(--mock-window)] px-3 py-2.5 ${LINE}`}
        >
          {/* FRAMED, not loose on the row.

            The mark on its own would be a glyph floating in the pill's left
            padding at whatever size its page outline happened to be. A tile
            gives it an edge to sit in and a fixed footprint, so three rows line
            their text up on one column whatever the extension is.

            The tile is the QUIET GROUND, not white: the pill it sits on is
            already the window colour, and a white tile on a white pill is a
            tile you cannot see. The reference inverts the same relationship —
            white mark on a grey row — so this keeps the figure and the ground
            a step apart, which is the part that matters, and does it in tokens
            so it holds in both themes. */}
          <span
            className={`flex size-[32px] shrink-0 items-center justify-center rounded-lg border bg-[var(--mock-well)] text-[color:var(--mock-ink)] ${LINE}`}
          >
            <IconFilePdf className="h-[16px] w-[17px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[5px]">
            <span className="truncate text-[11px] leading-none text-[color:var(--mock-ink)]">
              {file}
            </span>
            <span className="truncate text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
              {at}
            </span>
          </span>
        </div>
      ))}
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
// The STEP NAMES ARE THE FORM'S OWN. They were invented for this mock —
// "Engagement letter", "Documents" — which described a plausible wizard rather
// than the one the product ships. The response view names its steps Welcome,
// Your details, Goals and Review, so those are the four here; a marketing
// picture of a screen should be recognisable to somebody who has opened it.
const STEPS = ["Welcome", "Your details", "Goals", "Review"];

// Ticks per step in the progress meter.
//
// TWENTY-EIGHT, doubled from fourteen when the meter took the whole board.
// Fourteen was tuned for a step ~73px wide, where it gave marks of about 3.3px
// against a 2px gap — narrow enough to read as marks, close enough together to
// read as one run. Merged into the full-width panel a step is ~155px, and the
// same fourteen marks stretched to 9px apiece: wider than they are tall, which
// is a row of blocks rather than a meter.
//
// Doubling the count holds the PITCH rather than the number. The marks come
// back to ~3.6px on the same 2px gap, so the meter looks the same at twice the
// width — which is the property that matters, since this panel is the one on
// the board whose width moves with the card.
const TICKS = Array.from({ length: 28 }, (_, i) => i);

// The timestamps the response view carries under its meter: when the form was
// started, when it was last touched, and whether it has been reopened since.
//
// It was a list of three people with their roles, which was a reasonable panel
// and was not on the screen — the form response has no access list, it has a
// record of its own history. A board that shows the product's own fields is
// the point of the card.
//
// THREE rows, as before: the panel is ~216px wide, and the proportion the
// board was tuned to is three rows under the count beside it. "Completed" is
// the fourth field on the screen and is left out here on purpose — the meter
// next door shows two of four steps done, so a completion date would be the
// one thing on the board contradicting the rest of it.
//
// An em dash for Reopened, exactly as the screen draws an empty field: a blank
// cell would read as the mock having run out of content.
const ACTIVITY = [
  { label: "Started", value: "Aug 9, 2026" },
  { label: "Last activity", value: "Aug 11, 2026" },
  { label: "Reopened", value: "\u2014" },
];

// The answers the client gave on the step the meter is standing on. Labels as
// the form asks them, values as they came back.
//
// THREE of them, the same count as the activity panel beside it: the fourth
// field on the screen is the company website, and a URL is the one value here
// long enough to crowd its own label at this width. Dropping it also squares
// the two boxes, so the lower row reads as one band rather than as two lists
// of different lengths.
const DETAILS = [
  { label: "Full name", value: "Renee Castillo" },
  { label: "Best email", value: "renee.castillo@magnacompany.com" },
  { label: "Phone number", value: "(585) 172-7456" },
];

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
// to a hamburger and the app named with the switcher's chevron beside it.
//
// NO ACTIONS ON THE RIGHT. An overflow menu and a filled plus sat there, as
// the product's own bar carries them. In a mock they are the two marks on the
// screen that do nothing and say nothing — a plus promises a thing you can
// add, which this picture never shows, and three dots stand for a menu nobody
// can open. What the bar is here for is to prove there is an app around the
// content; the hamburger and the app's name do that on their own, and on a
// ~300px bar the pair also crowded the one element that carries the point. sm:hidden, because from sm the two-column
// layout already reads as a desktop screen and a phone bar on top of it would
// be two different devices in one picture.
function IconHamburger({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M4.5 6.5h11M4.5 10h11M4.5 13.5h11" {...STROKE} />
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
      // A MINIMUM width from sm, not a fixed one, so the right-hand column
      // runs off the card's edge the way the project tracker's lane does.
      //
      // It was w-[660px] and that was wrong in the other direction: on a frame
      // wider than 660 the board stopped at 660 and left a band of empty card
      // to its right, which is the opposite of cropping. w-full with a 660
      // floor fills whatever the frame gives it and overflows when the frame
      // is narrower than the panels need — crops when it should, fills when it
      // can. The frame around
      // this already bleeds right and clips, so the only effect is that the
      // panels are drawn at the size they were designed for instead of being
      // squeezed into the ~583px the card happens to have — the same trade the
      // board already makes by cropping its bottom row.
      className="pointer-events-none flex h-full select-none flex-col bg-[var(--mock-window)] text-[color:var(--mock-ink)] sm:w-full sm:min-w-[660px] sm:shrink-0"
    >
      <MobileAppBar app="Onboarding Form" />
      {/* The same bar the approvals screen carries, for the same reason.

          This was the one card in the set that opened straight onto its
          content: four panels and no chrome above them, so where the approvals
          card plainly showed an app, this showed a board that could have come
          from anywhere. The set's argument is that these are all one portal,
          and a screen with no header is the one that does not make it.

          Crumb AND title, because this board is a record you are deep in — one
          client's onboarding — which is the case AppHeader's crumb exists for.
          The trail names where the form lives, not the record — the panel
          directly under it opens on "Magna Company", so a header carrying the
          company too would be the same name twice in forty pixels. Chrome
          says which form; the record says whose.

          Hidden below sm: MobileAppBar above is the bar at that width, and two
          headers stacked on a phone would make the chrome taller than the
          content it introduces. */}
      <div className="hidden sm:block">
        <AppHeader crumb="Forms" title="Onboarding Form" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 content-start gap-2.5 p-2.5 sm:grid-cols-[1.55fr_1fr]">
        {/* ONE PANEL ACROSS THE TOP, the record's header with its meter under
          it — the shape the response view itself has.

          It was two: a meter panel and a "Steps completed — 2 of 4" panel
          beside it. The count was the weaker of the pair by a long way. It
          restated what the meter directly to its left already showed, and it
          cost a full grid column to do it, which is why the meter — the thing
          the board is built around — was drawn at two thirds of the width it
          wanted. Merged, the meter gets the whole board and the count goes
          under it as a line of text, which is where the screen puts it.

          What the second column bought instead is the HEADER: the company, the
          form's state, and the one action the record carries. That is what
          sits above the meter in the product, and it is what makes the picture
          a record of something rather than a progress bar on its own.

          The panel markup is written out rather than going through Panel,
          because Panel's contract is an eyebrow title and then content — and
          this one's heading is a company with an avatar, a chip and a button
          in the same row. Same classes as Panel otherwise, down to the radius
          and the p-3, so it sits in the board as one of its panels. */}
        <div
          className={`min-w-0 overflow-hidden rounded-lg border p-3 sm:col-span-2 ${PANEL_TINT}`}
        >
          <div className="flex items-center gap-2.5">
            {/* The company's tile. Ink at 10%, the value every other avatar in
              these mocks uses, and the initials nudged down half a cap height
              for the same reason the Gantt's are — flex centring lines up the
              text's box, which puts two capitals in its top half. */}
            <span className="flex size-[22px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--mock-ink)]/10 text-[9px] leading-none text-[color:var(--mock-ink-soft)]">
              <span className="block translate-y-[0.1em]">RC</span>
            </span>
            {/* THE CLIENT, and nothing under it.

              The company's name was here first, with the form's state and name
              beneath it as a subtitle. The subtitle went because both lines
              were already said elsewhere on the panel — the chip's state is
              what the meter three lines down is a picture of, and the form is
              named in the trail directly above. The company went because the
              record is one person's response: the name that belongs at the top
              of it is whoever filled it in, which is the name the details
              panel answers with. */}
            <span className="min-w-0 truncate text-[11px] leading-none text-[color:var(--mock-ink)]">
              Renee Castillo
            </span>
            {/* The action, held to the right the way the product holds it.
              Outlined rather than filled: it is the record's secondary move —
              take a copy away — and the board has no primary action on it to
              outrank. Hidden below sm, where the panel is ~300px and a button
              beside a company name would push the name to a stub. */}
            <span
              className={`ml-auto hidden shrink-0 items-center rounded-[5px] border px-2 py-[5px] text-[9.5px] leading-none text-[color:var(--mock-ink)] sm:flex ${LINE} bg-[var(--mock-window)]`}
            >
              Download PDF
            </span>
          </div>

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

        </div>

        {/* Cropped by the card edge. */}
        {/* The ANSWERS, which is what the response view is for.

          It was a secure data room — four filenames with Uploaded pills. A
          good-looking panel for a screen this app does not show here: the
          onboarding response is a form, and what a form holds is what the
          client typed. Showing files instead meant the one panel with room for
          real content was the one carrying invented content.

          Same ruled box as before, down to the 6px radius and the
          [&>span]:px-2.5 that pads the rows rather than the container, so the
          rules run wall to wall. Only what is in the rows has changed. */}
        <Panel title="Your details">
          <div
            className={`mt-2 overflow-hidden rounded-[6px] border [&>span]:px-2.5 ${LINE}`}
          >
            {/* The QUESTION on the left in ink, the ANSWER on the right in the
              soft tone. The screen stacks them the other way up — label above,
              answer below, the answer the louder of the two — which at this
              size would be eight lines of type in a four-row box. One line per
              field keeps the box the height the board was tuned to, and
              label-then-value across the row is the shape the panel beside it
              already uses, so the board reads as one screen rather than two. */}
            {DETAILS.map(({ label, value }) => (
              <Row
                key={label}
                label={label}
                trailing={
                  <span className="shrink-0 truncate text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
                    {value}
                  </span>
                }
              />
            ))}
          </div>
        </Panel>

        {/* When it was started, last touched and whether it was reopened — the
          stamps the response view sets under its meter.

          This was an Access panel listing three people and their roles. The
          names were well drawn and were not on this screen; what the product
          puts here is the form's own history, which is also the better
          companion to the meter above it: one panel says how far along, this
          one says since when.

          The initials tiles go with them. An avatar on a row of dates would be
          decoration, and the row is a field and its value — the same shape the
          details panel uses, which is the point. */}
        <Panel title="Activity" className="hidden sm:block">
          {/* Identical classes to the details box above it. Two lists on one
            board drawn two ways would be the inconsistency this file keeps
            arguing against. */}
          <div
            className={`mt-2 overflow-hidden rounded-[6px] border [&>span]:px-2.5 ${LINE}`}
          >
            {ACTIVITY.map(({ label, value }) => (
              <Row
                key={label}
                label={label}
                trailing={
                  <span className="shrink-0 text-[9.5px] leading-none text-[color:var(--mock-ink-soft)]">
                    {value}
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
