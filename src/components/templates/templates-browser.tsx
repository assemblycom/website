"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Template } from "@/lib/templates";
import { TEMPLATE_CATEGORIES, toTemplateCategory } from "@/lib/templates";
import { TemplateCard } from "@/components/templates/template-card";

interface Props {
  templates: Template[];
}

const ALL = "All";

// Widgets are drawn at one design size and scaled into the card they're framed
// in; the per-template exceptions live with the frame (see MOCK_DESIGN_SIZE).

// The query string doesn't change while the gallery is open (filtering is
// local state, not navigation), so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

export function TemplatesBrowser({ templates }: Props) {
  // One category at a time. It used to be a multi-select, and two or three dark
  // chips at once read as a broken toggle rather than as a union — nothing on the
  // row said the selection added up. null = "All" (show everything); picking the
  // selected chip again clears back to All.
  //
  // A link can open the gallery already filtered: a detail page's breadcrumb
  // points at /templates?category=trackers. `picked` stays undefined until the
  // visitor chooses, and until then the URL's category stands in for it. Read
  // through useSyncExternalStore rather than useSearchParams, which would put
  // the whole statically rendered page behind a Suspense boundary, and rather
  // than copied into state from an effect, which renders the page twice.
  // Matched case-insensitively through the category aliases, so a link from
  // before the merge (?category=trackers) still opens its tab, and a mistyped
  // one just leaves the gallery on All.
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const urlCategory = useSyncExternalStore(
    subscribeToNothing,
    () => new URLSearchParams(window.location.search).get("category"),
    () => null,
  );
  const urlTab = toTemplateCategory(urlCategory);
  const fromUrl =
    urlTab && templates.some((t) => t.category === urlTab) ? urlTab : null;
  const selected = picked === undefined ? fromUrl : picked;
  const selectCategory = (cat: string) => {
    setPicked(cat === ALL ? null : cat);
  };
  // Free-text search across title, description, category, and industries.
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const present = new Set(templates.map((t) => t.category));
    // Only the listed tabs, in their order; anything else shows under All.
    return [ALL, ...TEMPLATE_CATEGORIES.filter((c) => present.has(c))];
  }, [templates]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // A template shows if it matches any selected category (union, empty = all)
    // AND matches the search text across its title/description/category/industry.
    const matched = templates.filter((t) => {
      if (selected && t.category !== selected) return false;
      if (!q) return true;
      const haystack = [
        t.title,
        t.description,
        t.category,
        ...(t.industries ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
    // Rank, the way the product's own Add-an-App picker orders these, then
    // alphabetically for anything unranked.
    //
    // It used to lead with the CMS's Featured flag, and every entry carrying that
    // flag is a core app — so the gallery opened on Autoresponder (rank 101) and
    // Exporter (no rank at all) while the onboarding wizard at rank 1 sat below
    // the fold. Core apps and templates share one rank scale, so sorting on it
    // alone is what interleaves them. The flag itself is marked deprecated in
    // Contentful; the homepage's curated strip is the only thing still reading it.
    return [...matched].sort((a, b) => {
      const byRank = (a.rank ?? Infinity) - (b.rank ?? Infinity);
      if (byRank !== 0) return byRank;
      return a.title.localeCompare(b.title);
    });
  }, [templates, selected, query]);

  const barRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Phone category menu: closes on a pick, an outside click, or Escape.
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Filtering shortens the page, and a document that gets shorter than where you
  // were scrolled leaves the browser to clamp you to the new bottom — on a phone,
  // picking a category from halfway down the grid dropped you at the footer. So
  // when the filter changes and the results have already scrolled past the bar,
  // go back to the top of them. Only on a real change, not on mount, and not for
  // the search field, which would yank the page on every keystroke.
  const firstFilterRun = useRef(true);
  useEffect(() => {
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    const results = resultsRef.current;
    const bar = barRef.current;
    if (!results) return;
    // The bar only eats viewport where it's sticky; at lg it scrolls away with
    // the page and the results can go right to the top.
    const barHeight =
      bar && getComputedStyle(bar).position === "sticky"
        ? bar.getBoundingClientRect().height
        : 0;
    const target = Math.max(
      0,
      results.getBoundingClientRect().top + window.scrollY - barHeight - 12,
    );
    if (window.scrollY > target) {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, [selected]);

  return (
    <div>
      {/* Search + category filters — sticky together on mobile so both stay
          reachable while scrolling the grid; a static block at lg.
          `top-0` with the nav's height as top padding, rather than an offset
          under the nav: the nav is a translucent blur veil, so parking the bar
          below it left a band of cards scrolling past in plain sight above the
          search. Now the bar's own solid background runs to the top of the
          viewport and fills that band, and the veil has nothing to show
          through. */}
      <div
        ref={barRef}
        className="sticky top-0 z-30 -mx-6 bg-background px-6 pb-3 pt-16 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0"
      >
        {/* Categories as plain text tabs with a small search on the right.
            The current category is full ink, the rest muted; no pills. */}
        {/* After cursor.com/blog: from 660px the tabs stay a row that scrolls
            sideways and fades under its right edge rather than collapsing early;
            below that they become one pill that opens the list. */}
        <div className="flex items-center justify-between gap-3">
          <div ref={menuRef} className="relative shrink-0 min-[660px]:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              className="type-body flex h-10 items-center gap-1.5 rounded-full border border-border bg-muted pl-4 pr-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 [[data-theme=dark]_&]:bg-white/[0.06]"
            >
              {selected ?? ALL}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className={`size-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>
            {menuOpen && (
              <ul
                role="listbox"
                aria-label="Filter templates by category"
                className="absolute left-0 top-full z-40 mt-2 max-h-[60vh] w-56 animate-fade-in overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-[0_16px_44px_-26px_rgba(20,20,40,0.35)] [[data-theme=dark]_&]:bg-[#1c1c1c]"
              >
                {categories.map((cat) => {
                  const active =
                    cat === ALL ? selected === null : selected === cat;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          selectCategory(cat);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm text-foreground outline-none hover:bg-muted focus-visible:bg-muted"
                      >
                        {cat}
                        {active && (
                          <svg
                            aria-hidden
                            viewBox="0 0 20 20"
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 10l3.5 3.5L15 7" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="relative hidden min-w-0 flex-1 min-[660px]:block">
            <div
              role="group"
              aria-label="Filter templates by category"
              className="flex min-w-0 items-center gap-6 overflow-x-auto pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((cat) => {
                const active =
                  cat === ALL ? selected === null : selected === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectCategory(cat)}
                    className={`type-body shrink-0 whitespace-nowrap rounded-sm py-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-foreground/40 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground [@media(hover:hover)]:hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-[linear-gradient(90deg,transparent_0%,var(--background)_88%)]"
            />
          </div>
          {/* The field rests narrow and opens out when focused. */}
          <div className="flex min-w-0 flex-1 justify-end min-[660px]:w-60 min-[660px]:flex-none">
            <div className="relative w-full max-w-48 transition-[max-width] duration-300 ease-[cubic-bezier(.25,1,.5,1)] focus-within:max-w-60">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search templates"
                // text-base below sm is the iOS zoom guard on the value only.
                className="h-10 w-full rounded-full border border-border bg-muted pl-10 pr-9 text-base text-foreground outline-none transition-colors placeholder:text-sm placeholder:text-muted-foreground focus:border-foreground/30 sm:text-sm [[data-theme=dark]_&]:bg-white/[0.06]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M6 18 18 6" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid — Linear-style story cards: a preview image framed with a hairline
          outline and the title beneath. The card itself stays borderless; only
          the image is framed.

          The row gap is deliberately far larger than the gap between a widget and
          its own label (16px), so each card groups as one thing and the rows stop
          reading as a single dense field. Held back on small screens, where two
          columns don't need the same separation and the extra height just becomes
          scrolling.

          Column steps are set by the card width the widgets need (~230px is where
          the busier mocks start losing their detail), not by the default
          breakpoints: 3-up used to wait for lg, so a laptop-width window sat on
          two very wide cards and then jumped straight to five. */}
      <div ref={resultsRef}>
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-x-4 gap-y-10 min-[560px]:grid-cols-2 min-[760px]:grid-cols-3 min-[1100px]:grid-cols-4">
            {filtered.map((template) => (
              <TemplateCard key={template.slug} template={template} />
            ))}
          </div>
        ) : (
          // Empty state on the page's own terms, set in the page's own type. No
          // rule over it: the filters aren't a section to be closed off, and a
          // hairline directly under them drew a line across the one moment the
          // page has nothing to show. The space does the separating.
          <div className="py-20 text-center md:py-24">
            <p className="type-body text-foreground">
              {query.trim()
                ? `No templates match “${query.trim()}”`
                : selected === null
                  ? "No templates yet"
                  : `Nothing in ${selected} yet`}
            </p>
            {(query.trim() || selected) && (
              <>
                <p className="type-caption mt-2 text-muted-foreground">
                  Try another word, or start from the full set.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPicked(null);
                  }}
                  className="type-caption mt-7 rounded-lg border border-border px-4 py-1.5 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                >
                  Show all templates
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
