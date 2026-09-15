import { getAppTemplate } from "@/lib/contentful";
import { getBuiltOnExamples, type BuiltOnFirm } from "@/lib/built-on-firms";
import type { Template } from "@/lib/templates";
import { getCatalogueTemplates } from "@/lib/visible-templates";

/**
 * The four apps /built-on and /built-by show, resolved on the server.
 *
 * Two sources, because they hold different things. The catalogue carries rank,
 * which decides the order; each app's own Contentful entry carries the
 * screenshots, which is what /templates/[slug] reads. Reading only the
 * catalogue is why these apps used to show their drawn cover art while their
 * own template page showed real UI for the same slug.
 *
 * Enriched after the four are chosen rather than across the whole catalogue:
 * only these need their artwork.
 */
export async function resolveBuiltOnExamples(
  firm?: BuiltOnFirm,
): Promise<Template[]> {
  const chosen = getBuiltOnExamples(firm, await getCatalogueTemplates());

  return Promise.all(
    chosen.map(async (template) => {
      const entry = await getAppTemplate(template.slug);
      if (!entry?.images.length) return template;

      const images = entry.images.map((image) => image.url);
      return {
        ...template,
        image: images[0],
        images,
        previewCount: images.length,
      };
    }),
  );
}
