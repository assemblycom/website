import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { VisualSlot } from "@/components/ui/visual-slot";

/**
 * The pain the established operator already feels.
 *
 * The strongest hook in the customer data is not "I have no portal", it is "the
 * portal I have almost fits" — rigidity and missing features are the top two
 * cancellation reasons across the category. So the section names that, and sets
 * up the two-part answer: ready-made apps, then the builder.
 */
export function PortalProblem() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        <div className="text-center">
          <h2 className="type-h2 mx-auto max-w-3xl text-balance">
            Off-the-shelf portals make you fit the software. Not here.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-muted-foreground">
            Stop bending your workflow to fit someone else&apos;s product.
          </p>
          {/* The site's secondary, not its primary. This jumps down the page
              to the build section, whose own "Describe your first app" IS the
              primary — a filled button here would shout as loudly as the thing
              it is pointing at, and would be the page's third primary after
              the hero's. Secondary rather than the muted side-route chip it
              was, so it still reads as an action. */}
          <Link
            href="#build"
            className="mt-6 inline-block rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/5 [[data-theme=dark]_&]:border-white/25"
          >
            See how firms build their own
          </Link>
        </div>

        {/* Full width under the intro row, the way the build section's visual
            sits, rather than beside it. */}
        <VisualSlot
          className="mt-12"
          label="Problem visual"
          description="Before and after diptych. Left, desaturated: a generic client portal with a greyed-out Request a feature button and three external tool tabs hovering around it, faint connector lines, a confused client avatar. Right, full colour: the Brandmages portal with a custom Intake app already in the sidebar, everything in one frame. One word under each side: Almost fits, and Fits."
        />

        {/* The brief's proof for the claim above, under the picture rather than
            between it and the heading: the claim, then what it looks like, then
            the firm that lived it. Quoted from the published Capital One case
            study rather than retyped, so the wording on this page and the
            wording on the story cannot drift.

            Laid out as the customer quotes elsewhere are: a square tile for the
            firm's mark beside the quote, attribution under it in two lines,
            name then role. It was a rule down the left of a centred column,
            which gave the page a third left edge nothing else shared. */}
        <figure className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,300px)_1fr] md:gap-12">
          {/* The firm's mark goes here once the art exists; until then the tile
              carries the name, the way the template rail's thumbnail slot
              holds its own space rather than filling with invented art. */}
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted/60 p-8 text-center [[data-theme=dark]_&]:bg-white/[0.04]">
            <span className="type-h4 text-balance text-foreground">
              Capital One Luxury Travel
            </span>
          </div>
          <div className="flex flex-col">
            <blockquote className="type-h3 text-pretty text-foreground">
              &ldquo;Before Assembly, we were managing hotel partners through
              Google spreadsheets and long email chains. It became hard to scale
              and created friction for everyone.&rdquo;
            </blockquote>
            {/* mt-auto so the attribution sits on the tile's floor on desktop
                and directly under the quote when the two stack. */}
            <figcaption className="type-caption mt-8 md:mt-auto md:pt-8">
              <Link
                href="/customers/capital-one-luxury-travel"
                className="group block"
              >
                <span className="block text-foreground transition-colors group-hover:underline group-hover:underline-offset-4">
                  Phillip LaRue
                </span>
                <span className="mt-0.5 block text-muted-foreground">
                  Sr. Director of Luxury Travel, Capital One
                </span>
              </Link>
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
