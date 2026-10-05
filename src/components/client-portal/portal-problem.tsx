import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { AlmostFitsMock } from "@/components/client-portal/segment-mock";

/** Shared by both blocks, and by the tailor grid further down the page. */
const CARD =
  "flex flex-col overflow-hidden rounded-3xl bg-muted [[data-theme=dark]_&]:bg-white/[0.04]";
const PAD = "p-6 md:p-10";

/**
 * The pain the established operator already feels.
 *
 * The strongest hook in the customer data is not "I have no portal", it is "the
 * portal I have almost fits" — rigidity and missing features are the top two
 * cancellation reasons across the category. So the section names that, and sets
 * up the two-part answer: ready-made apps, then the builder.
 *
 * Two blocks under the claim rather than one picture with a quote hung off it:
 * the picture is the claim shown and the quote is the claim attested, which are
 * two statements of equal weight, so they get two cards of equal weight. The
 * picture leads because it is the thing the sentence above is about.
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

        <div className="mt-12 grid gap-4 md:mt-14 md:gap-5 lg:grid-cols-2">
          {/* Not cropped, unlike the window cards elsewhere on the page: this
              picture is a comparison, and a diptych with one half running off
              the card is an argument with one half missing. */}
          <div className={`${CARD} ${PAD}`}>
            <p className="text-base leading-snug">An app no vendor ships</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Not a feature request in someone&apos;s queue. An app in your
              sidebar, named for the job your firm actually does.
            </p>
            <div className="mt-8 min-h-[320px] flex-1 md:mt-10">
              <AlmostFitsMock />
            </div>
          </div>

          {/* The brief's proof for the claim above: a firm that lived the
              problem before it had somewhere to put it. Quoted from the
              published Capital One case study rather than retyped, so the
              wording on this page and the wording on the story cannot drift,
              and the attribution links to the story it came from. */}
          <figure className={`${CARD} ${PAD}`}>
            <blockquote className="type-h3 text-pretty text-foreground">
              &ldquo;Before Assembly, we were managing hotel partners through
              Google spreadsheets and long email chains. It became hard to scale
              and created friction for everyone.&rdquo;
            </blockquote>
            {/* mt-auto so the attribution sits on the card's floor, level with
                where the picture beside it runs off its own. */}
            <figcaption className="type-caption mt-10 pt-2 md:mt-auto">
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
          </figure>
        </div>
      </Reveal>
    </section>
  );
}
