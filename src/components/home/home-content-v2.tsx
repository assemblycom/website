import type { ReactNode } from "react";
import { HowItWorks } from "@/components/home/how-it-works";
import { HomeFAQ } from "@/components/home/faq";
import { CTA } from "@/components/home/cta";
import { WholeStack } from "@/components/home/whole-stack";
import { Reveal } from "@/components/ui/reveal";
import { GridDivider } from "@/components/ui/grid-lines";
import {
  BUILDER_GRID_LINE,
  BUILDER_GRID_LINE_BG,
  BUILDER_RAIL_HALO_WIDE,
  BuilderGridRails,
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
  TRACKER_PLAN_DOC,
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
export function HomeProofBand({
  rails = false,
  headroom = false,
}: { rails?: boolean; headroom?: boolean } = {}) {
  return (
    <Reveal variant="fade">
      <ProofBand rails={rails} headroom={headroom} />
    </Reveal>
  );
}

export function HomeContentV2({
  // True where the hero passed in carries the grid itself (V2's does), so the
  // content region picks the rails up at full strength instead of fading them
  // in over its first 200px — which, under a hero that already has them, is a
  // dip in the middle of one continuous grid rather than an opening.
  heroRails = false,
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
      <HomeProofBand rails />
    </>
  ),
}: {
  hero?: ReactNode;
  heroRails?: boolean;
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
        <BuilderGridRails fadeTop={!heroRails} />

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
            // Click to change step. See `manual` — this page opens on a hero
            // with its own product shot, and a second panel advancing by
            // itself a screen below it competes with it.
            manual
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
            // A CLIENT PROJECT TRACKER, not the booking calendar the product
            // page's version of these scenes runs. The three steps are one
            // session — what you typed, what came back, what got built — so
            // the prompt, the plan document and the published app all have to
            // name the same thing. /ai-app-builder keeps the calendar.
            // THE PLAN STEP SITS ON A GRADIENT, not on its photograph. Its
            // screen is a DOCUMENT — a white page — and a white page on a
            // photograph is still a white page, with the picture behind it
            // doing no work. The ramp is the builder's own lime-to-blue, read
            // top to bottom, so the one step that is about what the AI came
            // back with wears the AI's colours. The other three keep their
            // pictures: each of those is a screen, and a screen on a desk is
            // a thing someone is doing.
            // THE PUBLISHED APP'S PHOTOGRAPH IS SOFTENED. That step lays a
            // whole portal screen over its picture — a sidebar, a list and
            // three progress bars against two people at a desk — and the two
            // competed, both in focus. The others put one object on a shot
            // that is still the picture.
            blurSteps={["build"]}
            stepGrounds={{
              plan: "bg-[linear-gradient(to_bottom,#f4f7fc_0%,#dde4f5_8%,#c3cae7_26%,#bcc6e6_50%,#c6d6bd_70%,#d4e79f_86%,#dcee92_100%)]",
            }}
            stepUi={{
              // CENTRED. The composer carries `sm:mt-[66px] sm:mb-auto`, which
              // is the arithmetic that drops it clear of the "Describe" heading
              // on /ai-app-builder's panel. There is no heading over it here,
              // so that offset just sat it high in the picture.
              describe: (
                // 620 WIDE FROM sm, WHICH IS THE SCENE'S OWN DESIGN WIDTH.
                // MockFit scales a scene to the frame it is given, and this
                // frame was the whole 938px panel: a 620x400 scene drawn at
                // 1.2, so the mock's 13.5px body landed at 16 and every rule
                // and radius in it grew with the type. Every step on this
                // panel is held to its design width now, so each one draws at
                // 1:1 and the four read as one set of screens rather than as
                // four zoom levels. The phone keeps the full width — the
                // scene has its own 360px box there and is already near 1:1.
                <div className="absolute inset-y-0 left-0 right-0 [&_.template-mock-fit>div>div]:my-auto! sm:left-1/2 sm:w-[620px] sm:max-w-full sm:-translate-x-1/2">
                  <DescribeCard
                    plain
                    typing
                    prompt="Add a project tracker each client sees for their own projects."
                  />
                </div>
              ),
              // FLUSH TO THE FOOT. The plan is a document longer than the
              // window it is read in, and it is drawn to be cut by its own
              // bottom edge — so a band of photograph under it read as the
              // document ending early rather than as a page running on. The
              // frame drops to the panel's own foot, and the card with it.
              plan: (
                // NARROWED BY ITS HEIGHT, not by its sides. From sm the card
                // is HEIGHT-bound in this frame: it fills the frame's height
                // exactly and takes whatever width that leaves, which is what
                // keeps it cut by the panel's foot rather than floating above
                // it. So insetting the sides would only have left slack for
                // MockFit to centre. Dropping the frame's top is what makes
                // the card smaller, and the foot stays where it was.
                //
                // On a phone the frame is wider than the card's own shape, so
                // MockFit sizes the card by the width and centres the slack —
                // dropping the frame to the foot there just recentres it. The
                // frame takes the card's 6:5 instead, which leaves no slack to
                // centre, and sits on the panel's floor.
                // ON A PHONE IT IS PLACED, NOT CROPPED. The phone panel is
                // 320 tall against the photograph's own 340 wide, so a frame
                // running the full width at the scene's 6:5 filled the cell
                // edge to edge: the picture survived as two 16px slivers down
                // the sides and the card was cut by the panel's floor at the
                // same time. The frame keeps the scene's shape but gives up
                // the width, so the card sits on the photograph with the
                // picture around it — which is what the Describe step does
                // and the one treatment on this panel that reads.
                // AND HELD TO THE SCENE'S 620 FROM sm — see the Describe
                // step above. The frame still runs past the panel's foot, so
                // the card is still cut by it; it is only the WIDTH that is
                // pinned, which is what takes the scale back to 1:1.
                // AND ITS OWN 400 HEIGHT, anchored past the panel's floor.
                // Pinning only the width left the 400-tall scene with slack
                // in a 464-tall frame, and MockFit centres slack — so the
                // document floated with a band of photograph under it, which
                // is the exact thing this step is drawn not to do. Given its
                // design height and hung off the bottom, it is cut by the
                // panel again.
                <div className="absolute inset-x-6 -bottom-4 top-auto aspect-[6/5] sm:left-1/2 sm:right-auto sm:top-auto sm:h-[400px] sm:w-[620px] sm:max-w-full sm:-translate-x-1/2 sm:bottom-0 sm:aspect-auto md:h-[460px] md:-bottom-10">
                  <PlanCard plain tall doc={TRACKER_PLAN_DOC} />
                </div>
              ),
              // FLUSH TO THE FOOT. This scene is WIDTH-bound in the panel —
              // it takes the full measure and whatever height that leaves —
              // so pulling the frame's bottom past the floor did nothing but
              // re-centre the card in a taller box, and it sat ~56px above
              // the photograph's foot reading as a short card rather than as
              // a screen the panel is cropping. The frame takes the scene's
              // own aspect at each breakpoint instead, which leaves no slack
              // for MockFit to centre, and sits on the floor.
              //
              // The negative bottom is how it reaches that floor: every step
              // here is drawn inside an inset box (inset-4 / 6 / 10), so
              // `bottom-0` is the inset's foot and still left the panel's own
              // padding showing under the screen. These numbers cancel it.
              build: (
                // Phone: see the Plan step above — placed on the photograph
                // rather than filling it and being cut by the floor.
                // ANCHORED TO THE TOP FROM sm, not the foot. Bottom-anchored
                // with its own aspect, the screen sat about 170px below the
                // tab strip with nothing at all under it — a third of the
                // panel spent on photograph above the one thing the step is
                // about. The phone keeps its placement (see the Plan step).
                // The frame's foot sits well past the panel's own, so the
                // screen is CROPPED by the panel rather than ending on it.
                // Landed exactly on the floor it still finished about six
                // pixels short: the scene is scaled to fit, and any rounding
                // in that scale shows as a strip of photograph under the
                // screen. There is no strip to show if the screen runs past
                // the edge.
                <div className="absolute inset-x-6 -bottom-4 top-auto aspect-[360/300] sm:inset-x-0 sm:aspect-auto sm:-bottom-6 sm:top-0 md:-bottom-14">
                  <BuildCard plain tracker tall closedRight />
                </div>
              ),
              // The chat alone, on the photograph — no window and no table.
              // Its scene is landscape like the others now, so it needs none
              // of the taller frame the portrait rail card used to want.
              iterate: (
                // 680 WIDE FROM sm, the chat scene's own design width. Given
                // the whole panel it was drawn at 1.5, which put a 13.5px
                // message at 19 — larger than the section's own body copy, on
                // the one step whose subject is a chat window.
                <div className="absolute inset-y-0 left-0 right-0 sm:left-1/2 sm:w-[680px] sm:max-w-full sm:-translate-x-1/2">
                  <IterateCard reply />
                </div>
              ),
            }}
          />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* The customer stories, then the capability index they raise: a
            visitor convinced by the stories is the one who then asks what is
            actually in the box. */}
        <Reveal variant="fade">
          <CustomerProof />
        </Reveal>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* THE RAILS GO SOFT UNDER THE INDEX, IN DARK ONLY. This block is
            plain reading — nine dotted rules and their labels — and in dark
            the rails crossing it are the brightest lines in the stretch,
            drawn at full strength straight through the list. The FAQ below
            solves the same problem with an opaque ground, but that takes the
            grid out of a whole screen of the page; here a small backdrop blur
            keeps the grid present and takes it out of focus, so it reads as
            the surface the list sits on rather than as lines over the text.
            Light needs none of it: there the rails are ink at 5.5% on white
            and already sit under the type. */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden [[data-theme=dark]_&]:block [[data-theme=dark]_&]:backdrop-blur-[3px]"
          />
          <div className="relative">
            <Reveal variant="fade">
              {/* Nine rows, not ten. Security has a section of its own
                  directly below, with the certifications and the way through
                  to /security — so the row here was the same argument a
                  second time, and the weaker of the two. */}
              <WholeStack omit={["Security"]} />
            </Reveal>
          </div>
        </div>

        <GridDivider lineClass={BUILDER_GRID_LINE} />

        {/* THE PRODUCT PAGES' SECURITY SECTION, not a homepage one.
            PortalTrust is what /client-portal and both solution pages already
            run — the claim and its way out on the left, the certification
            seals closing it. It carries its own Reveal, so there is no
            wrapper here.

            BETWEEN THE STACK AND THE FAQ, not before them. The capability
            index and the FAQ are the same object twice: a sticky heading in
            the left column and a list of dotted rules you open in the right.
            Run back to back they read as one very long accordion that changes
            subject halfway. The security section is the page's one block with
            a band of its own, so it breaks the pair and closes the product
            argument where a buyer actually asks the question.

            THE GRID RUNS BEHIND IT. An earlier pass grounded the whole
            section to stop the rails fighting the seal band's own dividers,
            and that took the grid out of a full screen of the page. Only the
            BAND needs the ground — see `bandClassName` — so the rails are
            back everywhere else.

            Only the heading, lead and link are this page's: the brief asks
            the homepage to link out to the security centre, where the product
            pages send a reader to the Trust Center. */}
        <PortalTrust
          eyebrow="Security"
          heading="Client data your clients can trust you with"
          body="Your apps inherit the platform's security rather than reinventing it. SOC 2 Type II certified, with HIPAA, GDPR and CCPA support."
          link={{ label: "How Assembly keeps data safe", href: "/security" }}
          // NO ROWS TO OPEN. The four claims are drawn with the FAQ's own
          // accordion, which is exactly what made this stretch of the page
          // read as three identical lists in a row. The seals say the same
          // thing in a shape nothing else here uses, and the detail behind
          // them is one click away on /security — which is what the link is
          // for. The product pages keep their rows; only the homepage drops
          // them.
          claims={[]}
          // The band's frame below closes it on all four sides, so the band
          // itself must not also draw the phone-only rule it normally uses to
          // close its last row — the two landed a pixel apart under the bottom
          // two seals and read as a doubled line.
          bandFramed
          // ONE TONE FOR EVERY LINE ON THIS PAGE. The band's hairlines were
          // --border, a step darker than the rails running past it, so a
          // column handed over from a faint rail to a darker divider and the
          // grid read as two colours. They take the rails' own tone now, as
          // the band's frame and the FAQ's side rules below do.
          bandLineClass={BUILDER_GRID_LINE_BG}
          // AND ITS OWN SIDE EDGES. The band draws hairlines only BETWEEN
          // its cells — "the outer edges get nothing", as
          // security-compliance.tsx puts it, because on /security and
          // /client-portal those edges ARE the page's rails, which the band is
          // pulled out to meet. Grounding it here to stop the rails crossing
          // it took those two lines with them, and the outer cells were left
          // open on the left and right. Barely visible in light; plainly
          // broken in dark.
          //
          // A HARD 2px RING BEFORE THE SOFT HALO, which is why this no longer
          // takes BUILDER_RAIL_HALO_WIDE as it is. The rails are 1px spans
          // centred on the measure's sixths, so the outer two straddle the
          // band's own edges — half a pixel of rail sits OUTSIDE the band's
          // border on each side, and the soft halo is only ~65% opaque that
          // close in, so it never quite covered it. A faint line half a pixel
          // from a solid one reads as a doubled edge. The crisp ring covers
          // the overhang outright; the 96px halo still does its own job of
          // fading the rails out above and below.
          //
          // AND ITS FOOT. The closing rule used to be a GridDivider after this
          // section, and it was never visible: the band is taller than the
          // section that holds it and paints an opaque ground, so the divider
          // landed behind it. The seals sat in a box open at the bottom. The
          // border belongs on the band itself, which is the thing being
          // closed.
          //
          // ONE TONE ON ALL FOUR SIDES, and NO border-x. The band is a box
          // drawn in three greys: its cells were separated by `gap-px`, so the
          // hairlines inside it were --border, while the top edge came in at
          // the grid line's lighter --color-grid. Against the FAQ's own side
          // rules below — also --border — the top of the band read as a
          // different line from the rest of it, and the column the two share
          // changed weight halfway down. Every drawn edge here is one tone
          // now; the rails behind stay fainter, which is what a backdrop
          // should be.
          //
          // The sides are gone from here because a border paints INSIDE the
          // box — its left edge covered 120 to 121 while the rail behind it
          // covers 119.5 to 120.5, and the pair read as one thick, off-centre
          // line. SecurityCompliance draws all seven of the band's verticals
          // as rail-geometry spans instead (see `railAligned`), the same fix
          // the FAQ's own sides take below. Under 1200px there are no rails to
          // collide with and the spans are not drawn, so the border comes back
          // to close the band.
          bandClassName={`relative border-b max-[1199px]:border-x ${BUILDER_GRID_LINE} bg-background shadow-[0_0_0_2px_var(--background),0_0_96px_10px_var(--background)]`}
          // ON THE RAILS. The band divided the measure into quarters while the
          // page divides it into sixths, so its hairlines and the rails above
          // and below it ran at two rhythms a pixel or so apart — read as a
          // doubled line rather than as a grid. Six cells with the ends left
          // empty puts every vertical in the band on a rail.
          bandOnRails
        />

        {/* THE FAQ TAKES THE PAGE GROUND AND THE WIDE RAIL HALO, for the
            reason /ai-app-builder's does: it is the one block here with no
            fill of its own, so six rails would run straight down through the
            questions and cross every dotted rule — a grid laid over the part
            of the page that is plain reading. An opaque ground interrupts
            them, and the halo fades them out either side of it instead of
            cutting all six on one scanline. */}
        <div className={`relative bg-background ${BUILDER_RAIL_HALO_WIDE}`}>
          {/* THE MEASURE'S OWN SIDES, redrawn. The ground above is what stops
              six rails running down through the questions, but it takes the
              OUTER two with them — and those are the ones holding the block
              on the page, so the FAQ was the one section floating free of the
              grid. Drawn at the band's weight rather than the rails', for the
              same reason the band's are: a line that has to be read against
              plain type, with no fill behind it, needs more than 5.5%. */}
          {/* TWO SPANS, NOT A border-x, and that is the whole point of the
              shape. A border is drawn INSIDE the 1200 box — its left edge
              lands on 120 and covers 120 to 121 — while the rail behind it is
              a `w-px -translate-x-1/2` span centred on 120, covering 119.5 to
              120.5. Half a pixel apart, the two paint 1.5px of line between
              them, which is the doubled rule down the FAQ's left side (and
              its right). These spans take the rails' own geometry, so each
              one lands exactly on the rail it is redrawing and the two read
              as one line at the band's weight. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[1200px] -translate-x-1/2"
          >
            <span
              className={`absolute inset-y-0 left-0 w-px -translate-x-1/2 ${BUILDER_GRID_LINE_BG}`}
            />
            <span
              className={`absolute inset-y-0 right-0 w-px translate-x-1/2 ${BUILDER_GRID_LINE_BG}`}
            />
          </div>
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
              Get started for free, with no credit card required.
              <br className="hidden md:inline" />
              {" "}Upgrade only when you need more.
            </>
          }
        />
      </div>
    </>
  );
}
