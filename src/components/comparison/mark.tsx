/**
 * The tick and cross in a matrix cell, each set in a disc so a row scans as a
 * verdict rather than as two hairlines of type. Both stay neutral — a green
 * tick against a red cross is louder than this site's palette goes anywhere
 * else — so the contrast is weight, not hue: a solid disc for what a product
 * does, a faint one for what it doesn't.
 */
export function Mark({ value }: { value: boolean }) {
  const label = value ? "Included" : "Not included";
  return (
    <span
      role="img"
      aria-label={label}
      className={`flex h-5 w-5 items-center justify-center rounded-full ${
        value
          ? "bg-foreground text-background"
          : "bg-foreground/10 text-muted-foreground"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {value ? (
          <path d="M20 6 9 17l-5-5" />
        ) : (
          <>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </>
        )}
      </svg>
    </span>
  );
}
