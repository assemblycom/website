/**
 * Hosts next/image is allowed to optimise. Ghost stores most images itself, but
 * a feature image can point anywhere the author pasted from, and next/image
 * throws on an unconfigured host — which took out the whole page, not just the
 * picture. So this list is shared: next.config.ts allows these, and PostCover
 * falls back to a plain <img> for anything else rather than crashing.
 */
export const OPTIMIZED_IMAGE_HOSTS = [
  "images.ctfassets.net",
  "storage.ghost.io",
  "images.unsplash.com",
] as const;

/**
 * Where workspace logos live: the product's lightout-portal bucket, shared by
 * staging and production. Both hosts, because uploads are signed through S3
 * Transfer Acceleration, so that's the host a stored URL carries, while logos
 * the backend writes itself use the regional one.
 *
 * Shared for the same reason as the list above: next.config.ts puts these in
 * the CSP's img-src, and /powered-by only fetches a logo from one of them, so
 * the page can never draw a logo the policy would block.
 */
export const WORKSPACE_LOGO_HOSTS = [
  "lightout-portal.s3-accelerate.amazonaws.com",
  "lightout-portal.s3.us-west-2.amazonaws.com",
] as const;

export function isWorkspaceLogoHost(src: string): boolean {
  try {
    const { protocol, hostname } = new URL(src);
    return (
      protocol === "https:" &&
      WORKSPACE_LOGO_HOSTS.some((host) => host === hostname)
    );
  } catch {
    return false;
  }
}

export function isOptimizedHost(src: string): boolean {
  try {
    return (OPTIMIZED_IMAGE_HOSTS as readonly string[]).includes(
      new URL(src).hostname,
    );
  } catch {
    // A relative path is served by us, so it is always safe to optimise.
    return true;
  }
}
