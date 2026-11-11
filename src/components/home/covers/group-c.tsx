// Template-gallery covers, group C: the settings-style apps (auto responder,
// exporter, accounting syncs) and the profile manager's activity feed. Each
// draws its real app screen at desktop size inside DesktopMock.
import { APP_ICON, APP_LINE, DesktopMock, GlassCover } from "../app-window";

const TOP_BAR = "flex h-14 items-center gap-3 border-b border-[#E5E7EB] px-6 text-[15px] leading-none";

function Chevron({ className = "size-4 text-[#6B7280]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...APP_ICON} aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// A closed dropdown as the settings apps draw it: value on the left, chevron on the right.
function SelectBox({ value, className = "" }: { value: string; className?: string }) {
  return (
    <div className={`flex h-10 items-center justify-between rounded-md border ${APP_LINE} px-3 text-[13px] leading-none text-[#374151] ${className}`}>
      {value}
      <Chevron />
    </div>
  );
}

function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 text-[#4B5563]" {...APP_ICON} aria-hidden>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M10 5v14" />
    </svg>
  );
}

// Auto responder: the two cards of the real screen, when replies go out and the
// working hours they respect.
const AR_DAYS = [
  { letter: "S", on: false },
  { letter: "M", on: true },
  { letter: "T", on: true },
  { letter: "W", on: true },
  { letter: "T", on: true },
  { letter: "F", on: true },
  { letter: "S", on: false },
];
const AR_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function CardAutoresponder() {
  return (
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={TOP_BAR}>
          <span>Auto Responder</span>
        </div>
        <div className="w-[760px] px-12 pt-12">
          <div className="text-[20px] leading-none">Auto Responder configuration</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">
            Set up automatic responses to incoming messages in the Messages App
          </div>
          <div className={`mt-6 rounded-xl border ${APP_LINE} p-5`}>
            <div className="text-[13px] leading-none">Enable auto responses</div>
            <SelectBox value="Outside working hours" className="mt-3" />
          </div>
          <div className="mt-10 text-[20px] leading-none">Working hours</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">
            Your automated response will send outside of these hours
          </div>
          <div className={`mt-6 rounded-xl border ${APP_LINE} p-5`}>
            <div className="text-[13px] leading-none">Timezone</div>
            <SelectBox value="Eastern Standard Time (EST)  UTC -5" className="mt-3" />
            <div className="mt-5 flex items-center justify-between border-t border-[#E5E7EB] py-5 text-[13px] leading-none">
              Select days
              <span className="flex gap-2.5">
                {AR_DAYS.map((d, i) => (
                  <span
                    key={i}
                    className={`flex size-7 items-center justify-center rounded-full text-[11px] leading-none ${d.on ? "bg-[#111827] text-[#FFFFFF]" : "bg-[#ECEDEF] text-[#4B5563]"}`}
                  >
                    {d.letter}
                  </span>
                ))}
              </span>
            </div>
            <div className="border-t border-[#E5E7EB]">
              {AR_WEEKDAYS.map((day) => (
                <div key={day} className="flex h-14 items-center justify-between text-[13px] leading-none">
                  {day}
                  <span className="flex">
                    <SelectBox value="9:00 AM" className="w-[156px] rounded-r-none" />
                    <SelectBox value="5:00 PM" className="w-[156px] rounded-l-none border-l-0" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Profile manager: the activity feed of profile edits contacts made themselves,
// with the old value shown under each new one. Client names are fictional.
const PM_COLS = "grid grid-cols-[1.7fr_1.1fr_1.2fr_1.6fr_0.9fr] items-center gap-4";
const PM_ROWS: {
  initials: string;
  name: string;
  email: string;
  company: string;
  field: string;
  scope?: string;
  value: string;
  note: string;
  when: string;
  tint: string;
}[] = [
  { initials: "MV", name: "Marissa Vaughn", email: "marissa.vaughn@redwoodenergy.com", company: "Redwood Energy", field: "Billing email", scope: "Company field", value: "billing@redwoodenergy.com", note: "Changed from ap@redwoodenergy.com", when: "Nov 2, 2:20 PM", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
  { initials: "TR", name: "Thomas Ramirez", email: "thomas.ramirez@lumen.io", company: "Lumen Analytics", field: "Phone", value: "+14155550187", note: "Changed from +14155550142", when: "Nov 2, 1:08 PM", tint: "bg-[#FBF3E6] text-[#9A6A1E]" },
  { initials: "HB", name: "Hana Brooks", email: "hana.brooks@halewood.com", company: "Halewood Partners", field: "Membership tier", value: "Premium", note: "Option added", when: "Nov 2, 11:32 AM", tint: "bg-[#F3ECF8] text-[#7A3E9D]" },
  { initials: "JD", name: "Jordan Delaney", email: "jordan.delaney@fairmont.co", company: "Fairmont Group", field: "Job title", value: "Director of Operations", note: "Changed from Operations Manager", when: "Nov 2, 9:14 AM", tint: "bg-[#E6F3FA] text-[#2C6E91]" },
  { initials: "DO", name: "Daniel Okafor", email: "daniel.okafor@northwind.com", company: "Northwind Logistics", field: "Office address", scope: "Company field", value: "200 Pier 4 Blvd, Boston, MA", note: "Added", when: "Nov 1, 7:44 PM", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "SW", name: "Sean Whitfield", email: "sean.whitfield@whitfield.com", company: "Whitfield Partners", field: "Company website", scope: "Company field", value: "https://www.whitfieldpartners.com", note: "Changed from whitfieldpartners.com", when: "Nov 1, 12:44 PM", tint: "bg-[#FBF3E6] text-[#9A6A1E]" },
  { initials: "FL", name: "Freya Larsen", email: "freya.larsen@nimbusworks.io", company: "Nimbus Works", field: "Email", value: "freya.larsen@nimbusworks.io", note: "Changed from f.larsen@nimbusworks.io", when: "Nov 1, 7:44 AM", tint: "bg-[#E8F4F0] text-[#2F7A64]" },
  { initials: "MP", name: "Mila Petrov", email: "mila.petrov@larkspur.design", company: "Larkspur Design", field: "Membership tier", value: "Standard", note: "Option added", when: "Oct 31, 4:44 PM", tint: "bg-[#ECEEF9] text-[#4B55A8]" },
];

// Plain stroke glyphs per field kind, so the Field column keeps its icons.
const PM_FIELD_ICON: Record<string, string> = {
  "Billing email": "M4 6h16v12H4zM4 7l8 6 8-6",
  Email: "M4 6h16v12H4zM4 7l8 6 8-6",
  Phone: "M6 4h4l1.5 4-2 1.5a10 10 0 0 0 5 5l1.5-2 4 1.5v4a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 2-2Z",
  "Membership tier": "M4 4h8l8 8-8 8-8-8zM8.5 8.5h.01",
  "Job title": "M5 5h14M12 5v14M9 19h6",
  "Office address": "M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10ZM12 11h.01",
  "Company website": "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
};

export function CardProfileManager() {
  return (
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={TOP_BAR}>
          <SidebarIcon />
          <span>Profile Manager</span>
          <Chevron className="size-4 text-[#6B7280]" />
        </div>
        <div className="px-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[24px] leading-none tracking-tight">Recent activity</div>
              <div className="mt-3 text-[14px] leading-none text-[#6B7280]">
                Allow contacts to update their profiles and track their changes here.
              </div>
            </div>
            <span className={`flex h-10 items-center gap-2.5 rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none`}>
              <svg viewBox="0 0 24 24" className="size-4 text-[#4B5563]" {...APP_ICON} aria-hidden>
                <path d="M4 7h16M7 12h10M10 17h4" />
              </svg>
              Manage profile fields
              <span className="rounded bg-[#F1F2F4] px-2 py-1 text-[12px] text-[#6B7280]">8 editable</span>
            </span>
          </div>
          <div className="mt-5 flex gap-3">
            <div className={`flex h-11 flex-1 items-center gap-2.5 rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none text-[#9CA3AF]`}>
              <svg viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
                <circle cx="11" cy="11" r="6.5" />
                <path d="m20 20-4.2-4.2" />
              </svg>
              Search contacts or companies
            </div>
            <span className={`flex h-11 items-center gap-2 rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none`}>
              Field <Chevron className="size-3.5 text-[#374151]" />
            </span>
            <span className={`flex h-11 items-center gap-2 rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none`}>
              Last 30 days
            </span>
          </div>
          <div className={`mt-5 overflow-hidden rounded-xl border ${APP_LINE}`}>
            <div className={`${PM_COLS} h-12 px-4 text-[13px] leading-none text-[#4B5563]`}>
              <span>Contact</span>
              <span>Company</span>
              <span>Field</span>
              <span>Change</span>
              <span className="text-right">Updated</span>
            </div>
            {PM_ROWS.map((r) => (
              <div key={r.email} className={`${PM_COLS} h-[68px] border-t border-[#E5E7EB] px-4 leading-none`}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] leading-none ${r.tint}`}>
                    {r.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">{r.name}</span>
                    <span className="mt-1.5 block truncate text-[13px] text-[#6B7280]">{r.email}</span>
                  </span>
                </span>
                <span className="truncate text-[14px]">{r.company}</span>
                <span className="flex items-center gap-2.5">
                  <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-[#6B7280]" {...APP_ICON} aria-hidden>
                    <path d={PM_FIELD_ICON[r.field]} />
                  </svg>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">{r.field}</span>
                    {r.scope && <span className="mt-1.5 block text-[12px] text-[#6B7280]">{r.scope}</span>}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px]">{r.value}</span>
                  <span className="mt-1.5 block truncate text-[13px] text-[#6B7280]">{r.note}</span>
                </span>
                <span className="text-right text-[13px] text-[#4B5563]">{r.when}</span>
              </div>
            ))}
          </div>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// Exporter: the preference form and the run button. The page is short, so the
// cover shows all of it.
const EXPORT_FIELDS = [
  { label: "Export format", value: "PDF" },
  { label: "Channels", value: "All" },
  { label: "Sender user type", value: "Client" },
  { label: "Sort order", value: "Recent" },
  { label: "Date", value: "Last 7 days" },
];

export function CardExport() {
  return (
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={TOP_BAR}>
          <span>Exporter</span>
        </div>
        <div className="w-[760px] px-12 pt-14">
          <div className="text-[20px] leading-none">Message exporter configuration</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">Set up export preferences</div>
          <div className={`mt-6 space-y-5 rounded-xl border ${APP_LINE} p-5`}>
            {EXPORT_FIELDS.map((f) => (
              <div key={f.label}>
                <div className="text-[13px] leading-none">{f.label}</div>
                <SelectBox value={f.value} className="mt-3" />
              </div>
            ))}
          </div>
          <div className="mt-8 text-[20px] leading-none">Export</div>
          <div className="mt-2.5 text-[14px] leading-none text-[#6B7280]">
            Run the export based on the preferences above
          </div>
          <span className="mt-5 flex h-9 w-fit items-center rounded-lg bg-[#1F2329] px-3.5 text-[14px] leading-none text-[#FFFFFF]">
            Export messages
          </span>
        </div>
      </DesktopMock>
    </GlassCover>
  );
}

// QuickBooks and Xero: the product-mapping settings, which pair each Assembly
// product with an item in the accounting tool. Same screen, so one shared body.
const MAPPING_ROWS: { product: string; price: string; item: string | null }[] = [
  { product: "Logo Design", price: "$1,500", item: "Logo Design" },
  { product: "Logo Design", price: "$4,999.99 / yearly", item: null },
  { product: "Marketing Overhaul", price: "$18,000", item: "Marketing overhaul" },
  { product: "Marketing Overhaul", price: "$2,000 / monthly", item: null },
  { product: "Web page", price: "$2,000 / yearly", item: null },
  { product: "Web page", price: "$3,000 / biannually", item: null },
  { product: "Web page", price: "$5,000 / quarterly", item: "Web page" },
];
const MAPPING_COLS = "grid grid-cols-[1fr_56px_1fr]";

function CheckRow({ checked, title, note }: { checked: boolean; title: string; note: string }) {
  return (
    <div className="flex gap-3">
      <span
        className={`mt-px flex size-4 shrink-0 items-center justify-center rounded border ${checked ? "border-[#111827] bg-[#111827] text-[#FFFFFF]" : "border-[#D1D5DB]"}`}
      >
        {checked && (
          <svg viewBox="0 0 24 24" className="size-3" {...APP_ICON} strokeWidth={3} aria-hidden>
            <path d="m5 12 5 5 9-10" />
          </svg>
        )}
      </span>
      <div>
        <div className="text-[14px] leading-none">{title}</div>
        <div className="mt-2 text-[12px] leading-none text-[#6B7280]">{note}</div>
      </div>
    </div>
  );
}

function ProductMapping({ tool }: { tool: string }) {
  return (
    <div className="w-[860px] px-12 pt-12">
      <div className="text-[20px] leading-none">Settings</div>
      <div className="mt-8 flex items-center gap-2 text-[16px] leading-none">
        Product Mapping <Chevron className="size-4 text-[#111827]" />
      </div>
      <div className="mt-6 space-y-5">
        <CheckRow
          checked={false}
          title={`Add newly created products to ${tool}`}
          note={`Automatically create matching items in ${tool} with product name, description, and price when new products are created in Assembly.`}
        />
        <CheckRow
          checked
          title={`Create an item in ${tool} if Assembly product is not found`}
          note={`Create missing ${tool} items when syncing invoices containing Assembly products that don't yet exist in ${tool}.`}
        />
      </div>
      <div className={`mt-6 overflow-hidden rounded-xl border ${APP_LINE}`}>
        <div className={`${MAPPING_COLS} h-11 items-center text-[12px] leading-none text-[#4B5563]`}>
          <span className="px-4">Assembly products</span>
          <span className="flex justify-center text-[#374151]">
            <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </span>
          <span className="px-4">{tool} items</span>
        </div>
        {MAPPING_ROWS.map((r, i) => (
          <div key={i} className={`${MAPPING_COLS} h-[58px] border-t border-[#E5E7EB]`}>
            <span className="flex flex-col justify-center px-4 leading-none">
              <span className="text-[14px]">{r.product}</span>
              <span className="mt-2 text-[12px] text-[#6B7280]">{r.price}</span>
            </span>
            <span className="flex items-center justify-center text-[#374151]">
              <svg viewBox="0 0 24 24" className="size-4" {...APP_ICON} aria-hidden>
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </span>
            <span className="flex items-center justify-between border-l border-[#E5E7EB] bg-[#F7F8FA] px-4 text-[14px] leading-none">
              {r.item ?? <span className="text-[#9CA3AF]">Not mapped</span>}
              <Chevron />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardQuickBooks() {
  return (
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={TOP_BAR}>
          <span>QuickBooks</span>
        </div>
        <ProductMapping tool="QuickBooks" />
      </DesktopMock>
    </GlassCover>
  );
}

export function CardXero() {
  return (
    <GlassCover
      photo="bg-[#101010] [[data-theme=dark]_&]:bg-[#F7F7F4]"
      focus="bg-center"
      dim=""
      inset=""
      panel={false}
    >
      <DesktopMock>
        <div className={TOP_BAR}>
          <span>Xero</span>
        </div>
        <ProductMapping tool="Xero" />
      </DesktopMock>
    </GlassCover>
  );
}
