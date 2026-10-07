import { APP_URL, DEMO_URL, SIGNUP_URL } from "@/lib/constants";

// The prompt composer that used to sit here lost to the plain two-button hero,
// so the footer ends the page the same way that hero opens it. The buttons are
// the hero's own pair (see hero-big.tsx), minus its experiment tracking.
const PRIMARY_CTA =
  "inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-foreground px-4 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2 md:px-5 md:py-2.5 [[data-theme=dark]_&]:bg-white [[data-theme=dark]_&]:text-neutral-900";
export function CTA() {
  // bg-background in both themes so the CTA sits on the same canvas as the
  // rest of the landing page instead of introducing its own tint.
  return (
    <section className="bg-background px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl pb-16 pt-16 text-center md:pb-24 md:pt-24">
        <h2 className="type-h2 text-balance leading-[1.12] text-neutral-900 [[data-theme=dark]_&]:text-white">
          Build the business
          <br />
          only you can build
        </h2>
        <p className="type-lead mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground">
          Stop stitching together tools that were never meant to work together.
          {/* Each sentence on its own line from md up; narrower screens wrap
              naturally. */}
          <br className="hidden md:inline" />
          Run everything and build anything in one place.
        </p>

        <div className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          {/* Signed in, the primary opens the workspace instead of signup:
              both ship and `data-authed` picks one before paint (globals.css). */}
          <a href={SIGNUP_URL} className={`unauth-only ${PRIMARY_CTA}`}>
            Get started
          </a>
          <a href={APP_URL} className={`auth-only ${PRIMARY_CTA}`}>
            Open Assembly
          </a>
          <a
            href={DEMO_URL}
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-foreground/20 bg-transparent px-4 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2 md:px-5 md:py-2.5"
          >
            Book demo
          </a>
        </div>
      </div>
    </section>
  );
}
