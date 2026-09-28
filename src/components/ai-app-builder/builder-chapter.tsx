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
  intro: string;
}) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pb-6 pt-24 text-center md:px-10 md:pb-10 md:pt-36">
      <Reveal>
        <p className="type-eyebrow text-muted-foreground">{eyebrow}</p>
        <h2 className="type-h2 mx-auto mt-4 max-w-3xl text-balance">{heading}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
          {intro}
        </p>
      </Reveal>
    </section>
  );
}
