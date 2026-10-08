// ─────────────────────────────────────────────────────────────────────────
// BUILDER GLOW — the horizon arc behind /ai-app-builder's hero.
//
// Six concentric circles sharing one centre, the largest dimmest and the
// smallest painted in the page's own ground. The ground circle occludes the
// middle, so all that survives is a bright rim around its edge; the hero's
// `overflow-hidden` clips the sides and top, leaving the trough of the curve
// under the headline. That is the whole trick — there is no gradient here,
// only a stack of blurred solids and a hole punched in it.
//
// The colours ARE the footer aurora, in its order: the ring nearest the hole is
// white, then lime, then teal, then blue, then the deepest indigo furthest out
// (BRAND_AURORA in footer.tsx, which the composer ring's conic also runs). One
// ring per stop, because a ramp is what the footer is — an arc that goes
// straight from blue to a white rim carries none of the lime and teal the band
// spends half its length on, and reads as a generic blue glow.
//
// Both themes are real, and they are NOT the same values dimmed. Dark is the
// bright arc on near-black. Light is the same geometry with saturated stops at
// low opacity, because a hot rim on white reads as a printing error — the
// values live in `:root` / `[data-theme="dark"]` in globals.css, never here.
//
// Static markup with no state and no measurement, so it stays a server
// component and costs nothing on the client. The entrance is a CSS keyframe
// (see `.builder-glow` in globals.css), which is also why there is no
// framer-motion: the reference leaned on it, but four blurred divs rising once
// on mount is a @keyframes, not a dependency.
// ─────────────────────────────────────────────────────────────────────────

/**
 * Decorative only — it carries no information the copy doesn't, so it is
 * hidden from assistive tech and cannot take a pointer.
 */
export function BuilderGlow() {
  return (
    <div className="builder-glow" aria-hidden>
      <span className="builder-glow__arc builder-glow__arc--bloom" />
      <span className="builder-glow__arc builder-glow__arc--mid" />
      <span className="builder-glow__arc builder-glow__arc--halo" />
      <span className="builder-glow__arc builder-glow__arc--lime" />
      <span className="builder-glow__arc builder-glow__arc--rim" />
      <span className="builder-glow__arc builder-glow__arc--ground" />
    </div>
  );
}
