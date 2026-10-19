/**
 * "Add it, describe your changes, publish": the three steps, each under a small
 * panel. The panels are fixed graphics, the same on every template page: they
 * show how any template goes live, using the client project tracker as the
 * worked example, so nothing here reads from the CMS.
 *
 * Drawn in the page's own tokens (background, muted, card, border, foreground)
 * so both themes come from the same markup. Assembly chrome appears only in
 * the two team-facing panels; the client view shows the placeholder workspace,
 * Brandmages, and no Assembly mark.
 */

// The Assembly symbol, in currentColor so it takes the theme's ink.
function AssemblyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 139 139" fill="currentColor" aria-hidden className={className}>
      <path d="M138.878 100.104V123.552C138.878 131.844 132.142 138.57 123.832 138.57H4.14569C0.460605 138.57 -1.38657 134.121 1.21984 131.521L29.2747 103.532C31.4737 101.338 34.4597 100.104 37.5707 100.104H138.888H138.878Z" />
      <path d="M138.879 47.1379V70.5811C138.879 78.8728 132.143 85.5986 123.829 85.5986H47.2427L82.3575 50.5654C84.5565 48.3712 87.5379 47.1379 90.6489 47.1379H138.884H138.879Z" />
      <path d="M138.879 4.1366V17.6205C138.879 25.9122 132.143 32.638 123.829 32.638H100.325L131.815 1.21717C134.421 -1.38353 138.879 0.459594 138.879 4.1366Z" />
    </svg>
  );
}

const PANEL =
  "flex aspect-[4/3] flex-col overflow-hidden rounded-xl border border-border bg-background text-xs leading-4";

function AppBar({ label, trailing }: { label: string; trailing?: string }) {
  return (
    <div className="flex h-9 flex-none items-center gap-2.5 border-b border-border px-3.5">
      <AssemblyMark className="size-3.5 text-foreground" />
      <span className="flex-none whitespace-nowrap text-muted-foreground">{label}</span>
      {trailing && (
        <span className="ml-auto min-w-0 truncate text-muted-foreground">{trailing}</span>
      )}
    </div>
  );
}

function InstallPanel() {
  return (
    <div
      role="img"
      aria-label="Assembly dashboard template card for Client project tracker with the Install button pressed."
      className={PANEL}
    >
      <AppBar label="Templates" />
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-5">
        <div className="w-full max-w-60 overflow-hidden rounded-lg border border-border bg-card">
          <div className="aspect-[2/1] border-b border-border bg-muted" />
          <div className="flex flex-col gap-1 p-3">
            <span className="text-[13px] leading-[18px] text-foreground">Client project tracker</span>
            <span className="text-muted-foreground">Milestones and progress per engagement</span>
            <div className="mt-2 flex justify-end">
              <span className="inline-flex h-[26px] scale-[0.96] items-center rounded-md bg-foreground/85 px-3 text-background shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]">
                Install
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderPanel() {
  return (
    <div
      role="img"
      aria-label="Assembly app builder chat. Margot asks to add a Client review stage and the builder confirms."
      className={PANEL}
    >
      <AppBar label="App builder" trailing="Client project tracker" />
      <div className="flex min-h-0 flex-1 flex-col justify-end gap-3 p-3.5">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] uppercase leading-[14px] tracking-wide text-muted-foreground">
            Margot
          </span>
          <div className="max-w-[82%] rounded-lg bg-foreground px-2.5 py-2 text-background">
            Add a Client review stage between In progress and Done.
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase leading-[14px] tracking-wide text-muted-foreground">
            <AssemblyMark className="size-2.5 text-foreground" />
            Assembly
          </span>
          <div className="max-w-[82%] rounded-lg bg-muted px-2.5 py-2 text-foreground">
            Updated. Client review now sits between In progress and Done.
          </div>
        </div>
        <div className="flex h-8 flex-none items-center rounded-md border border-border px-2.5 text-muted-foreground">
          Describe a change
        </div>
      </div>
    </div>
  );
}

const COLUMNS: { label: string; items: string[]; done?: boolean }[] = [
  { label: "Next", items: ["Launch"] },
  { label: "In progress", items: [] },
  { label: "Client review", items: ["Homepage design"] },
  { label: "Done", items: ["Discovery", "Sitemap", "Wireframes"], done: true },
];

function PortalPanel() {
  return (
    <div
      role="img"
      aria-label="Brandmages client portal signed in as Meridian Corp, showing the Website redesign tracker with 3 of 5 milestones done."
      className={PANEL}
    >
      <div className="flex h-7 flex-none items-center gap-2.5 border-b border-border px-2.5">
        <div className="flex gap-1">
          <span className="size-[7px] rounded-full bg-foreground/15" />
          <span className="size-[7px] rounded-full bg-foreground/15" />
          <span className="size-[7px] rounded-full bg-foreground/15" />
        </div>
        <div className="mx-auto flex h-4 w-full max-w-44 items-center justify-center rounded-sm bg-muted text-[9px] leading-3 text-muted-foreground">
          portal.brandmages.com
        </div>
        <div className="w-[29px]" />
      </div>
      <div className="flex h-8 flex-none items-center gap-2 border-b border-border px-3">
        <span className="size-3.5 rounded border border-border bg-muted" />
        <span className="whitespace-nowrap text-foreground">Brandmages</span>
        <span className="ml-auto flex items-center gap-1.5 whitespace-nowrap text-[10px] text-muted-foreground">
          Meridian Corp
          <span className="flex size-4 items-center justify-center rounded-full bg-muted text-[8px] text-foreground">
            M
          </span>
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pb-3 pt-2.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] leading-[18px] text-foreground">Website redesign</span>
          <span className="whitespace-nowrap text-[10px] text-muted-foreground">3 of 5 milestones done</span>
        </div>
        <div className="h-1 overflow-hidden rounded-sm bg-muted">
          <div className="h-full w-3/5 bg-foreground" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-[5px]">
          {COLUMNS.map((col) => (
            <div key={col.label} className="flex min-w-0 flex-col gap-[5px] rounded-md bg-muted p-1.5">
              <span className="flex items-start justify-between gap-1 text-[9px] leading-3 text-muted-foreground">
                <span className="min-w-0">{col.label}</span>
                <span>{col.items.length}</span>
              </span>
              {col.items.map((item) => (
                <div
                  key={item}
                  className={`rounded-md border border-border bg-card px-[7px] py-1.5 text-[10px] leading-[13px] ${
                    col.done ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    Panel: InstallPanel,
    title: "Add the template",
    body: "It installs as a working app you can use as is.",
  },
  {
    Panel: BuilderPanel,
    title: "Describe your changes",
    body: "Tell the app builder what to change, from fields to steps, and it adapts the template to your business.",
  },
  {
    Panel: PortalPanel,
    title: "Publish to clients",
    body: "It appears in your branded client experience, with sign-in and permissions already handled.",
  },
];

export function TemplateHowItWorks() {
  return (
    <ol className="mt-12 grid gap-x-4 gap-y-10 md:grid-cols-3">
      {STEPS.map(({ Panel, title, body }, i) => (
        <li key={title} className="flex flex-col">
          <Panel />
          <span className="mt-6 font-mono text-xs tabular-nums text-muted-foreground">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="type-h4 mt-2">{title}</h3>
          <p className="type-body mt-2 text-pretty text-muted-foreground">{body}</p>
        </li>
      ))}
    </ol>
  );
}
