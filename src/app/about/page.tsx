import type { Metadata } from "next";
import Link from "next/link";
import {
  NoteImagePlaceholder,
  StoryNote,
} from "@/components/about/story-note";
import { StoryFigure } from "@/components/about/story-figures";
import { GridDivider, GridRails, GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { OG_IMAGE } from "@/lib/seo";

/**
 * The about page, written as an argument rather than a company profile: how
 * software for service firms used to work, what changed, and why the platform
 * is the half that still matters. Careers sit at the end because they are the
 * consequence of the story, not the reason for the page.
 *
 * Every factual claim comes from the company's own Contentful copy (the careers
 * page's description and FAQ, which state the mission, the office, the funding
 * stage, the customer count, and the rebrands). Nothing here is inferred: no
 * founding year, headcount, investor names, or funding figures, because none of
 * those are recorded anywhere this site reads. The story beats are positioning,
 * not new facts.
 */
export const revalidate = 3600;

const SEO = {
  title: "About",
  description:
    "For thirty years firms bought software built for someone else. Building it stopped being the expensive part. Assembly is the platform that makes what firms build real.",
  path: "/about",
};

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  alternates: { canonical: SEO.path },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SEO.title}`,
    description: SEO.description,
    url: `${SITE_URL}${SEO.path}`,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SEO.title}`,
    description: SEO.description,
    images: [OG_IMAGE.url],
  },
};

/**
 * Only figures the company states outright. Three rather than a four-up because
 * there is no honest fourth — headcount, founding year and funding raised are
 * not written down anywhere this site can read.
 */
const FACTS: { value: string; label: string }[] = [
  { value: "1,000+", label: "Paying customers" },
  { value: "Series A", label: "And post product-market fit" },
  { value: "New York", label: "Union Square" },
];

// Section band, matching the 1200px column the rails frame on every other page.
function Band({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`px-6 py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-[1200px] md:px-10">{children}</div>
    </section>
  );
}

/**
 * One chapter of the story: a numbered marker and a title on the left, the
 * argument and its figure on the right. The marker is the only ornament — it is
 * what tells the reader this is a sequence and not three unrelated sections.
 *
 * Chapters alternate the figure's side so the page has a rhythm without needing
 * a second layout.
 */
function Chapter({
  index,
  kicker,
  title,
  figure,
  flip = false,
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  figure: React.ReactNode;
  flip?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Band>
      {/* fade, not rise: the left column is sticky, and any transform on an
          ancestor (translate-y-0 included) would silently kill the stick. */}
      <Reveal variant="fade">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            {/* The site's stat chip, unchanged — number in ink, label in grey.
                See the case-study detail page and the customers review strip. */}
            <span className="inline-flex items-center gap-2.5 rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide [[data-theme=dark]_&]:bg-white/[0.08]">
              <span className="tabular-nums text-foreground">{index}</span>
              {/* A mono space is a full character wide, so at this tracking the
                  label's own word gap (7.5px) came out wider than the gap
                  separating it from the number — three loose items rather than a
                  number and a phrase. Tightened here, widened above. */}
              <span className="text-muted-foreground [word-spacing:-1.5px]">
                {kicker}
              </span>
            </span>
            <h2 className="type-h2 mt-5 text-balance">{title}</h2>
          </div>

          <div
            className={`flex max-w-2xl flex-col gap-8 ${flip ? "md:flex-col-reverse md:gap-8" : ""}`}
          >
            <div className="flex flex-col gap-5">{children}</div>
            <Reveal variant="fade" delayMs={160}>
              {figure}
            </Reveal>
          </div>
        </div>
      </Reveal>
    </Band>
  );
}

// The chapters' body copy is plain paragraphs at the site's lead size.
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-lead text-pretty text-muted-foreground">{children}</p>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] md:px-10">
          <div className="mx-auto max-w-3xl">
            {/* The page label, so the headline is free to be a story title
                rather than having to announce which page this is. Same chip as
                the chapter markers below. */}
            <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground [word-spacing:-1.5px] [[data-theme=dark]_&]:bg-white/[0.08]">
              About Assembly
            </span>
            <h1 className="type-display mt-5 text-balance">
              How firms get their software is changing
            </h1>
            <p className="type-lead mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
              For thirty years there was only one way to get it. This is what
              changed.
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <div className={`border-t ${GRID_LINE}`} />

        <Chapter
          index="01"
          kicker="How it used to work"
          title="Everyone ran on software built for someone else"
          figure={<StoryFigure />}
        >
          <P>
            For{" "}
            <StoryNote
              note={
                <>
                  Roughly: packaged business software through the SaaS era. The
                  shape of the period is the point, not the start date.
                </>
              }
            >
              thirty years
            </StoryNote>{" "}
            the only way to get software was to buy it. A firm picked whichever
            product came closest, and then spent years bending itself around the
            parts that never quite fit. The gap between how the firm actually
            worked and what its tools allowed did not close. It moved onto
            people: a spreadsheet beside the CRM, a folder of contracts nobody
            could find, an intake process held together by email.
          </P>
          <P>
            The tools were not bad. They were general, and they had to be.
            Building the specific thing a firm needed meant a budget, a roadmap,
            and engineers it was never going to hire, so almost nobody did it.
            &ldquo;Close enough&rdquo; became the permanent condition of running
            a business.
          </P>
        </Chapter>

        <GridDivider />

        <Chapter
          index="02"
          kicker="What changed"
          title="Building stopped being the expensive part"
          figure={<StoryFigure />}
          flip
        >
          <P>
            The cost of turning an idea into working software collapsed. Not to
            nothing, but far enough that the arithmetic is different. The thing a
            firm would never have commissioned, because it only mattered to
            eleven clients and one partner, is now worth describing out loud.
          </P>
          <P>
            That inverts the question every firm has been answering since the
            first SaaS contract. It used to be which tool do we buy. It is
            becoming what should we build. And the first answer is usually the
            thing they have wanted for years and could never justify.
          </P>
        </Chapter>

        <GridDivider />

        <Chapter
          index="03"
          kicker="Where we fit"
          title="The hard part is everything around the app"
          figure={<StoryFigure />}
        >
          <P>
            An app on its own does nothing for a firm. Client work needs clients
            who can sign in, payments that clear, contracts that hold, files that
            stay where you left them, and{" "}
            <StoryNote
              note={
                <>
                  Client users, team roles, and per-company access are part of
                  the platform rather than something each app re-implements.{" "}
                  <Link href="/security">How we handle it</Link>.
                </>
              }
            >
              permissions that still make sense when a client&rsquo;s assistant
              logs in
            </StoryNote>
            . None of that got cheaper. It is
            the reason most generated software never reaches a real customer.
          </P>
          <P>
            Assembly is that part.{" "}
            <StoryNote
              media={<NoteImagePlaceholder />}
              note={
                <>
                  Paying workspaces, not seats, across accounting, legal, real
                  estate, marketing, and consulting.{" "}
                  <Link href="/customers">See what some of them built</Link>.
                </>
              }
            >
              More than 1,000 firms
            </StoryNote>{" "}
            already run their client work on the platform: a branded portal where clients message, sign,
            pay, and follow along, and a dashboard where the firm runs it. So
            when a firm describes the app it needs, the app is not born in a
            sandbox. It arrives inside the portal those clients already use, with
            the firm&rsquo;s data, billing, and permissions attached.
          </P>
          <P>
            We think that is what the next decade of professional services looks
            like. Not firms choosing from a menu. Firms with software that fits
            them, and a platform underneath it that makes the software real.
          </P>
          <Link
            href="/customers"
            className="type-body group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {/* The rule belongs to the words, not the link: text-decoration on
                the anchor draws straight through the arrow, and `no-underline`
                on a descendant can't lift it back off. */}
            <span className="underline underline-offset-4">
              Read what firms have built
            </span>
            {/* PP Mori glyph arrow (the site's face) — not a drawn SVG. */}
            <span
              aria-hidden
              className="shrink-0 leading-none transition-transform duration-200 group-hover:translate-x-0.5"
            >
              &#8594;
            </span>
          </Link>
        </Chapter>

        <GridDivider />

        {/* The same hairline cell grid /security uses for its compliance seals —
            gap-px over a border-coloured bed, each cell repainting the page
            ground over it. */}
        <section className="mx-auto max-w-[1200px] px-6 md:max-[1199px]:px-10 min-[1200px]:px-0">
          <div
            className={`-mx-6 grid grid-cols-1 gap-px bg-border sm:mx-0 sm:grid-cols-3 [[data-theme=dark]_&]:bg-[#383838]`}
          >
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="flex flex-col items-center bg-background px-6 py-10 text-center md:py-14"
              >
                <span className="type-h2 tabular-nums text-foreground">
                  {fact.value}
                </span>
                <span className="type-caption mt-3 text-muted-foreground">
                  {fact.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={`border-t ${GRID_LINE}`} />

      <section className="px-6 py-16 text-center md:py-24">
        <h2 className="type-display mx-auto max-w-md text-balance text-foreground md:max-w-2xl">
          Come build it with us
        </h2>
        <p className="type-lead mx-auto mt-5 max-w-sm text-pretty text-muted-foreground sm:max-w-xl">
          We hire for high standards and real ownership, mostly in New York.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/jobs"
            className="rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90"
          >
            See open roles
          </Link>
        </div>
      </section>
    </>
  );
}
