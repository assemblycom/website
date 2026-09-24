import Script from "next/script";
import { whenAdTrackingAllowed } from "./enabled";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GtmScript() {
  if (!GTM_ID) return null;

  return (
    <Script
      id="gtm-head"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: whenAdTrackingAllowed(`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`),
      }}
    />
  );
}

// No <noscript> iframe. It loads GTM for browsers with JavaScript off, where
// nothing can read a Global Privacy Control signal or the opt-out cookie, so it
// would fire ad tags for exactly the visitors who asked not to be tracked.
