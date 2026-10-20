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
 * caller's "{name} screenshot".
 */
export function TemplateShot({
  desktop,
  mobile,
  alt,
  sizes,
  priority = false,
  className,
}: {
  desktop?: TemplateImage;
  mobile?: TemplateImage;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  // The frame takes each shot's own proportions, read off the asset, so nothing
  // is cropped: a 16:9 export shows whole in a 16:9 frame. Below md the mobile
  // shot (a full phone screen, about 1:2.2) sets the shape instead, capped in
  // height so one screenshot can't fill the phone, and contained within it.
  const ratio = (image?: TemplateImage) =>
    image?.width && image.height ? `${image.width} / ${image.height}` : undefined;
  const style = {
    "--shot-ratio": ratio(desktop) ?? "16 / 10",
    "--shot-ratio-sm": ratio(mobile) ?? ratio(desktop) ?? "16 / 10",
  } as React.CSSProperties;
  const frame = cn(
    "relative overflow-hidden bg-muted aspect-[var(--shot-ratio)] max-md:aspect-[var(--shot-ratio-sm)]",
    mobile && "max-md:max-h-[70svh]",
    className,
  );
  if (!desktop) {
    return (
      <div className={frame} style={style} role="img" aria-label={alt}>
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
    <div className={frame} style={style}>
      <picture>
        {mobileSet && <source media="(max-width: 767px)" srcSet={mobileSet} sizes={sizes} />}
        <source media="(min-width: 768px)" srcSet={desktopSet} sizes={sizes} />
        <img {...rest} srcSet={desktopSet} alt={label} className="object-contain" />
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
