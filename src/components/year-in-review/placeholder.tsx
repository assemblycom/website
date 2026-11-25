import { cn } from "@/lib/utils";

/**
 * A grey stand-in for artwork that hasn't been made yet. It holds the frame the
 * final image will fill, so the layout can be judged before the photography
 * exists.
 */
export function ImagePlaceholder({
  ratio = "aspect-[16/9]",
  className,
}: {
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "w-full rounded-lg bg-[var(--surface)]",
        ratio,
        className,
      )}
    />
  );
}

/** A placeholder with its caption under it, the way the article captions every image. */
export function Figure({
  caption,
  ratio,
  className,
}: {
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <ImagePlaceholder ratio={ratio} />
      {caption && (
        <figcaption className="type-caption mt-3 text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
