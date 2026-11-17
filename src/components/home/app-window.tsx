"use client";

// Shared pieces of the app-screen template covers: the cover face a window sits
// on, and the desktop window itself, cropped off the card's edge.
// Each cover draws its own app inside one of these.
// Shared by the app-screen covers: the app is drawn at a real screen width
// inside a device frame and scaled down, so it keeps its own proportions
// instead of being redrawn at cover size.
export const APP_ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Literal hex throughout the app screens: the dark mock skin remaps Tailwind's
// white and black, which turned the screens into dark slabs.
export const APP_LINE = "border-[#E2E4E8]";

export const APP_BOX = `flex shrink-0 items-center justify-center rounded-lg border ${APP_LINE} text-[#6B7280]`;

export function AppSearch({ placeholder }: { placeholder: string }) {
  return (
    <div className={`flex h-11 items-center gap-2.5 rounded-lg border ${APP_LINE} px-3.5 text-[14px] leading-none text-[#9CA3AF]`}>
      <svg viewBox="0 0 24 24" className="size-[18px]" {...APP_ICON} aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" />
      </svg>
      {placeholder}
    </div>
  );
}

// The glass these covers' panels are cut from: a light frost blurred and
// desaturated so the photograph behind it is a tone rather than a scene. The
// pane stays light — it is the picture that goes down in value under it (see
// GlassCover), which is what lets white type sit on a frost this pale without
// the panel itself turning into a dark slab.
export const COVER_GLASS =
  "mock-lit-edge bg-[rgba(214,214,214,0.42)] [backdrop-filter:blur(20px)_saturate(0.6)] [-webkit-backdrop-filter:blur(20px)_saturate(0.6)] [--lit-angle:145deg] [--lit-mid:38%] [--lit-fade:78%] [--mock-edge-lit:rgba(255,255,255,0.85)] [--mock-line:rgba(255,255,255,0.28)]";

// A cover drawn as a frosted panel floating on a photograph — the treatment the
// brand's product shots use. `photo` and `focus` are written as literal Tailwind
// classes at each call site rather than built here, because the scanner only
// generates the classes it can see in the source.
export function GlassCover({
  photo,
  focus,
  panel = "flex-col",
  // How far the panel is held off the card's edges. A record row needs more
  // width for its second line than the tracker's chart does, so it is a knob.
  inset = "px-7 py-4 max-sm:[.template-mock-gallery_&]:px-14 max-sm:[.template-mock-gallery_&]:py-6",
  dim = "brightness-[0.78] [[data-theme=dark]_&]:brightness-[0.55]",
  children,
}: {
  photo: string;
  focus: string;
  dim?: string;
  panel?: string | false;
  inset?: string;
  children?: React.ReactNode;
}) {
  return (
    // The gallery's phone card is near full-bleed, so the default inset holds
    // the panel in further there — at the desktop figure it ran the width of
    // the screen.
    <div
      className={`v69-bleed relative flex h-full flex-col justify-center overflow-hidden rounded-[14px] [.template-mock-gallery_&]:rounded-none ${inset}`}
    >
      {/* The face is its own layer so its dimming lands on it alone — as a
          filter on the card it took the panel and its text down with it. It is
          held below full brightness in BOTH skins: white type on a pale frost
          needs what is under the frost to be darker than the type, and that
          darkening is what the panel itself must not do. Neither a photograph
          nor this artwork inverts, so dark only goes a step further down. */}
      <span
        className={`absolute inset-0 bg-cover ${photo} ${focus} ${dim}`}
        aria-hidden
      />
      {panel === false || !children ? (
        children
      ) : (
        <div
          className={`relative flex rounded-[10px] p-3 ${COVER_GLASS} ${panel}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// A desktop app window that starts inside the card and runs off its right and
// bottom edges: enough of the app to recognise, cropped the way a screenshot
// held close to the viewer is. Drawn at a real desktop width and scaled down,
// for the same reason the phone is.
export const DESKTOP_APP_W = 1180;

export const DESKTOP_SCALE = 0.4;

export const DESKTOP_BAR = (
  // The window's own bar: three dots and nothing else, so it reads as an app
  // on a desktop without naming a browser.
  <div className="flex h-9 items-center gap-2 border-b border-[#EEF0F2] bg-[#F7F8FA] px-4">
    {[0, 1, 2].map((i) => (
      <span key={i} className="size-3 rounded-full bg-[#DADDE2]" />
    ))}
  </div>
);

// The window's white stops inside its edge (bg-clip-padding), so the edge reads
// as a faint dark line on the cover rather than a white rim around the app.
// The window's edge is drawn on its top and left only: its right and bottom
// run off the card, where a full ring showed as a second line inside the
// card's own border at the bottom-right corner.
export function DesktopMock({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute left-[9%] top-[13%] overflow-hidden rounded-tl-[6px] border-l border-t border-[rgba(0,0,0,0.08)] bg-[#FFFFFF] bg-clip-padding"
      style={{ width: DESKTOP_APP_W * DESKTOP_SCALE, height: 760 * DESKTOP_SCALE }}
    >
      <div
        className="text-[#1F2937]"
        // zoom, not a transform: the app is laid out at its final size, so the
        // type is rendered there and stays sharp instead of being drawn large
        // and shrunk.
        style={{ width: DESKTOP_APP_W, zoom: DESKTOP_SCALE }}
      >
        {DESKTOP_BAR}
        {children}
      </div>
    </div>
  );
}
