import { Accordion, type FAQEntry } from "@/components/home/faq";
import { Reveal } from "@/components/ui/reveal";

// Collapsed to their titles: four claims a reader scans to find the one that
// applies to them, and the detail under each only matters once they have.
const WAYS: FAQEntry[] = [
  {
    question: "Embed what you already use",
    answer:
      "Embed any link or dashboard inside your portal. Embeds do not count toward app limits.",
  },
  {
    question: "Connect what you run",
    answer: "Native integrations, plus Zapier and Make for the rest.",
  },
  {
    question: "Automate the busywork",
    answer:
      "An automation builder, so an action in one app fires a workflow.",
  },
  {
    question: "Drive it from anywhere",
    answer:
      "A full API and an MCP server that connect your workspace to ChatGPT, Claude, and other agents.",
  },
];

/**
 * De-risks the operator who already runs tools: you add Assembly, you do not
 * rip and replace. Integration questions came up in 60% of onboarding calls.
 */
export function PortalStack() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="md:self-start">
            <h2 className="type-h2 text-balance">
              Keep the tools you already use
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Embed the tools you love, connect what you run, automate the
              busywork, and drive everything from the API and MCP server.
            </p>
          </div>

          {/* The site's own accordion, in its ruled variant: same rows, same
              chevron and drawer timing as the FAQ, rather than a second
              collapsible built here. Pulled out to the right rail so the rules
              end on the page grid. */}
          {/* Held inside the column rather than bled to the rail, so the rules
              and the hover fill keep clear of the vertical guide. Drawn as
              pseudo-elements rather than borders: a 1px dotted border is too
              tightly set to read as dots. */}
          <div
            className={[
              "relative",
              // Opening rule.
              // A finer dot than `border-dotted`, which at 1px sets its dots
              // one pixel apart and reads as a broken hairline. 1.5px marks on
              // a 6px pitch, which is what the reference draws.
              "before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] before:bg-[repeating-linear-gradient(to_right,var(--border)_0_1.5px,transparent_1.5px_6px)]",
              // Each row: a rule beneath it, except the last.
              "[&>div>div]:relative [&>div>div]:border-b-0",
              "[&>div>div]:after:absolute [&>div>div]:after:inset-x-0 [&>div>div]:after:bottom-0 [&>div>div]:after:h-px [&>div>div]:after:content-['']",
              "[&>div>div]:after:bg-[repeating-linear-gradient(to_right,var(--border)_0_1.5px,transparent_1.5px_6px)]",
              "[&>div>div:last-child]:after:hidden",
              // Inset from the row's own edges, so the copy is not flush
              // against the hover fill while the rules still span the column.
              "[&>div>div>*]:pl-5 [&>div>div>*]:pr-5",
              // The whole row answers the pointer, not just the chevron.
              "[&>div>div]:transition-colors [&>div>div]:hover:bg-muted/50 [[data-theme=dark]_&]:[&>div>div]:hover:bg-white/[0.04]",
            ].join(" ")}
          >
            {/* flushTop off: the first row keeps its top padding like every
                other, so it sits off the opening rule rather than against it. */}
            <Accordion
              items={WAYS}
              twoColumn={false}
              variant="divided"
              flushTop={false}
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
