// ─────────────────────────────────────────────────────────────────────────
// TEAM-CRM VISUAL — the internal team view from the Product file (node
// 65270:189033): full workspace sidebar with every app, and the CRM's
// Contacts table with status pills and tier chips. Decorative only.
// ─────────────────────────────────────────────────────────────────────────

import { IconDots } from "@/components/home/mock-icons";

type Contact = {
  name: string;
  email: string;
  company: string;
  status: "Active" | "Inactive" | "Archived";
  tiers: string[];
};

/**
 * Two letters, the way the product draws an avatar with no photo on it: first
 * initial and last. One letter is what a generic placeholder does, and on a
 * list where three of six share a company it is also the least distinguishing
 * thing the circle could hold.
 *
 * Taken off the name rather than stored, so a name and its circle cannot
 * disagree. The parenthetical the product appends to test clients would turn
 * into a "(" if it were ever added here, so the parts are filtered to the ones
 * that start with a letter.
 */
function initials(name: string) {
  const parts = name.split(" ").filter((w) => /^[A-Za-z]/.test(w));
  const first = parts[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  return (first[0] ?? "") + (last[0] ?? "");
}

/**
 * The firm and the addresses are SHORT on purpose. The card crops this table a
 * little past its Company column, which leaves the Name column ~156px — enough
 * for a name and an address, and not enough for "chuckd@servicesymphony.com".
 * A truncated address in a picture of a contact list reads as the list being
 * broken rather than as the card being narrow, so the sample data is written
 * to the measure the card actually gives it.
 */
const CONTACTS: Contact[] = [
  {
    name: "Mary Sung",
    email: "mary@symphony.co",
    company: "Symphony",
    status: "Inactive",
    tiers: ["Professional", "Starter"],
  },
  {
    name: "Chuck Wilford",
    email: "chuckd@symphony.co",
    company: "Symphony",
    status: "Active",
    tiers: ["Professional"],
  },
  {
    name: "Timothy Leclerc",
    email: "timmy@wavemarketing.com",
    company: "Wave Marketing",
    status: "Archived",
    tiers: ["Professional"],
  },
  {
    name: "Jasmin Khan",
    email: "jasmin@symphony.co",
    company: "2 companies",
    status: "Active",
    tiers: ["Advanced"],
  },
  {
    name: "Kenny Tse",
    email: "ktse2@godo.com",
    company: "Godo",
    status: "Active",
    tiers: ["Advanced"],
  },
  {
    name: "Andy Alvarez",
    email: "andy@wavemarketing.com",
    company: "Wave Marketing",
    status: "Active",
    tiers: ["Professional", "Starter"],
  },
];

const STATUS_STYLE: Record<Contact["status"], string> = {
  Active: "bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]",
  Inactive: "bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]",
  Archived: "bg-border/60 text-muted-foreground",
};

export function TeamCrmVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex select-none flex-col overflow-hidden rounded-lg bg-background ring-1 ring-border sm:aspect-[16/9.6]"
    >
      <div className="flex min-h-0 flex-1">
        {/* NO SIDEBAR, and no header bar over the table. This card's claim is
            the CRM itself — contacts, companies, custom fields — and the two
            of them spent the left third and the top of the shot on navigation
            and tools, which is furniture around the subject rather than the
            subject. The nav lives on the Add App shot in the same row, where
            the lit row is doing work; here it was a column of places you could
            go instead of looking at this. */}
        {/* Main column — CRM contacts table. */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Tabs — now the first thing on the screen, so the row carries its
              own top inset. It had none: the 34px header bar above it was what
              held it off the screen's edge, and with that gone the switcher
              sat flush against the top with its underline a few pixels from
              the frame. pt-3.5 against the tabs' own pb-1.5 is not symmetry
              for its own sake — a tab's underline IS its bottom edge, so the
              gap under it reads shorter than the number says. */}
          <div className="flex shrink-0 gap-4 border-b border-border px-3 pt-3.5">
            {["Companies", "Contacts"].map((tab, i) => (
              <span
                key={tab}
                className={`-mb-px border-b pb-1.5 text-[11px] leading-none ${
                  i === 1
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>

          {/* Contacts table */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-[10px] leading-none text-muted-foreground">
              <span className="min-w-0 flex-1">Name</span>
              <span className="hidden w-[92px] sm:block">Company</span>
              <span className="w-[54px]">Status</span>
              <span className="hidden w-[118px] md:block">Tier</span>
              <span className="w-[14px]" />
            </div>
            {CONTACTS.map((contact) => (
              <div
                key={contact.name}
                className="flex items-center gap-2 border-b border-border px-3 py-[6px] last:border-b-0"
              >
                <span className="flex min-w-0 flex-1 items-center gap-1.5">
                  {/* 20px, not 18: two letters at 9px need the extra two
                      pixels of circle or they sit against its sides. */}
                  <span className="flex size-[20px] shrink-0 items-center justify-center rounded-full bg-border/70 text-[9px] leading-none text-foreground">
                    {initials(contact.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10.5px] leading-[1.3] text-foreground">
                      {contact.name}
                    </span>
                    <span className="block truncate text-[9.5px] leading-[1.3] text-muted-foreground">
                      {contact.email}
                    </span>
                  </span>
                </span>
                <span className="hidden w-[92px] truncate text-[10.5px] leading-none text-muted-foreground sm:block">
                  {contact.company}
                </span>
                <span className="w-[54px]">
                  <span
                    className={`inline-block rounded-full px-1.5 py-[3px] text-[9.5px] leading-none ${STATUS_STYLE[contact.status]}`}
                  >
                    {contact.status}
                  </span>
                </span>
                <span className="hidden w-[118px] gap-1 md:flex">
                  {contact.tiers.map((tier) => (
                    <span
                      key={tier}
                      className="rounded border border-border px-1 py-[3px] text-[9px] leading-none text-foreground"
                    >
                      {tier}
                    </span>
                  ))}
                </span>
                <span className="flex w-[14px] justify-end">
                  <IconDots className="size-[11px] text-muted-foreground" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
