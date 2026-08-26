// The scan-to-/book prefill handoff. The scan's email gate saves a small
// identity object here on a successful submit; /book reads it on mount so a
// visitor who completed the scan does not re-enter the same information.
// sessionStorage only: the data never leaves the browser (the HubSpot pixel
// has no client-side contact-identity API, by design) and dies with the tab.

const SCAN_LEAD_KEY = 'scorecard:lead';

export function saveScanLead(lead) {
  try {
    sessionStorage.setItem(SCAN_LEAD_KEY, JSON.stringify(lead));
  } catch {}
}

// Scan q1 revenue values map 1:1 onto the /book revenue select: the two
// surfaces share the same six bands by design (see Q1_REVENUE_OPTIONS in
// lib/scorecard/questions.js); only the display strings differ.
const SCAN_REVENUE_TO_BOOK = {
  under_1m: 'Under $1M',
  '1m_3m': '$1M–$3M',
  '3m_5m': '$3M–$5M',
  '5m_15m': '$5M–$15M',
  '15m_50m': '$15M–$50M',
  '50m_plus': '$50M+',
};

// The two team-size questions measure different populations: the scan asks
// TOTAL team size (six bands), /book asks the sales and marketing team (four
// bands). The mapping shifts down to estimate the sales-and-marketing slice
// of a total headcount, anchored on scan 26_50 landing on "16–30" (design
// agreed with Bradley 2026-08-25). The select stays editable, so a wrong
// estimate costs the visitor one click.
const SCAN_TEAM_TO_BOOK = {
  just_me: '1–5',
  '2_10': '1–5',
  '11_25': '6–15',
  '26_50': '16–30',
  '51_75': '30+',
  '75_plus': '30+',
};

// Exported for the test that pins every mapped value to a real option in the
// /book selects; not for runtime use outside this module.
export const _SCAN_REVENUE_TO_BOOK = SCAN_REVENUE_TO_BOOK;
export const _SCAN_TEAM_TO_BOOK = SCAN_TEAM_TO_BOOK;

/**
 * Returns the /book form fields recoverable from a completed scan, mapped to
 * the exact /book select strings; {} when no scan is stored or nothing maps.
 * Callers spread the result over form state, so an absent key leaves that
 * field exactly as it was.
 */
export function readScanLeadPrefill() {
  let lead;
  try {
    lead = JSON.parse(sessionStorage.getItem(SCAN_LEAD_KEY));
  } catch {
    return {};
  }
  if (!lead || typeof lead !== 'object') return {};
  const prefill = {};
  if (typeof lead.firstName === 'string' && lead.firstName) prefill.firstName = lead.firstName;
  if (typeof lead.email === 'string' && lead.email) prefill.email = lead.email;
  if (typeof lead.company === 'string' && lead.company) prefill.company = lead.company;
  const revenue = SCAN_REVENUE_TO_BOOK[lead.revenueBand];
  if (revenue) prefill.revenue = revenue;
  const teamSize = SCAN_TEAM_TO_BOOK[lead.teamSize];
  if (teamSize) prefill.teamSize = teamSize;
  return prefill;
}
