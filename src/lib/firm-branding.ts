import "server-only";

import { createHash } from "node:crypto";
import { cache } from "react";
import { imageSize } from "image-size";

import type { BuiltOnFirm } from "@/lib/built-on-firms";
import { IS_LIVE_SITE } from "@/lib/constants";
import { isWorkspaceLogoHost } from "@/lib/image-hosts";

const PORTAL_API_URL =
  process.env.PORTAL_API_URL ??
  (IS_LIVE_SITE
    ? "https://app-api.assembly.com"
    : "https://app-api.assembly-staging.com");

/** Five minutes: a firm that just rebranded is on the page soon enough. */
const CONFIG_REVALIDATE_SECONDS = 300;
/** A day: an upload never changes under its URL; a new one gets a new key. */
const LOGO_REVALIDATE_SECONDS = 86_400;
const TIMEOUT_MS = 3_000;
/** Far past any real logo. Bigger than this isn't worth hashing on a render. */
const MAX_LOGO_BYTES = 2 * 1024 * 1024;

/**
 * Portal ids are shortids. Anything else can't be one, and is not put into a
 * request path.
 */
const PORTAL_ID = /^[A-Za-z0-9_-]{1,64}$/;
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const DEFAULT_LOGO_DOMAINS = [
  "assembly-com",
  "copilot-app",
  "copilot-com",
  "joinportal-com",
] as const;
/** The three sizes the logo finder stores for each domain. */
const DEFAULT_LOGO_SIZES = ["512@2x", "60@2x", "24@2x"] as const;

/**
 * Where the logo finder writes: the bucket's regional host, the backend's
 * S3ResourceFilesBucketURL.
 */
const BUCKET_URL = "https://lightout-portal.s3.us-west-2.amazonaws.com";
const BRAND_LOGOS_PATH = "/public/images/brand-logos";
const DEFAULT_LOGO_PATHS = new Set(
  DEFAULT_LOGO_DOMAINS.flatMap((domain) =>
    DEFAULT_LOGO_SIZES.map(
      (size) => `${BRAND_LOGOS_PATH}/${domain}-${size}.png`,
    ),
  ),
);

/**
 * The digests of the default logos, read from the bucket. Each download is
 * cached for a day like any other logo, so this costs a handful of requests a
 * day rather than per visit. One that fails to download is left out of the
 * set for now and tried again on the next render.
 */
const defaultLogoDigests = cache(async (): Promise<Set<string>> => {
  const digests = await Promise.all(
    [...DEFAULT_LOGO_PATHS].map(async (path) => {
      const bytes = await fetchBytes(`${BUCKET_URL}${path}`);
      return bytes ? sha256(bytes) : undefined;
    }),
  );
  return new Set(digests.filter((digest) => digest !== undefined));
});

/**
 * Whether a URL points straight at one of the default files. Most workspaces
 * that carry one reference it where the logo finder stored it, which this
 * answers without a download — and still answers when the bucket is slow and
 * the digests above came back short.
 */
function isDefaultLogoPath(url: string): boolean {
  try {
    return DEFAULT_LOGO_PATHS.has(new URL(url).pathname);
  } catch {
    return false;
  }
}

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/**
 * The firm behind a workspace id, or undefined. Cached per request, so
 * /built-by's metadata and its page share one lookup.
 */
export const getFirmBranding = cache(
  async (ref: string | undefined): Promise<BuiltOnFirm | undefined> => {
    if (!ref || !PORTAL_ID.test(ref)) return undefined;

    const config = await fetchJson(
      `${PORTAL_API_URL}/portal/${ref}/config?viewMode=internal`,
    );
    const fields = field(config, "fields");
    const name = text(fields, "name");
    // An id that matches nothing still answers 200, with every field empty.
    if (!name) return undefined;

    const brand = field(fields, "brand");
    const logo = field(field(fields, "assets"), "logo");
    const ownLogo = await firstOwnLogo([
      // The square icon first: the slot is a square, and this is the image the
      // firm chose for square places. The full logo is usually a wordmark.
      text(logo, "iconImageUrl"),
      text(logo, "logoImageUrl"),
    ]);

    return {
      id: ref,
      name,
      ...(ownLogo && {
        logoUrl: ownLogo.url,
        logoWidth: ownLogo.width,
        logoHeight: ownLogo.height,
      }),
      brandColor: color(brand, "clientSidebarBackgroundColor"),
      sidebarTextColor: color(brand, "clientSidebarTextColor"),
    };
  },
);

interface OwnLogo {
  url: string;
  width: number;
  height: number;
}

/**
 * The first candidate, in order, that is a real upload of the firm's own,
 * measured. All are fetched at once: the page waits on this, and in turn would
 * wait for the slowest in sequence.
 */
async function firstOwnLogo(
  candidates: (string | undefined)[],
): Promise<OwnLogo | undefined> {
  const urls = [...new Set(candidates)].filter((url) => url !== undefined);
  const measured = await Promise.all(urls.map(measureOwnLogo));
  return measured.find((logo) => logo !== undefined);
}

async function measureOwnLogo(url: string): Promise<OwnLogo | undefined> {
  if (!isWorkspaceLogoHost(url) || isDefaultLogoPath(url)) return undefined;
  const [bytes, defaults] = await Promise.all([
    fetchBytes(url),
    defaultLogoDigests(),
  ]);
  if (!bytes || defaults.has(sha256(bytes))) return undefined;

  try {
    const { width, height } = imageSize(bytes);
    return width && height ? { url, width, height } : undefined;
  } catch {
    // Not an image we can read, so not one we can size or trust to render.
    return undefined;
  }
}

async function fetchJson(url: string): Promise<unknown> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CONFIG_REVALIDATE_SECONDS },
    });
    const body: unknown = res.ok ? await res.json() : undefined;
    return body;
  } catch {
    return undefined;
  }
}

async function fetchBytes(url: string): Promise<Uint8Array | undefined> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: LOGO_REVALIDATE_SECONDS },
    });
    if (!res.ok) return undefined;
    const declared = Number(res.headers.get("content-length"));
    if (declared > MAX_LOGO_BYTES) return undefined;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return bytes.byteLength <= MAX_LOGO_BYTES ? bytes : undefined;
  } catch {
    return undefined;
  }
}

// The response is only trusted as far as these checks go: every read narrows
// from unknown, so a field that is missing or the wrong type reads as absent.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function field(value: unknown, key: string): unknown {
  return isRecord(value) ? value[key] : undefined;
}

function text(value: unknown, key: string): string | undefined {
  const found = field(value, key);
  return typeof found === "string" && found.trim() ? found.trim() : undefined;
}

function color(value: unknown, key: string): string | undefined {
  const found = text(value, key);
  return found && HEX_COLOR.test(found) ? found : undefined;
}
