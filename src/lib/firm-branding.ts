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

const BRAND_LOGOS_PATH = "/public/images/brand-logos";
const DEFAULT_LOGO_PATHS = new Set(
  DEFAULT_LOGO_DOMAINS.flatMap((domain) =>
    DEFAULT_LOGO_SIZES.map(
      (size) => `${BRAND_LOGOS_PATH}/${domain}-${size}.png`,
    ),
  ),
);

/**
 * SHA-256 of each file in DEFAULT_LOGO_PATHS, taken from the lightout-portal
 * bucket. They catch a default that was copied to a new key rather than
 * referenced where the logo finder stored it. Pinned here so no render waits
 * on downloading them; if the finder ever regenerates the files, re-hash them.
 */
const DEFAULT_LOGO_DIGESTS = new Set([
  "351365ee1905debead7a2ef0571b03242590ad7addd7f47a359bb10f7d473d9b",
  "bc3ff5e7901baeca844c3ffa191b5945e874d86aa7b7b2db843a95e971e2166c",
  "ca36bc58b6d03b43d5fc6c2bee3d7c1d89ad5a882e2eef22dfce497752a7dc66",
  "2f8450d7ad023779ffca1bb79d12597fff5a9410cc4a535526f9063d6e1572b2",
  "5d4c66a6ad3b664f5e75507c1787cc4e174db5077478dc1ec634a6f588e2efe2",
  "fb1e9123cf3ef60c69c40527dcde5b4857e6209e813db93cb455766d78f389e6",
  "705d3cb6b90d12d8904715c1c695903e8b5e9f6b6a9b74d11d32b562a3ffb611",
  "5e5b8ca688051ab8564342a76435a66060dac55b601d6d6fbdc13903b1c6fd46",
  "bd0b2603ba359580dd530cd5e03b4814f6dc8651e3ca1e6b8782bda7baffab4a",
  "7900f426d308c05df78171dec8e66376f3dbc453d6e22a1f11786c5d40f83bfb",
  "fd5f1932d4aef78fa523a64723567b94529e5d880ff2a9bd25475a8feb05e986",
  "40a72bbbc9644d65eebbdf51d2ab76f278989de945b8fd0554b99701d7212e1c",
]);

/**
 * Whether a URL points straight at one of the default files. Most workspaces
 * that carry one reference it where the logo finder stored it, which this
 * answers without a download.
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
 * measured. All start downloading at once, but only the ones ahead of the
 * winner are waited on: once the first choice is usable, a slow second one
 * no longer holds the page.
 */
async function firstOwnLogo(
  candidates: (string | undefined)[],
): Promise<OwnLogo | undefined> {
  const urls = [...new Set(candidates)].filter((url) => url !== undefined);
  const pending = urls.map(measureOwnLogo);
  for (const logo of pending) {
    const measured = await logo;
    if (measured) return measured;
  }
  return undefined;
}

async function measureOwnLogo(url: string): Promise<OwnLogo | undefined> {
  if (!isWorkspaceLogoHost(url) || isDefaultLogoPath(url)) return undefined;
  const bytes = await fetchBytes(url);
  if (!bytes || DEFAULT_LOGO_DIGESTS.has(sha256(bytes))) return undefined;

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
