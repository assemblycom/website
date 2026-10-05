/**
 * The band above the nav. One announcement at a time, edited here rather than
 * fetched, so taking it down is a one-line change and never depends on the CMS
 * being reachable. Set to `null` when there is nothing to announce.
 */
/**
 * The band is one line at every width, so the copy has to fit one. Anything
 * longer is trimmed rather than allowed to wrap the bar into a paragraph —
 * the announcement is a pointer, and the post it points at carries the detail.
 */
export const MAX_ANNOUNCEMENT_WORDS = 8;

export const ANNOUNCEMENT: {
  text: string;
  /** Where the band goes. Internal routes only. */
  href: string;
  cta: string;
} | null = null;

// Nothing to announce, so the band is down and AnnouncementBar renders nothing.
// The last one is kept here rather than deleted — putting a band back is
// filling this in again, and the shape is easier to copy than to remember:
//
//   {
//     text: "Introducing our AI app builder",
//     href: "/blog/assembly-studio",
//     cta: "Read now",
//   }
//
// The type annotation above stays a union for the same reason: written as a
// bare `= null` the const narrows to `null`, and the bar's own body stops
// type-checking against a value it can no longer hold.
