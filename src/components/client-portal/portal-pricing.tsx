import Link from "next/link";
import { CheckIcon } from "@/components/ui/check-icon";
import { Reveal } from "@/components/ui/reveal";
import { APP_URL, DEMO_URL, DEMO_CTA_LABEL } from "@/lib/constants";
import {
  PLAN_EDGE_BRAND,
  PLAN_WASH_BRAND,
  PLAN_WASH_NEUTRAL,
} from "@/components/pricing/plan-wash";

/**
 * A teaser, not a matrix: the full plan comparison is /pricing, and this
 * section exists only to take cost anxiety off the table, which appears in
 * roughly half of sales calls. Each tier carries three perks rather than its
 * whole feature list, so the four cards stay scannable.
 *
 * Names, prices, and perks are the live /pricing figures. Build credits are
 * deliberately left out: this page never explains them, so naming them raises
 * a question it cannot answer.
 */
type Tier = {
  name: string;
  price: string;
  cadence: string;
  perksLabel: string;
  perks: string[];
  cta: string;
  href: string;
  /** Takes the filled button rather than the outlined one. */
  recommended?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "Free forever",
    perksLabel: "Includes:",
    perks: ["5 active contacts", "3 apps"],
    cta: "Get started",
    href: APP_URL,
  },
  {
    name: "Starter",
    price: "$29",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Free, plus:",
    perks: ["50 active contacts", "API and MCP connector"],
    cta: "Get started",
    href: APP_URL,
  },
  {
    name: "Professional",
    price: "$99",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Starter, plus:",
    perks: ["Custom domain", "Assembly badge removed", "Automation builder"],
    cta: "Get started",
    href: APP_URL,
    recommended: true,
  },
  {
    name: "Advanced",
    price: "$499",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Professional, plus:",
    perks: ["Unlimited contacts", "HIPAA BAA", "Enforced MFA"],
    cta: DEMO_CTA_LABEL,
    href: DEMO_URL,
  },
];

/**
 * One shape, two copies of it. Every page runs the same priced cards; a page
 * whose plan set differs passes its own `tiers`, and the grid takes a column
 * per card so four and five both sit in one row.
 *
 * A rows-and-lines variant lived here briefly for the accounting page and is
 * gone: pricing is one object on this site, and a second treatment of it on a
 * vertical page makes the same plans look like different plans.
 */
export function PortalPricing({
  heading = "Start free. Build as you grow.",
  body = "The free plan never expires and includes real, publishable apps. Paid plans add contacts, apps, your own domain, and more as your firm grows.",
  link = { label: "See full pricing", href: "/pricing" },
  tiers = TIERS,
  aside,
}: {
  heading?: string;
  body?: string;
  link?: { label: string; href: string };
  tiers?: Tier[];
  /**
   * A plan that is not a priced card — no figure, no perk list, just a name, a
   * line and a way to start the conversation. It sits as one row under the
   * grid rather than as a fifth column: a fifth card costs the other four a
   * fifth of their width each, and at that width the perk labels wrap and the
   * shorter cards are mostly empty. It is also honest about the object, since
   * what this plan offers is a conversation rather than a price.
   */
  aside?: { name: string; line: string; cta: { label: string; href: string } };
} = {}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">{heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            {body}
          </p>
          <Link
            href={link.href}
            className="mt-6 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            {link.label}
          </Link>
        </div>

        {/* Four outlined cards rather than one tiled grid: the perk lists run
            to different lengths, and separate surfaces let each one end where
            it ends instead of stretching the whole row to the longest.

            Each one carries /pricing's own aurora wash, from the shared values
            in plan-wash.ts — the four cards here and the table there are the
            same object and were being drawn two different ways, which in dark
            left this block as flat outlines on the near-black while the table
            had a lit top edge. The recommended plan takes the brand blue and
            the tinted edge; the rest take the neutral at the same lengths, so
            the set still reads as four of one thing. */}
        <div className="mt-12 grid gap-4 min-[560px]:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              // isolate + overflow-hidden is what the wash needs: it sits on a
              // -z-10 layer, which without its own stacking context would go
              // behind the card instead of behind the card's contents.
              className={`relative isolate flex flex-col overflow-hidden rounded-2xl border border-border p-6 [[data-theme=dark]_&]:border-[#383838] ${
                tier.recommended ? PLAN_EDGE_BRAND : ""
              }`}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 -z-10 ${
                  tier.recommended ? PLAN_WASH_BRAND : PLAN_WASH_NEUTRAL
                }`}
              />
              <h3 className="text-lg">{tier.name}</h3>
              <p className="mt-2 text-3xl leading-none">{tier.price}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {tier.cadence}
              </p>

              <p className="mt-6 text-sm text-muted-foreground">
                {tier.perksLabel}
              </p>
              <ul className="mb-8 mt-3 space-y-2 text-sm">
                {tier.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-0.5">
                      <CheckIcon />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>

              {/* mt-auto floors the button, so the four line up across the row
                  however long each perk list runs. */}
              {/* The unrecommended plans take the site's standard secondary,
                  transparent over the card. The recommended one keeps the
                  filled button: inside the frame it is the one solid mark
                  against a white card, where an outline would have gone soft. */}
              <a
                href={tier.href}
                className={`mt-auto rounded-lg px-5 py-2 text-center text-sm ${
                  tier.recommended
                    ? "bg-foreground text-background transition-opacity hover:opacity-90"
                    : "border border-foreground/20 bg-transparent text-foreground transition-colors hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/25"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {aside ? (
          <div className="mt-4 flex flex-col items-start gap-4 rounded-2xl border border-border p-6 text-left sm:flex-row sm:items-center sm:justify-between [[data-theme=dark]_&]:border-[#383838]">
            <div>
              <h3 className="text-lg">{aside.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {aside.line}
              </p>
            </div>
            <a
              href={aside.cta.href}
              className="w-full shrink-0 rounded-lg border border-foreground/20 bg-transparent px-5 py-2 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto [[data-theme=dark]_&]:border-white/25"
            >
              {aside.cta.label}
            </a>
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}
