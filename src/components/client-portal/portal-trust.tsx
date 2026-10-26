import { Accordion, type FAQEntry } from "@/components/home/faq";
import { QUIET_BUTTON } from "@/components/ui/quiet-button";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";
import { SecurityCompliance } from "@/components/security/security-compliance";
import { TRUST_CENTER_URL } from "@/lib/constants";

/**
 * The claims a safety-first buyer checks, collapsed to their titles.
 *
 * Set as rows rather than as one block of prose, the way the stack section
 * above does it: these are three separate questions, and the HIPAA answer in
 * particular is a boundary a covered entity has to read in full. As a paragraph
 * it was six lines of qualification sitting under a one-line claim; as a drawer
 * it is there for the reader it is written for and out of the way of everyone
 * else.
 */
const CLAIMS: FAQEntry[] = [
  {
    question: "Encryption",
    answer: "Client data is encrypted in transit and at rest.",
  },
  {
    question: "Per-client permissions",
    answer:
      "Clients see only their own data. Permissions follow your contact and company records.",
  },
  {
    question: "Multi-factor authentication",
    answer:
      "Multi-factor authentication is available on every plan, with enforced MFA and an audit log on Advanced.",
  },
  {
    question: "HIPAA",
    // Shortened without losing a claim. The old wording opened on "ready-made
    // apps that do not use AI" and then said it again in full a sentence
    // later; the boundary is stated once now, and "because the build process
    // uses AI" went with it since the rule above it already gives the reason.
    answer:
      "HIPAA compliance with a BAA on the Advanced plan. Ready-made apps like secure messaging, file sharing, and contracts can handle PHI as long as they do not use AI. Apps built with the AI app builder are not covered. If you are a covered entity, talk to us and we will map what fits.",
  },
];

/** Clears the safety-first buyer's objections. */
export function PortalTrust({
  heading = "Enterprise-grade security for your client data",
  body = "SOC 2 Type II certified, with HIPAA, GDPR, and CCPA support. Encrypted in transit and at rest, with client-level permissions and MFA on every plan.",
  claims = CLAIMS,
  link = { label: "Visit the Trust Center", href: TRUST_CENTER_URL },
  omitSeals,
  visual,
}: {
  heading?: string;
  body?: string;
  claims?: FAQEntry[];
  link?: { label: string; href: string };
  /** Seal titles to leave out of the compliance band. */
  omitSeals?: string[];
  /**
   * Fills the right column when `claims` is empty — for a brief that makes the
   * security case in its paragraph rather than in rows a reader opens.
   */
  visual?: React.ReactNode;
} = {}) {
  const external = link.href.startsWith("http");
  return (
    <section className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10 md:pt-24">
      <Reveal>
        {/* Same two-column shape as the stack section: claim and its way out on
            the left, the rows that answer it on the right. */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="md:self-start">
            <h2 className="type-h2 text-balance">{heading}</h2>
            <p className="mt-5 max-w-md text-muted-foreground">{body}</p>
            <a
              href={link.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={`mt-6 ${QUIET_BUTTON}`}
            >
              {link.label}
            </a>
          </div>

          {/* The same accordion treatment as the stack section above, so the
              two sets of rows on this page read as one control.

              The row HOVER used to be declared here as well, reaching into the
              accordion's markup to tint `[&>div>div]`. The accordion carries
              its own now, so this one has gone: two tints on one row stacked
              into a darker, squarer patch on the only page that set both, and a
              hover is the kind of thing that should have one definition rather
              than one per caller. The padding overrides stay — those are this
              section's own measure, not a second opinion on a shared state. */}
          {claims.length ? (
            // NO PADDING OVERRIDE. This used to carry
            // `[&>div>div>*]:pl-5 [&>div>div>*]:pr-5`, and it misaligned the
            // rows: the selector reaches the question button and the answer's
            // outer wrapper, but the answer has its own `pl-3` a level deeper,
            // which the override cannot see. So the question indented to 20px
            // and the answer to 20 + 12 = 32, and every open row set its copy
            // 12px right of the label above it.
            //
            // Dropping it rather than chasing the inner padding with a deeper
            // selector: the accordion's own `px-3` already aligns the two, and
            // without the override this list is pixel-identical to the FAQ
            // further down the page — which is what the note below says these
            // rows are for.
            <div>
              <Accordion
                items={claims}
                twoColumn={false}
                variant="divided"
                dottedRules
                flushTop={false}
                justifyAnswers
              />
            </div>
          ) : (
            visual
          )}
        </div>

        {/* The certifications close the argument the rows just made. Pulled
            out past the section's padding so the band's outer cells land on the
            rails, and opened by its own rule. It closes on the section divider
            instead of drawing a second one, so the section carries no bottom
            padding: the band runs to the end of it. */}
        <div className={`-mx-6 mt-14 border-t md:-mx-10 ${GRID_LINE}`}>
          <SecurityCompliance omit={omitSeals} />
        </div>
      </Reveal>
    </section>
  );
}
