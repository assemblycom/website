/**
 * How many changelog entries one /updates page serves.
 *
 * Ten, which is what Notion's releases page settles on: an entry carries several
 * screenshots, so ten of them is already a long scroll. The blog's sixty is a
 * grid of cards, which is a different amount of page per item.
 *
 * Its own module so the listing and the helpers that build its URLs sit
 * together rather than inside the page component.
 */
export const UPDATES_PER_PAGE = 10;

/** The path for a page of the changelog. Page one is the bare route. */
export function updatesPath(page: number): string {
  return page === 1 ? "/updates" : `/updates?page=${page}`;
}

/**
 * The long date each entry is stamped with, on the listing and on its own page.
 *
 * UTC rather than the reader's zone: a release dated the 30th should not read as
 * the 29th because someone opened it in California.
 */
export function formatEntryDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
