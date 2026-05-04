// Inbound UTM capture and persistence.
//
// Reads utm_source, utm_medium, utm_campaign, utm_content, utm_term from the
// current URL and stores them in sessionStorage so they survive client-side
// navigation through the funnel. First-touch wins: once a UTM set is stored,
// subsequent landings without UTMs do not overwrite it within the same session.
// A new session (new tab/window or expired session) starts fresh, which is the
// expected behavior for inbound attribution.
//
// UTM values are forwarded to HubSpot on every form submission so paid,
// social, and email campaigns flow through to the CRM.

const STORAGE_KEY = "mbo_utms";
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

function isBrowser() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function captureUtms() {
  if (!isBrowser()) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const incoming = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) incoming[key] = value;
    }

    if (Object.keys(incoming).length === 0) return;

    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
  } catch {
    // sessionStorage can throw in private mode or when disabled. Fail silent.
  }
}

export function getUtms() {
  if (!isBrowser()) return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function clearUtms() {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
