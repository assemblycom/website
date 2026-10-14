import { IconBrandMark } from "@/components/home/mock-icons";
import { IconArrowUp } from "@/components/home/build-step-visual";
import { OnboardingMock } from "@/components/client-portal/segment-mock";
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
        <p className="max-w-[85%] self-end rounded-2xl bg-muted px-4 py-2.5 text-[14px] leading-[1.5] text-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
          Build a client onboarding wizard my clients can save progress in.
        </p>
        <p className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-[14px] leading-[1.5] text-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
          Here is the plan. Approve it and I will start building.
        </p>
        {/* 12px, the mock family's window radius (the builder hero's WINDOW
            draws the same card at the same step). At 16 it was rounder than
            the window it sits in. */}
        <div className="rounded-xl border border-border px-4 py-3 [[data-theme=dark]_&]:border-white/15">
          <p className="text-[13px] text-foreground">
            Client onboarding wizard
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Multi-step onboarding flow with saved progress
          </p>
          {/* 8px: the site's button radius, the one the real buttons on this
              page use. It was 6, which is a control radius, not a button's. */}
          <span className="mt-3 inline-flex rounded-lg bg-foreground px-3 py-1.5 text-[12px] leading-none text-background">
            Approve
          </span>
        </div>
      </div>
      <div className="mt-4 flex shrink-0 items-center gap-2 rounded-full border border-border py-1.5 pl-4 pr-1.5 [[data-theme=dark]_&]:border-white/15">
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

/** The client side: the same app, signed in, inside the firm's portal. */
export function ClientApp() {
  return (
    <div aria-hidden className="flex h-full select-none flex-col">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4 [[data-theme=dark]_&]:border-white/10">
        <span className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
          <IconBrandMark className="size-3" />
        </span>
        <span className="text-[13px] text-foreground">Brandmages</span>
      </div>
      <div className="min-h-0 flex-1">
        <OnboardingMock />
      </div>
    </div>
  );
}
