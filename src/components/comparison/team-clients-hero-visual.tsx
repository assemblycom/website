import { IconBrandMark } from "@/components/home/mock-icons";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { SplitHeroPanel } from "@/components/comparison/split-hero-panel";

/**
 * Lovable's hero: the two sides of one app, labelled as the brief labels
 * them. The team builds it in the chat; the client signs in and uses it.
 */
export function TeamClientsHeroVisual() {
  return (
    <SplitHeroPanel
      label="Whose side"
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
        <p className="max-w-[85%] self-end rounded-2xl bg-muted px-4 py-2.5 text-[14px] leading-[1.5] text-foreground dark-ui:bg-white/[0.08]">
          Build a client onboarding wizard my clients can save progress in.
        </p>
        <p className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[14px] leading-[1.5] text-foreground dark-ui:bg-white/[0.08]">
          Here is the plan. Approve it and I will start building.
        </p>
        {/* 12px, the mock family's window radius (the builder hero's WINDOW
            draws the same card at the same step). At 16 it was rounder than
            the window it sits in. */}
        <div className="rounded-xl border border-border px-4 py-3 dark-ui:border-white/15">
          <p className="text-[13px] text-foreground">
            Client onboarding wizard
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Multi-step onboarding flow with saved progress
          </p>
          {/* 4px, the radius the mocks' own buttons take: this is a button
              inside a product screen, not one of the page's real buttons. */}
          <span className="mt-3 inline-flex rounded-[4px] bg-foreground px-3 py-1.5 text-[12px] leading-none text-background">
            Approve
          </span>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-2 rounded-full border border-border py-1.5 pl-4 pr-1.5 dark-ui:border-white/15">
        <span className="flex-1 text-[14px] text-muted-foreground">
          Type to revise plan
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-background">
          <IconArrowUp className="size-4" />
        </span>
      </div>
    </div>
  );
}

const CLIENT_FIELDS = [
  { label: "Full name", value: "Renee Castillo" },
  { label: "Email", value: "renee@magnaco.com" },
];
const ONBOARDING_STEPS = 3;
const ONBOARDING_DONE = 2;

/**
 * The client side: the wizard the team just approved, as the client meets it.
 * Who is looking is the point, so it says so first: the firm's own header with
 * the client signed in on the right, a greeting by name, and their progress
 * saved where they left it. Set at reading sizes, not product scale, because
 * on a phone this card is the only screen in the hero.
 */
export function ClientApp() {
  return (
    <div aria-hidden className="flex h-full select-none flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4 dark-ui:border-white/10">
        <span className="flex size-7 items-center justify-center rounded-[8px] bg-foreground text-background">
          <IconBrandMark className="size-3.5" />
        </span>
        <span className="flex-1 text-[14px] text-foreground">Brandmages</span>
        <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[11px] text-muted-foreground dark-ui:bg-white/[0.08]">
          RC
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <p className="text-[16px] leading-[1.3] text-foreground">
          Welcome back, Renee
        </p>
        <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">
          Pick up where you left off.
        </p>
        <div className="mt-4 rounded-xl border border-border px-4 py-3.5 dark-ui:border-white/15">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[14px] text-foreground">Client onboarding</p>
            <p className="shrink-0 text-[12px] text-muted-foreground">
              Step {ONBOARDING_DONE} of {ONBOARDING_STEPS}
            </p>
          </div>
          <div className="mt-2.5 flex gap-1">
            {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < ONBOARDING_DONE
                    ? "bg-foreground"
                    : "bg-muted dark-ui:bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
          {CLIENT_FIELDS.map(({ label, value }) => (
            <div key={label} className="mt-3">
              <p className="text-[12px] text-muted-foreground">{label}</p>
              <p className="mt-1 rounded-[4px] border border-border px-3 py-2 text-[13px] leading-none text-foreground dark-ui:border-white/15">
                {value}
              </p>
            </div>
          ))}
          <span className="mt-3.5 inline-flex rounded-[4px] bg-foreground px-3 py-1.5 text-[12px] leading-none text-background">
            Continue
          </span>
        </div>
      </div>
    </div>
  );
}
