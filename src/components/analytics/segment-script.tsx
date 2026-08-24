import Script from "next/script";
import { onProductionHost } from "./enabled";

const WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

export function SegmentScript() {
  if (!WRITE_KEY) return null;

  return (
    <Script
      id="segment-snippet"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: onProductionHost(`!function(){var i="analytics",analytics=window[i]=window[i]||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/"+key+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3";analytics.load("${WRITE_KEY}");analytics.page()}}();`),
      }}
    />
  );
}
