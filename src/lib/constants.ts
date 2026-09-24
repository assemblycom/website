export const SITE_NAME = "Assembly";

// Shared so the same mistake reads the same way on every form. An error should
// say what a good answer looks like, not just that this one was rejected:
// "Double-check that email address" told someone who typed "df" nothing about
// what was actually missing.
export const INVALID_EMAIL_ERROR =
  "Enter a complete email address, like jane@company.com.";

// Canonical host for metadata, sitemap, robots, and the proposal shortener. The
// Vercel host still serves the site and always will; this is the address we want
// indexed and linked, so it names the domain rather than the deployment.
//
// assembly.com, not the studio subdomain: the consolidation is done, and
// studio.assembly.com now 307s here. Naming it meant every canonical, og:url and
// sitemap <loc> pointed at a host that only redirects, so each crawl spent a hop
// to reach the page it was already on — and /api/shorten rejected proposals the
// creator built, because their origin no longer matched this one.
//
// Staging overrides it with its own host. Left hardcoded, every canonical,
// og:url, and proposal link built on staging would name production instead —
// and /api/shorten, which only accepts URLs whose origin matches this one, would
// reject every proposal the staging creator produced. NEXT_PUBLIC_ because this
// is read in client components (the proposal creator), and a bare env var is
// undefined in the browser bundle. Unset — production, previews, local — falls
// back to the canonical host.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://assembly.com";

/**
 * True only on the deployment serving assembly.com itself.
 *
 * Staging sets NEXT_PUBLIC_SITE_URL to its own host, so an unset value plus a
 * production build is the live site. NODE_ENV keeps `next dev` out of it, so a
 * page held back from production still renders locally.
 *
 * Used to hold a finished page on staging while the rest of a release goes
 * live: production promotes by fast-forwarding main, which takes every commit,
 * so a page that is not ready has to hold itself back rather than be left
 * behind. Caveat: preview deployments also leave the var unset, so they behave
 * as production here.
 */
export const IS_LIVE_SITE =
  process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  // External links open in the SAME tab unless newTab is set.
  newTab?: boolean;
  // Visible but not yet linked anywhere (e.g. Docs is still in progress).
  disabled?: boolean;
}

// Served by the Mintlify rewrite in next.config.ts, which every deployment has —
// so this follows SITE_URL rather than pinning the studio host, and staging's
// docs links stay on staging.
export const DOCS_URL = `${SITE_URL}/docs`;
// The footer splits docs into its two halves, where the nav keeps one "Docs"
// entry. Both live on assembly.com, not the studio subdomain DOCS_URL uses.
//
// Linked at the page each section actually opens on, not at its root: /docs and
// /docs/api-reference are themselves redirects to these two, so linking the
// short form spends a hop on every visit — and on every crawl of every page
// carrying the link.
export const DOCS_WELCOME_PATH = "/getting-started/welcome";
export const API_REFERENCE_PATH = "/api-reference/introduction";
export const GUIDE_URL = `https://assembly.com/docs${DOCS_WELCOME_PATH}`;
export const API_REFERENCE_URL = `https://assembly.com/docs${API_REFERENCE_PATH}`;

// Shared because the footer's socials and the changelog's follow link are the
// same account, and the two drifting apart is the failure mode a second copy
// invites.
export const X_URL = "https://x.com/assemblycom";

// Off-site, and referenced from the nav — which is built at module load, so
// these have to be declared above it.
export const COMMUNITY_URL = "https://community.assembly.com";
export const STATUS_URL = "https://status.assembly.com";

/** A link with a line of explanation, for the nav's dropdown panels. */
export interface NavItem extends NavLink {
  description?: string;
  /**
   * Which labelled column of the dropdown panel this link sits in. Items with a
   * section are grouped under it, in the order they appear here; a group whose
   * items carry none renders as one column under the group's own label instead.
   */
  section?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

// One grouped panel and four direct links. Templates, Customers and Security
// are their own links rather than a Product panel: two items behind a trigger
// is a panel that costs a hover to read what it could have just said. Resources
// stays a group because most of what is in it lives off-site.
export const NAV_ENTRIES: NavEntry[] = [
  { label: "Templates", href: "/templates" },
  { label: "Customers", href: "/customers" },
  { label: "Security", href: "/security" },
  {
    label: "Resources",
    // Two columns rather than one list of five: the reference product navs all
    // split theirs, and the split says what each link is before you read it —
    // the things we publish on one side, the two reference manuals on the other.
    //
    // Order is load-bearing twice over. It sets the columns left to right, and
    // the mobile sheet renders these flat — so Blog leads, which is what a
    // Resources menu is opened for, rather than the docs leading on a phone.
    items: [
      {
        label: "Blog",
        href: "/blog",
        section: "Read",
        description: "Product news, and guides for service firms",
      },
      {
        label: "What's new",
        href: "/updates",
        section: "Read",
        description: "Everything we ship, as we ship it",
      },
      // A forum someone will keep open beside the site, unlike the docs, which
      // are read in place of it.
      {
        label: "Community",
        href: COMMUNITY_URL,
        external: true,
        newTab: true,
        section: "Read",
        description: "Ask questions and compare notes with other firms",
      },
      // External docs, but opening in the same tab (newTab omitted) — a new tab
      // read as a jarring context switch from a primary nav item.
      {
        label: "Assembly Guide",
        href: GUIDE_URL,
        external: true,
        section: "Docs",
        description: "How to set up and run your workspace",
      },
      {
        label: "API reference",
        href: API_REFERENCE_URL,
        external: true,
        section: "Docs",
        description: "Endpoints, parameters and examples",
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];
// The app lives at dashboard.assembly.com (app.assembly.com does not resolve).
export const APP_URL = "https://dashboard.assembly.com";
const SIGNUP_PATH = "https://dashboard.assembly.com/signup";
// referrer=studio-pricing tags signups that originate from this marketing site,
// and is what tells the app to create the workspace on the new pricing model.
export const SIGNUP_REFERRER = "studio-pricing";
// The plain CTA case: no prompt, no template, just the referrer.
export const SIGNUP_URL = `${SIGNUP_PATH}?referrer=${SIGNUP_REFERRER}`;
export const LOGIN_URL = "https://dashboard.assembly.com/login";

// The composer prompt rides along to signup as a query param. Cap it so the
// whole URL stays within the ~2048-char limit browsers/servers assume.
export const MAX_PROMPT_LENGTH = 2000;
const MAX_URL_LENGTH = 2048;

/** A picked template, in the shape signup expects to receive it. */
export interface SignupTemplate {
  /**
   * The app id signup resolves the template by, e.g. "app-e070af55". Optional:
   * a few templates still have no app behind them, and the slug is NOT a
   * substitute — sending it gave signup an id it can't resolve. When it's missing
   * the param is left out and only the display fields travel.
   */
  id?: string;
  name: string;
  /** The one-liner, not the long description. */
  description: string;
}

// Build the signup URL, carrying whatever the visitor arrived with: their
// composer prompt, or a picked template, plus the address they typed.
// The prompt is trimmed until the full URL fits MAX_URL_LENGTH, so oddly long
// or heavily-encoded input can never produce an over-length URL.
export function buildSignupUrl(
  prompt?: string,
  template?: SignupTemplate,
  email?: string,
): string {
  const compose = (promptValue: string) => {
    const params = new URLSearchParams({ referrer: SIGNUP_REFERRER });
    if (promptValue) params.set("prompt", promptValue);
    if (template) {
      if (template.id) params.set("templateId", template.id);
      params.set("templateName", template.name);
      params.set("templateDescription", template.description);
    }
    // Carried so the "Continue with email" hand-off can prefill the field.
    if (email) params.set("email", email);
    return `${SIGNUP_PATH}?${params.toString()}`;
  };

  let value = prompt?.trim().slice(0, MAX_PROMPT_LENGTH) ?? "";
  let url = compose(value);
  while (url.length > MAX_URL_LENGTH && value.length > 0) {
    value = value.slice(0, Math.floor(value.length * 0.9));
    url = compose(value);
  }
  return url;
}

// A picked template goes straight to onboarding on dashboard, carrying the
// template so signup opens already holding it. It used to route through a
// sign-up sheet on this site, which collected an account this side of the
// hand-off and then again on the far side.
export function templateSignupUrl(template: {
  templateId?: string;
  title: string;
  description: string;
}): string {
  return buildSignupUrl(undefined, {
    id: template.templateId,
    name: template.title,
    description: template.description,
  });
}
// ── Personalized proposals ────────────────────────────────────────────────
// A proposal is a one-off page made for one person: their name, the build we're
// proposing (a refined prompt or a template), and an optional line from whoever
// sent it. It has no backend — every field rides in the URL, so the link IS the
// proposal, and /proposal-creator is just the form that composes one.
export const PROPOSAL_PATH = "/proposal";
export const PROPOSAL_CREATOR_PATH = "/proposal-creator";

// A personal note is a sentence or two, not a letter; capped so the link stays
// well inside the ~2048-char URL limit alongside the prompt.
export const MAX_PROPOSAL_NOTE_LENGTH = 280;

// The app name sits in the headline at display size, where anything longer than
// a few words stops being a name and starts being the prompt again.
export const MAX_APP_NAME_LENGTH = 40;

export interface ProposalInput {
  /** Who it's for — the name that leads the page. */
  recipient: string;
  /** Who it's from, e.g. "Sean Walsh, Assembly". Optional. */
  from?: string;
  /** One personal line, shown under the recipient's name. Optional. */
  note?: string;
  /** The refined prompt, when the proposal is a custom build. */
  prompt?: string;
  /**
   * What the prompt builds, in two or three words — "Client onboarding wizard".
   * The prompt variant's headline has no template title to name the app with, so
   * without this it can only open on the recipient. Suggested from the prompt in
   * the creator and editable there, so it's the sender's words that ship.
   */
  appName?: string;
  /** A template slug, when a template is the better fit. */
  template?: string;
}

/**
 * Compose a proposal link. `origin` lets the creator hand back a URL on whatever
 * host it's running on (localhost while testing, the real host in production)
 * rather than hardcoding the canonical one; omit it for a relative link.
 */
export function buildProposalUrl(input: ProposalInput, origin = ""): string {
  const params = new URLSearchParams();
  if (input.recipient.trim()) params.set("for", input.recipient.trim());
  if (input.template) params.set("template", input.template);
  else if (input.prompt?.trim()) {
    params.set("prompt", input.prompt.trim().slice(0, MAX_PROMPT_LENGTH));
    // Only ever alongside a prompt: a template names itself.
    if (input.appName?.trim())
      params.set("name", input.appName.trim().slice(0, MAX_APP_NAME_LENGTH));
  }
  if (input.from?.trim()) params.set("from", input.from.trim());
  if (input.note?.trim())
    params.set("note", input.note.trim().slice(0, MAX_PROPOSAL_NOTE_LENGTH));
  const query = params.toString();
  return `${origin}${PROPOSAL_PATH}${query ? `?${query}` : ""}`;
}

// Our own designed book-a-demo page (not the main assembly.com marketing page).
// Its form now hands off to the same ChiliPiper Concierge router marketing uses,
// so a submit here books a real call rather than showing a mock confirmation.
export const DEMO_URL = "/demo";
// One label for the one action. The site had reached "Book a demo", "Book demo"
// and "Contact sales" for buttons that all open the same form, so every CTA
// pointing at DEMO_URL reads from here. Prose and the frozen content data keep
// writing it out longhand; this is for controls.
export const DEMO_CTA_LABEL = "Book a demo";
// The "Watch the demo" walkthrough video — points at the YouTube channel for
// now; swap for the specific video URL when it's up.
export const DEMO_VIDEO_URL = "https://www.youtube.com/@assembly";
export const TRUST_CENTER_URL = "https://security.assembly.com";

// The desktop app builds, served from our CDN. "latest" is a stable alias the
// release process re-points, so these never need updating per version.
const DESKTOP_CDN = "https://cdn.assembly.com/desktop";
export const DESKTOP_DOWNLOADS: {
  label: string;
  platform: string;
  href: string;
}[] = [
  {
    label: "Download for Mac (Apple silicon)",
    platform: "macOS, Apple silicon",
    href: `${DESKTOP_CDN}/Assembly-latest-macos-arm64.dmg`,
  },
  {
    label: "Download for Mac (Intel)",
    platform: "macOS, Intel",
    href: `${DESKTOP_CDN}/Assembly-latest-macos-x64.dmg`,
  },
  {
    label: "Download for Windows",
    platform: "Windows 10 and later, 64-bit",
    href: `${DESKTOP_CDN}/Assembly-latest-windows-x64.exe`,
  },
];

// The partner programs run on PartnerStack: applications, tracking, and payouts
// all live there, so both pages hand off rather than collecting anything here.
const PARTNERSTACK_APPLY =
  "https://dash.partnerstack.com/application?company=assembly";
export const AFFILIATE_APPLY_URL = `${PARTNERSTACK_APPLY}&group=affiliates`;
export const EXPERT_APPLY_URL = `${PARTNERSTACK_APPLY}&group=experts`;
// The Experts directory is still served by the old marketing site; point at it
// there until that page moves too.
export const EXPERTS_DIRECTORY_URL = "https://assembly.com/experts";
export const PARTNERSHIPS_EMAIL = "partnerships@assembly.com";

// Review-platform listings for Assembly.
export const G2_URL = "https://www.g2.com/products/assemblysoftware/reviews";
export const CAPTERRA_URL = "https://www.capterra.com/p/214210/Assembly/";

/** The legal pages, in the order the footer lists them. */
export const LEGAL_LINKS: NavLink[] = [
  { label: "Terms of service", href: "/legal/terms-of-service" },
  { label: "Privacy policy", href: "/legal/privacy-policy" },
  { label: "AI policy", href: "/legal/ai-policy" },
];

/**
 * The footer, as columns of labelled groups.
 *
 * A column is typed to hold more than one group, which is how Developers and
 * Partners used to hang under Resources and Company. The columns are evenly
 * matched again — seven, seven, five, three and four — so nothing needs a
 * sub-heading to stop it running to twice its neighbours' height, and the shape
 * stays available for the next time one of them grows.
 *
 * Kept here rather than in the footer component so the nav and the footer cannot
 * drift apart the way the old hand-maintained pair did.
 */
export interface FooterGroup {
  label: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterGroup[][] = [
  [
    {
      label: "Product",
      links: [
        { label: "Templates", href: "/templates" },
        { label: "Security", href: "/security" },
        { label: "Pricing", href: "/pricing" },
        { label: "Desktop app", href: "/download" },
        { label: "Compare", href: "/comparison" },
        { label: "Sign up", href: SIGNUP_URL, external: true },
        { label: "Book a demo", href: DEMO_URL },
      ],
    },
  ],
  [
    {
      label: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Guide", href: GUIDE_URL, external: true },
        { label: "API reference", href: API_REFERENCE_URL, external: true },
        { label: "What's new", href: "/updates" },
        {
          label: "Community",
          href: COMMUNITY_URL,
          external: true,
          newTab: true,
        },
        { label: "Status", href: STATUS_URL, external: true, newTab: true },
        { label: "LLM info", href: "/llm-info" },
      ],
    },
  ],
  [
    {
      label: "Company",
      links: [
        { label: "Customers", href: "/customers" },
        { label: "Careers", href: "/jobs" },
        { label: "Brand", href: "/brand" },
        {
          label: "Trust center",
          href: TRUST_CENTER_URL,
          external: true,
          newTab: true,
        },
        // The HTML sitemap. Its own reason to exist is a crawler following links
        // rather than the XML index, so it has to be linked from somewhere on
        // every page — which is what the footer is.
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ],
  [{ label: "Legal", links: LEGAL_LINKS }],
];
