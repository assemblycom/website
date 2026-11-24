"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Category, PostCard } from "@/lib/ghost";
import { FIELD_CLS } from "@/components/ui/select-menu";
import { Pager } from "@/components/ui/pager";
import { POSTS_PER_PAGE, pageCount, pagePath, tagPath } from "@/lib/blog";
import { PostGrid } from "./post-grid";

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
          {/* The templates gallery's filter bar: plain text tabs, the current
              one in full ink and the rest muted, with no fill behind either.
              One row at every width that scrolls sideways on a phone, bled to
              the screen edge so it can be swiped there. */}
          <div className="relative min-w-0 sm:flex-1">
            <div className="-ml-6 -mr-6 flex items-center gap-6 overflow-x-auto pl-6 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] sm:ml-0 sm:mr-0 sm:pl-0 sm:pr-12 [&::-webkit-scrollbar]:hidden">
              {[{ name: "All", slug: "" }, ...categories].map((filter) => {
                const active = (filter.slug || undefined) === activeSlug;
                return (
                  <Link
                    key={filter.slug || "all"}
                    href={filter.slug ? tagPath(filter.slug) : "/blog"}
                    aria-current={active ? "page" : undefined}
                    className={`type-body shrink-0 whitespace-nowrap rounded-sm py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-foreground/40 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground [@media(hover:hover)]:hover:text-foreground"
                    }`}
                  >
                    {filter.name}
                  </Link>
                );
              })}
            </div>
            {/* Tabs that run under the search fade out rather than stop dead. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -right-6 w-12 bg-[linear-gradient(90deg,transparent_0%,var(--background)_88%)] sm:right-0 sm:w-12"
            />
          </div>

          <label className="relative w-full shrink-0 transition-[max-width] duration-300 ease-[cubic-bezier(.25,1,.5,1)] sm:max-w-48 sm:focus-within:max-w-60">
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
              className={`${FIELD_CLS} !h-9 !rounded-full !border-border !py-0 !pl-10 !pr-9 focus:!border-foreground/40 [&::-webkit-search-cancel-button]:appearance-none`}
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
        <PostGrid posts={shown} className="sm:grid-cols-2 lg:grid-cols-3" />
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
