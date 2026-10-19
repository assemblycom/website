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
import { getAppTemplate, getAppTemplates, type AppTemplateEntry } from "@/lib/contentful";
import { getTemplateBySlug, type Template } from "@/lib/templates";
import { parseBenefits, templateCopy } from "@/lib/template-page";
import { TemplateOverview } from "@/components/templates/template-overview";
import { TemplateUseCta } from "@/components/templates/template-cta";
import { TemplateCard } from "@/components/templates/template-card";
import { BrowserFrame, TemplateShot } from "@/components/templates/detail/template-shot";
import { TemplateProof } from "@/components/templates/detail/template-proof";
import { TemplateHowItWorks } from "@/components/templates/detail/template-how-it-works";
import { TemplateStickyCta } from "@/components/templates/detail/template-sticky-cta";
import { FAQ } from "@/components/home/faq";

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
const WORKS_WITH_COUNT = 4;

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
  // No hero description and no SEO description: leave the description out so
  // search engines write their own snippet, rather than ship an empty tag or
  // the gallery card's one-liner.
  if (!copy.seoDescription) {
    delete metadata.description;
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

  // "Internal" marks an app only the team sees, read off the CMS Audience.
  const audience = new Map((await getAppTemplates()).map((e) => [e.slug, e.audience]));
  const internalOnly = (slug: string) => {
    const a = audience.get(slug) ?? [];
    return a.includes("Internal Team") && !a.includes("Clients");
  };

  return {
    cards: cards.slice(0, WORKS_WITH_COUNT).map((t) => ({
      template: t,
      chip: internalOnly(t.slug) ? "Internal" : undefined,
    })),
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

      {/* 01 Hero: copy on the left (5 of 12), the tracker shot on the right
          (7 of 12); stacked on a phone, copy first. */}
      <section className="px-6 pb-24 pt-12">
        <div className="mx-auto grid max-w-7xl items-center gap-x-16 gap-y-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
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
            <h1 className="type-display mt-5 text-balance">{copy.headline}</h1>
            <p className="type-lead mt-4 max-w-xl text-pretty text-muted-foreground">{copy.lead ?? template.description}</p>
            <div id={HERO_CTA_ID} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TemplateUseCta template={template} className={PRIMARY_BUTTON} />
              <a href={DEMO_URL} className={SECONDARY_BUTTON}>
                {DEMO_CTA_LABEL}
              </a>
            </div>
            <p className="type-caption mt-4 text-muted-foreground">
              Start for free. No credit card required.
            </p>
          </div>
          <figure className="min-w-0 lg:col-span-7">
            <BrowserFrame>
              <TemplateShot
                desktop={images[0]}
                mobile={mobileImages[0]}
                alt={`${template.title} screenshot`}
                sizes="(min-width: 1024px) 58vw, 100vw"
                priority
              />
            </BrowserFrame>
          </figure>
        </div>
      </section>

      {/* 02 Social proof */}
      <section className="px-6">
        <div className="mx-auto max-w-7xl">
          <TemplateProof />
        </div>
      </section>

      {/* 03 Definition: hidden whole when the entry has no Definition Body. */}
      {copy.definition && (
        <section className="px-6 pb-14 pt-28">
          <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
            <h2 className="type-h2 text-balance">{copy.definition.heading}</h2>
            <p className="type-lead mt-4 max-w-xl text-pretty text-muted-foreground">
              {copy.definition.body}
            </p>
          </div>
        </section>
      )}

      {/* 04 Benefits: 2×2 cards beside the second shot. An overview that doesn't
          follow the layout still renders, whole, rather than vanishing. */}
      {(benefits || entry?.overview) && (
        <section className={`px-6 pb-28 ${copy.definition ? "pt-14" : "pt-28"}`}>
          <div className="mx-auto max-w-7xl">
            {benefits ? (
              <>
                <h2 className="type-h2 max-w-2xl text-balance">{benefits.heading}</h2>
                <div className={`mt-12 grid items-stretch gap-4 ${images[1] ? "lg:grid-cols-2" : ""}`}>
                  {/* Without the second shot the cards take the full width, four across
                      from lg, rather than leaving the right half empty. */}
                  <div className={`grid gap-4 sm:grid-cols-2 ${images[1] ? "" : "lg:grid-cols-4"}`}>
                    {benefits.cards.map((card) => (
                      <div key={card.title} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6">
                        <h3 className="type-h4">{card.title}</h3>
                        <p className="type-body text-pretty text-muted-foreground">{card.body}</p>
                      </div>
                    ))}
                  </div>
                  {images[1] && (
                    <figure className="min-w-0">
                      <TemplateShot
                        desktop={images[1]}
                        mobile={mobileImages[1]}
                        alt={`${template.title} screenshot`}
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="rounded-xl border border-border"
                      />
                    </figure>
                  )}
                </div>
              </>
            ) : (
              <div className="max-w-3xl">
                <TemplateOverview document={entry!.overview!} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 05 How it works: shared by every template page. */}
      <section className="bg-muted px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <h2 className="type-h2 text-balance">Add it, describe your changes, publish</h2>
          <TemplateHowItWorks />
        </div>
      </section>

      {/* 06 Works with */}
      {related.cards.length > 0 && (
        <section className="px-6 pb-14 pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
              <div className="max-w-2xl">
                <h2 className="type-h2 text-balance">Pair it with the rest of your client experience</h2>
                <p className="type-lead mt-4 max-w-xl text-pretty text-muted-foreground">
                  Every app connects to the same built-in CRM and appears in the same branded client experience.
                </p>
              </div>
              <Link href="/templates" className="type-body whitespace-nowrap text-foreground transition-colors hover:text-muted-foreground">
                {browseAllLabel(related.total)} →
              </Link>
            </div>
            {/* A sideways scroll on a phone, with the next card showing at the
                edge; four across from md. */}
            <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
              {related.cards.map(({ template: card, chip }) => (
                <TemplateCard
                  key={card.slug}
                  template={card}
                  chip={chip}
                  className="w-[72%] shrink-0 snap-start md:w-full"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 07 FAQ */}
      {faqs.length > 0 && <FAQ heading={copy.faqHeading} items={faqs} />}

      {/* 08 Final CTA */}
      <div className="border-t border-border [[data-theme=dark]_&]:border-[#383838]" />
      <section className="px-6 py-16 text-center md:py-24">
        <h2 className="type-display mx-auto max-w-md text-balance text-foreground md:max-w-2xl">
          {copy.ctaHeading}
        </h2>
        <p className="type-lead mx-auto mt-5 max-w-sm text-balance text-muted-foreground sm:max-w-xl">
          Start from this template and make it yours in minutes. Start for free. No credit card required.
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
