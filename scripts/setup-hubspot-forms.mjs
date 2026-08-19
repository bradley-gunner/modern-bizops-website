/**
 * One-time setup helper for the shared HubSpot lead-capture form.
 *
 * Routing lead capture through a HubSpot form (with the
 * visitor's hubspotutk cookie) is what makes HubSpot set a real Original Source
 * instead of stamping leads INTEGRATION. The form must contain EVERY field we
 * submit, because HubSpot's submission endpoint rejects fields that are not on
 * the form (validation change, March 2022). For that reason the form is built
 * once by hand in the HubSpot UI (the v3 create-form API schema is fiddly and
 * its reference is auth-gated), and this script only READS it back.
 *
 * Build the form once in the HubSpot UI (Marketing > Forms > Create form),
 * name it exactly:
 *   "Lead Capture (Scorecard + Playbook)"
 * and add these fields (all are existing contact properties; mark only email
 * required):
 *   email (required), firstname, lastname, company,
 *   utm_source, utm_medium, utm_campaign, utm_content, utm_term, lead_magnet
 *
 * Then run this script. It looks the form up by name and prints the values to
 * paste into .env.local (and your Vercel project env):
 *   HUBSPOT_PORTAL_ID=...
 *   HUBSPOT_LEAD_FORM_GUID=...
 *
 * Run:  HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs
 *
 * The private app needs the `forms` and `crm.objects.contacts` scopes.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const BASE = "https://api.hubapi.com";
// DO NOT RENAME THIS FORM IN HUBSPOT. The lookup below matches on the exact
// name string, and one shared form backs every lead path on the site. The
// name still says "Playbook" because /playbook was retired on 2026-08-18
// without touching HubSpot: the form was never playbook-specific, so there
// was nothing to archive. Renaming it for tidiness breaks this script and,
// with it, the Scan's attribution.
const FORM_NAME = "Lead Capture (Scorecard + Playbook)";

// The fields the form must contain (mirrors what the lead-capture routes
// submit). Printed in the "not found" guidance so the form is built correctly.
const REQUIRED_FIELDS = [
  "email (required)",
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

if (!HUBSPOT_API_KEY) {
  console.error(
    "HUBSPOT_API_KEY is not set. Run with HUBSPOT_API_KEY=... node scripts/setup-hubspot-forms.mjs"
  );
  process.exit(1);
}

function headers() {
  return {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function getPortalId() {
  const res = await fetch(`${BASE}/account-info/v3/details`, {
    headers: headers(),
  });
  if (!res.ok) {
    console.error("Failed to read account info:", await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return data.portalId;
}

async function findFormByName() {
  // limit=200 is a single page; this portal is very unlikely to hold 200+
  // forms, so we do not paginate.
  const res = await fetch(`${BASE}/marketing/v3/forms/?limit=200`, {
    headers: headers(),
  });
  if (!res.ok) {
    console.error("Failed to list forms:", await res.text());
    process.exit(1);
  }
  const data = await res.json();
  return (data.results || []).find((f) => f.name === FORM_NAME) || null;
}

async function main() {
  const portalId = await getPortalId();
  const form = await findFormByName();

  if (!form) {
    console.log(`No form named "${FORM_NAME}" found in portal ${portalId}.`);
    console.log(
      "\nCreate it once in the HubSpot UI (Marketing > Forms > Create form),"
    );
    console.log(
      "name it exactly as above, and add these fields (all existing contact"
    );
    console.log("properties; mark only email required):\n");
    for (const f of REQUIRED_FIELDS) console.log(`  - ${f}`);
    console.log("\nThen re-run this script to print the env values.");
    process.exit(1);
  }

  console.log(`Found form "${FORM_NAME}".`);
  console.log("\nAdd these to .env.local (and your Vercel project env):\n");
  console.log(`HUBSPOT_PORTAL_ID=${portalId}`);
  console.log(`HUBSPOT_LEAD_FORM_GUID=${form.id || form.guid}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
