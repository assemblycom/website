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
  IconCheck,
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

function IconUpload({ className }: { className?: string }) {
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
function PortalSidebar({ app }: { app: string }) {
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
function AppHeader({
  title,
  meta,
}: {
  title: string;
  meta?: React.ReactNode;
}) {
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
            <span className="rounded-md bg-foreground px-2.5 py-[6px] text-[10px] leading-none text-background">
              Approve
            </span>
            <span
              className={`rounded-md border px-2.5 py-[6px] text-[10px] leading-none text-muted-foreground ${LINE}`}
            >
              Request changes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. Consultants — a diagram, no chrome ─────────────────────────────────
// Progress is a shape, not a screen. Drawn straight onto the card the way the
// reference draws its globe, so one card in the set is artwork rather than a
// window.
const MILESTONES = [
  { label: "Discovery", done: true },
  { label: "Model review", done: true },
  { label: "Pilot", done: false },
  { label: "Handover", done: false },
];

export function ProgressMock() {
  // 62% of a circle, drawn from the top.
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div
      aria-hidden
      className="pointer-events-none flex h-full select-none flex-col items-center justify-center gap-5 px-6 pb-2"
    >
      <div className="relative">
        <svg viewBox="0 0 128 128" className="size-[132px]">
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth="7"
          />
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${c * 0.62} ${c}`}
            transform="rotate(-90 64 64)"
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-[26px] leading-none text-foreground">62%</span>
          <span className="text-[9px] leading-none text-muted-foreground">
            complete
          </span>
        </span>
      </div>

      <div className="flex w-full max-w-[188px] flex-col gap-2">
        {MILESTONES.map((m) => (
          <span key={m.label} className="flex items-center gap-2">
            <span
              className={`flex size-[13px] shrink-0 items-center justify-center rounded-full ${
                m.done
                  ? "bg-foreground text-background"
                  : `border ${LINE}`
              }`}
            >
              {m.done ? <IconCheck className="size-[7px]" /> : null}
            </span>
            <span
              className={`text-[10px] leading-none ${
                m.done ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {m.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── 3. Accounting — one panel, floating ───────────────────────────────────
// A checklist is small enough to show whole, so this card shows the app on its
// own rather than cropping a portal around it.
export function DocumentsMock() {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden rounded-xl border shadow-[0_1px_2px_rgba(16,24,40,0.04),0_14px_34px_-24px_rgba(16,24,40,0.3)] ${PANEL} [[data-theme=dark]_&]:shadow-[0_16px_38px_-24px_rgba(0,0,0,0.6)]`}
    >
      <AppHeader
        title="2025 year-end"
        meta={
          <span className="shrink-0 text-[10px] leading-none text-muted-foreground">
            8 of 12
          </span>
        }
      />
      <div className="px-4 py-3.5">
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted [[data-theme=dark]_&]:bg-white/[0.08]">
          <span className="block h-full w-2/3 rounded-full bg-foreground" />
        </div>
        <div className="mt-1">
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
                className={`flex items-center gap-1 rounded-md border px-2 py-[5px] text-[9px] leading-none text-foreground ${LINE}`}
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
      className="pointer-events-none grid h-full select-none grid-cols-[1.55fr_1fr] content-start gap-2.5 bg-black/[0.035] p-2.5 [[data-theme=dark]_&]:bg-black/20"
    >
      {/* Where this client is up to. */}
      <Panel title="Client onboarding">
        <p className="mt-2 text-[13px] leading-none text-foreground">
          Engagement letter
        </p>
        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span key={s} className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span
                className={`h-[3px] rounded-full ${
                  i === 0
                    ? "bg-foreground"
                    : i === 1
                      ? "bg-foreground/45"
                      : "bg-muted [[data-theme=dark]_&]:bg-white/[0.08]"
                }`}
              />
              <span
                className={`truncate text-[8.5px] leading-none ${
                  i <= 1 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
            </span>
          ))}
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

      <Panel title="Access">
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
