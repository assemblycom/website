import Image from "next/image";
import {
  IconAreaChart,
  IconBolt,
  IconBrandMark,
  IconCheck,
  IconClock,
  IconGlobeSolid,
} from "@/components/home/mock-icons";
import {
  MOCK_BODY,
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";
import { PANEL_BG, PERIWINKLE } from "@/components/comparison/brand-panel";

// ─────────────────────────────────────────────────────────────────────────
// One small story per card, all in one shape: a card stating what happened,
// a pill under it stating the consequence, and a hairline running through
// both. The shape is shared so the maintenance deep dive and the three
// better-fit cards read as one set of diagrams rather than four drawings, and
// it stays monotone — the claim is in the words, not in a colour.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";
const CARD_FRAME = `w-full max-w-[300px] rounded-[14px] border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`;
const CARD = `${CARD_FRAME} p-3.5`;
const PILL = `flex items-center gap-2 whitespace-nowrap rounded-full border bg-[var(--mock-window)] py-1.5 pl-1.5 pr-3.5 text-[color:var(--mock-ink)] ${MOCK_PRIMARY} ${LINE}`;
const TILE =
  "flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[color:var(--mock-ink)]";
/** A placeholder line of text, for the parts of a screen nobody reads. */
const BAR = "h-[6px] rounded-full bg-[var(--mock-well-2)]";

function Story({
  card,
  pill,
  pillIcon,
  spine = "full",
  background,
  bare = false,
  pillOnPhone = true,
}: {
  /** Off for a card whose screen fills the rail's square phone panel: the
   *  card's own caption carries the point there. */
  pillOnPhone?: boolean;
  /** Drops the card's padding and clips it, for a card that is a whole
   *  screen with its own chrome rather than content set inside a frame. */
  bare?: boolean;
  /** Paints the panel behind the story, e.g. the hero's brand gradient. */
  background?: string;
  card: React.ReactNode;
  pill: string;
  pillIcon: React.ReactNode;
  /** The line through the pieces, the panel's full height, or none. */
  spine?: "full" | "none";
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 select-none"
      style={background ? { background } : undefined}
    >
      {/* The spine runs the panel's full height, behind the card and the
          pill, so the two read as steps on one path rather than as two
          objects that happen to be stacked. */}
      {spine === "none" ? null : (
        <span className="absolute inset-y-0 left-1/2 w-px bg-[var(--mock-line)]" />
      )}
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6">
        <div className="relative flex w-full flex-col items-center gap-3 sm:gap-4">
          <div
            className={`relative ${bare ? `${CARD_FRAME} overflow-hidden` : CARD}`}
          >
            {card}
          </div>
          <div
            className={`relative ${PILL} ${pillOnPhone ? "" : "max-sm:hidden"}`}
          >
            <span className={TILE}>{pillIcon}</span>
            {pill}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandTile() {
  return (
    <span className="flex size-7 items-center justify-center rounded-[8px] bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
      <IconBrandMark className="size-3.5" />
    </span>
  );
}

/** Stop carrying the maintenance yourself: one fix, shipped once. */
export function MaintenanceVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center gap-2">
            <BrandTile />
            <span className={`text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}>
              Assembly
            </span>
          </div>
          <p className={`mt-3 ${MOCK_BODY}`}>Sign-in security update</p>
          <p
            className={`mt-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
          >
            Shipped once. Nothing to change in your apps.
          </p>
        </>
      }
      pillIcon={<IconCheck className="size-3" />}
      pill="Inherited by all 4 apps"
    />
  );
}

/** A branch glyph. The mock set has none, and GitHub's own mark is theirs. */
function IconBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="4.5" cy="3.5" r="1.5" />
      <circle cx="4.5" cy="12.5" r="1.5" />
      <circle cx="11.5" cy="5.5" r="1.5" />
      <path d="M4.5 5v6M11.5 7c0 2.5-2 3-5.5 4" />
    </svg>
  );
}

const COMMITS = [
  ["Add booking flow", "a3f9c1e"],
  ["Fix date picker", "7b21d04"],
  ["Initial commit", "e0c58aa"],
];

/** Better fit 1: the code lives in a repo a developer takes over. */
export function GitHandoffVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center justify-between gap-2">
            <span className={MOCK_PRIMARY}>client-app</span>
            <span
              className={`flex items-center gap-1 rounded bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              <IconBranch className="size-[10px]" />
              main
            </span>
          </div>
          <div className="mt-3 flex flex-col">
            {COMMITS.map(([msg, hash]) => (
              <div
                key={hash}
                className={`flex items-center gap-2 border-t py-2 ${LINE}`}
              >
                <span className="size-[6px] shrink-0 rounded-full bg-[var(--mock-ink-soft)]" />
                <span className={`flex-1 truncate ${MOCK_SECONDARY}`}>
                  {msg}
                </span>
                <span
                  className={`font-mono text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {hash}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      pillIcon={<IconBranch className="size-3" />}
      pill="Handed off to a developer"
    />
  );
}

/** Better fit 2: a page anyone can land on, no login in front of it. */
export function PublicSiteVisual() {
  return (
    <Story
      card={
        <>
          <span
            className={`mx-auto block w-fit rounded-full bg-[var(--mock-well)] px-3 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            yourbrand.com
          </span>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className={MOCK_BODY}>Book a table tonight</p>
            <span className={`${BAR} w-3/4`} />
            <span className={`${BAR} w-1/2`} />
            <span
              className={`mt-2 rounded-[6px] bg-[var(--mock-ink)] px-3 py-1.5 text-[color:var(--mock-window)] ${MOCK_SECONDARY}`}
            >
              Reserve
            </span>
          </div>
        </>
      }
      pillIcon={<IconGlobeSolid className="size-3.5" />}
      pill="Open to anyone, no login"
    />
  );
}

/** Better fit 3: a one-off that ships and is left as it is. */
export function PrototypeVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center justify-between gap-2">
            <span className={MOCK_PRIMARY}>Event RSVP</span>
            <span
              className={`rounded bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              v1
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <span className={`${BAR} w-full`} />
            <span className={`${BAR} w-5/6`} />
            <span className={`${BAR} w-2/3`} />
          </div>
        </>
      }
      pillIcon={<IconClock className="size-3.5" />}
      pill="No changes planned"
    />
  );
}

const QUIET_BUTTON = `shrink-0 rounded-[4px] border bg-[var(--mock-window)] px-3 py-1.5 text-[color:var(--mock-ink)] ${MOCK_PRIMARY} ${LINE}`;
const PANEL = `overflow-hidden rounded-[10px] border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`;
const STAT = "text-[20px] leading-none tabular-nums";

/** A labelled figure, the way the plan and usage page sets one. */
function Figure({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className={`text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}>
        {label}
      </p>
      <p className="mt-2.5 flex items-baseline gap-1.5">
        <span className={STAT}>{value}</span>
        <span className={`text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}>
          {unit}
        </span>
      </p>
    </div>
  );
}

/**
 * Base44 pillar 3: Assembly's own plan and usage panel, as the product draws
 * it. One meter, nothing beside it: the claim is that there is only the one,
 * so the picture shows only the one. On the Free plan, so the figures are the
 * ones anyone can see on day one: 50 build credits a month. Copy review: the
 * page heading and its line are the product's own.
 */
export function CreditsVisual() {
  return (
    // The settings page itself, white and running off the panel's foot, with
    // the cards at its top the way the product lays them out. Floating in the
    // middle of the grey panel they sat low and read as a diagram.
    <div
      aria-hidden
      className={`mock-edge flex h-full select-none flex-col gap-3 overflow-hidden rounded-t-xl border border-b-0 bg-[var(--mock-window)] px-4 pt-4 sm:px-6 sm:pt-6 ${LINE}`}
    >
      <div className="mb-1">
        <p className={MOCK_BODY}>Plan &amp; usage</p>
        <p
          className={`mt-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
        >
          Your plan, seats, and credit usage.
        </p>
      </div>
      {/* The plan card goes on a phone; the meter is the claim. */}
      <div
        className={`${PANEL} hidden items-center justify-between gap-3 p-5 sm:flex`}
      >
        <div>
          <p className="text-[13px] leading-[1.3]">Free plan</p>
          <p
            className={`mt-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
          >
            $0 · 50 build credits a month
          </p>
        </div>
        <span className={QUIET_BUTTON}>Upgrade</span>
      </div>
      <div className={PANEL}>
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Figure label="Build credits" value="41" unit="available" />
            <span className={QUIET_BUTTON}>Add credits</span>
          </div>
          {/* The brand's periwinkle, the hue the product's own bar carries
              and the one colour the hero panel already spends. */}
          <span className="mt-5 block h-[6px] overflow-hidden rounded-full bg-[var(--mock-well-2)]">
            <span
              className="block h-full w-[82%] rounded-full"
              style={{ backgroundColor: PERIWINKLE }}
            />
          </span>
        </div>
        <div
          className={`flex items-center justify-between gap-3 border-t p-4 sm:p-5 ${LINE}`}
        >
          <Figure label="Used this billing period" value="9" unit="of 50" />
          <span className={QUIET_BUTTON}>View usage</span>
        </div>
      </div>
    </div>
  );
}

const PLATFORM_LAYER = ["Logins", "Permissions", "Hosting", "Data scoping"];

/** Base44 deep dive 3: the parts every app stands on, as a plain checklist. */
export function PlatformLayerVisual() {
  return (
    // pb-6 lifts the card off the window's centre line: the window starts a
    // gap below the card's copy, so its centre sat low against the card.
    <div
      aria-hidden
      className="flex h-full select-none items-center justify-center px-6 pb-6"
    >
      {/* The rules run the card's full width; the inset is on the rows. */}
      <div className={`${CARD_FRAME} overflow-hidden`}>
        {PLATFORM_LAYER.map((item, i) => (
          <div
            key={item}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 ${i ? `border-t ${LINE}` : ""}`}
          >
            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
              <IconCheck className="size-[10px]" />
            </span>
            <span className={MOCK_PRIMARY}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A browser's toolbar at mock scale: the window buttons and the address. */
function BrowserBar({ url, right }: { url: string; right?: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2 border-b bg-[var(--mock-well)] px-3 py-2 ${LINE}`}
    >
      <span className="flex shrink-0 gap-[4px]">
        <span className="size-[6px] rounded-full bg-[var(--mock-traffic-red)]" />
        <span className="size-[6px] rounded-full bg-[var(--mock-traffic-amber)]" />
        <span className="size-[6px] rounded-full bg-[var(--mock-traffic-green)]" />
      </span>
      <span
        className={`flex-1 truncate rounded-[5px] border bg-[var(--mock-window)] px-2 py-[3px] text-center text-[color:var(--mock-ink-soft)] ${MOCK_MICRO} ${LINE}`}
      >
        {url}
      </span>
      {right ?? <span className="w-[26px] shrink-0" />}
    </div>
  );
}

/** A small round face, initials on a soft ground, the CRM's own avatar. */
function Avatar({
  initials,
  ring = false,
}: {
  initials: string;
  ring?: boolean;
}) {
  return (
    <span
      className={`flex size-[18px] items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[8px] text-[color:var(--mock-ink-soft)] ${
        ring ? "-ml-1.5 ring-2 ring-[var(--mock-window)]" : ""
      }`}
    >
      {initials}
    </span>
  );
}

// Copy review: product names, copy, figures and handles in these three are
// mine, invented to read as plausible public products.

/** Base44 better fit 1: an idea put live to see if anyone wants it. */
export function HostedMvpVisual() {
  return (
    <Story
      bare
      card={
        <>
          <BrowserBar url="fieldnote.app" />
          <div className="px-4 pb-4 pt-3.5">
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 ${MOCK_PRIMARY}`}>
                <span className="size-[10px] rounded-[3px] bg-[var(--mock-ink)]" />
                Fieldnote
              </span>
              <span
                className={`rounded-full bg-[var(--mock-well-2)] px-2 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
              >
                Coming soon
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-[1.25] tracking-[-0.01em]">
              Plan your garden in minutes
            </p>
            <p
              className={`mt-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY} leading-[1.4]`}
            >
              Tell it your space and your climate. Get a planting calendar back.
            </p>
            <div className="mt-3.5 flex items-center gap-1.5">
              <span
                className={`flex h-[28px] flex-1 items-center rounded-[6px] border bg-[var(--mock-window)] px-2.5 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY} ${LINE}`}
              >
                you@email.com
              </span>
              <span
                className={`flex h-[28px] items-center rounded-[6px] bg-[var(--mock-ink)] px-3 text-[color:var(--mock-window)] ${MOCK_SECONDARY}`}
              >
                Join
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex pl-1.5">
                <Avatar initials="JL" ring />
                <Avatar initials="MP" ring />
                <Avatar initials="RS" ring />
              </span>
              <span
                className={`text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
              >
                1,284 people on the waitlist
              </span>
            </div>
          </div>
        </>
      }
      pillIcon={<IconBolt className="size-3.5" />}
      pill="Live the same day"
      pillOnPhone={false}
      spine="none"
    />
  );
}

/** Base44 better fit 2: a public product being found and shared. */
export function GrowthToolingVisual() {
  return (
    <div aria-hidden className="absolute inset-0 select-none">
      <div className="relative flex h-full flex-col items-center justify-center gap-2.5 px-6">
        {/* The search result, the way a results page sets one. */}
        <div className={`${CARD} relative`}>
          <div className="flex items-center gap-2">
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[var(--mock-well-2)]">
              <span className="size-[8px] rounded-[2px] bg-[var(--mock-ink)]" />
            </span>
            <span className="min-w-0">
              <span className={`block ${MOCK_MICRO}`}>Mealwise</span>
              <span
                className={`mt-0.5 block truncate text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
              >
                mealwise.com › weekly-plans
              </span>
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-[1.3]">
            Weekly meal plans in 5 minutes
          </p>
          <p
            className={`mt-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY} leading-[1.4]`}
          >
            Pick your diet and budget. Mealwise writes the plan and the shopping
            list.
          </p>
        </div>
        {/* A post about it, scheduled from the same tool. */}
        <div className={`${CARD} relative`}>
          <div className="flex items-center gap-2">
            <Avatar initials="MW" />
            <span className={MOCK_SECONDARY}>Mealwise</span>
            <span className={`text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}>
              @mealwise · 2h
            </span>
          </div>
          <p className={`mt-2 ${MOCK_SECONDARY} leading-[1.4]`}>
            Sunday prep, sorted. This week&apos;s plan is live.
          </p>
          <div className="mt-2.5 flex gap-3 text-[color:var(--mock-ink-soft)]">
            <span className={MOCK_MICRO}>214 likes</span>
            <span className={MOCK_MICRO}>38 reposts</span>
          </div>
        </div>
        <div className={`relative mt-1 ${PILL} max-sm:hidden`}>
          <span className={TILE}>
            <IconAreaChart className="size-3.5" />
          </span>
          Found in search, shared on social
        </div>
      </div>
    </div>
  );
}

const STORE_ITEMS = [
  {
    name: "Merino crewneck",
    price: "$120",
    src: "/images/mocks/covers/cover-1.jpg",
  },
  {
    name: "Wool cardigan",
    price: "$145",
    src: "/images/mocks/covers/cover-3.jpg",
  },
];

/** Base44 better fit 3: a store anyone can browse without signing in. */
export function PublicStoreVisual() {
  return (
    <Story
      bare
      card={
        <>
          <BrowserBar
            url="shop.yourbrand.com"
            right={
              <span
                className={`flex shrink-0 items-center gap-1 rounded-full bg-[var(--mock-ink)] px-2 py-[3px] text-[color:var(--mock-window)] ${MOCK_MICRO}`}
              >
                Bag 2
              </span>
            }
          />
          <div className="grid grid-cols-2 gap-2.5 p-3">
            {STORE_ITEMS.map((item) => (
              <div key={item.name}>
                {/* Two of /client-portal's approval covers, cropped the way
                    that mock crops them: face in the upper half. */}
                <span className="relative block aspect-[4/5] overflow-hidden rounded-[8px] bg-[var(--mock-well-2)]">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="160px"
                    quality={90}
                    className="object-cover object-[50%_28%]"
                  />
                </span>
                <p className={`mt-2 truncate ${MOCK_SECONDARY}`}>{item.name}</p>
                <p
                  className={`mt-1 tabular-nums text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {item.price}
                </p>
              </div>
            ))}
          </div>
        </>
      }
      pillIcon={<IconGlobeSolid className="size-3.5" />}
      pill="Anyone can browse, no sign-in"
      pillOnPhone={false}
      spine="none"
      background={PANEL_BG}
    />
  );
}
