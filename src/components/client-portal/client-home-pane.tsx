import {
  IconCard,
  IconFile,
  IconClipboard,
  IconPenFilled,
} from "@/components/home/mock-icons";
import {
  MOCK_FIGURE,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
} from "@/components/ui/mock-type";

const LINE = "border-[var(--mock-line)]";
const INK = "text-[color:var(--mock-ink)]";
const INK_SOFT = "text-[color:var(--mock-ink-soft)]";

/**
 * What is waiting on the client, each tagged with the app it lives in. Home is
 * where a portal tells a client there is something to do, and naming the app
 * on every row is what shows the apps sharing one home rather than sitting in
 * separate tools.
 */
const ACTION_ITEMS = [
  {
    icon: <IconPenFilled />,
    label: "Sign your engagement letter",
    app: "Contracts",
  },
  { icon: <IconCard />, label: "Pay invoice #1042", app: "Billing" },
  { icon: <IconClipboard />, label: "Complete the onboarding form", app: "Forms" },
  {
    icon: <IconFile />,
    label: "Upload last year's bank statements",
    app: "Files",
  },
];

/**
 * The client's Home in their portal: a greeting by name and the items waiting
 * on them. Drawn as the pane inside BrandedPortalVisual, so the firm's nav sits
 * beside it, and set on the same --mock-* tokens and type steps as the
 * assistant pane it stands in for on the homepage.
 */
export function ClientHomePane() {
  return (
    <div className="flex h-full min-h-0 flex-col pt-2 md:pt-4">
      <p
        className={`${MOCK_FIGURE} ${INK} max-md:text-[15px] [[data-theme=dark]_&]:text-white/85`}
      >
        Welcome back, Renee
      </p>
      <p className={`mt-2 ${MOCK_PRIMARY} ${INK_SOFT}`}>
        Here is what needs your attention.
      </p>

      <div
        className={`mt-5 overflow-hidden rounded-lg border bg-[var(--mock-window)] ${LINE}`}
      >
        <div
          className={`flex items-center gap-2 border-b bg-[var(--mock-well)] px-3.5 py-2.5 ${LINE}`}
        >
          <span className={`flex-1 ${MOCK_PRIMARY} ${INK}`}>Action items</span>
          <span
            className={`rounded px-1.5 py-[4px] tabular-nums ${MOCK_SECONDARY} bg-[var(--mock-well-3)] ${INK_SOFT}`}
          >
            {ACTION_ITEMS.length}
          </span>
        </div>
        {ACTION_ITEMS.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-[var(--mock-well)] ${
              i > 0 ? `border-t ${LINE}` : ""
            }`}
          >
            <span
              className={`flex size-[22px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--mock-well-3)] ${INK_SOFT} [&>svg]:size-[12px]`}
            >
              {item.icon}
            </span>
            <span
              className={`min-w-0 flex-1 truncate ${MOCK_PRIMARY} ${INK} [[data-theme=dark]_&]:text-white/75`}
            >
              {item.label}
            </span>
            <span
              className={`shrink-0 rounded px-1.5 py-[4px] ${MOCK_SECONDARY} bg-[var(--mock-well-3)] ${INK_SOFT} max-md:hidden`}
            >
              {item.app}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
