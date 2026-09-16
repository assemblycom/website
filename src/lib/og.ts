import { SITE_NAME } from "./constants";

// Card geometry. 1200×630 is the size every crawler is written against, and the
// one the fixed /og.jpg already uses.
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// One card for every page whose preview is about the site rather than about a
// particular app.
export const OG_IMAGE = {
  url: "/og.jpg",
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt: SITE_NAME,
};

/**
 * Which skin the card wears. A template is a thing off the shelf and takes the
 * black card; an app described from a prompt is the client's own and takes the
 * lime one. So the two kinds of proposal are told apart at a glance, before the
 * reader has clicked anything.
 */
export type OgVariant = "template" | "prompt" | "built";

// Both things this card can name are names, not sentences: a template's title,
// which runs 9 to 27 characters across the whole catalogue, and an app name,
// which the creator caps at MAX_APP_NAME_LENGTH (40) while it is being typed.
// This is headroom over those — enough for a CMS-authored template name longer
// than any we ship, and nothing more. The endpoint sets one size, because at
// this length there is no case that needs a smaller one.
const MAX_OG_TITLE = 60;

/**
 * What the card is allowed to print. Applied at BOTH ends — when a page asks for
 * a card, and again inside the endpoint — because the endpoint is a public URL
 * and ?title= is whatever anyone puts in it.
 */
export function ogTitleFromParam(raw: string | null | undefined): string {
  const title = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!title) return SITE_NAME;
  return title.length > MAX_OG_TITLE
    ? `${title.slice(0, MAX_OG_TITLE - 1).trimEnd()}…`
    : title;
}

export function ogVariantFromParam(raw: string | null | undefined): OgVariant {
  if (raw === "prompt") return "prompt";
  if (raw === "built") return "built";
  return "template";
}

/**
 * The brand colour a "built" card is painted in, as six hex digits without the
 * hash. Validated at both ends, like the title: the endpoint is a public URL, so
 * ?c= is whatever anyone puts in it and it lands in a CSS background.
 */
export function ogColorFromParam(raw: string | null | undefined) {
  return raw && /^[0-9a-fA-F]{6}$/.test(raw) ? `#${raw}` : undefined;
}

/**
 * The card a shared build unfurls as: the firm's name on the firm's own colour.
 *
 * A share post carries native video on LinkedIn and X, which suppresses the link
 * card entirely — but the same link gets pasted into Slack, mail and DMs, where
 * an unfurl naming the firm is the difference between a recognisable link and a
 * generic homepage preview.
 */
export function ogImageForFirm(name: string, brandColor?: string) {
  const printed = ogTitleFromParam(name);
  const color = brandColor ? `&c=${brandColor.replace("#", "")}` : "";
  return {
    url: `/api/og?title=${encodeURIComponent(printed)}&v=built${color}`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: `${printed} — built on ${SITE_NAME}`,
  };
}

/**
 * A card naming one app: the template's own name, or what a proposal calls the
 * thing it proposes. Relative, so metadataBase makes it absolute — and so it
 * keeps working on a preview deployment, which the site's own origin would not.
 */
export function ogImageFor(title: string, variant: OgVariant = "template") {
  const printed = ogTitleFromParam(title);
  return {
    url: `/api/og?title=${encodeURIComponent(printed)}&v=${variant}`,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: `${printed} — ${SITE_NAME}`,
  };
}
