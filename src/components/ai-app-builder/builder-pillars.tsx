import Link from "next/link";
import { PostToc } from "@/components/blog/post-toc";

export interface Pillar {
  /**
   * The category this claim belongs to, in two words or fewer. It is what the
   * contents rail lists, so it has to stand on its own as a subject: the
   * headings themselves run a full line and would not fit the rail.
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
 * The four message pillars as ONE region with the site's contents rail standing
 * beside it — the same arrangement the comparison pages run for their own
 * pillars (see vs-page.tsx), and for the same reason.
 *
 * It was four full-width rows, each a half of copy against a half of picture,
 * separated by rules. Two problems, both from the row being the unit:
 *
 * - **The copy was squeezed to a column it did not need.** A claim that runs a
 *   full line of heading got half the page, so every heading wrapped to two or
 *   three lines beside a picture that had room to spare.
 * - **The reader had no idea how long the argument was.** Four tall rows in a
 *   column read as "this continues indefinitely"; nothing said there were four
 *   of them or which one you were in.
 *
 * The rail answers both. It lists the four subjects, marks the one you are in,
 * and jumps to any of them — so the argument states its own length up front —
 * while the claim gets the full measure of the content column and its shot sits
 * underneath at the width it was drawn for, rather than cropped into a half.
 *
 * Nothing here responds to scroll except the rail's own current-section mark.
 * An earlier version of this section pinned one shot and cross-faded it to
 * whichever claim was nearest the middle of the viewport; that coupling is what
 * was removed, and the rail is deliberately not a revival of it — it indexes
 * the region, it does not animate it.
 *
 * Below md the rail is dropped (it would be a list of four words above a page
 * that is already one column) and the eyebrow carries the subject instead.
 */
export function BuilderPillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <div className="grid gap-12 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-16">
        <PostToc
          headings={pillars.map((pillar) => ({
            id: pillarId(pillar.eyebrow),
            text: pillar.eyebrow,
          }))}
          // Sticky, not fixed: it holds beside the pillars and lets go at the
          // end of them, so it never outlives the region it indexes.
          className="hidden md:sticky md:top-28 md:block md:self-start"
        />

        <div className="space-y-16 md:space-y-24">
          {pillars.map((pillar) => (
            <div
              key={pillar.heading}
              id={pillarId(pillar.eyebrow)}
              // Matches the line the rail counts a heading as reached at, so a
              // jumped-to pillar is current the moment it lands.
              className="scroll-mt-28"
            >
              {/* Only where the rail isn't: above md the rail is showing this
                  exact word a few inches to the left, and printing it twice
                  reads as a stutter rather than a label. */}
              <p className="type-eyebrow text-muted-foreground md:hidden">
                {pillar.eyebrow}
              </p>
              <h3 className="type-h3 mt-4 text-balance leading-[1.2] md:mt-0">
                {pillar.heading}
              </h3>
              <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
                {pillar.body}
              </p>
              {/* The site's secondary button, not a new one. Each claim ends
                  somewhere instead of asking the reader to carry four of them
                  to the single action at the foot of the page. */}
              <Link
                href={pillar.cta.href}
                className="mt-6 inline-block rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/25"
              >
                {pillar.cta.label}
              </Link>

              {/* Held off the top and left and running off the bottom and the
                  right, so the shot reads as a window onto a screen that
                  continues past the frame.

                  108%, not more. Two of these are the home page's own
                  responsive components rather than fixed-size art: they carry
                  real breakpoint rules, and cropped harder the CRM crossed one
                  — its table columns collided and the name ran over the
                  company. The crop has to stay inside the width band they were
                  drawn for. */}
              <div className="relative mt-8 aspect-[16/9.6] overflow-hidden rounded-2xl bg-[var(--surface)]">
                <div className="absolute left-4 top-4 h-[108%] w-[108%] overflow-hidden rounded-tl-xl md:left-6 md:top-6">
                  {pillar.visual}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Matches vs-page's own ids, so the two regions slug a subject the same way. */
function pillarId(eyebrow: string) {
  return `pillar-${eyebrow
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
