"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPostDate, type Category, type PostCard } from "@/lib/ghost";
import { FIELD_CLS } from "@/components/ui/select-menu";
import { Pager } from "@/components/ui/pager";
import { POSTS_PER_PAGE, pageCount, pagePath, tagPath } from "@/lib/blog";
import { PostByline } from "./post-byline";

/**
 * The card grid, with tag filters where there is more than one shelf to choose
 * between and a search box over whichever shelf you are on. The author pages
 * reuse it without `categories`, since every post on one is by the same person
 * and the pills would filter nothing.
 *
 * Which page and which shelf are URL state, not component state: both render as
 * real links to real URLs, so they survive a share, a middle-click and a reader
 * with JavaScript off. This is still a client component — the search box below
 * filters as you type — but the links are in the server-rendered HTML either
 * way, which is the part that had to change.
 */
export function BlogBrowser({
  posts,
  categories,
  /** The shelf being shown, as a tag slug. Absent on /blog and on an author. */
  activeSlug,
  /** What page links are relative to: "/blog", a tag's path, an author's. */
  basePath,
  /** Which page of `posts` to show, already clamped by the page component. */
  page,
  /** Shown above the grid, so it is left out of it until a search narrows things. */
  featuredSlug,
}: {
  posts: PostCard[];
  categories?: Category[];
  activeSlug?: string;
  basePath: string;
  page: number;
  featuredSlug?: string;
}) {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (!needle) return post.slug !== featuredSlug;
      // Title and summary only: searching the bodies would mean shipping every
      // article to the browser, and a hit deep in one post's text is rarely
      // what someone typing two words is after.
      return (
        post.title.toLowerCase().includes(needle) ||
        post.excerpt.toLowerCase().includes(needle)
      );
    });
  }, [posts, query, featuredSlug]);

  const total = pageCount(visible.length);
  // A search is answered whole rather than paged: the matches for two words are
  // a short list, and paging them would put the reader back where they started.
  const shown = searching
    ? visible
    : visible.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const showFilters = categories && categories.length > 1;

  return (
    <>
      {showFilters && (
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* The templates gallery's own filter strip, chip for chip. Selection
              reads as selection there rather than as a call to action: the
              current shelf is held on a wash of the foreground — the same
              idiom the nav and footer segmented controls use — instead of the
              solid black pill, which made the filter you had already applied
              look like the thing to click next. */}
          {/* One line at every width. Wrapped, the shelves broke to a second row
              on a phone and the selected key sat alone above the rest, which
              read as two groups; scrolling keeps them one row of options. The
              gutters are negative-margined back out, less the chip's own 12px of
              padding, so the first chip's LABEL lands on the rail the cards
              below start from rather than its box. The scrollbar is hidden
              because the row is short enough to swipe. */}
          <div className="-ml-6 -mr-6 flex items-center gap-2 overflow-x-auto pl-3 pr-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:-ml-3 sm:mr-0 sm:pl-0 sm:pr-0 [&::-webkit-scrollbar]:hidden">
            {[{ name: "All", slug: "" }, ...categories].map((filter) => {
              const active = (filter.slug || undefined) === activeSlug;
              return (
                <Link
                  key={filter.slug || "all"}
                  href={filter.slug ? tagPath(filter.slug) : "/blog"}
                  aria-current={active ? "page" : undefined}
                  // Inset ring, like the gallery's: this is an overflow scroller,
                  // and an offset ring is drawn outside the chip where the
                  // scroller crops it.
                  className={`type-body inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-lg px-3.5 leading-none outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground/40 ${
                    active
                      ? "bg-border text-foreground"
                      : "bg-transparent text-muted-foreground active:bg-border [@media(hover:hover)]:hover:bg-muted [@media(hover:hover)]:hover:text-foreground"
                  }`}
                >
                  {filter.name}
                </Link>
              );
            })}
          </div>

          <label className="relative sm:w-64">
            <span className="sr-only">Search posts</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.2-3.2" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts"
              // The row is a filter bar, not a form: the field keeps the site's
              // field styling but sits at the height of the keys beside it.
              // The browser's own clear glyph is suppressed — it renders in the
              // engine's blue at its own size, which is the one control on the
              // page the site doesn't draw. Ours sits below.
              className={`${FIELD_CLS} !h-9 !py-0 !pl-10 !pr-9 [&::-webkit-search-cancel-button]:appearance-none`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground [[data-theme=dark]_&]:hover:bg-white/[0.06]"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            )}
          </label>
        </div>
      )}

      {shown.length === 0 ? (
        <p className="type-body py-10 text-muted-foreground">
          No posts match {query.trim() ? `“${query.trim()}”` : "that filter"}.
        </p>
      ) : (
        // Ruled cells rather than separate tiles: each card draws the lines
        // below and to its right, and the frame around them all is a ring on
        // the container — a border there would have been cut off at the corners
        // by the radius, since the clip that rounds the cells also crops the
        // lines they draw. No
        // cover art here — at three across the covers repeated the same few
        // stock photographs down the page and said nothing the titles didn't.
        <div className="grid overflow-hidden rounded-2xl ring-1 ring-inset ring-border sm:grid-cols-2 lg:grid-cols-3 [[data-theme=dark]_&]:ring-[#383838]">
          {shown.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col border-b border-r border-border p-6 transition-colors hover:bg-muted/50 lg:p-8 [[data-theme=dark]_&]:border-[#383838]"
            >
              <h3 className="type-h4 line-clamp-2 text-balance text-foreground">
                {post.title}
              </h3>
              <p className="type-body mt-3 line-clamp-3 text-pretty text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-8 pt-2 md:mt-auto md:pt-10">
                <PostByline
                  author={post.author}
                  image={post.authorImage}
                  date={formatPostDate(post.date)}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      {!searching && (
        <Pager
          current={page}
          total={total}
          label="Blog pages"
          hrefFor={(to) => pagePath(basePath, to)}
        />
      )}
    </>
  );
}
