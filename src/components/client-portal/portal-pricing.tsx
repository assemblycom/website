import Link from "next/link";
import { CheckIcon } from "@/components/ui/check-icon";
import { Reveal } from "@/components/ui/reveal";
import { APP_URL, DEMO_URL, DEMO_CTA_LABEL } from "@/lib/constants";

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
  recommended?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "Free",
    cadence: "Never expires",
    perksLabel: "Includes:",
    perks: ["5 active contacts", "30+ pre-made apps", "Real, publishable apps"],
    cta: "Get started",
    href: APP_URL,
  },
  {
    name: "Starter",
    price: "$29",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Free, plus:",
    perks: ["50 active contacts", "API and MCP connector", "Add-on build credits"],
    cta: "Get started",
    href: APP_URL,
  },
  {
    name: "Professional",
    price: "$99",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Starter, plus:",
    perks: ["Custom domains", "Remove Assembly badge", "Automation builder"],
    cta: "Get started",
    href: APP_URL,
    recommended: true,
  },
  {
    name: "Advanced",
    price: "$499",
    cadence: "per month, billed annually",
    perksLabel: "Everything in Professional, plus:",
    perks: ["Unlimited active contacts", "HIPAA compliance (BAA)", "Enforced MFA"],
    cta: DEMO_CTA_LABEL,
    href: DEMO_URL,
  },
];

export function PortalPricing() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            Start free. Build as you grow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
            The free plan never expires and includes real, publishable apps.
            Paid plans add your own domain, more clients, and more apps.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            See full pricing
          </Link>
        </div>

        {/* Four filled cards rather than one tiled grid: the perk lists run to
            different lengths, and separate surfaces let each one end where it
            ends instead of stretching the whole row to the longest. Only the
            recommended plan's tag marks it out, so no card outshouts the rest —
            the same restraint the full pricing table keeps. */}
        <div className="mt-12 grid gap-4 min-[560px]:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl bg-muted p-6 [[data-theme=dark]_&]:bg-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg">{tier.name}</h3>
                {/* The site's shared chip. Its usual muted fill is this card's
                    own surface, so it takes the page tone instead and reads as
                    a tag rather than dissolving into the card. Set in the body
                    face at full strength: mono caps in muted grey on a fill
                    barely off the card was the one thing on the card you could
                    not read. */}
                {tier.recommended ? (
                  <span className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-1 text-xs leading-none text-foreground [[data-theme=dark]_&]:border-white/10 [[data-theme=dark]_&]:bg-white/[0.06]">
                    Recommended
                  </span>
                ) : null}
              </div>
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
              <a
                href={tier.href}
                className={`mt-auto rounded-lg px-5 py-2 text-center text-sm transition-opacity hover:opacity-90 ${
                  tier.recommended
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-foreground"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
