// Deliberately NOT a "use client" module, for the same reason theme-script.ts
// isn't: the server layout inlines AUTH_INIT_SCRIPT into <head>, and a client
// module hands the server a reference proxy that stringifies into a syntax
// error rather than the script.

/**
 * The dashboard's session cookie. HttpOnly, so it can only be read server-side
 * — the root layout reads it with `cookies()` and stamps `data-authed` on
 * `<html>` at render time.
 */
export const SESSION_COOKIE = "current-portal-session";

/**
 * Demo override so both states can be shown on a preview URL: add `?authed=1`
 * or `?authed=0` to any URL and the choice sticks until `?authed=clear`.
 */
export const DEMO_KEY = "studio:demo-authed";

/** `<html data-authed>`, the single source both the CSS and the hook read. */
export const AUTH_ATTRIBUTE = "authed";

/**
 * Client-side script that handles only the demo override. The real auth state
 * is set server-side on `<html data-authed>` by the root layout (which can
 * read the HttpOnly session cookie). This script checks for `?authed=1|0` in
 * the URL or a persisted override in localStorage and, if found, overwrites
 * the server-set value. If no override is active it leaves the attribute alone.
 */
export const AUTH_INIT_SCRIPT = `try{var a=null;var q=new URLSearchParams(window.location.search).get('authed');if(q==='clear'){localStorage.removeItem('${DEMO_KEY}');}else if(q==='1'||q==='0'){localStorage.setItem('${DEMO_KEY}',q);a=q==='1';}if(a===null){var s=localStorage.getItem('${DEMO_KEY}');if(s==='1'||s==='0')a=s==='1';}if(a!==null)document.documentElement.dataset.${AUTH_ATTRIBUTE}=a?'1':'0';}catch(e){}`;
