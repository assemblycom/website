import { IconBrandMark, IconSearch } from "@/components/home/mock-icons";
import {
  MOCK_MICRO,
  MOCK_PRIMARY,
  MOCK_SECONDARY,
  MOCK_TITLE,
} from "@/components/ui/mock-type";
import { SplitHeroPanel } from "@/components/comparison/split-hero-panel";

/**
 * Base44's hero, from its brief: the first screen a client sees. The firm's
 * own sign-in, on its own domain with its own mark and no platform badge,
 * against a generic hosted-app login. The generic side carries a neutral
 * placeholder mark, never Base44's.
 */
// Copy review: both switch labels, both domains and the sign-in copy are
// mine, not the brief's.
export function BrandedLoginHeroVisual() {
  return (
    <SplitHeroPanel
      label="Which sign-in"
      views={[
        {
          label: "Your portal",
          content: (
            <LoginScreen
              domain="portal.brandmages.com"
              mark={
                <span className="flex size-11 items-center justify-center rounded-xl bg-foreground text-background">
                  <IconBrandMark className="size-5" />
                </span>
              }
              title="Sign in to Brandmages"
            />
          ),
        },
        {
          label: "Hosted app",
          content: (
            <LoginScreen
              domain="your-app.hosted-platform.app"
              mark={
                <span className="size-11 rounded-xl bg-muted [[data-theme=dark]_&]:bg-white/[0.08]" />
              }
              title="Sign in"
              badge
            />
          ),
        },
      ]}
    />
  );
}

/**
 * The firm's own side of that pair, on its own: their mark, their domain, no
 * platform badge. /ai-app-builder's security pillar shows this as the first
 * thing a client meets — the claim there is "secure logins come built in", and
 * the sign-in is what that looks like.
 *
 * Framed, because here the screen has to carry its own surface. In the split
 * panel above it sits on that panel's white ground; dropped straight onto a
 * pillar card it was painting a --muted address bar onto the card's --surface,
 * two greys a hair apart, so the dots and the domain all but disappeared and
 * the screen had no edge at all. The frame is the mock family's own window —
 * the same one branded-portal-visual draws — so this card reads as a window
 * onto a screen like the other three.
 */
export function BrandedLoginScreen() {
  return (
    <LoginScreen
      framed
      // No browser bar. The frame still gives the screen its own surface and
      // its edge; what goes is the band of grey with three dots in it, which
      // on a card this short was the first thing above the sign-in and said
      // nothing the card's heading does not.
      chrome={false}
      // The pillar card ramps this screen's foot in dark, and the Magic-link
      // button is what sits under the ramp.
      quietFoot
      domain="portal.brandmages.com"
      mark={
        // The firm's mark: --mock-brand's dark slab with a white glyph in
        // light, and the other way round in dark.
        //
        // It used to be the dark slab in BOTH themes, on the reasoning that it
        // is the client's colour and not ours. That holds while the ground
        // behind it is white; in dark the slab sits on a near-black card and
        // the firm's mark — the branded half of the whole claim — was a dark
        // square on a dark screen. A one-colour mark inverts on a dark ground,
        // which is what every logo does and what the CRM's Symphony tile a
        // card away already does.
        //
        // size-9, down from 11. With the browser bar gone the mark became the
        // first thing on the screen, and at 44px it was the largest object in
        // a shot whose subject is the form under it.
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-[var(--mock-brand)] text-white [[data-theme=dark]_&]:bg-[#f2f2f2] [[data-theme=dark]_&]:text-[#111111]">
          <IconBrandMark className="size-4" />
        </span>
      }
      title="Sign in to Brandmages"
    />
  );
}

function LoginScreen({
  domain,
  mark,
  title,
  badge = false,
  framed = false,
  chrome = true,
  quietFoot = false,
}: {
  domain: string;
  mark: React.ReactNode;
  title: string;
  /** The hosting platform's badge, which the firm's own portal never shows. */
  badge?: boolean;
  /**
   * Draws the screen's own window — surface, hairline, radius — for a frame
   * that does not supply one. Off by default: inside SplitHeroPanel the panel
   * IS the window, and a second one inside it would be a frame in a frame.
   * On, the chrome reads the mock family's tokens rather than --muted, so the
   * address bar steps off the window in both themes (down in light, up in
   * dark) instead of matching whatever ground it happens to land on.
   */
  framed?: boolean;
  /**
   * Drops the Magic-link button's label, for a frame that cuts or dissolves
   * this screen's foot into its card (see `fadeFoot` on the pillar and
   * --mock-foot-fade). Off by default — the split hero shows the whole screen
   * with nothing fading, and there the label is the button.
   */
  quietFoot?: boolean;
  /**
   * Draws the browser bar — traffic lights and the address — above the screen.
   *
   * On it says WHOSE domain the client lands on, which is the whole point in a
   * comparison hero where the competing product's URL is the argument. On a
   * pillar card about secure logins it is a grey band with three dots in it
   * sitting above the thing the card is actually about, and the first ~40px of
   * a short card go to chrome.
   */
  chrome?: boolean;
}) {
  // One palette, picked once. Every surface below reads from it, so the two
  // contexts this screen renders in differ in exactly one place rather than in
  // a ternary on every element.
  const c = framed
    ? {
        ink: "text-[color:var(--mock-ink)]",
        inkSoft: "text-[color:var(--mock-ink-soft)]",
        // A FIELD'S LABEL SITS BELOW READING INK IN DARK.
        //
        // "Email" and "Password" took full --mock-ink, which in light is
        // #101114 on a near-white field — a dark label, quiet because the
        // ground is bright. Flipped, the same token is near-white on a
        // near-black screen, and two 10px labels at full strength were the
        // brightest marks under the title, brighter than the placeholder text
        // they introduce. A label naming a field should sit under the field.
        //
        // --mock-ink-soft, the token the placeholders already use, so this is
        // a tone the screen has rather than a new one. Dark only: light is
        // doing the right thing and the user asked for it not to move.
        labelInk:
          "text-[color:var(--mock-ink)] [[data-theme=dark]_&]:text-[color:var(--mock-ink-soft)]",
        rule: "bg-[var(--mock-line)]",
        field:
          "border-[var(--mock-line)] bg-[var(--mock-well)] text-[color:var(--mock-ink-soft)]",
        // THE MAGIC-LINK BUTTON WEARS THE GOOGLE ROW'S SURFACE, in both
        // themes now.
        //
        // Dark took it first, and for a reason that turned out to hold in
        // light too: --mock-ink flipped is a near-WHITE slab on a near-black
        // card, the brightest object in the shot. In light it is the mirror of
        // that — a near-black slab on a white screen, and now on a card with a
        // brand wash behind it, the one piece of solid black in the picture.
        // The shot's subject is the sign-in as a whole, not one of its two
        // buttons, and the screen offers Google OR a magic link as equals; a
        // filled primary said one of them was the way in.
        //
        // The same tokens the Google row uses (see `field`), with full ink on
        // the label rather than soft, because this one is a button and not a
        // field.
        primary:
          "border border-[var(--mock-line)] bg-[var(--mock-well)] text-[color:var(--mock-ink)]",
      }
    : {
        ink: "text-foreground",
        inkSoft: "text-muted-foreground",
        // See the framed palette: the label sits under its field in dark.
        labelInk:
          "text-foreground [[data-theme=dark]_&]:text-muted-foreground",
        rule: "bg-border [[data-theme=dark]_&]:bg-white/15",
        field:
          "border-border text-muted-foreground [[data-theme=dark]_&]:border-white/15",
        primary: "bg-foreground text-background",
      };

  return (
    <div
      aria-hidden
      className={`flex h-full select-none flex-col ${
        framed
          ? // Open at the foot, like the branded-portal shot beside it: the
            // screen runs off the bottom of its card, so there is no corner to
            // round and no edge to close down there — hence border-b-0.
            //
            // .mock-edge, not .mock-lit-edge. The two are both dark-only
            // treatments of the same hairline and they differ in where the
            // light comes from: .mock-lit-edge runs a LINEAR ramp down from
            // the top, which suits a shot that is cropped on its right as well
            // as its foot, and .mock-edge is the RADIAL one the client-portal
            // hero's frame wears — a light at the top-left corner falling off
            // across the whole bezel, with a counter-light at the opposite
            // corner so the far side still has falloff in it.
            //
            // This frame is the radial case. It is contained across the card's
            // full width with both top corners closed, so a one-axis ramp lit
            // its two ends identically and the edge read as a dimmed line
            // rather than as an object catching light. Reused rather than
            // re-tuned, so this frame and the portal hero's are one decision.
            //
            // The border has to be REAL here: .mock-edge paints into the
            // border box and clips the ramp to it, where .mock-lit-edge drew
            // its own 1px ring and needed none. Light is untouched either way
            // — the rule is scoped to [data-theme="dark"], so there this is
            // the plain --mock-line hairline it has always been.
            "mock-edge overflow-hidden rounded-t-xl border border-b-0 border-[var(--mock-line)] bg-[var(--mock-window)]"
          : ""
      }`}
    >
      {/* The address bar, where there is one. On the pillar card there is
          not: see `chrome`. */}
      {!chrome ? null : framed ? (
        <SafariChrome domain={domain} />
      ) : (
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 [[data-theme=dark]_&]:border-white/10">
          <span className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-2 rounded-full bg-muted [[data-theme=dark]_&]:bg-white/15"
              />
            ))}
          </span>
          <span
            className={`flex-1 truncate rounded-full bg-muted px-3 py-1 text-center text-muted-foreground [[data-theme=dark]_&]:bg-white/[0.08] ${MOCK_SECONDARY}`}
          >
            {domain}
          </span>
        </div>
      )}
      {/* Capped. The column is the width of a sign-in form, not of whatever
          frame it is dropped into — on a wide card the email field and the
          button stretched to 700px and stopped reading as a form. */}
      {/* Anchored to the top, not centred. The form is now the real screen's
          full height, and a centred column in a frame shorter than itself
          crops BOTH ends — losing the mark, which is the branded half of the
          claim. Top-anchored, the crop only ever takes the footer link, which
          is the one line nothing here depends on. */}
      {/* 320 against px-5, where it was 300 against px-7: the column is a
          touch wider and spends less of itself on its own gutter, so the
          button and the two fields gain ~36px between them. The cap still
          governs — a sign-in form has a width of its own and stops reading as
          one when it stretches to whatever frame it was dropped into. */}
      <div className="mx-auto flex w-full max-w-[320px] flex-1 flex-col items-center px-5 pt-8">
        {mark}
        {/* MOCK_TITLE, down from 17px. The 17 came from the ratio the real
            sign-in gives its heading; copied into a mock drawn at about half
            product scale it was the largest object on the card by a wide
            margin — a marketing headline that had wandered into a
            screenshot, and well clear of the heading in the shot beside it. */}
        <p className={`mt-4 ${MOCK_TITLE} ${c.ink}`}>{title}</p>

        {/* Google first, then the divider, then the email form: the real
            screen's order. The SSO row is what makes this read as a product
            sign-in rather than as a generic email box with a button. */}
        {/* h-[30px], the same height the two fields and the Magic-link button
            take. The four controls are one stack down the middle of a 280px
            column, so any disagreement between them reads as a mistake rather
            than as a hierarchy — and it WAS a disagreement: this row and the
            button were sized by their 12px type plus padding (~29px) while the
            fields were a hardcoded 26, so the form had two heights in it for
            no reason either one could name. Set explicitly on all three rather
            than left to line-height, which is what let them drift apart. */}
        {/* THE HOVER IS ON THIS ROW ONLY, not in `c.field`. That palette
            entry is shared with the Email and Password inputs, and a text
            field that lights up under the pointer is saying it can be pressed.
            This one is the button.
            --mock-well-2 is the step the mock rows elsewhere in the set use to
            answer the cursor (ROW_HOVER) — one rung off --mock-well in both
            themes, darker in light and lighter in dark, so it is a tone the
            screen already owns rather than a new one. */}
        <div
          className={`mt-5 flex h-[30px] w-full items-center justify-center gap-1.5 rounded-[4px] border transition-colors hover:bg-[var(--mock-well-2)] ${MOCK_PRIMARY} ${c.field}`}
        >
          <IconGoogleG />
          <span className={c.ink}>Continue with Google</span>
        </div>

        <div className="mt-3 flex w-full items-center gap-2">
          <span className={`h-px flex-1 ${c.rule}`} />
          <span className={`tracking-wide ${MOCK_MICRO} ${c.inkSoft}`}>OR</span>
          <span className={`h-px flex-1 ${c.rule}`} />
        </div>

        {/* A SAMPLE ADDRESS, not an empty box. The field rendered blank, which
            in a still picture of a form is not "waiting for input" — there is
            no caret and nothing is going to happen — it is just a grey
            rectangle, and next to the Password field, which does carry a word,
            it read as the one control that failed to draw. A filled address
            also says who is signing in: a client of the firm, at their own
            address, which is the claim the card is making. */}
        <Field label="Email" placeholder="margot@brandmages.com" c={c} />
        {/* "Optional" because a password is: the real screen takes either a
            password or a magic link, and the optional field is the visible
            half of that. No reveal control — at 11px it was a grey smudge in
            the corner of the field rather than a readable glyph. */}
        <Field label="Password" placeholder="Optional" c={c} />

        <div
          className={`mt-4 flex h-[30px] w-full items-center justify-center rounded-[4px] ${MOCK_PRIMARY} ${c.primary}`}
        >
          {/* THE LABEL GOES IN BOTH THEMES when the frame fades this screen's
              foot. The button is the last object before the card's bottom
              edge, so it is the one thing the card's edge runs through — and a
              half-read word there is not a screen giving out, it is a word
              that failed to render. The slab itself fades cleanly, because a
              flat surface has nothing to half-read. `invisible`, not removed,
              so the button keeps its height and the stack above it does not
              move.

              This was dark-only, on the grounds that light has no ramp (see
              --mock-foot-fade) so the label is fully legible there. It is
              legible, but it is also the one word on the card sitting half
              under the bottom edge, which reads as the card clipping its own
              copy rather than as a screen carrying on past the frame. The slab
              alone says "button" without needing to be read. */}
          <span className={quietFoot ? "invisible" : ""}>
            Email me a Magic link
          </span>
        </div>

        {/* No "Don't have an account? Create account" line. At 10px it was a
            grey smear under the button, and sign-UP is not what this shot is
            claiming — the claim is that the client's first screen is the
            firm's own. */}
      </div>
      {badge && (
        <div className="flex justify-center pb-5">
          <span
            className={`flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted-foreground [[data-theme=dark]_&]:border-white/15 ${MOCK_SECONDARY}`}
          >
            <span className="size-2.5 rounded-sm bg-muted-foreground/40" />
            Built with a hosted platform
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Safari's toolbar, at mock scale: the window buttons in their own colours, the
 * navigation glyphs, and the address field as a CENTRED, capped rounded rect
 * rather than a pill stretched across the whole width.
 *
 * The centred cap is the part that does the work. A full-width pill is what a
 * generic "browser-ish" illustration draws, and it reads as a form field; Safari
 * floats a short field in the middle of the bar with the chrome either side of
 * it, which is what makes the shot read as a real browser — and the browser is
 * the claim here, since the point is whose domain the client lands on.
 *
 * The toolbar sits on --mock-well so it steps off the window below it in both
 * themes (down in light, up in dark), the way the real one is tinted off the
 * page. Secondary glyphs drop out under sm: the card is ~300px wide on a phone
 * and eight icons there is a grey smear, while the lights, the field and the
 * domain still read.
 */
function SafariChrome({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--mock-line)] bg-[var(--mock-well)] px-2.5 py-2">
      {/* The window buttons, in the system's colours — the one hue in this
          family, and the single fastest tell that this is a browser. */}
      <span className="flex shrink-0 gap-[5px]">
        <span className="size-[7px] rounded-full bg-[var(--mock-traffic-red)]" />
        <span className="size-[7px] rounded-full bg-[var(--mock-traffic-amber)]" />
        <span className="size-[7px] rounded-full bg-[var(--mock-traffic-green)]" />
      </span>

      {/* Centred and capped, not stretched. The sidebar, back/forward, share,
          new-tab and tab-overview glyphs are deliberately NOT drawn: at this
          size they are illegible grey ticks, and none of them is the point —
          the lights say "browser" and the field says whose domain it is, which
          is the whole claim. */}
      <span className="mx-auto flex w-full max-w-[200px] items-center justify-center gap-1 rounded-md border border-[var(--mock-line)] bg-[var(--mock-window)] px-2 py-[3px]">
        <IconSearch className="size-[8px] shrink-0 text-[color:var(--mock-ink-soft)]" />
        <span
          className={`truncate text-[color:var(--mock-ink-soft)] ${MOCK_SECONDARY}`}
        >
          {domain}
        </span>
      </span>

      {/* Balances the window buttons so the field is centred on the BAR rather
          than on the space left over beside them. Same width as the lights:
          three 7px dots and two 5px gaps. */}
      <span aria-hidden className="w-[31px] shrink-0" />
    </div>
  );
}

type LoginPalette = {
  ink: string;
  inkSoft: string;
  /** A field's label. Full ink in light, a step down in dark — see the palette. */
  labelInk: string;
  rule: string;
  field: string;
  primary: string;
};

/** A labelled input, the way the real sign-in stacks them. */
function Field({
  label,
  placeholder,
  c,
}: {
  label: string;
  placeholder?: string;
  c: LoginPalette;
}) {
  return (
    <div className="mt-3 w-full">
      <span className={`block ${MOCK_SECONDARY} ${c.labelInk}`}>{label}</span>
      <div
        className={`mt-1 flex h-[30px] w-full items-center rounded-[4px] border px-2.5 ${MOCK_PRIMARY} ${c.field}`}
      >
        <span className="truncate">{placeholder ?? ""}</span>
      </div>
    </div>
  );
}

/* Google's mark, in Google's colours. Hardcoded like the window buttons above
   and for the same reason: it is somebody else's brand asset, identical in a
   light window and a dark one, so it is not a themed value to tokenise. */
function IconGoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-[11px] shrink-0" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
