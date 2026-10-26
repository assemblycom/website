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
  // shot (a full phone screen, about 1:2.2) is shown at a phone's own width,
  // centred, and cut at 9:16 from the top, so one screenshot can't fill the
  // page. It used to keep the full page width with the height capped, which
  // contained the narrow shot in a wide frame and left a blank band beside it.
  const ratio = (image?: TemplateImage) =>
    image?.width && image.height ? `${image.width} / ${image.height}` : undefined;
  const style = {
    "--shot-ratio": ratio(desktop) ?? "16 / 10",
    "--shot-ratio-sm": ratio(mobile) ?? ratio(desktop) ?? "16 / 10",
  } as React.CSSProperties;
  const frame = cn(
    "relative overflow-hidden bg-muted aspect-[var(--shot-ratio)] max-md:aspect-[var(--shot-ratio-sm)]",
    mobile && "max-md:mx-auto max-md:w-full max-md:max-w-[320px] max-md:aspect-[9/16]",
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
        {/* Dimmed a touch in dark: the shots are light-theme exports, and at
            full brightness one is the brightest thing on the page by far. */}
        <img
          {...rest}
          srcSet={desktopSet}
          alt={label}
          className={cn(
            "object-contain [[data-theme=dark]_&]:brightness-[0.85]",
            mobile && "max-md:object-cover max-md:object-top",
          )}
        />
      </picture>
    </div>
  );
}

/**
 * Browser chrome around the hero shot: three dots and an address pill, drawn
 * in the page's own tokens so it flips with the theme.
 *
 * `phone`: the shot inside is a phone screen below md, so there the chrome
 * goes (a browser bar over a phone screen is the wrong device) and the frame
 * narrows to the phone shot's width.
 */
export function BrowserFrame({
  children,
  phone = false,
}: {
  children: React.ReactNode;
  phone?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        phone && "max-md:mx-auto max-md:max-w-[320px]",
      )}
    >
      <div
        className={cn("flex h-9 items-center gap-3 border-b border-border px-3.5", phone && "max-md:hidden")}
        aria-hidden
      >
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
