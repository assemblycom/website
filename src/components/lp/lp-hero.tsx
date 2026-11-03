"use client";

import { StudioNav } from "@/components/home/studio-nav";
import { HeroBig } from "@/components/home/hero-big";
import { useTheme } from "@/components/theme/theme-provider";

export interface LpHeroMessage {
  h1: string;
  /** Hand-set lockup, one entry per line. */
  lines?: string[];
  body: string;
  /** Where the app tiles sit in the headline (see HeroBig). */
  iconAfter?: string;
  iconPair?: boolean;
}

/**
 * The homepage's big-type hero for paid landing pages: the same type, tiles
 * and button pair, under the pared-back paid nav instead of the full site nav.
 *
 * The message arrives as a prop, resolved on the server from the ad's `kw`
 * param, so the first paint already carries the headline the ad promised.
 */
export function LpHero({
  message,
  note,
}: {
  message: LpHeroMessage;
  note?: string;
}) {
  const { theme } = useTheme();
  return (
    <>
      <StudioNav
        paid
        darkTop={theme === "dark"}
        maxWidthClass="max-w-[1600px]"
        restPaddingClass="px-6 md:px-10"
      />
      <HeroBig
        headline={message.h1}
        lines={message.lines}
        body={message.body}
        iconAfter={message.iconAfter}
        iconPair={message.iconPair}
        trackCtas={false}
        note={note}
      />
    </>
  );
}
