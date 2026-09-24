import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { BuiltOnFaq } from "@/components/built-on/built-on-faq";
import { BuiltOnCta } from "@/components/built-on/built-on-cta";
import { BuiltOnViewTracker } from "@/components/built-on/built-on-view-tracker";
import type { BuiltOnEventProps } from "@/components/built-on/built-on-events";
import type { BuiltOnFirm } from "@/lib/built-on-firms";
import { FirmMark } from "@/components/built-on/firm-mark";
import {
  signupHref,
  type PoweredByAttribution,
} from "@/lib/powered-by-attribution";

/**
 * The page a client lands on from the "Built on Assembly" badge in a firm's
 * portal, login screen or email footer. It is written for someone who has never
 * heard of us and has just used the product without knowing it, so the page
 * carries one action and nothing to weigh it against.
 */

function Hero({
  firm,
  attribution,
  event,
}: {
  firm?: BuiltOnFirm;
  attribution: PoweredByAttribution;
  event: BuiltOnEventProps;
}) {
  // Sized by its own padding, not by the viewport. Owning the whole first
  // screen made the hero mostly empty space around three lines of type, and a
  // screen's height is the wrong unit for how much room a headline needs. The
  // tradeoff is that the next section's heading can now show at the bottom of
  // a tall window, which is what the rule above it is there to make deliberate.
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-20 text-center md:pb-32 md:pt-28">
      <div className="relative mx-auto max-w-3xl">
        {firm ? <FirmMark firm={firm} /> : null}

        <h1 className="type-display mt-7 text-balance text-foreground">
          {firm
            ? `${firm.name} runs their client experience on Assembly`
            : "Firms run their client experience on Assembly"}
        </h1>

        <p className="type-lead mx-auto mt-5 max-w-lg text-balance text-muted-foreground">
          You just used it. Build one for your business.
        </p>

        <div className="mt-8">
          {/* Everything the visit carried travels through to signup, so the
              workspace that sent this visitor is the one credited for them. */}
          <BuiltOnCta href={signupHref(attribution)} event={event} />
        </div>
      </div>
    </section>
  );
}

export function BuiltOnPage({
  firm,
  attribution,
}: {
  firm?: BuiltOnFirm;
  /**
   * What the visit carried, forwarded to signup as it arrived — including a
   * `ref` that matched nothing, so the workspace is still credited.
   */
  attribution: PoweredByAttribution;
}) {
  // One object, shared by the view and both CTAs, so a click can always be
  // matched to the view it came from.
  const event: BuiltOnEventProps = {
    ref: attribution.ref,
    utm_content: attribution.utm.utm_content,
    personalized: Boolean(firm),
    firm: firm?.name ?? null,
  };

  return (
    <>
      <BuiltOnViewTracker event={event} />
      {/* No rails through the hero. It is one centred column of text with
          nothing sitting on the 1200px grid, so rails there frame empty space
          on both sides rather than guiding anything. They start where the
          content that uses them starts. */}
      <Hero firm={firm} attribution={attribution} event={event} />
      {/* Full bleed, unlike the rules further down: those sit inside the rails
          and meet them at the corners, and there are no rails this high up the
          page for a 1200px rule to end on. */}
      <GridDivider fullBleed onMobile />
      <div className="relative">
        {/* No fadeTop: the fade existed because the rails opened under a hero
            with nothing above them, and appearing from nothing was gentler
            than two lines starting mid-air. There is a rule above them now, so
            they have an edge to start from and can be crisp. */}
        <GridRails />
        <BuiltOnFaq firm={firm} />
      </div>
    </>
  );
}
