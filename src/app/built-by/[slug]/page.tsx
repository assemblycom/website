import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BuiltOnPage } from "@/components/built-on/built-on-page";
import { getBuiltOnFirm } from "@/lib/built-on-firms";
import { IS_LIVE_SITE, SITE_NAME, SITE_URL } from "@/lib/constants";
import { OG_IMAGE, ogImageForFirm } from "@/lib/og";

/**
 * The attributed link a firm shares when it posts about something it built.
 *
 * Same page as /built-on, reached a different way. The badge is clicked out of a
 * portal, so a query string is fine there; this one is typed into a LinkedIn
 * post and printed on the end card of a video, so it has to be short and has to
 * survive being read aloud. It also has to stay legible in the address bar after
 * the click, which rules out redirecting to the query-string form.
 *
 * Under /built-by rather than at the root: bare top-level slugs already belong
 * to the CMS feature pages (/client-portal, /invoicing), and a firm slug there
 * would collide with those and with every future one.
 */

// The surface, recorded on the signup link and on both events, so traffic from
// a shared post can be told apart from traffic from the badge.
const SURFACE = "share";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const firm = getBuiltOnFirm(slug);

  // A link posted publicly gets unfurled in Slack, mail and DMs even when
  // LinkedIn and X suppress the card in favour of the native video, so the
  // preview names the firm rather than falling back to the site's own card.
  const title = firm
    ? `${firm.name} runs their client experience on Assembly`
    : "Built on Assembly";

  return {
    title: { absolute: title },
    description:
      "The app this firm built for its clients, and the platform underneath it.",
    alternates: { canonical: `/built-by/${slug}` },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description:
        "The app this firm built for its clients, and the platform underneath it.",
      url: `${SITE_URL}/built-by/${slug}`,
      images: [firm ? ogImageForFirm(firm.name, firm.brandColor) : OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [
        firm ? ogImageForFirm(firm.name, firm.brandColor).url : OG_IMAGE.url,
      ],
    },
    // One page per firm, thin and duplicated across every firm, and reached from
    // a link rather than from search.
    robots: { index: false, follow: false },
  };
}

export default async function BuiltBy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Held on staging with /built-on, since the generator that hands firms this
  // link does not exist yet. Delete these two lines to ship both.
  if (IS_LIVE_SITE) redirect("/");

  const { slug } = await params;
  return (
    <BuiltOnPage
      // A slug that resolves to nothing, and a firm that opted out, both get the
      // generic page — but the slug still travels to signup, so a firm that
      // opted out of being named is still credited for the visitor it sent.
      firm={getBuiltOnFirm(slug)}
      workspaceId={slug}
      surface={SURFACE}
    />
  );
}
