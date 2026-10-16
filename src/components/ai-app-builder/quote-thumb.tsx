import Image from "next/image";
import { CustomerLogo } from "@/components/customers/customer-logos";

/**
 * The speaker's thumbnail on a customer quote: the firm's logo on a fixed white
 * tile when the quote has a `logoSlug`, otherwise the portrait. Shared by the
 * `md`-and-up row and the phone accordion so the two never disagree on which
 * one a page asked for.
 *
 * A LOGO GETS A WHITE TILE IN BOTH THEMES, with a fixed dark ink. bg-muted is
 * the card's own family, so a dark wordmark on it had no edge; and themed ink
 * on a fixed tile inverts to white on white in dark. Dark softens the white to
 * #d4d4d0, which still clears 12:1 for the ink, so the tile reads as an object
 * on a near-black page rather than glaring. The hairline holds its edge on a
 * light card.
 */
export function QuoteThumb({
  logoSlug,
  image,
  className,
  logoPadding,
  sizes,
}: {
  logoSlug?: string;
  image: string;
  /** Box size and radius, e.g. "size-[72px] rounded-lg". */
  className: string;
  /** Inset for the wordmark, so it reads as a logo rather than as cropped. */
  logoPadding: string;
  /** Declared well above the box: object-cover scales by the short side and a
   *  retina screen doubles it again. */
  sizes: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className} ${
        logoSlug
          ? "bg-white text-[#1B1F24] ring-1 ring-inset ring-black/[0.06] [[data-theme=dark]_&]:bg-[#d4d4d0]"
          : "bg-muted [[data-theme=dark]_&]:bg-white/[0.06]"
      }`}
    >
      {logoSlug ? (
        <div
          className={`flex h-full w-full items-center justify-center ${logoPadding}`}
        >
          <CustomerLogo slug={logoSlug} fit />
        </div>
      ) : (
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          quality={90}
          className="object-cover object-top"
        />
      )}
    </div>
  );
}
