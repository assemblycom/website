// ─────────────────────────────────────────────────────────────────────────
// TEAM-CRM VISUAL — the internal team view from the Product file (node
// 65270:189033): full workspace sidebar with every app, and the CRM's
// Contacts table with status pills and tier chips. Decorative only.
// ─────────────────────────────────────────────────────────────────────────

import {
  IconBrandMark,
  IconChat,
  IconChevronDown,
  IconDocuments,
  IconDots,
  IconExport,
  IconHouse,
  IconList,
  IconPerson,
  IconPlus,
  IconSearch,
  IconUsers,
} from "@/components/home/mock-icons";

type Contact = {
  name: string;
  email: string;
  company: string;
  status: "Active" | "Inactive" | "Archived";
  tiers: string[];
};

const CONTACTS: Contact[] = [
  {
    name: "Mary Sung",
    email: "mary@servicesymphony.com",
    company: "Service Symphony",
    status: "Inactive",
    tiers: ["Professional", "Starter"],
  },
  {
    name: "Chuck Wilford",
    email: "chuckd@servicesymphony.com",
    company: "Service Symphony",
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
    email: "jasmin@servicesymphony.com",
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
    email: "alvarez@wavemarketing.com",
    company: "Wave Marketing",
    status: "Active",
    tiers: ["Professional", "Starter"],
  },
];

const STATUS_STYLE: Record<Contact["status"], string> = {
  Active: "bg-[var(--mock-positive-bg)] text-[color:var(--mock-positive-fg)]",
  Inactive:
    "bg-[var(--mock-warning-bg)] text-[color:var(--mock-warning-fg)]",
  Archived: "bg-border/60 text-muted-foreground",
};

function NavItem({
  icon,
  label,
  trailing,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`flex h-[22px] items-center gap-2 rounded px-1.5 text-foreground ${
        active ? "bg-border/70" : ""
      }`}
    >
      <span className="[&>svg]:size-[13px] flex shrink-0 items-center justify-center">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[10.5px] leading-none">
        {label}
      </span>
      {trailing}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1.5 pb-1 pt-2.5 text-[9.5px] leading-none text-muted-foreground">
      {children}
    </p>
  );
}

// Header action buttons share one bordered-chip shape.
function ToolButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="hidden items-center gap-1 rounded border border-border px-1.5 py-1 text-[10px] leading-none text-foreground md:flex">
      <span className="[&>svg]:size-[10px]">{icon}</span>
      {label}
    </span>
  );
}

export function TeamCrmVisual() {
  return (
    <div
      aria-hidden
      className="pointer-events-none flex select-none flex-col overflow-hidden rounded-lg bg-background ring-1 ring-border sm:aspect-[16/9.6]"
    >
      <div className="flex min-h-0 flex-1">
        {/* Workspace sidebar — the whole team surface, hidden on mobile. */}
        <div className="hidden w-[148px] shrink-0 flex-col overflow-hidden border-r border-border bg-muted px-1.5 py-2 sm:flex md:w-[164px]">
          <div className="flex items-center gap-1.5 px-1.5 pb-2.5 pt-0.5">
            <span className="flex size-[15px] items-center justify-center rounded bg-foreground text-background">
              <IconBrandMark className="size-[9px]" />
            </span>
            <span className="text-[11px] leading-none text-foreground">
              BrandMages
            </span>
          </div>

          {/* The product's current team nav, not the fourteen-row one this
              carried.

              It listed Dashboard, CRM, Notifications and Automations over an
              Apps group of eight — Files, Contracts, Forms, Billing, Tasks,
              Quickbooks sync — and closed on a Preferences group. Two things
              were wrong with that. It is not the nav any more; and on a card
              whose claim is "every APP connects to the CRM", a column of eight
              stock rows is the part of the picture that reads as the apps,
              which makes the one thing the firm actually built invisible.

              So: the two team surfaces, then the apps — the stock pair every
              workspace has, the app this firm built, and the action that adds
              the next one. `Add App` is what makes the group legible as a
              list that GROWS, which is the sentence the card is making.

              CRM stays the selected row. The card is about the CRM, the pane
              to the right of this is the CRM, and the lit row is what ties the
              two together. */}
          <NavItem icon={<IconUsers />} label="CRM" active />
          <NavItem icon={<IconPerson />} label="Team" />

          <SectionLabel>Apps</SectionLabel>
          <NavItem icon={<IconHouse />} label="Home" />
          <NavItem icon={<IconChat />} label="Messages" />
          <NavItem icon={<IconDocuments />} label="Year-end docs" />
          {/* The one muted row: an action, not a destination. Same height and
              gutter as a nav row so the column keeps its rhythm. */}
          <div className="flex h-[22px] items-center gap-2 rounded px-1.5 text-muted-foreground">
            <span className="[&>svg]:size-[13px] flex shrink-0 items-center justify-center">
              <IconPlus />
            </span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] leading-none">
              Add App
            </span>
          </div>
        </div>

        {/* Main column — CRM contacts table. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[34px] shrink-0 items-center justify-between px-3">
            <span className="text-[11.5px] leading-none text-foreground">
              CRM
            </span>
            <span className="flex items-center gap-1.5">
              <ToolButton icon={<IconSearch />} label="Search" />
              <ToolButton icon={<IconList />} label="View" />
              <ToolButton icon={<IconExport />} label="Export" />
              <span className="flex items-center gap-1 rounded bg-foreground px-2 py-1 text-[10px] leading-none text-background">
                Create
                <IconChevronDown className="size-[9px]" />
              </span>
            </span>
          </div>

          {/* Tabs */}
          <div className="flex shrink-0 gap-4 border-b border-border px-3">
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
                  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-border/70 text-[9px] leading-none text-foreground">
                    {contact.name[0]}
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
