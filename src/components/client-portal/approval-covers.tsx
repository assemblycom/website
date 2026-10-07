"use client";

// ─────────────────────────────────────────────────────────────────────────
// APPROVAL COVERS — the two plates inside the Approvals mock, and the one
// part of that screen you can actually work.
//
// Its own file, and the only client component in the mock set. The screens in
// segment-mock.tsx are stills rendered on the server; making that whole file
// client so one pair of plates could hold state would have handed every other
// mock a bundle it has no use for.
//
// WHY it is interactive at all: this screen's claim is that the client picks
// the design they are happy with. A still can assert that — one plate ticked,
// one not — but a reader has to take it on trust. Two plates you can actually
// switch between demonstrate it in the second it takes to click the other one,
// which is the difference between a picture of an approval and an approval.
//
// ONE at a time. It allowed several at first, which made the control a set of
// checkboxes — a fine mechanic, but a different one: "which of these are
// acceptable" rather than "which one are we running". A round that ends with
// both covers approved has not decided anything, and deciding is what the
// screen is for.
// ─────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Image from "next/image";
import { IconChat, IconCheck } from "@/components/home/mock-icons";

const LINE = "border-[var(--mock-line)]";

// The unpicked mark's outline, DIMMED FOR DARK ONLY.
//
// The mark sits on a photograph, so its own ground is the same in both themes
// and the light values are correct as they are — left untouched here. What
// differs is everything AROUND it: in light the plate sits in a white window,
// where a white-70 ring reads as a quiet outline against a bright page; in
// dark the window is near-black, so the same ring was the brightest mark on
// the screen, and the full-white hover brighter still. It pulled the eye to an
// empty checkbox on a screen whose subject is the artwork.
//
// 30/45 rather than 70/100. 55/75 was tried in between and was still the
// brightest mark on the card — against #2e2e2e a half-opaque white hairline
// is roughly the contrast a full-white one has against a light page, so the
// light values cannot simply be carried over at a small discount. 30 sits the
// empty mark just above the photograph's own noise, which is all an unchosen
// plate has to do.
//
// The 15-point rest→hover step is kept deliberately: it is the same *ratio* of
// change as light's 70→100, so the plate answers the cursor just as clearly,
// only an octave down. The fill is already black here and gets no darker, so
// the whole step has to live in the border.
const DARK_RING =
  "[[data-theme=dark]_&]:border-white/30 group-hover/plate:[[data-theme=dark]_&]:border-white/45";

// TWO, not three. Three meant a 2x2 grid with an orphan on the second row, and
// splitting the height across two rows left each plate a letterbox — the one
// shape a catalogue cover is never in. One row of two gives each plate the
// panel's whole height.
const COVERS = [
  { name: "Cover A", src: "/images/mocks/covers/cover-1.jpg", comments: 1 },
  { name: "Cover B", src: "/images/mocks/covers/cover-2.jpg" },
];

// One is always picked. Clicking the chosen plate does nothing rather than
// clearing it — with none picked the round is two identical frames, which is a
// gallery, and that is the state this screen exists to not be in.
const INITIAL = "Cover A";

export function ApprovalCovers() {
  const [picked, setPicked] = useState(INITIAL);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-2.5">
      {COVERS.map(({ name, src, comments }) => {
        const on = picked === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => setPicked(name)}
            // pointer-events-auto against the mock's own pointer-events-none,
            // and tabIndex -1 because the screen around it is aria-hidden: a
            // control inside hidden content must not be a tab stop, or the
            // keyboard lands somewhere a screen reader says does not exist.
            tabIndex={-1}
            // The picked frame is a DARKER GREY, not ink.
            //
            // At full --mock-ink it was near-black: a hard rule drawn around a
            // photograph, and the loudest mark on a screen whose entire subject
            // is the artwork inside the frames. --mock-ink-soft is one step
            // back and still unmistakable against a plate carrying nothing,
            // because it is not doing the work alone — the filled box in the
            // corner is what states the choice, and the frame only has to
            // agree with it.
            //
            // Dark keeps #6b6b6b and is NOT lightened to match. The two
            // themes run opposite directions here: light steps DOWN from white
            // toward the hairline, dark steps UP from #2e2e2e. #6b6b6b is
            // already the gentle end of that range.
            className={`group/plate pointer-events-auto flex min-h-0 cursor-pointer flex-col overflow-hidden rounded-[4px] border text-left transition-colors ${
              on
                ? "border-[#adb2bb] [[data-theme=dark]_&]:border-[#6b6b6b]"
                : `${LINE} hover:border-[var(--mock-ink-soft)]`
            }`}
          >
            {/* The art is 3:4 and the plate is nearly square, so object-cover
                crops the TOP AND BOTTOM. Positioned at 28% rather than centre:
                these are head-and-shoulders portraits with the face in the
                upper half, and a centred crop takes the forehead off and keeps
                the sweater.

                sizes 480 and quality 90, both deliberately generous. The plate
                is about 200px in the DESIGN space, but this mock is scaled into
                whatever width its card gets and then rendered on retina, so a
                220px variant was being drawn well over its own size and came
                out soft. 90 overrides next/image's default 75 — on skin and
                hair, 75 is where JPEG starts showing in the gradients. */}
            <div className="relative min-h-0 flex-1 overflow-hidden bg-[var(--mock-well-2)]">
              <Image
                src={src}
                alt=""
                fill
                sizes="480px"
                quality={90}
                className="object-cover object-[50%_28%]"
              />
              {/* The select control.

                  Picked used to be a translucent black box with a white tick,
                  which is the same object as the unpicked one with something
                  added — on artwork, at eleven pixels, that read as "there is a
                  mark here" rather than as "this one is chosen". It is now a
                  SOLID box, and the two states differ in fill rather than in
                  contents: a filled ink box against an empty outline, which is
                  the one pair the eye resolves at this size without looking.

                  White fill rather than ink. These plates are photographs with
                  dark hair and black knitwear in the corner the mark sits in,
                  and an ink box disappeared into them; white holds on every
                  frame the round might carry. The outline keeps its backdrop
                  blur so the empty state survives a bright crop too.

                  BOTH COLOURS ARE PINNED, and that is the point. This mark is
                  the one surface in the mock set that does NOT sit on a themed
                  ground — it sits on a photograph, which looks the same in
                  light and dark — so it is a fixed white box with a fixed
                  #101114 tick in both themes. The tick used to read
                  var(--mock-ink), which is #101114 in light but #ededed in
                  dark: a near-white tick on a hardcoded white box, so dark mode
                  showed an empty square. Pinning the fill and leaving the mark
                  on a token is the mismatch; they have to move together or not
                  at all. #101114 is the light theme's own --mock-ink value, so
                  nothing new enters the palette.

                  SQUARE, not round. A disc at this size is the shape the eye
                  files under "status dot"; a square reads as a control you are
                  meant to work, which is the whole point of the one part of
                  this mock that is live. rounded-[2px] rather than a hard
                  corner — the plate it sits on is rounded-[4px], and a mark
                  with sharper corners than its own frame looks pasted on. */}
              <span
                className={`absolute left-1.5 top-1.5 flex size-[11px] items-center justify-center rounded-[2px] border transition-[background-color,border-color,opacity] ${
                  on
                    ? "border-white bg-white text-[#101114]"
                    : `border-white/70 bg-black/25 backdrop-blur-[2px] group-hover/plate:border-white group-hover/plate:bg-black/40 ${DARK_RING}`
                }`}
              >
                {/* The tick appears ONLY once the plate is chosen.
                
                    It used to fade in at 60% on hover, as a preview of what
                    clicking would do — but a half-drawn tick inside the ring
                    reads as a plate that is already partly selected, which is
                    the one thing this control must never be ambiguous about on
                    a screen whose job is approving a design. Hover says the
                    plate is live by firming the ring and the frame; the tick
                    stays the answer, not the offer.

                    Kept mounted at zero opacity rather than swapped in, so the
                    chosen state fades rather than pops.

                    STROKE WIDTH IS OVERRIDDEN, and it has to be. IconCheck is
                    drawn in a 16-unit viewBox at strokeWidth 1.25, which is
                    sized for the 14-16px icons everywhere else in the mocks. At
                    size-[7px] that scaled down to 1.25 x 7/16 = 0.55px — under
                    a device pixel, so the tick was antialiased to nothing and
                    the chosen plate showed an empty white box. 2.4 in the same
                    viewBox lands at ~1.2px drawn, which matches the weight of
                    the mock's other hairlines. CSS beats the presentation
                    attribute, so the class is enough and the shared icon stays
                    untouched for every other caller. */}
                <IconCheck
                  className={`size-[8px] [stroke-width:2.4] transition-opacity ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                />
              </span>
            </div>
            <div
              className={`flex items-center justify-between gap-1.5 border-t px-2 py-1.5 text-[9.5px] leading-none ${LINE} ${
                on
                  ? "text-[color:var(--mock-ink)]"
                  : "text-[color:var(--mock-ink-soft)]"
              }`}
            >
              <span className="truncate">{name}</span>
              {comments ? (
                <span className="flex shrink-0 items-center gap-0.5 text-[color:var(--mock-ink-soft)]">
                  <IconChat className="size-[9px]" />
                  {comments}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
