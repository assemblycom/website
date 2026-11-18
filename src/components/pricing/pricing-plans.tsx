"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/check-icon";
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
import { PlanGlow } from "@/components/pricing/plan-glow";

// Some lines follow the billing toggle: Advanced's credits become unlimited
// building on yearly. A line with an extra fee reads "X included" and carries
// the fee in a tooltip, which can itself follow the toggle (seat prices).
type BillingText = string | { yearly: string; monthly: string };
type PlanItem =
  | string
  | { yearly: string; monthly: string }
  | { text: string; fee: BillingText };

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
          { text: "5 apps included", fee: "Extra apps: +$8/app" },
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
            text: "3 internal users included",
            fee: {
              yearly: "Extra users: +$39/user",
              monthly: "Extra users: +$49/user",
            },
          },
          { text: "10 apps included", fee: "Extra apps: +$8/app" },
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
            text: "5 internal users included",
            fee: {
              yearly: "Extra users: +$59/user",
              monthly: "Extra users: +$79/user",
            },
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

// Professional carries the table's only solid button (--pricing-brand, which
// inverts in dark); every other button is a quiet outline.
const BUTTON_SOLID =
  "border-transparent bg-[var(--pricing-brand)] text-[var(--pricing-brand-on)] hover:opacity-90";
const BUTTON_OUTLINE =
  "border-foreground/15 bg-transparent text-foreground hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/10";

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

function pick(text: BillingText, billing: Billing): string {
  return typeof text === "string" ? text : text[billing];
}

function itemText(item: PlanItem, billing: Billing): string {
  if (typeof item === "string") return item;
  return "text" in item ? item.text : item[billing];
}

/**
 * A plan line. One with an extra fee ("3 internal users included") wears the
 * site's dotted underline and shows the fee on hover or focus, so the card
 * reads as what you get and the price of more is one hover away.
 */
function PlanLine({ item, billing }: { item: PlanItem; billing: Billing }) {
  if (typeof item === "string" || !("fee" in item)) {
    return <span>{itemText(item, billing)}</span>;
  }
  return (
    <span className="group relative">
      <span
        tabIndex={0}
        className="cursor-help underline decoration-muted-foreground/60 decoration-dotted underline-offset-4 outline-none"
      >
        {item.text}
      </span>
      <span role="tooltip" className={`${TOOLTIP} w-max`}>
        {pick(item.fee, billing)}
      </span>
    </span>
  );
}

// The soft callout under each paid price, squared off (rounded-md) like the
// site's tags. Tinted from the ink so it reads on the white columns,
// Professional's gray and dark mode alike.
const PRICE_CALLOUT =
  "inline-flex items-center whitespace-nowrap text-sm text-foreground underline decoration-dashed decoration-foreground/40 underline-offset-4";

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
      {/* Transparent copy of the target digit sizes the column to THAT digit's
          natural width — otherwise a narrow "1" sat in a box as wide as the
          widest digit, leaving a gap before the next digit. It is also the only
          real text, so crawlers and screen readers read "$2,000" instead of
          every digit in the strip. The animated strip is overlaid absolutely
          and clipped to this width. */}
      <span className="text-transparent">{value}</span>
      <span
        aria-hidden
        className="absolute inset-0 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(-${value}em)` }}
      >
        {/* Strip digits are drawn by CSS, not text, so they stay out of the
            page's readable content. */}
        {Array.from({ length: 10 }, (_, n) => (
          <span
            key={n}
            data-digit={n}
            className="flex h-[1em] items-center justify-center leading-none before:content-[attr(data-digit)]"
          />
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
  onYearly,
  className,
}: {
  plans: Plan[];
  billing: Billing;
  onYearly: () => void;
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
          // Dark mode: solid lines and dotted rules step down, since the
          // light-mode weights read as bright stripes on near-black.
          className={`grid gap-6 xl:gap-0 xl:grid-rows-[auto_auto_auto_auto_auto_auto] [[data-theme=dark]_&]:[--border:rgba(255,255,255,0.07)] [[data-theme=dark]_&]:[--dotted-rule:rgba(255,255,255,0.16)] ${
            plans.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-5"
          } ${className}`}
        >
        {plans.map((plan, idx) => {
          const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
          // The group heading: "Everything in Starter, plus" only while that
          // card is actually on the page. Signed-in visitors don't see Free, so
          // Starter has no card to build on and the heading is just "Features".
          const prevName = plans[idx - 1]?.name;
          // What paying yearly gets: the saving, then any yearly-only extras.
          // Shown on BOTH toggles: on yearly it confirms what the choice
          // includes, on monthly it is what you're leaving on the table, with
          // a button that flips the toggle. Free and Enterprise
          // have no saving, so they get nothing.
          const hasSaving = plan.priceMonthly > plan.priceYearly;
          // Only plans with yearly-only perks pitch yearly billing; Starter's
          // saving alone isn't worth a callout, so it just states the bill.
          const hasYearlyOffer = hasSaving && (plan.yearlyPerks?.length ?? 0) > 0;
          // How the plan is billed, as a pill: what the year costs on yearly;
          // on monthly, the yearly saving, as a button that flips the toggle.
          // Under the price at every width.
          const billingPill = !hasSaving || (billing === "monthly" && !hasYearlyOffer) ? null : billing === "yearly" ? (
            <span className="cursor-default text-sm text-muted-foreground">
              Billed yearly at {money(plan.priceYearly * 12)}
            </span>
          ) : (
            <button
              type="button"
              onClick={onYearly}
              className={`${PRICE_CALLOUT} cursor-pointer transition-colors hover:decoration-foreground`}
            >
              Save {money(yearlySaving(plan))} with yearly
            </button>
          );
          // Plain line for the cards with no callout, so every price has a
          // line under it; only clickable callouts carry the dashed underline.
          const billingNote = billingPill ?? (
            <span className="cursor-default text-sm text-muted-foreground">
              {plan.priceMonthly === 0
                ? "Free forever"
                : plan.startingPrice
                  ? "Starting price"
                  : billing === "yearly"
                    ? `Billed yearly at ${money(plan.priceYearly * 12)}`
                    : "Billed monthly"}
            </span>
          );
          const yearlyList = hasYearlyOffer ? (
            <div className="flex flex-1 flex-col">
              <p className="text-sm font-medium">
                {billing === "yearly"
                  ? "Included with yearly billing"
                  : "With yearly billing"}
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {[`Save ${money(yearlySaving(plan))} a year`, ...(plan.yearlyPerks ?? [])].map(
                  (perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-0.5">
                        <CheckIcon />
                      </span>
                      {/* One line: the perks are short, and a wrapped
                          perk read as two items. */}
                      <span className="whitespace-nowrap">{perk}</span>
                    </li>
                  ),
                )}
              </ul>
              {billing === "monthly" && (
                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    onClick={onYearly}
                    className={`w-full rounded-lg border px-5 py-2 text-center text-sm transition ${BUTTON_OUTLINE}`}
                  >
                    Switch to yearly
                  </button>
                </div>
              )}
            </div>
          ) : null;
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
              className={`relative isolate sm:max-xl:grid sm:max-xl:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:max-xl:grid-rows-[auto_1fr] sm:max-xl:gap-x-6 flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border p-6 xl:grid xl:grid-cols-[minmax(0,1fr)] xl:grid-rows-subgrid xl:row-span-6 xl:rounded-none xl:border-y xl:border-l xl:border-r-0 xl:border-solid xl:border-border xl:p-6 bg-card xl:bg-transparent xl:[[data-theme=dark]_&]:bg-card xl:first:!rounded-l-xl xl:last:!rounded-r-xl xl:[&:last-child]:border-r`}
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

              {/* The plan's header: a rounded panel inset in the column, name
                  at the top and price at the bottom. Professional's panel is
                  the sign-up screen's animated rim glow, and stays light in dark mode, so its ink is pinned to the brand
                  black; the brand's text rules allow only black on its colors,
                  so the secondary lines go black here too. It and
                  the buttons reach 12px into the card's padding, so the
                  panel sits close to the column edges. */}
              <div
                className={`-mx-3 -mt-3 flex flex-col rounded-xl p-5 sm:max-xl:col-start-1 sm:max-xl:row-start-1 ${
                  plan.highlighted
                    ? "relative isolate overflow-hidden bg-[#f6f7f9] [--foreground:#101010] [--muted-foreground:#101010] text-foreground"
                    : "bg-muted [[data-theme=dark]_&]:bg-[var(--surface-2)]"
                }`}
              >
                {plan.highlighted && (
                  // The sign-up screen's own mask: the glow fades in from the panel gray
                  // instead of starting on the bars' flat top edge.
                  <PlanGlow className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent_30%,#000_85%)]" />
                )}
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                {/* Price, then one line saying how it's billed. On monthly
                    the paid plans' line is a button that flips the toggle. */}
                <div className="mt-auto pt-10">
                  <p className="flex items-baseline gap-1">
                    <AnimatedPrice value={price} />
                    <span className="cursor-default text-sm text-muted-foreground">/month</span>
                  </p>
                  <div className="mt-1 flex h-6 items-center text-sm">
                    {billingNote}
                  </div>
                </div>
              </div>

              {/* Buttons: the second row, right under the panel. */}
              <div className="-mx-3 flex flex-col sm:max-xl:col-start-1 sm:max-xl:row-start-2 sm:max-xl:self-start xl:pb-6">
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={plan.ctaHref}
                    className={`rounded-lg border px-5 py-2 text-center text-sm transition ${
                      plan.highlighted ? BUTTON_SOLID : BUTTON_OUTLINE
                    }`}
                  >
                    {plan.cta}
                  </a>
                  {plan.secondaryDemo && (
                    <a
                      href={DEMO_URL}
                      className={`rounded-lg border px-5 py-2 text-center text-sm transition ${BUTTON_OUTLINE}`}
                    >
                      {DEMO_CTA_LABEL}
                    </a>
                  )}
                </div>
              </div>

              {/* As a row, the groups stack in the right column, and from lg
                  sit side by side; the first loses its top rule, which would
                  otherwise run along the card's top edge. The FAQ's dotted rule,
                  stood upright down the column's left edge (and lying across
                  the top on a phone, where the features sit below), parts the features from the name and
                  price, in place of the aurora wash, which the row drops. */}
              <div
                className={`mt-6 flex flex-1 cursor-default flex-col px-2 pb-2 ${DOTTED_RULE_LEFT_ROW} ${DOTTED_RULE_TOP_UPRIGHT} max-sm:relative max-sm:before:absolute max-sm:before:inset-x-0 max-sm:before:top-0 max-sm:before:h-px max-sm:before:content-[''] sm:max-xl:col-start-2 sm:max-xl:row-span-2 sm:max-xl:row-start-1 sm:max-xl:mt-0 max-xl:px-0 sm:max-xl:relative sm:max-xl:pl-6 sm:max-xl:before:absolute sm:max-xl:before:-inset-y-6 sm:max-xl:before:left-0 sm:max-xl:before:w-px sm:max-xl:before:content-[''] sm:max-xl:pt-0 lg:max-xl:grid lg:max-xl:grid-cols-3 lg:max-xl:items-start lg:max-xl:gap-x-8 xl:contents`}
              >
                {plan.featureGroups.map((group, gi) => (
                  <div
                    key={group.label}
                    // From lg the groups sit three across; all but the last span
                    // two rows so the yearly list can sit straight under Support.
                    className={`${gi < plan.featureGroups.length - 1 ? "lg:max-xl:row-span-2" : ""} border-t border-border pt-5 [&:not(:first-child)]:mt-5 max-sm:first:border-t-0 xl:first:relative xl:first:border-t-0 xl:first:pt-6 xl:first:before:absolute xl:first:before:inset-x-0 xl:first:before:top-0 xl:first:before:h-px xl:first:before:content-[''] ${DOTTED_RULE_TOP_TABLE} sm:max-xl:first:border-t-0 sm:max-xl:first:pt-0 lg:max-xl:border-t-0 lg:max-xl:pt-0 lg:max-xl:[&:not(:first-child)]:mt-0`}
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
                            <PlanLine item={item} billing={billing} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                {/* Under Support on phone and tablet; from lg, where the groups
                    sit three across, in Support's column. On a phone it's a
                    tinted footer, ruled full width, like the desktop row. */}
                {yearlyList && (
                  <div className="mt-5 max-sm:-mx-3 rounded-xl bg-muted p-5 text-sm [[data-theme=dark]_&]:bg-[var(--surface-2)] lg:max-xl:col-start-3 xl:hidden">
                    {yearlyList}
                  </div>
                )}
              </div>

              {/* Yearly footer (desktop): the table's last row, ruled off like
                  the price row, on both toggles. Free and Enterprise keep an
                  empty cell so the row's top rule still runs across every
                  column. Below xl the same panel sits under Support instead,
                  inside the features. */}
              {/* Tinted edge to edge on the plans that pitch yearly, so the
                  offer reads as its own row rather than another feature group.
                  In dark it's one solid surface a step above every column,
                  so it reads the same on the recommended column and beside it. */}
              {/* Ruled off edge to edge so the line joins across columns;
                  the panel below takes the header panel's inset, fill and
                  corners. */}
              <div className="-mx-6 -mb-3 mt-6 hidden border-t border-border px-3 pt-3 xl:flex xl:flex-col">
                {yearlyList && (
                  <div className="flex flex-1 flex-col rounded-xl bg-muted p-5 text-sm [[data-theme=dark]_&]:bg-[var(--surface-2)]">
                    {yearlyList}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        </div>
  );
}

// The Yearly option's label: "Yearly" and the saving in a small pill. Used in
// both copies of the label (the base buttons and the thumb's mirror strip), so
// the two stay the same width and the thumb's reveal lines up. The pill is
// tinted from the text colour, so it reads on the plain track and on the
// inverted thumb alike.
function YearlyLabel() {
  return (
    <span className="inline-flex items-center gap-1.5">
      Yearly
      <span className="rounded-full bg-[color-mix(in_srgb,currentColor_15%,transparent)] px-1.5 text-xs leading-5">
        -{YEARLY_PCT_FLOOR}%
      </span>
    </span>
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
            className={`pointer-events-none absolute inset-y-1 left-1 z-10 w-[calc(50%-0.25rem)] overflow-hidden rounded-md bg-foreground [[data-theme=dark]_&]:bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
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
        <PlanGrid
          plans={PLANS}
          billing={billing}
          onYearly={() => setBilling("yearly")}
          className="unauth-only"
        />
        <PlanGrid
          plans={PAID_PLANS}
          billing={billing}
          onYearly={() => setBilling("yearly")}
          className="auth-only"
        />
      </div>

    </div>
  );
}

// The plans with a monthly and a yearly price, i.e. the ones yearly changes.
const YEARLY_PLANS = PLANS.filter((p) => p.priceMonthly > p.priceYearly);

const BEST_YEARLY_PCT = Math.max(
  ...YEARLY_PLANS.map((p) => Math.round((1 - p.priceYearly / p.priceMonthly) * 100)),
);

// The toggle's "-40%": the best saving rounded down to a ten.
const YEARLY_PCT_FLOOR = Math.floor(BEST_YEARLY_PCT / 10) * 10;
