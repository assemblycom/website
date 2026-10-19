import { createClient, type Entry, type Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

// The marketing space's app catalogue. It holds Embed, App, Core app and
// Marketplace app entries alongside the templates, so every query filters on
// App Type — nothing else belongs in this gallery.
//
// THIS IS THE LAST LIVE CMS READ ON THE SITE. Every other family — the feature
// pages, /solutions, /comparison, /definitions, /jobs, the team — was frozen
// into a src/lib/*.frozen.ts module, so their copy is edited here in the repo.
// The templates gallery stays live on purpose: marketing publishes a template
// and it should appear without a deploy.
const CONTENT_TYPE = "partnerApps";
const APP_TEMPLATE = "App Template";
/**
 * The core apps the product ships — Helpdesk, Autoresponder, Tasks, Files and
 * the rest. A separate App Type in the CMS, but the same catalogue the product's
 * own Add-an-App picker reads, and the gallery lists both so the site shows what
 * the product actually offers rather than the templates alone. They carry a
 * "Classic" category, which is where the gallery's Classic filter comes from.
 */
const CORE_APP = "App";
const GALLERY_APP_TYPES = [APP_TEMPLATE, CORE_APP];
const EMBED = "Embed";

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const DELIVERY_TOKEN = process.env.CONTENTFUL_DELIVERY_TOKEN;
// The content lives in master. Read-only, so there's nothing to isolate from.
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

export interface TemplateImage {
  url: string;
  title: string;
  /** The asset's Description, which is where its alt text is written. */
  description?: string;
  width?: number;
  height?: number;
}

/** The fields this site reads. The content type carries many more. */
export interface AppTemplateEntry {
  slug: string;
  /** Contentful "Name" — the H1. */
  name: string;
  /** Contentful "Subtitle", stored in the `description` field. */
  subtitle?: string;
  /** First checked category, used as the breadcrumb's second crumb. */
  category?: string;
  /** "App Overview" — one rich-text field covering About + What you can customize. */
  overview?: Document;
  /** "Image List (Desktop)" — the hero shot first, the benefits shot second. */
  images: TemplateImage[];
  /** "Image List (mobile)" — the same shots cropped for a phone, in the same order. */
  mobileImages: TemplateImage[];
  /**
   * The detail page's per-template copy. Every one is optional, and the page
   * decides each fallback (see template-page.ts) so a template nobody has
   * filled in yet still renders whole.
   */
  marketingHeadline?: string;
  heroDescription?: string;
  /** The search term, as it reads mid-sentence — "client project tracker". */
  seoKeyword?: string;
  definitionBody?: string;
  ctaHeading?: string;
  seoTitle?: string;
  seoMetaDescription?: string;
  /** "FAQ" — linked question/answer entries, in the order the editor set. */
  faqs: { question: string; answer: string }[];
  /** "Relative Apps" — the slugs picked for the Works with row. */
  relatedSlugs: string[];
  /** "Audience" — "Clients", "Internal Team", or both. */
  audience: string[];
  /**
   * Contentful "Template Id" — the app id the product resolves this template
   * by, e.g. "app-0548119d". Not every entry carries one yet, so it's optional
   * and callers must handle its absence rather than substituting the slug.
   */
  templateId?: string;
  /**
   * Contentful "Hidden". It governs LISTING only — whether the template appears
   * in the gallery and the homepage strip. A published entry always keeps its
   * /templates/[slug] page and its place in the proposal picker, hidden or not,
   * so a template can be linked and proposed before it is announced.
   */
  isHidden: boolean;
  featured: boolean;
  /** Contentful's "Rank" field, whose api id is still `order`. */
  rank?: number;
  /** Contentful's own sys.updatedAt, for the sitemap's lastmod. */
  updatedAt?: string;
}

/**
 * One embeddable third-party app — Calendly, Zoom Scheduler, a Databox board.
 * The same `partnerApps` type the templates come from, filed under a different
 * App Type: an embed is not built in Assembly, it is an external tool shown
 * inside the client experience, so it carries a website and setup prose rather
 * than screenshots and a template id.
 */
export interface EmbedEntry {
  slug: string;
  /** Contentful "Name" — the H1. */
  name: string;
  /** Contentful "Description" — the card line and the page's lede. */
  description?: string;
  /** Contentful "App Overview" — the Overview and App Setup prose in one field. */
  overview?: Document;
  /** Contentful "Product Icon", falling back to "Icon". The service's own mark. */
  icon?: {
    url: string;
    title: string;
    width?: number;
    height?: number;
  };
  /**
   * Contentful "Apps Type": who sees the app once installed — "Client" for
   * client-facing, "Internal" for the team only.
   */
  audience?: string;
  /** The service's own site. */
  website?: string;
  /** Listed or not. A hidden embed keeps its page, like a hidden template. */
  isHidden: boolean;
  /** Contentful's own sys.updatedAt, for the sitemap's lastmod. */
  updatedAt?: string;
}

const client =
  SPACE_ID && DELIVERY_TOKEN
    ? createClient({
        space: SPACE_ID,
        accessToken: DELIVERY_TOKEN,
        environment: ENVIRONMENT,
      })
    : null;

export const isContentfulConfigured = Boolean(client);

/**
 * The same read-only client, for the other content types this site pulls from
 * the shared marketing space (see definitions.ts). Exported rather than
 * re-created so there is one place the credentials are read.
 */
export const contentfulClient = client;

function toImage(asset: Asset): TemplateImage | null {
  const file = asset?.fields?.file;
  if (!file?.url) return null;
  const details = file.details as { image?: { width: number; height: number } } | undefined;
  const description = asset.fields.description;
  return {
    // Contentful returns protocol-relative URLs.
    url: String(file.url).startsWith("//") ? `https:${file.url}` : String(file.url),
    title: typeof asset.fields.title === "string" ? asset.fields.title : "",
    description: typeof description === "string" && description.trim() ? description.trim() : undefined,
    width: details?.image?.width,
    height: details?.image?.height,
  };
}

function toImages(value: unknown): TemplateImage[] {
  return Array.isArray(value)
    ? (value as Asset[]).map(toImage).filter((i): i is TemplateImage => Boolean(i))
    : [];
}

/** A trimmed string, or undefined for anything empty — an editor clearing a
 *  field leaves "" behind, and that must fall back the same as never set. */
function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

// Linked entries arrive resolved (include: 2), but one that is unpublished or
// out of the include depth comes back as a bare link with no fields, so each is
// read defensively and dropped rather than rendered half-empty.
function linkedFields(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (item as { fields?: Record<string, unknown> })?.fields)
    .filter((f): f is Record<string, unknown> => Boolean(f));
}

function toAppTemplate(entry: Entry<never>): AppTemplateEntry | null {
  const f = entry.fields as Record<string, unknown>;
  const slug = typeof f.slug === "string" ? f.slug : null;
  const name = typeof f.name === "string" ? f.name : null;
  if (!slug || !name) return null;

  const categories = Array.isArray(f.categories) ? (f.categories as string[]) : [];

  return {
    slug,
    name,
    subtitle: typeof f.description === "string" ? f.description : undefined,
    category: categories[0],
    overview: (f.appOverview as Document) ?? undefined,
    images: toImages(f.imageList),
    mobileImages: toImages(f.mobileImageList),
    marketingHeadline: text(f.marketingHeadline),
    heroDescription: text(f.heroDescription),
    seoKeyword: text(f.seoKeyword),
    definitionBody: text(f.definitionBody),
    ctaHeading: text(f.ctaHeading),
    seoTitle: text(f.seoTitle),
    seoMetaDescription: text(f.seoMetaDescription),
    faqs: linkedFields(f.faq).flatMap((faq) => {
      const question = text(faq.question);
      const answer = text(faq.answer);
      return question && answer ? [{ question, answer }] : [];
    }),
    relatedSlugs: linkedFields(f.relativeApps)
      .map((app) => text(app.slug))
      .filter((s): s is string => Boolean(s)),
    audience: Array.isArray(f.audience) ? (f.audience as string[]) : [],
    templateId: typeof f.templateId === "string" ? f.templateId : undefined,
    isHidden: f.isHidden === true,
    featured: f.isFeatured === true,
    rank: typeof f.order === "number" ? f.order : undefined,
    updatedAt: entry.sys?.updatedAt,
  };
}

/**
 * Every published App Template, hidden ones included — the hidden flag is
 * applied per surface (see visible-templates.ts), not here, because the detail
 * pages and the proposal picker are meant to carry hidden templates too. Fetching
 * them out at the query was why a hidden template's page rendered from the
 * committed record alone, with none of its CMS copy or screenshots.
 *
 * Returns an empty list when Contentful isn't configured or is unreachable — the pages fall back to the templates committed
 * in templates.ts, so a CMS problem can't take the gallery down.
 */
// A production build renders every template page in one process, so without this
// the same query would run once per page. Deliberately not cached in dev, where
// an editor wants a refresh to show their change.
//
// Time-bounded, and that matters now the pages revalidate: an unbounded module
// promise outlives a regeneration, so a warm lambda would keep serving the
// catalogue it fetched the first time and the ISR window would do nothing. A
// minute still collapses a whole build's worth of renders into one query, while
// being far shorter than the pages' own revalidate.
const CACHE_MS = 60_000;
let cached: { at: number; value: Promise<AppTemplateEntry[]> } | null = null;

export function getAppTemplates(): Promise<AppTemplateEntry[]> {
  if (process.env.NODE_ENV !== "production") return fetchAppTemplates();
  if (!cached || Date.now() - cached.at > CACHE_MS) {
    cached = { at: Date.now(), value: fetchAppTemplates() };
  }
  return cached.value;
}

async function fetchAppTemplates(): Promise<AppTemplateEntry[]> {
  if (!client) return [];
  try {
    const res = await client.getEntries({
      content_type: CONTENT_TYPE,
      "fields.appType[in]": GALLERY_APP_TYPES,
      include: 2,
      limit: 200,
    });
    return res.items
      .map((item) => toAppTemplate(item as Entry<never>))
      .filter((t): t is AppTemplateEntry => Boolean(t));
  } catch (error) {
    console.warn("Contentful fetch failed, using the committed templates:", error);
    return [];
  }
}

export async function getAppTemplate(slug: string): Promise<AppTemplateEntry | null> {
  const all = await getAppTemplates();
  return all.find((t) => t.slug === slug) ?? null;
}

function toEmbed(entry: Entry<never>): EmbedEntry | null {
  const f = entry.fields as Record<string, unknown>;
  const slug = typeof f.slug === "string" ? f.slug : null;
  const name = typeof f.name === "string" ? f.name : null;
  if (!slug || !name) return null;

  // Most entries carry both marks and they are the same file; productIcon is the
  // one the directory has always shown.
  const icon = toImage((f.productIcon ?? f.icon) as Asset) ?? undefined;

  return {
    slug,
    name,
    description: typeof f.description === "string" ? f.description : undefined,
    overview: (f.appOverview as Document) ?? undefined,
    icon: icon ?? undefined,
    audience: typeof f.appsType === "string" ? f.appsType : undefined,
    website: typeof f.website === "string" ? f.website : undefined,
    isHidden: f.isHidden === true,
    updatedAt: entry.sys?.updatedAt,
  };
}

// Its own cache rather than a shared one keyed by type: the two catalogues are
// queried by different pages, and one warming the other's entry would hand it a
// list filtered for somebody else. Same minute-long bound as the templates
// cache, for the same reason — see above.
let embedCache: { at: number; value: Promise<EmbedEntry[]> } | null = null;

/**
 * Every published Embed, hidden ones included — the flag is applied where the
 * listing is built, so a hidden embed still has a page.
 *
 * Empty when Contentful isn't configured or is unreachable. Unlike the templates
 * there is no committed copy behind these, so the directory says as much rather
 * than rendering a gallery that is silently missing half its entries.
 */
export function getEmbeds(): Promise<EmbedEntry[]> {
  if (process.env.NODE_ENV !== "production") return fetchEmbeds();
  if (!embedCache || Date.now() - embedCache.at > CACHE_MS) {
    embedCache = { at: Date.now(), value: fetchEmbeds() };
  }
  return embedCache.value;
}

async function fetchEmbeds(): Promise<EmbedEntry[]> {
  if (!client) return [];
  try {
    const res = await client.getEntries({
      content_type: CONTENT_TYPE,
      "fields.appType": EMBED,
      include: 2,
      limit: 200,
      order: ["fields.name"],
    });
    return res.items
      .map((item) => toEmbed(item as Entry<never>))
      .filter((embed): embed is EmbedEntry => Boolean(embed));
  } catch (error) {
    console.warn("Contentful embed fetch failed:", error);
    return [];
  }
}

export async function getEmbed(slug: string): Promise<EmbedEntry | null> {
  const all = await getEmbeds();
  return all.find((embed) => embed.slug === slug) ?? null;
}

/** The directory listing: everything not hidden in the CMS. */
export async function getListedEmbeds(): Promise<EmbedEntry[]> {
  return (await getEmbeds()).filter((embed) => !embed.isHidden);
}
