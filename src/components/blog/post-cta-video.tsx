"use client";

import { useEffect, useRef } from "react";

/**
 * A writer's clip on the guide card. It plays muted and looping like a GIF,
 * but a click pauses it, and a reader who asks for less motion gets a still
 * first frame with the browser's own controls instead of continuous playback.
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

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      video.controls = true;
      return;
    }
    video.classList.add("cursor-pointer");
    video.play().catch(() => {
      // Autoplay refused (low-power mode and the like): the first frame stays.
    });
  }, []);

  // With the browser's controls showing, they handle play and pause.
  const toggle = () => {
    const video = ref.current;
    if (!video || video.controls) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      onClick={toggle}
      aria-label={label}
    />
  );
}
