import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { ogImageFor } from "@/lib/og";
import { serializeJsonLd } from "@/lib/json-ld";
import { DEMO_CTA_LABEL, DEMO_URL, SITE_URL } from "@/lib/constants";
import {
  getCatalogueTemplate,
  getCatalogueTemplates,
  getVisibleTemplates,
} from "@/lib/visible-templates";
import { getAppTemplate, type AppTemplateEntry } from "@/lib/contentful";
import { getTemplateBySlug, type Template } from "@/lib/templates";
import { parseBenefits, templateCopy } from "@/lib/template-page";
import { templateMockCopy } from "@/lib/template-mocks";
import { TemplateOverview } from "@/components/templates/template-overview";
import { TemplateUseCta } from "@/components/templates/template-cta";
import { BrowserFrame, TemplateShot } from "@/components/templates/detail/template-shot";
import { TemplateProof } from "@/components/templates/detail/template-proof";
import { PortalBuild } from "@/components/client-portal/portal-build";
import { PortalStack } from "@/components/client-portal/portal-stack";
import { PortalReadyMade } from "@/components/client-portal/portal-ready-made";
import { templateIcon } from "@/components/templates/template-icons";
import { BuildCard, DescribeCard, InstallCard } from "@/components/client-portal/portal-build-cards";
import { TemplateStickyCta } from "@/components/templates/detail/template-sticky-cta";
import { FAQ } from "@/components/home/faq";
import { GRID_LINE, GridDivider, GridRails } from "@/components/ui/grid-lines";

interface Props {
  params: Promise<{ slug: string }>;
}

// Re-resolved against Contentful every few minutes rather than only at deploy.
// Prerendered once, an editor hiding a template in the CMS had no effect until
// somebody happened to ship — which is not what "the CMS is the catalogue" can
// mean in practice. Five minutes is short enough that a change lands while the
// person who made it is still looking, and long enough that crawlers aren't
// re-running the query on every hit.
export const revalidate = 300;

// Every published App Template, hidden ones included: a hidden template still
// has a page, it just isn't listed anywhere. Slugs outside this list fall through
// to on-demand rendering and 404 there if nothing resolves them.
export async function generateStaticParams() {
  return (await getCatalogueTemplates()).map((t) => ({ slug: t.slug }));
}

const HERO_CTA_ID = "template-hero-cta";

// The three steps, in the rail's shape. Captions are this page's own, each
// held to two lines like the product pages' rails: one caption deeper than
// the rest and the rail's feet stop lining up. The mocks name THIS page's
// app — its title on the install and on the portal's lit nav row, and a change
// to it in the composer (template-mocks.ts) — so a document collection page
// doesn't show a project tracker being built.
function howItWorks(template: Template) {
  const { prompt, setup, appName = template.title } = templateMockCopy(template.slug);
  return [
    {
      name: "Add the template",
      body: "It installs as a working app in your workspace that you can use as is.",
      visual: <InstallCard appName={appName} setup={setup} />,
    },
    {
      name: "Describe your changes",
      body: "Tell the app builder what to change and it adapts the template to your business.",
      visual: <DescribeCard prompt={prompt} />,
    },
    {
      name: "Publish to clients",
      body: "It appears in your branded client experience, with sign-in and permissions already handled.",
      visual: <BuildCard sidebarOnly appLabel={appName} />,
    },
  ];
}
// Six, the product pages' count: two full rows of the rail's three.
const WORKS_WITH_COUNT = 6;

const PRIMARY_BUTTON =
  "rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90";
const SECONDARY_BUTTON =
  "rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-center text-sm text-foreground transition-colors hover:bg-foreground/5";

/**
 * The committed record merged with its Contentful entry, the same way the page
 * always has: the catalogue first, so a template that lives only in Contentful
 * resolves; the committed array second, so a slug the CMS has since dropped
 * keeps its page rather than 404ing on an editorial change.
 */
async function resolveTemplate(slug: string) {
  const local = (await getCatalogueTemplate(slug)) ?? getTemplateBySlug(slug);
  if (!local) return null;
  const entry = await getAppTemplate(slug);
  const template: Template = entry
    ? {
        ...local,
        title: entry.name,
        description: entry.subtitle ?? local.description,
        // Contentful's "Template Id" is the product's own app id and the only
        // authoritative source for it; the committed value is the fallback for
        // templates the CMS doesn't hold yet.
        templateId: entry.templateId ?? local.templateId,
        category: entry.category ?? local.category,
      }
    : local;
  const copy = templateCopy({
    name: template.title,
    longDescription: template.longDescription || undefined,
    marketingHeadline: entry?.marketingHeadline,
    heroDescription: entry?.heroDescription,
    seoKeyword: entry?.seoKeyword,
    definitionBody: entry?.definitionBody,
    ctaHeading: entry?.ctaHeading,
    seoTitle: entry?.seoTitle,
    seoMetaDescription: entry?.seoMetaDescription,
  });
  return { template, entry, copy };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveTemplate(slug);
  if (!resolved) return {};
  const { template, copy } = resolved;
  const metadata = pageMetadata(
    {
      title: copy.seoTitle,
      description: copy.seoDescription ?? "",
      path: `/templates/${template.slug}`,
    },
    // The card prints the SEO title, so the unfurl, the tab and the search
    // result all name the page the same way.
    ogImageFor(copy.seoTitle),
  );
  // No hero description and no SEO description: no description at all, so
  // search engines write their own snippet rather than read an empty tag or
  // the gallery card's one-liner. null, not omitted: an omitted description
  // inherits the root layout's, which is the homepage's copy. The social
  // objects replace the layout's wholesale, so dropping the key is enough there.
  if (!copy.seoDescription) {
    metadata.description = null;
    if (metadata.openGraph) delete metadata.openGraph.description;
    if (metadata.twitter) delete metadata.twitter.description;
  }
  return metadata;
}

/**
 * The Works with row: the templates the editor picked in Relative Apps, else
 * the template's category-mates by rank. Listed templates only, never itself.
 */
async function worksWith(template: Template, entry: AppTemplateEntry | null) {
  const listed = (await getVisibleTemplates()).filter((t) => t.slug !== template.slug);
  const bySlug = new Map(listed.map((t) => [t.slug, t]));
  const picked = (entry?.relatedSlugs ?? [])
    .map((slug) => bySlug.get(slug))
    .filter((t): t is Template => Boolean(t));
  const cards = picked.length
    ? picked
    : listed
        .filter((t) => t.category === template.category)
        .sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));

  return {
    cards: cards.slice(0, WORKS_WITH_COUNT),
    // "30+", not "32": a round floor that stays true as templates come and go.
    total: listed.length + 1,
  };
}

function browseAllLabel(total: number) {
  return total >= 10 ? `Browse all ${Math.floor(total / 10) * 10}+ templates` : "Browse all templates";
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const resolved = await resolveTemplate(slug);
  if (!resolved) notFound();
  const { template, entry, copy } = resolved;

  const images = entry?.images ?? [];
  const mobileImages = entry?.mobileImages ?? [];
  const benefits = parseBenefits(entry?.overview);
  if (entry?.overview && !benefits) {
    console.warn(
      `[templates] ${slug}: Marketing App Overview doesn't match the benefits layout (one Heading 2, then 2–4 Heading 3 + paragraph cards), so it renders whole.`,
    );
  }
  const faqs = entry?.faqs ?? [];
  const related = await worksWith(template, entry);
  const categoryHref = `/templates?category=${encodeURIComponent(template.category.toLowerCase())}`;
  const url = `${SITE_URL}/templates/${template.slug}`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { name: "App templates", item: `${SITE_URL}/templates` },
        ...(template.category ? [{ name: template.category, item: `${SITE_URL}${categoryHref}` }] : []),
        { name: template.title, item: url },
      ].map((crumb, i) => ({ "@type": "ListItem", position: i + 1, ...crumb })),
    },
    {
      // No rating markup: the only scores on the page are Assembly's own on
      // G2 and Capterra, not reviews of this template.
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${template.title} template`,
      ...(copy.seoDescription ? { description: copy.seoDescription } : {}),
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    ...(faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />

      {/* 01 Hero: the /solutions hero's structure (see the accounting page):
          headline top left, lead top right, buttons under the headline, and
          the shot full width below in the same rounded --surface card the
          portal carousel sits in. On the site's hero column (1400px, 24/40
          gutters); the sections below sit on the narrower 1200px column. */}
      <section className="mx-auto max-w-[1400px] px-6 pb-16 pt-12 md:px-10 md:pb-24">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/templates" className="transition-colors hover:text-foreground">
            App templates
          </Link>
          <span aria-hidden className="text-muted-foreground/50">/</span>
          {template.category && (
            <>
              <Link href={categoryHref} className="transition-colors hover:text-foreground">
                {template.category}
              </Link>
              <span aria-hidden className="text-muted-foreground/50">/</span>
            </>
          )}
          <span className="text-foreground">{template.title}</span>
        </nav>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-x-16">
          <h1 className="type-display max-w-[30ch] text-balance lg:col-start-1">{copy.headline}</h1>
          {/* The /solutions hero's lead: the right column, spanning the
              headline and button rows, nudged down to the headline's cap. */}
          <p className="type-lead max-w-[34rem] text-pretty text-muted-foreground lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-2">
            {copy.lead ?? template.description}
          </p>
          <div>
            <div id={HERO_CTA_ID} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <TemplateUseCta template={template} className={PRIMARY_BUTTON} />
              <a href={DEMO_URL} className={SECONDARY_BUTTON}>
                {DEMO_CTA_LABEL}
              </a>
            </div>
          </div>
        </div>
        {/* The accounting hero's card height (397 on a phone, 500 from md),
            with the screen cropped straight at the card's foot rather than
            shown whole: padded on the top and sides only, overflow clipped.
            A whole shot at this width ran the hero to ~1,000px. The foot is
            faded into the card, landing on a solid band as deep as the side
            padding, so the card frames the shot evenly on every side. */}
        <figure className="relative mt-12 h-[397px] overflow-hidden rounded-[28px] bg-[var(--surface)] px-4 pt-4 md:mt-16 md:h-[500px] md:px-10 md:pt-10">
          <BrowserFrame phone={Boolean(mobileImages[0])}>
            <TemplateShot
              desktop={images[0]}
              mobile={mobileImages[0]}
              alt={`${template.title} screenshot`}
              sizes="(min-width: 1400px) 1240px, 100vw"
              priority
            />
          </BrowserFrame>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-[linear-gradient(to_bottom,transparent,var(--surface)_calc(100%-16px))] md:h-44 md:bg-[linear-gradient(to_bottom,transparent,var(--surface)_calc(100%-40px))]"
          />
        </figure>
      </section>

      {/* Everything from the proof strip down to the FAQ sits in one region
          framed by the shared rails, its sections parted by rules that end on
          them: the same grid as /security and /pricing. */}
      <div className="relative pb-16 md:pb-24">
        <GridRails />

        {/* Full-bleed rule above the first section: there are no rails above
            it for a 1200px rule to meet. Desktop only, as on /pricing. */}
        <div className={`hidden border-t md:block ${GRID_LINE}`} />

      {/* 02 Social proof */}
      <section className="mx-auto max-w-[1200px] px-6 py-8 md:px-10">
        <TemplateProof />
      </section>

      <GridDivider />

      {/* 03 Definition: hidden whole when the entry has no Definition Body. */}
      {copy.definition && (
        <section className="mx-auto max-w-[1200px] px-6 pb-14 pt-20 md:px-10 md:pt-28">
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <h2 className="type-h2 text-balance">{copy.definition.heading}</h2>
            <p className="type-lead mt-4 max-w-xl text-pretty text-muted-foreground">
              {copy.definition.body}
            </p>
          </div>
        </section>
      )}

      {/* 04 Benefits: the product pages' "Keep the tools you already use"
          section (PortalStack), so the benefits read as that section's
          dotted-rule list rather than as a grid of cards of this page's own.
          No picture: the heading sits on the left and the list on the right.
          The rows have no links, so no arrows. */}
      {benefits ? (
        <PortalStack
          heading={benefits.heading}
          body={null}
          ways={benefits.cards.map((card) => ({ label: card.title, body: card.body }))}
          visual={null}
        />
      ) : entry?.overview ? (
        // An overview that doesn't follow the benefits layout still renders,
        // whole, rather than vanishing.
        <section
          className={`mx-auto max-w-[1200px] px-6 pb-20 md:px-10 md:pb-28 ${
            copy.definition ? "pt-14" : "pt-20 md:pt-28"
          }`}
        >
          <div className="max-w-3xl">
            <TemplateOverview document={entry.overview} />
          </div>
        </section>
      ) : null}

      {/* 05 How it works: shared by every template page except the Classic
          ones. Those are the product's core apps, which aren't added and
          adapted through the app builder the way these steps describe.

          The product pages' own build rail (PortalBuild), not a page-local
          section, so the three steps share their card size, grounds and
          captions. The scenes name this page's own app (see howItWorks): the
          template installing (InstallCard: the Plan card's ground and window),
          a change to it typed into the composer (Describe), and the app lit in
          the client's portal nav (Build, its sidebar alone: the board and
          search beside it pulled the eye off the row that says the app has
          arrived). Iterate would say step two more literally, but it is the
          one scene with no ground of its own and sat grey between two
          art-directed cards. No intro line or buttons: the hero's CTAs and
          the sticky bar already carry the action. */}
      {template.category?.toLowerCase() !== "classic" && (
        <>
          {/* The benefits band above closes with its own rule. */}
          {!benefits && <GridDivider />}
          <PortalBuild
            heading="Add it, describe your changes, publish"
            body={null}
            cta={null}
            steps={howItWorks(template)}
            railLabel="How a template goes live"
          />
          <GridDivider />
        </>
      )}

      {/* 06 Works with: the product pages' ready-made apps section
          (PortalReadyMade), so related templates are the same compact rows
          with an icon plate, and the browse link the same quiet button under
          the copy, as on /solutions and /client-portal. */}
      {related.cards.length > 0 && (
        <PortalReadyMade
          heading="Pair it with the rest of your client experience"
          body="Every app connects to the same built-in CRM and appears in the same branded client experience."
          picks={related.cards.map((card) => ({
            slug: card.slug,
            title: card.title,
            description: card.description,
            foundation: card.category,
            icon: templateIcon(card.slug),
          }))}
          link={{ label: browseAllLabel(related.total), href: "/templates" }}
        />
      )}

      {/* 07 FAQ: its own column is the same 1200px, so it needs no wrapper. */}
      {faqs.length > 0 && (
        <>
          <GridDivider />
          <FAQ heading={copy.faqHeading} items={faqs} />
        </>
      )}
      </div>

      {/* 08 Final CTA */}
      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />
      <section className="px-6 py-16 text-center md:py-24">
        <h2 className="type-display mx-auto max-w-md text-balance text-foreground md:max-w-2xl">
          {copy.ctaHeading}
        </h2>
        <p className="type-lead mx-auto mt-5 max-w-sm text-balance text-muted-foreground sm:max-w-xl">
          Start from this template for free and make it yours in minutes. No credit card required.
        </p>
        <div className="mx-auto mt-8 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <TemplateUseCta template={template} className={PRIMARY_BUTTON} />
          <a href={DEMO_URL} className={SECONDARY_BUTTON}>
            {DEMO_CTA_LABEL}
          </a>
        </div>
      </section>

      <TemplateStickyCta watchId={HERO_CTA_ID}>
        <TemplateUseCta template={template} className={`block w-full ${PRIMARY_BUTTON}`} />
      </TemplateStickyCta>
    </>
  );
}
