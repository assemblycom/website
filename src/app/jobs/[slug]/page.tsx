import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GridRails } from "@/components/ui/grid-lines";
import { RichText } from "@/components/ui/rich-text";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { OG_IMAGE } from "@/lib/seo";
import { getJobListings, getRole } from "@/lib/careers";

export const revalidate = 3600;

export async function generateStaticParams() {
  // Every written-up role, including any whose posting has since closed — those
  // render as a redirect, which still needs the route to exist.
  const listings = await getJobListings();
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = await getRole(slug);
  if (!role) return {};

  const title = `${role.listing.name} · Careers`;
  const description = role.posting
    ? `${role.listing.name} at Assembly — ${[role.posting.location, role.posting.employmentType].filter(Boolean).join(", ")}.`
    : `${role.listing.name} at Assembly.`;

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${slug}` },
    // A closed role redirects, so it must not invite indexing on the way.
    ...(role.posting ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: `${SITE_NAME} | ${title}`,
      description,
      url: `${SITE_URL}/jobs/${slug}`,
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

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = await getRole(slug);
  if (!role) notFound();

  const { listing, posting } = role;
  // No live Ashby posting means the role has closed. The URL keeps working — it
  // has been linked and indexed — but it sends people to what IS open instead of
  // showing a salary band and an apply button that lead nowhere.
  if (!posting) redirect("/jobs");

  // Labelled rows for the aside, rather than one run-on line: the aside has a
  // column to itself, so each fact can be read on its own.
  const details = [
    { label: "Team", value: posting.department },
    {
      label: "Location",
      value: posting.isRemote
        ? `${posting.location} · Remote`
        : posting.location,
    },
    { label: "Type", value: posting.employmentType },
    { label: "Compensation", value: posting.compensation },
  ].filter((d) => Boolean(d.value));

  const applyButton = (
    <a
      href={posting.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90"
    >
      Apply for this role
    </a>
  );

  return (
    <>
      <section className="px-6 pb-12 pt-24 text-center md:pb-16 md:pt-32">
        <div className="mx-auto max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="type-caption text-muted-foreground"
          >
            <Link
              href="/jobs"
              className="transition-colors hover:text-foreground"
            >
              Careers
            </Link>
            <span aria-hidden className="px-2 text-foreground/30">
              /
            </span>
            <span className="text-foreground">{listing.name}</span>
          </nav>

          {/* The facts and the apply button live in the aside below, which
              follows you down the page — repeating them here would be two of
              everything above the fold. */}
          <h1 className="type-display mt-6 text-balance">{listing.name}</h1>
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />

        <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
          {/* Vercel's job-page shape: the description keeps the wide column and
              the role's facts sit in a card beside it that follows the scroll,
              so applying is never something you have to scroll back up for.
              Columns are placed explicitly rather than by source order — the
              aside comes first in the DOM so it opens the page on a phone,
              where there is no second column to put it in. */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <aside className="lg:col-start-2 lg:row-start-1 lg:h-fit lg:sticky lg:top-28">
              <div className="rounded-xl border border-border p-6 [[data-theme=dark]_&]:border-[#383838]">
                <dl className="flex flex-col gap-4">
                  {details.map((detail) => (
                    <div key={detail.label}>
                      <dt className="type-caption text-muted-foreground">
                        {detail.label}
                      </dt>
                      <dd className="type-body mt-1 text-foreground">
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6">{applyButton}</div>
              </div>
            </aside>

            {/* Bullet list, one tone, no bold — scoped here rather than changed in
                RichText, whose hairline marker belongs to the glossary pages
                that also use it. A job description is a list of things you'd
                do, so a dot per line reads better than a dash, and the bold
                lead-ins were splitting every bullet into two voices. */}
            <article className="max-w-2xl lg:col-start-1 lg:row-start-1 [&_b]:font-normal [&_strong]:font-normal [&_li]:before:top-[0.62em] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:rounded-full [&_li]:before:bg-foreground/40">
              <RichText document={listing.description} />
            </article>
          </div>
        </div>

        {/* Nothing closes the grid here: the footer opens on a full-bleed rule,
            and a rail-capped GridDivider on top of it read as two lines. */}
      </div>
    </>
  );
}
