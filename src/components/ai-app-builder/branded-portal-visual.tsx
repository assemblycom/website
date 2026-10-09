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
      // THE PICKED ROW IS QUIETER IN DARK, 9% against light's 15%, and the two
      // numbers are separate on purpose.
      //
      // One value served both, which looked right on the light page and too
      // loud on the dark one — not because the contrast differs (the slab is
      // near-black in both themes, #171717 light and #121212 dark, so 15%
      // lands around #3a3a3a either way) but because of what surrounds it.
      // On the dark page the slab sits on a #191919 card on a #0a0a0a ground,
      // so a #3a3a3a pill is the brightest patch in the whole shot — and the
      // shot's subject is the pane of upload fields beside it, not which row
      // of the nav is open. 9% lands near #272727: a +21 step off the slab,
      // still plainly the picked row at a 24px rung, no longer the first thing
      // the eye goes to. Light is untouched.
      className={`flex items-center gap-2 rounded-[4px] px-2 py-[6px] ${MOCK_PRIMARY} ${
        active
          ? "bg-white/15 text-white [[data-theme=dark]_&]:bg-white/[0.09]"
          : "text-white/70"
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
  landOnHover = [],
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
  /**
   * Rows that drop in under `apps` while the pillar card is hovered, one after
   * the other — the shot saying that new apps keep landing, not just that one
   * did. Needs an ancestor carrying `group/pillar` (the pillar card does).
   * Empty by default, so every other caller is unchanged.
   */
  landOnHover?: PortalApp[];
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
      // .mock-edge, so the hairline is LIT rather than flat. In dark the plain
      // --mock-line border was one value the whole way round — brightest where
      // it should be, and exactly as bright at the foot, which on a shot that
      // runs off the bottom of its card reads as an outline drawn around the
      // picture instead of a window catching light. .mock-edge paints the
      // border box with the set's radial: strongest at the top-left and fallen
      // into the window's own ground by the lower right.
      //
      // The border stays REAL and stays `border-b-0` — .mock-edge paints INTO
      // the border box, so an element with no border has nothing to paint, and
      // the foot is still open because this screen carries on past the card.
      // Light is untouched: .mock-edge is dark-only and the --mock-line
      // hairline there is already right.
      className={`mock-edge flex h-full select-none overflow-hidden rounded-t-xl border border-b-0 bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`}
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

          {/* TWO MORE APPS LAND WHEN THE CARD IS HOVERED.
              The still shot says a new app arrives already branded; this says
              it keeps happening. They are NOT active — "Year-end docs" stays
              the open row, because the pane on the right is that app's screen
              and lighting a second row would make the shot disagree with
              itself. These just drop in under it.

              0fr → 1fr on the grid rows, the same reveal the quote accordion
              uses: it animates to the row's own height without anyone
              measuring it, and it collapses to nothing rather than to a
              min-height. `overflow-hidden` on the inner div is what lets the
              0fr track actually clip.

              Staggered so they LAND one after the other rather than appearing
              as a block. That is the whole reason this is two rows and not
              one, and the first numbers did not buy it: at 500ms with 90ms
              between them the two reveals overlapped for four fifths of their
              run, so what you saw was a block that happened to be slightly
              ragged at one corner. 260ms apart is wider than it sounds — the
              rows still overlap, which is what keeps it one gesture — but the
              first is most of the way open before the second starts moving,
              which is the point at which an eye reads them as two events.

              THE FIRST ROW WAITS TOO, 120ms. With no delay on it the reveal
              began on the same frame as the pointer crossing the card, which
              is what read as sudden: nothing had settled yet and a row was
              already growing. The beat is short enough not to feel like lag
              and long enough that the animation looks like a response rather
              than a twitch.

              700ms, up from 500, and the rows come DOWN 6px as they open.
              Height alone is a row unfolding in place; the small drop is what
              makes it read as a row arriving from the stack above it. Both run
              on the same eased curve as before, which is nearly all of its
              ease spent at the end — so the row decelerates into its place
              instead of stopping at it.

              Hover only, and deliberately: it is a flourish on a picture, the
              card reads correctly without it, and a touch device simply never
              sees it. `motion-reduce` holds them open and still, so nothing
              moves for a reader who asked for that. */}
          {landOnHover.map(({ icon, label }, i) => (
            <div
              key={label}
              // THE TIMING IS DIFFERENT IN EACH DIRECTION, and it has to be.
              // Duration, easing and delay are themselves part of the rule
              // that applies, so the base classes here describe the EXIT and
              // the `group-hover/pillar:` ones describe the ENTRY. One set of
              // values served both before, which is what made leaving the card
              // look broken: the rows sat still for 120ms and 380ms — the
              // entry stagger, running backwards — and then took 700ms to
              // close on an ease whose whole curve is spent at the end, so
              // they crawled shut long after the pointer had gone.
              //
              // Entry: 700ms on the eased curve, the second row 260ms behind
              // the first, so they arrive one after the other.
              //
              // Exit: 200ms, ease-out, and the stagger REVERSED — the lower
              // row goes first and the upper follows 80ms later. Last in,
              // first out: the stack retracts the way it arrived rather than
              // unspooling from the top, and it is gone quickly enough that
              // leaving the card reads as one movement.
              className={`-mt-[2px] grid -translate-y-[6px] grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,transform] duration-200 ease-out group-hover/pillar:translate-y-0 group-hover/pillar:grid-rows-[1fr] group-hover/pillar:opacity-100 group-hover/pillar:duration-700 group-hover/pillar:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:translate-y-0 motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100 motion-reduce:transition-none ${
                i === 1
                  ? "delay-0 group-hover/pillar:delay-[380ms]"
                  : "delay-[80ms] group-hover/pillar:delay-[120ms]"
              }`}
            >
              <div className="overflow-hidden">
                {/* pt-[2px] reproduces the gap-[2px] the static rows above sit
                    on, from INSIDE the collapsing track, so it goes to zero
                    with the row rather than being held open by it.
                    A collapsed flex item still takes the parent's gap, though,
                    which the original note here had backwards — so this 2px
                    was landing on top of the parent's own 2px. The row's
                    `-mt-[2px]` (above) cancels that: the landing rows sat 4px
                    apart where the static rows above them sit 2px, and the
                    nav reserved 4px of dead space under "Year-end docs" at
                    rest for two rows that were not there. */}
                <div className="pt-[2px]">
                  <NavRow icon={icon} label={label} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col ${
          // 55% IN LIGHT, 80% IN DARK — and it has to be two numbers.
          //
          // 55 was picked against a white pane on a light-grey card, where
          // there is a long way to fall before the pane stops existing. In
          // dark the pane is --mock-window #212121 and the card is #191919,
          // eight points apart, so knocking it back 45% lands it at about
          // #1d1d1d — four points off the card, with its type dimmed to match.
          // The whole right-hand side went to mud, which is the opposite of
          // "quiet": a recessed pane still has to be a pane.
          //
          // 80 keeps the nav as the loudest thing in the shot, which is the
          // point of the prop, while leaving the pane legible as the screen
          // the nav is attached to.
          quietPane ? "opacity-55 [[data-theme=dark]_&]:opacity-80" : ""
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
