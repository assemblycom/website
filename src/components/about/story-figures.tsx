/**
 * The figure that runs alongside each chapter of the about page's story: one
 * plain grey block, nothing inside it.
 *
 * It is a placeholder holding the slot until there's real art for these. Mock
 * composition here — panels, bars, tiles — reads as a lo-fi wireframe of a
 * product that doesn't exist, and invites the reader to squint at it instead of
 * reading the argument beside it.
 */
export function StoryFigure() {
  return (
    <div
      aria-hidden
      className="aspect-[16/9] w-full rounded-xl bg-foreground/[0.07]"
    />
  );
}
