import { SIGNUP_URL } from "@/lib/constants";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { BuiltOnExamples } from "@/components/built-on/built-on-examples";
import { BuiltOnFaq } from "@/components/built-on/built-on-faq";
import { BuiltOnCta } from "@/components/built-on/built-on-cta";
import { HeroField } from "@/components/built-on/hero-field";
import { BuiltOnViewTracker } from "@/components/built-on/built-on-view-tracker";
import type { BuiltOnEventProps } from "@/components/built-on/built-on-events";
import {
  getBuiltOnExamples,
  industryPhrase,
  type BuiltOnFirm,
} from "@/lib/built-on-firms";
import type { Template } from "@/lib/templates";
import { FirmMark } from "@/components/built-on/firm-mark";

/**
 * The page a client lands on from the "Built on Assembly" badge in a firm's
 * portal, login screen or email footer. It is written for someone who has never
 * heard of us and has just used the product without knowing it, so the page
 * carries one action and nothing to weigh it against.
 */

// Everything the badge knows travels through to signup, so a workspace can be
// credited for the client it sent. `s` is the badge surface (login, email,
// footer); `w` is the firm's workspace.
function signupHref(workspaceId?: string, surface?: string) {
  const params = new URLSearchParams({ source: "built-on" });
  if (workspaceId) params.set("w", workspaceId);
  if (surface) params.set("s", surface);
  return `${SIGNUP_URL}&${params.toString()}`;
}

function Hero({
  firm,
  workspaceId,
  surface,
  event,
}: {
  firm?: BuiltOnFirm;
  workspaceId?: string;
  surface?: string;
  event: BuiltOnEventProps;
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-24 text-center md:pb-44 md:pt-32">
      {/* The firm's colour, carried by the field rather than by a panel or a
          tinted headline: it colours the page without asking the brand to
          survive being put behind text. */}
      <HeroField color={firm?.brandColor} />
      <div className="relative mx-auto max-w-3xl">
        {firm ? <FirmMark firm={firm} /> : null}

        <h1 className="type-display mt-7 text-balance text-foreground">
          {firm
            ? `${firm.name} runs client experience on Assembly.`
            : "Firms run their client experience on Assembly."}
        </h1>

        <p className="type-lead mx-auto mt-5 max-w-lg text-balance text-muted-foreground">
          You just used it. Build one for your business.
        </p>

        <div className="mt-8">
          <BuiltOnCta href={signupHref(workspaceId, surface)} event={event} />
        </div>
      </div>
    </section>
  );
}

function Examples({
  firm,
  workspaceId,
  surface,
  catalogue,
}: {
  firm?: BuiltOnFirm;
  workspaceId?: string;
  surface?: string;
  catalogue?: Template[];
}) {
  const phrase = industryPhrase(firm?.industry);
  return (
    <BuiltOnExamples
      signupHref={signupHref(workspaceId, surface)}
      // A firm whose industry we don't recognise gets the generic heading, not
      // a half-personalized one, since the four apps below it are generic too.
      heading={
        phrase
          ? `The kind of thing ${phrase} builds`
          : "The kind of thing firms build"
      }
      templates={getBuiltOnExamples(firm, catalogue)}
    />
  );
}

function ClosingCta({
  workspaceId,
  surface,
  event,
}: {
  workspaceId?: string;
  surface?: string;
  event: BuiltOnEventProps;
}) {
  return (
    <>
      <GridDivider />
      <section className="px-6 py-16 text-center md:py-24">
        <h2 className="type-display mx-auto max-w-md text-balance text-foreground md:max-w-2xl">
          Build one for your business
        </h2>
        <p className="type-lead mx-auto mt-5 max-w-sm text-balance text-muted-foreground sm:max-w-xl">
          Describe the app your clients need. Assembly builds and runs it.
        </p>
        <div className="mt-8">
          <BuiltOnCta href={signupHref(workspaceId, surface)} event={event} />
        </div>
      </section>
    </>
  );
}

export function BuiltOnPage({
  firm,
  workspaceId,
  surface,
  catalogue,
}: {
  firm?: BuiltOnFirm;
  /** Resolved on the server, since rank comes from the CMS. */
  catalogue?: Template[];
  /** The raw `?w=`, kept even when it matched nothing so signup still gets it. */
  workspaceId?: string;
  surface?: string;
}) {
  // One object, shared by the view and both CTAs, so a click can always be
  // matched to the view it came from.
  const event: BuiltOnEventProps = {
    workspace_id: workspaceId,
    surface,
    personalized: Boolean(firm),
    firm: firm?.name ?? null,
  };

  return (
    <>
      <BuiltOnViewTracker {...event} />
      {/* No rails through the hero. It is one centred column of text with
          nothing sitting on the 1200px grid, so rails there frame empty space
          on both sides rather than guiding anything. They start where the
          content that uses them starts. */}
      <Hero
        firm={firm}
        workspaceId={workspaceId}
        surface={surface}
        event={event}
      />
      {/* No rule between the hero and the first section. The hero already ends
          on a wide band of empty page, and a full-bleed line across it read as
          a lid rather than as a join. The rails starting is separation enough.
          The rules further down stay, because those genuinely divide two
          sections that sit close together. */}
      <div className="relative">
        <GridRails fadeTop={280} />
        <Examples
          firm={firm}
          workspaceId={workspaceId}
          surface={surface}
          catalogue={catalogue}
        />
        <GridDivider />
        <BuiltOnFaq />
        <ClosingCta workspaceId={workspaceId} surface={surface} event={event} />
      </div>
    </>
  );
}
