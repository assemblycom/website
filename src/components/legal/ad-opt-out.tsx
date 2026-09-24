"use client";

import { useSyncExternalStore } from "react";
import { readAdOptOut, setAdOptOut } from "@/components/analytics/enabled";

type State = "gpc" | "opted-out" | "opted-in" | null;

// Neither signal changes while the page is open (a change reloads it), so there
// is nothing to subscribe to. A string snapshot, because it has to compare equal
// between calls.
const subscribe = () => () => {};
const getSnapshot = (): State => {
  const { gpc, optedOut } = readAdOptOut();
  return gpc ? "gpc" : optedOut ? "opted-out" : "opted-in";
};
const getServerSnapshot = (): State => null;

// The site's primary and secondary buttons, as the CTAs elsewhere set them.
const PRIMARY =
  "rounded-lg bg-foreground px-5 py-2.5 text-center text-sm text-background transition-opacity hover:opacity-90";
const SECONDARY =
  "rounded-lg border border-foreground/20 bg-transparent px-5 py-2.5 text-center text-sm text-foreground transition-colors hover:bg-foreground/5";

/**
 * The opt-out control. Reads the browser's GPC signal and the opt-out cookie,
 * which only exist client-side, so it renders an empty placeholder on the server
 * rather than guessing.
 *
 * Changing the choice reloads the page. Tag Manager is already running on this
 * one, and client-side navigation would keep it running; a full load is what
 * lets the check in `whenAdTrackingAllowed` take effect.
 */
export function AdOptOut() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!state) return <div className="mt-10 min-h-[6.5rem]" />;

  const choose = (optedOut: boolean) => {
    setAdOptOut(optedOut);
    window.location.reload();
  };

  return (
    <div className="mt-10 min-h-[6.5rem] rounded-lg bg-muted p-6">
      <p role="status" className="text-base text-foreground">
        {state === "gpc"
          ? "Your browser is sending a Global Privacy Control signal, so you are opted out in this browser."
          : state === "opted-out"
            ? "You are opted out in this browser."
            : "You are not opted out in this browser."}
      </p>
      {state !== "gpc" && (
        <button
          type="button"
          onClick={() => choose(state === "opted-in")}
          className={`mt-4 ${state === "opted-out" ? SECONDARY : PRIMARY}`}
        >
          {state === "opted-out" ? "Opt back in" : "Opt out"}
        </button>
      )}
    </div>
  );
}
