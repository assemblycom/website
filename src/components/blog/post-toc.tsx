"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "@/components/ui/toc-mobile";
import { useActiveHeading } from "@/components/ui/use-active-heading";

/**
 * The contents rail beside a post, marking the section being read.
 *
 * It used to be anchors only, on the reasoning that a list in the margin is a
 * map rather than a position indicator. On a post that runs to a dozen headings
 * the map stops being enough: two thousand words in, the thing you want from it
 * is where you are, and the phone bar has named the current section all along.
 *
 * Entries are plain rows. The active one takes the ink and a small
 * square in the gutter, so it reads as a place in the list, and opens its
 * subsections beneath it; hover only darkens the text, so "where you are"
 * stays the one marked entry.
 */

// Some posts number their listicle headings ("1. Dropbox") and others don't, so
// a mixed rail reads as two lists; the rail drops the number, the post keeps it.
const LEADING_NUMBER = /^\d+\.\s+/;

// A listicle can run to twenty sections, which turns the rail into a second
// scroll. Past COLLAPSE_AFTER entries it shows the first VISIBLE_ENTRIES and folds
// the rest behind a "more" row; folding fewer than three isn't worth the click.
const VISIBLE_ENTRIES = 8;
const COLLAPSE_AFTER = 10;

export function PostToc({
  headings,
  className,
}: {
  headings: TocHeading[];
  /**
   * How the list is held, which differs by where it is drawn: sharing the left
   * rail under the card on a narrow desktop, or standing in its own column on a
   * wide one. The caller owns that, since only it knows which rail this is.
   */
  className?: string;
}) {
  // Every entry the rail can mark, at both levels, so the one being read is
  // found wherever it sits; the section that holds it is then the open one.
  const entries = useMemo(
    () => headings.flatMap((heading) => [heading, ...(heading.children ?? [])]),
    [headings],
  );
  const [currentId, setCurrentId] = useActiveHeading(entries);
  const activeId =
    headings.find(
      (heading) =>
        heading.id === currentId ||
        heading.children?.some((sub) => sub.id === currentId),
    )?.id ?? currentId;
  const [expanded, setExpanded] = useState(false);
  // Only the section being read opens its subsections, so the rail stays a list
  // of sections and shows the finer grain just where you are.
  const subsections =
    headings.find((heading) => heading.id === activeId)?.children ?? [];

  const collapsible = headings.length > COLLAPSE_AFTER;
  // While folded, the section being read still shows (after the first entries)
  // when it is one of the hidden ones, so the rail never loses your place.
  const shown =
    collapsible && !expanded
      ? headings.filter(
          (heading, index) =>
            index < VISIBLE_ENTRIES || heading.id === activeId,
        )
      : headings;

  return (
    <nav aria-label="Jump to section" className={cn(className)}>
      {/* No "On this page" label: a list of the post's own headings in the margin
          beside it says what it is. The nav keeps its accessible name above. */}
      <ul>
        {shown.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                // The clicked section is current from the moment it is clicked,
                // rather than once the jump lands and scroll catches up.
                onClick={() => setCurrentId(heading.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "relative block truncate py-1.5 pl-5 pr-3 text-sm leading-6 transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                // One line per entry keeps the rail an even list; the full
                // heading is still there on hover for a truncated one.
                title={heading.text}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-1.5 top-1/2 size-[5px] -translate-y-1/2 bg-foreground"
                  />
                )}
                {heading.text.replace(LEADING_NUMBER, "")}
              </a>
              {active && subsections.length > 0 && (
                // Hung off the section's text edge on a rule of its own, the
                // way a nested menu opens, so it reads as inside the section.
                <ul className="mb-2 ml-5 border-l border-border [[data-theme=dark]_&]:border-[#262626]">
                  {subsections.map((sub) => {
                    const subActive = sub.id === currentId;
                    return (
                      <li key={sub.id}>
                        <a
                          href={`#${sub.id}`}
                          onClick={() => setCurrentId(sub.id)}
                          aria-current={subActive ? "true" : undefined}
                          className={cn(
                            "block truncate py-1 pl-4 pr-3 text-sm leading-6 transition-colors",
                            subActive
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          title={sub.text.replace(LEADING_NUMBER, "")}
                        >
                          {sub.text.replace(LEADING_NUMBER, "")}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
        {collapsible && (
          <li>
            <button
              type="button"
              onClick={() => setExpanded((open) => !open)}
              aria-expanded={expanded}
              className="block w-full py-1.5 pl-5 pr-3 text-left text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
            >
              {expanded
                ? "Show less"
                : `Show ${headings.length - shown.length} more`}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
