/**
 * One-time (idempotent) setup for the scorecard result contact properties.
 *
 * On scorecard submit, the app additively persists the already-computed result
 * onto the contact (see app/api/scorecard/submit/route.js and
 * lib/scorecard/hubspotResultProperties.js). This script creates the "scorecard"
 * contact property group and the nine result properties that hold those values.
 *
 * The submit route also self-heals these on a cold start via
 * ensureScorecardResultProperties(), so running this script is not strictly
 * required, but it is the explicit, verifiable path to create them up front.
 *
 * The single source of truth for the group + property definitions is
 * lib/hubspot.js; this script imports them so the two never drift.
 *
 * Run (loads the private-app token from .env.local without printing it):
 *   node --env-file=.env.local scripts/setup-hubspot-scorecard-properties.mjs
 *
 * The private app needs the `crm.schemas.contacts.write` scope. If any create
 * returns 403, add that scope to the private app in HubSpot and re-run.
 */

import {
  SCORECARD_PROPERTY_GROUP,
  SCORECARD_RESULT_PROPERTIES,
} from '../lib/hubspot.js';

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const BASE = 'https://api.hubapi.com';

if (!HUBSPOT_API_KEY) {
  console.error(
    'HUBSPOT_API_KEY is not set. Run with:\n  node --env-file=.env.local scripts/setup-hubspot-scorecard-properties.mjs'
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${HUBSPOT_API_KEY}`,
  'Content-Type': 'application/json',
};

let sawForbidden = false;

async function ensureGroup(group) {
  const check = await fetch(
    `${BASE}/crm/v3/properties/contacts/groups/${group.name}`,
    { headers }
  );
  if (check.ok) {
    console.log(`• group "${group.name}" already exists`);
    return;
  }
  const res = await fetch(`${BASE}/crm/v3/properties/contacts/groups`, {
    method: 'POST',
    headers,
    body: JSON.stringify(group),
  });
  if (res.ok) {
    console.log(`✓ created group "${group.name}"`);
    return;
  }
  if (res.status === 409) {
    console.log(`• group "${group.name}" already exists (409)`);
    return;
  }
  if (res.status === 403) sawForbidden = true;
  console.error(`✗ group "${group.name}" failed [${res.status}]: ${await res.text()}`);
}

async function ensureProperty(prop) {
  const check = await fetch(
    `${BASE}/crm/v3/properties/contacts/${prop.name}`,
    { headers }
  );
  if (check.ok) {
    console.log(`• property "${prop.name}" already exists`);
    return;
  }
  const res = await fetch(`${BASE}/crm/v3/properties/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(prop),
  });
  if (res.ok) {
    console.log(`✓ created property "${prop.name}" (${prop.type}/${prop.fieldType})`);
    return;
  }
  if (res.status === 403) sawForbidden = true;
  console.error(`✗ property "${prop.name}" failed [${res.status}]: ${await res.text()}`);
}

console.log('Ensuring scorecard property group...');
await ensureGroup(SCORECARD_PROPERTY_GROUP);

console.log('\nEnsuring scorecard result properties...');
for (const prop of SCORECARD_RESULT_PROPERTIES) {
  await ensureProperty(prop);
}

if (sawForbidden) {
  console.error(
    '\n403 Forbidden encountered. Add the `crm.schemas.contacts.write` scope to the ' +
      'private app in HubSpot (Settings > Integrations > Private Apps > Scopes), ' +
      'then re-run this script.'
  );
  process.exit(1);
}

console.log('\nDone. Internal names:');
for (const prop of SCORECARD_RESULT_PROPERTIES) {
  console.log(`  ${prop.name}`);
}
