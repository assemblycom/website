import { IconBrandMark } from "@/components/home/mock-icons";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { SplitHeroPanel } from "@/components/comparison/split-hero-panel";

// One ramp for both sides, so the switch never changes the type under the
// reader. Reading sizes rather than the mock scale, because on a phone this
// card is the only screen in the hero.
const HERO_TITLE = "text-[16px] leading-[1.3]";
const HERO_BODY = "text-[14px] leading-[1.45]";
const HERO_LABEL = "text-[13px] leading-[1.4]";
const HERO_BUTTON = "text-[13px] leading-none";

/**
 * Lovable's hero: the two sides of one app, labelled as the brief labels
 * them. The team builds it in the chat; the client signs in and uses it.
 */
export function TeamClientsHeroVisual() {
  return (
    <SplitHeroPanel
      label="Whose side"
      blurFoot
      views={[
        { label: "Your team", content: <BuildChat /> },
        { label: "Your clients", content: <ClientApp /> },
      ]}
    />
  );
}

/** The team side: a request, the builder's plan, and room to revise it. */
export function BuildChat() {
  return (
    <div aria-hidden className="flex h-full select-none flex-col p-5">
      {/* Square, at the login screen's radius for a mark this size. It was a
          circle, which made it the only round-cornered object on a card whose
          every other corner is a rectangle's — and the brand mark is drawn
          square everywhere else in the mock family. */}
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-foreground text-background">
        <IconBrandMark className="size-4" />
      </span>
      {/* Copy review: the prompt is mine; the reply, the plan card's title
          and the composer placeholder reuse the builder strings on
          /ai-app-builder. */}
      <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <p
          className={`max-w-[85%] self-end rounded-[10px] bg-muted px-4 py-2.5 ${HERO_BODY} text-foreground dark-ui:bg-white/[0.08]`}
        >
          Build a client onboarding wizard my clients can save progress in.
        </p>
        <p
          className={`max-w-[85%] rounded-[10px] bg-muted px-4 py-2.5 ${HERO_BODY} text-foreground dark-ui:bg-white/[0.08]`}
        >
          Here is the plan. Approve it and I will start building.
        </p>
        {/* 10px, the comparison cards' mock radius, shared with the bubbles
            above. At 12 and 16 the three read softer than the window they sit
            in. */}
        <div className="rounded-[10px] border border-border px-4 py-3 dark-ui:border-white/15">
          <p className={`${HERO_BODY} text-foreground`}>
            Client onboarding wizard
          </p>
          <p className={`mt-1 ${HERO_LABEL} text-muted-foreground`}>
            Multi-step onboarding flow with saved progress
          </p>
          {/* 4px, the radius the mocks' own buttons take: this is a button
              inside a product screen, not one of the page's real buttons. */}
          <span
            className={`mt-3 inline-flex rounded-[4px] bg-foreground px-3 py-1.5 ${HERO_BUTTON} text-background`}
          >
            Approve
          </span>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-2 rounded-full border border-border py-1.5 pl-4 pr-1.5 dark-ui:border-white/15">
        <span className={`flex-1 ${HERO_BODY} text-muted-foreground`}>
          Type to revise plan
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
          <IconArrowUp className="size-4" />
        </span>
      </div>
    </div>
  );
}

// A questionnaire part-filled: two answers in, and the next one empty with the
// caret in it, so the card shows the client mid-way rather than a meter saying so.
const CLIENT_FIELDS = [
  { label: "Full name", value: "Renee Castillo" },
  { label: "Email", value: "renee@magnaco.com" },
  { label: "What should we help with first?", placeholder: "Type your answer" },
];
const ONBOARDING_STEPS = 3;
const ONBOARDING_STEP = 2;

/**
 * The client side: the wizard the team just approved, as the client meets it.
 * Who is looking is the point, so it says so first: the firm's own header,
 * a greeting by name, and their progress
 * saved where they left it. Set at reading sizes, not product scale, because
 * on a phone this card is the only screen in the hero.
 */
export function ClientApp() {
  return (
    <div aria-hidden className="flex h-full select-none flex-col">
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4 dark-ui:border-white/10">
        <span className="flex size-7 items-center justify-center rounded-[8px] bg-foreground text-background">
          <IconBrandMark className="size-3.5" />
        </span>
        <span className={`flex-1 ${HERO_BODY} text-foreground`}>
          Brandmages
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <p className={`${HERO_TITLE} text-foreground`}>Welcome back, Renee</p>
        <p className={`mt-1 ${HERO_LABEL} text-muted-foreground`}>
          Pick up where you left off.
        </p>
        {/* The inner card sits on a well tint so it reads as a panel inside
            the window, and the fields go back to the window colour so they
            read as inputs lifted off it. */}
        <div className="mt-4 flex flex-1 flex-col rounded-xl border border-[var(--mock-line)] bg-[var(--mock-well)] px-4 py-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className={`${HERO_BODY} text-foreground`}>Client onboarding</p>
            <p
              className={`shrink-0 ${HERO_LABEL} tabular-nums text-muted-foreground`}
            >
              Step {ONBOARDING_STEP} of {ONBOARDING_STEPS}
            </p>
          </div>
          {CLIENT_FIELDS.map(({ label, value, placeholder }) => (
            <div key={label} className="mt-3">
              <p className={`${HERO_LABEL} text-muted-foreground`}>{label}</p>
              <p
                className={`mt-1.5 flex items-center rounded-[6px] border border-[var(--mock-line)] bg-[var(--mock-window)] px-3 py-2.5 ${HERO_BODY} text-foreground`}
              >
                {value ?? (
                  <>
                    {/* The caret sits before the placeholder, where typing
                        would start, on the site's note-caret blink. */}
                    <span
                      className="mr-px inline-block h-[1.1em] w-px bg-foreground"
                      style={{ animation: "note-caret 1.06s infinite" }}
                    />
                    <span className="text-muted-foreground">{placeholder}</span>
                  </>
                )}
              </p>
            </div>
          ))}
          <div className="mt-auto flex items-center justify-end pt-4">
            <span
              className={`rounded-[4px] bg-foreground px-3 py-2 ${HERO_BUTTON} text-background`}
            >
              Continue
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
