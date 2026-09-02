import type { NextConfig } from "next";
import { OPTIMIZED_IMAGE_HOSTS } from "./src/lib/image-hosts";
import { LEGACY_REDIRECTS } from "./src/lib/redirects";

// Mintlify docs are hosted at assembly-ff8b9417.mintlify.site and proxied
// under /docs so they appear to live on this domain (Mintlify's
// subdirectory custom-domain setup: https://mintlify.com/docs/settings/custom-domain).
const MINTLIFY_SITE = "https://assembly-ff8b9417.mintlify.site";

const isProduction = process.env.VERCEL_ENV === "production";

// Third-party origins inventoried during the analytics migration from
// web-presence-js (Aug 2026). Deployed as Report-Only first — switch to the
// enforcing header once staging shows no violations.
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-inline' covers the theme-init, auth-init, and font-swap scripts
  // in layout.tsx that run as dangerouslySetInnerHTML. Segment and GTM are
  // loaded via next/script which adds its own <script> elements at runtime.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://cdn.segment.com https://*.segment.io https://copilotplatforms.chilipiper.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.ctfassets.net https://storage.ghost.io https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://cdn.segment.com https://api.segment.io https://*.customer.io https://copilotplatforms.chilipiper.com https://graphql.contentful.com https://storage.ghost.io",
  "frame-src 'self' https://www.youtube.com https://copilotplatforms.chilipiper.com",
  "media-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://copilotplatforms.chilipiper.com",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: cspDirectives },
];

const nextConfig: NextConfig = {
  // The changelog's entries are read off disk at request time, and Next only
  // ships the files it can see being imported. Naming the directory puts it in
  // the bundle for the three routes that read it; without this /updates is a
  // 500 on Vercel and works fine locally, which is the worst way to find out.
  // The imagery goes with them on the two routes that render an entry: those
  // read each screenshot's dimensions off the file so the browser knows the
  // aspect ratio before the bytes arrive, and public/ is served from the CDN
  // rather than mounted in the function.
  outputFileTracingIncludes: {
    "/updates": ["./src/content/updates/**", "./public/images/updates/**"],
    "/updates/[slug]": ["./src/content/updates/**", "./public/images/updates/**"],
    "/sitemap-updates.xml": ["./src/content/updates/**"],
  },
  // Read at BUILD time and inlined, which is the whole point: it dates the
  // hand-shipped pages in the sitemaps. A static page changes when the site is
  // deployed and at no other moment, so "now" at build is its real lastmod —
  // and reading the clock at request time would report a date on which nothing
  // happened.
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
  // Screenshots are text-dense, so the default quality (75) reads as blurry.
  // Whitelist higher steps (Next 16 requires listing any non-default value).
  images: {
    qualities: [75, 90, 100],
    // Template screenshots uploaded to Contentful are served from its CDN.
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
  // The embeds listing moved up from /embeds/directory to /embeds, and an
  // embed's own page from /embeds/directory/{slug} to /embed/{slug}. Permanent,
  // so anything already linking or indexing the old shape hands its ranking to
  // the new one rather than dropping a 404.
  async redirects() {
    return [
      {
        source: "/embeds/directory",
        destination: "/embeds",
        permanent: true,
      },
      {
        source: "/embeds/directory/:slug",
        destination: "/embed/:slug",
        permanent: true,
      },
      // Everything the previous assembly.com site published. Listed last so the
      // two rules above keep precedence if the table ever grows a row that
      // overlaps them.
      ...LEGACY_REDIRECTS,
    ];
  },
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: `${MINTLIFY_SITE}/docs`,
      },
      {
        source: "/docs/:path*",
        destination: `${MINTLIFY_SITE}/docs/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // The icons are immutable in practice and change only when the brand
        // does. Out of public/ they otherwise carry max-age=0, so every
        // navigation revalidates the favicon and the swap gets a window to be
        // seen in. A day, not a year: a stale favicon is unusually annoying to
        // flush, since browsers cache it outside the normal HTTP cache.
        source: "/favicon.:ext(ico|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Keep preview/staging deployments out of the index so they can't
          // compete with the production host. The production alias
          // (VERCEL_ENV=production) is left indexable.
          ...(isProduction
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
