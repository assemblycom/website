/**
 * The stats as a moving strip rather than a static row: a pinned label, then a
 * marquee of label/value pairs. The marquee is the only motion here — the
 * homepage band's odometer is built for figures three times this size, and at
 * this one it read as the numbers twitching rather than settling.
 *
 * The figures still need a fact-check. Internal docs cite 250K+ clients while
 * the public boilerplate says 1M+, and the apps and payments figures have not
 * been checked against current data.
 */
const STATS = [
  { label: "Firms", value: "1,000+" },
  { label: "Apps built", value: "5,500+" },
  { label: "Clients managed", value: "1M+" },
  { label: "Payments processed", value: "$150M+" },
];

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-r border-border px-5 [[data-theme=dark]_&]:border-[#383838]">
      <span className="type-eyebrow text-muted-foreground">{label}</span>
      {/* The site's chip, holding the figure so the number reads as a value
          rather than more label. */}
      <span className="rounded-md bg-muted px-2 py-1 text-[13px] leading-none tabular-nums text-foreground [[data-theme=dark]_&]:bg-white/[0.06]">
        {value}
      </span>
    </div>
  );
}

export function PortalStatTicker() {
  return (
    <div
      aria-label="Assembly by the numbers"
      className="flex cursor-default select-none flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-0"
    >
      <div className="shrink-0 lg:border-r lg:border-border lg:pr-5 [[data-theme=dark]_&]:lg:border-[#383838]">
        {/* PP Mori in sentence case rather than the eyebrow's mono caps: this
            is the strip's own label, not one of the stat labels beside it. */}
        <span className="text-sm text-foreground">Assembly in numbers</span>
      </div>

      {/* overflow-clip rather than hidden: hidden on the X axis forces the Y
          axis to scroll, which would clip the chips' own rounding. */}
      <div className="relative isolate w-full min-w-0 flex-1 overflow-x-clip">
        {/* The track runs off both edges, so it fades into the page instead of
            cutting off mid-figure. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-[linear-gradient(to_right,var(--background)_0%,transparent_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-[linear-gradient(to_right,transparent_0%,var(--background)_100%)]"
        />
        {/* Two identical halves so the -50% marquee wraps seamlessly; the
            second is hidden from assistive tech as a duplicate. */}
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          {[0, 1].map((half) => (
            <div key={half} className="flex" aria-hidden={half === 1}>
              {STATS.map((stat) => (
                <StatItem
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
