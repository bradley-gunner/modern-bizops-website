/**
 * One-time setup: create the shared non-marketing HubSpot form used by the
 * scorecard and playbook lead-capture routes, and print the values to paste
 * into .env.local.
 *
 * Why: routing lead capture through a HubSpot form (with the visitor's
 * hubspotutk cookie) is what makes HubSpot set a real Original Source instead
 * of stamping leads INTEGRATION. The form must contain every field we submit,
 * or HubSpot rejects the submission.
 *
 * Run:  HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs
 *
 * Output: the form GUID and portal ID. Add to .env.local (and Vercel env):
 *   HUBSPOT_PORTAL_ID=...
 *   HUBSPOT_LEAD_FORM_GUID=...
 *
 * Idempotent: if a form named FORM_NAME already exists, its GUID is printed
 * instead of creating a duplicate.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const BASE = "https://api.hubapi.com";
const FORM_NAME = "Lead Capture (Scorecard + Playbook)";

if (!HUBSPOT_API_KEY) {
  console.error("HUBSPOT_API_KEY is not set. Run with HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs");
  process.exit(1);
}

function headers() {
  return {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

// Fields the lead-capture routes submit. Names map to existing contact
// properties (utm_* and lead_magnet are created by the app's
// ensureCustomContactProperties; email/firstname/lastname/company are
// HubSpot defaults).
const FIELD_NAMES = [
  "email",
  "firstname",
  "lastname",
  "company",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "lead_magnet",
];

function fieldObject(name) {
  return {
    objectTypeId: "0-1", // contact
    name,
    required: name === "email",
    hidden: !["email", "firstname", "company"].includes(name),
  };
}

async function getPortalId() {
  const res = await fetch(`${BASE}/account-info/v3/details`, { headers: headers() });
  if (!res.ok) {
    console.error("Failed to read account info:", await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return data.portalId;
}

async function findExistingForm() {
  // limit=200 is a single page; this portal is very unlikely to hold 200+
  // forms, so we do not paginate. If it ever does, this could miss the form
  // and create a duplicate.
  const res = await fetch(`${BASE}/marketing/v3/forms/?limit=200`, { headers: headers() });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.results || []).find((f) => f.name === FORM_NAME) || null;
}

async function createForm() {
  const body = {
    name: FORM_NAME,
    formType: "non_marketable",
    fieldGroups: [
      {
        groupType: "default_group",
        richTextType: "text",
        fields: FIELD_NAMES.map(fieldObject),
      },
    ],
    configuration: {
      language: "en",
      createNewContactForNewEmail: true,
      postSubmitAction: { type: "thank_you", value: "Thanks!" },
    },
    displayOptions: { renderRawHtml: false },
    legalConsentOptions: { type: "none" },
  };

  const res = await fetch(`${BASE}/marketing/v3/forms/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error("Failed to create form:", await res.text());
    process.exit(1);
  }
  return res.json();
}

async function main() {
  const portalId = await getPortalId();

  let form = await findExistingForm();
  if (form) {
    console.log(`Form "${FORM_NAME}" already exists.`);
  } else {
    form = await createForm();
    console.log(`Created form "${FORM_NAME}".`);
  }

  console.log("\nAdd these to .env.local (and your Vercel project env):\n");
  console.log(`HUBSPOT_PORTAL_ID=${portalId}`);
  console.log(`HUBSPOT_LEAD_FORM_GUID=${form.id || form.guid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
