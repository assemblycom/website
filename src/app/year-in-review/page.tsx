import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { CustomersCta } from "@/components/customers/customers-cta";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/components/home/cta";
import { YearField } from "@/components/year-in-review/year-field";
import { CodeBlock } from "@/components/year-in-review/code-block";
import {
  DataTable,
  type DataRow,
} from "@/components/year-in-review/data-table";
import {
  Figure,
  ImagePlaceholder,
} from "@/components/year-in-review/placeholder";

// Placeholder copy and figures throughout, so the layout can be reviewed before
// the real piece is written.
export const metadata: Metadata = pageMetadata({
  title: "Looking back on 2026",
  description:
    "What we built, who built with us, and what we learned in 2026 at Assembly.",
  path: "/year-in-review",
});

const WEBHOOK_SAMPLE = `import { Assembly } from "@assembly-js/node-sdk";

const assembly = new Assembly({ apiKey: process.env.ASSEMBLY_API_KEY });

// Runs whenever a client finishes onboarding
assembly.webhooks.on("client.onboarded", async (event) => {
  await assembly.tasks.create({
    clientId: event.data.clientId,
    name: "Schedule a kickoff call",
  });
});`;

const NUMBER_COLUMNS = ["2024", "2025", "2026"];
const NUMBER_ROWS: DataRow[] = [
  { label: "Workspaces", values: ["4,210", "6,980", "11,450"] },
  {
    label: "Clients served through portals",
    values: ["182,000", "310,500", "524,800"],
  },
  { label: "Apps built", values: ["n/a", "2,140", "38,620*"] },
  { label: "Median time to a first app", values: ["n/a", "41 min", "9 min"] },
  { label: "Payments processed", values: ["$410M", "$690M", "$1.2B"] },
  { label: "Median first response", values: ["3h 10m", "1h 45m", "38m"] },
];

// Wide elements break out of the reading column to one shared width, centred
// on it, the way the blog's announcement covers do.
const WIDE = "relative left-1/2 w-[min(100vw-3rem,64rem)] -translate-x-1/2";
// The reading column, with the blog's article type and no orphaned last words.
const PROSE = "post-body [&_:is(p,blockquote)]:text-pretty [&_h2]:text-balance";

export default function YearInReviewPage() {
  return (
    <article className="px-6 pb-24 pt-4 md:px-10 md:pb-32 md:pt-6">
      {/* The hero: a centred stack of date, title and deck over a field of
          squares that lights up around the cursor, the way OpenAI opens its
          research posts. The field is the artwork, so there is no cover image. */}
      <section className="relative mx-auto max-w-[80rem] py-24 md:py-36">
        <YearField />
        <header className="relative mx-auto max-w-[64rem] text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-sm bg-muted px-2.5 py-1 text-xs uppercase leading-none tracking-[0.06em] text-muted-foreground [font-family:var(--font-diatype-mono),ui-monospace,monospace] [[data-theme=dark]_&]:bg-white/[0.06]">
              Company
            </span>
            <p className="type-body text-muted-foreground">December 15, 2026</p>
          </div>
          <h1 className="type-display-xl mt-5 text-balance text-foreground">
            Looking back on 2026
          </h1>
          <p className="type-lead mx-auto mt-5 max-w-[34rem] text-balance text-muted-foreground md:text-lg">
            What we built, who built with us, and what we learned along the way.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#letter" className={PRIMARY_CTA}>
              Read the letter
            </a>
            <a href="#numbers" className={SECONDARY_CTA}>
              See the numbers
            </a>
          </div>
        </header>
      </section>

      <div className="mx-auto mt-8 max-w-[40.5rem] md:mt-12">
        <div className={PROSE}>
          <h2 id="letter" className="!mt-0">
            A letter from the founders
          </h2>
          <p>
            A year ago we wrote that service firms deserved software shaped
            around how they actually work. This year we tried to earn that
            sentence. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Most of what follows is about the product, but the real story of
            2026 is the firms that took a bet on us. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
          <p>
            When the year started, most firms we spoke to ran their client work
            across six or seven tools: one for messages, one for files, one for
            invoices, and a spreadsheet holding the rest together. Their clients
            felt every seam. Our job was to remove as many of those seams as we
            could without asking anyone to change how they work.
          </p>
          <p>
            Some of that work was obvious and some of it surprised us. Firms did
            not want more features so much as fewer places to look. They wanted
            the portal to look like their firm, the CRM to remember what their
            team already knew, and a way to build the small tools their practice
            needed that no vendor would ever sell them.
          </p>
          <p>
            We are grateful, a little tired, and more excited about next year
            than we have been about any year before it. What follows is our
            account of the year: the numbers, the releases, the customers who
            shaped them and the team who built them.
          </p>
          <p className="text-muted-foreground">
            Placeholder Name and Placeholder Name, cofounders
          </p>
        </div>

        <Figure
          className={cn(WIDE, "mt-16")}
          ratio="aspect-[16/9]"
          caption="Placeholder caption. The team at the fall offsite."
        />

        <div className={cn(PROSE, "mt-16")}>
          <h2 id="numbers">The year in numbers</h2>
          <p>
            Growth is not the point, but it is a good way to see how many firms
            trusted us with their clients. More workspaces opened on Assembly
            this year than in the two years before it combined, and the firms
            that joined brought their clients with them.
          </p>
          <p>
            The table below sets this year against the two before it. We chose
            the measures we look at every week, not the ones that make the best
            headline.
          </p>
        </div>

        <div className="mt-10">
          <DataTable
            columns={NUMBER_COLUMNS}
            rows={NUMBER_ROWS}
            highlight={2}
            notes={[
              "* Includes apps started from a template. All figures are placeholders.",
            ]}
          />
        </div>

        <div className={cn(PROSE, "mt-12")}>
          <p>
            The number we watch most closely is the time it takes a firm to
            build its first app. It fell from forty minutes to under ten, and
            most of that came from <Link href="/templates">templates</Link>.
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit.
          </p>

          <h2 id="shipped">What we shipped</h2>
          <p>
            Four quarters, one theme: give firms the parts they need and a way
            to build the parts nobody sells. The{" "}
            <Link href="/ai-app-builder">app builder</Link> left beta in the
            spring, the CRM learned companies and archiving, and the client
            portal got a new editor and a mobile app.
          </p>
        </div>

        <div className={cn(WIDE, "mt-12 grid gap-6 md:grid-cols-2")}>
          <Figure
            ratio="aspect-[4/3]"
            caption="Placeholder caption. Templates in the app builder."
          />
          <Figure
            ratio="aspect-[4/3]"
            caption="Placeholder caption. The new client portal editor."
          />
        </div>

        <div className={cn(PROSE, "mt-12")}>
          <p>
            Most of the year went into the parts firms touch every day. Each
            release started with the same question: what are firms still doing
            by hand, and what would it take to stop?
          </p>
          <ul>
            <li>
              The <Link href="/ai-app-builder">app builder</Link> left beta in
              April and now builds from templates, so a firm starts from a
              working intake form or tracker and shapes it by chat instead of
              starting from a blank page.
            </li>
            <li>
              The <Link href="/client-portal">client portal</Link> got a new
              editor, themes that follow a firm&apos;s brand, and a mobile app,
              so clients can upload a document or approve an invoice from their
              phone.
            </li>
            <li>
              The CRM learned companies, archiving and custom views. A firm can
              now see every contact at a client in one place and set aside the
              relationships that have ended without losing their history.
            </li>
            <li>
              Billing added retainers, refunds and usage pricing, which covers
              most of the ways our customers charge their own clients.
            </li>
          </ul>
          <p>
            On the platform side, the{" "}
            <a href="https://docs.assembly.com/reference">public API</a> gained
            webhooks and an MCP server, so firms can connect Assembly to the
            tools they already use. A few lines are enough to turn an event like{" "}
            <code>client.onboarded</code> into work for the team:
          </p>
        </div>

        <CodeBlock
          className="mt-8"
          language="TypeScript"
          code={WEBHOOK_SAMPLE}
        />

        <div className={cn(PROSE, "mt-8")}>
          <p>
            Firms used it to wire Assembly into their accounting, scheduling and
            document tools. Neque porro quisquam est, qui dolorem ipsum quia
            dolor sit amet, consectetur, adipisci velit.
          </p>

          <h2 id="customers">Built by our customers</h2>
          <p>
            The apps we are proudest of this year are ones we did not build.
            Once firms could describe a tool and have it running the same
            afternoon, they started building things we had never thought to put
            on a roadmap.
          </p>
          <p>
            A few patterns showed up again and again across accounting, legal,
            consulting and real estate firms:
          </p>
          <ul>
            <li>
              Onboarding flows that collect documents, signatures and payment
              details in one place, replacing a chain of emails that used to
              take weeks.
            </li>
            <li>
              Client dashboards that show the status of every open engagement,
              so clients stop writing in to ask where things stand.
            </li>
            <li>
              Internal trackers for deadlines, filings and approvals, built by
              the people who use them rather than requested from someone else.
            </li>
          </ul>
          <p>
            You can see many of them on our{" "}
            <Link href="/customers">customers page</Link>, and several became
            templates that other firms now start from.
          </p>
          <blockquote>
            We replaced four tools in a month, and our clients noticed before we
            told them.
            <footer>
              <cite>Placeholder Name</cite>, Placeholder Firm
            </footer>
          </blockquote>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati.
          </p>
        </div>

        <Figure
          className={cn(WIDE, "mt-12")}
          ratio="aspect-[21/9]"
          caption="Placeholder caption. A customer's onboarding app, built in an afternoon."
        />

        <div className={cn(PROSE, "mt-16")}>
          <h2 id="team">The team behind it</h2>
          <p>
            We grew from a small team to a slightly less small one, and kept the
            habits that got us here. Everyone still talks to customers, and
            every engineer still ships to production in their first week.
          </p>
          <p>
            We opened our first office, hired across design, engineering,
            support and sales, and met in person twice. Support kept pace with
            that growth: the median time to a first reply fell from almost two
            hours to under forty minutes, with the same people answering who
            build the product.
          </p>
          <p>
            We are still hiring. If this year sounds like work you would want to
            do, our <Link href="/jobs">jobs page</Link> has the open roles.
          </p>
        </div>

        <div
          className={cn(WIDE, "mt-10 grid grid-cols-2 gap-4 md:grid-cols-3")}
        >
          <ImagePlaceholder ratio="aspect-[3/4]" />
          <ImagePlaceholder ratio="aspect-[3/4]" />
          <ImagePlaceholder
            ratio="aspect-[3/4]"
            className="col-span-2 md:col-span-1"
          />
        </div>

        <div className={cn(PROSE, "mt-16")}>
          <h2 id="ahead">Looking ahead to 2027</h2>
          <p>
            Next year is about depth: fewer new surfaces, and the ones we have
            made sharper. The CRM, the client portal and the app builder grew up
            side by side this year. In 2027 they start working as one, so an app
            a firm builds on Monday can read its clients, bill them and report
            back without anyone stitching the pieces together.
          </p>
          <p>
            We also want the app builder to keep up with the firms using it.
            That means updates that reach apps already in use, templates shaped
            by what customers actually built, and better answers when an app
            needs to change. Itaque earum rerum hic tenetur a sapiente delectus,
            ut aut reiciendis voluptatibus maiores alias consequatur.
          </p>
          <p>
            None of this happens without the firms who wrote in, filed requests,
            joined calls and put their clients on Assembly when it was still
            new. Thank you for building with us this year. We can&apos;t wait to
            show you what comes next, and we will see you in 2027.
          </p>
        </div>
      </div>

      <div className="-mx-6 -mb-24 mt-20 md:-mx-10 md:-mb-32 md:mt-28">
        <div className="border-t border-border" />
        <CustomersCta />
      </div>
    </article>
  );
}
