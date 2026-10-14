import { TypedAddress } from "@/components/comparison/typed-address";
import { IconBolt, IconCheck, IconClock } from "@/components/home/mock-icons";
import { MOCK_PRIMARY } from "@/components/ui/mock-type";
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
// A pill with no card above it is the whole picture, so it is drawn a step
// larger to hold the panel on its own.
const PILL_SOLO = `flex items-center gap-2.5 whitespace-nowrap rounded-full border bg-[var(--mock-window)] py-2 pl-2 pr-5 text-[15px] leading-none text-[color:var(--mock-ink)] ${LINE}`;
const TILE_SOLO =
  "flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[color:var(--mock-ink)] [&_svg]:size-4";

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
  /** Left out for a story told by its background and pill alone. */
  card?: React.ReactNode;
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
          {card ? (
            <div
              className={`relative ${bare ? `${CARD_FRAME} overflow-hidden` : CARD}`}
            >
              {card}
            </div>
          ) : null}
          <div
            className={`relative ${card ? PILL : PILL_SOLO} ${pillOnPhone ? "" : "max-sm:hidden"}`}
          >
            <span className={card ? TILE : TILE_SOLO}>{pillIcon}</span>
            {pill}
          </div>
        </div>
      </div>
    </div>
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

/** Better fit 1: the code lives in a repo a developer takes over. */
// Plain enough to read at a glance, real enough to read as code a developer
// owns: a component, a fetch, a return.
const SNIPPET: { text: string; soft?: boolean }[] = [
  { text: "export function Booking() {" },
  { text: "  const slots = useSlots();", soft: true },
  { text: "  return (" },
  { text: "    <Calendar slots={slots} />", soft: true },
  { text: "  );" },
  { text: "}" },
];

export function GitHandoffVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: HOSTED_MVP_BG }}
    >
      {/* A code snippet, the thing a developer is handed: the repo is the
          point of this card, so the picture is the code itself. */}
      <div className={`${CARD_FRAME} overflow-hidden`}>
        <div
          className={`flex items-center gap-1.5 border-b bg-[var(--mock-well)] px-3.5 py-2 text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY} ${LINE}`}
        >
          <IconBranch className="size-3 shrink-0" />
          booking.tsx
        </div>
        <pre className="px-3.5 py-3 font-mono text-[11.5px] leading-[1.7]">
          {SNIPPET.map(({ text, soft }, i) => (
            <span
              key={i}
              className={`block ${soft ? "text-[color:var(--mock-ink-soft)]" : ""}`}
            >
              {text}
            </span>
          ))}
        </pre>
      </div>
    </div>
  );
}

/** Better fit 2: a page anyone can land on, no login in front of it. */
export function PublicSiteVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PANEL_BG }}
    >
      <TypedAddress url="yourbrand.com" />
    </div>
  );
}

/** Better fit 3: a one-off that ships and is left as it is. */
export function PrototypeVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PUBLIC_STORE_BG }}
    >
      {/* One small app, finished and left alone: the case where a code-first
          tool is the shorter path, because nothing about it is going to grow. */}
      <div className={`${CARD} flex items-center gap-3`}>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]">
          <IconClock className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className={`block ${MOCK_PRIMARY}`}>Event RSVP</span>
          <span
            className={`mt-1 block text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
          >
            Last updated 8 months ago
          </span>
        </span>
        <span
          className={`shrink-0 rounded-[4px] bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
        >
          v1
        </span>
      </div>
    </div>
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
        {/* A step above the cards' own titles, the way a settings page heads
            the cards under it; at the body size it read smaller than "Free
            plan" below it. */}
        <p className="text-[15px] leading-[1.3]">Plan &amp; usage</p>
        <p
          className={`mt-1.5 text-[color:var(--mock-ink-soft)] ${MOCK_PRIMARY}`}
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

// Copy review: product names, copy, figures and handles in these three are
// mine, invented to read as plausible public products.

/** Base44 better fit 1: an idea put live to see if anyone wants it. */
// Someone at work on a laptop behind the landing page: the founder shipping
// it, which is who this card is for.
const HOSTED_MVP_BG = "url(/images/mocks/hosted-mvp-bg.jpg) center 30% / cover";

// A team at work behind the storefront, the people who run the store.
const PUBLIC_STORE_BG =
  "url(/images/mocks/public-store-bg.jpg) center 30% / cover";

export function HostedMvpVisual() {
  // The photo carries the founder at work. The pill names the reader's
  // situation, not a product claim: this card is where Base44 is the better fit.
  return (
    <Story
      pillIcon={<IconBolt className="size-3.5" />}
      pill="Testing an idea"
      spine="none"
      background={HOSTED_MVP_BG}
    />
  );
}

/** Base44 better fit 2: a public product being found and shared. */
const GROWTH_STATS = [
  { label: "Visits", value: "1,284" },
  { label: "Page views", value: "3,920" },
];

export function GrowthToolingVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PANEL_BG }}
    >
      {/* The product's Analytics stat strip, Visits picked: the traffic a
          marketed product brings, said in one block. */}
      <div
        className={`grid w-full max-w-[300px] grid-cols-2 gap-1 rounded-[12px] border bg-[var(--mock-well)] p-1 text-[color:var(--mock-ink)] ${LINE}`}
      >
        {GROWTH_STATS.map(({ label, value }, i) => (
          <div
            key={label}
            className={`rounded-[9px] px-3.5 py-3 ${
              i === 0
                ? `border bg-[var(--mock-window)] ${LINE}`
                : "text-[color:var(--mock-ink-soft)]"
            }`}
          >
            <p className={MOCK_PRIMARY}>{label}</p>
            <p className={`mt-2 ${STAT}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Base44 better fit 3: a store anyone can browse without signing in. */
export function PublicStoreVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PUBLIC_STORE_BG }}
    >
      {/* Just the address, typed: a public domain anyone can head to is the
          whole claim, and the photo behind it carries the rest. */}
      <TypedAddress url="shop.yourbrand.com" />
    </div>
  );
}
