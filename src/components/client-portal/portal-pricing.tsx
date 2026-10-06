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
 * Two shapes from one section. /client-portal passes nothing and gets the four
 * priced cards. A page whose brief lists the plans as one line each passes
 * `plans`, and the section renders those instead — no figures, because a page
 * that does not explain a price should not print one it would have to keep in
 * step with /pricing.
 */
export function PortalPricing({
  heading = "Start free. Build as you grow.",
  body = "The free plan never expires and includes real, publishable apps. Paid plans add contacts, apps, your own domain, and more as your firm grows.",
  link = { label: "See full pricing", href: "/pricing" },
  plans,
}: {
  heading?: string;
  body?: string;
  link?: { label: string; href: string };
  /** One line per plan, in place of the priced cards. */
  plans?: { name: string; line: string }[];
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
            it ends instead of stretching the whole row to the longest. Every
            card is the same object — the recommended plan is marked only by its
            filled button, so none of the four outshouts the rest, the same
            restraint the full pricing table keeps. */}
        {plans ? (
          /* One row per plan: the name, then what that plan adds. Rows rather
             than cards, because five cards of one sentence each is five mostly
             empty boxes, and these carry no price to anchor a card on. */
          <ul className="mx-auto mt-12 max-w-3xl divide-y divide-border [[data-theme=dark]_&]:divide-[#383838]">
            {plans.map((plan) => (
              <li
                key={plan.name}
                className="flex flex-col gap-1 py-4 text-left sm:flex-row sm:gap-6"
              >
                <span className="shrink-0 text-foreground sm:w-40">
                  {plan.name}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {plan.line}
                </span>
              </li>
            ))}
          </ul>
        ) : (
        <div className="mt-12 grid gap-4 min-[560px]:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-2xl border border-border p-6 [[data-theme=dark]_&]:border-[#383838]"
            >
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
        )}
      </Reveal>
    </section>
  );
}
