import { APP_URL, templateSignupUrl } from "@/lib/constants";
import { AuthLink } from "@/components/ui/auth-link";

/** The fields every template CTA needs to build its link. */
type CtaTemplate = { templateId?: string; title: string; description: string };

/**
 * The template CTA, in the one place all four surfaces read it from: the detail
 * page, the templates-page modal (desktop and mobile bars) and the hero's focus
 * modal. They differ only in `className`, so the destination and the labels are
 * decided here rather than four times over.
 *
 * Both auth states go to the SAME url — the signup link carrying `templateId`.
 * That is the dashboard's contract, not a shortcut: its session middleware
 * watches `/signup` for a `templateId` alongside a studio `referrer`, and when
 * the visitor already has a workspace it redirects them into it with that
 * template's details dialog open instead of running them through onboarding.
 * Sending a signed-in visitor to the bare app root is what this used to do, and
 * "Add app to workspace" then dropped them on the dashboard with no template
 * anywhere in sight.
 *
 * A template with no `templateId` has no app to deeplink to. The dashboard
 * needs the id to resolve one, so there is nothing better than the app root for
 * those — and the label says that plainly rather than promising an add that
 * cannot happen.
 */
export function TemplateAuthCta({
  template,
  className,
}: {
  template: CtaTemplate;
  className?: string;
}) {
  const href = templateSignupUrl(template);
  const deeplinkable = Boolean(template.templateId);
  return (
    <AuthLink
      authedHref={deeplinkable ? href : APP_URL}
      authedLabel={deeplinkable ? "Add app to workspace" : "Open Assembly"}
      href={href}
      label="Get started"
      className={className}
    />
  );
}

/**
 * Primary CTA on a template detail page. Signed-out visitors sign up starting
 * from this template; signed-in visitors open it in the workspace they already
 * have.
 *
 * The template has to be passed in for that to be true of the link as well as of
 * the sentence: this used to point at the bare SIGNUP_URL, so the one page that
 * is entirely about a single template was the one CTA that handed signup no idea
 * which template it was.
 */
export function TemplateCta({ template }: { template: CtaTemplate }) {
  // Full width on a phone, sized to its label from sm up. At 375px the label
  // alone is 115px in a 327px column, which read as a fragment of a row rather
  // than as the page's primary action; the site's other mobile CTAs (hero,
  // pricing toggle) take the column the same way.
  return (
    <TemplateAuthCta
      template={template}
      className="block w-full rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90 sm:inline-block sm:w-auto"
    />
  );
}
