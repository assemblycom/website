import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";

/**
 * A four-chip teaser, not a matrix: the full plan comparison is /pricing, and
 * this section exists only to take cost anxiety off the table, which appears in
 * roughly half of sales calls.
 *
 * Figures come from the brief and still need checking against the live pricing
 * page before this ships, in particular which plan unlocks a custom domain
 * versus badge removal. Build credits are deliberately not mentioned: this page
 * never explains them, so naming them raises a question it cannot answer.
 */
const TIERS = [
  { name: "Free", price: "$0", note: "Never expires. Real, publishable apps." },
  { name: "Starter", price: "$29", note: "More clients and more apps." },
  { name: "Pro", price: "$99", note: "Custom domain and white-label." },
  { name: "Advanced", price: "$499", note: "HIPAA BAA and enforced MFA." },
];

export function PortalPricing() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="type-h2 text-balance">Start free. Build as you grow.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              The free plan never expires and includes real, publishable apps.
              Paid plans add your own domain, more clients, and more apps.
            </p>
          </div>
          <Link
            href="/pricing"
            className="hidden shrink-0 rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground md:inline-block"
          >
            See full pricing
          </Link>
        </div>

        {/* One tiled grid closed by its own rules rather than four outlined
            chips, so the four plans read as one ladder. The rules have to be
            re-declared per breakpoint because the column count changes: four
            across, then two, then one. */}
        <div className="-mx-6 mt-12 md:-mx-10">
          <div className={`hidden border-t md:block ${GRID_LINE}`} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier, i) => (
              <div
                key={tier.name}
                className={`px-6 py-8 md:px-10 md:py-12 ${GRID_LINE} ${
                  i > 0 ? "border-t" : ""
                } ${i % 2 === 1 ? "sm:border-l" : "sm:border-l-0"} ${
                  i >= 2 ? "sm:border-t" : "sm:border-t-0"
                } ${i > 0 ? "lg:border-l" : "lg:border-l-0"} lg:border-t-0`}
              >
                <p className="type-eyebrow text-muted-foreground">{tier.name}</p>
                <p className="mt-3 text-2xl leading-none">{tier.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.name === "Free"
                    ? "forever"
                    : "per month, billed annually"}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {tier.note}
                </p>
              </div>
            ))}
          </div>
          <div className={`hidden border-t md:block ${GRID_LINE}`} />
        </div>
      </Reveal>
    </section>
  );
}
