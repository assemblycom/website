import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";
import { VisualSlot } from "@/components/ui/visual-slot";

/**
 * Each segment named by the app they would actually build, and linked to the
 * real template behind it, so the section is a set of destinations rather than
 * four adjectives.
 */
const SEGMENTS = [
  {
    segment: "Agencies and creative studios",
    app: "A campaign approval flow",
    body: "Clients review and sign off on deliverables round by round.",
    href: "/templates/design-approvals",
  },
  {
    segment: "Accounting and bookkeeping",
    app: "A year-end document collection app",
    body: "A per-client checklist with upload tracking.",
    href: "/templates/document-collection",
  },
  {
    segment: "Consultants and coaches",
    app: "A client progress dashboard",
    body: "Milestones and outcomes per engagement.",
    href: "/templates/client-project-tracker",
  },
  {
    segment: "Legal, real estate, financial advisory",
    app: "A per-client onboarding wizard",
    body: "Saves progress across steps, next to a secure data room.",
    href: "/templates/client-onboarding-wizard",
  },
];

/**
 * The payoff: one portal, a different experience per client and per segment.
 *
 * This is also where the white-label keywords live. Branding is the number 3
 * value prop in the sales data, and per-client visibility is the reassurance
 * user interviews say buyers need most, so both are stated plainly rather than
 * left to the visual.
 */
export function PortalTailor() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <h2 className="type-h2 text-balance">
          One portal. A different experience for every client
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Control which apps each client and company sees, brand it on your own
          domain, and give each segment the workflow it actually needs.
        </p>

        {/* One tiled grid closed by its own rules, rather than four outlined
            cards floating in gaps: the four are one set, and the rules say so
            the way the rest of the page's grid does. */}
        <div className="-mx-6 mt-12 md:-mx-10">
          <div className={`hidden border-t md:block ${GRID_LINE}`} />
          <div className="grid sm:grid-cols-2">
            {SEGMENTS.map((item, i) => (
              <Link
                key={item.segment}
                href={item.href}
                className={`px-6 py-8 transition-colors hover:bg-muted md:px-10 md:py-12 ${GRID_LINE} ${
                  i > 0 ? "border-t" : ""
                } ${i % 2 === 1 ? "sm:border-l" : "sm:border-l-0"} ${
                  i >= 2 ? "sm:border-t" : "sm:border-t-0"
                }`}
              >
                <p className="type-eyebrow text-muted-foreground">
                  {item.segment}
                </p>
                <p className="mt-3 text-sm">{item.app}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </Link>
            ))}
          </div>
          <div className={`hidden border-t md:block ${GRID_LINE}`} />
        </div>

        <p className="mt-8 max-w-2xl text-muted-foreground">
          Your logo and colors on every plan. Your own domain, with the Assembly
          badge removed, on Pro and up.
        </p>

        <VisualSlot
          className="mt-10"
          label="Tailor visual"
          description="The same Brandmages portal chrome held constant while the main panel swaps per segment: an approval flow with round history, a document checklist with upload states, a progress dashboard with milestone bars, an onboarding wizard at step 3 of 6. A client switcher along the top shows three fictional clients, and selecting one changes which apps appear in the sidebar. A small inset shows the same portal re-themed under a second fictional brand on its own domain."
        />
      </Reveal>
    </section>
  );
}
