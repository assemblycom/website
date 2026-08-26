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
 * The active entry takes the same ink and rule the hover state already uses, so
 * the rail speaks one language — no new colour for "current".
 */
export function PostToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useActiveHeading(headings);

  return (
    <nav
      aria-label="Jump to section"
      // The rail's sticky box is the parent's now, so the card above stays put
      // too; the list takes what height is left and scrolls inside it. The
      // floor is what stops a tall card from squeezing the list out entirely.
      className="min-h-24 flex-1 overflow-y-auto"
    >
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
                    ? "border-foreground text-foreground"
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
