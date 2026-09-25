import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";

const WAYS = [
  {
    title: "Embed what you already use",
    body: "Embed any link or dashboard inside your portal. Embeds do not count toward app limits.",
  },
  {
    title: "Connect what you run",
    body: "Native integrations, plus Zapier and Make for the rest.",
  },
  {
    title: "Automate the busywork",
    body: "An automation builder, so an action in one app fires a workflow.",
  },
  {
    title: "Drive it from anywhere",
    body: "A full API and an MCP server that connect your workspace to ChatGPT, Claude, and other agents.",
  },
];

/**
 * De-risks the operator who already runs tools: you add Assembly, you do not
 * rip and replace. Integration questions came up in 60% of onboarding calls.
 *
 * The closing line is a deliberate limit, not hedging. App-to-app connections
 * today often still go through the automation builder or middleware, so the
 * page says so rather than claiming everything talks to everything.
 */
export function PortalStack() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="md:self-start">
            <h2 className="type-h2 text-balance">
              Keep the tools you already use.
            </h2>
            <p className="mt-5 max-w-md text-muted-foreground">
              Embed the tools you love, connect what you run, automate the
              busywork, and drive everything from the API and MCP server.
            </p>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Apps connect to the same client records. Connections between apps
              today may use the automation builder or middleware.
            </p>
          </div>

          <ul className={`divide-y rounded-xl border ${GRID_LINE} divide-border [[data-theme=dark]_&]:divide-[#383838]`}>
            {WAYS.map((way) => (
              <li key={way.title} className="p-5">
                <p className="text-sm">{way.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {way.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
