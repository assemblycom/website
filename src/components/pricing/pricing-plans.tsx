"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/check-icon";
import { SIGNUP_URL, DEMO_URL, DEMO_CTA_LABEL } from "@/lib/constants";
import {
  PLAN_EDGE_BRAND,
  PLAN_WASH_BRAND,
  PLAN_WASH_BRAND_LG,
  PLAN_WASH_NEUTRAL,
  PLAN_WASH_NEUTRAL_LG,
} from "@/components/pricing/plan-wash";

interface PlanFeatureGroup {
  label: string;
  items: string[];
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
}

const PLANS: Plan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Free forever for your first clients",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "5 active contacts",
          "1 internal user",
          "75 build credits / month",
        ],
      },
      {
        label: "Includes",
        items: [
          "CRM",
          "Client experience",
          "App builder",
          "30+ pre-made apps",
          "Messaging and team inbox",
          "Billing and payments",
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
    priceMonthly: 49,
    priceYearly: 29,
    description: "For solo entrepreneurs",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "50 active contacts",
          "1 internal user",
          "200 build credits / month",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "MCP connector",
          "More included credits",
          "Add-on build credits",
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
    priceMonthly: 139,
    priceYearly: 99,
    description: "For small teams",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "500 active contacts",
          "3 internal users included",
          "200 build credits / month",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "Custom domains",
          "API access",
          "Remove Assembly badge",
          "App visibility",
          "Automation builder",
          "AI model selection",
        ],
      },
      {
        label: "Support",
        items: ["Priority email support"],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    secondaryDemo: true,
    highlighted: true,
  },
  {
    name: "Advanced",
    priceMonthly: 599,
    priceYearly: 499,
    description: "For scaling businesses",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "Unlimited active contacts",
          "5 internal users included",
          "200 build credits / month",
        ],
      },
      {
        label: "Features",
        extendsPrevious: true,
        items: [
          "Audit log",
          "Client access permissions",
          "Enforced MFA",
          "HIPAA compliance (BAA)",
        ],
      },
      {
        label: "Support",
        items: [
          "Priority email support",
          "Priority call support",
          "Personalized onboarding",
        ],
      },
    ],
    cta: "Get started",
    ctaHref: SIGNUP_URL,
    secondaryDemo: true,
    highlighted: false,
  },
  {
    name: "Enterprise",
    priceMonthly: 2000,
    priceYearly: 2000,
    description: "For firms with custom needs",
    featureGroups: [
      {
        label: "Fundamentals",
        items: [
          "Unlimited active contacts",
          "Unlimited internal users",
          "Custom build credits",
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

function planSubtitle(plan: Plan, billing: Billing) {
  if (plan.priceMonthly === 0) return "Free forever";
  if (plan.startingPrice) return "Starting price";
  return billing === "yearly" ? "Billed annually" : "Billed monthly";
}

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
          // Two up from 560 rather than sm's 640: between those widths a single
          // column left the cards running the full width of the page with the
          // price stranded on one side of it.
          // The side-by-side table starts at xl, not lg: five columns need the
          // width, and below it the cards run two up (the odd one out spans the
          // row) rather than squeezing to ~180px each.
          className={`grid gap-6 min-[560px]:grid-cols-2 xl:gap-0 xl:grid-rows-[auto_auto_auto_auto_auto] ${
            plans.length === 4 ? "xl:grid-cols-4" : "xl:grid-cols-5"
          } ${className}`}
        >
        {plans.map((plan, idx) => {
          const price = billing === "yearly" ? plan.priceYearly : plan.priceMonthly;
          // The card AFTER the highlighted one drops its gray left divider, so
          // it doesn't double the highlighted card's blue right edge.
          const dropLeftDivider = plans[idx - 1]?.highlighted;
          // Two-up (560–1279) with an odd number of cards leaves the last one
          // alone in its row at half width. It takes the whole row instead, and
          // from md its three groups sit side by side so it doesn't read as a
          // stretched column.
          const spansRow = plans.length % 2 === 1 && idx === plans.length - 1;
          // The group heading: "Everything in Starter, plus" only while that
          // card is actually on the page. Signed-in visitors don't see Free, so
          // Starter has no card to build on and the heading is just "Features".
          const prevName = plans[idx - 1]?.name;
          // Original structure kept: filled header panel (price pinned to the
          // bottom) → detached button → features. The only addition is an
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
              className={`${
                spansRow ? "min-[560px]:max-xl:col-span-2 " : ""
              }relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card p-4 xl:grid xl:grid-rows-subgrid xl:row-span-5 xl:rounded-none xl:border-y xl:border-l xl:border-r-0 xl:border-solid xl:border-border xl:bg-transparent xl:[[data-theme=dark]_&]:bg-card xl:p-6 xl:first:!rounded-l-xl xl:last:!rounded-r-xl xl:[&:last-child]:border-r ${
                dropLeftDivider ? "xl:[[data-theme=dark]_&]:border-l-0" : ""
              } ${
                plan.highlighted
                  ? `${PLAN_EDGE_BRAND} xl:[[data-theme=dark]_&]:border-r xl:[[data-theme=dark]_&]:[border-image:linear-gradient(to_bottom,rgba(125,164,255,0.55),#383838_75%)_1]`
                  : ""
              }`}
            >
              {/* Aurora wash blooming up from behind the header panel (-z-10
                  inside an isolated context). Every card carries one now, so the
                  four read as one set; only the highlighted plan's is brand
                  blue, the rest take a neutral gray at the same lengths. */}
              <div
                aria-hidden
                // Values shared with the four-card block the product pages
                // run, so the recommended plan cannot end up a different blue
                // on two pages. Only the lg fade, which follows this table's
                // taller subgrid, is this page's own.
                className={`pointer-events-none absolute inset-0 -z-10 ${
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
                className="flex min-h-[200px] flex-col justify-between rounded-xl rounded-b-none border border-transparent bg-card p-5 xl:bg-background xl:[[data-theme=dark]_&]:bg-card"
              >
                <div>
                  <h3 className="text-lg font-medium">{plan.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <AnimatedPrice value={price} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {planSubtitle(plan, billing)}
                  </p>
                </div>
              </div>

              {/* Detached CTA — our standard rounded-lg button. One grid cell
                  (the table's second row), so a card without the secondary
                  button below it still lines up with the ones that have it. */}
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={plan.ctaHref}
                  className="rounded-lg bg-foreground px-5 py-2 text-center text-sm text-background transition-opacity hover:opacity-90"
                >
                  {plan.cta}
                </a>
                {/* Secondary demo CTA — the outlined button the closing CTA
                    below the table uses, so "Book a demo" is one look. */}
                {plan.secondaryDemo && (
                  <a
                    href={DEMO_URL}
                    className="rounded-lg border border-foreground/20 bg-transparent px-5 py-2 text-center text-sm text-foreground transition-colors hover:bg-foreground/5"
                  >
                    {DEMO_CTA_LABEL}
                  </a>
                )}
              </div>

              <div
                className={`mt-6 flex flex-1 cursor-default flex-col px-2 pb-2 xl:contents ${
                  spansRow
                    ? "md:max-xl:grid md:max-xl:grid-cols-3 md:max-xl:items-start md:max-xl:gap-x-8"
                    : ""
                }`}
              >
                {plan.featureGroups.map((group) => (
                  <div
                    key={group.label}
                    className={`border-t border-border pt-5 [&:not(:first-child)]:mt-5 ${
                      spansRow ? "md:max-xl:[&:not(:first-child)]:mt-0" : ""
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {group.extendsPrevious && prevName
                        ? `Everything in ${prevName}, plus`
                        : group.label}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2.5">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="mt-0.5">
                            <CheckIcon />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        </div>
  );
}

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    // Cap the width only while the cards are in one column (<560px), so a lone
    // card doesn't stretch across a small tablet. Past that the grid is two up
    // and the cap has to lift, or the pair sits squeezed into 448px with the
    // page's margins going to waste on either side.
    <div className="mx-auto max-w-md min-[560px]:max-w-none">
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
                <span className="hidden md:inline">Pay&nbsp;</span>Monthly
              </span>
              <span className="flex items-center justify-center">
                <span className="hidden md:inline">Pay&nbsp;</span>Yearly
              </span>
            </span>
          </span>
          <button
            role="radio"
            aria-checked={billing === "monthly"}
            onClick={() => setBilling("monthly")}
            className="relative rounded-md px-5 py-2 text-center text-muted-foreground transition-colors hover:text-foreground md:px-4 md:py-1.5"
          >
            <span className="hidden md:inline">Pay&nbsp;</span>Monthly
          </button>
          <button
            role="radio"
            aria-checked={billing === "yearly"}
            onClick={() => setBilling("yearly")}
            className="relative rounded-md px-5 py-2 text-center text-muted-foreground transition-colors hover:text-foreground md:px-4 md:py-1.5"
          >
            <span className="hidden md:inline">Pay&nbsp;</span>Yearly
          </button>
        </div>
      </div>

      {/* Plans — tucked closer under the toggle on mobile; roomier on desktop.
          Column count tracks the visible plans so hiding Free (signed-in)
          reflows to four even columns rather than leaving a gap. */}
      <div className="mt-5 md:mt-12 xl:overflow-hidden xl:rounded-xl">
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
