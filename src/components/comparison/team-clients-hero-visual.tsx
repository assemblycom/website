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
function BuildChat() {
  return (
    <div aria-hidden className="flex h-full select-none flex-col p-5">
      <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-background">
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
        <div className="rounded-2xl border border-border px-4 py-3 [[data-theme=dark]_&]:border-white/15">
          <p className="text-[13px] text-foreground">
            Client onboarding wizard
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            Multi-step onboarding flow with saved progress
          </p>
          <span className="mt-3 inline-flex rounded-md bg-foreground px-3 py-1.5 text-[12px] leading-none text-background">
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
function ClientApp() {
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
