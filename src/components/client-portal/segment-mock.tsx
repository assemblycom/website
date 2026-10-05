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

import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconChevronDown,
  IconDocuments,
  IconFile,
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
const NEUTRAL = `${CHIP} bg-muted text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]`;

const LINE = "border-border [[data-theme=dark]_&]:border-[#383838]";
/** The white panel the app is drawn on, wherever a card shows one. */
const PANEL = `bg-background ${LINE}`;

function NavRow({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-md px-1.5 py-[5px] text-[10px] leading-none ${
        active
          ? "bg-background text-foreground [[data-theme=dark]_&]:bg-white/[0.08]"
          : "text-muted-foreground"
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
export function PortalSidebar({ app }: { app: string }) {
  return (
    <div
      className={`hidden w-[136px] shrink-0 flex-col gap-[2px] border-r bg-muted px-2 py-2.5 sm:flex ${LINE} [[data-theme=dark]_&]:bg-white/[0.04]`}
    >
      <span className="flex items-center gap-1.5 px-1.5 pb-2.5">
        <span className="flex size-[15px] items-center justify-center rounded-[3px] bg-foreground text-background">
          <IconBrandMark className="size-[8px]" />
        </span>
        <span className="truncate text-[10.5px] leading-none text-foreground">
          Brandmages
        </span>
        <IconChevronDown className="size-[9px] shrink-0 text-muted-foreground" />
      </span>
      <NavRow icon={<IconGlobe className="size-[11px]" />} label="Home" />
      <NavRow icon={<IconChat className="size-[11px]" />} label="Messages" />
      <NavRow icon={<IconFile className="size-[11px]" />} label="Files" />
      <NavRow icon={<IconCard className="size-[11px]" />} label="Billing" />
      <NavRow
        icon={<IconDocuments className="size-[11px]" />}
        label={app}
        active
      />
    </div>
  );
}

/** An app's title bar, with whatever state belongs beside the title. */
function AppHeader({ title, meta }: { title: string; meta?: React.ReactNode }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${LINE}`}
    >
      <span className="truncate text-[12px] leading-none text-foreground">
        {title}
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
        <span className="truncate text-[10.5px] leading-none text-foreground">
          {label}
        </span>
        {sub ? (
          <span className="truncate text-[9px] leading-none text-muted-foreground">
            {sub}
          </span>
        ) : null}
      </span>
      {trailing}
    </span>
  );
}

function Thumb() {
  return (
    <span className="size-[26px] shrink-0 rounded bg-muted [[data-theme=dark]_&]:bg-white/[0.08]" />
  );
}

// ── 1. Agencies — the whole portal, sidebar and all ───────────────────────
// The only card that shows the chrome. It is the section's first claim, that
// this is one portal, so it is the one that needs to show a portal.
export function ApprovalsMock() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none bg-background"
    >
      <PortalSidebar app="Approvals" />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          title="Spring campaign"
          meta={<span className={NEUTRAL}>Round 2</span>}
        />
        <div className="min-h-0 flex-1 px-4 py-3.5">
          {/* No status chips on this one: the row's state is carried by the
              Approve and Request changes buttons below, and three coloured
              tags in a card this size were the loudest thing on the page. */}
          <Row
            lead={<Thumb />}
            label="Launch film, cut 03"
            sub="Uploaded 2 days ago"
          />
          <Row
            lead={<Thumb />}
            label="Key art, variants A–C"
            sub="Uploaded yesterday"
          />
          <Row
            lead={<Thumb />}
            label="Social cutdowns"
            sub="Uploaded yesterday"
          />
          <div className="mt-3.5 flex items-center gap-2">
            <span className="rounded-[4px] bg-foreground px-2.5 py-[6px] text-[10px] leading-none text-background">
              Approve
            </span>
            <span
              className={`rounded-[4px] border px-2.5 py-[6px] text-[10px] leading-none text-muted-foreground ${LINE}`}
            >
              Request changes
            </span>
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
              <span className="truncate text-[13px] leading-none text-foreground">
                {client}
              </span>
              <span className="shrink-0 text-[13px] leading-none tabular-nums text-muted-foreground">
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
      className={`pointer-events-none flex h-full select-none flex-col gap-4 rounded-xl border bg-background p-4 ${LINE}`}
    >
      <div>
        <p className="text-[11.5px] leading-none text-muted-foreground">
          Documents received
        </p>
        <p className="mt-2 text-[24px] leading-none text-foreground">8 of 12</p>
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
                <span className="mb-1 text-center text-[10.5px] leading-none tabular-nums text-muted-foreground">
                  {n}
                </span>
              ) : null}
              <div
                className={`w-full rounded-[6px] ${
                  n === peak
                    ? "bg-foreground"
                    : "bg-foreground/[0.14] [[data-theme=dark]_&]:bg-white/[0.16]"
                }`}
                style={{ height: `${(n / peak) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 text-[10.5px] leading-none text-muted-foreground">
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
      className="pointer-events-none flex h-full select-none bg-background"
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
              <span className="text-[10px] leading-none text-muted-foreground">
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
                  className={`flex items-center gap-1 rounded-[4px] border px-2 py-[5px] text-[9px] leading-none text-foreground ${LINE}`}
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
      <p className="truncate text-[10px] leading-none text-muted-foreground">
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
      className="pointer-events-none grid h-full select-none grid-cols-1 content-start gap-2.5 bg-background p-2.5 sm:grid-cols-[1.55fr_1fr]"
    >
      {/* Where this client is up to. */}
      <Panel title="Client onboarding">
        <p className="mt-2 text-[13px] leading-none text-foreground">
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
                  i <= 1 ? "text-foreground" : "text-muted-foreground"
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
        <p className="mt-2 text-[20px] leading-none text-foreground">2 of 4</p>
        <span className={`mt-2.5 inline-flex ${POSITIVE}`}>Saved</span>
      </Panel>

      {/* Cropped by the card edge. */}
      <Panel title="Secure data room">
        <div className="mt-1">
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-muted-foreground" />
            }
            label="Deed of trust.pdf"
            trailing={<span className={POSITIVE}>Uploaded</span>}
          />
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-muted-foreground" />
            }
            label="Proof of identity.pdf"
            trailing={<span className={POSITIVE}>Uploaded</span>}
          />
          <Row
            lead={
              <IconFile className="size-[12px] shrink-0 text-muted-foreground" />
            }
            label="Signed letter"
            trailing={<span className={WARNING}>Awaiting</span>}
          />
        </div>
      </Panel>

      {/* Last in, first out: stacked, this one is below the crop anyway, and
          it carries the least — a line and two placeholder bars. */}
      <Panel title="Access" className="hidden sm:block">
        <div className="mt-2 flex items-center gap-1.5 text-[10px] leading-none text-foreground">
          <IconLock className="size-[11px] text-muted-foreground" />
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
