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
        <h2 className="type-h2 text-balance">
          Off-the-shelf portals make your firm fit the software. Not Assembly.
        </h2>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Stop bending your workflow to fit someone else&apos;s product. When
          the portal almost fits, the gap becomes another tool, another
          spreadsheet, another thread your clients have to follow.
        </p>
        <Link
          href="#build"
          className="mt-6 inline-block rounded-lg border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          See how firms build their own
        </Link>
        {/* Full width under the copy, the way the build section's visual sits,
            rather than beside it. */}
        <VisualSlot
          className="mt-10"
          label="Problem visual"
          description="Before and after diptych. Left, desaturated: a generic client portal with a greyed-out Request a feature button and three external tool tabs hovering around it, faint connector lines, a confused client avatar. Right, full colour: the Brandmages portal with a custom Intake app already in the sidebar, everything in one frame. One word under each side: Almost fits, and Fits."
        />
      </Reveal>
    </section>
  );
}
