"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/check-icon";
import { MarkGlyph, type MarkTint } from "@/components/home/app-marks";
import { PLAN_MARKS } from "@/components/pricing/plan-marks";
import {
  DOTTED_RULE_LEFT_ROW,
  DOTTED_RULE_TOP_TABLE,
  DOTTED_RULE_TOP_UPRIGHT,
} from "@/components/ui/dotted-rule";
import { SIGNUP_URL, DEMO_URL, DEMO_CTA_LABEL } from "@/lib/constants";
import {
  PLAN_WASH_BRAND,
  PLAN_WASH_BRAND_LG,
  PLAN_WASH_NEUTRAL,
  PLAN_WASH_NEUTRAL_LG,
} from "@/components/pricing/plan-wash";

// Some lines follow the billing toggle: seat prices differ, and Advanced's
// credits become unlimited building on yearly.
type PlanItem = string | { yearly: string; monthly: string };

interface PlanFeatureGroup {
  label: string;
  items: PlanItem[];
  // This group lists what the plan adds on top of the tier below it. Its
  // heading is worked out at render time ("Everything in Starter, plus") so it
  // can fall back to plain "Features" when that tier's card isn't on screen —
  // signed-in visitors don't see Free, so Starter has nothing to build on.
  extendsPrevious?: boolean;
}

interface Plan {
  name: string;
  priceMonthly: number;
  priceYearly: number; // effective per-month price when billed annually
  description: string;
  featureGroups: PlanFeatureGroup[];
  cta: string;
  ctaHref: string;
  // A quieter "Book a demo" button under the main CTA, for the tiers where
  // buying outright is the main path but a demo is a fair second.
  secondaryDemo?: boolean;
  // Price is a floor, not a rate: same figure on both billing toggles, and the
  // line under it says so instead of "Billed monthly / annually".
  startingPrice?: boolean;
  highlighted: boolean;
  // What only yearly billing adds. Listed as the card's last group, under
  // Support, headed "Included with yearly billing"; hidden on monthly.
  yearlyPerks?: string[];
}

const PLANS: Plan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "For getting started",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "5 active contacts",
          "1 internal user",
          "3 apps",
          "50 build credits/mo",
        ],
      },
      {
        label: "Includes",
        items: [
          "CRM",
          "Client portal",
          "Messaging and team inbox",
          "Invoices and payment links",
          "Proposals and contracts",
          "File sharing and forms",
          "App builder",
          "30+ pre-made apps",
        ],
      },
      {
        label: "Support",
        items: ["Community support"],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    highlighted: false,
  },
  {
    name: "Starter",
    priceMonthly: 69,
    priceYearly: 39,
    description: "For solo operators",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "50 active contacts",
          "1 internal user",
          "5 apps, +$8/app",
          "200 build credits/mo",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "ChatGPT and Claude apps",
          "API and MCP access",
          "Reduced payment fees",
          "Build credit packs",
        ],
      },
      {
        label: "Support",
        items: ["Email support"],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    highlighted: false,
  },
  {
    name: "Professional",
    priceMonthly: 199,
    priceYearly: 149,
    description: "For small teams",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "500 active contacts",
          {
            yearly: "3 internal users, +$39/user",
            monthly: "3 internal users, +$49/user",
          },
          "10 apps, +$8/app",
          "500 build credits/mo",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "Custom domain and email domain",
          "Automation builder",
          "Lower payment fees",
          "Multi-company clients",
          "App visibility",
        ],
      },
      {
        label: "Support",
        items: [
          "Priority email support",
        ],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    secondaryDemo: true,
    highlighted: true,
    yearlyPerks: ["Personalized onboarding"],
  },
  {
    name: "Advanced",
    priceMonthly: 599,
    priceYearly: 399,
    description: "For scaling businesses",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "Unlimited active contacts",
          {
            yearly: "5 internal users, +$59/user",
            monthly: "5 internal users, +$79/user",
          },
          "Unlimited apps",
          {
            yearly: "Unlimited building",
            monthly: "500 build credits/mo",
          },
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "Full white-labeling",
          "Audit log",
          "Client access permissions",
          "Enforced MFA",
          "HIPAA compliance (BAA)",
          "Lowest payment fees",
        ],
      },
      {
        label: "Support",
        items: [
          "Priority email support",
          "Priority call support",
        ],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    secondaryDemo: true,
    highlighted: false,
    yearlyPerks: ["Unlimited building", "White-glove onboarding"],
  },
  {
    name: "Enterprise",
    priceMonthly: 2000,
    priceYearly: 2000,
    description: "For custom needs",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "Unlimited active contacts",
          "Unlimited internal users",
          "Unlimited apps",
          "Unlimited building",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: ["Custom SSO", "Advanced security controls", "Sandbox workspace"],
      },
      {
        label: "Support",
        items: [
          "Dedicated success manager",
          "Implementation service",
          "Shared Slack channel",
        ],
      },
    ],
    cta: DEMO_CTA_LABEL,
    ctaHref: DEMO_URL,
    startingPrice: true,
    highlighted: false,
  },
];

// Signed-in visitors already have a plan, so the Free tier is noise — they see
// only the paid upgrade paths.
const PAID_PLANS = PLANS.filter((plan) => plan.priceMonthly > 0);

type Billing = "monthly" | "yearly";

// From xl the plan table reaches into the page margin: whatever lies beyond a
// 24px gutter, up to 80px a side. Shared with the comparison table so the two
// tables keep the same edges.
export const PLAN_TABLE_BLEED =
  "xl:mx-[calc(-1*clamp(0px,(100vw_-_1328px)/2,5rem))]";

// Every tooltip on the pricing page: small corners, tight padding and the
// site's faintest shadow, so it reads as a label rather than a floating card.
// In dark it steps UP to the raised surface: the page black sat below the card
// it floats over and read as a hole.
export const TOOLTIP =
  "pointer-events-none absolute left-0 top-full z-30 mt-1 hidden rounded border border-border bg-background px-2 py-1 text-xs leading-4 text-muted-foreground shadow-[0_1px_2px_rgba(16,24,40,0.04)] group-hover:block group-focus-within:block [[data-theme=dark]_&]:border-white/[0.06] [[data-theme=dark]_&]:bg-[var(--surface-2)]";

// Each plan's mark, in the brand iconography (see plan-marks.ts), set the
// way the homepage hero sets the Core Set marks (hero-big.tsx): a dark tile,
// the solid layer in one of the brand file's coloured tints, white glass over
// it. The set has three tints, so five plans walk them in order. The mark
// is 20px in the 32px tile — 6px of air a side; at 24px the square marks
// all but touched the tile's edge.
const PLAN_TINT: Record<string, MarkTint> = {
  Free: "mint",
  Starter: "blue",
  Professional: "lavender",
  Advanced: "mint",
  Enterprise: "blue",
};

function PlanIcon({ name }: { name: string }) {
  const glyph = PLAN_MARKS[name];
  if (!glyph) return null;
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-900 [[data-theme=dark]_&]:bg-neutral-700">
      <MarkGlyph glyph={glyph} tint={PLAN_TINT[name] ?? "blue"} className="block size-5" />
    </span>
  );
}

// The info mark beside a line that has a tooltip — shared with the compare
// table (feature-comparison.tsx), which used it first.
export function InfoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 7.25v3.25"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="8" cy="5.25" r="0.85" fill="currentColor" />
    </svg>
  );
}

// What each yearly onboarding perk means, shown on hover/tap. DRAFT COPY: the
// site defines neither tier anywhere. "Personalized" follows the solutions-page
// FAQ's wording; "White-glove" follows the term's usual meaning. Confirm both
// with whoever owns onboarding before this ships.
const PERK_TOOLTIPS: Record<string, string> = {
  "Personalized onboarding": "Guided setup with our team.",
  "White-glove onboarding": "We set up your workspace for you.",
};

function itemText(item: PlanItem, billing: Billing): string {
  return typeof item === "string" ? item : item[billing];
}

/** Dollars a year saved by paying yearly, for a plan with two prices. */
function yearlySaving(plan: Plan) {
  return (plan.priceMonthly - plan.priceYearly) * 12;
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/**
 * A single odometer digit: a vertical 0–9 strip that slides to the target digit
 * whenever `value` changes, giving the firecrawl-style rolling price effect.
 */
function RollingDigit({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-[1em] overflow-hidden tabular-nums">
      {/* Invisible copy of the target digit sizes the column to THAT digit's
          natural width — otherwise a narrow "1" sat in a box as wide as the
          widest digit, leaving a gap before the next digit. The animated strip
          is overlaid absolutely and clipped to this width. */}
      <span aria-hidden className="invisible">
        {value}
      </span>
      <span
        className="absolute inset-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(-${value}em)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span
            key={n}
            className="flex h-[1em] items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  // Thousands separators as plain glyphs between the rolling digits, so $2,000
  // reads as one figure; the digits still roll, the comma just sits.
  const chars = value.toLocaleString("en-US").split("");
  return (
    <span className="inline-flex items-baseline text-4xl font-medium">
      <span>$</span>
      {chars.map((c, i) =>
        c === "," ? <span key={i}>,</span> : <RollingDigit key={i} value={Number(c)} />,
      )}
    </span>
  );
}

/**
 * One self-consistent grid of plan cards.
 *
 * Rendered twice — once with the Free tier and once without — because the cards
 * style their outer corners with `xl:first:`/`xl:last:`. Hiding the Free card
 * inside a single grid with CSS would leave `:first-child` matching a card that
 * isn't shown, so the rounded left edge would land on a hidden element and the
 * first visible card would square off.
 */
function PlanGrid({
  plans,
  billing,
  className,
}: {
  plans: Plan[];
  billing: Billing;
  className: string;
}) {
  return (
        <div
          // The side-by-side table starts at xl: five columns need the width.
          // Below it the plans stack in one column, as Notion, Vercel and
          // GitHub do, rather than running two up: five (or four) cards in
          // pairs always left one alone in a row, stretched or stranded. From
          // sm each card turns into a row — name, price and buttons on the
          // left, features on the right — so the width is used without any
          // card reading differently from the rest.
          className={`grid gap-6 xl:gap-0 xl:grid-rows-[auto_auto_auto_auto_auto_auto] ${
            plans.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-5"
          } ${className}`}
        >
        {plans.map((plan, idx) => {
          const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
          // The group heading: "Everything in Starter, plus" only while that
          // card is actually on the page. Signed-in visitors don't see Free, so
          // Starter has no card to build on and the heading is just "Features".
          const prevName = plans[idx - 1]?.name;
          // Original structure kept: filled header panel (price set 24px under
          // the description) → detached button → features. The only addition is an
          // outline around the WHOLE card (outer wrapper); the header panel no
          // longer carries its own border so the outline reads once, around all.
          return (
            <div
              key={plan.name}
              // Every card carries a subtle filled surface so the outline reads
              // as an edge rather than the brightest thing on the card. The
              // highlighted plan is marked only by its "Most popular" tag; its
              // border matches every other card so no card outshouts the rest.
              // The desktop grid drops the card fill so the four columns read as
              // one table on the light page. In dark that left the whole table
              // on the page's near-black with nothing but hairlines to hold it,
              // so there the fill stays on at every width.
              // sm–xl, the row: a two-column grid, the header panel and buttons
              // down the left, the features filling the right.
              className={`relative isolate sm:max-xl:grid sm:max-xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:max-xl:grid-rows-[auto_1fr] sm:max-xl:gap-x-6 flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 xl:grid xl:grid-cols-[minmax(0,1fr)] xl:grid-rows-subgrid xl:row-span-6 xl:rounded-none xl:border-y xl:border-l xl:border-r-0 xl:border-solid xl:border-border xl:bg-transparent xl:[[data-theme=dark]_&]:bg-card xl:p-6 xl:first:!rounded-l-xl xl:last:!rounded-r-xl xl:[&:last-child]:border-r`}
            >
              {/* Aurora wash blooming up from behind the header panel (-z-10
                  inside an isolated context). Every card carries one now, so the
                  four read as one set; only the highlighted plan's is brand
                  blue, the rest take a neutral gray at the same lengths. Hidden
                  for now at every width: the cards are flat, with a dotted rule
                  parting price from features instead. */}
              <div
                aria-hidden
                // Values shared with the four-card block the product pages
                // run, so the recommended plan cannot end up a different blue
                // on two pages. Only the lg fade, which follows this table's
                // taller subgrid, is this page's own.
                // Hidden on every card: the recommended plan is marked by its
                // ink outline, tag and button instead.
                className={`pointer-events-none absolute inset-0 -z-10 hidden ${
                  plan.highlighted
                    ? `${PLAN_WASH_BRAND} ${PLAN_WASH_BRAND_LG}`
                    : `${PLAN_WASH_NEUTRAL} ${PLAN_WASH_NEUTRAL_LG}`
                }`}
              />

              {/* Header panel holding the price block. Opaque, and squared off at
                  the bottom: it masks the middle of the bloom so the wash reads
                  as a halo around the panel rather than a tint across the card. */}
              <div
                // xl:bg-background is what hides this panel against the unfilled
                // desktop card while still masking the aurora. In dark the card
                // carries a fill, so the page black would read as a hole punched
                // in it — take the card's own tone there.
                // The recommended plan drops the opaque fill so its wash shows
                // through behind the name and price.
                className={`flex flex-col rounded-xl rounded-b-none border border-transparent sm:max-xl:col-start-1 sm:max-xl:row-start-1 ${
                  plan.highlighted
                    ? "bg-transparent"
                    : "bg-card xl:bg-background xl:[[data-theme=dark]_&]:bg-card"
                }`}
              >
                {/* Professional's title block takes the muted surface, edge to
                    edge down to the header rule, so the recommended plan is
                    marked by a quiet fill rather than an outline. -25px clears
                    the card padding and the panel's 1px border, as the rule
                    below does; on the tablet row it stops at the left column. */}
                <div
                  className={
                    plan.highlighted
                      ? "-mx-[25px] -mt-[25px] bg-muted px-[25px] pb-5 pt-[25px] sm:max-xl:mr-0 sm:max-xl:pr-0"
                      : undefined
                  }
                >
                  {/* Wraps: at the narrowest table widths Professional's square,
                      name and tag together outrun the column, so the tag drops
                      under the name rather than pushing the card's content past
                      its right padding. The card's single inner column is pinned
                      to the track (grid-cols-[minmax(0,1fr)]) for the same reason. */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <PlanIcon name={plan.name} />
                      <h3 className="text-lg font-medium">{plan.name}</h3>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                {/* Relume's header rule: edge to edge, so the name block reads
                    as the card's title bar and the price starts a new part.
                    -25px clears the card's padding and the panel's 1px
                    transparent border. On the tablet row it stops at the
                    left column. */}
                <div
                  aria-hidden
                  className={`-mx-[25px] border-t border-border sm:max-xl:mr-0 ${plan.highlighted ? "" : "mt-5"}`}
                />
                <div className="mt-5">
                  {/* "/month" sits on the price's baseline, as in the pricing
                      prototype, so the figure reads as a monthly rate at a
                      glance. Enterprise's figure is a floor: "Starting price"
                      goes on the line under it. */}
                  <p className="flex items-baseline gap-1">
                    <AnimatedPrice value={price} />
                    <span className="text-sm text-muted-foreground">/month</span>
                  </p>
                  {/* The saving, spelled out in dollars on every paid plan, on
                      both toggles: on yearly it confirms the choice, on monthly
                      it's what the visitor is passing up. One line on every
                      card (blank where there's nothing to say) so the subgrid
                      rows stay level. */}
                  {/* One line under every price, same spacing and same gray on
                      every card: "Billed yearly" / "Billed monthly" on the paid plans,
                      "Starting price" on Enterprise, blank on Free (min-h keeps
                      the rows level). On
                      yearly the saving leads it as the site's stat chip (as on the
                      case-study page: mono, uppercase, bg-muted, label muted and
                      value in ink), next to the price
                      where buyers look (as Luma and Melius place theirs). */}
                  <p className="mt-2 min-h-5 text-sm text-muted-foreground">
                    {plan.startingPrice
                      ? "Starting price"
                      : plan.priceMonthly > 0
                        ? billing === "yearly"
                          ? (
                            <>
                              <span className="mr-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide [[data-theme=dark]_&]:bg-white/[0.08]">
                                <span className="text-muted-foreground">Save</span>
                                <span className="text-foreground">{money(yearlySaving(plan))}</span>
                              </span>
                              Billed yearly
                            </>
                          )
                          : "Billed monthly"
                        : null}
                  </p>
                </div>
              </div>

              {/* Detached CTA — our standard rounded-lg button. One grid cell
                  (the table's second row), so a card without the secondary
                  button below it still lines up with the ones that have it. */}
              <div className="mt-6 flex flex-col gap-2 sm:max-xl:col-start-1 sm:max-xl:row-start-2 sm:max-xl:self-start xl:pb-6">
                {/* The recommended plan's button is solid --pricing-brand, as in the
                    pricing prototype; the rest take the outlined secondary, so
                    the eye lands on Pro first instead of on five black bars. */}
                <a
                  href={plan.ctaHref}
                  className={
                    plan.highlighted
                      ? "rounded-lg border border-transparent bg-[var(--pricing-brand)] px-5 py-2 text-center text-sm text-[var(--pricing-brand-on)] transition-opacity hover:opacity-90"
                      : "rounded-lg border border-foreground/20 bg-transparent px-5 py-2 text-center text-sm text-foreground transition-colors hover:bg-foreground/5"
                  }
                >
                  {plan.cta}
                </a>
                {/* Secondary demo CTA — the site's outlined secondary button (as
                    in pricing-cta.tsx), at the primary's size. The primary
                    carries a transparent border so the two stay one height. */}
                {plan.secondaryDemo && (
                  <a
                    href={DEMO_URL}
                    className="rounded-lg border border-foreground/20 bg-transparent px-5 py-2 text-center text-sm text-foreground transition-colors hover:bg-foreground/5"
                  >
                    {DEMO_CTA_LABEL}
                  </a>
                )}
              </div>

              {/* As a row, the groups stack in the right column, and from lg
                  sit side by side; the first loses its top rule, which would
                  otherwise run along the card's top edge. The FAQ's dotted rule,
                  stood upright down the column's left edge (and lying across
                  the top on a phone, where the features sit below), parts the features from the name and
                  price, in place of the aurora wash, which the row drops. */}
              <div
                className={`mt-6 flex flex-1 cursor-default flex-col px-2 pb-2 ${DOTTED_RULE_LEFT_ROW} ${DOTTED_RULE_TOP_UPRIGHT} max-sm:relative max-sm:before:absolute max-sm:before:inset-x-0 max-sm:before:top-0 max-sm:before:h-px max-sm:before:content-[''] sm:max-xl:col-start-2 sm:max-xl:row-span-2 sm:max-xl:row-start-1 sm:max-xl:mt-0 max-xl:px-0 sm:max-xl:relative sm:max-xl:pl-6 sm:max-xl:before:absolute sm:max-xl:before:inset-y-0 sm:max-xl:before:left-0 sm:max-xl:before:w-px sm:max-xl:before:content-[''] sm:max-xl:pt-0 lg:max-xl:grid lg:max-xl:grid-cols-3 lg:max-xl:items-start lg:max-xl:gap-x-8 xl:contents`}
              >
                {plan.featureGroups.map((group) => (
                  <div
                    key={group.label}
                    className={`border-t border-border pt-5 [&:not(:first-child)]:mt-5 max-sm:first:border-t-0 xl:first:relative xl:first:border-t-0 xl:first:before:absolute xl:first:before:inset-x-0 xl:first:before:top-0 xl:first:before:h-px xl:first:before:content-[''] ${DOTTED_RULE_TOP_TABLE} sm:max-xl:first:border-t-0 sm:max-xl:first:pt-0 lg:max-xl:border-t-0 lg:max-xl:pt-0 lg:max-xl:[&:not(:first-child)]:mt-0`}
                  >
                    <p className="text-sm font-medium">
                      {group.extendsPrevious && prevName
                        ? `Everything in ${prevName}, plus`
                        : group.label}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {group.items.map((item) => {
                        const text = itemText(item, billing);
                        return (
                          <li
                            key={text}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="mt-0.5">
                              <CheckIcon />
                            </span>
                            <span>{text}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {/* What only yearly billing adds, as the last group, under
                    Support — a plain list in the same style as the groups above
                    it. Yearly only: on monthly it goes entirely. It is the
                    table's last shared row, so plans without yearly extras need
                    no placeholder. */}
                {billing === "yearly" && plan.yearlyPerks?.length ? (
                  <div className="mt-5 border-t border-border pt-5 lg:max-xl:col-span-3">
                    <p className="text-sm font-medium">
                      Included with yearly billing
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {plan.yearlyPerks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="mt-0.5">
                            <CheckIcon />
                          </span>
                          {/* The info mark sits in the text flow, as in the compare
                              table, so it joins the last word instead of wrapping
                              onto a line of its own. */}
                          <span className="group relative text-balance">
                            {perk}
                            {PERK_TOOLTIPS[perk] && (
                              <>
                                <button
                                  type="button"
                                  aria-label={`About ${perk}`}
                                  className="ml-1.5 inline-flex translate-y-[2px] cursor-pointer text-muted-foreground/60 transition-colors hover:text-foreground"
                                >
                                  <InfoIcon />
                                </button>
                                {/* Opens upward: these lines close the card, and the card
                                    clips what hangs below it. Narrower than the compare
                                    table's so it stays inside the column. */}
                                <span role="tooltip" className={`${TOOLTIP} bottom-full !top-auto mb-1 !mt-0 w-max max-w-52`}>
                                  {PERK_TOOLTIPS[perk]}
                                </span>
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        </div>
  );
}

// The Yearly option's label, carrying the saving in brackets after it. Used
// in both copies of the label (the base buttons and the thumb's mirror strip),
// so the two stay the same width and the thumb's reveal lines up. One color
// with the rest of the label: a dimmed bracket read as grey-on-white on the
// inverted thumb.
function YearlyLabel() {
  return (
    <>
      <span className="md:hidden">
        Yearly (-{BEST_YEARLY_PCT}%)
      </span>
      <span className="hidden md:inline">
        Yearly (-{BEST_YEARLY_PCT}% off)
      </span>
    </>
  );
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    // No width cap: upright on a phone (<sm) a card fills the column, and
    // from sm each card is a row with its features beside the price.
    <div>
      {/* Billing toggle — enlarged on mobile (bigger tap targets, matches the
          left-aligned hero); settles back to the compact size on desktop. */}
      <div className="flex justify-start md:justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="relative grid w-full grid-cols-2 rounded-lg border border-border p-1 text-base md:inline-grid md:w-auto md:text-sm"
        >
          {/* Sliding thumb — carries the active-coloured labels inside a clipped
              window, so the highlight is REVEALED as the thumb glides rather
              than cross-fading the button text (which dipped through a
              low-contrast state on switch — the "blink"). The inner label strip
              counter-slides to stay aligned with the base labels below. */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-y-1 left-1 z-10 w-[calc(50%-0.25rem)] overflow-hidden rounded-md bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              billing === "yearly" ? "translate-x-full" : ""
            }`}
          >
            <span
              className={`absolute inset-0 grid w-[200%] grid-cols-2 text-background transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                billing === "yearly" ? "-translate-x-1/2" : ""
              }`}
            >
              <span className="flex items-center justify-center">
                Monthly
              </span>
              <span className="flex items-center justify-center">
                <YearlyLabel />
              </span>
            </span>
          </span>
          <button
            role="radio"
            aria-checked={billing === "monthly"}
            onClick={() => setBilling("monthly")}
            className="relative rounded-md px-5 py-1.5 text-center text-muted-foreground transition-colors hover:text-foreground md:px-3 md:py-1"
          >
            Monthly
          </button>
          <button
            role="radio"
            aria-checked={billing === "yearly"}
            onClick={() => setBilling("yearly")}
            className="relative rounded-md px-5 py-1.5 text-center text-muted-foreground transition-colors hover:text-foreground md:px-3 md:py-1"
          >
            <YearlyLabel />
          </button>
        </div>
      </div>

      {/* Plans — tucked closer under the toggle on mobile; roomier on desktop.
          Column count tracks the visible plans so hiding Free (signed-in)
          reflows to four even columns rather than leaving a gap. */}
      {/* The five-column table reaches into the page margin once there is
          margin to spare: whatever lies beyond a 24px gutter, up to 80px a
          side, so the columns gain width on wide screens while the page
          keeps its gutter. Nothing changes at 1280, where there is none. */}
      <div className={`mt-5 md:mt-12 ${PLAN_TABLE_BLEED} xl:overflow-hidden xl:rounded-xl`}>
        {/* Both variants ship and `data-authed` on <html> hides one before
            first paint (see globals.css). Choosing in an effect meant a
            signed-in visitor watched five cards render and then reflow to
            four. */}
        <PlanGrid plans={PLANS} billing={billing} className="unauth-only" />
        <PlanGrid plans={PAID_PLANS} billing={billing} className="auth-only" />
      </div>

    </div>
  );
}

// The plans with a monthly and a yearly price, i.e. the ones yearly changes.
const YEARLY_PLANS = PLANS.filter((p) => p.priceMonthly > p.priceYearly);

const BEST_YEARLY_PCT = Math.max(
  ...YEARLY_PLANS.map((p) => Math.round((1 - p.priceYearly / p.priceMonthly) * 100)),
);
