# Environment variables

Vercel scopes these per environment. The site runs in three: **Production**
(`production` branch), **Staging** (`main`), and **Preview** (everything else).
A variable set only on Production is *missing* on staging, and the site quietly
falls back — Contentful to the committed templates, the hero box to its curated
completions. Set them on all three unless a value is genuinely production-only.

## `NEXT_PUBLIC_SITE_URL` (staging only)

The canonical host, read by `SITE_URL` in `src/lib/constants.ts`. Unset — on
production, previews, and locally — it falls back to
`https://assembly.com`.

Set it on the **Staging** scope only:

```
NEXT_PUBLIC_SITE_URL=https://studio.assembly-staging.com
```

Without it, staging still renders, but every canonical, `og:url`, docs link, and
proposal URL it produces names production — and `/api/shorten`, which only
accepts URLs whose origin matches `SITE_URL`, rejects every proposal the staging
creator builds. `NEXT_PUBLIC_` because `SITE_URL` is read in client components;
a bare env var is undefined in the browser bundle.

## `ANTHROPIC_API_KEY` (optional)

Powers the AI autocomplete in the hero prompt box (`src/app/api/complete/route.ts`).

- **Not set** → the box falls back to its built-in curated completions. Everything
  still works; it just isn't AI-powered.
- **Set** → as the user pauses typing, Claude suggests a best-practice continuation
  as grey ghost text (accept with Tab).

### Local development

Create a file named `.env.local` in the project root (it's gitignored):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Then restart `npm run dev`.

### Production (Vercel)

Add `ANTHROPIC_API_KEY` under **Project → Settings → Environment Variables**
(Production, Staging, and Preview scopes), then redeploy.

The key is only ever read server-side in the API route — it is never sent to the
browser.

## Analytics — Segment and GTM

Tracking scripts load only when their env vars are set, so preview/local
builds are clean by default.

| Variable | Scope | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SEGMENT_WRITE_KEY` | Production | Segment analytics.js write key. Loaded in `<head>` via `next/script`. `NEXT_PUBLIC_` because the snippet runs in the browser. |
| `NEXT_PUBLIC_GTM_ID` | Production | Google Tag Manager container ID (e.g. `GTM-WXDPBKL`). GA4, Facebook Pixel, LinkedIn, and other tags are managed inside the GTM container. |

Both are `NEXT_PUBLIC_` because the scripts that use them run client-side.
Set them on **Production only** so staging and preview deployments don't
send traffic to the production analytics stream. If you need analytics on
staging, create separate Segment sources / GTM containers with their own
keys.

## Customer.io (optional) — newsletter subscriptions

Server-side integration for the email subscribe API route.

| Variable | Scope | Notes |
| --- | --- | --- |
| `CUSTOMER_IO_SITE_ID` | Production | From Customer.io → Settings → Workspace |
| `CUSTOMER_IO_API_KEY` | Production | Track API key |
| `CUSTOMER_IO_APP_KEY` | Production | App API key |

These are server-side only (no `NEXT_PUBLIC_` prefix) and never reach the
browser.

## Ghost (optional) — the `/blog` archive

Where the blog's posts come from. **Not set** → the site reads Ghost's public
RSS feed, which needs no credentials but which this instance caps at the newest
15 posts. **Set** → the Content API returns the whole archive.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GHOST_CONTENT_API_KEY` | All posts rather than the newest 15 | Ghost admin → **Settings → Integrations → Custom** → the integration's **Content API key**. 26 characters. Read-only, so it is safe to hand around; the **Admin API key** on the same screen (the one with a colon in it) is not, and is not what this wants. |
| `GHOST_API_URL` | Pointing at a different Ghost | Defaults to `https://copilot-blog.ghost.io`. Leave unset. |
| `GHOST_REVALIDATE_SECRET` | publish refresh | Shared with the Ghost webhooks below. Unset → `/api/revalidate-ghost` refuses every call and posts wait for the hourly refresh |

Set it in `.env.local` for local work, and in the Vercel project's environment
variables for staging and production. Read server-side only; it never reaches
the browser.

### Publishing refreshes the blog (no rebuild)

Posts are cached and refreshed hourly. To show a publish within seconds instead:

1. Generate a long random secret and set it as `GHOST_REVALIDATE_SECRET` on all
   three Vercel scopes.
2. Ghost admin → **Settings → Integrations → Custom** → the integration that
   holds the Content API key → **Add webhook**, with **Target URL**
   `https://assembly.com/api/revalidate-ghost` and **Secret** set to the same
   secret. Add one webhook per event: **Post published**, **Published post
   updated**, and **Post unpublished** (and **Post deleted**, if offered).

Ghost can't send a custom header, which is how the Contentful webhook
authenticates. It signs each request with the webhook's secret instead
(`X-Ghost-Signature`), and the route checks that signature. A webhook saved
without a secret sends no signature, and every call it makes is refused with a
401.

Each call marks every page stale, since the nav's featured post reads Ghost on
every page. Pages refetch on their next visit, served the old copy meanwhile.

## Ghost, once more — the `/updates` importer only

`/updates` no longer reads Ghost. The changelog is committed under
`src/content/updates`, so the site needs nothing set to serve it and a new entry
is a new file. The two variables below are read by
`scripts/freeze-updates.mts`, the one-time importer that brought the archive
across, and by nothing the site renders — **they do not belong in Vercel**.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `GHOST_UPDATES_CONTENT_API_KEY` | Re-running the importer | The old updates Ghost admin → **Settings → Integrations → Custom** → **Content API key**. 26 characters, no colon. Read-only. |
| `GHOST_UPDATES_API_URL` | Pointing the importer elsewhere | Defaults to `https://copilot-updates.ghost.io`. Leave unset. |

## Contentful (optional) — the `/templates` gallery

Lets the templates be edited without a pull request. **Not set** → the site uses
the templates committed in `src/lib/templates.ts` and nothing changes. **Set** →
`npm run build` pulls the published templates from Contentful instead.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | everything | From **Settings → General settings** |
| `CONTENTFUL_DELIVERY_TOKEN` | the site | Read-only. **Settings → API keys** |
| `CONTENTFUL_MANAGEMENT_TOKEN` | setup + migration only | Write access. Delete it once the migration is done |
| `CONTENTFUL_ENVIRONMENT` | optional | Defaults to `master` |
| `CONTENTFUL_REVALIDATE_SECRET` | publish refresh | Shared with the Contentful webhook below. Unset → `/api/revalidate-contentful` refuses every call and edits wait for the hourly refresh |

### Sharing a space with another site

This space is shared, so the tooling is built not to touch anything that isn't
ours:

- The content type is `studioTemplate`, not a bare `template` that could collide
  with the other site's model.
- `npm run contentful:setup` **refuses** to modify an existing `studioTemplate`
  whose name isn't this site's, and stops with an explanation.
- Every read and write is filtered to that one content type. Nothing else in the
  space is listed, read, or changed.

For stronger separation, put this site in its own Contentful **environment**
(**Settings → Environments**) and set `CONTENTFUL_ENVIRONMENT` to it — the other
site keeps using `master` and the two never see each other's content. A separate
**space** is stronger still, if the plan has room for one.

### First-time setup

```
npm run contentful:setup        # create the content type
npm run contentful:push -- --dry # preview the migration, change nothing
npm run contentful:push         # copy the 27 committed templates up
npm run contentful:pull         # write src/lib/templates.generated.ts
```

Then add `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_TOKEN` to Vercel
(Production, Staging, and Preview scopes — both tokens are read-only, and
staging reviewing a different set of templates than production ships is worse
than sharing them). `prebuild` runs the pull on every deploy.

### Publishing refreshes the catalogue (no rebuild)

The templates and embeds catalogue is cached once for all server instances and
refreshed hourly. Publishing no longer needs a rebuild: if an earlier setup
added a Contentful webhook pointing at a Vercel **Deploy Hook**, delete that
webhook (and the hook), since every rebuild re-fetches the catalogue. To show an
edit within seconds instead:

1. Generate a long random secret and set it as `CONTENTFUL_REVALIDATE_SECRET` on
   all three Vercel scopes.
2. Contentful → **Settings → Webhooks → Add webhook**: `POST` to
   `https://assembly.com/api/revalidate-contentful` (one webhook per deployed
   domain), with a header `x-revalidate-secret` set to the same secret. Trigger
   on **Publish**, **Unpublish** and **Delete** for Entry and Asset.

### What stays in code

Each gallery card is a React mock keyed by slug, so a template created only in
Contentful gets a real page and a real card, just a generic-looking one until
someone adds a mock in `hero-v71.tsx` or uploads a **Preview image** to the
entry.
