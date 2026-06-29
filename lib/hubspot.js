/**
 * Shared HubSpot helpers.
 * The HubSpot Private App token is stored in .env.local as HUBSPOT_API_KEY.
 */

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
export const HUBSPOT_BASE = "https://api.hubapi.com";

// Forms API config for at-source attribution. The non-secure integration
// submit endpoint accepts the visitor's hubspotutk cookie in context, which is
// what lets HubSpot set a real Original Source instead of INTEGRATION. Both
// values come from scripts/setup-hubspot-forms.mjs and live in .env.local.
export const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID;
export const HUBSPOT_LEAD_FORM_GUID = process.env.HUBSPOT_LEAD_FORM_GUID;

// RevOps Coaching pipeline IDs (already configured in HubSpot)
export const REVOPS_PIPELINE_ID = "2172760768";
export const NEW_LEAD_STAGE = "3477396169";
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

// Distinguishes which lead magnet created/last-touched the contact. Both magnets
// create contacts server-side via the API, so HubSpot's native form-conversion
// fields stay blank; we set this explicitly instead. Created on demand by the
// scorecard and playbook routes via ensureCustomContactProperties(), which
// reconciles the option set if the property already exists. NOTE: distinct from
// utm_content, which carries the asset-variant value.
export const LEAD_MAGNET_PROPERTY = {
  name: "lead_magnet",
  label: "Lead Magnet",
  type: "enumeration",
  fieldType: "select",
  groupName: "contactinformation",
  options: [
    { label: "Scorecard", value: "scorecard", displayOrder: 0 },
    { label: "Playbook", value: "playbook", displayOrder: 1 },
  ],
};

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
  await Promise.all(
    properties.map(async (prop) => {
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
        return;
      }

      if (!checkRes.ok) return;

      // Property exists. For enumeration properties, reconcile options:
      // a pre-existing property may have a different option set (e.g. created
      // manually or by an older codepath), which causes form submissions to
      // fail with INVALID_OPTION. Union our options with the existing ones.
      if (prop.type !== "enumeration" || !Array.isArray(prop.options)) return;

      const existing = await checkRes.json();
      const existingValues = new Set(
        (existing.options || []).map((o) => o.value)
      );
      const missing = prop.options.filter((o) => !existingValues.has(o.value));
      if (missing.length === 0) return;

      const mergedOptions = [
        ...(existing.options || []),
        ...missing.map((o, i) => ({
          ...o,
          displayOrder: (existing.options?.length || 0) + i,
        })),
      ];

      const patchRes = await fetch(
        `${HUBSPOT_BASE}/crm/v3/properties/contacts/${prop.name}`,
        {
          method: "PATCH",
          headers: hsHeaders(),
          body: JSON.stringify({ options: mergedOptions }),
        }
      );
      if (!patchRes.ok) {
        const err = await patchRes.text();
        console.error(
          `Failed to merge options on property ${prop.name}:`,
          err
        );
      } else {
        console.log(
          `Merged ${missing.length} option(s) into HubSpot property: ${prop.name}`
        );
      }
    })
  );
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
 * Look up whether a contact already has a deal in the RevOps Coaching pipeline.
 * Returns the existing deal id (string) or null.
 */
export async function findExistingRevopsDealForContact(contactId) {
  const assocRes = await fetch(
    `${HUBSPOT_BASE}/crm/v4/objects/contacts/${contactId}/associations/deals`,
    { method: "GET", headers: hsHeaders() }
  );
  if (!assocRes.ok) return null;
  const assoc = await assocRes.json();
  const dealIds = (assoc.results || []).map((r) => String(r.toObjectId));
  if (!dealIds.length) return null;

  const batchRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/deals/batch/read`, {
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties: ["pipeline", "dealstage"],
      inputs: dealIds.map((id) => ({ id })),
    }),
  });
  if (!batchRes.ok) return null;
  const batch = await batchRes.json();
  const match = (batch.results || []).find(
    (d) => d.properties?.pipeline === REVOPS_PIPELINE_ID
  );
  return match ? match.id : null;
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

/**
 * Submit a lead to the shared HubSpot form via the non-secure Forms
 * integration endpoint. The hubspotutk cookie passed in context.hutk attaches
 * the visitor's session so HubSpot attributes Original Source on contact
 * create. `properties` is a flat object; empty/non-string values are dropped.
 * Returns { ok } so callers can decide whether to continue.
 */
export async function submitHubSpotForm({ properties, context }) {
  if (!HUBSPOT_PORTAL_ID || !HUBSPOT_LEAD_FORM_GUID) {
    throw new Error(
      "HUBSPOT_PORTAL_ID and HUBSPOT_LEAD_FORM_GUID must be set (run scripts/setup-hubspot-forms.mjs)"
    );
  }

  const fields = Object.entries(properties || {})
    .filter(([, v]) => typeof v === "string" && v.trim() !== "")
    .map(([name, value]) => ({ name, value }));

  const ctx = {};
  if (context?.hutk) ctx.hutk = context.hutk;
  if (context?.pageUri) ctx.pageUri = context.pageUri;
  if (context?.pageName) ctx.pageName = context.pageName;

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_LEAD_FORM_GUID}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields, context: ctx }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[submitHubSpotForm] submission failed:", err);
    return { ok: false, error: err };
  }
  return { ok: true };
}

/**
 * Write utm_content onto a contact only if it is currently empty (write-if-empty).
 *
 * The booking path (HubSpot Meetings on /watch and /book) creates the contact
 * with native source/medium/campaign attribution but never captures
 * content-level (asset-variant) attribution. This back-fills utm_content from
 * the landing URL so a booked call can be tied to the exact tagged effort that
 * produced it. First-touch wins: a contact that already carries a utm_content
 * from an earlier touch is never overwritten. A PATCH does not re-stamp Original
 * Source, so existing attribution survives. Returns true if a value was written.
 */
export async function writeUtmContentIfEmpty(contactId, utmContent) {
  if (!contactId) return false;
  const value =
    typeof utmContent === "string" ? utmContent.trim().slice(0, 255) : "";
  if (!value) return false; // untagged visitor: never write an empty/literal value

  const getRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}?properties=utm_content`,
    { headers: hsHeaders() }
  );
  if (!getRes.ok) {
    console.error("[writeUtmContentIfEmpty] read failed:", await getRes.text());
    return false;
  }
  const existing = (await getRes.json())?.properties?.utm_content;
  if (typeof existing === "string" && existing.trim() !== "") return false;

  const patchRes = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({ properties: { utm_content: value } }),
    }
  );
  if (!patchRes.ok) {
    console.error("[writeUtmContentIfEmpty] write failed:", await patchRes.text());
    return false;
  }
  return true;
}

/**
 * Mark a contact as a new lead awaiting manual qualification: lifecycle stage
 * Lead, hs_lead_status NEW. A PATCH does not re-stamp Original Source, so any
 * attribution set on create survives. Non-fatal: returns false on failure.
 */
export async function markContactForReview(contactId) {
  if (!contactId) return false;
  const res = await fetch(
    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${contactId}`,
    {
      method: "PATCH",
      headers: hsHeaders(),
      body: JSON.stringify({
        properties: { lifecyclestage: "lead", hs_lead_status: "NEW" },
      }),
    }
  );
  if (!res.ok) {
    console.error("[markContactForReview] failed:", await res.text());
    return false;
  }
  return true;
}
