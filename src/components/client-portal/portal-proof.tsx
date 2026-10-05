import Link from "next/link";
import { CustomerLogo } from "@/components/customers/customer-logos";
import { GRID_LINE } from "@/components/ui/grid-lines";
import { Reveal } from "@/components/ui/reveal";

/**
 * The proof section, built for this page only. Nothing here is imported
 * anywhere else — the shared `Testimonials` block carries a single story with a
 * portrait and figures, which is a different object from this.
 *
 * Three peers rather than one lead and three supports: no featured card, no
 * imagery, just who said it and what they said. The columns are divided by the
 * page's own hairline instead of each being boxed, so the three read as one
 * band rather than three objects.
 *
 * Every quote is positive and published. The earlier set used the firms'
 * before-state ("bolted-on software, an afterthought"), which needed a line
 * above it explaining that it described the old tool; as peers under a plain
 * heading those would simply read as complaints about Assembly.
 */
const STORIES = [
  {
    slug: "collective-cpa",
    quote:
      "It let us flexibly build our own version of a client portal, uniting elements of their technology with existing external core applications.",
    name: "Kyle Pearson",
    role: "Founder @ Collective CPA",
    href: "/customers/collective-cpa",
  },
  {
    slug: "sargent-cpa",
    quote:
      "When clients log into the portal, they see our branded colors and our logos. They feel like it’s a safe, trusted place, with custom features in the side menu that are exactly what we need for our clients.",
    name: "Anthony Drozd",
    role: "Operations Manager @ Sargent CPAs",
    href: "/customers/sargent-cpa",
  },
  {
    slug: "heritage-law-partners",
    quote:
      "I really like how smooth it is and intuitive for our clients to use. Our approach definitely puts us in the top tier for client care among estate planning firms.",
    name: "Eliana Emery",
    role: "Managing Attorney @ Heritage Law Partners",
    href: "/customers/heritage-law-partners",
  },
];

export function PortalProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            Firms that stopped settling.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
            See how firms replaced rigid tools with a portal they built around
            their own workflow.
          </p>
        </div>

        {/* Dividers between the columns rather than a border around each: the
            rule only appears from md, where the three actually sit side by
            side. Stacked below that, each card keeps its own top rule so the
            set still reads as divided. */}
        <div className="mt-12 grid md:grid-cols-3">
          {STORIES.map((story) => (
            <Link
              key={story.href}
              href={story.href}
              className={`group flex flex-col border-t px-0 py-8 transition-colors hover:bg-muted/40 md:border-l md:border-t-0 md:px-8 md:py-2 md:first:border-l-0 md:first:pl-0 md:last:pr-0 ${GRID_LINE} [[data-theme=dark]_&]:hover:bg-white/[0.03]`}
            >
              {/* Same-size tile per firm. `fit` is what the logo component
                  builds for this: the mask contains inside whatever box the
                  parent gives it, so a wide wordmark and a tall crest both sit
                  in a 48px square at their own proportions. Free-standing, each
                  logo renders at its own declared width, and the three marks
                  were visibly different sizes across the row. */}
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted p-2.5 text-foreground/80 [[data-theme=dark]_&]:bg-white/[0.06]">
                <CustomerLogo slug={story.slug} fit />
              </span>
              <blockquote className="mt-6 text-pretty text-foreground">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <div className="mt-auto pt-6">
                <p className="text-sm text-foreground">{story.name}</p>
                <p className="type-caption mt-0.5 text-muted-foreground">
                  {story.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
