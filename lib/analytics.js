import { getUtms } from "@/lib/utm";

// Pulled from NEXT_PUBLIC_GA_MEASUREMENT_ID so we can point to a different
// property per environment without a code change. Fall back to the production
// ID so local dev without an env var still works.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Z6WJF5K49D";

// Microsoft Clarity project ID, used for session recordings and heatmaps in
// CRO experiments. Overridable per environment via NEXT_PUBLIC_CLARITY_ID, with
// the production project as the fallback so local dev still works.
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_ID || "xd6zut7496";

// HubSpot portal ID, used by the tracking code in app/layout.js. Overridable
// per environment via NEXT_PUBLIC_HUBSPOT_PORTAL_ID, with the production portal
// as the fallback so local dev still works. The na2 in the script host is the
// portal's data region and is part of the address, not a version.
export const HUBSPOT_PORTAL_ID =
  process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "244508932";

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
//   - generate_lead    (fires on scorecard completion)
//   - form_submit      (fires on book-call qualifying form and prep form)
//   - cta_click        (fires on every primary CTA click; mark only if you
//                       want micro-conversions in Google Ads. Otherwise leave off.)
//   - scorecard_start  (fires when a visitor starts the scorecard flow)
//
// VIDEO_START (shipped 2026-08-19, and deliberately needs NO admin step).
//
// components/VSSLPlayer.jsx fires `video_start` when a visitor clicks the VSL
// poster. Before this, nothing in the codebase recorded that the VSL had been
// played at all: the facade's onClick only flipped React state, so GA4 saw no
// play, no progress and no completion on either surface carrying it.
//
// It reuses the ALREADY-REGISTERED `cta_location` parameter instead of adding a
// `video_location`, so the homepage-vs-/watch split is queryable through the
// Data API on day one. An unregistered parameter appears in DebugView and comes
// back empty from a Data API report, which is what the dashboard and the weekly
// brief both read. Event NAMES need no registration, so the event count works
// immediately. Values follow the site-wide <cluster>_<position> shape:
// `home_mid_page` and `watch_hero`.
//
// It measures INTENT TO WATCH, not watch time. Once the iframe mounts the
// session belongs to YouTube. Retention and drop-off for this video live in
// YouTube Studio; do not try to reconstruct them here without the IFrame Player
// API. Leave it OFF the key-events list above: it is a micro-conversion, and
// marking it would inflate the count the Google Ads link optimizes against.
//
// LEAD MAGNET DIMENSION (manual one-time admin step, not code).
//
// generate_lead and scorecard_start carry a `lead_magnet` parameter so flows can
// be told apart in reporting. `playbook` was the only other value and stopped
// being emitted when /playbook was retired on 2026-08-18; historical GA4 rows
// still carry it. To surface it, register a GA4 custom dimension:
//   GA4 admin > Custom definitions > Create custom dimension.
//   Name "Lead Magnet", scope Event, event parameter lead_magnet.
// It does not backfill, so create it as soon as this code is live.
//
// AT-SOURCE ATTRIBUTION (code, shipped with the qualification-gate change).
//
// Scorecard leads are submitted through a HubSpot form via
// lib/hubspot.submitHubSpotForm with the visitor's hubspotutk cookie attached,
// so HubSpot sets a real Original Source instead of INTEGRATION. If Original
// Source is blank on Starter, the utm_* contact properties still carry
// attribution. Lead capture no longer creates deals; deals are created
// manually after qualification.
//
// THAT PARAGRAPH DESCRIBED SOMETHING THAT WAS NOT HAPPENING, until the HubSpot
// tracking code was added to app/layout.js on 2026-08-01. `hubspotutk` is set by
// that script and by nothing else, so with no script on the site,
// getHubspotutk() returned nothing and every lead-magnet submission
// went up with an empty context.hutk. Original Source almost certainly read
// INTEGRATION the whole time. It went unnoticed because there have been no real
// funnel-sourced contacts to inspect. Confirm on the first real submission from
// 2026-08-01 onward: open the contact and check Original Source is not
// INTEGRATION. Tracked on the board as `hubspot-hutk-attribution`.

// Microsoft Clarity behavioral mirror.
//
// Every GA4 event below is also mirrored into Clarity so session recordings and
// heatmaps are filterable by the same dimensions the rest of the stack reasons
// about (lead magnet, revenue band, traffic source, conversion events). Clarity
// queues calls made before its tag finishes loading, so firing early is safe.
// All helpers no-op when window.clarity is absent: during SSR and in dev or
// preview, since Clarity is production-only.
function clarity(...args) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity(...args);
  }
}

// Param keys promoted to Clarity custom tags (filterable session dimensions).
// Kept to a small, high-signal allowlist so the Clarity filter UI stays usable.
const CLARITY_TAG_KEYS = ["lead_magnet", "revenue", "team_size", "form_name"];

function setClarityTags(params = {}) {
  for (const key of CLARITY_TAG_KEYS) {
    const value = params[key];
    if (value !== undefined && value !== null && value !== "") {
      clarity("set", key, String(value));
    }
  }
}

// Promote captured first-touch UTMs to Clarity tags so recordings are filterable
// by traffic source and campaign. Call once after UTM capture on app mount.
export function setClarityTrafficTags() {
  const utms = getUtms();
  for (const [key, value] of Object.entries(utms)) {
    if (value) clarity("set", key, String(value));
  }
}

// Ties a Clarity session to a known lead so you can pull up the actual journey
// of a contact who later qualified. The email is normalized and SHA-256 hashed
// in the browser before it reaches Clarity, so no raw PII leaves the page;
// compute the same hash from a HubSpot contact's email to find their session.
// Call only at voluntary form submission (the first-party consent signal),
// never for anonymous browsing.
export async function identifyLead(email) {
  if (!email || typeof window === "undefined") return;
  if (typeof window.clarity !== "function" || !window.crypto?.subtle) return;
  try {
    const normalized = String(email).trim().toLowerCase();
    const bytes = new TextEncoder().encode(normalized);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    const hash = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    window.clarity("identify", hash);
  } catch {
    // Hashing needs a secure context; fail silent if unavailable.
  }
}

export function trackEvent(eventName, params) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
  // Mirror into Clarity: the event name becomes a filterable custom event and
  // any allowlisted params become session tags.
  clarity("event", eventName);
  setClarityTags(params);
}

// `extra` carries optional context params, e.g. cta_location to distinguish
// where on the page the CTA lives (page path is already on every GA4 event).
export function trackCTAClick(destination, label, extra = {}) {
  trackEvent("cta_click", {
    cta_destination: destination,
    cta_label: label,
    ...extra,
  });
}

export function trackFormSubmit(formName, formData) {
  trackEvent("form_submit", {
    form_name: formName,
    ...formData,
  });
}

// `leadMagnet` distinguishes the source asset. Only "scorecard" is emitted since
// /playbook was retired on 2026-08-18. It is
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
// magnet (scorecard_start) and carries the lead_magnet parameter so flows can be
// compared in GA4.
export function trackMagnetStart(leadMagnet, params = {}) {
  trackEvent(`${leadMagnet}_start`, {
    lead_magnet: leadMagnet,
    ...params,
  });
}
