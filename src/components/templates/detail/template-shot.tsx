import { getImageProps } from "next/image";
import type { TemplateImage } from "@/lib/contentful";
import { PlaceholderArt } from "@/components/templates/template-gallery";
import { cn } from "@/lib/utils";

/**
 * One template screenshot, shown as is: the desktop shot from md up, and the
 * matching Image List (mobile) shot below it when the entry has one.
 *
 * Art direction goes through getImageProps and a <picture>, not two <Image>s
 * toggled by CSS: a display:none image is still fetched when it's eager, and
 * the hero shot is the page's LCP, so it has to be eager.
 *
 * `alt` is the asset's own Description when the editor wrote one, else the
 * caller's default.
 */
export function TemplateShot({
  desktop,
  mobile,
  alt,
  aspect,
  sizes,
  priority = false,
  className,
}: {
  desktop?: TemplateImage;
  mobile?: TemplateImage;
  alt: string;
  /** Tailwind aspect class for the frame; the shot is cropped to it from the top. */
  aspect: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  // The Image List (mobile) shots are full phone screens, portrait at about
  // 1:2.2. Kept in the desktop frame's 16:10 they'd show a sliver of status bar,
  // so below md a frame holding one turns 4:5 and shows the top of the screen.
  const frame = cn(
    "relative overflow-hidden bg-muted",
    aspect,
    mobile && "max-md:aspect-[4/5]",
    className,
  );
  if (!desktop) {
    return (
      <div className={frame} role="img" aria-label={alt}>
        <PlaceholderArt />
      </div>
    );
  }

  const label = desktop.description ?? alt;
  const common = {
    alt: label,
    sizes,
    fill: true,
    priority,
  } as const;
  const {
    props: { srcSet: desktopSet, ...rest },
  } = getImageProps({ ...common, src: desktop.url });
  const mobileSet = mobile
    ? getImageProps({ ...common, alt: mobile.description ?? label, src: mobile.url }).props.srcSet
    : undefined;

  return (
    <div className={frame}>
      <picture>
        {mobileSet && <source media="(max-width: 767px)" srcSet={mobileSet} sizes={sizes} />}
        <source media="(min-width: 768px)" srcSet={desktopSet} sizes={sizes} />
        <img {...rest} alt={label} className="object-cover object-top" />
      </picture>
    </div>
  );
}

/**
 * Browser chrome around the hero shot: three dots and an address pill, drawn
 * in the page's own tokens so it flips with the theme.
 */
export function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-9 items-center gap-3 border-b border-border px-3.5" aria-hidden>
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="mx-auto h-5 w-full max-w-80 rounded-md bg-muted" />
        <div className="w-[42px]" />
      </div>
      {children}
    </div>
  );
}
