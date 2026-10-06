import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconChevronDown,
  IconDocuments,
  IconFile,
  IconForm,
  IconHouse,
} from "@/components/home/mock-icons";

// ─────────────────────────────────────────────────────────────────────────
// THE CLIENT'S BRANDED HOME — the picture behind "your clients already have a
// branded home, new apps land in it".
//
// It was the team's dashboard: a nav of CRM, Team, Notifications and Customize
// beside a time-tracking table of six clients' entries. Everything in it was
// something only the firm sees, on a card claiming the client's side — and the
// table was the busiest thing in the whole section, which put the weight on a
// screen that is not the argument.
//
// So: the client's own nav, in the firm's colour, with the apps the firm has
// added listed under the stock rows and the newest one open. The right-hand
// side is deliberately quiet — the app's name and three fields — because what
// is being shown is WHERE the app lands, not what it does.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";

/** The rows every client portal has, before the firm adds anything. */
const STOCK = [
  { icon: <IconHouse />, label: "Home" },
  { icon: <IconChat />, label: "Messages" },
  { icon: <IconFile />, label: "Files" },
  { icon: <IconCard />, label: "Billing" },
];

/** What this firm has built. The last one is open. */
const ADDED = [
  { icon: <IconForm />, label: "Partner intake" },
  { icon: <IconDocuments />, label: "Year-end docs" },
];

export type PortalApp = { icon: React.ReactNode; label: string };

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
      className={`flex items-center gap-2 rounded-[5px] px-2 py-[6px] text-[12px] leading-none ${
        active ? "bg-white/15 text-white" : "text-white/70"
      }`}
    >
      <span className="flex shrink-0 items-center [&>svg]:size-[12px]">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </span>
  );
}

export function BrandedPortalVisual({
  brand = "Brandmages",
  apps = ADDED,
  title = "Year-end docs",
  children,
}: {
  brand?: string;
  /** The firm's own apps, under the stock rows. The last one is open. */
  apps?: PortalApp[];
  /** The open app's name, in its header. */
  title?: string;
  /** The open app's screen. Defaults to the document checklist below. */
  children?: React.ReactNode;
} = {}) {
  return (
    <div
      aria-hidden
      className={`flex h-full select-none overflow-hidden rounded-xl border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`}
    >
      {/* The firm's colour, not ours. --mock-brand is the one token that holds
          its value across both themes, because it stands for the client's own
          brand slab rather than for our chrome. */}
      <div className="flex w-[160px] shrink-0 flex-col gap-[2px] bg-[var(--mock-brand)] px-2.5 py-3">
        <span className="flex items-center gap-2 px-2 pb-3">
          <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-white text-black">
            <IconBrandMark className="size-[10px]" />
          </span>
          <span className="truncate text-[12.5px] leading-none text-white">
            {brand}
          </span>
          <IconChevronDown className="size-[10px] shrink-0 text-white/50" />
        </span>

        {STOCK.map(({ icon, label }) => (
          <NavRow key={label} icon={icon} label={label} />
        ))}

        {/* The group heading is what makes the claim legible: these rows are
            not stock, they are what this firm had built. */}
        <span className="px-2 pb-1.5 pt-4 text-[10.5px] uppercase tracking-wide text-white/40">
          Apps
        </span>
        {apps.map(({ icon, label }, i) => (
          <NavRow
            key={label}
            icon={icon}
            label={label}
            active={i === apps.length - 1}
          />
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className={`border-b px-5 py-3.5 ${LINE}`}>
          <span className="text-[14px] leading-none text-[color:var(--mock-ink)]">
            {title}
          </span>
        </div>
        {/* The default is three fields and nothing else. The app's content is
            not the claim on /ai-app-builder — what is being shown is WHERE the
            app lands — and anything busier pulls the eye off the nav beside
            it. A caller that IS about the app passes its own screen. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-5 py-4">
          {children ??
            ["Last year's return", "Bank statements", "Signed engagement letter"].map(
              (label) => (
                <div key={label}>
                  <p className="text-[11px] leading-none text-[color:var(--mock-ink-soft)]">
                    {label}
                  </p>
                  <div
                    className={`mt-1.5 rounded-md border px-3 py-2 text-[12.5px] leading-none text-[color:var(--mock-ink-soft)] ${LINE}`}
                  >
                    Upload
                  </div>
                </div>
              ),
            )}
        </div>
      </div>
    </div>
  );
}
