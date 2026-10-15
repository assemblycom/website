import { TypedAddress } from "@/components/comparison/typed-address";
import {
  IconApp,
  IconBrandMark,
  IconCheck,
  IconCreditCard,
  IconPenFilled,
} from "@/components/home/mock-icons";
import { GoogleGlyph } from "@/components/client-portal/frictionless-mocks";
import { MOCK_PRIMARY } from "@/components/ui/mock-type";
import { PANEL_BG, PERIWINKLE } from "@/components/comparison/brand-panel";

// The comparison pages' small card visuals: a photo or the brand gradient
// behind one piece of product UI. Monotone on purpose, so the claim is in the
// words rather than in a colour.

const LINE = "border-[var(--mock-line)]";
const CARD_FRAME = `w-full max-w-[300px] rounded-[10px] border bg-[var(--mock-window)] text-[color:var(--mock-ink)] ${LINE}`;
const CARD = `${CARD_FRAME} p-3.5`;

/**
 * The three "why Assembly" cards. Each keeps the ground its better-fit card had
 * (laptop photo, brand gradient, office photo) and swaps in a small piece of
 * the pillar's own UI, so the claim reads off the screen rather than a label.
 */
const ROW = `flex items-center gap-2.5 border-t px-3.5 py-2.5 ${LINE}`;
const MUTED = "text-[color:var(--mock-ink-soft)]";

// The product's own sidebar glyphs, the set the Track card's rail draws.
// The three glyphs fill their boxes by different amounts, so each takes the
// box size that draws it at the same ~20px on screen.
const CLIENT_APPS = [
  { label: "Project tracker", icon: <IconApp className="size-8" /> },
  { label: "Contracts", icon: <IconPenFilled className="size-7" /> },
  { label: "Invoices", icon: <IconCreditCard className="size-7" /> },
];

/** Pillar 1: the firm's apps, as three app tiles and nothing more. */
export function ClientAppsCardVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center gap-3 px-6"
      style={{ background: HOSTED_MVP_BG }}
    >
      {CLIENT_APPS.map(({ label, icon }) => (
        <span
          key={label}
          className={`flex size-16 items-center justify-center rounded-[16px] border bg-[var(--mock-window)] text-[color:var(--mock-ink-soft)] ${LINE}`}
        >
          {icon}
        </span>
      ))}
    </div>
  );
}

/** Pillar 2: the sign-in someone already built for you. */
export function LoginsCardVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PANEL_BG }}
    >
      <div className={`${CARD} flex flex-col items-center text-center`}>
        <span className="flex size-8 items-center justify-center rounded-[8px] bg-[#101114] text-white">
          <IconBrandMark className="size-[15px]" />
        </span>
        <span className="mt-3 text-[13.5px] leading-snug">
          Sign in to Brandmages
        </span>
        <span
          className={`mt-3.5 flex w-full items-center justify-center gap-2 rounded-[8px] border bg-[var(--mock-well)] py-2.5 ${MOCK_PRIMARY} ${LINE}`}
        >
          <GoogleGlyph />
          Continue with Google
        </span>
        <span
          className={`mt-2 flex w-full items-center justify-center rounded-[8px] border bg-[var(--mock-well)] py-2.5 ${MOCK_PRIMARY} ${LINE}`}
        >
          Email me a sign-in link
        </span>
      </div>
    </div>
  );
}

const CONTACTS = [
  { initials: "MS", name: "Mary Sung", company: "Symphony" },
  { initials: "TL", name: "Timothy Leclerc", company: "Wave" },
  { initials: "KT", name: "Kenny Tse", company: "Godo" },
];

/** Pillar 3: one contact list behind every app. */
export function CrmCardVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PUBLIC_STORE_BG }}
    >
      <div className={`${CARD_FRAME} overflow-hidden`}>
        <div className={`px-3.5 py-3 ${MOCK_PRIMARY}`}>Contacts</div>
        {CONTACTS.map(({ initials, name, company }) => (
          <div key={name} className={ROW}>
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[9.5px] leading-none ${MUTED}`}
            >
              {initials}
            </span>
            <span className={`min-w-0 flex-1 truncate ${MOCK_PRIMARY}`}>
              {name}
            </span>
            <span className={`shrink-0 ${MUTED} ${MOCK_PRIMARY}`}>
              {company}
            </span>
          </div>
        ))}
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
            {/* A quiet tick on the well, not a solid ink disc: four of them in a
                column read as the loudest thing on the card. */}
            <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[color:var(--mock-ink-soft)]">
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

// The two photo grounds the comparison cards share: someone at work on a
// laptop, and a team at work in an office.
const HOSTED_MVP_BG = "url(/images/mocks/hosted-mvp-bg.jpg) center 30% / cover";
const PUBLIC_STORE_BG =
  "url(/images/mocks/public-store-bg.jpg) center 30% / cover";

/** Base44 pillar 1: the firm's own address, with no platform in it. */
export function BrandCardVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-4 sm:px-6"
      style={{ background: HOSTED_MVP_BG }}
    >
      <TypedAddress url="portal.brandmages.com" />
    </div>
  );
}

const CREDITS_LEFT = 142;
const CREDITS_TOTAL = 200;

/**
 * Base44 pillar 3: one credit meter. On hover the month turns over and the
 * meter refills, which is the rollover the caption describes.
 */
export function CreditsCardVisual() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex select-none items-center justify-center px-6"
      style={{ background: PUBLIC_STORE_BG }}
    >
      <div className={`${CARD_FRAME} overflow-hidden`}>
        <div className="px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <span className={MOCK_PRIMARY}>Build credits</span>
            <span className={`relative ${MUTED} ${MOCK_PRIMARY} tabular-nums`}>
              <span className="transition-opacity duration-300 group-hover/card:opacity-0 motion-reduce:transition-none">
                {CREDITS_LEFT} of {CREDITS_TOTAL}
              </span>
              <span className="absolute inset-y-0 right-0 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:transition-none">
                {CREDITS_TOTAL} of {CREDITS_TOTAL}
              </span>
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--mock-well-2)]">
            <div
              className="h-full w-full origin-left rounded-full bg-[var(--mock-ink)] transition-[width] duration-700 ease-out group-hover/card:!w-full motion-reduce:transition-none"
              style={{ width: `${(CREDITS_LEFT / CREDITS_TOTAL) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
