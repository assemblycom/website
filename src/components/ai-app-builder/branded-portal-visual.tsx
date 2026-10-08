import {
  IconBrandMark,
  IconCard,
  IconChat,
  IconDocuments,
  IconFile,
  IconHouse,
} from "@/components/home/mock-icons";
import {
  MOCK_PRIMARY,
  MOCK_SECONDARY,
  MOCK_TITLE,
} from "@/components/ui/mock-type";

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

/**
 * The same list without Billing, for a shot whose whole point is the ONE added
 * row sitting under the stock ones.
 *
 * Billing is a real portal row and belongs in the default — /solutions' agency
 * hero is a picture of a working portal and wants it. But on the branding
 * pillar the nav is the claim, and every stock row before the added one is a
 * row the eye passes on the way to the thing being demonstrated. Three is
 * enough to establish "this is a portal with the usual rows in it".
 */
export const PORTAL_STOCK_CORE = STOCK.slice(0, 3);

/**
 * What this firm has built. The last one is open.
 *
 * ONE app, not two. It was Partner intake above Year-end docs, which showed a
 * firm that has added a few — true, and not the claim. The claim is that a NEW
 * app lands here, and a list of two makes the reader work out which one is new
 * before the shot says anything. One row, open, is the new app.
 */
const ADDED = [{ icon: <IconDocuments />, label: "Year-end docs" }];

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
      // 4px, the same as the portal nav row in segment-mock. It was 5 here and
      // 6 there for no reason anyone recorded; one element, one radius.
      className={`flex items-center gap-2 rounded-[4px] px-2 py-[6px] ${MOCK_PRIMARY} ${
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
  stock = STOCK,
  apps = ADDED,
  title = "Year-end docs",
  children,
  quietPane = false,
  appHeader = true,
}: {
  brand?: string;
  /** The portal's built-in rows. PORTAL_STOCK_CORE drops Billing. */
  stock?: PortalApp[];
  /** The firm's own apps, under the stock rows. The last one is open. */
  apps?: PortalApp[];
  /** The open app's name, in its header. */
  title?: string;
  /** The open app's screen. Defaults to the document checklist below. */
  children?: React.ReactNode;
  /**
   * Knocks the app pane back so the branded nav carries the shot.
   *
   * For a frame where the NAV is the claim and the pane beside it is only
   * evidence that the nav is attached to a real screen — /ai-app-builder's
   * branding pillar. Opacity rather than a paler set of inks: it recedes the
   * pane by the same amount in both themes and cannot be the wrong colour in
   * either, where a hand-picked grey would have to be chosen twice.
   */
  quietPane?: boolean;
  /**
   * Draws the open app's own title bar above its screen. Off where the pane is
   * only evidence that the nav is attached to something: a titled bar is the
   * app announcing itself, which is a second heading inside a card that already
   * has one, and the hairline under it cut a line across the shot right where
   * the eye should have been travelling to the nav.
   */
  appHeader?: boolean;
} = {}) {
  return (
    <div
      aria-hidden
      // Open at the foot: this screen runs off the bottom of its card, so a
      // radius and a hairline down there closed a window that is meant to
      // carry on past the edge — the corners curled away from the card's own
      // and the brand slab ended in a rounded stub.
      className={`flex h-full select-none overflow-hidden rounded-t-xl border border-b-0 bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`}
    >
      {/* The firm's colour, not ours. --mock-brand is the one token that holds
          its value across both themes, because it stands for the client's own
          brand slab rather than for our chrome. */}
      <div className="flex w-[160px] shrink-0 flex-col gap-[2px] bg-[var(--mock-brand)] px-2.5 py-3">
        <span className="flex items-center gap-2 px-2 pb-3">
          <span className="flex size-[18px] items-center justify-center rounded-[4px] bg-white text-black">
            <IconBrandMark className="size-[10px]" />
          </span>
          <span className={`truncate text-white ${MOCK_PRIMARY}`}>{brand}</span>
          {/* No chevron. It is the workspace switcher's mark, and a switcher
              is not what this card is about — on a still picture it promises a
              menu that cannot open, and at 10px in white/50 it read as a
              speck beside the firm's name rather than as a control. */}
        </span>

        {stock.map(({ icon, label }) => (
          <NavRow key={label} icon={icon} label={label} />
        ))}

        {/* The firm's own apps. They carried an "APPS" group heading, which is
            gone: in a shot this size a line of 10.5px caps at 40% white was a
            label about the nav rather than part of it. The break in the stack
            says the same thing — these rows are not stock — without spending a
            row of type on saying it.

            mt-2, down from mt-4. At four the added rows read as a second list
            further down the nav; the point here is that a new app joins the
            ones already there, so it should sit just clear of Files rather
            than across a gap from it. Still a break, because a row with no
            break at all is just a fifth stock row. */}
        <div className="mt-2 flex flex-col gap-[2px]">
          {apps.map(({ icon, label }, i) => (
            <NavRow
              key={label}
              icon={icon}
              label={label}
              active={i === apps.length - 1}
            />
          ))}
        </div>
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          quietPane ? "opacity-55" : ""
        }`}
      >
        {appHeader ? (
          <div className={`border-b px-5 py-3.5 ${LINE}`}>
            <span className={`text-[color:var(--mock-ink)] ${MOCK_TITLE}`}>
              {title}
            </span>
          </div>
        ) : null}
        {/* The default is three fields and nothing else. The app's content is
            not the claim on /ai-app-builder — what is being shown is WHERE the
            app lands — and anything busier pulls the eye off the nav beside
            it. A caller that IS about the app passes its own screen. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3.5 px-5 py-4">
          {children ??
            [
              "Last year's return",
              "Bank statements",
              "Signed engagement letter",
            ].map((label) => (
              <div key={label}>
                <p
                  className={`text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
                >
                  {label}
                </p>
                <div
                  className={`mt-1.5 rounded-md border px-3 py-2 text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY} ${LINE}`}
                >
                  Upload
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
