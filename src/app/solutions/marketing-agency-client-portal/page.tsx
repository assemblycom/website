import type { Metadata } from "next";
import { GridDivider, GridRails } from "@/components/ui/grid-lines";
import { PortalSocialProof } from "@/components/client-portal/portal-social-proof";
import { PortalProblem } from "@/components/client-portal/portal-problem";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { PortalBuild } from "@/components/client-portal/portal-build";
import { DEMO_URL, SIGNUP_URL } from "@/lib/constants";
import { PAGE_SEO, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  PAGE_SEO.marketingAgencyClientPortal,
);

/**
 * The agency cut of /client-portal, built the same way its accounting sibling
 * is: the same components, this vertical's copy passed in. See
 * src/app/solutions/accounting-client-portal/page.tsx for the pattern.
 *
 * Sections 5-11 are still to come; this file carries 1-4.
 *
 * The visuals V1-V4 are not built. Every slot holds its shape and draws
 * nothing, with its art direction in `title` — never /client-portal's picture,
 * which runs that page's own firm.
 */

/** Section 3. All five resolve from the committed templates. */
const AGENCY_APPS = [
  {
    slug: "design-approvals",
    title: "Design approvals",
    description: "Creative sign-off, round by round.",
    foundation: "Approvals",
  },
  {
    slug: "content-approval-flow",
    title: "Content approval flow",
    description: "Posts and campaigns with status history.",
    foundation: "Content",
  },
  {
    slug: "proposal-builder",
    title: "Proposals",
    description: "Branded proposals clients can e-sign.",
    foundation: "Proposals",
  },
  {
    slug: "client-project-tracker",
    title: "Client project tracker",
    description: "Milestones and live progress for every engagement.",
    foundation: "Projects",
  },
  {
    slug: "time-tracker",
    title: "Time tracker",
    description: "Log billable hours by client and export timesheets.",
    // Marked "(Internal)" in the handoff; carried as the site's mono chip
    // rather than as words inside the title, same as the accounting page.
    foundation: "Internal",
  },
];

export default function MarketingAgencyClientPortalPage() {
  return (
    <>
      {/* 1. Hero. Same split header as the accounting page. The CTAs are the
          other way round here, per the handoff: an agency is a faster,
          self-serve sale than a firm, so the free start leads. */}
      <section className="pb-16 pt-24 md:pb-24 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
            <h1 className="type-display max-w-[30ch] text-balance lg:col-start-1">
              Turn your agency&rsquo;s know-how into AI-built apps
            </h1>
            <p className="type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
              Assembly gives your agency a branded client portal for reports,
              approvals, invoices, and files. Use AI to build what sets your
              agency apart, from analytics dashboards to design review apps.
            </p>
            <div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={SIGNUP_URL}
                  className="w-full rounded-lg bg-foreground px-5 py-3 text-center text-sm text-background transition-opacity hover:opacity-90 sm:w-auto sm:py-2.5"
                >
                  Get started free
                </a>
                <a
                  href={DEMO_URL}
                  className="w-full rounded-lg border border-foreground/20 bg-transparent px-5 py-3 text-center text-sm text-foreground transition-colors hover:bg-foreground/5 sm:w-auto sm:py-2.5"
                >
                  Book a demo
                </a>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            title="V1 — the agency hero shot. Art direction pending."
            className="mt-12 h-[400px] rounded-[28px] bg-[var(--surface)] md:mt-16 md:h-[500px]"
          />
          <PortalSocialProof />
        </div>
      </section>

      <div className="relative">
        <GridRails />
        <GridDivider fullBleed />

        {/* 2. Problem. */}
        <PortalProblem
          heading="Stop scattering your deliverables across tools"
          body="Feedback in one app, files in another, reports in a third, invoices by email. Clients ask where things stand because they can't see it."
          sides={[]}
          quote={{
            // Quoted from the published Advertai study. See case-studies.ts.
            text: "We were dealing with scattered emails and no good way to share information with clients.",
            attribution: "Garrett Leonard, Founder, Advertai Marketing",
            href: "/customers/advertai-marketing",
          }}
          screens={
            <div
              aria-hidden
              title="V2 — the agency problem shot. Art direction pending."
              className="h-[300px] md:h-[400px]"
            />
          }
        />
        <GridDivider />

        {/* 3. Ready-made apps. */}
        <PortalReadyMade
          id="ready-made-apps"
          heading="Ready-made apps for how agencies deliver"
          body="Start with 30+ working apps, from design approvals to proposals clients sign and pay. Install one, then reshape it by describing the change."
          picks={AGENCY_APPS}
          link={{ label: "Browse all templates", href: "/templates" }}
        />
        <GridDivider />

        {/* 4. Build. No rail here: this handoff states the mechanism in one
            paragraph rather than stepping through it, so the section is claim,
            paragraph, actions and the picture. */}
        <PortalBuild
          heading="Retire a subscription. Build the app instead."
          body="Describe what you want. The builder asks a few questions, shows a one-page plan, and builds after you approve. Every app connects to your built-in CRM, so it already knows each client."
          steps={[]}
          cta={{ label: "Get started free", href: SIGNUP_URL }}
          // OPEN: the handoff leaves this target to the web lead — /ai-app-builder
          // if it is live, otherwise /blog/assembly-studio. /ai-app-builder is
          // new in this same PR, so the two ship together or not at all.
          link={{
            label: "See how the app builder works",
            href: "/ai-app-builder",
          }}
          visual={
            <div
              aria-hidden
              title="V4 — the agency build shot. Art direction pending."
              className="mt-12 h-[400px] rounded-3xl bg-[var(--surface)] md:h-[500px]"
            />
          }
        />
        <GridDivider />
      </div>
    </>
  );
}
