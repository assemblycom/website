import type { ReactNode } from "react";
import { HowItWorks } from "@/components/home/how-it-works";
import { HomeFAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { WholeStack } from "@/components/home/whole-stack";
import { Reveal } from "@/components/ui/reveal";
import { GridDivider } from "@/components/ui/grid-lines";
import {
  BuilderGridRails,
  BUILDER_GRID_LINE,
  BUILDER_RAIL_HALO_WIDE,
} from "@/components/ai-app-builder/builder-grid-rails";
import { HeroSplit } from "@/components/home/v2/hero-split";
import { ProofBand } from "@/components/home/v2/proof-band";
import { Industries } from "@/components/home/v2/industries";
import { CustomerProof } from "@/components/home/v2/customer-proof";
import { PortalTrust } from "@/components/client-portal/portal-trust";
import {
  DescribeCard,
  PlanCard,
  BuildCard,
  IterateCard,
} from "@/components/client-portal/portal-build-cards";
import { UnifiedPlatform } from "@/components/home/v2/platform-visuals";

/**
 * ROUND 4 — the homepage as the improvement brief asks for it.
 *
 * Structurally V1 with five changes, each answering one line of the brief.
 * Everything not listed here is the shipped component, unchanged and imported
 * rather than forked, so a difference between the two versions is a difference
 * the brief asked for and not drift.
 *
 *  1. THE HERO — relaid out on the elevenlabs.io split: headline ranged left
 *     with the body beside it, the action pair under it, and one tabbed tile
 *     in place of the template strip (v2/hero-split.tsx). The message is the
 *     same COPY_VARIANTS record the live hero reads, so only the arrangement
 *     differs.
 *  2. TRUST IN THE HERO — a rating and the two compliance marks under the
 *     tile (HeroCredibility), and the logo reel folded into the numbers band
 *     below it (ProofBand) so the reel and the figures make one argument
 *     instead of two bands making it twice.
 *  3. SPECIALIZATION — the industries row, directly under the proof band, each
 *     one linking to the solution page written for it.
 *  4. CASE STUDIES — the single app-builder quote is now the featured story
 *     plus three more chosen for the value props it does not touch.
 *  5. SECURITY — a section of its own, which V1 has nowhere on the page.
 *  6. FOOTER CTA — the free plan named in the close, not only in the chips.
 *  7. UNIFIED PLATFORM — a screen per tab, where V1 lights a region in one
 *     shared mock for two of the four steps and nothing at all for the rest.
 *  8. THE GRID — /ai-app-builder's column grid in place of the two framing
 *     rails. See the content region below.
 *
 * Section order is V1's with the new sections slotted in. The one judgement
 * call: the proof band comes before the industries row, though the brief puts
 * industries "immediately after the hero". The reel reads as the bottom of the
 * hero's own trust claim, and splitting it from the hero to make room for the
 * industry links broke both. Worth flipping in a variant if it tests badly.
 */
/**
 * The logo reel, as a hero closes with it.
 *
 * Exported so a page composing its own hero can put the same band under it,
 * with the same reveal, rather than restating the pairing.
 */
export function HomeProofBand() {
  return (
    <Reveal variant="fade">
      <ProofBand />
    </Reveal>
  );
}

export function HomeContentV2({
  // V3 is this page with a different hero, so it passes its own here rather
  // than forking everything below it.
  //
  // THE LOGO STRIP COMES IN WITH IT. The reel is drawn to ride up under the
  // split hero's tile and close that hero's trust claim — it is the foot of a
  // hero rather than a section of its own, which is why it carries no rules.
  // Over a hero that ends on a different shape it has nothing to sit under,
  // and its deep bottom inset leaves it stranded in white. So it belongs to
  // whichever hero wants it, and the heroes that do bring it themselves.
  hero = (
    <>
      <HeroSplit />
      <HomeProofBand />
    </>
  ),
}: {
  hero?: ReactNode;
} = {}) {
  return (
    <>
      {hero}

      {/* THE CONTENT REGION, on /ai-app-builder's grid rather than the two
          framing rails V1 draws.

          `isolate` and `bg-background` are both load-bearing, and they are why
          the `.section-follow` wrappers that used to sit in here are gone.
          BuilderGridRails is a BACKDROP at a negative z — it needs a stacking
          context with a ground of its own to sit above, which is what these
          two give it. `.section-follow` paints that same `var(--background)`
          as a BLOCK background across the whole region, and a block background
          paints above a negative-z layer: keeping it would have hidden the
          grid completely. The wrapper's own ground is the same colour, so
          nothing about how the region looks depends on the swap.

          Sections no longer carry z-10/z-20 either. Those answered V1's rails,
          which are an OVERLAY at z-30 that the content had to be lifted
          against; this grid is behind everything by construction. */}
      <div className="relative isolate bg-background">
        <BuilderGridRails />

        {/* No rule opening the region: the rails begin on this line and run
            the full measure, so an opening rule would state it twice — the
            same reason /ai-app-builder dropped its own. */}

        {/* Specialization before the product tour: the brief's point is that
            a visitor decides whether this is for them before they decide
            whether they like it. */}
        <Reveal variant="fade">
          <Industries />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <Reveal variant="fade">
          {/* Each step gets its own screen rather than a region lit inside
              one shared mock — the builder and security steps had nothing to
              light at all. See v2/platform-visuals.tsx. */}
          <UnifiedPlatform />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        <Reveal variant="fade">
          {/* Shorter on a phone than the shipped 420: V2 opens on a tall
              hero with its own tile, so a half-screen visual here made the
              page read as two full-height panels in a row. */}
          {/* Screens removed for now, the blue panel kept — the same state
              the platform section above is in. Shorter than the shipped 420 on
              a phone, and a real height at sm: the default chain ends in
              `sm:h-auto`, which collapses to nothing once the panel is empty. */}
          <HowItWorks
            visualHeightClass="h-[320px] sm:h-[420px] md:h-[560px]"
            // The site's own photography, one per step, standing in while the
            // step screens are redone. Named for what they are of: the phone
            // in hand for describing, the laptop for the plan, two people
            // reviewing a screen for publish.
            stepImages={{
              describe: {
                src: "/images/mocks/describe-phone.webp",
                alt: "Someone holding a phone on a sofa",
              },
              plan: {
                src: "/images/mocks/describe-laptop.webp",
                alt: "Someone reading at a laptop in afternoon light",
              },
              build: {
                src: "/images/mocks/public-store-bg.jpg",
                alt: "Two people reviewing a screen together",
              },
              iterate: {
                src: "/images/mocks/describe-sneakers.webp",
                alt: "Someone talking in a sunlit sitting room",
              },
            }}
            // The product pages' own step scenes, laid over the photographs:
            // /ai-app-builder draws exactly these for Describe, Plan and
            // Build, so the homepage shows the same screens rather than a
            // second set that would drift from them. `plain` drops each
            // scene's own ground — the photograph is the ground here.
            stepUi={{
              // CENTRED. The composer carries `sm:mt-[66px] sm:mb-auto`, which
              // is the arithmetic that drops it clear of the "Describe" heading
              // on /ai-app-builder's panel. There is no heading over it here,
              // so that offset just sat it high in the picture.
              describe: (
                <div className="absolute inset-0 [&_.template-mock-fit>div>div]:my-auto!">
                  <DescribeCard plain />
                </div>
              ),
              // FLUSH TO THE FOOT. The plan is a document longer than the
              // window it is read in, and it is drawn to be cut by its own
              // bottom edge — so a band of photograph under it read as the
              // document ending early rather than as a page running on. The
              // frame drops to the panel's own foot, and the card with it.
              plan: (
                // On a phone the frame is wider than the card's own shape, so
                // MockFit sizes the card by the width and centres the slack —
                // dropping the frame to the foot there just recentres it. The
                // frame takes the card's 6:5 instead, which leaves no slack to
                // centre, and sits on the panel's floor.
                <div className="absolute inset-x-0 -bottom-4 top-auto aspect-[6/5] sm:-bottom-6 sm:top-0 sm:aspect-auto md:-bottom-10">
                  <PlanCard plain />
                </div>
              ),
              build: <BuildCard plain />,
              // The other three take the panel's landscape design box; this
              // one is drawn portrait for the rail on /client-portal and has
              // no landscape variant, so fitted into a wide slot it came out
              // a third smaller than its neighbours and read as a different
              // family of screen. A taller frame is what MockFit scales
              // against, so the card lands at the others' size; the panel
              // clips, and the scene centres itself inside the frame anyway.
              iterate: (
                <div className="absolute inset-x-0 -inset-y-10 sm:-inset-y-24">
                  <IterateCard reply />
                </div>
              ),
            }}
          />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* Proof, then the security case it raises: a visitor convinced by
            the stories is the one who then asks where the data lives. */}
        <Reveal variant="fade">
          <CustomerProof />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* THE PRODUCT PAGES' SECURITY SECTION, not a homepage one.
            PortalTrust is what /client-portal and both solution pages already
            run — the claim and its way out on the left, the claims a
            safety-first buyer checks as rows on the right, and the
            certification seals closing it. It carries its own Reveal, so
            there is no wrapper here.

            THE GRID RUNS BEHIND IT. An earlier pass grounded the whole
            section to stop the rails fighting the seal band's own dividers,
            and that took the grid out of a full screen of the page. Only the
            BAND needs the ground — see `bandClassName` — so the rails are
            back everywhere else.

            Only the heading, lead and link are this page's: the brief asks
            the homepage to link out to the security centre, where the product
            pages send a reader to the Trust Center. */}
        <PortalTrust
          heading="Client data your clients can trust you with"
          body="The apps you build inherit the platform's security rather than asking you to get it right yourself. SOC 2 Type II certified, with HIPAA, GDPR and CCPA support."
          link={{ label: "How Assembly keeps data safe", href: "/security" }}
          // AND ITS OWN SIDE EDGES. The band draws hairlines only BETWEEN
          // its cells — "the outer edges get nothing", as
          // security-compliance.tsx puts it, because on /security and
          // /client-portal those edges ARE the page's rails, which the band is
          // pulled out to meet. Grounding it here to stop the rails crossing
          // it took those two lines with them, and the outer cells were left
          // open on the left and right. Barely visible in light; plainly
          // broken in dark.
          //
          // Side-specific colour utilities so the top border keeps the grid's
          // tone while the sides take the band's own, matching the hairlines
          // between the cells they close.
          bandClassName={`relative border-x border-x-border bg-background ${BUILDER_RAIL_HALO_WIDE} [[data-theme=dark]_&]:border-x-[#383838]`}
          // ON THE RAILS. The band divided the measure into quarters while the
          // page divides it into sixths, so its hairlines and the rails above
          // and below it ran at two rhythms a pixel or so apart — read as a
          // doubled line rather than as a grid. Six cells with the ends left
          // empty puts every vertical in the band on a rail.
          bandOnRails
        />

        {/* THE BAND'S OWN CLOSING RULE, so it takes the default tone rather
            than the rails'. The band is a box: its top edge, its sides and the
            hairlines between its cells are all drawn at the grid line's solid
            tone, and the rail tone underneath them is faint enough that the
            band read as open at the foot with a rule missing. Every other
            divider on the page joins two stretches of plain type, where the
            rails' own weight is the right one. */}
        <GridDivider />

        <Reveal variant="fade">
          <WholeStack />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* THE FAQ TAKES THE PAGE GROUND AND THE WIDE RAIL HALO, for the
            reason /ai-app-builder's does: it is the one block here with no
            fill of its own, so six rails would run straight down through the
            questions and cross every dotted rule — a grid laid over the part
            of the page that is plain reading. An opaque ground interrupts
            them, and the halo fades them out either side of it instead of
            cutting all six on one scanline. */}
        <div className={`relative bg-background ${BUILDER_RAIL_HALO_WIDE}`}>
          <Reveal variant="fade">
            {/* -mx-3 so the questions start on the measure, level with the
                heading and with the ruled list in the section above. */}
            <HomeFAQ listClassName="-mx-3" />
          </Reveal>
        </div>

        {/* Full-bleed: the seam between the page and its close. The CTA sits
            INSIDE the region, so the grid carries on behind it and this is a
            rule rather than an ending — the grid's own foot is the mask on
            the rails. */}
        <GridDivider fullBleed lineClass={BUILDER_GRID_LINE} />

        {/* The free plan stated in the close itself. V1 leaves it to the two
            chips under the buttons, which are the smallest type on the page
            and the last thing read — the brief asks for it reinforced, and a
            heading is where a visitor weighing the cost is looking. */}
        <CTA
          transparent
          // ONE LINE, NOT TWO SENTENCES BROKEN ACROSS A <br>. "Start free. /
          // Stay free until it earns its keep." set a short first line over a
          // long second one, so the two halves read as a heading and a
          // subheading rather than as one title — and the hard break was doing
          // that, not the measure. A single clause needs no break at all.
          heading="Start free and stay free"
          subheading={
            <>
              The free plan is free forever — one app, real clients, no card.
              <br className="hidden md:inline" />
              Upgrade when the work outgrows it, not before.
            </>
          }
        />
      </div>
    </>
  );
}
