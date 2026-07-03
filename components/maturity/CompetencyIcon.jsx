// A small category icon for a competency, inferred from the tools it reads.
// Keeps the grids scannable without adding a field to all 44 data objects.
// Inline SVG (self-contained, CSP-safe). Lucide-style 24x24 stroke paths.

const CATEGORIES = [
  { key: "product", tools: ["Amplitude", "Mixpanel", "PostHog"] },
  { key: "finance", tools: ["QuickBooks", "Xero", "Stripe", "Chargebee", "Recurly"] },
  { key: "support", tools: ["HubSpot Service", "Zendesk", "Intercom"] },
  { key: "marketing", tools: ["HubSpot Marketing", "Marketo", "Mailchimp", "Customer.io"] },
  { key: "bi", tools: ["Looker", "Power BI", "Google Analytics", "Optimizely", "VWO", "your CRM dashboards"] },
  { key: "crm", tools: ["HubSpot", "Salesforce", "Pipedrive", "Close"] },
];

function categoryFor(tools = []) {
  for (const cat of CATEGORIES) {
    if (tools.some((t) => cat.tools.includes(t))) return cat.key;
  }
  return "default";
}

const PATHS = {
  crm: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  marketing: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h2l4 4V6L6 10H4a1 1 0 0 0-1 1Z" />
      <path d="M15 8a5 5 0 0 1 0 8" />
    </>
  ),
  finance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2.5-5 1.5-5 4a2.5 2 0 0 0 5 0" />
    </>
  ),
  support: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4" height="6" rx="1" />
      <rect x="17" y="13" width="4" height="6" rx="1" />
    </>
  ),
  product: (
    <>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12" y="8" width="3" height="10" />
      <rect x="17" y="5" width="3" height="13" />
    </>
  ),
  bi: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </>
  ),
  default: (
    <>
      <path d="M12 14a4 4 0 1 0-4-4" />
      <path d="M12 14v4M20 20a8 8 0 1 0-16 0" />
    </>
  ),
};

export default function CompetencyIcon({ competency, className = "" }) {
  const cat = categoryFor(competency?.data?.tools);
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[cat]}
    </svg>
  );
}
