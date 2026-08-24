import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  entryBodyHtml,
  entryHeadline,
  getUpdate,
  getUpdates,
  standfirst,
} from "@/lib/ghost";
import { formatEntryDate } from "@/lib/updates";
import { pageMetadata } from "@/lib/seo";

/**
 * One changelog entry, on a page of its own.
 *
 * These existed on the old site and were linked to from release notes, emails
 * and support threads, so they are URLs the web already points at. They are also
 * what sitemap-updates.xml lists: a sitemap of listing pages tells a crawler
 * where the pagination is, not where the content is.
 */

export async function generateStaticParams() {
  return (await getUpdates()).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getUpdate(slug);
  if (!entry) return {};
  return pageMetadata({
    title: entryHeadline(entry),
    description: standfirst(entry),
    path: `/updates/${entry.slug}`,
  });
}

export default async function UpdateEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entries = await getUpdates();
  const at = entries.findIndex((entry) => entry.slug === slug);
  if (at === -1) notFound();

  const entry = entries[at];
  // Newest first, so the entry before this one in the list is the later release.
  const newer = entries[at - 1];
  const older = entries[at + 1];

  return (
    // The changelog's own rail, so an entry read on its own page sits exactly
    // where it sat on the listing.
    <article className="mx-auto max-w-[1600px] px-6 pb-20 pt-12 md:px-10 md:pb-24 md:pt-16">
      <p className="type-caption text-muted-foreground">
        <Link
          href="/updates"
          className="transition-colors hover:text-foreground"
        >
          Updates
        </Link>
      </p>

      {/* The listing's two-column entry, kept: the date in the left rail, the
          entry on its 40.5rem measure beside it. */}
      <div className="mt-10 lg:grid lg:grid-cols-[16rem_minmax(0,40.5rem)] lg:gap-x-[10.5rem]">
        {/* The same muted mono chip the listing dates each entry with. */}
        <time
          dateTime={entry.date}
          className="mb-3 block w-fit whitespace-nowrap rounded-md bg-muted px-2.5 py-1.5 font-mono text-[13px] uppercase tracking-wide text-muted-foreground lg:sticky lg:top-28 lg:mb-0 lg:self-start [[data-theme=dark]_&]:bg-white/[0.08]"
        >
          {formatEntryDate(entry.date)}
        </time>

        <div>
          {/* The heading the entry already opened with, promoted to the page's
              own. It keeps the h2 step it renders at on the listing, so the
              same entry reads at the same size in both places. */}
          <h1 className="type-h2 text-balance text-foreground">
            {entryHeadline(entry)}
          </h1>

          <div
            className="post-body updates-entry mt-6"
            dangerouslySetInnerHTML={{ __html: entryBodyHtml(entry) }}
          />

          {/* The changelog is read as a stream, so an entry on its own page
              keeps the two steps along it. Same pair, same order as the
              listing's paginator: back in time on the right. */}
          {(newer || older) && (
            <nav
              aria-label="Changelog entries"
              className="mt-16 flex items-center justify-between gap-6 border-t border-border pt-8 md:mt-20 [[data-theme=dark]_&]:border-[#383838]"
            >
              {newer ? (
                <Link
                  href={`/updates/${newer.slug}`}
                  className="group max-w-[45%]"
                >
                  <span className="type-caption block text-muted-foreground">
                    Newer
                  </span>
                  <span className="type-body mt-1 block text-pretty text-foreground transition-colors group-hover:text-muted-foreground">
                    {entryHeadline(newer)}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {older ? (
                <Link
                  href={`/updates/${older.slug}`}
                  className="group max-w-[45%] text-right"
                >
                  <span className="type-caption block text-muted-foreground">
                    Older
                  </span>
                  <span className="type-body mt-1 block text-pretty text-foreground transition-colors group-hover:text-muted-foreground">
                    {entryHeadline(older)}
                  </span>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </div>
    </article>
  );
}
