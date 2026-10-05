import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import {
  GenericPortalMock,
  IntakeAppMock,
} from "@/components/client-portal/segment-mock";

/**
 * The pain the established operator already feels.
 *
 * The strongest hook in the customer data is not "I have no portal", it is "the
 * portal I have almost fits" — rigidity and missing features are the top two
 * cancellation reasons across the category. So the section names that, and sets
 * up the two-part answer: ready-made apps, then the builder.
 *
 * The picture runs the full rail with the quote under it, rather than the two
 * sharing a row. It is a comparison of two screens, and a comparison squeezed
 * into half a rail is two thumbnails: the screens were drawn at 8px type to
 * fit. Full width they are the same chrome every other screen on this page
 * runs, and the quote reads better as the thing that closes the section than
 * as a column beside it.
 *
 * The screens sit in one tray and run off its bottom edge, so the pair reads as
 * two windows onto the same idea rather than two framed pictures.
 */

/** Both columns' copy, above the screen each one describes. */
const SIDES: { label: string; body: string }[] = [
  {
    label: "Almost fits",
    body: "The portal you bought has the apps it has. Everything your firm actually does lives in tabs beside it.",
  },
  {
    label: "Fits",
    body: "Not a feature request in someone's queue. An app in your sidebar, named for the job your firm actually does.",
  },
];

/**
 * A screen in the tray.
 *
 * The two overlap rather than sitting in two columns: side by side they were
 * two pictures with a gutter between them, which reads as two products. Laid
 * over each other they read as one portal seen twice — the same window, once
 * before and once after — and the overlap gives the pair depth without any of
 * it being drawn in perspective.
 *
 * Each one is wider than half the tray, so the pair still fills it. The front
 * screen carries the shadow, because that is the only thing saying which of
 * them is in front; the back one is held back in opacity and desaturated,
 * which says which of them is the past.
 *
 * The ring is the hover: a soft rule blooming from just inside the frame, and
 * the hovered screen comes to the front. Nothing is clickable — it answers the
 * pointer and that is all it does.
 */
function Screen({
  dimmed,
  front,
  children,
}: {
  dimmed?: boolean;
  front?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`group relative w-[62%] shrink-0 hover:z-20 ${
        front ? "z-10 -ml-[24%]" : ""
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 z-10 scale-[0.985] rounded-[15px] border-4 border-foreground/[0.07] opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
      />
      {/* The frame is opaque whichever screen is in front. The dimming used to
          sit here, which made the whole screen translucent — so whenever it
          came forward you could read the other one straight through it. It is
          on the layer inside now, over a white ground that hides whatever is
          behind. */}
      <div
        className={`h-[300px] overflow-hidden rounded-t-xl border-l border-r border-t border-border bg-background md:h-[400px] [[data-theme=dark]_&]:border-[#383838] ${
          front
            ? "shadow-[-18px_0_40px_-24px_rgba(16,24,40,0.3),0_1px_2px_rgba(16,24,40,0.05)] [[data-theme=dark]_&]:shadow-[-18px_0_40px_-24px_rgba(0,0,0,0.7)]"
            : ""
        }`}
      >
        {/* Desaturated and held back in opacity rather than drawn in a second
            set of greys: a muted copy of the same chrome stays correct in both
            themes, where hardcoded greys would only be right in one. It comes
            back to full strength under the pointer, because a reader who has
            reached for it is asking to read it. */}
        <div
          className={`h-full transition duration-300 motion-reduce:transition-none ${
            dimmed
              ? "opacity-55 grayscale group-hover:opacity-100 group-hover:grayscale-0"
              : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function PortalProblem() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-24">
      <Reveal>
        {/* Ranged left, and the claim on its own. The lead under it said in
            other words what the heading had just said, and the jump link below
            it pointed at a section this one is the set-up for — so the reader
            met two sentences and a button before the picture that is the
            actual argument. */}
        <h2 className="type-h2 max-w-2xl text-balance">
          Off-the-shelf portals make you fit the software. Not here.
        </h2>

        {/* Above the tray in two columns, in the pair's reading order. They
            stopped being captions aligned under their own screen once the
            screens began to overlap — there is no column for a caption to
            stand in any more, so they read as the before and after of one
            picture, which is what the picture now is. */}
        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-5">
          {SIDES.map((side) => (
            <div key={side.label} className="max-w-sm">
              <p className="text-base leading-snug text-foreground">
                {side.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {side.body}
              </p>
            </div>
          ))}
        </div>

        {/* One tray under both, with the screens running off its bottom. No
            bottom padding: the crop is the point, and a tray that closes under
            them would make them two pictures sitting on a shelf. */}
        {/* Top corners only. The screens run to the tray's bottom edge, so a
            radius down there had nothing to round: it clipped two notches out
            of the screens instead, which read as a rendering fault rather
            than as a corner. */}
        <div className="mt-8 overflow-hidden rounded-t-3xl bg-muted p-4 pb-0 md:mt-10 md:p-6 md:pb-0 [[data-theme=dark]_&]:bg-white/[0.04]">
          <div className="flex">
            <Screen dimmed>
              <GenericPortalMock />
            </Screen>
            <Screen front>
              <IntakeAppMock />
            </Screen>
          </div>
        </div>

        {/* The brief's proof for the claim above, closing the section: a firm
            that lived the problem before it had somewhere to put it. Quoted
            from the published Capital One case study rather than retyped, so
            the wording on this page and the wording on the story cannot drift,
            and the attribution links to the story it came from. */}
        <figure className="mt-12 md:mt-16">
          <blockquote className="type-h3 mx-auto max-w-3xl text-balance text-center text-foreground">
            &ldquo;Before Assembly, we were managing hotel partners through
            Google spreadsheets and long email chains. It became hard to scale
            and created friction for everyone.&rdquo;
          </blockquote>
          <figcaption className="type-caption mt-6 text-center">
            <Link
              href="/customers/capital-one-luxury-travel"
              className="group inline-block"
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
      </Reveal>
    </section>
  );
}
