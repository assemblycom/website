import {
  BrandedPortalVisual,
  type PortalApp,
} from "@/components/ai-app-builder/branded-portal-visual";
import { BUILDER_RAIL_HALO_WIDE } from "@/components/ai-app-builder/builder-grid-rails";
import { ClientAssistantPane } from "@/components/home/v2/client-ai-assistant-visual";
import { ClientHomePane } from "@/components/client-portal/client-home-pane";
import {
  IconChat,
  IconClipboard,
  IconList,
  IconPenFilled,
} from "@/components/home/mock-icons";
import { MOCK_BODY } from "@/components/ui/mock-type";
import { PhoneShell } from "@/components/home/phone-shell";

// The homepage's product UI hero tile (V2), shared with /client-portal's hero:
// a client's own portal, in the firm's colour, standing still in one tile. One
// component on both pages so the product shot a visitor meets first is the
// same screen wherever they land.

/**
 * The product shot: a client's own portal, with the firm's nav down the side
 * and one app open in it (see SCREENS).
 *
 * STILL, and drawn once. It is the same window /client-portal's hero now carries.
 *
 * It fills the tile rather than being scaled into it. The mock is fluid —
 * `h-full` and `flex-1` throughout — so a wider window means the rows lay out
 * with more room at the same type size, which is a screen someone could
 * actually be looking at. Scaling a fixed drawing up instead would magnify
 * the type along with it and read as a screenshot zoomed in.
 *
 * The mock brings its own portal nav, so there is no sidebar to add here.
 *
 * The height is the product pages' hero-tray height from md; the phone's is
 * set against the window's own width there — see the class.
 */
type Screen = "assistant" | "home";

/**
 * Which app the client has open. The homepage opens on the AI Assistant;
 * /client-portal opens on Home, because a page about the portal leads with
 * the portal's own front door rather than one app in it.
 */
const SCREENS: Record<
  Screen,
  {
    apps: PortalApp[];
    activeLabel?: string;
    title: string;
    children: React.ReactNode;
  }
> = {
  assistant: {
    apps: [
      { icon: <IconList />, label: "Project tracker" },
      { icon: <IconChat />, label: "AI Assistant" },
    ],
    title: "Assistant",
    children: <ClientAssistantPane />,
  },
  home: {
    // The apps the Home rows point at, so every item on the page has a row
    // in the nav to go to.
    apps: [
      { icon: <IconPenFilled />, label: "Contracts" },
      { icon: <IconClipboard />, label: "Forms" },
      { icon: <IconList />, label: "Project tracker" },
    ],
    activeLabel: "Home",
    title: "Home",
    children: <ClientHomePane />,
  },
};

function ClientExperiencePanel({ view }: { view: Screen }) {
  const { apps, activeLabel, title, children } = SCREENS[view];
  const screen = (
    <BrandedPortalVisual
      apps={apps}
      activeLabel={activeLabel}
      // A step under the shared title size, and off pure white in dark:
      // at full ink the title was the brightest thing in the window.
      title={
        <span className={`${MOCK_BODY} [[data-theme=dark]_&]:text-white/75`}>
          {title}
        </span>
      }
      // On a phone the client nav steps aside for the open app, as the
      // product does, rather than squeezing a desktop window into 280px.
      navOnPhone={false}
      appsBreak={false}
    >
      {children}
    </BrandedPortalVisual>
  );
  return (
    <>
      {/* ON A PHONE, A PHONE: the same frame the CRM tab draws its screen
          in, cropped by the tile at its foot. The box is shorter than the
          phone, so the crop always lands on the screen, never under it. */}
      <div className="relative mx-auto h-[290px] overflow-hidden md:hidden">
        <div className="mx-auto w-full max-w-[260px]">
          <PhoneShell
            melt={false}
            sideButtons={false}
            squareFoot
            screenBg="bg-[var(--mock-window)]"
          >
            {/* The phone is the frame, so the window's own border and
                rounded top go: two frames nested read as a window in a
                window. */}
            <div className="relative min-h-0 flex-1 [&_.mock-edge]:rounded-none [&_.mock-edge]:border-0">
              {screen}
            </div>
          </PhoneShell>
        </div>
      </div>
      <div
        // Its own ground and hairline, so the window reads as a window sitting
        // in the tile rather than as rows printed straight onto it.
        //
        // CAPPED AND CENTRED AT 880, which is the width the product pages draw
        // their hero screen at. The mock is fluid and its type is fixed, so the
        // window's width is what decides how that type reads: at 1080 the same
        // rows were laid out across half a metre at 9px and the screen looked
        // stretched, with type a size smaller than the site shows a product at
        // anywhere else. The tile keeps its own width and the slack falls
        // either side as mat.
        //
        // OPEN AT THE FOOT. No bottom border and no bottom radius: the screen
        // runs off the tile's bottom edge the way the product pages' does off
        // their card's, so the last row is cropped by the frame rather than
        // stopping short of it with a band of tile underneath — which read as
        // the table having run out rather than as a window onto more.
        // TALLER ON A PHONE than the 280 it was. The window is about 300px wide
        // there, so at 280 tall it was square — and a square window reads as a
        // crop of an app rather than as a screen, because no screen anyone uses
        // is square. At 340 it is portrait, like the phone holding it, and two
        // more rows of the tracker clear the fold.
        // 470 FROM md, NOT 391. The product pages' hero draws its screen at
        // about 880x378 — a 2.3 ratio — and this tile is 1080 wide, so at 391
        // it was a 2.8: the same screen in a letterbox, flatter than anything
        // else the site shows a product in. 470 puts this tile on the product
        // pages' own proportion, and the extra height is spent on rows of the
        // tracker rather than on mat.
        //
        // SIZED TO THE SOLUTIONS PAGES' HERO, not to its own numbers: the same
        // 1040 window, 280/391 tall, holding a screen taller than itself so the
        // frame crops it. A homepage hero shot a different size from the
        // product pages' read as a different template.
        className="relative mx-auto hidden h-[280px] w-full max-w-[1040px] overflow-hidden rounded-t-xl md:block md:h-[391px]"
      >
        {/* FILLS THE TILE rather than running past it, so the question field
          lands on the tile's foot instead of below the crop. */}
        <div className="absolute inset-0">
          {/* A client's portal in the firm's colour: the client's side of the
            product, open on the app the caller picked. */}
          {screen}
        </div>
      </div>
    </>
  );
}

/**
 * The tile around the portal. rounded-3xl, the radius the site's large panels
 * use, clipped and open at the foot so the screen ends on the tile's own edge.
 * The solutions pages' tray inset, 24 then 48, so every hero tray is one
 * template.
 *
 * THE WIDE HALO is the page ground drawn just outside the tile, so grid rails
 * behind a hero fade out over about 48px instead of stopping dead on the
 * tile's top edge. `relative`, because the shadow has to paint over a layer the
 * homepage hero deliberately puts at a negative z. Harmless where there are no
 * rails behind it: it is the page's own colour.
 */
export function ClientExperienceTile({
  screen = "assistant",
}: {
  screen?: Screen;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-[var(--surface)] p-6 pb-0 md:p-12 md:pb-0 ${BUILDER_RAIL_HALO_WIDE}`}
    >
      <ClientExperiencePanel view={screen} />
    </div>
  );
}
