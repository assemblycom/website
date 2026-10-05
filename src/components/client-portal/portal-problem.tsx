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

        {/* The brief's proof for the claim above: a firm that lived the problem
            before it had somewhere to put it. Quoted from the published Capital
            One case study rather than retyped, so the wording on this page and
            the wording on the story cannot drift, and the attribution links to
            the story it came from. Ranged left inside a centred block — a rule
            down the left of centred lines has nothing to align to. */}
        <figure className="mx-auto mt-12 max-w-2xl border-l border-border pl-6 text-left [[data-theme=dark]_&]:border-[#383838]">
          <blockquote className="type-h4 text-pretty text-foreground">
            &ldquo;Before Assembly, we were managing hotel partners through
            Google spreadsheets and long email chains. It became hard to scale
            and created friction for everyone.&rdquo;
          </blockquote>
          <figcaption className="type-caption mt-4 text-muted-foreground">
            <Link
              href="/customers/capital-one-luxury-travel"
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Phillip LaRue, Sr. Director of Luxury Travel at Capital One
            </Link>
          </figcaption>
        </figure>

        {/* Full width under the intro row, the way the build section's visual
            sits, rather than beside it. */}
        <VisualSlot
          className="mt-12"
          label="Problem visual"
          description="Before and after diptych. Left, desaturated: a generic client portal with a greyed-out Request a feature button and three external tool tabs hovering around it, faint connector lines, a confused client avatar. Right, full colour: the Brandmages portal with a custom Intake app already in the sidebar, everything in one frame. One word under each side: Almost fits, and Fits."
        />
      </Reveal>
    </section>
  );
}
