import {
  IconBrandMark,
  IconCheck,
  IconClock,
  IconGlobeSolid,
} from "@/components/home/mock-icons";
import {
  MOCK_BODY,
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";

// ─────────────────────────────────────────────────────────────────────────
// One small story per card, all in one shape: a card stating what happened,
// a pill under it stating the consequence, and a hairline running through
// both. The shape is shared so the maintenance deep dive and the three
// better-fit cards read as one set of diagrams rather than four drawings, and
// it stays monotone — the claim is in the words, not in a colour.
// ─────────────────────────────────────────────────────────────────────────

const LINE = "border-[var(--mock-line)]";
const CARD = `w-full max-w-[300px] rounded-[14px] border bg-[var(--mock-window)] p-3.5 text-[color:var(--mock-ink)] ${LINE}`;
const PILL = `flex items-center gap-2 rounded-full border bg-[var(--mock-window)] py-1.5 pl-1.5 pr-3.5 text-[color:var(--mock-ink)] ${MOCK_PRIMARY} ${LINE}`;
const TILE =
  "flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--mock-well-2)] text-[color:var(--mock-ink)]";
/** A placeholder line of text, for the parts of a screen nobody reads. */
const BAR = "h-[6px] rounded-full bg-[var(--mock-well-2)]";

function Story({
  card,
  pill,
  pillIcon,
}: {
  card: React.ReactNode;
  pill: string;
  pillIcon: React.ReactNode;
}) {
  return (
    <div aria-hidden className="absolute inset-0 select-none">
      {/* The spine runs the panel's full height, behind the card and the
          pill, so the two read as steps on one path rather than as two
          objects that happen to be stacked. */}
      <span className="absolute inset-y-0 left-1/2 w-px bg-[var(--mock-line)]" />
      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6">
        <div className={CARD}>{card}</div>
        <div className={PILL}>
          <span className={TILE}>{pillIcon}</span>
          {pill}
        </div>
      </div>
    </div>
  );
}

function BrandTile() {
  return (
    <span className="flex size-7 items-center justify-center rounded-[8px] bg-[var(--mock-ink)] text-[color:var(--mock-window)]">
      <IconBrandMark className="size-3.5" />
    </span>
  );
}

/** Stop carrying the maintenance yourself: one fix, shipped once. */
export function MaintenanceVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center gap-2">
            <BrandTile />
            <span className={`text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}>
              Assembly
            </span>
          </div>
          <p className={`mt-3 ${MOCK_BODY}`}>Sign-in security update</p>
          <p className={`mt-1 text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}>
            Shipped once. Nothing to change in your apps.
          </p>
        </>
      }
      pillIcon={<IconCheck className="size-3" />}
      pill="Inherited by all 4 apps"
    />
  );
}

/** A branch glyph. The mock set has none, and GitHub's own mark is theirs. */
function IconBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="4.5" cy="3.5" r="1.5" />
      <circle cx="4.5" cy="12.5" r="1.5" />
      <circle cx="11.5" cy="5.5" r="1.5" />
      <path d="M4.5 5v6M11.5 7c0 2.5-2 3-5.5 4" />
    </svg>
  );
}

const COMMITS = [
  ["Add booking flow", "a3f9c1e"],
  ["Fix date picker", "7b21d04"],
  ["Initial commit", "e0c58aa"],
];

/** Better fit 1: the code lives in a repo a developer takes over. */
export function GitHandoffVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center justify-between gap-2">
            <span className={MOCK_PRIMARY}>client-app</span>
            <span
              className={`flex items-center gap-1 rounded bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              <IconBranch className="size-[10px]" />
              main
            </span>
          </div>
          <div className="mt-3 flex flex-col">
            {COMMITS.map(([msg, hash]) => (
              <div
                key={hash}
                className={`flex items-center gap-2 border-t py-2 ${LINE}`}
              >
                <span className="size-[6px] shrink-0 rounded-full bg-[var(--mock-ink-soft)]" />
                <span className={`flex-1 truncate ${MOCK_SECONDARY}`}>{msg}</span>
                <span
                  className={`font-mono text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
                >
                  {hash}
                </span>
              </div>
            ))}
          </div>
        </>
      }
      pillIcon={<IconBranch className="size-3" />}
      pill="Handed off to a developer"
    />
  );
}

/** Better fit 2: a page anyone can land on, no login in front of it. */
export function PublicSiteVisual() {
  return (
    <Story
      card={
        <>
          <span
            className={`mx-auto block w-fit rounded-full bg-[var(--mock-well)] px-3 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
          >
            yourbrand.com
          </span>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className={MOCK_BODY}>Book a table tonight</p>
            <span className={`${BAR} w-3/4`} />
            <span className={`${BAR} w-1/2`} />
            <span
              className={`mt-2 rounded-[6px] bg-[var(--mock-ink)] px-3 py-1.5 text-[color:var(--mock-window)] ${MOCK_SECONDARY}`}
            >
              Reserve
            </span>
          </div>
        </>
      }
      pillIcon={<IconGlobeSolid className="size-3.5" />}
      pill="Open to anyone, no login"
    />
  );
}

/** Better fit 3: a one-off that ships and is left as it is. */
export function PrototypeVisual() {
  return (
    <Story
      card={
        <>
          <div className="flex items-center justify-between gap-2">
            <span className={MOCK_PRIMARY}>Event RSVP</span>
            <span
              className={`rounded bg-[var(--mock-well-2)] px-1.5 py-[3px] text-[color:var(--mock-ink-soft)] ${MOCK_MICRO}`}
            >
              v1
            </span>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <span className={`${BAR} w-full`} />
            <span className={`${BAR} w-5/6`} />
            <span className={`${BAR} w-2/3`} />
          </div>
        </>
      }
      pillIcon={<IconClock className="size-3.5" />}
      pill="No changes planned"
    />
  );
}
