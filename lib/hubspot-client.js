// Client-only helper. Reads the HubSpot tracking cookie (hubspotutk) that the
// HubSpot tracking script sets in the browser. We forward this to our form
// routes so the server-side Forms API submission can attach the visitor's
// session for at-source attribution. Returns "" when unavailable (SSR, cookie
// blocked, or not yet set).
export function getHubspotutk() {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
