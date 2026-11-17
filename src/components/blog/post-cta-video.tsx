"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Follows the reader's motion setting live, so turning it on mid-read takes
// effect without a reload.
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia?.(REDUCED_MOTION);
  query?.addEventListener("change", onChange);
  return () => query?.removeEventListener("change", onChange);
}
const readsReducedMotion = () =>
  window.matchMedia?.(REDUCED_MOTION).matches ?? false;

/**
 * A writer's clip on the guide card. It plays muted and looping like a GIF,
 * with a pause button that shows on hover or keyboard focus. A reader who asks
 * for less motion gets a still frame with the browser's own controls instead.
 */
export function PostCtaVideo({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    readsReducedMotion,
    () => false,
  );

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reduceMotion) video.pause();
    else
      video.play().catch(() => {
        // Autoplay refused (low-power mode and the like): the first frame stays.
      });
  }, [reduceMotion]);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <div className="group relative">
      <video
        ref={ref}
        src={src}
        className={className}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduceMotion}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        aria-label={label}
      />
      {!reduceMotion && (
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Play video" : "Pause video"}
          // Stays up while paused, so the reader can see why the clip stopped.
          className={`absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100 ${paused ? "opacity-100" : "opacity-0"}`}
        >
          <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            className="size-2.5"
            aria-hidden
          >
            {paused ? (
              <path d="M3.5 2.3v7.4a.5.5 0 0 0 .76.43l6-3.7a.5.5 0 0 0 0-.86l-6-3.7a.5.5 0 0 0-.76.43z" />
            ) : (
              <>
                <rect x="2.5" y="2" width="2.5" height="8" rx=".6" />
                <rect x="7" y="2" width="2.5" height="8" rx=".6" />
              </>
            )}
          </svg>
        </button>
      )}
    </div>
  );
}
