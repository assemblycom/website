import { GRID_LINE } from "@/components/ui/grid-lines";

/**
 * A product shot a page has been designed around but that has not been made
 * yet: an empty dashed frame holding the slot's proportions.
 *
 * The art direction rides along in `title` rather than being printed inside the
 * frame. On the page it was a block of grey text at every slot, which made the
 * layout harder to read rather than easier; on the element it is still there
 * for whoever makes the shot, on hover or in the inspector.
 */
export function VisualSlot({
  label,
  description,
  ratio = "16 / 9",
  className = "",
}: {
  label: string;
  description: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure
      title={`${label} — ${description}`}
      aria-hidden
      className={`rounded-xl border border-dashed bg-muted/40 ${GRID_LINE} ${className}`}
      style={{ aspectRatio: ratio }}
    />
  );
}
