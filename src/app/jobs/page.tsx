import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQ } from "@/components/home/faq";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { OG_IMAGE } from "@/lib/seo";
import { getCareersPage, getOpenRoles } from "@/lib/careers";

/**
 * The rule under a list row, drawn by the row itself so it lines up exactly with
 * the row's hover fill. Linear insets the rule and lets the fill hang wider,
 * which puts the two ends 32px out of agreement — the line above a hovered row
 * reads as a fragment. Here they share an edge instead.
 */
const ROW_RULE =
  "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-border [[data-theme=dark]_&]:after:bg-[#383838]";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * "September, 2025" → "Sep 2025". Formatted rather than rewritten in the frozen
 * copy so a date added later comes out the same way. Anything that isn't a
 * month-and-year passes through untouched.
 */
function shortDate(date: string) {
  const match = /^([A-Za-z]+),?\s+(\d{4})$/.exec(date.trim());
  if (!match) return date;
  const month = MONTHS.find((m) => m.toLowerCase() === match[1].toLowerCase());
  return month ? `${month.slice(0, 3)} ${match[2]}` : date;
}

// The site's tag chip. A chip already reads as its own item, so the lists set
// these side by side with a gap and no separator between them.
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground [word-spacing:-1.5px] [[data-theme=dark]_&]:bg-white/[0.08]">
      {children}
    </span>
  );
}

// The open roles come from Ashby, so the page has to re-resolve rather than being
// pinned at deploy — a role closing should take itself off the page.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCareersPage();
  if (!page) return {};
  const { title, description } = page.seo;
  return {
    title,
    description,
    alternates: { canonical: "/jobs" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} | ${title}`,
      description,
      url: `${SITE_URL}/jobs`,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} | ${title}`,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

function Band({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] md:px-10">{children}</div>
    </section>
  );
}

export default async function JobsPage() {
  const [page, roles] = await Promise.all([getCareersPage(), getOpenRoles()]);
  // The page's own copy lives in Contentful; without it there is nothing to show
  // but a bare list, so this is a 404 rather than a half-page.
  if (!page) notFound();

  return (
    <>
      <section className="px-6 pb-16 pt-24 text-center md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1200px] md:px-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="type-display text-balance">{page.title}</h1>
            {page.description && (
              <p className="type-lead mx-auto mt-6 max-w-2xl text-pretty text-muted-foreground">
                {page.description}
              </p>
            )}
          </div>
          {/* The photo keeps its own frame at every width. A tighter phone crop
              would cut people out of the ends of the group rather than make the
              faces any bigger. */}
          <div className="relative mt-10 aspect-[2512/1680] overflow-hidden rounded-lg bg-muted md:mt-14 [[data-theme=dark]_&]:bg-white/[0.04]">
            <Image
              src="/images/jobs-team-hero.jpg"
              alt="The Assembly team"
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              // A wide group shot at the default q75 smears the faces, which are
              // the only reason the photo is here.
              quality={90}
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

        <Band>
          <h2 className="type-h2">{page.sectionTitles.roles}</h2>
          {roles.length === 0 ? (
            // Ashby unreachable, or genuinely nothing open. Either way the honest
            // thing is to say so rather than list roles we can't confirm.
            <p className="type-lead mt-5 max-w-2xl text-muted-foreground">
              No open roles right now. Check back soon.
            </p>
          ) : (
            // The rules belong to the rows, inset to the text — the list only
            // draws the cap above the first one. See the row below.
            <ul className="mt-10 border-t border-border [[data-theme=dark]_&]:border-[#383838]">
              {roles.map((role) => {
                // Our own page when Contentful has written the role up;
                // otherwise the Ashby posting, which always exists.
                const href = role.slug ? `/jobs/${role.slug}` : role.jobUrl;
                const external = !role.slug;
                // Team and location only. Employment type and the salary band
                // wrapped this column onto two lines and are on the role's own
                // page anyway, where there is room to read them.
                const meta = [
                  role.department,
                  role.isRemote ? `${role.location} · Remote` : role.location,
                ].filter(Boolean);
                return (
                  <li key={role.title}>
                    <Link
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      // Linear's careers-list shape. The rule is the row's own
                      // ::after, inset to the text, so the hover band can sit
                      // 16px wider than it and read as a rounded plate lifting
                      // off the list rather than a rectangle wedged between two
                      // lines. The row hides its own rule while hovered, for the
                      // same reason. Dark needs its own tint: a 2% ink wash is
                      // invisible on the dark ground.
                      className={`group relative flex flex-col gap-2 px-4 py-6 transition-colors hover:bg-foreground/[0.04] sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-6 [[data-theme=dark]_&]:hover:bg-white/[0.05] ${ROW_RULE}`}
                    >
                      <span className="type-body text-foreground">
                        {role.title}
                      </span>
                      {/* One chip per fact, the site's tag pattern — a chip
                          already reads as a separate item, so the dots between
                          them were doing a job the shapes do. Left-aligned in
                          its own column so the facts line up down the list. */}
                      <span className="flex flex-wrap items-center gap-2">
                        {meta.map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </span>
                      <span className="type-caption hidden shrink-0 items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-foreground sm:flex">
                        Learn more
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        >
                          &#8594;
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Band>

        {page.media.length > 0 && (
          <>
            <GridDivider />
            <Band>
              <h2 className="type-h2">{page.sectionTitles.media}</h2>
              <ul className="mt-10 border-t border-border [[data-theme=dark]_&]:border-[#383838]">
                {page.media.map((item) => (
                  <li key={item.link}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative flex flex-col gap-1 px-4 py-5 transition-colors hover:bg-foreground/[0.04] sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] sm:items-center sm:gap-6 [[data-theme=dark]_&]:hover:bg-white/[0.05] ${ROW_RULE}`}
                    >
                      <span className="type-body text-foreground">
                        {item.name}
                      </span>
                      {/* Right-aligned: with no third column to hold the row's
                          right edge, left-aligning these left them stranded
                          mid-row. */}
                      <span className="flex flex-wrap items-center gap-2 sm:justify-end">
                        {[item.author, item.date && shortDate(item.date)]
                          .filter(Boolean)
                          .map((v) => (
                            <Tag key={v}>{v}</Tag>
                          ))}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Band>
          </>
        )}

        {page.benefits.length > 0 && (
          <>
            <GridDivider />
            <Band>
              <h2 className="type-h2">{page.sectionTitles.benefits}</h2>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {page.benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-[8px] bg-muted p-5"
                  >
                    <h3 className="type-h4 text-foreground">{benefit.title}</h3>
                    <p className="type-body mt-2 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </Band>
          </>
        )}

        {page.faqs.length > 0 && (
          <>
            <GridDivider />
            <FAQ
              heading="Frequently asked questions"
              items={page.faqs}
              twoColumn
            />
          </>
        )}

        {/* Nothing closes the grid here: the footer opens on a full-bleed rule,
            and a rail-capped GridDivider on top of it read as two lines. */}
      </div>
    </>
  );
}
