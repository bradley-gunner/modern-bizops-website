/**
 * Shared HubSpot helpers.
 * The HubSpot Private App token is stored in .env.local as HUBSPOT_API_KEY.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
export const HUBSPOT_BASE = "https://api.hubapi.com";

// RevOps Coaching pipeline IDs (already configured in HubSpot)
export const REVOPS_PIPELINE_ID = "2172760768";
export const DISCOVERY_CALL_BOOKED_STAGE = "3477396170";

// Bradley's HubSpot owner ID (for task assignment)
export const BRADLEY_OWNER_ID = "85826069";

// Custom contact properties for inbound UTM attribution. Created on demand by
// any form route via ensureCustomContactProperties().
export const UTM_CUSTOM_PROPERTIES = [
  {
    name: "utm_source",
    label: "UTM Source",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_medium",
    label: "UTM Medium",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_campaign",
    label: "UTM Campaign",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_content",
    label: "UTM Content",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
  {
    name: "utm_term",
    label: "UTM Term",
    type: "string",
    fieldType: "text",
    groupName: "contactinformation",
  },
];

// Pulls valid utm_* values from a request payload's `utms` field. Returns an
// object suitable for spreading into HubSpot contact properties. Empty/missing
// values are excluded so we never blank out an earlier first-touch attribution.
export function pickUtmProperties(utms) {
  if (!utms || typeof utms !== "object") return {};
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const out = {};
  for (const key of allowed) {
    const value = utms[key];
    if (typeof value === "string" && value.trim() !== "") {
      out[key] = value.trim().slice(0, 255);
    }
  }
  return out;
}

export function hsHeaders() {
  return {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export function assertHubSpotConfigured() {
  if (!HUBSPOT_API_KEY) {
    throw new Error("HUBSPOT_API_KEY environment variable is not set");
  }
}

/**
 * Ensures the given set of custom properties exists on the contacts object.
 * Checks each, creates any that are missing. Idempotent and safe to call on every request;
 * caller passes a module-level flag to avoid re-running within the same cold start.
 */
export async function ensureCustomContactProperties(properties) {
  for (const prop of properties) {
    const checkRes = await fetch(
      `${HUBSPOT_BASE}/crm/v3/properties/contacts/${prop.name}`,
      { headers: hsHeaders() }
    );

    if (checkRes.status === 404) {
      const createRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/properties/contacts`,
        {
          method: "POST",
          headers: hsHeaders(),
          body: JSON.stringify(prop),
        }
      );
      if (!createRes.ok) {
        const err = await createRes.text();
        console.error(`Failed to create property ${prop.name}:`, err);
      } else {
        console.log(`Created HubSpot contact property: ${prop.name}`);
      }
    }
  }
}

/**
 * Search for an existing contact by email, return their contact ID if found.
 */
export async function findContactByEmail(email) {
  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      filterGroups: [
        { filters: [{ propertyName: "email", operator: "EQ", value: email }] },
      ],
      limit: 1,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.total > 0 ? data.results[0].id : null;
}

/**
 * Upsert a contact by email. Updates if found, creates otherwise.
 * Returns { id, action: "created" | "updated" }.
 */
export async function upsertContactByEmail(email, properties) {
  if (!email) throw new Error("upsertContactByEmail requires an email");

  const existingId = await findContactByEmail(email);
  const body = JSON.stringify({ properties: { email, ...properties } });

  if (existingId) {
    const res = await fetch(
      `${HUBSPOT_BASE}/crm/v3/objects/contacts/${existingId}`,
      { method: "PATCH", headers: hsHeaders(), body }
    );
    if (!res.ok) {
      throw new Error(`Failed to update contact: ${await res.text()}`);
    }
    return { id: existingId, action: "updated" };
  }

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: hsHeaders(),
    body,
  });
  if (!res.ok) {
    throw new Error(`Failed to create contact: ${await res.text()}`);
  }
  const created = await res.json();
  return { id: created.id, action: "created" };
}

/**
 * Create a HubSpot task associated with a contact, assigned to an owner.
 * Tasks generate native HubSpot email + in-app notifications to the assignee —
 * this is our Starter-tier alternative to workflow-based notifications.
 */
export async function createContactTask({
  contactId,
  subject,
  body,
  ownerId = BRADLEY_OWNER_ID,
  priority = "HIGH",
  dueInHours = 0,
}) {
  const timestamp = Date.now() + dueInHours * 60 * 60 * 1000;

  const res = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/tasks`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties: {
        hs_task_subject: subject,
        hs_task_body: body,
        hs_task_status: "NOT_STARTED",
        hs_task_priority: priority,
        hs_task_type: "TODO",
        hs_timestamp: String(timestamp),
        hubspot_owner_id: ownerId,
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 204, // task-to-contact
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Failed to create task:", err);
    return null;
  }
  return (await res.json()).id;
}
