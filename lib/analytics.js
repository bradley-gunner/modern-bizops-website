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
//   - generate_lead    (fires on playbook download)
//   - form_submit      (fires on book-call qualifying form, prep form, playbook form)
//   - cta_click        (fires on every primary CTA click; mark only if you
//                       want micro-conversions in Google Ads. Otherwise leave off.)
//   - scorecard_start  (fires on outbound click to app.modernbizops.com)

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

export function trackLeadGenerated(method) {
  trackEvent("generate_lead", {
    method: method,
    currency: "USD",
    value: 1,
  });
}
