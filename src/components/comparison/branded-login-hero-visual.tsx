import { IconBrandMark } from "@/components/home/mock-icons";
import { SplitHeroPanel } from "@/components/comparison/split-hero-panel";

/**
 * Base44's hero, from its brief: the first screen a client sees. The firm's
 * own sign-in, on its own domain with its own mark and no platform badge,
 * against a generic hosted-app login. The generic side carries a neutral
 * placeholder mark, never Base44's.
 */
// Copy review: both switch labels, both domains and the sign-in copy are
// mine, not the brief's.
export function BrandedLoginHeroVisual() {
  return (
    <SplitHeroPanel
      label="Which sign-in"
      views={[
        {
          label: "Your portal",
          content: (
            <LoginScreen
              domain="portal.brandmages.com"
              mark={
                <span className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <IconBrandMark className="size-5" />
                </span>
              }
              title="Sign in to Brandmages"
            />
          ),
        },
        {
          label: "Hosted app",
          content: (
            <LoginScreen
              domain="your-app.hosted-platform.app"
              mark={
                <span className="size-11 rounded-xl bg-muted [[data-theme=dark]_&]:bg-white/[0.08]" />
              }
              title="Sign in"
              badge
            />
          ),
        },
      ]}
    />
  );
}

function LoginScreen({
  domain,
  mark,
  title,
  badge = false,
}: {
  domain: string;
  mark: React.ReactNode;
  title: string;
  /** The hosting platform's badge, which the firm's own portal never shows. */
  badge?: boolean;
}) {
  return (
    <div aria-hidden className="flex h-full select-none flex-col">
      {/* The address bar is the point: whose domain the client lands on. */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 [[data-theme=dark]_&]:border-white/10">
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-muted [[data-theme=dark]_&]:bg-white/15"
            />
          ))}
        </span>
        <span className="flex-1 truncate rounded-full bg-muted px-3 py-1 text-center text-[11px] text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08]">
          {domain}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-8">
        {mark}
        <p className="mt-5 text-[18px] text-foreground">{title}</p>
        <div className="mt-6 w-full rounded-lg border border-border px-3.5 py-2.5 text-[13px] text-muted-foreground [[data-theme=dark]_&]:border-white/15">
          Email
        </div>
        <div className="mt-3 w-full rounded-lg bg-foreground py-2.5 text-center text-[13px] text-background">
          Continue
        </div>
      </div>
      {badge && (
        <div className="flex justify-center pb-5">
          <span className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-muted-foreground [[data-theme=dark]_&]:border-white/15">
            <span className="size-2.5 rounded-sm bg-muted-foreground/40" />
            Built with a hosted platform
          </span>
        </div>
      )}
    </div>
  );
}
