const ACQUISITION_PARAMS = [
  "msclkid", "gclid", "gbraid", "wbraid", "fbclid", "ttclid", "twclid", "li_fat_id",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
] as const;
const STORAGE_KEY = "assembly:signup-attribution";
const SIGNUP_DESTINATION = "https://dashboard.assembly.com/signup";
const MAX_URL_LENGTH = 2048;

function acquisitionParams(search: string): URLSearchParams {
  const source = new URLSearchParams(search);
  const params = new URLSearchParams();
  for (const key of ACQUISITION_PARAMS) {
    const value = source.get(key);
    if (value) params.set(key, value);
  }
  return params;
}

/** Keep the landing attribution across marketing navigation, scoped to this tab. */
export function readSignupAttribution(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  const current = acquisitionParams(window.location.search);
  try {
    if (current.size) {
      // A new campaign replaces the previous visit rather than combining IDs.
      window.sessionStorage.setItem(STORAGE_KEY, current.toString());
    } else {
      return acquisitionParams(window.sessionStorage.getItem(STORAGE_KEY) || "");
    }
  } catch {
    // Storage restrictions must not stop signup or current-query forwarding.
  }
  return current;
}

/** Apply at handoff or after hydration, never during server/client rendering. */
export function withSignupAttribution(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (`${url.origin}${url.pathname}` !== SIGNUP_DESTINATION) return href;
  const attribution = readSignupAttribution();
  if (!attribution.size) return href;
  for (const [key, value] of attribution) {
    // Referral and powered-by links can already define their own attribution.
    if (!url.searchParams.has(key)) url.searchParams.set(key, value);
  }
  // Leave room for attribution without truncating the click identity.
  let prompt = url.searchParams.get("prompt") || "";
  while (url.toString().length > MAX_URL_LENGTH && prompt.length) {
    prompt = prompt.slice(0, Math.floor(prompt.length * 0.9));
    if (prompt) url.searchParams.set("prompt", prompt);
    else url.searchParams.delete("prompt");
  }
  return url.toString();
}

// Remember our edits so a later campaign can replace them without replacing
// attribution that was explicitly part of the original link.
const decoratedLinks = new WeakMap<HTMLAnchorElement, { original: string; decorated: string }>();

/** Decorate hrefs, including mobile menus and links rebuilt by React. */
export function observeSignupLinks(document: Document): () => void {
  const view = document.defaultView;
  if (!view) return () => {};
  readSignupAttribution();
  const decorate = (link: HTMLAnchorElement) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const previous = decoratedLinks.get(link);
    let original = href;
    if (previous?.decorated === href) {
      original = previous.original;
    } else if (previous) {
      // Another decorator (the hero experiment) can add fields to our href.
      // Remove only fields we added, preserving its edits and explicit UTMs.
      const updated = new URL(href, view.location.href);
      if (`${updated.origin}${updated.pathname}` === SIGNUP_DESTINATION) {
        const before = new URL(previous.original);
        const after = new URL(previous.decorated);
        for (const key of ACQUISITION_PARAMS) {
          if (!before.searchParams.has(key) &&
              updated.searchParams.get(key) === after.searchParams.get(key)) {
            updated.searchParams.delete(key);
          }
        }
        original = updated.toString();
      }
    }
    const decorated = withSignupAttribution(original);
    decoratedLinks.set(link, { original, decorated });
    if (decorated !== href) link.setAttribute("href", decorated);
  };
  const stamp = (root: ParentNode) => {
    for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href*="/signup"]')) decorate(link);
  };
  stamp(document);
  const observer = new view.MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "attributes") {
        decorate(record.target as HTMLAnchorElement);
        continue;
      }
      for (const node of record.addedNodes) {
        if (!(node instanceof view.Element)) continue;
        if (node.matches('a[href*="/signup"]')) decorate(node as HTMLAnchorElement);
        stamp(node);
      }
    }
  });
  observer.observe(document.body, {
    childList: true, subtree: true, attributes: true, attributeFilter: ["href"],
  });
  return () => observer.disconnect();
}
