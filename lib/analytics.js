// Pulled from NEXT_PUBLIC_GA_MEASUREMENT_ID so we can point to a different
// property per environment without a code change. Fall back to the production
// ID so local dev without an env var still works.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Z6WJF5K49D";

// GA4 CONVERSION SETUP (manual one-time admin step, not code).
//
// The events below fire from this file but only count toward goals/ads
// optimization once they are marked as Key Events (formerly "conversions") in
// the GA4 admin UI. Steps:
//
//   1. GA4 admin > Data display > Events.
//   2. After each event has fired at least once it appears in the list.
//   3. Toggle "Mark as key event" on each of the events listed below.
//   4. (Optional) In Google Ads link, import the key events as conversions.
//
// Events to mark as key events:
//   - generate_lead    (fires on scorecard completion and playbook download)
//   - form_submit      (fires on book-call qualifying form, prep form, playbook form)
//   - cta_click        (fires on every primary CTA click; mark only if you
//                       want micro-conversions in Google Ads. Otherwise leave off.)
//   - scorecard_start  (fires when a visitor starts the scorecard flow)
//   - playbook_start   (fires when a visitor starts the playbook flow)
//
// LEAD MAGNET DIMENSION (manual one-time admin step, not code).
//
// generate_lead, scorecard_start, and playbook_start all carry a `lead_magnet`
// parameter set to "scorecard" or "playbook" so we can tell the two flows apart
// in reporting. To surface it, register a GA4 custom dimension:
//   GA4 admin > Custom definitions > Create custom dimension.
//   Name "Lead Magnet", scope Event, event parameter lead_magnet.
// It does not backfill, so create it as soon as this code is live.
//
// AT-SOURCE ATTRIBUTION (code, shipped with the qualification-gate change).
//
// Scorecard and playbook leads are submitted through a HubSpot form via
// lib/hubspot.submitHubSpotForm with the visitor's hubspotutk cookie attached,
// so HubSpot sets a real Original Source instead of INTEGRATION. If Original
// Source is blank on Starter, the utm_* contact properties still carry
// attribution. Lead capture no longer creates deals; deals are created
// manually after qualification.

export function trackEvent(eventName, params) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export function trackCTAClick(destination, label) {
  trackEvent("cta_click", {
    cta_destination: destination,
    cta_label: label,
  });
}

export function trackFormSubmit(formName, formData) {
  trackEvent("form_submit", {
    form_name: formName,
    ...formData,
  });
}

// `leadMagnet` distinguishes the source asset: "scorecard" or "playbook". It is
// kept on both `method` (back-compat) and `lead_magnet` (the GA4 custom
// dimension parameter).
export function trackLeadGenerated(leadMagnet) {
  trackEvent("generate_lead", {
    method: leadMagnet,
    lead_magnet: leadMagnet,
    currency: "USD",
    value: 1,
  });
}

// Fires when a visitor begins a lead-magnet flow. The event name mirrors the
// magnet (scorecard_start / playbook_start) and both carry the lead_magnet
// parameter so the two flows can be compared in GA4.
export function trackMagnetStart(leadMagnet, params = {}) {
  trackEvent(`${leadMagnet}_start`, {
    lead_magnet: leadMagnet,
    ...params,
  });
}
