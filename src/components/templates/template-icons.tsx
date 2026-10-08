/**
 * Art for the template rail's slots.
 *
 * The rail's slot is a recess waiting for a template shot. Until those exist a
 * row can carry a mark instead, which is better than a blank square for the
 * handful of templates that have one drawn.
 *
 * Each is a Figma export with its wrapper stripped. Figma writes background
 * blur as a `foreignObject` carrying a `backdrop-filter` and a clip path —
 * three extra nodes per shape that render nothing useful inline and drag an
 * HTML document into an SVG. The shapes are what carry the drawing.
 *
 * Two tones, and NEITHER of them themes. The slot in the rail turns into the
 * icon's plate when it carries one (see template-rail), so the artwork is drawn
 * straight onto it — one square, not a square inside a square.
 *
 * Two tones, and neither of them themes. An app's icon is the app's own
 * artwork — the same reasoning the Brandmages mark follows elsewhere in these
 * mocks: it is their file, not our chrome, so it looks the same wherever it is
 * put. The slot behind it carries the theme; the mark does not.
 *
 * That is also the bug this replaces. The shape behind was `currentColor`, so
 * it inherited the row's ink and flipped to near-white in dark — which turned
 * the drawing inside out, pale card behind and dark card in front, the reverse
 * of what the file draws. Both shapes are fixed now: near-black behind, white
 * in front, which reads on the slot in either theme because the slot is a mid
 * grey in both (#e9e9e9 light, #242424 dark). */
// ── Optical centring ─────────────────────────────────────────────────────
// Every one of these is a dark card with a pale one laid across it, and the
// pair is drawn to a box that tracks BOTH shapes. The eye does not: at 22px on
// a light tile the translucent white reads as a highlight and the dark shape
// reads as the icon, so each mark appeared pushed off centre in its slot even
// though its bounding box sat dead centre — measured at 17px clear on each
// side, which is why nothing looked wrong in the markup.
//
// Each icon is nudged by the gap between its DARK shape's centre and its
// viewBox's, as a percentage of the box so it holds at any size. A CSS
// transform on the element rather than a transform inside the SVG: the latter
// would move the art against a fixed viewBox and clip it at the edge, where
// this moves the whole rendered box inside a tile that has pixels to spare.
//
// Measured, not guessed — dark-shape centre against box centre, per icon:
//   onboarding  +12,+11 of 158x159      documents     +16,-18 of 224x159
//   library     see below               messages      +11,+19 of 159x161
//   projects    +16,+13 of 145x184      payments      +12,-15 of 218x139
//   embeds      +7.3%,+7.1%             integrations  +7.5%,+7.2%
//   automations +7.3%,+7.2%      timeTracker   +11.9,+11.5 of 159x159
//   proposals   +11.9,+11.5 of 159x159  (same card pair as timeTracker)
//
// The last three are the stack rows' marks, measured the same way — their dark
// mass is the offset back card plus whatever glyph sits on the front one, so
// an icon whose glyph is drawn with a stroke counts that stroke's path too.
//
// `approvals` is the one that does NOT take this measurement, because the rule
// above assumes what every other mark here is: a dark card offset behind a pale
// one, where the dark mass is half the drawing. That icon is a speech bubble —
// a big translucent shape with a small dark TAIL off its bottom-left corner.
// Measured the stated way its dark centre sits 26% left and 25% below the box,
// which would throw the bubble a quarter of a tile to the upper right; the tail
// is an accent, not the mass. So it takes the whole drawing's bbox instead,
// which runs y 9→186 against a 186 box — 2.4% low, and nothing in x.
const NUDGE = {
  onboarding: "-translate-x-[7.6%] -translate-y-[6.9%]",
  documents: "-translate-x-[7.1%] translate-y-[11.3%]",
  library: "-translate-x-[7%] -translate-y-[7%]",
  messages: "-translate-x-[6.9%] -translate-y-[11.8%]",
  projects: "-translate-x-[11%] -translate-y-[7.1%]",
  payments: "-translate-x-[5.5%] translate-y-[10.8%]",
  embeds: "-translate-x-[7.3%] -translate-y-[7.1%]",
  integrations: "-translate-x-[7.5%] -translate-y-[7.2%]",
  automations: "-translate-x-[7.3%] -translate-y-[7.2%]",
  timeTracker: "-translate-x-[7.5%] -translate-y-[7.2%]",
  approvals: "-translate-y-[2.4%]",
  proposals: "-translate-x-[7.5%] -translate-y-[7.2%]",
};

export function IconTemplatePayments({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 218 139"
      className={`${NUDGE.payments} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M169.487 0C179.985 0.000212183 190.697 8.2203 193.413 18.3601L212.841 90.864C215.558 101.004 209.251 109.224 198.754 109.224H72.2262C61.7286 109.224 51.0158 101.004 48.2988 90.864L28.8715 18.3601C26.1545 8.22017 32.462 0 42.9597 0H169.487Z"
        fill="#15171c"
      />
      <path
        d="M169.254 47.629C166.892 38.8171 157.583 31.6729 148.46 31.6719L16.5184 31.6604C7.39552 31.6597 1.91418 38.8026 4.2752 47.6146L24.316 122.408C26.6772 131.22 35.987 138.365 45.1101 138.366L177.052 138.377C186.174 138.378 191.656 131.234 189.294 122.422L169.254 47.629ZM155.191 93.8902C155.841 96.3163 154.332 98.2829 151.82 98.2827L127.994 98.2807C125.482 98.2804 122.918 96.3135 122.268 93.8874L117.516 76.1517C116.866 73.7254 118.376 71.759 120.888 71.7592L144.714 71.7613C147.226 71.7616 149.789 73.7283 150.439 76.1546L155.191 93.8902Z"
        fill="#ffffff"
      />
    </svg>
  );
}

/**
 * The four marks added alongside Payments, exported from the same Figma file
 * and normalised to this family's terms.
 *
 * Figma wrote the back shape as `black` on one and `#101010` on the others;
 * all four are set to #15171c here, which is the tone Payments already uses.
 * An icon set whose darks disagree by a few points reads as a set that was
 * assembled rather than drawn, and the difference is invisible except when two
 * of them sit in the same rail — which is exactly where these live.
 *
 * The white front keeps its 0.8 from the file. That opacity is load-bearing
 * rather than decoration: the front shape OVERLAPS the back one, and letting
 * the dark read through the overlap is what gives these their layered look.
 * Flattening it to solid white would close the overlap and lose the drawing.
 * Payments has no opacity because it solves the same problem a different way,
 * with a cut-out subpath instead of a translucent overlap.
 *
 * Onboarding carries two extra shapes, including a #d0d0d0 detail — a third
 * tone, against the two the note above describes. It is the artwork's own, not
 * chrome: the same reasoning that keeps these marks from theming applies to
 * what is inside them.
 */

export function IconTemplateMessages({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 159 161"
      className={`${NUDGE.messages} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="messages-in">
          <path d="M113.42 0C125.554 0 135.392 9.83728 135.392 21.9717V74.0879C135.392 86.2223 125.554 96.0596 113.42 96.0596H97.4956C93.2094 96.0596 89.207 98.2021 86.8302 101.769L78.3608 114.478C73.288 122.091 62.1027 122.091 57.0299 114.478L48.5605 101.769C46.1836 98.2021 42.1812 96.0596 37.895 96.0596H21.9717C9.83728 96.0596 0 86.2223 0 74.0879V21.9717C0 9.83728 9.83728 0 21.9717 0H113.42Z" />
        </clipPath>
        <filter
          id="messages-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.81" />
        </filter>
        <mask
          id="messages-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="161"
        >
          <rect x="0" y="0" width="159" height="161" fill="#fff" />
          <path
            d="M113.42 0C125.554 0 135.392 9.83728 135.392 21.9717V74.0879C135.392 86.2223 125.554 96.0596 113.42 96.0596H97.4956C93.2094 96.0596 89.207 98.2021 86.8302 101.769L78.3608 114.478C73.288 122.091 62.1027 122.091 57.0299 114.478L48.5605 101.769C46.1836 98.2021 42.1812 96.0596 37.895 96.0596H21.9717C9.83728 96.0596 0 86.2223 0 74.0879V21.9717C0 9.83728 9.83728 0 21.9717 0H113.42Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M136.528 39.8975C148.662 39.8975 158.499 49.7347 158.5 61.8691V113.986C158.499 126.121 148.662 135.957 136.528 135.957H120.606C116.319 135.957 112.317 138.1 109.94 141.666L101.47 154.378C96.3969 161.99 85.2115 161.99 80.1387 154.378L71.6684 141.666C69.2915 138.1 65.2891 135.957 61.0029 135.957H45.0796C32.9453 135.957 23.1082 126.121 23.1079 113.986V61.8691C23.1079 49.7347 32.9452 39.8975 45.0796 39.8975H136.528Z"
        fill="#15171c"
        mask="url(#messages-out)"
      />
      <g clipPath="url(#messages-in)" filter="url(#messages-blur)">
        <path
          d="M136.528 39.8975C148.662 39.8975 158.499 49.7347 158.5 61.8691V113.986C158.499 126.121 148.662 135.957 136.528 135.957H120.606C116.319 135.957 112.317 138.1 109.94 141.666L101.47 154.378C96.3969 161.99 85.2115 161.99 80.1387 154.378L71.6684 141.666C69.2915 138.1 65.2891 135.957 61.0029 135.957H45.0796C32.9453 135.957 23.1082 126.121 23.1079 113.986V61.8691C23.1079 49.7347 32.9452 39.8975 45.0796 39.8975H136.528Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M113.42 0C125.554 0 135.392 9.83728 135.392 21.9717V74.0879C135.392 86.2223 125.554 96.0596 113.42 96.0596H97.4956C93.2094 96.0596 89.207 98.2021 86.8302 101.769L78.3608 114.478C73.288 122.091 62.1027 122.091 57.0299 114.478L48.5605 101.769C46.1836 98.2021 42.1812 96.0596 37.895 96.0596H21.9717C9.83728 96.0596 0 86.2223 0 74.0879V21.9717C0 9.83728 9.83728 0 21.9717 0H113.42Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
    </svg>
  );
}

export function IconTemplateDocuments({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 224 159"
      className={`${NUDGE.documents} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="documents-in">
          <path d="M34.9627 23.6377C30.3295 23.6377 26.8607 27.8861 27.787 32.4258L28.7313 37.0508H12.8221C4.53319 37.0508 -1.57524 44.8005 0.360199 52.8604L23.369 148.676C24.7536 154.441 29.9121 158.505 35.8416 158.5L167.975 158.39C176.175 158.383 182.26 150.783 180.473 142.78L159.105 47.0742C157.797 41.2164 152.6 37.0509 146.598 37.0508H69.0897L67.5477 29.4971C66.8517 26.0872 63.8522 23.6377 60.3719 23.6377H34.9627Z" />
        </clipPath>
        <filter
          id="documents-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.81" />
        </filter>
        <mask
          id="documents-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="224"
          height="159"
        >
          <rect x="0" y="0" width="224" height="159" fill="#fff" />
          <path
            d="M34.9627 23.6377C30.3295 23.6377 26.8607 27.8861 27.787 32.4258L28.7313 37.0508H12.8221C4.53319 37.0508 -1.57524 44.8005 0.360199 52.8604L23.369 148.676C24.7536 154.441 29.9121 158.505 35.8416 158.5L167.975 158.39C176.175 158.383 182.26 150.783 180.473 142.78L159.105 47.0742C157.797 41.2164 152.6 37.0509 146.598 37.0508H69.0897L67.5477 29.4971C66.8517 26.0872 63.8522 23.6377 60.3719 23.6377H34.9627Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M71.8485 0C66.0535 3.53704e-05 60.9792 3.88867 59.4725 9.48438L33.0331 107.679C30.8414 115.818 36.969 123.821 45.3983 123.828L181.738 123.94C187.447 123.945 192.471 120.173 194.059 114.689L222.53 16.3818C224.904 8.18449 218.754 0.00010152 210.22 0H71.8485Z"
        fill="#15171c"
        mask="url(#documents-out)"
      />
      <g clipPath="url(#documents-in)" filter="url(#documents-blur)">
        <path
          d="M71.8485 0C66.0535 3.53704e-05 60.9792 3.88867 59.4725 9.48438L33.0331 107.679C30.8414 115.818 36.969 123.821 45.3983 123.828L181.738 123.94C187.447 123.945 192.471 120.173 194.059 114.689L222.53 16.3818C224.904 8.18449 218.754 0.00010152 210.22 0H71.8485Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M34.9627 23.6377C30.3295 23.6377 26.8607 27.8861 27.787 32.4258L28.7313 37.0508H12.8221C4.53319 37.0508 -1.57524 44.8005 0.360199 52.8604L23.369 148.676C24.7536 154.441 29.9121 158.505 35.8416 158.5L167.975 158.39C176.175 158.383 182.26 150.783 180.473 142.78L159.105 47.0742C157.797 41.2164 152.6 37.0509 146.598 37.0508H69.0897L67.5477 29.4971C66.8517 26.0872 63.8522 23.6377 60.3719 23.6377H34.9627Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
    </svg>
  );
}

export function IconTemplateLibrary({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 159 159"
      className={`${NUDGE.library} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="library-in">
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z" />
        </clipPath>
        <filter
          id="library-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.78" />
        </filter>
        <mask
          id="library-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="159"
        >
          <rect x="0" y="0" width="159" height="159" fill="#fff" />
          <path
            d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
        fill="#15171c"
        mask="url(#library-out)"
      />
      <g clipPath="url(#library-in)" filter="url(#library-blur)">
        <path
          d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
      <path
        d="M45.5908 48.9268C45.5908 54.4496 41.1137 58.9268 35.5908 58.9268L32.5908 58.9268C27.0681 58.9266 22.5908 54.4495 22.5908 48.9268L22.5908 45.9268C22.5908 40.404 27.0681 35.927 32.5908 35.9268L35.5908 35.9268C41.1137 35.9268 45.5908 40.4039 45.5908 45.9268L45.5908 48.9268ZM45.5908 87.8603C45.5908 93.3832 41.1137 97.8603 35.5908 97.8603L32.5908 97.8603C27.0681 97.8601 22.5908 93.3831 22.5908 87.8603L22.5908 84.8603C22.5908 79.3376 27.0681 74.8605 32.5908 74.8603L35.5908 74.8603C41.1137 74.8603 45.5908 79.3375 45.5908 84.8603L45.5908 87.8603ZM78.4424 31.4736C78.4424 36.9964 73.9651 41.4734 68.4424 41.4736L65.4424 41.4736C59.9195 41.4736 55.4424 36.9965 55.4424 31.4736L55.4424 28.4736C55.4424 22.9508 59.9195 18.4736 65.4424 18.4736L68.4424 18.4736C73.9651 18.4738 78.4424 22.9509 78.4424 28.4736L78.4424 31.4736ZM78.4424 106.526C78.4424 112.049 73.9651 116.526 68.4424 116.526L65.4424 116.526C59.9195 116.526 55.4424 112.049 55.4424 106.526L55.4424 103.526C55.4424 98.0035 59.9195 93.5264 65.4424 93.5264L68.4424 93.5264C73.9651 93.5266 78.4424 98.0036 78.4424 103.526L78.4424 106.526ZM79.0488 68.0332C79.0488 73.556 74.5717 78.0332 69.0488 78.0332L66.0488 78.0332C60.526 78.0331 56.0488 73.556 56.0488 68.0332L56.0488 65.0332C56.0488 59.5104 60.526 55.0333 66.0488 55.0332L69.0488 55.0332C74.5717 55.0332 79.0488 59.5104 79.0488 65.0332L79.0488 68.0332ZM112.507 48.9268C112.507 54.4495 108.03 58.9266 102.507 58.9268L99.5068 58.9268C93.984 58.9268 89.5068 54.4496 89.5068 48.9268L89.5068 45.9268C89.5068 40.4039 93.984 35.9268 99.5068 35.9268L102.507 35.9268C108.03 35.927 112.507 40.404 112.507 45.9268L112.507 48.9268ZM112.507 87.8604C112.507 93.3831 108.03 97.8602 102.507 97.8604L99.5068 97.8604C93.984 97.8604 89.5068 93.3832 89.5068 87.8604L89.5068 84.8604C89.5068 79.3375 93.984 74.8604 99.5068 74.8604L102.507 74.8604C108.03 74.8605 112.507 79.3376 112.507 84.8604L112.507 87.8604Z"
        fill="#15171c"
      />
    </svg>
  );
}

export function IconTemplateOnboarding({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 158 159"
      className={`${NUDGE.onboarding} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="onboarding-in">
          <path d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42Z" />
        </clipPath>
        <filter
          id="onboarding-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.81" />
        </filter>
        <mask
          id="onboarding-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="158"
          height="159"
        >
          <rect x="0" y="0" width="158" height="159" fill="#fff" />
          <path
            d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M136.009 23.1069C148.144 23.1071 157.98 32.9443 157.98 45.0786V136.527C157.98 148.661 148.143 158.497 136.009 158.498H45.1548C33.0205 158.498 23.1833 148.661 23.1831 136.527V45.0786C23.1831 32.9442 33.0204 23.1069 45.1548 23.1069H136.009Z"
        fill="#15171c"
        mask="url(#onboarding-out)"
      />
      <g clipPath="url(#onboarding-in)" filter="url(#onboarding-blur)">
        <path
          d="M136.009 23.1069C148.144 23.1071 157.98 32.9443 157.98 45.0786V136.527C157.98 148.661 148.143 158.497 136.009 158.498H45.1548C33.0205 158.498 23.1833 148.661 23.1831 136.527V45.0786C23.1831 32.9442 33.0204 23.1069 45.1548 23.1069H136.009Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
      <path
        d="M89.2868 35.298L51.9689 44.1125C50.0671 44.5804 48.3296 45.5598 46.9447 46.9447C45.5598 48.3296 44.5804 50.0671 44.1125 51.9689L35.298 89.2868C34.8756 91.0002 34.9027 92.7935 35.3765 94.4933C35.8503 96.1931 36.7549 97.7418 38.0026 98.9896C39.2504 100.237 40.7991 101.142 42.4989 101.616C44.1987 102.09 45.992 102.117 47.7053 101.694L85.0233 92.8797C86.9251 92.4118 88.6626 91.4324 90.0475 90.0475C91.4324 88.6626 92.4118 86.9251 92.8797 85.0233L101.694 47.7053C102.117 45.992 102.09 44.1987 101.616 42.4989C101.142 40.7991 100.237 39.2504 98.9896 38.0026C97.7418 36.7549 96.1931 35.8503 94.4933 35.3765C92.7935 34.9027 91.0002 34.8756 89.2868 35.298ZM76.113 76.113C74.6061 77.6217 72.6856 78.6496 70.5943 79.0666C68.5031 79.4836 66.3352 79.2709 64.3649 78.4555C62.3946 77.6401 60.7104 76.2586 59.5255 74.4858C58.3405 72.7129 57.708 70.6285 57.708 68.4961C57.708 66.3637 58.3405 64.2792 59.5255 62.5064C60.7104 60.7336 62.3946 59.3521 64.3649 58.5367C66.3352 57.7213 68.5031 57.5086 70.5943 57.9256C72.6856 58.3426 74.6061 59.3704 76.113 60.8792C78.1198 62.9064 79.2456 65.6436 79.2456 68.4961C79.2456 71.3486 78.1198 74.0858 76.113 76.113Z"
        fill="#15171c"
      />
      <circle cx="68" cy="66" r="15" fill="#15171c" />
      <path
        d="M69.678 58H66.9831C62.0218 58 58 62.0219 58 66.9831V69.678C58 74.6392 62.0219 78.661 66.9831 78.661H69.678C74.6392 78.661 78.661 74.6392 78.661 69.678V66.9831C78.661 62.0218 74.6392 58 69.678 58Z"
        fill="#d0d0d0"
      />
    </svg>
  );
}

export function IconTemplateProjects({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 145 184"
      className={`${NUDGE.projects} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="projects-in">
          <path d="M19.028 3.66162C22.5309 1.63947 27.0099 2.84016 29.0323 6.34296L80.1343 94.8543C81.1535 96.6197 81.3904 98.7297 80.7888 100.677L79.1503 105.984C78.9097 106.763 78.8341 107.583 78.9287 108.393L79.9455 117.098C80.3178 120.287 76.6975 122.377 74.1219 120.46L67.0919 115.227C66.438 114.74 65.6895 114.395 64.8947 114.214L59.4798 112.98C57.4924 112.527 55.7834 111.267 54.7642 109.502L3.66211 20.9904C1.63971 17.4875 2.84006 13.0078 6.34296 10.9854L19.028 3.66162Z" />
        </clipPath>
        <filter
          id="projects-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.81" />
        </filter>
        <mask
          id="projects-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="145"
          height="184"
        >
          <rect x="0" y="0" width="145" height="184" fill="#fff" />
          <path
            d="M19.028 3.66162C22.5309 1.63947 27.0099 2.84016 29.0323 6.34296L80.1343 94.8543C81.1535 96.6197 81.3904 98.7297 80.7888 100.677L79.1503 105.984C78.9097 106.763 78.8341 107.583 78.9287 108.393L79.9455 117.098C80.3178 120.287 76.6975 122.377 74.1219 120.46L67.0919 115.227C66.438 114.74 65.6895 114.395 64.8947 114.214L59.4798 112.98C57.4924 112.527 55.7834 111.267 54.7642 109.502L3.66211 20.9904C1.63971 17.4875 2.84006 13.0078 6.34296 10.9854L19.028 3.66162Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M123.009 25.1533C135.143 25.1533 144.98 34.9897 144.98 47.124V161.915C144.98 174.049 135.143 183.887 123.009 183.887H54.665C42.5306 183.887 32.6934 174.049 32.6934 161.915V47.124C32.6934 34.9897 42.5307 25.1533 54.665 25.1533H123.009ZM52.833 137.564C49.909 137.564 47.5382 139.934 47.5381 142.858C47.5381 145.782 49.909 148.153 52.833 148.153H124.838C127.762 148.153 130.133 145.782 130.133 142.858C130.133 139.934 127.762 137.564 124.838 137.564H52.833ZM53.8916 99.2256C50.383 99.2258 47.5383 102.07 47.5381 105.578C47.5381 109.087 50.3829 111.931 53.8916 111.932H123.779C127.288 111.931 130.133 109.087 130.133 105.578C130.133 102.07 127.288 99.2257 123.779 99.2256H53.8916ZM53.8916 60.8857C50.383 60.8859 47.5382 63.7306 47.5381 67.2393C47.5381 70.748 50.3829 73.5926 53.8916 73.5928H123.779C127.288 73.5926 130.133 70.748 130.133 67.2393C130.133 63.7306 127.288 60.8859 123.779 60.8857H53.8916Z"
        fill="#15171c"
        mask="url(#projects-out)"
      />
      <g clipPath="url(#projects-in)" filter="url(#projects-blur)">
        <path
          d="M123.009 25.1533C135.143 25.1533 144.98 34.9897 144.98 47.124V161.915C144.98 174.049 135.143 183.887 123.009 183.887H54.665C42.5306 183.887 32.6934 174.049 32.6934 161.915V47.124C32.6934 34.9897 42.5307 25.1533 54.665 25.1533H123.009ZM52.833 137.564C49.909 137.564 47.5382 139.934 47.5381 142.858C47.5381 145.782 49.909 148.153 52.833 148.153H124.838C127.762 148.153 130.133 145.782 130.133 142.858C130.133 139.934 127.762 137.564 124.838 137.564H52.833ZM53.8916 99.2256C50.383 99.2258 47.5383 102.07 47.5381 105.578C47.5381 109.087 50.3829 111.931 53.8916 111.932H123.779C127.288 111.931 130.133 109.087 130.133 105.578C130.133 102.07 127.288 99.2257 123.779 99.2256H53.8916ZM53.8916 60.8857C50.383 60.8859 47.5382 63.7306 47.5381 67.2393C47.5381 70.748 50.3829 73.5926 53.8916 73.5928H123.779C127.288 73.5926 130.133 70.748 130.133 67.2393C130.133 63.7306 127.288 60.8859 123.779 60.8857H53.8916Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M19.028 3.66162C22.5309 1.63947 27.0099 2.84016 29.0323 6.34296L80.1343 94.8543C81.1535 96.6197 81.3904 98.7297 80.7888 100.677L79.1503 105.984C78.9097 106.763 78.8341 107.583 78.9287 108.393L79.9455 117.098C80.3178 120.287 76.6975 122.377 74.1219 120.46L67.0919 115.227C66.438 114.74 65.6895 114.395 64.8947 114.214L59.4798 112.98C57.4924 112.527 55.7834 111.267 54.7642 109.502L3.66211 20.9904C1.63971 17.4875 2.84006 13.0078 6.34296 10.9854L19.028 3.66162Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
    </svg>
  );
}

export function IconTemplateEmbeds({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 158 159"
      className={`${NUDGE.embeds} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="embeds-in">
          <path d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42ZM106.502 33.4531C101.993 29.728 95.3171 30.3639 91.5918 34.873C84.8591 43.0222 68.1887 63.1675 55.8633 78.6025L42.4941 67.2393C38.0375 63.4514 31.3535 63.9937 27.5654 68.4502C23.7775 72.9067 24.3191 79.5908 28.7754 83.3789L50.5117 101.854C52.7132 103.726 55.5841 104.616 58.458 104.319C61.3322 104.023 63.9605 102.564 65.7334 100.282C77.4847 85.1581 99.7186 58.2913 107.921 48.3633C111.646 43.8541 111.011 37.1785 106.502 33.4531Z" />
        </clipPath>
        <filter
          id="embeds-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.81" />
        </filter>
        <mask
          id="embeds-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="158"
          height="159"
        >
          <rect x="0" y="0" width="158" height="159" fill="#fff" />
          <path
            d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42ZM106.502 33.4531C101.993 29.728 95.3171 30.3639 91.5918 34.873C84.8591 43.0222 68.1887 63.1675 55.8633 78.6025L42.4941 67.2393C38.0375 63.4514 31.3535 63.9937 27.5654 68.4502C23.7775 72.9067 24.3191 79.5908 28.7754 83.3789L50.5117 101.854C52.7132 103.726 55.5841 104.616 58.458 104.319C61.3322 104.023 63.9605 102.564 65.7334 100.282C77.4847 85.1581 99.7186 58.2913 107.921 48.3633C111.646 43.8541 111.011 37.1785 106.502 33.4531Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M136.009 23.1068C148.144 23.107 157.98 32.9442 157.98 45.0785V136.527C157.98 148.661 148.143 158.497 136.009 158.497H45.1548C33.0205 158.497 23.1833 148.661 23.1831 136.527V45.0785C23.1831 32.9441 33.0204 23.1068 45.1548 23.1068H136.009Z"
        fill="#15171c"
        mask="url(#embeds-out)"
      />
      <g clipPath="url(#embeds-in)" filter="url(#embeds-blur)">
        <path
          d="M136.009 23.1068C148.144 23.107 157.98 32.9442 157.98 45.0785V136.527C157.98 148.661 148.143 158.497 136.009 158.497H45.1548C33.0205 158.497 23.1833 148.661 23.1831 136.527V45.0785C23.1831 32.9441 33.0204 23.1068 45.1548 23.1068H136.009Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M113.42 0C125.554 0 135.391 9.83641 135.392 21.9707V113.432C135.391 125.566 125.554 135.402 113.42 135.402H21.9717C9.83739 135.402 0.000190263 125.566 0 113.432V21.9707C0.000138416 9.83642 9.83736 0 21.9717 0H113.42ZM106.502 33.4531C101.993 29.728 95.3171 30.3639 91.5918 34.873C84.8591 43.0222 68.1887 63.1675 55.8633 78.6025L42.4941 67.2393C38.0375 63.4514 31.3535 63.9937 27.5654 68.4502C23.7775 72.9067 24.3191 79.5908 28.7754 83.3789L50.5117 101.854C52.7132 103.726 55.5841 104.616 58.458 104.319C61.3322 104.023 63.9605 102.564 65.7334 100.282C77.4847 85.1581 99.7186 58.2913 107.921 48.3633C111.646 43.8541 111.011 37.1785 106.502 33.4531Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
    </svg>
  );
}

export function IconTemplateIntegrations({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 159 159"
      className={`${NUDGE.integrations} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="integrations-in">
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z" />
        </clipPath>
        <filter
          id="integrations-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.78" />
        </filter>
        <mask
          id="integrations-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="159"
        >
          <rect x="0" y="0" width="159" height="159" fill="#fff" />
          <path
            d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
        fill="#15171c"
        mask="url(#integrations-out)"
      />
      <g clipPath="url(#integrations-in)" filter="url(#integrations-blur)">
        <path
          d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
      <rect x="27" y="23" width="22" height="87" rx="11" fill="#15171c" />
      <rect x="57" y="44" width="22" height="66" rx="11" fill="#15171c" />
      <rect x="87" y="78" width="22" height="32" rx="11" fill="#15171c" />
    </svg>
  );
}

export function IconTemplateAutomations({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 159 159"
      className={`${NUDGE.automations} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="automations-in">
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z" />
        </clipPath>
        <filter
          id="automations-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.78" />
        </filter>
        <mask
          id="automations-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="159"
        >
          <rect x="0" y="0" width="159" height="159" fill="#fff" />
          <path
            d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
        fill="#15171c"
        mask="url(#automations-out)"
      />
      <g clipPath="url(#automations-in)" filter="url(#automations-blur)">
        <path
          d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 -5.49006e-06 125.598 -4.9831e-06 114L-9.17939e-07 21C-4.10978e-07 9.40209 9.40211 0.000108616 21 -4.98741e-06L114.099 -9.17939e-07C125.697 1.94893e-05 135.099 9.40203 135.099 21L135.099 114Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
      <path
        d="M113.124 93.7099C113.124 99.2327 108.647 103.71 103.124 103.71L100.124 103.71C94.6014 103.71 90.1244 99.2325 90.1244 93.7096L90.1246 90.71C90.1246 90.541 90.1299 90.3729 90.1381 90.206L76.2974 81.9285C74.5562 83.3996 72.3067 84.2884 69.8487 84.2884L66.8491 84.2882C64.2239 84.2882 61.836 83.275 60.0518 81.6204L46.1997 89.618C46.2046 89.7477 46.2091 89.8785 46.2091 90.0094L46.2089 93.0091C46.2088 98.5318 41.7318 103.009 36.209 103.009L33.2093 103.009C27.6865 103.009 23.2095 98.5316 23.2095 93.0088L23.2097 90.0091C23.2097 84.4863 27.6864 80.0085 33.2092 80.0084L36.2088 80.0086C39.0608 80.0086 41.6323 81.2049 43.454 83.1202L56.9062 75.3536C56.8691 75.0035 56.8493 74.6482 56.8492 74.2882L56.849 71.2877C56.8491 66.5739 60.1114 62.6254 64.501 61.5688L64.501 49.061C59.7924 48.2502 56.2094 44.1494 56.2094 39.2092L56.2096 36.2096C56.2096 30.6869 60.6864 26.2091 66.2091 26.2089L69.2095 26.2086C74.7324 26.2086 79.2099 30.6866 79.2099 36.2094L79.2097 39.209C79.2097 43.9433 75.9191 47.9067 71.5008 48.9428L71.5015 61.4264C76.2377 62.2143 79.8484 66.3283 79.8484 71.288L79.8487 74.2885C79.8487 74.8117 79.8085 75.3254 79.731 75.8269L92.9595 83.7373C94.7762 81.8709 97.3138 80.7093 100.124 80.7093L103.124 80.7095C108.647 80.7095 113.124 85.1874 113.124 90.7103L113.124 93.7099Z"
        fill="#15171c"
      />
    </svg>
  );
}

export function IconTemplateTimeTracker({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 159 159"
      className={`${NUDGE.timeTracker} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="time-tracker-in">
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z" />
        </clipPath>
        <filter
          id="time-tracker-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.78" />
        </filter>
        <mask
          id="time-tracker-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="159"
        >
          <rect x="0" y="0" width="159" height="159" fill="#fff" />
          <path
            d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
        fill="#15171c"
        mask="url(#time-tracker-out)"
      />
      <g clipPath="url(#time-tracker-in)" filter="url(#time-tracker-blur)">
        <path
          d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z"
          fill="#15171c"
        />
      </g>
      <path
        d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z"
        fill="#ffffff"
        fillOpacity={0.8}
      />
      <path
        d="M67.6666 23C43.6063 23 24 42.6063 24 66.6666C24 90.7269 43.6063 110.333 67.6666 110.333C91.7269 110.333 111.333 90.7269 111.333 66.6666C111.333 42.6063 91.7269 23 67.6666 23ZM86.6616 82.2556C86.0503 83.3036 84.9586 83.8713 83.8233 83.8713C83.2556 83.8713 82.6879 83.7403 82.1639 83.3909L68.6273 75.3126C65.265 73.304 62.776 68.8936 62.776 65.0073V47.104C62.776 45.3136 64.2606 43.829 66.051 43.829C67.8413 43.829 69.326 45.3136 69.326 47.104V65.0073C69.326 66.5793 70.636 68.8936 71.9896 69.6796L85.5263 77.7579C87.0983 78.6749 87.6223 80.6836 86.6616 82.2556Z"
        fill="#15171c"
      />
    </svg>
  );
}

export function IconTemplateApprovals({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 166 186"
      className={`${NUDGE.approvals} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="approvals-in">
          <path d="M70.0838 42.7135C79.6917 42.7135 89.1557 40.3783 97.6609 35.909L133.734 16.9535C148.397 9.2485 165.997 19.8821 165.997 36.4461V120.532C165.997 137.096 148.397 147.73 133.734 140.025L97.661 121.069C89.1557 116.6 79.6917 114.264 70.0836 114.264H22.0199C9.85865 114.264 0 104.406 0 92.2443V64.7335C0 52.5722 9.85868 42.7135 22.02 42.7135H70.0838Z" />
        </clipPath>
        {/* userSpaceOnUse, unlike every other mark here, and the stroke is
            why. A percentage filter region is measured against the filtered
            content's object bounding box, and SVG computes that box from path
            GEOMETRY with the stroke excluded. Every other blurred layer in
            this file is a filled shape, so its box is the shape and -50%/200%
            is margin to spare. This one is a 35.878-wide stroke on a short
            path: the real mark is ~18 units wider than its box on every side,
            and the blur then wants another 3σ (37) past that, so the region
            cut the frosting off mid-air and left a hard rectangle inside the
            bubble. In user space the region is just the viewBox with 60 units
            of margin, which clears both. */}
        <filter
          id="approvals-blur"
          filterUnits="userSpaceOnUse"
          x="-60"
          y="-60"
          width="286"
          height="306"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="12.28" />
        </filter>
        <mask
          id="approvals-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="166"
          height="186"
        >
          <rect x="0" y="0" width="166" height="186" fill="#fff" />
          <path
            d="M70.0838 42.7135C79.6917 42.7135 89.1557 40.3783 97.6609 35.909L133.734 16.9535C148.397 9.2485 165.997 19.8821 165.997 36.4461V120.532C165.997 137.096 148.397 147.73 133.734 140.025L97.661 121.069C89.1557 116.6 79.6917 114.264 70.0836 114.264H22.0199C9.85865 114.264 0 104.406 0 92.2443V64.7335C0 52.5722 9.85868 42.7135 22.02 42.7135H70.0838Z"
            fill="#000"
          />
        </mask>
      </defs>
      <path
        d="M39.1873 140.707L29.7893 168C35.2865 151.21 46.1863 121.093 50.1545 110.1"
        stroke="#15171c"
        strokeWidth="35.878"
        strokeLinecap="round"
        strokeLinejoin="round"
        mask="url(#approvals-out)"
      />
      <g clipPath="url(#approvals-in)" filter="url(#approvals-blur)">
        <path
          d="M39.1873 140.707L29.7893 168C35.2865 151.21 46.1863 121.093 50.1545 110.1"
          stroke="#15171c"
          strokeWidth="35.878"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M70.0838 42.7135C79.6917 42.7135 89.1557 40.3783 97.6609 35.909L133.734 16.9535C148.397 9.2485 165.997 19.8821 165.997 36.4461V120.532C165.997 137.096 148.397 147.73 133.734 140.025L97.661 121.069C89.1557 116.6 79.6917 114.264 70.0836 114.264H22.0199C9.85865 114.264 0 104.406 0 92.2443V64.7335C0 52.5722 9.85868 42.7135 22.02 42.7135H70.0838Z"
        fill="#ffffff"
        fillOpacity={0.7}
      />
    </svg>
  );
}

export function IconTemplateProposals({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 159 159"
      className={`${NUDGE.proposals} ${className ?? ""}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <clipPath id="proposals-in">
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z" />
        </clipPath>
        <filter
          id="proposals-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="6.78" />
        </filter>
        <mask
          id="proposals-out"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="159"
          height="159"
        >
          <rect x="0" y="0" width="159" height="159" fill="#fff" />
          <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z" fill="#000" />
        </mask>
      </defs>
      <path d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z" fill="#15171c" mask="url(#proposals-out)" />
      <g clipPath="url(#proposals-in)" filter="url(#proposals-blur)">
        <path d="M158.876 137.497C158.876 149.095 149.474 158.497 137.876 158.497L44.876 158.497C33.2781 158.497 23.8762 149.095 23.876 137.497L23.876 44.4971C23.876 32.8991 33.278 23.4971 44.876 23.4971L137.876 23.4971C149.474 23.4971 158.876 32.8991 158.876 44.4971L158.876 137.497Z" fill="#15171c" />
      </g>
      <path d="M135.099 114C135.099 125.598 125.697 135 114.099 135L21 135C9.40212 135 0 125.598 0 114L0 21C0 9.40209 9.40211 0 21 0L114.099 0C125.697 0 135.099 9.40203 135.099 21L135.099 114Z" fill="#ffffff" fillOpacity={0.8} />
      <path d="M75.5977 25.6729L82.6727 40.1927C83.273 41.4152 84.1596 42.4724 85.2563 43.2732C86.353 44.074 87.6267 44.5945 88.9677 44.7897L104.845 47.0882C106.389 47.3139 107.839 47.97 109.032 48.9824C110.224 49.9948 111.111 51.323 111.593 52.8166C112.074 54.3102 112.13 55.9096 111.754 57.4336C111.379 58.9576 110.587 60.3454 109.468 61.4399L97.9924 72.6521C96.9915 73.62 96.2477 74.8251 95.8292 76.157C95.4107 77.489 95.3309 78.9053 95.597 80.2764L98.271 96.1977C98.5282 97.7389 98.3536 99.3217 97.7668 100.769C97.18 102.215 96.2042 103.469 94.9488 104.389C93.6934 105.309 92.2082 105.858 90.6597 105.976C89.1112 106.094 87.5607 105.775 86.1823 105.055L71.9767 97.4311C70.7733 96.7975 69.4353 96.4665 68.0771 96.4665C66.719 96.4665 65.381 96.7975 64.1776 97.4311L49.972 104.943C48.5935 105.663 47.0431 105.982 45.4946 105.864C43.9461 105.746 42.4609 105.197 41.2055 104.277C39.9501 103.357 38.9742 102.103 38.3874 100.656C37.8006 99.2095 37.626 97.6267 37.8833 96.0856L40.5573 80.2764C40.7944 78.9312 40.6999 77.548 40.2823 76.2481C39.8647 74.9482 39.1366 73.7712 38.1619 72.8203L26.686 61.6081C25.5169 60.5212 24.6806 59.121 24.2754 57.5722C23.8702 56.0233 23.9129 54.3902 24.3986 52.8649C24.8843 51.3397 25.7928 49.9857 27.0171 48.9624C28.2414 47.939 29.7307 47.2888 31.3098 47.0882L47.1866 44.7897C48.5276 44.5945 49.8013 44.074 50.898 43.2732C51.9946 42.4724 52.8813 41.4152 53.4816 40.1927L60.5565 25.6729C61.2558 24.2685 62.3296 23.0876 63.6578 22.2623C64.986 21.4371 66.5162 21 68.0771 21C69.6381 21 71.1683 21.4371 72.4964 22.2623C73.8246 23.0876 74.8984 24.2685 75.5977 25.6729Z" fill="#15171c" />
    </svg>
  );
}
