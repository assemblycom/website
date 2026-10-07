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
            // because it is not doing the work alone — the filled disc in the
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

                  Picked used to be a translucent black disc with a white tick,
                  which is the same object as the unpicked one with something
                  added — on artwork, at eleven pixels, that read as "there is a
                  mark here" rather than as "this one is chosen". It is now a
                  SOLID disc, and the two states differ in fill rather than in
                  contents: a filled ink disc against an empty ring, which is
                  the one pair the eye resolves at this size without looking.

                  White fill rather than ink. These plates are photographs with
                  dark hair and black knitwear in the corner the mark sits in,
                  and an ink disc disappeared into them; white holds on every
                  frame the round might carry. The ring keeps its backdrop blur
                  so the empty state survives a bright crop too. */}
              <span
                className={`absolute left-1.5 top-1.5 flex size-[11px] items-center justify-center rounded-full border transition-[background-color,border-color,opacity] ${
                  on
                    ? "border-white bg-white text-[color:var(--mock-ink)]"
                    : "border-white/70 bg-black/25 backdrop-blur-[2px] group-hover/plate:border-white group-hover/plate:bg-black/40"
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
                    chosen state fades rather than pops. */}
                <IconCheck
                  className={`size-[7px] transition-opacity ${
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
