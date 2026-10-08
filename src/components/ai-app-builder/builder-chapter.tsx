import { cn } from "@/lib/utils";

/**
 * Opens one chapter of the page.
 *
 * The page used to run as nine sibling sections, every one at the same heading
 * size behind the same divider, so nothing told a reader they had crossed from
 * the claims into the mechanism into the proof. A chapter carries the only h2
 * in its group, plus a line that says why this part follows the last one; the
 * sections inside it drop to h3 and read as its parts.
 */
export function BuilderChapter({
  eyebrow,
  heading,
  intro,
  tightBottom = false,
  split = false,
}: {
  /** The site's tag chip. Omitted where the brief approves no eyebrow copy. */
  eyebrow?: string;
  heading: string;
  intro?: string;
  /** Set when the next section carries its own top padding, so the two do not stack. */
  tightBottom?: boolean;
  /**
   * The page hero's arrangement: heading on the left of the measure, the line
   * that supports it on the right, both ranged left. Centred is the default
   * and is right for a chapter that is only a title ("How it works"), where
   * there is no second column for a split to use.
   */
  split?: boolean;
}) {
  // Slightly more room below than above, so the title clears the section it
  // introduces rather than sitting tight on it. Both were a step deeper
  // (96/144 either side), which on a block holding two lines and a sentence
  // left most of a screen empty around them — except where the section
  // below carries its own top padding. There, this adds nothing: `tightBottom`
  // used to still pay 40/64px on top of the next section's 56/80, which put
  // 144px of empty page between the title and the thing it titles.
  return (
    <section
      className={cn(
        "mx-auto max-w-[1200px] px-6 pt-14 md:px-10 md:pt-20",
        !split && "text-center",
        tightBottom ? "pb-0" : "pb-16 md:pb-24",
      )}
    >
      {/* No entrance. This heading used to arrive through the site's Reveal —
          translate-y-8 and a fade, played as it crossed 90% of the viewport.
          Two lines of type sliding up is an animation you SEE rather than one
          that hands a section off, and on a reload partway down the page it
          replayed every time, which reads as the page still loading rather
          than as content arriving. The sections it introduces carry their own
          reveals; the title above them is simply there. */}
      {/* The site's tag chip, as on about and the sitemap, rather than bare
          mono type set loose above the heading. */}
      {eyebrow ? (
        <p>
          <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
            {eyebrow}
          </span>
        </p>
      ) : null}
      {/* Split runs the page hero's own grid, so a chapter opening a section
          and the page opening itself are the same shape rather than two
          kinds of header. The intro is held off the top of the heading's
          first line rather than centred against it, so the two columns share
          a baseline at the top. */}
      <div
        className={cn(
          split &&
            "grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16",
        )}
      >
        <h2
          className={cn(
            "type-h2 text-balance",
            split ? "max-w-[22ch]" : "mx-auto max-w-3xl",
            eyebrow && "mt-4",
          )}
        >
          {heading}
        </h2>
        {intro ? (
          <p
            className={cn(
              "text-pretty text-muted-foreground",
              split
                ? "max-w-[34rem] lg:pt-2"
                : "mx-auto mt-5 max-w-2xl text-balance",
            )}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
