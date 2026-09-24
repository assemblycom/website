import type { LegalDocument } from "@/components/legal/legal-document";

// The opt-out page Section 11 of the Privacy Policy points to. Legal copy like
// the other legal documents: edit the wording only when Legal changes it, and
// bump `lastUpdated` when they do. The control itself is
// `components/legal/ad-opt-out.tsx`.
export const DO_NOT_SELL: LegalDocument = {
  title: "Do Not Sell or Share My Personal Information",
  lastUpdated: "09/24/2026",
  intro: [
    { type: "p", text: "California law gives you the right to opt out of the “sale” or “sharing” of your personal information. This includes sharing identifiers (such as hashed email addresses), cookie data and usage data with advertising partners for cross-context behavioral advertising. Section 11 of our [Privacy Policy](/legal/privacy-policy) describes what we share and with whom." },
    { type: "p", text: "Opting out below stops this website from loading our advertising tags from Google, Meta and LinkedIn, including those that share hashed contact information, in this browser. Your choice is saved in a cookie, so it applies only to this browser on this device, and clearing your cookies removes it." },
    { type: "p", text: "If your browser sends a Global Privacy Control (GPC) signal, we treat it as a valid opt-out request for that browser, and you do not need to do anything here." },
    { type: "p", text: "You can also make this request by emailing support@assembly.com." },
  ],
  parts: [],
};
