// Deliberately NOT a "use client" module, for the same reason theme-script.ts
// isn't: the server layout inlines AUTH_INIT_SCRIPT into <head>, and a client
// module hands the server a reference proxy that stringifies into a syntax
// error rather than the script.

/**
 * Whether the visitor is signed in to Assembly. The dashboard sets a cookie on
 * the shared `.assembly.com` parent domain, which any page under that domain
 * can read client-side.
 *
 * A Vercel preview URL is not under `.assembly.com`, so the cookie is never
 * visible there — use the demo override below to see both states.
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
 * Runs before paint so the right variant is on <html> before React hydrates.
 *
 * This is what makes the auth-aware UI flash-free. The markup is prerendered
 * without knowing who is visiting, so every auth-dependent surface ships BOTH
 * variants and the stylesheet picks one off this attribute (see `.auth-only` /
 * `.unauth-only` in globals.css). Deciding in an effect instead meant a
 * signed-in visitor watched the nav, the pricing grid and the comparison table
 * render signed-out and then rearrange.
 *
 * Failing closed to "0" matters: signed-out is the state the markup is written
 * for, so a thrown script leaves a correct page rather than a blank one.
 */
export const AUTH_INIT_SCRIPT = `try{var a=null;var q=new URLSearchParams(window.location.search).get('authed');if(q==='clear'){localStorage.removeItem('${DEMO_KEY}');}else if(q==='1'||q==='0'){localStorage.setItem('${DEMO_KEY}',q);a=q==='1';}if(a===null){var s=localStorage.getItem('${DEMO_KEY}');if(s==='1'||s==='0')a=s==='1';}if(a===null)a=document.cookie.split('; ').some(function(c){return c.indexOf('${SESSION_COOKIE}=')===0&&c.length>${SESSION_COOKIE.length + 1};});document.documentElement.dataset.${AUTH_ATTRIBUTE}=a?'1':'0';}catch(e){document.documentElement.dataset.${AUTH_ATTRIBUTE}='0';}`;
