// ─────────────────────────────────────────────────────────────────────────
// THE ACCOUNTING HERO — one prompt card on a grey tray.
//
// The lead ends on "describe the next app your practice needs, and AI builds
// it", so the picture is that sentence: a firm describing a tax season job in
// its own words, with the model picker left on Auto beside Build.
// ─────────────────────────────────────────────────────────────────────────

const INK = "text-[color:var(--mock-ink)]";
const SOFT = "text-[color:var(--mock-ink-soft)]";

// The phrases the AI turns into the app, ruled so a skim picks them out.
const MARK =
  "underline decoration-dotted decoration-[color:var(--mock-ink-soft)] underline-offset-4";

// Same tray height as the marketing agency page's hero, 304px on a phone and
// 439px from md, so the two solution pages keep one template.
export function AccountingHeroVisual() {
  return (
    <div className="mt-12 flex h-[304px] flex-col overflow-hidden rounded-3xl bg-[var(--surface)] p-5 md:mt-16 md:h-[439px] md:p-6">
      <div>
        <p className={`text-[15px] ${INK}`}>Build with AI</p>
        <p className={`mt-1 text-sm ${SOFT}`}>
          Describe the next app your practice needs
        </p>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center pt-4">
        <div className="w-full max-w-[480px] rounded-2xl bg-[var(--mock-window)] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
          {/* A shorter prompt on a phone, where the long one runs to five
              lines and crowds the tray. */}
          <p className={`text-[15px] leading-relaxed sm:hidden ${INK}`}>
            Build a <span className={MARK}>tax season checklist</span> that
            collects each client&rsquo;s{" "}
            <span className={MARK}>missing documents</span> in{" "}
            <span className={MARK}>Files</span>.
          </p>
          <p className={`hidden text-[15px] leading-relaxed sm:block ${INK}`}>
            Build a <span className={MARK}>tax season checklist</span> for each
            client. Show the{" "}
            <span className={MARK}>documents we still need</span>, collect them
            in <span className={MARK}>Files</span>, and send a reminder{" "}
            <span className={MARK}>a week before the filing deadline</span>.
          </p>
          <div className="mt-5 flex items-center justify-end gap-3">
            <span className={`text-sm ${SOFT}`}>Auto</span>
            <span className="rounded-lg border border-foreground bg-foreground px-3 py-1.5 text-sm text-background">
              Build
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
