"use client";

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
 * The active entry takes the brand blue (Haze) for its rule over a faint tint of
 * it, so "where you are" stands apart from "where you're pointing" (hover keeps
 * the plain ink rule).
 */
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
  const [activeId, setActiveId] = useActiveHeading(headings);

  return (
    <nav aria-label="Jump to section" className={cn(className)}>
      {/* No "On this page" label: a list of the post's own headings in the margin
          beside it says what it is. The nav keeps its accessible name above. */}
      <ul className="border-l border-border [[data-theme=dark]_&]:border-[#383838]">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                // The clicked section is current from the moment it is clicked,
                // rather than once the jump lands and scroll catches up.
                onClick={() => setActiveId(heading.id)}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l py-1 pl-4 text-sm leading-6 transition-colors",
                  active
                    ? "rounded-r-md border-l-2 border-[var(--guide-haze)] bg-[var(--guide-toc-active-bg)] pl-[calc(1rem-1px)] text-foreground"
                    : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
