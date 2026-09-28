import { Reveal } from "@/components/ui/reveal";

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
}: {
  eyebrow: string;
  heading: string;
  intro?: string;
}) {
  // Slightly more room below than above, so the title clears the section it
  // introduces rather than sitting tight on it.
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-24 pt-16 text-center md:px-10 md:pb-36 md:pt-24">
      <Reveal>
        {/* The site's tag chip, as on about and the sitemap, rather than bare
            mono type set loose above the heading. */}
        <p>
          <span className="inline-flex items-center rounded-md bg-muted px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
            {eyebrow}
          </span>
        </p>
        <h2 className="type-h2 mx-auto mt-4 max-w-3xl text-balance">{heading}</h2>
        {intro ? (
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
            {intro}
          </p>
        ) : null}
      </Reveal>
    </section>
  );
}
