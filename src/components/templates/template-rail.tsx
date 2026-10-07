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
  /**
   * A mark for the art slot, for the rows that have one drawn. Without it the
   * slot stays the plain recess it has always been — a row with art and a row
   * without must still be the same object, so the art goes INSIDE the slot
   * rather than replacing it.
   */
  icon?: React.ReactNode;
};

export function TemplateRail({ cards }: { cards: TemplateRailCard[] }) {
  return (
    <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          // The page's own grey, not a third one. These rows carried bg-muted
          // at half opacity with bg-muted on hover, which put two more greys on
          // a page whose picture slots are all --surface — and half-opacity
          // resolves against whatever is behind it, so the row was a different
          // colour again on a tinted band. Hover firms up the outline instead
          // of darkening the fill, the same move the builder hero's cards make.
          //
          // The two themes answer the pointer differently, because the same
          // move does not read the same on both. On white, firming the outline
          // is enough. In dark it is not: --foreground at a tenth is a
          // near-black card's ink against a near-black ground, so it was
          // invisible — and winding it up until it showed just drew a bright
          // ring around the row, which is a selected state, not a hover.
          //
          // So dark lifts the SURFACE instead, one step up the scale it
          // already has (--surface to --surface-2), and takes no ring at all.
          // That is the move the rest of this page's dark mode makes: a
          // surface answering by getting lighter.
          className="group flex items-center gap-4 rounded-xl bg-[var(--surface)] p-3 ring-1 ring-transparent transition-[box-shadow,background-color] hover:ring-foreground/10 [[data-theme=dark]_&]:hover:bg-[var(--surface-2)] [[data-theme=dark]_&]:hover:ring-transparent"
        >
          {/* The template shot goes here once the art exists. It takes the
              full `--muted` against the row's half-strength fill, so the slot
              is the darker element — the way a real thumbnail will be once
              there is one. White on the lighter row read as a hole. */}
          {/* The art slot: one defined step into the surface it sits on, so it
              reads as a recess rather than as a second surface colour. */}
          {/* The slot IS the icon's plate when there is one. An app icon is
              drawn for a light tile — that is why the artwork is near-black and
              white — so a row that carries one turns its slot into that tile
              rather than nesting a second square inside the recess.

              It does not theme, like the artwork on it. A row with no art yet
              keeps the plain --surface-2 recess, which is what the other five
              are: a slot waiting for a template shot. */}
          <span
            className={`flex size-14 shrink-0 items-center justify-center rounded-lg ${
              card.icon ? "bg-[#e6e7ea]" : "bg-[var(--surface-2)]"
            }`}
          >
            {card.icon}
          </span>
          <span className="min-w-0 flex-1">
            {/* Regular, not 500. The rank here is already carried by INK —
                full foreground over the muted description under it — and
                adding weight on top of that made the title read as bold
                against everything else on the page, which is set at 400. */}
            <span className="block truncate text-sm text-foreground">
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
