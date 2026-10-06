import Link from "next/link";
import { GRID_LINE } from "@/components/ui/grid-lines";

export interface Pillar {
  /**
   * The category this claim belongs to, in two words or fewer. Set in the
   * site's own eyebrow — mono, uppercase — so the four rows are scannable as a
   * list of subjects before any of them is read as a sentence.
   */
  eyebrow: string;
  heading: string;
  body: string;
  /** Where the claim is shown in full. One per row, under the copy. */
  cta: { label: string; href: string };
  /** The product shot that backs the claim. */
  visual: React.ReactNode;
}

/**
 * The four message pillars, each one a row of its own: an eyebrow naming the
 * subject, the claim, the line under it and a way to see it in full on the
 * left; the shot that backs it on the right.
 *
 * It used to be a scrolling left column against ONE pinned shot that
 * cross-faded to whichever claim was nearest the middle of the viewport. That
 * was the problem rather than a detail of it: the reader had to work out that
 * scrolling was driving the picture at all, the swap happened in their
 * peripheral vision while they were reading words that had not moved, and at
 * any moment three of the four shots did not exist on the page. Pinning the
 * images and scrolling the text instead would have kept exactly that coupling,
 * only inverted — so the fix is to remove the coupling, not to flip it.
 *
 * Now nothing on this section responds to scroll. Four claims, four pictures,
 * each pair landing together and staying put, and a reader can go back up to
 * one without having to park the page at the right height to see it again.
 *
 * The lines are still the structure: a rule above every row, the first
 * included, pulled out past the section's padding so both ends land on the
 * page's own vertical rails. The vertical guide that used to run between the
 * columns went with the pinned column — it was that column's left border, and
 * a half-height rule down the middle of a set of self-contained rows would be
 * drawing a relationship the layout no longer has.
 *
 * Below lg each row stacks, claim then picture, in reading order.
 */
export function BuilderPillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10">
      {pillars.map((pillar) => (
        <div
          key={pillar.heading}
          className={`-mx-6 border-t px-6 py-12 md:-mx-10 md:px-10 md:py-16 ${GRID_LINE}`}
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="type-eyebrow text-muted-foreground">
                {pillar.eyebrow}
              </p>
              <h3 className="type-h3 mt-4 text-balance leading-[1.2]">
                {pillar.heading}
              </h3>
              <p className="mt-4 max-w-md text-pretty text-muted-foreground">
                {pillar.body}
              </p>
              {/* The site's secondary button, not a new one. Each row now ends
                  somewhere instead of asking the reader to carry four claims
                  to the single action at the foot of the page. */}
              <Link
                href={pillar.cta.href}
                className="mt-6 inline-block rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/25"
              >
                {pillar.cta.label}
              </Link>
            </div>

            {/* Held off the top and left and running off the bottom and the
                right, so the shot reads as a window onto a screen that
                continues past the frame.

                108%, not more. Two of these are the home page's own responsive
                components rather than fixed-size art: they carry real
                breakpoint rules, and cropped harder the CRM crossed one — its
                table columns collided and the name ran over the company. The
                crop has to stay inside the width band they were drawn for. */}
            <div className="relative aspect-[16/9.6] overflow-hidden rounded-2xl bg-[var(--surface)]">
              <div className="absolute left-4 top-4 h-[108%] w-[108%] overflow-hidden rounded-tl-xl md:left-6 md:top-6">
                {pillar.visual}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
