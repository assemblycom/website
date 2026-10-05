import Link from "next/link";

/**
 * The compact template rail, shared by /client-portal and /ai-app-builder.
 *
 * It was two separate sections. The portal's had already been reworked from
 * cover cards into rows, because the covers are empty frames — there are no
 * template shots yet — so a 5:3 panel above each title was mostly grey and six
 * cards ate a screen. The builder's was still the cover-card version, which is
 * the reinvention this site's rules exist to prevent: one solved element, two
 * drawings of it. So the rows moved here and both pages read them.
 *
 * The one difference the builder's rail needs is the chips: it is
 * vertical-tagged to prove range, where the portal's is framed as foundations
 * and tags nothing. They are optional per row rather than a second component.
 */
export type TemplateRailCard = {
  href: string;
  title: string;
  description: string;
  /** Mono uppercase tags under the row's text; the site's standard tag chip. */
  chips?: { label: string; outlined?: boolean }[];
};

export function TemplateRail({ cards }: { cards: TemplateRailCard[] }) {
  return (
    <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group flex items-center gap-4 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted [[data-theme=dark]_&]:bg-white/[0.03] [[data-theme=dark]_&]:hover:bg-white/[0.06]"
        >
          {/* The template shot goes here once the art exists. It takes the
              full `--muted` against the row's half-strength fill, so the slot
              is the darker element — the way a real thumbnail will be once
              there is one. White on the lighter row read as a hole. */}
          <span className="size-14 shrink-0 rounded-lg bg-muted [[data-theme=dark]_&]:bg-white/[0.07]" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              {card.title}
            </span>
            {/* One line, hard. The descriptions are written to fit; the
                truncate is the guard rather than the mechanism. */}
            <span className="mt-0.5 block truncate text-sm text-muted-foreground">
              {card.description}
            </span>
            {card.chips?.length ? (
              // Under the text rather than trailing the row: at the three-column
              // width a chip on the right leaves the title about 170px, and
              // these titles are not 170px titles.
              <span className="mt-2 flex flex-wrap gap-1.5">
                {card.chips.map((chip) => (
                  <span
                    key={chip.label}
                    // The site's tag chip. The transparent border on the filled
                    // one boxes it to the same height as an outlined one beside
                    // it; without it a row holding both was 2px taller.
                    className={`inline-block rounded-md px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground ${
                      chip.outlined
                        ? "border border-border"
                        : "border border-transparent bg-muted [[data-theme=dark]_&]:bg-white/[0.07]"
                    }`}
                  >
                    {chip.label}
                  </span>
                ))}
              </span>
            ) : null}
          </span>
        </Link>
      ))}
    </div>
  );
}
